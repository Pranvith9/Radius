import assert from 'assert';
import app from '../src/server.js';
import prisma from '../src/db.js';

const PORT = 5001;
const BASE_URL = `http://localhost:${PORT}/api`;

async function runTests() {
  console.log('--- STARTING VERIFICATION TESTS ---');
  
  // Clear the database first
  await prisma.report.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();
  await prisma.post.deleteMany();
  await prisma.match.deleteMany();
  await prisma.connectionRequest.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  
  // Start server on test port
  const server = app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
  });

  try {
    // 1. Google OAuth Stubs
    console.log('\n1. Verifying Authentication & User Signup...');
    const signupRes1 = await fetch(`${BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'alice@example.com',
        name: 'Alice Smith',
        dob: '1995-01-01',
        photoUrl: 'https://example.com/alice.jpg'
      })
    });
    const authAlice = await signupRes1.json();
    assert.ok(authAlice.accessToken, 'Alice signup should return accessToken');
    const tokenAlice = authAlice.accessToken;

    const signupRes2 = await fetch(`${BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'bob@example.com',
        name: 'Bob Jones',
        dob: '1994-06-15',
        photoUrl: 'https://example.com/bob.jpg'
      })
    });
    const authBob = await signupRes2.json();
    assert.ok(authBob.accessToken, 'Bob signup should return accessToken');
    const tokenBob = authBob.accessToken;

    console.log('✔ Auth verified');

    // 2. Photo Verification
    console.log('\n2. Verifying Photo Verification & Visibility Toggle...');
    const verifyRes = await fetch(`${BASE_URL}/user/verify-photo`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${tokenAlice}` }
    });
    const verifyAlice = await verifyRes.json();
    assert.strictEqual(verifyAlice.isVerified, true, 'Alice should be photo-verified');
    assert.strictEqual(verifyAlice.visibility, true, 'Alice visibility should auto-toggle to ON');

    // Bob tries to set visibility ON without photo verification
    const visibilityRes = await fetch(`${BASE_URL}/user/visibility`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenBob}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ visibility: true })
    });
    assert.strictEqual(visibilityRes.status, 400, 'Setting visibility ON without photo-verification should return 400');
    
    // Verify Bob photo-verification
    await fetch(`${BASE_URL}/user/verify-photo`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${tokenBob}` }
    });
    console.log('✔ Verification & visibility toggles verified');

    // 3. Location Updates & Coarse Geohashing
    console.log('\n3. Verifying Location Updates & Geohashing...');
    
    // Alice (visible) updates location
    const locResAlice = await fetch(`${BASE_URL}/geo/location`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenAlice}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ latitude: 37.7749, longitude: -122.4194 }) // SF Downtown
    });
    const locAlice = await locResAlice.json();
    assert.ok(locAlice.geohash, 'Should return coarse geohash for Alice');

    // Bob (visible) updates location nearby
    await fetch(`${BASE_URL}/geo/location`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenBob}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ latitude: 37.7750, longitude: -122.4194 }) // SF Civic Center (nearby, within 1km)
    });

    // Test visible list
    const nearbyRes = await fetch(`${BASE_URL}/geo/nearby`, {
      headers: { 'Authorization': `Bearer ${tokenAlice}` }
    });
    const nearbyList = await nearbyRes.json();
    assert.strictEqual(nearbyList.length, 1, 'Alice should see Bob nearby');
    assert.strictEqual(nearbyList[0].distanceBand, 'Within 1 km', 'Distance band should be "Within 1 km"');

    // Test that database does NOT store precise coordinates
    const aliceDbUser = await prisma.user.findUnique({ where: { id: authAlice.user.id } });
    assert.strictEqual(aliceDbUser.latitude, null, 'Exact latitude should not be persisted');
    assert.strictEqual(aliceDbUser.longitude, null, 'Exact longitude should not be persisted');
    assert.ok(aliceDbUser.geohash, 'Coarse geohash must be persisted');

    console.log('✔ Location updates, coarse geohashing, and security boundaries verified');

    // 4. Connection requests & Consent gate webhook
    console.log('\n4. Verifying Connection Requests & Consent Gates...');
    
    // Attempt webhook access before connection is accepted
    const gateBefore = await fetch(`${BASE_URL}/webhooks/chat-gate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId: authAlice.user.id, receiverId: authBob.user.id })
    });
    assert.strictEqual(gateBefore.status, 403, 'Chat gate webhook should deny access before connection acceptance');

    // Send connection request
    const reqRes = await fetch(`${BASE_URL}/connections/request`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenAlice}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ receiverId: authBob.user.id, introMessage: 'Hi Bob!' })
    });
    const connectionReq = await reqRes.json();
    assert.strictEqual(connectionReq.status, 'pending', 'Connection request should be created as pending');

    // Get Bob requests inbox
    const inboxRes = await fetch(`${BASE_URL}/connections/requests`, {
      headers: { 'Authorization': `Bearer ${tokenBob}` }
    });
    const inbox = await inboxRes.json();
    assert.strictEqual(inbox.length, 1, 'Bob should have 1 pending request');
    assert.strictEqual(inbox[0].introMessage, 'Hi Bob!', 'Should contain the intro message');

    // Accept request
    const acceptRes = await fetch(`${BASE_URL}/connections/respond`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenBob}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ requestId: connectionReq.id, action: 'accept' })
    });
    const acceptResult = await acceptRes.json();
    assert.strictEqual(acceptResult.status, 'accepted', 'Request response status should be accepted');

    // Attempt webhook access after connection is accepted
    const gateAfter = await fetch(`${BASE_URL}/webhooks/chat-gate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId: authAlice.user.id, receiverId: authBob.user.id })
    });
    const gateResult = await gateAfter.json();
    assert.strictEqual(gateResult.allowed, true, 'Chat gate webhook should allow access after connection acceptance');

    console.log('✔ Connection requests, accept transition, and consent gates verified');

    // 5. Posts Feed & Visibility rules
    console.log('\n5. Verifying Posts & Feed Visibility Gating...');
    
    // Alice creates public post
    await fetch(`${BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenAlice}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mediaUrls: ['https://example.com/alice-dog.jpg'],
        caption: 'Look at my dog!',
        visibility: 'public'
      })
    });

    // Alice creates connections-only post
    await fetch(`${BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenAlice}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mediaUrls: ['https://example.com/alice-secret.jpg'],
        caption: 'Only my connections can see this!',
        visibility: 'connections'
      })
    });

    // Bob checks feed
    const feedRes = await fetch(`${BASE_URL}/posts/feed`, {
      headers: { 'Authorization': `Bearer ${tokenBob}` }
    });
    const feedBob = await feedRes.json();
    // Bob is connected to Alice, so he should see BOTH posts
    assert.strictEqual(feedBob.length, 2, 'Connected user Bob should see public and connections-only posts');

    // Create third user Charlie (unconnected)
    const signupRes3 = await fetch(`${BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'charlie@example.com',
        name: 'Charlie Brown',
        dob: '1990-03-20',
        photoUrl: 'https://example.com/charlie.jpg'
      })
    });
    const authCharlie = await signupRes3.json();
    const tokenCharlie = authCharlie.accessToken;
    await fetch(`${BASE_URL}/user/verify-photo`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${tokenCharlie}` }
    });

    // Charlie checks feed
    const feedResCharlie = await fetch(`${BASE_URL}/posts/feed`, {
      headers: { 'Authorization': `Bearer ${tokenCharlie}` }
    });
    const feedCharlie = await feedResCharlie.json();
    // Charlie is NOT connected to Alice, so he should see only 1 post (the public one)
    assert.strictEqual(feedCharlie.length, 1, 'Unconnected user Charlie should only see public post');
    assert.strictEqual(feedCharlie[0].visibility, 'public', 'Unconnected user Charlie post visibility should be public');

    console.log('✔ Feed visibility gating verified');

    // 6. Block & Report cleanup
    console.log('\n6. Verifying Unilateral Block & Request Cleanup...');
    
    // Alice blocks Bob
    const blockRes = await fetch(`${BASE_URL}/connections/block`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenAlice}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ targetId: authBob.user.id })
    });
    assert.strictEqual(blockRes.status, 200, 'Block call should return 200');

    // Check webhook gating again after block
    const gateAfterBlock = await fetch(`${BASE_URL}/webhooks/chat-gate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId: authAlice.user.id, receiverId: authBob.user.id })
    });
    assert.strictEqual(gateAfterBlock.status, 403, 'Chat gate webhook should deny access after blocking');

    // Bob checks feed again
    const feedResBobAfterBlock = await fetch(`${BASE_URL}/posts/feed`, {
      headers: { 'Authorization': `Bearer ${tokenBob}` }
    });
    const feedBobAfterBlock = await feedResBobAfterBlock.json();
    assert.strictEqual(feedBobAfterBlock.length, 0, 'Bob should see no posts from Alice after block');

    console.log('✔ Block cleanup verified');

    // 7. Auto-suspension from repeat reports
    console.log('\n7. Verifying Auto-suspension on Multiple Reports...');
    
    // Target user Charlie gets reported by Alice
    await fetch(`${BASE_URL}/connections/report`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenAlice}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ targetId: authCharlie.user.id, reason: 'SPAM', details: 'Spamming connection requests' })
    });

    // Create 2 more users to report Charlie
    for (let i = 1; i <= 2; i++) {
      const signupReporterRes = await fetch(`${BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `reporter${i}@example.com`,
          name: `Reporter ${i}`,
          dob: '1992-05-12'
        })
      });
      const authReporter = await signupReporterRes.json();
      await fetch(`${BASE_URL}/user/verify-photo`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authReporter.accessToken}` }
      });

      // Report Charlie
      await fetch(`${BASE_URL}/connections/report`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authReporter.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ targetId: authCharlie.user.id, reason: 'HARASSMENT', details: 'Harassing users' })
      });
    }

    // Verify Charlie's visibility is set to OFF automatically
    const charlieDbUser = await prisma.user.findUnique({ where: { id: authCharlie.user.id } });
    assert.strictEqual(charlieDbUser.visibility, false, 'Charlie visibility should be auto-suspended (OFF) after 3 distinct reports');

    console.log('✔ Auto-suspension verified');

  } catch (error) {
    console.error('❌ Verification test failed:', error);
    process.exit(1);
  } finally {
    // Close test server
    server.close(() => {
      console.log('\n--- VERIFICATION COMPLETED ---');
      process.exit(0);
    });
  }
}

runTests();

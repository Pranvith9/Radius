import React, { useState, useMemo, useRef } from 'react';
import AndroidFrame from './components/layout/AndroidFrame';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import NearbyFeed from './components/discovery/NearbyFeed';
import MapView from './components/discovery/MapView';
import RequestsInbox from './components/requests/RequestsInbox';
import ChatList from './components/chat/ChatList';
import ChatThread from './components/chat/ChatThread';
import ProfileView from './components/profile/ProfileView';

// Public Feed & Shorts Components
import ShortsAndPostsFeed from './components/posts/ShortsAndPostsFeed';
import CreatePostModal from './components/posts/CreatePostModal';

// Modals
import PersonDetailModal from './components/discovery/PersonDetailModal';
import SendRequestModal from './components/requests/SendRequestModal';
import FilterModal from './components/discovery/FilterModal';
import RadiusModal from './components/discovery/RadiusModal';
import ReportBlockModal from './components/safety/ReportBlockModal';
import SafetyTipsModal from './components/safety/SafetyTipsModal';
import PhotoVerificationModal from './components/profile/PhotoVerificationModal';
import IncomingCallModal from './components/call/IncomingCallModal';
import CallScreen from './components/call/CallScreen';
import AuthOnboarding from './components/auth/AuthOnboarding';

// Mock Data
import { CURRENT_USER, NEARBY_USERS, INITIAL_REQUESTS, INITIAL_CHATS, INITIAL_POSTS } from './data/mockData';

const TAB_ORDER = ['nearby', 'feed', 'requests', 'chats', 'map', 'profile'];

export default function App() {
  const [currentUser, setCurrentUser] = useState(CURRENT_USER);
  const [nearbyUsers, setNearbyUsers] = useState(NEARBY_USERS);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [posts, setPosts] = useState(INITIAL_POSTS);

  // App Navigation & Modals State
  const [activeTab, setActiveTab] = useState('nearby'); // 'nearby' | 'feed' | 'requests' | 'chats' | 'map' | 'profile'
  const [previousTab, setPreviousTab] = useState('nearby');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [requestPerson, setRequestPerson] = useState(null);
  const [activeChat, setActiveChat] = useState(null);

  // Touch Swipe Gesture State
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);

  // Modals
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [createPostInitialData, setCreatePostInitialData] = useState(null);

  const handleOpenCreatePost = (initialData = null) => {
    setCreatePostInitialData(initialData);
    setIsCreatePostOpen(true);
  };

  // Calls
  const [activeCall, setActiveCall] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);

  // Safety & Settings Modals
  const [reportUser, setReportUser] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isRadiusOpen, setIsRadiusOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isSafetyTipsOpen, setIsSafetyTipsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [panicActive, setPanicActive] = useState(false);

  // Filter State
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [activeNowOnly, setActiveNowOnly] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [blockedUserIds, setBlockedUserIds] = useState([]);

  // Compute filtered nearby list
  const visibleNearbyUsers = useMemo(() => {
    if (panicActive || !currentUser.visibility) return [];

    return nearbyUsers.filter((user) => {
      if (blockedUserIds.includes(user.id)) return false;
      if (verifiedOnly && !user.isVerified) return false;
      if (activeNowOnly && !user.activeNow) return false;
      if (selectedInterests.length > 0) {
        const hasMatchingInterest = user.interests.some((interest) => selectedInterests.includes(interest));
        if (!hasMatchingInterest) return false;
      }
      return true;
    });
  }, [nearbyUsers, currentUser.visibility, panicActive, blockedUserIds, verifiedOnly, activeNowOnly, selectedInterests]);

  const pendingRequestUserIds = useMemo(() => {
    return requests.filter((r) => r.status === 'pending').map((r) => r.sender.id);
  }, [requests]);

  const connectedUserIds = useMemo(() => {
    return chats.filter((c) => c.status === 'active').map((c) => c.matchUser.id);
  }, [chats]);

  // Select chat & mark all messages as read
  const handleSelectChat = (chat) => {
    const updatedMessages = chat.messages.map((m) => ({ ...m, read: true }));
    const updatedChat = { ...chat, messages: updatedMessages };

    setChats((prev) =>
      prev.map((c) => (c.id === chat.id ? updatedChat : c))
    );

    setActiveChat(updatedChat);
  };

  // Touch Swipe Handlers for Swiping Between Navigation Pages
  const handleTouchStart = (e) => {
    if (activeChat) return;
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (activeChat) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStartXRef.current;
    const deltaY = touchEndY - touchStartYRef.current;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      const currentIndex = TAB_ORDER.indexOf(activeTab);
      if (currentIndex !== -1) {
        let newIndex = currentIndex;
        if (deltaX < -50 && currentIndex < TAB_ORDER.length - 1) {
          newIndex = currentIndex + 1;
        } else if (deltaX > 50 && currentIndex > 0) {
          newIndex = currentIndex - 1;
        }
        if (newIndex !== currentIndex) {
          const nextTab = TAB_ORDER[newIndex];
          if (activeTab !== 'profile' && nextTab === 'profile') {
            setPreviousTab(activeTab);
          } else if (nextTab !== 'profile' && activeTab !== 'profile') {
            setPreviousTab(activeTab);
          }
          setActiveTab(nextTab);
        }
      }
    }
  };

  const handleOpenChatWithPerson = (person) => {
    const existingChat = chats.find((c) => c.matchUser.id === person.id);
    if (existingChat) {
      handleSelectChat(existingChat);
      setActiveTab('chats');
    }
  };

  const handleUpdateUser = (updates) => {
    setCurrentUser((prev) => ({ ...prev, ...updates }));
  };

  const handleToggleVisibility = () => {
    setCurrentUser((prev) => ({ ...prev, visibility: !prev.visibility, isVerified: true }));
  };

  const handlePanicToggle = () => {
    setPanicActive((prev) => {
      const next = !prev;
      if (next) {
        setCurrentUser((c) => ({ ...c, visibility: false }));
      }
      return next;
    });
  };

  const handleSendRequest = (targetPerson, introMessage) => {
    const newReq = {
      id: `req_${Date.now()}`,
      sender: targetPerson,
      introMessage,
      createdAt: 'Just now',
      expiresInDays: 7,
      status: 'pending'
    };
    setRequests((prev) => [newReq, ...prev]);

    if (targetPerson.id === 'usr_001') {
      setTimeout(() => {
        handleAcceptRequest(newReq);
      }, 4000);
    }
  };

  const handleAcceptRequest = (request) => {
    setRequests((prev) => prev.filter((r) => r.id !== request.id));
    const existingChat = chats.find((c) => c.matchUser.id === request.sender.id);
    if (existingChat) {
      handleSelectChat(existingChat);
      setActiveTab('chats');
      return;
    }

    const newChat = {
      id: `chat_${Date.now()}`,
      matchUser: request.sender,
      createdAt: 'Just now',
      status: 'active',
      messages: [
        {
          id: `m_${Date.now()}`,
          senderId: request.sender.id,
          text: request.introMessage || `Hey ${currentUser.name.split(' ')[0]}! Excited to connect nearby!`,
          sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false
        }
      ],
      callLogs: []
    };

    setChats((prev) => [newChat, ...prev]);
    setActiveChat(newChat);
    setActiveTab('chats');
  };

  const handleDeclineRequest = (request) => {
    setRequests((prev) => prev.filter((r) => r.id !== request.id));
  };

  const handleSendMessage = (chatId, textOrPayload) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    let newMsg;
    if (typeof textOrPayload === 'string') {
      newMsg = {
        id: `m_${Date.now()}`,
        senderId: currentUser.id,
        text: textOrPayload,
        sentAt: timeStr,
        read: true,
        type: 'text'
      };
    } else {
      newMsg = {
        id: `m_${Date.now()}`,
        senderId: currentUser.id,
        text: textOrPayload.text || '',
        sentAt: timeStr,
        read: true,
        type: textOrPayload.type || 'text',
        mediaUrl: textOrPayload.mediaUrl,
        fileName: textOrPayload.fileName,
        fileSize: textOrPayload.fileSize,
        audioDuration: textOrPayload.audioDuration
      };
    }

    setChats((prev) =>
      prev.map((c) => {
        if (c.id === chatId) return { ...c, messages: [...c.messages, newMsg] };
        return c;
      })
    );

    if (activeChat && activeChat.id === chatId) {
      setActiveChat((prev) => ({
        ...prev,
        messages: [...prev.messages, newMsg]
      }));
    }
  };

  // Like / Unlike Post
  const handleLikePost = (postId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.isLiked;
          return {
            ...p,
            isLiked: nextLiked,
            likesCount: nextLiked ? p.likesCount + 1 : p.likesCount - 1
          };
        }
        return p;
      })
    );
  };

  // Create New Post
  const handleCreatePost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleStartCall = (chatId, partner, type) => {
    setActiveCall({
      id: `call_${Date.now()}`,
      chatId,
      partner,
      type
    });
  };

  const handleEndCall = (durationSeconds) => {
    if (activeCall) {
      const mins = Math.floor(durationSeconds / 60);
      const secs = Math.floor(durationSeconds % 60);
      const durationStr = `${mins}m ${secs}s`;

      const newLog = {
        id: `c_${Date.now()}`,
        type: activeCall.type,
        duration: durationStr,
        timestamp: 'Just now',
        status: 'completed'
      };

      setChats((prev) =>
        prev.map((c) => {
          if (c.id === activeCall.chatId) {
            return { ...c, callLogs: [...(c.callLogs || []), newLog] };
          }
          return c;
        })
      );

      if (activeChat && activeChat.id === activeCall.chatId) {
        setActiveChat((prev) => ({
          ...prev,
          callLogs: [...(prev.callLogs || []), newLog]
        }));
      }
    }
    setActiveCall(null);
  };

  const handleUnmatch = (chatId, partner) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id === chatId) return { ...c, status: 'unmatched' };
        return c;
      })
    );
    if (activeChat && activeChat.id === chatId) {
      setActiveChat((prev) => ({ ...prev, status: 'unmatched' }));
    }
  };

  const handleBlockUser = (targetUser, reason = '', details = '') => {
    const userId = targetUser.id;
    setBlockedUserIds((prev) => [...prev, userId]);
    setNearbyUsers((prev) => prev.filter((u) => u.id !== userId));
    setRequests((prev) => prev.filter((r) => r.sender.id !== userId));
    setChats((prev) => prev.filter((c) => c.matchUser.id !== userId));
    setPosts((prev) => prev.filter((p) => p.author.id !== userId));
    if (activeChat && activeChat.matchUser.id === userId) setActiveChat(null);
    if (activeCall && activeCall.partner.id === userId) setActiveCall(null);
    if (incomingCall && incomingCall.caller.id === userId) setIncomingCall(null);
    setSelectedPerson(null);
    setRequestPerson(null);
  };

  const appTheme = currentUser?.theme || 'dark';

  if (!isAuthenticated) {
    return (
      <AndroidFrame theme={appTheme}>
        <AuthOnboarding
          existingUsers={[currentUser, ...nearbyUsers]}
          onCompleteAuth={(authData) => {
            const cleanDigits = authData.phone ? authData.phone.replace(/\D/g, '') : '';
            const matchedUser = [currentUser, ...nearbyUsers].find(
              (u) => u.phone && u.phone.replace(/\D/g, '') === cleanDigits
            );

            if (matchedUser) {
              setCurrentUser({ ...matchedUser, visibility: false });
            } else {
              const newUser = {
                id: `usr_${Date.now()}`,
                name: authData.name || 'User',
                age: authData.age || 24,
                phone: authData.phone,
                photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
                bio: "Newly joined Nearby user! Ready to discover nearby connections.",
                interests: ["Coffee", "Music", "Travel"],
                privacyMode: "public",
                visibility: false,
                isVerified: false,
                phoneVerified: true,
                radius: "5 km",
                readReceipts: true,
                vacationMode: false
              };
              setCurrentUser(newUser);
            }

            setIsAuthenticated(true);
            setActiveTab('nearby');
          }}
        />
      </AndroidFrame>
    );
  }

  return (
    <AndroidFrame theme={appTheme}>

      {/* Show Top App Header when NOT on Profile tab and NOT in an active chat */}
      {activeTab !== 'profile' && !activeChat && (
        <Header
          currentUser={currentUser}
          onToggleVisibility={handleToggleVisibility}
          onOpenFilter={() => setIsFilterOpen(true)}
          panicActive={panicActive}
          onTogglePanic={handlePanicToggle}
          onOpenSafety={() => setIsSafetyTipsOpen(true)}
          onOpenProfile={() => {
            if (activeTab !== 'profile') setPreviousTab(activeTab);
            setActiveTab('profile');
            setActiveChat(null);
          }}
        />
      )}

      <main
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}
      >
        {activeTab === 'nearby' && (
          <NearbyFeed
            users={visibleNearbyUsers}
            currentUser={currentUser}
            panicActive={panicActive}
            onToggleVisibility={handleToggleVisibility}
            onSelectPerson={(person) => setSelectedPerson(person)}
            onConnectPerson={(person) => setRequestPerson(person)}
            pendingRequestUserIds={pendingRequestUserIds}
            connectedUserIds={connectedUserIds}
            onOpenChat={handleOpenChatWithPerson}
            onOpenFilter={() => setIsFilterOpen(true)}
            onOpenRadius={() => setIsRadiusOpen(true)}
            activeFilterCount={(verifiedOnly ? 1 : 0) + (activeNowOnly ? 1 : 0) + selectedInterests.length}
            onRefreshFeed={() => setNearbyUsers([...NEARBY_USERS])}
            initialViewMode="grid2"
          />
        )}

        {activeTab === 'map' && (
          <MapView
            users={visibleNearbyUsers}
            currentUser={currentUser}
            panicActive={panicActive}
            onToggleVisibility={handleToggleVisibility}
            onSelectPerson={(person) => setSelectedPerson(person)}
            onConnectPerson={(person) => setRequestPerson(person)}
            pendingRequestUserIds={pendingRequestUserIds}
            connectedUserIds={connectedUserIds}
            onOpenChat={handleOpenChatWithPerson}
          />
        )}

        {activeTab === 'feed' && (
          <ShortsAndPostsFeed
            posts={posts.filter((p) => !blockedUserIds.includes(p.author.id))}
            onLikePost={handleLikePost}
            onSelectPerson={(person) => setSelectedPerson(person)}
            onOpenCreatePost={() => setIsCreatePostOpen(true)}
          />
        )}

        {activeTab === 'requests' && (
          <RequestsInbox
            requests={requests}
            onAcceptRequest={handleAcceptRequest}
            onDeclineRequest={handleDeclineRequest}
            onBlockUser={(user) => setReportUser(user)}
          />
        )}

        {activeTab === 'chats' && !activeChat && (
          <ChatList
            chats={chats}
            onSelectChat={handleSelectChat}
            currentUserId={currentUser.id}
          />
        )}

        {activeChat && (
          <ChatThread
            chat={activeChat}
            currentUser={currentUser}
            onBack={() => setActiveChat(null)}
            onSendMessage={handleSendMessage}
            onStartCall={(chatId, partner, type) => handleStartCall(chatId, partner, type)}
            onUnmatch={handleUnmatch}
            onBlockUser={(user) => setReportUser(user)}
            onOpenSafetyTips={() => setIsSafetyTipsOpen(true)}
            onSelectPerson={(person) => setSelectedPerson(person)}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            currentUser={currentUser}
            onUpdateUser={handleUpdateUser}
            onOpenVerification={() => setIsVerificationOpen(true)}
            panicActive={panicActive}
            onTogglePanic={handlePanicToggle}
            onSelectPerson={(person) => setSelectedPerson(person)}
            onBack={() => setActiveTab(previousTab || 'nearby')}
            onLogout={() => setIsAuthenticated(false)}
            userPosts={posts.filter((p) => p.author.id === currentUser.id)}
            onOpenCreatePost={handleOpenCreatePost}
          />
        )}
      </main>

      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (activeTab !== 'profile' && tab === 'profile') {
            setPreviousTab(activeTab);
          } else if (tab !== 'profile' && activeTab !== 'profile') {
            setPreviousTab(activeTab);
          }
          setActiveTab(tab);
          if (tab !== 'chats') setActiveChat(null);
        }}
        pendingRequestsCount={requests.filter((r) => r.status === 'pending').length}
        unreadChatsCount={chats.filter((c) => c.messages.some((m) => !m.read && m.senderId !== currentUser.id)).length}
      />

      {/* MODALS */}
      {selectedPerson && (
        <PersonDetailModal
          person={selectedPerson}
          onClose={() => setSelectedPerson(null)}
          onConnect={(person) => {
            setSelectedPerson(null);
            setRequestPerson(person);
          }}
          onBlock={(person) => setReportUser(person)}
          hasPendingRequest={pendingRequestUserIds.includes(selectedPerson.id)}
          isConnected={connectedUserIds.includes(selectedPerson.id)}
          currentUserId={currentUser.id}
        />
      )}

      {requestPerson && (
        <SendRequestModal
          isOpen={!!requestPerson}
          targetPerson={requestPerson}
          onClose={() => setRequestPerson(null)}
          onSendRequest={handleSendRequest}
        />
      )}

      <CreatePostModal
        isOpen={isCreatePostOpen}
        initialData={createPostInitialData}
        onClose={() => {
          setIsCreatePostOpen(false);
          setCreatePostInitialData(null);
        }}
        onCreatePost={handleCreatePost}
        currentUser={currentUser}
      />

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        verifiedOnly={verifiedOnly}
        onToggleVerifiedOnly={() => setVerifiedOnly(!verifiedOnly)}
        activeNowOnly={activeNowOnly}
        onToggleActiveNowOnly={() => setActiveNowOnly(!activeNowOnly)}
        selectedInterests={selectedInterests}
        onToggleInterestFilter={(interest) => {
          setSelectedInterests((prev) =>
            prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
          );
        }}
      />

      <RadiusModal
        isOpen={isRadiusOpen}
        onClose={() => setIsRadiusOpen(false)}
        currentRadius={currentUser.radius}
        onApplyRadius={(radius) => handleUpdateUser({ radius })}
      />

      {reportUser && (
        <ReportBlockModal
          isOpen={!!reportUser}
          targetUser={reportUser}
          onClose={() => setReportUser(null)}
          onConfirmBlock={handleBlockUser}
        />
      )}

      <SafetyTipsModal
        isOpen={isSafetyTipsOpen}
        onClose={() => setIsSafetyTipsOpen(false)}
      />

      <PhotoVerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        onCompleteVerification={() => {
          handleUpdateUser({ isVerified: true, visibility: true });
        }}
      />

      {incomingCall && (
        <IncomingCallModal
          caller={incomingCall.caller}
          callType={incomingCall.type}
          onAcceptCall={() => {
            handleStartCall(incomingCall.chatId, incomingCall.caller, incomingCall.type);
            setIncomingCall(null);
          }}
          onDeclineCall={() => setIncomingCall(null)}
        />
      )}

      {activeCall && (
        <CallScreen
          partner={activeCall.partner}
          callType={activeCall.type}
          onEndCall={handleEndCall}
          onBlockUser={(user) => setReportUser(user)}
        />
      )}
    </AndroidFrame>
  );
}

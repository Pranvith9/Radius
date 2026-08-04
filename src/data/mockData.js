export const CURRENT_USER = {
  id: "usr_000",
  name: "Alex Taylor",
  age: 26,
  photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600",
  bio: "Architect & tech enthusiast. Love weekend hiking, espresso, and discovering local indie coffee shops.",
  interests: ["Coffee", "Hiking", "Architecture", "Photography", "Board Games"],
  privacyMode: "public", // 'public' | 'private'
  visibility: false,
  isVerified: true,
  googleAuth: true,
  phoneVerified: true,
  radius: "5 km",
  readReceipts: true,
  vacationMode: false,
  theme: "dark"
};

export const NEARBY_USERS = [
  {
    id: "usr_001",
    name: "Elena Rostova",
    age: 24,
    distance: "0.4 km",
    distanceMeters: 400,
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
    bio: "Recently moved from Seattle! Product designer who loves pottery, live jazz, and rooftop sunset views.",
    interests: ["Design", "Pottery", "Jazz", "Coffee", "Hiking"],
    privacyMode: "public",
    activeNow: true,
    isVerified: true,
    icebreaker: "What's your ultimate go-to comfort food spot around here?",
    coords: { x: 38, y: 42 }
  },
  {
    id: "usr_002",
    name: "Marcus Vance",
    age: 28,
    distance: "0.9 km",
    distanceMeters: 900,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
    bio: "Software dev into cycling, bouldering, and vinyl records. Always looking for workout buddies or coffee chats.",
    interests: ["Bouldering", "Cycling", "Coffee", "Vinyl Records", "Board Games"],
    privacyMode: "public",
    activeNow: true,
    isVerified: true,
    icebreaker: "Best 5k running track or trail nearby?",
    coords: { x: 62, y: 28 }
  },
  {
    id: "usr_003",
    name: "Sophia Chen",
    age: 25,
    distance: "1.2 km",
    distanceMeters: 1200,
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600",
    bio: "Foodie & gallery hopper. Exploring secret speakeasies and urban photography spots.",
    interests: ["Photography", "Art", "Foodie", "Coffee", "Architecture"],
    privacyMode: "private",
    activeNow: false,
    isVerified: true,
    icebreaker: "What song is currently on loop for you?",
    coords: { x: 25, y: 70 }
  },
  {
    id: "usr_004",
    name: "David Miller",
    age: 29,
    distance: "2.1 km",
    distanceMeters: 2100,
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600",
    bio: "Landscape photographer & dog dad. Let's grab matcha or visit the local dog park.",
    interests: ["Photography", "Dogs", "Matcha", "Hiking", "Travel"],
    privacyMode: "public",
    activeNow: true,
    isVerified: true,
    icebreaker: "Dog park or quiet beach walk?",
    coords: { x: 75, y: 65 }
  },
  {
    id: "usr_005",
    name: "Aaliyah Patel",
    age: 23,
    distance: "3.5 km",
    distanceMeters: 3500,
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600",
    bio: "Yoga instructor & bookworm. Searching for local book clubs and outdoor yoga sessions.",
    interests: ["Yoga", "Books", "Coffee", "Meditation", "Design"],
    privacyMode: "private",
    activeNow: false,
    isVerified: true,
    icebreaker: "Favorite book of the year so far?",
    coords: { x: 50, y: 82 }
  }
];

export const INITIAL_POSTS = [
  {
    id: "post_301",
    author: NEARBY_USERS[0], // Elena
    type: "short", // 'short' (video) | 'photo'
    mediaUrl: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=800",
    caption: "Found this hidden indie coffee laboratory around the corner! Best pour-over in town ☕✨",
    tag: "Coffee & Vibe",
    likesCount: 34,
    commentsCount: 8,
    isLiked: false,
    createdAt: "30 mins ago"
  },
  {
    id: "post_302",
    author: NEARBY_USERS[1], // Marcus
    type: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&q=80&w=800",
    caption: "Crushed a new V6 boulder route at the local gym tonight! Who's up for climbing this Thursday? 🧗‍♂️💪",
    tag: "Bouldering",
    likesCount: 52,
    commentsCount: 14,
    isLiked: true,
    createdAt: "2 hours ago"
  },
  {
    id: "post_303",
    author: NEARBY_USERS[3], // David
    type: "short",
    mediaUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800",
    caption: "Golden hour sunset walk with my golden retriever Barnaby! Peak peace 🌅🐕",
    tag: "Dogs & Sunsets",
    likesCount: 89,
    commentsCount: 19,
    isLiked: false,
    createdAt: "4 hours ago"
  }
];

export const INITIAL_REQUESTS = [
  {
    id: "req_101",
    sender: NEARBY_USERS[0],
    introMessage: "Hey Alex! Saw you're into Coffee & Architecture too. Would love to connect and trade indie cafe recommendations!",
    createdAt: "2 hours ago",
    expiresInDays: 6,
    status: "pending"
  }
];

export const INITIAL_CHATS = [
  {
    id: "chat_201",
    matchUser: NEARBY_USERS[1],
    createdAt: "Yesterday",
    status: "active",
    messages: [
      { id: "m1", senderId: "usr_002", type: "text", text: "Hey Alex! Thanks for accepting the connection. Cool to see another bouldering fan nearby!", sentAt: "10:14 AM", read: true },
      { id: "m2", senderId: "usr_000", type: "text", text: "Hey Marcus! Absolutely. I usually hit the local gym on Tuesday evenings. Have you tried the new outdoor wall?", sentAt: "10:18 AM", read: true },
      { id: "m3", senderId: "usr_002", type: "voice", text: "", audioDuration: "00:14", sentAt: "10:20 AM", read: true },
      { id: "m4", senderId: "usr_002", type: "video", text: "", mediaUrl: "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&q=80&w=800", fileName: "bouldering_v6_session.mp4", fileSize: "12.4 MB", sentAt: "10:21 AM", read: true },
      { id: "m5", senderId: "usr_000", type: "document", text: "", fileName: "Trail_Map_Guide_2026.pdf", fileSize: "2.4 MB", sentAt: "10:22 AM", read: true }
    ],
    callLogs: [
      { id: "c1", type: "voice", duration: "3m 42s", timestamp: "Yesterday 4:30 PM", status: "completed" }
    ]
  }
];

export const INTEREST_OPTIONS = [
  "Coffee", "Hiking", "Architecture", "Photography", "Board Games",
  "Design", "Pottery", "Jazz", "Bouldering", "Cycling", "Vinyl Records",
  "Art", "Foodie", "Dogs", "Matcha", "Travel", "Yoga", "Books", "Meditation"
];

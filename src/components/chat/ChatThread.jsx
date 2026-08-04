import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, Phone, Video, MoreVertical, Send, ShieldAlert, CheckCheck,
  Sparkles, Lock, UserX, User, Plus, Mic, Paperclip, FileText, Film,
  Music, FolderOpen, Image, Play, Pause, Trash2, X, Download, File, Volume2, Check,
  RotateCw, ZoomIn, ZoomOut, Share2, Camera, Eye, RotateCcw, Infinity as InfinityIcon
} from 'lucide-react';
import IcebreakerPrompts from './IcebreakerPrompts';
import LiveCameraModal from '../common/LiveCameraModal';

export default function ChatThread({
  chat,
  currentUser,
  onBack,
  onSendMessage,
  onStartCall,
  onUnmatch,
  onBlockUser,
  onSelectPerson
}) {
  const { matchUser, messages, callLogs, status } = chat;
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  // Instant Camera & View Mode State ('once' | 'twice' | 'unlimited')
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);
  const [pendingPhotoUrl, setPendingPhotoUrl] = useState(null);
  const [pendingViewMode, setPendingViewMode] = useState('once'); // default to View Once
  const [isViewModeModalOpen, setIsViewModeModalOpen] = useState(false);

  // Voice Note Recording & Preview State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isPreviewingVoice, setIsPreviewingVoice] = useState(false);
  const [previewDuration, setPreviewDuration] = useState('00:00');
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [previewProgress, setPreviewProgress] = useState(0);

  const recordingTimerRef = useRef(null);
  const previewTimerRef = useRef(null);

  // Audio Playback State for Voice/Audio Messages
  const [playingMessageId, setPlayingMessageId] = useState(null);
  const [playProgress, setPlayProgress] = useState(0);
  const playTimerRef = useRef(null);

  // Hidden File Input Ref
  const fileInputRef = useRef(null);
  const [fileAcceptType, setFileAcceptType] = useState('*/*');
  const [attachmentCategory, setAttachmentCategory] = useState('document');

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isRecording, isPreviewingVoice]);

  // Handle Voice Recording Timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  const formatSeconds = (sec) => {
    const mins = Math.floor(sec / 60);
    const remainderSecs = sec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${remainderSecs < 10 ? '0' : ''}${remainderSecs}`;
  };

  const handleStartRecording = () => {
    if (status === 'unmatched') return;
    setIsRecording(true);
    setIsPreviewingVoice(false);
    setIsPreviewPlaying(false);
    setRecordingSeconds(0);
    setShowAttachmentMenu(false);
  };

  const handleStopRecordingToPreview = () => {
    const durationStr = formatSeconds(recordingSeconds || 4);
    setIsRecording(false);
    setRecordingSeconds(0);
    setPreviewDuration(durationStr);
    setIsPreviewingVoice(true);
    setIsPreviewPlaying(false);
    setPreviewProgress(0);
  };

  const handleTogglePreviewPlay = () => {
    if (isPreviewPlaying) {
      setIsPreviewPlaying(false);
      if (previewTimerRef.current) clearInterval(previewTimerRef.current);
    } else {
      setIsPreviewPlaying(true);
      if (previewTimerRef.current) clearInterval(previewTimerRef.current);

      previewTimerRef.current = setInterval(() => {
        setPreviewProgress((prev) => {
          if (prev >= 100) {
            clearInterval(previewTimerRef.current);
            setIsPreviewPlaying(false);
            return 0;
          }
          return prev + 10;
        });
      }, 250);
    }
  };

  const handleCancelRecording = () => {
    setIsRecording(false);
    setIsPreviewingVoice(false);
    setIsPreviewPlaying(false);
    setRecordingSeconds(0);
    setPreviewProgress(0);
    if (previewTimerRef.current) clearInterval(previewTimerRef.current);
  };

  const handleSendVoiceNote = () => {
    const durationStr = previewDuration || formatSeconds(recordingSeconds || 4);
    setIsRecording(false);
    setIsPreviewingVoice(false);
    setIsPreviewPlaying(false);
    setRecordingSeconds(0);
    setPreviewProgress(0);
    if (previewTimerRef.current) clearInterval(previewTimerRef.current);

    onSendMessage(chat.id, {
      type: 'voice',
      text: '',
      audioDuration: durationStr
    });

    simulatePartnerTyping();
  };

  const handleSendText = (e) => {
    e?.preventDefault();
    if (!inputText.trim() || status === 'unmatched') return;

    onSendMessage(chat.id, inputText.trim());
    setInputText('');
    simulatePartnerTyping();
  };

  const simulatePartnerTyping = () => {
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
      }, 2500);
    }, 1200);
  };

  // Open native browser/mobile file picker
  const triggerNativeFilePicker = (acceptTypes, category) => {
    setFileAcceptType(acceptTypes);
    setAttachmentCategory(category);
    setShowAttachmentMenu(false);
    setTimeout(() => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }, 100);
  };

  // Full Screen File Viewer State
  const [selectedFullScreenFile, setSelectedFullScreenFile] = useState(null);

  const openFullScreenFile = (fileMsg) => {
    if (fileMsg.viewMode === 'once' || fileMsg.viewMode === 'twice') {
      if (fileMsg.isExpired) return;

      const currentViews = fileMsg.viewsRemaining !== undefined ? fileMsg.viewsRemaining : (fileMsg.viewMode === 'once' ? 1 : 2);
      if (currentViews <= 0) {
        fileMsg.isExpired = true;
        return;
      }

      fileMsg.viewsRemaining = currentViews - 1;
      if (fileMsg.viewsRemaining <= 0) {
        fileMsg.isExpired = true;
      }
    }
    setSelectedFullScreenFile(fileMsg);
  };

  const handleSendInstantPhoto = () => {
    if (!pendingPhotoUrl) return;

    onSendMessage(chat.id, {
      type: 'image',
      text: '',
      mediaUrl: pendingPhotoUrl,
      fileName: 'Instant Photo',
      viewMode: pendingViewMode,
      viewsRemaining: pendingViewMode === 'once' ? 1 : pendingViewMode === 'twice' ? 2 : 999999,
      isExpired: false
    });

    setIsViewModeModalOpen(false);
    setPendingPhotoUrl(null);
    simulatePartnerTyping();
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    const sizeStr = `${sizeInMB} MB`;

    let msgType = attachmentCategory;
    if (file.type.startsWith('image/')) msgType = 'image';
    else if (file.type.startsWith('video/')) msgType = 'video';
    else if (file.type.startsWith('audio/')) msgType = 'audio';

    const mediaObjectUrl = URL.createObjectURL(file);

    onSendMessage(chat.id, {
      type: msgType,
      text: '', // Only send the file itself, no extra details text
      mediaUrl: mediaObjectUrl,
      fileName: file.name,
      fileSize: sizeStr,
      audioDuration: msgType === 'audio' ? '02:45' : undefined
    });

    // Reset input
    e.target.value = '';
    simulatePartnerTyping();
  };

  // Send Preset Demo Attachment
  const handleSendPresetAttachment = (type, sampleData) => {
    setShowAttachmentMenu(false);
    const { text, ...restSampleData } = sampleData;
    onSendMessage(chat.id, {
      type,
      text: '', // Only send the file itself
      ...restSampleData
    });
    simulatePartnerTyping();
  };

  // Play / Pause Voice or Audio Message Simulation
  const handleTogglePlayAudio = (msgId) => {
    if (playingMessageId === msgId) {
      setPlayingMessageId(null);
      if (playTimerRef.current) clearInterval(playTimerRef.current);
      setPlayProgress(0);
    } else {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
      setPlayingMessageId(msgId);
      setPlayProgress(0);

      playTimerRef.current = setInterval(() => {
        setPlayProgress((prev) => {
          if (prev >= 100) {
            clearInterval(playTimerRef.current);
            setPlayingMessageId(null);
            return 0;
          }
          return prev + 10;
        });
      }, 300);
    }
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 60,
      background: 'var(--color-bg)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Hidden File Input for Native File Browsing */}
      <input
        type="file"
        ref={fileInputRef}
        accept={fileAcceptType}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Backdrop for Menus */}
      {(showMenu || showAttachmentMenu) && (
        <div
          onClick={() => {
            setShowMenu(false);
            setShowAttachmentMenu(false);
          }}
          onTouchStart={() => {
            setShowMenu(false);
            setShowAttachmentMenu(false);
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 80,
            background: showAttachmentMenu ? 'rgba(15, 23, 42, 0.4)' : 'transparent',
            backdropFilter: showAttachmentMenu ? 'blur(2px)' : 'none',
            transition: 'background 200ms ease'
          }}
        />
      )}

      {/* Header */}
      <div style={{
        height: '60px',
        padding: '0 12px',
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 90
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onBack}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-primary)',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ArrowLeft size={20} />
          </button>

          {/* Clickable Profile Header Info */}
          <div
            onClick={() => onSelectPerson && onSelectPerson(matchUser)}
            title={`View ${matchUser.name}'s profile details`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              padding: '4px 6px',
              borderRadius: '12px',
              transition: 'background 150ms ease'
            }}
          >
            <div className="avatar-container" style={{ position: 'relative' }}>
              <img
                src={matchUser.photo}
                alt={matchUser.name}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
              {matchUser.activeNow && (
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#22C55E',
                  border: '2px solid #FFFFFF'
                }} />
              )}
            </div>

            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: '18px' }}>
                {matchUser.name}
              </h4>
              <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                {matchUser.activeNow ? 'Active now' : 'Offline'} • ~{matchUser.distance}
              </div>
            </div>
          </div>
        </div>

        {/* Action Header Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', position: 'relative' }}>
          {status === 'active' && (
            <>
              <button
                onClick={() => onStartCall(chat.id, matchUser, 'voice')}
                title="Start Voice Call"
                style={{
                  background: 'var(--color-bg)',
                  color: '#22C55E',
                  border: '1px solid var(--color-border)',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Phone size={16} />
              </button>

              <button
                onClick={() => onStartCall(chat.id, matchUser, 'video')}
                title="Start Video Call"
                style={{
                  background: 'var(--color-bg)',
                  color: '#3B82F6',
                  border: '1px solid var(--color-border)',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Video size={16} />
              </button>
            </>
          )}

          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{
              background: showMenu ? 'var(--color-border)' : 'transparent',
              border: 'none',
              padding: '6px',
              borderRadius: '50%',
              cursor: 'pointer',
              color: 'var(--color-text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 100
            }}
          >
            <MoreVertical size={20} />
          </button>

          {showMenu && (
            <div style={{
              position: 'absolute',
              top: '46px',
              right: '0',
              background: 'var(--color-surface)',
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(15, 23, 42, 0.18)',
              border: '1px solid var(--color-border)',
              padding: '6px',
              minWidth: '180px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              zIndex: 100
            }}>
              <button
                onClick={() => {
                  setShowMenu(false);
                  if (onSelectPerson) onSelectPerson(matchUser);
                }}
                style={{
                  padding: '10px 14px',
                  border: 'none',
                  background: 'var(--color-bg)',
                  color: 'var(--color-text-primary)',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <User size={15} color="#2563EB" />
                View Profile Details
              </button>

              {status === 'active' && (
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onUnmatch(chat.id, matchUser);
                  }}
                  style={{
                    padding: '10px 14px',
                    border: 'none',
                    background: 'var(--color-bg)',
                    textAlign: 'left',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    cursor: 'pointer',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <UserX size={15} color="#64748B" />
                  Unmatch User
                </button>
              )}

              <button
                onClick={() => {
                  setShowMenu(false);
                  onBlockUser(matchUser);
                }}
                style={{
                  padding: '10px 14px',
                  border: 'none',
                  background: 'rgba(239, 68, 68, 0.15)',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#EF4444',
                  cursor: 'pointer',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <ShieldAlert size={15} color="#EF4444" />
                Block & Report
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages List Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        {/* Connection Notice */}
        <div style={{
          alignSelf: 'center',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '9999px',
          padding: '6px 14px',
          fontSize: '11px',
          color: 'var(--color-text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>🔒 Mutual Connection Accepted • End-to-end chat unlocked</span>
        </div>

        {/* Embedded Call Logs */}
        {callLogs && callLogs.map((log) => (
          <div key={log.id} style={{
            alignSelf: 'center',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            padding: '6px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Phone size={13} color="#22C55E" />
            <span>{log.type === 'voice' ? 'Voice call' : 'Video call'} • {log.duration}</span>
            <span style={{ fontSize: '10px', color: '#94A3B8' }}>{log.timestamp}</span>
          </div>
        ))}

        {/* Messages List */}
        {messages.map((msg) => {
          const isOwn = msg.senderId === currentUser.id;
          const isPlaying = playingMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className="animate-fade-up"
              style={{
                alignSelf: isOwn ? 'flex-end' : 'flex-start',
                maxWidth: '82%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: isOwn ? 'flex-end' : 'flex-start'
              }}
            >
              {/* Voice Message Bubble */}
              {msg.type === 'voice' && (
                <div
                  onClick={(e) => {
                    if (e.target.closest('button')) return;
                    openFullScreenFile(msg);
                  }}
                  style={{
                    background: isOwn ? '#2563EB' : 'var(--color-surface)',
                    color: isOwn ? '#FFFFFF' : 'var(--color-text-primary)',
                    border: isOwn ? 'none' : '1px solid var(--color-border)',
                    borderRadius: '20px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    minWidth: '200px',
                    boxShadow: 'var(--shadow-sm)',
                    cursor: 'pointer'
                  }}
                >
                  <button
                    onClick={() => handleTogglePlayAudio(msg.id)}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: isOwn ? '#FFFFFF' : '#2563EB',
                      color: isOwn ? '#2563EB' : '#FFFFFF',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
                  </button>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '22px' }}>
                      {[40, 70, 45, 90, 60, 30, 85, 100, 50, 75, 40, 80, 55, 95, 35, 65].map((h, i) => (
                        <div
                          key={i}
                          style={{
                            flex: 1,
                            height: `${h}%`,
                            background: isOwn
                              ? (isPlaying && (i / 16) * 100 <= playProgress ? '#93C5FD' : 'rgba(255, 255, 255, 0.5)')
                              : (isPlaying && (i / 16) * 100 <= playProgress ? '#2563EB' : '#CBD5E1'),
                            borderRadius: '4px',
                            transition: 'height 150ms ease, background 150ms ease'
                          }}
                        />
                      ))}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '11px',
                      opacity: 0.9,
                      fontWeight: 500
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Mic size={11} /> Voice Note
                      </span>
                      <span>{msg.audioDuration || '00:14'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Video Attachment Bubble */}
              {msg.type === 'video' && (
                <div
                  onClick={() => openFullScreenFile(msg)}
                  style={{
                    background: isOwn ? '#1E293B' : 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    width: '240px',
                    boxShadow: 'var(--shadow-sm)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ position: 'relative', height: '140px', background: '#0F172A' }}>
                    <img
                      src={msg.mediaUrl || "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&q=80&w=800"}
                      alt="Video thumbnail"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8, display: 'block' }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(0, 0, 0, 0.3)'
                    }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'rgba(37, 99, 235, 0.9)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)',
                        cursor: 'pointer'
                      }}>
                        <Play size={20} style={{ marginLeft: '2px' }} />
                      </div>
                    </div>
                    <span style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      background: 'rgba(0, 0, 0, 0.75)',
                      color: '#FFFFFF',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 600
                    }}>
                      VIDEO • {msg.fileSize || '12.4 MB'}
                    </span>
                  </div>
                  {msg.text && msg.text.trim() !== '' && (
                    <div style={{ padding: '10px 12px', fontSize: '13px', color: 'var(--color-text-primary)' }}>
                      {msg.text}
                    </div>
                  )}
                </div>
              )}

              {/* Audio Track Bubble */}
              {msg.type === 'audio' && (
                <div
                  onClick={() => openFullScreenFile(msg)}
                  style={{
                    background: isOwn ? '#2563EB' : 'var(--color-surface)',
                    color: isOwn ? '#FFFFFF' : 'var(--color-text-primary)',
                    border: isOwn ? 'none' : '1px solid var(--color-border)',
                    borderRadius: '18px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '230px',
                    boxShadow: 'var(--shadow-sm)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    background: isOwn ? 'rgba(255, 255, 255, 0.2)' : 'rgba(37, 99, 235, 0.1)',
                    color: isOwn ? '#FFFFFF' : '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Music size={20} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, truncate: true, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {msg.fileName || 'Audio Track.mp3'}
                    </div>
                    <div style={{ fontSize: '11px', opacity: 0.8 }}>
                      Audio • {msg.fileSize || '3.2 MB'}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePlayAudio(msg.id);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'inherit',
                      cursor: 'pointer'
                    }}
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                </div>
              )}

              {/* Document Attachment Bubble */}
              {msg.type === 'document' && (
                <div
                  onClick={() => openFullScreenFile(msg)}
                  style={{
                    background: isOwn ? '#1E293B' : 'var(--color-surface)',
                    color: isOwn ? '#FFFFFF' : 'var(--color-text-primary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '16px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '240px',
                    boxShadow: 'var(--shadow-sm)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: '#EF4444',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '11px'
                  }}>
                    PDF
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {msg.fileName || 'Document.pdf'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                      {msg.fileSize || '2.4 MB'}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openFullScreenFile(msg);
                    }}
                    style={{
                      color: isOwn ? '#38BDF8' : '#2563EB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '6px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <Download size={18} />
                  </button>
                </div>
              )}

              {/* Image Attachment Bubble (Instant Photo with View Once / View Twice / Unlimited support) */}
              {msg.type === 'image' && (
                (msg.viewMode === 'once' || msg.viewMode === 'twice') ? (
                  msg.isExpired || (msg.viewsRemaining !== undefined && msg.viewsRemaining <= 0) ? (
                    /* Expired / Opened Photo Bubble */
                    <div
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        color: '#EF4444',
                        borderRadius: '16px',
                        padding: '10px 14px',
                        fontSize: '13px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'default'
                      }}
                    >
                      <Lock size={16} />
                      <span>Photo Expired • Opened</span>
                    </div>
                  ) : (
                    /* Active View Once / View Twice Photo Badge Bubble */
                    <div
                      onClick={() => openFullScreenFile(msg)}
                      style={{
                        background: isOwn ? '#1E293B' : 'rgba(37, 99, 235, 0.1)',
                        border: isOwn ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(37, 99, 235, 0.3)',
                        color: isOwn ? '#38BDF8' : '#2563EB',
                        borderRadius: '18px',
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        boxShadow: 'var(--shadow-sm)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: '#2563EB',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Eye size={16} />
                      </div>

                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700 }}>
                          {msg.viewMode === 'once' ? '🔂 View Once Photo' : '🔁 View Twice Photo'}
                        </div>
                        <div style={{ fontSize: '11px', opacity: 0.85 }}>
                          {msg.viewsRemaining !== undefined
                            ? `${msg.viewsRemaining} view${msg.viewsRemaining === 1 ? '' : 's'} remaining (Tap to view)`
                            : 'Tap to view photo'}
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  /* Unlimited / Standard Image Bubble */
                  <div
                    onClick={() => openFullScreenFile(msg)}
                    style={{
                      background: isOwn ? '#1E293B' : 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '18px',
                      overflow: 'hidden',
                      maxWidth: '240px',
                      boxShadow: 'var(--shadow-sm)',
                      cursor: 'pointer'
                    }}
                  >
                    <img
                      src={msg.mediaUrl}
                      alt={msg.fileName || 'Image'}
                      style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', display: 'block' }}
                    />
                    {msg.text && msg.text.trim() !== '' && (
                      <div style={{ padding: '8px 12px', fontSize: '13px', color: isOwn ? '#FFFFFF' : 'var(--color-text-primary)' }}>
                        {msg.text}
                      </div>
                    )}
                  </div>
                )
              )}

              {/* Standard Text Message Bubble */}
              {(!msg.type || msg.type === 'text') && (
                <div style={{
                  background: isOwn ? '#2563EB' : 'var(--color-surface)',
                  color: isOwn ? '#FFFFFF' : 'var(--color-text-primary)',
                  border: isOwn ? 'none' : '1px solid var(--color-border)',
                  borderRadius: '16px',
                  borderBottomRightRadius: isOwn ? '4px' : '16px',
                  borderBottomLeftRadius: isOwn ? '16px' : '4px',
                  padding: '10px 14px',
                  fontSize: '14px',
                  lineHeight: '20px',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {msg.text}
                </div>
              )}

              {/* Timestamp & Read Receipt */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '10px',
                color: '#94A3B8',
                marginTop: '3px',
                padding: '0 4px'
              }}>
                <span>{msg.sentAt}</span>
                {isOwn && (
                  <CheckCheck size={12} color={msg.read ? '#2563EB' : '#94A3B8'} />
                )}
              </div>
            </div>
          );
        })}

        {/* Simulated Typing Indicator */}
        {isTyping && (
          <div style={{
            alignSelf: 'flex-start',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '8px 14px',
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ fontSize: '11px' }}>{matchUser.name.split(' ')[0]} is typing...</span>
            <span className="pulse-ring-active" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2563EB' }} />
          </div>
        )}

        {/* Unmatched Notice */}
        {status === 'unmatched' && (
          <div style={{
            alignSelf: 'center',
            background: '#FEF2F2',
            border: '1px solid #FEE2E2',
            color: '#EF4444',
            padding: '8px 14px',
            borderRadius: '12px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            margin: '12px 0'
          }}>
            <Lock size={14} />
            <span>This conversation has been closed (Unmatched). Read-only history.</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Icebreaker Prompts helper row */}
      {status === 'active' && messages.length <= 3 && !isRecording && (
        <IcebreakerPrompts onSelectPrompt={(prompt) => setInputText(prompt)} />
      )}

      {/* Attachment Selection Sheet Popover Modal */}
      {showAttachmentMenu && (
        <div style={{
          position: 'absolute',
          bottom: '70px',
          left: '12px',
          right: '12px',
          zIndex: 100,
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '24px',
          padding: '16px',
          boxShadow: '0 16px 40px rgba(15, 23, 42, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          animation: 'fadeInUp 200ms ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Share & Attach Files
            </span>
            <button
              onClick={() => setShowAttachmentMenu(false)}
              style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Grid of File Category Buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px'
          }}>
            {/* Instant Camera */}
            <button
              onClick={() => {
                setShowAttachmentMenu(false);
                setIsLiveCameraOpen(true);
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                padding: '12px 8px',
                borderRadius: '16px',
                background: 'rgba(37, 99, 235, 0.15)',
                border: '1px solid rgba(37, 99, 235, 0.3)',
                color: '#2563EB',
                cursor: 'pointer'
              }}
            >
              <Camera size={22} />
              <span style={{ fontSize: '11px', fontWeight: 700 }}>Camera</span>
            </button>
            {/* Gallery Photos */}
            <button
              onClick={() => triggerNativeFilePicker('image/*', 'image')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                padding: '12px 8px',
                borderRadius: '16px',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                color: '#2563EB',
                cursor: 'pointer'
              }}
            >
              <Image size={22} />
              <span style={{ fontSize: '11px', fontWeight: 600 }}>Gallery</span>
            </button>

            {/* Video File */}
            <button
              onClick={() => triggerNativeFilePicker('video/*', 'video')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                padding: '12px 8px',
                borderRadius: '16px',
                background: 'rgba(236, 72, 153, 0.1)',
                border: '1px solid rgba(236, 72, 153, 0.2)',
                color: '#EC4899',
                cursor: 'pointer'
              }}
            >
              <Film size={22} />
              <span style={{ fontSize: '11px', fontWeight: 600 }}>Videos</span>
            </button>

            {/* Audio Track */}
            <button
              onClick={() => triggerNativeFilePicker('audio/*', 'audio')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                padding: '12px 8px',
                borderRadius: '16px',
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.2)',
                color: '#A855F7',
                cursor: 'pointer'
              }}
            >
              <Music size={22} />
              <span style={{ fontSize: '11px', fontWeight: 600 }}>Audios</span>
            </button>

            {/* Document / PDF */}
            <button
              onClick={() => triggerNativeFilePicker('.pdf,.doc,.docx,.txt', 'document')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                padding: '12px 8px',
                borderRadius: '16px',
                background: 'rgba(234, 179, 8, 0.1)',
                border: '1px solid rgba(234, 179, 8, 0.2)',
                color: '#CA8A04',
                cursor: 'pointer'
              }}
            >
              <FileText size={22} />
              <span style={{ fontSize: '11px', fontWeight: 600 }}>Document</span>
            </button>
          </div>

          {/* Mobile File Storage Browser Full Bar */}
          <button
            onClick={() => triggerNativeFilePicker('*/*', 'document')}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '16px',
              background: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <FolderOpen size={18} color="#2563EB" />
            <span>Browse Files</span>
          </button>

          {/* Interactive Demo Presets */}
          <div style={{
            borderTop: '1px solid var(--color-border)',
            paddingTop: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
              ⚡ Quick Demo Sample Attachments
            </span>

            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              <button
                onClick={() => handleSendPresetAttachment('video', {
                  text: 'Check out this drone footage clip!',
                  mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
                  fileName: 'Drone_Coastal_View.mp4',
                  fileSize: '18.2 MB'
                })}
                style={{
                  padding: '8px 12px',
                  borderRadius: '9999px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  color: '#2563EB',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  fontSize: '12px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Film size={14} /> Send Sample Video
              </button>

              <button
                onClick={() => handleSendPresetAttachment('audio', {
                  fileName: 'Indie_Acoustic_Session.mp3',
                  fileSize: '4.8 MB'
                })}
                style={{
                  padding: '8px 12px',
                  borderRadius: '9999px',
                  background: 'rgba(168, 85, 247, 0.1)',
                  color: '#A855F7',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  fontSize: '12px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Music size={14} /> Send Sample Audio
              </button>

              <button
                onClick={() => handleSendPresetAttachment('document', {
                  fileName: 'Subsea_Relay_Specification.pdf',
                  fileSize: '3.1 MB'
                })}
                style={{
                  padding: '8px 12px',
                  borderRadius: '9999px',
                  background: 'rgba(234, 179, 8, 0.1)',
                  color: '#CA8A04',
                  border: '1px solid rgba(234, 179, 8, 0.3)',
                  fontSize: '12px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <FileText size={14} /> Send Sample PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Input / Voice Note Recording Footer */}
      {status === 'active' ? (
        <div style={{
          padding: '10px 12px',
          background: 'var(--color-surface)',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 90
        }}>
          {isRecording ? (
            /* Live Voice Note Recording Bar Interface */
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '9999px',
              padding: '6px 14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  className="pulse-ring-active"
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: '#EF4444'
                  }}
                />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#EF4444' }}>
                  Recording ({formatSeconds(recordingSeconds)})
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Cancel / Trash Recording */}
                <button
                  type="button"
                  onClick={handleCancelRecording}
                  title="Discard Recording"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    color: '#EF4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={15} />
                </button>

                {/* Done / Stop Recording to Preview */}
                <button
                  type="button"
                  onClick={handleStopRecordingToPreview}
                  title="Stop & Listen Preview"
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: '#2563EB',
                    color: '#FFFFFF',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.4)'
                  }}
                >
                  <Check size={18} />
                </button>
              </div>
            </div>
          ) : isPreviewingVoice ? (
            /* Voice Note Audio Preview & Listen Bar Interface (Before Sending) */
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'var(--color-bg)',
              border: '1px solid #2563EB',
              borderRadius: '9999px',
              padding: '6px 10px',
              boxShadow: '0 2px 10px rgba(37, 99, 235, 0.15)'
            }}>
              {/* Play / Pause Recorded Preview Button */}
              <button
                type="button"
                onClick={handleTogglePreviewPlay}
                title={isPreviewPlaying ? "Pause Preview" : "Play & Listen Voice Preview"}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
                  flexShrink: 0
                }}
              >
                {isPreviewPlaying ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: '2px' }} />}
              </button>

              {/* Dynamic Waveform Visualizer & Duration */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '18px' }}>
                  {[45, 80, 60, 95, 70, 40, 90, 100, 65, 85, 50, 75, 55, 90, 40].map((h, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: `${h}%`,
                        background: (i / 15) * 100 <= previewProgress ? '#2563EB' : '#CBD5E1',
                        borderRadius: '3px',
                        transition: 'background 150ms ease'
                      }}
                    />
                  ))}
                </div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>🎧 Listen Preview</span>
                  <span>{previewDuration}</span>
                </div>
              </div>

              {/* Trash/Delete Preview */}
              <button
                type="button"
                onClick={handleCancelRecording}
                title="Discard & Re-record"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'transparent',
                  color: '#EF4444',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                <Trash2 size={16} />
              </button>

              {/* Send Recorded Voice Note */}
              <button
                type="button"
                onClick={handleSendVoiceNote}
                title="Send Voice Note"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: '#22C55E',
                  color: '#FFFFFF',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(34, 197, 94, 0.4)',
                  flexShrink: 0
                }}
              >
                <Send size={15} />
              </button>
            </div>
          ) : (
            /* Integrated Single Capsule Text Bar with +, Mic inside on left & Send at right end */
            <form
              onSubmit={handleSendText}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: '9999px',
                padding: '4px 6px',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)'
              }}
            >
              {/* '+' Attachment Toggle Button (Inside Left) */}
              <button
                type="button"
                onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                title="Attach Videos, Audios, Documents, or Browse Files"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: showAttachmentMenu ? '#2563EB' : 'transparent',
                  color: showAttachmentMenu ? '#FFFFFF' : 'var(--color-text-secondary)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  flexShrink: 0
                }}
              >
                <Plus size={19} style={{ transform: showAttachmentMenu ? 'rotate(45deg)' : 'none', transition: 'transform 150ms ease' }} />
              </button>

              {/* Voice Message Mic Button (Inside Left, next to +) */}
              <button
                type="button"
                onClick={handleStartRecording}
                title="Record Voice Note"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'transparent',
                  color: 'var(--color-text-secondary)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'color 150ms ease',
                  flexShrink: 0
                }}
              >
                <Mic size={18} />
              </button>

              {/* Instant Camera Button (Inside Left, next to Mic) */}
              <button
                type="button"
                onClick={() => setIsLiveCameraOpen(true)}
                title="Instant Camera (View Once / View Twice / Unlimited)"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'transparent',
                  color: 'var(--color-text-secondary)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'color 150ms ease',
                  flexShrink: 0
                }}
              >
                <Camera size={18} />
              </button>

              {/* Text Input Field (Center) */}
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${matchUser.name.split(' ')[0]}...`}
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--color-text-primary)',
                  fontSize: '14px',
                  outline: 'none',
                  padding: '6px 8px',
                  fontFamily: 'var(--font-family)',
                  minWidth: 0
                }}
              />

              {/* Send Button (Right End inside text bar) */}
              <button
                type="submit"
                disabled={!inputText.trim()}
                title="Send Message"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: inputText.trim() ? '#2563EB' : 'rgba(37, 99, 235, 0.4)',
                  color: '#FFFFFF',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: inputText.trim() ? 'pointer' : 'default',
                  transition: 'all 150ms ease',
                  flexShrink: 0,
                  boxShadow: inputText.trim() ? '0 2px 8px rgba(37, 99, 235, 0.4)' : 'none'
                }}
              >
                <Send size={15} />
              </button>
            </form>
          )}
        </div>
      ) : (
        <div style={{
          padding: '12px',
          background: '#F1F5F9',
          textAlign: 'center',
          fontSize: '12px',
          color: '#64748B',
          borderTop: '1px solid #E2E8F0'
        }}>
          Conversation closed. New message sending disabled.
        </div>
      )}

      {/* Full Screen File & Media Viewer Modal Overlay (Scoped to Mobile Phone Container) */}
      {selectedFullScreenFile && (
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1000,
          background: '#0F172A',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeIn 200ms ease',
          overflow: 'hidden'
        }}>
          {/* Top Mobile Header Options Bar */}
          <div style={{
            height: '56px',
            padding: '0 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(15, 23, 42, 0.95)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#FFFFFF',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(37, 99, 235, 0.25)',
                color: '#38BDF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {selectedFullScreenFile.type === 'image' && <Image size={18} />}
                {selectedFullScreenFile.type === 'video' && <Film size={18} />}
                {selectedFullScreenFile.type === 'audio' && <Music size={18} />}
                {selectedFullScreenFile.type === 'voice' && <Mic size={18} />}
                {selectedFullScreenFile.type === 'document' && <FileText size={18} />}
              </div>
              <div style={{ minWidth: 0 }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selectedFullScreenFile.fileName || (selectedFullScreenFile.type.toUpperCase() + ' File')}
                </h3>
                <span style={{ fontSize: '10px', color: '#94A3B8' }}>
                  {selectedFullScreenFile.fileSize || 'Full Screen View'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              {selectedFullScreenFile.mediaUrl && (
                <a
                  href={selectedFullScreenFile.mediaUrl}
                  download={selectedFullScreenFile.fileName || 'file_download'}
                  title="Download File"
                  style={{
                    padding: '6px 12px',
                    borderRadius: '9999px',
                    background: '#2563EB',
                    color: '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    textDecoration: 'none'
                  }}
                >
                  <Download size={13} /> Save
                </a>
              )}
              <button
                type="button"
                onClick={() => setSelectedFullScreenFile(null)}
                title="Close Full Screen"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: 'none',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Full Screen Main Display Viewport inside Phone */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            overflow: 'auto',
            position: 'relative',
            background: '#090D16'
          }}>
            {/* Image Full Screen Display */}
            {selectedFullScreenFile.type === 'image' && (
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <img
                  src={selectedFullScreenFile.mediaUrl || "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=1200"}
                  alt="Full screen photo"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.7)'
                  }}
                />
              </div>
            )}

            {/* Video Full Screen Display */}
            {selectedFullScreenFile.type === 'video' && (
              <video
                src={selectedFullScreenFile.mediaUrl || "https://assets.mixkit.co/videos/preview/mixkit-dramatic-view-of-ocean-waves-42864-large.mp4"}
                controls
                autoPlay
                style={{
                  width: '100%',
                  maxHeight: '100%',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.7)'
                }}
              />
            )}

            {/* Document Reader Full Screen Display */}
            {selectedFullScreenFile.type === 'document' && (
              <div style={{
                width: '100%',
                height: '100%',
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '18px',
                color: '#0F172A',
                boxShadow: '0 10px 30px rgba(0,0,0,0.7)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                overflowY: 'auto'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '10px',
                  borderBottom: '1.5px solid #E2E8F0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ padding: '4px 8px', background: '#EF4444', color: '#FFFFFF', borderRadius: '6px', fontWeight: 700, fontSize: '10px' }}>
                      PDF
                    </span>
                    <span style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>
                      {selectedFullScreenFile.fileName || 'Document.pdf'}
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                    Page 1/4
                  </span>
                </div>

                <div style={{
                  flex: 1,
                  background: '#F8FAFC',
                  borderRadius: '10px',
                  padding: '16px',
                  border: '1px solid #E2E8F0',
                  fontSize: '13px',
                  lineHeight: '22px',
                  color: '#334155'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                    {selectedFullScreenFile.fileName ? selectedFullScreenFile.fileName.replace(/\.[^/.]+$/, "") : "Document File"}
                  </h4>
                  <p style={{ fontSize: '12px' }}>
                    Official document payload file. High clarity rendering for mobile reading and telemetry reference.
                  </p>
                  <div style={{ margin: '14px 0', padding: '12px', background: '#DBEAFE', borderRadius: '10px', color: '#1E40AF', fontSize: '12px', fontWeight: 600 }}>
                    📌 Document Status: Verified Encrypted Package ({selectedFullScreenFile.fileSize || '2.4 MB'})
                  </div>
                </div>
              </div>
            )}

            {/* Audio / Voice Player Display */}
            {(selectedFullScreenFile.type === 'audio' || selectedFullScreenFile.type === 'voice') && (
              <div style={{
                width: '100%',
                background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
                borderRadius: '24px',
                padding: '24px 16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '18px',
                color: '#FFFFFF',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563EB 0%, #38BDF8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 8px 24px rgba(37, 99, 235, 0.5)'
                }}>
                  {selectedFullScreenFile.type === 'voice' ? <Mic size={38} /> : <Music size={38} />}
                </div>

                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>
                    {selectedFullScreenFile.fileName || (selectedFullScreenFile.type === 'voice' ? 'Voice Message' : 'Audio Track')}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                    Duration: {selectedFullScreenFile.audioDuration || '00:45'}
                  </span>
                </div>

                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '32px', background: 'rgba(0,0,0,0.3)', padding: '0 12px', borderRadius: '12px' }}>
                    {[40, 75, 60, 95, 80, 45, 90, 100, 70, 85, 55, 80, 65, 95, 50, 70, 90, 40].map((h, i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: `${h}%`,
                          background: 'linear-gradient(180deg, #38BDF8 0%, #2563EB 100%)',
                          borderRadius: '3px'
                        }}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTogglePlayAudio(selectedFullScreenFile.id || 'fullscreen_audio')}
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      background: '#2563EB',
                      color: '#FFFFFF',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      margin: '0 auto',
                      boxShadow: '0 4px 16px rgba(37, 99, 235, 0.5)'
                    }}
                  >
                    {playingMessageId === (selectedFullScreenFile.id || 'fullscreen_audio') ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: '3px' }} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Live Camera Viewfinder Modal */}
      <LiveCameraModal
        isOpen={isLiveCameraOpen}
        onClose={() => setIsLiveCameraOpen(false)}
        onCapture={(photoUrl) => {
          setPendingPhotoUrl(photoUrl);
          setPendingViewMode('once');
          setIsViewModeModalOpen(true);
        }}
      />

      {/* Instant Photo View-Mode Selection Modal (View Once / View Twice / Unlimited) */}
      {isViewModeModalOpen && pendingPhotoUrl && (
        <div
          onClick={() => {
            setIsViewModeModalOpen(false);
            setPendingPhotoUrl(null);
          }}
          className="animate-fade-in"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 200,
            background: 'rgba(9, 13, 22, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <div
            className="animate-slide-up"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              background: 'var(--color-surface)',
              color: 'var(--color-text-primary)',
              borderTopLeftRadius: 'var(--radius-lg)',
              borderTopRightRadius: 'var(--radius-lg)',
              padding: '20px 20px 24px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: 'var(--shadow-modal)',
              cursor: 'default'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="#2563EB" />
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  Send Instant Photo
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsViewModeModalOpen(false);
                    setPendingPhotoUrl(null);
                    setIsLiveCameraOpen(true);
                  }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '9999px',
                    background: 'var(--color-border)',
                    color: 'var(--color-text-secondary)',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <RotateCcw size={13} /> Retake
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsViewModeModalOpen(false);
                    setPendingPhotoUrl(null);
                  }}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: 'var(--color-border)',
                    border: 'none',
                    color: 'var(--color-text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Photo Preview Container */}
            <div style={{
              position: 'relative',
              width: '100%',
              maxHeight: '260px',
              borderRadius: '16px',
              overflow: 'hidden',
              background: '#040711',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--color-border)'
            }}>
              <img
                src={pendingPhotoUrl}
                alt="Instant Photo Preview"
                style={{ width: '100%', height: '260px', objectFit: 'cover' }}
              />

              {/* View Mode Badge Overlay */}
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                padding: '5px 12px',
                borderRadius: '9999px',
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(4px)',
                color: '#38BDF8',
                fontSize: '12px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: '1px solid rgba(56, 189, 248, 0.4)'
              }}>
                {pendingViewMode === 'once' && '🔂 View Once (1x)'}
                {pendingViewMode === 'twice' && '🔁 View Twice (2x)'}
                {pendingViewMode === 'unlimited' && '♾️ Unlimited View'}
              </div>
            </div>

            {/* View Mode Options Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
                Select Viewing Permission
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {/* 1x View Once */}
                <button
                  type="button"
                  onClick={() => setPendingViewMode('once')}
                  style={{
                    padding: '12px 6px',
                    borderRadius: '14px',
                    background: pendingViewMode === 'once' ? '#2563EB' : 'var(--color-bg)',
                    color: pendingViewMode === 'once' ? '#FFFFFF' : 'var(--color-text-primary)',
                    border: pendingViewMode === 'once' ? '1px solid #2563EB' : '1px solid var(--color-border)',
                    fontWeight: 600,
                    fontSize: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    transition: 'all 150ms ease'
                  }}
                >
                  <Eye size={18} />
                  <span>1x View Once</span>
                </button>

                {/* 2x View Twice */}
                <button
                  type="button"
                  onClick={() => setPendingViewMode('twice')}
                  style={{
                    padding: '12px 6px',
                    borderRadius: '14px',
                    background: pendingViewMode === 'twice' ? '#2563EB' : 'var(--color-bg)',
                    color: pendingViewMode === 'twice' ? '#FFFFFF' : 'var(--color-text-primary)',
                    border: pendingViewMode === 'twice' ? '1px solid #2563EB' : '1px solid var(--color-border)',
                    fontWeight: 600,
                    fontSize: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    transition: 'all 150ms ease'
                  }}
                >
                  <RotateCcw size={18} />
                  <span>2x View Twice</span>
                </button>

                {/* Unlimited View */}
                <button
                  type="button"
                  onClick={() => setPendingViewMode('unlimited')}
                  style={{
                    padding: '12px 6px',
                    borderRadius: '14px',
                    background: pendingViewMode === 'unlimited' ? '#2563EB' : 'var(--color-bg)',
                    color: pendingViewMode === 'unlimited' ? '#FFFFFF' : 'var(--color-text-primary)',
                    border: pendingViewMode === 'unlimited' ? '1px solid #2563EB' : '1px solid var(--color-border)',
                    fontWeight: 600,
                    fontSize: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    transition: 'all 150ms ease'
                  }}
                >
                  <InfinityIcon size={18} />
                  <span>Unlimited</span>
                </button>
              </div>

              <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textAlign: 'center', marginTop: '2px' }}>
                {pendingViewMode === 'once' && '🔥 Photo automatically self-destructs after 1 view.'}
                {pendingViewMode === 'twice' && '🔥 Photo automatically self-destructs after 2 views.'}
                {pendingViewMode === 'unlimited' && '✨ Photo stays available for recipient to view anytime.'}
              </p>
            </div>

            {/* Send CTA Button */}
            <button
              type="button"
              onClick={handleSendInstantPhoto}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '9999px',
                background: '#2563EB',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 600,
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
              }}
            >
              <Send size={16} />
              Send Instant Photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

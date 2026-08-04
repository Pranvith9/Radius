import React, { useState, useRef } from 'react';
import { ArrowLeft, Menu, CheckCircle, Edit3, Check, Lock, Globe, ShieldAlert, Eye, EyeOff, X, Sun, Moon, LogOut, Plus, Camera, Image } from 'lucide-react';
import LiveCameraModal from '../common/LiveCameraModal';
import PhotoEditorModal from '../common/PhotoEditorModal';

export default function ProfileView({
  currentUser,
  onUpdateUser,
  onOpenVerification,
  panicActive,
  onTogglePanic,
  onSelectPerson,
  onBack,
  onLogout,
  userPosts = [],
  onOpenCreatePost
}) {
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(currentUser.bio);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSettingsClosing, setIsSettingsClosing] = useState(false);

  // Avatar Modal & Editor State
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isAvatarModalClosing, setIsAvatarModalClosing] = useState(false);
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);
  const [editingPhotoUrl, setEditingPhotoUrl] = useState(null);
  const [isPhotoEditorOpen, setIsPhotoEditorOpen] = useState(false);

  const avatarCameraRef = useRef(null);
  const avatarGalleryRef = useRef(null);

  const handleCloseAvatarModal = () => {
    setIsAvatarModalClosing(true);
    setTimeout(() => {
      setIsAvatarModalOpen(false);
      setIsAvatarModalClosing(false);
    }, 240);
  };

  const handleAvatarFileSelected = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const rawPhotoUrl = URL.createObjectURL(file);
    setEditingPhotoUrl(rawPhotoUrl);
    setIsPhotoEditorOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsClosing(true);
    setTimeout(() => {
      setIsSettingsOpen(false);
      setIsSettingsClosing(false);
    }, 240);
  };

  const handleSaveBio = () => {
    onUpdateUser({ bio: bioInput });
    setIsEditingBio(false);
  };

  const currentTheme = currentUser.theme || 'light';

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '14px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      background: 'var(--neptune-bg-warm)',
      position: 'relative'
    }}>
      {/* Header Bar: Left Arrow Back Button, Title, and Top Right 3-Lines Settings Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Left Arrow Back Button */}
          <button
            onClick={onBack}
            title="Go Back"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: '22px' }}>
              My Profile
            </h2>
          </div>
        </div>

        {/* 3-Lines Settings Menu Button in Top Right End */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          title="Account Settings & Privacy Controls"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-primary)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Main Profile Details Card */}
      <div className="neptune-gradient-shell">
        <div className="neptune-gradient-shell-inner" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Clickable Profile Avatar with Proper Edit Camera Badge */}
            <div
              onClick={() => setIsAvatarModalOpen(true)}
              title="Change Profile Picture"
              className="avatar-container"
              style={{ position: 'relative', cursor: 'pointer', display: 'inline-block' }}
            >
              <img
                src={currentUser.photo}
                alt={currentUser.name}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #2563EB',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                  display: 'block'
                }}
              />

              {/* Proper Circular Camera Edit Badge Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAvatarModalOpen(true);
                }}
                title="Edit Profile Photo"
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: '#2563EB',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2.5px solid var(--color-surface)',
                  boxShadow: '0 3px 10px rgba(37, 99, 235, 0.5)',
                  cursor: 'pointer',
                  zIndex: 5
                }}
              >
                <Camera size={15} strokeWidth={2.2} />
              </button>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h3
                  onClick={() => onSelectPerson && onSelectPerson(currentUser)}
                  style={{ fontSize: '20px', fontWeight: 700, cursor: 'pointer', color: 'var(--color-text-primary)' }}
                >
                  {currentUser.name}, {currentUser.age}
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                {/* Account Privacy Mode Badge */}
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 9px',
                  borderRadius: '9999px',
                  background: currentUser.privacyMode === 'public' ? '#DBEAFE' : 'var(--color-border)',
                  color: currentUser.privacyMode === 'public' ? '#1E40AF' : 'var(--color-text-secondary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {currentUser.privacyMode === 'public' ? <Globe size={12} /> : <Lock size={12} />}
                  {currentUser.privacyMode === 'public' ? 'Public Mode' : 'Private Mode'}
                </span>

                {currentUser.isVerified && (
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '3px 9px',
                    borderRadius: '9999px',
                    background: '#DCFCE7',
                    color: '#15803D',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <CheckCircle size={12} />
                    Verified Profile
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', letterSpacing: '0.05em' }}>ABOUT</span>
              {!isEditingBio ? (
                <button
                  onClick={() => setIsEditingBio(true)}
                  style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                >
                  <Edit3 size={13} /> Edit Bio
                </button>
              ) : (
                <button
                  onClick={handleSaveBio}
                  style={{ background: 'none', border: 'none', color: '#16A34A', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Save
                </button>
              )}
            </div>

            {isEditingBio ? (
              <textarea
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '12px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  color: 'var(--color-text-primary)',
                  fontSize: '13px',
                  fontFamily: 'var(--font-family)',
                  outline: 'none'
                }}
              />
            ) : (
              <p style={{ fontSize: '14px', color: 'var(--color-text-primary)', lineHeight: '20px' }}>
                {currentUser.bio}
              </p>
            )}
          </div>

          {/* Interests */}
          <div style={{ marginTop: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>INTERESTS</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {currentUser.interests.map((interest, i) => (
                <span key={i} className="chip">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Single Clean "+ Create New Post" Button */}
      <button
        type="button"
        onClick={onOpenCreatePost}
        style={{
          width: '100%',
          padding: '13px 20px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
          color: '#FFFFFF',
          border: 'none',
          fontSize: '14px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(37, 99, 235, 0.35)',
          transition: 'all 200ms ease'
        }}
      >
        <Plus size={18} strokeWidth={2.5} />
        <span>Create New Post</span>
      </button>

      {/* Published Moments / User Posts Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
          My Published Moments ({userPosts.length})
        </h3>

        {userPosts.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {userPosts.map((post) => (
              <div key={post.id} style={{
                background: 'var(--color-surface)',
                borderRadius: '16px',
                padding: '12px',
                border: '1px solid var(--color-border)',
                display: 'flex',
                gap: '12px',
                alignItems: 'center'
              }}>
                {post.mediaUrl && (
                  <img
                    src={post.mediaUrl}
                    alt="Post media"
                    style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-primary)', lineHeight: '18px' }}>{post.caption}</p>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px', display: 'block' }}>{post.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            background: 'var(--color-surface)',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
            color: 'var(--color-text-secondary)',
            fontSize: '13px',
            border: '1px solid var(--color-border)'
          }}>
            No moments published yet. Create one from the Feed tab!
          </div>
        )}
      </div>

      {/* Settings Modal Sheet (Opened via Top Right 3-Lines Button) */}
      {isSettingsOpen && (
        <div
          onClick={handleCloseSettings}
          className={isSettingsClosing ? 'animate-fade-out' : 'animate-fade-in'}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 200,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <div
            className={isSettingsClosing ? 'animate-slide-down' : 'animate-slide-up'}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxHeight: '90%',
              background: 'var(--color-surface)',
              color: 'var(--color-text-primary)',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '20px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              boxShadow: 'var(--shadow-modal)',
              position: 'relative',
              cursor: 'default'
            }}
          >
            {/* Sheet Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Menu size={20} color="#2563EB" />
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  Account Settings & Privacy
                </h3>
              </div>
              <button
                onClick={handleCloseSettings}
                style={{ background: 'var(--color-border)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-primary)' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Dark Mode & Light Mode Theme Switcher Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                App Display Theme
              </h4>
              <div style={{ display: 'flex', gap: '10px' }}>
                {/* Light Mode Button */}
                <div
                  onClick={() => onUpdateUser({ theme: 'light' })}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '14px',
                    border: currentTheme === 'light' ? '2px solid #2563EB' : '1px solid var(--color-border)',
                    background: currentTheme === 'light' ? '#DBEAFE' : 'var(--color-bg)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Sun size={18} color={currentTheme === 'light' ? '#1E40AF' : 'var(--color-text-secondary)'} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: currentTheme === 'light' ? '#1E40AF' : 'var(--color-text-primary)' }}>
                      Light Mode
                    </div>
                  </div>
                </div>

                {/* Dark Mode Button */}
                <div
                  onClick={() => onUpdateUser({ theme: 'dark' })}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '14px',
                    border: currentTheme === 'dark' ? '2px solid #2563EB' : '1px solid var(--color-border)',
                    background: currentTheme === 'dark' ? '#1E293B' : 'var(--color-bg)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Moon size={18} color={currentTheme === 'dark' ? '#38BDF8' : 'var(--color-text-secondary)'} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: currentTheme === 'dark' ? '#38BDF8' : 'var(--color-text-primary)' }}>
                      Dark Mode
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Privacy Options Card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                Account Privacy Mode
              </h4>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div
                  onClick={() => onUpdateUser({ privacyMode: 'public' })}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '14px',
                    border: currentUser.privacyMode === 'public' ? '2px solid #2563EB' : '1px solid var(--color-border)',
                    background: currentUser.privacyMode === 'public' ? '#DBEAFE' : 'var(--color-bg)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 700, color: currentUser.privacyMode === 'public' ? '#1E40AF' : 'var(--color-text-primary)' }}>
                    Public Mode
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Visible on public feed & shorts</p>
                </div>

                <div
                  onClick={() => onUpdateUser({ privacyMode: 'private' })}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '14px',
                    border: currentUser.privacyMode === 'private' ? '2px solid #2563EB' : '1px solid var(--color-border)',
                    background: currentUser.privacyMode === 'private' ? '#DBEAFE' : 'var(--color-bg)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 700, color: currentUser.privacyMode === 'private' ? '#1E40AF' : 'var(--color-text-primary)' }}>
                    Private Mode
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Only accepted connections</p>
                </div>
              </div>
            </div>

            {/* Discoverability Settings */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                Discoverability Controls
              </h4>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                background: 'var(--color-bg)',
                borderRadius: '14px',
                border: '1px solid var(--color-border)'
              }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>Nearby Visibility</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                    {currentUser.visibility ? "Opted in to nearby discovery" : "Hidden from nearby users"}
                  </div>
                </div>

                <button
                  onClick={() => onUpdateUser({ visibility: !currentUser.visibility })}
                  disabled={!currentUser.isVerified || panicActive}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    border: 'none',
                    background: currentUser.visibility && currentUser.isVerified ? '#2563EB' : '#CBD5E1',
                    color: currentUser.visibility && currentUser.isVerified ? '#FFFFFF' : '#64748B',
                    fontWeight: 600,
                    fontSize: '12px',
                    cursor: currentUser.isVerified && !panicActive ? 'pointer' : 'not-allowed'
                  }}
                >
                  {currentUser.visibility && currentUser.isVerified ? 'ON' : 'OFF'}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--color-bg)', borderRadius: '14px', border: '1px solid var(--color-border)' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>Discovery Radius</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Search distance range</div>
                </div>
                <select
                  value={currentUser.radius}
                  onChange={(e) => onUpdateUser({ radius: e.target.value })}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '9999px',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface)',
                    color: 'var(--color-text-primary)',
                    fontSize: '12px',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                >
                  <option value="500m">500m</option>
                  <option value="1 km">1 km</option>
                  <option value="5 km">5 km</option>
                  <option value="15 km">15 km</option>
                  <option value="City-wide">City-wide</option>
                </select>
              </div>
            </div>

            {/* Safety & Panic Pause */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                Safety & Panic Controls
              </h4>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                background: panicActive ? '#FEF2F2' : 'var(--color-bg)',
                borderRadius: '14px',
                border: panicActive ? '1px solid #FEE2E2' : '1px solid var(--color-border)'
              }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: panicActive ? '#EF4444' : 'var(--color-text-primary)' }}>
                    Panic Pause Mode
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Instant privacy shield</div>
                </div>
                <button
                  onClick={onTogglePanic}
                  className={`btn ${panicActive ? 'btn-danger' : 'btn-secondary'}`}
                  style={{ padding: '6px 14px', fontSize: '12px' }}
                >
                  <ShieldAlert size={14} />
                  {panicActive ? 'Paused' : 'Pause'}
                </button>
              </div>
            </div>

            {/* Account Log Out */}
            {onLogout && (
              <button
                onClick={() => {
                  handleCloseSettings();
                  onLogout();
                }}
                className="btn btn-secondary"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '14px',
                  color: '#EF4444',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  background: 'rgba(239, 68, 68, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '8px',
                  cursor: 'pointer'
                }}
              >
                <LogOut size={16} />
                Log Out of Account
              </button>
            )}
          </div>
        </div>
      )}

      {/* Hidden File Inputs for Avatar Change */}
      <input
        type="file"
        ref={avatarCameraRef}
        accept="image/*"
        capture="user"
        style={{ display: 'none' }}
        onChange={handleAvatarFileSelected}
      />
      <input
        type="file"
        ref={avatarGalleryRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleAvatarFileSelected}
      />

      {/* Live Camera Viewfinder Modal for Profile Picture */}
      <LiveCameraModal
        isOpen={isLiveCameraOpen}
        onClose={() => setIsLiveCameraOpen(false)}
        onCapture={(photoUrl) => {
          setEditingPhotoUrl(photoUrl);
          setIsPhotoEditorOpen(true);
        }}
      />

      {/* Photo Editor & Filter Options Modal */}
      <PhotoEditorModal
        isOpen={isPhotoEditorOpen}
        photoUrl={editingPhotoUrl}
        onClose={() => {
          setIsPhotoEditorOpen(false);
          setEditingPhotoUrl(null);
        }}
        onRetake={() => {
          setIsPhotoEditorOpen(false);
          setEditingPhotoUrl(null);
          setIsLiveCameraOpen(true);
        }}
        onApply={(editedPhotoUrl) => {
          onUpdateUser({ photo: editedPhotoUrl });
          setIsPhotoEditorOpen(false);
          setEditingPhotoUrl(null);
          handleCloseAvatarModal();
        }}
        title="Edit Profile Picture"
      />

      {/* Change Profile Picture Action Sheet Modal */}
      {isAvatarModalOpen && (
        <div
          onClick={handleCloseAvatarModal}
          className={isAvatarModalClosing ? 'animate-fade-out' : 'animate-fade-in'}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 180,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <div
            className={isAvatarModalClosing ? 'animate-slide-down' : 'animate-slide-up'}
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
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                Change Profile Picture
              </h3>
              <button
                type="button"
                onClick={handleCloseAvatarModal}
                style={{
                  background: 'var(--color-border)',
                  color: 'var(--color-text-primary)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Current Profile Preview */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
              <img
                src={currentUser.photo}
                alt="Current profile"
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #2563EB',
                  boxShadow: '0 4px 16px rgba(37, 99, 235, 0.3)'
                }}
              />
            </div>

            {/* Options: Camera & Gallery */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setIsLiveCameraOpen(true)}
                style={{
                  padding: '16px 12px',
                  borderRadius: '16px',
                  background: 'rgba(37, 99, 235, 0.08)',
                  border: '1px solid rgba(37, 99, 235, 0.25)',
                  color: '#2563EB',
                  fontWeight: 600,
                  fontSize: '13px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <Camera size={24} />
                <span>Take Photo</span>
              </button>

              <button
                type="button"
                onClick={() => avatarGalleryRef.current && avatarGalleryRef.current.click()}
                style={{
                  padding: '16px 12px',
                  borderRadius: '16px',
                  background: 'rgba(236, 72, 153, 0.08)',
                  border: '1px solid rgba(236, 72, 153, 0.25)',
                  color: '#EC4899',
                  fontWeight: 600,
                  fontSize: '13px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <Image size={24} />
                <span>Choose from Gallery</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

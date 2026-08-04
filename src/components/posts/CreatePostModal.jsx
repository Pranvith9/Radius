import React, { useState, useEffect, useRef } from 'react';
import { X, Video, Image, Upload, Camera, FolderOpen, Tag, Sparkles } from 'lucide-react';
import LiveCameraModal from '../common/LiveCameraModal';
import PhotoEditorModal from '../common/PhotoEditorModal';

export default function CreatePostModal({ isOpen, onClose, onCreatePost, currentUser, initialData }) {
  const [type, setType] = useState('photo'); // 'short' | 'photo'
  const [caption, setCaption] = useState('');
  const [tag, setTag] = useState('Coffee & Vibe');
  const [selectedMedia, setSelectedMedia] = useState('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=800');
  const [isClosing, setIsClosing] = useState(false);
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);
  const [editingPhotoUrl, setEditingPhotoUrl] = useState(null);
  const [isPhotoEditorOpen, setIsPhotoEditorOpen] = useState(false);

  // Hidden Input Refs
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Sync initialData if provided from Profile click
  useEffect(() => {
    if (initialData?.mediaUrl) {
      setSelectedMedia(initialData.mediaUrl);
      if (initialData.type) setType(initialData.type);
      if (initialData.fileName && !caption) setCaption(`Shared ${initialData.fileName}`);
    }
  }, [initialData]);

  if (!isOpen) return null;

  const sampleMediaOptions = [
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=800"
  ];

  const quickTags = [
    "Coffee & Vibe",
    "Hiking & Nature",
    "Music Lovers",
    "Sunset Drive",
    "Tech & Design"
  ];

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 240);
  };

  const handleMediaFileSelected = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    const mediaObjectUrl = URL.createObjectURL(file);

    if (file.type.startsWith('video/')) {
      setSelectedMedia(mediaObjectUrl);
      setType('short');
      if (!caption) setCaption(`Shared ${file.name}`);
    } else {
      setEditingPhotoUrl(mediaObjectUrl);
      setIsPhotoEditorOpen(true);
      if (!caption) setCaption(`Shared ${file.name}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!caption.trim()) return;

    onCreatePost({
      id: `post_${Date.now()}`,
      author: currentUser,
      type,
      mediaUrl: selectedMedia,
      caption: caption.trim(),
      tag,
      likesCount: 1,
      commentsCount: 0,
      isLiked: true,
      createdAt: 'Just now'
    });

    handleClose();
    setCaption('');
  };

  return (
    <div
      onClick={handleClose}
      className={isClosing ? 'animate-fade-out' : 'animate-fade-in'}
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
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleMediaFileSelected}
      />

      <input
        type="file"
        ref={galleryInputRef}
        accept="image/*,video/*"
        style={{ display: 'none' }}
        onChange={handleMediaFileSelected}
      />

      <input
        type="file"
        ref={fileInputRef}
        accept="*/*"
        style={{ display: 'none' }}
        onChange={handleMediaFileSelected}
      />

      {/* Live Camera Viewfinder Modal */}
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
          setSelectedMedia(editedPhotoUrl);
          setType('photo');
          setIsPhotoEditorOpen(false);
          setEditingPhotoUrl(null);
          if (!caption) setCaption('Captured Photo');
        }}
        title="Edit Post Photo"
      />

      <div
        className={isClosing ? 'animate-slide-down' : 'animate-slide-up'}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxHeight: '92%',
          background: 'var(--color-surface)',
          color: 'var(--color-text-primary)',
          borderTopLeftRadius: 'var(--radius-lg)',
          borderTopRightRadius: 'var(--radius-lg)',
          padding: '20px 20px 24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-modal)',
          cursor: 'default'
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="#2563EB" />
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Create & Publish Moment
            </h3>
          </div>

          <button
            onClick={handleClose}
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

        {/* 1. Media Source Options (Camera, Gallery, Browse Files) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Choose Media Source
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setIsLiveCameraOpen(true)}
              style={{
                padding: '12px 8px',
                borderRadius: '16px',
                background: 'rgba(37, 99, 235, 0.1)',
                border: '1px solid rgba(37, 99, 235, 0.25)',
                color: '#2563EB',
                fontWeight: 600,
                fontSize: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
            >
              <Camera size={20} />
              <span>Camera</span>
            </button>

            <button
              type="button"
              onClick={() => galleryInputRef.current && galleryInputRef.current.click()}
              style={{
                padding: '12px 8px',
                borderRadius: '16px',
                background: 'rgba(236, 72, 153, 0.1)',
                border: '1px solid rgba(236, 72, 153, 0.25)',
                color: '#EC4899',
                fontWeight: 600,
                fontSize: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
            >
              <Image size={20} />
              <span>Gallery</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              style={{
                padding: '12px 8px',
                borderRadius: '16px',
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.25)',
                color: '#A855F7',
                fontWeight: 600,
                fontSize: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
            >
              <FolderOpen size={20} />
              <span>Browse Files</span>
            </button>
          </div>
        </div>

        {/* 2. Format Selector (Photo Moment vs Video Short) */}
        <div style={{ display: 'flex', gap: '8px', background: 'var(--color-bg)', padding: '4px', borderRadius: '9999px', border: '1px solid var(--color-border)' }}>
          <button
            type="button"
            onClick={() => setType('photo')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '9999px',
              border: 'none',
              background: type === 'photo' ? '#2563EB' : 'transparent',
              color: type === 'photo' ? '#FFFFFF' : 'var(--color-text-secondary)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Image size={15} />
            Photo Moment
          </button>

          <button
            type="button"
            onClick={() => setType('short')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '9999px',
              border: 'none',
              background: type === 'short' ? '#2563EB' : 'transparent',
              color: type === 'short' ? '#FFFFFF' : 'var(--color-text-secondary)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Video size={15} />
            Video Short
          </button>
        </div>

        {/* 3. Selected Media Canvas & Samples */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Selected Media Preview</label>
          <div style={{
            width: '100%',
            height: '180px',
            borderRadius: '16px',
            overflow: 'hidden',
            background: '#0F172A',
            position: 'relative'
          }}>
            {type === 'short' && selectedMedia.endsWith('.mp4') ? (
              <video src={selectedMedia} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <img src={selectedMedia} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingTop: '4px' }}>
            {sampleMediaOptions.map((media, idx) => (
              <img
                key={idx}
                src={media}
                alt="Option"
                onClick={() => setSelectedMedia(media)}
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  objectFit: 'cover',
                  cursor: 'pointer',
                  border: selectedMedia === media ? '2px solid #2563EB' : '1px solid var(--color-border)',
                  display: 'block'
                }}
              />
            ))}
          </div>
        </div>

        {/* 4. Caption Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Caption</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption or describe your moment..."
            rows={3}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg)',
              color: 'var(--color-text-primary)',
              fontSize: '13px',
              fontFamily: 'var(--font-family)',
              outline: 'none',
              resize: 'none'
            }}
          />
        </div>

        {/* 5. Topic Tag Selection & Quick Chips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Tag size={14} color="#2563EB" /> Topic Tag
          </label>
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="e.g. Coffee, Hiking, Music"
            style={{
              padding: '10px 12px',
              borderRadius: '9999px',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg)',
              color: 'var(--color-text-primary)',
              fontSize: '13px',
              outline: 'none'
            }}
          />

          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingTop: '2px' }}>
            {quickTags.map((t, idx) => (
              <span
                key={idx}
                onClick={() => setTag(t)}
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  background: tag === t ? '#2563EB' : 'var(--color-bg)',
                  color: tag === t ? '#FFFFFF' : 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* 6. Publish CTA Button */}
        <button
          onClick={handleSubmit}
          disabled={!caption.trim()}
          className="btn btn-primary"
          style={{ width: '100%', padding: '12px', opacity: caption.trim() ? 1 : 0.5, marginTop: '4px' }}
        >
          <Upload size={16} />
          Publish to Public Feed
        </button>
      </div>
    </div>
  );
}

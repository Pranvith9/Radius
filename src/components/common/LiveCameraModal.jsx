import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, RefreshCw, AlertCircle, Upload } from 'lucide-react';

export default function LiveCameraModal({ isOpen, onClose, onCapture }) {
  const videoRef = useRef(null);
  const fallbackInputRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('user'); // 'user' | 'environment'
  const [cameraError, setCameraError] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      stopCameraStream();
      return;
    }

    startCameraStream(facingMode);

    return () => {
      stopCameraStream();
    };
  }, [isOpen, facingMode]);

  const startCameraStream = async (mode) => {
    setCameraError(null);
    stopCameraStream();

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });

        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } else {
        setCameraError('Camera API is not supported on this browser device.');
      }
    } catch (err) {
      console.warn('Live camera stream access error:', err);
      setCameraError('Unable to access live camera stream. You can capture or pick a photo using device files below.');
    }
  };

  const stopCameraStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleToggleCameraFacing = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleSnapPhoto = () => {
    if (!videoRef.current) return;
    setIsCapturing(true);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (facingMode === 'user') {
      // Flip horizontally for selfie mirror feel
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const photoDataUrl = canvas.toDataURL('image/jpeg', 0.92);

    setTimeout(() => {
      setIsCapturing(false);
      stopCameraStream();
      onCapture(photoDataUrl);
      onClose();
    }, 200);
  };

  const handleFallbackFileSelected = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const photoUrl = URL.createObjectURL(file);
    stopCameraStream();
    onCapture(photoUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 200,
        background: '#090D16',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'fadeIn 200ms ease'
      }}
    >
      {/* Hidden File Input for Native Camera Fallback */}
      <input
        type="file"
        ref={fallbackInputRef}
        accept="image/*"
        capture="user"
        style={{ display: 'none' }}
        onChange={handleFallbackFileSelected}
      />

      {/* Top Header Bar */}
      <div style={{
        height: '56px',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(15, 23, 42, 0.9)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#FFFFFF',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Camera size={18} color="#38BDF8" />
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF' }}>
            Device Camera Viewfinder
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {stream && (
            <button
              type="button"
              onClick={handleToggleCameraFacing}
              title="Switch Camera Front/Back"
              style={{
                width: '34px',
                height: '34px',
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
              <RefreshCw size={17} />
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              stopCameraStream();
              onClose();
            }}
            title="Close Camera"
            style={{
              width: '34px',
              height: '34px',
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

      {/* Camera Live Feed Viewport */}
      <div style={{
        flex: 1,
        position: 'relative',
        background: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {!cameraError ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: facingMode === 'user' ? 'scaleX(-1)' : 'none'
            }}
          />
        ) : (
          <div style={{
            padding: '24px',
            textAlign: 'center',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            maxWidth: '320px'
          }}>
            <AlertCircle size={48} color="#F59E0B" />
            <p style={{ fontSize: '14px', lineHeight: '20px', color: '#CBD5E1' }}>
              {cameraError}
            </p>
            <button
              type="button"
              onClick={() => fallbackInputRef.current && fallbackInputRef.current.click()}
              style={{
                padding: '12px 20px',
                borderRadius: '9999px',
                background: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <Upload size={16} />
              Open Camera / Select Photo
            </button>
          </div>
        )}

        {/* Capture Flash Overlay Animation */}
        {isCapturing && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: '#FFFFFF',
            animation: 'fadeOut 200ms ease'
          }} />
        )}
      </div>

      {/* Bottom Shutter Action Bar */}
      <div style={{
        height: '90px',
        background: 'rgba(15, 23, 42, 0.95)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        {stream && (
          <button
            type="button"
            onClick={handleSnapPhoto}
            title="Snap Photo"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '4px solid #2563EB',
              boxShadow: '0 0 24px rgba(37, 99, 235, 0.6)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 100ms ease'
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#2563EB'
            }} />
          </button>
        )}
      </div>
    </div>
  );
}

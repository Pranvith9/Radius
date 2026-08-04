import React, { useState } from 'react';
import {
  X,
  Palette,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Sparkles,
  Smartphone,
  Key,
  Bell,
  MapPin,
  ShieldAlert,
  Download,
  Trash2,
  LogOut,
  ChevronRight,
  ChevronDown,
  Check,
  CheckCircle,
  AlertTriangle,
  Fingerprint,
  Radio,
  Sliders,
  RefreshCw,
  UserCheck,
  Shield,
  Layers,
  Monitor
} from 'lucide-react';

export default function AccountSettingsModal({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  onLogout,
  panicActive,
  onTogglePanic,
  blockedUserIds = [],
  onUnblockUser
}) {
  // Active Section State: 'menu' | 'personalization' | 'security' | 'discoverability' | 'notifications' | 'safety' | 'account'
  const [activeSection, setActiveSection] = useState('menu');

  // Personalization local state
  const [accentColor, setAccentColor] = useState(currentUser.accentColor || '#2563EB');
  const [fontSize, setFontSize] = useState(currentUser.fontSize || 'standard');
  const [appIcon, setAppIcon] = useState(currentUser.appIcon || 'classic');
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  // Security & Password local state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');

  // 2FA and Biometric local state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(currentUser.twoFactorEnabled || false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(currentUser.biometricsEnabled || true);
  const [autoLockTimeout, setAutoLockTimeout] = useState('5m');
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [ghostMode, setGhostMode] = useState(currentUser.ghostMode || false);

  // Notifications local state
  const [pushNotifications, setPushNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [matchAlerts, setMatchAlerts] = useState(true);

  // Data & Cache local state
  const [cacheCleared, setCacheCleared] = useState(false);
  const [cacheSize, setCacheSize] = useState('42.8 MB');
  const [downloadingData, setDownloadingData] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Confirmation Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!isOpen) return null;

  // Calculate Password Strength score (0-4)
  const calculatePasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: '#CBD5E1' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak', color: '#EF4444' };
      case 2:
        return { score: 2, label: 'Fair', color: '#F59E0B' };
      case 3:
        return { score: 3, label: 'Strong', color: '#10B981' };
      case 4:
        return { score: 4, label: 'Unbreakable', color: '#2563EB' };
      default:
        return { score: 0, label: 'Too short', color: '#EF4444' };
    }
  };

  const pwStrength = calculatePasswordStrength(newPassword);

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordSuccessMsg('');
    setPasswordErrorMsg('');

    if (!currentPassword) {
      setPasswordErrorMsg('Please enter your current password.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordErrorMsg('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordErrorMsg('New password and confirmation do not match.');
      return;
    }

    // Success simulation
    setPasswordSuccessMsg('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccessMsg(''), 4000);
  };

  const handleDownloadMyData = () => {
    setDownloadingData(true);
    setTimeout(() => {
      setDownloadingData(false);
      setDownloadSuccess(true);
      // Trigger small mock JSON file download
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentUser, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `connect_user_data_${currentUser.name.replace(/\s+/g, '_')}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setTimeout(() => setDownloadSuccess(false), 4000);
    }, 1200);
  };

  const handleClearCache = () => {
    setCacheCleared(true);
    setCacheSize('0.0 MB');
    setTimeout(() => setCacheCleared(false), 3000);
  };

  const currentTheme = currentUser.theme || 'light';

  return (
    <div
      onClick={onClose}
      className="animate-fade-in"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 200,
        background: 'rgba(15, 23, 42, 0.7)',
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
          maxHeight: '92%',
          height: '90%',
          background: 'var(--color-surface)',
          color: 'var(--color-text-primary)',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-modal)',
          position: 'relative',
          cursor: 'default',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {activeSection !== 'menu' && (
              <button
                onClick={() => setActiveSection('menu')}
                style={{
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-primary)',
                  cursor: 'pointer'
                }}
              >
                <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} />
              </button>
            )}
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: '20px' }}>
                {activeSection === 'menu' && 'Account Settings & Privacy'}
                {activeSection === 'personalization' && 'Personalization & Themes'}
                {activeSection === 'security' && 'Safety & Privacy'}
                {activeSection === 'discoverability' && 'Discoverability & Location'}
                {activeSection === 'notifications' && 'Notifications & Preferences'}
                {activeSection === 'safety' && 'Safety & Emergency Shield'}
                {activeSection === 'account' && 'Account & Storage Controls'}
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                {activeSection === 'menu' ? 'Manage display, safety & privacy, themes & controls' : 'Account Settings'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-primary)',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* MAIN MENU LIST OF SECTIONS */}
          {activeSection === 'menu' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

              {/* 🎨 1. Personalization Button */}
              <button
                onClick={() => setActiveSection('personalization')}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '18px',
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 150ms ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #A855F7 0%, #6366F1 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF'
                  }}>
                    <Palette size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                      Personalization
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                      Themes, Color Accents, Icons & Font Sizes
                    </div>
                  </div>
                </div>
                <ChevronRight size={18} color="var(--color-text-muted)" />
              </button>

              {/* 🔐 2. Security & Privacy / App Security Button */}
              <button
                onClick={() => setActiveSection('security')}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '18px',
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 150ms ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #2563EB 0%, #0D9488 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF'
                  }}>
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                      Safety & Privacy
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                      Password, 2FA, Biometrics, Active Sessions & Ghost Mode
                    </div>
                  </div>
                </div>
                <ChevronRight size={18} color="var(--color-text-muted)" />
              </button>

              {/* 📡 3. Discoverability & Location Button */}
              <button
                onClick={() => setActiveSection('discoverability')}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '18px',
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF'
                  }}>
                    <MapPin size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                      Discoverability & Location
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                      Nearby Visibility, Search Radius & Fuzzing
                    </div>
                  </div>
                </div>
                <ChevronRight size={18} color="var(--color-text-muted)" />
              </button>

              {/* 🔔 4. Notifications & Preferences Button */}
              <button
                onClick={() => setActiveSection('notifications')}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '18px',
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF'
                  }}>
                    <Bell size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                      Notifications & Preferences
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                      Push Alerts, Message Tones & Vibrations
                    </div>
                  </div>
                </div>
                <ChevronRight size={18} color="var(--color-text-muted)" />
              </button>

              {/* 🛡️ 5. Safety & Emergency Shield Button */}
              <button
                onClick={() => setActiveSection('safety')}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '18px',
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF'
                  }}>
                    <ShieldAlert size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                      Safety & Emergency Controls
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                      Panic Pause, Blocked Contacts & App Shield
                    </div>
                  </div>
                </div>
                <ChevronRight size={18} color="var(--color-text-muted)" />
              </button>

              {/* ⚙️ 6. Account & Storage Button */}
              <button
                onClick={() => setActiveSection('account')}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '18px',
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #64748B 0%, #334155 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF'
                  }}>
                    <Sliders size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                      Account & Storage
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                      Data Export, Cache Cleanup & Account Deactivation
                    </div>
                  </div>
                </div>
                <ChevronRight size={18} color="var(--color-text-muted)" />
              </button>

              {/* Log Out CTA */}
              {onLogout && (
                <button
                  onClick={() => {
                    onClose();
                    onLogout();
                  }}
                  style={{
                    width: '100%',
                    padding: '13px',
                    borderRadius: '16px',
                    color: '#EF4444',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    background: 'rgba(239, 68, 68, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '8px',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <LogOut size={16} />
                  Log Out of Account
                </button>
              )}

            </div>
          )}

          {/* 🎨 PERSONALIZATION SUB-SECTION */}
          {activeSection === 'personalization' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

              {/* 1. App Display Themes */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sun size={16} color="#2563EB" /> Display Themes
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {/* Light Mode */}
                  <div
                    onClick={() => onUpdateUser({ theme: 'light' })}
                    style={{
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
                      <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Standard Clean</div>
                    </div>
                  </div>

                  {/* Dark Mode */}
                  <div
                    onClick={() => onUpdateUser({ theme: 'dark' })}
                    style={{
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
                      <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Midnight Sleek</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Primary Accent Color Selector */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} color="#A855F7" /> Custom Accent Color
                </h4>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {[
                    { color: '#2563EB', name: 'Ocean Blue' },
                    { color: '#7C3AED', name: 'Electric Violet' },
                    { color: '#10B981', name: 'Emerald Mint' },
                    { color: '#F43F5E', name: 'Sunset Crimson' },
                    { color: '#F59E0B', name: 'Cyber Amber' }
                  ].map((item) => (
                    <button
                      key={item.color}
                      onClick={() => {
                        setAccentColor(item.color);
                        onUpdateUser({ accentColor: item.color });
                      }}
                      style={{
                        flex: 1,
                        minWidth: '60px',
                        padding: '10px 8px',
                        borderRadius: '14px',
                        border: accentColor === item.color ? `2px solid ${item.color}` : '1px solid var(--color-border)',
                        background: 'var(--color-bg)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: item.color, display: 'inline-block', boxShadow: `0 2px 8px ${item.color}66` }} />
                      <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Dynamic Font Size */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '10px' }}>
                  App Text Font Size
                </h4>
                <div style={{ display: 'flex', gap: '8px', background: 'var(--color-bg)', padding: '4px', borderRadius: '14px', border: '1px solid var(--color-border)' }}>
                  {[
                    { id: 'small', label: 'Small (13px)' },
                    { id: 'standard', label: 'Standard (14px)' },
                    { id: 'large', label: 'Large (16px)' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setFontSize(option.id);
                        onUpdateUser({ fontSize: option.id });
                      }}
                      style={{
                        flex: 1,
                        padding: '8px 10px',
                        borderRadius: '10px',
                        border: 'none',
                        background: fontSize === option.id ? 'var(--color-surface)' : 'transparent',
                        color: fontSize === option.id ? '#2563EB' : 'var(--color-text-secondary)',
                        fontWeight: fontSize === option.id ? 700 : 500,
                        fontSize: '12px',
                        cursor: 'pointer',
                        boxShadow: fontSize === option.id ? 'var(--shadow-sm)' : 'none'
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. App Icon Customizer */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Smartphone size={16} color="#0EA5E9" /> App Icon Theme
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[
                    { id: 'classic', title: 'Classic Royal', desc: 'Neptune Blue', bg: 'linear-gradient(135deg, #2563EB, #1D4ED8)' },
                    { id: 'neon', title: 'Subsea Cyber', desc: 'Neon Cyan', bg: 'linear-gradient(135deg, #06B6D4, #3B82F6)' },
                    { id: 'sunset', title: 'Sunset Glow', desc: 'Rose Amber', bg: 'linear-gradient(135deg, #F43F5E, #F59E0B)' },
                    { id: 'obsidian', title: 'Obsidian Dark', desc: 'Dark Metal', bg: 'linear-gradient(135deg, #1E293B, #0F172A)' }
                  ].map((icon) => (
                    <div
                      key={icon.id}
                      onClick={() => setAppIcon(icon.id)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '14px',
                        border: appIcon === icon.id ? '2px solid #2563EB' : '1px solid var(--color-border)',
                        background: 'var(--color-bg)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                    >
                      <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: icon.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                        <Radio size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700 }}>{icon.title}</div>
                        <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>{icon.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Interface Micro-Animations Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--color-bg)', borderRadius: '14px', border: '1px solid var(--color-border)' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>Fluid Micro-Animations</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>UI transitions and hover effects</div>
                </div>
                <button
                  onClick={() => setAnimationsEnabled(!animationsEnabled)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    border: 'none',
                    background: animationsEnabled ? '#2563EB' : '#CBD5E1',
                    color: animationsEnabled ? '#FFFFFF' : '#64748B',
                    fontWeight: 600,
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  {animationsEnabled ? 'ON' : 'OFF'}
                </button>
              </div>

            </div>
          )}

          {/* 🔐 SECURITY & PRIVACY (APP SECURITY) SUB-SECTION */}
          {activeSection === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

              {/* Password & Change Password Form */}
              <div style={{ background: 'var(--color-bg)', padding: '14px', borderRadius: '18px', border: '1px solid var(--color-border)' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Key size={16} color="#2563EB" /> Password Management
                </h4>

                {passwordSuccessMsg && (
                  <div style={{ padding: '10px', borderRadius: '12px', background: '#DCFCE7', color: '#15803D', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <CheckCircle size={15} /> {passwordSuccessMsg}
                  </div>
                )}

                {passwordErrorMsg && (
                  <div style={{ padding: '10px', borderRadius: '12px', background: '#FEF2F2', color: '#EF4444', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <AlertTriangle size={15} /> {passwordErrorMsg}
                  </div>
                )}

                <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Current Password */}
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>
                      CURRENT PASSWORD
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showCurrentPw ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••••••"
                        style={{
                          width: '100%',
                          padding: '10px 36px 10px 12px',
                          borderRadius: '12px',
                          border: '1px solid var(--color-border)',
                          background: 'var(--color-surface)',
                          color: 'var(--color-text-primary)',
                          fontSize: '13px',
                          outline: 'none'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPw(!showCurrentPw)}
                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                      >
                        {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>
                      NEW PASSWORD
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showNewPw ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        style={{
                          width: '100%',
                          padding: '10px 36px 10px 12px',
                          borderRadius: '12px',
                          border: '1px solid var(--color-border)',
                          background: 'var(--color-surface)',
                          color: 'var(--color-text-primary)',
                          fontSize: '13px',
                          outline: 'none'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw(!showNewPw)}
                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                      >
                        {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    {/* Password Strength Meter */}
                    {newPassword && (
                      <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Strength:</span>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: pwStrength.color }}>{pwStrength.label}</span>
                        </div>
                        <div style={{ width: '100%', height: '4px', background: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
                          <div style={{ width: `${(pwStrength.score / 4) * 100}%`, height: '100%', background: pwStrength.color, transition: 'all 200ms ease' }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>
                      CONFIRM NEW PASSWORD
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showConfirmPw ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        style={{
                          width: '100%',
                          padding: '10px 36px 10px 12px',
                          borderRadius: '12px',
                          border: '1px solid var(--color-border)',
                          background: 'var(--color-surface)',
                          color: 'var(--color-text-primary)',
                          fontSize: '13px',
                          outline: 'none'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPw(!showConfirmPw)}
                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                      >
                        {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={{
                      marginTop: '4px',
                      padding: '10px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)'
                    }}
                  >
                    Change Password
                  </button>
                </form>
              </div>

              {/* Two-Factor Authentication (2FA) */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--color-bg)', borderRadius: '14px', border: '1px solid var(--color-border)' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Shield size={16} color="#0EA5E9" /> Two-Factor Authentication (2FA)
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    Requires authenticator app code on login
                  </div>
                </div>
                <button
                  onClick={() => {
                    const next = !twoFactorEnabled;
                    setTwoFactorEnabled(next);
                    onUpdateUser({ twoFactorEnabled: next });
                  }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    border: 'none',
                    background: twoFactorEnabled ? '#16A34A' : '#CBD5E1',
                    color: twoFactorEnabled ? '#FFFFFF' : '#64748B',
                    fontWeight: 600,
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  {twoFactorEnabled ? 'ENABLED' : 'OFF'}
                </button>
              </div>

              {/* Biometrics & Passcode Lock */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--color-bg)', borderRadius: '14px', border: '1px solid var(--color-border)' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Fingerprint size={16} color="#7C3AED" /> Biometric / PIN Lock
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    Unlock app with Face ID or Fingerprint
                  </div>
                </div>
                <button
                  onClick={() => {
                    const next = !biometricsEnabled;
                    setBiometricsEnabled(next);
                    onUpdateUser({ biometricsEnabled: next });
                  }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    border: 'none',
                    background: biometricsEnabled ? '#2563EB' : '#CBD5E1',
                    color: biometricsEnabled ? '#FFFFFF' : '#64748B',
                    fontWeight: 600,
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  {biometricsEnabled ? 'ACTIVE' : 'OFF'}
                </button>
              </div>

              {/* Auto-Lock Timeout */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--color-bg)', borderRadius: '14px', border: '1px solid var(--color-border)' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>Auto-Lock Timeout</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>App lock when inactive</div>
                </div>
                <select
                  value={autoLockTimeout}
                  onChange={(e) => setAutoLockTimeout(e.target.value)}
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
                  <option value="immediate">Immediately</option>
                  <option value="1m">1 Minute</option>
                  <option value="5m">5 Minutes</option>
                  <option value="15m">15 Minutes</option>
                </select>
              </div>

              {/* Ghost Mode Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--color-bg)', borderRadius: '14px', border: '1px solid var(--color-border)' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <EyeOff size={16} color="#64748B" /> Ghost Mode
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    Hide online status and last seen timestamp
                  </div>
                </div>
                <button
                  onClick={() => {
                    const next = !ghostMode;
                    setGhostMode(next);
                    onUpdateUser({ ghostMode: next });
                  }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    border: 'none',
                    background: ghostMode ? '#6366F1' : '#CBD5E1',
                    color: ghostMode ? '#FFFFFF' : '#64748B',
                    fontWeight: 600,
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  {ghostMode ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Active Logged-In Devices */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Monitor size={16} color="#10B981" /> Active Recognized Devices
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--color-bg)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Smartphone size={18} color="#2563EB" />
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700 }}>Android 14 App (This Device)</div>
                        <div style={{ fontSize: '10px', color: '#16A34A', fontWeight: 600 }}>● Active Now</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* 📡 DISCOVERABILITY & LOCATION SUB-SECTION */}
          {activeSection === 'discoverability' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              {/* Nearby Visibility */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px',
                background: 'var(--color-bg)',
                borderRadius: '16px',
                border: '1px solid var(--color-border)'
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>Nearby Visibility</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    {currentUser.visibility ? "Opted in to nearby discovery radar" : "Hidden from nearby users"}
                  </div>
                </div>

                <button
                  onClick={() => onUpdateUser({ visibility: !currentUser.visibility, isVerified: true })}
                  disabled={panicActive}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    border: 'none',
                    background: currentUser.visibility ? '#2563EB' : '#CBD5E1',
                    color: currentUser.visibility ? '#FFFFFF' : '#64748B',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: !panicActive ? 'pointer' : 'not-allowed'
                  }}
                >
                  {currentUser.visibility ? 'ENABLED' : 'OFF'}
                </button>
              </div>

              {/* Discovery Radius */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: 'var(--color-bg)', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>Discovery Search Radius</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Distance limit for matches</div>
                </div>
                <select
                  value={currentUser.radius}
                  onChange={(e) => onUpdateUser({ radius: e.target.value })}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '9999px',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface)',
                    color: 'var(--color-text-primary)',
                    fontSize: '12px',
                    fontWeight: 700,
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

              {/* Account Privacy Mode */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  Account Privacy Profile
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

            </div>
          )}

          {/* 🔔 NOTIFICATIONS & PREFERENCES SUB-SECTION */}
          {activeSection === 'notifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--color-bg)', borderRadius: '14px', border: '1px solid var(--color-border)' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>Push Notifications</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Master alert toggle</div>
                </div>
                <button
                  onClick={() => setPushNotifications(!pushNotifications)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    border: 'none',
                    background: pushNotifications ? '#2563EB' : '#CBD5E1',
                    color: pushNotifications ? '#FFFFFF' : '#64748B',
                    fontWeight: 600,
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  {pushNotifications ? 'ON' : 'OFF'}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--color-bg)', borderRadius: '14px', border: '1px solid var(--color-border)' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>Message & Call Sound Tones</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Play audio chimes</div>
                </div>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    border: 'none',
                    background: soundEnabled ? '#2563EB' : '#CBD5E1',
                    color: soundEnabled ? '#FFFFFF' : '#64748B',
                    fontWeight: 600,
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  {soundEnabled ? 'ON' : 'OFF'}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--color-bg)', borderRadius: '14px', border: '1px solid var(--color-border)' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>Haptic Vibrations</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Tactile feedback on taps</div>
                </div>
                <button
                  onClick={() => setVibrationEnabled(!vibrationEnabled)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    border: 'none',
                    background: vibrationEnabled ? '#2563EB' : '#CBD5E1',
                    color: vibrationEnabled ? '#FFFFFF' : '#64748B',
                    fontWeight: 600,
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  {vibrationEnabled ? 'ON' : 'OFF'}
                </button>
              </div>

            </div>
          )}

          {/* 🛡️ SAFETY & EMERGENCY SHIELD SUB-SECTION */}
          {activeSection === 'safety' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              {/* Panic Pause Mode */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px',
                background: panicActive ? '#FEF2F2' : 'var(--color-bg)',
                borderRadius: '16px',
                border: panicActive ? '1px solid #FEE2E2' : '1px solid var(--color-border)'
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: panicActive ? '#EF4444' : 'var(--color-text-primary)' }}>
                    Panic Pause Mode
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    Instant privacy shield to conceal your presence
                  </div>
                </div>
                <button
                  onClick={onTogglePanic}
                  className={`btn ${panicActive ? 'btn-danger' : 'btn-secondary'}`}
                  style={{ padding: '8px 16px', fontSize: '12px' }}
                >
                  <ShieldAlert size={15} />
                  {panicActive ? 'PAUSED' : 'PAUSE'}
                </button>
              </div>

              {/* Blocked Users Manager */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                  Blocked Accounts ({blockedUserIds.length})
                </h4>
                {blockedUserIds.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {blockedUserIds.map((userId) => (
                      <div key={userId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--color-bg)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>Blocked User ID ({userId})</span>
                        {onUnblockUser && (
                          <button
                            onClick={() => onUnblockUser(userId)}
                            style={{ padding: '4px 10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Unblock
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '14px', background: 'var(--color-bg)', borderRadius: '14px', textAlign: 'center', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                    No blocked accounts yet.
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ⚙️ ACCOUNT & STORAGE SUB-SECTION */}
          {activeSection === 'account' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              {/* Download My Data */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: 'var(--color-bg)', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Download size={16} color="#2563EB" /> Download My Data
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    Export profile, posts and settings archive
                  </div>
                </div>
                <button
                  onClick={handleDownloadMyData}
                  disabled={downloadingData}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '12px',
                    border: 'none',
                    background: downloadSuccess ? '#DCFCE7' : 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                    color: downloadSuccess ? '#15803D' : '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {downloadingData && <RefreshCw size={14} className="spin" />}
                  {downloadSuccess ? 'Downloaded!' : 'Export JSON'}
                </button>
              </div>

              {/* Clear App Cache */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: 'var(--color-bg)', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>App Cache Storage</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    Occupied Space: <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{cacheSize}</span>
                  </div>
                </div>
                <button
                  onClick={handleClearCache}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border)',
                    background: cacheCleared ? '#DCFCE7' : 'var(--color-surface)',
                    color: cacheCleared ? '#15803D' : 'var(--color-text-primary)',
                    fontWeight: 600,
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  {cacheCleared ? 'Cleared!' : 'Clear Cache'}
                </button>
              </div>

              {/* Danger Zone: Delete Account */}
              <div style={{ marginTop: '10px', padding: '14px', borderRadius: '16px', background: '#FEF2F2', border: '1px solid #FEE2E2' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#EF4444', marginBottom: '4px' }}>
                  Danger Zone
                </h4>
                <p style={{ fontSize: '12px', color: '#991B1B', marginBottom: '10px', lineHeight: '16px' }}>
                  Permanently delete your profile, messages, connections and account data.
                </p>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '12px',
                    background: '#EF4444',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Delete Account
                </button>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 300,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div style={{ background: 'var(--color-surface)', padding: '24px', borderRadius: '20px', maxWidth: '320px', width: '100%', display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FEF2F2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              <Trash2 size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Are you absolutely sure?</h3>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                This action cannot be undone. All your posts, chats, and connections will be wiped.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  onClose();
                  if (onLogout) onLogout();
                }}
                style={{ flex: 1, padding: '10px', borderRadius: '12px', background: '#EF4444', color: '#FFF', border: 'none', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

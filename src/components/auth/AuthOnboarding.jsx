import React, { useState, useEffect } from 'react';
import { 
  LocateFixed, Phone, Mail, Lock, Eye, EyeOff, ArrowRight, KeyRound, 
  CheckCircle2, ShieldCheck, User, Calendar, Check, ChevronRight, ArrowLeft
} from 'lucide-react';

export default function AuthOnboarding({ existingUsers = [], onCompleteAuth }) {
  const [authMode, setAuthMode] = useState('phone'); // 'phone' | 'email'
  const [step, setStep] = useState(1); // 1: Credentials, 2: OTP Verification, 3: New Profile Onboarding
  
  // Phone State
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('555-0192');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpInput, setOtpInput] = useState(['', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  
  // Email State
  const [email, setEmail] = useState('alex.chen@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  // New Profile State
  const [isNewAccount, setIsNewAccount] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('24');
  const [selectedInterests, setSelectedInterests] = useState(['Coffee', 'Design', 'Hiking']);
  
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const cleanPhoneDigits = phoneNumber.replace(/\D/g, '');
  const fullPhone = `${countryCode} ${phoneNumber.trim()}`;

  useEffect(() => {
    let interval;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Demo Login Quick-Select
  const handleQuickDemoLogin = (demoUser) => {
    onCompleteAuth({
      phone: demoUser?.phone || '+1 555-0192',
      name: demoUser?.name || 'Alex Chen',
      age: demoUser?.age || 24
    });
  };

  // Step 1 Submit
  const handleSendCredentials = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (authMode === 'phone') {
      if (cleanPhoneDigits.length < 5) {
        setErrorMsg('Please enter a valid phone number.');
        return;
      }

      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(code);
      setStep(2);
      setResendTimer(30);
      setCanResend(false);
      setOtpInput(['', '', '', '']);

      const existing = existingUsers.find(
        (u) => u.phone && u.phone.replace(/\D/g, '') === cleanPhoneDigits
      );
      setIsNewAccount(!existing);
    } else {
      if (!email.includes('@')) {
        setErrorMsg('Please enter a valid email address.');
        return;
      }
      if (password.length < 4) {
        setErrorMsg('Password must be at least 4 characters.');
        return;
      }

      onCompleteAuth({
        email: email.trim(),
        name: email.split('@')[0],
        age: 24
      });
    }
  };

  // Resend OTP
  const handleResendOtp = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setResendTimer(30);
    setCanResend(false);
    setOtpInput(['', '', '', '']);
    setInfoMsg('A new verification code was sent.');
  };

  // Auto-fill Demo OTP Code
  const handleAutoFillOtp = () => {
    if (generatedOtp) {
      setOtpInput(generatedOtp.split(''));
      setErrorMsg('');
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpInput];
    newOtp[index] = value.slice(-1);
    setOtpInput(newOtp);

    if (value && index < 3) {
      const nextInput = document.getElementById(`pro-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    const enteredCode = otpInput.join('');

    if (enteredCode.length < 4) {
      setErrorMsg('Please enter the 4-digit code.');
      return;
    }

    if (enteredCode !== generatedOtp) {
      setErrorMsg(`Invalid code. Use ${generatedOtp} for demo.`);
      return;
    }

    if (isNewAccount) {
      setStep(3);
    } else {
      onCompleteAuth({ phone: fullPhone });
    }
  };

  // Complete New Profile Setup
  const handleCompleteProfile = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    onCompleteAuth({
      phone: fullPhone,
      name: name.trim(),
      age: parseInt(age, 10) || 24,
      interests: selectedInterests
    });
  };

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else if (selectedInterests.length < 5) {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 300,
      background: 'var(--color-bg)',
      color: 'var(--color-text-primary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      overflowY: 'auto'
    }}>
      {/* Main Card Container */}
      <div style={{
        width: '100%',
        maxWidth: '380px',
        background: 'var(--color-surface)',
        borderRadius: '24px',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-modal)',
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        
        {/* Brand Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'var(--color-primary)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)'
          }}>
            <LocateFixed size={28} strokeWidth={2.2} />
          </div>

          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
              Welcome to Radius
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '3px' }}>
              Connect with people and events around you
            </p>
          </div>
        </div>

        {/* STEP 1: LOGIN CREDENTIALS FORM */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* Third-Party Social Auth Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Google Auth Button */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin(existingUsers[0])}
                style={{
                  width: '100%',
                  padding: '11px 16px',
                  borderRadius: '14px',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  transition: 'background 150ms ease'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.32 21.36 7.39 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.39 0 3.32 2.64 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
                <span>Continue with Google</span>
              </button>


            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
              <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
            </div>

            {/* Mode Switcher: Phone vs Email */}
            <div style={{
              display: 'flex',
              background: 'var(--color-bg)',
              padding: '3px',
              borderRadius: '12px',
              border: '1px solid var(--color-border)'
            }}>
              <button
                type="button"
                onClick={() => { setAuthMode('phone'); setErrorMsg(''); }}
                style={{
                  flex: 1,
                  padding: '7px 10px',
                  borderRadius: '9px',
                  background: authMode === 'phone' ? 'var(--color-surface)' : 'transparent',
                  color: authMode === 'phone' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  border: 'none',
                  boxShadow: authMode === 'phone' ? 'var(--shadow-sm)' : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Phone size={13} />
                Phone Number
              </button>

              <button
                type="button"
                onClick={() => { setAuthMode('email'); setErrorMsg(''); }}
                style={{
                  flex: 1,
                  padding: '7px 10px',
                  borderRadius: '9px',
                  background: authMode === 'email' ? 'var(--color-surface)' : 'transparent',
                  color: authMode === 'email' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  border: 'none',
                  boxShadow: authMode === 'email' ? 'var(--shadow-sm)' : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Mail size={13} />
                Email Address
              </button>
            </div>

            {/* Credentials Form */}
            <form onSubmit={handleSendCredentials} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {authMode === 'phone' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
                    PHONE NUMBER
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '14px',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-bg)',
                    padding: '0 12px'
                  }}>
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--color-text-primary)',
                        fontSize: '13px',
                        fontWeight: 600,
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+61">🇦🇺 +61</option>
                      <option value="+81">🇯🇵 +81</option>
                    </select>

                    <div style={{ width: '1px', height: '20px', background: 'var(--color-border)', margin: '0 8px' }} />

                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="555-0192"
                      required
                      style={{
                        flex: 1,
                        padding: '12px 0',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--color-text-primary)',
                        fontSize: '14px',
                        fontWeight: 600,
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
                      EMAIL
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex.chen@example.com"
                      required
                      style={{
                        padding: '11px 14px',
                        borderRadius: '14px',
                        border: '1px solid var(--color-border)',
                        background: 'var(--color-bg)',
                        color: 'var(--color-text-primary)',
                        fontSize: '13.5px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
                      PASSWORD
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        style={{
                          width: '100%',
                          padding: '11px 36px 11px 14px',
                          borderRadius: '14px',
                          border: '1px solid var(--color-border)',
                          background: 'var(--color-bg)',
                          color: 'var(--color-text-primary)',
                          fontSize: '13.5px',
                          outline: 'none'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div style={{ fontSize: '12px', color: '#EF4444', fontWeight: 500 }}>
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '13px',
                  borderRadius: '14px',
                  background: 'var(--color-primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
                }}
              >
                <span>Continue</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: VERIFICATION OTP CODE */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  Enter verification code
                </h2>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  Sent to {fullPhone}
                </p>
              </div>
            </div>

            {/* Quick Demo Pill */}
            <div
              onClick={handleAutoFillOtp}
              style={{
                background: 'var(--color-primary-light)',
                border: '1px solid var(--color-primary-ring)',
                borderRadius: '12px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                fontSize: '12px',
                color: 'var(--color-primary)'
              }}
            >
              <span>Demo OTP: <strong>{generatedOtp}</strong></span>
              <span style={{ fontWeight: 700, textDecoration: 'underline' }}>Tap to Auto-fill</span>
            </div>

            {/* 4 Digit Code Inputs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              {[0, 1, 2, 3].map((idx) => (
                <input
                  key={idx}
                  id={`pro-otp-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otpInput[idx]}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  style={{
                    width: '54px',
                    height: '56px',
                    borderRadius: '14px',
                    border: otpInput[idx] ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    background: 'var(--color-bg)',
                    color: 'var(--color-text-primary)',
                    fontSize: '22px',
                    fontWeight: 700,
                    textAlign: 'center',
                    outline: 'none'
                  }}
                />
              ))}
            </div>

            {errorMsg && (
              <div style={{ fontSize: '12px', color: '#EF4444', textAlign: 'center', fontWeight: 500 }}>
                {errorMsg}
              </div>
            )}
            {infoMsg && (
              <div style={{ fontSize: '12px', color: '#16A34A', textAlign: 'center', fontWeight: 500 }}>
                {infoMsg}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
              >
                Change number
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend}
                style={{
                  background: 'none',
                  border: 'none',
                  color: canResend ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  cursor: canResend ? 'pointer' : 'default'
                }}
              >
                {canResend ? 'Resend code' : `Resend in ${resendTimer}s`}
              </button>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '14px',
                background: 'var(--color-primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
              }}
            >
              Verify Code
            </button>
          </form>
        )}

        {/* STEP 3: PROFILE SETUP */}
        {step === 3 && (
          <form onSubmit={handleCompleteProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                Complete your profile
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                Set your public display info
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-secondary)' }}>FULL NAME</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Chen"
                required
                style={{
                  padding: '11px 14px',
                  borderRadius: '14px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-bg)',
                  color: 'var(--color-text-primary)',
                  fontSize: '13.5px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-secondary)' }}>AGE</label>
              <input
                type="number"
                min="18"
                max="99"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                style={{
                  padding: '11px 14px',
                  borderRadius: '14px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-bg)',
                  color: 'var(--color-text-primary)',
                  fontSize: '13.5px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-secondary)' }}>INTERESTS</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {['Coffee', 'Hiking', 'Design', 'Bouldering', 'Photography', 'Music'].map((item) => {
                  const active = selectedInterests.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleInterest(item)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '9999px',
                        background: active ? 'var(--color-primary)' : 'var(--color-bg)',
                        color: active ? '#FFFFFF' : 'var(--color-text-secondary)',
                        border: active ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {active ? `✓ ${item}` : item}
                    </button>
                  );
                })}
              </div>
            </div>

            {errorMsg && (
              <div style={{ fontSize: '12px', color: '#EF4444' }}>
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '14px',
                background: 'var(--color-primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
              }}
            >
              Get Started
            </button>
          </form>
        )}

        {/* Footer Legal Terms */}
        <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', textAlign: 'center', lineHeight: '15px' }}>
          By continuing, you agree to Radius's <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Terms</span> & <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}

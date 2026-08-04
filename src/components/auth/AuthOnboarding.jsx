import React, { useState, useEffect } from 'react';
import { Waves, Phone, ShieldCheck, ArrowRight, KeyRound, CheckCircle2 } from 'lucide-react';

export default function AuthOnboarding({ existingUsers = [], onCompleteAuth }) {
  const [step, setStep] = useState(1); // 1: Phone Number Input, 2: OTP Verification, 3: Profile Info for New Account
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('555-0192');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpInput, setOtpInput] = useState(['', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // New user registration fields if phone isn't registered yet
  const [isNewAccount, setIsNewAccount] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('24');

  // Format full phone number
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

  // Step 1: Send OTP
  const handleSendOtp = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (cleanPhoneDigits.length < 5) {
      setErrorMsg('Please enter a valid phone number.');
      return;
    }

    // Generate random 4-digit OTP code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setStep(2);
    setResendTimer(30);
    setCanResend(false);
    setOtpInput(['', '', '', '']);

    // Check if phone number already exists in registered accounts
    const existing = existingUsers.find(
      (u) => u.phone && u.phone.replace(/\D/g, '') === cleanPhoneDigits
    );
    setIsNewAccount(!existing);
  };

  // Resend OTP
  const handleResendOtp = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setResendTimer(30);
    setCanResend(false);
    setOtpInput(['', '', '', '']);
    setErrorMsg('A new OTP code has been sent!');
  };

  // Auto-fill demo OTP code
  const handleAutoFillOtp = () => {
    if (generatedOtp) {
      setOtpInput(generatedOtp.split(''));
      setErrorMsg('');
    }
  };

  // Handle OTP digit inputs
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpInput];
    newOtp[index] = value.slice(-1);
    setOtpInput(newOtp);

    // Focus next input box automatically
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const enteredCode = otpInput.join('');

    if (enteredCode.length < 4) {
      setErrorMsg('Please enter the complete 4-digit OTP code.');
      return;
    }

    if (enteredCode !== generatedOtp) {
      setErrorMsg(`Invalid OTP code. Please enter ${generatedOtp}.`);
      return;
    }

    // If new account, proceed to Step 3 for display name and age
    if (isNewAccount) {
      setStep(3);
    } else {
      // Existing account -> finish login directly
      onCompleteAuth({
        phone: fullPhone
      });
    }
  };

  // Step 3: Complete New Account Setup
  const handleCompleteNewAccount = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }

    onCompleteAuth({
      phone: fullPhone,
      name: name.trim(),
      age: parseInt(age, 10) || 24
    });
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
      padding: '24px',
      overflowY: 'auto'
    }}>
      <div className="animate-fade-up neptune-gradient-shell" style={{ width: '100%', maxWidth: '380px' }}>
        <div className="neptune-gradient-shell-inner" style={{
          padding: '28px 22px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          textAlign: 'center',
          background: 'var(--color-surface)',
          color: 'var(--color-text-primary)'
        }}>
          {/* Brand Header & App Logo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)',
              border: '2px solid rgba(255, 255, 255, 0.8)',
              background: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src="/logo.png"
                alt="Neptune Base Logo"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', lineHeight: '26px' }}>
                Neptune Base
              </h1>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#2563EB', marginTop: '2px' }}>
                Seamless Subsea Social Discovery
              </p>
            </div>
          </div>

          {/* STEP 1: Enter Phone Number */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: '14px',
                padding: '12px 14px',
                textAlign: 'left',
                fontSize: '12px',
                color: 'var(--color-text-secondary)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px'
              }}>
                <ShieldCheck size={18} color="#2563EB" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--color-text-primary)' }}>One Account Per Phone Number:</strong> Enter your mobile number to log in or register your account via OTP SMS.
                </div>
              </div>

              {/* Phone Input Box */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Mobile Phone Number
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    style={{
                      padding: '12px 8px',
                      borderRadius: '12px',
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-bg)',
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

                  <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '0 14px',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-bg)'
                  }}>
                    <Phone size={16} color="var(--color-text-secondary)" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. 555-0192"
                      required
                      style={{
                        width: '100%',
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
              </div>

              {errorMsg && (
                <div style={{ fontSize: '12px', color: '#EF4444', fontWeight: 500, textAlign: 'left' }}>
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '13px', fontSize: '14px', borderRadius: '9999px', marginTop: '4px' }}
              >
                <span>Send OTP Code</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* STEP 2: Enter OTP Code */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  Enter Verification Code
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                  SMS sent to <strong style={{ color: 'var(--color-text-primary)' }}>{fullPhone}</strong>
                </p>
              </div>

              {/* Demo Simulated OTP Hint Badge */}
              <div
                onClick={handleAutoFillOtp}
                style={{
                  background: 'rgba(37, 99, 235, 0.1)',
                  border: '1px dashed #2563EB',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: '#2563EB'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <KeyRound size={16} />
                  <span>Demo OTP Code: <strong>{generatedOtp}</strong></span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, textDecoration: 'underline' }}>Auto-fill</span>
              </div>

              {/* 4 Digit Boxes */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '4px 0' }}>
                {[0, 1, 2, 3].map((idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otpInput[idx]}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    style={{
                      width: '52px',
                      height: '56px',
                      borderRadius: '14px',
                      border: otpInput[idx] ? '2px solid #2563EB' : '1px solid var(--color-border)',
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
                <div style={{ fontSize: '12px', color: errorMsg.includes('sent') ? '#22C55E' : '#EF4444', fontWeight: 500 }}>
                  {errorMsg}
                </div>
              )}

              {/* Resend & Change Phone buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Change Number
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={!canResend}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: canResend ? '#2563EB' : 'var(--color-text-secondary)',
                    fontWeight: canResend ? 600 : 400,
                    cursor: canResend ? 'pointer' : 'default'
                  }}
                >
                  {canResend ? 'Resend Code' : `Resend in ${resendTimer}s`}
                </button>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '13px', fontSize: '14px', borderRadius: '9999px', marginTop: '4px' }}
              >
                Verify & Log In
              </button>
            </form>
          )}

          {/* STEP 3: Complete Profile Info for NEW Accounts */}
          {step === 3 && (
            <form onSubmit={handleCompleteNewAccount} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  background: 'rgba(34, 197, 94, 0.15)',
                  color: '#22C55E',
                  fontSize: '12px',
                  fontWeight: 600,
                  marginBottom: '8px'
                }}>
                  <CheckCircle2 size={14} /> Phone Verified
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  Create Your Profile
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  Account tied to {fullPhone}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name (e.g. Jordan)"
                  required
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-bg)',
                    color: 'var(--color-text-primary)',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Age</label>
                <input
                  type="number"
                  min="18"
                  max="99"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-bg)',
                    color: 'var(--color-text-primary)',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              {errorMsg && (
                <div style={{ fontSize: '12px', color: '#EF4444', fontWeight: 500, textAlign: 'left' }}>
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '13px', fontSize: '14px', borderRadius: '9999px', marginTop: '4px' }}
              >
                Complete Registration & View Home
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

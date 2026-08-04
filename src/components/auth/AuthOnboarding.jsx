import React, { useState, useEffect } from 'react';
import { LocateFixed, Phone, ArrowRight, KeyRound, CheckCircle2, ShieldCheck } from 'lucide-react';

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
  };

  // Resend OTP
  const handleResendOtp = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setResendTimer(30);
    setCanResend(false);
    setOtpInput(['', '', '', '']);
    setErrorMsg('A new code has been sent!');
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
      setErrorMsg('Please enter the 4-digit code.');
      return;
    }

    if (enteredCode !== generatedOtp) {
      setErrorMsg(`Code doesn't match. Try entering ${generatedOtp}.`);
      return;
    }

    if (isNewAccount) {
      setStep(3);
    } else {
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
      padding: '20px',
      overflowY: 'auto'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '380px',
        background: 'var(--color-surface)',
        borderRadius: '28px',
        border: '1px solid var(--color-border)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.08)',
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Radius App Header & Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <LocateFixed size={32} strokeWidth={2.2} />
          </div>

          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
              Radius
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              Discover people around you
            </p>
          </div>
        </div>

        {/* STEP 1: Phone Entry */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                Log in or sign up
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                We'll send you a verification code via SMS.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                PHONE NUMBER
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  style={{
                    padding: '12px 10px',
                    borderRadius: '14px',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-bg)',
                    color: 'var(--color-text-primary)',
                    fontSize: '14px',
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
                  borderRadius: '14px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-bg)'
                }}>
                  <Phone size={16} color="var(--color-text-secondary)" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Mobile number"
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
              <div style={{ fontSize: '12px', color: '#EF4444', fontWeight: 500 }}>
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '9999px',
                background: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '14px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                transition: 'all 150ms ease'
              }}
            >
              <span>Continue</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* STEP 2: Verification Code */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                Enter code
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                Sent to <strong style={{ color: 'var(--color-text-primary)' }}>{fullPhone}</strong>
              </p>
            </div>

            {/* Quick Demo Code Pill */}
            <div
              onClick={handleAutoFillOtp}
              style={{
                background: 'rgba(37, 99, 235, 0.08)',
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
                <KeyRound size={15} />
                <span>Demo Code: <strong>{generatedOtp}</strong></span>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, textDecoration: 'underline' }}>Auto-fill</span>
            </div>

            {/* 4 Digit Boxes */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
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
                    width: '56px',
                    height: '60px',
                    borderRadius: '16px',
                    border: otpInput[idx] ? '2px solid #2563EB' : '1px solid var(--color-border)',
                    background: 'var(--color-bg)',
                    color: 'var(--color-text-primary)',
                    fontSize: '24px',
                    fontWeight: 700,
                    textAlign: 'center',
                    outline: 'none'
                  }}
                />
              ))}
            </div>

            {errorMsg && (
              <div style={{ fontSize: '12px', color: errorMsg.includes('sent') ? '#16A34A' : '#EF4444', fontWeight: 500, textAlign: 'center' }}>
                {errorMsg}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', textDecoration: 'underline' }}
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
                  color: canResend ? '#2563EB' : 'var(--color-text-secondary)',
                  fontWeight: canResend ? 600 : 400,
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
                padding: '14px',
                borderRadius: '9999px',
                background: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
              }}
            >
              Verify & Continue
            </button>
          </form>
        )}

        {/* STEP 3: Complete Profile for New Accounts */}
        {step === 3 && (
          <form onSubmit={handleCompleteNewAccount} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '9999px',
                background: '#DCFCE7',
                color: '#15803D',
                fontSize: '12px',
                fontWeight: 600,
                marginBottom: '8px'
              }}>
                <CheckCircle2 size={14} /> Phone verified
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                Create your profile
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                How should others see you on Radius?
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>YOUR NAME</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jordan"
                required
                style={{
                  padding: '12px 14px',
                  borderRadius: '14px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-bg)',
                  color: 'var(--color-text-primary)',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>AGE</label>
              <input
                type="number"
                min="18"
                max="99"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                style={{
                  padding: '12px 14px',
                  borderRadius: '14px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-bg)',
                  color: 'var(--color-text-primary)',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            {errorMsg && (
              <div style={{ fontSize: '12px', color: '#EF4444', fontWeight: 500 }}>
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '9999px',
                background: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
              }}
            >
              Start Exploring
            </button>
          </form>
        )}

        {/* Footer Legal Terms Notice */}
        <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', textAlign: 'center', lineHeight: '15px' }}>
          By continuing, you agree to Radius's <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Terms of Service</span> & <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}

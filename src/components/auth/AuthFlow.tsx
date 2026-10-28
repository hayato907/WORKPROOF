import React, { useState } from 'react';
import { UserProfile, Language, UserRole } from '../../types';
import { translations } from '../../translations';
import { Keypad } from '../Keypad';
import { HardHat, Briefcase, ArrowLeft, Check, ShieldAlert, Sparkles, ChevronRight, Lock } from 'lucide-react';
import { triggerHaptic } from '../../utils/storage';

interface AuthFlowProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onComplete: (profile: UserProfile) => void;
}

type AuthStep = 'lang' | 'phone' | 'otp' | 'role' | 'name';

export const AuthFlow: React.FC<AuthFlowProps> = ({
  currentLang,
  onLanguageChange,
  onComplete,
}) => {
  const [step, setStep] = useState<AuthStep>('lang');
  const [phone, setPhone] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');
  const [role, setRole] = useState<UserRole>('worker');
  const [name, setName] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');

  const t = translations[currentLang];

  // STEP 1: Language selection
  if (step === 'lang') {
    return (
      <div className="min-h-screen bg-[#090a0f] text-white p-5 flex flex-col justify-between max-w-md mx-auto relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Prototype notice badge */}
        <div className="pt-2 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/90 border border-amber-500/30 text-xs font-bold text-amber-300 shadow-lg backdrop-blur-md">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{t.prototypeNotice}</span>
          </div>
        </div>

        <div className="my-auto space-y-6 text-center relative z-10 py-6">
          <div className="space-y-3">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-[0_10px_30px_rgba(22,163,74,0.4)] border border-white/20">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white">WorkProof</h1>
            <p className="text-2xl font-bold text-zinc-300">{t.languageSelect}</p>
          </div>

          <div className="space-y-3.5 pt-2">
            {/* English */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic(30);
                onLanguageChange('en');
                setStep('phone');
              }}
              className="w-full min-h-[92px] rounded-3xl bg-gradient-to-r from-zinc-900/90 to-zinc-900/60 border border-white/10 text-3xl font-black text-white active:scale-[0.98] active:border-emerald-500 transition-all flex items-center justify-between px-7 shadow-xl cursor-pointer hover:border-white/20"
            >
              <div className="text-left">
                <span>English</span>
                <span className="block text-xs font-bold text-zinc-400">Default language</span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-zinc-800 flex items-center justify-center text-emerald-400">
                <ChevronRight className="w-6 h-6 stroke-[2.5]" />
              </div>
            </button>

            {/* Hindi */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic(30);
                onLanguageChange('hi');
                setStep('phone');
              }}
              className="w-full min-h-[92px] rounded-3xl bg-gradient-to-r from-zinc-900/90 to-zinc-900/60 border border-white/10 text-3xl font-black text-white active:scale-[0.98] active:border-emerald-500 transition-all flex items-center justify-between px-7 shadow-xl cursor-pointer hover:border-white/20"
            >
              <div className="text-left">
                <span>हिंदी</span>
                <span className="block text-xs font-bold text-zinc-400">हिन्दी भाषा</span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-zinc-800 flex items-center justify-center text-emerald-400">
                <ChevronRight className="w-6 h-6 stroke-[2.5]" />
              </div>
            </button>

            {/* Marathi */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic(30);
                onLanguageChange('mr');
                setStep('phone');
              }}
              className="w-full min-h-[92px] rounded-3xl bg-gradient-to-r from-zinc-900/90 to-zinc-900/60 border border-white/10 text-3xl font-black text-white active:scale-[0.98] active:border-emerald-500 transition-all flex items-center justify-between px-7 shadow-xl cursor-pointer hover:border-white/20"
            >
              <div className="text-left">
                <span>मराठी</span>
                <span className="block text-xs font-bold text-zinc-400">मराठी भाषा</span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-zinc-800 flex items-center justify-center text-emerald-400">
                <ChevronRight className="w-6 h-6 stroke-[2.5]" />
              </div>
            </button>
          </div>
        </div>

        <div className="text-center text-xs font-bold text-zinc-500 pb-4 relative z-10">
          WorkProof • Daily Wage Proof & Punch-in
        </div>
      </div>
    );
  }

  // STEP 2: Phone number
  if (step === 'phone') {
    const isPhoneValid = phone.length === 10;
    return (
      <div className="min-h-screen bg-[#090a0f] text-white p-5 flex flex-col justify-between max-w-md mx-auto">
        <div>
          <button
            type="button"
            onClick={() => {
              triggerHaptic(20);
              setStep('lang');
            }}
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white font-bold text-xl py-2 cursor-pointer transition"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>{t.back}</span>
          </button>

          <div className="mt-3 text-center">
            <h2 className="text-3xl font-black text-white tracking-tight">{t.enterPhoneTitle}</h2>
            <p className="text-sm text-zinc-400 mt-1 font-medium">{t.prototypeNotice}</p>
          </div>

          {/* Number Display Card */}
          <div className="mt-5 mb-4 p-5 rounded-3xl bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-white/10 text-center shadow-2xl relative overflow-hidden">
            <div className="text-4xl font-mono font-black tracking-widest text-white">
              {phone ? (
                <span>{phone.slice(0, 5)} {phone.slice(5)}</span>
              ) : (
                <span className="text-zinc-600 font-normal tracking-normal text-3xl">Enter 10 digits</span>
              )}
            </div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 mt-2">
              {phone.length} / 10 {currentLang === 'hi' ? 'अंक' : currentLang === 'mr' ? 'अंक' : 'digits'}
            </div>
          </div>
        </div>

        {/* Big Keypad */}
        <div className="my-auto">
          <Keypad
            value={phone}
            maxLength={10}
            onChange={(val) => setPhone(val)}
            onSubmit={() => {
              if (isPhoneValid) setStep('otp');
            }}
            submitDisabled={!isPhoneValid}
            submitLabel={t.next}
            submitColor="green"
          />
        </div>

        {/* Big full-width Next Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              if (isPhoneValid) {
                triggerHaptic(35);
                setStep('otp');
              }
            }}
            disabled={!isPhoneValid}
            className={`w-full min-h-[90px] rounded-3xl font-black text-3xl flex items-center justify-center gap-3 shadow-2xl transition cursor-pointer ${
              isPhoneValid
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-[0_10px_35px_rgba(22,163,74,0.45)] active:scale-[0.98]'
                : 'bg-zinc-900/60 text-zinc-500 border border-white/5 opacity-50 cursor-not-allowed'
            }`}
          >
            <span>{t.next}</span>
            <Check className="w-8 h-8 stroke-[3]" />
          </button>
        </div>
      </div>
    );
  }

  // STEP 3: OTP Screen
  if (step === 'otp') {
    const handleVerifyOtp = () => {
      triggerHaptic(35);
      if (otp === '123456') {
        setOtpError('');
        setStep('role');
      } else {
        setOtpError(t.otpError);
      }
    };

    return (
      <div className="min-h-screen bg-[#090a0f] text-white p-5 flex flex-col justify-between max-w-md mx-auto">
        <div>
          <button
            type="button"
            onClick={() => {
              triggerHaptic(20);
              setStep('phone');
            }}
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white font-bold text-xl py-2 cursor-pointer transition"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>{t.back}</span>
          </button>

          <div className="mt-3 text-center">
            <h2 className="text-3xl font-black text-white tracking-tight">{t.enterOtpTitle}</h2>
            {/* Clear Hint Pill */}
            <div className="mt-2.5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-extrabold text-base shadow-lg">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{t.otpHint}</span>
            </div>
          </div>

          {/* OTP Box Display */}
          <div className="mt-5 mb-2 p-5 rounded-3xl bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-white/10 text-center shadow-2xl">
            <div className="text-4xl font-mono font-black tracking-widest text-white">
              {otp ? otp.padEnd(6, '•') : '••••••'}
            </div>
          </div>

          {otpError && (
            <div className="text-center font-bold text-red-400 text-base mt-2">
              {otpError}
            </div>
          )}
        </div>

        {/* Keypad */}
        <div className="my-auto">
          <Keypad
            value={otp}
            maxLength={6}
            onChange={(val) => {
              setOtp(val);
              if (otpError) setOtpError('');
              if (val === '123456') {
                triggerHaptic(40);
                setTimeout(() => setStep('role'), 200);
              }
            }}
            onSubmit={handleVerifyOtp}
            submitDisabled={otp.length !== 6}
            submitLabel={t.confirm}
            submitColor="green"
          />
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleVerifyOtp}
            disabled={otp.length !== 6}
            className={`w-full min-h-[90px] rounded-3xl font-black text-3xl flex items-center justify-center gap-3 shadow-2xl transition cursor-pointer ${
              otp.length === 6
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-[0_10px_35px_rgba(22,163,74,0.45)] active:scale-[0.98]'
                : 'bg-zinc-900/60 text-zinc-500 border border-white/5 opacity-50 cursor-not-allowed'
            }`}
          >
            <span>{t.confirm}</span>
            <Check className="w-8 h-8 stroke-[3]" />
          </button>
        </div>
      </div>
    );
  }

  // STEP 4: Role selection
  if (step === 'role') {
    return (
      <div className="min-h-screen bg-[#090a0f] text-white p-5 flex flex-col justify-between max-w-md mx-auto">
        <div>
          <button
            type="button"
            onClick={() => {
              triggerHaptic(20);
              setStep('otp');
            }}
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white font-bold text-xl py-2 cursor-pointer transition"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>{t.back}</span>
          </button>

          <div className="mt-4 text-center">
            <h2 className="text-4xl font-black text-white tracking-tight">{t.chooseRoleTitle}</h2>
          </div>
        </div>

        {/* Modern Role Cards */}
        <div className="my-auto space-y-4">
          {/* Worker Card */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic(40);
              setRole('worker');
              setStep('name');
            }}
            className="w-full min-h-[110px] rounded-3xl bg-gradient-to-r from-zinc-900 to-zinc-950 border-2 border-emerald-500/60 hover:border-emerald-400 text-left p-6 active:scale-[0.98] transition-all flex items-center gap-5 shadow-[0_10px_35px_rgba(22,163,74,0.25)] cursor-pointer"
          >
            <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shrink-0 shadow-lg text-white">
              <HardHat className="w-11 h-11 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-3xl font-black text-white leading-tight">
                {t.iAmWorker}
              </div>
              <div className="text-xs font-bold text-emerald-400 mt-1">
                Record work • Send proof on WhatsApp
              </div>
            </div>
          </button>

          {/* Contractor Card */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic(40);
              setRole('contractor');
              setStep('name');
            }}
            className="w-full min-h-[110px] rounded-3xl bg-gradient-to-r from-zinc-900 to-zinc-950 border-2 border-white/10 hover:border-amber-400/60 text-left p-6 active:scale-[0.98] transition-all flex items-center gap-5 shadow-xl cursor-pointer"
          >
            <div className="w-18 h-18 rounded-2xl bg-zinc-800 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-lg text-amber-400">
              <Briefcase className="w-11 h-11 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-3xl font-black text-white leading-tight">
                {t.iAmContractor}
              </div>
              <div className="text-xs font-bold text-zinc-400 mt-1">
                Create jobs • See who is working
              </div>
            </div>
          </button>
        </div>

        <div className="text-center text-xs font-semibold text-zinc-500 pb-2">
          {t.prototypeNotice}
        </div>
      </div>
    );
  }

  // STEP 5: Name input screen
  const handleSubmitProfile = () => {
    triggerHaptic(40);
    const finalName = name.trim();
    if (!finalName) {
      setNameError(t.nameError);
      return;
    }
    const profile: UserProfile = {
      phone,
      role,
      name: finalName,
      joinedJobIds: role === 'worker' ? ['job-12345'] : [],
    };
    onComplete(profile);
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-white p-5 flex flex-col justify-between max-w-md mx-auto">
      <div>
        <button
          type="button"
          onClick={() => {
            triggerHaptic(20);
            setStep('role');
          }}
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white font-bold text-xl py-2 cursor-pointer transition"
        >
          <ArrowLeft className="w-6 h-6" />
          <span>{t.back}</span>
        </button>

        <div className="mt-4 text-center">
          <h2 className="text-4xl font-black text-white tracking-tight">{t.enterNameTitle}</h2>
          <p className="text-base text-emerald-400 font-bold mt-1">
            {role === 'worker' ? '👷 ' + t.iAmWorker : '🏗️ ' + t.iAmContractor}
          </p>
        </div>

        <div className="mt-7 space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError('');
            }}
            placeholder={t.namePlaceholder}
            className="w-full h-20 px-6 rounded-3xl bg-zinc-900 border-2 border-white/10 text-3xl font-bold text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 shadow-2xl transition"
            autoFocus
          />

          {nameError && (
            <p className="text-red-400 font-bold text-base text-center">{nameError}</p>
          )}

          {/* Quick preset name pills */}
          <div className="pt-2">
            <span className="text-xs text-zinc-400 block mb-2 font-bold uppercase tracking-wider">
              Quick Select Demo Name:
            </span>
            <div className="flex flex-wrap gap-2">
              {['Ramesh Kumar', 'Sunita Bai', 'Santosh Patil', 'Amit Sharma'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    triggerHaptic(20);
                    setName(preset);
                    setNameError('');
                  }}
                  className="px-4 py-2 rounded-xl bg-zinc-900/90 border border-white/10 text-sm font-bold text-zinc-300 hover:text-white hover:border-emerald-500/50 active:scale-95 transition cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Giant Confirm Button */}
      <div className="pt-4">
        <button
          type="button"
          onClick={handleSubmitProfile}
          className="w-full min-h-[90px] rounded-3xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black text-3xl flex items-center justify-center gap-3 shadow-[0_10px_35px_rgba(22,163,74,0.45)] active:scale-[0.98] transition cursor-pointer"
        >
          <span>{t.startApp}</span>
          <Check className="w-8 h-8 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ShieldCheck, RotateCcw, HelpCircle, Globe, ChevronDown } from 'lucide-react';
import { Language, UserProfile } from '../types';
import { translations } from '../translations';
import { PWAInstallButton } from './PWAInstallButton';
import { triggerHaptic } from '../utils/storage';
import { DeployGuideModal } from './DeployGuideModal';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  userProfile: UserProfile | null;
  onResetOrSwitch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  userProfile,
  onResetOrSwitch,
}) => {
  const [showDeployGuide, setShowDeployGuide] = useState(false);
  const t = translations[currentLang];

  const cycleLanguage = () => {
    triggerHaptic(25);
    if (currentLang === 'en') onLanguageChange('hi');
    else if (currentLang === 'hi') onLanguageChange('mr');
    else onLanguageChange('en');
  };

  const getLangBadge = () => {
    if (currentLang === 'en') return 'English';
    if (currentLang === 'hi') return 'हिंदी';
    return 'मराठी';
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#090a0f]/85 backdrop-blur-xl border-b border-white/[0.08] px-4 py-3 transition-colors">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2">
          {/* Brand Logo & Active Identity */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-black text-xl shadow-[0_4px_16px_rgba(22,163,74,0.4)] border border-white/20 shrink-0">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-white leading-none">
                  WorkProof
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-black tracking-wide text-emerald-400 uppercase">
                  PWA
                </span>
              </div>
              {userProfile && (
                <div className="text-[11px] font-bold text-zinc-400 truncate max-w-[150px] mt-0.5">
                  <span className="text-emerald-400 font-extrabold">
                    {userProfile.role === 'worker' ? '👷' : '🏗️'}
                  </span>{' '}
                  {userProfile.name}
                </div>
              )}
            </div>
          </div>

          {/* Quick Modern Navigation Actions */}
          <div className="flex items-center gap-1.5">
            {/* Language Switcher Pill */}
            <button
              type="button"
              onClick={cycleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-white/10 text-xs font-bold text-zinc-200 active:scale-95 transition cursor-pointer hover:bg-zinc-800 shadow-sm"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{getLangBadge()}</span>
              <ChevronDown className="w-3 h-3 text-zinc-500" />
            </button>

            {/* PWA Install Button */}
            <PWAInstallButton label={t.installApp} />

            {/* Guide Button */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic(20);
                setShowDeployGuide(true);
              }}
              className="p-2 rounded-xl bg-zinc-900/90 border border-white/10 text-zinc-400 hover:text-white active:scale-95 transition cursor-pointer"
              title="Guide"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Profile Switcher */}
            {userProfile && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(30);
                  onResetOrSwitch();
                }}
                className="p-2 rounded-xl bg-zinc-900/90 border border-white/10 text-zinc-400 hover:text-white active:scale-95 transition cursor-pointer"
                title={t.switchRole}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      <DeployGuideModal
        isOpen={showDeployGuide}
        onClose={() => setShowDeployGuide(false)}
      />
    </>
  );
};

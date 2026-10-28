import React, { useState, useEffect } from 'react';
import { Download, Share2, X } from 'lucide-react';
import { triggerHaptic } from '../utils/storage';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallButton: React.FC<{ label?: string }> = ({ label = 'Install App' }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    // Detect standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIOSDevice);

    const handleBeforePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforePrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforePrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    triggerHaptic(40);
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // General reminder
      alert('To install WorkProof, tap your browser menu (⋮) and select "Add to Home Screen" or "Install App".');
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-green-400 font-bold text-sm active:bg-zinc-700 transition cursor-pointer"
      >
        <Download className="w-4 h-4 text-green-400 stroke-[2.5]" />
        <span>{label}</span>
      </button>

      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-zinc-900 border-2 border-zinc-700 p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Download className="w-6 h-6 text-green-500" />
                Install on iPhone
              </h3>
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="p-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-3 text-base text-zinc-300">
              <p className="flex items-start gap-2">
                <span className="font-bold text-white bg-zinc-800 px-2 py-0.5 rounded">1</span>
                Tap the <Share2 className="w-5 h-5 inline text-blue-400" /> <strong>Share</strong> icon at the bottom of Safari.
              </p>
              <p className="flex items-start gap-2">
                <span className="font-bold text-white bg-zinc-800 px-2 py-0.5 rounded">2</span>
                Scroll down and tap <strong>Add to Home Screen</strong>.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="mt-6 w-full py-3 rounded-xl bg-zinc-800 text-white font-bold text-base hover:bg-zinc-700 cursor-pointer"
            >
              OK, Got it ✓
            </button>
          </div>
        </div>
      )}
    </>
  );
};

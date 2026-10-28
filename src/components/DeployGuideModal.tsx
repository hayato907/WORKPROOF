import React from 'react';
import { X, Smartphone, Globe, Terminal, ShieldCheck } from 'lucide-react';
import { triggerHaptic } from '../utils/storage';

interface DeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeployGuideModal: React.FC<DeployGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 overflow-y-auto">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 border-2 border-zinc-700 p-6 text-white shadow-2xl my-6">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-green-400">
            <Smartphone className="w-7 h-7" />
            Run & Deploy Guide
          </h2>
          <button
            type="button"
            onClick={() => {
              triggerHaptic(20);
              onClose();
            }}
            className="p-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mt-4 space-y-5 text-zinc-300 text-base">
          {/* Section 1: Phone Open */}
          <div className="p-3 rounded-xl bg-zinc-800/80 border border-zinc-700">
            <h3 className="font-bold text-white text-lg flex items-center gap-2 mb-1">
              <Globe className="w-5 h-5 text-blue-400" />
              1. Open on your Phone Right Now
            </h3>
            <p className="text-sm">
              Open the AI Studio dev or preview URL directly in Chrome on Android or Safari on iOS. Tap <strong>Install App</strong> or use <em>Add to Home Screen</em>.
            </p>
          </div>

          {/* Section 2: Run Locally */}
          <div className="p-3 rounded-xl bg-zinc-800/80 border border-zinc-700">
            <h3 className="font-bold text-white text-lg flex items-center gap-2 mb-1">
              <Terminal className="w-5 h-5 text-amber-400" />
              2. How to Run Locally
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-sm font-mono bg-black/60 p-2.5 rounded-lg text-green-300">
              <li>git clone &lt;repo&gt;</li>
              <li>npm install</li>
              <li>npm run dev</li>
              <li className="text-zinc-400 font-sans">Open http://localhost:3000</li>
            </ol>
          </div>

          {/* Section 3: Deploy Free */}
          <div className="p-3 rounded-xl bg-zinc-800/80 border border-zinc-700">
            <h3 className="font-bold text-white text-lg flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              3. Deploy 100% Free (Vercel / Netlify)
            </h3>
            <div className="text-sm space-y-2">
              <p>
                <strong>Vercel:</strong> Push code to GitHub &rarr; import in Vercel &rarr; Framework preset: <em>Vite</em> &rarr; Deploy.
              </p>
              <p>
                <strong>Netlify:</strong> Drag and drop the built <code>dist/</code> folder into Netlify Drop, or connect GitHub.
              </p>
              <p className="text-xs text-zinc-400">
                Works offline and stays saved on each phone because all data is stored in the browser's <code>localStorage</code>!
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            triggerHaptic(30);
            onClose();
          }}
          className="mt-6 w-full h-14 rounded-2xl bg-[#16A34A] text-white font-bold text-xl active:bg-green-700 transition flex items-center justify-center cursor-pointer shadow-lg"
        >
          Got it ✓
        </button>
      </div>
    </div>
  );
};

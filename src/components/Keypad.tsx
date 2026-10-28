import React from 'react';
import { Delete, Check } from 'lucide-react';
import { triggerHaptic } from '../utils/storage';

interface KeypadProps {
  value: string;
  maxLength: number;
  onChange: (val: string) => void;
  onSubmit?: () => void;
  submitDisabled?: boolean;
  submitLabel?: string;
  submitColor?: 'green' | 'blue';
}

export const Keypad: React.FC<KeypadProps> = ({
  value,
  maxLength,
  onChange,
  onSubmit,
  submitDisabled = false,
  submitLabel,
  submitColor = 'green',
}) => {
  const handleDigit = (digit: string) => {
    triggerHaptic(25);
    if (value.length < maxLength) {
      onChange(value + digit);
    }
  };

  const handleDelete = () => {
    triggerHaptic(25);
    if (value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const handleClear = () => {
    triggerHaptic(35);
    onChange('');
  };

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div className="w-full max-w-sm mx-auto select-none">
      <div className="grid grid-cols-3 gap-3">
        {digits.map((digit) => (
          <button
            key={digit}
            type="button"
            onClick={() => handleDigit(digit)}
            className="h-18 rounded-2xl bg-gradient-to-b from-zinc-800/80 to-zinc-900/90 border border-white/10 text-3xl font-black text-white active:from-zinc-700 active:to-zinc-800 active:scale-[0.94] active:border-emerald-500/40 transition-all flex items-center justify-center shadow-lg shadow-black/40 cursor-pointer"
          >
            {digit}
          </button>
        ))}

        {/* Backspace/Delete */}
        <button
          type="button"
          onClick={handleDelete}
          aria-label="Delete"
          className="h-18 rounded-2xl bg-gradient-to-b from-zinc-800/50 to-zinc-900/70 border border-white/5 text-zinc-300 active:bg-zinc-700 active:scale-[0.94] transition-all flex items-center justify-center cursor-pointer shadow-md"
        >
          <Delete className="w-7 h-7 stroke-[2.5]" />
        </button>

        {/* Zero */}
        <button
          type="button"
          onClick={() => handleDigit('0')}
          className="h-18 rounded-2xl bg-gradient-to-b from-zinc-800/80 to-zinc-900/90 border border-white/10 text-3xl font-black text-white active:from-zinc-700 active:to-zinc-800 active:scale-[0.94] active:border-emerald-500/40 transition-all flex items-center justify-center shadow-lg shadow-black/40 cursor-pointer"
        >
          0
        </button>

        {/* Submit or Clear */}
        {onSubmit ? (
          <button
            type="button"
            onClick={() => {
              triggerHaptic(40);
              onSubmit();
            }}
            disabled={submitDisabled}
            className={`h-18 rounded-2xl font-black text-xl active:scale-[0.94] transition-all flex items-center justify-center cursor-pointer shadow-xl ${
              submitDisabled
                ? 'bg-zinc-900/50 border border-white/5 text-zinc-600 opacity-40 cursor-not-allowed'
                : submitColor === 'green'
                ? 'bg-gradient-to-br from-emerald-500 to-green-600 border border-emerald-400 text-white shadow-[0_8px_24px_rgba(22,163,74,0.45)]'
                : 'bg-gradient-to-br from-blue-500 to-indigo-600 border border-blue-400 text-white shadow-[0_8px_24px_rgba(59,130,246,0.45)]'
            }`}
          >
            {submitLabel ? (
              <span className="text-xl font-black">{submitLabel}</span>
            ) : (
              <Check className="w-9 h-9 stroke-[3]" />
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleClear}
            className="h-18 rounded-2xl bg-zinc-900/60 border border-white/5 text-zinc-400 text-lg font-black active:bg-zinc-800 active:scale-[0.94] transition-all flex items-center justify-center cursor-pointer"
          >
            C
          </button>
        )}
      </div>
    </div>
  );
};

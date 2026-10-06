'use client';

import React, { useState } from 'react';
import { useLanguage, Language } from '@/lib/i18n';
import { Globe, Check, ArrowRight, X } from 'lucide-react';

interface LanguageSelectionModalProps {
  isOpen: boolean;
  onClose?: () => void;
  isFirstTime?: boolean;
}

export default function LanguageSelectionModal({
  isOpen,
  onClose,
  isFirstTime = false,
}: LanguageSelectionModalProps) {
  const { language, setLanguage, setHasSelectedInitialLanguage } = useLanguage();
  const [selected, setSelected] = useState<Language>(language);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setLanguage(selected);
    setHasSelectedInitialLanguage(true);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Select Language / भाषा चुनें
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose preferred language / पसंदीदा भाषा चुनें
              </p>
            </div>
          </div>
          {!isFirstTime && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Language Options */}
        <div className="space-y-2.5">
          {/* English Option */}
          <button
            type="button"
            onClick={() => setSelected('en')}
            className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
              selected === 'en'
                ? 'bg-teal-50/80 border-teal-600 shadow-xs'
                : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/70'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🇬🇧</span>
              <div>
                <div className="text-sm font-bold text-slate-900">English</div>
                <div className="text-[11px] text-slate-500">Default application language</div>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                selected === 'en'
                  ? 'bg-teal-700 border-teal-700 text-white'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {selected === 'en' && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </button>

          {/* Hindi Option */}
          <button
            type="button"
            onClick={() => setSelected('hi')}
            className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
              selected === 'hi'
                ? 'bg-teal-50/80 border-teal-600 shadow-xs'
                : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/70'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🇮🇳</span>
              <div>
                <div className="text-sm font-bold text-slate-900">हिंदी (Hindi)</div>
                <div className="text-[11px] text-slate-500">भारतीय ट्रांसपोर्ट और शिपर भाषा</div>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                selected === 'hi'
                  ? 'bg-teal-700 border-teal-700 text-white'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {selected === 'hi' && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </button>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full h-11 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <span>{selected === 'hi' ? 'जारी रखें / आगे बढ़ें' : 'Continue / Proceed'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

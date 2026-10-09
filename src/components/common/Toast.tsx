import React from 'react';
import { Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-[#1C1A19] text-white px-4 py-3 rounded-2xl shadow-2xl border border-[#3A3330] flex items-center gap-3 animate-slide-up">
      <div className="w-6 h-6 rounded-full bg-[#DC143C] flex items-center justify-center shrink-0">
        <Sparkles className="w-3.5 h-3.5 text-white" />
      </div>
      <p className="text-xs font-medium text-stone-200">{toastMessage}</p>
    </div>
  );
};

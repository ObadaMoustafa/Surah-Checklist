import React, { useState, useEffect } from 'react';
import SURAH_NAMES from './assets/soras-names.json';

const STORAGE_KEY = 'quran_memo_tracker_v2';

export default function App() {
  // Initialize state directly from localStorage
  const [memorized, setMemorized] = useState(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : [];
    } catch (e) {
      console.error('Error loading from localStorage', e);
      return [];
    }
  });

  const [showConfirm, setShowConfirm] = useState(false);

  // Update localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memorized));
  }, [memorized]);

  // Toggle surah status
  const toggleSurah = (index) => {
    setMemorized((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  // Reset all data
  const handleReset = () => {
    setMemorized([]);
    setShowConfirm(false);
  };

  return (
    <div
      className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans flex justify-center"
      dir="rtl"
    >
      {/* Container restricted to max-w-4xl for a centered, clean look */}
      <div className="w-full max-w-4xl">
        {/* Header Section - Sticky and compact */}
        <header className="sticky top-4 z-20 flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white/95 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-center sm:text-right">
            <h1 className="text-2xl font-bold text-emerald-800">
              مُتابع التسميع
            </h1>
            <p className="text-slate-500 text-xs mt-0.5">
              اضغط على السورة بعد التسميع
            </p>
          </div>

          <div className="flex items-center gap-4 sm:gap-8">
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-emerald-600">
                {memorized.length} / {SURAH_NAMES.length}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">
                سورة
              </span>
            </div>

            <div className="h-8 w-[1px] bg-slate-100"></div>

            {!showConfirm ? (
              <button
                onClick={() => setShowConfirm(true)}
                className="cursor-pointer bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl transition-all font-bold text-xs border border-red-100 active:scale-95"
              >
                إعادة ضبط
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs font-bold shadow-md"
                >
                  تأكيد؟
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-2 rounded-lg text-xs font-bold"
                >
                  إلغاء
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Surahs Grid - Reduced min-height and adjusted padding */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5">
          {SURAH_NAMES.map((name, index) => {
            const isMemorized = memorized.includes(index);
            return (
              <button
                key={index}
                onClick={() => toggleSurah(index)}
                className={`
                  cursor-pointer relative overflow-hidden p-2.5 md:p-3.5 rounded-xl text-center transition-all duration-200 border flex flex-col items-center justify-center min-h-[55px] md:min-h-[65px]
                  ${
                    isMemorized
                      ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 active:bg-slate-100'
                  }
                `}
              >
                {/* Number Indicator */}
                <span
                  className={`
                  absolute top-0.5 right-1 text-[8px] md:text-[9px] font-bold opacity-40 
                  ${isMemorized ? 'text-white' : 'text-slate-400'}
                `}
                >
                  {index + 1}
                </span>

                {/* Surah Name - Reduced size slightly */}
                <span className="block font-bold text-sm md:text-base leading-tight">
                  {name}
                </span>

                {/* Status Indicator */}
                {isMemorized && (
                  <div className="absolute bottom-1 left-1">
                    <svg
                      className="w-3 h-3 text-white/80"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <footer className="mt-12 py-8 text-center text-slate-400 text-[10px] border-t border-slate-200">
          <p>تم الحفظ تلقائياً في المتصفح • مُرتبة حسب المصحف الشريف</p>
        </footer>
      </div>
    </div>
  );
}

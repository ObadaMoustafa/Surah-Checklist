import React, { useState, useEffect } from 'react';
import SURAH_NAMES from './assets/soras-names.json';
import StudentManager from './components/StudentManager';

const STORAGE_KEY = 'quran_memo_tracker_v3';

export default function App() {
  // Main state for the entire application
  const [data, setData] = useState(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      const parsedData = savedData
        ? JSON.parse(savedData)
        : { students: [], selectedStudentId: null };
      // Basic data validation
      if (parsedData.students && Array.isArray(parsedData.students)) {
        return parsedData;
      }
      return { students: [], selectedStudentId: null };
    } catch (e) {
      console.error('Error loading from localStorage', e);
      return { students: [], selectedStudentId: null };
    }
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Find the currently selected student
  const selectedStudent = data.students.find(
    (s) => s.id === data.selectedStudentId,
  );

  // Update localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // --- Student Management Handlers ---

  const handleSelectStudent = (id) => {
    setData((prev) => ({ ...prev, selectedStudentId: id }));
  };

  const handleAddStudent = (name) => {
    const newStudent = {
      id: Date.now(),
      name,
      memorized: [],
    };
    setData((prev) => ({
      students: [...prev.students, newStudent],
      selectedStudentId: newStudent.id, // Auto-select the new student
    }));
  };

  const handleDeleteStudent = (id) => {
    setStudentToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (studentToDelete) {
      setData((prev) => {
        const newStudents = prev.students.filter(
          (s) => s.id !== studentToDelete,
        );
        return {
          students: newStudents,
          // If the deleted student was selected, deselect
          selectedStudentId:
            prev.selectedStudentId === studentToDelete
              ? null
              : prev.selectedStudentId,
        };
      });
    }
    setShowDeleteConfirm(false);
    setStudentToDelete(null);
  };

  // --- Checklist Handlers (for the selected student) ---

  const toggleSurah = (surahIndex) => {
    if (!selectedStudent) return;

    setData((prev) => {
      const updatedStudents = prev.students.map((student) => {
        if (student.id === selectedStudent.id) {
          const memorized = student.memorized.includes(surahIndex)
            ? student.memorized.filter((i) => i !== surahIndex)
            : [...student.memorized, surahIndex];
          return { ...student, memorized };
        }
        return student;
      });
      return { ...prev, students: updatedStudents };
    });
  };

  const handleReset = () => {
    if (!selectedStudent) return;

    setData((prev) => {
      const updatedStudents = prev.students.map((student) => {
        if (student.id === selectedStudent.id) {
          return { ...student, memorized: [] }; // Reset only for the selected student
        }
        return student;
      });
      return { ...prev, students: updatedStudents };
    });
    setShowConfirm(false);
  };

  const memorizedCount = selectedStudent ? selectedStudent.memorized.length : 0;

  return (
    <div
      className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans flex justify-center"
      dir="rtl"
    >
      <div className="w-full max-w-4xl">
        {/* Header Section */}
        <header className="sticky top-4 z-20 flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white/95 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-center sm:text-right">
            <h1 className="text-2xl font-bold text-emerald-800">
              مُتابع التسميع
            </h1>
            <p className="text-slate-500 text-xs mt-0.5">
              {selectedStudent
                ? `الطالب: ${selectedStudent.name}`
                : 'الرجاء اختيار أو إضافة طالب'}
            </p>
          </div>

          {selectedStudent && (
            <div className="flex items-center gap-4 sm:gap-8">
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold text-emerald-600">
                  {memorizedCount} / {SURAH_NAMES.length}
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
          )}
        </header>

        {/* Student Management UI */}
        <StudentManager
          students={data.students}
          selectedStudentId={data.selectedStudentId}
          onSelect={handleSelectStudent}
          onAdd={handleAddStudent}
          onDelete={handleDeleteStudent}
        />

        {/* Surahs Grid or Placeholder */}
        {selectedStudent ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5">
            {SURAH_NAMES.map((name, index) => {
              const isMemorized = selectedStudent.memorized.includes(index);
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
                  <span
                    className={`absolute top-0.5 right-1 text-[8px] md:text-[9px] font-bold opacity-40 ${
                      isMemorized ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="block font-bold text-sm md:text-base leading-tight">
                    {name}
                  </span>
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
        ) : (
          <div className="text-center p-10 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-slate-700">
              ابدأ بإضافة طالب
            </h2>
            <p className="text-slate-500 mt-2">
              لا يوجد طلاب في قائمتك. أضف طالبًا جديدًا لبدء تتبع الحفظ.
            </p>
          </div>
        )}

        <footer className="mt-12 py-8 text-center text-slate-400 text-[10px] border-t border-slate-200">
          <p>تم الحفظ تلقائياً في المتصفح • مُرتبة حسب المصحف الشريف</p>
        </footer>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 w-full max-w-sm transform transition-all scale-100 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2 text-center">
              حذف الطالب؟
            </h3>
            <p className="text-slate-500 text-sm text-center mb-6 leading-relaxed">
              هل أنت متأكد من حذف هذا الطالب وجميع بيانات الحفظ الخاصة به؟{' '}
              <br /> لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 px-4 rounded-xl font-bold text-sm transition-colors shadow-sm active:scale-95"
              >
                نعم، حذف
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2.5 px-4 rounded-xl font-bold text-sm transition-colors active:scale-95"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

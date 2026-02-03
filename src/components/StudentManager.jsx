import React, { useState } from 'react';

export default function StudentManager({
  students,
  selectedStudentId,
  onSelect,
  onAdd,
  onDelete,
}) {
  const [newStudentName, setNewStudentName] = useState('');

  const handleAddClick = () => {
    if (newStudentName.trim()) {
      onAdd(newStudentName.trim());
      setNewStudentName('');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-100 rounded-lg mb-8">
      <div className="flex items-center gap-2">
        <select
          value={selectedStudentId || ''}
          onChange={(e) => onSelect(Number(e.target.value))}
          className="p-2 border rounded-md"
        >
          <option value="" disabled>
            اختر طالبًا
          </option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>
        {selectedStudentId && (
          <button
            onClick={() => onDelete(selectedStudentId)}
            className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
          >
            حذف الطالب
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newStudentName}
          onChange={(e) => setNewStudentName(e.target.value)}
          placeholder="اسم طالب جديد"
          className="p-2 border rounded-md"
        />
        <button
          onClick={handleAddClick}
          className="bg-emerald-500 text-white p-2 rounded-md hover:bg-emerald-600"
        >
          إضافة طالب
        </button>
      </div>
    </div>
  );
}

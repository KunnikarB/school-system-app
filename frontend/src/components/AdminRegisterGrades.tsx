import { useState, useEffect } from 'react';

interface Grade {
  id: number;
  studentId: number;
  studentName: string;
  grade: string;
  year: number;
  subject: string;
  level: string;
}

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  personNr: number;
}

interface AdminRegisterGradesProps {
  adminName: string;
  onBack: () => void;
}

const years = ['Year 1', 'Year 2', 'Year 3'];
const subjects = ['Math', 'Science', 'English'];

export default function AdminRegisterGrades({
  adminName,
  onBack,
}: AdminRegisterGradesProps) {
  const [selectedYear, setSelectedYear] = useState('Year 1');
  const [selectedSubject, setSelectedSubject] = useState('Math');
  const [grades, setGrades] = useState<Grade[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const yearNumber = Number(selectedYear.split(' ')[1]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch('http://localhost:5001/admin/students');
        const data = await res.json();
        setStudents(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchGrades = async () => {
      setLoading(true);
      try {
        const allGrades: Grade[] = [];
        for (const student of students) {
          const res = await fetch(
            `http://localhost:5001/admin/grades/${student.personNr}`
          );
          const data = await res.json();
          if (res.ok && data.grades) {
            type ApiGrade = {
              id: number;
              grade: string;
              year: number;
              subject: string;
              level: string;
            };
            (data.grades as ApiGrade[]).forEach((g) => {
              allGrades.push({
                id: g.id,
                studentId: student.id,
                studentName: `${student.firstName} ${student.lastName}`,
                grade: g.grade,
                year: g.year,
                subject: g.subject,
                level: g.level,
              });
            });
          }
        }
        setGrades(allGrades);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (students.length > 0) fetchGrades();
  }, [students]);

  const filteredGrades = grades.filter(
    (g) =>
      g.year === yearNumber &&
      (selectedSubject === 'All' || g.subject === selectedSubject)
  );

  const handleGradeChange = async (gradeId: number, newGrade: string) => {
    try {
      const res = await fetch(`http://localhost:5001/admin/grades/${gradeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade: newGrade }),
      });
      if (res.ok) {
        setGrades((prev) =>
          prev.map((g) => (g.id === gradeId ? { ...g, grade: newGrade } : g))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-10">Loading grades...</div>;

  return (
    <div className="p-20 font-sans max-w-5xl mx-auto bg-pink-200 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Admin - Register Grades</h1>
        <button
          className="bg-pink-400 text-white px-3 py-1 rounded hover:bg-pink-500"
          onClick={onBack}
        >
          ← {adminName}
        </button>
      </div>

      {/* Year tabs & Subject dropdown */}
      <div className="mt-6 flex justify-between items-center">
        <div className="flex gap-2">
          {years.map((y) => (
            <button
              key={y}
              className={`px-4 py-2 rounded border ${
                selectedYear === y
                  ? 'bg-pink-400 text-white font-semibold'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedYear(y)}
            >
              {y}
            </button>
          ))}
        </div>
        <select
          className="border border-pink-400 bg-pink-400 text-white font-semibold px-3 py-1 rounded"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          {['All', ...subjects].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Grades table */}
      <div className="mt-6 border border-gray-300 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Grade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Level
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredGrades.map((g) => (
              <tr key={g.id} className="hover:bg-pink-50">
                <td className="px-6 py-4 text-sm">{g.studentName}</td>
                <td className="px-6 py-4 text-sm">{g.subject}</td>
                <td className="px-6 py-4 text-sm">
                  <input
                    type="text"
                    value={g.grade}
                    onChange={(e) =>
                      handleGradeChange(g.id, e.target.value.toUpperCase())
                    }
                    className="w-12 border border-gray-300 rounded px-1 py-0.5 text-center"
                  />
                </td>
                <td className="px-6 py-4 text-sm">{g.level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

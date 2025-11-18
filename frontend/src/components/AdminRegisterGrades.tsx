import { useState } from 'react';

const years = ['Year 1', 'Year 2', 'Year 3'];
const subjects = ['Filosofi 1', 'Engelska 5', 'Matematik 1b', 'Svenska 1'];

const demoGrades = [
  {
    student: 'Anna Bergström',
    grade: 'A',
    date: '2025-11-12',
    year: 1,
    subject: 'Filosofi 1',
  },
  {
    student: 'Johan Lindgren',
    grade: 'B',
    date: '2025-11-12',
    year: 1,
    subject: 'Filosofi 1',
  },
  {
    student: 'Maria Ekholm',
    grade: 'A',
    date: '2025-11-12',
    year: 1,
    subject: 'Filosofi 1',
  },
  {
    student: 'Erik Sandberg',
    grade: 'C',
    date: '2025-11-12',
    year: 1,
    subject: 'Filosofi 1',
  },
  {
    student: 'Sofia Henningsson',
    grade: 'B',
    date: '2025-11-12',
    year: 1,
    subject: 'Filosofi 1',
  },
  {
    student: 'Daniel Norberg',
    grade: 'C',
    date: '2025-11-12',
    year: 1,
    subject: 'Filosofi 1',
  },
  {
    student: 'Klara Sjödin',
    grade: 'D',
    date: '2025-11-12',
    year: 1,
    subject: 'Filosofi 1',
  },
  {
    student: 'Markus Lundvall',
    grade: '',
    date: '',
    year: 1,
    subject: 'Filosofi 1',
  },
  {
    student: 'Elin Westin',
    grade: '',
    date: '',
    year: 1,
    subject: 'Filosofi 1',
  },
  {
    student: 'Tobias Holmgren',
    grade: '',
    date: '',
    year: 1,
    subject: 'Filosofi 1',
  },
  {
    student: 'Nora Viklund',
    grade: 'A',
    date: '2025-11-12',
    year: 1,
    subject: 'Filosofi 1',
  },
  {
    student: 'Simon Axelsson',
    grade: 'B',
    date: '2025-11-12',
    year: 1,
    subject: 'Filosofi 1',
  },
  // Add more dummy data for other years/subjects if needed
];

interface AdminRegisterGradesProps {
  adminName: string;
  onBack: () => void;
}

export default function AdminRegisterGrades({
  adminName,
  onBack,
}: AdminRegisterGradesProps) {
  const [selectedYear, setSelectedYear] = useState('Year 1');
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);

  const yearNumber = Number(selectedYear.split(' ')[1]);

  const filteredGrades = demoGrades.filter(
    (g) => g.year === yearNumber && g.subject === selectedSubject
  );

  return (
    <div className="p-6 font-sans max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Admin</h1>
        <button
          className="flex items-center gap-1 border border-gray-300 px-3 py-1 rounded-md mb-2 hover:bg-gray-100"
          onClick={onBack}
        >
          <span className="text-sm">← {adminName}</span>
        </button>
      </div>

      {/* YEAR TABS and SUBJECT DROPDOWN */}
      <div className="mt-6 flex justify-between items-center">
        <div className="flex gap-2">
          {years.map((y) => (
            <button
              key={y}
              className={`px-4 py-2 rounded border border-gray-300 transition-colors ${
                selectedYear === y
                  ? 'bg-blue-300 font-semibold'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedYear(y)}
            >
              {y}
            </button>
          ))}
        </div>
        <select
          className="border border-gray-300 px-3 py-1 rounded-md"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* REGISTER GRADES TABLE */}
      <h2 className="text-2xl font-semibold mt-8">Register Grades</h2>

      <div className="mt-4 border border-gray-300 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                Grade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredGrades.map((g, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {g.student}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {g.grade}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {g.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

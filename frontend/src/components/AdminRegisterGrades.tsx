import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface StudentGrade {
  id: number; 
  firstName: string;
  lastName: string;
  grade: string;
  subject: string;
  level?: string;
  year: number;
  updatedAt: string;
}

interface AdminRegisterGradesProps {
  adminName: string;
}

const years = ['All', 'Year 1', 'Year 2', 'Year 3'];
const gradeOptions = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function AdminRegisterGrades({
  adminName,
}: AdminRegisterGradesProps) {
  const navigate = useNavigate();
  const [grades, setGrades] = useState<StudentGrade[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [editingGradeId, setEditingGradeId] = useState<number | null>(null);
  const [newGrade, setNewGrade] = useState<string>('');

  // Fetch all grades
  useEffect(() => {
    const fetchGrades = async () => {
      setLoading(true);
      try {
        const res = await axios.get<StudentGrade[]>(
          'http://localhost:5001/admin/grades/all'
        );
        setGrades(res.data);
      } catch (err) {
        console.error('Failed to fetch grades', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, []);

  // Year & Subject filters
  const yearNumber =
    selectedYear === 'All' ? null : Number(selectedYear.split(' ')[1]);
  const filteredGrades = grades.filter((g) => {
    const matchYear = yearNumber === null || g.year === yearNumber;
    const matchSubject =
      selectedSubject === 'All' || g.subject === selectedSubject;
    return matchYear && matchSubject;
  });

  // Unique subjects for dropdown
  const subjects = Array.from(new Set(grades.map((g) => g.subject)));

  // Update grade handler
  const handleUpdateGrade = async (gradeId: number) => {
    try {
      await axios.put(`http://localhost:5001/admin/grades/${gradeId}`, {
        grade: newGrade,
      });
      // Update local state
      setGrades((prev) =>
        prev.map((g) =>
          g.id === gradeId
            ? { ...g, grade: newGrade, updatedAt: new Date().toISOString() }
            : g
        )
      );
      setEditingGradeId(null);
    } catch (err) {
      console.error('Failed to update grade', err);
    }
  };

  return (
    <div className="p-10 bg-pink-200 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Register Grades</h1>
        <button
          className="bg-pink-400 text-white px-3 py-1 rounded"
          onClick={() => navigate('/admin-dashboard')}
        >
          ← {adminName}
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex justify-between gap-4 mb-6">
        <div className="flex gap-2">
          {years.map((y) => (
            <button
              key={y}
              className={`px-4 py-2 rounded border font-semibold ${
                selectedYear === y
                  ? 'bg-pink-500 text-white'
                  : 'bg-white hover:bg-gray-100'
              }`}
              onClick={() => setSelectedYear(y)}
            >
              {y}
            </button>
          ))}
        </div>
        <div>
          <select
            className="px-4 py-2 rounded bg-pink-400 text-white font-semibold"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="All">All Subjects</option>
            {subjects.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-xl font-semibold">Loading...</p>
      ) : (
        <div className="bg-white rounded-lg shadow border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 font-semibold">
              <tr>
                <th className="px-6 py-3 text-left">Student Name</th>
                <th className="px-6 py-3 text-left">Grade</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredGrades.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-4 text-gray-500 italic"
                  >
                    No grades found for this filter.
                  </td>
                </tr>
              ) : (
                filteredGrades.map((g) => (
                  <tr key={g.id} className="hover:bg-pink-50">
                    <td className="px-6 py-3">
                      {g.firstName} {g.lastName}
                    </td>
                    <td className="px-6 py-3">
                      {editingGradeId === g.id ? (
                        <select
                          value={newGrade}
                          onChange={(e) => setNewGrade(e.target.value)}
                          className="px-2 py-1 border rounded"
                        >
                          {gradeOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        g.grade
                      )}
                    </td>
                    <td className="px-6 py-3">
                      {new Date(g.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3">
                      {editingGradeId === g.id ? (
                        <button
                          className="bg-green-400 text-white px-2 py-1 rounded mr-2"
                          onClick={() => handleUpdateGrade(g.id)}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          className="bg-blue-400 text-white px-2 py-1 rounded"
                          onClick={() => {
                            setEditingGradeId(g.id);
                            setNewGrade(g.grade);
                          }}
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

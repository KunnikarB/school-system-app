import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import StudentGrades from './pages/StudentGrades';
import AdminDashboard from './pages/AdminDashboard';
import AdminRegisterGrades from './pages/AdminRegisterGrades';
import AdminStudentAccounts from './pages/AdminStudentAccounts';

export default function App() {
  const studentName = 'Kunnikar Boonbunlu';
  const adminName = 'Michiel vd Gragt';

  return (
    <div className="min-h-screen bg-pink-50">
      <Routes>
        {/* Student Routes */}
        <Route path="/" element={<Navigate to="/student-login" replace />} />
        <Route path="/student-login" element={<Login />} />
        <Route
          path="/student-grades"
          element={<StudentGrades studentName={studentName} studentId="" />}
        />

        {/* Admin Routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin-dashboard"
          element={<AdminDashboard adminName={adminName} />}
        />
        <Route
          path="/admin-register-grades"
          element={<AdminRegisterGrades adminName={adminName} />}
        />
        <Route
          path="/admin-accounts"
          element={<AdminStudentAccounts adminName={adminName} onBack={function (): void {
            throw new Error('Function not implemented.');
          } } />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/student-login" replace />} />
      </Routes>
    </div>
  );
}

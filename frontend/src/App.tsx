import { useState } from 'react';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin'; 
import StudentGrades from './components/StudentGrades';
import './index.css'

type Page = 'student-login' | 'admin-login' | 'student-grades' | 'admin-dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('student-login');

  const studentName = 'Kunnikar';

  const navigateTo = (page: Page) => setCurrentPage(page);

  const renderPage = () => {
    switch (currentPage) {
      case 'student-login':
        return <Login onLogin={() => navigateTo('student-grades')} onAdminLinkClick={() => navigateTo('admin-login')} />;
      case 'admin-login':
        return <AdminLogin onLogin={() => navigateTo('admin-dashboard')} onStudentLinkClick={() => navigateTo('student-login')} />;
      case 'student-grades':
        return <StudentGrades studentName={studentName} onLogout={() => navigateTo('student-login')} />;
      case 'admin-dashboard':
        return <div>Admin dashboard (placeholder)</div>;
      default:
        return <Login onLogin={() => navigateTo('student-grades')} onAdminLinkClick={() => navigateTo('admin-login')} />;
    }
  };

  return (
    <div className="app">
      {renderPage()}
    </div>
  );
}

export default App;

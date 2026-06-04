import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import AdminLayout from './components/layout/AdminLayout';
import StudentLayout from './components/layout/StudentLayout';

// Pages
import LandingPage from './pages/public/LandingPage';
import Login from './pages/Login';
import { AdminDashboard, TeacherDashboard, ParentDashboard } from './pages/Dashboards';
import StudentDashboard from './pages/student/StudentDashboard';
import DoubtSolver from './pages/student/DoubtSolver';
import Profile from './pages/student/Profile';
import AcademicDNA from './pages/student/dna/AcademicDNA';
import Leaderboard from './pages/student/Leaderboard';
import StudyPlanner from './pages/student/StudyPlanner';
import BrainBattle from './pages/student/BrainBattle';
import TestListScreen from './pages/student/tests/TestListScreen';
import LiveTestScreen from './pages/student/tests/LiveTestScreen';
import TestResultsScreen from './pages/student/tests/TestResultsScreen';
import AnalyticsDashboard from './pages/student/analytics/AnalyticsDashboard';
import ParentAttendance from './pages/parent/ParentAttendance';

// Teacher Pages
import StudentManagement from './pages/teacher/StudentManagement';
import TestCreation from './pages/teacher/TestCreation';
import TestResults from './pages/teacher/TestResults';
import DoubtManagement from './pages/teacher/DoubtManagement';
import ContentUpload from './pages/teacher/ContentUpload';
import AttendanceMarking from './pages/teacher/AttendanceMarking';

// Parent Pages
import ParentFees from './pages/parent/ParentFees';
import ParentContacts from './pages/parent/ParentContacts';

// Admin Pages
import UserManagement from './pages/admin/UserManagement';
import BatchManagement from './pages/admin/BatchManagement';
import FinancialManagement from './pages/admin/FinancialManagement';
import QAManagement from './pages/admin/QAManagement';
import ReportsCenter from './pages/admin/ReportsCenter';
import Announcements from './pages/admin/Announcements';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes (Admin Layout) */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="batches" element={<BatchManagement />} />
              <Route path="finances" element={<FinancialManagement />} />
              <Route path="qa" element={<QAManagement />} />
              <Route path="reports" element={<ReportsCenter />} />
              <Route path="announcements" element={<Announcements />} />
              <Route path="batch-dna/:id" element={<AcademicDNA forcedClassLevel={10} />} />
              <Route path="*" element={<div className="text-white">Under Construction</div>} />
            </Route>
          </Route>

          {/* Teacher Routes (Admin Layout) */}
          <Route path="/teacher" element={<ProtectedRoute allowedRoles={['Teacher']} />}>
            <Route element={<AdminLayout />}>
              <Route index element={<TeacherDashboard />} />
              <Route path="students" element={<StudentManagement />} />
              <Route path="tests/create" element={<TestCreation />} />
              <Route path="results" element={<TestResults />} />
              <Route path="doubts" element={<DoubtManagement />} />
              <Route path="materials" element={<ContentUpload />} />
              <Route path="attendance" element={<AttendanceMarking />} />
              <Route path="student-dna/:id" element={<AcademicDNA />} />
              <Route path="*" element={<div className="text-white">Under Construction</div>} />
            </Route>
          </Route>

          {/* Student Routes */}
          <Route path="/student" element={<ProtectedRoute allowedRoles={['Student']} />}>
            
            {/* Full Screen Student Routes (No Layout) */}
            <Route path="tests/live/:testId" element={<LiveTestScreen />} />
            <Route path="tests/results/:resultId" element={<TestResultsScreen />} />

            {/* Standard Student Routes (With Bottom Nav) */}
            <Route element={<StudentLayout />}>
              <Route index element={<StudentDashboard />} />
              <Route path="doubts" element={<DoubtSolver />} />
              <Route path="profile" element={<Profile />} />
              <Route path="tests" element={<TestListScreen />} />
              <Route path="analytics" element={<AnalyticsDashboard />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="planner" element={<StudyPlanner />} />
              <Route path="battle" element={<BrainBattle />} />
              <Route path="dna" element={<AcademicDNA />} />
              <Route path="*" element={<Navigate to="/student" replace />} />
            </Route>
          </Route>

          {/* Parent Routes */}
          <Route path="/parent" element={<ProtectedRoute allowedRoles={['Parent']} />}>
            <Route element={<StudentLayout />}>
              <Route index element={<ParentDashboard />} />
              <Route path="attendance" element={<ParentAttendance />} />
              <Route path="fees" element={<ParentFees />} />
              <Route path="contacts" element={<ParentContacts />} />
              <Route path="*" element={<div className="text-white">Under Construction</div>} />
            </Route>
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

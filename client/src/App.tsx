import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import StudentPage    from './pages/StudentPage';
import AdminLogin     from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import TrackPage      from './pages/TrackPage';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Student — submit complaint */}
        <Route path="/"                element={<StudentPage />}    />

        {/* Track — enter ID to see status */}
        <Route path="/track"           element={<TrackPage />}      />

        {/* Admin login */}
        <Route path="/admin"           element={<AdminLogin />}     />

        {/* Admin dashboard — token checked inside component */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Catch all */}
        <Route path="*"                element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
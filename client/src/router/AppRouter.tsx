import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import LoginPage from '@/pages/LoginPage';
import AdminDashboard from '@/pages/AdminDashboard';
import WatsonMasterConsole from '@/pages/WatsonMasterConsole';
import DionMasterConsole from '@/pages/DionMasterConsole';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/qnis" element={<AdminDashboard />} />
      <Route path="/watson" element={<WatsonMasterConsole />} />
      <Route path="/dion" element={<DionMasterConsole />} />
      <Route path="/nexus" element={<DionMasterConsole />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
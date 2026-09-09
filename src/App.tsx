import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from '@/context/DataContext';
import LandingPage from '@/components/landing/LandingPage';
import AdminPage from '@/components/admin/AdminPage';
import ErrorBoundary from '@/components/common/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/index.html" element={<LandingPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </ErrorBoundary>
  );
}

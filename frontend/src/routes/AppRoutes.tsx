import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

const WorkspacePage = lazy(() => import('../pages/WorkspacePage'));
const UploadPage = lazy(() => import('../pages/UploadPage'));
const ChatPage = lazy(() => import('../pages/ChatPage'));
const SearchPage = lazy(() => import('../pages/SearchPage'));
const SummariesPage = lazy(() => import('../pages/SummariesPage'));
const HistoryPage = lazy(() => import('../pages/HistoryPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

function PageLoader() {
  return (
    <div className="grid h-64 place-items-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-primary-400" />
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<WorkspacePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/summaries" element={<SummariesPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

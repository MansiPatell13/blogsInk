import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import BlogDetailPage from './pages/BlogDetailPage'
import WritePage from './pages/WritePage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import AboutPage from './pages/AboutPage'
import HelpPage from './pages/HelpPage'
import LibraryPage from './pages/LibraryPage'
import PrivacyPage from './pages/PrivacyPage'
import RulesPage from './pages/RulesPage'
import SearchPage from './pages/SearchPage'
import SettingsPage from './pages/SettingsPage'
import StatsPage from './pages/StatsPage'
import StatusPage from './pages/StatusPage'
import StoriesPage from './pages/StoriesPage'
import TermsPage from './pages/TermsPage'
import NotificationDemoPage from './pages/NotificationDemoPage'
import { useAuth, AuthProvider } from './utils/useAuth.jsx'
import { ThemeProvider } from './utils/ThemeContext'
import PageTransition from './components/ui/PageTransition'
import LoadingSpinner from './components/ui/LoadingSpinner'
import { ErrorBoundary, ErrorFallback, GlobalErrorHandler, NotFound } from './components/error'
import { SkipLink, KeyboardFocus, AriaLive } from './components/a11y'
import { SearchProvider } from './components/search'
import { NotificationProvider } from './components/notifications'
import { ToastProvider } from './contexts/ToastContext'
import './App.css'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" color="primary" />
      </div>
    )
  }

  return (
    <div className="App">
      <SkipLink targetId="main-content" />
      <AriaLive />
      <Toaster position="top-right" />
      <Header />
      {user && <Sidebar />}
      
      <main id="main-content" tabIndex="-1" className={`transition-all duration-300 ${
        user ? 'ml-64' : ''
      } px-4 py-8 max-w-none min-h-screen`}>
        <PageTransition>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
            <Route path="/write" element={<WritePage />} />
            <Route path="/profile/:username?" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/rules" element={<RulesPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/status" element={<StatusPage />} />
            <Route path="/stories" element={<StoriesPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/notification-demo" element={<NotificationDemoPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <GlobalErrorHandler>
              <KeyboardFocus />
              <NotificationProvider>
                <SearchProvider>
                  <AppContent />
                </SearchProvider>
              </NotificationProvider>
            </GlobalErrorHandler>
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App

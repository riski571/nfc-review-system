import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import CardsListPage from './pages/CardsListPage'
import CardDetailPage from './pages/CardDetailPage'
import CardActivatePage from './pages/CardActivatePage'
import CardActivateForm from './pages/CardActivateForm'
import ActivationSuccess from './pages/ActivationSuccess'
import SettingsPage from './pages/SettingsPage'

// Components
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/c/:token/success" element={<ActivationSuccess />} />
      <Route path="/c/:token/activate" element={<CardActivateForm />} />
      <Route path="/c/:token" element={<CardActivatePage />} />
      
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="cards" element={<CardsListPage />} />
        <Route path="cards/:id" element={<CardDetailPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

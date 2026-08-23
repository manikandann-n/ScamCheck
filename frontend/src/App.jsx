import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Landing from './components/Landing'
import Analyzer from './components/Analyzer'
import Results from './components/Results'
import History from './components/History'
import EnhancedDashboard from './components/EnhancedDashboard'
import Profile from './components/Profile'
import Settings from './components/Settings'
import Login from './components/Login'
import Register from './components/Register'
import ProtectedRoute from './components/ProtectedRoute'
import Toast from './components/Toast'

function App() {
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  return (
    <AuthProvider>
      <Router>
        <Layout showToast={showToast}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login showToast={showToast} />} />
            <Route path="/register" element={<Register showToast={showToast} />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/analyze" element={<Analyzer showToast={showToast} />} />
              <Route path="/results/:id" element={<Results showToast={showToast} />} />
              <Route path="/history" element={<History showToast={showToast} />} />
              <Route path="/dashboard" element={<EnhancedDashboard showToast={showToast} />} />
              <Route path="/profile" element={<Profile showToast={showToast} />} />
              <Route path="/settings" element={<Settings showToast={showToast} />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </Router>
    </AuthProvider>
  )
}

export default App
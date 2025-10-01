import NavBar from './components/NavBar'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Landing from './pages/Landing'
import Clubs from './pages/Clubs'
import Voting from './pages/Voting'
import ElectionManagement from './pages/ElectionManagement'
import Results from './pages/Results'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import { Routes, Route, BrowserRouter as Router, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
const AppContent=()=>{
  const location=useLocation()
  const hideNavBar=location.pathname==='/' || location.pathname==='/register' || location.pathname==='/login'
  return(
    <div>
      {!hideNavBar && <NavBar/>}
      <Routes>
        <Route path='/' element={
          <PublicRoute>
            <Landing/>
          </PublicRoute>
        }/>
        <Route path='/login' element={
          <PublicRoute>
            <Login/>
          </PublicRoute>
        }/>
        <Route path='/register' element={
          <PublicRoute>
            <Register/>
          </PublicRoute>
        }/>
        <Route path='/home' element={
          <ProtectedRoute>
            <Home/>
          </ProtectedRoute>
        }/>
        <Route path='/clubs' element={
          <ProtectedRoute>
            <Clubs/>
          </ProtectedRoute>
        }/>
        <Route path='/voting' element={
          <ProtectedRoute>
            <Voting/>
          </ProtectedRoute>
        }/>
        <Route path='/election-management' element={
          <ProtectedRoute>
            <ElectionManagement/>
          </ProtectedRoute>
        }/>
        <Route path='/results/:electionId' element={
          <ProtectedRoute>
            <Results/>
          </ProtectedRoute>
        }/>
      </Routes>
    </div>
  )
}
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App

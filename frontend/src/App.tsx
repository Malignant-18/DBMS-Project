import NavBar from './components/NavBar'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Landing from './pages/Landing'
import Clubs from './pages/Clubs'
import { Routes, Route, BrowserRouter as Router, useLocation } from 'react-router-dom'
const AppContent=()=>{
  const location=useLocation()
  const hideNavBar=location.pathname==='/' || location.pathname==='/register' || location.pathname==='/login'
  return(
    <div>
      {!hideNavBar && <NavBar/>}
      <Routes>
        <Route path='/' element={<Landing/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/clubs' element={<Clubs/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
      </Routes>
    </div>
  )
}
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App

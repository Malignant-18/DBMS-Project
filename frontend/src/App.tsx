import NavBar from './components/NavBar'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import { Routes, Route, BrowserRouter as Router, useLocation } from 'react-router-dom'
const AppContent=()=>{
  const location=useLocation()
  const hideNavBar=location.pathname==='/' || location.pathname==='/register'
  return(
    <div>
      {!hideNavBar && <NavBar/>}
      <Routes>
        <Route path='/home' element={<Home/>}/>
        <Route path='/' element={<Login/>}/>
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

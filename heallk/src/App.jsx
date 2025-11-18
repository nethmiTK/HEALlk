import { Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home'
import Register from './Pages/Authentication/Register'
import Login from './Pages/Authentication/Login'
import Contact from './Pages/Contact'
import Footer from './Components/Footer'

function App() {
  const location = useLocation();
  const authPages = ['/register', '/login'];
  const shouldShowFooter = !authPages.includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      {shouldShowFooter && <Footer />}
    </>
  )
}

export default App

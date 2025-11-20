import { Routes, Route, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import Home from './Pages/Home'
import Register from './Pages/Authentication/Register'
import Login from './Pages/Authentication/Login'
import Contact from './Pages/Contact'
import Footer from './Components/Footer'
import DoctorAdminDashboard from './doctorAdminPanel/DoctorAdminDashboard'
import ProtectedRoute from './Components/ProtectedRoute'

function App() {
  const location = useLocation();
  const authPages = ['/register', '/login'];
  const adminPages = location.pathname.startsWith('/doctor-admin');
  const shouldShowFooter = !authPages.includes(location.pathname) && !adminPages;

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/doctor-admin/*" element={
          <ProtectedRoute>
            <DoctorAdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
      {shouldShowFooter && <Footer />}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}

export default App

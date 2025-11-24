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
import About from './Pages/About'
import Doctors from './Pages/Doctors'
import DoctorProfile from './Pages/DoctorProfile'
import DoctorAbout from './doctor_profile/About'
import DoctorServicesPage from './doctor_profile/DoctorServicesPage'
import DoctorClinicPage from './doctor_profile/DoctorClinicPage'
import DoctorContactPage from './doctor_profile/DoctorContactPage'
import DoctorReviewsPage from './doctor_profile/DoctorReviewsPage'
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
        <Route path="/about" element={<About />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctor-profile/:id" element={<DoctorProfile />} />
        <Route path="/doctor/:id/about" element={<DoctorAbout />} />
        <Route path="/doctor/:id/services" element={<DoctorServicesPage />} />
        <Route path="/doctor/:id/clinic" element={<DoctorClinicPage />} />
        <Route path="/doctor/:id/contact" element={<DoctorContactPage />} />
        <Route path="/doctor/:id/reviews" element={<DoctorReviewsPage />} />
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

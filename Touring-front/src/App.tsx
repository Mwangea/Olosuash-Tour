import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Signup from './authPages/sign-upPage';
import Login from './authPages/loginPage';
import ForgotPassword from './authPages/forgot-password';
import EmailVerificationSuccess from './authPages/success-email';
import ResetPassword from './authPages/reset-Password';
import EmailVerificationFailed from './authPages/fail-email';
import EmailVerification from './authPages/EmailVerification';
import AdminDashboard from './admin/pages/AdminDashboard';
import { AuthProvider } from './context/AuthContext';
import UpdateProfilePage from './admin/pages/AdminProfilePage';
import AdminHero from './admin/pages/AdminHero';


function App() {
  return (
    <>
    <AuthProvider>
      <BrowserRouter>
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
        <Routes>
          {/* Public routes */}
          
          <Route path="/signup" element={<Signup />} />
          <Route path='/signin' element={<Login />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />         
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path='/verify-email/success' element={<EmailVerificationSuccess />} />
          <Route path="/verify-email/:token" element={<EmailVerification />} />
          <Route path="/verify-email/failed" element={<EmailVerificationFailed />} />

          
          
          
          {/* Redirect /admin to /admin/dashboard */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
         {/* Admin Routes */}
         <Route path="/admin/dashboard" element={<AdminDashboard />} />
         <Route path='/admin/profile' element={<UpdateProfilePage />} />
         <Route path='/admin/hero' element={<AdminHero />} />
          
         

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>

      
    </>
  );
}

export default App;
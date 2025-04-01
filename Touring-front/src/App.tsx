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
import Home from './pages/Home';

import { Footer } from './components/Footer';
import ContactPage from './pages/Contact';
import SustainabilityPage from './pages/SustainabilityPage';
import AboutPage from './pages/OlosuashiTours';
import Header from './components/Header';
import SafariGuides from './pages/SafariGuides';
import FAQPage from './pages/FAQPage';

// Create a User Layout component with Header and Footer
const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

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
            {/* Auth routes - no header/footer */}
            <Route path="/signup" element={<Signup />} />
            <Route path='/signin' element={<Login />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />         
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path='/verify-email/success' element={<EmailVerificationSuccess />} />
            <Route path="/verify-email/:token" element={<EmailVerification />} />
            <Route path="/verify-email/failed" element={<EmailVerificationFailed />} />
            
            {/* Admin Routes - no header/footer */}
            {/* Redirect /admin to /admin/dashboard */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path='/admin/profile' element={<UpdateProfilePage />} />
            <Route path='/admin/hero' element={<AdminHero />} />

            {/* User Routes - with header/footer */}
            <Route path='/' element={<UserLayout><Home /></UserLayout>} />
            <Route path='/contact' element={<UserLayout><ContactPage /></UserLayout>} />
            <Route path='/about/sustainability' element={<UserLayout><SustainabilityPage /></UserLayout>} />
            <Route path='/about/olosuashi-tours' element={<UserLayout><AboutPage /></UserLayout>} />
            <Route path='/about/safari-guide' element={<UserLayout><SafariGuides /></UserLayout>} />
            <Route path='/faq' element={<UserLayout><FAQPage /></UserLayout>} />




            {/* Add more user routes here with the UserLayout */}

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
import { BrowserRouter, Routes, Route, Navigate, useOutletContext } from 'react-router-dom';
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
import Profile from './pages/Profile';
import Bookings from './pages/Bookings';
import Wishlist from './pages/wishlist';
import ProfileOverview from './pages/ProfileOverview';
import Settings from './pages/Settings';
import { UserProfile } from './api/userApi';
import AdminUser from './admin/pages/AdminUser';
import AdminTour from './admin/pages/AdminTour';
import AdminBooking from './admin/pages/AdminBooking';
import UnauthorizedPage from './pages/UnauthorizedPage';

import TourForm from './admin/pages/TourForm';
import Tour from './pages/Tour';
import { BookingProvider } from './context/BookingContext';
import { BookingSuccess } from './pages/BookingSuccess';
import TourSlugPage from './TourPages/TourSlugPage';
import PackagingList from './pages/PackagingList';
import VisaRequirements from './pages/VisaRequirements';
import AdminExperiences from './admin/pages/AdminExperiences';
import AdminCategories from './admin/pages/AdminCategories';
import CategoryForm from './admin/components/CategoryForm';
import CreateExperience from './admin/components/CreateExperience';
import EditExperience from './admin/components/EditExperience';
import ExperienceSlugPage from './TourPages/ExperienceSlugPage';
import ExperiencePage from './pages/ExperiencePage';
import EquipmentRental from './pages/EquipmentRental';
import MountainClimbingGuide from './pages/MountainClimbingGuide';
import EasterFamilyPackage from './offer/EasterFamilyPackage';
import EasterCouplesRetreat from './offer/EasterCouplesRetreat';
import EasterGroupSafari from './offer/EasterGroupSafari';
import PaymentInformation from './pages/PaymentInfo';
import AdminExperienceBooking from './admin/pages/AdminExperienceBooking';
import { BookingExperienceSuccess } from './pages/BookingExperienceSuccess';
import ExperienceBookings from './pages/ExperienceBookings';
import ScrollToTopButton from './components/ScrollToTopButton';
import WhatsAppButton from './components/WhatsAppButton';
import TreePlanting from './pages/TreePlanting';
import SGRTrain from './pages/SGRTrain';
import CustomSafaris from './pages/CustomSafaris';


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

function ProfileContextWrapper() {
  const context = useOutletContext<{
    profile: UserProfile;
    setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  }>();
  
  return <ProfileOverview profile={context.profile} setProfile={context.setProfile} />;
}

function App() {
  return (
    <>
    <BrowserRouter>
      <AuthProvider>
      <BookingProvider>
        
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
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            {/* Admin Routes - no header/footer */}
            {/* Redirect /admin to /admin/dashboard */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path='/admin/profile' element={<UpdateProfilePage />} />
            <Route path='/admin/hero' element={<AdminHero />} />
            <Route path='/admin/users' element={<AdminUser />} />
            <Route path='/admin/tours' element={<AdminTour />} />
            <Route path='/admin/bookings' element={<AdminBooking />} />
            <Route path='/admin/experience-booking' element={<AdminExperienceBooking />} />
            <Route path="/admin/tours/new" element={<TourForm />} />
            <Route path="/admin/tours/edit/:id" element={<TourForm />} />
            <Route path='/admin/experience' element={<AdminExperiences />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/categories/new" element={<CategoryForm />} />
            <Route path="/admin/categories/edit/:id" element={<CategoryForm />} />
            <Route path='/admin/experiences/new' element={<CreateExperience />} />
            <Route path="/admin/experience/edit/:id" element={<EditExperience />} />

            

            {/* User Routes - with header/footer */}
            <Route path='/' element={<UserLayout><Home /></UserLayout>} />
            <Route path='/contact' element={<UserLayout><ContactPage /></UserLayout>} />
            <Route path='/about/sustainability' element={<UserLayout><SustainabilityPage /></UserLayout>} />
            <Route path='/about/olosuashi-tours' element={<UserLayout><AboutPage /></UserLayout>} />
            <Route path='/about/safari-guide' element={<UserLayout><SafariGuides /></UserLayout>} />
            <Route path='/faq' element={<UserLayout><FAQPage /></UserLayout>} />
            <Route path='/tours' element={<UserLayout><Tour /></UserLayout>} />
            <Route path='/experience' element={<UserLayout><ExperiencePage /></UserLayout>} />
            <Route path="/experience/:slug" element={<UserLayout><ExperienceSlugPage /></UserLayout>} />
            <Route path="/tours/:slug" element={<UserLayout><TourSlugPage /></UserLayout>} />
            <Route path='travel-info/packing' element={<UserLayout><PackagingList /></UserLayout>} />
            <Route path='travel-info/visa' element={<UserLayout><VisaRequirements /></UserLayout>} />
            <Route path='travel-info/payment' element={<UserLayout><PaymentInformation /></UserLayout>} />
            <Route path="/booking-success" element={<UserLayout><BookingSuccess /></UserLayout>} />
            <Route path="/booking-experience-success" element={<UserLayout><BookingExperienceSuccess /></UserLayout>} />
            <Route path="/mountain-climbing/equipment" element={<UserLayout><EquipmentRental /></UserLayout>} />
            <Route path="/mountain-climbing/preparation" element={<UserLayout><MountainClimbingGuide /></UserLayout>} />
            <Route path="/offers/easter-family" element={<UserLayout><EasterFamilyPackage /></UserLayout>} />
            <Route path="/offers/easter-couples" element={<UserLayout><EasterCouplesRetreat /></UserLayout>} />
            <Route path="/offers/easter-group" element={<UserLayout><EasterGroupSafari /></UserLayout>} />
            <Route path="/experience/tree-planting" element={<UserLayout><TreePlanting /></UserLayout>} />
            <Route path="/experience/train" element={<UserLayout><SGRTrain /></UserLayout>} />
            <Route path="/experience/customized" element={<UserLayout><CustomSafaris /></UserLayout>} />





            

            
         
            <Route path="/profile" element={<UserLayout><Profile /></UserLayout>}>
            <Route index element={<ProfileContextWrapper />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="settings" element={<Settings />} />
            <Route path="experience-bookings" element={<ExperienceBookings />} />
            </Route>



            





            {/* Add more user routes here with the UserLayout */}

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </BookingProvider>
          </AuthProvider>
        </BrowserRouter>
      <ScrollToTopButton />
      <WhatsAppButton />
    </>
  );
}

export default App;
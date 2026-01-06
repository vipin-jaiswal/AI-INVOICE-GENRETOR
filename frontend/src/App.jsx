import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LandingPage from "./pages/LandingPage/LandingPage";
import SignUp from "./pages/Auth/SignUp";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import AllInvoices from "./pages/Invoices/AllInvoices";
import CreateInvoice from "./pages/Invoices/CreateInvoice";
import InvoiceDetails from "./pages/Invoices/InvoiceDetails";
import UserProfile from "./pages/profile/ProfilePage";
import AboutUs from "./pages/Static/AboutUs";
import Contact from "./pages/Static/Contact";
import PrivacyPolicy from "./pages/Static/PrivacyPolicy";
import TermsOfService from "./pages/Static/TermsOfService";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/invoices" element={<AllInvoices />} />
            <Route path="/invoices/create" element={<CreateInvoice />} />
            <Route path="/invoices/:id" element={<InvoiceDetails />} />
            <Route path="/profile" element={<UserProfile />} />
          </Route>

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px"
          }
        }}
      />
    </AuthProvider>
  );
};

export default App;

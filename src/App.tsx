import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./components/auth/LoginPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./components/dashboard/Dashboard";
import TestsPage from "./components/tests/TestsPage";
import FormsPage from "./components/forms/FormsPage";
import DialogsPage from "./components/dialogs/DialogsPage";
import DynamicUIPage from "./components/dynamic/DynamicUIPage";
import MouseActionsPage from "./components/mouse/MouseActionsPage";
import BrowserInteractionPage from "./components/browser/BrowserInteractionPage";
import AdvancedUIPage from "./components/advanced/AdvancedUIPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="tests" element={<TestsPage />} />
            <Route path="forms" element={<FormsPage />} />
            <Route path="dialogs" element={<DialogsPage />} />
            <Route path="dynamic" element={<DynamicUIPage />} />
            <Route path="mouse" element={<MouseActionsPage />} />
            <Route path="browser" element={<BrowserInteractionPage />} />
            <Route path="advanced" element={<AdvancedUIPage />} />
          </Route>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3500}
        newestOnTop
        closeOnClick
        pauseOnHover
        toastClassName="text-sm"
      />
    </AuthProvider>
  );
}


import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import { AppProvider } from './AppContext';
import { AuthProvider, useAuth } from './AuthContext';
import React from 'react';

import './App.css';
  

import LandingPage from "./components/LandingPage";
import ReportWriter from "./components/ReportWriter";
import LoginPage from "./components/LoginPage";
import CheckEmailCode from "./components/CheckEmailCode";
import Pricing from "./components/Pricing";
import Checkout from "./components/Checkout";
import Return from "./components/Return";




class ErrorBoundary extends React.Component<any, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }


  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <p>Something went wrong.</p>;
    }

    return this.props.children;
  }

}

function MyFallbackComponent({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn, isLoading } = useAuth();
  if (isLoading) {
    return <div>Loading...</div>; 
  }
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ErrorBoundary FallbackComponent={MyFallbackComponent}>
      <AuthProvider>
        <AppProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/report-writer" element={<ProtectedRoute children={<ReportWriter />} />} />
              <Route path="/landing-page" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/check-email-code" element={<CheckEmailCode />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/return" element={<Return />} />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

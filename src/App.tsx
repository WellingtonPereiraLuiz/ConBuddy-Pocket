import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import OnboardingScreen from './pages/OnboardingScreen';
import LoginScreen from './pages/auth/LoginScreen';
import RegisterScreen from './pages/auth/RegisterScreen';
import HomeScreen from './pages/HomeScreen';
import FavoritesScreen from './pages/FavoritesScreen';
import NotificationsScreen from './pages/NotificationsScreen';
import ProfileScreen from './pages/ProfileScreen';
import MapScreen from './pages/MapScreen';
import EventDetailScreen from './pages/EventDetailScreen';
import NotFoundScreen from './pages/NotFoundScreen';
import AgendaScreen from './pages/AgendaScreen';

// Tipagem do ProtectedRoute
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredAuth?: boolean;
}

const ProtectedRoute = ({ children, requiredAuth = true }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user && requiredAuth) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (user && !requiredAuth && location.pathname !== '/') {
    const intendedPath = (location.state as { from?: string })?.from || '/';
    return <Navigate to={intendedPath} replace />;
  }

  return <>{children}</>;
};

function App() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <ThemeProvider>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public routes */}
          <Route path="/onboarding" element={<OnboardingScreen />} />

          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route
              path="/login"
              element={!user ? <LoginScreen /> : <Navigate to="/" replace />}
            />
            <Route
              path="/register"
              element={!user ? <RegisterScreen /> : <Navigate to="/" replace />}
            />
          </Route>

          {/* Protected routes */}
          <Route element={<MainLayout />}>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomeScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <FavoritesScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationsScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/map"
              element={
                <ProtectedRoute>
                  <MapScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/event/:id"
              element={
                <ProtectedRoute>
                  <EventDetailScreen />
                </ProtectedRoute>
              }
            />
            // Dentro do bloco de rotas protegidas, adicionar:
            <Route
              path="/agenda"
              element={
                <ProtectedRoute>
                  <AgendaScreen />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Fallback para páginas não encontradas */}
          <Route path="*" element={<NotFoundScreen />} />
        </Routes>
      </AnimatePresence>
    </ThemeProvider>
  );
}

export default App;

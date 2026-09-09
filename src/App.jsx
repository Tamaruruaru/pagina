import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import ScrollToTop from './components/ScrollToTop';
import AppShell from './components/layout/AppShell';
import TutorPage from './pages/TutorPage';
import TableroPage from './pages/TableroPage';
import RutasPage from './pages/RutasPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function App() {
    return (
        <AuthProvider>
            <Router>
                <ScrollToTop />
                <Routes>
                    <Route element={<AppShell />}>
                        <Route path="/" element={<TutorPage />} />
                        <Route path="/tablero" element={<TableroPage />} />
                        <Route path="/rutas" element={<RutasPage />} />
                    </Route>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                </Routes>
                <Toaster />
            </Router>
        </AuthProvider>
    );
}

export default App;

import { BrowserRouter, useLocation } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import ChatbotWidget from './components/chatbot/ChatbotWidget'
import { useEffect } from 'react'

const AdminStylesLoader = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.startsWith('/admin')) {
            import('./assets/admin.css');
        }
    }, [location.pathname]);

    return null;
};

/**
 * Main App component - wraps the entire application with routing and authentication
 */
function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                    <AdminStylesLoader />
                    <AppRoutes />
                    <ChatbotWidget />
                </BrowserRouter>
            </ThemeProvider>
        </AuthProvider>
    )
}

export default App

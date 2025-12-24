import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './responsive.css' // Import responsive styles
import App from './App'
import { AuthContextProvider } from './context/AuthContext'

// Add error boundary for production
const rootElement = document.getElementById('root');
if (!rootElement) {
  document.body.innerHTML = '<div style="color: white; background: black; padding: 20px; text-align: center;"><h1>Red Lotus</h1><p>Loading...</p></div>';
  throw new Error('Root element not found');
}

try {
  createRoot(rootElement).render(
    <StrictMode>
      <AuthContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthContextProvider>
    </StrictMode>,
  )
} catch (error) {
  console.error('App failed to render:', error);
  rootElement.innerHTML = '<div style="color: white; background: black; padding: 20px; text-align: center;"><h1>Red Lotus</h1><p>Error loading site. Please refresh.</p></div>';
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Database migration / Cleanup of old mock data
try {
  const cleanFlag = 'achievers_nest_cleaned_v2.0';
  if (!localStorage.getItem(cleanFlag)) {
    localStorage.removeItem('achievers_users');
    localStorage.removeItem('achievers_batches');
    localStorage.removeItem('achievers_results');
    localStorage.removeItem('achievers_activities');
    localStorage.removeItem('achievers_token');
    localStorage.removeItem('rememberedUserId');
    
    // Set default empty arrays
    localStorage.setItem('achievers_users', JSON.stringify([]));
    localStorage.setItem('achievers_batches', JSON.stringify([]));
    localStorage.setItem('achievers_results', JSON.stringify([]));
    localStorage.setItem('achievers_activities', JSON.stringify([]));
    
    localStorage.setItem(cleanFlag, 'true');
  }
} catch (e) {
  console.error('Error migrating localStorage database:', e);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

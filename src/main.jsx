import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserProvider } from './contexts/UserContext';


ReactDOM.createRoot(document.getElementById('root')).render(
//createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <StrictMode>
    <App />
  </StrictMode>,
  </React.StrictMode>
)

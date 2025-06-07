import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'  // Importé en premier pour établir les styles de base
import './App.css'    // Importé après pour compléter ou remplacer les styles de base
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
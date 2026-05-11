import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// 1. Primero las librerías (Bootstrap)
import 'bootstrap/dist/css/bootstrap.min.css';

// 2. Luego tus estilos propios (para que puedan sobrescribir a Bootstrap si es necesario)
import './css/main.css';

// 3. Finalmente tu aplicación
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
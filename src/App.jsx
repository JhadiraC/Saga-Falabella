// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Index from './paginas/Index';
import Login from './paginas/Login';
import EditarProducto from './paginas/EditarProducto';
import Productos from './paginas/Productos';
import RegistrarProducto from './paginas/RegistrarProducto';
import Reportes from './paginas/Reportes'; // <--- 1. IMPORTAR

function App() {
  const [usuario] = useState(() => {
    const usuarioGuardado = localStorage.getItem('usuarioActivo');
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  });

  if (!usuario) {
    return <Login onLogin={() => window.location.reload()} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/registrar-producto" element={<RegistrarProducto />} />
        
        {/* 2. AGREGAR LA RUTA */}
        <Route path="/reportes" element={<Reportes />} />
        
        <Route path="/editar" element={<EditarProducto />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
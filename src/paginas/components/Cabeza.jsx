// src/paginas/components/Cabeza.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // <--- IMPORTANTE
import logo from '../../assets/logo-saga.png'; 

const Cabeza = () => {
  const [usuario] = useState(() => {
    const usuarioActivo = localStorage.getItem('usuarioActivo');
    return usuarioActivo ? JSON.parse(usuarioActivo) : { nombre: 'Invitado', rol: 'N/A' };
  });

  const cerrarSesion = () => {
    if (window.confirm('¿Está seguro que desea cerrar sesión?')) {
      localStorage.removeItem('usuarioActivo');
      window.location.reload(); 
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="empresa-header">
            <img src={logo} alt="Saga Falabella" className="logo-empresa" />
            <div className="empresa-texto">
              <h1>SAGA FALABELLA</h1>
              <p>Sistema de Gestión de Inventario</p>
            </div>
          </div>
          <div className="header-info">
            <div className="header-info-usuario">
              <span className="nombre-usuario">Usuario: <span>{usuario.nombre}</span></span>
              <span className="rol-usuario">Rol: <span>{usuario.rol}</span></span>
            </div>
            <button onClick={cerrarSesion} className="btn">Cerrar Sesión</button>
          </div>
        </div>
      </header>

      <nav className="nav">
        <ul>
          {/* USAMOS Link EN LUGAR DE a href */}
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/productos">Productos</Link></li>
          <li><Link to="/registrar-producto">Registrar Producto</Link></li>
          <li><Link to="/reportes">Reportes</Link></li>
        </ul>
      </nav>
    </>
  );
};

export default Cabeza;
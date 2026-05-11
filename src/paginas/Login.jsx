// src/paginas/Login.jsx
import React, { useState, useEffect } from 'react';
import { usuarios } from '../data/data';
import '../css/login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const usuarioActivo = localStorage.getItem('usuarioActivo');
    if (usuarioActivo) {
      window.location.reload();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCargando(true);

    if (!username || !password) {
      alert(' Por favor, complete todos los campos');
      setCargando(false);
      return;
    }

    const usuarioEncontrado = usuarios.find(
      (u) => u.username === username && u.password === password && u.activo === true
    );

    setTimeout(() => {
      if (usuarioEncontrado) {
        try {
          localStorage.setItem('usuarioActivo', JSON.stringify(usuarioEncontrado));
          alert(`¡Bienvenido ${usuarioEncontrado.nombre}!`);
          
          if (onLogin) {
            onLogin();
          } else {
            window.location.reload();
          }
        } catch (error) {
          console.error('Error:', error);
        }
      } else {
        alert('Usuario o contraseña incorrectos');
        setPassword('');
      }
      setCargando(false);
    }, 800);
  };

  const usarCredenciales = (user, pass) => {
    setUsername(user);
    setPassword(pass);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        
        {/* HEADER CON LOGO - VISIBLE */}
        <div className="login-header">
          <div className="logo-container">
            {!logoError ? (
              <div className="logo-saga">
                <img 
                  src="../assets/logo-saga.png"
                  alt="Saga Falabella"
                  onError={() => setLogoError(true)}
                />
              </div>
            ) : (
              <div className="logo-fallback">
                <span>S</span>
              </div>
            )}
          </div>
          
          <h1>SAGA FALABELLA</h1>
          <p className="subtitulo">Sistema de Gestión de Inventario</p>
          <span className="ubicacion">
            <i className="bi bi-geo-alt-fill"></i>
            Lima, Perú
          </span>
        </div>

        {/* FORMULARIO - CAMPOS VISIBLES */}
        <form className="login-form" onSubmit={handleSubmit}>
          
          {/* USUARIO */}
          <div className="form-group">
            <label>
              <i className="bi bi-person-fill"></i>
              USUARIO
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Ingrese su usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={cargando}
              />
              <i className="bi bi-person input-icon"></i>
            </div>
          </div>

          {/* CONTRASEÑA */}
          <div className="form-group">
            <label>
              <i className="bi bi-lock-fill"></i>
              CONTRASEÑA
            </label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={cargando}
              />
              <i className="bi bi-lock-fill input-icon"></i>
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
              </button>
            </div>
          </div>

          {/* OPCIONES */}
          <div className="options-row">
            <label className="remember-checkbox">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Recordar sesión
            </label>
            <a href="#" className="forgot-link" onClick={(e) => e.preventDefault()}>
              ¿Olvidó su contraseña?
            </a>
          </div>

          {/* BOTÓN */}
          <button type="submit" className="btn-login" disabled={cargando}>
            {cargando ? (
              <>⏳ Iniciando sesión...</>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right"></i>
                INICIAR SESIÓN
              </>
            )}
          </button>
        </form>

        {/* USUARIOS DE PRUEBA */}
        <div className="test-users">
          <h3>
            <i className="bi bi-people-fill"></i>
            Usuarios de prueba
          </h3>
          
          <div className="users-grid">
            {/* ADMIN */}
            <div className="user-card" onClick={() => usarCredenciales('admin', 'admin123')}>
              <div className="user-avatar admin">
                <i className="bi bi-shield-fill"></i>
              </div>
              <div className="user-info">
                <span className="user-role">Administrador</span>
                <code className="user-credentials">admin / admin123</code>
              </div>
            </div>

            {/* VENDEDOR */}
            <div className="user-card" onClick={() => usarCredenciales('vendedor', 'vend123')}>
              <div className="user-avatar seller">
                <i className="bi bi-person-badge-fill"></i>
              </div>
              <div className="user-info">
                <span className="user-role">Vendedor</span>
                <code className="user-credentials">vendedor / vend123</code>
              </div>
            </div>

            {/* ALMACENERO */}
            <div className="user-card" onClick={() => usarCredenciales('almacen', 'alma123')}>
              <div className="user-avatar warehouse">
                <i className="bi bi-box-seam-fill"></i>
              </div>
              <div className="user-info">
                <span className="user-role">Almacenero</span>
                <code className="user-credentials">almacen / alma123</code>
              </div>
            </div>
          </div>
        </div>

        <div className="login-footer">
          <p>© 2024 Saga Falabella - Sistema de Gestión de Inventario</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
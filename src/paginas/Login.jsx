// src/paginas/Login.jsx

import React, { useState, useEffect } from 'react';
import { usuarios } from '../data/data';
import '../css/login.css';

const Login = ({ onLogin }) => {

  // =========================
  // ESTADOS
  // =========================
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);

  // Actualizado
  // Mostrar/Ocultar contraseña
  const [showPassword, setShowPassword] = useState(false);

  // Actualizado
  // Recordar sesión
  const [rememberMe, setRememberMe] = useState(false);

  // Actualizado
  // Controlar error del logo
  const [logoError, setLogoError] = useState(false);


  // =========================
  // ACTUALIZADO
  // Verificar sesión activa
  // =========================
  useEffect(() => {

    const usuarioActivo = localStorage.getItem('usuarioActivo');

    if (usuarioActivo) {
      window.location.reload();
    }

  }, []);


  // =========================
  // ACTUALIZADO
  // Iniciar sesión
  // =========================
  const handleSubmit = (e) => {

    e.preventDefault();

    setCargando(true);

    // Editado
    // Validar campos vacíos
    if (!username.trim() || !password.trim()) {

      alert('Por favor, complete todos los campos');

      setCargando(false);

      return;
    }

    // Actualizado
    // Buscar usuario activo
    const usuarioEncontrado = usuarios.find(
      usuario =>
        usuario.username === username &&
        usuario.password === password &&
        usuario.activo
    );

    setTimeout(() => {

      // Login correcto
      if (usuarioEncontrado) {

        try {

          localStorage.setItem(
            'usuarioActivo',
            JSON.stringify(usuarioEncontrado)
          );

          alert(`¡Bienvenido ${usuarioEncontrado.nombre}!`);

          // Editado
          // Ejecutar login
          if (onLogin) {
            onLogin();
          } else {
            window.location.reload();
          }

        } catch (error) {

          console.error(
            'Error al iniciar sesión:',
            error
          );
        }

      } else {

        // Actualizado
        // Limpiar contraseña incorrecta
        alert('Usuario o contraseña incorrectos');

        setPassword('');
      }

      setCargando(false);

    }, 800);
  };


  // =========================
  // ACTUALIZADO
  // Autocompletar usuarios prueba
  // =========================
  const usarCredenciales = (usuario, contraseña) => {

    setUsername(usuario);
    setPassword(contraseña);
  };


  // =========================
  // ACTUALIZADO
  // Usuarios de prueba dinámicos
  // =========================
  const usuariosPrueba = [
    {
      usuario: 'admin',
      password: 'admin123',
      rol: 'Administrador',
      icono: 'bi-shield-fill',
      clase: 'admin'
    },
    {
      usuario: 'vendedor',
      password: 'vend123',
      rol: 'Vendedor',
      icono: 'bi-person-badge-fill',
      clase: 'seller'
    },
    {
      usuario: 'almacen',
      password: 'alma123',
      rol: 'Almacenero',
      icono: 'bi-box-seam-fill',
      clase: 'warehouse'
    }
  ];


  return (

    <div className="login-container">

      <div className="login-box">


        {/* =========================
            HEADER
        ========================= */}
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

          <p className="subtitulo">
            Sistema de Gestión de Inventario
          </p>

          <span className="ubicacion">

            <i className="bi bi-geo-alt-fill"></i>

            Lima, Perú

          </span>

        </div>


        {/* =========================
            FORMULARIO
        ========================= */}
        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

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
                type={showPassword ? 'text' : 'password'}
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={cargando}
              />

              <i className="bi bi-lock-fill input-icon"></i>

              {/* Actualizado */}
              {/* Mostrar/Ocultar contraseña */}
              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >

                <i
                  className={`bi ${
                    showPassword
                      ? 'bi-eye-slash-fill'
                      : 'bi-eye-fill'
                  }`}
                ></i>

              </button>

            </div>

          </div>


          {/* OPCIONES */}
          <div className="options-row">

            {/* Actualizado */}
            {/* Recordar sesión */}
            <label className="remember-checkbox">

              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(e.target.checked)
                }
              />

              Recordar sesión

            </label>


            {/* Editado */}
            {/* Recuperar contraseña */}
            <a
              href="#"
              className="forgot-link"
              onClick={(e) => e.preventDefault()}
            >
              ¿Olvidó su contraseña?
            </a>

          </div>


          {/* BOTÓN LOGIN */}
          <button
            type="submit"
            className="btn-login"
            disabled={cargando}
          >

            {cargando ? (

              <>
                ⏳ Iniciando sesión...
              </>

            ) : (

              <>
                <i className="bi bi-box-arrow-in-right"></i>
                INICIAR SESIÓN
              </>

            )}

          </button>

        </form>


        {/* =========================
            USUARIOS DE PRUEBA
        ========================= */}
        <div className="test-users">

          <h3>

            <i className="bi bi-people-fill"></i>

            Usuarios de prueba

          </h3>


          {/* ACTUALIZADO */}
          {/* Render dinámico */}
          <div className="users-grid">

            {usuariosPrueba.map((usuario) => (

              <div
                key={usuario.usuario}
                className="user-card"
                onClick={() =>
                  usarCredenciales(
                    usuario.usuario,
                    usuario.password
                  )
                }
              >

                <div
                  className={`user-avatar ${usuario.clase}`}
                >

                  <i className={`bi ${usuario.icono}`}></i>

                </div>

                <div className="user-info">

                  <span className="user-role">
                    {usuario.rol}
                  </span>

                  <code className="user-credentials">

                    {usuario.usuario}
                    {' / '}
                    {usuario.password}

                  </code>

                </div>

              </div>

            ))}

          </div>

        </div>


        {/* FOOTER */}
        <div className="login-footer">

          <p>
            © 2024 Saga Falabella - Sistema de Gestión de Inventario
          </p>

        </div>

      </div>
    </div>
  );
};

export default Login;
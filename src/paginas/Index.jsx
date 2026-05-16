// src/paginas/Index.jsx

import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Cabeza from './components/Cabeza';
import { categorias, obtenerProductosIniciales } from '../data/data';

const Index = () => {

  const navigate = useNavigate();

  // ================================
  // Actualizado - Obtener productos
  // ================================
  const productos = useMemo(
    () => obtenerProductosIniciales(),
    []
  );

  // ================================
  // Actualizado - Validar sesión
  // ================================
  useEffect(() => {

    const usuarioActivo = localStorage.getItem('usuarioActivo');

    if (!usuarioActivo) {
      navigate('/');
    }

  }, [navigate]);

  // ================================
  // Actualizado - Usuario activo
  // ================================
  const usuario = JSON.parse(
    localStorage.getItem('usuarioActivo') || '{}'
  );

  // ================================
  // Actualizado - Estadísticas
  // ================================
  const totalProductos = productos.length;

  const valorTotalInventario = productos.reduce(
    (total, producto) =>
      total + (producto.precio * producto.stock),
    0
  );

  const productosStockBajo = productos.filter(
    producto =>
      producto.stock > 0 &&
      producto.stock <= producto.stockMinimo
  );

  const productosAgotados = productos.filter(
    producto => producto.stock === 0
  );

  const productosEnAlerta = productos.filter(
    producto => producto.stock <= producto.stockMinimo
  );

  // ================================
  // Actualizado - Últimos productos
  // ================================
  const ultimosProductos = [...productos]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  // ================================
  // Actualizado - Editar demo
  // ================================
  const irAEditarDemo = () => {

    localStorage.setItem(
      'productoEditando',
      JSON.stringify({ id: 1 })
    );

    navigate('/editar');
  };

  // ================================
  // Actualizado - Estado stock
  // ================================
  const getEstadoStock = (producto) => {

    if (producto.stock === 0) {
      return 'agotado';
    }

    if (producto.stock <= producto.stockMinimo) {
      return 'bajo';
    }

    return 'normal';
  };

  return (
    <>
      <Cabeza />

      <div className="dashboard-container-moderno">
        <div className="dashboard-content">

          {/* ================================= */}
          {/* HEADER */}
          {/* ================================= */}

          <div className="dashboard-header-moderno">

            <div className="header-left">
              <h1>
                <i className="bi bi-speedometer2"></i>
                Panel de Control
              </h1>

              <p className="fecha-actual">
                <i className="bi bi-calendar3"></i>

                {new Date().toLocaleDateString(
                  'es-PE',
                  {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }
                )}
              </p>
            </div>

            <div className="header-right">
              <span className="bienvenida">
                <i className="bi bi-person-circle"></i>

                ¡Bienvenido,
                {' '}
                {usuario.nombre || 'Usuario'}!
              </span>
            </div>

          </div>

          {/* ================================= */}
          {/* TARJETA DEMO */}
          {/* ================================= */}

          <div className="demo-card-moderno">

            <div className="demo-icon">
              <i className="bi bi-flask"></i>
            </div>

            <div className="demo-content">

              <div className="demo-text">
                <h3>Modo Prueba</h3>
                <p>
                  Prueba rápidamente la edición
                  de productos.
                </p>
              </div>

              <button
                onClick={irAEditarDemo}
                className="demo-button-moderno"
              >
                <i className="bi bi-pencil-square"></i>

                Ir a Editar Producto
              </button>

            </div>
          </div>

          {/* ================================= */}
          {/* KPI CARDS */}
          {/* ================================= */}

          <div className="kpi-grid-moderno">

            {/* TOTAL PRODUCTOS */}

            <div className="kpi-card-moderno total">

              <div className="kpi-icon-wrapper">
                <i className="bi bi-box-seam"></i>
              </div>

              <div className="kpi-info">

                <span className="kpi-label">
                  Total Productos
                </span>

                <div className="kpi-value-wrapper">

                  <span className="kpi-value">
                    {totalProductos}
                  </span>

                  <span className="kpi-trend">
                    <i className="bi bi-arrow-up"></i>
                    +12%
                  </span>

                </div>

                <span className="kpi-footer">
                  Productos registrados
                </span>

              </div>
            </div>

            {/* VALOR TOTAL */}

            <div className="kpi-card-moderno valor">

              <div className="kpi-icon-wrapper">
                <i className="bi bi-currency-dollar"></i>
              </div>

              <div className="kpi-info">

                <span className="kpi-label">
                  Valor Inventario
                </span>

                <div className="kpi-value-wrapper">

                  <span className="kpi-value">
                    S/ {valorTotalInventario.toFixed(2)}
                  </span>

                  <span className="kpi-trend positive">
                    <i className="bi bi-graph-up-arrow"></i>
                    +8%
                  </span>

                </div>

                <span className="kpi-footer">
                  Valor total almacenado
                </span>

              </div>
            </div>

            {/* STOCK BAJO */}

            <div className="kpi-card-moderno warning">

              <div className="kpi-icon-wrapper">
                <i className="bi bi-exclamation-triangle"></i>
              </div>

              <div className="kpi-info">

                <span className="kpi-label">
                  Stock Bajo
                </span>

                <div className="kpi-value-wrapper">

                  <span className="kpi-value">
                    {productosStockBajo.length}
                  </span>

                  {productosStockBajo.length > 0 && (
                    <span className="kpi-badge warning">
                      Atención
                    </span>
                  )}

                </div>

                <span className="kpi-footer">
                  Productos por agotarse
                </span>

              </div>
            </div>

            {/* AGOTADOS */}

            <div className="kpi-card-moderno danger">

              <div className="kpi-icon-wrapper">
                <i className="bi bi-x-circle"></i>
              </div>

              <div className="kpi-info">

                <span className="kpi-label">
                  Sin Stock
                </span>

                <div className="kpi-value-wrapper">

                  <span className="kpi-value">
                    {productosAgotados.length}
                  </span>

                  {productosAgotados.length > 0 && (
                    <span className="kpi-badge danger">
                      Agotado
                    </span>
                  )}

                </div>

                <span className="kpi-footer">
                  Productos agotados
                </span>

              </div>
            </div>

          </div>

          {/* ================================= */}
          {/* ÚLTIMOS PRODUCTOS */}
          {/* ================================= */}

          <div className="grid-card">

            <div className="grid-card-header">

              <div className="header-title">
                <i className="bi bi-clock-history"></i>
                <h3>Últimos Productos</h3>
              </div>

              <button
                onClick={() => navigate('/productos')}
                className="view-all-link"
              >
                Ver todos
              </button>

            </div>

            <div className="grid-card-body">

              {ultimosProductos.length > 0 ? (

                <div className="productos-lista">

                  {ultimosProductos.map(producto => (

                    <div
                      key={producto.id}
                      className="producto-item-moderno"
                    >

                      <div className="producto-imagen">

                        <img
                          src={
                            producto.imagen ||
                            'https://via.placeholder.com/50'
                          }
                          alt={producto.nombre}
                        />

                      </div>

                      <div className="producto-detalles">

                        <h4>{producto.nombre}</h4>

                        <div className="producto-meta">

                          <span className="categoria-badge">
                            {producto.categoria}
                          </span>

                          <span className="talla-color">
                            {producto.talla}
                            {' | '}
                            {producto.color}
                          </span>

                        </div>
                      </div>

                      <div className="producto-stock-info">

                        <span className="precio">
                          S/ {producto.precio.toFixed(2)}
                        </span>

                        <span
                          className={`stock-badge ${getEstadoStock(producto)}`}
                        >
                          Stock: {producto.stock}
                        </span>

                      </div>

                    </div>

                  ))}

                </div>

              ) : (

                <div className="empty-state">

                  <i className="bi bi-box"></i>

                  <p>No hay productos registrados</p>

                  <button
                    onClick={() => navigate('/registrar-producto')}
                    className="btn-empty"
                  >
                    + Agregar Producto
                  </button>

                </div>

              )}

            </div>
          </div>

        </div>
      </div>
    </>
  );
};

// =====================================
// Actualizado - Colores categorías
// =====================================

const getCategoryColor = (categoria) => {

  const colores = {
    polos: '#008542',
    poleras: '#2563eb',
    buzos: '#dc2626',
    shorts: '#f59e0b',
    accesorios: '#8b5cf6'
  };

  return colores[categoria] || '#6b7280';
};

export default Index;
// src/paginas/Index.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cabeza from './components/Cabeza';
import { categorias, obtenerProductosIniciales } from '../data/data';

const Index = () => {
  const navigate = useNavigate();
  const [productos] = useState(obtenerProductosIniciales());

  // Estadísticas
  const total = productos.length;
  const valorTotal = productos.reduce((suma, p) => suma + (p.precio * p.stock), 0);
  const stockBajoCount = productos.filter(p => p.stock > 0 && p.stock <= p.stockMinimo).length;
  const sinStockCount = productos.filter(p => p.stock === 0).length;
  const productosEnAlerta = productos.filter(p => p.stock <= p.stockMinimo);
  const ultimosProductos = [...productos].sort((a, b) => b.id - a.id).slice(0, 5);

  useEffect(() => {
    const usuarioActivo = localStorage.getItem('usuarioActivo');
    if (!usuarioActivo) {
      window.location.href = '/';
    }
  }, []);

  const irAEditarDemo = () => {
    localStorage.setItem('productoEditando', JSON.stringify({ id: 1 }));
    navigate('/editar');
  };

  const usuario = JSON.parse(localStorage.getItem('usuarioActivo') || '{}');

  return (
    <>
      <Cabeza />
      
      <div className="dashboard-container-moderno">
        <div className="dashboard-content">
          
          {/* HEADER DEL DASHBOARD */}
          <div className="dashboard-header-moderno">
            <div className="header-left">
              <h1>
                <i className="bi bi-speedometer2"></i>
                Panel de Control
              </h1>
              <p className="fecha-actual">
                <i className="bi bi-calendar3"></i>
                {new Date().toLocaleDateString('es-PE', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="header-right">
              <span className="bienvenida">
                <i className="bi bi-person-circle"></i>
                ¡Bienvenido, {usuario.nombre || 'Usuario'}!
              </span>
            </div>
          </div>

          {/* DEMO CARD - MODO PRUEBA */}
          <div className="demo-card-moderno">
            <div className="demo-icon">
              <i className="bi bi-flask"></i>
            </div>
            <div className="demo-content">
              <div className="demo-text">
                <h3>Prueba</h3>
                <p>Prueba la funcionalidad de edición de productos</p>
              </div>
              <button onClick={irAEditarDemo} className="demo-button-moderno">
                <i className="bi bi-pencil-square"></i>
                Ir a Editar Producto 
              </button>
            </div>
          </div>

          {/* KPI CARDS - TARJETAS DE ESTADÍSTICAS */}
          <div className="kpi-grid-moderno">
            
            {/* TARJETA 1 - TOTAL PRODUCTOS */}
            <div className="kpi-card-moderno total">
              <div className="kpi-icon-wrapper">
                <i className="bi bi-box-seam"></i>
              </div>
              <div className="kpi-info">
                <span className="kpi-label">Total Productos</span>
                <div className="kpi-value-wrapper">
                  <span className="kpi-value">{total}</span>
                  <span className="kpi-trend">
                    <i className="bi bi-arrow-up"></i>
                    +12% vs mes anterior
                  </span>
                </div>
                <span className="kpi-footer">
                  <i className="bi bi-check-circle"></i>
                  Productos registrados
                </span>
              </div>
            </div>

            {/* TARJETA 2 - VALOR TOTAL */}
            <div className="kpi-card-moderno valor">
              <div className="kpi-icon-wrapper">
                <i className="bi bi-currency-dollar"></i>
              </div>
              <div className="kpi-info">
                <span className="kpi-label">Valor Total</span>
                <div className="kpi-value-wrapper">
                  <span className="kpi-value">S/ {valorTotal.toFixed(2)}</span>
                  <span className="kpi-trend positive">
                    <i className="bi bi-graph-up-arrow"></i>
                    +8.5%
                  </span>
                </div>
                <span className="kpi-footer">
                  <i className="bi bi-calculator"></i>
                  Valor del inventario
                </span>
              </div>
            </div>

            {/* TARJETA 3 - STOCK BAJO */}
            <div className="kpi-card-moderno warning">
              <div className="kpi-icon-wrapper">
                <i className="bi bi-exclamation-triangle"></i>
              </div>
              <div className="kpi-info">
                <span className="kpi-label">Stock Bajo</span>
                <div className="kpi-value-wrapper">
                  <span className="kpi-value">{stockBajoCount}</span>
                  {stockBajoCount > 0 && (
                    <span className="kpi-badge warning">Requiere atención</span>
                  )}
                </div>
                <span className="kpi-footer">
                  <i className="bi bi-clock-history"></i>
                  Productos por agotar
                </span>
              </div>
            </div>

            {/* TARJETA 4 - SIN STOCK */}
            <div className="kpi-card-moderno danger">
              <div className="kpi-icon-wrapper">
                <i className="bi bi-x-circle"></i>
              </div>
              <div className="kpi-info">
                <span className="kpi-label">Sin Stock</span>
                <div className="kpi-value-wrapper">
                  <span className="kpi-value">{sinStockCount}</span>
                  {sinStockCount > 0 && (
                    <span className="kpi-badge danger">Agotado</span>
                  )}
                </div>
                <span className="kpi-footer">
                  <i className="bi bi-exclamation-circle"></i>
                  Productos agotados
                </span>
              </div>
            </div>
          </div>

          {/* GRID DE CONTENIDO - 2 COLUMNAS */}
          <div className="dashboard-grid-moderno">
            
            {/* COLUMNA 1 - ÚLTIMOS PRODUCTOS */}
            <div className="grid-card">
              <div className="grid-card-header">
                <div className="header-title">
                  <i className="bi bi-clock-history"></i>
                  <h3>Últimos Productos</h3>
                </div>
                <a href="/productos" className="view-all-link">
                  Ver todos
                  <i className="bi bi-arrow-right"></i>
                </a>
              </div>
              
              <div className="grid-card-body">
                {ultimosProductos.length > 0 ? (
                  <div className="productos-lista">
                    {ultimosProductos.map((producto) => (
                      <div key={producto.id} className="producto-item-moderno">
                        <div className="producto-imagen">
                          <img 
                            src={producto.imagen || 'https://via.placeholder.com/50'} 
                            alt={producto.nombre}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/50?text=Producto';
                            }}
                          />
                        </div>
                        <div className="producto-detalles">
                          <h4>{producto.nombre}</h4>
                          <div className="producto-meta">
                            <span className="categoria-badge">
                              {producto.categoria}
                            </span>
                            <span className="talla-color">
                              {producto.talla} | {producto.color}
                            </span>
                          </div>
                        </div>
                        <div className="producto-stock-info">
                          <span className="precio">S/ {producto.precio.toFixed(2)}</span>
                          <span className={`stock-badge ${producto.stock === 0 ? 'agotado' : producto.stock <= producto.stockMinimo ? 'bajo' : 'normal'}`}>
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
                    <a href="/registrar" className="btn-empty">
                      + Agregar Producto
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* COLUMNA 2 - ALERTAS Y DISTRIBUCIÓN */}
            <div className="grid-card">
              <div className="grid-card-header">
                <div className="header-title">
                  <i className="bi bi-bell"></i>
                  <h3>Alertas de Stock</h3>
                </div>
                <span className="alerta-contador">
                  {productosEnAlerta.length}
                </span>
              </div>
              
              <div className="grid-card-body">
                {productosEnAlerta.length > 0 ? (
                  <div className="alertas-lista">
                    {productosEnAlerta.slice(0, 4).map((producto) => (
                      <div key={producto.id} className="alerta-item-moderno">
                        <div className={`alerta-icono ${producto.stock === 0 ? 'danger' : 'warning'}`}>
                          <i className={`bi ${producto.stock === 0 ? 'bi-x-circle' : 'bi-exclamation-triangle'}`}></i>
                        </div>
                        <div className="alerta-contenido">
                          <div className="alerta-titulo">
                            <span className="producto-nombre">{producto.nombre}</span>
                            <span className={`alerta-estado ${producto.stock === 0 ? 'agotado' : 'bajo'}`}>
                              {producto.stock === 0 ? 'Agotado' : 'Stock Bajo'}
                            </span>
                          </div>
                          <div className="alerta-detalle">
                            <span className="stock-actual">
                              Stock actual: <strong>{producto.stock}</strong>
                            </span>
                            <span className="stock-minimo">
                              Mínimo: {producto.stockMinimo}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {productosEnAlerta.length > 4 && (
                      <a href="/productos" className="ver-mas-alertas">
                        Ver {productosEnAlerta.length - 4} alertas más
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="empty-state success">
                    <i className="bi bi-check-circle"></i>
                    <p>¡Todo en orden! No hay alertas de stock</p>
                  </div>
                )}
              </div>

              {/* DISTRIBUCIÓN POR CATEGORÍA */}
              <div className="distribucion-section">
                <div className="section-header">
                  <i className="bi bi-pie-chart"></i>
                  <h4>Distribución por Categoría</h4>
                </div>
                
                <div className="categorias-grid">
                  {categorias.map((cat) => {
                    const productosCat = productos.filter(p => p.categoria === cat.valor);
                    const cantidad = productosCat.length;
                    const porcentaje = total > 0 ? ((cantidad / total) * 100).toFixed(1) : 0;
                    const valorCat = productosCat.reduce((suma, p) => suma + (p.precio * p.stock), 0);

                    return (
                      <div key={cat.id} className="categoria-item-moderno">
                        <div className="categoria-header">
                          <div className="categoria-nombre">
                            <span className="categoria-color" style={{ backgroundColor: getCategoryColor(cat.valor) }}></span>
                            <span>{cat.nombre}</span>
                          </div>
                          <span className="categoria-cantidad">{cantidad}</span>
                        </div>
                        
                        <div className="progress-bar-moderno">
                          <div 
                            className="progress-fill" 
                            style={{ 
                              width: `${porcentaje}%`,
                              backgroundColor: getCategoryColor(cat.valor)
                            }}
                          ></div>
                        </div>
                        
                        <div className="categoria-footer">
                          <span className="porcentaje">{porcentaje}%</span>
                          <span className="valor">S/ {valorCat.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Función para colores de categorías
const getCategoryColor = (categoria) => {
  const colores = {
    'polos': '#008542',
    'poleras': '#2563eb',
    'buzos': '#dc2626',
    'shorts': '#f59e0b',
    'accesorios': '#8b5cf6'
  };
  return colores[categoria] || '#6b7280';
};

export default Index;
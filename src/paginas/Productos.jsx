// src/paginas/Productos.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cabeza from './components/Cabeza';
import { obtenerProductosIniciales, categorias } from '../data/data';

const Productos = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');
  const [ordenPrecio, setOrdenPrecio] = useState('');
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  useEffect(() => {
    const usuarioActivo = localStorage.getItem('usuarioActivo');
    if (!usuarioActivo) {
      navigate('/');
      return;
    }

    const productosData = obtenerProductosIniciales();
    setProductos(productosData);
    setProductosFiltrados(productosData);
  }, [navigate]);

  // Función para filtrar productos
  const filtrarProductos = () => {
  let filtrados = [...productos];

  // Buscar
  if (busqueda.trim() !== '') {
    const termino = busqueda.toLowerCase();

    filtrados = filtrados.filter(p =>
      p.nombre.toLowerCase().includes(termino) ||
      p.color.toLowerCase().includes(termino) ||
      p.categoria.toLowerCase().includes(termino)
    );
  }

  // Filtrar categoría
  if (categoriaFiltro !== 'todas') {
    filtrados = filtrados.filter(
      p => p.categoria === categoriaFiltro
    );
  }

  // Ordenar por precio
  if (ordenPrecio === 'menor') {
    filtrados.sort((a, b) => a.precio - b.precio);
  }

  if (ordenPrecio === 'mayor') {
    filtrados.sort((a, b) => b.precio - a.precio);
  }

  // Guardar resultado final
  setProductosFiltrados(filtrados);
};

  useEffect(() => {
  filtrarProductos();
}, [busqueda, categoriaFiltro, ordenPrecio, productos]);


  const editarProducto = (id) => {
    const producto = productos.find(p => p.id === id);
    localStorage.setItem('productoEditando', JSON.stringify(producto));
    navigate('/editar');
  };

  const eliminarProducto = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      const nuevosProductos = productos.filter(p => p.id !== id);
      setProductos(nuevosProductos);
      localStorage.setItem('productos', JSON.stringify(nuevosProductos));
    }
  };

 
  // ✅ FUNCIONES DE COLORES - AHORA DENTRO DEL COMPONENTE
  const getColorHex = (color) => {
    const colores = {
      'Negro': '#1e1e1e',
      'Blanco': '#ffffff',
      'Gris': '#6c757d',
      'Azul': '#0d6efd',
      'Azul Marino': '#1e3a5f',
      'Rojo': '#dc3545',
      'Verde': '#198754',
      'Amarillo': '#ffc107',
      'Naranja': '#fd7e14',
      'Morado': '#6f42c1',
      'Rosado': '#d63384',
      'Beige': '#f5f5dc',
      'Café': '#8b4513'
    };
    return colores[color] || '#e9ecef';
  };

  const isDarkColor = (color) => {
    const coloresOscuros = ['Negro', 'Azul Marino', 'Rojo', 'Verde', 'Morado', 'Café'];
    return coloresOscuros.includes(color);
  };

  const getBadgeClass = (stock, stockMinimo) => {
    if (stock === 0) return 'badge-danger';
    if (stock <= stockMinimo) return 'badge-warning';
    return 'badge-success';
  };

  const getBadgeText = (stock, stockMinimo) => {
    if (stock === 0) return 'Agotado';
    if (stock <= stockMinimo) return 'Stock Bajo';
    return 'Disponible';
  };

  const valorTotalInventario = productos.reduce(
  (total, producto) => total + (producto.precio * producto.stock),
  0
  );

  return (
    <>
      <Cabeza />
      
      <div className="productos-container">
        <div className="productos-wrapper">
          
          {/* HEADER - BOTÓN CORREGIDO ✅ */}
          <div className="productos-header">
            <div className="header-left">
              <h1>
                <i className="bi bi-box-seam"></i>
                Inventario de Productos
              </h1>
              <p className="productos-stats">
                <span className="stats-badge">
                  <i className="bi bi-cube"></i> {productos.length} productos totales
                </span>
                <span className="stats-badge">
                  <i className="bi bi-check-circle"></i> {productos.filter(p => p.stock > 0).length} en stock
                </span>
                <span className="stats-badge">
                  <i className="bi bi-exclamation-triangle"></i> {productos.filter(p => p.stock > 0 && p.stock <= p.stockMinimo).length} stock bajo
                </span>
                <span className="stats-badge">
                <i className="bi bi-cash-stack"></i>
                S/ {valorTotalInventario.toFixed(2)}
                </span>

                
              </p>
            </div>
            <div className="header-right">
              <button 
                onClick={() => navigate('/registrar-producto')}
                className="btn-registrar-header"
              >
                <i className="bi bi-plus-circle"></i>
                Nuevo Producto
              </button>
            </div>
          </div>

          {/* FILTROS */}
          <div className="filtros-card">
            <div className="filtros-grid">
              
              {/* Búsqueda */}
              <div className="filtro-item">
                <label className="filtro-label">
                  <i className="bi bi-search"></i>
                  Buscar Producto
                </label>
                <div className="input-contenedor-filtro">
                  <i className="bi bi-search input-icono"></i>
                  <input
                    type="text"
                    placeholder="Buscar por nombre, color o categoría..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="filtro-input"
                  />
                  {busqueda && (
                    <button 
                      className="limpiar-input"
                      onClick={() => setBusqueda('')}
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  )}
                </div>
              </div>

              {/* Filtro por categoría */}
              <div className="filtro-item">
                <label className="filtro-label">
                  <i className="bi bi-grid"></i>
                  Filtrar por Categoría
                </label>
                <div className="select-contenedor-filtro">
                  <i className="bi bi-chevron-down select-icono"></i>
                  <select
                    value={categoriaFiltro}
                    onChange={(e) => setCategoriaFiltro(e.target.value)}
                    className="filtro-select"
                  >
                    <option value="todas">Todas las categorías</option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.valor}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filtro por precios */}
<div className="filtro-item">
  <label className="filtro-label">
    <i className="bi bi-cash"></i>
    Ordenar por Precio
  </label>

  <div className="select-contenedor-filtro">
    <i className="bi bi-chevron-down select-icono"></i>

    <select
      value={ordenPrecio}
      onChange={(e) => setOrdenPrecio(e.target.value)}
      className="filtro-select"
    >
      <option value="">Todos</option>
      <option value="menor">Menor a mayor</option>
      <option value="mayor">Mayor a menor</option>
    </select>
  </div>
</div>
            </div>

            {/* Resultados */}
            <div className="resultados-info">
              <i className="bi bi-list-ul"></i>
              <span>
                Mostrando <strong>{productosFiltrados.length}</strong> de <strong>{productos.length}</strong> productos
              </span>
              {(busqueda || categoriaFiltro !== 'todas') && (
                <button 
                  className="limpiar-filtros"
                  onClick={() => {
                    setBusqueda('');
                    setCategoriaFiltro('todas');
                  }}
                >
                  <i className="bi bi-x-circle"></i>
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>

          {/* TABLA DE PRODUCTOS */}
          <div className="tabla-container">
            {productosFiltrados.length === 0 ? (
              <div className="empty-state">
                <i className="bi bi-inbox"></i>
                <h3>No hay productos</h3>
                <p>No se encontraron productos con los filtros seleccionados.</p>
                <button 
                  onClick={() => {
                    setBusqueda('');
                    setCategoriaFiltro('todas');
                  }}
                  className="btn-empty"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="tabla-responsive">
                <table className="productos-tabla">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Imagen</th>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th>Talla</th>
                      <th>Color</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosFiltrados.map((producto) => (
                      <tr key={producto.id}>
                        <td className="col-id">
                          <span className="id-badge">{producto.id}</span>
                        </td>
                        <td className="col-imagen">
                          <div className="producto-imagen-wrapper">
                            <img 
                              src={producto.imagen || 'https://via.placeholder.com/50'} 
                              alt={producto.nombre}
                              className="producto-imagen"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/50?text=Producto';
                              }}
                            />
                          </div>
                        </td>
                        <td className="col-producto">
                          <div className="producto-info">
                            <span className="producto-nombre">{producto.nombre}</span>
                            <span className="producto-fecha">
                              <i className="bi bi-calendar3"></i>
                              {new Date(producto.fechaRegistro).toLocaleDateString('es-PE')}
                            </span>
                          </div>
                        </td>
                        <td className="col-categoria">
                          <span className={`categoria-tag categoria-${producto.categoria}`}>
                            {producto.categoria}
                          </span>
                        </td>
                        <td className="col-talla">
                          <span className="talla-badge">{producto.talla}</span>
                        </td>
                        <td className="col-color">
                          <span 
                            className="color-indicador" 
                            style={{
                              backgroundColor: getColorHex(producto.color),
                              color: isDarkColor(producto.color) ? 'white' : 'black',
                              border: producto.color === 'Blanco' ? '1px solid #e2e8f0' : 'none'
                            }}
                          >
                            {producto.color}
                          </span>
                        </td>
                        <td className="col-precio">
                          <span className="precio-valor">S/ {producto.precio.toFixed(2)}</span>
                        </td>
                        <td className="col-stock">
                          <div className="stock-info">
                            <span className={`stock-numero ${producto.stock === 0 ? 'stock-cero' : ''}`}>
                              {producto.stock}
                            </span>
                            {producto.stock <= producto.stockMinimo && producto.stock > 0 && (
                              <span className="stock-minimo">
                                Mín: {producto.stockMinimo}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="col-estado">
                          <span className={`badge-estado ${getBadgeClass(producto.stock, producto.stockMinimo)}`}>
                            {getBadgeText(producto.stock, producto.stockMinimo)}
                          </span>
                        </td>
                        <td className="col-acciones">
                          <div className="acciones-wrapper">
                            <button
                              onClick={() => editarProducto(producto.id)}
                              className="btn-accion editar"
                              title="Editar producto"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              onClick={() => eliminarProducto(producto.id)}
                              className="btn-accion eliminar"
                              title="Eliminar producto"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                            <button
                              onClick={() => editarProducto(producto.id)}
                              className="btn-accion ver"
                              title="Ver detalles"
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* PAGINACIÓN */}
          {productosFiltrados.length > 0 && (
            <div className="paginacion-simple">
              <span className="paginacion-info">
                Mostrando 1-{productosFiltrados.length} de {productosFiltrados.length} productos
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Productos;
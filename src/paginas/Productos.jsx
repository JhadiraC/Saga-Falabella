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

  // =========================
  // ACTUALIZADO
  // Verificar usuario activo y cargar productos guardados
  // =========================
  useEffect(() => {

    const usuarioActivo = localStorage.getItem('usuarioActivo');

    if (!usuarioActivo) {
      navigate('/');
      return;
    }

    const productosGuardados = JSON.parse(
      localStorage.getItem('productos')
    );

    // Editado
    // Si existen productos guardados usa esos,
    // si no usa los iniciales
    const productosData =
      productosGuardados || obtenerProductosIniciales();

    setProductos(productosData);
    setProductosFiltrados(productosData);

  }, [navigate]);


  // =========================
  // ACTUALIZADO
  // Filtrar y ordenar productos
  // =========================
  const filtrarProductos = () => {

    let filtrados = [...productos];

    // Buscar productos
    if (busqueda.trim() !== '') {

      const termino = busqueda.toLowerCase();

      filtrados = filtrados.filter(producto =>
        producto.nombre.toLowerCase().includes(termino) ||
        producto.color.toLowerCase().includes(termino) ||
        producto.categoria.toLowerCase().includes(termino)
      );
    }

    // Filtrar por categoría
    if (categoriaFiltro !== 'todas') {

      filtrados = filtrados.filter(
        producto => producto.categoria === categoriaFiltro
      );
    }

    // Editado
    // Ordenar por precio
    if (ordenPrecio) {

      filtrados.sort((a, b) =>
        ordenPrecio === 'menor'
          ? a.precio - b.precio
          : b.precio - a.precio
      );
    }

    // Actualizado
    // Guardar productos filtrados
    setProductosFiltrados(filtrados);
  };


  // =========================
  // ACTUALIZADO
  // Ejecutar filtros automáticamente
  // =========================
  useEffect(() => {
    filtrarProductos();
  }, [busqueda, categoriaFiltro, ordenPrecio, productos]);


  // =========================
  // ACTUALIZADO
  // Editar producto
  // =========================
  const editarProducto = (id) => {

    const producto = productos.find(
      producto => producto.id === id
    );

    // Editado
    // Validar si el producto existe
    if (!producto) return;

    localStorage.setItem(
      'productoEditando',
      JSON.stringify(producto)
    );

    navigate('/editar');
  };


  // =========================
  // ACTUALIZADO
  // Eliminar producto
  // =========================
  const eliminarProducto = (id) => {

    const confirmar = window.confirm(
      '¿Estás seguro de eliminar este producto?'
    );

    // Editado
    // Cancelar eliminación
    if (!confirmar) return;

    const nuevosProductos = productos.filter(
      producto => producto.id !== id
    );

    // Actualizar estado
    setProductos(nuevosProductos);

    // Guardar cambios
    localStorage.setItem(
      'productos',
      JSON.stringify(nuevosProductos)
    );
  };


  // =========================
  // FUNCIONES DE COLORES
  // =========================
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


  // =========================
  // ACTUALIZADO
  // Validar colores oscuros
  // =========================
  const isDarkColor = (color) => {

    const coloresOscuros = [
      'Negro',
      'Azul Marino',
      'Rojo',
      'Verde',
      'Morado',
      'Café'
    ];

    return coloresOscuros.includes(color);
  };


  // =========================
  // ACTUALIZADO
  // Unificar estado de stock
  // =========================
  const getEstadoStock = (stock, stockMinimo) => {

    if (stock === 0) {
      return {
        clase: 'badge-danger',
        texto: 'Agotado'
      };
    }

    if (stock <= stockMinimo) {
      return {
        clase: 'badge-warning',
        texto: 'Stock Bajo'
      };
    }

    return {
      clase: 'badge-success',
      texto: 'Disponible'
    };
  };


  // =========================
  // ACTUALIZADO
  // Calcular valor total del inventario
  // =========================
  const valorTotalInventario = productos.reduce(
    (total, producto) =>
      total + (producto.precio * producto.stock),
    0
  );


  return (
    <>
      <Cabeza />

      <div className="productos-container">
        <div className="productos-wrapper">

          {/* HEADER */}
          <div className="productos-header">

            <div className="header-left">

              <h1>
                <i className="bi bi-box-seam"></i>
                Inventario de Productos
              </h1>

              <p className="productos-stats">

                <span className="stats-badge">
                  <i className="bi bi-cube"></i>
                  {' '}
                  {productos.length} productos totales
                </span>

                <span className="stats-badge">
                  <i className="bi bi-check-circle"></i>
                  {' '}
                  {productos.filter(p => p.stock > 0).length} en stock
                </span>

                <span className="stats-badge">
                  <i className="bi bi-exclamation-triangle"></i>
                  {' '}
                  {
                    productos.filter(
                      p =>
                        p.stock > 0 &&
                        p.stock <= p.stockMinimo
                    ).length
                  }
                  {' '}
                  stock bajo
                </span>

                <span className="stats-badge">
                  <i className="bi bi-cash-stack"></i>
                  {' '}
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


          {/* TABLA */}
          <div className="tabla-container">

            <div className="tabla-responsive">

              <table className="productos-tabla">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>

                  {productosFiltrados.map((producto) => {

                    // Editado
                    // Obtener estado del stock
                    const estado = getEstadoStock(
                      producto.stock,
                      producto.stockMinimo
                    );

                    return (

                      <tr key={producto.id}>

                        <td>
                          {producto.id}
                        </td>

                        <td>
                          {producto.nombre}
                        </td>

                        <td>
                          S/ {producto.precio.toFixed(2)}
                        </td>

                        <td>
                          {producto.stock}
                        </td>

                        {/* ACTUALIZADO */}
                        <td className="col-estado">

                          <span
                            className={`badge-estado ${estado.clase}`}
                          >
                            {estado.texto}
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

                          </div>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Productos;
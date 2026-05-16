// src/paginas/EditarProducto.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Cabeza from './components/Cabeza';

import {
  obtenerProductosIniciales,
  guardarEnLocalStorage,
  categorias,
  tallas,
  colores
} from '../data/data';

const EditarProducto = () => {

  const navigate = useNavigate();

  // =========================================
  // Actualizado - Estados
  // =========================================

  const [formData, setFormData] = useState(null);

  const [previewUrl, setPreviewUrl] = useState('');

  const [guardando, setGuardando] = useState(false);

  const [cargando, setCargando] = useState(true);

  // =========================================
  // Actualizado - URL válida
  // =========================================

  const urlRegex =
    /https?:\/\/.*\.(?:png|jpg|jpeg|webp|gif|svg)/i;

  // =========================================
  // Actualizado - Validar sesión y producto
  // =========================================

  useEffect(() => {

    const productoGuardado =
      localStorage.getItem('productoEditando');

    if (!productoGuardado) {

      alert('No se encontró el producto');

      navigate('/productos');

      return;
    }

    try {

      const productoStorage =
        JSON.parse(productoGuardado);

      const productos =
        obtenerProductosIniciales();

      const productoEncontrado =
        productos.find(
          producto =>
            producto.id === productoStorage.id
        );

      if (!productoEncontrado) {

        alert('Producto no encontrado');

        navigate('/productos');

        return;
      }

      setFormData(productoEncontrado);

      setPreviewUrl(
        productoEncontrado.imagen || ''
      );

    } catch (error) {

      console.error(error);

      navigate('/productos');

    } finally {

      setCargando(false);
    }

  }, [navigate]);

  // =========================================
  // Actualizado - Manejar cambios
  // =========================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Actualizar preview
    if (name === 'imagen') {
      setPreviewUrl(value);
    }
  };

  // =========================================
// NUEVO - Subir imagen local
// =========================================

const manejarImagenLocal = (e) => {

  const archivo = e.target.files[0];

  if (!archivo) return;

  const lector = new FileReader();

  lector.onloadend = () => {

    setFormData(prev => ({
      ...prev,
      imagen: lector.result
    }));

    setPreviewUrl(lector.result);

  };

  lector.readAsDataURL(archivo);
};

  // =========================================
  // Actualizado - Imagen inválida
  // =========================================

  const handleImageError = () => {

    setPreviewUrl(
      'https://via.placeholder.com/300x300?text=Sin+Imagen'
    );
  };

  // =========================================
  // Actualizado - Estado del stock
  // =========================================

  const getEstadoStock = () => {

    if (formData.stock === 0) {
      return {
        clase: 'bg-danger',
        texto: 'Agotado'
      };
    }

    if (formData.stock <= formData.stockMinimo) {
      return {
        clase: 'bg-warning',
        texto: 'Stock Bajo'
      };
    }

    return {
      clase: 'bg-success',
      texto: 'Disponible'
    };
  };

  // =========================================
  // Actualizado - Validar formulario
  // =========================================

  const validarFormulario = () => {

    if (formData.nombre.trim().length < 3) {

      alert(
        'El nombre debe tener mínimo 3 caracteres'
      );

      return false;
    }

    if (parseFloat(formData.precio) <= 0) {

      alert(
        'El precio debe ser mayor a 0'
      );

      return false;
    }

    if (parseInt(formData.stock) < 0) {

      alert(
        'El stock no puede ser negativo'
      );

      return false;
    }

    if (
      parseInt(formData.stockMinimo) >
      parseInt(formData.stock)
    ) {

      alert(
        'El stock mínimo no puede ser mayor al stock'
      );

      return false;
    }

    // Validar URL
    if (
      formData.imagen &&
      !urlRegex.test(formData.imagen)
    ) {

      alert(
        'La URL de imagen no es válida'
      );

      return false;
    }

    return true;
  };

  // =========================================
  // Actualizado - Guardar producto
  // =========================================

  const handleSubmit = (e) => {

    e.preventDefault();

    if (!validarFormulario()) return;

    setGuardando(true);

    const productos =
      obtenerProductosIniciales();

    const index =
      productos.findIndex(
        producto =>
          producto.id === formData.id
      );

    if (index === -1) {

      alert('Producto no encontrado');

      setGuardando(false);

      return;
    }

    // Producto actualizado
    const productoActualizado = {

      ...formData,

      precio: parseFloat(formData.precio),

      stock: parseInt(formData.stock),

      stockMinimo: parseInt(formData.stockMinimo),

      disponible:
        parseInt(formData.stock) > 0,

      imagen:
        formData.imagen ||
        'https://via.placeholder.com/150'
    };

    productos[index] =
      productoActualizado;

    guardarEnLocalStorage(productos);

    localStorage.removeItem(
      'productoEditando'
    );

    setGuardando(false);

    alert(
      '✅ Producto actualizado correctamente'
    );

    navigate('/productos');
  };

  // =========================================
  // Actualizado - Loading
  // =========================================

  if (cargando) {

    return (
      <>
        <Cabeza />

        <div className="container mt-5 text-center">

          <div
            className="spinner-border text-success"
            role="status"
          >
            <span className="visually-hidden">
              Cargando...
            </span>
          </div>

          <p className="mt-3">
            Cargando producto...
          </p>

        </div>
      </>
    );
  }

  if (!formData) return null;

  // =========================================
  // Actualizado - Estado stock
  // =========================================

  const estadoStock = getEstadoStock();

  return (
    <>
      <Cabeza />

      <div className="dashboard-container">

        <main className="dashboard-main">

          <div className="editar-producto-container">

            {/* ================================= */}
            {/* HEADER */}
            {/* ================================= */}

            <div className="editar-header">

              <div className="editar-header-content">

                <div>

                  <h1>
                    <i className="bi bi-pencil-square"></i>
                    Editar Producto
                  </h1>

                  <div className="producto-badges">

                    <span className="badge bg-secondary me-2">
                      ID: {formData.id}
                    </span>

                    <span
                      className={`badge ${estadoStock.clase}`}
                    >
                      {estadoStock.texto}
                    </span>

                  </div>

                </div>

                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => navigate('/productos')}
                >
                  <i className="bi bi-x-lg"></i>

                  Cancelar
                </button>

              </div>
            </div>

            {/* ================================= */}
            {/* FORMULARIO */}
            {/* ================================= */}

            <div className="editar-form-card">

              <form onSubmit={handleSubmit}>

                <div className="row">

                  {/* ================================= */}
                  {/* DATOS PRODUCTO */}
                  {/* ================================= */}

                  <div className="col-lg-8">

                    {/* NOMBRE */}

                    <div className="form-group-moderno">

                      <label className="form-label">
                        Nombre Producto
                      </label>

                      <input
                        type="text"
                        className="form-control-moderno"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                      />

                    </div>

                    {/* CATEGORÍA */}

                    <div className="form-group-moderno">

                      <label className="form-label">
                        Categoría
                      </label>

                      <select
                        className="form-select-moderno"
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleChange}
                      >

                        {categorias.map(cat => (

                          <option
                            key={cat.id}
                            value={cat.valor}
                          >
                            {cat.nombre}
                          </option>

                        ))}

                      </select>

                    </div>

                    {/* TALLA Y COLOR */}

                    <div className="row">

                      <div className="col-md-6">

                        <div className="form-group-moderno">

                          <label>
                            Talla
                          </label>

                          <select
                            className="form-select-moderno"
                            name="talla"
                            value={formData.talla}
                            onChange={handleChange}
                          >

                            {tallas.map(talla => (

                              <option
                                key={talla}
                                value={talla}
                              >
                                {talla}
                              </option>

                            ))}

                          </select>

                        </div>
                      </div>

                      <div className="col-md-6">

                        <div className="form-group-moderno">

                          <label>
                            Color
                          </label>

                          <select
                            className="form-select-moderno"
                            name="color"
                            value={formData.color}
                            onChange={handleChange}
                          >

                            {colores.map(color => (

                              <option
                                key={color}
                                value={color}
                              >
                                {color}
                              </option>

                            ))}

                          </select>

                        </div>
                      </div>

                    </div>

                    {/* PRECIO Y STOCK */}

                    <div className="row">

                      <div className="col-md-6">

                        <div className="form-group-moderno">

                          <label>
                            Precio
                          </label>

                          <input
                            type="number"
                            className="form-control-moderno"
                            name="precio"
                            value={formData.precio}
                            onChange={handleChange}
                            step="0.01"
                          />

                        </div>
                      </div>

                      <div className="col-md-6">

                        <div className="form-group-moderno">

                          <label>
                            Stock
                          </label>

                          <input
                            type="number"
                            className="form-control-moderno"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                          />

                        </div>
                      </div>

                    </div>

                    {/* STOCK MÍNIMO */}

                    <div className="form-group-moderno">

                      <label>
                        Stock Mínimo
                      </label>

                      <input
                        type="number"
                        className="form-control-moderno"
                        name="stockMinimo"
                        value={formData.stockMinimo}
                        onChange={handleChange}
                      />

                    </div>

                  </div>

                  {/* ================================= */}
                  {/* IMAGEN */}
                  {/* ================================= */}

                  <div className="col-lg-4">

                    <div className="imagen-card">

                      <div className="imagen-header">

                        <i className="bi bi-image"></i>

                        <h3>Imagen</h3>

                      </div>

                      <img
                        src={
                          previewUrl ||
                          'https://via.placeholder.com/300'
                        }
                        alt="Preview"
                        className="imagen-preview"
                        onError={handleImageError}
                      />

                      <div className="form-group mt-3">

                        <label>

                         <i className="bi bi-upload"></i>

                        Seleccionar Archivo

                        </label>

                      <input
                          type="file"
                          accept="image/*"
                          onChange={manejarImagenLocal}
                          className="form-control"
                       />

                      <small className="text-muted">

                         JPG, PNG, WEBP o GIF

                       </small>

                      </div>
              
                    </div>

                  </div>

                </div>

                {/* ================================= */}
                {/* FOOTER */}
                {/* ================================= */}

                <div className="acciones-footer">

                  <button
                    type="button"
                    className="btn-cancelar-footer"
                    onClick={() => navigate('/productos')}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="btn-guardar"
                    disabled={guardando}
                  >

                    {guardando
                      ? 'Guardando...'
                      : 'Guardar Cambios'}

                  </button>

                </div>

              </form>

            </div>

          </div>

        </main>

      </div>
    </>
  );
};

export default EditarProducto;
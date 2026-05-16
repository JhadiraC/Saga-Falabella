// src/paginas/RegistrarProducto.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Cabeza from './components/Cabeza';

import {
  obtenerProductosIniciales,
  guardarEnLocalStorage,
  generarNuevoId,
  categorias,
  tallas,
  colores
} from '../data/data';

const RegistrarProducto = () => {

  const navigate = useNavigate();

  // =========================
  // ACTUALIZADO
  // Estado inicial reutilizable
  // =========================
  const estadoInicial = {
    nombre: '',
    categoria: '',
    talla: '',
    color: '',
    precio: '',
    stock: '',
    stockMinimo: '5',
    imagen: ''
  };

  // =========================
  // ESTADOS
  // =========================
  const [formData, setFormData] = useState(estadoInicial);

  const [previewUrl, setPreviewUrl] = useState('');

  const [guardando, setGuardando] = useState(false);

  const [imagenValida, setImagenValida] = useState(true);


  // =========================
  // ACTUALIZADO
  // Validar sesión activa
  // =========================
  useEffect(() => {

    const usuarioActivo =
      localStorage.getItem('usuarioActivo');

    if (!usuarioActivo) {
      navigate('/');
    }

  }, [navigate]);


  // =========================
  // ACTUALIZADO
  // Manejar inputs
  // =========================
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

  };


  // =========================
  // ACTUALIZADO
  // Limpiar formulario
  // =========================
  const limpiarFormulario = () => {

    setFormData(estadoInicial);

    setPreviewUrl('');

    setImagenValida(true);

  };


  // =========================
  // ACTUALIZADO
  // Validar formulario
  // =========================
  const validarFormulario = () => {

    if (formData.nombre.trim().length < 3) {

      alert(
        '❌ El nombre debe tener al menos 3 caracteres'
      );

      return false;
    }

    if (!formData.categoria) {

      alert('❌ Seleccione una categoría');

      return false;
    }

    if (!formData.talla) {

      alert('❌ Seleccione una talla');

      return false;
    }

    if (!formData.color) {

      alert('❌ Seleccione un color');

      return false;
    }

    if (
      !formData.precio ||
      parseFloat(formData.precio) <= 0
    ) {

      alert('❌ El precio debe ser mayor a 0');

      return false;
    }

    if (
      formData.stock === '' ||
      parseInt(formData.stock) < 0
    ) {

      alert('❌ El stock no puede ser negativo');

      return false;
    }

    if (
      formData.stockMinimo === '' ||
      parseInt(formData.stockMinimo) < 0
    ) {

      alert(
        '❌ El stock mínimo no puede ser negativo'
      );

      return false;
    }

    if (
      parseInt(formData.stockMinimo) >
      parseInt(formData.stock)
    ) {

      alert(
        '❌ El stock mínimo no puede ser mayor al stock'
      );

      return false;
    }

    if (!formData.imagen) {

      alert('❌ Debe subir una imagen');

      return false;
    }

    return true;
  };


  // =========================
  // ACTUALIZADO
  // Guardar producto
  // =========================
  const handleSubmit = (e) => {

    e.preventDefault();

    if (!validarFormulario()) return;

    setGuardando(true);

    const productos =
      obtenerProductosIniciales();

    // Nuevo producto
    const nuevoProducto = {

      id: generarNuevoId(productos),

      nombre: formData.nombre.trim(),

      categoria: formData.categoria,

      talla: formData.talla,

      color: formData.color,

      precio: parseFloat(formData.precio),

      stock: parseInt(formData.stock),

      stockMinimo: parseInt(formData.stockMinimo),

      imagen: formData.imagen,

      disponible:
        parseInt(formData.stock) > 0,

      fechaRegistro:
        new Date()
          .toISOString()
          .split('T')[0]
    };

    // Guardar
    productos.push(nuevoProducto);

    guardarEnLocalStorage(productos);

    setGuardando(false);


    // =========================
    // ACTUALIZADO
    // Confirmación
    // =========================
    const confirmar = window.confirm(

      `✅ PRODUCTO REGISTRADO

ID: ${nuevoProducto.id}
Producto: ${nuevoProducto.nombre}
Precio: S/ ${nuevoProducto.precio.toFixed(2)}
Stock: ${nuevoProducto.stock}

¿Desea registrar otro producto?`
    );

    if (confirmar) {

      limpiarFormulario();

    } else {

      navigate('/productos');
    }
  };


  // =========================
  // ACTUALIZADO
  // Manejar imagen local
  // =========================
  const manejarImagenLocal = (e) => {

    const archivo = e.target.files[0];

    if (!archivo) return;

    const lector = new FileReader();

    lector.onloadend = () => {

      setFormData((prev) => ({
        ...prev,
        imagen: lector.result
      }));

      setPreviewUrl(lector.result);

      setImagenValida(true);
    };

    lector.readAsDataURL(archivo);
  };


  // =========================
  // ACTUALIZADO
  // Error imagen
  // =========================
  const handleImageError = () => {

    setPreviewUrl(
      'https://via.placeholder.com/300x300?text=Imagen+no+disponible'
    );

    setImagenValida(false);
  };


  return (
    <>
      <Cabeza />

      <div className="dashboard-container">

        <main className="dashboard-main">

          <div className="registrar-producto-container">


            {/* =========================
                HEADER
            ========================= */}
            <div className="registrar-header">

              <div className="registrar-header-content">

                <div>

                  <h1>

                    <i className="bi bi-plus-circle"></i>

                    Registrar Nuevo Producto

                  </h1>

                  <div className="producto-badges">

                    <span className="badge bg-secondary">

                      <i className="bi bi-box-seam"></i>

                      Nuevo Producto

                    </span>

                  </div>

                </div>


                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() =>
                    navigate('/productos')
                  }
                >

                  <i className="bi bi-x-lg"></i>

                  Cancelar

                </button>

              </div>

            </div>


            {/* =========================
                FORMULARIO
            ========================= */}
            <div className="registrar-form-card">

              <form onSubmit={handleSubmit}>


                <div className="row">


                  {/* =========================
                      DATOS PRODUCTO
                  ========================= */}
                  <div className="col-lg-8">


                    {/* Nombre */}
                    <div className="form-group-moderno">

                      <label className="form-label">

                        <i className="bi bi-tag text-success"></i>

                        Nombre del Producto

                        <span className="text-danger">*</span>

                      </label>

                      <input
                        type="text"
                        className="form-control-moderno"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Ej: Polo Oversize"
                        maxLength="100"
                        required
                      />

                    </div>


                    {/* Categoría */}
                    <div className="form-group-moderno">

                      <label className="form-label">

                        <i className="bi bi-grid text-success"></i>

                        Categoría

                      </label>

                      <select
                        className="form-select-moderno"
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleChange}
                        required
                      >

                        <option value="">
                          Seleccione categoría
                        </option>

                        {categorias.map((cat) => (

                          <option
                            key={cat.id}
                            value={cat.valor}
                          >
                            {cat.nombre}
                          </option>

                        ))}

                      </select>

                    </div>


                    {/* Talla y Color */}
                    <div className="row">


                      {/* Talla */}
                      <div className="col-md-6">

                        <div className="form-group-moderno">

                          <label className="form-label">

                            <i className="bi bi-rulers text-success"></i>

                            Talla

                          </label>

                          <select
                            className="form-select-moderno"
                            name="talla"
                            value={formData.talla}
                            onChange={handleChange}
                            required
                          >

                            <option value="">
                              Seleccione talla
                            </option>

                            {tallas.map((talla) => (

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


                      {/* Color */}
                      <div className="col-md-6">

                        <div className="form-group-moderno">

                          <label className="form-label">

                            <i className="bi bi-palette text-success"></i>

                            Color

                          </label>

                          <select
                            className="form-select-moderno"
                            name="color"
                            value={formData.color}
                            onChange={handleChange}
                            required
                          >

                            <option value="">
                              Seleccione color
                            </option>

                            {colores.map((color) => (

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


                    {/* Precio y Stock */}
                    <div className="row">


                      {/* Precio */}
                      <div className="col-md-6">

                        <div className="form-group-moderno">

                          <label className="form-label">

                            <i className="bi bi-currency-dollar text-success"></i>

                            Precio

                          </label>

                          <div className="input-group-moderno">

                            <span className="input-group-text">
                              S/
                            </span>

                            <input
                              type="number"
                              className="form-control-moderno"
                              name="precio"
                              value={formData.precio}
                              onChange={handleChange}
                              placeholder="0.00"
                              step="0.01"
                              min="0.01"
                              required
                            />

                          </div>

                        </div>

                      </div>


                      {/* Stock */}
                      <div className="col-md-6">

                        <div className="form-group-moderno">

                          <label className="form-label">

                            <i className="bi bi-box text-success"></i>

                            Stock

                          </label>

                          <input
                            type="number"
                            className="form-control-moderno"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            placeholder="0"
                            min="0"
                            required
                          />

                        </div>

                      </div>

                    </div>


                    {/* Stock mínimo */}
                    <div className="form-group-moderno">

                      <label className="form-label">

                        <i className="bi bi-exclamation-triangle text-success"></i>

                        Stock Mínimo

                      </label>

                      <input
                        type="number"
                        className="form-control-moderno"
                        name="stockMinimo"
                        value={formData.stockMinimo}
                        onChange={handleChange}
                        min="0"
                        required
                      />

                    </div>

                  </div>


                  {/* =========================
                      IMAGEN
                  ========================= */}
                  <div className="col-lg-4">

                    <div className="imagen-card">

                      <div className="imagen-header">

                        <i className="bi bi-image fs-4"></i>

                        <h3>Imagen del Producto</h3>

                      </div>


                      {/* Vista previa */}
                      <div className="imagen-preview-container">

                        <img
                          src={
                            previewUrl ||
                            'https://via.placeholder.com/300x300?text=Vista+Previa'
                          }
                          alt="Vista previa"
                          className="imagen-preview"
                          onError={handleImageError}
                        />

                      </div>


                      {/* Subir imagen */}
                      <div className="form-group mt-3">

                        <label>

                          <i className="bi bi-upload"></i>

                          Subir Imagen

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


                      {/* Información */}
                      <div className="imagen-info">

                        <i className="bi bi-info-circle-fill"></i>

                        <span>

                          La imagen se mostrará automáticamente.

                        </span>

                      </div>

                    </div>

                  </div>

                </div>


                {/* =========================
                    BOTONES
                ========================= */}
                <div className="acciones-footer">


                  {/* Limpiar */}
                  <button
                    type="button"
                    className="btn-cancelar-footer"
                    onClick={limpiarFormulario}
                  >

                    <i className="bi bi-eraser"></i>

                    Limpiar

                  </button>


                  {/* Cancelar */}
                  <button
                    type="button"
                    className="btn-cancelar-footer"
                    onClick={() =>
                      navigate('/productos')
                    }
                  >

                    <i className="bi bi-x-circle"></i>

                    Cancelar

                  </button>


                  {/* Guardar */}
                  <button
                    type="submit"
                    className="btn-guardar"
                    disabled={guardando}
                  >

                    {guardando ? (

                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Guardando...
                      </>

                    ) : (

                      <>
                        <i className="bi bi-check-circle"></i>
                        Registrar Producto
                      </>

                    )}

                  </button>

                </div>


                {/* Nota */}
                <div className="mt-4 text-center text-muted small">

                  <i className="bi bi-asterisk text-danger me-1"></i>

                  Los campos con
                  {' '}
                  <span className="text-danger">*</span>
                  {' '}
                  son obligatorios

                </div>

              </form>

            </div>

          </div>

        </main>

      </div>
    </>
  );
};

export default RegistrarProducto;
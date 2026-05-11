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
  
  // Estados
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    talla: '',
    color: '',
    precio: '',
    stock: '',
    stockMinimo: '5',
    imagen: ''
  });
  
  const [previewUrl, setPreviewUrl] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [imagenValida, setImagenValida] = useState(true);

  // Expresión regular para validar URL de imagen
  const urlRegex = /https?:\/\/.*\.(?:png|jpg|jpeg|webp|gif|svg)/i;

  // Validar sesión
  useEffect(() => {
    const usuarioActivo = localStorage.getItem('usuarioActivo');
    if (!usuarioActivo) {
      navigate('/');
    }
  }, [navigate]);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Actualizar vista previa cuando cambia la URL de imagen
    if (name === 'imagen') {
      setPreviewUrl(value);
      setImagenValida(urlRegex.test(value));
    }
  };

  // Manejar error de carga de imagen
  const handleImageError = () => {
    setPreviewUrl('https://via.placeholder.com/300x300?text=Imagen+no+disponible');
    setImagenValida(false);
  };

  // Limpiar formulario
  const limpiarFormulario = () => {
    setFormData({
      nombre: '',
      categoria: '',
      talla: '',
      color: '',
      precio: '',
      stock: '',
      stockMinimo: '5',
      imagen: ''
    });
    setPreviewUrl('');
    setImagenValida(true);
  };

  // Validar formulario
  const validarFormulario = () => {
    if (formData.nombre.length < 3) {
      alert('❌ El nombre debe tener al menos 3 caracteres');
      return false;
    }

    if (!formData.categoria) {
      alert('❌ Debe seleccionar una categoría');
      return false;
    }

    if (!formData.talla) {
      alert('❌ Debe seleccionar una talla');
      return false;
    }

    if (!formData.color) {
      alert('❌ Debe seleccionar un color');
      return false;
    }

    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      alert('❌ El precio debe ser mayor a 0');
      return false;
    }

    if (formData.stock === '' || parseInt(formData.stock) < 0) {
      alert('❌ El stock no puede ser negativo');
      return false;
    }

    if (formData.stockMinimo === '' || parseInt(formData.stockMinimo) < 0) {
      alert('❌ El stock mínimo no puede ser negativo');
      return false;
    }

    if (parseInt(formData.stockMinimo) > parseInt(formData.stock)) {
      alert('❌ El stock mínimo no puede ser mayor que el stock inicial');
      return false;
    }

    // Validar URL de imagen
    if (!formData.imagen) {
      alert('❌ La URL de la imagen es obligatoria');
      return false;
    }

    if (!urlRegex.test(formData.imagen)) {
      alert('❌ La URL de la imagen debe ser válida (png, jpg, jpeg, webp, gif)');
      return false;
    }

    return true;
  };

  // Función para guardar
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    setGuardando(true);

    // 1. Obtener productos actuales
    const productos = obtenerProductosIniciales();

    // 2. Crear nuevo objeto
    const nuevoProducto = {
      id: generarNuevoId(productos),
      nombre: formData.nombre,
      categoria: formData.categoria,
      talla: formData.talla,
      color: formData.color,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock),
      stockMinimo: parseInt(formData.stockMinimo),
      imagen: formData.imagen,
      disponible: parseInt(formData.stock) > 0,
      fechaRegistro: new Date().toISOString().split('T')[0]
    };

    // 3. Guardar
    productos.push(nuevoProducto);
    guardarEnLocalStorage(productos);

    setGuardando(false);

    // 4. Confirmar y Redirigir
    const mensaje = `✅ PRODUCTO REGISTRADO EXITOSAMENTE\n\n` +
                    `ID: ${nuevoProducto.id}\n` +
                    `Nombre: ${nuevoProducto.nombre}\n` +
                    `Categoría: ${nuevoProducto.categoria}\n` +
                    `Precio: S/ ${nuevoProducto.precio.toFixed(2)}\n` +
                    `Stock: ${nuevoProducto.stock} unidades\n\n` +
                    `¿Desea registrar otro producto?`;

    if (window.confirm(mensaje)) {
      limpiarFormulario();
    } else {
      navigate('/productos');
    }
  };

  return (
    <>
      <Cabeza />
      
      <div className="dashboard-container">
        <main className="dashboard-main">
          <div className="registrar-producto-container">
            {/* Header con diseño moderno */}
            <div className="registrar-header">
              <div className="registrar-header-content">
                <div>
                  <h1>
                    <i className="bi bi-plus-circle"></i>
                    Registrar Nuevo Producto
                  </h1>
                  <div className="producto-badges">
                    <span className="badge bg-secondary">
                      <i className="bi bi-box-seam"></i>  Nuevo Producto
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

            {/* Formulario con diseño moderno */}
            <div className="registrar-form-card">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Columna izquierda - Datos del producto */}
                  <div className="col-lg-8">
                    {/* Nombre del Producto */}
                    <div className="form-group-moderno">
                      <label className="form-label">
                        <i className="bi bi-tag text-success"></i>
                        Nombre del Producto <span className="text-danger">*</span>
                      </label>
                      <input 
                        type="text" 
                        className="form-control-moderno"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Ej: Polo Básico Cuello Redondo"
                        required
                        maxLength="100"
                      />
                      <small className="form-text text-muted">
                        <i className="bi bi-info-circle"></i> Mínimo 3 caracteres | Máximo 100
                      </small>
                    </div>

                    {/* Categoría */}
                    <div className="form-group-moderno">
                      <label className="form-label">
                        <i className="bi bi-grid text-success"></i>
                        Categoría <span className="text-danger">*</span>
                      </label>
                      <select 
                        className="form-select-moderno"
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seleccione una categoría</option>
                        {categorias.map(cat => (
                          <option key={cat.id} value={cat.valor}>
                            {cat.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Talla y Color */}
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group-moderno">
                          <label className="form-label">
                            <i className="bi bi-rulers text-success"></i>
                            Talla <span className="text-danger">*</span>
                          </label>
                          <select 
                            className="form-select-moderno"
                            name="talla"
                            value={formData.talla}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Seleccione talla</option>
                            {tallas.map(t => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group-moderno">
                          <label className="form-label">
                            <i className="bi bi-palette text-success"></i>
                            Color <span className="text-danger">*</span>
                          </label>
                          <select 
                            className="form-select-moderno"
                            name="color"
                            value={formData.color}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Seleccione color</option>
                            {colores.map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Precio y Stock */}
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group-moderno">
                          <label className="form-label">
                            <i className="bi bi-currency-dollar text-success"></i>
                            Precio (S/) <span className="text-danger">*</span>
                          </label>
                          <div className="input-group-moderno">
                            <span className="input-group-text">S/</span>
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
                      <div className="col-md-6">
                        <div className="form-group-moderno">
                          <label className="form-label">
                            <i className="bi bi-box text-success"></i>
                            Stock Inicial <span className="text-danger">*</span>
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

                    {/* Stock Mínimo */}
                    <div className="form-group-moderno">
                      <label className="form-label">
                        <i className="bi bi-exclamation-triangle text-success"></i>
                        Stock Mínimo (Alerta) <span className="text-danger">*</span>
                      </label>
                      <input 
                        type="number" 
                        className="form-control-moderno"
                        name="stockMinimo"
                        value={formData.stockMinimo}
                        onChange={handleChange}
                        placeholder="5"
                        min="0"
                        required
                      />
                      <small className="form-text text-muted">
                        <i className="bi bi-bell"></i> El sistema alertará cuando el stock llegue a este número
                      </small>
                    </div>
                  </div>

                  {/* Columna derecha - Imagen */}
                  <div className="col-lg-4">
                    <div className="imagen-card">
                      <div className="imagen-header">
                        <i className="bi bi-image fs-4"></i>
                        <h3>Imagen del Producto</h3>
                      </div>
                      
                      <div className="imagen-preview-container">
                        <img 
                          src={previewUrl || 'https://via.placeholder.com/300x300?text=Vista+Previa'} 
                          alt="Vista previa del producto"
                          className="imagen-preview"
                          onError={handleImageError}
                        />
                        
                        <div className="imagen-url-container">
                          <label className="form-label fw-bold">
                            <i className="bi bi-link-45deg"></i>
                            URL de la Imagen <span className="text-danger">*</span>
                          </label>
                          <input 
                            type="url" 
                            className={`form-control-moderno ${!imagenValida && formData.imagen ? 'is-invalid' : ''}`}
                            name="imagen"
                            value={formData.imagen}
                            onChange={handleChange}
                            placeholder="https://ejemplo.com/producto.jpg"
                            required
                          />
                          {!imagenValida && formData.imagen && (
                            <div className="invalid-feedback d-block">
                              <i className="bi bi-exclamation-circle"></i> URL de imagen no válida
                            </div>
                          )}
                          <small className="form-text text-muted">
                            <i className="bi bi-file-earmark-image"></i> Formatos: JPG, PNG, WEBP, GIF
                          </small>
                        </div>

                        <div className="imagen-info">
                          <i className="bi bi-info-circle-fill"></i>
                          <span>
                            Ingresa una URL válida de imagen. 
                            La vista previa se actualizará automáticamente.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="acciones-footer">
                  <button 
                    type="button" 
                    className="btn-cancelar-footer"
                    onClick={limpiarFormulario}
                  >
                    <i className="bi bi-eraser"></i>
                    Limpiar Campos
                  </button>
                  
                  <button 
                    type="button" 
                    className="btn-cancelar-footer"
                    onClick={() => navigate('/productos')}
                  >
                    <i className="bi bi-x-circle"></i>
                    Cancelar
                  </button>
                  
                  <button 
                    type="submit" 
                    className="btn-guardar"
                    disabled={guardando}
                  >
                    {guardando ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Registrando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle"></i>
                        Registrar Producto
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-4 text-center text-muted small">
                  <i className="bi bi-asterisk text-danger me-1"></i>
                  Los campos marcados con <span className="text-danger">*</span> son obligatorios
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
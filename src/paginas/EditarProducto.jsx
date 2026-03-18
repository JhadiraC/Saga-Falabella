// src/paginas/EditarProducto.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cabeza from './components/Cabeza';
import { obtenerProductosIniciales, guardarEnLocalStorage, categorias, tallas, colores } from '../data/data';

const EditarProducto = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [cargando, setCargando] = useState(true);

  // Expresión regular para validar URL de imagen
  const urlRegex = /https?:\/\/.*\.(?:png|jpg|jpeg|webp|gif|svg)/i;

  useEffect(() => {
    const productoGuardado = localStorage.getItem('productoEditando');
    
    if (!productoGuardado) {
      alert('No se encontró el producto a editar');
      navigate('/');
      return;
    }

    try {
      const productoObj = JSON.parse(productoGuardado);
      const todos = obtenerProductosIniciales();
      const encontrado = todos.find(p => p.id === productoObj.id);
      
      if (encontrado) {
        setFormData(encontrado);
        setPreviewUrl(encontrado.imagen || '');
      } else {
        alert('Producto no encontrado');
        navigate('/');
      }
    } catch (error) {
      console.error('Error:', error);
      navigate('/');
    } finally {
      setCargando(false);
    }
  }, [navigate]);

  // Manejador de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Actualizar vista previa cuando cambia la URL de imagen
    if (name === 'imagen') {
      setPreviewUrl(value);
    }
  };

  // Validar URL de imagen
  const validarUrlImagen = (url) => {
    return urlRegex.test(url);
  };

  // Manejador de error en carga de imagen
  const handleImageError = () => {
    setPreviewUrl('https://via.placeholder.com/300x300?text=Imagen+no+disponible');
  };

  // Manejador de guardado
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (formData.nombre.length < 3) {
      alert('El nombre debe tener al menos 3 caracteres');
      return;
    }

    if (formData.precio <= 0) {
      alert('El precio debe ser mayor a 0');
      return;
    }

    if (formData.stock < 0) {
      alert('El stock no puede ser negativo');
      return;
    }

    if (parseInt(formData.stockMinimo) > parseInt(formData.stock)) {
      alert('El stock mínimo no puede ser mayor que el stock actual');
      return;
    }

    // Validar URL de imagen (si se proporcionó)
    if (formData.imagen && !validarUrlImagen(formData.imagen)) {
      alert('La URL de la imagen debe ser válida (png, jpg, jpeg, webp, gif)');
      return;
    }

    setGuardando(true);

    const todosLosProductos = obtenerProductosIniciales();
    const indice = todosLosProductos.findIndex(p => p.id === formData.id);

    if (indice !== -1) {
      const productoAActualizar = {
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
        stockMinimo: parseInt(formData.stockMinimo),
        disponible: parseInt(formData.stock) > 0,
        imagen: formData.imagen || 'https://via.placeholder.com/150' // Imagen por defecto
      };

      todosLosProductos[indice] = productoAActualizar;
      guardarEnLocalStorage(todosLosProductos);
      localStorage.removeItem('productoEditando');
      
      alert('✅ ¡Producto actualizado con éxito!');
      navigate('/');
    }
    setGuardando(false);
  };

  // Si está cargando, mostrar spinner
  if (cargando) {
    return (
      <>
        <Cabeza />
        <div className="container mt-5 text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando producto...</p>
        </div>
      </>
    );
  }

  // Si formData es null (porque falló la carga), no mostramos nada mientras redirige
  if (!formData) return null;

  return (
    <>
      <Cabeza />
      
      <div className="dashboard-container">
        <main className="dashboard-main">
          <div className="editar-producto-container">
            {/* Header con diseño moderno */}
            <div className="editar-header">
              <div className="editar-header-content">
                <div>
                  <h1>
                    <i className="bi bi-pencil-square"></i>
                    Editar Producto
                  </h1>
                  <div className="producto-badges">
                    <span className="badge bg-secondary me-2">
                      <i className="bi bi-upc-scan"></i> ID: {formData.id}
                    </span>
                    <span className={`badge ${
                      formData.stock === 0 ? 'bg-danger' : 
                      formData.stock <= formData.stockMinimo ? 'bg-warning' : 'bg-success'
                    }`}>
                      <i className="bi bi-box"></i> Stock: {formData.stock}
                    </span>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="btn-cancelar"
                  onClick={() => navigate('/')}
                >
                  <i className="bi bi-x-lg"></i>
                  Cancelar
                </button>
              </div>
            </div>

            {/* Formulario con diseño moderno */}
            <div className="editar-form-card">
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
                        value={formData.nombre || ''}
                        onChange={handleChange}
                        placeholder="Ej: Polo Básico Cuello Redondo"
                        required
                        maxLength="100"
                      />
                      <small className="form-text text-muted">
                        Mínimo 3 caracteres | Máximo 100
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
                        value={formData.categoria || ''}
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
                            value={formData.talla || ''}
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
                            value={formData.color || ''}
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
                              value={formData.precio || ''}
                              onChange={handleChange}
                              step="0.01"
                              min="0.01"
                              placeholder="0.00"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group-moderno">
                          <label className="form-label">
                            <i className="bi bi-box text-success"></i>
                            Stock Actual <span className="text-danger">*</span>
                          </label>
                          <input 
                            type="number" 
                            className="form-control-moderno"
                            name="stock"
                            value={formData.stock || ''}
                            onChange={handleChange}
                            min="0"
                            placeholder="0"
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
                        value={formData.stockMinimo || ''}
                        onChange={handleChange}
                        min="0"
                        placeholder="5"
                        required
                      />
                      <small className="form-text text-muted">
                        El sistema alertará cuando el stock llegue a este número
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
                            URL de la Imagen
                          </label>
                          <input 
                            type="url" 
                            className="form-control-moderno"
                            name="imagen"
                            value={formData.imagen || ''}
                            onChange={handleChange}
                            placeholder="https://ejemplo.com/producto.jpg"
                          />
                          <small className="form-text text-muted">
                            Formatos: JPG, PNG, WEBP, GIF
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

                {/* Información adicional */}
                <div className="info-card">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="info-row">
                        <i className="bi bi-calendar3"></i>
                        <strong>Fecha de Registro:</strong>
                        <span className="text-primary">
                          {new Date(formData.fechaRegistro).toLocaleDateString('es-PE', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="info-row">
                        <i className="bi bi-box-seam"></i>
                        <strong>Estado:</strong>
                        <span className={`badge-estado ${
                          formData.stock === 0 ? 'agotado' : 
                          formData.stock <= formData.stockMinimo ? 'stock-bajo' : 'disponible'
                        }`}>
                          {formData.stock === 0 ? 'Agotado' : 
                           formData.stock <= formData.stockMinimo ? 'Stock Bajo' : 'Disponible'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="acciones-footer">
                  <button 
                    type="button" 
                    className="btn-cancelar-footer"
                    onClick={() => navigate('/')}
                    disabled={guardando}
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
                        Guardando cambios...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle"></i>
                        Guardar Cambios
                      </>
                    )}
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
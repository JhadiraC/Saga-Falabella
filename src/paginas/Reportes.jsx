// src/paginas/Reportes.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Cabeza from './components/Cabeza';

import { obtenerProductosIniciales } from '../data/data';

import {
  analizarInventarioCompleto,
  crearMatrizVentas,
  sumarVentasPorCategoria,
  obtenerCategoriasUnicas,
  agruparPorCategoria,
  calcularPromedio,
  calcularMediana,
  calcularDesviacionEstandar,
  ordenarPorPrecio,
  utilidadesCadenas
} from '../utils/utilidades';

const Reportes = () => {

  const navigate = useNavigate();

  // ================================
  // ACTUALIZADO: Productos desde localStorage
  // ================================
  const [productos] = useState(() => {
    return JSON.parse(localStorage.getItem('productos'))
      || obtenerProductosIniciales();
  });

  // ================================
  // ACTUALIZADO: Validación de sesión
  // ================================
  useEffect(() => {

    const usuarioActivo = localStorage.getItem('usuarioActivo');

    if (!usuarioActivo) {
      navigate('/');
    }

  }, [navigate]);

  // ================================
  // ACTUALIZADO: useMemo para optimizar cálculos
  // ================================
  const stats = useMemo(() => {
    return analizarInventarioCompleto(productos);
  }, [productos]);

  // ================================
  // MATRIZ DE VENTAS
  // ================================
  const matrizVentas = crearMatrizVentas();

  const meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo'
  ];

  const totalesVentasCat = sumarVentasPorCategoria(matrizVentas);

  const granTotalVentas = totalesVentasCat.reduce(
    (total, valor) => total + valor,
    0
  );

  // ================================
  // ACTUALIZADO: Categorías
  // ================================
  const categoriasUnicas = obtenerCategoriasUnicas(productos);

  const productosPorCategoria = agruparPorCategoria(productos);

  // ================================
  // ACTUALIZADO: Estadísticas precios
  // ================================
  const precios = productos.map(producto => producto.precio);

  const estadisticasPrecios = {
    promedio: calcularPromedio(precios),
    mediana: calcularMediana(precios),
    desviacion: calcularDesviacionEstandar(precios)
  };

  // ================================
  // ACTUALIZADO: Tops optimizados
  // ================================
  const topCaros = ordenarPorPrecio(productos)
    .reverse()
    .slice(0, 5);

  const topStock = [...productos]
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 5);

  // ================================
  // ACTUALIZADO: Alertas
  // ================================
  const stockBajo = productos.filter(
    producto =>
      producto.stock > 0 &&
      producto.stock <= producto.stockMinimo
  );

  const agotados = productos.filter(
    producto => producto.stock === 0
  );

  // ================================
  // ACTUALIZADO: Exportar reporte
  // ================================
  const exportarReporte = () => {

    console.log('=== REPORTE INVENTARIO ===');

    console.table(productos);

    alert('Reporte exportado en consola (F12)');
  };

  return (
    <>
      <Cabeza />

      <div className="container mt-4 mb-5">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>
            <h2 className="fw-bold">
              <i className="bi bi-bar-chart-fill me-2"></i>
              Reportes y Estadísticas
            </h2>

            <p className="text-muted mb-0">
              Análisis general del inventario
            </p>
          </div>

          <button
            onClick={exportarReporte}
            className="btn btn-dark"
          >
            <i className="bi bi-download me-2"></i>
            Exportar Reporte
          </button>

        </div>

        {/* ================================= */}
        {/* RESUMEN GENERAL */}
        {/* ================================= */}

        <div className="card shadow-sm border-0 mb-4">

          <div className="card-header bg-dark text-white">
            <h3 className="h5 mb-0">
              Resumen General
            </h3>
          </div>

          <div className="card-body">

            <div className="row g-3 text-center">

              <div className="col-md-3">
                <div className="p-4 border rounded bg-light h-100">

                  <i className="bi bi-box-seam fs-1 text-dark"></i>

                  <p className="text-muted mt-2 mb-1">
                    Productos
                  </p>

                  <h2 className="fw-bold">
                    {stats.totalProductos}
                  </h2>

                </div>
              </div>

              <div className="col-md-3">
                <div className="p-4 border rounded bg-light h-100">

                  <i className="bi bi-cash-stack fs-1 text-success"></i>

                  <p className="text-muted mt-2 mb-1">
                    Valor Total
                  </p>

                  <h2 className="fw-bold text-success">
                    S/ {stats.valorTotal.toFixed(2)}
                  </h2>

                </div>
              </div>

              <div className="col-md-3">
                <div className="p-4 border rounded bg-light h-100">

                  <i className="bi bi-boxes fs-1 text-primary"></i>

                  <p className="text-muted mt-2 mb-1">
                    Unidades
                  </p>

                  <h2 className="fw-bold">
                    {stats.stockTotal}
                  </h2>

                </div>
              </div>

              <div className="col-md-3">
                <div className="p-4 border rounded bg-light h-100">

                  <i className="bi bi-graph-up-arrow fs-1 text-danger"></i>

                  <p className="text-muted mt-2 mb-1">
                    Precio Promedio
                  </p>

                  <h2 className="fw-bold text-danger">
                    S/ {stats.precioPromedio.toFixed(2)}
                  </h2>

                </div>
              </div>

            </div>

          </div>

        </div>

        {/* ================================= */}
        {/* MATRIZ DE VENTAS */}
        {/* ================================= */}

        <div className="card shadow-sm border-0 mb-4">

          <div className="card-header bg-primary text-white">
            <h3 className="h5 mb-0">
              Proyección de Ventas
            </h3>
          </div>

          <div className="table-responsive">

            <table className="table table-striped mb-0">

              <thead className="table-light">
                <tr>
                  <th>Mes</th>
                  <th>Polos</th>
                  <th>Poleras</th>
                  <th>Buzos</th>
                  <th>Shorts</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>

                {matrizVentas.map((fila, index) => (

                  <tr key={index}>

                    <td>
                      <strong>{meses[index]}</strong>
                    </td>

                    {fila.map((valor, i) => (
                      <td key={i}>{valor}</td>
                    ))}

                    <td>
                      <strong>
                        {fila.reduce((a, b) => a + b, 0)}
                      </strong>
                    </td>

                  </tr>

                ))}

                <tr className="table-secondary fw-bold">

                  <td>TOTAL</td>

                  {totalesVentasCat.map((total, i) => (
                    <td key={i}>{total}</td>
                  ))}

                  <td>{granTotalVentas}</td>

                </tr>

              </tbody>

            </table>

          </div>

        </div>

        {/* ================================= */}
        {/* INVENTARIO POR CATEGORÍA */}
        {/* ================================= */}

        <div className="card shadow-sm border-0 mb-4">

          <div className="card-header bg-secondary text-white">
            <h3 className="h5 mb-0">
              Inventario por Categoría
            </h3>
          </div>

          <div className="table-responsive">

            <table className="table table-hover mb-0">

              <thead className="table-light">
                <tr>
                  <th>Categoría</th>
                  <th>Productos</th>
                  <th>Stock</th>
                  <th>Valor Total</th>
                  <th>Promedio</th>
                </tr>
              </thead>

              <tbody>

                {categoriasUnicas.map(categoria => {

                  const productosCategoria =
                    productosPorCategoria.get(categoria) || [];

                  const valorCategoria =
                    productosCategoria.reduce(
                      (total, producto) =>
                        total + (producto.precio * producto.stock),
                      0
                    );

                  const stockCategoria =
                    productosCategoria.reduce(
                      (total, producto) =>
                        total + producto.stock,
                      0
                    );

                  return (

                    <tr key={categoria}>

                      <td
                        className="fw-bold text-capitalize"
                      >
                        {categoria}
                      </td>

                      <td>
                        {productosCategoria.length}
                      </td>

                      <td>
                        {stockCategoria}
                      </td>

                      <td>
                        S/ {valorCategoria.toFixed(2)}
                      </td>

                      <td>
                        S/ {
                          (
                            productosCategoria.length
                              ? valorCategoria /
                                productosCategoria.length
                              : 0
                          ).toFixed(2)
                        }
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        </div>

        {/* ================================= */}
        {/* TOPS */}
        {/* ================================= */}

        <div className="row mb-4">

          {/* TOP MÁS CAROS */}
          <div className="col-md-6 mb-4">

            <div className="card h-100 shadow-sm">

              <div className="card-header bg-danger text-white">
                Top 5 Más Caros
              </div>

              <ul className="list-group list-group-flush">

                {topCaros.map((producto, index) => (

                  <li
                    key={producto.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >

                    <span>
                      {index + 1}. {' '}
                      {utilidadesCadenas.truncar(
                        producto.nombre,
                        25
                      )}
                    </span>

                    <span className="badge bg-danger rounded-pill">
                      S/ {producto.precio}
                    </span>

                  </li>

                ))}

              </ul>

            </div>

          </div>

          {/* TOP STOCK */}
          <div className="col-md-6 mb-4">

            <div className="card h-100 shadow-sm">

              <div className="card-header bg-success text-white">
                Top 5 Mayor Stock
              </div>

              <ul className="list-group list-group-flush">

                {topStock.map((producto, index) => (

                  <li
                    key={producto.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >

                    <span>
                      {index + 1}. {' '}
                      {utilidadesCadenas.truncar(
                        producto.nombre,
                        25
                      )}
                    </span>

                    <span className="badge bg-success rounded-pill">
                      {producto.stock} unid.
                    </span>

                  </li>

                ))}

              </ul>

            </div>

          </div>

        </div>

        {/* ================================= */}
        {/* ALERTAS Y ESTADÍSTICAS */}
        {/* ================================= */}

        <div className="row">

          {/* ALERTAS */}
          <div className="col-md-6 mb-4">

            <div className="card border-warning shadow-sm h-100">

              <div className="card-header bg-warning">

                <h3 className="h5 mb-0">
                  Alertas
                </h3>

              </div>

              <div className="card-body">

                {stockBajo.map(producto => (

                  <div
                    key={producto.id}
                    className="alert alert-warning d-flex justify-content-between"
                  >

                    <span>
                      ⚠️ {producto.nombre}
                    </span>

                    <strong>
                      {producto.stock}
                    </strong>

                  </div>

                ))}

                {agotados.map(producto => (

                  <div
                    key={producto.id}
                    className="alert alert-danger d-flex justify-content-between"
                  >

                    <span>
                      ⛔ {producto.nombre}
                    </span>

                    <strong>
                      AGOTADO
                    </strong>

                  </div>

                ))}

                {stockBajo.length === 0 &&
                  agotados.length === 0 && (

                  <div className="alert alert-success text-center mb-0">
                    Todo el inventario está en buen estado
                  </div>

                )}

              </div>

            </div>

          </div>

          {/* ESTADÍSTICAS */}
          <div className="col-md-6 mb-4">

            <div className="card shadow-sm h-100">

              <div className="card-header bg-info text-white">
                Estadísticas de Precios
              </div>

              <div className="card-body d-flex align-items-center">

                <div className="row text-center w-100">

                  <div className="col-4 border-end">

                    <small className="text-muted">
                      Promedio
                    </small>

                    <div className="h5">
                      S/ {
                        estadisticasPrecios.promedio.toFixed(2)
                      }
                    </div>

                  </div>

                  <div className="col-4 border-end">

                    <small className="text-muted">
                      Mediana
                    </small>

                    <div className="h5">
                      S/ {
                        estadisticasPrecios.mediana.toFixed(2)
                      }
                    </div>

                  </div>

                  <div className="col-4">

                    <small className="text-muted">
                      Desviación
                    </small>

                    <div className="h5">
                      S/ {
                        estadisticasPrecios.desviacion.toFixed(2)
                      }
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </>
  );
};

export default Reportes;
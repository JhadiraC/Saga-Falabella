// src/paginas/Reportes.jsx
import React, { useState, useEffect } from 'react';
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
    const [productos] = useState(obtenerProductosIniciales());
    
    // --- CÁLCULOS ---
    
    const stats = analizarInventarioCompleto(productos);
    
    // Matriz de Ventas
    const matrizVentas = crearMatrizVentas();
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'];
    const totalesVentasCat = sumarVentasPorCategoria(matrizVentas);
    const granTotalVentas = totalesVentasCat.reduce((a, b) => a + b, 0);

    // Categorías
    const categoriasUnicas = obtenerCategoriasUnicas(productos);
    const productosPorCat = agruparPorCategoria(productos);

    // Estadísticas Avanzadas
    const precios = productos.map(p => p.precio);
    const estadisticasPrecios = {
        promedio: calcularPromedio(precios),
        mediana: calcularMediana(precios),
        desviacion: calcularDesviacionEstandar(precios)
    };

    // Tops
    const productosOrdenadosPrecio = ordenarPorPrecio(productos).reverse();
    const topCaros = productosOrdenadosPrecio.slice(0, 5);
    
    const productosOrdenadosStock = [...productos].sort((a, b) => b.stock - a.stock);
    const topStock = productosOrdenadosStock.slice(0, 5);

    // Alertas
    const stockBajo = productos.filter(p => p.stock > 0 && p.stock <= p.stockMinimo);
    const agotados = productos.filter(p => p.stock === 0);

    useEffect(() => {
        if (!localStorage.getItem('usuarioActivo')) {
            navigate('/');
        }
    }, [navigate]);

    const exportarReporte = () => {
        alert('Reporte exportado en consola (F12)');
        console.log("=== REPORTE GENERADO ===", stats);
    };

    return (
        <>
            <Cabeza />
            <div className="container mt-4 mb-5">
                <h2>Reportes y Estadísticas del Inventario</h2>

                {/* 1. RESUMEN GENERAL */}
                <div className="card mb-4 shadow-sm">
                    <div className="card-header bg-dark text-white">
                        <h3 className="h5 mb-0">Resumen General</h3>
                    </div>
                    <div className="card-body">
                        <div className="row g-3 text-center">
                            <div className="col-md-3">
                                <div className="p-3 bg-light border rounded">
                                    <p className="text-muted small mb-1">Total Productos</p>
                                    <p className="h2 fw-bold text-dark">{stats.totalProductos}</p>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="p-3 bg-light border rounded">
                                    <p className="text-muted small mb-1">Valor Total</p>
                                    <p className="h2 fw-bold text-success">S/ {stats.valorTotal.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="p-3 bg-light border rounded">
                                    <p className="text-muted small mb-1">Unidades Totales</p>
                                    <p className="h2 fw-bold text-dark">{stats.stockTotal}</p>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="p-3 bg-light border rounded">
                                    <p className="text-muted small mb-1">Precio Promedio</p>
                                    <p className="h2 fw-bold text-danger">S/ {stats.precioPromedio.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. MATRIZ DE VENTAS */}
                <div className="card mb-4 shadow-sm">
                    <div className="card-header">
                        <h3 className="h5 mb-0">Proyección de Ventas (Matriz)</h3>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-striped mb-0">
                            <thead>
                                <tr>
                                    <th>Mes</th>
                                    <th>Polos</th>
                                    <th>Poleras</th>
                                    <th>Buzos</th>
                                    <th>Shorts</th>
                                    <th>Total Mes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {matrizVentas.map((fila, i) => (
                                    <tr key={i}>
                                        <td><strong>{meses[i]}</strong></td>
                                        {fila.map((valor, j) => <td key={j}>{valor}</td>)}
                                        <td><strong>{fila.reduce((a, b) => a + b, 0)}</strong></td>
                                    </tr>
                                ))}
                                <tr className="table-secondary fw-bold">
                                    <td>TOTAL</td>
                                    {totalesVentasCat.map((t, i) => <td key={i}>{t}</td>)}
                                    <td>{granTotalVentas}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 3. INVENTARIO POR CATEGORÍA (¡AQUÍ ESTÁ LA CORRECCIÓN!) */}
                <div className="card mb-4 shadow-sm">
                    <div className="card-header bg-secondary text-white">
                        <h3 className="h5 mb-0">Inventario por Categoría</h3>
                    </div>
                    <div className="table-responsive">
                        <table className="table mb-0">
                            <thead>
                                <tr>
                                    <th>Categoría</th>
                                    <th>Cantidad</th>
                                    <th>Stock Total</th>
                                    <th>Valor Total</th>
                                    <th>Promedio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categoriasUnicas.map(cat => {
                                    const prods = productosPorCat.get(cat) || [];
                                    const valorCat = prods.reduce((s, p) => s + (p.precio * p.stock), 0);
                                    const stockCat = prods.reduce((s, p) => s + p.stock, 0);
                                    
                                    return (
                                        <tr key={cat}>
                                            <td style={{textTransform: 'capitalize', fontWeight: 'bold'}}>{cat}</td>
                                            <td>{prods.length}</td>
                                            <td>{stockCat}</td>
                                            <td>S/ {valorCat.toFixed(2)}</td>
                                            <td>S/ {(prods.length ? valorCat / prods.length : 0).toFixed(2)}</td>
                                        </tr>
                                    );
                                })}
                                {categoriasUnicas.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center">No hay productos registrados</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 4. TOPS (MÁS CAROS Y MAYOR STOCK) */}
                <div className="row mb-4">
                    <div className="col-md-6">
                        <div className="card h-100">
                            <div className="card-header bg-primary text-white">Top 5 Más Caros</div>
                            <ul className="list-group list-group-flush">
                                {topCaros.map((p, i) => (
                                    <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <span>{i+1}. {utilidadesCadenas.truncar(p.nombre, 25)}</span>
                                        <span className="badge bg-primary rounded-pill">S/ {p.precio}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="card h-100">
                            <div className="card-header bg-success text-white">Top 5 Mayor Stock</div>
                            <ul className="list-group list-group-flush">
                                {topStock.map((p, i) => (
                                    <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <span>{i+1}. {utilidadesCadenas.truncar(p.nombre, 25)}</span>
                                        <span className="badge bg-success rounded-pill">{p.stock} unid.</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 5. ALERTAS Y ESTADÍSTICAS */}
                <div className="row mb-4">
                    <div className="col-md-6 mb-4">
                        <div className="card h-100 border-warning shadow-sm">
                            <div className="card-header bg-warning text-dark">
                                <h3 className="h5 mb-0">Alertas ({stockBajo.length + agotados.length})</h3>
                            </div>
                            <div className="card-body">
                                {stockBajo.map(p => (
                                    <div key={p.id} className="alert alert-warning py-2 mb-2 d-flex justify-content-between">
                                        <span>⚠️ <strong>{p.nombre}</strong></span>
                                        <span>Quedan: <strong>{p.stock}</strong></span>
                                    </div>
                                ))}
                                {agotados.map(p => (
                                    <div key={p.id} className="alert alert-danger py-2 mb-2 d-flex justify-content-between">
                                        <span>⛔ <strong>{p.nombre}</strong></span>
                                        <span>AGOTADO</span>
                                    </div>
                                ))}
                                {stockBajo.length === 0 && agotados.length === 0 && (
                                    <div className="alert alert-success mb-0 text-center">
                                        ¡Todo en orden!
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 mb-4">
                        <div className="card h-100">
                            <div className="card-header">Estadísticas de Precios</div>
                            <div className="card-body d-flex flex-column justify-content-center">
                                 <div className="row text-center">
                                    <div className="col-4 border-end">
                                        <small className="text-muted">Media</small>
                                        <div className="h5">S/ {estadisticasPrecios.promedio.toFixed(2)}</div>
                                    </div>
                                    <div className="col-4 border-end">
                                        <small className="text-muted">Mediana</small>
                                        <div className="h5">S/ {estadisticasPrecios.mediana.toFixed(2)}</div>
                                    </div>
                                    <div className="col-4">
                                        <small className="text-muted">Desviación</small>
                                        <div className="h5">S/ {estadisticasPrecios.desviacion.toFixed(2)}</div>
                                    </div>
                                 </div>
                                 <div className="mt-4 text-center">
                                    <button onClick={exportarReporte} className="btn btn-dark w-100">
                                        <i className="bi bi-download me-2"></i> Exportar a Consola
                                    </button>
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
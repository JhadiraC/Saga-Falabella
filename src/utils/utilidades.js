// src/utils/utilidades.js

// ====== 1. CLASE PRODUCTO ======
export class Producto {
    constructor(datos) {
        this.id = datos.id || 0;
        this.nombre = datos.nombre || '';
        this.categoria = datos.categoria || '';
        this.talla = datos.talla || '';
        this.color = datos.color || '';
        this.precio = datos.precio || 0;
        this.stock = datos.stock || 0;
        this.stockMinimo = datos.stockMinimo || 5;
        this.disponible = this.stock > 0;
        this.fechaRegistro = datos.fechaRegistro || new Date().toISOString().split('T')[0];
    }
}

// ====== 2. MÉTODOS DE CADENAS ======
export const utilidadesCadenas = {
    capitalizar: (texto) => texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase(),
    truncar: (texto, longitud) => texto.length <= longitud ? texto : texto.substring(0, longitud) + '...',
};

// ====== 3. OPERACIONES DE ARRAYS ======
// Filtrar productos
export const filtrarDisponibles = (productos) => productos.filter(p => p.disponible);

// Ordenar por precio
export const ordenarPorPrecio = (productos) => [...productos].sort((a, b) => a.precio - b.precio);

// ====== 4. COLECCIONES (SET & MAP) ======
export const obtenerCategoriasUnicas = (productos) => {
    // Usamos Set para evitar repetidos y lo convertimos a Array
    return Array.from(new Set(productos.map(p => p.categoria)));
};

export const agruparPorCategoria = (productos) => {
    const mapa = new Map();
    productos.forEach(producto => {
        if (!mapa.has(producto.categoria)) {
            mapa.set(producto.categoria, []);
        }
        mapa.get(producto.categoria).push(producto);
    });
    return mapa;
};

// ====== 5. ARREGLOS BIDIMENSIONALES (MATRICES) ======


export const crearMatrizVentas = () => {
    // [Meses][Categorías: Polos, Poleras, Buzos, Shorts]
    return [
        [100, 150, 80, 50],   // Enero
        [120, 140, 90, 60],   // Febrero
        [110, 160, 85, 55],   // Marzo
        [130, 155, 95, 65],   // Abril
        [115, 165, 88, 58]    // Mayo
    ];
};

export const sumarVentasPorCategoria = (matriz) => {
    const totales = [0, 0, 0, 0]; 
    for (let mes = 0; mes < matriz.length; mes++) {
        for (let cat = 0; cat < matriz[mes].length; cat++) {
            totales[cat] += matriz[mes][cat];
        }
    }
    return totales;
};

// ====== 6. FUNCIONES MATEMÁTICAS ======
export const calcularPromedio = (numeros) => {
    if (numeros.length === 0) return 0;
    return numeros.reduce((sum, num) => sum + num, 0) / numeros.length;
};

export const calcularMediana = (numeros) => {
    const ordenados = [...numeros].sort((a, b) => a - b);
    const mitad = Math.floor(ordenados.length / 2);
    if (ordenados.length % 2 === 0) {
        return (ordenados[mitad - 1] + ordenados[mitad]) / 2;
    }
    return ordenados[mitad];
};

export const calcularDesviacionEstandar = (numeros) => {
    if (numeros.length === 0) return 0;
    const promedio = calcularPromedio(numeros);
    const varianzas = numeros.map(num => Math.pow(num - promedio, 2));
    const varianza = calcularPromedio(varianzas);
    return Math.sqrt(varianza);
};

// ====== 7. ANÁLISIS COMPLETO ======
export const analizarInventarioCompleto = (productos) => {
    return {
        totalProductos: productos.length,
        valorTotal: productos.reduce((sum, p) => sum + p.precio * p.stock, 0),
        precioPromedio: calcularPromedio(productos.map(p => p.precio)),
        stockTotal: productos.reduce((sum, p) => sum + p.stock, 0),
    };
};
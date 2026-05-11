/* ========================================
   src/data/data.js
   Módulo de Datos y Utilidades para React
   ======================================== */

// ====== 1. DATOS ESTÁTICOS (Constantes) ======

export const usuarios = [
    { id: 1, username: "admin", password: "admin123", nombre: "Administrador", rol: "Administrador", activo: true },
    { id: 2, username: "vendedor", password: "vend123", nombre: "Juan Pérez", rol: "Vendedor", activo: true },
    { id: 3, username: "almacen", password: "alma123", nombre: "María García", rol: "Almacenero", activo: true }
];

export const categorias = [
    { id: 1, nombre: "Polos", valor: "polos" },
    { id: 2, nombre: "Poleras", valor: "poleras" },
    { id: 3, nombre: "Buzos", valor: "buzos" },
    { id: 4, nombre: "Shorts", valor: "shorts" }
];

export const tallas = ["XS", "S", "M", "L", "XL", "XXL"];

export const colores = [
    "Negro", "Blanco", "Gris", "Azul", "Azul Marino", 
    "Rojo", "Verde", "Amarillo", "Naranja", "Morado", 
    "Rosado", "Beige", "Café"
];

// ====== 2. FUNCIONES DE UTILIDAD (HELPERS) ======

// Función para obtener los datos iniciales
export const obtenerProductosIniciales = () => {
    try {
        const datosGuardados = localStorage.getItem('productos');
        if (datosGuardados) {
            // Si ya hay datos, los devolvemos
            return JSON.parse(datosGuardados);
        }
    } catch (error) {
        console.error('Error al cargar desde localStorage:', error);
    }

    // === AQUÍ ESTÁ EL CAMBIO ===
    // Si no hay datos, creamos un producto de prueba por defecto
    const datosPorDefecto = [
        {
            id: 1, // Este es el ID que busca tu botón demo
            nombre: "Producto Demo (Ejemplo)",
            categoria: "polos",
            talla: "M",
            color: "Negro",
            precio: 50.00,
            stock: 10,
            stockMinimo: 5,
            fechaRegistro: new Date().toISOString().split('T')[0]
        }
    ];

    // Lo guardamos en localStorage para que persista
    localStorage.setItem('productos', JSON.stringify(datosPorDefecto));

    return datosPorDefecto;
};

export const guardarEnLocalStorage = (productos) => {
    try {
        localStorage.setItem('productos', JSON.stringify(productos));
        return true;
    } catch (error) {
        console.error('Error al guardar en localStorage:', error);
        return false;
    }
};

export const validarUsuario = (username, password) => {
    const usuario = usuarios.find(u => 
        u.username === username && 
        u.password === password && 
        u.activo === true
    );
    return usuario || null;
};

// Generador de ID (Útil para crear nuevos productos)
export const generarNuevoId = (listaProductos) => {
    return listaProductos.length > 0 
        ? Math.max(...listaProductos.map(p => p.id)) + 1 
        : 1;
};
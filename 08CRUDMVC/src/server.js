const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
// Servidor para inicializar con express

const PORT = process.env.PORT || 3000;

// Para poder aplicar el MVC necesitamos un intermediario que se va a encargar de ser un mesero (middleware), 
// el cual para cada peticion que pasa por la ruta de la vista, obtiene una petición y la envia a un controlador
app.use(cors());

// NUEVOS MIDDLEWARES: Necesarios para poder leer el cuerpo (body) de las peticiones POST y PUT
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Middleware para registrar las peticiones entrantes por consola en tiempo real
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// Debemos definir las rutas para los archivos estáticos de la interfaz pública (Frontend)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Enrutadores de los recursos de la API
const usuariosRouter = require('./Routers/usuarios');
const productosRouter = require('./Routers/productos');
const comprasRouter = require('./Routers/compras');
const minecraftRouter = require('./Routers/minecraft'); // Poner la ruta de mi Minecraft o pues el hobby 

app.use('/api/usuarios', usuariosRouter);
app.use('/api/productos', productosRouter);
app.use('/api/compras', comprasRouter);
app.use('/api/minecraft', minecraftRouter);     // La Api de mi hobby en el server

// Documentación básica de cada endpoint disponible en el ecosistema
app.get('/api', (req, res) => {
    res.json({
        status : 'success',
        message : 'API REST',
        endpoint : {
            usuarios : {
                listar : 'GET /api/usuarios',
                obtener : 'GET /api/usuarios/:id',
                crear : 'POST /api/usuarios',
                actualizar : 'PUT /api/usuarios/:id',
                eliminar : 'DELETE /api/usuarios/:id'
            },
            productos : {
                listar : 'GET /api/productos',
                obtener : 'GET /api/productos/:id',
                crear : 'POST /api/productos',
                actualizar : 'PUT /api/productos/:id',
                eliminar : 'DELETE /api/productos/:id'
            },
            compras : {
                listar : 'GET /api/compras',
                obtener : 'GET /api/compras/:id',
                crear : 'POST /api/compras',
                actualizar : 'PUT /api/compras/:id',
                eliminar : 'DELETE /api/compras/:id'
            },
            minecraft : {                                           //esperar una respuesta de cada api dependiendo de su metodo, ya sea el gets o el put o el delete
                listar : 'GET /api/minecraft',
                obtener : 'GET /api/minecraft/:id',
                crear : 'POST /api/minecraft',
                actualizar : 'PUT /api/minecraft/:id',
                eliminar : 'DELETE /api/minecraft/:id'
            }
        }
    });
});

app.use('/api/*path', (req, res) => {
    res.status(404).json({
        status : 'error',
        message : 'Ruta no encontrada dentro de la API'
    });
});

// ============================================================
// 🌟 REEMPLAZA TU VIEJO MANEJADOR DE ERRORES POR ESTE:
// ============================================================
app.use((err, req, res, next) => {
    
    // Detectamos si MySQL rechazó el guardado por culpa de una restricción UNIQUE (Error 1062)
    if (err.errno === 1062 || err.code === 'ER_DUP_ENTRY') {
        console.warn(`[REGISTRO DUPLICADO] Intento de duplicar datos en: ${req.method} ${req.url}`);
        
        let mensajeCliente = 'Este registro ya existe en el sistema.';

        // Evaluamos la URL de la petición para saber exactamente qué módulo falló
        if (req.url.includes('minecraft')) {
            mensajeCliente = '¡Error! Ese ID de Minecraft (namespace:item) ya está registrado en el catálogo.';
        } else if (req.url.includes('usuarios')) {
            mensajeCliente = '¡Error! Ese correo electrónico ya se encuentra registrado por otro usuario.';
        } else if (req.url.includes('productos')) {
            mensajeCliente = '¡Error! Ya existe un producto registrado con ese mismo nombre.';
        }

        // Respondemos con un código 400 (Bad Request) y el mensaje limpio
        return res.status(400).json({
            status: 'error',
            message: mensajeCliente
        });
    }

    // Si es cualquier otro tipo de error (problemas de conexión, sintaxis, etc.), sigue igual:
    console.error('Error no manejado: ', err.message);
    res.status(500).json({
        status : 'error',
        message : 'Error interno del servidor al procesar la solicitud'
    });
});

// Inicialización de la escucha del servidor en un único hilo de puerto estructurado
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
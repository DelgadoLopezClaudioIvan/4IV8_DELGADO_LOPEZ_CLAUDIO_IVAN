const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
// Servidor para inicializar con express

const PORT = process.env.PORT || 3000;

// Para poder aplicar el MVC necesitamos un intermediario que se va a encargar de ser un mesero (middleware), 
// el cual para cada peticion que pasa por la ruta de la vista, obtiene una petición y la envia a un controlador
app.use(cors());

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
const minecraftRouter = require('./Routers/minecraft'); // Endpoint personalizado

app.use('/api/usuarios', usuariosRouter);
app.use('/api/productos', productosRouter);
app.use('/api/compras', comprasRouter);
app.use('/api/minecraft', minecraftRouter);

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
            minecraft : {
                listar : 'GET /api/minecraft',
                obtener : 'GET /api/minecraft/:id',
                crear : 'POST /api/minecraft',
                actualizar : 'PUT /api/minecraft/:id',
                eliminar : 'DELETE /api/minecraft/:id'
            }
        }
    });
});

// Función de escape y control para las rutas inexistentes en el prefijo api
app.use('/api/*path', (req, res) => {
    res.status(404).json({
        status : 'error',
        message : 'Ruta no encontrada dentro de la API'
    });
});

// Manejador global de errores internos (Middleware de fin de cadena)
app.use((err, req, res, next) => {
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
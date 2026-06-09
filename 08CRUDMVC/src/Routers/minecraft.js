const express = require('express');
const router = express.Router();
// CAMBIO 1: Ajusta la ruta para salir de src y entrar a DB
const db = require('../DB/database'); 

// la lista de la constante de las categorias para solo agregar y no editatr ene el html
const CATEGORIAS_PERMITIDAS = [
    "Espadas", "Hachas", "Picos", "Palas", "Azadas", "Arcos", "Ballestas", 
    "Tridentes", "Escudos", "Cascos", "Pecheras", "Pantalones", "Botas", 
    "Comidas", "Pociones", "Cubos", "Mapas", "Brújulas", "Relojes", "Libros", 
    "Tótems", "Perlas de Ender", "Ojos de Ender", "Cohetes", "Cañas de Pescar", 
    "Tijeras", "Pedernal y Acero", "Etiquetas", "Monturas", "Discos Musicales", 
    "Bloques", "Minerales", "Gemas", "Lingotes", "Polvo de Redstone", 
    "Semillas", "Tinturas", "Mesas de Trabajo", "Huevos de mobs", "Pistolas", "Cofres"
];

// RegEx global para permitir solo letras (con acentos/ñ) y números con espacios
const regexAlphanumeric = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]+$/;

// --- NUEVO: RegEx para bloquear comandos SQL ---
const sqlInjectionRegex = /\b(DROP|DELETE|TRUNCATE|ALTER|INSERT|UPDATE|SELECT|GRANT|REVOKE|UNION|EXEC|EXECUTE)\b/i;

// Función auxiliar para revisar si un texto contiene comandos SQL
const contieneComandosSQL = (texto) => {
    if (!texto) return false;
    return sqlInjectionRegex.test(texto);
};
// ----------------------------------------------

//se da una respuesta a los datos de la lista
router.get('/categorias', (req, res) => {
    res.json({
        status: 'success',
        data: CATEGORIAS_PERMITIDAS
    });
});

// listar los iteams
router.get('/', async (req, res, next) => {
    try {
        const [rows] = await db.execute('SELECT * FROM minecraft ORDER BY id DESC');
        res.json({
            status: 'success',
            data: rows,
            count: rows.length
        });
    } catch (error) {
        next(error);
    }
});

// se obtienen cada iteam por su ID
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute('SELECT * FROM minecraft WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Ítem no encontrado' });
        }
        
        res.json({
            status: 'success',
            data: rows[0]
        });
    } catch (error) {
        next(error);
    }
});

// crear un iteam nuevo
router.post('/', async (req, res, next) => {
    try {
        let { nombre, categoria, minecraft_id, tipo_item, descripcion, foto_url } = req.body;

        if (!nombre || !categoria || !minecraft_id || !tipo_item ||
            nombre.trim() === "" || categoria.trim() === "" || minecraft_id.trim() === "" || tipo_item.trim() === "") {
            return res.status(400).json({
                status: 'error',
                message: 'Faltan campos obligatorios o contienen solo espacios en blanco.'
            });
        }

        nombre = nombre.trim();
        categoria = categoria.trim();
        minecraft_id = minecraft_id.trim();
        tipo_item = tipo_item.trim();
        descripcion = descripcion ? descripcion.trim() : null;
        foto_url = foto_url ? foto_url.trim() : null;

        // --- NUEVA VALIDACIÓN ANTI SQL INJECTION ---
        if (contieneComandosSQL(nombre) || contieneComandosSQL(tipo_item) || contieneComandosSQL(descripcion) || contieneComandosSQL(minecraft_id)) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'El texto contiene palabras no permitidas por seguridad (Ej: DROP, DELETE, SELECT, etc).' 
            });
        }
        // -------------------------------------------

        // --- VALIDACIONES ALFANUMÉRICAS ---
        if (!regexAlphanumeric.test(nombre)) {
            return res.status(400).json({ status: 'error', message: 'El nombre solo puede contener letras, números y espacios.' });
        }

        if (!regexAlphanumeric.test(tipo_item)) {
            return res.status(400).json({ status: 'error', message: 'El tipo de ítem solo puede contener letras, números y espacios.' });
        }

        if (descripcion && !regexAlphanumeric.test(descripcion)) {
            return res.status(400).json({ status: 'error', message: 'La descripción solo puede contener letras, números y espacios.' });
        }
        // -----------------------------------------

        if (nombre.length > 100) {
            return res.status(400).json({ status: 'error', message: 'El nombre no puede superar los 100 caracteres.' });
        }

        if (descripcion && descripcion.length > 100) {
            return res.status(400).json({ status: 'error', message: 'La descripción no puede superar los 100 caracteres.' });
        }

        const regexMinecraftId = /^[a-z0-9_]+:[a-z0-9_]+$/;
        if (minecraft_id.length > 100 || !regexMinecraftId.test(minecraft_id)) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'El ID de Minecraft debe ser menor a 100 caracteres y tener la estructura "namespace:item" en minúsculas.' 
            });
        }

        if (!CATEGORIAS_PERMITIDAS.includes(categoria)) {
            return res.status(400).json({ status: 'error', message: 'La categoría seleccionada no es válida en el sistema.' });
        }

        if (foto_url && !foto_url.startsWith('http://') && !foto_url.startsWith('https://')) {
            return res.status(400).json({ status: 'error', message: 'El enlace de la imagen debe ser una URL válida.' });
        }

        const query = `
            INSERT INTO minecraft (nombre, categoria, minecraft_id, tipo_item, descripcion, foto_url) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [nombre, categoria, minecraft_id, tipo_item, descripcion, foto_url]);

        res.status(201).json({
            status: 'success',
            message: 'Ítem creado con éxito',
            data: { id: result.insertId }
        });
    } catch (error) {
        next(error);
    }
});

// actualizar un iteam por el metodo put
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        let { nombre, categoria, minecraft_id, tipo_item, descripcion, foto_url } = req.body;

        if (!nombre || !categoria || !minecraft_id || !tipo_item ||
            nombre.trim() === "" || categoria.trim() === "" || minecraft_id.trim() === "" || tipo_item.trim() === "") {
            return res.status(400).json({
                status: 'error',
                message: 'Faltan campos obligatorios o contienen solo espacios en blanco para actualizar.'
            });
        }

        nombre = nombre.trim();
        categoria = categoria.trim();
        minecraft_id = minecraft_id.trim();
        tipo_item = tipo_item.trim();
        descripcion = descripcion ? descripcion.trim() : null;
        foto_url = foto_url ? foto_url.trim() : null;

        // --- NUEVA VALIDACIÓN ANTI SQL INJECTION ---
        if (contieneComandosSQL(nombre) || contieneComandosSQL(tipo_item) || contieneComandosSQL(descripcion) || contieneComandosSQL(minecraft_id)) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'El texto contiene palabras no permitidas por seguridad (Ej: DROP, DELETE, SELECT, etc).' 
            });
        }
        // -------------------------------------------

        // --- VALIDACIONES ALFANUMÉRICAS ---
        if (!regexAlphanumeric.test(nombre)) {
            return res.status(400).json({ status: 'error', message: 'El nombre solo puede contener letras, números y espacios.' });
        }

        if (!regexAlphanumeric.test(tipo_item)) {
            return res.status(400).json({ status: 'error', message: 'El tipo de ítem solo puede contener letras, números y espacios.' });
        }

        if (descripcion && !regexAlphanumeric.test(descripcion)) {
            return res.status(400).json({ status: 'error', message: 'La descripción solo puede contener letras, números y espacios.' });
        }
        // -----------------------------------------

        if (nombre.length > 100) {
            return res.status(400).json({ status: 'error', message: 'El nombre no puede superar los 100 caracteres.' });
        }

        if (descripcion && descripcion.length > 100) {
            return res.status(400).json({ status: 'error', message: 'La descripción no puede superar los 100 caracteres.' });
        }

        const regexMinecraftId = /^[a-z0-9_]+:[a-z0-9_]+$/;
        if (minecraft_id.length > 100 || !regexMinecraftId.test(minecraft_id)) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'El ID de Minecraft debe ser menor a 100 caracteres y estructura válida.' 
            });
        }

        if (!CATEGORIAS_PERMITIDAS.includes(categoria)) {
            return res.status(400).json({ status: 'error', message: 'La categoría seleccionada no es válida.' });
        }

        let query;
        let params;

        if (req.body.foto_url !== undefined) {
            query = `
                UPDATE minecraft 
                SET nombre = ?, categoria = ?, minecraft_id = ?, tipo_item = ?, descripcion = ?, foto_url = ? 
                WHERE id = ?
            `;
            params = [nombre, categoria, minecraft_id, tipo_item, descripcion, foto_url, id];
        } else {
            query = `
                UPDATE minecraft 
                SET nombre = ?, categoria = ?, minecraft_id = ?, tipo_item = ?, descripcion = ? 
                WHERE id = ?
            `;
            params = [nombre, categoria, minecraft_id, tipo_item, descripcion, id];
        }

        await db.execute(query, params);

        res.json({
            status: 'success',
            message: 'Ítem actualizado con éxito'
        });
    } catch (error) {
        next(error);
    }
});

// eliminar el iteam por el metodo deleate
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM minecraft WHERE id = ?', [id]);
        res.json({
            status: 'success',
            message: 'Ítem eliminado correctamente'
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
// CAMBIO 1: Ajusta la ruta para salir de src y entrar a DB
const db = require('../DB/database'); 

// 1. LISTAR ÍTEMS
router.get('/', async (req, res, next) => {
    try {
        // CAMBIO 2: Cambiar pool.query por db.execute
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

// 2. OBTENER UN ÍTEM POR ID
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

// 3. CREAR ÍTEM
router.post('/', async (req, res, next) => {
    try {
        const { nombre, categoria, minecraft_id, tipo_item, descripcion, foto_url } = req.body;

        if (!nombre || !categoria || !minecraft_id || !tipo_item) {
            return res.status(400).json({
                status: 'error',
                message: 'Faltan campos obligatorios en el formulario.'
            });
        }

        const query = `
            INSERT INTO minecraft (nombre, categoria, minecraft_id, tipo_item, descripcion, foto_url) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [nombre, categoria, minecraft_id, tipo_item, descripcion || null, foto_url || null]);

        res.status(201).json({
            status: 'success',
            message: 'Ítem creado con éxito',
            data: { id: result.insertId }
        });
    } catch (error) {
        next(error);
    }
});

// 4. ACTUALIZAR ÍTEM
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nombre, categoria, minecraft_id, tipo_item, descripcion, foto_url } = req.body;

        let query;
        let params;

        if (foto_url !== undefined) {
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

// 5. ELIMINAR ÍTEM
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
//aqui necesitamos crear el orden para que el controladotr obtenga la peticion sepa la ruta para poderrla atrender y de ahi se conecte a la bd y srealiza la accion

//ahora que ya hizo la accion poder generar la respuesta a partit del controlador a la vista

const express = requiere('express');
const router = express.Router();
//este se encarga de organizar a cada ruta de forma nterna

const bd = requiere('..DB/database');

//por cada accion debo de programar los elemtons correspondietne del usuarios

//funcion para validar use y pass

function validarUsuario(datos){
    
    const errores = [];

    if(!datos.nombre || typeof datos.nombre !== 'String' || datos.nombre.trim().length < 2){
        errores.push('El nombre es obligatorio y debe de tener al menos 2 caracteres');
    }
    if(!datos.email || typeof datos.email !== 'String'){
        errores.push('El email es obligatorio, verificalo');
    }else{
        //expresun regular para validar
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(datos.email)){
            errores.push('El formato del email no es valido');
        }
    }
    return errores;
}


//vamos a mostrar todos los usuarios
router.get('/', async (req, res) => {
    try{
        const [usuarios] = await bd.execute(
            //necesitasmos la querry
            'Select id, nombre, email, created_at, updated_at FROM usuarios order by id ASC'
        );

        res.json({
            status : 'successs',
            data : usuarios.length,
            count : usuarios.length
        });
    }catch(error){
        console.log('Error al listar los usuarios: ', error.message);
        res.status(500).json({
            status : 'error',
            message : 'Error interno del servidot'
        });
    }
});
//primero necesitamos crear un sevidor para la aplicacion y ahi mismo montar nuestra bd
//este es el modulo nativo para cualquier servidor
const http = require('http');
//el modulo para leer los archivos del sistema
const fs = require('fs');
//el modulo para la ruta e identificar el archivo
const path = require('path');
//el modulo nativo para extraer parametos
const url = require('url');
//este modulo lo tenemos que descvargar con el comando npm install mysql2
const mysql = require('mysql2');

//configurar el servidor

const PORT = process.env.PORT || 3000;

//vamos a conectar a la bd
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'pnt_practica1',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0

});

const MIME_TYPES = {
    'html' : 'text/html charset=utf-8',
    'css' : 'text/css; charset=utf-8',
    'js' : 'application/javascript; charset=uft-8',
    'json' : 'application/json; charset=utf-8',
    'png' : 'image/png',
    'jpg':'image/jpeg',
    'ico' : 'image/x-icon'
}
//esta funcion se encarga de leer los archivos en la carpeta publica y envir al navegador




function servirArchivoEsgtatico(req, res){
    //si la url es '/' servimos index.html
    let filePath = req.url === '/' ? '/index.html' : req.url;
    //contruimos las rutas de los archivos
    const fullPath = path.join(__dirname, 'public', filePath);
    //obtenemos la extension de archivos para determinar el tipo de archivo
    const ext = path.extname(fullPath);
    const mimeType = MIME_TYPES[ext];

    if(!mimeType){
        res.writeHead(404, {'Content-Type': 'text/plain: charset=utf-8'});
        res.end('Archivo no encontrado');
        return;

    }

    fs.readFile(fullPath, (error, contenido)=>{
        if(!mimeType){
        res.writeHead(404, {'Content-Type': 'text/plain: charset=utf-8'});
        res.end('Archivo no encontrado');
        }else{
            res.writeHead(200, {'Content-Type': mimeType});
            res.end(contenido)
        }
    
});
}
//debo de crear una promesa de conex
const db = pool.promise();
//esto nos permite escribvir un codigo asincrono que tenfra un tiempo de espera oara conectarse, procesarse y dar respuesta
//debemos de atender cada una de lads peticiones qwuer vengan por parte de la carpeta de public
function leerBody(req){
    return new Promise((resolve, reject)=>{
        let body = '';
        //vamos a tener un evento que se dispara cada vez que llega un pedazo de los datos
        req.on('data',(chunk) => {
            body += chunk.toString();
            //debo verificar el tamaño del ody
            if(body.length > 1e6){
                req.destroy();
                reject(new Error('Body demasiado grande'));
            }
        });
        //el evento se diapara cuando todos los datos han llegado
        req.on('end', () => {
            try{
                resolve(JSON.parse(body));
            }catch(e){
                reject(new Error('JSON invalido'))
            }
        });
        req.on('error', reject);
    });
}

//este elemento nso sirve para dar respuestas 
function enviarJSON(res, statusCode, data){
    res.writeHead(statusCode, {'Content-Type' : 'application/JSON; charset=utf-8'});
    res.end(JSON.stringify(data));
}




const server = http.createServer(async (req, res) => {
	
	const parseUrl = url.parse(req.url, true);
	const pathname = parseUrl.pathname;
	const method = req.method;

	console.log('[${new Date().toLocaleTimeString()}] ${method} ${pathname}');

	servirArchivoEstatico(req, res);

});




server.listen(PORT, () => {
    console.log('Servidor inicializado en el puerto: ' + PORT);
    console.log('Para salir presiona Crtl + C ');
})
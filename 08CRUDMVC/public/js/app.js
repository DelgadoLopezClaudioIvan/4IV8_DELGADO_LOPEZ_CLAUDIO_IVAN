// ============================================================
// PRÁCTICA 3 - PNT: Frontend para Sistema de Compras y Minecraft
// ============================================================
// Este frontend maneja 4 secciones: Usuarios, Productos, Compras y Minecraft.
// Cada sección tiene su propio formulario y tabla.
//
// ESTRUCTURA DEL CÓDIGO:
// 1. Utilidades compartidas (fetchAPI, notificaciones, etc.)
// 2. Módulo de Usuarios (CRUD)
// 3. Módulo de Productos (CRUD)
// 4. Módulo de Compras (crear, listar, eliminar)
// 5. Módulo de Minecraft (CRUD con links de internet)
// 6. Navegación por pestañas
// 7. Inicialización
// ============================================================

// ============================================================
// 1. UTILIDADES COMPARTIDAS
// ============================================================

// Panel de estado de la API
const apiMetodo = document.getElementById('api-metodo');
const apiUrl = document.getElementById('api-url');
const apiCodigo = document.getElementById('api-codigo');
const notificacionDiv = document.getElementById('notificacion');

// Fetch wrapper con logging
async function fetchAPI(url, opciones = {}) {
    const method = opciones.method || 'GET';

    if (apiMetodo) {
        apiMetodo.textContent = method;
        apiMetodo.className = `badge badge-${method.toLowerCase()}`;
    }
    if (apiUrl) apiUrl.textContent = url;
    if (apiCodigo) {
        apiCodigo.textContent = '...';
        apiCodigo.className = 'badge badge-neutral';
    }

    try {
        const respuesta = await fetch(url, opciones);
        if (apiCodigo) {
            apiCodigo.textContent = `${respuesta.status}`;
            apiCodigo.className = `badge ${respuesta.ok ? 'badge-success' : 'badge-error'}`;
        }

        const datos = await respuesta.json();
        if (!respuesta.ok) {
            throw new Error(datos.message || `Error ${respuesta.status}`);
        }
        return datos;
    } catch (error) {
        if (apiCodigo && apiCodigo.textContent === '...') {
            apiCodigo.textContent = 'ERROR';
            apiCodigo.className = 'badge badge-error';
        }
        throw error;
    }
}

function mostrarNotificacion(mensaje, tipo) {
    if (!notificacionDiv) return;
    notificacionDiv.textContent = mensaje;
    notificacionDiv.className = `notificacion ${tipo}`;
    notificacionDiv.style.display = 'block';
    setTimeout(() => { notificacionDiv.style.display = 'none'; }, 3000);
}

function escapeHtml(texto) {
    if (!texto) return '';
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

function formatearFechaHora(fechaISO) {
    if (!fechaISO) return '-';
    return new Date(fechaISO).toLocaleString('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

// ============================================================
// 2. MÓDULO DE USUARIOS
// ============================================================
const formUsuario = document.getElementById('form-usuario');
const inputUsuarioId = document.getElementById('usuario-id');
const inputUsuarioNombre = document.getElementById('usuario-nombre');
const inputUsuarioEmail = document.getElementById('usuario-email');
const formTituloUsuario = document.getElementById('form-titulo-usuario');
const btnGuardarUsuario = document.getElementById('btn-guardar-usuario');
const btnCancelarUsuario = document.getElementById('btn-cancelar-usuario');
const tbodyUsuarios = document.getElementById('tbody-usuarios');
const tablaUsuarios = document.getElementById('tabla-usuarios');
const cargaUsuarios = document.getElementById('carga-usuarios');
const contadorUsuarios = document.getElementById('contador-usuarios');
const errorUsuarioNombre = document.getElementById('error-usuario-nombre');
const errorUsuarioEmail = document.getElementById('error-usuario-email');

async function cargarUsuarios() {
    try {
        const resp = await fetchAPI('/api/usuarios');
        if (cargaUsuarios) cargaUsuarios.style.display = 'none';

        if (resp.data.length === 0) {
            if (tablaUsuarios) tablaUsuarios.style.display = 'none';
            if (cargaUsuarios) {
                cargaUsuarios.textContent = 'No hay usuarios registrados.';
                cargaUsuarios.style.display = 'block';
            }
        } else {
            if (tablaUsuarios) tablaUsuarios.style.display = 'table';
            if (tbodyUsuarios) {
                tbodyUsuarios.innerHTML = '';
                resp.data.forEach(u => {
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <td>${u.id}</td>
                        <td>${escapeHtml(u.nombre)}</td>
                        <td>${escapeHtml(u.email)}</td>
                        <td>
                            <button class="btn-ver" onclick="verComprasUsuario(${u.id})">Compras</button>
                            <button class="btn-editar" onclick="editarUsuario(${u.id})">Editar</button>
                            <button class="btn-eliminar" onclick="confirmarEliminarUsuario(${u.id}, '${escapeHtml(u.nombre)}')">Eliminar</button>
                        </td>
                    `;
                    tbodyUsuarios.appendChild(fila);
                });
            }
        }
        if (contadorUsuarios) contadorUsuarios.textContent = `${resp.count}`;
    } catch (error) {
        mostrarNotificacion('Error al cargar usuarios: ' + error.message, 'error');
    }
}

function validarFormUsuario() {
    let ok = true;
    const nombre = inputUsuarioNombre.value.trim();
    const email = inputUsuarioEmail.value.trim();

    if (!nombre || nombre.length < 2) {
        if (errorUsuarioNombre) errorUsuarioNombre.textContent = 'Mínimo 2 caracteres';
        if (inputUsuarioNombre) inputUsuarioNombre.classList.add('input-error');
        ok = false;
    } else {
        if (errorUsuarioNombre) errorUsuarioNombre.textContent = '';
        if (inputUsuarioNombre) inputUsuarioNombre.classList.remove('input-error');
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (errorUsuarioEmail) errorUsuarioEmail.textContent = 'Email no válido';
        if (inputUsuarioEmail) inputUsuarioEmail.classList.add('input-error');
        ok = false;
    } else {
        if (errorUsuarioEmail) errorUsuarioEmail.textContent = '';
        if (inputUsuarioEmail) inputUsuarioEmail.classList.remove('input-error');
    }

    return ok;
}

function limpiarFormUsuario() {
    if (formUsuario) formUsuario.reset();
    if (inputUsuarioId) inputUsuarioId.value = '';
    if (formTituloUsuario) formTituloUsuario.textContent = 'Agregar Usuario';
    if (btnGuardarUsuario) btnGuardarUsuario.textContent = 'Guardar';
    if (btnCancelarUsuario) btnCancelarUsuario.style.display = 'none';
    if (errorUsuarioNombre) errorUsuarioNombre.textContent = '';
    if (errorUsuarioEmail) errorUsuarioEmail.textContent = '';
    if (inputUsuarioNombre) inputUsuarioNombre.classList.remove('input-error');
    if (inputUsuarioEmail) inputUsuarioEmail.classList.remove('input-error');
}

if (formUsuario) {
    formUsuario.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validarFormUsuario()) return;

        const datos = {
            nombre: inputUsuarioNombre.value.trim(),
            email: inputUsuarioEmail.value.trim()
        };
        const id = inputUsuarioId.value;

        try {
            if (id) {
                await fetchAPI(`/api/usuarios/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                });
                mostrarNotificacion('Usuario actualizado', 'exito');
            } else {
                await fetchAPI('/api/usuarios', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                });
                mostrarNotificacion('Usuario creado', 'exito');
            }
            limpiarFormUsuario();
            cargarUsuarios();
            cargarSelectUsuarios();
        } catch (error) {
            mostrarNotificacion(error.message, 'error');
        }
    });
}

async function editarUsuario(id) {
    try {
        const resp = await fetchAPI(`/api/usuarios/${id}`);
        inputUsuarioId.value = resp.data.id;
        inputUsuarioNombre.value = resp.data.nombre;
        inputUsuarioEmail.value = resp.data.email;
        if (formTituloUsuario) formTituloUsuario.textContent = 'Editar Usuario';
        if (btnGuardarUsuario) btnGuardarUsuario.textContent = 'Actualizar';
        if (btnCancelarUsuario) btnCancelarUsuario.style.display = 'inline-block';
        cambiarSeccion('usuarios');
        if (formUsuario) formUsuario.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

function confirmarEliminarUsuario(id, nombre) {
    if (confirm(`¿Eliminar a "${nombre}" y todas sus compras?`)) {
        eliminarUsuario(id);
    }
}

async function eliminarUsuario(id) {
    try {
        await fetchAPI(`/api/usuarios/${id}`, { method: 'DELETE' });
        mostrarNotificacion('Usuario eliminado', 'exito');
        if (inputUsuarioId && inputUsuarioId.value === String(id)) limpiarFormUsuario();
        cargarUsuarios();
        cargarSelectUsuarios();
        cargarCompras();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

async function verComprasUsuario(id) {
    try {
        const resp = await fetchAPI(`/api/compras/usuario/${id}`);
        const { usuario, compras, total_compras, total_gastado } = resp.data;

        let mensaje = `${usuario.nombre} tiene ${total_compras} compra(s).\nTotal gastado: $${total_gastado}\n\n`;
        compras.forEach(c => {
            mensaje += `- ${c.producto} x${c.cantidad} = $${parseFloat(c.total).toFixed(2)}\n`;
        });

        alert(mensaje);
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

if (btnCancelarUsuario) btnCancelarUsuario.addEventListener('click', limpiarFormUsuario);

// ============================================================
// 3. MÓDULO DE PRODUCTOS
// ============================================================
const formProducto = document.getElementById('form-producto');
const inputProductoId = document.getElementById('producto-id');
const inputProductoNombre = document.getElementById('producto-nombre');
const inputProductoPrecio = document.getElementById('producto-precio');
const formTituloProducto = document.getElementById('form-titulo-producto');
const btnGuardarProducto = document.getElementById('btn-guardar-producto');
const btnCancelarProducto = document.getElementById('btn-cancelar-producto');
const tbodyProductos = document.getElementById('tbody-productos');
const tablaProductos = document.getElementById('tabla-productos');
const cargaProductos = document.getElementById('carga-productos');
const contadorProductos = document.getElementById('contador-productos');
const errorProductoNombre = document.getElementById('error-producto-nombre');
const errorProductoPrecio = document.getElementById('error-producto-precio');

async function cargarProductos() {
    try {
        const resp = await fetchAPI('/api/productos');
        if (cargaProductos) cargaProductos.style.display = 'none';

        if (resp.data.length === 0) {
            if (tablaProductos) tablaProductos.style.display = 'none';
            if (cargaProductos) {
                cargaProductos.textContent = 'No hay productos registrados.';
                cargaProductos.style.display = 'block';
            }
        } else {
            if (tablaProductos) tablaProductos.style.display = 'table';
            if (tbodyProductos) {
                tbodyProductos.innerHTML = '';
                resp.data.forEach(p => {
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <td>${p.id}</td>
                        <td>${escapeHtml(p.nombre)}</td>
                        <td>$${parseFloat(p.precio).toFixed(2)}</td>
                        <td>
                            <button class="btn-editar" onclick="editarProducto(${p.id})">Editar</button>
                            <button class="btn-eliminar" onclick="confirmarEliminarProducto(${p.id}, '${escapeHtml(p.nombre)}')">Eliminar</button>
                        </td>
                    `;
                    tbodyProductos.appendChild(fila);
                });
            }
        }
        if (contadorProductos) contadorProductos.textContent = `${resp.count}`;
    } catch (error) {
        mostrarNotificacion('Error al cargar productos: ' + error.message, 'error');
    }
}

function validarFormProducto() {
    let ok = true;
    const nombre = inputProductoNombre.value.trim();
    const precio = inputProductoPrecio.value;

    if (!nombre || nombre.length < 2) {
        if (errorProductoNombre) errorProductoNombre.textContent = 'Mínimo 2 caracteres';
        if (inputProductoNombre) inputProductoNombre.classList.add('input-error');
        ok = false;
    } else {
        if (errorProductoNombre) errorProductoNombre.textContent = '';
        if (inputProductoNombre) inputProductoNombre.classList.remove('input-error');
    }

    if (!precio || parseFloat(precio) <= 0) {
        if (errorProductoPrecio) errorProductoPrecio.textContent = 'Precio debe ser mayor que 0';
        if (inputProductoPrecio) inputProductoPrecio.classList.add('input-error');
        ok = false;
    } else {
        if (errorProductoPrecio) errorProductoPrecio.textContent = '';
        if (inputProductoPrecio) inputProductoPrecio.classList.remove('input-error');
    }

    return ok;
}

function limpiarFormProducto() {
    if (formProducto) formProducto.reset();
    if (inputProductoId) inputProductoId.value = '';
    if (formTituloProducto) formTituloProducto.textContent = 'Agregar Producto';
    if (btnGuardarProducto) btnGuardarProducto.textContent = 'Guardar';
    if (btnCancelarProducto) btnCancelarProducto.style.display = 'none';
    if (errorProductoNombre) errorProductoNombre.textContent = '';
    if (errorProductoPrecio) errorProductoPrecio.textContent = '';
    if (inputProductoNombre) inputProductoNombre.classList.remove('input-error');
    if (inputProductoPrecio) inputProductoPrecio.classList.remove('input-error');
}

if (formProducto) {
    formProducto.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validarFormProducto()) return;

        const datos = {
            nombre: inputProductoNombre.value.trim(),
            precio: parseFloat(inputProductoPrecio.value)
        };
        const id = inputProductoId.value;

        try {
            if (id) {
                await fetchAPI(`/api/productos/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                });
                mostrarNotificacion('Producto actualizado', 'exito');
            } else {
                await fetchAPI('/api/productos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                });
                mostrarNotificacion('Producto creado', 'exito');
            }
            limpiarFormProducto();
            cargarProductos();
            cargarSelectProductos();
        } catch (error) {
            mostrarNotificacion(error.message, 'error');
        }
    });
}

async function editarProducto(id) {
    try {
        const resp = await fetchAPI(`/api/productos/${id}`);
        inputProductoId.value = resp.data.id;
        inputProductoNombre.value = resp.data.nombre;
        inputProductoPrecio.value = resp.data.precio;
        if (formTituloProducto) formTituloProducto.textContent = 'Editar Producto';
        if (btnGuardarProducto) btnGuardarProducto.textContent = 'Actualizar';
        if (btnCancelarProducto) btnCancelarProducto.style.display = 'inline-block';
        cambiarSeccion('productos');
        if (formProducto) formProducto.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

function confirmarEliminarProducto(id, nombre) {
    if (confirm(`¿Eliminar "${nombre}"?\nSi tiene compras asociadas, no se podrá eliminar.`)) {
        eliminarProducto(id);
    }
}

async function eliminarProducto(id) {
    try {
        await fetchAPI(`/api/productos/${id}`, { method: 'DELETE' });
        mostrarNotificacion('Producto eliminado', 'exito');
        if (inputProductoId && inputProductoId.value === String(id)) limpiarFormProducto();
        cargarProductos();
        cargarSelectProductos();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

if (btnCancelarProducto) btnCancelarProducto.addEventListener('click', limpiarFormProducto);

// ============================================================
// 4. MÓDULO DE COMPRAS
// ============================================================
const formCompra = document.getElementById('form-compra');
const selectUsuario = document.getElementById('compra-usuario');
const selectProducto = document.getElementById('compra-producto');
const inputCantidad = document.getElementById('compra-cantidad');
const tbodyCompras = document.getElementById('tbody-compras');
const tablaCompras = document.getElementById('tabla-compras');
const cargaCompras = document.getElementById('carga-compras');
const contadorCompras = document.getElementById('contador-compras');
const errorCompraUsuario = document.getElementById('error-compra-usuario');
const errorCompraProducto = document.getElementById('error-compra-producto');
const errorCompraCantidad = document.getElementById('error-compra-cantidad');

async function cargarSelectUsuarios() {
    try {
        const resp = await fetchAPI('/api/usuarios');
        if (selectUsuario) {
            selectUsuario.innerHTML = '<option value="">-- Seleccionar usuario --</option>';
            resp.data.forEach(u => {
                const option = document.createElement('option');
                option.value = u.id;
                option.textContent = `${u.nombre} (${u.email})`;
                selectUsuario.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error cargando select usuarios:', error);
    }
}

async function cargarSelectProductos() {
    try {
        const resp = await fetchAPI('/api/productos');
        if (selectProducto) {
            selectProducto.innerHTML = '<option value="">-- Seleccionar producto --</option>';
            resp.data.forEach(p => {
                const option = document.createElement('option');
                option.value = p.id;
                option.textContent = `${p.nombre} — $${parseFloat(p.precio).toFixed(2)}`;
                selectProducto.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error cargando select productos:', error);
    }
}

async function cargarCompras() {
    try {
        const resp = await fetchAPI('/api/compras');
        if (cargaCompras) cargaCompras.style.display = 'none';

        if (resp.data.length === 0) {
            if (tablaCompras) tablaCompras.style.display = 'none';
            if (cargaCompras) {
                cargaCompras.textContent = 'No hay compras registradas.';
                cargaCompras.style.display = 'block';
            }
        } else {
            if (tablaCompras) tablaCompras.style.display = 'table';
            if (tbodyCompras) {
                tbodyCompras.innerHTML = '';
                resp.data.forEach(c => {
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <td>${c.id}</td>
                        <td>${escapeHtml(c.usuario_nombre)}</td>
                        <td>${escapeHtml(c.producto_nombre)}</td>
                        <td>$${parseFloat(c.producto_precio).toFixed(2)}</td>
                        <td>${c.cantidad}</td>
                        <td><strong>$${parseFloat(c.total).toFixed(2)}</strong></td>
                        <td>${formatearFechaHora(c.fecha_compra)}</td>
                        <td>
                            <button class="btn-eliminar" onclick="confirmarEliminarCompra(${c.id})">Eliminar</button>
                        </td>
                    `;
                    tbodyCompras.appendChild(fila);
                });
            }
        }
        if (contadorCompras) contadorCompras.textContent = `${resp.count}`;
    } catch (error) {
        mostrarNotificacion('Error al cargar compras: ' + error.message, 'error');
    }
}

function validarFormCompra() {
    let ok = true;

    if (!selectUsuario || !selectUsuario.value) {
        if (errorCompraUsuario) errorCompraUsuario.textContent = 'Selecciona un usuario';
        if (selectUsuario) selectUsuario.classList.add('input-error');
        ok = false;
    } else {
        if (errorCompraUsuario) errorCompraUsuario.textContent = '';
        if (selectUsuario) selectUsuario.classList.remove('input-error');
    }

    if (!selectProducto || !selectProducto.value) {
        if (errorCompraProducto) errorCompraProducto.textContent = 'Selecciona un producto';
        if (selectProducto) selectProducto.classList.add('input-error');
        ok = false;
    } else {
        if (errorCompraProducto) errorCompraProducto.textContent = '';
        if (selectProducto) selectProducto.classList.remove('input-error');
    }

    const cant = inputCantidad ? parseInt(inputCantidad.value) : 0;
    if (!cant || cant < 1) {
        if (errorCompraCantidad) errorCompraCantidad.textContent = 'Mínimo 1';
        if (inputCantidad) inputCantidad.classList.add('input-error');
        ok = false;
    } else {
        if (errorCompraCantidad) errorCompraCantidad.textContent = '';
        if (inputCantidad) inputCantidad.classList.remove('input-error');
    }

    return ok;
}

if (formCompra) {
    formCompra.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validarFormCompra()) return;

        try {
            const resp = await fetchAPI('/api/compras', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuario_id: parseInt(selectUsuario.value),
                    producto_id: parseInt(selectProducto.value),
                    cantidad: parseInt(inputCantidad.value)
                })
            });

            mostrarNotificacion(
                `Compra registrada: ${resp.data.usuario} compró ${resp.data.cantidad}x ${resp.data.producto} ($${resp.data.total})`,
                `exito`
            );
            formCompra.reset();
            if (inputCantidad) inputCantidad.value = '1';
            cargarCompras();
        } catch (error) {
            mostrarNotificacion(error.message, 'error');
        }
    });
}

function confirmarEliminarCompra(id) {
    if (confirm('¿Eliminar esta compra?')) {
        eliminarCompra(id);
    }
}

async function eliminarCompra(id) {
    try {
        await fetchAPI(`/api/compras/${id}`, { method: 'DELETE' });
        mostrarNotificacion('Compra eliminada', 'exito');
        cargarCompras();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

// ============================================================
// 5. MÓDULO DE MINECRAFT
// ============================================================
//cada uno de los parametros y de los datos de mi hobby
const formMinecraft = document.getElementById('form-minecraft');
const inputMinecraftIdDb = document.getElementById('minecraft-id-db');
const inputMinecraftNombre = document.getElementById('minecraft-nombre');
const selectMinecraftCategoria = document.getElementById('minecraft-categoria');
const inputMinecraftInGameId = document.getElementById('minecraft-id-ingame');
const selectMinecraftTipoItem = document.getElementById('minecraft-tipo-item');
const inputMinecraftDescripcion = document.getElementById('minecraft-descripcion');

// tenia que poner url ya que imagen me daba errores catastroficos
const inputMinecraftFotoUrl = document.getElementById('minecraft-foto-url');

// esto lo que ve el usuarius
const formTituloMinecraft = document.getElementById('form-titulo-minecraft');
const btnGuardarMinecraft = document.getElementById('btn-guardar-minecraft');
const btnCancelarMinecraft = document.getElementById('btn-cancelar-minecraft');
const tbodyMinecraft = document.getElementById('tbody-minecraft');
const tablaMinecraft = document.getElementById('tabla-minecraft');
const cargaMinecraft = document.getElementById('carga-minecraft');
const contadorMinecraft = document.getElementById('contador-minecraft');
//cada error que pase para que no se petatie el sitio, spoiler:(se puede petatear)
const errorMNombre = document.getElementById('error-minecraft-nombre');
const errorMCategoria = document.getElementById('error-minecraft-categoria');
const errorMInGameId = document.getElementById('error-minecraft-id-ingame');
const errorMTipoItem = document.getElementById('error-minecraft-tipo-item');

//esto va a cargar por medio de la api si hay registros, la tabla de todos los datos y poner la foto del iteam
async function cargarMinecraft() {
    try {
        const resp = await fetchAPI('/api/minecraft');
        if (cargaMinecraft) cargaMinecraft.style.display = 'none';

        if (resp.data.length === 0) {
            if (tablaMinecraft) tablaMinecraft.style.display = 'none';
            if (cargaMinecraft) {
                cargaMinecraft.textContent = 'No hay ítems registrados en el catálogo.';
                cargaMinecraft.style.display = 'block';
            }
        } else {
            if (tablaMinecraft) tablaMinecraft.style.display = 'table';
            if (tbodyMinecraft) {
                tbodyMinecraft.innerHTML = '';
                resp.data.forEach(item => {
                    const fila = document.createElement('tr');
                    
                    const celdaImagen = item.foto_url 
                        ? `<img src="${escapeHtml(item.foto_url)}" alt="${escapeHtml(item.nombre)}" style="width: 45px; height: 45px; object-fit: contain; border-radius: 4px;" onerror="this.src='https://placehold.co/45?text=Error'">`
                        : `<span style="color: #888; font-size: 12px;">Sin foto</span>`;

                    fila.innerHTML = `
                        <td>${item.id}</td>
                        <td style="text-align: center;">${celdaImagen}</td>
                        <td><strong>${escapeHtml(item.nombre)}</strong></td>
                        <td><span class="badge-categoria">${escapeHtml(item.categoria)}</span></td>
                        <td><code>${escapeHtml(item.minecraft_id)}</code></td>
                        <td>${escapeHtml(item.tipo_item)}</td>
                        <td>${escapeHtml(item.descripcion || '-')}</td>
                        <td>
                            <button class="btn-editar" onclick="editarMinecraft(${item.id})">Editar</button>
                            <button class="btn-eliminar" onclick="confirmarEliminarMinecraft(${item.id}, '${escapeHtml(item.nombre)}')">Eliminar</button>
                        </td>
                    `;
                    tbodyMinecraft.appendChild(fila);
                });
            }
        }
        if (contadorMinecraft) contadorMinecraft.textContent = `${resp.count}`;
    } catch (error) {
        mostrarNotificacion('Error al cargar catálogo de Minecraft: ' + error.message, 'error');    //el error al cargar la lsita
    }
}
//las validaciones del programa para que sirva y no pase nada, entre mas validaciones se tenga, un dolor es saber que esta mal y que no
function validarFormMinecraft() {
    let ok = true;
    if (!inputMinecraftNombre || !inputMinecraftNombre.value.trim() || inputMinecraftNombre.value.trim().length < 2) {
        if (errorMNombre) errorMNombre.textContent = 'Obligatorio (mínimo 2 carac.)';
        if (inputMinecraftNombre) inputMinecraftNombre.classList.add('input-error');
        ok = false;
    } else {
        if (errorMNombre) errorMNombre.textContent = '';
        if (inputMinecraftNombre) inputMinecraftNombre.classList.remove('input-error');
    }

    if (!selectMinecraftCategoria || !selectMinecraftCategoria.value) {
        if (errorMCategoria) errorMCategoria.textContent = 'Selecciona una categoría';
        if (selectMinecraftCategoria) selectMinecraftCategoria.classList.add('input-error');
        ok = false;
    } else {
        if (errorMCategoria) errorMCategoria.textContent = '';
        if (selectMinecraftCategoria) selectMinecraftCategoria.classList.remove('input-error');
    }

    if (!inputMinecraftInGameId || !inputMinecraftInGameId.value.trim() || !inputMinecraftInGameId.value.includes(':')) {
        if (errorMInGameId) errorMInGameId.textContent = 'Formato inválido (ej: mod:id)';
        if (inputMinecraftInGameId) inputMinecraftInGameId.classList.add('input-error');
        ok = false;
    } else {
        if (errorMInGameId) errorMInGameId.textContent = '';
        if (inputMinecraftInGameId) inputMinecraftInGameId.classList.remove('input-error');
    }

    if (!selectMinecraftTipoItem || !selectMinecraftTipoItem.value) {
        if (errorMTipoItem) errorMTipoItem.textContent = 'Selecciona una opción';
        if (selectMinecraftTipoItem) selectMinecraftTipoItem.classList.add('input-error');
        ok = false;
    } else {
        if (errorMTipoItem) errorMTipoItem.textContent = '';
        if (selectMinecraftTipoItem) selectMinecraftTipoItem.classList.remove('input-error');
    }

    return ok;
}

function limpiarFormMinecraft() {
    if (formMinecraft) formMinecraft.reset(); // Esto borra lo escrito y que no se le dio a guardar
    if (inputMinecraftIdDb) inputMinecraftIdDb.value = '';
        inicializarCategoriasMinecraft(); 
    //basicamente te deja todo en limpio para que no se guarde, guatde y guarde
    if (formTituloMinecraft) formTituloMinecraft.textContent = 'Agregar Item al Catálogo';
    if (btnGuardarMinecraft) btnGuardarMinecraft.textContent = 'Guardar Ítem';
    if (btnCancelarMinecraft) btnCancelarMinecraft.style.display = 'none';

    if (errorMNombre) errorMNombre.textContent = '';
    if (errorMCategoria) errorMCategoria.textContent = '';
    if (errorMInGameId) errorMInGameId.textContent = '';
    if (errorMTipoItem) errorMTipoItem.textContent = '';
    if (inputMinecraftNombre) inputMinecraftNombre.classList.remove('input-error');
    if (selectMinecraftCategoria) selectMinecraftCategoria.classList.remove('input-error');
    if (inputMinecraftInGameId) inputMinecraftInGameId.classList.remove('input-error');
    if (selectMinecraftTipoItem) selectMinecraftTipoItem.classList.remove('input-error');
}

if (formMinecraft) {
    formMinecraft.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validarFormMinecraft()) return;

        const id = inputMinecraftIdDb.value;
        
        const datos = {
            nombre: inputMinecraftNombre.value.trim(),
            categoria: selectMinecraftCategoria.value,
            
            // Enviamos ambos nombres para asegurar que el backend reciba el correcto
            minecraft_id: inputMinecraftInGameId.value.trim(),
            minecraft_id_ingame: inputMinecraftInGameId.value.trim(),
            
            tipo_item: selectMinecraftTipoItem.value,
            descripcion: inputMinecraftDescripcion.value.trim() || null,
            foto_url: inputMinecraftFotoUrl ? inputMinecraftFotoUrl.value.trim() || null : null
        };

        try {
            if (id) {
                await fetchAPI(`/api/minecraft/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                });
                mostrarNotificacion('Ítem actualizado correctamente', 'exito');
            } else {
                await fetchAPI('/api/minecraft', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                });
                mostrarNotificacion('Ítem creado correctamente', 'exito');
            }
            limpiarFormMinecraft();
            cargarMinecraft();
        } catch (error) {
            mostrarNotificacion(error.message, 'error');
        }
    });
}

// para aplicar el metodo put del api
async function editarMinecraft(id) {
    try {
        // cargar las categorias que tengo en el back
        await inicializarCategoriasMinecraft();

        const resp = await fetchAPI(`/api/minecraft/${id}`);
        const item = resp.data;

        inputMinecraftIdDb.value = item.id;
        inputMinecraftNombre.value = item.nombre;
        selectMinecraftCategoria.value = item.categoria;
        inputMinecraftInGameId.value = item.minecraft_id;
        selectMinecraftTipoItem.value = item.tipo_item;
        inputMinecraftDescripcion.value = item.descripcion || '';
        if (inputMinecraftFotoUrl) inputMinecraftFotoUrl.value = item.foto_url || '';

        if (formTituloMinecraft) formTituloMinecraft.textContent = 'Editar Ítem de Minecraft';
        if (btnGuardarMinecraft) btnGuardarMinecraft.textContent = 'Actualizar Ítem';
        if (btnCancelarMinecraft) btnCancelarMinecraft.style.display = 'inline-block';
        
        cambiarSeccion('minecraft');
        if (formMinecraft) formMinecraft.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

function confirmarEliminarMinecraft(id, nombre) {
    if (confirm(`¿Estás seguro de eliminar "${nombre}" del catálogo?`)) {
        eliminarMinecraft(id);
    }
}

async function eliminarMinecraft(id) {
    try {
        await fetchAPI(`/api/minecraft/${id}`, { method: 'DELETE' });
        mostrarNotificacion('Ítem eliminado', 'exito');
        if (inputMinecraftIdDb && inputMinecraftIdDb.value === String(id)) limpiarFormMinecraft();
        cargarMinecraft();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

if (btnCancelarMinecraft) {
    btnCancelarMinecraft.addEventListener('click', limpiarFormMinecraft);
}

async function inicializarCategoriasMinecraft() {
    const selectCategoria = document.getElementById('minecraft-categoria');
    if (!selectCategoria) return;

    try {
        // hay que forzar para que se muestre sin depender tanto del api
        const respuesta = await fetch('/api/minecraft/categorias');
        const resultado = await respuesta.json();

        if (resultado.status === 'success' && Array.isArray(resultado.data)) {
            // se limpia la barra esa de seleccionar
            selectCategoria.innerHTML = '<option value="">-- Seleccionar --</option>';
            
            // hay que poner las opciones del back
            resultado.data.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria;
                option.textContent = categoria;
                selectCategoria.appendChild(option);
            });
            console.log("¡Categorías cargadas con éxito usando fetch nativo!");
        }
    } catch (error) {
        console.error("Error crítico en el fetch de categorías:", error);
    }
}

// ============================================================
// 6. NAVEGACIÓN POR PESTAÑAS
// ============================================================
function cambiarSeccion(seccion) {
    document.querySelectorAll('.seccion').forEach(s => {
        s.style.display = 'none';
    });

    document.querySelectorAll('.tab').forEach(t => {
        t.classList.remove('active');
    });

    const seccionObjetivo = document.getElementById(`seccion-${seccion}`);
    if (seccionObjetivo) seccionObjetivo.style.display = 'block';

    document.querySelectorAll('.tab').forEach(t => {
        if (t.textContent.toLowerCase().trim() === seccion.toLowerCase().trim()) {
            t.classList.add('active');
        }
    });

    if (seccion === 'compras') {
        cargarSelectUsuarios();
        cargarSelectProductos();
        cargarCompras();
    } else if (seccion === 'minecraft') {
        inicializarCategoriasMinecraft(); // Asegura que se carguen al entrar a la pestaña
        cargarMinecraft();
    } else if (seccion === 'usuarios') {
        cargarUsuarios();
    } else if (seccion === 'productos') {
        cargarProductos();
    }
}

// ============================================================
// 7. INICIALIZACIÓN
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    cargarUsuarios();
    cargarProductos();
    cargarCompras();
    cargarSelectUsuarios();
    cargarSelectProductos();
    cargarMinecraft();
    inicializarCategoriasMinecraft();
});
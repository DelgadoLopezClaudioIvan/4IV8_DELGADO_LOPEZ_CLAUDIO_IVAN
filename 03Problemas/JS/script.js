function validar(val) {
            if (val === "" || isNaN(val) || parseFloat(val) < 0) {
                alert("Por favor ingresa un dato válido.");
                return false;
            }
            return true;
        }

        function mostrar(id, msg) {
            const c = document.getElementById(id);
            c.style.display = "block";
            c.innerHTML = msg;
        }

        // 1. Inversión con límite de 1 millón
function ejercicio1() {
    let c = document.getElementById('cap1').value;
    if(validar(c)) {
        let monto = parseFloat(c);
        
        // Verificamos el límite
        if (monto > 1000000) {
            alert("Error: El capital no puede exceder $1,000,000.");
            return;
        }

        let g = monto * 0.02;
        mostrar('res1', `
            <b>Ganancia mensual (2%):</b> $${g.toFixed(2)}<br>
            <b>Total al final del mes:</b> $${(monto + g).toFixed(2)}
        `);
    }
}

// 2. Comisiones con límite de 100 mil por campo
function ejercicio2() {
    let sb = document.getElementById('s_base').value;
    let v1 = document.getElementById('v1').value;
    let v2 = document.getElementById('v2').value;
    let v3 = document.getElementById('v3').value;

    if(validar(sb) && validar(v1) && validar(v2) && validar(v3)) {
        let sueldoBase = parseFloat(sb);
        let venta1 = parseFloat(v1);
        let venta2 = parseFloat(v2);
        let venta3 = parseFloat(v3);

        // Verificamos que ningún campo pase de 100,000
        if (sueldoBase > 100000 || venta1 > 100000 || venta2 > 100000 || venta3 > 100000) {
            alert("Error: Ningún monto (sueldo o ventas) puede ser mayor a $100,000.");
            return;
        }

        let totalVentas = venta1 + venta2 + venta3;
        let comision = totalVentas * 0.10;
        let totalFinal = sueldoBase + comision;

        mostrar('res2', `
            <b>Total de ventas:</b> $${totalVentas.toFixed(2)}<br>
            <b>Comisiones (10%):</b> $${comision.toFixed(2)}<br>
            <b>Sueldo Total a recibir:</b> $${totalFinal.toFixed(2)}
        `);
    }
}


       // 3. Descuento con límite de compra de hasta $100,000
function ejercicio3() {
    let t = document.getElementById('total_compra').value;
    
    if(validar(t)) {
        let montoCompra = parseFloat(t);

        // Verificamos el límite de 100 mil
        if (montoCompra > 100000) {
            alert("Error: El total de la compra no puede exceder los $100,000.");
            return;
        }

        let d = montoCompra * 0.15;
        let pagoFinal = montoCompra - d;

        mostrar('res3', `
            <b>Total original:</b> $${montoCompra.toFixed(2)}<br>
            <b>Descuento aplicado (15%):</b> -$${d.toFixed(2)}<br>
            <b>Total final a pagar:</b> $${pagoFinal.toFixed(2)}
        `);
    }
}

       // 4. Calificación Final con límite de 0 a 10
function ejercicio4() {
    let p = document.getElementById('prom_parcial').value;
    let ef = document.getElementById('ex_final').value;
    let tf = document.getElementById('trab_final').value;

    if(validar(p) && validar(ef) && validar(tf)) {
        let notaP = parseFloat(p);
        let notaEF = parseFloat(ef);
        let notaTF = parseFloat(tf);

        // Verificamos que las notas estén entre 0 y 10
        if (notaP > 10 || notaEF > 10 || notaTF > 10) {
            alert("Error: Las calificaciones deben estar en el rango de 0 a 10.");
            return;
        }

        let final = (notaP * 0.55) + (notaEF * 0.30) + (notaTF * 0.15);
        mostrar('res4', `
            <b>Desglose de Calificación:</b><br>
            - 55% Parciales: ${(notaP * 0.55).toFixed(2)}<br>
            - 30% Examen: ${(notaEF * 0.30).toFixed(2)}<br>
            - 15% Trabajo: ${(notaTF * 0.15).toFixed(2)}<br>
            <b>Calificación Final: ${final.toFixed(2)}</b>
        `);
    }
}

// 5. Porcentajes con límite de 500 alumnos por grupo
function ejercicio5() {
    let cantH = document.getElementById('cant_h').value;
    let cantM = document.getElementById('cant_m').value;

    if(validar(cantH) && validar(cantM)) {
        let h = parseInt(cantH);
        let m = parseInt(cantM);

        // Verificamos el límite de 500 por cada uno
        if (h > 500 || m > 500) {
            alert("Error: La cantidad de hombres o mujeres no puede exceder los 500.");
            return;
        }

        let total = h + m;
        if (total === 0) {
            alert("Error: El total de alumnos no puede ser cero.");
            return;
        }

        let ph = (h / total) * 100;
        let pm = (m / total) * 100;

        mostrar('res5', `
            <b>Total de alumnos en el grupo:</b> ${total}<br>
            <b>Porcentaje de Hombres:</b> ${ph.toFixed(1)}%<br>
            <b>Porcentaje de Mujeres:</b> ${pm.toFixed(1)}%
        `);
    }
}

        // Llenar los selectores al cargar la página
window.onload = function() {
    const diaSel = document.getElementById('dia_nac');
    const anioSel = document.getElementById('anio_nac_select');
    const anioActual = new Date().getFullYear(); // 2026

    // Llenar días (1 a 31)
    for (let i = 1; i <= 31; i++) {
        let opt = document.createElement('option');
        opt.value = i; opt.text = i;
        diaSel.appendChild(opt);
    }

    // Llenar años (Desde el actual hasta 100 años atrás)
    for (let i = anioActual; i >= (anioActual - 100); i--) {
        let opt = document.createElement('option');
        opt.value = i; opt.text = i;
        anioSel.appendChild(opt);
    }
};

function ejercicio6() {
    const diaNac = parseInt(document.getElementById('dia_nac').value);
    const mesNac = parseInt(document.getElementById('mes_nac').value);
    const anioNac = parseInt(document.getElementById('anio_nac_select').value);

    // --- VALIDACIÓN DE FECHA REAL ---
    // Creamos una fecha con los datos seleccionados
    const pruebaFecha = new Date(anioNac, mesNac, diaNac);
    
    // Si el mes de la fecha resultante no es igual al mes que elegimos,
    // significa que JavaScript lo "corrigió" porque el día no existe en ese mes.
    if (pruebaFecha.getMonth() !== mesNac) {
        alert("¡Error! La fecha seleccionada es inválida (ej. 31 de febrero).");
        document.getElementById('res6').style.display = "none";
        return; // Detenemos la función aquí
    }
    // --------------------------------

    const fechaActual = new Date(); // Hoy es 25 de abril de 2026
    const diaHoy = fechaActual.getDate();
    const mesHoy = fechaActual.getMonth();
    const anioHoy = fechaActual.getFullYear();

    let edad = anioHoy - anioNac;

    // Ajuste por si aún no ha llegado su cumpleaños este año
    if (mesHoy < mesNac || (mesHoy === mesNac && diaHoy < diaNac)) {
        edad--;
    }

    mostrar('res6', `
        <b>Fecha de hoy:</b> ${diaHoy}/${mesHoy + 1}/${anioHoy}<br>
        <b>Tu edad actual es:</b> ${edad} años
    `);
}
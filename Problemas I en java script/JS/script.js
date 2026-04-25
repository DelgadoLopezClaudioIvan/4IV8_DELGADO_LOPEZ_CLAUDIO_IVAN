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

        // 1. Inversión
        function ejercicio1() {
            let c = document.getElementById('cap1').value;
            if(validar(c)) {
                let g = c * 0.02;
                mostrar('res1', `<b>Ganancia mensual:</b> $${g.toFixed(2)}<br><b>Total:</b> $${(parseFloat(c)+g).toFixed(2)}`);
            }
        }

        // 2. Comisiones
        function ejercicio2() {
            let sb = document.getElementById('s_base').value;
            let v1 = document.getElementById('v1').value;
            let v2 = document.getElementById('v2').value;
            let v3 = document.getElementById('v3').value;
            if(validar(sb) && validar(v1) && validar(v2) && validar(v3)) {
                let com = (parseFloat(v1) + parseFloat(v2) + parseFloat(v3)) * 0.10;
                mostrar('res2', `<b>Comisiones (10%):</b> $${com.toFixed(2)}<br><b>Total a recibir:</b> $${(parseFloat(sb)+com).toFixed(2)}`);
            }
        }

        // 3. Descuento
        function ejercicio3() {
            let t = document.getElementById('total_compra').value;
            if(validar(t)) {
                let d = t * 0.15;
                mostrar('res3', `<b>Ahorro:</b> $${d.toFixed(2)}<br><b>Total a pagar:</b> $${(t-d).toFixed(2)}`);
            }
        }

        // 4. Calificación Final
        function ejercicio4() {
            let p = document.getElementById('prom_parcial').value;
            let ef = document.getElementById('ex_final').value;
            let tf = document.getElementById('trab_final').value;
            if(validar(p) && validar(ef) && validar(tf)) {
                let final = (p * 0.55) + (ef * 0.30) + (tf * 0.15);
                mostrar('res4', `<b>Calificación Final:</b> ${final.toFixed(2)} pts`);
            }
        }

        // 5. Porcentajes
        function ejercicio5() {
            let h = parseInt(document.getElementById('cant_h').value);
            let m = parseInt(document.getElementById('cant_m').value);
            if(!isNaN(h) && !isNaN(m)) {
                let total = h + m;
                let ph = (h / total) * 100;
                let pm = (m / total) * 100;
                mostrar('res5', `<b>Total alumnos:</b> ${total}<br><b>Hombres:</b> ${ph.toFixed(1)}%<br><b>Mujeres:</b> ${pm.toFixed(1)}%`);
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
        <b>Estado de fecha:</b> Válida ✅<br>
        <b>Tu edad actual es:</b> ${edad} años
    `);
}

function problema1() {
    let texto = document.querySelector("#p1-input").value.trim();

    if (texto.length === 0) {
        document.querySelector("#p1-output").textContent = "Ingresa al menos una palabra.";
        return;
    }

    // separar por espacios, filtrar vacíos, invertir y unir
    let palabras = texto.split(" ").filter(p => p !== "");
    let invertidas = palabras.reverse().join(" ");

    document.querySelector("#p1-output").textContent = invertidas;
}

function problema2() {

    // obtener valores numéricos
    let v1 = [
        Number(document.querySelector("#p2-x1").value),
        Number(document.querySelector("#p2-x2").value),
        Number(document.querySelector("#p2-x3").value),
        Number(document.querySelector("#p2-x4").value),
        Number(document.querySelector("#p2-x5").value)
    ];

    let v2 = [
        Number(document.querySelector("#p2-y1").value),
        Number(document.querySelector("#p2-y2").value),
        Number(document.querySelector("#p2-y3").value),
        Number(document.querySelector("#p2-y4").value),
        Number(document.querySelector("#p2-y5").value)
    ];

    // validar que no haya vacíos
    if (v1.includes(NaN) || v2.includes(NaN)) {
        document.querySelector("#p2-output").textContent = "Todos los valores deben ser números.";
        return;
    }

    // ordenar v1 descendente y v2 ascendente (para mínimo producto escalar)
    v1.sort((a, b) => b - a);
    v2.sort((a, b) => a - b);

    // calcular producto escalar
    let producto = 0;
    for (let i = 0; i < v1.length; i++) {
        producto += v1[i] * v2[i];
    }

    document.querySelector("#p2-output").textContent =
        "El producto escalar mínimo es: " + producto;
}



function problema3() {
    let texto = document.querySelector("#p3-input").value.trim();

    if (texto.length === 0) {
        document.querySelector("#p3-output").textContent = "Ingresa palabras separadas por coma.";
        return;
    }

    // separar por comas
    let palabras = texto.split(",");

    // validar que no haya espacios ni caracteres inválidos
    for (let p of palabras) {
        if (!/^[A-Z]+$/.test(p)) {
            document.querySelector("#p3-output").textContent =
                "Solo se aceptan letras A-Z en mayúsculas y sin espacios.";
            return;
        }
    }

    let maxPalabra = "";
    let maxUnicos = 0;

    palabras.forEach(p => {
        let unicos = new Set(p.split("")).size;
        if (unicos > maxUnicos) {
            maxUnicos = unicos;
            maxPalabra = p;
        }
    });

    document.querySelector("#p3-output").textContent =
        "La palabra con más caracteres únicos es: " + maxPalabra +
        " (" + maxUnicos + " únicos)";
}

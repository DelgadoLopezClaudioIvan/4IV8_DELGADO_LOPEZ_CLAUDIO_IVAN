//vamos a hacer un viaje en el tiempo y ahora vamos a programar todo bajo el esquema ES6

/*
Para javascript ya conocemos el concepto de variable

var

Se sustituye por las nuevas variables:

let --> es una variable de tipo "protegida", ya que solo funciona dentro de un fragmento de codigo

const --> si es constante


let x = "x";
if(true){


    //console.log(x);

const x = "y";
console.log(x);
}



//para declarar en js las funciones hay una forma mas efectiva para declarar y a partir de una funcion flecha

//una funcion flecha en JS a diferencia de una funcion normal, no genera su propio contexto (this), necesita ser declarado antes de ser usada y no necesita un return

//funcion cosa(String hola) { String cosa; this.cosa = hola}

//vamos a hacer una funcion que sume 2 numeros
function sumarnumeros(n1, n2){
    return n1+n2;
}

const sumarDosNumeros = (n1,n2) => n1+n2;

console.log(`la suma de la funcion es: (2,3): ${sumarnumeros(2,3)} ` );
console.log(`la suma de la funcion es: (2,3): ${sumarDosNumeros(2,3)} ` );

//para armar una funcion flecha debemos entender su estructura:
// "cadena" (el tipo de variable, nombre de la funcion y los argumentos) => operacion
// 

*/

const razaDePerros = [
"Gran Danes",
"Doverman",
"Chihuahua",
"Pastor Aleman",
"Pitbull",
"San Bernardo",
"Xoloscuincle"
];

/*

for(let i = 0; 1 < razaDePerros.length; i++){
    console.log(razaDePerros[i]);

}

for(const raza of razaDePerros){
    console.log(raza);

}

for(const indice in razaDePerros){
    console.log(razaDePerros[indice]);
}
    forEach
    Iterar sobre elementos de arreglo que devuelven nada


razaDePerros.forEach(raza => console.log(raza));

Por ejemplo necesitamos una funcion para buscar la raza Chihuahua y si no existe agregarla


//funcion map esta funcion itera sobre los elementos del arreglo y regresa un arreglo diferente con el podemos hacer lo que queramos sun necesidad de modificar el arreglo original

const razasDeperrosEnMayusculas = razaDePerros.map((raza, Indice, arregloOriginal) => console.log(raza.toUpperCase()));

*/

if(razaDePerros.find(raza => raza === "Chihuahua")){
    console.log("La raza si se encontro y es Chihuahua");
    console.log(razaDePerros);
}else{
    razaDePerros.push("Chihuahua");
    console.log("se agrego Chihuahua al arreglo");
    console.log(razaDePerros);
}

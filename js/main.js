const diasDisponibles = ["jueves", "viernes", "sabado", "domingo"];
const precioPorPersona = 200;
const horariosDisponibles = ["21:00", "22:00", "23:00"];


function diaValido(dia){
    for (let i = 0; i < diasDisponibles.length; i++){
        if (diasDisponibles[i] === dia){
            return true;
        }
    }
    return false;
}

function horaDisponible(hora){
    return horariosDisponibles.includes(hora);
}

function calcularCostoTotal(numeroPersonas, tarifa){
    return numeroPersonas * tarifa;
}




function realizarReserva(){
    
    const nombre = prompt("¿Cual es tu nombre?");
    
    
    let personas = parseInt(prompt("¿Cuantas personas van a ser?"));
    while (isNaN(personas) || personas <= 0){
        personas = parseInt(prompt("Por favor, ingresa un numero valido de personas."));
    }

    let dia = prompt("¿Que dia queres hacer la reserva? (jueves, viernes, sabado, domingo)");
    while (!diaValido(dia)){
        dia = prompt("Ese dia no esta disponible. Por favor, elige entre jueves, viernes, sabado, domingo.");
    }

    let hora = prompt("¿A qué hora queres hacer la reserva? (21:00, 22:00, 23:00)");
    while (!horaDisponible(hora)){
        hora = prompt("Por favor, ingresa los horarios que tenemos disponibles: 21:00, 22:00, 23:00.");
    }

    const costoTotal = calcularCostoTotal(personas, precioPorPersona);
    
    alert("Reserva confirmada:\nNombre: " + nombre + "\nNumero de personas: " + personas + "\nDia: " + dia + "\nHora: " + hora + "\nCosto de reserva: $" + costoTotal);
}


realizarReserva();

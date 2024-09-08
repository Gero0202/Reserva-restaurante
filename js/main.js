const diasDisponibles = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"]
const precios = {
    "lunes": 150,
    "martes": 150,
    "miercoles": 150,
    "jueves": 180,
    "viernes": 200,
    "sabado": 220,
    "domingo": 250
}
const horariosDisponibles = ["20:00", "21:00", "22:00", "23:00"]


const diaValido = dia => diasDisponibles.includes(dia.toLowerCase())




const calcularCostoTotal = (numeroPersonas, tarifa) => numeroPersonas * tarifa


const guardarReservaEnLocalStorage = reserva => {
    let reservas = JSON.parse(localStorage.getItem("reservas")) || []
    reservas.push(reserva)
    localStorage.setItem("reservas", JSON.stringify(reservas))
}


const mostrarReservaConfirmada = reserva => {
    const contenedor = document.getElementById("reserva-confirmada")
    contenedor.innerHTML = `
        <h3>Reserva confirmada:</h3>
        <p>Nombre: ${reserva.nombre}</p>
        <p>Numero de personas: ${reserva.personas}</p>
        <p>Dia: ${reserva.dia}</p>
        <p>Hora: ${reserva.hora}</p>
        <p>Costo de reserva: $${reserva.costoTotal}</p>
    `
}




const formulario = document.getElementById("reserva-form")
const inputDia = document.getElementById("dia")
const errorDia = document.getElementById("error-dia")


formulario.addEventListener("submit", event => {
    event.preventDefault()

     
    document.getElementById("mensaje-error").textContent = ""
    errorDia.textContent = ""
    inputDia.classList.remove("input-error")
    

    const nombre = document.getElementById("nombre").value
    const personas = parseInt(document.getElementById("personas").value, 10)
    const dia = document.getElementById("dia").value.toLowerCase()
    const hora = document.querySelector("input[name='horario']:checked")?.value

    if (!diaValido(dia)) {
        errorDia.textContent = "El dia seleccionado no es valido."
        inputDia.classList.add("input-error")

        
        return
    }


    const tarifa = precios[dia]
    const costoTotal = calcularCostoTotal(personas, tarifa)

    const reserva = { nombre, personas, dia, hora, costoTotal }
    guardarReservaEnLocalStorage(reserva)
    mostrarReservaConfirmada(reserva)
})
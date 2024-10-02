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


const obtenerTarifa = dia => {
   const diaLower = dia.toLowerCase()
    return precios[diaLower] || 0
}


const obtenerNombreDia = fecha => {
    const dias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"]
    const fechaObj = new Date(fecha)
    return dias[fechaObj.getDay()]
}




const actualizarTarifaDia = (inputId, tarifaContenedorId) => {
    const fecha = document.getElementById(inputId).value
    
    if (fecha === ""){
        return
    }

    const dia = obtenerNombreDia(fecha)
    const tarifa = obtenerTarifa(dia)
    const tarifaContenedor = document.getElementById(tarifaContenedorId)
    tarifaContenedor.textContent = `Tarifa por persona: $${tarifa}`
}




const guardarReservaEnLocalStorage = reserva => {
    let reservas = JSON.parse(localStorage.getItem("reservas")) || []
    reservas.push(reserva)
    localStorage.setItem("reservas", JSON.stringify(reservas))
    renderizarReservas()
}




const mostrarReservaConfirmada = reserva => {
    const contenedor = document.getElementById("reserva-confirmada")
    contenedor.innerHTML = `<h3>Reserva confirmada:</h3>
                            <p>Nombre: ${reserva.nombre}</p>
                            <p>Numero de personas: ${reserva.personas}</p>
                            <p>Dia: ${reserva.dia}</p>
                            <p>Hora: ${reserva.hora}</p>
                            <p>Costo de reserva: $${reserva.costoTotal}</p>`
}




const manana = new Date()
manana.setDate(manana.getDate() + 1)
const mananaStr = manana.toISOString().split("T")[0]
document.getElementById("dia").setAttribute("min", mananaStr)

    

document.getElementById("dia").addEventListener("change", () => actualizarTarifaDia("dia", "tarifa-dia"))





document.getElementById("reserva-form").addEventListener("submit", event => {
    event.preventDefault()

    let reservaCompletada = false 
    

    try{ 
    document.getElementById("mensaje-error").textContent = ""
    document.getElementById("error-dia").textContent = ""
    document.getElementById("dia").classList.remove("input-error")

    const nombre = document.getElementById("nombre").value
    const personas = parseInt(document.getElementById("personas").value, 10)
    const fecha = document.getElementById("dia").value
    const dia = obtenerNombreDia(fecha)
    const horaSeleccionada = document.querySelector("input[name='horario']:checked")
    let hora = null

    if (horaSeleccionada){
       hora = horaSeleccionada.value
    }

    
    if ( fecha === null || fecha === undefined || fecha === ""){
        document.getElementById("error-dia").textContent = "Debe seleccionar una fecha"
        document.getElementById("dia").classList.add("input-error")
        return
    }

    if (diaValido(dia) === false) {
        document.getElementById("error-dia").textContent = "El dia seleccionado no es valido"
        document.getElementById("dia").classList.add("input-error")
        return
    }

    if (horaSeleccionada === null || horaSeleccionada === undefined) {
        document.getElementById("mensaje-error").textContent = "Debe seleccionar una hora"
        return
    }

    const tarifa = obtenerTarifa(dia)
    const costoTotal = calcularCostoTotal(personas, tarifa)

    const reserva = { nombre, personas, dia, hora, costoTotal }
    guardarReservaEnLocalStorage(reserva)
    mostrarReservaConfirmada(reserva)

    Swal.fire({
        title: "Reserva confirmada",
        text: "(Si la reserva tiene errores, puede editarlos en la seccion inferior)",
        icon: "success"
      });

      reservaCompletada = true

    } catch (err){
        document.getElementById("error-guardado-reserva").textContent = "Error al guardar la reserva"
    } finally {
        if (reservaCompletada) {
            document.getElementById("reserva-enviada").textContent = "Reserva enviada"
        }
    }
     
 })




let comentarios = document.getElementById("caja-comentarios")

fetch("https://jsonplaceholder.typicode.com/comments")
.then(response => response.json())
.then(data => {
    data.forEach(comment =>{
        const caja = document.createElement("div")
        caja.innerHTML = `<p>Nombre: ${comment.name}</p>
                          <p>Email: ${comment.email}</p>
                          <p>Comentario: ${comment.body}</p> `
        comentarios.appendChild(caja)                  
    })
})




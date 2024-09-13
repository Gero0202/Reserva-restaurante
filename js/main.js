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
    if (!fecha) return

    const dia = obtenerNombreDia(fecha)
    const tarifa = precios[dia] || 0
    const tarifaContenedor = document.getElementById(tarifaContenedorId)
    tarifaContenedor.textContent = `Tarifa por persona: $${tarifa}`
}




const mostrarFormularioEdicion = reserva => {
    
    
    const formEdicion = document.getElementById("form-edicion")
    formEdicion.classList.remove("oculto")
    formEdicion.classList.add("visible")

    document.getElementById("edit-nombre").value = reserva.nombre
    document.getElementById("edit-personas").value = reserva.personas
    document.getElementById("edit-dia").value = reserva.dia
    document.querySelector(`input[name='edit-horario'][value='${reserva.hora}']`).checked = true

    actualizarTarifaDia("edit-dia", "edit-tarifa-dia")
}


const ocultarFormularioEdicion = () => {
    
    const formEdicion = document.getElementById("form-edicion")
    formEdicion.classList.remove("visible")
    formEdicion.classList.add("oculto")
}


const guardarReservaEnLocalStorage = reserva => {
    let reservas = JSON.parse(localStorage.getItem("reservas")) || []
    reservas.push(reserva)
    localStorage.setItem("reservas", JSON.stringify(reservas))
    renderizarReservas()
}


const actualizarReservaEnLocalStorage = (index, reservaEditada) => {
    let reservas = JSON.parse(localStorage.getItem("reservas")) || []
    reservas[index] = reservaEditada
    localStorage.setItem("reservas", JSON.stringify(reservas))
    renderizarReservas()
}


const eliminarReserva = index => {
    let reservas = JSON.parse(localStorage.getItem("reservas")) || []
    reservas.splice(index, 1)
    localStorage.setItem("reservas", JSON.stringify(reservas))
    renderizarReservas()
}


const vaciarReservas = () => {
    localStorage.removeItem("reservas")
    renderizarReservas()
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


const renderizarReservas = () => {
    const reservasLista = document.getElementById("reservas-lista")
    reservasLista.innerHTML = ""
    const reservas = JSON.parse(localStorage.getItem("reservas")) || []
    
    reservas.forEach((reserva, index) => {
        const reservaDiv = document.createElement("div")
        reservaDiv.innerHTML = `
            <div>
                <p>Nombre: ${reserva.nombre}</p>
                <p>Numero de personas: ${reserva.personas}</p>
                <p>Dia: ${reserva.dia}</p>
                <p>Hora: ${reserva.hora}</p>
                <p>Costo de reserva: $${reserva.costoTotal}</p>
                <button onclick="editarReserva(${index})">Editar</button>
                <button onclick="eliminarReserva(${index})">Eliminar</button>
            </div>
        `
        reservasLista.appendChild(reservaDiv)
    })
}


const editarReserva = index => {
    const reservas = JSON.parse(localStorage.getItem("reservas")) || []
    const reserva = reservas[index]
    mostrarFormularioEdicion(reserva)
    document.getElementById("form-edicion").dataset.index = index
}


const guardarEdicion = () => {
    const nombre = document.getElementById("edit-nombre").value
    const personas = parseInt(document.getElementById("edit-personas").value, 10)
    const fecha = document.getElementById("edit-dia").value
    const hora = document.querySelector("input[name='edit-horario']:checked")?.value
    const dia = obtenerNombreDia(fecha)
    

    document.querySelectorAll("#form-edicion .error").forEach(el => el.textContent = "")

    let error = false

    if (!nombre) {
        document.getElementById("edit-error-nombre").textContent = "Debe ingresar un nombre"
        error = true
    }

    if (isNaN(personas) || personas < 2 || personas > 9) {
        document.getElementById("edit-error-personas").textContent = "El numero de personas debe estar entre 2 y 9"
        error = true
    }

    if (!fecha) {
        document.getElementById("edit-error-dia").textContent = "Debe seleccionar una fecha"
        error = true
    } else if (!diaValido(dia)) {
        document.getElementById("edit-error-dia").textContent = "El dia seleccionado no es valido"
        error = true
    }

    if (!hora || !horariosDisponibles.includes(hora)) {   
        document.getElementById("edit-error-hora").textContent = "La hora seleccionada no es valida"
        error = true
    }

    if (error) return

    const tarifa = obtenerTarifa(dia)
    const costoTotal = calcularCostoTotal(personas, tarifa)

    const reservaEditada = { nombre, personas, dia, hora, costoTotal }
    const index = document.getElementById("form-edicion").dataset.index
    actualizarReservaEnLocalStorage(index, reservaEditada)
    ocultarFormularioEdicion()
}


document.addEventListener("DOMContentLoaded", () => {
    const manana = new Date()
    manana.setDate(manana.getDate() + 1)
    const mananaStr = manana.toISOString().split("T")[0]
    document.getElementById("dia").setAttribute("min", mananaStr)

    
    document.getElementById("edit-dia").setAttribute("min", mananaStr)

   

    document.getElementById("dia").addEventListener("change", () => actualizarTarifaDia("dia", "tarifa-dia"))
    document.getElementById("edit-dia").addEventListener("change", () => actualizarTarifaDia("edit-dia", "edit-tarifa-dia")) 
    renderizarReservas()
})


document.getElementById("reserva-form").addEventListener("submit", event => {
    event.preventDefault()

    document.getElementById("mensaje-error").textContent = ""
    document.getElementById("error-dia").textContent = ""
    document.getElementById("dia").classList.remove("input-error")

    const nombre = document.getElementById("nombre").value
    const personas = parseInt(document.getElementById("personas").value, 10)
    const fecha = document.getElementById("dia").value
    const dia = obtenerNombreDia(fecha)
    const hora = document.querySelector("input[name='horario']:checked")?.value

    if (!fecha) {
        document.getElementById("error-dia").textContent = "Debe seleccionar una fecha"
        document.getElementById("dia").classList.add("input-error")
        return
    }

    if (!diaValido(dia)) {
        document.getElementById("error-dia").textContent = "El dia seleccionado no es valido"
        document.getElementById("dia").classList.add("input-error")
        return
    }

    if (!hora) {
        document.getElementById("mensaje-error").textContent = "Debe seleccionar una hora"
        return
    }

    const tarifa = obtenerTarifa(dia)
    const costoTotal = calcularCostoTotal(personas, tarifa)

    const reserva = { nombre, personas, dia, hora, costoTotal }
    guardarReservaEnLocalStorage(reserva)
    mostrarReservaConfirmada(reserva)
})


document.getElementById("guardar-edicion").addEventListener("click", guardarEdicion)
document.getElementById("cancelar-edicion").addEventListener("click", ocultarFormularioEdicion)
document.getElementById("vaciar-reservas").addEventListener("click", vaciarReservas)


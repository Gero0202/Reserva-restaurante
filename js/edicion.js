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

const renderizarReservas = () => {
    const reservasLista = document.getElementById("reservas-lista")
    reservasLista.innerHTML = ""
    const reservas = JSON.parse(localStorage.getItem("reservas")) || []
    
    reservas.forEach((reserva, index) => {
        const reservaDiv = document.createElement("div")
        reservaDiv.innerHTML = `<div>
                                <p>Nombre: ${reserva.nombre}</p>
                                <p>Numero de personas: ${reserva.personas}</p>
                                <p>Dia: ${reserva.dia}</p>
                                <p>Hora: ${reserva.hora}</p>
                                <p>Costo de reserva: $${reserva.costoTotal}</p>
                                <button onclick="editarReserva(${index})">Editar</button>
                                <button onclick="eliminarReserva(${index})">Eliminar</button>
                                </div>`
        reservasLista.appendChild(reservaDiv)
    })
}

let indexDeReserva = null

const editarReserva = index => {
    const reservas = JSON.parse(localStorage.getItem("reservas")) || []
    const reserva = reservas[index]

    
    mostrarFormularioEdicion(reserva)
    indexDeReserva = index 
    
}

const guardarEdicion = () => {
    
    document.querySelectorAll("#form-edicion .error").forEach(el => el.textContent = "")

    

    try{
    const nombre = document.getElementById("edit-nombre").value
    const personas = parseInt(document.getElementById("edit-personas").value, 10)
    const fecha = document.getElementById("edit-dia").value
    const seleccionHora = document.querySelector("input[name='edit-horario']:checked")
    let hora = null
    if (seleccionHora !== null){
        hora = seleccionHora.value
    }
    
    const dia = obtenerNombreDia(fecha)
    

    document.querySelectorAll("#form-edicion .error").forEach(el => el.textContent = "")

    let error = false

    if (nombre === null || nombre === undefined || nombre === "") {
        document.getElementById("edit-error-nombre").textContent = "Debe ingresar un nombre"
        error = true
    }

    if (isNaN(personas) || personas < 2 || personas > 9) {
        document.getElementById("edit-error-personas").textContent = "El numero de personas debe estar entre 2 y 9"
        error = true
    }

    if (fecha == null || fecha === "") {
        document.getElementById("edit-error-dia").textContent = "Debe seleccionar una fecha"
        error = true
    } else if (diaValido(dia) === false) {
        document.getElementById("edit-error-dia").textContent = "El dia seleccionado no es valido"
        error = true
    }

    
    if (hora && horariosDisponibles.includes === false){
        document.getElementById("edit-error-hora").textContent = "La hora seleccionada no es valida"
        error = true
    }
     
    if (error) {
        return
    }


    const tarifa = obtenerTarifa(dia)
    const costoTotal = calcularCostoTotal(personas, tarifa)

    const reservaEditada = { nombre, personas, dia, hora, costoTotal }
    
    actualizarReservaEnLocalStorage(indexDeReserva, reservaEditada)
    mostrarReservaConfirmada(reservaEditada)
    ocultarFormularioEdicion()
    
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Reserva editada con exito",
        showConfirmButton: false,
        timer: 1500
      });
    

    } catch(err){
        const errorEdicion = document.getElementById("error-edit-reserva")
        errorEdicion.textContent = "Error al editar la reserva. Vuelva a intentarlo" 
    } 
        
    
}

document.getElementById("edit-dia").setAttribute("min", mananaStr)
document.getElementById("edit-dia").addEventListener("change", () => actualizarTarifaDia("edit-dia", "edit-tarifa-dia")) 
renderizarReservas()

document.getElementById("guardar-edicion").addEventListener("click", guardarEdicion)
document.getElementById("cancelar-edicion").addEventListener("click", ocultarFormularioEdicion)
document.getElementById("vaciar-reservas").addEventListener("click", vaciarReservas)


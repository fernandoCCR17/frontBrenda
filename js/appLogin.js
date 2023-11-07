document.addEventListener("DOMContentLoaded", iniciarApp);

function iniciarApp(){
    const formInicioSesion = document.querySelector("#formLogin")
    const formRegistro = document.querySelector("#formSignup")

    formInicioSesion.addEventListener("submit", handleForm);
    formRegistro.addEventListener("submit", handleForm);
    
    async function handleForm(e){
        e.preventDefault();
        limpiaHTML()
        let errores = 0;
        const inputs = document.querySelectorAll(`#${e.target.id} input`)
        const inputContainer = document.querySelector(`#${e.target.id} #inputContainer`)
        const contenedorMensajes = inputContainer.querySelector("#inputMensajes")
        const inputSubmit = inputContainer.querySelector(`.inputSubmit`)
        inputSubmit.disabled = true;

        inputs.forEach(input => errores+=validaForm(input))

        if(errores > 0){
            inputSubmit.disabled = false;
            return
        }
        const datos = {}

        inputs.forEach(input => {
            datos[input.name] = !isNaN(+input.value.trim()) && input.value.trim() !== "" ? +input.value.trim() : input.value.trim()
        })

        inputSubmit.classList.add("form__input--ocultar")
        const spinner = creaSpinner()
        inputContainer.appendChild(spinner)
        
        mensaje = e.target.id === "formLogin" ? "iniciar sesión" : "registrarse";
        const tipo = mensaje === "registrarse" ? "registro" : "inicio_sesion";
        const respuesta = await enviaPeticion(datos, tipo);

        if(respuesta.token){
            localStorage.setItem("token",respuesta.token)
        }

        inputSubmit.disabled = false;
        inputSubmit.classList.remove("form__input--ocultar")
        spinner.remove();
        
        if(Object.keys(respuesta).includes("errores")){
            muestraMensaje(contenedorMensajes, `Ocurrió un error al momento de ${mensaje}`)
        }else{
            muestraMensaje(contenedorMensajes, `${mensaje === "registrarse" ? "Registro" : "Inicio de sesión"} exitoso`, true)
            e.target.reset();
            if(mensaje === "iniciar sesión"){
                window.location.href = "http://127.0.0.1:5500"
            }
        }

    }

    function validaForm(input){
        if(input.value.trim() === ""){
            muestraMensaje(input.parentElement, `El ${input.name} no puede ir vacío`);
            return 1;
        }
        
        if(input.name === "correo" && !/[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}/.test(input.value.trim())){
            muestraMensaje(input.parentElement, `Introduzca un ${input.name} valido`);
            return 1;
        }
        
        if(input.name === "telefono" && !/^\d{10}$/.test(input.value.trim())){
            muestraMensaje(input.parentElement, `Introduzca un ${input.name} valido`);
            return 1;
        }

        return 0;
    }

    function muestraMensaje(referencia, mensaje, tipo = false){
        const parrafoMensaje = document.createElement("P")
        parrafoMensaje.textContent = mensaje
        parrafoMensaje.classList.add(`mensaje${tipo ? "Exito" : "Error"}`)
        referencia.appendChild(parrafoMensaje)

        setTimeout(() => {
            parrafoMensaje.remove()
        }, 3000);
    }

    function limpiaHTML(){
        const mensajesError = document.querySelectorAll(".mensajeError");
        const mensajeExito = document.querySelector(".mensajeExito");

        if(mensajesError){
            mensajesError.forEach(mensaje => mensaje.remove());
        }

        if(mensajeExito){
            mensajeExito.remove()
        }
    }

    async function enviaPeticion(datos, tipo){
        console.log(datos)
        try{
            const resultado = await fetch(`http://localhost:3000/auth/${tipo}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            })
            const respuesta = await resultado.json()
            return respuesta
        }catch(error){
            console.log(error)
            return error
        }
    }

    function creaSpinner(){
        const divContainer = document.createElement("DIV");
        divContainer.classList.add("sk-folding-cube")

        for (let index = 0; index < 4; index++) {
            const element = document.createElement("DIV");
            if(index === 2){
                element.classList.add(`sk-cube4`, "sk-cube")
            }else if(index === 3){
                element.classList.add(`sk-cube3`, "sk-cube")
            }else{
                element.classList.add(`sk-cube${index+1}`, "sk-cube")
            }
            divContainer.appendChild(element)
        }

        return divContainer
    }
}


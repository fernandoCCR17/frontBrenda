let estaLogueado = false, cliente; //variable que nos permite verificar si un usuario esta logueado y otra para almacenar los datos del usuario 
(async function(){
    try {
        //hacemos un fetch a la url para traer los datos del usuario y si este logueado
        const respuesta = await fetch(`http://34.16.180.179/app/auth/datos_usuario/${localStorage.getItem("token") || "singup"}`, {
            method: "GET", // El método de la solicitud (puede ser GET, POST, etc.)
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token") || "singup"}` // Agrega el token en el encabezado Authorization
            }
          });
        if (!respuesta.ok) {
            throw new Error("Error al cargar los datos");
        }
        const resultado = await respuesta.json();//transformamos el respuesta en un objeto tipo json
        estaLogueado = resultado.logueado;
        cliente = resultado.cliente;
    } catch (error) {
        if(localStorage.getItem("token")){
            localStorage.removeItem("token");
        }
        const form = document.querySelector("#form");//selecciono el form 
        const containerReservacion = document.querySelector("#reservacion"); //obtengo la referencia del contenedor donde alamaceno el form y la img
        const imgReservacion = document.querySelector(".reservacion__imgContainer"); //obtengo la referencia del contenedor de la img

        form.remove()//elimino el form ya que aún no inicia sesión el usuario
        const divContainer = document.createElement("DIV");//creo una etiqueta div
        const h2 = document.createElement("H2");//creo una etiqueta h2
        const p = document.createElement("P");//creo una etiqueta p
        const enlace = document.createElement("A");//creo una etiqueta a
        h2.textContent = "Usted aún no inicia sesión";//agrego el texto que mostrará el h2
        p.textContent = "Inicie sesión para reservar";//agrego el texto que mostrará el p
        enlace.textContent = "INICIAR SESIÓN";//agrego el texto que mostrará el a
        enlace.href = "/login.html";//agrego la ruta a la que redireccionara cuando presionen el enlace
        
        divContainer.appendChild(h2);//agrego al div que creamos el h2
        divContainer.appendChild(p);//agrego al div que creamos el p
        divContainer.appendChild(enlace);//agrego al div que creamos el a
        divContainer.classList.add("contendorUsuarioLogin")//agrego el div que creamos la clase "contenedorUsuarioLogin"
        
        //la estructura que esto nos genera es la siguiente
        // <div class="contendorUsuarioLogin">
        //     <h2>Usted aún no inicia sesión</h2>
        //     <p>Inicie sesión para reservar</p>
        //     <a href="/login.html">INICIAR SESIÓN</a>
        // </div>
        containerReservacion.insertBefore(divContainer, imgReservacion)//agregamos la estructura que creamos antes del contenedor de la imagen
    }
    iniciarApp();
})();//IIFE


const referenciaMensaje = {
    "mesas": "La mesa",
    "fecha": "La fecha",
    "nPersonas": "El numero de personas",
    "preferencias": "Las preferencias",
    "comentarios": "El comentario",
}

function iniciarApp(){
    const botonMenu = document.querySelector(".button__menu");
    const botonNavegacion = document.querySelector(".nav__button");
    const enlaces = document.querySelectorAll(".navegacion__enlace");
    const form = document.querySelector("#form");
    
    
    botonMenu.addEventListener("click", handleMenu);
    botonNavegacion.addEventListener("click", handleMenu);
    enlaces.forEach(e => e.addEventListener("click", handleMenu))

    if(form){
        form.addEventListener("submit", handleForm)
    }

    function handleMenu(){
        const navegacion = document.querySelector(".nav")

        if(!navegacion.classList.contains("activo")){
            if(navegacion.classList.contains("inactivo")){
                navegacion.classList.remove("inactivo")
            }
            navegacion.classList.add("activo")
        }else{
            if(navegacion.classList.contains("activo")){
                navegacion.classList.remove("activo")
            }
            navegacion.classList.add("inactivo")
        }
    }

    async function handleForm(e){
        e.preventDefault();

        const inputMesas = document.querySelector("#mesas");
        const inputFecha = document.querySelector("#fecha");
        const inputPersonas = document.querySelector("#nPersonas");
        const inputPreferencias = document.querySelector("#preferencias");
        const inputComentarios = document.querySelector("#comentarios");
        const inputContainer = document.querySelector("#inputContainer")
        const contenedorMensajes = inputContainer.querySelector("#inputMensajes")
        const inputSubmit = inputContainer.querySelector("#inputSubmit")
        inputSubmit.disabled = true;

        limpiaHTML();
        let errores = 0;
        const arregloInputs = [inputMesas, inputFecha, inputPersonas, inputPreferencias, inputComentarios]
        arregloInputs.forEach(input => {errores += validaForm(input)})

        if(errores > 0){
            inputSubmit.disabled = false;
            return;
        }

        const datos = {}

        arregloInputs.forEach(input => {
            datos[input.name] = !isNaN(+input.value.trim()) && input.value.trim() !== "" ? +input.value.trim() : input.value.trim()
        })
        datos["ClienteID"] = cliente.ClienteID
        inputSubmit.classList.add("form__input--ocultar")
        const spinner = creaSpinner()
        inputContainer.appendChild(spinner)
        
        const respuesta = await enviaPeticion(datos)
        
        inputSubmit.disabled = false;
        inputSubmit.classList.remove("form__input--ocultar")
        spinner.remove();
        if(Object.keys(respuesta).includes("errores")){
            muestraMensaje(contenedorMensajes, "Ocurrió un error al momento de reservar")
        }else{
            muestraMensaje(contenedorMensajes, `Reservación exitosa`, true)
            form.reset();
        }

    }

    function validaForm(input){
        let errores = 0;
        if((input.id === "mesas" || input.id === "fecha" || input.id === "nPersonas") && input.value.trim() === ""){
            muestraMensaje(input.parentElement, `${referenciaMensaje[input.id]} no puede ir vacío`)
            errores++;
        }
        
        if(input.id === "nPersonas" && (+input.value.trim() < 1 || +input.value.trim() > 10) && input.value.trim() != ""){
            muestraMensaje(input.parentElement, `${referenciaMensaje[input.id]} debe ser mayor o igual a 1 y menor o igual 10`)
            errores++;
        }

        return errores;
    }

    function muestraMensaje(referencia, mensaje, tipo = "error"){
        const parrafoMensaje = document.createElement("P");
        parrafoMensaje.textContent = mensaje;
        if(tipo === "error"){
            parrafoMensaje.classList.add("form__mensaje--error")
        }else{
            parrafoMensaje.classList.add("form__mensaje--exito")
        }
        referencia.appendChild(parrafoMensaje)

        setTimeout(() => {
            parrafoMensaje.remove()
        }, 3000);
    }

    function limpiaHTML(){
        const mensajesError = document.querySelectorAll(".form__mensaje--error");
        const mensajeExito = document.querySelector(".form__mensaje--exito");
        if(mensajesError){
            mensajesError.forEach(e => e.remove())
        }
        if(mensajeExito){
            mensajesError.remove();
        }
    }

    async function enviaPeticion(datos){
        try{
            const resultado = await fetch("http://34.16.180.179/app/auth/crearReserva", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            })
            const respuesta = await resultado.json()
            return respuesta
        }catch(error){
            return {}
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
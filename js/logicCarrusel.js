let imagenes = [
    [
        {
            "url": "images/alas",
            "alt": "imagen alas"
    
        },{
            "url": "images/Hamburguesa",
            "alt": "imagen hamburguesa"
        },{
            "url": "images/costillas",
            "alt": "imagen costillas"
    
        },
        {
            "titulo": "Comidas"
        }
    ],
    [
        {
            "url": "images/margarita",
            "alt": "imagen margarita"
    
        },{
            "url": "images/splash",
            "alt": "imagen splash"
    
        },
        {
            "url": "images/fresa",
            "alt": "imagen fresa"
        },{
            "titulo": "Bebidas"
        }
    ],
]


let atras = document.getElementById('atras');
let adelante = document.getElementById('adelante');
let imagen1 = document.getElementById('img1');
let imagen2 = document.getElementById('img2');
let imagen3 = document.getElementById('img3');
let puntos = document.getElementById('puntos');
let texto = document.getElementById('texto')
let actual = 0
posicionCarrusel()

atras.addEventListener('click', function(){
    actual -=1

    if (actual == -1){
        actual = imagenes.length - 1
    }

    imagen1.innerHTML = `<picture>
                            <source srcset="${imagenes[actual][0].url}.webp" type="image/webp">
                            <img loading="lazy" class="img" src="${imagenes[actual][0].url}.jpeg" alt="${imagenes[actual][0].alt}" width="341.05" height="314.77">
                        </picture>`
    imagen2.innerHTML = `<picture>
                            <source srcset="${imagenes[actual][1].url}.webp" type="image/webp">
                            <img loading="lazy" class="img" src="${imagenes[actual][1].url}.jpeg" alt="${imagenes[actual][1].alt}" width="341.05" height="314.77">
                        </picture>`
    imagen3.innerHTML = `<picture>
                            <source srcset="${imagenes[actual][2].url}.webp" type="image/webp">
                            <img loading="lazy" class="img" src="${imagenes[actual][2].url}.jpeg" alt="${imagenes[actual][2].alt}" width="341.05" height="314.77">
                        </picture>`

    texto.innerHTML = `<h3>${imagenes[actual][3].titulo}</h3>`
    posicionCarrusel()
})  

adelante.addEventListener('click', function(){
    actual +=1

    if (actual == imagenes.length){
        actual = 0
    }

    imagen1.innerHTML = `<picture>
                            <source srcset="${imagenes[actual][0].url}.webp" type="image/webp">
                            <img loading="lazy" class="img" src="${imagenes[actual][0].url}.jpeg" alt="${imagenes[actual][0].alt}" width="341.05" height="314.77">
                        </picture>`
    imagen2.innerHTML = `<picture>
                            <source srcset="${imagenes[actual][1].url}.webp" type="image/webp">
                            <img loading="lazy" class="img" src="${imagenes[actual][1].url}.jpeg" alt="${imagenes[actual][1].alt}" width="341.05" height="314.77">
                        </picture>`
    imagen3.innerHTML = `<picture>
                            <source srcset="${imagenes[actual][2].url}.webp" type="image/webp">
                            <img loading="lazy" class="img" src="${imagenes[actual][2].url}.jpeg" alt="${imagenes[actual][2].alt}" width="341.05" height="314.77">
                        </picture>`

    texto.innerHTML = `<h3>${imagenes[actual][3].titulo}</h3>`

    texto.innerHTML = `<h3>${imagenes[actual][3].titulo}</h3>`
    posicionCarrusel()
})  

function posicionCarrusel() {
    puntos.innerHTML = ""
    for (var i = 0; i <imagenes.length; i++){
        if(i == actual){
            puntos.innerHTML += '<p class="bold">.<p>'
        }
        else{
            puntos.innerHTML += '<p>.<p>'
        }
    } 
}
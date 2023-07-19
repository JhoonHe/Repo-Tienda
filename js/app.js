let fragment = document.createDocumentFragment();

let cardProductos = document.querySelector(".productos");
let cardCarritoContent = document.querySelector(".carrito-content");
let cardCarritoMessage = document.querySelector(".carrito-message");
let cardCarritoButtons = document.querySelector(".carrito-buttons");
let cardCarritoValores = document.querySelector(".carrito-valores");

let divCarrito = document.querySelector(".carrito");
divCarrito.style.display = "none"

let btnCerrar = document.getElementById("btn-carrito-cerrar")
btnCerrar.style.display = "none";

let btnAbrir = document.getElementById("btn-carrito");
btnAbrir.style.display = "flex";

let template_productos = document.getElementById("template_productos").content;
let templateCarrito = document.getElementById("template_carrito").content;

// console.log(templateCarrito);

let carrito = {};

fetchData = async () => {
    let res = await fetch("../json/productos.json");
    let data = await res.json();

    llenarDatos(data);
};

// document.addEventListener('DOMContentLoaded', () => {

//     fetchData();

//     const carritoStorage = localStorage.getItem('carrito');
//     if (carritoStorage !== null || carritoStorage != undefined) {
//         carrito = JSON.parse(carritoStorage);
//         pintarCarrito();
//     }
// });

document.addEventListener('DOMContentLoaded', () => {
    fetchData();

    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'));
        pintarCarrito();
    }
});

function llenarDatos(data) {

    Object.values(data).forEach((element) => {

        let clon = template_productos.cloneNode(true);

        clon.querySelector("#nombre").textContent = element.Nombre;
        clon.querySelector("#precio").textContent = element.Precio;
        clon.querySelector("img").setAttribute("src", element.Url);

        clon.querySelector(".comprar").addEventListener("click", () => {
            let nombreProducto = element.Nombre;

            let productoEnCarrito = carrito[nombreProducto];

            // console.log(carrito[nombreProducto]);

            if (productoEnCarrito) {
                aumentar(productoEnCarrito);
            } else {
                carrito[nombreProducto] = {
                    Nombre: nombreProducto,
                    Cantidad: 1,
                    Url: element.Url,
                    Precio: element.Precio
                };
            }

            pintarCarrito(carrito);

            // console.log("Carrito actual:", carrito);
        });

        fragment.appendChild(clon);
    });

    cardProductos.appendChild(fragment);

    pintarCarrito(carrito);
}

// console.log("a", Object.values(carrito));

function pintarCarrito(carrito) {

    cardCarritoContent.innerHTML = "";
    cardCarritoMessage.style.display = "none";
    cardCarritoButtons.style.display = "flex";
    cardCarritoValores.style.display = "flex";

    let totalCantidad = 0;
    let totalPrecio = 0;

    if (carrito && Object.keys(carrito).length > 0) {

        Object.values(carrito).forEach((element) => {

            let clon = templateCarrito.cloneNode(true);

            clon.querySelector("#nombre").textContent = element.Nombre;
            clon.querySelector("#cantidad").textContent = element.Cantidad;
            clon.querySelector("img").setAttribute("src", element.Url);

            clon.querySelector("#aumentar").addEventListener("click", () => {
                let nombreProducto = element.Nombre;
                let productoEnCarrito = carrito[nombreProducto];

                if (productoEnCarrito) {
                    aumentar(productoEnCarrito);
                }

                pintarCarrito(carrito);
            });

            clon.querySelector("#decrementar").addEventListener("click", () => {

                let nombreProducto = element.Nombre;
                let productoEnCarrito = carrito[nombreProducto];

                if (productoEnCarrito && productoEnCarrito.Cantidad > 0) {
                    decrementar(productoEnCarrito);
                }

                pintarCarrito(carrito);
            });

            totalCantidad += element.Cantidad;
            totalPrecio += element.Cantidad * element.Precio;

            fragment.appendChild(clon);
        });

        document.getElementById("cantidad").textContent = totalCantidad;
        document.getElementById("total").textContent = totalPrecio;

        cardCarritoContent.appendChild(fragment);
    } else {
        cardCarritoMessage.style.display = "block";
        cardCarritoButtons.style.display = "none";
        cardCarritoValores.style.display = "none";
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function aumentar(productoEnCarrito) {
    productoEnCarrito.Cantidad += 1;
    // console.log("Se agregó cantidad al producto:", productoEnCarrito);
}

function decrementar(productoEnCarrito) {
    productoEnCarrito.Cantidad -= 1;

    if (productoEnCarrito.Cantidad === 0) {
        delete carrito[productoEnCarrito.Nombre];
    }

    // console.log("Se agregó cantidad al producto:", productoEnCarrito);
}

document
    .getElementById("reiniciar")
    .addEventListener("click", reiniciarCarrito);

function reiniciarCarrito() {

    carrito = {};

    pintarCarrito(carrito);
    // console.log("Carrito reiniciado");
}

document.getElementById("comprar").addEventListener("click", comprarCarrito);

function comprarCarrito() {
    alert("Compra exitosa");
    reiniciarCarrito();
}

btnAbrir.addEventListener("click", mostrarCarrito);

function mostrarCarrito(){
    divCarrito.style.display = "flex"
    btnCerrar.style.display = "flex";
    btnAbrir.style.display = "none";
}

btnCerrar.addEventListener("click", cerrarCarrito);

function cerrarCarrito(){
    divCarrito.style.display = "none"
    btnCerrar.style.display = "none";
    btnAbrir.style.display = "flex";
    
}
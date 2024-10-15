// Variables del carrito
let carrito = [];
let total = 0;
let usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

// Mostrar/ocultar el carrito y el inicio de sesión
if (usuarioActivo) {
    document.getElementById('login-link').style.display = 'none';
    document.getElementById('registro-link').style.display = 'none';
    document.getElementById('logout-link').style.display = 'block';
} else {
    document.getElementById('logout-link').style.display = 'none';
}

// Función para agregar productos al carrito
function agregarAlCarrito(nombre, precio) {
    carrito.push({ nombre: nombre, precio: precio });
    actualizarCarrito();
}

// Función para actualizar el carrito y mostrar el total
function actualizarCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    const totalCarrito = document.getElementById('total');
    
    listaCarrito.innerHTML = '';
    total = 0;

    carrito.forEach(producto => {
        const li = document.createElement('li');
        li.textContent = `${producto.nombre} - $${producto.precio}`;
        listaCarrito.appendChild(li);
        total += producto.precio;
    });

    totalCarrito.textContent = total;

    // Mostrar el carrito solo si tiene productos
    if (carrito.length > 0) {
        document.getElementById('carrito').style.display = 'block';
    } else {
        document.getElementById('carrito').style.display = 'none';
    }
}

// Función para mostrar el formulario de login
function mostrarLogin() {
    document.getElementById('login').style.display = 'block';
    document.getElementById('registro').style.display = 'none';
}

// Función para mostrar el formulario de registro
function mostrarRegistro() {
    document.getElementById('registro').style.display = 'block';
    document.getElementById('login').style.display = 'none';
}

// Función para cerrar los formularios (login o registro)
function cerrarFormulario(formulario) {
    document.getElementById(formulario).style.display = 'none';
}

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('usuarioActivo');
    window.location.href = "index.html";  // Redirigir a la página principal
}

// Función para realizar el pago con Stripe
document.getElementById('checkout').addEventListener('click', async function() {
    const stripe = Stripe('TU_CLAVE_PUBLICA_DE_STRIPE');  // Asegúrate de usar tu clave pública de Stripe

    // Crear una session de checkout en el servidor (puedes hacer esto en tu backend)
    const response = await fetch('/crear-checkout-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            carrito: carrito,  // Los productos en el carrito
            total: total,      // El total de la compra
        }),
    });
    
    const session = await response.json();

    // Redirigir a la página de Stripe para completar el pago
    const { error } = await stripe.redirectToCheckout({
        sessionId: session.id
    });

    if (error) {
        alert(error.message);  // Muestra un error si algo falla
    }
});

// Función para inicializar el mapa
function initMap() {
    const location = { lat: -34.397, lng: 150.644 }; // Coordenadas de ejemplo
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: location,
    });
    const marker = new google.maps.Marker({
        position: location,
        map: map,
    });
}

window.onload = initMap;

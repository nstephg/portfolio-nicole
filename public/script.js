// --- ANIMACIÓN DE FONDO (LÍNEAS Y CAMINITOS) ---
const canvas = document.getElementById('canvas-lines');
const ctx = canvas.getContext('2d');

canvas.width = document.documentElement.clientWidth - 1; 
canvas.height = window.innerHeight;

let particlesArray;

let mouse = {
    x: null,
    y: null,
    radius: (canvas.height / 80) * (canvas.width / 80)
}

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = '#4a2c1d';
        ctx.fill();
    }
    update() {
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 15000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.5) - 0.25;
        let directionY = (Math.random() * 0.5) - 0.25;
        let color = '#4a2c1d';
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (distance / 20000);
                ctx.strokeStyle = `rgba(74, 44, 29, ${opacityValue})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('#nav-menu');

// Abrir/Cerrar menú al hacer clic en la hamburguesa
menu.addEventListener('click', function() {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
});
// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('.nav-links a').forEach(n => n.addEventListener('click', () => {
    menu.classList.remove('is-active');
    menuLinks.classList.remove('active');
}));

const langBtn = document.getElementById('language-toggle');
const langBtnMobile = document.getElementById('language-toggle-mobile');

// Función única para procesar el clic
const handleLangClick = () => {
    const currentLang = langBtn.innerText; 

    if (currentLang === 'EN') {
        changeLanguage('en');
    } else {
        changeLanguage('es');
    }
};

// Escuchamos el clic en ambos botones
if(langBtn) langBtn.addEventListener('click', handleLangClick);
if(langBtnMobile) langBtnMobile.addEventListener('click', handleLangClick);

function changeLanguage(lang) {
    document.cookie = `googtrans=/es/${lang}; path=/`;
    document.cookie = `googtrans=/es/${lang}; domain=${window.location.hostname}; path=/`;
    location.reload();
}

window.addEventListener('load', () => {
    const isEnglish = document.cookie.includes('/es/en');
    const text = isEnglish ? 'ES' : 'EN';
    
    if(langBtn) langBtn.innerText = text;
    if(langBtnMobile) langBtnMobile.innerText = text;
});

function changeLanguage(lang) {
    document.cookie = `googtrans=/es/${lang}; path=/`;
    document.cookie = `googtrans=/es/${lang}; domain=${window.location.hostname}; path=/`;
    location.reload();
}

window.addEventListener('load', () => {
    if (document.cookie.includes('/es/en')) {
        langBtn.innerText = 'ES';
    } else {
        langBtn.innerText = 'EN';
    }
});

window.addEventListener('resize', () => {
    canvas.width = document.documentElement.clientWidth - 1; 
    canvas.height = window.innerHeight;
    init();
});

// --- MANEJO DEL FORMULARIO SIN REDIRECCIÓN ---
const form = document.getElementById("contact-form");

async function handleSubmit(event) {
    event.preventDefault(); // 1. Evita que la página se recargue o redireccione
    
    const status = document.getElementById("form-status");
    const btn = document.getElementById("submit-btn");
    const data = new FormData(event.target);

    // Efecto visual de "Cargando..."
    btn.innerHTML = "ENVIANDO...";
    btn.style.opacity = "0.7";
    btn.disabled = true;

    fetch(event.target.action, {
        method: form.method,
        body: data,
        headers: {
            'Accept': 'application/json' // 2. IMPORTANTE: Esto le dice a Formspree "No me redirecciones, respóndeme en JSON"
        }
    }).then(response => {
        if (response.ok) {
            // 3. Si todo salió bien
            status.innerHTML = "¡Gracias! Tu mensaje ha sido enviado con éxito.";
            status.style.color = "#4caf50"; // Verde éxito
            form.reset(); // Limpia los campos
        } else {
            // 4. Si hubo error (ej. validación)
            response.json().then(data => {
                if (Object.hasOwn(data, 'errors')) {
                    status.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                } else {
                    status.innerHTML = "Oops! Hubo un problema al enviar tu formulario.";
                }
                status.style.color = "#ff4444"; // Rojo error
            });
        }
    }).catch(error => {
        // 5. Error de red
        status.innerHTML = "Oops! Hubo un problema de conexión.";
        status.style.color = "#ff4444";
    }).finally(() => {
        // Restaurar botón
        btn.innerHTML = "ENVIAR MENSAJE";
        btn.style.opacity = "1";
        btn.disabled = false;
        
        // Borrar mensaje de éxito después de 5 segundos
        setTimeout(() => {
            status.innerHTML = "";
        }, 5000);
    });
}

// Escuchar el evento
if(form) {
    form.addEventListener("submit", handleSubmit);
}

init();
animate();

// --- ANIMACIONES DE ENTRADA (ScrollReveal) ---
ScrollReveal().reveal('.reveal-top', { distance: '50px', origin: 'top', duration: 1000, delay: 200 });
ScrollReveal().reveal('.reveal-bottom', { distance: '50px', origin: 'bottom', duration: 1000, delay: 400 });
ScrollReveal().reveal('.reveal-left', { distance: '50px', origin: 'left', duration: 1000 });
ScrollReveal().reveal('.reveal-right', { distance: '50px', origin: 'right', duration: 1000 });
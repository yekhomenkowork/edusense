const canvas = document.getElementById('neural-bg');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let atoms = [];

class Atom {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.6 - 0.3;
        this.speedY = Math.random() * 0.6 - 0.3;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
        ctx.fillStyle = '#0066cc22';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    for (let i = 0; i < 100; i++) atoms.push(new Atom());
}

function handleConnections() {
    for (let i = 0; i < atoms.length; i++) {
        for (let j = i; j < atoms.length; j++) {
            const dx = atoms[i].x - atoms[j].x;
            const dy = atoms[i].y - atoms[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 150) {
                ctx.strokeStyle = `rgba(0, 102, 204, ${0.1 - distance/1500})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(atoms[i].x, atoms[i].y);
                ctx.lineTo(atoms[j].x, atoms[j].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    atoms.forEach(atom => {
        atom.update();
        atom.draw();
    });
    handleConnections();
    requestAnimationFrame(animate);
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

init(); animate();

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('show');
});


// Typing Effect
const typingText = document.getElementById('typing-text');

const roles = [
    "AI SOFTWARE ENGINEER",
    "INTELLIGENT SYSTEMS BUILDER",
    "FRONTEND ENGINEER"
];

let roleIndex = 0;
let charIndex = 0;

function typeEffect() {

    if (charIndex < roles[roleIndex].length) {

        typingText.textContent +=
            roles[roleIndex].charAt(charIndex);

        charIndex++;

        setTimeout(typeEffect, 100);

    } else {

        setTimeout(eraseEffect, 2000);

    }

}

function eraseEffect() {

    if (charIndex > 0) {

        typingText.textContent =
            roles[roleIndex].substring(0, charIndex - 1);

        charIndex--;

        setTimeout(eraseEffect, 50);

    } else {

        roleIndex =
            (roleIndex + 1) % roles.length;

        setTimeout(typeEffect, 500);

    }

}

typeEffect();


// Fade In
const fadeElements =
    document.querySelectorAll('.fade-in');

const observer =
    new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }

        });

    });

fadeElements.forEach(el => observer.observe(el));


// Scroll Progress
window.addEventListener('scroll', () => {

    const scrollTop =
        document.documentElement.scrollTop;

    const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    const scrolled =
        (scrollTop / height) * 100;

    document.getElementById('progress-bar')
        .style.width = `${scrolled}%`;

});


// Back To Top
const backToTop =
    document.getElementById('backToTop');

window.addEventListener('scroll', () => {

    if (window.scrollY > 400) {
        backToTop.style.display = 'block';
    } else {
        backToTop.style.display = 'none';
    }

});

backToTop.addEventListener('click', () => {

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

});


// LOAD PROJECTS
async function loadProjects() {

    const response =
        await fetch('./data/projects.json');

    const projects =
        await response.json();

    const container =
        document.querySelector('.projects-list');

    container.innerHTML =
        projects.map(project => `

      <article class="project-card">

        <img src="${project.image}"
          alt="${project.title}">

        <h3>${project.title}</h3>

        <p>${project.description}</p>

        <div class="skill-tags">

          ${project.stack.map(tech => `
            <span>${tech}</span>
          `).join('')}

        </div>

        <div class="project-links">

          <a href="${project.github}"
            target="_blank">
            GitHub
          </a>

          <a href="${project.live}"
            target="_blank">
            Live Demo
          </a>

        </div>

      </article>

    `).join('');

}

loadProjects();


// LOAD CERTIFICATIONS
async function loadCertifications() {

    const response =
        await fetch('./data/certifications.json');

    const certs =
        await response.json();

    const container =
        document.querySelector('.certificates');

    container.innerHTML =
        certs.map(cert => `

      <article class="cert-card">

        <img src="${cert.image}"
          alt="${cert.name}">

        <h3>${cert.name}</h3>

        <p>${cert.issuer}</p>

        <span>${cert.date}</span>

      </article>

    `).join('');

}

loadCertifications();

const glow = document.querySelector('.cursor-glow');

document.addEventListener('mousemove', (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
});
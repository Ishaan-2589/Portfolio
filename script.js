const slides = document.getElementById("slides");
const slideItems = document.querySelectorAll(".slide");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const dotsContainer = document.querySelector(".dots");

let index = 1;
let interval;
let slideWidth;

/* =========================
   Clone First & Last Slide
========================= */

const firstClone = slideItems[0].cloneNode(true);
const lastClone = slideItems[slideItems.length - 1].cloneNode(true);

firstClone.id = "first-clone";
lastClone.id = "last-clone";

slides.appendChild(firstClone);
slides.prepend(lastClone);

const allSlides = document.querySelectorAll(".slide");

/* =========================
   Set Initial Position
========================= */

function setSlidePosition() {
  slideWidth = allSlides[index].clientWidth;
  slides.style.transform = `translateX(-${slideWidth * index}px)`;
}

window.addEventListener("resize", setSlidePosition);
setSlidePosition();

/* =========================
   Create Dots
========================= */

slideItems.forEach((_, i) => {
  const dot = document.createElement("span");
  dot.addEventListener("click", () => moveToSlide(i + 1));
  dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll(".dots span");

function updateDots() {
  dots.forEach(dot => dot.classList.remove("active"));
  dots[index - 1]?.classList.add("active");
}

/* =========================
   Move Slides
========================= */

function moveToSlide(i) {
  index = i;
  slides.style.transition = "0.6s ease-in-out";
  slides.style.transform = `translateX(-${slideWidth * index}px)`;
  updateDots();
}

function nextSlide() {
  if (index >= allSlides.length - 1) return;
  index++;
  moveToSlide(index);
}

function prevSlideFunc() {
  if (index <= 0) return;
  index--;
  moveToSlide(index);
}

/* =========================
   Infinite Loop Fix
========================= */

slides.addEventListener("transitionend", () => {

  if (allSlides[index].id === "first-clone") {
    slides.style.transition = "none";
    index = 1;
    slides.style.transform = `translateX(-${slideWidth * index}px)`;
  }

  if (allSlides[index].id === "last-clone") {
    slides.style.transition = "none";
    index = allSlides.length - 2;
    slides.style.transform = `translateX(-${slideWidth * index}px)`;
  }

});

/* =========================
   Controls
========================= */

next.addEventListener("click", () => {
  stopAutoSlide();
  nextSlide();
  startAutoSlide();
});

prev.addEventListener("click", () => {
  stopAutoSlide();
  prevSlideFunc();
  startAutoSlide();
});

/* =========================
   Auto Slide
========================= */

function startAutoSlide() {
  interval = setInterval(() => {
    nextSlide();
  }, 4000);
}

function stopAutoSlide() {
  clearInterval(interval);
}

startAutoSlide();
updateDots();
/* =========================
   Scroll Reveal
========================= */

const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  const windowHeight = window.innerHeight;

  reveals.forEach(reveal => {
    const revealTop = reveal.getBoundingClientRect().top;

    if (revealTop < windowHeight - 100) {
      reveal.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
/* =========================
   Page Loader
========================= */

window.addEventListener("load", () => {

  document.body.classList.add("loaded");

  setTimeout(() => {
    document.getElementById("loader").style.display = "none";
  }, 600);

});
/* =========================
   Particle Background (No Shower)
========================= */

const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

let w, h;
let particles = [];

function resizeCanvas() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = document.querySelector(".hero").offsetHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

/* Create Particles */

function initParticles() {
  particles = [];

  for (let i = 0; i < 180; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.3
    });
  }
}

initParticles();

/* Animation */

function animateParticles() {
  ctx.clearRect(0, 0, w, h);

  particles.forEach(p => {

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
    ctx.fill();

    // Move
    p.x += p.dx;
    p.y += p.dy;

    // Wrap around
    if (p.x < 0) p.x = w;
    if (p.x > w) p.x = 0;
    if (p.y < 0) p.y = h;
    if (p.y > h) p.y = 0;

  });

  requestAnimationFrame(animateParticles);
}

animateParticles();


const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const header = document.querySelector(".site-header");

menuToggle.addEventListener("click", () => nav.classList.toggle("open"));
document.querySelectorAll(".nav a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

const progress = document.createElement("div");
progress.className = "scroll-progress";
document.body.appendChild(progress);

let lastScroll = 0;
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (y/max)*100 : 0}%`;
  header.classList.toggle("header-scrolled", y > 20);
  if (y > lastScroll && y > 180) header.classList.add("header-hidden");
  else header.classList.remove("header-hidden");
  lastScroll = y;
}, {passive:true});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:.12,rootMargin:"0px 0px -40px 0px"});
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

function animateCounter(el){
  const target = Number(el.dataset.target || 0);
  const suffix = el.dataset.suffix || "";
  const duration = 1250;
  const start = performance.now();
  function tick(now){
    const p = Math.min((now-start)/duration,1);
    const eased = 1-Math.pow(1-p,3);
    el.textContent = Math.round(target*eased)+suffix;
    if(p<1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting && !entry.target.dataset.done){
      entry.target.dataset.done="1";
      animateCounter(entry.target);
    }
  });
},{threshold:.65});
document.querySelectorAll(".counter").forEach(el => counterObserver.observe(el));

if(window.matchMedia("(pointer:fine)").matches){
  document.querySelectorAll(".card,.project-card,.engagement-card,.activity-panel").forEach(card => {
    card.addEventListener("mousemove", e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX-r.left)/r.width;
      const y = (e.clientY-r.top)/r.height;
      const rx = (.5-y)*4.5;
      const ry = (x-.5)*6;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px)`;
    });
    card.addEventListener("mouseleave", () => card.style.transform="");
  });
}

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".nav a")];
const activeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      navLinks.forEach(a => a.classList.remove("active"));
      const link = navLinks.find(a => a.getAttribute("href") === `#${entry.target.id}`);
      if(link) link.classList.add("active");
    }
  });
},{threshold:.45});
sections.forEach(section => activeObserver.observe(section));

document.getElementById("year").textContent = new Date().getFullYear();

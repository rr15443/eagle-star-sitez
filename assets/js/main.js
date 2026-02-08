/* ================================
   Helpers
================================ */
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

function setActiveNav(){
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  $$(".nav a, .drawer .menu a").forEach(a => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    a.classList.toggle("active", href === path);
  });
}

/* ================================
   Mobile drawer
================================ */
function initDrawer(){
  const drawer = $("#drawer");
  const openBtn = $("#openDrawer");
  const closeBtn = $("#closeDrawer");

  if(!drawer || !openBtn || !closeBtn) return;

  const close = () => drawer.classList.remove("open");
  openBtn.addEventListener("click", () => drawer.classList.add("open"));
  closeBtn.addEventListener("click", close);
  drawer.addEventListener("click", (e) => {
    if(e.target === drawer) close();
  });
  $$(".drawer a").forEach(a => a.addEventListener("click", close));
}

/* ================================
   Slider
================================ */
function initSlider(){
  const slider = $("#slider");
  if(!slider) return;

  const slidesEl = $(".slides", slider);
  const slides = $$(".slide", slider);
  const prev = $("#prevSlide");
  const next = $("#nextSlide");
  const pills = $$(".pill", slider);

  let i = 0;
  let timer = null;
  const count = slides.length;

  const go = (idx) => {
    i = (idx + count) % count;
    slidesEl.style.transform = `translateX(-${i * 100}%)`;
    pills.forEach((p, pi) => p.classList.toggle("active", pi === i));
  };

  const start = () => {
    stop();
    timer = setInterval(() => go(i+1), 7000);
  };
  const stop = () => { if(timer) clearInterval(timer); };

  prev?.addEventListener("click", () => { go(i-1); start(); });
  next?.addEventListener("click", () => { go(i+1); start(); });
  pills.forEach((p, pi) => p.addEventListener("click", () => { go(pi); start(); }));

  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", start);

  go(0);
  start();
}

/* ================================
   Forms (demo submission)
   NOTE: Replace with your backend/Netlify/Forms later
================================ */
function initForms(){
  const forms = $$("form[data-form]");
  forms.forEach(form => {
    const toast = form.querySelector(".toast");
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Basic required validation
      const required = $$("[required]", form);
      let ok = true;
      required.forEach(inp => {
        if(!inp.value.trim()){
          ok = false;
          inp.focus();
        }
      });

      if(!toast) return;

      if(!ok){
        toast.classList.add("error");
        toast.style.display = "block";
        toast.textContent = "Please fill in all required fields.";
        return;
      }

      toast.classList.remove("error");
      toast.style.display = "block";
      toast.textContent = "Submitted! (Demo) — connect a backend to receive messages.";
      form.reset();
    });
  });
}

/* ================================
   Search (across site)
================================ */
const SEARCH_INDEX = [
  {title:"Home", url:"index.html", text:"Professional security solutions, onsite guards, patrol, camera systems, access control, monitoring, emergency response."},
  {title:"Services", url:"services.html", text:"Armed and unarmed security, mobile patrol, event security, executive protection, CCTV installation, access control, alarm response."},
  {title:"Industries", url:"industries.html", text:"Warehouses, corporate offices, construction sites, retail, healthcare, residential communities, events, logistics."},
  {title:"About", url:"about.html", text:"Licensed, insured, trained officers, background checks, reporting, customer-first approach, local coverage."},
  {title:"Projects", url:"projects.html", text:"Case studies, deployments, camera upgrades, access control installs, patrol routes, incident reduction."},
  {title:"Blog", url:"blog.html", text:"Security tips, risk assessments, choosing guards, camera placement, site safety, compliance."},
  {title:"Careers", url:"careers.html", text:"Join our team, security officer roles, training, benefits, apply online."},
  {title:"Request a Quote", url:"quote.html", text:"Get a quote, schedule a walkthrough, custom plan, pricing."},
  {title:"Contact", url:"contact.html", text:"Contact us, phone, email, service areas, emergency line."},
  {title:"Privacy Policy", url:"privacy.html", text:"Privacy practices, data collection, cookies, contact preferences."},
  {title:"Sitemap", url:"sitemap.html", text:"All pages on this website."}
];

function initSearch(){
  const modal = $("#searchModal");
  const openBtn = $("#openSearch");
  const openBtnMobile = $("#openSearchMobile");
  const closeBtn = $("#closeSearch");
  const input = $("#searchInput");
  const resultsEl = $("#searchResults");

  if(!modal || !openBtn || !closeBtn || !input || !resultsEl) return;

  const open = () => {
    modal.classList.add("open");
    input.value = "";
    resultsEl.innerHTML = "";
    setTimeout(() => input.focus(), 50);
  };
  const close = () => modal.classList.remove("open");

  openBtn.addEventListener("click", open);
  openBtnMobile?.addEventListener("click", open);
  closeBtn.addEventListener("click", close);

  modal.addEventListener("click", (e) => {
    if(e.target === modal) close();
  });

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    if(!q){
      resultsEl.innerHTML = "";
      return;
    }
    const hits = SEARCH_INDEX
      .map(item => {
        const hay = (item.title + " " + item.text).toLowerCase();
        const score = hay.includes(q) ? 1 : 0;
        return {...item, score};
      })
      .filter(x => x.score > 0)
      .slice(0, 10);

    if(hits.length === 0){
      resultsEl.innerHTML = `<div class="result"><strong>No results</strong><small>Try a different keyword (ex: patrol, CCTV, quote).</small></div>`;
      return;
    }

    resultsEl.innerHTML = hits.map(h => `
      <a class="result" href="${h.url}">
        <strong>${h.title}</strong>
        <small>${h.text.slice(0, 120)}...</small>
      </a>
    `).join("");
  });

  document.addEventListener("keydown", (e) => {
    if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k"){
      e.preventDefault();
      open();
    }
    if(e.key === "Escape") close();
  });
}

/* ================================
   Init
================================ */
document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  initDrawer();
  initSlider();
  initForms();
  initSearch();
});

(function(){
  "use strict";

  /* ---------- mobile nav ---------- */
  var menuBtn = document.querySelector(".menu-toggle");
  var navlinks = document.querySelector(".navlinks");
  if (menuBtn && navlinks) {
    menuBtn.addEventListener("click", function(){
      var open = navlinks.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------- symptom diagnostic ---------- */
  var symptomBtns = document.querySelectorAll(".symptom-btn");
  var contentBank = document.querySelectorAll(".diag-content");
  var diagHeading = document.getElementById("diag-heading");
  var diagBody = document.getElementById("diag-body");
  var diagTag = document.querySelector(".diagnose-photo .tag");
  var diagUse = document.querySelector(".diagnose-photo use");

  function activateSymptom(id){
    symptomBtns.forEach(function(b){ b.setAttribute("aria-selected", b.getAttribute("data-target") === id ? "true" : "false"); });
    var data = null;
    contentBank.forEach(function(p){ if (p.getAttribute("data-symptom") === id) data = p; });
    if (!data) return;
    if (diagHeading) diagHeading.textContent = data.getAttribute("data-h");
    if (diagBody) diagBody.textContent = data.getAttribute("data-p");
    if (diagTag) diagTag.textContent = data.getAttribute("data-tag");
    if (diagUse) diagUse.setAttribute("href", "#" + data.getAttribute("data-icon"));
  }
  symptomBtns.forEach(function(btn){
    btn.addEventListener("click", function(){ activateSymptom(btn.getAttribute("data-target")); });
  });

  /* ---------- anatomy diagram hotspots ---------- */
  var anatomyItems = document.querySelectorAll(".anatomy-item");
  var anatomyDots = document.querySelectorAll(".anatomy-dot");
  function activatePart(id){
    anatomyItems.forEach(function(i){ i.classList.toggle("active", i.getAttribute("data-part") === id); });
    anatomyDots.forEach(function(d){ d.classList.toggle("active", d.getAttribute("data-part") === id); });
  }
  anatomyItems.forEach(function(item){
    item.addEventListener("mouseenter", function(){ activatePart(item.getAttribute("data-part")); });
    item.addEventListener("click", function(){ activatePart(item.getAttribute("data-part")); });
  });
  anatomyDots.forEach(function(dot){
    dot.addEventListener("mouseenter", function(){ activatePart(dot.getAttribute("data-part")); });
    dot.addEventListener("click", function(){ activatePart(dot.getAttribute("data-part")); });
  });

  /* ---------- mobile sticky action bar ---------- */
  var bar = document.querySelector(".mobile-bar");
  var hero = document.querySelector(".hero");
  if (bar && hero && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ bar.classList.toggle("show", !e.isIntersecting); });
    }, { rootMargin: "-40% 0px 0px 0px" });
    io.observe(hero);
  }

  /* ---------- demo request form (non-transmitting) ---------- */
  var form = document.getElementById("service-form");
  if (form) {
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var success = document.getElementById("form-success");
      if (success) success.classList.add("show");
      form.reset();
    });
  }
})();

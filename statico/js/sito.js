/* sito.js — piccole funzioni comuni ai due siti (nessuna libreria esterna). */
(function () {
  "use strict";

  // Menu su telefono: apre/chiude l'elenco
  var pulsante = document.querySelector(".menu-pulsante");
  var menu = document.getElementById("menu");
  if (pulsante && menu) {
    pulsante.addEventListener("click", function () {
      var aperto = menu.classList.toggle("aperto");
      pulsante.setAttribute("aria-expanded", aperto ? "true" : "false");
    });
  }

  // Scadenze (home di andrearizzo.it): mostra le prossime 3 a partire da oggi
  var box = document.getElementById("scadenze-elenco");
  var dati = document.getElementById("scadenze-dati");
  if (box && dati) {
    var tutte = JSON.parse(dati.textContent);
    var oggi = new Date(); oggi.setHours(0, 0, 0, 0);
    var prossime = tutte.filter(function (s) { return new Date(s.data + "T00:00:00") >= oggi; }).slice(0, 3);
    if (!prossime.length) {
      // Elenco esaurito: meglio nessun riquadro che scadenze già passate
      box.closest(".scadenze").hidden = true;
    } else {
      box.innerHTML = "";
      prossime.forEach(function (s) {
        var giorni = Math.round((new Date(s.data + "T00:00:00") - oggi) / 86400000);
        var mancano = giorni === 0 ? "Oggi" : giorni === 1 ? "Domani" : "Tra " + giorni + " giorni";
        var li = document.createElement("li");
        li.innerHTML = '<div class="giorno"><b></b><span></span></div><div><p class="scadenza-cosa"></p>' +
          '<p class="scadenza-chi"></p><span class="scadenza-mancano"></span></div>';
        li.querySelector(".giorno b").textContent = s.giorno;
        li.querySelector(".giorno span").textContent = s.mese + " " + s.anno;
        li.querySelector(".scadenza-cosa").textContent = s.cosa;
        li.querySelector(".scadenza-chi").textContent = s.chi;
        li.querySelector(".scadenza-mancano").textContent = mancano;
        box.appendChild(li);
      });
    }
  }

  // Filtri per categoria (home di thefiscallab.it)
  var filtri = document.querySelectorAll(".filtri button");
  var voci = document.querySelectorAll(".articoli li[data-categoria]");
  var vuoto = document.getElementById("nessun-articolo");
  filtri.forEach(function (b) {
    b.addEventListener("click", function () {
      var cat = b.getAttribute("data-categoria");
      filtri.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      var visibili = 0;
      voci.forEach(function (li) {
        var mostra = !cat || li.getAttribute("data-categoria") === cat;
        li.hidden = !mostra;
        if (mostra) visibili++;
      });
      if (vuoto) vuoto.hidden = visibili > 0;
    });
  });

  // Modulo di contatto (home di andrearizzo.it): controllo dei campi prima dell'invio
  var modulo = document.getElementById("modulo");
  if (modulo) {
    modulo.elements.inizio.value = String(Date.now());  // per scartare gli invii automatici troppo rapidi
    var avviso = document.getElementById("modulo-errore");
    var codice = new URLSearchParams(location.search).get("errore");
    if (codice && avviso) {
      avviso.textContent = avviso.getAttribute("data-errore-" + codice) || avviso.getAttribute("data-errore-1");
      avviso.hidden = false;
    }
    modulo.addEventListener("input", function (e) {
      var etichetta = e.target.closest("label");
      if (etichetta && e.target.checkValidity()) etichetta.classList.remove("errato");
    });
    modulo.addEventListener("submit", function (e) {
      var primo = null;
      ["nome", "email", "messaggio", "consenso"].forEach(function (nome) {
        var campo = modulo.elements[nome];
        var ok = campo.checkValidity() && (campo.type === "checkbox" || campo.value.trim() !== "");
        campo.closest("label").classList.toggle("errato", !ok);
        if (!ok && !primo) primo = campo;
      });
      if (primo) { e.preventDefault(); primo.focus(); return; }
      var bottone = modulo.querySelector("button[type=submit]");
      bottone.disabled = true;
      bottone.classList.add("in-invio");
      bottone.textContent = bottone.getAttribute("data-invio");
    });
  }
})();

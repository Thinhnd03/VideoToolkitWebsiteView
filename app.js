// Fills the download button and the version history from versions.js.
(function () {
  const versions = window.VERSIONS || [];
  const latest = versions[0];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const $ = (id) => document.getElementById(id);
  document.getElementById("year").textContent = new Date().getFullYear();

  // Home page only (other pages, e.g. privacy/, load just the menu part below)
  if ($("download-btn") && latest) {
    const btn = $("download-btn");
    btn.href = window.downloadUrl(latest);
    btn.textContent = `Tải bản cài ${latest.version}`;
    $("download-meta").textContent = `${latest.file} · ${latest.size} · ${latest.date}`;
  }
  // Only the newest version can be downloaded (older ones have no activation check): the rest is the changelog.
  if ($("versions")) $("versions").innerHTML = versions.map((v, i) => `
    <article class="version">
      <div class="version-head">
        <h3>${esc(v.version)}${i === 0 ? ' <span class="badge">Mới nhất</span>' : ""}</h3>
        <span class="muted">${esc(v.date)}${i === 0 ? ` · ${esc(v.size)}` : ""}</span>
        ${i === 0 ? `<a class="btn btn-small" href="${esc(window.downloadUrl(v))}">Tải ${esc(v.file)}</a>` : ""}
      </div>
      <ul>${v.notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>
    </article>`).join("");

  // Phone menu
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  const setOpen = (open) => {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "✕" : "☰";
  };
  toggle.addEventListener("click", (e) => { e.stopPropagation(); setOpen(!nav.classList.contains("open")); });
  nav.addEventListener("click", (e) => { if (e.target.tagName === "A") setOpen(false); });
  document.addEventListener("click", (e) => { if (!nav.contains(e.target)) setOpen(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  window.addEventListener("resize", () => { if (window.innerWidth > 820) setOpen(false); });

  // Highlight the guide part being read
  const links = [...document.querySelectorAll(".guide-menu a")];
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.hash === `#${en.target.id}`));
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  document.querySelectorAll(".guide-body article").forEach((a) => spy.observe(a));
})();

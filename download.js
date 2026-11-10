// "Tải video TikTok": a TikTok link -> the original video (no TikTok logo) via the free tikwm.com API, which (like
// TikTok's video servers) lets other websites read its answers. Everything runs in the visitor's browser; nothing
// goes through a VideoToolkit server. On iPhone the file is handed to the share sheet ("Lưu video" -> Photos).
(function () {
  const API = "https://www.tikwm.com";
  const $ = (id) => document.getElementById(id);
  const url = $("dl-url"), status = $("dl-status"), card = $("dl-card"), save = $("dl-save");
  const find_ = $("dl-find"), bar = $("dl-progress"), fill = bar.querySelector(".dl-bar span"), got_ = $("dl-got");
  let found = null; // {id, title, author, video, cover, size, duration}
  let file = null; // the downloaded File, ready for the share sheet

  const say = (text, error) => { status.textContent = text; status.classList.toggle("error", !!error); };
  const mb = (n) => (n ? `${(n / 1048576).toFixed(n < 10485760 ? 1 : 0)} MB` : "");
  const time = (s) => (s ? `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}` : "");
  const abs = (u) => (!u ? "" : u.startsWith("http") ? u : API + u);
  // Phones / tablets: the share sheet ("Lưu video" -> Photos). Computers: a normal download to the Downloads folder;
  // Chrome / Brave / Edge on Windows also have a share sheet, but it cannot save the file.
  const ua = navigator.userAgent;
  const phone = /iPhone|iPad|iPod|Android/i.test(ua) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(ua));
  const canShareFiles = () => {
    if (!phone) return false;
    try {
      return !!(navigator.canShare && navigator.canShare({ files: [new File([""], "x.mp4", { type: "video/mp4" })] }));
    } catch (e) { return false; }
  };

  function linkOf(text) {
    const m = String(text || "").match(/https?:\/\/[^\s"'<>]+/i);
    return (m ? m[0] : String(text || "").trim()).replace(/[).,]+$/, "");
  }

  function kind(link) {
    let host = "";
    try { host = new URL(/^https?:/i.test(link) ? link : "https://" + link).hostname.toLowerCase(); } catch (e) { return ""; }
    if (/(^|\.)tiktok\.com$/.test(host)) return "tiktok";
    if (/(^|\.)(facebook\.com|fb\.watch|fb\.com)$/.test(host)) return "facebook";
    return "";
  }

  $("dl-paste").addEventListener("click", async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) return say("Bộ nhớ tạm trống: hãy sao chép link video TikTok trước.", true);
      url.value = linkOf(text);
      say("");
    } catch (e) {
      url.focus();
      say("Trình duyệt không cho đọc bộ nhớ tạm: chạm giữ vào ô link → Dán.", true);
    }
  });

  $("dl-form").addEventListener("submit", (e) => { e.preventDefault(); find(); });

  async function find() {
    const link = linkOf(url.value);
    url.value = link;
    card.classList.add("hidden");
    found = file = null;
    if (!link) return say("Hãy dán link video TikTok.", true);
    const k = kind(link);
    if (k === "facebook") return say("Web chưa tải được video Facebook. Dùng app VideoToolkit trên máy tính.", true);
    if (k !== "tiktok") return say("Đây không phải link TikTok. Mở video trong TikTok → Chia sẻ → Sao chép liên kết.", true);
    say("");
    find_.disabled = true;
    find_.textContent = "Đang tìm video...";
    try {
      const resp = await fetch(`${API}/api/?url=${encodeURIComponent(link)}&hd=1`);
      const json = await resp.json();
      const d = json && json.data;
      if (!resp.ok || json.code !== 0 || !d) throw new Error(json && json.msg || `HTTP ${resp.status}`);
      if (!d.hdplay && !d.play) throw new Error(d.images ? "Bài này là ảnh, không phải video." : "Không thấy video.");
      const hd = !!d.hdplay;
      found = {
        id: d.id, title: d.title || "", author: d.author && (d.author.unique_id || d.author.nickname) || "",
        video: abs(d.hdplay || d.play), cover: abs(d.origin_cover || d.cover), cover2: abs(d.cover), duration: d.duration,
        size: hd ? d.hd_size : d.size, hd,
      };
      show();
    } catch (e) {
      say(`Không tìm được video: ${e.message}. Kiểm tra link (video công khai) rồi thử lại sau ít giây.`, true);
    } finally {
      find_.disabled = false;
      find_.textContent = "Tìm video";
    }
  }

  function show() {
    const img = $("dl-cover");
    img.style.visibility = "visible";
    img.onerror = () => {
      if (found.cover2 && img.src !== found.cover2) img.src = found.cover2; // the other size of the cover
      else img.style.visibility = "hidden"; // no cover: the banner shows the VideoToolkit logo
    };
    img.src = found.cover;
    $("dl-quality").textContent = found.hd ? "HD · gốc" : "SD";
    $("dl-title").textContent = found.title || "Video TikTok";
    $("dl-meta").textContent = [found.author && "@" + found.author, time(found.duration), mb(found.size)]
      .filter(Boolean).join(" · ");
    save.textContent = "Lưu video";
    save.disabled = false;
    bar.classList.add("hidden");
    card.classList.remove("hidden");
    say(""); // the banner already says it
    card.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  save.addEventListener("click", async () => {
    if (!found) return;
    if (file) return deliver(); // second tap: the share sheet needs a fresh tap after the download
    save.disabled = true;
    save.textContent = "Đang tải video...";
    bar.classList.remove("hidden");
    fill.style.width = "0";
    got_.textContent = "";
    say("");
    try {
      file = await download(found);
      bar.classList.add("hidden");
      if (canShareFiles()) save.textContent = "Lưu vào Ảnh"; // the share sheet: "Lưu video" -> Photos
      else { save.textContent = "Lưu video"; deliver(); }
    } catch (e) {
      file = null;
      bar.classList.add("hidden");
      save.textContent = "Lưu video";
      say(`Chưa tải được video (${e.message}). Hãy thử lại sau ít giây.`, true);
    } finally {
      save.disabled = false;
    }
  });

  async function download(v) {
    const resp = await fetch(v.video);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const total = Number(resp.headers.get("Content-Length")) || v.size || 0;
    const reader = resp.body && resp.body.getReader ? resp.body.getReader() : null;
    let blob;
    if (reader) {
      const parts = [];
      let got = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        parts.push(value);
        got += value.length;
        if (total) fill.style.width = `${Math.min(100, (got / total) * 100).toFixed(0)}%`;
        got_.textContent = `${mb(got)}${total ? " / " + mb(total) : ""}`;
      }
      blob = new Blob(parts, { type: "video/mp4" });
    } else {
      blob = await resp.blob();
    }
    fill.style.width = "100%";
    const name = `${(v.title || "tiktok").replace(/[\\/:*?"<>|#\n\r\t]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 60) || "tiktok"}-${v.id}.mp4`;
    return new File([blob], name, { type: "video/mp4" });
  }

  async function deliver() {
    if (canShareFiles()) {
      try {
        await navigator.share({ files: [file], title: found.title || "Video TikTok" });
      } catch (e) {
        if (e && e.name !== "AbortError") say(`Không mở được bảng chia sẻ: ${e.message}`, true);
      }
      return;
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 60000);
  }

  // a link in the address (…/download?url=...): filled in, found with "Tìm video" like a pasted one
  const preset = new URLSearchParams(location.search).get("url");
  if (preset) url.value = linkOf(preset);
})();

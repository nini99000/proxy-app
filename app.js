// app.js - منطق اپلیکیشن پروکسی تلگرام (jsDelivr version)
const CDN = "https://cdn.jsdelivr.net/gh/nini99000/proxy-app@main/proxies.json";

let currentProxy = null;

async function loadProxies(force = false) {
  const status = document.getElementById("status");
  status.textContent = "⏳ در حال دریافت پروکسی‌ها...";
  try {
    const res = await fetch(`${CDN}?t=${Date.now()}`);
    const data = await res.json();
    window._proxies = data.proxies || [];
    renderProxies(window._proxies);
    status.textContent = `✅ ${window._proxies.length} پروکسی سالم آماده‌ست`;
  } catch (e) {
    status.textContent = "❌ خطا در دریافت پروکسی‌ها";
  }
}

function renderProxies(proxies) {
  const list = document.getElementById("proxy-list");
  const count = document.getElementById("count");
  list.innerHTML = "";
  count.textContent = proxies.length;

  proxies.forEach((p, i) => {
    const li = document.createElement("li");
    const copyText = `${p.server}:${p.port}`;
    li.innerHTML = `
      <div class="info">
        <div class="srv">${i + 1}. ${p.server}:${p.port}</div>
      </div>
      <div class="row">
        <button class="mini" onclick="pickProxy(${i})">انتخاب</button>
        <button class="mini" onclick="copyText('${copyText.replace(/'/g, "\\'")}')">کپی</button>
      </div>
    `;
    list.appendChild(li);
  });
}

function pickProxy(i) {
  const p = window._proxies[i];
  if (!p) return;
  currentProxy = p;
  document.getElementById("proxy-addr").textContent = `${p.server}:${p.port}`;
  document.getElementById("proxy-secret").textContent = p.secret ? `Secret: ${p.secret}` : "";
  document.getElementById("proxy-link").href = p.link;
  document.getElementById("proxy-card").classList.remove("hidden");
  document.getElementById("status").textContent = `🎲 پروکسی ${i + 1} انتخاب شد`;
}

async function getRandom() {
  const status = document.getElementById("status");
  status.textContent = "⏳ در حال انتخاب...";
  try {
    const res = await fetch(`${CDN}?t=${Date.now()}`);
    const data = await res.json();
    const proxies = data.proxies || [];
    if (proxies.length) {
      const idx = Math.floor(Math.random() * proxies.length);
      pickProxy(idx);
    } else {
      status.textContent = "❌ پروکسی در دسترس نیست";
    }
  } catch (e) {
    status.textContent = "❌ خطا";
  }
}

function copyText(txt) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(txt);
    alert("کپی شد:\n" + txt);
  } else {
    // فال‌بک
    const ta = document.createElement("textarea");
    ta.value = txt;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    alert("کپی شد:\n" + txt);
  }
}

function copyAddr() {
  if (!currentProxy) return;
  const full = `Server: ${currentProxy.server}\nPort: ${currentProxy.port}\nSecret: ${currentProxy.secret || ""}`;
  copyText(full);
}

document.getElementById("btn-random").addEventListener("click", getRandom);
document.getElementById("btn-refresh").addEventListener("click", () => loadProxies(true));
document.getElementById("btn-copy").addEventListener("click", copyAddr);

// بارگذاری اولیه
loadProxies();

// app.js - منطق اپلیکیشن پروکسی تلگرام (GitHub Pages version)
// پروکسی‌ها از همون فایل proxies.json (توی ریپو) خونده میشه

async function loadProxies(force = false) {
  const status = document.getElementById("status");
  status.textContent = "⏳ در حال دریافت پروکسی‌ها...";
  try {
    // کش جلوگیری
    const url = `proxies.json?t=${Date.now()}`;
    const res = await fetch(url);
    const data = await res.json();
    renderProxies(data.proxies || []);
    status.textContent = `✅ ${data.proxies.length} پروکسی سالم آماده‌ست`;
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
    li.innerHTML = `
      <div class="info">
        <div class="srv">${i + 1}. ${p.server}:${p.port}</div>
      </div>
      <a class="test" href="${p.link}" target="_blank">تست</a>
    `;
    list.appendChild(li);
  });
}

async function getRandom() {
  const status = document.getElementById("status");
  status.textContent = "⏳ در حال انتخاب...";
  try {
    const res = await fetch(`proxies.json?t=${Date.now()}`);
    const data = await res.json();
    const proxies = data.proxies || [];
    if (proxies.length) {
      const p = proxies[Math.floor(Math.random() * proxies.length)];
      document.getElementById("proxy-addr").textContent = `${p.server}:${p.port}`;
      document.getElementById("proxy-link").href = p.link;
      document.getElementById("proxy-card").classList.remove("hidden");
      status.textContent = "🎲 یه پروکسی تصادفی برات آوردم";
    } else {
      status.textContent = "❌ پروکسی در دسترس نیست";
    }
  } catch (e) {
    status.textContent = "❌ خطا";
  }
}

function copyAddr() {
  const addr = document.getElementById("proxy-addr").textContent;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(addr);
    alert("آدرس کپی شد:\n" + addr);
  }
}

document.getElementById("btn-random").addEventListener("click", getRandom);
document.getElementById("btn-refresh").addEventListener("click", () => loadProxies(true));
document.getElementById("btn-copy").addEventListener("click", copyAddr);

// بارگذاری اولیه
loadProxies();

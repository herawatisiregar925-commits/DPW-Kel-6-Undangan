// ===== DATA =====
const state = {
  view: 'landing', adminTab: 'overview', isLoggedIn: false, opened: false,
  wedding: {
    groom: { shortName:"Kevin", fullName:"Kevin Sanjaya, S.T", childInfo:"Anak ketiga dari 4 bersaudara", parents:["Bapak Kenzo","Ibu Sandrinna"], photo:"aset/edo.jpg", ig:"https://www.instagram.com/ariya_herdaya?stkn=MWZqcGVncjBrNzE0Zw==" },
    bride: { shortName:"Michelle", fullName:"Michelle Evangeline, S.T", childInfo:"Anak kedua dari 2 bersaudara", parents:["Bapak Evan","Ibu Seline"], photo:"aset/sasa.jpg", ig:"https://www.instagram.com/salsabilaaa2367?stkn=MWxvanVvczRvNXpjeg==" },
    event: { dateText:"Sabtu, 29 September 2029", isoDate:"2029-09-29T09:00:00", timeText:"Pukul 09.00 WIB s.d. selesai",
      venue:"Grand Ballroom Hotel Pangeran", address:"Jl. Jenderal Sudirman No. 371-373, Kel. Cinta Raja, Kec. Sail, Kota Pekanbaru, Riau", mapUrl:"https://maps.google.com" },
    prayer:"Semoga cinta dan kasih sayang senantiasa menuntun langkah Kevin & Michelle. Diberkahi dengan keharmonisan, kesabaran, dan kebahagiaan yang tak pernah usai dalam mengarungi bahtera rumah tangga bersama",
    loveStory:[
      { title:"Awal mula bertemu", photo:"aset/rektorat.jpg", desc:"Semua berawal dari sebuah pertemuan sederhana di Universitas Riau, Fakultas Teknik. Di antara kesibukan perkuliahan, tugas, dan aktivitas kampus, dua orang yang sebelumnya tidak saling mengenal dipertemukan dalam satu cerita." },
      { title:"Komitmen", photo:"aset/jembatan.jpg", desc:"Seiring berjalannya waktu, hubungan yang dibangun semakin dekat dan kami memilih untuk melangkah lebih serius dengan sebuah komitmen untuk saling mendukung dan tumbuh bersama." },
      { title:"Lamaran", photo:"aset/bunga.jpg", desc:"Dengan penuh keyakinan, kami membawa hubungan ini menuju jenjang pernikahan melalui sebuah lamaran sebagai awal perjalanan panjang dalam satu tujuan." }
    ],
    gallery:[["aset/cp1.jpg","aset/cp2.jpg"],["aset/vid.mp4"]],
    heroPhoto:"aset/coverfinal.jpeg", giftPhoto:"aset/cp1.jpg", endPhoto:"aset/cp2.jpg",
    gift:{ bankName:"BCA", accountNumber:"123456789", accountHolder:"Kevin Sanjaya" }
  },
  guests:[
    { id:1, name:"Epifanius", status:"Hadir", count:2, wish:"Selamat untuk Kevin & Michelle, semoga lancar sampai hari H!" },
    { id:2, name:"Herawati Siregar", status:"Hadir", count:1, wish:"Barakallah! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah." },
    { id:3, name:"Salsabila", status:"Tidak Hadir", count:0, wish:"Mohon maaf belum bisa hadir secara langsung. Doa terbaik untuk kalian!" },
    { id:4, name:"Sumedho Ariya", status:"Hadir", count:2, wish:"Happy wedding brother Kevin & Michelle!" }
  ],
  targetGuestName:"Bapak Epifanius Sekeluarga"
};

// ===== HELPERS =====
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let cdTimer = null;

function showToast(msg){
  const t = $('toast'); t.querySelector('span').textContent = msg;
  t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2500);
}
function setView(v){ state.view = v; renderApp(); window.scrollTo(0,0); }
function setAdminTab(t){ state.adminTab = t; renderApp(); }

// ===== AKSI =====
function openInvitation(){

    state.opened = true;
    document.body.classList.remove('locked');
    $('cover').classList.add('open');

    const music = document.getElementById("bgMusic");
    music.play();

    const w = document.querySelector('.stage');
    if (w) w.scrollIntoView();
}

function toggleMusic(){
  const music = document.getElementById("bgMusic");
  const btn = document.getElementById("musicToggle");
  
  if (music.paused) {
    music.play();
    if (btn) btn.innerHTML = '<i data-lucide="disc"></i> Pause';
  } else {
    music.pause();
    if (btn) btn.innerHTML = '<i data-lucide="disc"></i> Play';
  }
  if (window.lucide) lucide.createIcons();
}

function handleLogin(e){
  e.preventDefault();
  if (e.target.username.value === 'admin' && e.target.password.value === 'admin123'){
    state.isLoggedIn = true; state.view = 'dashboard'; showToast("Berhasil masuk ke Dashboard Admin!");
  } else alert("Username atau password salah! (Gunakan: admin / admin123)");
  renderApp();
}
function handleLogout(){ state.isLoggedIn = false; state.view = 'landing'; showToast("Berhasil keluar."); renderApp(); }
function pushGuest(name, status, count, wish){
  state.guests.unshift({ id:Date.now(), name, status, count: status === 'Hadir' ? count : 0, wish: wish || "-" });
}
function handlePublicRSVP(e){
  e.preventDefault(); const f = e.target;
  pushGuest(f.rsvpName.value, f.rsvpStatus.value, 1, f.rsvpWish.value);
  showToast("Terima kasih! RSVP & ucapan Anda telah terkirim."); renderApp();
  document.getElementById('rsvp')?.scrollIntoView();
}
function addGuestAdmin(e){
  e.preventDefault(); const f = e.target;
  pushGuest(f.gName.value, f.gStatus.value, parseInt(f.gCount.value) || 1, f.gWish.value);
  showToast("Tamu berhasil ditambahkan!"); renderApp();
}
function deleteGuest(id){
  if (confirm("Yakin ingin menghapus data tamu ini?")){ state.guests = state.guests.filter(g => g.id !== id); showToast("Data tamu dihapus."); renderApp(); }
}
function saveTargetGuest(){
  state.targetGuestName = $('target-guest-input').value; showToast("Nama tamu diperbarui!"); renderApp();
}
function openGiftModal(){
  const g = state.wedding.gift;
  $('modal-bank-name').textContent = g.bankName; $('modal-account-number').textContent = g.accountNumber; $('modal-account-holder').textContent = g.accountHolder;
  $('gift-modal').classList.remove('hidden');
}
function closeGiftModal(){ $('gift-modal').classList.add('hidden'); }
function copyAccount(){
  navigator.clipboard?.writeText(state.wedding.gift.accountNumber); showToast("Nomor rekening berhasil disalin!");
}

// ===== RENDER =====
// function renderHeader(){
//   const land = state.view === 'landing';
//   $('header-container').innerHTML = `
//   <header class="topbar ${land ? 'floating' : ''}">
//     <span class="brand">Kevin & Michelle</span>
//     <div>
//       <button class="tb-btn ${land ? 'on' : ''}" onclick="setView('landing')"><i data-lucide="globe"></i> Undangan</button>
//       ${state.isLoggedIn ? `
//         <button class="tb-btn ${state.view === 'dashboard' ? 'on' : ''}" onclick="setView('dashboard')"><i data-lucide="layout-dashboard"></i> Dashboard</button>
//         <button class="tb-btn danger" onclick="handleLogout()" aria-label="Keluar"><i data-lucide="log-out"></i></button>
//       ` : `<button class="tb-btn" onclick="setView('login')"><i data-lucide="lock"></i> Admin</button>`}
//     </div>
//   </header>`;
// }

function renderHeader(){
  const land = state.view === 'landing';
  $('header-container').innerHTML = `
  <header class="topbar ${land ? 'floating' : ''}">
    <span class="brand">Kevin & Michelle</span>
    <div>
      <button class="tb-btn" id="music-btn" onclick="toggleMusic()">
        <i data-lucide="disc"></i> Pause
      </button>

      <button class="tb-btn ${land ? 'on' : ''}" onclick="setView('landing')"><i data-lucide="globe"></i> Undangan</button>
      ${state.isLoggedIn ? `
        <button class="tb-btn ${state.view === 'dashboard' ? 'on' : ''}" onclick="setView('dashboard')"><i data-lucide="layout-dashboard"></i> Dashboard</button>
        <button class="tb-btn danger" onclick="handleLogout()" aria-label="Keluar"><i data-lucide="log-out"></i></button>
      ` : `<button class="tb-btn" onclick="setView('login')"><i data-lucide="lock"></i> Admin</button>`}
    </div>
  </header>`;
}

function renderApp(){
  clearInterval(cdTimer);
  renderHeader();
  const app = $('app');
  document.body.classList.toggle('locked', state.view === 'landing' && !state.opened);
  app.innerHTML = state.view === 'landing' ? renderLanding() : state.view === 'login' ? renderLogin() : renderDashboard();
  if (state.view === 'landing') initCountdown();
  lucide.createIcons();
}

function personBlock(p, withIg){
  return `<div class="person">
    <div class="frame bride-photo"><img src="${p.photo}" alt="${esc(p.shortName)}"></div>
    <div class="nm">${p.shortName}</div>
    <p>${p.fullName}</p><p>${p.childInfo}</p><p>${p.parents[0]}</p><p>&</p><p>${p.parents[1]}</p>
    ${withIg ? `<a class="ig" href="${p.ig}" target="_blank" aria-label="Instagram ${p.shortName}">
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
</a>` : ''}
  </div>`;
}


function renderLanding(){
  const w = state.wedding, e = w.event, names = `${w.groom.shortName} & ${w.bride.shortName}`;
  const sprig = c => `<svg class="sprig ${c}" viewBox="0 0 24 40" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M12 39V8M12 30c-5-1-7-5-7-9 5 1 7 5 7 9zM12 22c5-1 7-5 7-9-5 1-7 5-7 9zM12 14c-3-1-4-4-4-7 3 1 4 4 4 7z"/></svg>`;
  return `
  <section id="cover" class="cover ${state.opened ? 'open' : ''}">
    <div class="curtain l"></div><div class="curtain r"></div>
    <div class="cover-in">
      <p class="kicker">Undangan Pernikahan</p>
      <h1 class="gold-text">${names}</h1>
      <div class="guest-card">${sprig('l')}${sprig('r')}<p>Kepada Yth:</p><b>${esc(state.targetGuestName)}</b></div>
      <button class="pill" onclick="openInvitation()"><span class="dot"><i data-lucide="mail"></i></span> Buka Undangan</button>
    </div>
  </section>
  

  <div class="stage">
    <aside class="photo" style="background-image:url('${w.heroPhoto}')">
      <div class="photo-cap"><i>The wedding of</i><b>${names}</b></div>
    </aside>

    <div class="panel">
      <section class="sec cream" id="tujuan">
        <div class="card-maroon">
          <p>Salam Sejahtera bagi kita semua. Karena cinta, dua perjalanan kini menjadi satu tujuan. Dengan penuh rasa syukur atas karunia Tuhan YME, kami bermaksud menyelenggarakan acara pernikahan putra-putri kami:</p>
          <div class="rule"></div>
          <div class="names">${w.groom.fullName.replace(', S.T','')}<br>&<br>${w.bride.fullName.replace(', S.T','')}</div>
          <div class="rule"></div>
          <p>Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu di hari bahagia kami.</p>
        </div>
      </section>

      <section class="sec" id="pengantin">
        <p>Dengan penuh rasa syukur dan kebahagiaan, kami bermaksud menyelenggarakan acara pernikahan kami:</p>
        ${personBlock(w.groom, true)}
        <div class="hearts"><i data-lucide="heart"></i></div>
        ${personBlock(w.bride, true)}
      </section>

      <section class="sec" id="acara">
        <h2 class="script glow">Counting The Days</h2>
        <p>Siang dan malam berganti begitu cepat, diantara saat-saat mendebarkan yang belum pernah kami rasakan sebelumnya. Kami nantikan kehadiran para keluarga dan sahabat, untuk menjadi saksi ikrar janji suci kami di hari yang bahagia.</p>
        <div class="line-gold"></div>
        <h3 class="sub">Akad & Resepsi</h3>
        <div class="cd">
          <div class="cd-box"><b id="cd-days">00</b><span>Hari</span></div><span class="cd-sep">:</span>
          <div class="cd-box"><b id="cd-hours">00</b><span>Jam</span></div><span class="cd-sep">:</span>
          <div class="cd-box"><b id="cd-mins">00</b><span>Menit</span></div><span class="cd-sep">:</span>
          <div class="cd-box"><b id="cd-secs">00</b><span>Detik</span></div>
        </div>
        <div class="line-gold"></div>
        <h3 class="sub">Lokasi & Waktu</h3>
        <p>${e.dateText}<br>${e.timeText}</p>
        <div class="line-gold"></div>
        <p>${e.venue}, ${e.address}</p><br>
        <a class="pill" href="${e.mapUrl}" target="_blank" style="text-decoration:none"><i data-lucide="map-pin"></i> Lihat Lokasi</a>
      </section>

      ${w.gallery.map(pair => ` 
  <section class="sec gallery"> 
    <h2 class="script glow">Gallery</h2> 
    <div class="gal-frame">
      ${pair.map(src => {
        const isVideo = /\.(mp4|webm|ogg)$/i.test(src);

        return isVideo
          ? `<video controls autoplay muted loop playsinline>
               <source src="${src}" type="video/mp4">
               Browser kamu tidak mendukung video.
             </video>`
          : `<img src="${src}" alt="Galeri pengantin">`;
      }).join('')}
    </div>
  </section>
`).join('')}

      <section class="sec doa">
        <div class="doa-box">
          <h2 class="script">Doa untuk Pengantin</h2>
          <p>${w.prayer}</p>
        </div>
      </section>

      <section class="sec" id="story">
        <h2 class="script glow">Love Story</h2>
        <div class="rule"></div>
        ${w.loveStory.map(s => `
          <div class="story">
            <h3 class="sub">${s.title}</h3>
            <div class="frame"><img src="${s.photo}" alt="${s.title}"></div>
            <p>${s.desc}</p>
          </div>`).join('')}
      </section>

      <section class="sec" id="gift">
        <div class="frame gift-photo"><img src="${w.giftPhoto}" alt="Foto pengantin"></div>
        <h2 class="script glow">Wedding gift</h2>
        <p>Doa restu Anda adalah hadiah terindah bagi kami. Namun bagi Bapak/Ibu/Saudara/i yang ingin berbagi kebahagiaan melalui tanda kasih, dapat memberikannya secara <em>cashless</em>.</p><br>
        <button class="pill" onclick="openGiftModal()"><i data-lucide="gift"></i> Kirim Hadiah</button>
      </section>

      <section class="sec" id="rsvp">
        <h2 class="script glow">RSVP & Wishes</h2>
        <p>Dengan hormat, kami mengharapkan konfirmasi kehadiran serta ucapan dan doa terbaik dari Bapak/Ibu/Saudara/i untuk kedua mempelai melalui fitur yang tersedia.</p>
        <form class="rsvp-form" onsubmit="handlePublicRSVP(event)">
          <label for="rn">Nama Lengkap</label>
          <input id="rn" name="rsvpName" required placeholder="Nama Lengkap">
          <label for="rs">Status Kehadiran</label>
          <select id="rs" name="rsvpStatus" required><option value="">Pilih Status Kehadiran</option><option>Hadir</option><option>Tidak Hadir</option></select>
          <label for="rw">Ucapan/Pesan</label>
          <textarea id="rw" name="rsvpWish" rows="3" placeholder="Sampaikan doa dan ucapan terbaik anda"></textarea>
          <button type="submit">Kirim</button>
        </form>
        <div class="wishes">
          <h4>Ucapan doa terbaru</h4>
          ${state.guests.map(g => `<div class="wish"><div class="row"><b>${esc(g.name)}</b><span class="badge ${g.status === 'Hadir' ? 'ok' : 'no'}">${g.status}</span></div><em>"${esc(g.wish)}"</em></div>`).join('')}
        </div>
      </section>

      <section class="sec cream" id="ending">
        <div class="frame end-photo"><img src="${w.endPhoto}" alt="Foto pengantin"></div>
        <h2 class="script">Thank You</h2>
        <p>Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan do'a restu kepada kami.<br>Kami yang berbahagia:</p>
        <h2 class="script" style="margin-top:1rem">${names}</h2>
      </section>
    </div>
  </div>`;
}

function initCountdown(){
  const target = new Date(state.wedding.event.isoDate).getTime();
  const p = n => String(n).padStart(2,'0');
  const tick = () => {
    const d = Math.max(0, target - Date.now());
    const set = (id, v) => { const el = $(id); if (el) el.textContent = p(v); };
    set('cd-days', Math.floor(d / 864e5)); set('cd-hours', Math.floor(d % 864e5 / 36e5));
    set('cd-mins', Math.floor(d % 36e5 / 6e4)); set('cd-secs', Math.floor(d % 6e4 / 1e3));
  };
  tick(); cdTimer = setInterval(tick, 1000);
}

function renderLogin(){
  return `<div class="center-page"><div class="box login">
    <h2>Admin Dashboard</h2><p class="small" style="text-align:center">Undangan Pernikahan Kevin & Michelle</p>
    <form onsubmit="handleLogin(event)">
      <label class="f-label" for="u">Username</label><input class="f-in" id="u" name="username" required placeholder="admin">
      <label class="f-label" for="p">Password</label><input class="f-in" id="p" type="password" name="password" required placeholder="••••••••">
      <button class="btn-gold" type="submit">Masuk Dashboard</button>
    </form>
    <p class="small" style="text-align:center;margin-top:1rem">Akun demo: <b>admin</b> / <b>admin123</b></p>
  </div></div>`;
}

function renderDashboard(){
  const G = state.guests, hadir = G.filter(g => g.status === 'Hadir').length;
  const pax = G.reduce((a, g) => a + (parseInt(g.count) || 0), 0);
  const tab = (k, l) => `<button class="tb-btn ${state.adminTab === k ? 'on' : ''}" onclick="setAdminTab('${k}')">${l}</button>`;
  const overview = `
    <div class="stats">
      <div class="box stat"><p>Total Konfirmasi</p><b>${G.length}</b></div>
      <div class="box stat"><p>Tamu Hadir</p><b>${hadir}</b></div>
      <div class="box stat"><p>Tidak Hadir</p><b>${G.length - hadir}</b></div>
      <div class="box stat"><p>Estimasi Pax Hadir</p><b>${pax}</b> <span class="small">orang</span></div>
    </div>
    <div class="box"><label class="f-label" for="target-guest-input">Nama tamu di cover undangan</label>
      <div class="row"><input class="f-in" id="target-guest-input" value="${esc(state.targetGuestName)}"><button class="btn-gold" style="width:auto;margin:0;padding:.55rem 1.2rem" onclick="saveTargetGuest()">Simpan</button></div>
    </div>`;
  const data = `
    <div class="grid3">
      <div class="box"><h3 class="nm script" style="font-size:1.6rem;color:var(--gold-l)">Tambah Tamu</h3>
        <form onsubmit="addGuestAdmin(event)">
          <label class="f-label">Nama Tamu</label><input class="f-in" name="gName" required>
          <label class="f-label">Status Kehadiran</label><select class="f-in" name="gStatus"><option>Hadir</option><option>Tidak Hadir</option></select>
          <label class="f-label">Jumlah Orang (Pax)</label><input class="f-in" type="number" name="gCount" value="1" min="0">
          <label class="f-label">Ucapan/Catatan</label><textarea class="f-in" name="gWish" rows="2"></textarea>
          <button class="btn-gold" type="submit">Tambah Tamu</button>
        </form></div>
      <div class="box tbl"><table>
        <thead><tr><th>Nama</th><th>Status</th><th>Pax</th><th>Ucapan</th><th></th></tr></thead>
        <tbody>${G.map(g => `<tr><td><b>${esc(g.name)}</b></td>
          <td><span class="badge ${g.status === 'Hadir' ? 'ok' : 'no'}">${g.status}</span></td><td>${g.count}</td>
          <td><em class="small">${esc(g.wish)}</em></td>
          <td><button class="del" onclick="deleteGuest(${g.id})" aria-label="Hapus ${esc(g.name)}"><i data-lucide="trash-2"></i></button></td></tr>`).join('')}</tbody>
      </table></div>
    </div>`;
  return `<div class="dash">
    <div class="dash-head"><div><h1>Dashboard Pengelola</h1><p class="small">Kelola konfirmasi RSVP & statistik tamu undangan</p></div>
      <div>${tab('overview','Ringkasan')}${tab('data-tamu','Data Tamu')}</div></div>
    ${state.adminTab === 'overview' ? overview : data}
  </div>`;
}

renderApp();

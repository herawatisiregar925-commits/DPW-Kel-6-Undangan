// ===== DATA =====
const state = {
  view: 'landing', adminTab: 'overview', isLoggedIn: false, opened: false,
  wedding: {
    groom: { shortName:"Kevin", fullName:"Kevin Sanjaya, S.T", childInfo:"Anak ketiga dari 4 bersaudara", parents:["Bapak Kenzo","Ibu Sandrinna"], photo:"aset/edow.jpg", ig:"https://www.instagram.com/ariya_herdaya?stkn=MWZqcGVncjBrNzE0Zw==" },
    bride: { shortName:"Michelle", fullName:"Michelle Evangeline, S.T", childInfo:"Anak ketiga dari 3 bersaudara", parents:["Bapak Evan","Ibu Seline"], photo:"aset/sasa.jpg", ig:"https://www.instagram.com/salsabilaaa2367?stkn=MWxvanVvczRvNXpjeg==" },
    event: { dateText:"Sabtu, 29 September 2029", isoDate:"2029-09-29T09:00:00", timeText:"Pukul 09.00 WIB s.d. selesai",
      venue:"Grand Ballroom Hotel Pangeran", address:"Jl. Jenderal Sudirman No. 371-373, Kel. Cinta Raja, Kec. Sail, Kota Pekanbaru, Riau", mapUrl:"https://maps.google.com" },
    prayer:"Semoga cinta dan kasih sayang senantiasa menuntun langkah Kevin & Michelle. Diberkahi dengan keharmonisan, kesabaran, dan kebahagiaan yang tak pernah usai dalam mengarungi bahtera rumah tangga bersama",
    loveStory:[
      { title:"Awal mula bertemu", photo:"aset/rektorat.jpg", desc:"Semua berawal dari sebuah pertemuan sederhana di Universitas Riau, Fakultas Teknik. Di antara kesibukan perkuliahan, tugas, dan aktivitas kampus, dua orang yang sebelumnya tidak saling mengenal dipertemukan dalam satu cerita." },
      { title:"Komitmen", photo:"aset/jembatan.jpg", desc:"Seiring berjalannya waktu, hubungan yang dibangun semakin dekat dan kami memilih untuk melangkah lebih serius dengan sebuah komitmen untuk saling mendukung dan tumbuh bersama." },
      { title:"Lamaran", photo:"aset/bunga.jpg", desc:"Dengan penuh keyakinan, kami membawa hubungan ini menuju jenjang pernikahan melalui sebuah lamaran sebagai awal perjalanan panjang dalam satu tujuan." }
    ],
    gallery:[["aset/cp1.jpg","aset/cp2.jpg"],["aset/vid.mp4"]],
    heroPhoto:"aset/coverfinal.png", giftPhoto:"aset/cp1.jpg", endPhoto:"aset/cp2.jpg",
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

function renderDashboard() {
    const G = state.guests;
    const hadir = G.filter(g => g.status === 'Hadir').length;
    const pax = G.reduce((a, g) => a + (parseInt(g.count) || 0), 0);
    const isOverview = state.adminTab === 'overview';

    // ============================================== 
    // TAB 1: RINGKASAN
    // ============================================== 
    const ringkasanHTML = `
        <div id="tab-ringkasan" class="block space-y-6 animate-fade-in">
            <!-- Row 1: Statistics Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="border border-dashBorder rounded-2xl p-6 bg-dashBg hover:border-dashGold/50 transition duration-300 shadow-sm"><p class="text-dashGold font-bold text-sm mb-2">Total Konfirmasi</p><p class="text-5xl font-bold font-sans">${G.length}</p></div>
                <div class="border border-dashBorder rounded-2xl p-6 bg-dashBg hover:border-dashGold/50 transition duration-300 shadow-sm"><p class="text-dashGold font-bold text-sm mb-2">Tamu Hadir</p><p class="text-5xl font-bold font-sans">${hadir}</p></div>
                <div class="border border-dashBorder rounded-2xl p-6 bg-dashBg hover:border-dashGold/50 transition duration-300 shadow-sm"><p class="text-dashGold font-bold text-sm mb-2">Tidak Hadir</p><p class="text-5xl font-bold font-sans">${G.length - hadir}</p></div>
                <div class="border border-dashBorder rounded-2xl p-6 bg-dashBg hover:border-dashGold/50 transition duration-300 shadow-sm"><p class="text-dashGold font-bold text-sm mb-2">Estimasi Pax Hadir</p><p class="text-5xl font-bold font-sans flex items-baseline gap-2">${pax} <span class="text-base font-normal text-dashCream/70">orang</span></p></div>
            </div>

            <!-- Row 2: Edit Cover -->
            <div class="border border-dashBorder rounded-2xl p-6 md:p-8 bg-dashBg">
                <label class="block text-dashCream font-bold mb-3 text-sm">Nama tamu di cover undangan</label>
                <div class="flex flex-col md:flex-row gap-4">
                    <input id="target-guest-input" type="text" value="${esc(state.targetGuestName)}" class="flex-1 bg-transparent border border-dashBorder rounded-xl px-4 py-3 text-dashCream focus:outline-none focus:border-dashGold transition">
                    <button onclick="saveTargetGuest()" class="bg-dashGold text-dashBg font-bold px-8 py-3 rounded-xl hover:bg-yellow-400 transition w-full md:w-auto">Simpan</button>
                </div>
            </div>

            <!-- Editor Grid (Statis sesuai referensi) -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Edit Tujuan Undangan -->
                <div class="border border-dashBorder rounded-2xl p-6 bg-dashBg">
                    <h3 class="text-dashGold font-bold mb-4 font-serif text-xl border-b border-dashBorder pb-2">Tujuan Undangan</h3>
                    <label class="block text-dashCream/70 text-xs mb-2">Teks Pengantar / Sambutan</label>
                    <textarea rows="4" class="w-full bg-transparent border border-dashBorder rounded-xl px-4 py-3 text-dashCream focus:outline-none focus:border-dashGold transition">Salam Sejahtera bagi kita semua. Karena cinta, dua perjalanan kini menjadi satu tujuan...</textarea>
                </div>

                <!-- Edit Story / Linimasa -->
                <div class="border border-dashBorder rounded-2xl p-6 bg-dashBg">
                    <h3 class="text-dashGold font-bold mb-4 font-serif text-xl border-b border-dashBorder pb-2">Love Story (Linimasa)</h3>
                    <div class="space-y-3">
                        <div>
                            <label class="block text-dashCream/70 text-xs mb-1">Pertama Bertemu</label>
                            <input type="text" value="Semua berawal dari sebuah pertemuan sederhana di Universitas..." class="w-full bg-transparent border border-dashBorder rounded-lg px-3 py-2 text-sm text-dashCream focus:outline-none focus:border-dashGold transition">
                        </div>
                        <div>
                            <label class="block text-dashCream/70 text-xs mb-1">Komitmen</label>
                            <input type="text" value="Seiring berjalannya waktu, hubungan yang dibangun semakin..." class="w-full bg-transparent border border-dashBorder rounded-lg px-3 py-2 text-sm text-dashCream focus:outline-none focus:border-dashGold transition">
                        </div>
                    </div>
                </div>

                <!-- Edit Informasi Pengundang -->
                <div class="border border-dashBorder rounded-2xl p-6 bg-dashBg lg:col-span-2">
                    <h3 class="text-dashGold font-bold mb-4 font-serif text-xl border-b border-dashBorder pb-2">Informasi Pengundang (Mempelai)</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="space-y-4">
                            <h4 class="text-sm font-bold text-dashCream bg-dashBorder/30 px-3 py-1 rounded inline-block">Mempelai Pria</h4>
                            <div><label class="block text-dashCream/70 text-xs mb-1">Nama Lengkap</label><input type="text" value="Kevin Sanjaya, S.T." class="w-full bg-transparent border border-dashBorder rounded-lg px-4 py-2 text-dashCream focus:outline-none focus:border-dashGold"></div>
                            <div><label class="block text-dashCream/70 text-xs mb-1">Detail (Anak dari...)</label><textarea rows="2" class="w-full bg-transparent border border-dashBorder rounded-lg px-4 py-2 text-dashCream focus:outline-none focus:border-dashGold">Anak ketiga dari 4 bersaudara Bapak Kenzo & Ibu Sandrinna</textarea></div>
                        </div>
                        <div class="space-y-4">
                            <h4 class="text-sm font-bold text-dashCream bg-dashBorder/30 px-3 py-1 rounded inline-block">Mempelai Wanita</h4>
                            <div><label class="block text-dashCream/70 text-xs mb-1">Nama Lengkap</label><input type="text" value="Michelle Evangeline, S.T." class="w-full bg-transparent border border-dashBorder rounded-lg px-4 py-2 text-dashCream focus:outline-none focus:border-dashGold"></div>
                            <div><label class="block text-dashCream/70 text-xs mb-1">Detail (Anak dari...)</label><textarea rows="2" class="w-full bg-transparent border border-dashBorder rounded-lg px-4 py-2 text-dashCream focus:outline-none focus:border-dashGold">Anak kedua dari 2 bersaudara Bapak Evan & Ibu Seline</textarea></div>
                        </div>
                    </div>
                </div>

                <!-- Edit Waktu & Lokasi -->
                <div class="border border-dashBorder rounded-2xl p-6 bg-dashBg lg:col-span-2">
                    <h3 class="text-dashGold font-bold mb-4 font-serif text-xl border-b border-dashBorder pb-2">Waktu & Lokasi Acara</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-4">
                            <div class="flex gap-4">
                                <div class="w-1/2"><label class="block text-dashCream/70 text-xs mb-1">Tgl Akad/Pemberkatan</label><input type="date" value="2029-09-29" class="w-full bg-transparent border border-dashBorder rounded-lg px-4 py-2 text-dashCream focus:outline-none focus:border-dashGold [color-scheme:dark]"></div>
                                <div class="w-1/2"><label class="block text-dashCream/70 text-xs mb-1">Jam Akad</label><input type="time" value="09:00" class="w-full bg-transparent border border-dashBorder rounded-lg px-4 py-2 text-dashCream focus:outline-none focus:border-dashGold [color-scheme:dark]"></div>
                            </div>
                            <div class="flex gap-4">
                                <div class="w-1/2"><label class="block text-dashCream/70 text-xs mb-1">Tgl Resepsi</label><input type="date" value="2029-09-29" class="w-full bg-transparent border border-dashBorder rounded-lg px-4 py-2 text-dashCream focus:outline-none focus:border-dashGold [color-scheme:dark]"></div>
                                <div class="w-1/2"><label class="block text-dashCream/70 text-xs mb-1">Jam Resepsi</label><input type="text" value="11:00 s.d Selesai" class="w-full bg-transparent border border-dashBorder rounded-lg px-4 py-2 text-dashCream focus:outline-none focus:border-dashGold"></div>
                            </div>
                        </div>
                        <div class="space-y-4">
                            <div><label class="block text-dashCream/70 text-xs mb-1">Alamat Lengkap</label><textarea rows="2" class="w-full bg-transparent border border-dashBorder rounded-lg px-4 py-2 text-dashCream focus:outline-none focus:border-dashGold text-sm">Grand Ballroom Hotel Pangeran, Jl. Jenderal Sudirman No. 371-373, Pekanbaru</textarea></div>
                            <div><label class="block text-dashCream/70 text-xs mb-1">Link Google Maps</label><input type="url" value="https://maps.app.goo.gl/..." class="w-full bg-transparent border border-dashBorder rounded-lg px-4 py-2 text-dashCream focus:outline-none focus:border-dashGold text-sm"></div>
                        </div>
                    </div>
                </div>

                <!-- Manajemen Galeri -->
                <div class="border border-dashBorder rounded-2xl p-6 bg-dashBg">
                    <div class="flex justify-between items-center mb-4 border-b border-dashBorder pb-2"><h3 class="text-dashGold font-bold font-serif text-xl">Manajemen Galeri</h3><button class="text-dashGold text-sm hover:text-white transition"><i class="fa-solid fa-plus"></i> Upload Foto</button></div>
                    <div class="grid grid-cols-3 gap-3">
                        <div class="aspect-square bg-dashBorder rounded-lg relative overflow-hidden group"><img src="https://placehold.co/200x200/4a212e/f9cf58?text=Prewedd+1" class="w-full h-full object-cover"><button class="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-red-400 transition"><i class="fa-solid fa-trash"></i></button></div>
                        <div class="aspect-square bg-dashBorder rounded-lg relative overflow-hidden group"><img src="https://placehold.co/200x200/4a212e/f9cf58?text=Prewedd+2" class="w-full h-full object-cover"><button class="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-red-400 transition"><i class="fa-solid fa-trash"></i></button></div>
                        <div class="aspect-square bg-dashBorder rounded-lg relative overflow-hidden group"><img src="https://placehold.co/200x200/4a212e/f9cf58?text=Prewedd+3" class="w-full h-full object-cover"><button class="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-red-400 transition"><i class="fa-solid fa-trash"></i></button></div>
                    </div>
                </div>

                <!-- Moderasi Ucapan -->
                <div class="border border-dashBorder rounded-2xl p-6 bg-dashBg">
                    <h3 class="text-dashGold font-bold mb-4 font-serif text-xl border-b border-dashBorder pb-2">Moderasi Ucapan</h3>
                    <div class="space-y-3 h-48 overflow-y-auto pr-2">
                        <div class="bg-dashBorder/30 p-3 rounded-lg flex justify-between gap-4">
                            <div><p class="text-dashGold text-sm font-bold">Sumedho</p><p class="text-dashCream text-xs mt-1">Happy wedding brother Kevin & Michelle!</p></div>
                            <button class="text-red-400/70 hover:text-red-400 text-sm h-fit"><i class="fa-regular fa-trash-can"></i></button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Big Save Button -->
            <div class="pt-6 border-t border-dashBorder mt-8 text-right">
                <button class="bg-dashGold text-dashBg font-bold px-10 py-4 rounded-xl hover:bg-yellow-400 transition shadow-lg text-lg">Simpan Semua Perubahan</button>
            </div>
        </div>`;

    // ============================================== 
    // TAB 2: DATA TAMU
    // ============================================== 
    const dataTamuHTML = `
        <div id="tab-datatamu" class="block animate-fade-in">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <!-- Form Tambah Tamu -->
                <div class="lg:col-span-4">
                    <div class="border border-dashBorder rounded-2xl p-6 md:p-8 bg-dashBg">
                        <h3 class="text-2xl font-serif text-dashCream mb-6">Tambah Tamu</h3>
                        <form onsubmit="addGuestAdmin(event)" class="space-y-5">
                            <div><label class="block text-dashCream font-bold text-sm mb-2">Nama Tamu</label><input name="gName" required type="text" class="w-full bg-transparent border border-dashBorder rounded-xl px-4 py-3 text-dashCream focus:outline-none focus:border-dashGold transition"></div>
                            <div>
                                <label class="block text-dashCream font-bold text-sm mb-2">Status Kehadiran</label>
                                <select name="gStatus" class="w-full bg-transparent border border-dashBorder rounded-xl px-4 py-3 text-dashCream focus:outline-none focus:border-dashGold transition appearance-none cursor-pointer">
                                    <option value="Hadir">Hadir</option>
                                    <option value="Tidak Hadir">Tidak Hadir</option>
                                    <option value="Ragu-ragu">Ragu-ragu</option>
                                </select>
                            </div>
                            <div><label class="block text-dashCream font-bold text-sm mb-2">Jumlah Orang (Pax)</label><input name="gCount" type="number" value="1" min="0" class="w-full bg-transparent border border-dashBorder rounded-xl px-4 py-3 text-dashCream focus:outline-none focus:border-dashGold transition"></div>
                            <div><label class="block text-dashCream font-bold text-sm mb-2">Ucapan/Catatan</label><textarea name="gWish" rows="3" class="w-full bg-transparent border border-dashBorder rounded-xl px-4 py-3 text-dashCream focus:outline-none focus:border-dashGold transition"></textarea></div>
                            <button type="submit" class="w-full bg-dashGold text-dashBg font-bold px-6 py-3.5 rounded-xl hover:bg-yellow-400 transition shadow-sm mt-4">Tambah Tamu</button>
                        </form>
                    </div>
                </div>

                <!-- Data Table -->
                <div class="lg:col-span-8">
                    <div class="border border-dashBorder rounded-2xl p-6 md:p-8 bg-dashBg overflow-hidden flex flex-col h-full min-h-[500px]">
                        <div class="overflow-x-auto flex-1">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="text-dashGold font-bold text-sm">
                                        <th class="pb-4 font-semibold w-1/4">Nama</th>
                                        <th class="pb-4 font-semibold w-1/6">Status</th>
                                        <th class="pb-4 font-semibold w-1/12 text-center">Pax</th>
                                        <th class="pb-4 font-semibold w-1/2">Ucapan</th>
                                        <th class="pb-4"></th>
                                    </tr>
                                </thead>
                                <tbody class="text-sm divide-y divide-dashBorder">
                                    ${G.map(g => `
                                    <tr class="group hover:bg-dashBorder/20 transition">
                                        <td class="py-4 font-bold pr-2">${esc(g.name)}</td>
                                        <td class="py-4">
                                            <span class="px-2 py-0.5 rounded border ${g.status === 'Hadir' ? 'border-green-800 bg-green-900/30 text-green-400' : 'border-red-800 bg-red-900/30 text-red-400'} text-xs">${g.status}</span>
                                        </td>
                                        <td class="py-4 text-center">${g.count}</td>
                                        <td class="py-4 italic text-dashCream/80 pr-4 line-clamp-2">${esc(g.wish)}</td>
                                        <td class="py-4 text-right">
                                            <button onclick="deleteGuest(${g.id})" class="text-[#f43f5e] hover:text-red-400 opacity-60 hover:opacity-100 transition p-2">
                                                <i class="fa-regular fa-trash-can"></i>
                                            </button>
                                        </td>
                                    </tr>`).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

    return `
    <div class="bg-dashBg text-dashCream font-sans min-h-screen flex flex-col overflow-x-hidden text-left w-full">
        <!-- HEADER -->
        <header class="flex justify-between items-center px-6 md:px-10 py-4 border-b border-dashBorder sticky top-0 bg-dashBg z-50">
            
            <div class="hidden md:flex gap-3 text-sm">
                <button class="flex items-center gap-2 px-4 py-2 border border-dashBorder rounded-lg hover:bg-dashBorder/50 transition"><i class="fa-regular fa-circle-play"></i> Pause</button>
                <button onclick="logoutAdmin()" class="flex items-center gap-2 px-4 py-2 border border-dashBorder rounded-lg hover:bg-dashBorder/50 transition"><i class="fa-solid fa-globe"></i> Undangan</button>
                <button class="flex items-center gap-2 px-4 py-2 bg-dashGold text-dashBg font-bold rounded-lg transition shadow-md"><i class="fa-solid fa-border-all"></i> Dashboard</button>
                <button onclick="logoutAdmin()" class="flex items-center gap-2 px-4 py-2 border border-dashBorder rounded-lg hover:bg-dashBorder/50 transition"><i class="fa-solid fa-arrow-right-from-bracket"></i></button>
            </div>
            <button class="md:hidden text-dashGold text-2xl"><i class="fa-solid fa-bars"></i></button>
        </header>

        <!-- MAIN CONTENT -->
        <main class="w-full max-w-[1400px] mx-auto p-6 md:p-10 flex-1">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-6 border-b border-dashBorder gap-6">
                <div>
                    <h2 class="text-4xl md:text-5xl font-serif text-dashCream tracking-wide mb-2">Dashboard Pengelola</h2>
                    <p class="text-dashCream/80 text-sm md:text-base">Kelola konfirmasi RSVP & statistik tamu undangan</p>
                </div>
                <div class="flex gap-2 bg-dashBg">
                    <button onclick="setAdminTab('overview')" class="px-6 py-2.5 rounded-lg ${isOverview ? 'bg-dashGold text-dashBg font-bold' : 'border border-dashBorder text-dashCream hover:bg-dashBorder/50'} transition text-sm">Ringkasan</button>
                    <button onclick="setAdminTab('data-tamu')" class="px-6 py-2.5 rounded-lg ${!isOverview ? 'bg-dashGold text-dashBg font-bold' : 'border border-dashBorder text-dashCream hover:bg-dashBorder/50'} transition text-sm">Data Tamu</button>
                </div>
            </div>
            
            ${isOverview ? ringkasanHTML : dataTamuHTML}
        </main>

        <!-- Floating Play Button -->
        <div class="fixed bottom-4 left-4 z-50">
            <button class="bg-white text-black px-2 py-1 rounded text-xs flex items-center gap-1 font-semibold shadow hover:bg-gray-200 transition">
                <i class="fa-regular fa-circle-play"></i> Play
            </button>
        </div>
    </div>
    <style>
        .animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
    `;
}
renderApp();

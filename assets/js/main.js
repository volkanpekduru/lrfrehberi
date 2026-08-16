/**
 * 🚀 BAĞIMSIZ SSS (FAQ) AKORDİYON MOTORU
 * Gücünü amorf sınıflardan değil, saf ARIA anayasasından alan,
 * sayfadaki diğer interaktif kartlarla zerre çakışmayan yalıtılmış hücre sistemi.
 */
function lrfToggleFaqEngine(triggerElement) {
  if (!triggerElement) return;

  // HTML'indeki en dış çerçeveyi (<dl> etiketini) nokta atışı buluyoruz
  const faqHolder = triggerElement.closest(".lrf-faq__box-holder");
  if (!faqHolder) return;

  const isExpanded = triggerElement.getAttribute("aria-expanded") === "true";

  // Meralarda sinsi yığılma olmasın diye sadece BU FAQ alanı içindeki AKTİF açık SSS'leri kapatıyoruz
  faqHolder.querySelectorAll('.lrf-faq__trigger[aria-expanded="true"]').forEach((trigger) => {
    trigger.setAttribute("aria-expanded", "false");
  });

  // Eğer tıklanan soru zaten açık değilse, asaletle şahlandırıp kapısını açıyoruz kral
  if (!isExpanded) {
    triggerElement.setAttribute("aria-expanded", "true");
  }
}

// Merkezi DOM Dinleyicisi (Performans dostu Olay Delegasyonu kalkanı)
document.addEventListener("DOMContentLoaded", () => {
  const faqHolder = document.querySelector(".lrf-faq__box-holder");

  if (faqHolder) {
    faqHolder.addEventListener("click", (event) => {
      // Tıklanan yer butonun içindeki ikon veya span olsa bile en yakın butonu yakalar
      const trigger = event.target.closest(".lrf-faq__trigger");
      if (trigger) {
        lrfToggleFaqEngine(trigger);
      }
    });
  }
});
/**
 * 🍪 AKILLI ÇEREZ KALKANI MOTORU
 * Kullanıcıyı yormayan, hafızalı (localStorage) KVKK mekanizması.
 */
document.addEventListener("DOMContentLoaded", () => {
  const cookieBanner = document.getElementById("lrfCookieBanner");
  if (!cookieBanner) return;

  // Kullanıcı daha önce kabul etmiş mi kontrol ediyoruz
  const isCookieAccepted = localStorage.getItem("lrf_cookies_accepted");

  // Eğer kabul etmediyse, 1 saniye rötarla pürüzsüzce ekrana sürüyoruz kanka
  if (!isCookieAccepted) {
    setTimeout(() => {
      cookieBanner.classList.add("show");
    }, 1000);
  }
});

// Butona tıklandığında tetiklenen asil fonksiyon
function kabulEtCerez() {
  const cookieBanner = document.getElementById("lrfCookieBanner");
  if (!cookieBanner) return;

  // Banner'ı ekranın dışına pürüzsüzce geri fırlatıyoruz
  cookieBanner.classList.remove("show");

  // Tarayıcı hafızasına 1 yıl boyunca hatırlayacak şekilde işliyoruz
  localStorage.setItem("lrf_cookies_accepted", "true");
}
/**
 * 🚀 2. KÜRESEL LIGHTBOX POPUP MOTORU (Klasör Sensörlü & Mobil Güvence Zırhlı)
 * Deha eseri klasör sensörü sayesinde resim ismine göre yolu bulur.
 * Mobil cihazlarda and Safari tarayıcılarında taşma and yırtılmayı saniyede felç eder kanka!
 */
function lrfOpenLightbox(imgName, title) {
  const lightbox = document.getElementById("lrf-lightbox");
  const lightboxImg = document.getElementById("lrf-lightbox-img");
  const lightboxTitle = document.getElementById("lrf-lightbox-title");

  if (!lightbox || !lightboxImg || !lightboxTitle) return;

  // Varsayılan kurumsal klasör rotamız sahteler alanıdır kanka
  let klasorYolu = "assets/images/sahteler/";
  const jigKeywords = ["round", "dart", "standup", "football", "shaky", "swimbait", "cheburashka", "hirsiz"];
  const isJig = jigKeywords.some((keyword) => imgName.toLowerCase().includes(keyword));

  // Eğer resim ismi jig anahtar kelimelerini barındırıyorsa rotayı jigs klasörüne kırıyoruz kral
  if (isJig) {
    klasorYolu = "assets/images/jigs/";
  }

  // Resim and başlık mühürlerini DOM ağacına jilet gibi basıyoruz
  lightboxImg.src = klasorYolu + imgName;
  lightboxTitle.textContent = title;

  // Mobil akıllı telefonlarda arka plan kayma and titreme lekesini saniyede yok eden kalkan:
  document.body.style.overflow = "hidden";
  document.body.style.touchAction = "none";

  // Popup alanını süzülme animasyonuyla podyuma fırlatıyoruz kanka
  lightbox.classList.add("lrf-lightbox-overlay--active");
}

function lrfCloseLightbox() {
  const lightbox = document.getElementById("lrf-lightbox");
  if (lightbox) {
    lightbox.classList.remove("lrf-lightbox-overlay--active");
    // Sayfa kaydırma kilitlerini and dokunmatik bariyerlerini güvenle serbest bırakıyoruz kral
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
  }
}
/**
 * 🚀 3. SAHTE KATEGORİLERİ DİNAMİK SEKME VE 1440PX AKS KORUMA MOTORU
 * Butonlara tıklandığında hem üst galerileri hem alt kart matrislerini
 * ve akıllı açıklama kutusunu tek bir klikle tam bir ayna simetrisinde değiştiren vana!
 */
function lrfSwitchSahteTab(tabId, btnElement) {
  if (!btnElement) return;

  // Tüm butonlardan kurumsal aktiflik sınıfını kazıyoruz kanka
  document.querySelectorAll(".lrf-sahte-tab-btn").forEach((btn) => {
    btn.classList.remove("lrf-sahte-tab-btn--active");
  });
  // Tıklanan butona şanlı parıltı mührünü basıyoruz kral
  btnElement.classList.add("lrf-sahte-tab-btn--active");

  const descBox = document.getElementById("lrf-sahte-desc");
  const descText = document.getElementById("lrf-sahte-desc-text");

  if (descBox && descText) {
    descBox.classList.remove("lrf-sahte-desc-box--soft", "lrf-sahte-desc-box--jig", "lrf-sahte-desc-box--hard", "lrf-sahte-desc-box--surface");
  }

  // Tüm interaktif sahte gruplarını and matrislerini podyum arkasına gizliyoruz
  document.querySelectorAll(".lrf-sahte-group").forEach((group) => {
    group.classList.remove("lrf-sahte-group--active");
  });

  // Tıklanan tabId değerine göre ilgili alanları saniyede ayağa kaldıran akıllı vana zinciri:
  if (tabId === "soft") {
    if (descBox) descBox.classList.add("lrf-sahte-desc-box--soft");
    if (descText) descText.textContent = "LRF'nin bel kemiği. Esnek yapıları sayesinde su içinde son derece doğal hareketler üretirler. Jig head ile birlikte kullanılır.";
    const gal = document.getElementById("lrf-sahte-gal-soft");
    const group = document.getElementById("lrf-sahte-group-soft");
    if (gal) gal.classList.add("lrf-sahte-group--active");
    if (group) group.classList.add("lrf-sahte-group--active");
  } else if (tabId === "jig") {
    if (descBox) descBox.classList.add("lrf-sahte-desc-box--jig");
    if (descText) descText.textContent = "Ağır ve parlak metal gövdeleri sayesinde uzak mesafelere atılabilir ve hızlı batışları ile aktif predatör balıkları saniyede tetikler.";
    const gal = document.getElementById("lrf-sahte-gal-jig");
    const group = document.getElementById("lrf-sahte-group-jig");
    if (gal) gal.classList.add("lrf-sahte-group--active");
    if (group) group.classList.add("lrf-sahte-group--active");
  } else if (tabId === "hard") {
    if (descBox) descBox.classList.add("lrf-sahte-desc-box--hard");
    if (descText) descText.textContent = "Plastik veya ahşap gövdeli sert maketler. Belirli derinliklerde sabit bir aksiyon üretirler and büyük trofeleri hedeflemek için vazgeçilmezdir.";
    const gal = document.getElementById("lrf-sahte-gal-hard");
    const group = document.getElementById("lrf-sahte-group-hard");
    if (gal) gal.classList.add("lrf-sahte-group--active");
    if (group) group.classList.add("lrf-sahte-group--active");
  } else if (tabId === "surface") {
    if (descBox) descBox.classList.add("lrf-sahte-desc-box--surface");
    if (descText) descText.textContent = "Tamamen su yüzeyinde çalışan çılgın maketler. Sabah erken ve akşam üstü, balıkların su üstüne oynak yaptığı anlarda katliam yaratır.";
    const gal = document.getElementById("lrf-sahte-gal-surface");
    const group = document.getElementById("lrf-sahte-group-surface");
    if (gal) gal.classList.add("lrf-sahte-group--active");
    if (group) group.classList.add("lrf-sahte-group--active");
  }
}
/**
 * 🚀 4. JIG HEAD KARTLARI AKORDİYON MOTORU
 * Jig head kartlarının içindeki panelleri kararlı and akıcı açan şasi kanka.
 */
function lrfToggleJigCard(triggerButton) {
  if (!triggerButton) return;
  const cardGövdesi = triggerButton.closest(".lrf-grid-card");
  if (!cardGövdesi) return;

  const detayPaneli = cardGövdesi.querySelector(".lrf-jig-card__panel");
  const butonYazısı = triggerButton.querySelector("span");
  const butonİkonu = triggerButton.querySelector("svg, [data-lucide]");

  if (!detayPaneli) return;
  const isAçık = detayPaneli.style.display === "block";

  if (!triggerButton.hasAttribute("data-original-text")) {
    triggerButton.setAttribute("data-original-text", butonYazısı ? butonYazısı.textContent : "Detaylar");
  }
  const orijinalMetin = triggerButton.getAttribute("data-original-text");

  if (isAçık) {
    detayPaneli.style.display = "none";
    if (butonYazısı) butonYazısı.textContent = orijinalMetin;
    if (butonİkonu) butonİkonu.style.transform = "rotate(0deg)";
  } else {
    detayPaneli.style.display = "block";
    if (butonYazısı) butonYazısı.textContent = "Gizle";
    if (butonİkonu) butonİkonu.style.transform = "rotate(180deg)";
  }
}

/**
 * 🚀 5. HEDEF BALIKLAR AKORDİYON MOTORU (O YIRTILMAYI BİTİREN KUTSAL NEŞTER!)
 * HTML tarafında yazdığın onclick="lrfToggleFishPanel(this)" emrini tam ayna simetrisinde
 * karşılayan, diğer açık balık panellerini otomatik kapatan kurşun geçirmez motor kral!
 */
function lrfToggleFishPanel(triggerButton) {
  if (!triggerButton) return;
  const cardGövdesi = triggerButton.closest(".lrf-grid-card");
  if (!cardGövdesi) return;

  const detayPaneli = cardGövdesi.querySelector(".lrf-fish-card__panel");
  const butonYazısı = triggerButton.querySelector("span");
  const butonİkonu = triggerButton.querySelector("svg, [data-lucide]");

  if (!detayPaneli) return;

  // Sinsi yığılma olmasın diye diğer tüm açık balık panellerini otomatik kapatıyoruz kanka
  document.querySelectorAll(".lrf-fish-card__panel").forEach((p) => {
    if (p !== detayPaneli) {
      p.style.display = "none";
      const otherCard = p.closest(".lrf-grid-card");
      if (otherCard) {
        const otherBtn = otherCard.querySelector(".lrf-fish-card__trigger");
        if (otherBtn) {
          const otherSpan = otherBtn.querySelector("span");
          const otherIcon = otherBtn.querySelector("svg, [data-lucide]");
          if (otherSpan && otherBtn.hasAttribute("data-original-text")) {
            otherSpan.textContent = otherBtn.getAttribute("data-original-text");
          }
          if (otherIcon) otherIcon.style.transform = "rotate(0deg)";
        }
      }
    }
  });

  // Orijinal metni belleğe alan emniyet kemeri kanka
  if (!triggerButton.hasAttribute("data-original-text")) {
    triggerButton.setAttribute("data-original-text", butonYazısı ? butonYazısı.textContent : "Detaylar");
  }
  const orijinalMetin = triggerButton.getAttribute("data-original-text");

  const isAçık = detayPaneli.style.display === "block";

  if (isAçık) {
    detayPaneli.style.display = "none";
    if (butonYazısı) butonYazısı.textContent = orijinalMetin;
    if (butonİkonu) butonİkonu.style.transform = "rotate(0deg)";
  } else {
    detayPaneli.style.display = "block";
    if (butonYazısı) butonYazısı.textContent = "Gizle";
    if (butonİkonu) butonİkonu.style.transform = "rotate(180deg)";
  }
}

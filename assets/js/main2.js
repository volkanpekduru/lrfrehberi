// ==========================================================================
// 🌌 LRF REHBERİ RESMÎ JAVASCRIPT MOTORU (NİHAİ KURŞUN GEÇİRMEZ ŞASİ)
// ==========================================================================

/**
 * 🚀 1. FAQ AKORDİYON OTOMASYONU (Başlangıç Sayfası İçin)
 * Sinsi çakışmaları and yığılmaları engellemek için diğer tüm açık pencereleri
 * otomatik olarak kapatan ve aktif olanı pürüzsüzce tetikleyen akıllı motor kanka.
 */
function lrfToggleFaq(triggerElement) {
  if (!triggerElement) return;
  const currentItem = triggerElement.closest(".lrf-faq__item");
  if (!currentItem) return;

  const currentContent = currentItem.querySelector(".lrf-faq__content");
  const isActive = currentItem.classList.contains("lrf-faq__item--active");

  // Su altındaki meralarda sinsi yığılma olmasın diye açık kaleleri temizliyoruz kanka
  document.querySelectorAll(".lrf-faq__item").forEach((item) => {
    item.classList.remove("lrf-faq__item--active");
    const content = item.querySelector(".lrf-faq__content");
    if (content) content.style.display = "none";
    // İkon kutularını da varsayılan açıya (0deg) geri döndürüyoruz kral
    const iconBox = item.querySelector(".lrf-faq__icon-box");
    if (iconBox) iconBox.style.transform = "rotate(0deg)";
  });

  // Eğer tıklanan pencere zaten açık değilse, asaletle şahlandırıyoruz kral
  if (!isActive) {
    currentItem.classList.add("lrf-faq__item--active");
    if (currentContent) currentContent.style.display = "block";
    const currentIconBox = currentItem.querySelector(".lrf-faq__icon-box");
    if (currentIconBox) currentIconBox.style.transform = "rotate(180deg)";
  }
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
// ==========================================================================
// 🌌 LRF REHBERİ RESMÎ JAVASCRIPT MOTORU (NİHAİ KURŞUN GEÇİRMEZ ŞASİ)
// ==========================================================================

/**
 * 🚀 1. FAQ AKORDİYON OTOMASYONU (Başlangıç Sayfası İçin)
 * Sinsi çakışmaları engellemek için diğer tüm açık pencereleri otomatik kapatan
 * ve aktif olanı pürüzsüzce aşağı süzerek açan akıllı motor kanka.
 */
function lrfToggleFaq(triggerElement) {
  if (!triggerElement) return;
  const currentItem = triggerElement.closest(".lrf-faq__item");
  if (!currentItem) return;

  const currentContent = currentItem.querySelector(".lrf-faq__content");
  const isActive = currentItem.classList.contains("lrf-faq__item--active");

  // Su altındaki meralarda sinsi yığılma olmasın diye açık kaleleri temizliyoruz kanka
  document.querySelectorAll(".lrf-faq__item").forEach((item) => {
    item.classList.remove("lrf-faq__item--active");
    const content = item.querySelector(".lrf-faq__content");
    if (content) content.style.display = "none";

    // İkon kutularını da varsayılan açıya (0deg) geri döndürüyoruz kral
    const iconBox = item.querySelector(".lrf-faq__icon-box");
    if (iconBox) iconBox.style.transform = "rotate(0deg)";
  });

  // Eğer tıklanan pencere zaten açık değilse, asaletle şahlandırıyoruz kral
  if (!isActive) {
    currentItem.classList.add("lrf-faq__item--active");
    if (currentContent) currentContent.style.display = "block";
    const currentIconBox = currentItem.querySelector(".lrf-faq__icon-box");
    if (currentIconBox) currentIconBox.style.transform = "rotate(180deg)";
  }
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
 * 🚀 4. GLOBAL BÜYÜK DETAY KARTLARI AKORDİYON MOTORU (EVRENSEL MELEZ ŞASİ)
 * Hem Jig Head hem Balık kartlarındaki panelleri tek bir hattan tarayan,
 * ok ikonunu süzülerek döndüren and dinamik metin durumlarını yöneten kırılmaz şasi kral!
 */
function lrfToggleJigCard(triggerButton) {
  if (!triggerButton) return;
  const cardGövdesi = triggerButton.closest(".lrf-grid-card");
  if (!cardGövdesi) return;

  // Melez tarayıcı kapısı: Kartın tipine göre ilgili paneli milimetrik bulur kanka
  const detayPaneli = cardGövdesi.querySelector(".lrf-jig-card__panel") || cardGövdesi.querySelector(".lrf-fish-card__panel");
  const butonYazısı = triggerButton.querySelector("span");
  const butonİkonu = triggerButton.querySelector("svg, [data-lucide]");

  if (!detayPaneli) return;
  const isAçık = detayPaneli.style.display === "block" || detayPaneli.classList.contains("lrf-fish-card__panel--active");

  // İlk tıklamada buton metnini belleğe (data attribute) alan emniyet kemeri
  if (!triggerButton.hasAttribute("data-original-text")) {
    triggerButton.setAttribute("data-original-text", butonYazısı ? butonYazısı.textContent : "Detaylar");
  }
  const orijinalMetin = triggerButton.getAttribute("data-original-text");

  // Durum kontrolüne göre panelleri and ikon rotasyonlarını süzülerek değiştiren ana vana:
  if (isAçık) {
    detayPaneli.style.display = "none";
    detayPaneli.classList.remove("lrf-fish-card__panel--active");
    if (butonYazısı) butonYazısı.textContent = orijinalMetin;
    if (butonİkonu) butonİkonu.style.transform = "rotate(0deg)";
  } else {
    detayPaneli.style.display = "block";
    detayPaneli.classList.add("lrf-fish-card__panel--active");
    if (butonYazısı) butonYazısı.textContent = "Gizle";
    if (butonİkonu) butonİkonu.style.transform = "rotate(180deg)";
  }
}
// ==========================================================================
// 🍪 GLOBAL PLATFORM ANAYASASI - BÖLÜM 2.8: MİKRO YASAL ÇEREZ HAFIZA MOTORU
// ==========================================================================
window.addEventListener("DOMContentLoaded", function () {
  const cookieBanner = document.getElementById("lrfCookieBanner");

  // Eğer banner sayfada varsa ve daha önce onaylanmadıysa çalıştır kanka
  if (cookieBanner && !localStorage.getItem("cerez_onaylandi")) {
    setTimeout(() => {
      cookieBanner.classList.add("show");
    }, 1500); // 1.5 saniye sonra tatlıca süzülür
  }
});

// Kullanıcı kabul ettiğinde hafızaya kaydetme fonksiyonu
function kabulEtCerez() {
  const cookieBanner = document.getElementById("lrfCookieBanner");
  localStorage.setItem("cerez_onaylandi", "true");
  if (cookieBanner) {
    cookieBanner.classList.remove("show");
  }
}

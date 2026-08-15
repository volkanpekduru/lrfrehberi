// ==========================================================================
// 🌌 LRF REHBERİ RESMÎ JAVASCRIPT MOTORU (NİHAİ ULTRA PERFORMANS MOTORU)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  // 🍪 BÖLÜM 1: MİKRO YASAL ÇEREZ HAFIZA MOTORU
  const cookieBanner = document.getElementById("lrfCookieBanner");
  const cookieBtn = document.querySelector(".lrf-cookie-btn");

  if (cookieBanner && !localStorage.getItem("cerez_onaylandi")) {
    requestAnimationFrame(() => cookieBanner.classList.add("show"));
  }

  if (cookieBtn && cookieBanner) {
    cookieBtn.addEventListener("click", () => {
      localStorage.setItem("cerez_onaylandi", "true");
      cookieBanner.classList.remove("show");
    });
  }

  // 🚀 BÖLÜM 2: FAQ (SSS) AKORDİYON MOTORU
  const faqTriggers = document.querySelectorAll(".lrf-faq__trigger");
  faqTriggers.forEach((trigger) => {
    trigger.addEventListener("click", function () {
      const currentItem = this.closest(".lrf-faq__item");
      if (!currentItem) return;
      const isActive = currentItem.classList.contains("active");

      document
        .querySelectorAll(".lrf-faq__item")
        .forEach((item) => item.classList.remove("active"));
      if (!isActive) currentItem.classList.add("active");
    });
  });

  // 🚀 BÖLÜM 3: KÜRESEL LIGHTBOX POPUP MOTORU (KLASÖR SENSÖRLÜ)
  const lightbox = document.getElementById("lrf-lightbox");
  const lightboxImg = document.getElementById("lrf-lightbox-img");
  const lightboxTitle = document.getElementById("lrf-lightbox-title");
  const lightboxTriggers = document.querySelectorAll("[data-lightbox]");

  lightboxTriggers.forEach((trigger) => {
    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      if (!lightbox || !lightboxImg || !lightboxTitle) return;

      const imgName = this.getAttribute("data-lightbox-img");
      const title =
        this.getAttribute("data-lightbox-title") || this.textContent;
      const isJig = [
        "round",
        "dart",
        "standup",
        "football",
        "shaky",
        "swimbait",
        "cheburashka",
        "hirsiz",
      ].some((k) => imgName.toLowerCase().includes(k));

      lightboxImg.src = `assets/images/${isJig ? "jigs" : "sahteler"}/${imgName}`;
      lightboxTitle.textContent = title;

      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      lightbox.classList.add("lrf-lightbox-overlay--active");
    });
  });

  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === this || e.target.closest(".lrf-lightbox__close")) {
        lightbox.classList.remove("lrf-lightbox-overlay--active");
        document.body.style.overflow = "";
        document.body.style.touchAction = "";
      }
    });
  }

  // 🚀 BÖLÜM 4: SAHTE KATEGORİLERİ DİNAMİK SEKME MOTORU
  const tabButtons = document.querySelectorAll(".lrf-sahte-tab-btn");
  const descBox = document.getElementById("lrf-sahte-desc");
  const descText = document.getElementById("lrf-sahte-desc-text");
  const tabData = {
    soft: "LRF'nin bel kemiği. Esnek yapıları sayesinde su içinde son derece doğal hareketler üretirler. Jig head ile birlikte kullanılır.",
    jig: "Ağır ve parlak metal gövdeleri sayesinde uzak mesafelere atılabilir ve hızlı batışları ile aktif predatör balıkları saniyede tetikler.",
    hard: "Plastik veya ahşap gövdeli sert maketler. Belirli derinliklerde sabit bir aksiyon üretirler ve büyük trofeleri hedeflemek için vazgeçilmezdir.",
    surface:
      "Tamamen su yüzeyinde çalışan çılgın maketler. Sabah erken ve akşam üstü, balıkların su üstüne oynak yaptığı anlarda katliam yaratır.",
  };

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab");
      if (!tabId) return;

      tabButtons.forEach((btn) =>
        btn.classList.remove("lrf-sahte-tab-btn--active"),
      );
      this.classList.add("lrf-sahte-tab-btn--active");

      if (descBox) {
        descBox.className = "lrf-sahte-desc-box";
        descBox.classList.add(`lrf-sahte-desc-box--${tabId}`);
      }
      if (descText && tabData[tabId]) descText.textContent = tabData[tabId];

      document
        .querySelectorAll(".lrf-sahte-group")
        .forEach((g) => g.classList.remove("lrf-sahte-group--active"));
      ["gal", "group"].forEach((type) => {
        const el = document.getElementById(`lrf-sahte-${type}-${tabId}`);
        if (el) el.classList.add("lrf-sahte-group--active");
      });
    });
  });

  // 🚀 BÖLÜM 5: GLOBAL DETAY KARTLARI AKORDİYON MOTORU (JIG & BALIK EVRENSEL MELEZ ŞASİ)
  const akordiyonButonlari = document.querySelectorAll(
    ".lrf-grid-card__btn, .lrf-jig-card__btn, .lrf-jig-card__trigger, .lrf-fish-card__btn, .lrf-fish-card__trigger",
  );

  akordiyonButonlari.forEach((button) => {
    button.addEventListener("click", function () {
      const cardGövdesi = this.closest(".lrf-grid-card");
      if (!cardGövdesi) return;

      const detayPaneli = cardGövdesi.querySelector(
        ".lrf-jig-card__panel, .lrf-fish-card__panel",
      );
      const butonYazısı = this.querySelector("span");
      if (!detayPaneli) return;

      // Balık kartıysa kurallara uygun olarak diğer tüm açık olan balık panellerini infaz et kanka
      if (
        detayPaneli.classList.contains("lrf-fish-card__panel") &&
        !detayPaneli.classList.contains("active")
      ) {
        document
          .querySelectorAll(".lrf-fish-card__panel.active")
          .forEach((p) => {
            p.classList.remove("active");
            const otherCard = p.closest(".lrf-grid-card");
            const otherBtn = otherCard?.querySelector(
              ".lrf-fish-card__btn, .lrf-fish-card__trigger",
            );
            if (otherBtn) {
              otherBtn.classList.remove("active");
              const otherSpan = otherBtn.querySelector("span");
              if (otherSpan && otherBtn.hasAttribute("data-original-text")) {
                otherSpan.textContent =
                  otherBtn.getAttribute("data-original-text");
              }
            }
          });
      }

      if (!this.hasAttribute("data-original-text")) {
        this.setAttribute(
          "data-original-text",
          butonYazısı ? butonYazısı.textContent : "Detaylar",
        );
      }
      const orijinalMetin = this.getAttribute("data-original-text");
      const isAçik = detayPaneli.classList.toggle("active");
      this.classList.toggle("active");

      if (butonYazısı)
        butonYazısı.textContent = isAçik ? "Gizle" : orijinalMetin;
    });
  });
});

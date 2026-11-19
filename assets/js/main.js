/**
 * ==========================================================================
 * 🏆 LRF PLATFORM UNIFIED JAVASCRIPT ENGINE (WCAG 2.2 AA & MOBİL HOVER SÜRÜMÜ)
 * ==========================================================================
 */

const PANEL_TAB_TEXTS = Object.freeze({
  soft: "LRF'nin bel kemiği. Esnek yapıları sayesinde su içinde son derece doğal hareketler üretirler. Jig head ile birlikte kullanılır.",
  jig: "Ağır ve parlak metal gövdeleri sayesinde uzak mesafelere atılabilir ve hızlı batışları ile aktif predatör balıkları saniyede tetikler.",
  hard: "Plastik veya ahşap gövdeli sert maketler. Belirli derinliklerde sabit bir aksiyon üretirler ve büyük trofeleri hedeflemek için vazgeçilmezdir.",
  surface: "Tamamen su yüzeyinde çalışan çılgın maketler. Sabah erken ve akşam üstü, balıkların su üstüne oynak yaptığı anlarda katliam yaratır.",
});

const JIG_KEYWORDS = Object.freeze(["round", "dart", "standup", "football", "shaky", "swimbait", "cheburashka", "hirsiz"]);

const MOBILE_HOVER_SELECTORS = [
  ".lrf-grid-card",
  ".lrf-start-card",
  ".lrf-premium-info-card",
  ".lrf-zigzag__row",
  ".lrf-zigzag__list-item--boxed",
  ".lrf-jig-gallery__item",
  ".lrf-layers-row",
  ".lrf-strategy-panel",
  ".lrf-faq__item",
  ".lrf-hero__btn-primary",
  ".lrf-hero__btn-secondary",
  ".lrf-cta__btn-white",
  ".lrf-cta__btn-trans",
  ".lrf-tab-system-container--capsule .lrf-tab-system-btn",
].join(", ");

document.addEventListener("DOMContentLoaded", () => {
  /* ── 0. LUCIDE İKON MOTORU BAŞLATICI ── */
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  /* ── DOM REFERANS ÖNBELLEĞİ (CACHE) ── */
  const mainContent = document.getElementById("ana-icerik");
  const toggleBtn = document.getElementById("lrfMobileToggle");
  const navMenu = document.getElementById("lrfNavbarMenu");
  const lightbox = document.getElementById("lrf-lightbox");
  const lightboxImg = document.getElementById("lrf-lightbox-img");
  const lightboxTitle = document.getElementById("lrf-lightbox-title");
  const cookieBanner = document.getElementById("lrfCookieBanner");
  const descBox = document.getElementById("lrf-tab-system-desc");
  const descText = document.getElementById("lrf-tab-system-desc-text");
  const allTabGroups = document.querySelectorAll(".lrf-tab-system-group");

  /* ── 0B. SAYFA İÇİ ÇAPA HEDEFLERİNE KLAVYE ODAK TRANSFERİ MOTORU ── */
  const focusTargetSection = (targetElement, shouldScroll = true) => {
    if (!targetElement) return;
    if (!targetElement.hasAttribute("tabindex")) {
      targetElement.setAttribute("tabindex", "-1");
    }
    if (shouldScroll) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    targetElement.focus({ preventScroll: true });
  };

  /* ── 0C. MOBİL GÖZ HİZASI HOVER CANLANDIRMA (INTERSECTION OBSERVER) ── */
  let mobileHoverObserver = null;
  const touchOrMobileQuery = window.matchMedia("(hover: none), (max-width: 768px)");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const teardownMobileHover = () => {
    if (mobileHoverObserver) {
      mobileHoverObserver.disconnect();
      mobileHoverObserver = null;
    }
    document.querySelectorAll(".in-view").forEach((el) => {
      el.classList.remove("in-view");
    });
  };

  const initMobileHover = () => {
    teardownMobileHover();

    if (!("IntersectionObserver" in window) || !touchOrMobileQuery.matches || reducedMotionQuery.matches) {
      return;
    }

    const targets = document.querySelectorAll(MOBILE_HOVER_SELECTORS);
    if (!targets.length) return;

    mobileHoverObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("in-view", entry.isIntersecting);
        });
      },
      {
        root: null,
        rootMargin: "-35% 0px -35% 0px",
        threshold: 0,
      },
    );

    targets.forEach((el) => mobileHoverObserver.observe(el));
  };

  initMobileHover();

  if (touchOrMobileQuery.addEventListener) {
    touchOrMobileQuery.addEventListener("change", initMobileHover);
  }
  if (reducedMotionQuery.addEventListener) {
    reducedMotionQuery.addEventListener("change", initMobileHover);
  }

  /* ── 1. UNIFIED TAB SYSTEM MOTORU (Çizgi ve Panel Varyasyonları Kontrolü) ── */
  let isManualTabScroll = false;
  let manualScrollTimer = null;

  const setActiveTabButton = (targetBtn) => {
    if (!targetBtn) return;
    const container = targetBtn.closest(".lrf-tab-system-container");
    if (container) {
      container.querySelectorAll(".lrf-tab-system-btn").forEach((btn) => {
        btn.classList.remove("lrf-tab-system-btn--active");
        if (btn.hasAttribute("aria-selected")) {
          btn.setAttribute("aria-selected", "false");
          btn.setAttribute("tabindex", "-1");
        }
      });
    }
    targetBtn.classList.add("lrf-tab-system-btn--active");
    if (targetBtn.hasAttribute("aria-selected")) {
      targetBtn.setAttribute("aria-selected", "true");
      targetBtn.setAttribute("tabindex", "0");
    }
  };

  // İlk yüklemede pasif sekme panellerini hayalet odaktan (Ghost Focus) koru
  allTabGroups.forEach((group) => {
    if (group.classList.contains("lrf-tab-system-group--active")) {
      group.removeAttribute("inert");
      group.setAttribute("aria-hidden", "false");
    } else {
      group.setAttribute("inert", "");
      group.setAttribute("aria-hidden", "true");
    }
  });

  const handleTabSwitch = (targetBtn, transferFocusToSection = true) => {
    if (!targetBtn) return;

    const tabType = targetBtn.getAttribute("data-tab-type");
    const tabTargetId = targetBtn.getAttribute("data-tab-target");
    if (!tabType || !tabTargetId) return;

    setActiveTabButton(targetBtn);

    if (tabType === "line") {
      const targetSection = document.getElementById(tabTargetId);
      if (targetSection) {
        isManualTabScroll = true;
        if (manualScrollTimer) clearTimeout(manualScrollTimer);
        if (transferFocusToSection) {
          focusTargetSection(targetSection, true);
        }
        if (history.replaceState) {
          history.replaceState(null, "", `#${tabTargetId}`);
        }
        manualScrollTimer = setTimeout(() => {
          isManualTabScroll = false;
        }, 700);
      }
    } else if (tabType === "panel") {
      if (descBox) {
        descBox.className = `lrf-tab-system-desc-box lrf-tab-system-desc-box--${tabTargetId}`;
      }

      if (descText && PANEL_TAB_TEXTS[tabTargetId]) {
        descText.textContent = PANEL_TAB_TEXTS[tabTargetId];
      }

      allTabGroups.forEach((group) => {
        group.classList.remove("lrf-tab-system-group--active");
        group.setAttribute("inert", "");
        group.setAttribute("aria-hidden", "true");
      });

      const targetGal = document.getElementById(`lrf-tab-system-group-${tabTargetId}`);
      const targetContent = document.getElementById(`lrf-tab-system-group-content-${tabTargetId}`);

      if (targetGal) {
        targetGal.classList.add("lrf-tab-system-group--active");
        targetGal.removeAttribute("inert");
        targetGal.setAttribute("aria-hidden", "false");
        const targetGalBox = targetGal.querySelector(".lrf-jig-gallery");
        if (targetGalBox) {
          targetGalBox.setAttribute("data-active-color", tabTargetId);
        }
      }

      if (targetContent) {
        targetContent.classList.add("lrf-tab-system-group--active");
        targetContent.removeAttribute("inert");
        targetContent.setAttribute("aria-hidden", "false");
      }

      // Aktif panel değişiminde yeni görünür olan kartlar için göz hizası observer'ını tazele
      initMobileHover();
    }
  };

  /* ── 1B. ÇİZGİ SEKME MENÜSÜ SCROLLSPY & İLK YÜKLEME HASH SENKRONİZASYONU ── */
  const lineTabButtons = Array.from(document.querySelectorAll('[data-tab-type="line"][data-tab-target]'));

  if (lineTabButtons.length > 0) {
    if (window.location.hash) {
      const initialHashId = window.location.hash.slice(1);
      const matchingHashBtn = lineTabButtons.find((btn) => btn.getAttribute("data-tab-target") === initialHashId);
      if (matchingHashBtn) {
        setActiveTabButton(matchingHashBtn);
      }
    }

    if ("IntersectionObserver" in window) {
      const sectionMap = new Map();
      lineTabButtons.forEach((btn) => {
        const targetId = btn.getAttribute("data-tab-target");
        const sectionEl = targetId ? document.getElementById(targetId) : null;
        if (sectionEl) {
          sectionMap.set(sectionEl, btn);
        }
      });

      const sectionObserver = new IntersectionObserver(
        (entries) => {
          if (isManualTabScroll) return;
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const matchingBtn = sectionMap.get(entry.target);
              if (matchingBtn) {
                setActiveTabButton(matchingBtn);
              }
            }
          });
        },
        {
          rootMargin: "-20% 0px -65% 0px",
          threshold: 0,
        },
      );

      sectionMap.forEach((_, sectionEl) => sectionObserver.observe(sectionEl));
    }
  }

  /* ── 2. ORTAK KART AKORDİYON MOTORU (Jig Head ve Balık Kartları - .is-open & ARIA) ── */
  const toggleCardAccordion = (triggerButton, closeOthers = true) => {
    if (!triggerButton) return;

    const cardBody = triggerButton.closest(".lrf-grid-card");
    if (!cardBody) return;

    const btnText = triggerButton.querySelector("span");
    const isOpen = cardBody.classList.contains("is-open");

    if (!triggerButton.hasAttribute("data-original-text")) {
      triggerButton.setAttribute("data-original-text", btnText ? btnText.textContent : "Detaylar");
    }
    const originalText = triggerButton.getAttribute("data-original-text");

    if (closeOthers) {
      const parentMatrix = cardBody.closest(".lrf-grid-matrix");
      if (parentMatrix) {
        parentMatrix.querySelectorAll(".lrf-grid-card.is-open").forEach((otherCard) => {
          if (otherCard !== cardBody) {
            otherCard.classList.remove("is-open");
            const otherBtn = otherCard.querySelector("[data-action]");
            if (otherBtn) {
              otherBtn.setAttribute("aria-expanded", "false");
              const otherSpan = otherBtn.querySelector("span");
              if (otherSpan && otherBtn.hasAttribute("data-original-text")) {
                otherSpan.textContent = otherBtn.getAttribute("data-original-text");
              }
            }
          }
        });
      }
    }

    if (isOpen) {
      cardBody.classList.remove("is-open");
      triggerButton.setAttribute("aria-expanded", "false");
      if (btnText) btnText.textContent = originalText;
    } else {
      cardBody.classList.add("is-open");
      triggerButton.setAttribute("aria-expanded", "true");
      if (btnText) btnText.textContent = "Gizle";
    }
  };

  /* ── 3. KÜRESEL LIGHTBOX POPUP MOTORU (FOCUS TRAP & FOCUS RETURN KORUMALI) ── */
  let lastLightboxTrigger = null;

  const resolveLightboxSrc = (galleryItem) => {
    if (!galleryItem) return "";

    const childImg = galleryItem.querySelector("img");
    if (childImg && childImg.getAttribute("src")) {
      return childImg.getAttribute("src");
    }

    const imgName = galleryItem.getAttribute("data-lightbox-img") || "";
    if (!imgName) return "";
    if (imgName.includes("/")) return imgName;

    const isJig = JIG_KEYWORDS.some((keyword) => imgName.toLowerCase().includes(keyword));
    return (isJig ? "assets/images/jigs/" : "assets/images/sahteler/") + imgName;
  };

  const openLightbox = (galleryItem) => {
    if (!galleryItem || !lightbox || !lightboxImg || !lightboxTitle) return;

    const resolvedSrc = resolveLightboxSrc(galleryItem);
    if (!resolvedSrc) return;

    const title = galleryItem.getAttribute("data-lightbox-title") || "";
    lastLightboxTrigger = galleryItem;

    lightboxImg.src = resolvedSrc;
    lightboxImg.alt = title || "LRF Ekipman Detay Görseli";
    lightboxTitle.textContent = title;

    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.touchAction = "none";

    lightbox.removeAttribute("inert");
    lightbox.classList.add("lrf-lightbox-overlay--active");
    lightbox.setAttribute("aria-hidden", "false");

    const closeBtn = document.getElementById("lrfLightboxClose");
    if (closeBtn) closeBtn.focus();
  };

  const closeLightbox = () => {
    if (lightbox && lightbox.classList.contains("lrf-lightbox-overlay--active")) {
      lightbox.classList.remove("lrf-lightbox-overlay--active");
      lightbox.setAttribute("aria-hidden", "true");
      lightbox.setAttribute("inert", "");

      document.documentElement.style.overflow = "";
      document.documentElement.style.touchAction = "";

      if (lastLightboxTrigger && typeof lastLightboxTrigger.focus === "function") {
        lastLightboxTrigger.focus();
        lastLightboxTrigger = null;
      }
    }
  };

  /* ── 4. BAĞIMSIZ SSS (FAQ) AKORDİYON MOTORU (ARIA + .is-open) ── */
  const toggleFaqEngine = (triggerElement) => {
    if (!triggerElement) return;

    const faqHolder = triggerElement.closest(".lrf-faq__box-holder");
    const currentItem = triggerElement.closest(".lrf-faq__item");
    if (!faqHolder || !currentItem) return;

    const isExpanded = triggerElement.getAttribute("aria-expanded") === "true";

    faqHolder.querySelectorAll(".lrf-faq__item.is-open").forEach((item) => {
      item.classList.remove("is-open");
      const btn = item.querySelector(".lrf-faq__trigger");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });

    if (!isExpanded) {
      triggerElement.setAttribute("aria-expanded", "true");
      currentItem.classList.add("is-open");
    }
  };

  /* ── 5. AKILLI ÇEREZ KALKANI SENSÖRÜ (GÜVENLİ LOCALSTORAGE & INERT + FOCUS RETURN) ── */
  const getCookieConsent = () => {
    try {
      return localStorage.getItem("lrf_cookie_accepted") === "true";
    } catch {
      return false;
    }
  };

  const setCookieConsent = () => {
    try {
      localStorage.setItem("lrf_cookie_accepted", "true");
    } catch {
      // Gizli sekme veya depolama kısıtlamasında sessizce devam et
    }
  };

  if (cookieBanner) {
    if (!getCookieConsent()) {
      setTimeout(() => {
        cookieBanner.removeAttribute("inert");
        cookieBanner.setAttribute("aria-hidden", "false");
        cookieBanner.classList.add("show");
      }, 1000);
    } else {
      cookieBanner.setAttribute("inert", "");
      cookieBanner.setAttribute("aria-hidden", "true");
    }
  }

  const acceptCookies = () => {
    if (cookieBanner) {
      const wasFocusedInside = cookieBanner.contains(document.activeElement);
      cookieBanner.classList.remove("show");
      cookieBanner.setAttribute("aria-hidden", "true");
      cookieBanner.setAttribute("inert", "");
      setCookieConsent();

      if (wasFocusedInside && mainContent) {
        focusTargetSection(mainContent, false);
      }
    }
  };

  /* ── 6. MOBİL HAMBURGER MENÜ KONTROL MOTORU (INERT & FOCUS RETURN DESTEKLİ) ── */
  const mobileMediaQuery = window.matchMedia("(max-width: 768px)");

  const syncMobileMenuAccessibility = (isOpen) => {
    if (!navMenu) return;
    if (mobileMediaQuery.matches) {
      if (isOpen) {
        navMenu.removeAttribute("inert");
        navMenu.setAttribute("aria-hidden", "false");
      } else {
        navMenu.setAttribute("inert", "");
        navMenu.setAttribute("aria-hidden", "true");
      }
    } else {
      navMenu.removeAttribute("inert");
      navMenu.removeAttribute("aria-hidden");
    }
  };

  const toggleMobileMenu = (forceClose = false, returnFocusToToggle = false) => {
    if (!toggleBtn || !navMenu) return;

    if (forceClose) {
      const wasOpen = navMenu.classList.contains("is-open");
      toggleBtn.setAttribute("aria-expanded", "false");
      toggleBtn.setAttribute("aria-label", "Menüyü Aç");
      navMenu.classList.remove("is-open");
      syncMobileMenuAccessibility(false);
      if (wasOpen && returnFocusToToggle) {
        toggleBtn.focus();
      }
      return;
    }

    const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
    const nextState = !isExpanded;
    toggleBtn.setAttribute("aria-expanded", String(nextState));
    toggleBtn.setAttribute("aria-label", nextState ? "Menüyü Kapat" : "Menüyü Aç");
    navMenu.classList.toggle("is-open", nextState);
    syncMobileMenuAccessibility(nextState);
  };

  // İlk yüklemede mobil menü kapalıysa inert kalkanını uygula
  syncMobileMenuAccessibility(false);

  if (mobileMediaQuery.addEventListener) {
    mobileMediaQuery.addEventListener("change", (e) => {
      if (!e.matches) {
        toggleMobileMenu(true, false);
        syncMobileMenuAccessibility(false);
      } else {
        const isCurrentlyOpen = navMenu && navMenu.classList.contains("is-open");
        syncMobileMenuAccessibility(Boolean(isCurrentlyOpen));
      }
    });
  }

  /* ── ⚡ MERKEZİ GLOBAL OLAY DELEGASYON KALKANI ── */
  document.body.addEventListener("click", (event) => {
    const target = event.target;
    if (!target) return;

    // A. Mobil Hamburger Menü Tetikleyicisi, İç Link ve Dış Alan Kapatma
    const mobileToggle = target.closest("#lrfMobileToggle");
    if (mobileToggle) {
      event.stopPropagation();
      toggleMobileMenu();
      return;
    }

    if (navMenu && navMenu.classList.contains("is-open")) {
      if (target.closest(".lrf-navbar__item") || !target.closest("#lrfNavbarMenu")) {
        toggleMobileMenu(true, false);
      }
    }

    // B. Tab Buton Tetikleyicisi
    const tabBtn = target.closest("[data-tab-type]");
    if (tabBtn) {
      event.preventDefault();
      handleTabSwitch(tabBtn, true);
      return;
    }

    // B2. Sayfa İçi (#) Çapa Linkleri ve Skip-Link İçin Garantili Klavye Odağı Transferi
    const hashLink = target.closest('a[href^="#"]');
    if (hashLink && !hashLink.hasAttribute("data-tab-type")) {
      const rawHash = hashLink.getAttribute("href");
      if (rawHash && rawHash.length > 1) {
        const targetId = rawHash.slice(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          event.preventDefault();
          focusTargetSection(targetEl, true);
          if (history.pushState) {
            history.pushState(null, "", rawHash);
          }
          return;
        }
      }
    }

    // C. Galeri Lightbox Açıcı Sensörler
    const galleryItem = target.closest("[data-lightbox-img]");
    if (galleryItem) {
      openLightbox(galleryItem);
      return;
    }

    // D. Lightbox Kapatma Butonu veya Dış Alan Kapatıcı Sensör
    if (target.closest("#lrfLightboxClose") || (target.closest("#lrf-lightbox") && !target.closest(".lrf-lightbox-wrapper"))) {
      closeLightbox();
      return;
    }

    // E. Genel Kart Akordiyon Eylemleri (Jig Head ve Balık Kartları - Tutarlı Tekil Açılış)
    const actionElement = target.closest("[data-action]");
    if (actionElement) {
      const action = actionElement.getAttribute("data-action");
      if (action === "toggle-jig" || action === "toggle-fish") {
        toggleCardAccordion(actionElement, true);
      }
      return;
    }

    // F. Çerez Kabul Butonu
    const cookieBtn = target.closest("#lrfCookieAcceptBtn");
    if (cookieBtn) {
      acceptCookies();
      return;
    }

    // G. SSS Akordiyon Tetikleyicisi
    const faqTrigger = target.closest(".lrf-faq__trigger");
    if (faqTrigger) {
      toggleFaqEngine(faqTrigger);
    }
  });

  // H. Klavye Erişilebilirliği (ESC + Focus Trap + Enter/Space Lightbox + Tablist Yön/Home/End Tuşları)
  document.addEventListener("keydown", (event) => {
    const isLightboxActive = lightbox && lightbox.classList.contains("lrf-lightbox-overlay--active");
    const isMobileMenuOpen = navMenu && navMenu.classList.contains("is-open");

    if (event.key === "Escape") {
      if (isLightboxActive) {
        event.preventDefault();
        closeLightbox();
        return;
      }
      if (isMobileMenuOpen) {
        event.preventDefault();
        toggleMobileMenu(true, true);
        return;
      }
      return;
    }

    // Lightbox Açıkken Klavye Odağını İçeride Hapseden Focus Trap Kalkanı
    if (isLightboxActive && event.key === "Tab") {
      const focusableInLightbox = Array.from(lightbox.querySelectorAll('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'));
      if (focusableInLightbox.length > 0) {
        const firstEl = focusableInLightbox[0];
        const lastEl = focusableInLightbox[focusableInLightbox.length - 1];
        if (event.shiftKey && document.activeElement === firstEl) {
          event.preventDefault();
          lastEl.focus();
        } else if (!event.shiftKey && document.activeElement === lastEl) {
          event.preventDefault();
          firstEl.focus();
        } else if (!lightbox.contains(document.activeElement)) {
          event.preventDefault();
          firstEl.focus();
        }
      }
      return;
    }

    const activeEl = document.activeElement;
    if (!activeEl) return;

    if (event.key === "Enter" || event.key === " ") {
      if (activeEl.hasAttribute("data-lightbox-img")) {
        event.preventDefault();
        openLightbox(activeEl);
        return;
      }
    }

    if ((event.key === "ArrowRight" || event.key === "ArrowLeft" || event.key === "Home" || event.key === "End") && activeEl.getAttribute("role") === "tab") {
      const tabList = activeEl.closest('[role="tablist"]');
      if (!tabList) return;
      const tabs = Array.from(tabList.querySelectorAll('[role="tab"]'));
      const currentIndex = tabs.indexOf(activeEl);
      if (currentIndex === -1) return;

      event.preventDefault();
      let nextIndex = currentIndex;
      if (event.key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % tabs.length;
      } else if (event.key === "ArrowLeft") {
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = tabs.length - 1;
      }

      const nextTab = tabs[nextIndex];
      if (nextTab) {
        nextTab.focus();
        handleTabSwitch(nextTab, false);
      }
    }
  });
});
/* ==========================================================================
   GOOGLE ANALYTICS 4 (G-GGELV2X6X1) - KVKK & 100 PAGESPEED DOSTU YÜKLEME
   ========================================================================== */
(function () {
  const GA_MEASUREMENT_ID = "G-GGELV2X6X1";
  let gaLoaded = false;

  function loadGoogleAnalytics() {
    if (gaLoaded) return;
    gaLoaded = true;

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID, {
      anonymize_ip: true,
      cookie_flags: "SameSite=None;Secure",
    });

    const script = document.createElement("script");
    script.src = ["https://googletagmanager.com", "/gtag/js?id=", GA_MEASUREMENT_ID].join("");
    script.async = true;
    document.head.appendChild(script);
  }

  let hasConsent = false;
  try {
    hasConsent = localStorage.getItem("lrf_cookie_accepted") === "true";
  } catch (e) {}

  if (hasConsent) {
    ["scroll", "mousemove", "touchstart", "keydown"].forEach(function (evt) {
      window.addEventListener(evt, loadGoogleAnalytics, { once: true, passive: true });
    });
  }

  document.addEventListener("click", function (e) {
    if (e.target && e.target.closest("#lrfCookieAcceptBtn")) {
      loadGoogleAnalytics();
    }
  });
})();

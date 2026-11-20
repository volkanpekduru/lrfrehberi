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
  ".lrf-video-facade",
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

  /* ── 4B. 100 PAGESPEED LITE YOUTUBE FACADE MOTORU (YOUTUBE-NOCOOKIE) ── */
  const activateLiteYoutubeFacade = (facadeElement) => {
    if (!facadeElement || facadeElement.classList.contains("lrf-video-facade--loaded")) return;

    const rawVideoId = (facadeElement.getAttribute("data-video-id") || "").trim();
    if (!rawVideoId) return;

    const videoTitle = (facadeElement.getAttribute("data-video-title") || "LRF Akademi Eğitim Videosu").trim();

    const iframe = document.createElement("iframe");
    iframe.className = "lrf-video-facade__iframe";
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(rawVideoId)}?autoplay=1&rel=0&modestbranding=1`;
    iframe.title = videoTitle;
    iframe.loading = "lazy";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allowFullscreen = true;

    facadeElement.classList.add("lrf-video-facade--loaded");
    facadeElement.replaceChildren(iframe);
  };

  /* ── 5. AKILLI ÇEREZ KALKANI SENSÖRÜ (KABUL ET / REDDET + CONSENT MODE V2) ── */
  const getCookieDecision = () => {
    try {
      const decision = localStorage.getItem("lrf_cookie_consent");
      if (decision === "accepted" || decision === "rejected") return decision;
      if (localStorage.getItem("lrf_cookie_accepted") === "true") return "accepted";
      return null;
    } catch {
      return null;
    }
  };

  const saveCookieDecision = (decision) => {
    try {
      localStorage.setItem("lrf_cookie_consent", decision);
      if (decision === "accepted") {
        localStorage.setItem("lrf_cookie_accepted", "true");
      } else {
        localStorage.removeItem("lrf_cookie_accepted");
      }
    } catch {
      // Gizli sekme veya depolama kısıtlamasında sessizce devam et
    }
  };

  if (cookieBanner) {
    if (!getCookieDecision()) {
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

  const handleCookieDecision = (decision) => {
    if (cookieBanner) {
      const wasFocusedInside = cookieBanner.contains(document.activeElement);
      cookieBanner.classList.remove("show");
      cookieBanner.setAttribute("aria-hidden", "true");
      cookieBanner.setAttribute("inert", "");
      saveCookieDecision(decision);

      if (typeof window.__lrfUpdateGaConsent === "function") {
        window.__lrfUpdateGaConsent(decision === "accepted");
      }

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

    // B3. 100 PageSpeed Lite YouTube Facade Oynatıcısı
    const videoFacade = target.closest(".lrf-video-facade");
    if (videoFacade && !videoFacade.classList.contains("lrf-video-facade--loaded")) {
      event.preventDefault();
      activateLiteYoutubeFacade(videoFacade);
      return;
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

    // F. Çerez Kabul ve Reddet Butonları
    const cookieAcceptBtn = target.closest("#lrfCookieAcceptBtn");
    if (cookieAcceptBtn) {
      handleCookieDecision("accepted");
      return;
    }

    const cookieRejectBtn = target.closest("#lrfCookieRejectBtn");
    if (cookieRejectBtn) {
      handleCookieDecision("rejected");
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
   GOOGLE ANALYTICS 4 (G-GGELV2X6X1) - CONSENT MODE V2 & 100 PAGESPEED UYUMLU
   ========================================================================== */
(function () {
  const GA_MEASUREMENT_ID = "G-GGELV2X6X1";

  function hasAcceptedCookies() {
    try {
      return localStorage.getItem("lrf_cookie_consent") === "accepted" || localStorage.getItem("lrf_cookie_accepted") === "true";
    } catch {
      return false;
    }
  }

  function ensureGtagStub() {
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function () {
        window.dataLayer.push(arguments);
      };
  }

  function initGoogleAnalytics() {
    if (window.__lrfGaInitialized) return;
    window.__lrfGaInitialized = true;

    ensureGtagStub();

    const granted = hasAcceptedCookies();
    window.gtag("consent", "default", {
      analytics_storage: granted ? "granted" : "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });

    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, {
      anonymize_ip: true,
      cookie_flags: "SameSite=None;Secure",
    });

    if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
      const script = document.createElement("script");
      script.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID;
      script.async = true;
      document.head.appendChild(script);
    }
  }

  // Kabul Et / Reddet tıklandığında GA4 izin durumunu anında güncelle
  window.__lrfUpdateGaConsent = function (isAccepted) {
    if (!window.__lrfGaInitialized) {
      initGoogleAnalytics();
    }
    ensureGtagStub();
    window.gtag("consent", "update", {
      analytics_storage: isAccepted ? "granted" : "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  };

  function scheduleAnalyticsLoad() {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(initGoogleAnalytics, { timeout: 1500 });
    } else {
      window.setTimeout(initGoogleAnalytics, 1500);
    }
  }

  if (document.readyState === "complete") {
    scheduleAnalyticsLoad();
  } else {
    window.addEventListener("load", scheduleAnalyticsLoad, { once: true });
  }
})();
/* ==========================================================================
   🧭 PRATİK BİLGİLER: CANLI MERA ANALİZİ, AY EVRESİ VE ÇANTA LİSTESİ MOTORU
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  /* ── 1. AY EVRESİ & GECE RENGİ HESAPLAYICISI (SAF JS - SIFIR AĞ İSTEĞİ) ── */
  const moonEmojiEl = document.getElementById("lrfMoonEmoji");
  const moonDateEl = document.getElementById("lrfMoonDate");
  const moonPhaseNameEl = document.getElementById("lrfMoonPhaseName");
  const moonIllumEl = document.getElementById("lrfMoonIllum");
  const moonStrategyBadgeEl = document.getElementById("lrfMoonStrategyBadge");
  const moonColorTitleEl = document.getElementById("lrfMoonColorTitle");
  const moonColorDescEl = document.getElementById("lrfMoonColorDesc");
  const moonColorTagsEl = document.getElementById("lrfMoonColorTags");

  if (moonPhaseNameEl && moonIllumEl) {
    const now = new Date();
    const SYNODIC_MONTH = 29.53058867;
    // Referans Yeni Ay: 6 Ocak 2000 18:14 UTC
    const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14, 0);
    const diffDays = (now.getTime() - KNOWN_NEW_MOON) / 86400000;
    const cyclePos = ((diffDays % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
    const phaseRatio = cyclePos / SYNODIC_MONTH;
    const illumination = Math.round(((1 - Math.cos(2 * Math.PI * phaseRatio)) / 2) * 100);

    let phaseName = "Dolunay";
    let phaseEmoji = "🌕";

    if (phaseRatio < 0.03 || phaseRatio >= 0.97) {
      phaseName = "Yeni Ay";
      phaseEmoji = "🌑";
    } else if (phaseRatio < 0.22) {
      phaseName = "Hilal (Büyüyen)";
      phaseEmoji = "🌒";
    } else if (phaseRatio < 0.28) {
      phaseName = "İlk Dördün";
      phaseEmoji = "🌓";
    } else if (phaseRatio < 0.47) {
      phaseName = "Şişkin Ay (Büyüyen)";
      phaseEmoji = "🌔";
    } else if (phaseRatio < 0.53) {
      phaseName = "Dolunay";
      phaseEmoji = "🌕";
    } else if (phaseRatio < 0.72) {
      phaseName = "Şişkin Ay (Küçülen)";
      phaseEmoji = "🌖";
    } else if (phaseRatio < 0.78) {
      phaseName = "Son Dördün";
      phaseEmoji = "🌗";
    } else {
      phaseName = "Hilal (Küçülen)";
      phaseEmoji = "🌘";
    }

    let strategyBadge = "Hibrit Gece Stratejisi";
    let colorTitle = "Yüksek Kontrast: Glow Pembe + UV Beyaz";
    let colorDesc = "Yarı aydınlık gecede balıklar hem hafif ışığa hem siluete tepki verir. UV fenerle kısa şarj edilmiş pembe/beyaz silikonlar ve liman gölgelerinde mor tonlar en yüksek verimi sunar.";
    let tags = [
      { label: "UV Pembe", cls: "lrf-badge--uv-pink" },
      { label: "Glow Beyaz", cls: "lrf-badge--glow" },
      { label: "UV Chartreuse", cls: "lrf-badge--uv-chartreuse" },
    ];

    if (illumination <= 30) {
      strategyBadge = "Karanlık Gece • Glow & UV Öncelikli";
      colorTitle = "Glow (Fosforlu) ve Parlak UV Renkler";
      colorDesc = "Ay ışığı çok düşük olduğu için su altı karanlıktır. Balığın yemi fark etmesi için UV fenerle şarj edilmiş Glow (fosforlu) beyaz, pembe veya chartreuse kokulu silikonları 1–2 gr jig head ile yavaşça sunun.";
      tags = [
        { label: "Glow (Fosforlu)", cls: "lrf-badge--glow" },
        { label: "UV Beyaz", cls: "lrf-badge--uv-white" },
        { label: "UV Pembe", cls: "lrf-badge--uv-pink" },
        { label: "Chartreuse", cls: "lrf-badge--chartreuse" },
      ];
    } else if (illumination >= 70) {
      strategyBadge = "Parlak Ay Işığı • Koyu Siluet Öncelikli";
      colorTitle = "Koyu Siluet (Siyah / Mor) ve Şeffaf Simli";
      colorDesc = "Güçlü ay ışığı su yüzeyini aydınlatır; aşırı parlak glow yemler balığı ürkütebilir. Gökyüzüne karşı keskin siluet veren siyah, koyu mor veya doğal şeffaf gümüş simli silikonlara geçin.";
      tags = [
        { label: "Siyah Siluet", cls: "lrf-badge--black" },
        { label: "Koyu Mor", cls: "lrf-badge--purple" },
        { label: "Siyah/Mavi", cls: "lrf-badge--black-blue" },
        { label: "Şeffaf Simli", cls: "lrf-badge--transparent" },
      ];
    }

    if (moonDateEl) {
      moonDateEl.textContent = now.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
    }
    if (moonEmojiEl) moonEmojiEl.textContent = phaseEmoji;
    moonPhaseNameEl.textContent = phaseName;
    moonIllumEl.textContent = `Doluluk: %${illumination}`;
    if (moonStrategyBadgeEl) moonStrategyBadgeEl.textContent = strategyBadge;
    if (moonColorTitleEl) moonColorTitleEl.textContent = colorTitle;
    if (moonColorDescEl) moonColorDescEl.textContent = colorDesc;

    if (moonColorTagsEl) {
      moonColorTagsEl.replaceChildren();
      tags.forEach((tag) => {
        const span = document.createElement("span");
        span.className = `lrf-badge lrf-badge--xs ${tag.cls}`;
        span.textContent = tag.label;
        moonColorTagsEl.appendChild(span);
      });
    }
  }

  /* ── 2. CANLI MERA HAVA & DENİZ ANALİZİ (OPEN-METEO - KONUM VEYA ŞEHİR) ── */
  const fetchSpotBtn = document.getElementById("lrfFetchSpotBtn");
  const citySelectEl = document.getElementById("lrfCitySelect");
  const spotStatusEl = document.getElementById("lrfSpotStatus");
  const windSpeedEl = document.getElementById("lrfMetricWindSpeed");
  const windDirEl = document.getElementById("lrfMetricWindDir");
  const tempEl = document.getElementById("lrfMetricTemp");
  const waveEl = document.getElementById("lrfMetricWave");
  const adviceBadgeEl = document.getElementById("lrfAdviceBadge");
  const adviceTitleEl = document.getElementById("lrfAdviceTitle");
  const adviceTextEl = document.getElementById("lrfAdviceText");

  const getCompassDirection = (deg) => {
    if (typeof deg !== "number" || Number.isNaN(deg)) return "--";
    const dirs = ["Kuzey (K)", "Kuzeydoğu (KD)", "Doğu (D)", "Güneydoğu (GD)", "Güney (G)", "Güneybatı (GB)", "Batı (B)", "Kuzeybatı (KB)"];
    return dirs[Math.round((deg % 360) / 45) % 8];
  };

  const buildLrfTackleAdvice = (windSpeed, waveHeight) => {
    const wave = typeof waveHeight === "number" && !Number.isNaN(waveHeight) ? waveHeight : 0;

    if (windSpeed >= 26 || wave >= 1.2) {
      return {
        badge: "Sert Hava • Ağır LRF / Güvenlik Öncelikli",
        badgeClass: "lrf-badge lrf-badge--red lrf-badge--sm",
        title: "5–10 gr Mikro Metal Jig veya Korunaklı Liman İçi",
        desc: "Rüzgar veya dalga yüksekliği klasik 1–2 gr silikon sunumunu zorlaştırır. Açık kayalıklardan uzak durup rüzgarı arkaya alan liman içlerine yönelin; 5–8 gr mikro metal jig, 0.18–0.20 mm florokarbon lider ve düşük açılı atış tercih edin.",
      };
    }

    if (windSpeed >= 15 || wave >= 0.6) {
      return {
        badge: "Orta Rüzgar & Çalkantı • Aktif Av Koşulu",
        badgeClass: "lrf-badge lrf-badge--orange lrf-badge--sm",
        title: "2.5–5 gr Jig Head / Mikro Jig + Titreşimli Silikon",
        desc: "Kıyıdaki çalkantı oksijeni artırarak levrek, mırmır ve istavriti kıyıya çeker. İp balonunu önlemek için 2.5–4 gr jig head veya 3–5 gr metal jig kullanın; kamış ucunu suya yakın tutarak feathering (parmak freni) ile atış yapın.",
      };
    }

    if (windSpeed >= 8 || wave >= 0.3) {
      return {
        badge: "İdeal LRF Koşulu • Dengeli Sunum",
        badgeClass: "lrf-badge lrf-badge--teal lrf-badge--sm",
        title: "1.5–2.5 gr Jig Head + 4–5 cm Kokulu Silikon",
        desc: "Hafif meltem ve düşük dalga LRF için altın dengedir. PE #0.2–#0.4 ip, 0.16 mm lider ve 1.5–2.5 gr Round veya Dart Head ile hem orta su hem dip taramasında yüksek hissiyat elde edersiniz.",
      };
    }

    return {
      badge: "Sakin Deniz • Ultra Hafif Finesse",
      badgeClass: "lrf-badge lrf-badge--cyan lrf-badge--sm",
      title: "0.8–1.5 gr Mikro Jig Head + İnce Silikon",
      desc: "Deniz çarşaf gibi sakin. Balıklar sesi ve kalın misinayı kolayca fark eder; 0.14 mm ince florokarbon lider, 0.8–1.5 gr ultra hafif jig head ve sarkaç/yandan atışla sessiz sunum yapın.",
    };
  };

  const fetchSpotAnalysis = async (lat, lon, label) => {
    if (!spotStatusEl) return;

    if (fetchSpotBtn) fetchSpotBtn.disabled = true;
    if (citySelectEl) citySelectEl.disabled = true;
    spotStatusEl.classList.remove("lrf-tool-status--error");
    spotStatusEl.textContent = `${label} için Open-Meteo hava ve deniz verileri çekiliyor...`;

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,wind_direction_10m&wind_speed_unit=kmh&timezone=auto`;
    const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&current=wave_height&timezone=auto`;

    try {
      const [weatherRes, marineRes] = await Promise.all([fetch(weatherUrl), fetch(marineUrl).catch(() => null)]);

      if (!weatherRes.ok) {
        throw new Error("Hava durumu servisine ulaşılamadı.");
      }

      const weatherData = await weatherRes.json();
      const marineData = marineRes && marineRes.ok ? await marineRes.json() : null;

      const currentWeather = weatherData && weatherData.current ? weatherData.current : null;
      if (!currentWeather) {
        throw new Error("Anlık meteoroloji verisi alınamadı.");
      }

      const windSpeed = Number(currentWeather.wind_speed_10m);
      const windDir = Number(currentWeather.wind_direction_10m);
      const temp = Number(currentWeather.temperature_2m);
      const rawWave = marineData && marineData.current ? marineData.current.wave_height : null;
      const waveHeight = rawWave !== null && rawWave !== undefined ? Number(rawWave) : null;

      if (windSpeedEl) windSpeedEl.textContent = `${windSpeed.toFixed(1)} km/s`;
      if (windDirEl) windDirEl.textContent = `${getCompassDirection(windDir)} (${Math.round(windDir)}°)`;
      if (tempEl) tempEl.textContent = `${temp.toFixed(1)} °C`;
      if (waveEl) waveEl.textContent = waveHeight !== null && !Number.isNaN(waveHeight) ? `${waveHeight.toFixed(2)} m` : "Kıyı dışı / Veri yok";

      const advice = buildLrfTackleAdvice(windSpeed, waveHeight);
      if (adviceBadgeEl) {
        adviceBadgeEl.className = advice.badgeClass;
        adviceBadgeEl.textContent = advice.badge;
      }
      if (adviceTitleEl) adviceTitleEl.textContent = advice.title;
      if (adviceTextEl) adviceTextEl.textContent = advice.desc;

      const updatedTime = new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
      spotStatusEl.textContent = `${label} analizi güncellendi (${updatedTime})`;
    } catch {
      spotStatusEl.textContent = "Veriler çekilirken bir bağlantı sorunu oluştu. Lütfen internetinizi kontrol edip tekrar deneyin.";
      spotStatusEl.classList.add("lrf-tool-status--error");
    } finally {
      if (fetchSpotBtn) fetchSpotBtn.disabled = false;
      if (citySelectEl) citySelectEl.disabled = false;
    }
  };

  if (fetchSpotBtn && spotStatusEl) {
    fetchSpotBtn.addEventListener("click", () => {
      if (!("geolocation" in navigator)) {
        spotStatusEl.textContent = "Tarayıcınız konum özelliğini desteklemiyor. Listeden bir kıyı şehri seçebilirsiniz.";
        spotStatusEl.classList.add("lrf-tool-status--error");
        return;
      }

      if (citySelectEl) citySelectEl.value = "";
      fetchSpotBtn.disabled = true;
      spotStatusEl.classList.remove("lrf-tool-status--error");
      spotStatusEl.textContent = "Konum izni bekleniyor...";

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(4);
          const lon = position.coords.longitude.toFixed(4);
          fetchSpotAnalysis(lat, lon, `Konumunuz (${lat}, ${lon})`);
        },
        (error) => {
          fetchSpotBtn.disabled = false;
          spotStatusEl.classList.add("lrf-tool-status--error");
          if (error.code === error.PERMISSION_DENIED) {
            spotStatusEl.textContent = "Konum izni reddedildi. Sağdaki listeden bir kıyı şehri seçerek konumsuz analiz alabilirsiniz.";
          } else {
            spotStatusEl.textContent = "Konumunuz alınamadı. Sağdaki listeden bir kıyı şehri seçebilirsiniz.";
          }
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
      );
    });
  }

  if (citySelectEl) {
    citySelectEl.addEventListener("change", () => {
      const val = citySelectEl.value;
      if (!val) return;
      const [lat, lon] = val.split(",");
      const cityLabel = citySelectEl.options[citySelectEl.selectedIndex].text;
      if (lat && lon) {
        fetchSpotAnalysis(lat, lon, cityLabel);
      }
    });
  }

  /* ── 3. MERAYA ÇIKMADAN ÖNCE ÇANTA KONTROL LİSTESİ (LOCALSTORAGE) ── */
  const checklistEl = document.getElementById("lrfBagChecklist");
  const checklistCountEl = document.getElementById("lrfChecklistCount");
  const checklistResetBtn = document.getElementById("lrfChecklistReset");
  const STORAGE_KEY = "lrf_bag_checklist_v1";

  if (checklistEl) {
    const checkboxes = Array.from(checklistEl.querySelectorAll(".lrf-checklist__input"));

    const loadSavedChecklist = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
      } catch {
        return {};
      }
    };

    const saveChecklist = (stateObj) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateObj));
      } catch {
        // Depolama kısıtlamasında sessizce devam et
      }
    };

    const syncChecklistUI = () => {
      let checkedCount = 0;
      const stateObj = {};

      checkboxes.forEach((box) => {
        const key = box.getAttribute("data-check-id");
        const item = box.closest(".lrf-checklist__item");
        if (box.checked) {
          checkedCount += 1;
          if (item) item.classList.add("is-checked");
        } else if (item) {
          item.classList.remove("is-checked");
        }
        if (key) stateObj[key] = box.checked;
      });

      if (checklistCountEl) {
        checklistCountEl.textContent = `${checkedCount} / ${checkboxes.length} Hazır`;
      }
      saveChecklist(stateObj);
    };

    const savedState = loadSavedChecklist();
    checkboxes.forEach((box) => {
      const key = box.getAttribute("data-check-id");
      if (key && savedState[key]) {
        box.checked = true;
      }
      box.addEventListener("change", syncChecklistUI);
    });
    syncChecklistUI();

    if (checklistResetBtn) {
      checklistResetBtn.addEventListener("click", () => {
        checkboxes.forEach((box) => {
          box.checked = false;
        });
        syncChecklistUI();
      });
    }
  }
});
/* ==========================================================================
   💬 LRF AKADEMİ: 100 PAGESPEED LAZY LOAD GISCUS YORUM MOTORU
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const giscusContainer = document.querySelector(".lrf-giscus-wrapper .giscus");
  if (!giscusContainer) return;

  let isGiscusLoaded = false;

  const loadGiscusEngine = () => {
    if (isGiscusLoaded) return;
    isGiscusLoaded = true;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "volkanpekduru/lrfrehberi");
    script.setAttribute("data-repo-id", "R_kgDOV0rBYA");
    script.setAttribute("data-category", "Announcements");
    script.setAttribute("data-category-id", "DIC_kwDOV0rBYM4DLjK3");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "1");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", "light");
    script.setAttribute("data-lang", "tr");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    giscusContainer.appendChild(script);
  };

  if ("IntersectionObserver" in window) {
    const giscusObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadGiscusEngine();
            observer.disconnect();
          }
        });
      },
      { rootMargin: "350px 0px" },
    );
    giscusObserver.observe(giscusContainer);
  } else {
    loadGiscusEngine();
  }
});

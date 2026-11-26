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

const MOBILE_HOVER_SELECTORS = [".lrf-grid-card", ".lrf-start-card", ".lrf-premium-info-card", ".lrf-zigzag__row", ".lrf-zigzag__list-item--boxed", ".lrf-video-facade", ".lrf-layers-row", ".lrf-strategy-panel", ".lrf-puffer-alert-wrap"].join(", ");

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

    // Yatay taşan sticky çizgi sekme çubuğunda aktif sekmeyi ortala (dikey kaydırmayı etkilemez)
    if (
      container &&
      container.classList.contains("lrf-tab-system-container--line") &&
      container.scrollWidth > container.clientWidth + 1
    ) {
      const containerRect = container.getBoundingClientRect();
      const btnRect = targetBtn.getBoundingClientRect();
      const targetLeft =
        container.scrollLeft +
        (btnRect.left - containerRect.left) -
        (container.clientWidth - btnRect.width) / 2;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const clampedLeft = Math.max(0, Math.min(targetLeft, maxScrollLeft));

      container.scrollTo({
        left: clampedLeft,
        behavior: reducedMotionQuery.matches ? "auto" : "smooth",
      });
    }
  };

  // İlk yüklemede pasif sekme panellerini hayalet odaktan (Ghost Focus) koru
  allTabGroups.forEach((group) => {
    if (group.classList.contains("lrf-tab-system-group--active")) {
      group.removeAttribute("inert");
    } else {
      group.setAttribute("inert", "");
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
      });

      const targetGal = document.getElementById(`lrf-tab-system-group-${tabTargetId}`);
      const targetContent = document.getElementById(`lrf-tab-system-group-content-${tabTargetId}`);

      if (targetGal) {
        targetGal.classList.add("lrf-tab-system-group--active");
        targetGal.removeAttribute("inert");
        const targetGalBox = targetGal.querySelector(".lrf-jig-gallery");
        if (targetGalBox) {
          targetGalBox.setAttribute("data-active-color", tabTargetId);
        }
      }

      if (targetContent) {
        targetContent.classList.add("lrf-tab-system-group--active");
        targetContent.removeAttribute("inert");
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

  /* ── 2B. AKORDİYON KARTLARI İÇİN ESNEK KAPALI YÜKSEKLİK EŞİTLEME MOTORU ── */
  const accordionMatrices = Array.from(document.querySelectorAll(".lrf-grid-matrix")).filter((matrix) =>
    matrix.querySelector(".lrf-jig-card__panel, .lrf-fish-card__panel"),
  );

  const syncAccordionCardHeights = () => {
    if (!accordionMatrices.length) return;
    const isSingleColumn = window.innerWidth <= 600;

    accordionMatrices.forEach((matrix) => {
      if (isSingleColumn) {
        matrix.style.removeProperty("--lrf-acc-card-min-h");
        return;
      }

      const cards = Array.from(matrix.children).filter((el) => el.classList.contains("lrf-grid-card"));
      if (!cards.length) return;

      matrix.style.removeProperty("--lrf-acc-card-min-h");

      let maxClosedHeight = 0;
      cards.forEach((card) => {
        let closedH = card.offsetHeight;
        if (card.classList.contains("is-open")) {
          const openPanel = card.querySelector(".lrf-jig-card__panel, .lrf-fish-card__panel");
          if (openPanel) {
            const panelStyle = window.getComputedStyle(openPanel);
            const panelMarginTop = parseFloat(panelStyle.marginTop) || 0;
            closedH = Math.max(0, closedH - (openPanel.offsetHeight + panelMarginTop));
          }
        }
        if (closedH > maxClosedHeight) {
          maxClosedHeight = closedH;
        }
      });

      if (maxClosedHeight > 0) {
        matrix.style.setProperty("--lrf-acc-card-min-h", `${Math.ceil(maxClosedHeight)}px`);
      }
    });
  };

  if (accordionMatrices.length) {
    syncAccordionCardHeights();

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(syncAccordionCardHeights);
    }

    if ("ResizeObserver" in window) {
      const lastWidths = new WeakMap();
      let rafId = null;
      const matrixResizeObserver = new ResizeObserver((entries) => {
        let widthChanged = false;
        entries.forEach((entry) => {
          const w = Math.round(entry.contentRect.width);
          if (lastWidths.get(entry.target) !== w) {
            lastWidths.set(entry.target, w);
            widthChanged = true;
          }
        });
        if (!widthChanged) return;
        if (rafId) window.cancelAnimationFrame(rafId);
        rafId = window.requestAnimationFrame(() => {
          rafId = null;
          syncAccordionCardHeights();
        });
      });
      accordionMatrices.forEach((matrix) => {
        lastWidths.set(matrix, Math.round(matrix.getBoundingClientRect().width));
        matrixResizeObserver.observe(matrix);
      });
    } else {
      window.addEventListener("resize", syncAccordionCardHeights);
    }
  }

  /* ── 3. KÜRESEL LIGHTBOX POPUP MOTORU (FOCUS TRAP, ARKA PLAN INERT & FOCUS RETURN) ── */
  let lastLightboxTrigger = null;
  let lightboxInertElements = [];

  const setLightboxBackgroundInert = (shouldInert) => {
    if (shouldInert) {
      lightboxInertElements = [];
      Array.from(document.body.children).forEach((child) => {
        if (child === lightbox || child.tagName === "SCRIPT" || child.hasAttribute("inert")) {
          return;
        }
        child.setAttribute("inert", "");
        lightboxInertElements.push(child);
      });
    } else {
      lightboxInertElements.forEach((el) => {
        el.removeAttribute("inert");
      });
      lightboxInertElements = [];
    }
  };

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

    setLightboxBackgroundInert(true);
    lightbox.removeAttribute("inert");
    lightbox.classList.add("lrf-lightbox-overlay--active");

    const closeBtn = document.getElementById("lrfLightboxClose");
    if (closeBtn) closeBtn.focus();
  };

  const closeLightbox = () => {
    if (lightbox && lightbox.classList.contains("lrf-lightbox-overlay--active")) {
      lightbox.classList.remove("lrf-lightbox-overlay--active");
      lightbox.setAttribute("inert", "");
      setLightboxBackgroundInert(false);

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
  const parseVideoSeconds = (value) => {
    if (value === null) return null;
    const trimmed = value.trim();
    if (!/^\d+$/.test(trimmed)) return null;
    const seconds = Number.parseInt(trimmed, 10);
    return Number.isSafeInteger(seconds) ? seconds : null;
  };

  const liteYoutubeOriginalNodes = new WeakMap();

  const resetActiveLiteYoutubeFacades = (excludeElement = null) => {
    document.querySelectorAll(".lrf-video-facade.lrf-video-facade--loaded").forEach((activeFacade) => {
      if (activeFacade === excludeElement) return;

      const activeIframe = activeFacade.querySelector("iframe");
      if (activeIframe) {
        activeIframe.src = "about:blank";
        activeIframe.remove();
      }

      const originalNodes = liteYoutubeOriginalNodes.get(activeFacade);
      if (originalNodes) {
        activeFacade.replaceChildren(...originalNodes.map((node) => node.cloneNode(true)));
      } else {
        activeFacade.replaceChildren();
      }

      activeFacade.classList.remove("lrf-video-facade--loaded");
    });
  };

  const activateLiteYoutubeFacade = (facadeElement) => {
    if (!facadeElement || facadeElement.classList.contains("lrf-video-facade--loaded")) return;

    const rawVideoId = (facadeElement.getAttribute("data-video-id") || "").trim();
    if (!rawVideoId || !/^[A-Za-z0-9_-]{11}$/.test(rawVideoId)) {
      return;
    }

    resetActiveLiteYoutubeFacades(facadeElement);

    if (!liteYoutubeOriginalNodes.has(facadeElement)) {
      liteYoutubeOriginalNodes.set(
        facadeElement,
        Array.from(facadeElement.childNodes, (node) => node.cloneNode(true)),
      );
    }

    const videoTitle = (facadeElement.getAttribute("data-video-title") || "LRF Akademi Eğitim Videosu").trim();
    const startSec = parseVideoSeconds(facadeElement.getAttribute("data-start"));
    const endSec = parseVideoSeconds(facadeElement.getAttribute("data-end"));

    const params = new URLSearchParams({
      autoplay: "1",
      rel: "0",
    });

    if (startSec !== null && startSec > 0) {
      params.set("start", String(startSec));
    }
    if (endSec !== null && endSec > (startSec ?? 0)) {
      params.set("end", String(endSec));
    }

    const iframe = document.createElement("iframe");
    iframe.className = "lrf-video-facade__iframe";
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(rawVideoId)}?${params.toString()}`;
    iframe.title = videoTitle;
    iframe.loading = "lazy";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allowFullscreen = true;

    iframe.setAttribute("tabindex", "-1");
    facadeElement.classList.add("lrf-video-facade--loaded");
    facadeElement.replaceChildren(iframe);
    iframe.focus({ preventScroll: true });
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
        cookieBanner.classList.add("show");
      }, 1000);
    } else {
      cookieBanner.setAttribute("inert", "");
    }
  }

  const handleCookieDecision = (decision) => {
    if (cookieBanner) {
      const wasFocusedInside = cookieBanner.contains(document.activeElement);
      cookieBanner.classList.remove("show");
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
      } else {
        navMenu.setAttribute("inert", "");
      }
    } else {
      navMenu.removeAttribute("inert");
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

    // E. Genel Kart Akordiyon ve Çerez Tercihi Yönetimi Eylemleri
    const actionElement = target.closest("[data-action]");
    if (actionElement) {
      const action = actionElement.getAttribute("data-action");
      if (action === "toggle-jig" || action === "toggle-fish") {
        toggleCardAccordion(actionElement, true);
      } else if (action === "manage-cookies" && cookieBanner) {
        cookieBanner.removeAttribute("inert");
        cookieBanner.classList.add("show");
        const acceptBtn = document.getElementById("lrfCookieAcceptBtn");
        if (acceptBtn) acceptBtn.focus();
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

  // Kabul Et / Reddet tıklandığında GA4 yükleme ve izin durumunu yönet
  window.__lrfUpdateGaConsent = function (isAccepted) {
    if (isAccepted) {
      if (!window.__lrfGaInitialized) {
        initGoogleAnalytics();
      }
      ensureGtagStub();
      window.gtag("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
    } else if (window.__lrfGaInitialized) {
      ensureGtagStub();
      window.gtag("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
    }
  };

  function scheduleAnalyticsLoad() {
    if (!hasAcceptedCookies()) return;
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
    // Referans Yeni Ay: 9 Kasım 2026 07:02 UTC (Yüksek hassasiyetli güncel referans)
    const KNOWN_NEW_MOON = Date.UTC(2026, 10, 9, 7, 2, 0);
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
    } else if (phaseRatio < 0.465) {
      phaseName = "Şişkin Ay (Büyüyen)";
      phaseEmoji = "🌔";
    } else if (phaseRatio <= 0.535) {
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
        title: "5–8 gr Mikro Metal Jig veya Korunaklı Liman İçi",
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

      const windSpeed = currentWeather.wind_speed_10m != null ? Number(currentWeather.wind_speed_10m) : Number.NaN;
      const windDir = currentWeather.wind_direction_10m != null ? Number(currentWeather.wind_direction_10m) : Number.NaN;
      const temp = currentWeather.temperature_2m != null ? Number(currentWeather.temperature_2m) : Number.NaN;
      const rawWave = marineData && marineData.current ? marineData.current.wave_height : null;
      const waveHeight = rawWave !== null && rawWave !== undefined ? Number(rawWave) : null;

      if (windSpeedEl) windSpeedEl.textContent = !Number.isNaN(windSpeed) ? `${windSpeed.toFixed(1)} km/s` : "--";
      if (windDirEl) windDirEl.textContent = !Number.isNaN(windDir) ? `${getCompassDirection(windDir)} (${Math.round(windDir)}°)` : "--";
      if (tempEl) tempEl.textContent = !Number.isNaN(temp) ? `${temp.toFixed(1)} °C` : "--";
      if (waveEl) waveEl.textContent = waveHeight !== null && !Number.isNaN(waveHeight) ? `${waveHeight.toFixed(2)} m` : "Kıyı dışı / Veri yok";

      const advice = buildLrfTackleAdvice(!Number.isNaN(windSpeed) ? windSpeed : 0, waveHeight);
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

      if (citySelectEl) {
        citySelectEl.value = "";
        citySelectEl.disabled = true;
      }
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
          if (citySelectEl) citySelectEl.disabled = false;
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
/* ==========================================================================
   🎬 PRATİK BİLGİLER: 3 AŞAMALI SİNEMATİK FİNAL & SIFIR KB WEB AUDIO AMBİYANSI
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const closingSection = document.getElementById("lrfClosingStage");
  if (!closingSection) return;

  const ambientBtn = document.getElementById("lrfAmbientToggle");
  const replayBtn = document.getElementById("lrfClosingReplay");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ── 1. 3 AŞAMALI SİNEMATİK ZAMAN ÇİZELGESİ (0s → 10.5s → 11.7s+) ── */
  const STAGE_TIMINGS = Object.freeze({
    letterboxStartMs: 10500,
    finaleStartMs: 11700,
  });

  let sceneTimers = [];
  let hasPlayedOnScroll = false;

  const clearSceneTimers = () => {
    sceneTimers.forEach((timerId) => window.clearTimeout(timerId));
    sceneTimers = [];
  };

  const playCinematicSequence = () => {
    clearSceneTimers();

    if (reducedMotionQuery.matches) {
      closingSection.setAttribute("data-closing-state", "scene-3");
      return;
    }

    // Baştan oynatıldığında CSS geçişlerini temiz şekilde sıfırla
    closingSection.setAttribute("data-closing-state", "idle");
    void closingSection.offsetWidth;

    window.requestAnimationFrame(() => {
      // Sahne 1: Manifesto Akışı (0s – 10.5s)
      closingSection.setAttribute("data-closing-state", "scene-1");

      // Sahne 2: Sinematik Letterbox Perde Kapanışı + Manifesto Bulanıklaşması (10.5s – 11.7s)
      sceneTimers.push(
        window.setTimeout(() => {
          closingSection.setAttribute("data-closing-state", "scene-2");
        }, STAGE_TIMINGS.letterboxStartMs),
      );

      // Sahne 3: Büyük Final İmzası — RASTGELE! (11.7s+ kalıcı)
      sceneTimers.push(
        window.setTimeout(() => {
          closingSection.setAttribute("data-closing-state", "scene-3");
        }, STAGE_TIMINGS.finaleStartMs),
      );
    });
  };

  if (reducedMotionQuery.matches) {
    closingSection.setAttribute("data-closing-state", "scene-3");
  } else if ("IntersectionObserver" in window) {
    const closingObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasPlayedOnScroll) {
            hasPlayedOnScroll = true;
            playCinematicSequence();
            observer.disconnect();
          }
        });
      },
      {
        root: null,
        threshold: 0.35,
      },
    );
    closingObserver.observe(closingSection);
  } else {
    hasPlayedOnScroll = true;
    playCinematicSequence();
  }

  if (reducedMotionQuery.addEventListener) {
    reducedMotionQuery.addEventListener("change", (event) => {
      if (event.matches) {
        clearSceneTimers();
        closingSection.setAttribute("data-closing-state", "scene-3");
      }
    });
  }

  if (replayBtn) {
    replayBtn.addEventListener("click", () => {
      hasPlayedOnScroll = true;
      playCinematicSequence();
    });
  }

  /* ── 2. SIFIR KB WEB AUDIO API KIYI DALGASI / GECE MERASI SENTEZLEYİCİSİ ── */
  const createWaveAmbientEngine = () => {
    let audioCtx = null;
    let masterGain = null;
    let isPlaying = false;
    let suspendTimer = null;

    const TARGET_VOLUME = 0.3;
    const FADE_IN_SEC = 1.4;
    const FADE_OUT_SEC = 0.75;

    /**
     * Kesintisiz döngü için uçları crossfade edilmiş stereo pembe veya kahverengi gürültü tamponu üretir.
     */
    const createNoiseBuffer = (ctx, type, durationSec = 6) => {
      const sampleRate = ctx.sampleRate;
      const frameCount = Math.floor(sampleRate * durationSec);
      const buffer = ctx.createBuffer(2, frameCount, sampleRate);
      const fadeSamples = Math.floor(sampleRate * 0.18);

      for (let channel = 0; channel < 2; channel += 1) {
        const data = buffer.getChannelData(channel);

        if (type === "brown") {
          let lastOut = 0;
          for (let i = 0; i < frameCount; i += 1) {
            const white = Math.random() * 2 - 1;
            lastOut = (lastOut + 0.02 * white) / 1.02;
            data[i] = lastOut * 3.2;
          }
        } else {
          // Paul Kellet 7 aşamalı pembe gürültü filtresi
          let b0 = 0;
          let b1 = 0;
          let b2 = 0;
          let b3 = 0;
          let b4 = 0;
          let b5 = 0;
          let b6 = 0;
          for (let i = 0; i < frameCount; i += 1) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.969 * b2 + white * 0.153852;
            b3 = 0.8665 * b3 + white * 0.3104856;
            b4 = 0.55 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.016898;
            data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.045;
            b6 = white * 0.115926;
          }
        }

        // Döngü sınırında tık sesini önleyen yumuşak crossfade
        for (let i = 0; i < fadeSamples; i += 1) {
          const ratio = i / fadeSamples;
          const tailIndex = frameCount - fadeSamples + i;
          data[i] = data[i] * ratio + data[tailIndex] * (1 - ratio);
        }
      }

      return buffer;
    };

    const ensureGraph = () => {
      if (audioCtx) return true;
      const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextCtor) return false;

      audioCtx = new AudioContextCtor();
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);

      // Katman 1: Derin Kıyı Dalgası (Kahverengi Gürültü + Alçak Geçiren Filtre + Yavaş LFO)
      const swellSource = audioCtx.createBufferSource();
      swellSource.buffer = createNoiseBuffer(audioCtx, "brown", 7);
      swellSource.loop = true;

      const swellFilter = audioCtx.createBiquadFilter();
      swellFilter.type = "lowpass";
      swellFilter.frequency.setValueAtTime(220, audioCtx.currentTime);
      swellFilter.Q.setValueAtTime(0.7, audioCtx.currentTime);

      const swellGain = audioCtx.createGain();
      swellGain.gain.setValueAtTime(0.52, audioCtx.currentTime);

      const swellLfo = audioCtx.createOscillator();
      swellLfo.type = "sine";
      swellLfo.frequency.setValueAtTime(0.11, audioCtx.currentTime); // ~9.1 sn dalga ritmi

      const swellFilterDepth = audioCtx.createGain();
      swellFilterDepth.gain.setValueAtTime(145, audioCtx.currentTime);

      const swellGainDepth = audioCtx.createGain();
      swellGainDepth.gain.setValueAtTime(0.24, audioCtx.currentTime);

      swellLfo.connect(swellFilterDepth);
      swellFilterDepth.connect(swellFilter.frequency);
      swellLfo.connect(swellGainDepth);
      swellGainDepth.connect(swellGain.gain);

      swellSource.connect(swellFilter);
      swellFilter.connect(swellGain);
      swellGain.connect(masterGain);

      // Katman 2: Kıyı Köpüğü & Çakıl Sürtünmesi (Pembe Gürültü + Bant Geçiren Filtre + İkinci LFO)
      const foamSource = audioCtx.createBufferSource();
      foamSource.buffer = createNoiseBuffer(audioCtx, "pink", 6);
      foamSource.loop = true;

      const foamFilter = audioCtx.createBiquadFilter();
      foamFilter.type = "bandpass";
      foamFilter.frequency.setValueAtTime(560, audioCtx.currentTime);
      foamFilter.Q.setValueAtTime(0.55, audioCtx.currentTime);

      const foamGain = audioCtx.createGain();
      foamGain.gain.setValueAtTime(0.16, audioCtx.currentTime);

      const foamLfo = audioCtx.createOscillator();
      foamLfo.type = "sine";
      foamLfo.frequency.setValueAtTime(0.145, audioCtx.currentTime); // ~6.9 sn organik faz kayması

      const foamFilterDepth = audioCtx.createGain();
      foamFilterDepth.gain.setValueAtTime(240, audioCtx.currentTime);

      const foamGainDepth = audioCtx.createGain();
      foamGainDepth.gain.setValueAtTime(0.11, audioCtx.currentTime);

      foamLfo.connect(foamFilterDepth);
      foamFilterDepth.connect(foamFilter.frequency);
      foamLfo.connect(foamGainDepth);
      foamGainDepth.connect(foamGain.gain);

      foamSource.connect(foamFilter);
      foamFilter.connect(foamGain);
      foamGain.connect(masterGain);

      swellSource.start();
      foamSource.start();
      swellLfo.start();
      foamLfo.start();

      return true;
    };

    const start = async () => {
      if (!ensureGraph()) return false;
      if (suspendTimer) {
        window.clearTimeout(suspendTimer);
        suspendTimer = null;
      }

      if (audioCtx.state === "suspended") {
        await audioCtx.resume();
      }

      const now = audioCtx.currentTime;
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setValueAtTime(Math.max(masterGain.gain.value, 0.0001), now);
      masterGain.gain.linearRampToValueAtTime(TARGET_VOLUME, now + FADE_IN_SEC);

      isPlaying = true;
      return true;
    };

    const stop = () => {
      if (!audioCtx || !masterGain) {
        isPlaying = false;
        return;
      }

      const now = audioCtx.currentTime;
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setValueAtTime(Math.max(masterGain.gain.value, 0.0001), now);
      masterGain.gain.linearRampToValueAtTime(0.0001, now + FADE_OUT_SEC);

      isPlaying = false;
      if (suspendTimer) window.clearTimeout(suspendTimer);
      suspendTimer = window.setTimeout(
        () => {
          if (!isPlaying && audioCtx && audioCtx.state === "running") {
            audioCtx.suspend().catch(() => {});
          }
        },
        Math.round(FADE_OUT_SEC * 1000) + 80,
      );
    };

    return {
      isPlaying: () => isPlaying,
      toggle: async () => {
        if (isPlaying) {
          stop();
          return false;
        }
        return start();
      },
      stop,
    };
  };

  const waveEngine = createWaveAmbientEngine();

  const syncAmbientButtonUI = (active) => {
    if (!ambientBtn) return;
    ambientBtn.setAttribute("aria-pressed", String(active));
    ambientBtn.setAttribute("aria-label", active ? "Kıyı dalgası mera sesini kapat" : "Kıyı dalgası mera sesini aç");
  };

  if (ambientBtn) {
    ambientBtn.addEventListener("click", async () => {
      try {
        const active = await waveEngine.toggle();
        syncAmbientButtonUI(active);
      } catch {
        syncAmbientButtonUI(false);
      }
    });
  }

  window.addEventListener("pagehide", () => {
    if (waveEngine.isPlaying()) {
      waveEngine.stop();
      syncAmbientButtonUI(false);
    }
  });
});

/* ==========================================================================
   ⬆️ TÜM SAYFALAR: YUKARI ÇIK (BACK-TO-TOP) OK BUTONU MOTORU
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".lrf-back-to-top")) return;

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const backToTopBtn = document.createElement("button");
  backToTopBtn.type = "button";
  backToTopBtn.className = "lrf-back-to-top";
  backToTopBtn.setAttribute("aria-label", "Sayfanın başına dön");
  backToTopBtn.setAttribute("title", "Yukarı çık");
  backToTopBtn.innerHTML =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 15l-6-6-6 6"/></svg>';
  document.body.appendChild(backToTopBtn);

  let scrollTicking = false;
  const updateBackToTop = () => {
    backToTopBtn.classList.toggle("is-visible", window.scrollY > 420);
    scrollTicking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        scrollTicking = true;
        window.requestAnimationFrame(updateBackToTop);
      }
    },
    { passive: true },
  );

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: reducedMotionQuery.matches ? "auto" : "smooth",
    });
  });

  updateBackToTop();
});
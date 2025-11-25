"use strict";
(() => {
  // themes/app/js/navigation.js
  var Navigation = class {
    constructor() {
      this.navToggle = document.querySelector(".nav-toggle");
      this.navMenu = document.querySelector(".nav-menu");
      this.init();
    }
    init() {
      if (!this.navToggle || !this.navMenu)
        return;
      document.addEventListener("click", (e) => {
        if (e.target.closest(".nav-toggle")) {
          this.toggleMenu();
        }
      });
      document.addEventListener("click", (e) => {
        if (!this.navToggle.contains(e.target) && !this.navMenu.contains(e.target)) {
          this.closeMenu();
        }
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.navMenu.classList.contains("active")) {
          this.closeMenu();
          this.navToggle.focus();
        }
      });
      this.navMenu.addEventListener("click", (e) => {
        if (e.target.closest(".nav-link")) {
          this.closeMenu();
        }
      });
    }
    toggleMenu() {
      const isExpanded = this.navToggle.getAttribute("aria-expanded") === "true";
      this.navToggle.setAttribute("aria-expanded", !isExpanded);
      this.navMenu.classList.toggle("active");
    }
    closeMenu() {
      this.navToggle.setAttribute("aria-expanded", "false");
      this.navMenu.classList.remove("active");
    }
  };

  // themes/app/js/theme.js
  var ThemeManager = class {
    constructor() {
      this.themeToggle = document.querySelector(".theme-toggle");
      this.html = document.documentElement;
      this.init();
    }
    init() {
      this.setTheme(this.getPreferredTheme());
      if (this.themeToggle) {
        this.themeToggle.addEventListener("click", () => {
          const currentTheme = this.html.getAttribute("data-theme") || "light";
          this.setTheme(currentTheme === "dark" ? "light" : "dark");
        });
      }
      if (window.matchMedia) {
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
          if (!localStorage.getItem("theme")) {
            this.setTheme("dark");
          }
        });
      }
    }
    setTheme(theme) {
      this.html.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
      if (this.themeToggle) {
        this.themeToggle.setAttribute("data-theme", theme);
      }
    }
    getPreferredTheme() {
      const stored = localStorage.getItem("theme");
      if (stored)
        return stored;
      return "dark";
    }
  };

  // themes/app/js/smooth-scroll.js
  var SmoothScroll = class {
    constructor() {
      this.init();
    }
    init() {
      document.addEventListener("click", (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor)
          return;
        const href = anchor.getAttribute("href");
        if (href === "#" || href.length <= 1)
          return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }
  };

  // themes/app/js/lazy-load.js
  var LazyLoad = class {
    constructor() {
      this.observer = null;
      this.init();
    }
    init() {
      if (!("IntersectionObserver" in window)) {
        this.loadAllImages();
        return;
      }
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute("data-src");
            }
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
              img.removeAttribute("data-srcset");
            }
            img.classList.add("loaded");
            this.observer.unobserve(img);
          }
        });
      }, {
        rootMargin: "50px"
      });
      document.querySelectorAll("img[data-src]").forEach((img) => {
        this.observer.observe(img);
      });
    }
    loadAllImages() {
      document.querySelectorAll("img[data-src]").forEach((img) => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
        }
      });
    }
    destroy() {
      if (this.observer) {
        this.observer.disconnect();
      }
    }
  };

  // themes/app/js/pwa.js
  var PWA = class {
    constructor() {
      this.init();
    }
    init() {
      if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
          this.registerServiceWorker();
        });
      }
      let deferredPrompt;
      window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        deferredPrompt = e;
        this.showInstallButton(deferredPrompt);
      });
    }
    async registerServiceWorker() {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/"
        });
        console.log("Service Worker registered:", registration.scope);
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              this.showUpdateNotification();
            }
          });
        });
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    }
    showInstallButton(deferredPrompt) {
      const installButton = document.createElement("button");
      installButton.textContent = "Instalar App";
      installButton.className = "pwa-install-button";
      installButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 24px;
            background: var(--primary-color);
            color: var(--bg-color);
            border: none;
            border-radius: 8px;
            cursor: pointer;
            z-index: 1000;
            font-weight: 600;
        `;
      installButton.addEventListener("click", async () => {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log("User choice:", outcome);
        installButton.remove();
        deferredPrompt = null;
      });
      document.body.appendChild(installButton);
    }
    showUpdateNotification() {
      console.log("New version available. Refresh to update.");
    }
  };

  // themes/app/js/analytics.js
  var Analytics = class {
    constructor() {
      this.config = {
        enabled: true,
        provider: "plausible",
        // 'plausible', 'custom', 'none'
        domain: window.location.hostname
      };
      this.init();
    }
    init() {
      if (!this.config.enabled || this.config.provider === "none") {
        return;
      }
      switch (this.config.provider) {
        case "plausible":
          this.initPlausible();
          break;
        case "custom":
          this.initCustom();
          break;
      }
      this.trackPageView();
      this.trackOutboundLinks();
    }
    initPlausible() {
      const script = document.createElement("script");
      script.defer = true;
      script.dataset.domain = this.config.domain;
      script.src = "https://plausible.io/js/script.js";
      document.head.appendChild(script);
    }
    initCustom() {
      this.endpoint = "/api/analytics";
    }
    trackPageView() {
      if (this.config.provider === "custom") {
        this.sendEvent("pageview", {
          path: window.location.pathname,
          referrer: document.referrer
        });
      }
    }
    trackOutboundLinks() {
      document.addEventListener("click", (e) => {
        const link = e.target.closest('a[href^="http"]');
        if (!link)
          return;
        const href = link.getAttribute("href");
        if (href && !href.includes(window.location.hostname)) {
          this.sendEvent("outbound", {
            url: href
          });
        }
      });
    }
    sendEvent(eventName, data = {}) {
      if (this.config.provider === "custom" && this.endpoint) {
        fetch(this.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: eventName,
            ...data,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          })
        }).catch(() => {
        });
      }
    }
  };

  // themes/app/js/main.js
  var App = class {
    constructor() {
      this.modules = [];
    }
    init() {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => this.start());
      } else {
        this.start();
      }
    }
    start() {
      new ThemeManager();
      this.modules.push(
        new Navigation(),
        new SmoothScroll(),
        new LazyLoad(),
        new PWA(),
        new Analytics()
      );
    }
  };
  var app = new App();
  app.init();
})();
//# sourceMappingURL=main.bundle.js.map

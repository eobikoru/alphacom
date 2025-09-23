export function preloadCriticalResources() {
  if (typeof window === "undefined") return

  // Preload critical CSS
  const criticalCSS = ["/globals.css"]

  criticalCSS.forEach((href) => {
    const link = document.createElement("link")
    link.rel = "preload"
    link.href = href
    link.as = "style"
    document.head.appendChild(link)
  })

  // Preload critical fonts
  const criticalFonts = ["/fonts/geist-sans-400.woff2", "/fonts/geist-sans-600.woff2", "/fonts/geist-sans-700.woff2"]

  criticalFonts.forEach((href) => {
    const link = document.createElement("link")
    link.rel = "preload"
    link.href = href
    link.as = "font"
    link.type = "font/woff2"
    link.crossOrigin = "anonymous"
    document.head.appendChild(link)
  })

  // Preload critical images
  const criticalImages = [
    "/premium-modern-tech-workspace-with-sleek-devices-a.jpg",
    "/images/logo.png",
    "/images/hero-bg.jpg",
  ]

  criticalImages.forEach((src) => {
    const img = new Image()
    img.src = src
  })
}

export function optimizeThirdPartyScripts() {
  if (typeof window === "undefined") return

  // Defer non-critical third-party scripts
  const scripts = document.querySelectorAll("script[data-defer]")
  scripts.forEach((script) => {
    script.setAttribute("defer", "true")
  })

  // Load third-party scripts after user interaction
  let hasInteracted = false
  const loadThirdPartyScripts = () => {
    if (hasInteracted) return
    hasInteracted = true

    // Load analytics after interaction
    if (window.gtag) {
      window.gtag("config", "GA_MEASUREMENT_ID")
    }

    // Load other third-party scripts
    const deferredScripts = document.querySelectorAll("script[data-load-after-interaction]")
    deferredScripts.forEach((script) => {
      const newScript = document.createElement("script")
      newScript.src = script.getAttribute("data-src") || ""
      newScript.async = true
      document.head.appendChild(newScript)
    })
  }

  // Load on first user interaction
  const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"]
  events.forEach((event) => {
    window.addEventListener(event, loadThirdPartyScripts, { once: true, passive: true })
  })

  // Fallback: load after 5 seconds
  setTimeout(loadThirdPartyScripts, 5000)
}

export function reduceLayoutShift() {
  if (typeof window === "undefined") return

  // Add aspect ratio to images without dimensions
  const images = document.querySelectorAll("img:not([width]):not([height])")
  images.forEach((img) => {
    if (!img.style.aspectRatio) {
      img.style.aspectRatio = "16/9"
    }
  })

  // Reserve space for dynamic content
  const dynamicContainers = document.querySelectorAll("[data-dynamic-content]")
  dynamicContainers.forEach((container) => {
    if (!container.style.minHeight) {
      container.style.minHeight = "200px"
    }
  })
}

export function optimizeResourceHints() {
  if (typeof window === "undefined") return

  // DNS prefetch for external domains
  const externalDomains = [
    "fonts.googleapis.com",
    "fonts.gstatic.com",
    "www.google-analytics.com",
    "www.googletagmanager.com",
  ]

  externalDomains.forEach((domain) => {
    const link = document.createElement("link")
    link.rel = "dns-prefetch"
    link.href = `//${domain}`
    document.head.appendChild(link)
  })

  // Preconnect to critical external resources
  const criticalDomains = ["fonts.googleapis.com", "fonts.gstatic.com"]

  criticalDomains.forEach((domain) => {
    const link = document.createElement("link")
    link.rel = "preconnect"
    link.href = `https://${domain}`
    link.crossOrigin = "anonymous"
    document.head.appendChild(link)
  })
}

export function measureCoreWebVitals() {
  if (typeof window === "undefined") return

  // Measure and report Core Web Vitals
  import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    const reportMetric = (metric: any) => {
      console.log("[Core Web Vitals]", metric.name, metric.value)

      // Send to analytics
      if (window.gtag) {
        window.gtag("event", metric.name, {
          custom_parameter_1: metric.value,
          custom_parameter_2: metric.id,
          custom_parameter_3: metric.name,
        })
      }

      // Send to Vercel Analytics
      if (window.va) {
        window.va("track", "Core Web Vitals", {
          metric: metric.name,
          value: metric.value,
          id: metric.id,
        })
      }
    }

    getCLS(reportMetric)
    getFID(reportMetric)
    getFCP(reportMetric)
    getLCP(reportMetric)
    getTTFB(reportMetric)
  })
}

export function initializePerformanceOptimizations() {
  if (typeof window === "undefined") return

  // Run optimizations after DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      preloadCriticalResources()
      optimizeResourceHints()
      reduceLayoutShift()
      optimizeThirdPartyScripts()
    })
  } else {
    preloadCriticalResources()
    optimizeResourceHints()
    reduceLayoutShift()
    optimizeThirdPartyScripts()
  }

  // Measure Core Web Vitals after page load
  window.addEventListener("load", () => {
    setTimeout(measureCoreWebVitals, 1000)
  })
}

// Service Worker registration for caching
export function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("[SW] Registered:", registration)
      })
      .catch((error) => {
        console.log("[SW] Registration failed:", error)
      })
  })
}

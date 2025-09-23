// "use client"

// import { useEffect } from "react"
// import { useReportWebVitals } from "next/web-vitals"

// export function WebVitals() {
//   useReportWebVitals((metric) => {
//     // Log metrics for monitoring
//     console.log("[Web Vitals]", metric)

//     // Send to analytics service (replace with your analytics)
//     if (typeof window !== "undefined" && window.gtag) {
//       window.gtag("event", metric.name, {
//         custom_parameter_1: metric.value,
//         custom_parameter_2: metric.id,
//         custom_parameter_3: metric.name,
//       })
//     }

//     // Send to Vercel Analytics
//     if (typeof window !== "undefined" && window.va) {
//       window.va("track", "Web Vitals", {
//         metric: metric.name,
//         value: metric.value,
//         id: metric.id,
//       })
//     }
//   })

//   useEffect(() => {
//     // Preload critical resources
//     const preloadCriticalResources = () => {
//       // Preload critical fonts
//       const fontPreloads = ["/fonts/geist-sans-400.woff2", "/fonts/geist-sans-600.woff2", "/fonts/geist-sans-700.woff2"]

//       fontPreloads.forEach((font) => {
//         const link = document.createElement("link")
//         link.rel = "preload"
//         link.href = font
//         link.as = "font"
//         link.type = "font/woff2"
//         link.crossOrigin = "anonymous"
//         document.head.appendChild(link)
//       })

//       // Preload critical images
//       const criticalImages = ["/premium-modern-tech-workspace-with-sleek-devices-a.jpg", "/images/logo.png"]

//       criticalImages.forEach((src) => {
//         const img = new Image()
//         img.src = src
//       })
//     }

//     // Optimize loading performance
//     const optimizeLoading = () => {
//       // Lazy load non-critical images
//       if ("loading" in HTMLImageElement.prototype) {
//         const images = document.querySelectorAll("img[data-src]")
//         images.forEach((img) => {
//           img.src = img.dataset.src
//         })
//       } else {
//         // Fallback for browsers that don't support native lazy loading
//         import("intersection-observer").then(() => {
//           const images = document.querySelectorAll("img[data-src]")
//           const imageObserver = new IntersectionObserver((entries, observer) => {
//             entries.forEach((entry) => {
//               if (entry.isIntersecting) {
//                 const img = entry.target
//                 img.src = img.dataset.src
//                 img.classList.remove("lazy")
//                 imageObserver.unobserve(img)
//               }
//             })
//           })
//           images.forEach((img) => imageObserver.observe(img))
//         })
//       }
//     }

//     // Reduce layout shift
//     const reduceLayoutShift = () => {
//       // Add aspect ratio containers for images
//       const images = document.querySelectorAll("img:not([width]):not([height])")
//       images.forEach((img) => {
//         if (!img.style.aspectRatio) {
//           img.style.aspectRatio = "16/9" // Default aspect ratio
//         }
//       })
//     }

//     // Optimize third-party scripts
//     const optimizeThirdPartyScripts = () => {
//       // Defer non-critical scripts
//       const scripts = document.querySelectorAll("script[data-defer]")
//       scripts.forEach((script) => {
//         script.defer = true
//       })
//     }

//     preloadCriticalResources()
//     optimizeLoading()
//     reduceLayoutShift()
//     optimizeThirdPartyScripts()

//     // Monitor performance
//     if ("PerformanceObserver" in window) {
//       // Monitor Long Tasks
//       const longTaskObserver = new PerformanceObserver((list) => {
//         list.getEntries().forEach((entry) => {
//           console.warn("[Long Task]", entry.duration, "ms")
//         })
//       })
//       longTaskObserver.observe({ entryTypes: ["longtask"] })

//       // Monitor Layout Shifts
//       const clsObserver = new PerformanceObserver((list) => {
//         list.getEntries().forEach((entry) => {
//           if (!entry.hadRecentInput) {
//             console.log("[Layout Shift]", entry.value)
//           }
//         })
//       })
//       clsObserver.observe({ entryTypes: ["layout-shift"] })
//     }
//   }, [])

//   return null
// }

// // Performance monitoring hook
// export function usePerformanceMonitoring() {
//   useEffect(() => {
//     const measurePerformance = () => {
//       if ("performance" in window) {
//         const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming

//         const metrics = {
//           // Core Web Vitals
//           FCP: 0, // First Contentful Paint
//           LCP: 0, // Largest Contentful Paint
//           FID: 0, // First Input Delay
//           CLS: 0, // Cumulative Layout Shift

//           // Other important metrics
//           TTFB: navigation.responseStart - navigation.requestStart, // Time to First Byte
//           domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
//           loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
//         }

//         // Get paint metrics
//         const paintEntries = performance.getEntriesByType("paint")
//         paintEntries.forEach((entry) => {
//           if (entry.name === "first-contentful-paint") {
//             metrics.FCP = entry.startTime
//           }
//         })

//         console.log("[Performance Metrics]", metrics)

//         // Send to analytics
//         if (typeof window !== "undefined" && window.gtag) {
//           Object.entries(metrics).forEach(([key, value]) => {
//             window.gtag("event", "performance_metric", {
//               metric_name: key,
//               metric_value: Math.round(value),
//             })
//           })
//         }
//       }
//     }

//     // Measure after page load
//     if (document.readyState === "complete") {
//       measurePerformance()
//     } else {
//       window.addEventListener("load", measurePerformance)
//     }

//     return () => {
//       window.removeEventListener("load", measurePerformance)
//     }
//   }, [])
// }

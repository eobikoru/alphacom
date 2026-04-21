const GOOGLE_ADS_SEND_TO = "AW-937925676/IAxVCKqC-ZgcEKy4nr8D"

type GtagArgs = [command: "event", eventName: string, params: Record<string, unknown>]

declare global {
  interface Window {
    gtag?: (...args: GtagArgs) => void
  }
}

export function reportGoogleAdsConversion(transactionId: string) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return
  }

  window.gtag("event", "conversion", {
    send_to: GOOGLE_ADS_SEND_TO,
    transaction_id: transactionId,
  })
}

const GOOGLE_ADS_SEND_TO = "AW-937925676/uBMMCNqm6aEcEKy4nr8D"

type GtagArgs = [command: "event", eventName: string, params: Record<string, unknown>]

declare global {
  interface Window {
    gtag?: (...args: GtagArgs) => void
  }
}

type GoogleAdsConversionParams = {
  transactionId: string
  value: number
  currency: string
}

export function reportGoogleAdsConversion({ transactionId, value, currency }: GoogleAdsConversionParams) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return
  }

  window.gtag("event", "conversion", {
    send_to: GOOGLE_ADS_SEND_TO,
    value,
    currency,
    transaction_id: transactionId,
  })
}

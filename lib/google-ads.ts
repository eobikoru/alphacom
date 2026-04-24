const GOOGLE_ADS_SEND_TO = "AW-937925676/RrnFCOOb_qEcEKy4nr8D"

type GtagArgs = [command: "event", eventName: string, params: Record<string, unknown>]

declare global {
  interface Window {
    gtag?: (...args: GtagArgs) => void
    dataLayer?: unknown[]
  }
}

type GoogleAdsConversionParams = {
  transactionId: string
  value: number
  currency: string
}

export function reportGoogleAdsConversion({ transactionId, value, currency }: GoogleAdsConversionParams) {
  if (typeof window === "undefined") {
    return
  }

  const conversionPayload = {
    send_to: GOOGLE_ADS_SEND_TO,
    value,
    currency,
    transaction_id: transactionId,
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", "conversion", conversionPayload)
    return
  }

  // If gtag is still booting, queue the event so it is processed when the tag initializes.
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(["event", "conversion", conversionPayload])
}

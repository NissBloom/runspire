declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void
  }
}

export const trackConsultCTAClick = (location: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "consult_cta_click", {
      event_category: "engagement",
      event_label: location,
      value: 1,
    })
  }
}

export const trackPlanRequest = (planType: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "plan_request", {
      event_category: "conversion",
      event_label: planType,
      value: 1,
    })
  }
}

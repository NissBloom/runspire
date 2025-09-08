interface Window {
  Calendly?: {
    initPopupWidget: (options: { url: string }) => void
    showPopupWidget: (url: string) => void
  }
}

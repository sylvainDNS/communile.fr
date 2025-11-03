export function get(selector: string, all?: boolean) {
  return all ? document?.querySelectorAll(selector) : document?.querySelector(selector)
}

export function on(selector: string | HTMLElement | Document, event: string, callback: (event: Event) => void, all?: boolean) {
  if (all) {
    const elements = document.querySelectorAll(selector as string)

    elements?.forEach((element) => {
      element.addEventListener(event, callback)
    })

    return
  }

  if (typeof selector === 'string') {
    ;(get(selector) as HTMLElement)?.addEventListener(event, callback)

    return
  }

  selector?.addEventListener(event, callback)
}

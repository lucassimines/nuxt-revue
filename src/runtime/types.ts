export type RevealWhen = 'mount' | 'visible'

export type RevealOptions = {
  delay?: number
  duration?: number
  distance?: number
  onceKey?: string
  /**
   * `mount` reveals as soon as the element is created.
   * `visible` waits until the element enters the viewport.
   */
  when?: RevealWhen
  /** IntersectionObserver threshold. Defaults to `0.15`. */
  threshold?: number
  /** IntersectionObserver rootMargin. Defaults to `'0px'`. */
  rootMargin?: string
  /**
   * When `when: 'visible'`, stop observing after the first reveal.
   * Defaults to `true`.
   */
  once?: boolean
}

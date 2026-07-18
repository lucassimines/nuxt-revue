import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import type { Directive, DirectiveBinding, VNode } from 'vue'
import { mergeProps } from 'vue'
import type { RevealOptions } from './types.ts'

export type { RevealOptions, RevealWhen } from './types'

type ResolvedRevealOptions = Required<
  Pick<RevealOptions, 'delay' | 'duration' | 'distance' | 'when' | 'threshold' | 'rootMargin' | 'once'>
> & Pick<RevealOptions, 'onceKey'>

type RevealElement = HTMLElement & {
  __revealCleanup?: () => void
}

type PendingReveal = {
  options: ResolvedRevealOptions
  activate: () => void
  deactivate?: () => void
}

const revealedGroups = new Set<string>()
const observerCache = new Map<string, IntersectionObserver>()
const pendingByElement = new WeakMap<Element, PendingReveal>()

function resolveOptions(
  value: RevealOptions | undefined,
  defaults: Partial<RevealOptions> = {},
): ResolvedRevealOptions {
  return {
    delay: value?.delay ?? defaults.delay ?? 0,
    duration: value?.duration ?? defaults.duration ?? 800,
    distance: value?.distance ?? defaults.distance ?? 24,
    onceKey: value?.onceKey ?? defaults.onceKey,
    when: value?.when ?? defaults.when ?? 'mount',
    threshold: value?.threshold ?? defaults.threshold ?? 0.15,
    rootMargin: value?.rootMargin ?? defaults.rootMargin ?? '0px',
    once: value?.once ?? defaults.once ?? true,
  }
}

function getRevealStyles(options: ResolvedRevealOptions) {
  return {
    '--reveal-delay': `${options.delay}ms`,
    '--reveal-duration': `${options.duration}ms`,
    '--reveal-distance': `${options.distance}px`,
  }
}

function getRevealProps(options: ResolvedRevealOptions, active: boolean) {
  return {
    class: active ? 'reveal reveal--in' : 'reveal',
    style: getRevealStyles(options),
  }
}

function prefersReducedMotion() {
  return import.meta.client
    && typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function shouldSkip(options: ResolvedRevealOptions) {
  return Boolean(options.onceKey && revealedGroups.has(options.onceKey))
}

function markOnceKey(options: ResolvedRevealOptions) {
  if (options.onceKey) {
    queueMicrotask(() => revealedGroups.add(options.onceKey!))
  }
}

function activate(element: HTMLElement, options: ResolvedRevealOptions) {
  element.classList.add('reveal--in')
  markOnceKey(options)
}

function deactivate(element: HTMLElement) {
  element.classList.remove('reveal--in')
}

function getSharedObserver(threshold: number, rootMargin: string) {
  const key = `${threshold}|${rootMargin}`
  const cached = observerCache.get(key)
  if (cached) return cached

  const observer = new IntersectionObserver((entries, currentObserver) => {
    for (const entry of entries) {
      const pending = pendingByElement.get(entry.target)
      if (!pending) continue

      if (entry.isIntersecting) {
        pending.activate()

        if (pending.options.once) {
          currentObserver.unobserve(entry.target)
          pendingByElement.delete(entry.target)
        }
        continue
      }

      if (!pending.options.once) {
        pending.deactivate?.()
      }
    }
  }, {
    threshold,
    rootMargin,
  })

  observerCache.set(key, observer)
  return observer
}

function observeReveal(element: RevealElement, options: ResolvedRevealOptions) {
  if (prefersReducedMotion()) {
    activate(element, options)
    return
  }

  const observer = getSharedObserver(options.threshold, options.rootMargin)

  pendingByElement.set(element, {
    options,
    activate: () => activate(element, options),
    deactivate: () => {
      deactivate(element)
      // Restart CSS animation on the next intersection.
      void element.offsetWidth
    },
  })

  element.__revealCleanup = () => {
    observer.unobserve(element)
    pendingByElement.delete(element)
    delete element.__revealCleanup
  }

  observer.observe(element)
}

function applyCreatedProps(
  binding: DirectiveBinding<RevealOptions | undefined>,
  vnode: VNode,
  defaults: Partial<RevealOptions>,
) {
  const options = resolveOptions(binding.value, defaults)
  if (shouldSkip(options)) return

  const active = options.when === 'mount' || prefersReducedMotion()
  vnode.props = mergeProps(vnode.props ?? {}, getRevealProps(options, active))
}

export default defineNuxtPlugin((nuxtApp) => {
  const defaults = (useRuntimeConfig().public.revue as { reveal?: RevealOptions } | undefined)?.reveal ?? {}

  const reveal: Directive<RevealElement, RevealOptions | undefined> = {
    created(_element, binding, vnode) {
      applyCreatedProps(binding, vnode, defaults)
    },

    mounted(element, binding) {
      const options = resolveOptions(binding.value, defaults)
      if (shouldSkip(options)) {
        element.classList.remove('reveal')
        return
      }

      if (options.when === 'mount' || prefersReducedMotion()) {
        activate(element, options)
        return
      }

      observeReveal(element, options)
    },

    updated(element, binding) {
      const options = resolveOptions(binding.value, defaults)
      for (const [property, propertyValue] of Object.entries(getRevealStyles(options))) {
        element.style.setProperty(property, propertyValue)
      }
    },

    unmounted(element) {
      element.__revealCleanup?.()
    },

    getSSRProps(binding) {
      const options = resolveOptions(binding.value, defaults)
      if (shouldSkip(options)) return {}

      return getRevealProps(options, options.when === 'mount')
    },
  }

  nuxtApp.vueApp.directive('reveal', reveal)
})

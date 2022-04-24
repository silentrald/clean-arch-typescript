import { Plugin } from '@nuxt/types'

declare module 'vue/types/vue' {
  interface Vue {
    $csrf(): Promise<void>
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $csrf(): Promise<void>
  }
  interface Context {
    $csrf(): Promise<void>
  }
}

const csrfPlugin: Plugin = (context, inject) => {
  inject('csrf', async () => {
    await context.$axios.get('/csrf')
  })
}

export default csrfPlugin

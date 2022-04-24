const STATIC_URL = process.env.STATIC_URL || 'http://localhost:3000'
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000/api'
const isDev = process.env.NODE_ENV === 'development'
const isBuild = !!process.env.BUILD

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Pili na Pinas',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/global.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/csrf.ts' },
    { src: '~/plugins/vee-validate.ts' },
  ],
  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
  ],

  publicRuntimeConfig: {
    SERVER_URL,
    CLIENT_URL,
    STATIC_URL: isDev ? 'http://localhost:5500' : STATIC_URL, // Install live server
    GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
    GOOGLE_OAUTH_REDIRECT:
      process.env.GOOGLE_OAUTH_REDIRECT || 'http://localhost:3000/auth/google',
    axios: {
      browserBaseURL: SERVER_URL,
    },
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: SERVER_URL,
    credentials: true,
    init(axios) {
      axios.defaults.withCredentials = true
    },
  },

  auth: {
    plugins: [{ src: '~/plugins/auth.ts', ssr: true }],
    localStorage: false,
    token: false,
    strategies: {
      cookie: {
        endpoints: {
          csrf: { url: '/csrf', method: 'get' },
          login: { url: '/auth/login', method: 'post' },
          logout: { url: '/auth/logout', method: 'post' },
          user: { url: '/user', method: 'get', property: 'user' },
        },
        user: {
          property: false,
        },
      },
    },
    cookie: {
      options: {
        maxAge: 60 * 60 * 24, // 24 hours
        secure: !isDev,
        sameSite: 'strict',
      },
    },
    redirect: {
      login: '/login',
      logout: '/login',
      callback: '/callback',
      home: '/',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  // build: {
  //   transpile: ['vee-validate/dist/rules'],
  //   loaders: {
  //     cssModules: {
  //       modules: {
  //         localIdentName: '[local]_[hash:base64:8]',
  //       },
  //     },
  //   },
  // },

  buildDir: isBuild ? '../production/client/.nuxt' : '.nuxt',
}

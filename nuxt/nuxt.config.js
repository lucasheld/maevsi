import bodyParser from 'body-parser'
import shrinkRay from 'shrink-ray-current'

export default {
  apollo: {
    clientConfigs: {
      default: '~/plugins/apollo-config.js',
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    /*
     ** https://github.com/nuxt-community/nuxt-property-decorator
     */
    babel: {
      presets({ _isServer }) {
        return [
          ['@nuxt/babel-preset-app', { loose: true, corejs: { version: 3 } }],
        ]
      },
    },
    /*
     ** You can extend webpack config here
     */
    extend(_config, _ctx) {},
    extractCSS: true,
  },

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    [
      '@nuxtjs/fontawesome',
      {
        icons: {
          brands: ['faGithub'],
          solid: [
            'faArchive',
            'faBug',
            'faCalendarDay',
            'faCog',
            'faDownload',
            'faCheckCircle',
            'faExternalLinkAlt',
            'faKey',
            'faGlobeAfrica',
            'faHome',
            'faHourglass',
            'faMapMarker',
            'faPlus',
            'faUser',
            'faUpload',
            'faSignOutAlt',
            'faTrash',
            'faWindowClose',
          ],
        },
        useLayers: false,
        useLayersText: false,
      },
    ],
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // Doc: https://github.com/nuxt-community/moment-module
    ['@nuxtjs/moment', { locales: ['de'] }],
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['vue-croppa/dist/vue-croppa.css', 'vue-datetime/dist/vue-datetime.css'],

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    bodyAttrs: { class: 'font-sans h-full dark-mode:text-white' },
    htmlAttrs: { class: 'h-full' },
    link: [
      {
        href: '/assets/static/favicon/apple-touch-icon.png?v=bOXMwoKlJr',
        rel: 'apple-touch-icon',
        sizes: '180x180',
      },
      {
        href: '/assets/static/favicon/favicon-32x32.png?v=bOXMwoKlJr',
        rel: 'icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        href: '/assets/static/favicon/favicon-16x16.png?v=bOXMwoKlJr',
        rel: 'icon',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        href: '/assets/static/favicon/favicon.ico',
        rel: 'icon',
        type: 'image/x-icon',
      },
      {
        href: '/assets/static/favicon/site.webmanifest?v=bOXMwoKlJr',
        rel: 'manifest',
      },
      {
        color: '#202020',
        href: '/assets/static/favicon/safari-pinned-tab.svg?v=bOXMwoKlJr',
        rel: 'mask-icon',
      },
      {
        href: '/assets/static/favicon/favicon.ico?v=bOXMwoKlJr',
        rel: 'shortcut icon',
      },
    ],
    meta: [
      { charset: 'utf-8' },
      { content: 'width=device-width, initial-scale=1', name: 'viewport' },
      {
        content: 'A manager for events supported by invitees.',
        hid: 'description',
        name: 'description',
      },
      {
        content: '/assets/static/favicon/browserconfig.xml?v=bOXMwoKlJr',
        name: 'msapplication-config',
      },
      {
        content: '#202020',
        name: 'msapplication-TileColor',
      },
      {
        content: '#202020',
        name: 'theme-color',
      },
    ],
    titleTemplate: (titleChunk) => {
      return titleChunk ? `${titleChunk} - maevsi` : 'maevsi'
    },
  },

  helmet: {
    hsts: {
      maxAge: 31536000,
      preload: true,
    },
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    'nuxt-helmet', // Should be declared at the start of the array.
    'nuxt-healthcheck',
    '@nuxtjs/apollo',
    '@nuxtjs/sitemap', // Should be declared at the end of the array.
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/global.js',
    '~/plugins/vuelidate.js',
    '~/plugins/slugify.js',
  ],

  render: {
    compressor: shrinkRay(),
    csp: {
      policies: {
        'base-uri': ["'none'"],
        'connect-src': [`https://*.${process.env.NUXT_ENV_STACK_DOMAIN}`],
        'default-src': ["'none'"],
        'font-src': ["'self'"],
        'form-action': ["'none'"],
        'frame-ancestors': ["'none'"],
        'img-src': ['data:', "'self'"],
        'manifest-src': ["'self'"],
        'report-uri': 'https://dargmuesli.report-uri.com/r/d/csp/enforce',
        'script-src': ["'self'"],
        'style-src': ["'self'"],
      },
      reportOnly: false,
    },
  },

  serverMiddleware: [
    bodyParser.json(),
    '~/middleware/server/headers.ts',
    { path: '/auth', handler: '~/api/auth.ts' },
    { path: '/ical', handler: '~/api/ical.ts' },
    { path: '/tusd', handler: '~/api/tusd.ts' },
  ],
}

import { getJwtFromCookie } from './global'

const consola = require('consola')

export default ({ req, store }) => {
  return {
    httpEndpoint: process.server
      ? 'http://postgraphile:5000/graphql'
      : 'https://postgraphile.' +
        (process.env.NUXT_ENV_STACK_DOMAIN || 'maevsi.test') +
        '/graphql',
    getAuth: (_tokenName) => {
      let jwt = store.state.jwt

      if (process.server) {
        // Server.
        const jwtData = getJwtFromCookie(req)
        if (jwtData) {
          jwt = jwtData.jwt
        }
      } else {
        // Client.
        jwt = store.state.jwt
      }

      if (jwt !== null) {
        consola.debug('Apollo request authenticated with: ' + jwt)
        return `Bearer ${jwt}`
      } else {
        consola.info('Apollo request without authentication.')
        return ''
      }
    },
  }
}

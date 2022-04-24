import { Context } from '@nuxt/types/app'

export default async function ({ $csrf, $auth }: Context) {
  if ($auth.loggedIn && !$auth.$storage.getCookies()['XSRF-TOKEN']) {
    await $csrf()
  }
}

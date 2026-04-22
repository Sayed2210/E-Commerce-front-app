export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('access_token')

  if (!token.value) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }
})

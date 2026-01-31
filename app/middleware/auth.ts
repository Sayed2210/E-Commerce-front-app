import { getAccessToken } from '~/utils/token'

/**
 * Middleware to protect authenticated routes
 */
export default defineNuxtRouteMiddleware((to) => {
  const token = getAccessToken()

  // If no token, redirect to login and preserve intended destination
  if (!token) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
})

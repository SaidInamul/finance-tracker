export default defineNuxtRouteMiddleware((to, from) => {
    
    const user = useSupabaseUser() // Access the current authenticated user
  
    // Redirect unauthenticated users to the login page
    if (!user.value && to.path !== '/login' && to.path !== '/register') {
      return navigateTo('/login')
    }
  
    // Redirect authenticated users away from login/register to the dashboard/home
    if (user.value && (to.path === '/login' || to.path === '/register')) {
      return navigateTo('/')
    }
})
  
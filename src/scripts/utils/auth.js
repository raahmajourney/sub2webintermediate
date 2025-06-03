export const protectedRoutes = ['/', '/stories/:id', '/new', '/favorite'];

export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

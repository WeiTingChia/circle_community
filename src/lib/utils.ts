export function getUserId(): string {
  const token = localStorage.getItem('token');
  const tokenPayload = token ? JSON.parse(atob(token.split('.')[1])) : null;
  return tokenPayload?.userId || '';
}
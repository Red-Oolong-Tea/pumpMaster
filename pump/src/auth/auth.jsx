export const fakeUsers = [{ username: 'test', password: 'test', token: 'test123456' }];

export function login(username, password) {
  const user = fakeUsers.find(u => u.username === username && u.password === password);
  if (user) {
    localStorage.setItem('token', user.token);
    return { success: true, token: user.token };
  }
  return { success: false };
}

export function isLoggedIn() {
  return !!localStorage.getItem('token');
}

export function logout() {
  localStorage.removeItem('token');
}

(() => {
  const isAuth = getStorage('isAuth');
  if (!isAuth) {
    logout();
    alert('Log in to view your goals.');
    window.location.href = '/login.html';
  }
})();

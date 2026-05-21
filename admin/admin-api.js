/* ============================================================
   MAI Admin — API Helper (admin-api.js)
============================================================ */
var ADMIN = (function(){
  var BASE = '';
  function token() { return localStorage.getItem('mai_token') || ''; }
  function headers() {
    return { 'Content-Type':'application/json', 'Authorization':'Bearer '+token() };
  }
  async function req(method, path, body) {
    var opts = { method:method, headers:headers() };
    if (body) opts.body = JSON.stringify(body);
    try {
      var res = await fetch(BASE+path, opts);
      return await res.json();
    } catch(e) {
      return { ok:false, msg:'Network error: '+e.message };
    }
  }

  async function requireAdmin() {
    var t = token();
    if (!t) { window.location.href = '/login.html'; return null; }
    var d = await req('GET','/api/auth/me');
    if (!d.ok || !d.user || !d.user.isAdmin) { window.location.href = '/login.html'; return null; }
    var nameEl = document.getElementById('adminName');
    if (nameEl) nameEl.textContent = d.user.username;
    return d.user;
  }

  function logout() {
    fetch('/api/auth/logout', { method:'POST', headers:headers() });
    localStorage.removeItem('mai_token');
    localStorage.removeItem('mai_user');
    window.location.href = '/login.html';
  }

  return {
    requireAdmin, logout,
    getStats:          ()       => req('GET','/api/admin/stats'),
    getUsers:          ()       => req('GET','/api/admin/users'),
    getUser:           (id)     => req('GET','/api/admin/users/'+id),
    updateUser:        (id,d)   => req('PUT','/api/admin/users/'+id,d),
    deleteUser:        (id)     => req('DELETE','/api/admin/users/'+id),
    getTransactions:   ()       => req('GET','/api/admin/transactions'),
    addTransaction:    (d)      => req('POST','/api/admin/transactions',d),
    approveTransaction:(txId)   => req('POST','/api/admin/transactions/'+txId+'/approve'),
    rejectTransaction: (txId)   => req('POST','/api/admin/transactions/'+txId+'/reject'),
    sendMessage:       (d)      => req('POST','/api/admin/messages',d),
    deleteMessage:     (msgId)  => req('DELETE','/api/admin/messages/'+msgId),
    setWithdrawPerm:   (id,e,m) => req('POST','/api/admin/users/'+id+'/withdraw-permission',{enabled:e,message:m}),
    setScores:         (id,op,a)=> req('POST','/api/admin/users/'+id+'/scores',{op,amount:a}),
    getReferralCodes:  ()       => req('GET','/api/admin/referral-codes'),
    setReferralCode:   (id,c)   => req('POST','/api/admin/users/'+id+'/referral-code',{code:c}),
    getSettings:       ()       => req('GET','/api/settings'),
    saveSettings:      (d)      => req('POST','/api/settings',d),
    getContent:        ()       => req('GET','/api/content'),
    saveContent:       (d)      => req('POST','/api/content',d),
    createGrantCode:   (d)      => req('POST','/api/admin/grant-codes',d),
    deleteGrantCode:   (id)     => req('DELETE','/api/admin/grant-codes/'+id),
  };
})();

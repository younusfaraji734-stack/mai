/* ============================================================
   MAI Platform — API Client (api.js)
   All calls go to the Node.js backend
============================================================ */
var API = (function(){
  var BASE = '';
  var _token = localStorage.getItem('mai_token') || '';
  var _user  = JSON.parse(localStorage.getItem('mai_user') || 'null');

  function headers() {
    var h = { 'Content-Type':'application/json' };
    if (_token) h['Authorization'] = 'Bearer ' + _token;
    return h;
  }

  async function req(method, path, body) {
    try {
      var opts = { method:method, headers:headers() };
      if (body) opts.body = JSON.stringify(body);
      var res = await fetch(BASE + path, opts);
      return await res.json();
    } catch(e) {
      return { ok:false, msg:'Network error: ' + e.message };
    }
  }

  function setSession(token, user) {
    _token = token; _user = user;
    localStorage.setItem('mai_token', token);
    localStorage.setItem('mai_user', JSON.stringify(user));
  }

  function clearSession() {
    _token = ''; _user = null;
    localStorage.removeItem('mai_token');
    localStorage.removeItem('mai_user');
  }

  return {
    // ── AUTH ──────────────────────────────────────────────────
    async login(email, password) {
      var d = await req('POST','/api/auth/login',{email,password});
      if (d.ok) setSession(d.token, d.user);
      return d;
    },
    async register(data) {
      var d = await req('POST','/api/auth/register',data);
      if (d.ok) setSession(d.token, d.user);
      return d;
    },
    async logout() {
      await req('POST','/api/auth/logout');
      clearSession();
      window.location.href = '/login.html';
    },
    async me() {
      if (!_token) return null;
      var d = await req('GET','/api/auth/me');
      if (d.ok) { _user = d.user; localStorage.setItem('mai_user', JSON.stringify(d.user)); return d.user; }
      return null;
    },
    getCurrentUser() { return _user; },
    getToken()       { return _token; },
    isLoggedIn()     { return !!_token; },

    // ── SETTINGS ──────────────────────────────────────────────
    async getSettings() {
      var d = await req('GET','/api/settings');
      return d.ok ? d.settings : {};
    },
    async saveSettings(s) {
      return await req('POST','/api/settings',s);
    },

    // ── CONTENT ───────────────────────────────────────────────
    async getContent() {
      var d = await req('GET','/api/content');
      return d.ok ? d.content : {};
    },
    async saveContent(c) {
      return await req('POST','/api/content',c);
    },

    // ── USER SELF ─────────────────────────────────────────────
    async getProfile() {
      var d = await req('GET','/api/user/profile');
      if (d.ok) { _user = d.user; localStorage.setItem('mai_user', JSON.stringify(d.user)); }
      return d.ok ? d.user : null;
    },
    async getMyTransactions() {
      var d = await req('GET','/api/user/transactions');
      return d.ok ? d.transactions : [];
    },
    async getMyMessages() {
      var d = await req('GET','/api/user/messages');
      return d.ok ? d.messages : [];
    },
    async markMessageRead(msgId) {
      return await req('POST','/api/user/messages/'+msgId+'/read');
    },
    async submitDeposit(amount, network, txHash) {
      return await req('POST','/api/user/deposit',{amount,network,txHash});
    },
    async submitWithdraw(amount, network, wallet) {
      return await req('POST','/api/user/withdraw',{amount,network,wallet});
    },
    async submitTask(amount, taskAmount, description) {
      return await req('POST','/api/user/task',{amount,taskAmount,description});
    },
    async getTeam() {
      var d = await req('GET','/api/user/team');
      return d.ok ? d.team : {l1:[],l2:[],l3:[]};
    },

    // ── ADMIN ─────────────────────────────────────────────────
    async adminGetStats() {
      var d = await req('GET','/api/admin/stats');
      return d.ok ? d.stats : {};
    },
    async adminGetUsers() {
      var d = await req('GET','/api/admin/users');
      return d.ok ? d.users : [];
    },
    async adminGetUser(id) {
      var d = await req('GET','/api/admin/users/'+id);
      return d.ok ? d.user : null;
    },
    async adminUpdateUser(id, data) {
      return await req('PUT','/api/admin/users/'+id, data);
    },
    async adminDeleteUser(id) {
      return await req('DELETE','/api/admin/users/'+id);
    },
    async adminGetTransactions() {
      var d = await req('GET','/api/admin/transactions');
      return d.ok ? d.transactions : [];
    },
    async adminAddTransaction(data) {
      return await req('POST','/api/admin/transactions', data);
    },
    async adminApproveTransaction(txId) {
      return await req('POST','/api/admin/transactions/'+txId+'/approve');
    },
    async adminRejectTransaction(txId) {
      return await req('POST','/api/admin/transactions/'+txId+'/reject');
    },
    async adminSendMessage(data) {
      return await req('POST','/api/admin/messages', data);
    },
    async adminDeleteMessage(msgId) {
      return await req('DELETE','/api/admin/messages/'+msgId);
    },
    async adminSetWithdrawPermission(userId, enabled, message) {
      return await req('POST','/api/admin/users/'+userId+'/withdraw-permission',{enabled,message});
    },
    async adminSetScores(userId, op, amount) {
      return await req('POST','/api/admin/users/'+userId+'/scores',{op,amount});
    },
    async adminGetReferralCodes() {
      var d = await req('GET','/api/admin/referral-codes');
      return d.ok ? d.codes : [];
    },
    async adminSetReferralCode(userId, code) {
      return await req('POST','/api/admin/users/'+userId+'/referral-code',{code});
    }
  };
})();

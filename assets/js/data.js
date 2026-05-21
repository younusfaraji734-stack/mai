/* ============================================================
   MAI Platform — Complete Data Layer
============================================================ */
var MAI = (function () {

  function genId()  { return 'u' + Date.now() + Math.random().toString(36).substr(2,5); }
  function genRef() {
    var c='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789', s='MAI';
    for(var i=0;i<6;i++) s+=c[Math.floor(Math.random()*c.length)];
    return s;
  }
  function genTxId(){ return 'TX'+Date.now()+Math.random().toString(36).substr(2,4).toUpperCase(); }

  /* ── STORAGE ─────────────────────────────────────────────── */
  function getUsers()   { return JSON.parse(localStorage.getItem('mai_users')||'[]'); }
  function saveUsers(u) { localStorage.setItem('mai_users',JSON.stringify(u)); }
  function getSettings(){ return JSON.parse(localStorage.getItem('mai_settings')||'{}'); }
  function saveSettings(s){ localStorage.setItem('mai_settings',JSON.stringify(s)); }
  function getContent(){ return JSON.parse(localStorage.getItem('mai_content')||'{}'); }
  function saveContent(c){ localStorage.setItem('mai_content',JSON.stringify(c)); }
  function getCurrentUser(){ return JSON.parse(localStorage.getItem('mai_current')||'null'); }
  function setCurrentUser(u){ localStorage.setItem('mai_current',JSON.stringify(u)); }

  /* ── SEED ────────────────────────────────────────────────── */
  function seed(){
    if(localStorage.getItem('mai_seeded')) return;
    var users=[
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
          {id:'TX001',type:'deposit', amount:100, status:'completed',date:'2024-05-12T11:05:00Z',description:'Deposit via TRC20',network:'TRC20',txHash:'0x1a4d...b7f2'},
          {id:'TX002',type:'referral',amount:5,   status:'completed',date:'2024-05-12T18:20:00Z',description:'Referral bonus',network:'',txHash:''},
          {id:'TX003',type:'withdraw',amount:20,  status:'pending',  date:'2024-05-13T09:44:00Z',description:'Withdrawal to TRC20',network:'TRC20',txHash:''},
          {id:'TX004',type:'task',    amount:2.00,status:'completed',date:'2024-05-14T10:15:00Z',description:'Task Commission · Amazon',network:'',txHash:''},
          {id:'TX005',type:'deposit', amount:50,  status:'completed',date:'2024-05-15T14:32:00Z',description:'Deposit via TRC20',network:'TRC20',txHash:'0x8f3a...c2d1'},
          {id:'TX006',type:'profit',  amount:2.60,status:'completed',date:'2024-05-15T00:00:00Z',description:'Daily Profit',network:'',txHash:''}
        ],
        teamL1:[], teamL2:[], teamL3:[], messages:[] }
    ];
    localStorage.setItem('mai_users',JSON.stringify(users));
    localStorage.setItem('mai_settings',JSON.stringify({
      platformName:'MAI Investment',
      telegramLink:'https://t.me/MAI_Official_Support',
      minDeposit:10, minWithdraw:5, withdrawFee:1,
      depositAddress:'TRx9kLmN8pQ2Wz4Qp2WzAb3Cd',
      refL1:10, refL2:5, refL3:2,
      vip1Rate:4,  vip1Min:25,  vip1Max:90,
      vip2Rate:8,  vip2Min:120, vip2Max:300,
      vip3Rate:12, vip3Min:400, vip3Max:2000
    }));
    localStorage.setItem('mai_content',JSON.stringify({
      hero:{
        badge:'🌍 Global Investment Platform',
        title:'Invest, Earn & Grow<br/>with Global Opportunities',
        subtitle:'AI-powered intelligent cloud order matching center. Join millions of investors worldwide and start earning today.',
        trustItems:['SSL Secured','Daily Payouts','150+ Countries']
      },
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
      serviceHero:{
        icon:'🎧',
        title:'We\'re Here to Help',
        subtitle:'24/7 support across all channels. Average response time: <strong>under 2 minutes</strong>',
        stats:[{val:'24/7',lbl:'Support'},{val:'<2min',lbl:'Response'},{val:'99.9%',lbl:'Satisfaction'}]
      },
      faqs:[
        {q:'How do I start investing?',a:'Register an account, complete verification, deposit USDT, and choose an investment plan. Your earnings start immediately after activation.'},
        {q:'When are profits paid?',a:'Profits are credited to your account daily at 00:00 UTC. You can withdraw anytime after the minimum threshold of 5 USDT is met.'},
        {q:'What is the minimum withdrawal?',a:'The minimum withdrawal amount is 5 USDT. Withdrawals are processed within 5–30 minutes with a 1 USDT network fee.'},
        {q:'How does the referral program work?',a:'Share your referral link. Earn 10% on Level 1, 5% on Level 2, and 2% on Level 3 referrals — paid instantly, forever, with no cap.'},
        {q:'Is my investment safe?',a:'MAI uses 256-bit SSL encryption, cold wallet storage, and multi-signature security. Your assets are protected 24/7 by our security team.'},
        {q:'Can I have multiple active plans?',a:'Yes! You can invest in multiple plans simultaneously. Each plan runs independently with its own cycle and daily profit calculation.'}
      ]
    }));
    localStorage.setItem('mai_seeded','1');
  }

  /* ── MIGRATE (patch missing fields on existing data) ─────── */
  function migrate(){
    var users=getUsers(), changed=false;
    users.forEach(function(u){
      if(u.withdrawEnabled===undefined){u.withdrawEnabled=true;changed=true;}
      if(u.withdrawMessage===undefined){u.withdrawMessage='';changed=true;}
      if(!Array.isArray(u.messages)){u.messages=[];changed=true;}
      if(!Array.isArray(u.teamL1)){u.teamL1=[];changed=true;}
      if(!Array.isArray(u.teamL2)){u.teamL2=[];changed=true;}
      if(!Array.isArray(u.teamL3)){u.teamL3=[];changed=true;}
      if(!Array.isArray(u.transactions)){u.transactions=[];changed=true;}
      if(u.totalInvested===undefined){u.totalInvested=0;changed=true;}
      if(u.totalEarned===undefined){u.totalEarned=0;changed=true;}
      if(u.balance===undefined){u.balance=0;changed=true;}
      if(u.isActive===undefined){u.isActive=true;changed=true;}
      if(u.scores===undefined){u.scores=0;changed=true;}
    });
    if(changed) saveUsers(users);
    var s=getSettings(), sc=false;
    var defs={platformName:'MAI Investment',telegramLink:'https://t.me/MAI_Official_Support',
      minDeposit:10,minWithdraw:5,withdrawFee:1,depositAddress:'TRx9kLmN8pQ2Wz4Qp2WzAb3Cd',
      refL1:10,refL2:5,refL3:2,
      vip1Rate:4,vip1Min:25,vip1Max:90,
      vip2Rate:8,vip2Min:120,vip2Max:300,
      vip3Rate:12,vip3Min:400,vip3Max:2000};
    Object.keys(defs).forEach(function(k){
      if(s[k]===undefined){s[k]=defs[k];sc=true;}
    });
    if(sc) saveSettings(s);
  }

  /* ── USER CRUD ───────────────────────────────────────────── */
  function getUser(id){ return getUsers().find(function(u){return u.id===id;})||null; }
  function getUserByEmail(e){ return getUsers().find(function(u){return u.email.toLowerCase()===e.toLowerCase();})||null; }
  function getUserByRef(c){ return getUsers().find(function(u){return u.referralCode===c;})||null; }
  function updateUser(id,updates){
    var users=getUsers(), idx=users.findIndex(function(u){return u.id===id;});
    if(idx===-1) return false;
    Object.assign(users[idx],updates);
    saveUsers(users);
    var cur=getCurrentUser();
    if(cur&&cur.id===id) localStorage.setItem('mai_current',JSON.stringify(users[idx]));
    return true;
  }

  /* ── AUTH ────────────────────────────────────────────────── */
  function logout(){
    localStorage.removeItem('mai_current');
    var base=window.location.pathname.replace(/\/admin\/.*$/,'/').replace(/\/[^/]*$/,'/');
    window.location.href=base+'login.html';
  }
  function requireAuth(){
    var u=getCurrentUser();
    if(!u){var b=window.location.pathname.replace(/\/[^/]*$/,'/');window.location.href=b+'login.html';return null;}
    return u;
  }
  function requireAdmin(){
    var u=getCurrentUser();
    if(!u||!u.isAdmin){window.location.href='../login.html';return null;}
    return u;
  }
  function login(email,password){
    var user=getUserByEmail(email);
    if(!user) return {ok:false,msg:'Email not found'};
    if(user.password!==password) return {ok:false,msg:'Wrong password'};
    if(!user.isActive) return {ok:false,msg:'Account suspended. Contact support.'};
    setCurrentUser(user);
    return {ok:true,user:user};
  }
  function register(data){
    if(!data.referralCode) return {ok:false,msg:'Referral code is required'};
    var refUser=getUserByRef(data.referralCode);
    if(!refUser) return {ok:false,msg:'Invalid referral code'};
    if(getUserByEmail(data.email)) return {ok:false,msg:'Email already registered'};
    var nu={id:genId(),username:data.username,email:data.email,password:data.password,
      phone:data.phone||'',isAdmin:false,isActive:true,referralCode:genRef(),
      invitedBy:data.referralCode,balance:0,totalEarned:0,totalInvested:0,scores:0,
      joinDate:new Date().toISOString(),withdrawEnabled:true,withdrawMessage:'',
      transactions:[],teamL1:[],teamL2:[],teamL3:[],messages:[]};
    var users=getUsers();
    users.push(nu);
    var ri=users.findIndex(function(u){return u.id===refUser.id;});
    if(ri!==-1){if(!users[ri].teamL1)users[ri].teamL1=[];users[ri].teamL1.push(nu.id);}
    saveUsers(users);
    setCurrentUser(nu);
    return {ok:true,user:nu};
  }

  /* ── TRANSACTIONS ────────────────────────────────────────── */
  function addTransaction(userId,tx){
    var users=getUsers(), idx=users.findIndex(function(u){return u.id===userId;});
    if(idx===-1) return false;
    tx.id=tx.id||genTxId(); tx.date=tx.date||new Date().toISOString();
    if(!users[idx].transactions) users[idx].transactions=[];
    users[idx].transactions.unshift(tx);
    if(tx.status==='completed'){
      if(tx.type==='deposit')  users[idx].balance=(users[idx].balance||0)+tx.amount;
      if(tx.type==='withdraw') users[idx].balance=Math.max(0,(users[idx].balance||0)-tx.amount);
      if(tx.type==='profit'||tx.type==='referral'){
        users[idx].balance=(users[idx].balance||0)+tx.amount;
        users[idx].totalEarned=(users[idx].totalEarned||0)+tx.amount;
      }
      if(tx.type==='task'){
        users[idx].balance=(users[idx].balance||0)+tx.amount;
        users[idx].totalEarned=(users[idx].totalEarned||0)+tx.amount;
        users[idx].totalInvested=(users[idx].totalInvested||0)+(tx.taskAmount||0);
      }
    }
    saveUsers(users);
    if(getCurrentUser()&&getCurrentUser().id===userId) setCurrentUser(users[idx]);
    return true;
  }
  function approveTx(userId,txId){
    var users=getUsers(), idx=users.findIndex(function(u){return u.id===userId;});
    if(idx===-1) return false;
    var ti=(users[idx].transactions||[]).findIndex(function(t){return t.id===txId;});
    if(ti===-1) return false;
    var tx=users[idx].transactions[ti];
    if(tx.status!=='pending') return false;
    tx.status='completed';
    if(tx.type==='deposit') users[idx].balance=(users[idx].balance||0)+tx.amount;
    if(tx.type==='profit'||tx.type==='referral'){
      users[idx].balance=(users[idx].balance||0)+tx.amount;
      users[idx].totalEarned=(users[idx].totalEarned||0)+tx.amount;
    }
    saveUsers(users);
    if(getCurrentUser()&&getCurrentUser().id===userId) setCurrentUser(users[idx]);
    return true;
  }
  function rejectTx(userId,txId){
    var users=getUsers(), idx=users.findIndex(function(u){return u.id===userId;});
    if(idx===-1) return false;
    var ti=(users[idx].transactions||[]).findIndex(function(t){return t.id===txId;});
    if(ti===-1) return false;
    var tx=users[idx].transactions[ti];
    if(tx.status!=='pending') return false;
    tx.status='failed';
    if(tx.type==='withdraw'){
      var s=getSettings();
      users[idx].balance=(users[idx].balance||0)+tx.amount+(s.withdrawFee||1);
    }
    saveUsers(users);
    if(getCurrentUser()&&getCurrentUser().id===userId) setCurrentUser(users[idx]);
    return true;
  }
  function getAllTransactions(){
    var all=[];
    getUsers().forEach(function(u){
      (u.transactions||[]).forEach(function(tx){
        all.push(Object.assign({},tx,{userId:u.id,userName:u.username,userEmail:u.email}));
      });
    });
    return all.sort(function(a,b){return new Date(b.date)-new Date(a.date);});
  }

  /* ── MESSAGES ────────────────────────────────────────────── */
  function sendMessage(userId,msg){
    var users=getUsers(), idx=users.findIndex(function(u){return u.id===userId;});
    if(idx===-1) return false;
    if(!users[idx].messages) users[idx].messages=[];
    users[idx].messages.unshift({id:genTxId(),subject:msg.subject||'Message from Admin',
      body:msg.body||'',type:msg.type||'info',date:new Date().toISOString(),read:false});
    saveUsers(users);
    if(getCurrentUser()&&getCurrentUser().id===userId) setCurrentUser(users[idx]);
    return true;
  }
  function markMessageRead(userId,msgId){
    var users=getUsers(), idx=users.findIndex(function(u){return u.id===userId;});
    if(idx===-1) return;
    var mi=(users[idx].messages||[]).findIndex(function(m){return m.id===msgId;});
    if(mi!==-1) users[idx].messages[mi].read=true;
    saveUsers(users);
    if(getCurrentUser()&&getCurrentUser().id===userId) setCurrentUser(users[idx]);
  }
  function deleteMessage(userId,msgId){
    var users=getUsers(), idx=users.findIndex(function(u){return u.id===userId;});
    if(idx===-1) return;
    users[idx].messages=(users[idx].messages||[]).filter(function(m){return m.id!==msgId;});
    saveUsers(users);
    if(getCurrentUser()&&getCurrentUser().id===userId) setCurrentUser(users[idx]);
  }
  function getUnreadCount(userId){
    var u=getUser(userId); if(!u) return 0;
    return (u.messages||[]).filter(function(m){return !m.read;}).length;
  }

  /* ── WITHDRAW PERMISSION ─────────────────────────────────── */
  function canWithdraw(userId){
    var u=getUser(userId); if(!u) return {allowed:false,message:'User not found'};
    if(u.withdrawEnabled===false)
      return {allowed:false,message:u.withdrawMessage||'Withdrawals are currently disabled for your account. Please contact support.'};
    return {allowed:true,message:''};
  }
  function setWithdrawPermission(userId,enabled,message){
    return updateUser(userId,{withdrawEnabled:enabled,withdrawMessage:message||''});
  }

  /* ── TEAM ────────────────────────────────────────────────── */
  function getTeam(userId){
    var user=getUser(userId); if(!user) return {l1:[],l2:[],l3:[]};
    var l1=(user.teamL1||[]).map(function(id){return getUser(id);}).filter(Boolean);
    var l2=[],l3=[];
    l1.forEach(function(m){
      (m.teamL1||[]).forEach(function(id2){
        var u2=getUser(id2); if(!u2) return;
        l2.push(u2);
        (u2.teamL1||[]).forEach(function(id3){var u3=getUser(id3);if(u3)l3.push(u3);});
      });
    });
    return {l1:l1,l2:l2,l3:l3};
  }

  /* ── INIT ────────────────────────────────────────────────── */
  seed(); migrate();

  return {
    genId,genRef,genTxId,
    getUsers,getUser,getUserByEmail,getUserByRef,updateUser,
    getCurrentUser,setCurrentUser,logout,requireAuth,requireAdmin,login,register,
    addTransaction,approveTx,rejectTx,getAllTransactions,
    sendMessage,markMessageRead,deleteMessage,getUnreadCount,
    canWithdraw,setWithdrawPermission,
    getTeam,getSettings,saveSettings,getContent,saveContent
  };
})();

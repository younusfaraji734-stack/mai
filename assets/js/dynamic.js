/* ============================================================
   dynamic.js — Page init functions + deposit/withdraw modals
============================================================ */

/* ── MODAL HELPERS ─────────────────────────────────────────── */
function openModal(id){var e=document.getElementById(id);if(e){e.classList.add('open');document.body.style.overflow='hidden';}}
function closeModal(id){var e=document.getElementById(id);if(e){e.classList.remove('open');document.body.style.overflow='';}}

/* ── TOAST ──────────────────────────────────────────────────── */
var _tt;
function showToast(msg,type){
  var t=document.getElementById('toast');if(!t)return;
  t.textContent=(type==='success'?'✓ ':'✕ ')+msg;
  t.className='toast show '+(type||'success');
  clearTimeout(_tt);_tt=setTimeout(function(){t.className='toast';},3500);
}

/* ── COPY ───────────────────────────────────────────────────── */
function copyToClipboard(text){
  if(navigator.clipboard){navigator.clipboard.writeText(text).then(function(){showToast('Copied!','success');}).catch(function(){_fbCopy(text);});}
  else _fbCopy(text);
}
function _fbCopy(text){
  var ta=document.createElement('textarea');ta.value=text;ta.style.cssText='position:fixed;top:0;left:0;opacity:0';
  document.body.appendChild(ta);ta.focus();ta.select();
  try{document.execCommand('copy');showToast('Copied!','success');}catch(e){showToast('Copy failed','error');}
  document.body.removeChild(ta);
}

/* ── CLOSE MODAL ON OVERLAY CLICK ───────────────────────────── */
document.addEventListener('DOMContentLoaded',function(){
  document.querySelectorAll('.modal-overlay').forEach(function(o){
    o.addEventListener('click',function(e){if(e.target===this)closeModal(this.id);});
  });
});

/* ── OPEN DEPOSIT MODAL ─────────────────────────────────────── */
var _depositSettings=null;
async function openDepositModal(){
  _depositSettings=await API.getSettings();
  var s=_depositSettings;
  var netWrap=document.querySelector('#modalRecharge .network-tags');
  if(netWrap){
    netWrap.innerHTML='<span class="ntag active" data-net="TRC20">TRC20</span><span class="ntag" data-net="ERC20">ERC20</span>';
    netWrap.querySelectorAll('.ntag').forEach(function(tag){
      tag.addEventListener('click',function(){
        netWrap.querySelectorAll('.ntag').forEach(function(t){t.classList.remove('active');});
        this.classList.add('active');
        _updateDepositAddress(s,this.getAttribute('data-net'));
      });
    });
  }
  _updateDepositAddress(s,'TRC20');
  var rows=document.querySelectorAll('#modalRecharge .info-row');
  if(rows[0])rows[0].querySelector('strong').textContent=(s.minDeposit||10)+' USDT';
  if(rows[1])rows[1].querySelector('strong').textContent=(s.withdrawFee||1)+' USDT';
  var amtIn=document.querySelector('#modalRecharge input[type="number"]');
  if(amtIn)amtIn.value='';
  openModal('modalRecharge');
}
function _updateDepositAddress(s,network){
  var addr=network==='ERC20'?(s.walletERC20||s.depositAddress||''):(s.walletTRC20||s.depositAddress||'');
  var addrEl=document.querySelector('#modalRecharge .addr-text');
  if(addrEl)addrEl.textContent=addr||'Address not configured';
  var copyBtn=document.querySelector('#modalRecharge .copy-btn');
  if(copyBtn)copyBtn.onclick=function(){copyToClipboard(addr);};
  // Generate real QR code
  var qrEl=document.getElementById('qrcode');
  if(qrEl&&typeof QRCode!=='undefined'){
    qrEl.innerHTML='';
    if(addr){
      new QRCode(qrEl,{text:addr,width:120,height:120,colorDark:'#000000',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.M});
    } else {
      qrEl.innerHTML='<div style="width:120px;height:120px;display:flex;align-items:center;justify-content:center;color:#a0a0c0;font-size:11px;text-align:center">No address<br>configured</div>';
    }
  }
}

/* ── OPEN WITHDRAW MODAL ────────────────────────────────────── */
async function openWithdrawModal(){
  var s=await API.getSettings();
  var u=await API.me();if(!u)return;
  var bal=u.balance||0;
  if(u.withdrawEnabled===false){
    _showBlockedMsg(u.withdrawMessage||'Withdrawals are currently disabled for your account. Please contact support.');
    return;
  }
  var netWrap=document.querySelector('#modalWithdraw .network-tags');
  if(netWrap){
    netWrap.innerHTML='<span class="ntag active" data-net="TRC20">TRC20</span><span class="ntag" data-net="ERC20">ERC20</span>';
    netWrap.querySelectorAll('.ntag').forEach(function(tag){
      tag.addEventListener('click',function(){
        netWrap.querySelectorAll('.ntag').forEach(function(t){t.classList.remove('active');});
        this.classList.add('active');
      });
    });
  }
  var rows=document.querySelectorAll('#modalWithdraw .info-row');
  if(rows[0])rows[0].querySelector('strong').textContent=bal.toFixed(2)+' USDT';
  if(rows[1])rows[1].querySelector('strong').textContent=(s.minWithdraw||5)+' USDT';
  if(rows[2])rows[2].querySelector('strong').textContent=(s.withdrawFee||1)+' USDT';
  var maxBtn=document.querySelector('#modalWithdraw .max-btn');
  if(maxBtn)maxBtn.onclick=function(){
    var inp=document.querySelector('#modalWithdraw input[type="number"]');
    if(inp)inp.value=Math.max(0,bal-(s.withdrawFee||1)).toFixed(2);
  };
  var wIn=document.querySelector('#modalWithdraw input[type="text"]');
  var aIn=document.querySelector('#modalWithdraw input[type="number"]');
  if(wIn)wIn.value='';if(aIn)aIn.value='';
  openModal('modalWithdraw');
}

/* ── SUBMIT DEPOSIT ─────────────────────────────────────────── */
async function submitDeposit(){
  var s=await API.getSettings();
  var amtIn=document.querySelector('#modalRecharge input[type="number"]');
  var amt=amtIn?(parseFloat(amtIn.value)||0):0;
  if(amt<(s.minDeposit||10)){showToast('Minimum deposit is '+(s.minDeposit||10)+' USDT','error');return;}
  var net=(document.querySelector('#modalRecharge .ntag.active')||{}).textContent||'TRC20';
  var d=await API.submitDeposit(amt,net.trim(),'');
  if(!d.ok){showToast(d.msg||'Error submitting deposit','error');return;}
  if(amtIn)amtIn.value='';
  closeModal('modalRecharge');
  showToast('Deposit submitted! Awaiting admin confirmation.','success');
}

/* ── SUBMIT WITHDRAW ────────────────────────────────────────── */
async function submitWithdraw(){
  var s=await API.getSettings();
  var wIn=document.querySelector('#modalWithdraw input[type="text"]');
  var aIn=document.querySelector('#modalWithdraw input[type="number"]');
  var wallet=wIn?wIn.value.trim():'',amt=aIn?(parseFloat(aIn.value)||0):0;
  var minW=s.minWithdraw||5;
  if(!wallet||wallet.length<10){showToast('Enter a valid wallet address','error');return;}
  if(amt<minW){showToast('Minimum withdrawal is '+minW+' USDT','error');return;}
  var net=(document.querySelector('#modalWithdraw .ntag.active')||{}).textContent||'TRC20';
  var d=await API.submitWithdraw(amt,net.trim(),wallet);
  if(!d.ok){showToast(d.msg||'Error','error');return;}
  if(wIn)wIn.value='';if(aIn)aIn.value='';
  closeModal('modalWithdraw');
  showToast('Withdrawal submitted! Processing in 5–30 minutes.','success');
  var fresh=await API.me();
  if(fresh)_refreshBal(fresh);
}

/* ── WITHDRAW BLOCKED OVERLAY ───────────────────────────────── */
function _showBlockedMsg(msg){
  var old=document.getElementById('_wbOv');if(old)old.remove();
  var d=document.createElement('div');d.id='_wbOv';
  d.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.88);backdrop-filter:blur(8px);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px';
  d.innerHTML='<div style="background:#16162a;border:1px solid rgba(239,68,68,0.4);border-radius:20px;padding:32px 24px;max-width:380px;width:100%;text-align:center">'
    +'<div style="font-size:48px;margin-bottom:16px">🔒</div>'
    +'<h3 style="font-size:18px;font-weight:700;color:#ef4444;margin-bottom:12px">Withdrawal Restricted</h3>'
    +'<p style="font-size:14px;color:#a0a0c0;line-height:1.6;margin-bottom:24px">'+(msg||'Withdrawals are currently disabled.')+'</p>'
    +'<button onclick="document.getElementById(\'_wbOv\').remove()" style="background:linear-gradient(135deg,#6C63FF,#FF6584);color:white;border:none;padding:12px 32px;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;width:100%">OK, Got It</button>'
    +'<div style="margin-top:12px"><a href="service.html" style="color:#6C63FF;font-size:13px;text-decoration:none">Contact Support →</a></div>'
    +'</div>';
  document.body.appendChild(d);
}

/* ── REFRESH BALANCE ────────────────────────────────────────── */
function _refreshBal(u){
  if(!u)return;
  var bal=(u.balance||0).toFixed(2);
  ['.bc-amount','.mbc-val'].forEach(function(sel){var e=document.querySelector(sel);if(e)e.innerHTML=bal+' <span>USDT</span>';});
  var ms=document.querySelector('.mbc-sub');if(ms)ms.textContent='≈ $'+bal+' USD';
  var hbv=document.getElementById('headerBalVal');if(hbv)hbv.textContent=bal;
  var hb=document.getElementById('headerBalance');if(hb)hb.innerHTML=bal+' <span>USDT</span>';
}

/* ── WARNING MESSAGE POPUP ──────────────────────────────────── */
async function checkWarningMessages(){
  try {
    var msgs = await API.getMyMessages();
    if (!msgs || !msgs.length) return;
    // Find unread warning OR error messages
    var warnings = msgs.filter(function(m){
      return (m.type === 'warning' || m.type === 'error') && !m.read;
    });
    if (!warnings.length) return;
    // Show the most recent unread warning as a blocking popup
    var w = warnings[0];
    var old = document.getElementById('_warnPopup');
    if (old) old.remove();
    var iconColor = w.type === 'error' ? '#ef4444' : '#FFB800';
    var borderColor = w.type === 'error' ? 'rgba(239,68,68,0.4)' : 'rgba(255,184,0,0.4)';
    var btnColor = w.type === 'error'
      ? 'background:linear-gradient(135deg,#ef4444,#b91c1c)'
      : 'background:linear-gradient(135deg,#FFB800,#FF8C00)';
    var d = document.createElement('div');
    d.id = '_warnPopup';
    d.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);backdrop-filter:blur(10px);z-index:99998;display:flex;align-items:center;justify-content:center;padding:20px';
    d.innerHTML =
      '<div style="background:#16162a;border:1px solid '+borderColor+';border-radius:20px;padding:32px 24px;max-width:420px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.6)">'
      + '<div style="width:64px;height:64px;background:rgba(255,184,0,0.15);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px">'
      + '<svg width="32" height="32" fill="none" stroke="'+iconColor+'" stroke-width="2.5" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
      + '</div>'
      + '<h3 style="font-size:18px;font-weight:800;color:'+iconColor+';margin-bottom:12px">' + (w.subject || 'Important Notice') + '</h3>'
      + '<p style="font-size:14px;color:#c0c0d0;line-height:1.75;margin-bottom:28px;white-space:pre-wrap;text-align:left">' + (w.body || '') + '</p>'
      + '<button id="_warnOkBtn" style="'+btnColor+';color:white;border:none;padding:14px 40px;border-radius:14px;font-size:15px;font-weight:700;cursor:pointer;width:100%">OK, I Understand</button>'
      + '</div>';
    document.body.appendChild(d);
    document.getElementById('_warnOkBtn').addEventListener('click', function(){
      d.remove();
    });
  } catch(e) { console.error('checkWarningMessages error:', e); }
}

/* ── PAGE INIT: INDEX.HTML ──────────────────────────────────── */
async function initIndexPage(){
  var u=API.getCurrentUser();
  if(!u||!API.getToken()){window.location.href='login.html';return;}
  u=await API.me();
  if(!u){window.location.href='login.html';return;}
  var s=await API.getSettings();
  var team=await API.getTeam();
  var total=team.l1.length+team.l2.length+team.l3.length;
  var av=document.querySelector('.bc-avatar');
  if(av){
    var _avKey='mai_avatar_'+(u.id||'');
    var _avImg=localStorage.getItem(_avKey);
    if(_avImg){
      av.textContent='';
      av.style.backgroundImage='url('+_avImg+')';
      av.style.backgroundSize='cover';
      av.style.backgroundPosition='center';
    } else {
      av.textContent=(u.username||'U')[0].toUpperCase();
    }
  }
  var bn=document.querySelector('.bc-name');if(bn)bn.textContent=u.username||'User';
  var ba=document.querySelector('.bc-amount');if(ba)ba.innerHTML=(u.balance||0).toFixed(2)+' <span>USDT</span>';
  var txs=await API.getMyTransactions();
  var today=new Date().toISOString().slice(0,10);
  var tp=txs.filter(function(t){return(t.type==='profit'||t.type==='task'||t.type==='referral')&&t.status==='completed'&&(t.date||'').slice(0,10)===today;}).reduce(function(s,t){return s+(t.amount||0);},0);
  var bv=document.querySelectorAll('.bcs-val');
  if(bv[0])bv[0].textContent=tp.toFixed(2);
  if(bv[1])bv[1].textContent=(u.totalEarned||0).toFixed(2);
  if(bv[2])bv[2].textContent=total;
  var v1r=document.querySelector('.tier-vip1 .tier-rate');if(v1r)v1r.innerHTML=(s.vip1Rate||20)+'%<small>/task</small>';
  var v2r=document.querySelector('.tier-vip2 .tier-rate');if(v2r)v2r.innerHTML=(s.vip2Rate||35)+'%<small>/task</small>';
  var v3r=document.querySelector('.tier-vip3 .tier-rate');if(v3r)v3r.innerHTML=(s.vip3Rate||55)+'%<small>/task</small>';
  var v1s=document.querySelectorAll('.tier-vip1 .tier-row strong');if(v1s[0])v1s[0].textContent='$'+(s.vip1Min||25)+' USDT';
  var v2s=document.querySelectorAll('.tier-vip2 .tier-row strong');if(v2s[0])v2s[0].textContent='$'+(s.vip2Min||120)+' USDT';
  var v3s=document.querySelectorAll('.tier-vip3 .tier-row strong');if(v3s[0])v3s[0].textContent='$'+(s.vip3Min||400)+' USDT';
  var ib=document.getElementById('inviteBtn');
  if(ib)ib.onclick=function(){copyToClipboard(location.origin+'/register.html?ref='+(u.referralCode||''));showToast('Invite link copied!','success');};
  if(s.platformName)document.title=s.platformName+' — Home';
  checkWarningMessages();
}

/* ── PAGE INIT: MINE.HTML ───────────────────────────────────── */
async function initMinePage(){
  var u=API.getCurrentUser();
  if(!u||!API.getToken()){window.location.href='login.html';return;}
  u=await API.me();
  if(!u){window.location.href='login.html';return;}
  var s=await API.getSettings();
  var team=await API.getTeam();
  var total=team.l1.length+team.l2.length+team.l3.length;
  var av=document.querySelector('.mh-avatar');
  if(av){
    var _avKey='mai_avatar_'+(u.id||'');
    var _avImg=localStorage.getItem(_avKey);
    if(_avImg){
      av.textContent='';
      av.style.backgroundImage='url('+_avImg+')';
      av.style.backgroundSize='cover';
      av.style.backgroundPosition='center';
    } else {
      av.textContent=(u.username||'U')[0].toUpperCase();
    }
  }
  var nm=document.querySelector('.mh-name');if(nm)nm.textContent=u.username||'User';
  var id=document.querySelector('.mh-id');if(id)id.textContent='ID: '+u.id;
  var sc=document.getElementById('userScores');if(sc)sc.textContent=u.scores||0;
  var sv=document.querySelectorAll('.ms-val');
  if(sv[0])sv[0].textContent='$'+(u.totalInvested||0).toFixed(2);
  if(sv[1])sv[1].textContent='$'+(u.totalEarned||0).toFixed(2);
  if(sv[2])sv[2].textContent=total;
  if(sv[3])sv[3].textContent=0;
  var mv=document.querySelector('.mbc-val');if(mv)mv.innerHTML=(u.balance||0).toFixed(2)+' <span>USDT</span>';
  var ms=document.querySelector('.mbc-sub');if(ms)ms.textContent='≈ $'+(u.balance||0).toFixed(2)+' USD';
  var refLink=location.origin+'/register.html?ref='+(u.referralCode||'');
  var rct=document.getElementById('refCodeText');if(rct)rct.textContent=u.referralCode||'MAI-XXXX';
  var rlt=document.getElementById('refLinkText');if(rlt)rlt.textContent=refLink;
  var rcb=document.getElementById('refCodeCopyBtn');if(rcb)rcb.onclick=function(){copyToClipboard(u.referralCode||'');};
  var rlb=document.getElementById('refLinkCopyBtn');if(rlb)rlb.onclick=function(){copyToClipboard(refLink);};
  var l1e=document.getElementById('refL1Rate');if(l1e)l1e.textContent=(s.refL1||10)+'%';
  var l2e=document.getElementById('refL2Rate');if(l2e)l2e.textContent=(s.refL2||5)+'%';
  var l3e=document.getElementById('refL3Rate');if(l3e)l3e.textContent=(s.refL3||2)+'%';
  var rd=document.querySelector('.ref-desc');if(rd)rd.innerHTML='Earn up to <strong>'+(s.refL1||10)+'%</strong> commission on every referral investment';
  var r1=(s.refL1||10)/100,r2=(s.refL2||5)/100,r3=(s.refL3||2)/100,earned=0;
  team.l1.forEach(function(m){earned+=(m.totalInvested||0)*r1;});
  team.l2.forEach(function(m){earned+=(m.totalInvested||0)*r2;});
  team.l3.forEach(function(m){earned+=(m.totalInvested||0)*r3;});
  var ti=document.getElementById('teamInfo');
  if(ti)ti.textContent=total+' members · $'+earned.toFixed(2)+' earned';
  var msgs=await API.getMyMessages();
  var unread=msgs.filter(function(m){return !m.read;}).length;
  var ml=document.getElementById('msgCountLabel');
  if(ml)ml.textContent=unread>0?unread+' new message'+(unread>1?'s':''):'No new messages';
  if(s.platformName)document.title=s.platformName+' — Profile';
  checkWarningMessages();
}

/* ── PAGE INIT: SERVICE.HTML ────────────────────────────────── */
async function initServicePage(){
  var u=API.getCurrentUser();
  if(!u||!API.getToken()){window.location.href='login.html';return;}
  var s=await API.getSettings();
  var tg=document.querySelector('.contact-card.primary-contact');
  if(tg&&s.telegramLink){
    tg.href=s.telegramLink;
    var tgp=tg.querySelector('p');if(tgp)tgp.textContent=s.telegramLink.replace('https://t.me/','@');
  }
  document.querySelectorAll('.article-body').forEach(function(b){
    b.innerHTML=b.innerHTML
      .replace(/Minimum deposit is [\d.]+ USDT/g,'Minimum deposit is '+(s.minDeposit||10)+' USDT')
      .replace(/Minimum withdrawal is [\d.]+ USDT/g,'Minimum withdrawal is '+(s.minWithdraw||5)+' USDT')
      .replace(/A network fee of [\d.]+ USDT/g,'A network fee of '+(s.withdrawFee||1)+' USDT');
  });
  document.querySelectorAll('.faq-a').forEach(function(a){
    a.innerHTML=a.innerHTML
      .replace(/minimum threshold of [\d.]+ USDT/g,'minimum threshold of '+(s.minWithdraw||5)+' USDT')
      .replace(/[\d.]+ USDT network fee/g,(s.withdrawFee||1)+' USDT network fee');
  });
  if(s.platformName)document.title=s.platformName+' — Service';
}

/* ── PAGE INIT: TEAM.HTML ───────────────────────────────────── */
async function initTeamPage(){
  var u=API.getCurrentUser();
  if(!u||!API.getToken()){window.location.href='login.html';return;}
  u=await API.me();if(!u){window.location.href='login.html';return;}
  var s=await API.getSettings();
  var team=await API.getTeam();
  var refLink=location.origin+'/register.html?ref='+(u.referralCode||'');
  var rcd=document.getElementById('refCodeDisplay');if(rcd)rcd.textContent=u.referralCode||'MAI-XXXX';
  var rld=document.getElementById('refLinkDisplay');if(rld)rld.textContent=refLink;
  var ci=document.querySelectorAll('.comm-pct');
  if(ci[0])ci[0].textContent=(s.refL1||10)+'%';
  if(ci[1])ci[1].textContent=(s.refL2||5)+'%';
  if(ci[2])ci[2].textContent=(s.refL3||2)+'%';
  var r1=(s.refL1||10)/100,r2=(s.refL2||5)/100,r3=(s.refL3||2)/100;
  var earned=0;
  team.l1.forEach(function(m){earned+=(m.totalInvested||0)*r1;});
  team.l2.forEach(function(m){earned+=(m.totalInvested||0)*r2;});
  team.l3.forEach(function(m){earned+=(m.totalInvested||0)*r3;});
  var total=team.l1.length+team.l2.length+team.l3.length;
  var active=team.l1.concat(team.l2).concat(team.l3).filter(function(m){return m.isActive!==false;}).length;
  var st=document.getElementById('statTotal');if(st)st.textContent=total;
  var se=document.getElementById('statEarned');if(se)se.textContent='$'+earned.toFixed(2);
  var sa=document.getElementById('statActive');if(sa)sa.textContent=active;
  var l1c=document.getElementById('l1count');if(l1c)l1c.textContent=team.l1.length?'('+team.l1.length+')':'';
  var l2c=document.getElementById('l2count');if(l2c)l2c.textContent=team.l2.length?'('+team.l2.length+')':'';
  var l3c=document.getElementById('l3count');if(l3c)l3c.textContent=team.l3.length?'('+team.l3.length+')':'';
  window.copyRefCode=function(){copyToClipboard(u.referralCode||'');};
  window.copyRefLink=function(){copyToClipboard(refLink);};
  var COLORS=['#6C63FF','#FF6584','#22c55e','#4facfe','#FFD700','#f093fb','#FFA500','#43e97b'];
  function maskName(n){if(!n||n.length<2)return n||'User';return n[0]+'****'+n.slice(-1);}
  function renderSec(members,label,rate,color){
    var html='';
    if(label)html+='<div style="font-size:11px;font-weight:700;color:'+color+';text-transform:uppercase;letter-spacing:0.5px;padding:4px 0 8px">'+label+' — '+Math.round(rate*100)+'% Commission</div>';
    members.forEach(function(m,i){
      var comm=((m.totalInvested||0)*rate).toFixed(2);
      var joined=new Date(m.joinDate).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
      html+='<div class="member-card"><div class="mc-avatar" style="background:'+COLORS[i%COLORS.length]+'">'+(m.username||'U')[0].toUpperCase()+'</div>'
        +'<div class="mc-info"><div class="mc-name">'+maskName(m.username)+'</div></div>'
        +'<div class="mc-right"><div class="mc-invested">$'+(m.totalInvested||0).toFixed(2)+' invested</div>'
        +'<div class="mc-comm">+$'+comm+' commission</div><div class="mc-date">Joined '+joined+'</div></div></div>';
    });
    return html;
  }
  window.showLevel=function(level,btn){
    document.querySelectorAll('.ltab').forEach(function(t){t.classList.remove('active');});
    if(btn)btn.classList.add('active');
    var ml=document.getElementById('memberList');if(!ml)return;
    if(level==='all'){
      var html='';
      if(team.l1.length)html+=renderSec(team.l1,'Level 1',r1,'#22c55e');
      if(team.l2.length)html+=renderSec(team.l2,'Level 2',r2,'#6C63FF');
      if(team.l3.length)html+=renderSec(team.l3,'Level 3',r3,'#FF6584');
      if(!total)html='<div class="empty-team"><div class="et-icon">👥</div><p>No team members yet.<br>Share your referral code!</p><button onclick="copyRefLink()">📋 Copy Invite Link</button></div>';
      ml.innerHTML=html;
    }else{
      var list=level==='l1'?team.l1:level==='l2'?team.l2:team.l3;
      var rate=level==='l1'?r1:level==='l2'?r2:r3;
      ml.innerHTML=list.length?renderSec(list,'',rate,'#22c55e'):'<div class="empty-team"><div class="et-icon">👥</div><p>No members at this level</p></div>';
    }
  };
  window.showLevel('all',document.querySelector('.ltab'));
}

/* ── PAGE INIT: INVEST.HTML ─────────────────────────────────── */
async function initInvestPage(){
  var u=API.getCurrentUser();
  if(!u||!API.getToken()){window.location.href='login.html';return;}
  u=await API.me();if(!u){window.location.href='login.html';return;}
  var s=await API.getSettings();
  var hbv=document.getElementById('headerBalVal');if(hbv)hbv.textContent=(u.balance||0).toFixed(2);
  var hb=document.getElementById('headerBalance');if(hb)hb.innerHTML=(u.balance||0).toFixed(2)+' <span>USDT</span>';
  var vt1=document.querySelector('.vip-tab-1 .vt-rate');if(vt1)vt1.textContent=(s.vip1Rate||20)+'%';
  var vt2=document.querySelector('.vip-tab-2 .vt-rate');if(vt2)vt2.textContent=(s.vip2Rate||35)+'%';
  var vt3=document.querySelector('.vip-tab-3 .vt-rate');if(vt3)vt3.textContent=(s.vip3Rate||55)+'%';
  if(s.platformName)document.title=s.platformName+' — Tasks';
  checkWarningMessages();
}

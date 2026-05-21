/* ============================================================
   SHARED MODALS — 100% Dynamic from MAI.getSettings()
   All values are read FRESH every time a modal opens.
   Admin changes to settings apply instantly on next open.
============================================================ */

// ── OPEN DEPOSIT MODAL ────────────────────────────────────────
// Call this instead of openModal('modalRecharge') directly
function openDepositModal() {
  var s = MAI.getSettings();
  var addr = s.depositAddress || 'TRx9kLmN8pQ2Wz4Qp2WzAb3Cd';

  // Address text
  var addrEl = document.querySelector('#modalRecharge .addr-text');
  if (addrEl) addrEl.textContent = addr;

  // Copy button
  var copyBtn = document.querySelector('#modalRecharge .copy-btn');
  if (copyBtn) {
    copyBtn.onclick = function() {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(addr).catch(function(){});
      }
      showToast('Address copied!', 'success');
    };
  }

  // Info rows: Min Deposit, Fee
  var infoRows = document.querySelectorAll('#modalRecharge .info-row');
  if (infoRows[0]) infoRows[0].querySelector('strong').textContent = (s.minDeposit || 10) + ' USDT';
  if (infoRows[1]) infoRows[1].querySelector('strong').textContent = (s.withdrawFee || 1) + ' USDT';

  // Clear amount input
  var amtInput = document.querySelector('#modalRecharge input[type="number"]');
  if (amtInput) amtInput.value = '';

  openModal('modalRecharge');
}

// ── OPEN WITHDRAW MODAL ───────────────────────────────────────
function openWithdrawModal() {
  var s = MAI.getSettings();
  var u = MAI.getCurrentUser();
  if (!u) return;
  var bal = u.balance || 0;

  // Info rows: Available, Min Withdraw, Fee
  var infoRows = document.querySelectorAll('#modalWithdraw .info-row');
  if (infoRows[0]) infoRows[0].querySelector('strong').textContent = bal.toFixed(2) + ' USDT';
  if (infoRows[1]) infoRows[1].querySelector('strong').textContent = (s.minWithdraw || 5) + ' USDT';
  if (infoRows[2]) infoRows[2].querySelector('strong').textContent = (s.withdrawFee || 1) + ' USDT';

  // MAX button
  var maxBtn = document.querySelector('#modalWithdraw .max-btn');
  if (maxBtn) {
    maxBtn.onclick = function() {
      var amtInput = document.querySelector('#modalWithdraw input[type="number"]');
      if (amtInput) {
        var max = Math.max(0, bal - (s.withdrawFee || 1));
        amtInput.value = max.toFixed(2);
      }
    };
  }

  // Clear inputs
  var walletInput = document.querySelector('#modalWithdraw input[type="text"]');
  var amtInput2   = document.querySelector('#modalWithdraw input[type="number"]');
  if (walletInput) walletInput.value = '';
  if (amtInput2)   amtInput2.value   = '';

  openModal('modalWithdraw');
}

// ── SUBMIT DEPOSIT ────────────────────────────────────────────
function submitDeposit() {
  var s = MAI.getSettings();
  var u = MAI.getCurrentUser();
  if (!u) return;

  var amtInput = document.querySelector('#modalRecharge input[type="number"]');
  var amt = amtInput ? (parseFloat(amtInput.value) || 0) : 0;

  if (amt < (s.minDeposit || 10)) {
    showToast('Minimum deposit is ' + (s.minDeposit || 10) + ' USDT', 'error');
    return;
  }

  var activeNet = document.querySelector('#modalRecharge .ntag.active');
  var network = activeNet ? activeNet.textContent.trim() : 'TRC20';

  MAI.addTransaction(u.id, {
    type: 'deposit', amount: amt, status: 'pending',
    description: 'Deposit via ' + network,
    network: network, txHash: ''
  });

  if (amtInput) amtInput.value = '';
  closeModal('modalRecharge');
  showToast('Deposit submitted! Awaiting admin confirmation.', 'success');
}

// ── SUBMIT WITHDRAW ───────────────────────────────────────────
function submitWithdraw() {
  var s = MAI.getSettings();
  var u = MAI.getCurrentUser();
  if (!u) return;

  // Check withdraw permission FIRST
  var perm = MAI.canWithdraw(u.id);
  if (!perm.allowed) {
    closeModal('modalWithdraw');
    showWithdrawBlockedMessage(perm.message);
    return;
  }

  var walletInput = document.querySelector('#modalWithdraw input[type="text"]');
  var amtInput    = document.querySelector('#modalWithdraw input[type="number"]');
  var wallet = walletInput ? walletInput.value.trim() : '';
  var amt    = amtInput    ? (parseFloat(amtInput.value) || 0) : 0;
  var minW   = s.minWithdraw || 5;
  var fee    = s.withdrawFee || 1;
  var bal    = u.balance || 0;

  if (!wallet || wallet.length < 10) {
    showToast('Please enter a valid wallet address', 'error');
    return;
  }
  if (amt < minW) {
    showToast('Minimum withdrawal is ' + minW + ' USDT', 'error');
    return;
  }
  if (amt + fee > bal) {
    showToast('Insufficient balance. Need ' + (amt + fee).toFixed(2) + ' USDT (incl. ' + fee + ' USDT fee)', 'error');
    return;
  }

  var activeNet = document.querySelector('#modalWithdraw .ntag.active');
  var network = activeNet ? activeNet.textContent.trim() : 'TRC20';

  // Deduct balance immediately (pending)
  MAI.updateUser(u.id, { balance: Math.max(0, bal - amt - fee) });

  MAI.addTransaction(u.id, {
    type: 'withdraw', amount: amt, status: 'pending',
    description: 'Withdrawal to ' + network + ' wallet',
    network: network, wallet: wallet, txHash: ''
  });

  closeModal('modalWithdraw');
  showToast('Withdrawal submitted! Processing in 5–30 minutes.', 'success');
  refreshBalanceDisplay();
}

// ── WITHDRAW BLOCKED MESSAGE ──────────────────────────────────
function showWithdrawBlockedMessage(message) {
  var existing = document.getElementById('withdrawBlockedOverlay');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.id = 'withdrawBlockedOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);backdrop-filter:blur(8px);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px';
  overlay.innerHTML =
    '<div style="background:#16162a;border:1px solid rgba(239,68,68,0.4);border-radius:20px;padding:32px 24px;max-width:380px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.6)">'
    + '<div style="font-size:48px;margin-bottom:16px">🔒</div>'
    + '<h3 style="font-size:18px;font-weight:700;color:#ef4444;margin-bottom:12px">Withdrawal Restricted</h3>'
    + '<p style="font-size:14px;color:#a0a0c0;line-height:1.6;margin-bottom:24px">' + (message || 'Withdrawals are currently disabled for your account. Please contact support.') + '</p>'
    + '<button onclick="document.getElementById(\'withdrawBlockedOverlay\').remove()" style="background:linear-gradient(135deg,#6C63FF,#FF6584);color:white;border:none;padding:12px 32px;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;width:100%">OK, Got It</button>'
    + '<div style="margin-top:12px"><a href="service.html" style="color:#6C63FF;font-size:13px;text-decoration:none">Contact Support →</a></div>'
    + '</div>';
  document.body.appendChild(overlay);
}

// ── REFRESH BALANCE ON PAGE ───────────────────────────────────
function refreshBalanceDisplay() {
  var u = MAI.getCurrentUser();
  if (!u) return;
  var bal = (u.balance || 0).toFixed(2);

  var bcAmt = document.querySelector('.bc-amount');
  if (bcAmt) bcAmt.innerHTML = bal + ' <span>USDT</span>';

  var mbcVal = document.querySelector('.mbc-val');
  if (mbcVal) mbcVal.innerHTML = bal + ' <span>USDT</span>';

  var mbcSub = document.querySelector('.mbc-sub');
  if (mbcSub) mbcSub.textContent = '≈ $' + bal + ' USD';

  var hdrBalVal = document.getElementById('headerBalVal');
  if (hdrBalVal) hdrBalVal.textContent = bal;

  var hdrBal = document.getElementById('headerBalance');
  if (hdrBal) hdrBal.innerHTML = bal + ' <span>USDT</span>';
}

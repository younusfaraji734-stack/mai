/* ============================================================
   MAI Platform — Shared JS (shared.js)
   Modal, toast, clipboard, formatting helpers
============================================================ */

// ── MODAL ─────────────────────────────────────────────────────
function openModal(id) {
  var el = document.getElementById(id);
  if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  var el = document.getElementById(id);
  if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
}

// Close modal on overlay click
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === this) closeModal(this.id);
    });
  });
  // Network tag switching
  document.querySelectorAll('.ntag').forEach(function(tag) {
    tag.addEventListener('click', function() {
      this.closest('.network-tags').querySelectorAll('.ntag').forEach(function(t){ t.classList.remove('active'); });
      this.classList.add('active');
    });
  });
});

// ── TOAST ─────────────────────────────────────────────────────
var _toastTimer;
function showToast(msg, type) {
  type = type || 'success';
  var toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = (type === 'success' ? '✓ ' : '✕ ') + msg;
  toast.className = 'toast show ' + type;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(function() { toast.className = 'toast'; }, 3500);
}

// ── CLIPBOARD ─────────────────────────────────────────────────
function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(function() {
      showToast('Copied!', 'success');
    }).catch(function() { _fallbackCopy(text); });
  } else {
    _fallbackCopy(text);
  }
}
function _fallbackCopy(text) {
  var ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
  document.body.appendChild(ta);
  ta.focus(); ta.select();
  try { document.execCommand('copy'); showToast('Copied!', 'success'); }
  catch(e) { showToast('Copy failed', 'error'); }
  document.body.removeChild(ta);
}

// ── FORMAT HELPERS ─────────────────────────────────────────────
function formatBalance(amount) { return parseFloat(amount || 0).toFixed(2); }
function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
}
function formatDateTime(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString('en-US', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' });
}
function formatTimeAgo(iso) {
  if (!iso) return '';
  var diff = Date.now() - new Date(iso).getTime();
  var m = Math.floor(diff / 60000);
  var h = Math.floor(diff / 3600000);
  var d = Math.floor(diff / 86400000);
  if (m < 1)  return 'just now';
  if (m < 60) return m + 'm ago';
  if (h < 24) return h + 'h ago';
  return d + 'd ago';
}

// ── PRELOADER ─────────────────────────────────────────────────
(function(){
  function hidePreloader() {
    var p = document.getElementById('sitePreloader');
    if (p) p.classList.add('hide');
  }
  // Always hide after 1.5s no matter what
  setTimeout(hidePreloader, 1500);
})();

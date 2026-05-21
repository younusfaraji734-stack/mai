/* ============================================================
   MAI Admin — Common Utilities (admin-common.js)
============================================================ */

// ── TOAST ─────────────────────────────────────────────────────
var _toastTimeout;
function showToast(msg, type) {
  var toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = (type === 'success' ? '✓ ' : '✕ ') + msg;
  toast.className = 'toast show ' + (type || 'success');
  clearTimeout(_toastTimeout);
  _toastTimeout = setTimeout(function() { toast.className = 'toast'; }, 3500);
}

// ── FORMAT HELPERS ────────────────────────────────────────────
function fmtAmt(val) { return parseFloat(val || 0).toFixed(2); }

function fmtDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
}

function fmtDateTime(dateStr) {
  if (!dateStr) return '—';
  var d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month:'short', day:'numeric' }) + ' ' +
         d.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' });
}

function maskName(name) {
  if (!name || name.length < 2) return name || 'User';
  return name[0] + '****' + name.slice(-1);
}

function escHtml(text) {
  var div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

// ── MODAL HELPERS ─────────────────────────────────────────────
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

  // Mobile sidebar toggle
  var toggle = document.createElement('button');
  toggle.className = 'sidebar-toggle';
  toggle.innerHTML = '☰';
  toggle.setAttribute('aria-label', 'Toggle menu');
  document.body.appendChild(toggle);

  var overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  document.body.appendChild(overlay);

  var sidebar = document.querySelector('.sidebar');

  toggle.addEventListener('click', function() {
    if (sidebar) { sidebar.classList.toggle('open'); overlay.classList.toggle('open'); }
  });
  overlay.addEventListener('click', function() {
    if (sidebar) { sidebar.classList.remove('open'); overlay.classList.remove('open'); }
  });

  if (sidebar) {
    sidebar.querySelectorAll('.nav-item').forEach(function(item) {
      item.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          sidebar.classList.remove('open');
          overlay.classList.remove('open');
        }
      });
    });
  }

  refreshPendingBadges();
});

// ── PENDING BADGES ────────────────────────────────────────────
async function refreshPendingBadges() {
  try {
    var token = localStorage.getItem('mai_token');
    if (!token) return;
    var res = await fetch('/api/admin/stats', { headers: { 'Authorization': 'Bearer ' + token } });
    var data = await res.json();
    if (!data.ok) return;
    var s = data.stats;
    if (s.pendingDeposits > 0) {
      var depLink = document.querySelector('a[href="deposits.html"]');
      if (depLink && !depLink.querySelector('.pending-dot')) {
        depLink.insertAdjacentHTML('beforeend', '<span class="pending-dot"></span>');
      }
    }
    if (s.pendingWithdrawals > 0) {
      var withLink = document.querySelector('a[href="withdrawals.html"]');
      if (withLink && !withLink.querySelector('.pending-dot')) {
        withLink.insertAdjacentHTML('beforeend', '<span class="pending-dot"></span>');
      }
    }
  } catch(e) {}
}

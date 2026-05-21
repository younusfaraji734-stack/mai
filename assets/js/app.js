/* ============================================================
   MAI Platform — App.js
   Ticker, live activity feed, FAQ accordion
============================================================ */

// ── LIVE TICKER ───────────────────────────────────────────────
var _tickerData = [
  { pair:'BTC/USDT', change:'+2.34' },
  { pair:'ETH/USDT', change:'+1.87' },
  { pair:'BNB/USDT', change:'-0.52' },
  { pair:'SOL/USDT', change:'+5.12' },
  { pair:'XRP/USDT', change:'+0.98' },
  { pair:'ADA/USDT', change:'-1.23' },
  { pair:'DOGE/USDT', change:'+3.45' },
  { pair:'DOT/USDT', change:'+2.11' },
  { pair:'MATIC/USDT', change:'+1.55' },
  { pair:'AVAX/USDT', change:'-0.88' },
  { pair:'LINK/USDT', change:'+4.02' },
  { pair:'UNI/USDT', change:'+1.30' },
];

function buildTicker() {
  var doubled = _tickerData.concat(_tickerData);
  return doubled.map(function(d) {
    var up = d.change.charAt(0) !== '-';
    return '<span>' + d.pair + ' <strong class="' + (up ? 'up' : 'down') + '">'
      + (up ? '▲' : '▼') + ' ' + d.change.replace('-','') + '%</strong></span>';
  }).join('');
}

// ── LIVE ACTIVITY FEED ────────────────────────────────────────
var _actNames   = ['J****n','M****a','R****s','K****i','A****h','S****r','T****o','L****e'];
var _actActions = [
  ['Invested in Gold Plan',    'up',   '+$500'],
  ['Invested in Silver Plan',  'up',   '+$200'],
  ['Earned daily profit',      'up',   '+$42.50'],
  ['Referral bonus received',  'up',   '+$25.00'],
  ['Invested in Diamond Plan', 'up',   '+$1,000'],
  ['Withdrawal processed',     'down', '-$120'],
  ['Invested in Bronze Plan',  'up',   '+$50'],
];
var _actColors = ['#6C63FF','#FF6584','#43e97b','#4facfe','#FFD700','#f093fb','#00f2fe','#FFA500'];

function addActivity() {
  var list = document.getElementById('activityList');
  if (!list) return;
  var n = _actNames[Math.floor(Math.random() * _actNames.length)];
  var a = _actActions[Math.floor(Math.random() * _actActions.length)];
  var c = _actColors[Math.floor(Math.random() * _actColors.length)];
  var el = document.createElement('div');
  el.className = 'act-item slide-in';
  el.innerHTML =
    '<div class="act-av" style="background:' + c + '">' + n[0] + '</div>'
    + '<div class="act-info"><span class="act-name">' + n + '</span><span class="act-desc">' + a[0] + '</span></div>'
    + '<div class="act-amt ' + a[1] + '">' + a[2] + '</div>'
    + '<div class="act-time">just now</div>';
  list.insertBefore(el, list.firstChild);
  setTimeout(function(){ el.classList.remove('slide-in'); }, 400);
  while (list.children.length > 6) list.removeChild(list.lastChild);
}

// ── FAQ ACCORDION ─────────────────────────────────────────────
function toggleFaq(item) {
  var isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(function(f){ f.classList.remove('open'); });
  if (!isOpen) item.classList.add('open');
}

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  var ticker = document.getElementById('ticker');
  if (ticker) ticker.innerHTML = buildTicker();
  setInterval(addActivity, 4000);
});

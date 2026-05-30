/* ============================================================
   MAI Platform — Content Loader
   Loads dynamic content from API into page elements
============================================================ */
var ContentLoader = (function() {

  function esc(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function loadHeroSection(content) {
    var hero = (content && content.hero) || {};
    var badge = document.querySelector('.hero-badge');
    if (badge && hero.badge) badge.textContent = hero.badge;
    var title = document.querySelector('.hero-title');
    if (title && hero.title) title.innerHTML = hero.title;
    var subtitle = document.querySelector('.hero-sub');
    if (subtitle && hero.subtitle) subtitle.textContent = hero.subtitle;
    var trustContainer = document.querySelector('.hero-trust');
    if (trustContainer && hero.trustItems && hero.trustItems.length) {
      trustContainer.innerHTML = hero.trustItems.map(function(item) {
        return '<div class="ht-item">'
          + '<svg width="13" height="13" fill="none" stroke="#22c55e" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>'
          + '<span>' + esc(item) + '</span></div>';
      }).join('');
    }
  }

  function loadHeroCards(content) {
    var cards = (content && content.heroCards) || [];
    var container = document.querySelector('.hero-cards');
    if (!container || !cards.length) return;
    var colorMap = ['rgba(34,197,94,.15)','rgba(59,130,246,.15)','rgba(108,99,255,.15)'];
    container.innerHTML = cards.map(function(card, i) {
      return '<div class="hcard" style="--d:' + (i * 0.3) + 's">'
        + '<div class="hcard-icon" style="background:' + (colorMap[i] || colorMap[2]) + '">' + (card.icon||'📈') + '</div>'
        + '<div><div class="hcard-val">' + esc(card.value||'') + '</div>'
        + '<div class="hcard-lbl">' + esc(card.label||'') + '</div></div>'
        + '<div class="hcard-trend ' + (card.trend||'up') + '">▲</div></div>';
    }).join('');
  }

  function loadPlatformIntro(content) {
    var items = (content && content.platformIntro) || [];
    var container = document.querySelector('.intro-scroll');
    if (!container || !items.length) return;
    container.innerHTML = items.map(function(item) {
      var imgSrc = (item.image && item.image.startsWith('http'))
        ? item.image
        : 'assets/images/' + item.image;
      return '<div class="intro-card" onclick="location.href=\'service.html\'" style="cursor:pointer">'
        + '<div class="intro-img" style="background:linear-gradient(' + item.gradient + ');overflow:hidden;">'
        + '<img src="' + imgSrc + '" alt="' + esc(item.title) + '" style="width:100%;height:100%;object-fit:cover;"></div>'
        + '<h4>' + esc(item.title) + '</h4>'
        + '<p>' + esc(item.desc) + '</p>'
        + '<a href="service.html" class="read-more">Read More →</a></div>';
    }).join('');
  }

  function loadServiceHero(content) {
    var hero = (content && content.serviceHero) || {};
    var icon = document.querySelector('.svc-hero-icon');
    if (icon && hero.icon) icon.textContent = hero.icon;
    var title = document.querySelector('.svc-hero-content h2');
    if (title && hero.title) title.textContent = hero.title;
    var subtitle = document.querySelector('.svc-hero-content p');
    if (subtitle && hero.subtitle) subtitle.innerHTML = hero.subtitle;
    var statsContainer = document.querySelector('.svc-hero-stats');
    if (statsContainer && hero.stats && hero.stats.length) {
      statsContainer.innerHTML = hero.stats.map(function(stat, i) {
        return (i > 0 ? '<div class="shs-div"></div>' : '')
          + '<div class="shs"><div class="shs-val">' + esc(stat.val||'') + '</div>'
          + '<div class="shs-lbl">' + esc(stat.lbl||'') + '</div></div>';
      }).join('');
    }
  }

  function loadFaqs(content) {
    var faqs = (content && content.faqs) || [];
    var container = document.querySelector('.faq-list');
    if (!container || !faqs.length) return;
    container.innerHTML = faqs.map(function(faq) {
      return '<div class="faq-item" onclick="toggleFaq(this)">'
        + '<div class="faq-q">' + esc(faq.q) + ' <span class="faq-arr">▼</span></div>'
        + '<div class="faq-a">' + esc(faq.a) + '</div></div>';
    }).join('');
  }

  function loadSettings(settings) {
    if (!settings) return;
    // Update deposit addresses
    document.querySelectorAll('.addr-text').forEach(function(el) {
      if (settings.depositAddress) el.textContent = settings.depositAddress;
    });
    // Update telegram links
    document.querySelectorAll('a[href*="t.me"]').forEach(function(link) {
      if (settings.telegramLink) {
        link.href = settings.telegramLink;
        var p = link.querySelector('p');
        if (p) p.textContent = settings.telegramLink.replace('https://t.me/','@');
      }
    });
    // Update platform title
    if (settings.platformName) {
      var titleEl = document.querySelector('title');
      if (titleEl && !titleEl.textContent.includes(settings.platformName)) {
        titleEl.textContent = titleEl.textContent.replace('MAI', settings.platformName);
      }
    }
  }

  async function loadAll() {
    try {
      var content  = await API.getContent();
      var settings = await API.getSettings();
      loadHeroSection(content);
      loadHeroCards(content);
      loadPlatformIntro(content);
      loadServiceHero(content);
      loadFaqs(content);
      loadSettings(settings);
    } catch(e) {
      console.warn('ContentLoader error:', e);
    }
  }

  return {
    loadAll: loadAll,
    loadHeroSection: loadHeroSection,
    loadHeroCards: loadHeroCards,
    loadPlatformIntro: loadPlatformIntro,
    loadServiceHero: loadServiceHero,
    loadFaqs: loadFaqs,
    loadSettings: loadSettings
  };
})();

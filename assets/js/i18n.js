/* ============================================================
   MAI Platform — i18n Language System
============================================================ */
var MAI_I18N = (function(){

  var LANGUAGES = [
    { code:'en', name:'English',    flag:'https://flagcdn.com/w40/us.png' },
    { code:'tr', name:'Türkçe',     flag:'https://flagcdn.com/w40/tr.png' },
    { code:'ar', name:'العربية',    flag:'https://flagcdn.com/w40/sa.png' },
    { code:'zh', name:'中文',        flag:'https://flagcdn.com/w40/cn.png' },
    { code:'ru', name:'Русский',    flag:'https://flagcdn.com/w40/ru.png' },
    { code:'es', name:'Español',    flag:'https://flagcdn.com/w40/es.png' }
  ];

  var TRANSLATIONS = {
    en: {
      home:'Home', service:'Service', tasks:'Tasks', record:'Record', mine:'Mine',
      balance:'Balance', deposit:'Deposit', withdraw:'Withdraw',
      todayProfit:"Today's Profit", totalEarned:'Total Earned', teamMembers:'Team Members',
      taskTiers:'Task Tiers', viewTasks:'View Tasks →',
      language:'Language', customerSupport:'Customer Support', support247:'24/7 help center',
      logout:'Log Out', profile:'My Profile', settings:'Settings',
      rechargeUsdt:'Recharge USDT', withdrawUsdt:'Withdraw USDT',
      startTask:'Start Task Now', processing:'Processing Order', completed:'Task Completed!',
      yourBalance:'Your Balance', commission:'Commission', taskAmount:'Task Amount',
      youReceive:'You Receive', taskType:'Task Type', startTaskNow:'Start Task Now',
      scanDeposit:'Scan to deposit USDT', minDeposit:'Min. Deposit',
      networkFee:'Network Fee', arrivalTime:'Arrival Time',
      submitDeposit:'Submit Deposit', confirmWithdraw:'Confirm Withdrawal',
      walletAddress:'Wallet Address', amount:'Amount',
      available:'Available', minWithdraw:'Min. Withdraw', fee:'Fee',
      transactionRecords:'Transaction Records', noTransactions:'No transactions yet',
      myTeam:'My Team', totalMembers:'Total Members', commissionEarned:'Commission Earned',
      activeMembers:'Active Members', noTeamMembers:'No team members yet',
      messages:'Messages', noMessages:'No messages yet',
      verifiedAccount:'✓ Verified Account', scores:'Scores',
      totalInvested:'Total Invested', referrals:'Referrals', activePlans:'Active Plans',
      inviteFriends:'Invite Friends', referralCode:'Referral Code', inviteLink:'Invite Link',
      platformIntro:'Platform Introduction', seeAll:'See All →',
      weAreHere:"We're Here to Help", contactUs:'Contact Us',
      telegramSupport:'Telegram Support', online247:'● Online 24/7'
    },
    tr: {
      home:'Ana Sayfa', service:'Hizmet', tasks:'Görevler', record:'Kayıtlar', mine:'Profilim',
      balance:'Bakiye', deposit:'Yatır', withdraw:'Çek',
      todayProfit:'Bugünkü Kazanç', totalEarned:'Toplam Kazanç', teamMembers:'Takım Üyeleri',
      taskTiers:'Görev Seviyeleri', viewTasks:'Görevleri Gör →',
      language:'Dil', customerSupport:'Müşteri Desteği', support247:'7/24 yardım merkezi',
      logout:'Çıkış Yap', profile:'Profilim', settings:'Ayarlar',
      rechargeUsdt:'USDT Yükle', withdrawUsdt:'USDT Çek',
      startTask:'Görevi Başlat', processing:'Sipariş İşleniyor', completed:'Görev Tamamlandı!',
      yourBalance:'Bakiyeniz', commission:'Komisyon', taskAmount:'Görev Tutarı',
      youReceive:'Alacağınız', taskType:'Görev Türü', startTaskNow:'Görevi Şimdi Başlat',
      scanDeposit:'USDT yatırmak için tarayın', minDeposit:'Min. Yatırım',
      networkFee:'Ağ Ücreti', arrivalTime:'Varış Süresi',
      submitDeposit:'Yatırımı Gönder', confirmWithdraw:'Çekimi Onayla',
      walletAddress:'Cüzdan Adresi', amount:'Miktar',
      available:'Mevcut', minWithdraw:'Min. Çekim', fee:'Ücret',
      transactionRecords:'İşlem Kayıtları', noTransactions:'Henüz işlem yok',
      myTeam:'Takımım', totalMembers:'Toplam Üye', commissionEarned:'Kazanılan Komisyon',
      activeMembers:'Aktif Üyeler', noTeamMembers:'Henüz takım üyesi yok',
      messages:'Mesajlar', noMessages:'Henüz mesaj yok',
      verifiedAccount:'✓ Doğrulanmış Hesap', scores:'Puan',
      totalInvested:'Toplam Yatırım', referrals:'Referanslar', activePlans:'Aktif Planlar',
      inviteFriends:'Arkadaşları Davet Et', referralCode:'Referans Kodu', inviteLink:'Davet Linki',
      platformIntro:'Platform Tanıtımı', seeAll:'Tümünü Gör →',
      weAreHere:'Yardım Etmek İçin Buradayız', contactUs:'Bize Ulaşın',
      telegramSupport:'Telegram Destek', online247:'● 7/24 Çevrimiçi'
    },
    ar: {
      home:'الرئيسية', service:'الخدمة', tasks:'المهام', record:'السجلات', mine:'ملفي',
      balance:'الرصيد', deposit:'إيداع', withdraw:'سحب',
      todayProfit:'ربح اليوم', totalEarned:'إجمالي الأرباح', teamMembers:'أعضاء الفريق',
      taskTiers:'مستويات المهام', viewTasks:'عرض المهام →',
      language:'اللغة', customerSupport:'دعم العملاء', support247:'مركز مساعدة 24/7',
      logout:'تسجيل الخروج', profile:'ملفي الشخصي', settings:'الإعدادات',
      rechargeUsdt:'شحن USDT', withdrawUsdt:'سحب USDT',
      startTask:'ابدأ المهمة', processing:'جاري المعالجة', completed:'اكتملت المهمة!',
      yourBalance:'رصيدك', commission:'العمولة', taskAmount:'مبلغ المهمة',
      youReceive:'ستستلم', taskType:'نوع المهمة', startTaskNow:'ابدأ المهمة الآن',
      scanDeposit:'امسح لإيداع USDT', minDeposit:'الحد الأدنى للإيداع',
      networkFee:'رسوم الشبكة', arrivalTime:'وقت الوصول',
      submitDeposit:'إرسال الإيداع', confirmWithdraw:'تأكيد السحب',
      walletAddress:'عنوان المحفظة', amount:'المبلغ',
      available:'المتاح', minWithdraw:'الحد الأدنى للسحب', fee:'الرسوم',
      transactionRecords:'سجلات المعاملات', noTransactions:'لا توجد معاملات بعد',
      myTeam:'فريقي', totalMembers:'إجمالي الأعضاء', commissionEarned:'العمولة المكتسبة',
      activeMembers:'الأعضاء النشطون', noTeamMembers:'لا يوجد أعضاء في الفريق بعد',
      messages:'الرسائل', noMessages:'لا توجد رسائل بعد',
      verifiedAccount:'✓ حساب موثق', scores:'النقاط',
      totalInvested:'إجمالي الاستثمار', referrals:'الإحالات', activePlans:'الخطط النشطة',
      inviteFriends:'دعوة الأصدقاء', referralCode:'رمز الإحالة', inviteLink:'رابط الدعوة',
      platformIntro:'مقدمة المنصة', seeAll:'عرض الكل →',
      weAreHere:'نحن هنا للمساعدة', contactUs:'اتصل بنا',
      telegramSupport:'دعم تيليغرام', online247:'● متصل 24/7'
    },
    zh: {
      home:'首页', service:'服务', tasks:'任务', record:'记录', mine:'我的',
      balance:'余额', deposit:'充值', withdraw:'提现',
      todayProfit:'今日收益', totalEarned:'总收益', teamMembers:'团队成员',
      taskTiers:'任务等级', viewTasks:'查看任务 →',
      language:'语言', customerSupport:'客户支持', support247:'24/7 帮助中心',
      logout:'退出登录', profile:'我的资料', settings:'设置',
      rechargeUsdt:'充值 USDT', withdrawUsdt:'提现 USDT',
      startTask:'开始任务', processing:'订单处理中', completed:'任务完成！',
      yourBalance:'您的余额', commission:'佣金', taskAmount:'任务金额',
      youReceive:'您将收到', taskType:'任务类型', startTaskNow:'立即开始任务',
      scanDeposit:'扫描充值 USDT', minDeposit:'最低充值',
      networkFee:'网络费用', arrivalTime:'到账时间',
      submitDeposit:'提交充值', confirmWithdraw:'确认提现',
      walletAddress:'钱包地址', amount:'金额',
      available:'可用', minWithdraw:'最低提现', fee:'手续费',
      transactionRecords:'交易记录', noTransactions:'暂无交易',
      myTeam:'我的团队', totalMembers:'总成员', commissionEarned:'已赚佣金',
      activeMembers:'活跃成员', noTeamMembers:'暂无团队成员',
      messages:'消息', noMessages:'暂无消息',
      verifiedAccount:'✓ 已验证账户', scores:'积分',
      totalInvested:'总投资', referrals:'推荐', activePlans:'活跃计划',
      inviteFriends:'邀请好友', referralCode:'推荐码', inviteLink:'邀请链接',
      platformIntro:'平台介绍', seeAll:'查看全部 →',
      weAreHere:'我们随时为您服务', contactUs:'联系我们',
      telegramSupport:'Telegram 支持', online247:'● 24/7 在线'
    },
    ru: {
      home:'Главная', service:'Сервис', tasks:'Задания', record:'История', mine:'Профиль',
      balance:'Баланс', deposit:'Пополнить', withdraw:'Вывести',
      todayProfit:'Прибыль сегодня', totalEarned:'Всего заработано', teamMembers:'Члены команды',
      taskTiers:'Уровни заданий', viewTasks:'Смотреть задания →',
      language:'Язык', customerSupport:'Поддержка', support247:'Помощь 24/7',
      logout:'Выйти', profile:'Мой профиль', settings:'Настройки',
      rechargeUsdt:'Пополнить USDT', withdrawUsdt:'Вывести USDT',
      startTask:'Начать задание', processing:'Обработка заказа', completed:'Задание выполнено!',
      yourBalance:'Ваш баланс', commission:'Комиссия', taskAmount:'Сумма задания',
      youReceive:'Вы получите', taskType:'Тип задания', startTaskNow:'Начать задание сейчас',
      scanDeposit:'Сканируйте для пополнения', minDeposit:'Мин. пополнение',
      networkFee:'Комиссия сети', arrivalTime:'Время зачисления',
      submitDeposit:'Отправить пополнение', confirmWithdraw:'Подтвердить вывод',
      walletAddress:'Адрес кошелька', amount:'Сумма',
      available:'Доступно', minWithdraw:'Мин. вывод', fee:'Комиссия',
      transactionRecords:'История транзакций', noTransactions:'Нет транзакций',
      myTeam:'Моя команда', totalMembers:'Всего участников', commissionEarned:'Заработано комиссий',
      activeMembers:'Активные участники', noTeamMembers:'Нет участников команды',
      messages:'Сообщения', noMessages:'Нет сообщений',
      verifiedAccount:'✓ Верифицированный аккаунт', scores:'Очки',
      totalInvested:'Всего инвестировано', referrals:'Рефералы', activePlans:'Активные планы',
      inviteFriends:'Пригласить друзей', referralCode:'Реферальный код', inviteLink:'Ссылка приглашения',
      platformIntro:'Введение в платформу', seeAll:'Смотреть все →',
      weAreHere:'Мы здесь, чтобы помочь', contactUs:'Связаться с нами',
      telegramSupport:'Поддержка Telegram', online247:'● Онлайн 24/7'
    },
    es: {
      home:'Inicio', service:'Servicio', tasks:'Tareas', record:'Registros', mine:'Mi Perfil',
      balance:'Saldo', deposit:'Depositar', withdraw:'Retirar',
      todayProfit:'Ganancia Hoy', totalEarned:'Total Ganado', teamMembers:'Miembros del Equipo',
      taskTiers:'Niveles de Tareas', viewTasks:'Ver Tareas →',
      language:'Idioma', customerSupport:'Soporte al Cliente', support247:'Centro de ayuda 24/7',
      logout:'Cerrar Sesión', profile:'Mi Perfil', settings:'Configuración',
      rechargeUsdt:'Recargar USDT', withdrawUsdt:'Retirar USDT',
      startTask:'Iniciar Tarea', processing:'Procesando Pedido', completed:'¡Tarea Completada!',
      yourBalance:'Tu Saldo', commission:'Comisión', taskAmount:'Monto de Tarea',
      youReceive:'Recibirás', taskType:'Tipo de Tarea', startTaskNow:'Iniciar Tarea Ahora',
      scanDeposit:'Escanear para depositar USDT', minDeposit:'Depósito Mínimo',
      networkFee:'Tarifa de Red', arrivalTime:'Tiempo de Llegada',
      submitDeposit:'Enviar Depósito', confirmWithdraw:'Confirmar Retiro',
      walletAddress:'Dirección de Billetera', amount:'Monto',
      available:'Disponible', minWithdraw:'Retiro Mínimo', fee:'Tarifa',
      transactionRecords:'Registros de Transacciones', noTransactions:'Sin transacciones aún',
      myTeam:'Mi Equipo', totalMembers:'Total de Miembros', commissionEarned:'Comisión Ganada',
      activeMembers:'Miembros Activos', noTeamMembers:'Sin miembros del equipo aún',
      messages:'Mensajes', noMessages:'Sin mensajes aún',
      verifiedAccount:'✓ Cuenta Verificada', scores:'Puntos',
      totalInvested:'Total Invertido', referrals:'Referencias', activePlans:'Planes Activos',
      inviteFriends:'Invitar Amigos', referralCode:'Código de Referencia', inviteLink:'Enlace de Invitación',
      platformIntro:'Introducción a la Plataforma', seeAll:'Ver Todo →',
      weAreHere:'Estamos Aquí para Ayudar', contactUs:'Contáctenos',
      telegramSupport:'Soporte de Telegram', online247:'● En línea 24/7'
    }
  };

  var currentLang = localStorage.getItem('mai_lang') || 'en';

  function t(key) {
    var lang = TRANSLATIONS[currentLang] || TRANSLATIONS['en'];
    return lang[key] || TRANSLATIONS['en'][key] || key;
  }

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('mai_lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });
    _updateLangLabel();
    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
  }

  function _updateLangLabel() {
    var label = document.getElementById('currentLangLabel');
    var langObj = LANGUAGES.find(function(l){ return l.code === currentLang; });
    if (label && langObj) label.textContent = langObj.name;
    var flagImg = document.getElementById('langFlagImg');
    if (flagImg && langObj) flagImg.src = langObj.flag;
  }

  function openLangModal() {
    var list = document.getElementById('langList');
    if (!list) return;
    list.innerHTML = LANGUAGES.map(function(l) {
      var active = l.code === currentLang;
      return '<button onclick="MAI_I18N.selectLang(\'' + l.code + '\')" style="'
        + 'display:flex;align-items:center;gap:14px;width:100%;padding:14px 16px;'
        + 'background:' + (active ? 'rgba(108,99,255,0.15)' : 'rgba(255,255,255,0.04)') + ';'
        + 'border:1px solid ' + (active ? 'rgba(108,99,255,0.4)' : 'rgba(255,255,255,0.08)') + ';'
        + 'border-radius:12px;cursor:pointer;color:var(--text);text-align:left;">'
        + '<img src="' + l.flag + '" style="width:32px;height:22px;object-fit:cover;border-radius:4px;flex-shrink:0;" alt="' + l.name + '">'
        + '<span style="font-size:15px;font-weight:' + (active ? '700' : '500') + '">' + l.name + '</span>'
        + (active ? '<span style="margin-left:auto;color:#6C63FF;font-size:18px">✓</span>' : '')
        + '</button>';
    }).join('');
    if (typeof openModal === 'function') openModal('langModal');
  }

  function selectLang(code) {
    applyLanguage(code);
    if (typeof closeModal === 'function') closeModal('langModal');
    // Reload page to apply all translations
    setTimeout(function(){ location.reload(); }, 300);
  }

  // Auto-apply on page load
  document.addEventListener('DOMContentLoaded', function(){
    if (currentLang !== 'en') applyLanguage(currentLang);
    _updateLangLabel();
  });

  return { t:t, applyLanguage:applyLanguage, openLangModal:openLangModal, selectLang:selectLang, LANGUAGES:LANGUAGES };
})();

// Global helpers
function openLangModal(){ MAI_I18N.openLangModal(); }

/* ilana-ai.agency - התנהגות המעטפת. פותח וסוגר את התפריט במובייל. */
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  function setOpen(open) {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  toggle.addEventListener('click', function () {
    setOpen(!nav.classList.contains('open'));
  });

  /* לחיצה על קישור סוגרת את התפריט */
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') setOpen(false);
  });

  /* Escape סוגר, והמיקוד חוזר לכפתור */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      setOpen(false);
      toggle.focus();
    }
  });

  /* חזרה לדסקטופ מנקה מצב פתוח שנשאר מהמובייל */
  var wide = window.matchMedia('(min-width: 769px)');
  (wide.addEventListener ? wide.addEventListener.bind(wide, 'change') : wide.addListener.bind(wide))(
    function (e) { if (e.matches) setOpen(false); }
  );
})();

/* הפס הנדבק של עמוד הפודקאסט.
   הוא גלוי מהרגע הראשון (הוראת אילנה) - אין סף גלילה.
   מה שנשאר ל-JS הוא למדוד את גובהו ולשמור מקום בתחתית העמוד,
   כדי שהפוטר לא יישב מתחתיו. הפס מתקפל במובייל, ולכן המדידה חיה. */
(function () {
  var bar = document.querySelector('.snap');
  if (!bar) return;

  function reserve() {
    document.documentElement.style.setProperty('--snap-h', bar.offsetHeight + 'px');
  }

  document.body.classList.add('has-snap');
  reserve();
  window.addEventListener('resize', reserve, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(reserve).observe(bar);
})();

/* כל קישור שמוביל לטופס - אחרי הקפיצה הסמן נכנס לשדה הראשון.
   בלעדיו הלחיצה נראית כאילו לא קרה כלום כשהטופס כבר על המסך -
   וזה בדיוק חוק-העל "אף פעם לא באוויר": כל לחיצה מקבלת פידבק מיידי. */
(function () {
  var form = document.getElementById('form');
  if (!form) return;
  var field = form.querySelector('input:not([type="checkbox"])');
  if (!field) return;

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href="#form"]');
    if (!a) return;
    /* מחכים שהגלילה תירגע, אחרת המיקוד עצמו קופץ וקוטע אותה */
    setTimeout(function () { field.focus({ preventScroll: true }); }, 620);
  });
})();

/* כפתור "פתחו הכל" בתמלול.
   הקיפול הוא ברירת המחדל כדי שרשימת הפרקונים תשמש גם כתוכן עניינים,
   אבל מי שרוצה לקרוא את הכל ברצף צריך לא לפתוח עשר פעמים. */
(function () {
  var btn = document.querySelector('.tr-all');
  if (!btn) return;
  var all = document.querySelectorAll('details.tr');
  if (!all.length) return;

  btn.addEventListener('click', function () {
    var open = btn.getAttribute('data-open') !== 'true';
    all.forEach(function (d) { d.open = open; });
    btn.setAttribute('data-open', open ? 'true' : 'false');
    btn.textContent = open ? 'סגרו הכל' : 'פתחו הכל';
  });
})();

/* תפריט הצד בעמוד ה-CRM: גלוי תמיד, ומדגיש את הסקשן הנוכחי */
(function () {
  var toc = document.querySelector('.crm-toc');
  if (!toc) return;
  var links = Array.prototype.slice.call(toc.querySelectorAll('a:not(.crm-toc-cta)'));
  var secs = links.map(function (a) {
    var h = document.getElementById(a.getAttribute('href').slice(1));
    return h ? (h.closest('section') || h) : null;
  });
  function spy() {
    var vh = window.innerHeight, cur = -1;
    secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < vh * 0.4) cur = i; });
    links.forEach(function (a, i) { a.classList.toggle('on', i === cur); });
  }
  links.forEach(function (a, i) {
    a.addEventListener('click', function (e) {
      if (!secs[i]) return;
      e.preventDefault();
      window.scrollTo({ top: secs[i].getBoundingClientRect().top + window.pageYOffset - 64, behavior: 'smooth' });
    });
  });
  var tab = toc.querySelector('.crm-toc-tab');
  if (tab) {
    var setClosed = function (c) {
      toc.classList.toggle('closed', c);
      document.documentElement.classList.toggle('toc-open', !c);
      tab.setAttribute('aria-expanded', c ? 'false' : 'true');
      tab.setAttribute('aria-label', c ? 'פתיחת התפריט' : 'קיפול התפריט');
      tab.querySelector('.arr').textContent = '›'; // חץ ימינה בשני המצבים (אילנה, 9.11.2026)
      try { localStorage.setItem('crmTocClosed', c ? '1' : '0'); } catch (e) {}
    };
    // בלפטופ צר (מתחת ל-1440) התפריט נפתח סגור, אלא אם הגולש כבר פתח אותו בעבר
    var saved = null;
    try { saved = localStorage.getItem('crmTocClosed'); } catch (e) {}
    var startClosed = saved === null ? window.innerWidth < 1440 : saved === '1';
    toc.classList.toggle('closed', startClosed);
    document.documentElement.classList.toggle('toc-open', !startClosed);
    tab.setAttribute('aria-expanded', startClosed ? 'false' : 'true');
    tab.setAttribute('aria-label', startClosed ? 'פתיחת התפריט' : 'קיפול התפריט');
    tab.querySelector('.arr').textContent = '›'; // חץ ימינה בשני המצבים (אילנה, 9.11.2026)
    tab.addEventListener('click', function () { setClosed(!toc.classList.contains('closed')); });
  }
  window.addEventListener('scroll', spy, { passive: true });
  window.addEventListener('resize', spy);
  spy();
})();

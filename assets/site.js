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

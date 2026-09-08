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
   נכנס אחרי שגוללים קצת, ונשאר זמין לכל אורך העמוד (הוראת אילנה).
   ⛔ בלי להסתיר אותו כשהטופס על המסך - בעמוד קצר זה היה מבטל אותו לגמרי. */
(function () {
  var bar = document.querySelector('.snap');
  if (!bar) return;

  function paint() {
    bar.classList.toggle('show', window.scrollY > 320);
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { paint(); ticking = false; });
  }, { passive: true });

  paint();
})();

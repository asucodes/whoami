// minimal interactive bits. no ai slop, just what makes reading the posts easier
(function () {
  // theme toggle (uses the separate dark.css link)
  var darkLink = document.getElementById('darkModeStyle');
  var themeBtn = document.getElementById('theme-toggle');

  function setTheme(mode) {
    if (!darkLink) return;
    darkLink.disabled = (mode !== 'dark');
    try { localStorage.setItem('theme', mode); } catch (e) {}
  }

  if (themeBtn && darkLink) {
    themeBtn.addEventListener('click', function () {
      var nowDark = darkLink.disabled;
      setTheme(nowDark ? 'dark' : 'light');
    });
  }

  // restore
  try {
    var saved = localStorage.getItem('theme');
    if (saved && darkLink) {
      setTheme(saved);
    } else if (darkLink && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  } catch (e) {}

  // copy buttons on all code blocks
  function addCopyButtons() {
    var pres = document.querySelectorAll('pre');
    pres.forEach(function (pre) {
      if (pre.querySelector('.copy-btn')) return;
      var btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'copy';
      btn.setAttribute('aria-label', 'copy code');
      btn.addEventListener('click', function () {
        var txt = '';
        var codeEl = pre.querySelector('code');
        if (codeEl) txt = codeEl.innerText;
        else txt = pre.innerText;
        navigator.clipboard.writeText(txt.trim()).then(function () {
          var old = btn.textContent;
          btn.textContent = 'copied';
          setTimeout(function () { btn.textContent = old; }, 1100);
        }).catch(function () {
          // fallback
          var ta = document.createElement('textarea');
          ta.value = txt.trim();
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          btn.textContent = 'copied';
          setTimeout(function () { btn.textContent = 'copy'; }, 1100);
        });
      });
      pre.style.position = pre.style.position || 'relative';
      pre.appendChild(btn);
    });
  }
  addCopyButtons();

  // very light tag filter on pages that have .post-teaser + data-tag
  var filterBar = document.getElementById('tag-filter');
  if (filterBar) {
    filterBar.addEventListener('click', function (e) {
      if (!e.target.classList.contains('tag')) return;
      var want = e.target.getAttribute('data-tag');
      var teasers = document.querySelectorAll('.post-teaser');
      teasers.forEach(function (t) {
        if (!want) { t.style.display = ''; return; }
        var tags = (t.getAttribute('data-tags') || '').split(/\s+/);
        t.style.display = tags.indexOf(want) > -1 ? '' : 'none';
      });
    });
  }

  // read more toggle for homepage "other notes" section
  var readMore = document.getElementById('read-more');
  var otherNotes = document.getElementById('other-notes');
  if (readMore && otherNotes) {
    readMore.addEventListener('click', function(e) {
      e.preventDefault();
      if (otherNotes.style.display === 'none' || otherNotes.style.display === '') {
        otherNotes.style.display = 'block';
        readMore.textContent = 'show less';
      } else {
        otherNotes.style.display = 'none';
        readMore.textContent = 'read more...';
      }
    });
  }
})();

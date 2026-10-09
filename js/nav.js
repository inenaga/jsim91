/* 第91回全国大会サイト  モバイル用ナビゲーション開閉 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('.nav-toggle');
    var list = document.getElementById('global-nav-list');
    if (!toggle || !list) { return; }

    function setOpen(open) {
      list.classList.toggle('is-open', open);
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    }

    toggle.addEventListener('click', function () {
      setOpen(!list.classList.contains('is-open'));
    });

    /* Esc キーで閉じる */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && list.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    /* 画面幅が広がったら開閉状態をリセット */
    window.addEventListener('resize', function () {
      if (window.innerWidth > 720) { setOpen(false); }
    });
  });
})();

/* ======================================================================
   締切カウントダウン
   ----------------------------------------------------------------------
   HTML 側の data-deadline（ISO8601・JSTオフセット付き）を読み取り、
   残り日数を表示する。締切日を変更する場合は HTML の data-deadline
   のみを書き換えればよい。JavaScript が無効な場合は、HTML に直接
   書かれた締切日がそのまま表示される。
   ====================================================================== */
(function () {
  'use strict';

  /* Date を「日本時間での YYYY-MM-DD」に変換する */
  function jstDateString(date) {
    var utc = date.getTime() + date.getTimezoneOffset() * 60000;
    var jst = new Date(utc + 9 * 3600000);
    var m = jst.getMonth() + 1;
    var d = jst.getDate();
    return jst.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (d < 10 ? '0' : '') + d;
  }

  /* YYYY-MM-DD 同士の日数差 */
  function dayDiff(fromStr, toStr) {
    var a = fromStr.split('-'), b = toStr.split('-');
    var t1 = Date.UTC(+a[0], +a[1] - 1, +a[2]);
    var t2 = Date.UTC(+b[0], +b[1] - 1, +b[2]);
    return Math.round((t2 - t1) / 86400000);
  }

  function render(box) {
    var raw = box.getAttribute('data-deadline');
    if (!raw) { return; }
    var deadline = new Date(raw);
    if (isNaN(deadline.getTime())) { return; }

    var slot = box.querySelector('[data-countdown-value]');
    if (!slot) { return; }

    var now = new Date();
    var today = jstDateString(now);
    var last = jstDateString(deadline);
    var days = dayDiff(today, last);

    if (now.getTime() > deadline.getTime()) {
      box.classList.add('is-closed');
      slot.textContent = '申込の受付を終了しました';
    } else if (days <= 0) {
      box.classList.add('is-urgent');
      slot.textContent = '本日が締切です';
    } else if (days === 1) {
      box.classList.add('is-urgent');
      slot.textContent = '明日が締切です';
    } else {
      if (days <= 7) { box.classList.add('is-urgent'); }
      slot.innerHTML = 'あと<span class="countdown__num">' + days + '</span>日';
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var boxes = document.querySelectorAll('.countdown[data-deadline]');
    for (var i = 0; i < boxes.length; i++) { render(boxes[i]); }
  });
})();

/* ======================================================================
   メールアドレスの表示（スパム対策）
   ----------------------------------------------------------------------
   HTML には data-m に逆順のアドレスを書き、ここで mailto リンクに
   組み立てる。JavaScript が無効な場合は「[at]」表記のまま表示される。
   ====================================================================== */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var spans = document.querySelectorAll('.js-mail[data-m]');
    for (var i = 0; i < spans.length; i++) {
      var addr = spans[i].getAttribute('data-m').split('').reverse().join('');
      var a = document.createElement('a');
      a.href = 'mailto:' + addr;
      a.textContent = addr;
      spans[i].replaceWith(a);
    }
  });
})();

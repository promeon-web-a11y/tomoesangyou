// ともえ産業 採用ページ（提案用制作デモ）
// 外部送信・保存・URLへの書き出し・ログ出力は行わない。
(function () {
  'use strict';

  // メニュー開閉
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('global-nav');
  function closeNav() {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeNav();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      closeNav();
      toggle.focus();
    }
  });

  // デモフォーム
  var form = document.getElementById('demo-form');
  var steps = {
    input: form.querySelector('[data-step="input"]'),
    confirm: form.querySelector('[data-step="confirm"]'),
    done: form.querySelector('[data-step="done"]')
  };
  var labels = {
    name: 'お名前', kana: 'ふりがな', tel: '電話番号', mail: 'メールアドレス',
    exp: '配管工の経験', years: '配管工の経験年数', note: '確認したいこと'
  };

  function show(step) {
    Object.keys(steps).forEach(function (k) { steps[k].hidden = k !== step; });
    var target = step === 'confirm' ? steps.confirm.querySelector('.confirm-lead')
      : step === 'done' ? steps.done.querySelector('.done')
      : form.elements.name;
    form.closest('.form-area').scrollIntoView({ block: 'start' });
    target.focus({ preventScroll: true });
  }

  function setError(id, msg, field) {
    document.getElementById(id).textContent = msg;
    if (field) field.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }

  function validate() {
    var el = form.elements;
    var first = null;
    function check(cond, errId, msg, field, focusEl) {
      setError(errId, cond ? '' : msg, field);
      if (!cond && !first) first = focusEl || field;
    }
    check(el.name.value.trim() !== '', 'e-name', 'お名前を入力してください。', el.name);
    check(el.kana.value.trim() !== '', 'e-kana', 'ふりがなを入力してください。', el.kana);
    var tel = el.tel.value.trim();
    check(tel !== '', 'e-tel', '電話番号を入力してください。', el.tel);
    if (tel !== '') check(/^[0-9-]+$/.test(tel) && /^\d{10,11}$/.test(tel.replace(/-/g, '')), 'e-tel', '電話番号は半角数字とハイフンで、10〜11桁の番号を入力してください。', el.tel);
    var mail = el.mail.value.trim();
    check(mail === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail), 'e-mail', 'メールアドレスの形式をご確認ください。', el.mail);
    var exp = form.querySelector('input[name="exp"]:checked');
    check(!!exp, 'e-exp', '配管工の経験を選択してください。', null, form.querySelector('input[name="exp"]'));
    check(el.agree.checked, 'e-agree', '確認のチェックを入れてください。', el.agree);
    return first;
  }

  // 送信ボタンを持たない（type="button"）ため、JSが無効でもフォームは送信されない。
  // 念のため submit イベントも止める。
  form.addEventListener('submit', function (e) { e.preventDefault(); });

  function toConfirm() {
    var invalid = validate();
    if (invalid) { invalid.focus(); return; }
    var list = document.getElementById('confirm-list');
    list.textContent = '';
    var data = new FormData(form);
    Object.keys(labels).forEach(function (key) {
      var row = document.createElement('div');
      var dt = document.createElement('dt');
      var dd = document.createElement('dd');
      dt.textContent = labels[key];
      dd.textContent = (data.get(key) || '').toString().trim() || '（未入力）';
      row.appendChild(dt); row.appendChild(dd);
      list.appendChild(row);
    });
    show('confirm');
  }

  form.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-action]');
    if (!btn) return;
    var action = btn.getAttribute('data-action');
    if (action === 'confirm') toConfirm();
    if (action === 'back') show('input');
    if (action === 'finish') {
      form.reset();
      document.getElementById('confirm-list').textContent = '';
      show('done');
    }
    if (action === 'restart') show('input');
  });

  // 入力し直したらエラー表示を消す
  form.addEventListener('input', function (e) {
    var t = e.target;
    if (t.getAttribute('aria-invalid') === 'true') {
      t.setAttribute('aria-invalid', 'false');
      var err = t.name === 'exp' ? 'e-exp' : 'e-' + t.name;
      var node = document.getElementById(err);
      if (node) node.textContent = '';
    }
    if (t.name === 'exp') document.getElementById('e-exp').textContent = '';
  });
})();

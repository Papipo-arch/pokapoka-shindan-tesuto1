/*
 * 画面の表示と操作
 * ------------------------------------------------------------
 * URLの「#」のあとで画面を切り替えています（ページを更新しても同じ画面に戻れます）。
 *   #/            トップ
 *   #/quiz        診断（質問）
 *   #/result      診断結果
 *   #/sento/A     銭湯の詳細
 * 回答はブラウザ（localStorage）に保存されます。
 */
(function () {
  var Q = Poka.QUESTIONS;
  var STORAGE_KEY = "pokapoka-demo-v1";
  var LETTERS = ["A", "B", "C", "D"];
  var app = document.getElementById("app");
  var modalRoot = document.getElementById("modal-root");
  var icon = Poka.icon;

  // ---------- 状態の保存・読み込み ----------
  var state = load();

  function emptyState() {
    return { answers: Q.map(function () { return null; }), current: 0 };
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var s = JSON.parse(raw);
        if (s && Array.isArray(s.answers) && s.answers.length === Q.length) {
          s.current = Math.min(Math.max(0, s.current | 0), Q.length - 1);
          return s;
        }
      }
    } catch (e) { /* 保存できない環境でも動くようにする */ }
    return emptyState();
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* noop */ }
  }

  function resetState() {
    state = emptyState();
    save();
  }

  // ---------- 便利関数 ----------
  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function typeStyle(t) {
    return "--tc:" + t.color.main + ";--tc-deep:" + t.color.deep + ";--tc-light:" + t.color.light + ";";
  }

  function go(hash) {
    if (location.hash === hash) route();
    else location.hash = hash;
  }

  var toastTimer;
  function toast(msg) {
    var el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("show"); }, 2600);
  }

  var cachedResult = null, cachedKey = "";
  function getResult() {
    if (!Poka.scoring.isComplete(state.answers)) return null;
    var key = state.answers.join("");
    if (key !== cachedKey) {
      cachedResult = Poka.scoring.diagnose(state.answers);
      cachedKey = key;
    }
    return cachedResult;
  }

  function startQuiz() {
    resetState();
    go("#/quiz");
  }

  // ---------- トップページ ----------
  function renderHome() {
    var types = Poka.TYPES.map(function (t, i) {
      return '<li class="type-mini" style="' + typeStyle(t) + "animation-delay:" + (i * 60) + 'ms">' +
        '<div class="type-badge sm">' + Poka.typeArt(t.icon) + "</div>" +
        "<div><p class=\"type-mini-name\">" + esc(t.name) + "</p><p class=\"type-mini-catch\">" + esc(t.catch) + "</p></div></li>";
    }).join("");

    var resumeBtn = getResult()
      ? '<a class="btn btn-ghost" href="#/result">' + icon("list") + "前回の結果を見る</a>"
      : "";

    app.innerHTML =
      '<section class="hero">' +
        '<div class="hero-bubbles" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>' +
        '<div class="container hero-inner">' +
          '<div class="hero-text">' +
            '<p class="eyebrow">' + icon("steam") + "大田区の銭湯 × 性格診断</p>" +
            '<h1 class="hero-title"><span>ポカポカ</span><span>診断</span></h1>' +
            '<p class="hero-catch">あなたにぴったりの湯、<br class="sp-only">見つけませんか？</p>' +
            '<p class="hero-sub">性格や気分から、あなたに合う銭湯と<br class="pc-only">その周辺の楽しみ方を発見しよう。</p>' +
            '<div class="hero-cta">' +
              '<button class="btn btn-primary btn-xl" data-action="start">無料で診断する' + icon("arrowRight") + "</button>" +
              resumeBtn +
            "</div>" +
            '<p class="hero-meta">' + icon("clock") + "全18問・約3分　" + icon("heart") + "登録不要</p>" +
          "</div>" +
          '<div class="hero-visual">' +
            '<div class="hero-frame">' + Poka.sentoScene(Poka.SENTOS[2], { noLabel: true }) + "</div>" +
            Poka.TYPES.slice(0, 4).map(function (t, i) {
              return '<div class="float-badge fb' + i + '" style="' + typeStyle(t) + '"><div class="type-badge xs">' + Poka.typeArt(t.icon) + "</div><span>" + esc(t.name) + "</span></div>";
            }).join("") +
          "</div>" +
        "</div>" +
        '<div class="wave" aria-hidden="true"></div>' +
      "</section>" +

      '<section class="section container">' +
        '<h2 class="section-title"><span class="section-kicker">ABOUT</span>どんな診断？</h2>' +
        '<p class="section-lead">休日の過ごし方やお風呂の好み、今日の気分など、18の質問に答えるだけ。回答を6つの「ポカポカ成分」に分けて計算し、あなたのタイプとぴったりの銭湯を見つけます。</p>' +
        '<ol class="steps">' +
          step(1, "list", "18の質問に答える", "性格・お風呂の好み・今の気分・行動の4テーマ。直感で選んでOK。") +
          step(2, "sparkle", "ポカポカタイプがわかる", "8タイプの中から、あなたに近いタイプと性格分析を表示します。") +
          step(3, "map", "銭湯と街の楽しみ方を提案", "おすすめ銭湯TOP3と、その近くの立ち寄りスポットまで紹介。") +
        "</ol>" +
      "</section>" +

      '<section class="section section-tint">' +
        '<div class="container">' +
          '<h2 class="section-title"><span class="section-kicker">RESULT</span>診断でわかること</h2>' +
          '<div class="feature-grid">' +
            feature("sparkle", "ポカポカタイプ", "8つのタイプから、あなたの湯の楽しみ方を判定。タイプごとに色とイラストが変わります。") +
            feature("heart", "読みごたえのある性格分析", "長所や向いている休日、銭湯選びで大切にしたいことを、じっくり解説します。") +
            feature("bath", "おすすめ銭湯TOP3", "回答と銭湯の特徴を照らし合わせて、相性のよい順にランキング。理由もわかります。") +
            feature("pin", "周辺のおすすめスポット", "カフェ・食事処・公園・遊び場など、タイプに合わせて銭湯の前後の楽しみ方を提案。") +
          "</div>" +
        "</div>" +
      "</section>" +

      '<section class="section container">' +
        '<h2 class="section-title"><span class="section-kicker">8 TYPES</span>8つのポカポカタイプ</h2>' +
        '<ul class="type-grid">' + types + "</ul>" +
      "</section>" +

      '<section class="section container">' +
        '<div class="notice-card">' +
          '<div class="notice-icon">' + icon("info") + "</div>" +
          "<div>" +
            "<h3>このアプリについて（中間発表用デモ）</h3>" +
            "<ul>" +
              "<li>このアプリは「活躍人材育成プログラム」中間発表用のデモです。</li>" +
              "<li>「銭湯A」「カフェA」などの施設名はすべて仮の名前です。実在の施設とは関係ありません。</li>" +
              "<li>料金・営業時間・住所などは、デモ用の仮データです。</li>" +
              "<li>診断は楽しむためのもので、医学的・心理学的な診断ではありません。</li>" +
            "</ul>" +
          "</div>" +
        "</div>" +
        '<div class="final-cta">' +
          "<p>さあ、あなたのポカポカタイプは？</p>" +
          '<button class="btn btn-primary btn-xl" data-action="start">無料で診断する' + icon("arrowRight") + "</button>" +
          '<button class="btn-link" data-action="random">' + icon("dice") + "発表用：ランダムに回答してすぐ結果を見る</button>" +
        "</div>" +
      "</section>";
  }

  function step(n, ic, title, text) {
    return '<li class="step"><div class="step-num">' + n + '</div><div class="step-icon">' + icon(ic) + "</div><h3>" + title + "</h3><p>" + text + "</p></li>";
  }

  function feature(ic, title, text) {
    return '<div class="feature"><div class="feature-icon">' + icon(ic) + "</div><h3>" + title + "</h3><p>" + text + "</p></div>";
  }

  // ---------- 診断ページ ----------
  var autoTimer = null;

  function renderQuiz(direction) {
    clearTimeout(autoTimer);
    var i = state.current, q = Q[i], ans = state.answers[i];
    var last = i === Q.length - 1;
    var pct = Math.round(((i + 1) / Q.length) * 100);
    var options = q.options.map(function (o, oi) {
      return '<button class="option' + (ans === oi ? " selected" : "") + '" data-option="' + oi + '" aria-pressed="' + (ans === oi) + '" style="animation-delay:' + (60 + oi * 50) + 'ms">' +
        '<span class="option-letter">' + LETTERS[oi] + "</span>" +
        '<span class="option-label">' + esc(o.label) + "</span>" +
        '<span class="option-check">' + icon("check") + "</span></button>";
    }).join("");

    app.innerHTML =
      '<section class="quiz container">' +
        '<div class="quiz-head">' +
          '<div class="quiz-meta"><span class="quiz-count"><b>Q' + (i + 1) + "</b> / " + Q.length + "</span>" +
          '<span class="quiz-section">' + esc(q.section) + "</span></div>" +
          '<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="' + Q.length + '" aria-valuenow="' + (i + 1) + '"><div class="progress-bar" style="width:' + pct + '%"></div>' +
          '<div class="progress-duck" style="left:' + pct + '%">' + icon("steam") + "</div></div>" +
        "</div>" +
        '<div class="q-card ' + (direction === "back" ? "enter-back" : "enter") + '">' +
          '<p class="q-number">QUESTION ' + String(i + 1).padStart(2, "0") + "</p>" +
          '<h2 class="q-text">' + esc(q.text) + "</h2>" +
          '<div class="options">' + options + "</div>" +
        "</div>" +
        '<div class="quiz-nav">' +
          (i === 0
            ? '<button class="btn btn-ghost" data-action="home">' + icon("home") + "トップへ</button>"
            : '<button class="btn btn-ghost" data-action="prev">' + icon("arrowLeft") + "前へ</button>") +
          '<button class="btn ' + (last ? "btn-primary btn-finish" : "btn-dark") + '" data-action="next"' + (ans == null ? " disabled" : "") + ">" +
            (last ? "診断結果を見る" + icon("sparkle") : "次へ" + icon("arrowRight")) + "</button>" +
        "</div>" +
        '<p class="quiz-hint pc-only">キーボードの 1〜4 / A〜D で選択、Enter で次へ進めます</p>' +
      "</section>";
  }

  function selectOption(oi) {
    var i = state.current;
    var wasEmpty = state.answers[i] == null;
    state.answers[i] = oi;
    save();
    var buttons = app.querySelectorAll(".option");
    for (var k = 0; k < buttons.length; k++) {
      var on = k === oi;
      buttons[k].classList.toggle("selected", on);
      buttons[k].setAttribute("aria-pressed", on);
    }
    var next = app.querySelector('[data-action="next"]');
    if (next) next.disabled = false;
    // 初めて答えた質問は、少し待って自動で次へ（戻って変更したときは自動で進まない）
    clearTimeout(autoTimer);
    if (wasEmpty && i < Q.length - 1) {
      autoTimer = setTimeout(function () {
        if (state.current === i && location.hash === "#/quiz") nextQuestion();
      }, 420);
    }
  }

  function nextQuestion() {
    if (state.answers[state.current] == null) {
      toast("選択肢をひとつ選んでください");
      return;
    }
    if (state.current < Q.length - 1) {
      state.current++;
      save();
      renderQuiz("next");
    } else {
      finishQuiz();
    }
  }

  function prevQuestion() {
    if (state.current > 0) {
      state.current--;
      save();
      renderQuiz("back");
    }
  }

  function finishQuiz() {
    if (!Poka.scoring.isComplete(state.answers)) {
      var first = state.answers.indexOf(null);
      state.current = first < 0 ? 0 : first;
      save();
      renderQuiz();
      toast("まだ答えていない質問があります");
      return;
    }
    showLoading(function () { go("#/result"); });
  }

  function showLoading(done) {
    var el = document.createElement("div");
    el.className = "loading";
    el.innerHTML =
      '<div class="loading-inner">' +
        '<div class="loading-tub">' + icon("bath") + '<span class="loading-steam">' + icon("steam") + "</span></div>" +
        '<p class="loading-text">湯加減を見ています…</p>' +
        '<div class="loading-bar"><span></span></div>' +
      "</div>";
    document.body.appendChild(el);
    setTimeout(function () {
      done();
      el.classList.add("out");
      setTimeout(function () { el.remove(); }, 400);
    }, 1300);
  }

  // ---------- 結果ページ ----------
  function needDiagnosis() {
    app.innerHTML =
      '<section class="container empty-state">' +
        '<div class="empty-icon">' + icon("bath") + "</div>" +
        "<h2>まだ診断が終わっていません</h2>" +
        "<p>18問に答えると、あなたのポカポカタイプとおすすめの銭湯が表示されます。</p>" +
        '<div class="btn-row"><button class="btn btn-primary" data-action="resume">' + icon("arrowRight") + "診断を続ける</button>" +
        '<a class="btn btn-ghost" href="#/">' + icon("home") + "トップへ</a></div>" +
      "</section>";
  }

  function renderResult() {
    var res = getResult();
    if (!res) return needDiagnosis();
    var t = res.type, top = res.ranking[0];
    var topSpot = Poka.scoring.recommendSpots(top.sento.id, res)[0];

    var analysis = t.analysis.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") +
      '<p class="analysis-link">今回の診断では、<b>' + esc(top.sento.name) + "</b>（" + esc(top.sento.concept) + "）が1位になりました。" +
      esc(t.name) + "のあなたが大切にしたい「" + esc(t.value) + "」と相性がよい銭湯です。" +
      "湯上がりには、近くの<b>" + esc(topSpot.spot.name) + "</b>（" + esc(topSpot.category.label) + "）に立ち寄るのもおすすめですよ。</p>";

    var bars = Poka.INDICATORS.map(function (ind, i) {
      var r = res.ratios[ind.key];
      return '<li class="bar-row"><span class="bar-label">' + esc(ind.label) + "</span>" +
        '<span class="bar-track"><span class="bar-fill" style="--w:' + Math.round(r * 100) + "%;animation-delay:" + (i * 80) + 'ms"></span></span>' +
        '<span class="bar-value">' + res.totals[ind.key] + "pt</span></li>";
    }).join("");

    var cards = res.ranking.slice(0, 3).map(function (r, i) { return rankCard(r, i); }).join("");

    app.innerHTML =
      '<div class="result" style="' + typeStyle(t) + '">' +
        '<section class="type-hero">' +
          '<div class="type-hero-bg" aria-hidden="true"><span></span><span></span><span></span></div>' +
          '<div class="container type-hero-inner">' +
            '<p class="type-lead">あなたのポカポカタイプは…</p>' +
            '<div class="type-badge xl pop">' + Poka.typeArt(t.icon) + "</div>" +
            '<h1 class="type-name">' + esc(t.name) + "</h1>" +
            '<p class="type-catch">「' + esc(t.catch) + "」</p>" +
            '<ul class="chips">' + t.traits.map(function (x) { return "<li>#" + esc(x) + "</li>"; }).join("") + "</ul>" +
            '<p class="type-feature">' + esc(t.feature) + "</p>" +
          "</div>" +
        "</section>" +

        '<div class="container result-body">' +
          '<div class="result-grid">' +
            '<section class="card analysis">' +
              '<h2 class="card-title">' + icon("heart") + "性格分析</h2>" + analysis +
              '<p class="note">※この診断は楽しむためのもので、医学的・心理学的な診断ではありません。</p>' +
            "</section>" +
            '<aside class="card components">' +
              '<h2 class="card-title">' + icon("steam") + "あなたのポカポカ成分</h2>" +
              '<ul class="bars">' + bars + "</ul>" +
              '<div class="second-type" style="' + typeStyle(res.secondType) + '">' +
                '<div class="type-badge xs">' + Poka.typeArt(res.secondType.icon) + "</div>" +
                "<p>次に近いタイプ<br><b>" + esc(res.secondType.name) + "</b></p></div>" +
            "</aside>" +
          "</div>" +

          '<section class="ranking">' +
            '<h2 class="section-title"><span class="section-kicker">RANKING</span>あなたにおすすめの銭湯 TOP3</h2>' +
            '<p class="section-lead small">スコアは、あなたの回答から計算した6つの成分と、各銭湯の特徴（デモ用の仮設定）の相性から算出しています。</p>' +
            '<div class="rank-list">' + cards + "</div>" +
          "</section>" +

          shareSection(res) +

          '<div class="btn-row center end-actions">' +
            '<button class="btn btn-primary" data-action="start">' + icon("refresh") + "もう一度診断する</button>" +
            '<a class="btn btn-ghost" href="#/">' + icon("home") + "トップへ戻る</a>" +
          "</div>" +
        "</div>" +
      "</div>";
  }

  function rankCard(r, i) {
    var s = r.sento;
    return '<article class="rank-card rank-' + (i + 1) + '" style="animation-delay:' + (i * 140) + 'ms">' +
      '<div class="rank-visual">' + Poka.sentoScene(s) +
        '<div class="rank-medal"><span>' + (i + 1) + "</span>位</div></div>" +
      '<div class="rank-body">' +
        '<h3 class="rank-name">' + esc(s.name) + "</h3>" +
        '<p class="rank-concept">' + esc(s.concept) + "</p>" +
        '<ul class="tags">' + s.tags.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" +
        '<div class="score"><span class="score-label">おすすめスコア</span>' +
          '<span class="score-num">' + r.score + "<small>点</small></span>" +
          '<span class="score-track"><span style="--w:' + r.score + '%"></span></span></div>' +
        '<div class="reasons"><p class="reasons-title">' + icon("sparkle") + "あなたに合う理由</p>" +
          r.reasons.map(function (x) { return '<p class="reason"><span class="reason-tag">' + esc(x.label) + "</span>" + esc(x.text) + "</p>"; }).join("") +
        "</div>" +
        '<a class="btn btn-dark btn-block" href="#/sento/' + s.id + '">詳しく見る' + icon("arrowRight") + "</a>" +
      "</div></article>";
  }

  function shareSection(res) {
    var t = res.type, top = res.ranking[0];
    return '<section class="share">' +
      '<h2 class="section-title"><span class="section-kicker">SHARE</span>あなたのポカポカタイプをシェアしよう</h2>' +
      '<div class="share-wrap">' +
        '<div class="share-card" id="share-card">' +
          '<p class="share-brand">' + icon("steam") + "ポカポカ診断</p>" +
          '<div class="type-badge lg">' + Poka.typeArt(t.icon) + "</div>" +
          '<p class="share-lead">わたしのポカポカタイプは</p>' +
          '<p class="share-name">' + esc(t.name) + "</p>" +
          '<p class="share-catch">「' + esc(t.catch) + "」</p>" +
          '<p class="share-feature">' + esc(t.feature) + "</p>" +
          '<p class="share-top">おすすめ銭湯1位：<b>' + esc(top.sento.name) + "</b>（" + top.score + "点）</p>" +
          '<p class="share-tags">#ポカポカ診断 #大田区の銭湯</p>' +
          '<p class="share-note">※中間発表用デモ・施設情報は仮データです</p>' +
        "</div>" +
        '<div class="share-actions">' +
          '<button class="btn btn-primary btn-block" data-action="share">' + icon("share") + "結果をシェア</button>" +
          '<button class="btn btn-ghost btn-block" data-action="copy">' + icon("copy") + "結果テキストをコピー</button>" +
          '<button class="btn btn-ghost btn-block" data-action="save-image">' + icon("download") + "結果カードを画像で保存</button>" +
          '<p class="note">シェア機能が使えない環境では、結果のテキストをコピーします。</p>' +
        "</div>" +
      "</div></section>";
  }

  // ---------- 銭湯の詳細ページ ----------
  function renderSento(id) {
    var res = getResult();
    if (!res) return needDiagnosis();
    var idx = -1;
    res.ranking.forEach(function (r, i) { if (r.sento.id === id) idx = i; });
    if (idx < 0) { go("#/result"); return; }
    var r = res.ranking[idx], s = r.sento, t = res.type;
    var spots = Poka.scoring.recommendSpots(s.id, res);

    var spotCards = spots.map(function (sp, i) {
      return '<article class="spot-card' + (i < 3 ? " is-top" : "") + '" style="animation-delay:' + (i * 70) + 'ms">' +
        '<div class="spot-head">' +
          '<span class="spot-rank">' + (i + 1) + "</span>" +
          '<span class="spot-icon">' + icon(sp.category.icon) + "</span>" +
          "<div><h3 class=\"spot-name\">" + esc(sp.spot.name) + "</h3>" +
          '<p class="spot-cat">' + esc(sp.category.label) + "</p></div>" +
          (i < 3 ? '<span class="spot-badge">おすすめ</span>' : "") +
        "</div>" +
        '<p class="spot-reason">' + (sp.matchedAnswer ? '<span class="match-chip">回答とマッチ</span>' : "") + esc(sp.reason) + "</p>" +
        '<p class="spot-relation">' + icon("bath") + esc(sp.spot.relation) + "</p>" +
        '<button class="btn btn-ghost btn-sm" data-spot="' + sp.spot.id + '">詳細を見る' + icon("arrowRight") + "</button>" +
      "</article>";
    }).join("");

    var others = res.ranking.slice(0, 3).filter(function (x) { return x.sento.id !== s.id; }).map(function (x) {
      var rank = res.ranking.indexOf(x) + 1;
      return '<a class="other-sento" href="#/sento/' + x.sento.id + '"><span class="other-rank">' + rank + "位</span><b>" + esc(x.sento.name) + "</b><small>" + x.score + "点</small>" + icon("arrowRight") + "</a>";
    }).join("");

    app.innerHTML =
      '<div class="detail" style="' + typeStyle(t) + '">' +
        '<div class="container">' +
          '<a class="back-link" href="#/result">' + icon("arrowLeft") + "結果に戻る</a>" +
          '<section class="detail-hero">' +
            '<div class="detail-visual">' + Poka.sentoScene(s) + "</div>" +
            '<div class="detail-head">' +
              '<p class="detail-rank">あなたのおすすめ <b>' + (idx + 1) + "位</b>　おすすめスコア <b>" + r.score + "点</b></p>" +
              '<h1 class="detail-name">' + esc(s.name) + "</h1>" +
              '<p class="detail-concept">' + esc(s.concept) + "</p>" +
              '<ul class="tags">' + s.tags.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" +
              '<p class="detail-desc">' + esc(s.description) + "</p>" +
            "</div>" +
          "</section>" +

          '<section class="card detail-reasons">' +
            '<h2 class="card-title">' + icon("sparkle") + "あなたにおすすめする理由</h2>" +
            r.reasons.map(function (x) { return '<p class="reason"><span class="reason-tag">' + esc(x.label) + "</span>" + esc(x.text) + "</p>"; }).join("") +
            '<p class="reason"><span class="reason-tag type">' + esc(t.name) + "</span>" + esc(t.name) + "のあなたが大切にしたい「" + esc(t.value) + "」を意識して選びました。</p>" +
          "</section>" +

          '<div class="detail-grid">' +
            '<section class="card">' +
              '<h2 class="card-title">' + icon("bath") + "設備 <span class=\"demo-tag\">デモ用の仮データ</span></h2>" +
              '<ul class="facility-list">' + s.facilities.map(function (f) { return "<li>" + icon("check") + esc(f) + "</li>"; }).join("") + "</ul>" +
            "</section>" +
            '<section class="card">' +
              '<h2 class="card-title">' + icon("info") + "基本情報 <span class=\"demo-tag\">デモ用の仮データ</span></h2>" +
              '<dl class="info-list">' +
                info("yen", "料金", s.info.price) +
                info("clock", "営業時間", s.info.hours) +
                info("pin", "住所", s.info.address) +
                info("map", "アクセス", s.info.access) +
              "</dl>" +
              '<p class="note warn">上記はデモ用の仮データです。実在する施設の料金・営業時間・住所ではありません。</p>' +
            "</section>" +
          "</div>" +

          '<section class="spots">' +
            '<h2 class="section-title"><span class="section-kicker">NEARBY</span>この銭湯の近くで、あなたにおすすめの場所</h2>' +
            '<p class="section-lead small"><b>' + esc(t.name) + "</b>のあなたの好みと回答に合わせて、おすすめ順に並べています。</p>" +
            '<div class="spots-layout">' +
              '<figure class="map-box">' + Poka.mapDiagram(s, spots) +
                "<figcaption>" + icon("info") + "位置関係のイメージ図です。実際の地図・距離ではありません。</figcaption></figure>" +
              '<div class="spot-list">' + spotCards + "</div>" +
            "</div>" +
          "</section>" +

          (others ? '<section class="others"><h2 class="card-title">' + icon("list") + "ほかのおすすめ銭湯も見る</h2><div class=\"others-row\">" + others + "</div></section>" : "") +

          '<div class="btn-row center end-actions">' +
            '<a class="btn btn-dark" href="#/result">' + icon("arrowLeft") + "結果に戻る</a>" +
            '<button class="btn btn-ghost" data-action="start">' + icon("refresh") + "もう一度診断する</button>" +
            '<a class="btn btn-ghost" href="#/">' + icon("home") + "トップへ</a>" +
          "</div>" +
        "</div>" +
      "</div>";
  }

  function info(ic, label, value) {
    return "<div><dt>" + icon(ic) + label + "</dt><dd>" + esc(value) + '<span class="kari">（仮）</span></dd></div>';
  }

  // ---------- 周辺スポットの詳細（モーダル） ----------
  function openSpot(spotId) {
    var res = getResult();
    if (!res) return;
    var spot = Poka.SPOTS.filter(function (s) { return s.id === spotId; })[0];
    if (!spot) return;
    var rec = Poka.scoring.recommendSpots(spot.sento, res).filter(function (x) { return x.spot.id === spotId; })[0];
    var sento = Poka.SENTOS.filter(function (s) { return s.id === spot.sento; })[0];
    modalRoot.innerHTML =
      '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" style="' + typeStyle(res.type) + '">' +
        '<div class="modal-backdrop" data-action="close-modal"></div>' +
        '<div class="modal-panel">' +
          '<button class="modal-close" data-action="close-modal" aria-label="閉じる">' + icon("close") + "</button>" +
          '<div class="modal-head"><span class="spot-icon lg">' + icon(rec.category.icon) + "</span>" +
            '<div><p class="spot-cat">' + esc(rec.category.label) + '</p><h2 id="modal-title">' + esc(spot.name) + "</h2></div></div>" +
          '<p class="modal-desc">' + esc(spot.desc) + "</p>" +
          '<div class="modal-block"><h3>' + icon("heart") + "あなたにおすすめの理由</h3><p>" + esc(rec.reason) + "</p></div>" +
          '<div class="modal-block"><h3>' + icon("bath") + esc(sento.name) + "との関係</h3><p>" + esc(spot.relation) + "</p></div>" +
          '<p class="note warn">' + icon("info") + "デモ用の仮データです。営業時間・住所・距離などは設定していません。</p>" +
          '<button class="btn btn-dark btn-block" data-action="close-modal">閉じる</button>' +
        "</div>" +
      "</div>";
    document.body.classList.add("modal-open");
    var closeBtn = modalRoot.querySelector(".modal-close");
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modalRoot.innerHTML = "";
    document.body.classList.remove("modal-open");
  }

  // ---------- 操作のまとめ（イベント） ----------
  document.addEventListener("click", function (e) {
    var opt = e.target.closest("[data-option]");
    if (opt) { selectOption(Number(opt.getAttribute("data-option"))); return; }

    var spotBtn = e.target.closest("[data-spot]");
    if (spotBtn) { openSpot(spotBtn.getAttribute("data-spot")); return; }

    var el = e.target.closest("[data-action]");
    if (!el) return;
    var action = el.getAttribute("data-action");
    var res;
    switch (action) {
      case "start": closeModal(); startQuiz(); break;
      case "random":
        state = { answers: Poka.scoring.randomAnswers(), current: Q.length - 1 };
        save();
        showLoading(function () { go("#/result"); });
        break;
      case "resume": go("#/quiz"); break;
      case "home": go("#/"); break;
      case "next": nextQuestion(); break;
      case "prev": prevQuestion(); break;
      case "close-modal": closeModal(); break;
      case "share":
        res = getResult();
        if (!res) return;
        Poka.share.shareResult(res).then(function (r) {
          if (r === "copied") toast("結果テキストをコピーしました");
          else if (r === "failed") toast("コピーできませんでした");
        });
        break;
      case "copy":
        res = getResult();
        if (!res) return;
        Poka.share.copyText(Poka.share.buildText(res)).then(function (ok) {
          toast(ok ? "結果テキストをコピーしました" : "コピーできませんでした");
        });
        break;
      case "save-image":
        res = getResult();
        if (!res) return;
        el.disabled = true;
        Poka.share.saveImage(res).then(function (ok) {
          el.disabled = false;
          toast(ok ? "結果カードの画像を保存しました" : "画像を保存できませんでした（ほかの機能はそのまま使えます）");
        });
        break;
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modalRoot.innerHTML) { closeModal(); return; }
    if (location.hash !== "#/quiz" || e.metaKey || e.ctrlKey || e.altKey) return;
    var key = e.key.toUpperCase();
    var n = ["1", "2", "3", "4"].indexOf(key);
    if (n < 0) n = LETTERS.indexOf(key);
    if (n >= 0 && n < Q[state.current].options.length) { selectOption(n); return; }
    if (e.key === "Enter" && !(e.target.closest && e.target.closest("button"))) nextQuestion();
    else if (e.key === "ArrowRight") nextQuestion();
    else if (e.key === "ArrowLeft") prevQuestion();
  });

  // ---------- 画面の切り替え ----------
  function route() {
    closeModal();
    clearTimeout(autoTimer);
    var hash = location.hash.replace(/^#/, "") || "/";
    var parts = hash.split("/").filter(Boolean);
    try {
      if (parts[0] === "quiz") renderQuiz();
      else if (parts[0] === "result") renderResult();
      else if (parts[0] === "sento" && parts[1]) renderSento(parts[1]);
      else renderHome();
    } catch (err) {
      // 万が一エラーが起きても、画面が真っ白にならないようにする
      console.error(err);
      app.innerHTML =
        '<section class="container empty-state"><h2>表示中に問題が起きました</h2>' +
        "<p>お手数ですが、もう一度最初から試してください。</p>" +
        '<div class="btn-row"><button class="btn btn-primary" data-action="start">' + icon("refresh") + "最初から診断する</button></div></section>";
    }
    document.body.setAttribute("data-page", parts[0] || "home");
    window.scrollTo(0, 0);
  }

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.addEventListener("hashchange", route);
  route();
})();

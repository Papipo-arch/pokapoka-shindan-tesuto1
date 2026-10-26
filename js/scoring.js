/*
 * 診断ロジック（画面のコードとは分けて管理しています）
 * ------------------------------------------------------------
 * 1. 回答 → 6つの指標スコアに集計する
 * 2. 指標スコアの「形」と各タイプの profile の形を比べ、いちばん近いタイプを選ぶ
 * 3. 指標スコアと各銭湯の features を比べて、マッチ度順に並べる
 * 4. タイプ・回答・銭湯の組み合わせから、周辺スポットの順位を決める
 *
 * 「形を比べる」には相関係数（-1〜1）を使っています。
 * グラフの山と谷の位置が似ているほど 1 に近づきます。
 */
window.Poka = window.Poka || {};

Poka.scoring = (function () {
  var KEYS = Poka.INDICATORS.map(function (i) { return i.key; });

  // 回答から「あなたらしさ」として表示する一言
  var USER_PHRASES = {
    relax: "「ゆっくり癒やされたい」という回答が多めでした",
    sauna: "サウナや設備をしっかり楽しみたい気持ちが表れていました",
    retro: "昔ながらの雰囲気を大切にする回答が目立ちました",
    adventure: "新しい発見や体験を求める回答が多めでした",
    gourmet: "銭湯の前後にごはんや街歩きも楽しみたい様子でした",
    easy: "気軽さや行きやすさを重視する回答が多めでした"
  };

  // 回答で特に希望したカテゴリのスポットに添える一言
  var BOOST_PHRASES = {
    meal: "「おいしいご飯を食べたい」と答えたあなたに。",
    cafe: "「カフェで休憩したい」と答えたあなたに。",
    sweets: "「甘いものに立ち寄りたい」と答えたあなたに。",
    park: "「静かな公園に寄りたい」と答えたあなたに。",
    fun: "「遊びも楽しみたい」と答えたあなたに。",
    sight: "「観光も楽しみたい」と答えたあなたに。",
    rest: "「ゆっくり帰りたい」あなたも立ち寄りやすい場所です。",
    shotengai: "「街もまとめて楽しみたい」と答えたあなたに。"
  };

  function toVector(obj) {
    return KEYS.map(function (k) { return (obj && obj[k]) || 0; });
  }

  function correlation(a, b) {
    var n = a.length, ma = 0, mb = 0, i;
    for (i = 0; i < n; i++) { ma += a[i]; mb += b[i]; }
    ma /= n; mb /= n;
    var num = 0, da = 0, db = 0;
    for (i = 0; i < n; i++) {
      num += (a[i] - ma) * (b[i] - mb);
      da += (a[i] - ma) * (a[i] - ma);
      db += (b[i] - mb) * (b[i] - mb);
    }
    if (da === 0 || db === 0) return 0;
    return num / Math.sqrt(da * db);
  }

  // 相関係数（-1〜1）を「おすすめスコア」（0〜100点）に換算
  function toMatchScore(r) {
    return Math.max(30, Math.min(99, Math.round(60 + 39 * r)));
  }

  function tally(answers) {
    var totals = {}, spotBoost = {};
    KEYS.forEach(function (k) { totals[k] = 0; });
    answers.forEach(function (choice, qi) {
      if (choice == null) return;
      var q = Poka.QUESTIONS[qi];
      if (!q || !q.options[choice]) return;
      var opt = q.options[choice];
      Object.keys(opt.points || {}).forEach(function (k) { totals[k] += opt.points[k]; });
      Object.keys(opt.spot || {}).forEach(function (c) { spotBoost[c] = (spotBoost[c] || 0) + opt.spot[c]; });
    });
    var sum = KEYS.reduce(function (s, k) { return s + totals[k]; }, 0) || 1;
    var max = Math.max.apply(null, KEYS.map(function (k) { return totals[k]; })) || 1;
    var shares = {}, ratios = {};
    KEYS.forEach(function (k) {
      shares[k] = totals[k] / sum;   // 全体に占める割合
      ratios[k] = totals[k] / max;   // いちばん高い指標を1としたときの比率（グラフ表示用）
    });
    return { totals: totals, shares: shares, ratios: ratios, spotBoost: spotBoost };
  }

  function rankTypes(totals) {
    var v = toVector(totals);
    return Poka.TYPES.map(function (t) {
      return { type: t, r: correlation(v, toVector(t.profile)) };
    }).sort(function (a, b) { return b.r - a.r; });
  }

  function sentoReasons(sento, shares) {
    return KEYS.map(function (k) {
      return { key: k, weight: shares[k] * sento.features[k] };
    }).sort(function (a, b) { return b.weight - a.weight; })
      .slice(0, 2)
      .map(function (x) {
        var ind = Poka.INDICATORS.filter(function (i) { return i.key === x.key; })[0];
        return { key: x.key, label: ind.label, text: USER_PHRASES[x.key] + "。" + sento.highlights[x.key] + "。" };
      });
  }

  function rankSentos(t) {
    var v = toVector(t.totals);
    return Poka.SENTOS.map(function (s) {
      var r = correlation(v, toVector(s.features));
      return { sento: s, r: r, score: toMatchScore(r), reasons: sentoReasons(s, t.shares) };
    }).sort(function (a, b) { return b.r - a.r; });
  }

  function diagnose(answers) {
    var t = tally(answers);
    var types = rankTypes(t.totals);
    return {
      totals: t.totals,
      shares: t.shares,
      ratios: t.ratios,
      spotBoost: t.spotBoost,
      type: types[0].type,
      secondType: types[1].type,
      typeRanking: types,
      ranking: rankSentos(t)
    };
  }

  function recommendSpots(sentoId, result) {
    var type = result.type;
    return Poka.SPOTS.filter(function (s) { return s.sento === sentoId; })
      .map(function (s) {
        var pref = (type.spotPrefs[s.category] || 0);
        var boost = (result.spotBoost[s.category] || 0);
        var fit = KEYS.reduce(function (sum, k) { return sum + result.shares[k] * ((s.features && s.features[k]) || 0); }, 0);
        var score = pref * 2 + boost * 1.5 + fit * 6;
        var cat = Poka.SPOT_CATEGORIES[s.category];
        var base = type.spotReasons[s.category] || (type.name + "のあなたにも。" + cat.reason);
        return {
          spot: s,
          category: cat,
          score: score,
          matchedAnswer: boost > 0,
          reason: (boost > 0 ? BOOST_PHRASES[s.category] : "") + base
        };
      })
      .sort(function (a, b) { return b.score - a.score; });
  }

  function isComplete(answers) {
    return Array.isArray(answers) &&
      answers.length === Poka.QUESTIONS.length &&
      answers.every(function (a) { return typeof a === "number"; });
  }

  function randomAnswers() {
    return Poka.QUESTIONS.map(function (q) { return Math.floor(Math.random() * q.options.length); });
  }

  return {
    diagnose: diagnose,
    recommendSpots: recommendSpots,
    isComplete: isComplete,
    randomAnswers: randomAnswers,
    correlation: correlation
  };
})();

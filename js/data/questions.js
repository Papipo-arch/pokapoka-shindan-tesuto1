/*
 * 診断の「指標」と「質問」のデータ
 * ------------------------------------------------------------
 * ・質問や選択肢の文章を変えたいときは、このファイルだけ編集すればOKです。
 * ・points … その選択肢を選んだときに、どの指標に何点入るか
 * ・spot   … その選択肢を選んだときに、周辺スポットのどのカテゴリを優先するか
 *            （カテゴリ名は js/data/spots.js の SPOT_CATEGORIES を参照）
 */
window.Poka = window.Poka || {};

Poka.INDICATORS = [
  { key: "relax",     label: "リラックス",     short: "癒やし" },
  { key: "sauna",     label: "サウナ・設備",   short: "設備" },
  { key: "retro",     label: "レトロ・雰囲気", short: "レトロ" },
  { key: "adventure", label: "新しい体験",     short: "発見" },
  { key: "gourmet",   label: "食事・街歩き",   short: "グルメ" },
  { key: "easy",      label: "気軽さ・アクセス", short: "気軽さ" }
];

Poka.QUESTIONS = [
  // 【性格・過ごし方】
  {
    section: "性格・過ごし方",
    text: "休日の理想の過ごし方は？",
    options: [
      { label: "家でゆっくり過ごす",   points: { relax: 3 } },
      { label: "友達と出かける",       points: { gourmet: 2, easy: 1 } },
      { label: "新しい場所を探検する", points: { adventure: 3 } },
      { label: "趣味に没頭する",       points: { easy: 2, relax: 1 } }
    ]
  },
  {
    section: "性格・過ごし方",
    text: "疲れたときにしたいことは？",
    options: [
      { label: "静かな場所でのんびりする", points: { relax: 3 } },
      { label: "おいしいものを食べる",     points: { gourmet: 3 } },
      { label: "体を動かして気分転換する", points: { sauna: 2, easy: 1 } },
      { label: "好きな人や友達と話す",     points: { gourmet: 1, retro: 2 } }
    ]
  },
  {
    section: "性格・過ごし方",
    text: "初めての場所に行くときは？",
    options: [
      { label: "落ち着けるかを重視する", points: { relax: 1, retro: 2 } },
      { label: "口コミや評判を調べる",   points: { sauna: 1, easy: 2 } },
      { label: "面白そうならすぐ行く",   points: { adventure: 3 } },
      { label: "誰かと一緒に行きたい",   points: { gourmet: 2, easy: 1 } }
    ]
  },
  {
    section: "性格・過ごし方",
    text: "自分に近いと思うのは？",
    options: [
      { label: "マイペース",         points: { easy: 2, relax: 1 } },
      { label: "好奇心旺盛",         points: { adventure: 3 } },
      { label: "行動派",             points: { sauna: 2, adventure: 1 } },
      { label: "雰囲気を大切にする", points: { retro: 3 } }
    ]
  },

  // 【お風呂・銭湯の好み】
  {
    section: "お風呂・銭湯の好み",
    text: "銭湯で一番楽しみたいことは？",
    options: [
      { label: "お湯に浸かってリラックス", points: { relax: 3 } },
      { label: "サウナなどの設備",         points: { sauna: 3 } },
      { label: "いろいろなお風呂",         points: { adventure: 2, sauna: 1 } },
      { label: "昔ながらの雰囲気",         points: { retro: 3 } }
    ]
  },
  {
    section: "お風呂・銭湯の好み",
    text: "好きなお湯の温度は？",
    options: [
      { label: "ぬるめでゆっくり",     points: { relax: 3 } },
      { label: "しっかり温かい",       points: { retro: 2, easy: 1 } },
      { label: "熱めのお湯",           points: { retro: 2, sauna: 1 } },
      { label: "その日の気分で選びたい", points: { adventure: 1, easy: 2 } }
    ]
  },
  {
    section: "お風呂・銭湯の好み",
    text: "好きな銭湯の雰囲気は？",
    options: [
      { label: "静かで落ち着く",           points: { relax: 3 } },
      { label: "清潔感があって現代的",     points: { sauna: 2, easy: 1 } },
      { label: "昔ながらでレトロ",         points: { retro: 3 } },
      { label: "特徴があってワクワクする", points: { adventure: 3 } }
    ]
  },
  {
    section: "お風呂・銭湯の好み",
    text: "サウナについてどう思う？",
    options: [
      { label: "今回はお風呂を中心に楽しみたい", points: { retro: 2, relax: 1 } },
      { label: "サウナも楽しみたい",             points: { sauna: 2, gourmet: 1 } },
      { label: "サウナや水風呂などの設備を重視する", points: { sauna: 3 } },
      { label: "どちらでもよい",                 points: { easy: 2 } }
    ]
  },
  {
    section: "お風呂・銭湯の好み",
    text: "銭湯で過ごしたい時間は？",
    options: [
      { label: "短時間でさっぱり",         points: { easy: 3 } },
      { label: "ゆっくり長めに",           points: { relax: 2, retro: 1 } },
      { label: "お風呂以外も含めて満喫",   points: { gourmet: 3 } },
      { label: "その日の気分次第",         points: { easy: 1, adventure: 1 } }
    ]
  },

  // 【今の気分・目的】
  {
    section: "今の気分・目的",
    text: "今日の気分に一番近いのは？",
    options: [
      { label: "のんびりしたい",             points: { relax: 3 } },
      { label: "スカッとしたい",             points: { sauna: 2, easy: 1 } },
      { label: "新しい発見がほしい",         points: { adventure: 3 } },
      { label: "誰かと楽しい時間を過ごしたい", points: { gourmet: 2, retro: 1 } }
    ]
  },
  {
    section: "今の気分・目的",
    text: "今日の銭湯に求めるものは？",
    options: [
      { label: "癒やし",             points: { relax: 3 } },
      { label: "リフレッシュ",       points: { sauna: 2, easy: 1 } },
      { label: "特別な体験",         points: { adventure: 2, gourmet: 1 } },
      { label: "気軽に楽しめること", points: { easy: 3 } }
    ]
  },
  {
    section: "今の気分・目的",
    text: "銭湯に行くなら？",
    options: [
      { label: "一人で自分の時間を楽しむ", points: { sauna: 2, relax: 1 } },
      { label: "友達と一緒に行く",         points: { gourmet: 2, adventure: 1 } },
      { label: "家族と行く",               points: { retro: 2, easy: 1 } },
      { label: "そのときによって変わる",   points: { easy: 2 } }
    ]
  },
  {
    section: "今の気分・目的",
    text: "銭湯の前後にしたいことは？",
    options: [
      { label: "そのまま帰ってゆっくりする", points: { relax: 1, easy: 2 }, spot: { rest: 2, park: 1 } },
      { label: "おいしいご飯を食べる",       points: { gourmet: 3 },          spot: { meal: 3 } },
      { label: "カフェで休憩する",           points: { gourmet: 1, relax: 1 }, spot: { cafe: 3, sweets: 1 } },
      { label: "遊びや観光も楽しむ",         points: { adventure: 2, gourmet: 1 }, spot: { fun: 2, sight: 2 } }
    ]
  },

  // 【行動・施設選び】
  {
    section: "行動・施設選び",
    text: "銭湯までの移動は？",
    options: [
      { label: "近くて気軽な場所がよい",       points: { easy: 3 } },
      { label: "少し遠くてもよい",             points: { retro: 2, adventure: 1 } },
      { label: "特別な体験なら遠くてもよい",   points: { adventure: 3 } },
      { label: "行きやすさと楽しさの両方を重視", points: { gourmet: 1, easy: 1, adventure: 1 } }
    ]
  },
  {
    section: "行動・施設選び",
    text: "予算については？",
    options: [
      { label: "できるだけ費用を抑えたい",       points: { easy: 3 } },
      { label: "普通の予算で楽しみたい",         points: { retro: 2, relax: 1 } },
      { label: "体験がよければ多少高くてもよい", points: { sauna: 2, adventure: 1 } },
      { label: "銭湯と食事などを合わせて考えたい", points: { gourmet: 3 }, spot: { meal: 1 } }
    ]
  },
  {
    section: "行動・施設選び",
    text: "施設を選ぶときに重視するのは？",
    options: [
      { label: "落ち着いた雰囲気",   points: { relax: 2, retro: 1 } },
      { label: "設備の充実度",       points: { sauna: 3 } },
      { label: "独自の特徴",         points: { adventure: 2, retro: 1 } },
      { label: "近さや利用のしやすさ", points: { easy: 3 } }
    ]
  },
  {
    section: "行動・施設選び",
    text: "銭湯の前後に立ち寄るなら？",
    options: [
      { label: "静かな公園",           points: { relax: 2 },               spot: { park: 3, rest: 1 } },
      { label: "おいしい飲食店",       points: { gourmet: 2 },             spot: { meal: 3, shotengai: 1 } },
      { label: "カフェや甘いもの",     points: { gourmet: 1, relax: 1 },   spot: { cafe: 2, sweets: 3 } },
      { label: "遊び場や観光スポット", points: { adventure: 2, gourmet: 1 }, spot: { fun: 3, sight: 2 } }
    ]
  },
  {
    section: "行動・施設選び",
    text: "今回の理想の休日は？",
    options: [
      { label: "癒やされて元気を取り戻す", points: { relax: 3 } },
      { label: "気分を切り替えてすっきりする", points: { sauna: 2, easy: 1 } },
      { label: "新しいお気に入りを見つける", points: { adventure: 3 } },
      { label: "銭湯も街もまとめて楽しむ", points: { gourmet: 2, retro: 1 }, spot: { shotengai: 2, sight: 1 } }
    ]
  }
];

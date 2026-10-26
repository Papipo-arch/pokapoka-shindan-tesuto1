/*
 * アイコン・イラスト（すべてSVGで描いているので、外部画像は不要です）
 */
window.Poka = window.Poka || {};

(function () {
  var UI = {
    steam: '<path d="M8 20c-2-2.5 2-4 0-6.5S10 9.5 8 7M12 20c-2-2.5 2-4 0-6.5s2-4 0-6.5M16 20c-2-2.5 2-4 0-6.5S18 9.5 16 7"/>',
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowLeft: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    home: '<path d="M3 11l9-8 9 8M5 9.5V20h5v-6h4v6h5V9.5"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.3-4.9L4 8M4 3v5h5M4 13a8 8 0 0 0 14.3 4.9L20 16M20 21v-5h-5"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    pin: '<path d="M12 21s-7-6.3-7-11.5a7 7 0 0 1 14 0C19 14.7 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    yen: '<path d="M6 4l6 8 6-8M12 12v8M7.5 13h9M7.5 16.5h9"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/>',
    sparkle: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    bath: '<path d="M3 12h18v2.5A5.5 5.5 0 0 1 15.5 20h-7A5.5 5.5 0 0 1 3 14.5z"/><path d="M6 12V6.5a2.5 2.5 0 0 1 5 0M7 20l-1 2M17 20l1 2"/>',
    map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
    heart: '<path d="M12 20s-7.5-4.6-9-9.5C2 7 4.2 4 7.3 4c2 0 3.6 1.1 4.7 2.8C13.1 5.1 14.7 4 16.7 4 19.8 4 22 7 21 10.5 19.5 15.4 12 20 12 20z"/>',
    dice: '<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><circle cx="8.5" cy="8.5" r="1.2"/><circle cx="15.5" cy="15.5" r="1.2"/><circle cx="12" cy="12" r="1.2"/>',
    // 周辺スポットのカテゴリ
    cafe: '<path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M17 10.5h1.5a2.5 2.5 0 0 1 0 5H17M8 3c-.8 1 .8 2 0 3.2M12 3c-.8 1 .8 2 0 3.2"/>',
    meal: '<path d="M3 12h18a9 9 0 0 1-18 0z"/><path d="M14.5 3L11 10M20 4.5L14 10.5"/>',
    sweets: '<path d="M4 20L20 4"/><circle cx="8.3" cy="15.7" r="2.7"/><circle cx="12" cy="12" r="2.7"/><circle cx="15.7" cy="8.3" r="2.7"/>',
    park: '<path d="M12 22v-6"/><path d="M12 16c-4 0-7-2.6-7-6.2a7 7 0 0 1 14 0C19 13.4 16 16 12 16z"/><path d="M8 22h8"/>',
    fun: '<path d="M3 7h18v3.2a1.8 1.8 0 0 0 0 3.6V17H3v-3.2a1.8 1.8 0 0 0 0-3.6z"/><path d="M14.5 7v2M14.5 11v2M14.5 15v2"/>',
    shotengai: '<path d="M3 9.5L5 4h14l2 5.5"/><path d="M3 9.5a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M5 12.5V20h14v-7.5M10 20v-4.5h4V20"/>',
    sight: '<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M8 7l1.5-3h5L16 7"/><circle cx="12" cy="13.5" r="3.5"/>',
    rest: '<path d="M5 11V7.5h14V11M3 11h18M4 15h16M6 11v8M18 11v8"/>'
  };

  Poka.icon = function (name, cls) {
    return '<svg class="icon ' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (UI[name] || "") + "</svg>";
  };

  // ---- タイプ別のイラスト（白い線画。色付きの丸いバッジの上に置いて使います） ----
  var SOFT = 'fill="rgba(255,255,255,.28)"';
  var W = 'fill="#fff" stroke="none"';
  function foot(x, y, a) {
    return '<g transform="translate(' + x + " " + y + ") rotate(" + a + ')">' +
      '<ellipse cx="0" cy="0" rx="6.5" ry="9.5" ' + W + "/>" +
      '<circle cx="-5" cy="-13" r="2.3" ' + W + '/><circle cx="0" cy="-15" r="2.3" ' + W + '/><circle cx="5" cy="-13" r="2.3" ' + W + "/></g>";
  }
  var TYPE_ART = {
    mattari:
      '<path d="M18 52h64v6a18 18 0 0 1-18 18H36a18 18 0 0 1-18-18z" ' + SOFT + "/>" +
      '<path d="M30 76l-4 8M70 76l4 8"/>' +
      '<path d="M71 14a15 15 0 1 0 12 24 12 12 0 0 1-12-24z" ' + W + "/>" +
      '<path d="M34 45c-3-4 3-6 0-10s3-6 0-10M48 45c-3-4 3-6 0-10"/>',
    totonoi:
      '<rect x="29" y="14" width="18" height="50" rx="9" ' + SOFT + "/>" +
      '<circle cx="38" cy="72" r="12" ' + W + "/>" +
      '<path d="M38 36v32" stroke-width="7"/>' +
      '<path d="M58 34c4-4 8 4 12 0s8 4 12 0M58 50c4-4 8 4 12 0s8 4 12 0M58 66c4-4 8 4 12 0s8 4 12 0"/>',
    retro:
      '<path d="M14 22h72"/>' +
      '<rect x="20" y="25" width="60" height="50" rx="3" fill="rgba(255,255,255,.28)" stroke="none"/>' +
      '<path d="M40 58v17M60 58v17"/>' +
      '<text x="50" y="52" text-anchor="middle" font-size="26" font-weight="800" font-family="Zen Maru Gothic, Hiragino Maru Gothic ProN, sans-serif" ' + W + ">ゆ</text>" +
      '<path d="M40 14c-2-3 2-4 0-7M60 14c-2-3 2-4 0-7"/>',
    bouken:
      '<circle cx="50" cy="50" r="30" ' + SOFT + "/>" +
      '<path d="M50 12v7M50 81v7M12 50h7M81 50h7"/>' +
      '<path d="M63 37L56 56 37 63 44 44z" ' + W + "/>" +
      '<circle cx="50" cy="50" r="3"/>',
    gohoubi:
      '<path d="M16 50h68a34 34 0 0 1-68 0z" ' + SOFT + "/>" +
      '<path d="M60 20L49 45M75 23L57 45"/>' +
      '<path d="M27 18l2.6 6.4L36 27l-6.4 2.6L27 36l-2.6-6.4L18 27l6.4-2.6z" ' + W + "/>" +
      '<path d="M82 36l1.7 4.3L88 42l-4.3 1.7L82 48l-1.7-4.3L76 42l4.3-1.7z" ' + W + "/>",
    sappari:
      '<path d="M42 14S22 39 22 56a20 20 0 0 0 40 0C62 39 42 14 42 14z" ' + SOFT + "/>" +
      '<path d="M32 58a10 10 0 0 0 10 10"/>' +
      '<path d="M66 40h15a5.5 5.5 0 1 0-5.5-5.5M70 56h13a5.5 5.5 0 1 1-5.5 5.5"/>',
    machiaruki:
      '<path d="M50 8v9"/>' +
      '<rect x="37" y="17" width="26" height="8" rx="2.5" ' + W + "/>" +
      '<ellipse cx="50" cy="50" rx="25" ry="25" ' + SOFT + "/>" +
      '<path d="M27 41h46M25.5 50h49M27 59h46"/>' +
      '<rect x="37" y="75" width="26" height="8" rx="2.5" ' + W + "/>" +
      '<path d="M46 83l-2 9M54 83l2 9"/>',
    mypace:
      '<path d="M16 86C30 66 66 62 84 18" stroke-dasharray="1 9"/>' +
      foot(36, 64, -40) + foot(64, 42, -20) +
      '<circle cx="80" cy="74" r="9" ' + SOFT + '/><path d="M80 69v5l3 2" stroke-width="3"/>'
  };

  Poka.typeArt = function (id) {
    return '<svg class="type-art" viewBox="0 0 100 100" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (TYPE_ART[id] || "") + "</svg>";
  };

  // 画像保存（canvas）用：SVG文字列そのものを返す
  Poka.typeArtSvgString = function (id) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="400" height="400" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">' + (TYPE_ART[id] || "") + "</svg>";
  };

  // ---- 銭湯の「写真風」イラスト ----
  var uid = 0;
  Poka.sentoScene = function (sento, opts) {
    opts = opts || {};
    var s = sento.scene, id = "sc" + (++uid);
    var houses =
      '<path d="M0 170h40v-30l20-16 20 16v30h30v-40h36v40" fill="rgba(90,58,34,.10)"/>' +
      '<path d="M300 170v-36l22-18 22 18v36h26v-28h30v28" fill="rgba(90,58,34,.10)"/>';
    var building = "";
    if (s.style === "miya") {
      building =
        '<rect x="112" y="118" width="176" height="84" fill="' + s.wall + '"/>' +
        '<path d="M90 126C128 120 152 74 200 62c48 12 72 58 110 64z" fill="' + s.roof + '"/>' +
        '<path d="M176 100c8-10 40-10 48 0" stroke="rgba(255,255,255,.55)" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<path d="M86 128h228" stroke="' + s.roof + '" stroke-width="6" stroke-linecap="round"/>';
    } else if (s.style === "modern") {
      building =
        '<rect x="108" y="100" width="184" height="102" rx="4" fill="' + s.wall + '"/>' +
        '<rect x="100" y="90" width="200" height="14" rx="4" fill="' + s.roof + '"/>' +
        '<rect x="124" y="114" width="48" height="22" rx="3" fill="rgba(80,130,170,.35)"/>' +
        '<rect x="228" y="114" width="48" height="22" rx="3" fill="rgba(80,130,170,.35)"/>' +
        '<path d="M108 142h184" stroke="rgba(90,58,34,.12)" stroke-width="2"/>';
    } else if (s.style === "art") {
      building =
        '<rect x="108" y="104" width="184" height="98" rx="4" fill="' + s.wall + '"/>' +
        '<path d="M104 106l23-26 23 26 23-26 23 26 23-26 23 26 23-26 23 26z" fill="' + s.roof + '"/>' +
        '<circle cx="134" cy="128" r="10" fill="#F2B84B"/><circle cx="266" cy="126" r="12" fill="#7F8FD3"/>' +
        '<path d="M244 150l14-10 14 10" stroke="#D7607E" stroke-width="4" fill="none" stroke-linecap="round"/>';
    } else {
      building =
        '<rect x="108" y="108" width="184" height="94" fill="' + s.wall + '"/>' +
        '<path d="M100 96h200v12H100z" fill="' + s.roof + '"/>' +
        '<path d="M108 108h184l-10 18H118z" fill="#fff"/>' +
        '<path d="M120 108l-6 18M146 108v18M172 108v18M198 108v18M224 108v18M250 108v18M276 108l6 18" stroke="' + s.roof + '" stroke-width="9"/>' +
        '<rect x="30" y="140" width="64" height="62" fill="rgba(255,255,255,.75)"/><path d="M26 138h72" stroke="#B5793A" stroke-width="6"/>' +
        '<rect x="306" y="140" width="64" height="62" fill="rgba(255,255,255,.75)"/><path d="M302 138h72" stroke="#2EA58B" stroke-width="6"/>';
    }
    var noren =
      '<rect x="176" y="164" width="48" height="38" fill="#3B2615"/>' +
      '<path d="M166 146h68" stroke="#5A3A22" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M168 148h20v24h-20zM190 148h20v24h-20zM212 148h20v24h-20z" fill="' + s.noren + '"/>' +
      '<text x="200" y="167" text-anchor="middle" font-size="17" font-weight="800" fill="#fff" font-family="Zen Maru Gothic, Hiragino Maru Gothic ProN, sans-serif">ゆ</text>';
    var chimney =
      '<rect x="318" y="34" width="16" height="140" fill="#8A6A50"/>' +
      '<rect x="318" y="44" width="16" height="6" fill="#fff" opacity=".7"/>' +
      '<g class="scene-steam" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".9">' +
      '<path d="M326 28c-6-6 6-10 0-16s6-10 0-16"/><path d="M340 24c-5-5 5-8 0-13"/></g>';
    var label = opts.noLabel ? "" :
      '<g><rect x="12" y="12" width="78" height="24" rx="12" fill="rgba(255,255,255,.85)"/>' +
      '<text x="51" y="28.5" text-anchor="middle" font-size="12" font-weight="700" fill="#5A3A22" font-family="Zen Maru Gothic, Hiragino Maru Gothic ProN, sans-serif">イメージ図</text></g>';
    return '<svg class="sento-scene" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" role="img" aria-label="' + sento.name + 'のイメージイラスト（実際の写真ではありません）">' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + s.sky[0] + '"/><stop offset="1" stop-color="' + s.sky[1] + '"/></linearGradient></defs>' +
      '<rect width="400" height="240" fill="url(#' + id + ')"/>' +
      '<circle cx="70" cy="64" r="26" fill="rgba(255,255,255,.65)"/>' +
      houses + chimney + building + noren +
      '<rect y="200" width="400" height="40" fill="#E8D5B5"/><path d="M0 204h400" stroke="rgba(90,58,34,.15)" stroke-width="3"/>' +
      label + "</svg>";
  };

  // ---- 周辺スポットの位置関係イメージ図（実際の地図ではありません） ----
  Poka.mapDiagram = function (sento, recs) {
    var cx = 180, cy = 132, rx = 128, ry = 86, n = recs.length;
    var roads =
      '<path d="M0 70C90 60 120 110 200 100S320 40 360 52" stroke="#fff" stroke-width="14" fill="none"/>' +
      '<path d="M60 260C80 180 150 160 170 120S210 20 230 0" stroke="#fff" stroke-width="12" fill="none"/>' +
      '<path d="M0 200C100 190 240 230 360 196" stroke="#fff" stroke-width="10" fill="none"/>';
    var nodes = recs.map(function (r, i) {
      var a = -Math.PI / 2 + (i / n) * Math.PI * 2 + 0.35;
      var x = cx + rx * Math.cos(a), y = cy + ry * Math.sin(a);
      var top = i < 3;
      return '<line x1="' + cx + '" y1="' + cy + '" x2="' + x.toFixed(1) + '" y2="' + y.toFixed(1) + '" stroke="#C9A27A" stroke-width="2" stroke-dasharray="4 6"/>' +
        '<g class="map-node" data-spot="' + r.spot.id + '" transform="translate(' + x.toFixed(1) + " " + y.toFixed(1) + ')">' +
        '<circle r="15" fill="' + (top ? "#F08A3C" : "#fff") + '" stroke="#F08A3C" stroke-width="2.5"/>' +
        '<text y="5" text-anchor="middle" font-size="13" font-weight="800" fill="' + (top ? "#fff" : "#E06A1F") + '">' + (i + 1) + "</text>" +
        '<text y="31" text-anchor="middle" font-size="11.5" font-weight="700" fill="#5A3A22" paint-order="stroke" stroke="#FFF8EC" stroke-width="4">' + r.spot.name + "</text></g>";
    }).join("");
    return '<svg class="map-diagram" viewBox="0 0 360 264" role="img" aria-label="' + sento.name + 'と周辺スポットの位置関係のイメージ図（実際の地図ではありません）">' +
      '<rect width="360" height="264" rx="18" fill="#F6E9D3"/>' + roads + nodes +
      '<g transform="translate(' + cx + " " + cy + ')"><circle r="26" fill="#5A3A22"/>' +
      '<text y="-2" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">ゆ</text>' +
      '<text y="13" text-anchor="middle" font-size="9.5" font-weight="700" fill="#FFE2C4">' + sento.name + "</text></g></svg>";
  };
})();

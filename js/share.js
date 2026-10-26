/*
 * シェア・コピー・画像保存
 * どれかが失敗しても、ほかの機能には影響しないようにしています。
 */
window.Poka = window.Poka || {};

Poka.share = (function () {
  var FONT = '"Zen Maru Gothic", "Hiragino Maru Gothic ProN", "Hiragino Sans", "Yu Gothic", sans-serif';

  function buildText(res) {
    var top = res.ranking[0];
    return "わたしのポカポカタイプは「" + res.type.name + "」！\n" +
      "“" + res.type.catch + "”\n" +
      res.type.feature + "\n" +
      "おすすめ銭湯1位：" + top.sento.name + "（おすすめスコア " + top.score + "点）\n" +
      "#ポカポカ診断 #大田区の銭湯\n" +
      "※中間発表用デモ・施設情報は仮データです";
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return legacyCopy(text); });
    }
    return Promise.resolve(legacyCopy(text));
  }

  function legacyCopy(text) {
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch (e) {
      return false;
    }
  }

  // 共有機能があれば使い、なければテキストをコピー
  function shareResult(res) {
    var text = buildText(res);
    if (navigator.share) {
      return navigator.share({ title: "ポカポカ診断", text: text })
        .then(function () { return "shared"; })
        .catch(function (err) {
          if (err && err.name === "AbortError") return "cancelled";
          return copyText(text).then(function (ok) { return ok ? "copied" : "failed"; });
        });
    }
    return copyText(text).then(function (ok) { return ok ? "copied" : "failed"; });
  }

  function wrap(ctx, text, maxWidth) {
    var lines = [], line = "";
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (ctx.measureText(line + ch).width > maxWidth && line) {
        lines.push(line);
        line = ch;
      } else {
        line += ch;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function loadArt(typeId) {
    return new Promise(function (resolve) {
      try {
        var img = new Image();
        var timer = setTimeout(function () { resolve(null); }, 1500);
        img.onload = function () { clearTimeout(timer); resolve(img); };
        img.onerror = function () { clearTimeout(timer); resolve(null); };
        img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(Poka.typeArtSvgString(typeId));
      } catch (e) {
        resolve(null);
      }
    });
  }

  function drawCard(res, art) {
    var t = res.type, c = t.color, top = res.ranking[0];
    var W = 1080, H = 1350;
    var cv = document.createElement("canvas");
    cv.width = W; cv.height = H;
    var ctx = cv.getContext("2d");

    var bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, c.light);
    bg.addColorStop(1, "#FFF8EC");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // 湯けむりの水玉
    ctx.fillStyle = "rgba(255,255,255,.6)";
    [[120, 160, 60], [960, 260, 90], [900, 1180, 70], [160, 1120, 40]].forEach(function (b) {
      ctx.beginPath(); ctx.arc(b[0], b[1], b[2], 0, Math.PI * 2); ctx.fill();
    });

    ctx.save();
    ctx.shadowColor = "rgba(90,58,34,.15)";
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 12;
    roundRect(ctx, 80, 110, W - 160, H - 220, 56);
    ctx.fillStyle = "#FFFDF7";
    ctx.fill();
    ctx.restore();

    ctx.textAlign = "center";
    ctx.fillStyle = "#E06A1F";
    ctx.font = "800 44px " + FONT;
    ctx.fillText("ポカポカ診断", W / 2, 200);

    // タイプのバッジ
    ctx.fillStyle = c.main;
    ctx.beginPath(); ctx.arc(W / 2, 390, 140, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.6)";
    ctx.lineWidth = 10;
    ctx.beginPath(); ctx.arc(W / 2, 390, 124, 0, Math.PI * 2); ctx.stroke();
    if (art) ctx.drawImage(art, W / 2 - 100, 290, 200, 200);

    ctx.fillStyle = "#8A6A50";
    ctx.font = "700 38px " + FONT;
    ctx.fillText("わたしのポカポカタイプは", W / 2, 620);

    ctx.fillStyle = c.deep;
    ctx.font = "900 92px " + FONT;
    ctx.fillText(t.name, W / 2, 730);

    ctx.fillStyle = "#5A3A22";
    ctx.font = "700 42px " + FONT;
    var y = 820;
    wrap(ctx, "「" + t.catch + "」", W - 280).forEach(function (l) { ctx.fillText(l, W / 2, y); y += 60; });

    ctx.fillStyle = "#8A6A50";
    ctx.font = "500 34px " + FONT;
    y += 10;
    wrap(ctx, t.feature, W - 300).forEach(function (l) { ctx.fillText(l, W / 2, y); y += 50; });

    roundRect(ctx, 200, 1010, W - 400, 96, 48);
    ctx.fillStyle = c.light;
    ctx.fill();
    ctx.fillStyle = c.deep;
    ctx.font = "800 38px " + FONT;
    ctx.fillText("おすすめ銭湯1位：" + top.sento.name + "（" + top.score + "点）", W / 2, 1072);

    ctx.fillStyle = "#E06A1F";
    ctx.font = "700 32px " + FONT;
    ctx.fillText("#ポカポカ診断  #大田区の銭湯", W / 2, 1160);

    ctx.fillStyle = "#A08870";
    ctx.font = "500 26px " + FONT;
    ctx.fillText("※中間発表用デモ・施設情報は仮データです", W / 2, 1208);
    return cv;
  }

  function saveImage(res) {
    var ready = (document.fonts && document.fonts.ready) ? document.fonts.ready.catch(function () {}) : Promise.resolve();
    return ready
      .then(function () { return loadArt(res.type.icon); })
      .then(function (art) {
        var cv = drawCard(res, art);
        var url = cv.toDataURL("image/png");
        var a = document.createElement("a");
        a.href = url;
        a.download = "pokapoka-" + res.type.id + ".png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return true;
      })
      .catch(function (e) {
        console.warn("画像の保存に失敗しました", e);
        return false;
      });
  }

  return { buildText: buildText, shareResult: shareResult, copyText: copyText, saveImage: saveImage };
})();

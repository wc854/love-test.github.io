/* 恋爱人格图鉴 · 交互与计分 */
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const MAX_RAW = { drive: 14, express: 13, attach: 15, conflict: 10 };
  const STAGES = ['心动初见', '心动初见', '心动初见', '心动初见', '亲密试探', '亲密试探', '亲密试探', '亲密试探', '关系深水区', '关系深水区', '关系深水区', '关系深水区'];

  let state = { index: 0, answers: [], locked: false, result: null };

  function show(id) {
    document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('active', s.id === id));
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function toast(msg) {
    const el = $('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove('show'), 2600);
  }

  /* ---------- 答题 ---------- */
  function startTest() {
    state = { index: 0, answers: new Array(QUESTIONS.length).fill(null), locked: false, result: null };
    show('quiz');
    renderQuestion();
  }

  function renderQuestion() {
    const i = state.index;
    const q = QUESTIONS[i];
    state.locked = false;
    $('counter').textContent = `Q ${String(i + 1).padStart(2, '0')} / ${QUESTIONS.length}`;
    $('stageName').textContent = STAGES[i];
    $('progressFill').style.width = `${((i + 1) / QUESTIONS.length) * 100}%`;
    $('questionIndex').textContent = String(i + 1).padStart(2, '0');
    $('questionTitle').textContent = q.title;
    $('backBtn').disabled = i === 0;

    const box = $('options');
    box.innerHTML = '';
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option' + (state.answers[i] === idx ? ' selected' : '');
      btn.innerHTML = `<span class="option-key">${'ABCD'[idx]}</span><span>${opt.text}</span>`;
      btn.addEventListener('click', () => choose(idx));
      box.appendChild(btn);
    });

    const card = $('questionCard');
    card.style.animation = 'none';
    void card.offsetWidth;
    card.style.animation = 'screenIn .45s cubic-bezier(.2,.7,.2,1) both';
  }

  function choose(idx) {
    if (state.locked) return;
    state.locked = true;
    state.answers[state.index] = idx;
    document.querySelectorAll('#options .option').forEach((el, i) => el.classList.toggle('selected', i === idx));
    setTimeout(() => {
      if (state.index < QUESTIONS.length - 1) {
        state.index++;
        renderQuestion();
      } else {
        finish();
      }
    }, 340);
  }

  function goBack() {
    if (state.index === 0 || state.locked) return;
    state.index--;
    renderQuestion();
  }

  /* ---------- 计分 ---------- */
  function score() {
    const raw = { drive: 0, express: 0, attach: 0, conflict: 0 };
    state.answers.forEach((choice, qi) => {
      const w = QUESTIONS[qi].options[choice].w;
      Object.keys(w).forEach((k) => { raw[k] += w[k]; });
    });
    const norm = {};
    Object.keys(raw).forEach((k) => {
      norm[k] = Math.max(-3, Math.min(3, Math.round((raw[k] / MAX_RAW[k]) * 3)));
    });
    const vec = [norm.drive, norm.express, norm.attach, norm.conflict];
    const keys = Object.keys(raw);
    const pattern = keys.map((k) => (raw[k] >= 0 ? '+' : '-')).join('');
    let best = ARCHETYPES.find((a) => a.pattern === pattern);
    if (!best) {
      let min = Infinity;
      ARCHETYPES.forEach((a) => {
        const d = a.vector.reduce((sum, v, i) => sum + Math.pow(v - vec[i], 2), 0);
        if (d < min) { min = d; best = a; }
      });
    }
    const password = Object.keys(POLE_CHAR).map((k) => (raw[k] >= 0 ? POLE_CHAR[k].plus : POLE_CHAR[k].minus)).join('');
    return { archetype: best, raw, norm, vec, password };
  }

  function finish() {
    state.result = score();
    renderResult();
    show('result');
  }

  /* ---------- 结果 ---------- */
  function renderResult() {
    const a = state.result.archetype;
    $('shareCard').style.setProperty('--accent', a.accent);
    $('shareCard').style.setProperty('--soft', a.soft);
    $('personaCode').textContent = a.code;
    $('personaPassword').textContent = `人格密码 · ${state.result.password}`;
    $('personaOrnament').textContent = '✦';
    $('personaName').textContent = a.name;
    $('personaEn').textContent = a.en;
    $('personaTagline').textContent = a.tagline;
    $('personaQuote').textContent = `「${a.quote}」`;
    $('personaRarity').textContent = `仅 ${a.rarity}% 的人和你同类`;
    $('personaTags').innerHTML = a.tags.map((t) => `<span>${t}</span>`).join('');
    $('signalText').textContent = a.signal;
    $('highlightText').textContent = a.highlight;
    $('trapText').textContent = a.trap;
    $('prescriptionText').textContent = a.prescription;
    $('matchName').textContent = a.match;

    const list = $('dimensionList');
    list.innerHTML = '';
    Object.keys(DIMENSIONS).forEach((k) => {
      const d = DIMENSIONS[k];
      const v = state.result.norm[k];
      const pct = Math.round(((v + 3) / 6) * 100);
      const row = document.createElement('div');
      row.className = 'dim-row';
      const leftActive = v < 0;
      row.innerHTML = `
        <span class="dim-pole left ${leftActive ? 'dim-active' : ''}">${d.minus}</span>
        <span class="dim-label">${d.name}</span>
        <span class="dim-pole ${!leftActive ? 'dim-active' : ''}">${d.plus}</span>
        <div class="dim-bar"><i style="width:0%"></i><b style="left:0%"></b></div>`;
      list.appendChild(row);
      requestAnimationFrame(() => {
        row.querySelector('i').style.width = pct + '%';
        row.querySelector('b').style.left = pct + '%';
      });
    });

    renderGallery();
  }

  function renderGallery() {
    const currentId = state.result ? state.result.archetype.id : null;
    $('galleryGrid').innerHTML = ARCHETYPES.map((a) => `
      <div class="g-card ${a.id === currentId ? 'current' : ''}" style="--accent:${a.accent};--soft:${a.soft}">
        <span class="g-code">${a.code}</span>
        <h5>${a.name}</h5>
        <p>${a.tagline}</p>
        <div class="g-mark">${a.id === currentId ? '← 这是你' : a.tags[0]}</div>
      </div>`).join('');
  }

  /* ---------- 分享文案 ---------- */
  function shareText() {
    const r = state.result;
    const a = r.archetype;
    return [
      `我的恋爱人格是【${a.name}】${a.code}`,
      a.tagline,
      '',
      `人格密码：${r.password}`,
      `标签：${a.tags.join(' / ')}`,
      `同频人格：${a.match}`,
      `仅 ${a.rarity}% 的人和我同类`,
      '',
      `「${a.quote}」`,
      '',
      '来心动实验室，测测你的恋爱原型。'
    ].join('\n');
  }

  async function copyShare() {
    const text = shareText();
    try {
      await navigator.clipboard.writeText(text);
      toast('文案已复制，去分享吧');
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); toast('文案已复制，去分享吧'); }
      catch (err) { toast('复制失败，请手动选择文案'); }
      document.body.removeChild(ta);
    }
  }

  /* ---------- 海报绘制 ---------- */
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
    let line = '';
    let lines = 0;
    for (const ch of text) {
      const test = line + ch;
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, y);
        y += lineHeight;
        lines++;
        line = ch;
        if (maxLines && lines >= maxLines) return y;
      } else {
        line = test;
      }
    }
    if (line) ctx.fillText(line, x, y);
    return y + lineHeight;
  }

  function spacedText(ctx, text, x, y, spacing) {
    let cx = x;
    for (const ch of text) {
      ctx.fillText(ch, cx, y);
      cx += ctx.measureText(ch).width + spacing;
    }
  }

  function drawPoster() {
    const r = state.result;
    const a = r.archetype;
    const W = 1080, H = 1440;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    const serif = '"Noto Serif SC","Songti SC","STSong","SimSun",serif';
    const sans = '"PingFang SC","Microsoft YaHei",sans-serif';

    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#FFFDFB');
    bg.addColorStop(0.55, '#FFF8F5');
    bg.addColorStop(1, a.soft);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = 'rgba(255,255,255,.9)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(940, 118, 210, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(940, 118, 266, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(60, 1335, 190, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();

    ctx.fillStyle = a.accent;
    ctx.globalAlpha = 0.07;
    ctx.beginPath(); ctx.arc(150, 300, 230, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = a.accent;
    ctx.font = `700 24px ${sans}`;
    spacedText(ctx, 'HEART LAB', 84, 100, 6);
    ctx.font = `20px ${sans}`;
    ctx.fillStyle = '#8B7E86';
    ctx.fillText('恋爱人格图鉴 · VOL.01', 84, 140);
    ctx.textAlign = 'right';
    ctx.font = `700 22px ${sans}`;
    ctx.fillStyle = a.accent;
    ctx.fillText(a.code, W - 84, 100);
    ctx.textAlign = 'left';

    ctx.fillStyle = '#9C9098';
    ctx.font = `20px ${sans}`;
    ctx.fillText('MY LOVE ARCHETYPE', 84, 238);
    ctx.fillStyle = '#2E2530';
    ctx.font = `700 108px ${serif}`;
    ctx.fillText(a.name, 80, 366);
    ctx.fillStyle = '#A2959D';
    ctx.font = `22px ${sans}`;
    spacedText(ctx, a.en, 84, 416, 8);

    ctx.fillStyle = '#5A505A';
    ctx.font = `30px ${serif}`;
    wrapText(ctx, a.tagline, 84, 486, W - 168, 48, 2);

    let tx = 84;
    ctx.font = `600 21px ${sans}`;
    a.tags.forEach((tag) => {
      const tw = ctx.measureText(tag).width + 42;
      ctx.fillStyle = 'rgba(255,255,255,.8)';
      roundRect(ctx, tx, 552, tw, 48, 24); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.95)'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = a.accent;
      ctx.fillText(tag, tx + 21, 583);
      tx += tw + 12;
    });

    ctx.fillStyle = 'rgba(46,37,48,.12)';
    ctx.fillRect(84, 648, W - 168, 2);
    ctx.fillStyle = '#9C9098';
    ctx.font = `19px ${sans}`;
    ctx.fillText('心动四维 / FOUR DIMENSIONS', 84, 692);

    const dimKeys = Object.keys(DIMENSIONS);
    dimKeys.forEach((k, i) => {
      const y = 754 + i * 84;
      const v = state.result.norm[k];
      const pct = (v + 3) / 6;
      ctx.font = `600 22px ${sans}`;
      ctx.fillStyle = '#2E2530';
      ctx.fillText(DIMENSIONS[k].name, 84, y);
      ctx.font = `18px ${sans}`;
      ctx.fillStyle = v < 0 ? a.accent : '#A2959D';
      ctx.textAlign = 'right';
      ctx.fillText(DIMENSIONS[k].minus, 828, y);
      ctx.textAlign = 'left';
      ctx.fillStyle = v >= 0 ? a.accent : '#A2959D';
      ctx.fillText(DIMENSIONS[k].plus, 858, y);
      ctx.fillStyle = 'rgba(255,255,255,.85)';
      roundRect(ctx, 84, y + 18, W - 168, 10, 5); ctx.fill();
      const grad = ctx.createLinearGradient(84, 0, W - 84, 0);
      grad.addColorStop(0, '#B8A7CA'); grad.addColorStop(1, a.accent);
      ctx.fillStyle = grad;
      roundRect(ctx, 84, y + 18, Math.max(10, (W - 168) * pct), 10, 5); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = a.accent; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(84 + (W - 168) * pct, y + 23, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    });

    ctx.fillStyle = 'rgba(255,255,255,.75)';
    roundRect(ctx, 84, 1100, W - 168, 132, 20); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.95)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = '#554A55';
    ctx.font = `30px ${serif}`;
    ctx.textAlign = 'center';
    ctx.fillText(`「${a.quote}」`, W / 2, 1155);
    ctx.fillStyle = '#938791';
    ctx.font = `19px ${sans}`;
    ctx.fillText(`人格密码 ${r.password}  ·  同频 ${a.match}`, W / 2, 1198);
    ctx.textAlign = 'left';

    ctx.font = `700 24px ${sans}`;
    ctx.fillStyle = a.accent;
    ctx.fillText(`仅 ${a.rarity}% 的人和你同类`, 84, 1304);
    ctx.font = `19px ${sans}`;
    ctx.fillStyle = '#9C9098';
    ctx.fillText('适合分享到小红书 / 朋友圈 / 微博', 84, 1342);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#B0A5AC';
    ctx.font = `18px ${sans}`;
    ctx.fillText('测测你的恋爱原型 → 心动实验室', W - 84, 1342);
    ctx.textAlign = 'left';

    return canvas;
  }

  function savePoster() {
    if (!state.result) return;
    try {
      const canvas = drawPoster();
      const name = state.result.archetype.name;
      if (canvas.toBlob) {
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url; link.download = `恋爱人格-${name}.png`;
          document.body.appendChild(link); link.click(); document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(url), 1000);
          toast('海报已保存，去分享吧');
        }, 'image/png');
      } else {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `恋爱人格-${name}.png`;
        link.click();
        toast('海报已保存，去分享吧');
      }
    } catch (e) {
      toast('海报生成失败，请试试复制文案');
    }
  }

  /* ---------- 事件 ---------- */
  $('startBtn').addEventListener('click', startTest);
  $('retestBtn').addEventListener('click', startTest);
  $('backBtn').addEventListener('click', goBack);
  $('copyBtn').addEventListener('click', copyShare);
  $('saveBtn').addEventListener('click', savePoster);
  $('quizBrand').addEventListener('click', (e) => { e.preventDefault(); show('intro'); });
  $('quitBtn').addEventListener('click', () => {
    if (window.confirm('确定退出测试吗？当前进度会清空。')) show('intro');
  });
  document.addEventListener('keydown', (e) => {
    if (!$('quiz').classList.contains('active')) return;
    if (['1', '2', '3', '4'].includes(e.key)) choose(Number(e.key) - 1);
    if (e.key === 'Backspace') goBack();
  });
})();

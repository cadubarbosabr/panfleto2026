// ==========================================================================
// EXPORT & SHARE MODULE - MODERN DIGITAL FLYER & SOCIAL MEDIA
// ==========================================================================

// Official known handles dictionary for Brazilian political figures
export const CANDIDATE_HANDLES = {
  // Presidentes
  'LULA': { x: '@LulaOficial', ig: '@lulaoficial' },
  'RENAN SANTOS': { x: '@RenanSantosMBL', ig: '@renansantosmbl' },
  'CIRO GOMES': { x: '@cirogomes', ig: '@cirogomes' },
  'SIMONE TEBET': { x: '@simonetebetbr', ig: '@simonetebetbr' },
  'LEO PERICLES': { x: '@LeoPericlesUP', ig: '@leopericlesup' },
  'LÉO PÉRICLES': { x: '@LeoPericlesUP', ig: '@leopericlesup' },
  'SOFIA MANZANO': { x: '@ManzanoSofia', ig: '@sofiamanzanopcb' },
  'VERA': { x: '@verapstu', ig: '@verapstu' },
  'VERA LÚCIA': { x: '@verapstu', ig: '@verapstu' },
  'EYMAEL': { x: '@eymaeloficial', ig: '@eymaeloficial' },
  'FELIPE D AVILA': { x: '@lfdavilaoficial', ig: '@luizfelipegd' },
  'HERTZ DIAS': { x: '@HertzDiasPSTU', ig: '@hertzdias' },

  // Governadores e Líderes Estaduais
  'TARCISIO': { x: '@tarcisiogdf', ig: '@tarcisiogdf' },
  'TARCÍSIO': { x: '@tarcisiogdf', ig: '@tarcisiogdf' },
  'TARCÍSIO DE FREITAS': { x: '@tarcisiogdf', ig: '@tarcisiogdf' },
  'FERNANDO HADDAD': { x: '@Haddad_Fernando', ig: '@fernandohaddadoficial' },
  'HADDAD': { x: '@Haddad_Fernando', ig: '@fernandohaddadoficial' },
  'ROMEU ZEMA': { x: '@RomeuZema', ig: '@romeuzemaoficial' },
  'ZEMA': { x: '@RomeuZema', ig: '@romeuzemaoficial' },
  'EDUARDO LEITE': { x: '@EduardoLeite_', ig: '@eduardoleite45' },
  'RATINHO JUNIOR': { x: '@ratinho_jr', ig: '@ratinho_junior' },
  'CLAUDIO CASTRO': { x: '@claudiocastroRJ', ig: '@claudiocastrorj' },
  'RODRIGO GARCIA': { x: '@rodrigogarcia_', ig: '@rodrigogarciaoficial' },
  'MARCIO FRANCA': { x: '@marciofrancasp', ig: '@marciofrancasp' },
  'MÁRCIO FRANÇA': { x: '@marciofrancasp', ig: '@marciofrancasp' },
  'HELDER BARBALHO': { x: '@helderbarbalho', ig: '@helderbarbalho' },
  'RAQUEL LYRA': { x: '@raquellyra', ig: '@raquellyraoficial' },
  'JERÔNIMO RODRIGUES': { x: '@jeronimoba13', ig: '@jeronimorodriguesba' },
  'ACM NETO': { x: '@acmneto_', ig: '@acmnetooficial' },

  // Senadores e Deputados
  'MARCOS PONTES': { x: '@Astro_Pontes', ig: '@astropontes' },
  'ASTRONAUTA MARCOS PONTES': { x: '@Astro_Pontes', ig: '@astropontes' },
  'SERGIO MORO': { x: '@SF_Moro', ig: '@sf_moro' },
  'MORO': { x: '@SF_Moro', ig: '@sf_moro' },
  'ROMARIO': { x: '@RomarioOnze', ig: '@romariofaria' },
  'ROMÁRIO': { x: '@RomarioOnze', ig: '@romariofaria' },
  'CLEITINHO': { x: '@cleitinhotmj', ig: '@cleitinhotmj' },
  'MARCOS DO VAL': { x: '@marcosdoval', ig: '@marcosdoval' },
  'FLAVIO BOLSONARO': { x: '@FlavioBolsonaro', ig: '@flaviobolsonaro' },
  'FLÁVIO BOLSONARO': { x: '@FlavioBolsonaro', ig: '@flaviobolsonaro' },
  'RANDOLFE RODRIGUES': { x: '@randolfeap', ig: '@randolferodrigues' },
  'TEREZA CRISTINA': { x: '@TerezaCrisMS', ig: '@terezacristinams' },
  'HAMILTON MOURAO': { x: '@GeneralMourao', ig: '@generalmourao' },
  'GENERAL MOURÃO': { x: '@GeneralMourao', ig: '@generalmourao' },
  'NIKOLAS FERREIRA': { x: '@nikolas_dm', ig: '@nikolasferreiradm' },
  'GUILHERME BOULOS': { x: '@GuilhermeBoulos', ig: '@guilhermeboulos.oficial' },
  'BOULOS': { x: '@GuilhermeBoulos', ig: '@guilhermeboulos.oficial' },
  'TABATA AMARAL': { x: '@tabataamaralsp', ig: '@tabataamaralsp' },
  'KIM KATAGUIRI': { x: '@KimKataguiri', ig: '@kimkataguiri' },
  'CARLA ZAMBELLI': { x: '@Zambelli2210', ig: '@carlazambelli' },
  'EDUARDO BOLSONARO': { x: '@BolsonaroSP', ig: '@bolsonarosp' },
  'MARINA SILVA': { x: '@MarinaSilva', ig: '@marinasilvaoficial' },
  'ANDRE JANONES': { x: '@AndreJanonesAdv', ig: '@andrejanones' },
  'RICARDO SALLES': { x: '@rsallesmma', ig: '@ricardosalles' }
};

/**
 * Resolves candidate social handle or falls back to candidate name
 */
export function getCandidateHandle(cand, network = 'x') {
  if (!cand) return '';
  if (cand.handle) return cand.handle;

  const key = cand.nm ? cand.nm.toUpperCase().trim() : '';
  const keyFull = cand.nmc ? cand.nmc.toUpperCase().trim() : '';

  if (CANDIDATE_HANDLES[key]) {
    return CANDIDATE_HANDLES[key][network] || CANDIDATE_HANDLES[key].x || cand.nm;
  }
  if (CANDIDATE_HANDLES[keyFull]) {
    return CANDIDATE_HANDLES[keyFull][network] || CANDIDATE_HANDLES[keyFull].x || cand.nm;
  }

  // Fallback: repeats candidate official name as requested
  return cand.nm || cand.nmc || '';
}

/**
 * Returns current site URL or production Vercel fallback
 */
export function getAppSiteUrl(short = false) {
  if (typeof window !== 'undefined' && window.location) {
    const host = window.location.host;
    if (host && !host.includes('localhost') && !host.includes('127.0.0.1') && host !== '') {
      return short ? host : window.location.origin;
    }
  }
  return short ? 'panfletos2026.vercel.app' : 'https://panfletos2026.vercel.app';
}

function getShortCandidateName(nm) {
  if (!nm) return '';
  const clean = nm.trim();
  if (clean.length <= 11) return clean;
  const parts = clean.split(/\s+/);
  return parts[0];
}

/**
/**
 * Suggests a simple, clear post text with 1 line per candidate:
 * Cargo | Nome | Numero
 * ...
 * 👉 panfletos2026.vercel.app
 */
export function generateSocialPostText(stateUf, selections) {
  const siteDomain = getAppSiteUrl(true);
  const cta = `👉 ${siteDomain}`;

  const cands = [
    { cargo: 'Pres', sel: selections.presidente },
    { cargo: 'Gov', sel: selections.governador },
    { cargo: 'Sen', sel: selections.senador1 },
    { cargo: 'Sen2', sel: selections.senador2 },
    { cargo: 'Dep', sel: selections.deputadoFederal },
    { cargo: stateUf === 'DF' ? 'Dist' : 'Est', sel: selections.deputadoEstadual }
  ].filter(c => c.sel && (c.sel.nr || c.sel.tipo));

  if (cands.length === 0) {
    return `Monte seu panfleto eleitoral (${stateUf})\n\n${cta}`;
  }

  const lines = cands.map(c => {
    if (c.sel.tipo === 'branco') return `${c.cargo} | Branco`;
    if (c.sel.tipo === 'nulo') return `${c.cargo} | Nulo`;
    const name = (c.sel.nm || '').trim();
    return `${c.cargo} | ${name} | ${c.sel.nr}`;
  });

  return `${lines.join('\n')}\n\n${cta}`;
}

/**
 * Builds direct sharing URLs
 */
export function getXPostUrl(text) {
  return `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

export function getWhatsAppShareUrl(text) {
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}

export function getFacebookShareUrl(text) {
  const siteUrl = getAppSiteUrl(false);
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}&quote=${encodeURIComponent(text)}`;
}

export function formatWhatsAppMessage(stateName, stateUf, selections) {
  const dateStr = "04 de Outubro de 2026";
  const siteUrl = getAppSiteUrl(false);

  let text = `🗳️ *MINHA COLA ELEITORAL 2026* 🇧🇷\n`;
  text += `📍 *Estado:* ${stateName} (${stateUf})\n`;
  text += `📅 *Eleições:* ${dateStr}\n`;
  text += `━━━━━━━━━━━━━━━━━━━━\n\n`;

  const cargos = [
    { key: 'deputadoFederal', label: '1️⃣ *Deputado Federal:*' },
    { key: 'deputadoEstadual', label: stateUf === 'DF' ? '2️⃣ *Deputado Distrital:*' : '2️⃣ *Deputado Estadual:*' },
    { key: 'senador1', label: '3️⃣ *Senador (1ª Vaga):*' },
    { key: 'senador2', label: '4️⃣ *Senador (2ª Vaga):*' },
    { key: 'governador', label: '5️⃣ *Governador:*' },
    { key: 'presidente', label: '6️⃣ *Presidente da República:*' }
  ];

  for (const c of cargos) {
    const sel = selections[c.key];
    if (!sel || !sel.nr) {
      text += `${c.label} _(Não definido)_\n\n`;
    } else if (sel.tipo === 'branco') {
      text += `${c.label} ▫️ _VOTO EM BRANCO_\n\n`;
    } else if (sel.tipo === 'nulo') {
      text += `${c.label} ❌ _VOTO NULO_\n\n`;
    } else {
      const party = sel.sg ? ` (${sel.sg})` : '';
      text += `${c.label} *${sel.nr}* - ${sel.nm}${party}\n`;
      if (sel.vices && sel.vices.length > 0) {
        text += `   _Vice: ${sel.vices[0].nm}_\n`;
      } else if (sel.suplentes && sel.suplentes.length > 0) {
        text += `   _1º Suplente: ${sel.suplentes[0].nm}_\n`;
      }
      text += `\n`;
    }
  }

  text += `━━━━━━━━━━━━━━━━━━━━\n`;
  text += `📱 *Monte seu panfleto online:* ${siteUrl}\n`;
  text += `⚠️ _Lembrete: Leve sua cola anotada ou impressa para a cabine de votação._`;

  return text;
}

export function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise((resolve, reject) => {
      document.execCommand('copy') ? resolve() : reject();
      textArea.remove();
    });
  }
}

// Load candidate image into HTMLImageElement
function loadImage(src) {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// Generate High-Definition Modern Digital Flyer for Social Media
export async function generateCanvasFlyer(stateName, stateUf, selections, format = 'stories') {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const isStories = format === 'stories'; // 9:16 (1080 x 1920)
  const isPost = format === 'post';       // 4:5  (1080 x 1350)
  const isSquare = format === 'square';   // 1:1  (1080 x 1080)

  if (isStories) {
    canvas.width = 1080;
    canvas.height = 1920;
  } else if (isPost) {
    canvas.width = 1080;
    canvas.height = 1350;
  } else {
    canvas.width = 1080;
    canvas.height = 1080;
  }

  // Modern Deep Dark Background with Brazilian Civic Gradient
  const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bgGradient.addColorStop(0, '#090d16');
  bgGradient.addColorStop(0.3, '#0f172a');
  bgGradient.addColorStop(0.75, '#111827');
  bgGradient.addColorStop(1, '#064e3b');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Border & Glow Accents
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 8;
  ctx.strokeRect(28, 28, canvas.width - 56, canvas.height - 56);

  ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(38, 38, canvas.width - 76, canvas.height - 76);

  // Ambient glow circles
  const radialGlow1 = ctx.createRadialGradient(200, 150, 10, 200, 150, 400);
  radialGlow1.addColorStop(0, 'rgba(16, 185, 129, 0.15)');
  radialGlow1.addColorStop(1, 'transparent');
  ctx.fillStyle = radialGlow1;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const radialGlow2 = ctx.createRadialGradient(canvas.width - 200, canvas.height - 200, 10, canvas.width - 200, canvas.height - 200, 450);
  radialGlow2.addColorStop(0, 'rgba(245, 158, 11, 0.12)');
  radialGlow2.addColorStop(1, 'transparent');
  ctx.fillStyle = radialGlow2;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cargos = [
    { key: 'deputadoFederal', cargo: 'DEPUTADO FEDERAL', digits: '4 DÍGITOS', order: '1', scope: `Voto Estadual (${stateUf})` },
    { key: 'deputadoEstadual', cargo: stateUf === 'DF' ? 'DEPUTADO DISTRITAL' : 'DEPUTADO ESTADUAL', digits: '5 DÍGITOS', order: '2', scope: `Voto Estadual (${stateUf})` },
    { key: 'senador1', cargo: 'SENADOR (1ª VAGA)', digits: '3 DÍGITOS', order: '3', scope: `Voto Estadual (${stateUf})` },
    { key: 'senador2', cargo: 'SENADOR (2ª VAGA)', digits: '3 DÍGITOS', order: '4', scope: `Voto Estadual (${stateUf})` },
    { key: 'governador', cargo: 'GOVERNADOR', digits: '2 DÍGITOS', order: '5', scope: `Voto Estadual (${stateUf})` },
    { key: 'presidente', cargo: 'PRESIDENTE DA REPÚBLICA', digits: '2 DÍGITOS', order: '6', scope: 'Cargo Federal (Brasil Todo)' }
  ];

  // Pre-load all candidate photos
  const photoMap = new Map();
  for (const c of cargos) {
    const sel = selections[c.key];
    if (sel && sel.foto) {
      const img = await loadImage(`fotos/${sel.foto}`);
      if (img) photoMap.set(sel.foto, img);
    }
  }

  // --- RENDER HEADER ---
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 50px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('COLA ELEITORAL 2026', canvas.width / 2, isSquare ? 80 : 105);

  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 28px system-ui, sans-serif';
  ctx.fillText(`ELEIÇÕES GERAIS • ${stateName.toUpperCase()} (${stateUf})`, canvas.width / 2, isSquare ? 120 : 155);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '20px system-ui, sans-serif';
  ctx.fillText('04 de Outubro de 2026 • Ordem Oficial da Urna', canvas.width / 2, isSquare ? 150 : 190);

  // Divider
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  const divY = isSquare ? 170 : 215;
  ctx.moveTo(70, divY);
  ctx.lineTo(canvas.width - 70, divY);
  ctx.stroke();

  // --- RENDER CANDIDATES IN STORIES FORMAT (1 column, 6 cards) ---
  if (isStories) {
    let startY = 245;
    const cardHeight = 230;
    const gap = 22;

    cargos.forEach((c, idx) => {
      const y = startY + idx * (cardHeight + gap);
      const sel = selections[c.key];

      // Card Background
      ctx.fillStyle = sel && sel.nr ? 'rgba(30, 41, 59, 0.92)' : 'rgba(255, 255, 255, 0.04)';
      ctx.strokeStyle = sel && sel.nr ? 'rgba(16, 185, 129, 0.6)' : 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = sel && sel.nr ? 3 : 1.5;
      roundRect(ctx, 70, y, 940, cardHeight, 18, true, true);

      // Order Badge
      ctx.fillStyle = sel && sel.nr ? '#10b981' : '#334155';
      roundRect(ctx, 95, y + 20, 44, 44, 10, true, false);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(c.order, 117, y + 52);

      // Cargo Title
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 28px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(c.cargo, 155, y + 50);

      // Scope / Digits Badge
      ctx.fillStyle = '#60a5fa';
      ctx.font = 'bold 18px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${c.digits} • ${c.scope}`, 980, y + 50);

      if (sel && sel.nr) {
        const candImg = sel.foto ? photoMap.get(sel.foto) : null;
        let textStartX = 330;

        if (candImg) {
          ctx.save();
          ctx.beginPath();
          roundRect(ctx, 95, y + 78, 100, 130, 12, false, false);
          ctx.clip();
          ctx.drawImage(candImg, 95, y + 78, 100, 130);
          ctx.restore();

          // Border around photo
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2;
          roundRect(ctx, 95, y + 78, 100, 130, 12, false, true);

          // Big Number Box
          ctx.fillStyle = '#0f172a';
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 3;
          roundRect(ctx, 210, y + 84, 180, 118, 12, true, true);

          ctx.fillStyle = '#f59e0b';
          ctx.font = 'bold 56px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(sel.nr, 300, y + 164);
          textStartX = 415;
        } else {
          // Big Number Box without photo
          ctx.fillStyle = '#0f172a';
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 3;
          roundRect(ctx, 95, y + 84, 210, 118, 12, true, true);

          ctx.fillStyle = '#f59e0b';
          ctx.font = 'bold 60px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(sel.nr, 200, y + 166);
          textStartX = 330;
        }

        // Candidate Name + Social Handle
        ctx.textAlign = 'left';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px system-ui, sans-serif';
        const handle = getCandidateHandle(sel, 'x');
        const handleText = handle.startsWith('@') ? ` (${handle})` : '';
        const nameDisplay = (sel.nm + handleText).length > 26 ? (sel.nm + handleText).substring(0, 24) + '...' : (sel.nm + handleText);
        ctx.fillText(nameDisplay, textStartX, y + 125);

        // Party & Federation
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 24px system-ui, sans-serif';
        const partyDisplay = `${sel.sg || '—'} ${sel.fed ? '• ' + sel.fed : ''}`;
        ctx.fillText(partyDisplay, textStartX, y + 162);

        // Vice / Suplente
        if (sel.vices && sel.vices.length > 0) {
          ctx.fillStyle = '#94a3b8';
          ctx.font = '20px system-ui, sans-serif';
          ctx.fillText(`Vice: ${sel.vices[0].nm}`, textStartX, y + 195);
        } else if (sel.suplentes && sel.suplentes.length > 0) {
          ctx.fillStyle = '#94a3b8';
          ctx.font = '20px system-ui, sans-serif';
          ctx.fillText(`1º Suplente: ${sel.suplentes[0].nm}`, textStartX, y + 195);
        }
      } else {
        ctx.fillStyle = '#64748b';
        ctx.font = 'italic 26px system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('— Voto não definido —', 115, y + 140);
      }
    });

    // Footer Advice & Discreet Non-Partisan Watermark
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('📱 Salve esta imagem no celular ou compartilhe nas redes sociais!', 540, 1795);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px system-ui, sans-serif';
    ctx.fillText('Panfleto Oficial do Eleitor • Eleições 2026', 540, 1830);

    ctx.fillStyle = 'rgba(148, 163, 184, 0.65)';
    ctx.font = '15px system-ui, sans-serif';
    ctx.fillText('🛡️ Não afiliado a nenhum partido político • Dados públicos do TSE', 540, 1865);
  }

  // --- RENDER 2-COLUMN GRID (FOR FEED 4:5 OR SQUARE 1:1) ---
  else {
    const cols = 2;
    const cardWidth = 460;
    const cardHeight = isPost ? 310 : 255;
    const gapX = 20;
    const gapY = isPost ? 24 : 16;
    const startX = 70;
    const startY = isSquare ? 200 : 240;

    cargos.forEach((c, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = startX + col * (cardWidth + gapX);
      const y = startY + row * (cardHeight + gapY);
      const sel = selections[c.key];

      // Card Background
      ctx.fillStyle = sel && sel.nr ? 'rgba(30, 41, 59, 0.92)' : 'rgba(255, 255, 255, 0.04)';
      ctx.strokeStyle = sel && sel.nr ? 'rgba(16, 185, 129, 0.6)' : 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = sel && sel.nr ? 2.5 : 1.5;
      roundRect(ctx, x, y, cardWidth, cardHeight, 14, true, true);

      // Order + Cargo Header
      ctx.fillStyle = sel && sel.nr ? '#10b981' : '#334155';
      roundRect(ctx, x + 14, y + 14, 32, 32, 8, true, false);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(c.order, x + 30, y + 38);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 21px system-ui, sans-serif';
      ctx.textAlign = 'left';
      const shortCargo = c.cargo.length > 20 ? c.cargo.substring(0, 18) + '...' : c.cargo;
      ctx.fillText(shortCargo, x + 54, y + 38);

      if (sel && sel.nr) {
        const candImg = sel.foto ? photoMap.get(sel.foto) : null;
        let textLeft = x + 16;

        if (candImg) {
          ctx.save();
          ctx.beginPath();
          roundRect(ctx, x + 16, y + 60, 80, 105, 10, false, false);
          ctx.clip();
          ctx.drawImage(candImg, x + 16, y + 60, 80, 105);
          ctx.restore();

          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2;
          roundRect(ctx, x + 16, y + 60, 80, 105, 10, false, true);

          textLeft = x + 110;
        }

        // Big Number Box
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        roundRect(ctx, textLeft, y + 60, cardWidth - (textLeft - x) - 16, 54, 10, true, true);

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(sel.nr, textLeft + (cardWidth - (textLeft - x) - 16) / 2, y + 100);

        // Candidate Name
        ctx.textAlign = 'left';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px system-ui, sans-serif';
        const nameDisplay = sel.nm.length > 18 ? sel.nm.substring(0, 16) + '...' : sel.nm;
        ctx.fillText(nameDisplay, textLeft, y + 140);

        // Party
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 18px system-ui, sans-serif';
        ctx.fillText(sel.sg || '—', textLeft, y + 165);

        // Vice / Suplente on Post format
        if (isPost && (sel.vices?.[0] || sel.suplentes?.[0])) {
          const extra = sel.vices?.[0]?.nm || sel.suplentes?.[0]?.nm;
          ctx.fillStyle = '#94a3b8';
          ctx.font = '15px system-ui, sans-serif';
          ctx.fillText(`Vice: ${extra}`, x + 16, y + 205);
        }
      } else {
        ctx.fillStyle = '#64748b';
        ctx.font = 'italic 19px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('— Voto não definido —', x + cardWidth / 2, y + cardHeight / 2 + 10);
      }
    });

    // Footer on Post / Square
    ctx.fillStyle = '#94a3b8';
    ctx.font = '17px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Panfleto Oficial do Eleitor • Eleições 2026', canvas.width / 2, canvas.height - 42);

    ctx.fillStyle = 'rgba(148, 163, 184, 0.65)';
    ctx.font = '13.5px system-ui, sans-serif';
    ctx.fillText('🛡️ Não afiliado a nenhum partido político • Dados públicos do TSE', canvas.width / 2, canvas.height - 18);
  }

  return canvas;
}

// Save flyer to mobile gallery or trigger download and open in a new tab
export async function saveFlyerToGallery(stateName, stateUf, selections, format = 'stories') {
  const canvas = await generateCanvasFlyer(stateName, stateUf, selections, format);
  
  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      if (!blob) return resolve(false);

      const fileName = `panfleto_eleitoral_2026_${stateUf}.png`;
      const blobUrl = URL.createObjectURL(blob);
      const dataUrl = canvas.toDataURL('image/png');

      // 1. Open photo in a new tab
      try {
        const newTab = window.open('', '_blank');
        if (newTab) {
          newTab.document.write(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Panfleto Eleitoral 2026 - ${stateUf}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #090d16;
      color: #f8fafc;
      font-family: system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: 16px;
    }
    .toolbar {
      position: sticky;
      top: 12px;
      background: rgba(15, 23, 42, 0.92);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 8px 18px;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      gap: 14px;
      z-index: 100;
      box-shadow: 0 8px 24px rgba(0,0,0,0.5);
      margin-bottom: 20px;
    }
    .btn-save {
      background: #10b981;
      color: #042f2e;
      font-weight: 800;
      font-size: 14px;
      padding: 7px 16px;
      border-radius: 9999px;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: transform 0.2s;
    }
    .btn-save:active { transform: scale(0.96); }
    .tip {
      font-size: 12px;
      color: #94a3b8;
    }
    .img-wrapper {
      display: flex;
      justify-content: center;
      width: 100%;
      max-width: 800px;
    }
    img {
      max-width: 100%;
      height: auto;
      border-radius: 12px;
      box-shadow: 0 12px 36px rgba(0,0,0,0.6);
      display: block;
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <a href="${dataUrl}" download="${fileName}" class="btn-save">💾 Baixar Arquivo</a>
    <span class="tip">Toque e segure na imagem para salvar na Galeria</span>
  </div>
  <div class="img-wrapper">
    <img src="${dataUrl}" alt="Panfleto Eleitoral 2026 (${stateUf})">
  </div>
</body>
</html>
          `);
          newTab.document.close();
        } else {
          // If popup blocked, open directly
          window.open(blobUrl, '_blank');
        }
      } catch (e) {
        window.open(blobUrl, '_blank');
      }

      // 2. Also trigger direct download
      const link = document.createElement('a');
      link.download = fileName;
      link.href = blobUrl;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
        link.remove();
      }, 1500);

      resolve(true);
    }, 'image/png');
  });
}

// Copy image to clipboard for instant pasting (WhatsApp Web, Telegram, Discord, etc.)
export async function copyFlyerImageToClipboard(stateName, stateUf, selections, format = 'stories') {
  const canvas = await generateCanvasFlyer(stateName, stateUf, selections, format);
  
  return new Promise((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      if (!blob) return reject(new Error("Erro ao gerar imagem"));
      try {
        if (navigator.clipboard && window.ClipboardItem) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          resolve(true);
        } else {
          reject(new Error("ClipboardItem não suportado"));
        }
      } catch (err) {
        reject(err);
      }
    }, 'image/png');
  });
}

/**
 * Unified share handler for all platforms (X, WhatsApp, Instagram, Facebook).
 * Always attaches/inserts the photo of the generated flyer!
 */
export async function shareFlyerToPlatform(platform, stateName, stateUf, selections, customText = null, format = 'stories') {
  const canvas = await generateCanvasFlyer(stateName, stateUf, selections, format);
  const text = (customText !== null && customText !== undefined && customText.trim() !== '') 
    ? customText.trim() 
    : generateSocialPostText(stateUf, selections);

  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      if (!blob) return resolve({ success: false });

      const fileName = `panfleto_eleitoral_2026_${stateUf}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      // 1. Mobile Native Web Share API with photo file attached
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `Cola Eleitoral 2026 (${stateUf})`,
            text: text
          });
          resolve({ success: true, mode: 'native_share' });
          return;
        } catch (err) {
          if (err.name === 'AbortError') {
            resolve({ success: false, mode: 'aborted' });
            return;
          }
          console.log('Native share error, falling back:', err);
        }
      }

      // 2. Desktop & Fallback: Auto copy image to system clipboard
      try {
        if (navigator.clipboard && window.ClipboardItem) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
        }
      } catch (e) {
        console.log('Clipboard photo copy error:', e);
      }

      // 3. Open/Save the HD photo so the user has the image ready
      await saveFlyerToGallery(stateName, stateUf, selections, format);

      // 4. Open the destination platform with text
      let targetUrl = '';
      if (platform === 'x') {
        targetUrl = getXPostUrl(text);
      } else if (platform === 'whatsapp') {
        targetUrl = getWhatsAppShareUrl(text);
      } else if (platform === 'facebook') {
        targetUrl = getFacebookShareUrl(text);
      } else if (platform === 'instagram') {
        targetUrl = 'https://www.instagram.com/';
      }

      if (targetUrl) {
        setTimeout(() => {
          window.open(targetUrl, '_blank');
        }, 500);
      }

      resolve({ success: true, mode: 'fallback_desktop' });
    }, 'image/png');
  });
}

// Backward compatibility alias
export const shareFlyerOnSocial = (stateName, stateUf, selections, format = 'stories') => 
  shareFlyerToPlatform('general', stateName, stateUf, selections, null, format);

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

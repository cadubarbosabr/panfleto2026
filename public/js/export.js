// ==========================================================================
// EXPORT & SHARE MODULE - MODERN DIGITAL FLYER & SOCIAL MEDIA
// ==========================================================================

export function formatWhatsAppMessage(stateName, stateUf, selections) {
  const dateStr = "04 de Outubro de 2026";
  let text = `🗳️ *MINHA COLA ELEITORAL 2026* 🇧🇷\n`;
  text += `📍 *Estado:* ${stateName} (${stateUf})\n`;
  text += `📅 *Eleições Gerais:* ${dateStr}\n`;
  text += `───────────────────────\n\n`;

  const cargos = [
    { key: 'deputadoFederal', label: '1️⃣ Deputado Federal (4 dígitos)' },
    { key: 'deputadoEstadual', label: stateUf === 'DF' ? '2️⃣ Deputado Distrital (5 dígitos)' : '2️⃣ Deputado Estadual (5 dígitos)' },
    { key: 'senador1', label: '3️⃣ Senador - 1ª Vaga (3 dígitos)' },
    { key: 'senador2', label: '4️⃣ Senador - 2ª Vaga (3 dígitos)' },
    { key: 'governador', label: '5️⃣ Governador (2 dígitos)' },
    { key: 'presidente', label: '6️⃣ Presidente da República (2 dígitos)' }
  ];

  for (const c of cargos) {
    const sel = selections[c.key];
    text += `*${c.label}*\n`;
    if (!sel || !sel.nr) {
      text += `⚪ _Não preenchido_\n\n`;
    } else if (sel.tipo === 'branco') {
      text += `▫️ *VOTO EM BRANCO*\n\n`;
    } else if (sel.tipo === 'nulo') {
      text += `❌ *VOTO NULO*\n\n`;
    } else {
      text += `👉 *Nº ${sel.nr}* - ${sel.nm} (${sel.sg})\n`;
      if (sel.vices && sel.vices.length > 0) {
        text += `   _Vice: ${sel.vices[0].nm}_\n`;
      }
      text += `\n`;
    }
  }

  text += `───────────────────────\n`;
  text += `📱 _Monte sua cola eleitoral oficial para 2026!_\n`;
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

        // Candidate Name
        ctx.textAlign = 'left';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px system-ui, sans-serif';
        const nameDisplay = sel.nm.length > 26 ? sel.nm.substring(0, 24) + '...' : sel.nm;
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

    // Footer Advice
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('📱 Salve esta imagem no celular ou compartilhe com amigos!', 540, 1805);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '19px system-ui, sans-serif';
    ctx.fillText('Cola Oficial do Eleitor • Eleições 2026', 540, 1840);
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
    ctx.font = '18px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Cola Oficial do Eleitor • Eleições 2026', canvas.width / 2, canvas.height - 50);
  }

  return canvas;
}

// Save flyer to mobile gallery or trigger download
export async function saveFlyerToGallery(stateName, stateUf, selections, format = 'stories') {
  const canvas = await generateCanvasFlyer(stateName, stateUf, selections, format);
  
  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      if (!blob) return resolve(false);

      const fileName = `panfleto_eleitoral_2026_${stateUf}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      // Direct Download (Available everywhere)
      const link = document.createElement('a');
      link.download = fileName;
      link.href = URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        URL.revokeObjectURL(link.href);
        link.remove();
      }, 1000);

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

// Native Share API for Social Networks (Instagram Stories, WhatsApp, Twitter)
export async function shareFlyerOnSocial(stateName, stateUf, selections, format = 'stories') {
  const canvas = await generateCanvasFlyer(stateName, stateUf, selections, format);
  
  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      if (!blob) return resolve(false);

      const fileName = `panfleto_eleitoral_2026_${stateUf}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `Minha Cola Eleitoral 2026 (${stateUf})`,
            text: `Confira minha cola eleitoral para as Eleições 2026 em ${stateName} (${stateUf})!`
          });
          resolve(true);
          return;
        } catch (err) {
          if (err.name !== 'AbortError') {
            console.log('Share error:', err);
          }
        }
      }

      // If Web Share is not available, download the image and copy text
      saveFlyerToGallery(stateName, stateUf, selections, format);
      resolve(true);
    }, 'image/png');
  });
}

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

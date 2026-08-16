// ==========================================================================
// COLA ELEITORAL 2026 - MAIN APPLICATION LOGIC (ADVANCED ANDROID & iOS ENGINE)
// ==========================================================================

import { deviceEngine } from './device.js';
import { UrnaSimulator } from './urna.js';
import { panfletometro } from './counter.js';
import { 
  formatWhatsAppMessage, 
  copyToClipboard, 
  generateCanvasFlyer, 
  saveFlyerToGallery, 
  copyFlyerImageToClipboard, 
  shareFlyerOnSocial,
  generateSocialPostText,
  getXPostUrl,
  getWhatsAppShareUrl
} from './export.js';

const CARGO_ORDER = [
  'deputadoFederal',
  'deputadoEstadual',
  'senador1',
  'senador2',
  'governador',
  'presidente'
];

const CARGO_TITLES = {
  deputadoFederal: 'Deputado Federal',
  deputadoEstadual: 'Deputado Estadual',
  senador1: 'Senador (1ª Vaga)',
  senador2: 'Senador (2ª Vaga)',
  governador: 'Governador',
  presidente: 'Presidente da República'
};

const STATE_REGIONS = {
  'SP': 'SUDESTE', 'RJ': 'SUDESTE', 'MG': 'SUDESTE', 'ES': 'SUDESTE',
  'RS': 'SUL', 'SC': 'SUL', 'PR': 'SUL',
  'BA': 'NORDESTE', 'PE': 'NORDESTE', 'CE': 'NORDESTE', 'MA': 'NORDESTE', 'PB': 'NORDESTE', 'RN': 'NORDESTE', 'AL': 'NORDESTE', 'PI': 'NORDESTE', 'SE': 'NORDESTE',
  'DF': 'CENTRO-OESTE', 'GO': 'CENTRO-OESTE', 'MT': 'CENTRO-OESTE', 'MS': 'CENTRO-OESTE',
  'PA': 'NORTE', 'AM': 'NORTE', 'RO': 'NORTE', 'TO': 'NORTE', 'AC': 'NORTE', 'AP': 'NORTE', 'RR': 'NORTE'
};

const FALLBACK_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='34' height='34' viewBox='0 0 24 24' fill='%2394a3b8'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
const FALLBACK_PHOTO = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='88' viewBox='0 0 72 88'%3E%3Crect width='100%25' height='100%25' fill='%231e293b'/%3E%3Ccircle cx='36' cy='32' r='18' fill='%2394a3b8'/%3E%3Cpath d='M12 78 C12 56 60 56 60 78' fill='%2394a3b8'/%3E%3C/svg%3E";

class App {
  constructor() {
    this.currentUf = localStorage.getItem('cola_2026_uf') || null;
    this.states = [];
    this.presidentes = [];
    this.stateData = null;
    
    this.selections = this.loadSelections();
    this.flowMode = window.innerWidth <= 768 ? 'step' : 'all'; // 'step' | 'all'
    this.currentStepIndex = 0; // 0 to 5
    this.explorerCargoKey = null;
    this.currentRegionFilter = 'TODOS';
    this.currentFlyerFormat = 'stories'; // 'stories' | 'post' | 'square'
    this.urnaSimulator = null;

    this.touchStartX = 0;
    this.touchStartY = 0;

    this.init();
  }

  loadSelections() {
    if (!this.currentUf) {
      return {
        deputadoFederal: null,
        deputadoEstadual: null,
        senador1: null,
        senador2: null,
        governador: null,
        presidente: null
      };
    }
    try {
      const saved = localStorage.getItem(`cola_2026_sel_${this.currentUf}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Failed to load saved selections:", e);
    }
    return {
      deputadoFederal: null,
      deputadoEstadual: null,
      senador1: null,
      senador2: null,
      governador: null,
      presidente: null
    };
  }

  saveSelections() {
    if (this.currentUf) {
      localStorage.setItem(`cola_2026_sel_${this.currentUf}`, JSON.stringify(this.selections));
      localStorage.setItem('cola_2026_uf', this.currentUf);
    }
    this.updateProgressSummary();
  }

  async init() {
    this.initTheme();
    await this.loadInitialData();
    this.setupEventListeners();
    this.setupTouchSwipeGestures();
    this.urnaSimulator = new UrnaSimulator(this);
    
    // Set initial flow mode based on screen profiling
    this.setFlowMode(this.flowMode);

    // Check if user should be asked for the state on startup
    const hasChosenState = localStorage.getItem('cola_2026_uf_chosen');
    if (!hasChosenState || !this.currentUf) {
      this.openWelcomeStateModal();
    } else {
      this.renderAllCards();
      this.updateProgressSummary();
    }
  }

  initTheme() {
    const savedTheme = localStorage.getItem('cola_2026_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const themeBtn = document.getElementById('btn-toggle-theme');
    if (themeBtn) {
      themeBtn.innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';
    }
  }

  toggleTheme() {
    deviceEngine.haptic('selection');
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('cola_2026_theme', next);
    const themeBtn = document.getElementById('btn-toggle-theme');
    if (themeBtn) {
      themeBtn.innerHTML = next === 'dark' ? '☀️' : '🌙';
    }
  }

  // ==========================================================================
  // FLUID MOBILE STEP FLOW & TOUCH GESTURES (iOS / ANDROID)
  // ==========================================================================
  setFlowMode(mode) {
    deviceEngine.haptic('selection');
    this.flowMode = mode;
    const container = document.getElementById('voting-cards-container');
    const btnStep = document.getElementById('btn-mode-step');
    const btnAll = document.getElementById('btn-mode-all');
    const progressWrapper = document.getElementById('step-progress-wrapper');

    if (btnStep) btnStep.classList.toggle('active', mode === 'step');
    if (btnAll) btnAll.classList.toggle('active', mode === 'all');

    if (container) {
      container.classList.remove('mode-step', 'mode-all');
      container.classList.add(`mode-${mode}`);
    }

    if (mode === 'step') {
      this.goToStep(this.currentStepIndex, false);
      if (progressWrapper) progressWrapper.style.display = 'flex';
    } else {
      document.querySelectorAll('.vote-card').forEach(c => c.classList.remove('active-step'));
      if (progressWrapper) progressWrapper.style.display = 'flex';
      this.updateProgressSummary();
    }
  }

  goToStep(stepIndex, shouldScroll = true) {
    if (stepIndex < 0 || stepIndex >= CARGO_ORDER.length) return;
    deviceEngine.haptic('step');
    this.currentStepIndex = stepIndex;
    const cargoKey = CARGO_ORDER[stepIndex];

    // Update active card
    CARGO_ORDER.forEach((key, idx) => {
      const card = document.getElementById(`card-${key}`);
      if (card) {
        card.classList.toggle('active-step', idx === stepIndex);
      }
    });

    // Update Segmented Nav Carousel
    CARGO_ORDER.forEach((key, idx) => {
      const pill = document.getElementById(`navpill-${key}`);
      if (pill) {
        pill.classList.toggle('active', idx === stepIndex);
        if (idx === stepIndex) {
          pill.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      }
    });

    // Update Step Indicator
    const stepLabel = document.getElementById('step-progress-label');
    const stepPct = document.getElementById('step-progress-pct');
    const stepFill = document.getElementById('step-progress-bar-fill');

    const cargoTitle = this.currentUf === 'DF' && cargoKey === 'deputadoEstadual' ? 'Deputado Distrital' : CARGO_TITLES[cargoKey];
    const pct = Math.round(((stepIndex + 1) / 6) * 100);

    if (stepLabel) stepLabel.textContent = `Passo ${stepIndex + 1} de 6 • ${cargoTitle}`;
    if (stepPct) stepPct.textContent = `${pct}% concluído`;
    if (stepFill) stepFill.style.width = `${pct}%`;

    if (shouldScroll) {
      const card = document.getElementById(`card-${cargoKey}`);
      if (card) {
        const headerOffset = window.innerWidth <= 768 ? 120 : 130;
        const elementPosition = card.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
  }

  goToCargo(cargoKey) {
    const idx = CARGO_ORDER.indexOf(cargoKey);
    if (idx !== -1) {
      if (this.flowMode === 'step') {
        this.goToStep(idx, true);
      } else {
        deviceEngine.haptic('selection');
        const card = document.getElementById(`card-${cargoKey}`);
        if (card) {
          const headerOffset = window.innerWidth <= 768 ? 120 : 130;
          const elementPosition = card.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
        CARGO_ORDER.forEach(k => {
          document.getElementById(`navpill-${k}`)?.classList.toggle('active', k === cargoKey);
        });
      }
    }
  }

  setupTouchSwipeGestures() {
    const container = document.getElementById('voting-cards-container');
    if (!container) return;

    container.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
      this.touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      if (this.flowMode !== 'step') return;

      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const deltaX = touchEndX - this.touchStartX;
      const deltaY = touchEndY - this.touchStartY;

      // Ensure horizontal swipe is dominant over vertical scroll
      if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        if (deltaX < 0) {
          // Swipe Left -> Next Cargo
          if (this.currentStepIndex < CARGO_ORDER.length - 1) {
            this.goToStep(this.currentStepIndex + 1, false);
          }
        } else {
          // Swipe Right -> Previous Cargo
          if (this.currentStepIndex > 0) {
            this.goToStep(this.currentStepIndex - 1, false);
          }
        }
      }
    }, { passive: true });
  }

  async loadInitialData() {
    try {
      const resStates = await fetch('data/states.json');
      this.states = await resStates.json();

      const resPres = await fetch('data/presidente.json');
      this.presidentes = await resPres.json();

      const ufToLoad = this.currentUf || 'SP';
      await this.loadStateData(ufToLoad, false);
    } catch (e) {
      console.error("Error loading initial data:", e);
      this.showToast("Erro ao carregar dados da eleição.", "warn");
    }
  }

  async loadStateData(uf, notify = true) {
    try {
      const res = await fetch(`data/${uf}.json`);
      this.stateData = await res.json();
      this.currentUf = uf;
      this.selections = this.loadSelections();

      const stateObj = this.states.find(s => s.uf === uf);
      const stateName = stateObj ? stateObj.nome : uf;
      
      const badgeEl = document.getElementById('current-state-badge');
      if (badgeEl) badgeEl.textContent = uf;

      const titleEl = document.getElementById('current-state-title');
      if (titleEl) titleEl.textContent = `Eleições em ${stateName} (${uf})`;

      const countEl = document.getElementById('current-state-count');
      if (countEl && stateObj) {
        countEl.textContent = `${stateObj.totalCandidatos} candidatos para ${uf} + 12 Presidenciáveis`;
      }

      const depEstTitle = document.getElementById('title-deputado-estadual');
      if (depEstTitle) {
        depEstTitle.textContent = uf === 'DF' ? 'Deputado Distrital' : 'Deputado Estadual';
      }

      const navDepEst = document.getElementById('navname-deputadoEstadual');
      if (navDepEst) {
        navDepEst.textContent = uf === 'DF' ? 'Dep. Distrital' : 'Dep. Estadual';
      }

      const stateScopeBadges = ['deputadoFederal', 'deputadoEstadual', 'senador1', 'senador2', 'governador'];
      stateScopeBadges.forEach(cg => {
        const el = document.getElementById(`badge-scope-${cg}`);
        if (el) el.textContent = `🏛️ Voto Estadual (${uf})`;
      });

      this.renderAllCards();
      this.updateProgressSummary();

      if (notify) {
        this.showToast(`Estado: ${stateName} (${uf}) • Candidatos carregados!`, "success");
      }
    } catch (e) {
      console.error(`Error loading state data for ${uf}:`, e);
      this.showToast(`Erro ao carregar dados de ${uf}`, "warn");
    }
  }

  // Welcome / Onboarding State Selection Modal (Direct & Fast)
  openWelcomeStateModal() {
    deviceEngine.haptic('selection');
    const modal = document.getElementById('modal-welcome-state');
    if (!modal) return;

    this.renderWelcomeStatesGrid();
    modal.classList.add('open');

    setTimeout(() => {
      document.getElementById('input-search-state')?.focus();
    }, 200);
  }

  closeWelcomeStateModal() {
    const modal = document.getElementById('modal-welcome-state');
    if (modal) modal.classList.remove('open');
  }

  async selectStateDirect(uf) {
    deviceEngine.haptic('confirm');
    localStorage.setItem('cola_2026_uf_chosen', 'true');
    await this.loadStateData(uf, true);
    this.closeWelcomeStateModal();
  }

  renderWelcomeStatesGrid() {
    const container = document.getElementById('welcome-states-container');
    const searchInput = document.getElementById('input-search-state');
    if (!container) return;

    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const region = this.currentRegionFilter;

    const filtered = this.states.filter(s => {
      const stateReg = STATE_REGIONS[s.uf] || '';
      const matchRegion = region === 'TODOS' || stateReg === region;
      const matchQuery = !query || s.uf.toLowerCase().includes(query) || s.nome.toLowerCase().includes(query);
      return matchRegion && matchQuery;
    });

    if (filtered.length === 0) {
      container.innerHTML = '<div style="grid-column: 1/-1; padding: 30px; text-align: center; color: var(--text-muted);">Nenhum estado encontrado.</div>';
      return;
    }

    container.innerHTML = '';
    filtered.forEach(s => {
      const card = document.createElement('div');
      card.className = `state-card-picker ${s.uf === this.currentUf ? 'active' : ''}`;
      const stateReg = STATE_REGIONS[s.uf] || '';

      card.innerHTML = `
        <div class="state-picker-left">
          <div class="state-picker-uf">${s.uf}</div>
          <div class="state-picker-names">
            <span class="state-picker-name">${s.nome}</span>
            <span class="state-picker-region">${stateReg}</span>
          </div>
        </div>
        <div class="state-picker-count">${s.totalCandidatos} cands</div>
      `;

      card.addEventListener('click', () => {
        this.selectStateDirect(s.uf);
      });

      container.appendChild(card);
    });
  }

  // ==========================================================================
  // POSTAR PANFLETO NAS REDES SOCIAIS (X, INSTAGRAM, WHATSAPP <= 140 CHARACTERS)
  // ==========================================================================
  openPostSocialModal() {
    deviceEngine.haptic('selection');
    const modal = document.getElementById('modal-post-social');
    const textarea = document.getElementById('social-post-textarea');
    const counter = document.getElementById('post-char-counter');
    const linkX = document.getElementById('btn-share-x');
    const linkWA = document.getElementById('btn-share-wa-direct');

    if (!modal || !textarea) return;

    // Generate smart text <= 140 chars with handles
    const initialText = generateSocialPostText(this.currentUf, this.selections, 'x');
    textarea.value = initialText;

    const updateSocialLinks = (text) => {
      const len = text.length;
      if (counter) {
        counter.textContent = `${len} / 140 caracteres`;
        counter.classList.toggle('warning', len > 140);
      }
      if (linkX) linkX.href = getXPostUrl(text);
      if (linkWA) linkWA.href = getWhatsAppShareUrl(text);
    };

    updateSocialLinks(initialText);

    // Live typing listener
    textarea.oninput = () => updateSocialLinks(textarea.value);

    modal.classList.add('open');
  }

  closePostSocialModal() {
    const modal = document.getElementById('modal-post-social');
    if (modal) modal.classList.remove('open');
  }

  // ==========================================================================
  // DIGITAL FLYER / IMPRESSÃO DIGITAL MODAL (SOCIAL MEDIA & HD CANVAS)
  // ==========================================================================
  async openDigitalFlyerModal(format = 'stories') {
    deviceEngine.haptic('selection');
    this.currentFlyerFormat = format;

    const modal = document.getElementById('modal-digital-flyer');
    if (!modal) return;

    modal.classList.add('open');

    const tabs = document.getElementById('flyer-format-tabs');
    if (tabs) {
      tabs.querySelectorAll('.flyer-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-format') === format);
      });
    }

    await this.renderDigitalFlyerPreview();
  }

  closeDigitalFlyerModal() {
    const modal = document.getElementById('modal-digital-flyer');
    if (modal) modal.classList.remove('open');
  }

  async renderDigitalFlyerPreview() {
    const previewContainer = document.getElementById('flyer-preview-container');
    if (!previewContainer) return;

    previewContainer.innerHTML = '<div style="color: #10b981; font-weight: 700; padding: 40px; text-align: center;">⏳ Renderizando Panfleto Digital em HD...</div>';

    const stateObj = this.states.find(s => s.uf === this.currentUf);
    const stateName = stateObj ? stateObj.nome : this.currentUf;

    const canvas = await generateCanvasFlyer(stateName, this.currentUf, this.selections, this.currentFlyerFormat);
    
    previewContainer.innerHTML = '';
    previewContainer.appendChild(canvas);
  }

  getCandidateListForCargo(cargoKey) {
    if (!this.stateData && cargoKey !== 'presidente') return [];

    switch (cargoKey) {
      case 'presidente':
        return this.presidentes;
      case 'governador':
        return this.stateData?.governadores || [];
      case 'senador1':
      case 'senador2':
        return this.stateData?.senadores || [];
      case 'deputadoFederal':
        return this.stateData?.deputadosFederais || [];
      case 'deputadoEstadual':
        return this.stateData?.deputadosEstaduais || [];
      default:
        return [];
    }
  }

  getCargoDigitCount(cargoKey) {
    switch (cargoKey) {
      case 'deputadoFederal': return 4;
      case 'deputadoEstadual': return 5;
      case 'senador1':
      case 'senador2': return 3;
      case 'governador':
      case 'presidente': return 2;
      default: return 2;
    }
  }

  setupAutocomplete(cargoKey) {
    const input = document.getElementById(`input-search-${cargoKey}`);
    const dropdown = document.getElementById(`dropdown-${cargoKey}`);
    const digitBoxes = document.getElementById(`digits-${cargoKey}`);
    if (!input || !dropdown) return;

    if (digitBoxes) {
      digitBoxes.style.cursor = 'pointer';
      digitBoxes.addEventListener('click', () => input.focus());
    }

    input.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (!query) {
        dropdown.classList.remove('open');
        return;
      }

      const list = this.getCandidateListForCargo(cargoKey);
      const filtered = list.filter(c => {
        return c.nr.startsWith(query) ||
               c.nm.toLowerCase().includes(query) ||
               c.nmc.toLowerCase().includes(query) ||
               c.sg.toLowerCase().includes(query);
      }).slice(0, 15);

      const reqDigits = this.getCargoDigitCount(cargoKey);
      if (query.length === reqDigits && /^\d+$/.test(query)) {
        const exact = list.find(c => c.nr === query);
        if (exact) {
          this.selectCandidate(cargoKey, exact);
          dropdown.classList.remove('open');
          input.value = '';
          return;
        }
      }

      this.renderDropdownItems(cargoKey, filtered, dropdown);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const firstItem = dropdown.querySelector('.dropdown-item');
        if (firstItem) {
          firstItem.click();
        }
      }
    });

    input.addEventListener('focus', () => {
      if (input.value.trim()) {
        input.dispatchEvent(new Event('input'));
      }
    });

    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });
  }

  renderDropdownItems(cargoKey, candidates, dropdown) {
    if (candidates.length === 0) {
      dropdown.innerHTML = '<div style="padding: 12px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">Nenhum candidato encontrado</div>';
      dropdown.classList.add('open');
      return;
    }

    dropdown.innerHTML = '';
    candidates.forEach(cand => {
      const item = document.createElement('div');
      item.className = 'dropdown-item';
      const photoSrc = cand.foto ? `fotos/${cand.foto}` : FALLBACK_AVATAR;
      const candName = cand.nm || '';
      const partyText = cand.sg ? `${cand.sg}${cand.fed ? ' • ' + cand.fed : ''}` : '';

      item.innerHTML = `
        <div class="dropdown-item-left">
          <img class="cand-mini-avatar" src="${photoSrc}">
          <div class="dropdown-cand-names">
            <span class="dropdown-cand-urnaname">${candName}</span>
            <span class="dropdown-cand-party">${partyText}</span>
          </div>
        </div>
        <span class="dropdown-cand-number">${cand.nr || ''}</span>
      `;

      const img = item.querySelector('.cand-mini-avatar');
      if (img) {
        img.onerror = () => { img.src = FALLBACK_AVATAR; };
      }

      item.addEventListener('click', () => {
        deviceEngine.haptic('selection');
        this.selectCandidate(cargoKey, cand);
        dropdown.classList.remove('open');
        const input = document.getElementById(`input-search-${cargoKey}`);
        if (input) input.value = '';
      });

      dropdown.appendChild(item);
    });

    dropdown.classList.add('open');
  }

  selectCandidate(cargoKey, candidate) {
    if (cargoKey === 'senador1' && this.selections.senador2?.sq === candidate.sq) {
      deviceEngine.haptic('warning');
      this.showToast("Atenção: Você não pode votar no mesmo senador para as duas vagas!", "warn");
      return;
    }
    if (cargoKey === 'senador2' && this.selections.senador1?.sq === candidate.sq) {
      deviceEngine.haptic('warning');
      this.showToast("Atenção: Você não pode votar no mesmo senador para as duas vagas!", "warn");
      return;
    }

    deviceEngine.haptic('confirm');
    this.selections[cargoKey] = candidate;
    this.saveSelections();
    this.renderCard(cargoKey);
    this.showToast(`${candidate.nm} (${candidate.nr}) selecionado!`, "success");

    this.triggerAutoAdvance(cargoKey);
  }

  triggerAutoAdvance(cargoKey) {
    if (this.flowMode === 'step') {
      const currIdx = CARGO_ORDER.indexOf(cargoKey);
      if (currIdx < CARGO_ORDER.length - 1) {
        const nextIdx = currIdx + 1;
        const nextCargo = CARGO_ORDER[nextIdx];
        setTimeout(() => {
          this.goToStep(nextIdx, true);
          setTimeout(() => {
            document.getElementById(`input-search-${nextCargo}`)?.focus();
          }, 320);
        }, 360);
      } else {
        // Last step (Presidente): glide directly to the completion hub
        setTimeout(() => {
          const hub = document.getElementById('flyer-completion-section');
          if (hub) {
            const offset = 70;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = hub.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            deviceEngine.haptic('confirm');
          }
        }, 450);
      }
    }
  }

  selectSpecialVote(cargoKey, tipo, extra = {}) {
    let sel = { tipo };
    if (tipo === 'branco') {
      sel.nm = 'VOTO EM BRANCO';
      sel.nr = '00';
      sel.sg = 'BRANCO';
      sel.foto = '';
    } else if (tipo === 'nulo') {
      sel.nm = 'VOTO NULO';
      sel.nr = '99';
      sel.sg = 'NULO';
      sel.foto = '';
    }

    deviceEngine.haptic('selection');
    this.selections[cargoKey] = sel;
    this.saveSelections();
    this.renderCard(cargoKey);
    this.showToast(`Voto definido como ${sel.nm}`, "success");

    this.triggerAutoAdvance(cargoKey);
  }

  clearSelection(cargoKey) {
    deviceEngine.haptic('selection');
    this.selections[cargoKey] = null;
    this.saveSelections();
    this.renderCard(cargoKey);
    this.showToast("Escolha removida", "warn");
  }

  clearAllSelections() {
    if (confirm("Deseja iniciar um novo panfleto? Suas escolhas atuais serão reiniciadas para você montar uma nova cola 😊")) {
      deviceEngine.haptic('confirm');
      this.selections = {
        deputadoFederal: null,
        deputadoEstadual: null,
        senador1: null,
        senador2: null,
        governador: null,
        presidente: null
      };
      this.saveSelections();
      this.renderAllCards();
      if (this.flowMode === 'step') {
        this.goToStep(0, true);
      }
      this.showToast("✨ Novo panfleto iniciado com sucesso! 😊", "success");
    }
  }

  renderCard(cargoKey) {
    const cardEl = document.getElementById(`card-${cargoKey}`);
    if (!cardEl) return;

    const sel = this.selections[cargoKey];
    const previewEl = document.getElementById(`preview-${cargoKey}`);
    const digitsContainer = document.getElementById(`digits-${cargoKey}`);

    if (digitsContainer) {
      const boxes = digitsContainer.querySelectorAll('.digit-box');
      const nrStr = sel && sel.nr ? sel.nr : '';
      boxes.forEach((box, idx) => {
        const char = nrStr[idx] || '';
        box.textContent = char;
        box.classList.toggle('filled', !!char);
      });
    }

    cardEl.classList.toggle('has-selection', !!(sel && sel.nr));

    if (previewEl) {
      if (sel && sel.nr) {
        previewEl.classList.add('active');
        
        let viceHtml = '';
        if (sel.vices && sel.vices.length > 0) {
          viceHtml = `<div class="vice-info">Vice: <span>${sel.vices[0].nm} (${sel.vices[0].sg})</span></div>`;
        } else if (sel.suplentes && sel.suplentes.length > 0) {
          const s1 = sel.suplentes[0] ? `1º: ${sel.suplentes[0].nm}` : '';
          const s2 = sel.suplentes[1] ? ` | 2º: ${sel.suplentes[1].nm}` : '';
          viceHtml = `<div class="vice-info"><span>${s1}${s2}</span></div>`;
        }

        const photoSrc = sel.foto ? `fotos/${sel.foto}` : FALLBACK_PHOTO;

        previewEl.innerHTML = `
          <div class="cand-photo-wrapper">
            <img class="cand-photo" src="${photoSrc}">
          </div>
          <div class="cand-details">
            <div class="cand-meta-badges">
              <span class="badge-number">${sel.nr || ''}</span>
              <span class="badge-party">${sel.sg || '—'}</span>
              ${sel.fed ? `<span class="badge-fed">${sel.fed}</span>` : ''}
            </div>
            <div class="cand-urnaname-big">${sel.nm || ''}</div>
            <div class="cand-fullname">${sel.nmc || ''}</div>
            ${viceHtml}
          </div>
          <button class="btn-remove-selection" title="Remover escolha" id="btn-remove-${cargoKey}">✕</button>
        `;

        const photoImg = previewEl.querySelector('.cand-photo');
        if (photoImg) {
          photoImg.onerror = () => { photoImg.src = FALLBACK_PHOTO; };
        }

        document.getElementById(`btn-remove-${cargoKey}`)?.addEventListener('click', (e) => {
          e.stopPropagation();
          this.clearSelection(cargoKey);
        });
      } else {
        previewEl.classList.remove('active');
        previewEl.innerHTML = `
          <div class="empty-cand-notice">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
            <span>Nenhum candidato selecionado</span>
            <small style="color:var(--text-muted);font-size:0.75rem;">Digite o nome, número ou explore a lista</small>
          </div>
        `;
      }
    }
  }

  renderAllCards() {
    CARGO_ORDER.forEach(c => {
      this.renderCard(c);
      this.setupAutocomplete(c);
    });
  }

  updateProgressSummary() {
    let filledCount = 0;

    CARGO_ORDER.forEach(c => {
      const sel = this.selections[c];
      const navStatus = document.getElementById(`navstatus-${c}`);
      const navPill = document.getElementById(`navpill-${c}`);

      if (sel && sel.nr) {
        filledCount++;
        if (navStatus) navStatus.textContent = '✓';
        if (navPill) navPill.classList.add('has-vote');
      } else {
        if (navStatus) navStatus.textContent = '⚪';
        if (navPill) navPill.classList.remove('has-vote');
      }
    });

    const progressCounter = document.getElementById('progress-counter');
    if (progressCounter) {
      progressCounter.textContent = `${filledCount} de 6 votos definidos`;
    }
  }

  // Candidate Explorer Modal
  openExplorer(cargoKey) {
    deviceEngine.haptic('selection');
    this.explorerCargoKey = cargoKey;
    const modal = document.getElementById('modal-explorer');
    const title = document.getElementById('explorer-modal-title');
    const subtitle = document.getElementById('explorer-modal-subtitle');
    const partyFilter = document.getElementById('explorer-party-filter');
    const searchInput = document.getElementById('explorer-search-input');

    if (!modal) return;

    const cargoNames = {
      deputadoFederal: 'Deputado Federal',
      deputadoEstadual: this.currentUf === 'DF' ? 'Deputado Distrital' : 'Deputado Estadual',
      senador1: 'Senador (1ª Vaga)',
      senador2: 'Senador (2ª Vaga)',
      governador: 'Governador',
      presidente: 'Presidente da República'
    };

    if (title) title.textContent = `Candidatos a ${cargoNames[cargoKey]}`;
    
    if (cargoKey === 'presidente') {
      if (subtitle) subtitle.textContent = `🇧🇷 Brasil Todo • Cargo Comum a Todos os Estados`;
    } else {
      if (subtitle) subtitle.textContent = `🏛️ ${this.currentUf} • Candidatos do seu estado`;
    }

    const candidates = this.getCandidateListForCargo(cargoKey);

    if (partyFilter) {
      const parties = Array.from(new Set(candidates.map(c => c.sg))).sort();
      partyFilter.innerHTML = '<option value="">Todos os Partidos</option>';
      parties.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p;
        opt.textContent = p;
        partyFilter.appendChild(opt);
      });
      partyFilter.value = '';
    }

    if (searchInput) searchInput.value = '';

    this.renderExplorerList(candidates);
    modal.classList.add('open');
  }

  closeExplorer() {
    const modal = document.getElementById('modal-explorer');
    if (modal) modal.classList.remove('open');
  }

  renderExplorerList(candidates) {
    const grid = document.getElementById('explorer-candidates-grid');
    if (!grid) return;

    if (candidates.length === 0) {
      grid.innerHTML = '<div style="grid-column: 1/-1; padding: 40px; text-align: center; color: var(--text-muted);">Nenhum candidato encontrado com os filtros atuais.</div>';
      return;
    }

    grid.innerHTML = '';

    candidates.forEach(cand => {
      const card = document.createElement('div');
      card.className = 'cand-explorer-card';
      const photoSrc = cand.foto ? `fotos/${cand.foto}` : FALLBACK_PHOTO;
      const candName = cand.nm || '';
      const partyText = cand.sg ? `${cand.sg}${cand.fed ? ' • ' + cand.fed : ''}` : '';

      card.innerHTML = `
        <div class="cand-explorer-top">
          <img class="cand-explorer-photo" src="${photoSrc}">
          <div class="cand-explorer-info">
            <div class="cand-explorer-name" title="${candName}">${candName}</div>
            <div class="cand-explorer-party">${partyText}</div>
          </div>
          <div class="cand-explorer-num">${cand.nr || ''}</div>
        </div>
      `;

      const img = card.querySelector('.cand-explorer-photo');
      if (img) {
        img.onerror = () => { img.src = FALLBACK_PHOTO; };
      }

      card.addEventListener('click', () => {
        deviceEngine.haptic('confirm');
        this.selectCandidate(this.explorerCargoKey, cand);
        this.closeExplorer();
      });

      grid.appendChild(card);
    });
  }

  filterExplorer() {
    const searchInput = document.getElementById('explorer-search-input');
    const partyFilter = document.getElementById('explorer-party-filter');
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const party = partyFilter ? partyFilter.value : '';

    const list = this.getCandidateListForCargo(this.explorerCargoKey);
    const filtered = list.filter(c => {
      const matchQuery = !query || c.nr.startsWith(query) || c.nm.toLowerCase().includes(query) || c.nmc.toLowerCase().includes(query);
      const matchParty = !party || c.sg === party;
      return matchQuery && matchParty;
    });

    this.renderExplorerList(filtered);
  }

  // Handle direct image download
  async handleSavePhoto() {
    deviceEngine.haptic('confirm');
    this.showToast("📸 Gerando imagem do panfleto em alta resolução...", "info");

    try {
      const stateObj = this.states.find(s => s.uf === this.currentUf);
      const stateName = stateObj ? stateObj.nome : this.currentUf;

      await saveFlyerToGallery(stateName, this.currentUf, this.selections, this.currentFlyerFormat);
      panfletometro.increment(1, true);
      this.showToast("✅ Imagem salva com sucesso na pasta de downloads / fotos!", "success");
    } catch (err) {
      console.error("Erro ao salvar foto:", err);
      this.showToast("Erro ao gerar foto do panfleto.", "warn");
    }
  }

  setupEventListeners() {
    document.getElementById('btn-toggle-theme')?.addEventListener('click', () => this.toggleTheme());

    // Mode tabs (Passo a Passo vs Ver Todos)
    document.getElementById('btn-mode-step')?.addEventListener('click', () => this.setFlowMode('step'));
    document.getElementById('btn-mode-all')?.addEventListener('click', () => this.setFlowMode('all'));

    // Segmented Cargo Nav Pills
    CARGO_ORDER.forEach(cargo => {
      document.getElementById(`navpill-${cargo}`)?.addEventListener('click', () => {
        this.goToCargo(cargo);
      });
    });

    // Step Nav buttons inside cards
    document.querySelectorAll('.btn-step-nav').forEach(btn => {
      btn.addEventListener('click', () => {
        const stepTo = btn.getAttribute('data-step-to');
        if (stepTo) {
          this.goToCargo(stepTo);
        }
      });
    });

    // Finish Step button (Smooth scroll to completion hub)
    document.getElementById('btn-step-finish')?.addEventListener('click', () => {
      deviceEngine.haptic('confirm');
      const completionHub = document.getElementById('flyer-completion-section');
      if (completionHub) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = completionHub.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      } else {
        this.openDigitalFlyerModal('stories');
      }
    });

    // Fast State Badges in Welcome Modal (1-Tap Direct Selection)
    document.querySelectorAll('.chip-uf-fast').forEach(chip => {
      chip.addEventListener('click', () => {
        const uf = chip.getAttribute('data-uf');
        if (uf) {
          this.selectStateDirect(uf);
        }
      });
    });

    // Completion Hub Buttons
    document.getElementById('btn-open-postar-bottom')?.addEventListener('click', () => this.openPostSocialModal());
    document.getElementById('btn-open-flyer-bottom')?.addEventListener('click', () => this.openDigitalFlyerModal('stories'));
    document.getElementById('btn-open-urna-bottom')?.addEventListener('click', () => {
      deviceEngine.haptic('selection');
      this.urnaSimulator.open(true);
    });
    document.getElementById('btn-save-photo-bottom')?.addEventListener('click', () => this.handleSavePhoto());

    // Post Social Modal Buttons
    document.getElementById('btn-open-postar')?.addEventListener('click', () => this.openPostSocialModal());
    document.getElementById('btn-mobile-postar')?.addEventListener('click', () => this.openPostSocialModal());

    // Close Post Social Modal
    document.getElementById('btn-close-post-social')?.addEventListener('click', () => this.closePostSocialModal());
    document.getElementById('modal-post-social')?.addEventListener('click', (e) => {
      if (e.target.id === 'modal-post-social') this.closePostSocialModal();
    });

    // Copy formatted <=140 text
    document.getElementById('btn-copy-post-text')?.addEventListener('click', () => {
      deviceEngine.haptic('selection');
      const text = document.getElementById('social-post-textarea')?.value || '';
      copyToClipboard(text).then(() => {
        this.showToast("📋 Texto copiado com sucesso (<=140 caracteres)!", "success");
      });
    });

    // Instagram share action from Post Modal
    document.getElementById('btn-share-ig-direct')?.addEventListener('click', async () => {
      deviceEngine.haptic('confirm');
      const text = document.getElementById('social-post-textarea')?.value || '';
      await copyToClipboard(text);
      this.showToast("📋 Legenda copiada! Baixando panfleto para o Instagram...", "info");
      await this.handleSavePhoto();
      setTimeout(() => {
        window.open('https://www.instagram.com/', '_blank');
      }, 1000);
    });

    // Download flyer directly from Post Modal
    document.getElementById('btn-download-flyer-from-post')?.addEventListener('click', () => this.handleSavePhoto());

    // Open Digital Flyer Modal Buttons
    document.getElementById('btn-open-flyer')?.addEventListener('click', () => this.openDigitalFlyerModal('stories'));
    document.getElementById('btn-open-flyer-bottom')?.addEventListener('click', () => this.openDigitalFlyerModal('stories'));
    document.getElementById('btn-mobile-flyer')?.addEventListener('click', () => this.openDigitalFlyerModal('stories'));

    // Digital Flyer Modal Events
    document.getElementById('btn-close-flyer')?.addEventListener('click', () => this.closeDigitalFlyerModal());
    document.getElementById('modal-digital-flyer')?.addEventListener('click', (e) => {
      if (e.target.id === 'modal-digital-flyer') this.closeDigitalFlyerModal();
    });

    // Flyer Format Tabs Switcher
    const flyerTabs = document.getElementById('flyer-format-tabs');
    if (flyerTabs) {
      flyerTabs.querySelectorAll('.flyer-tab-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          deviceEngine.haptic('selection');
          flyerTabs.querySelectorAll('.flyer-tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.currentFlyerFormat = btn.getAttribute('data-format') || 'stories';
          await this.renderDigitalFlyerPreview();
        });
      });
    }

    // Actions inside Digital Flyer Modal
    document.getElementById('btn-flyer-share')?.addEventListener('click', async () => {
      deviceEngine.haptic('confirm');
      const stateObj = this.states.find(s => s.uf === this.currentUf);
      const stateName = stateObj ? stateObj.nome : this.currentUf;
      this.showToast("📲 Abrindo compartilhamento nas redes sociais...", "info");
      await shareFlyerOnSocial(stateName, this.currentUf, this.selections, this.currentFlyerFormat);
    });

    document.getElementById('btn-flyer-download')?.addEventListener('click', () => this.handleSavePhoto());

    document.getElementById('btn-flyer-copy')?.addEventListener('click', async () => {
      deviceEngine.haptic('selection');
      const stateObj = this.states.find(s => s.uf === this.currentUf);
      const stateName = stateObj ? stateObj.nome : this.currentUf;
      try {
        await copyFlyerImageToClipboard(stateName, this.currentUf, this.selections, this.currentFlyerFormat);
        this.showToast("📋 Imagem copiada! Basta colar (Ctrl+V) no WhatsApp ou rede social.", "success");
      } catch (err) {
        this.showToast("Dica: Use o botão 'Baixar Imagem' para salvar no seu aparelho.", "info");
      }
    });

    document.getElementById('btn-flyer-print')?.addEventListener('click', () => {
      deviceEngine.haptic('selection');
      this.preparePrintLayout();
      window.print();
    });

    // Direct Save Photo Button
    document.getElementById('btn-save-photo')?.addEventListener('click', () => this.handleSavePhoto());
    document.getElementById('btn-save-photo-bottom')?.addEventListener('click', () => this.handleSavePhoto());

    // Mobile Bottom Bar Actions
    document.getElementById('btn-mobile-urna')?.addEventListener('click', () => {
      deviceEngine.haptic('selection');
      this.urnaSimulator.open(true);
    });
    document.getElementById('btn-mobile-state')?.addEventListener('click', () => {
      deviceEngine.haptic('selection');
      this.openWelcomeStateModal();
    });

    // Open Welcome State Modal button in top bar
    document.getElementById('btn-open-state-modal')?.addEventListener('click', () => this.openWelcomeStateModal());

    // Region tabs in Welcome Modal
    const regionTabs = document.getElementById('region-filter-tabs');
    if (regionTabs) {
      regionTabs.querySelectorAll('.region-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          deviceEngine.haptic('selection');
          regionTabs.querySelectorAll('.region-tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.currentRegionFilter = btn.getAttribute('data-region') || 'TODOS';
          this.renderWelcomeStatesGrid();
        });
      });
    }

    // Search state in Welcome Modal
    document.getElementById('input-search-state')?.addEventListener('input', () => this.renderWelcomeStatesGrid());

    CARGO_ORDER.forEach(c => {
      document.getElementById(`btn-explore-${c}`)?.addEventListener('click', () => this.openExplorer(c));
    });

    document.getElementById('btn-close-explorer')?.addEventListener('click', () => this.closeExplorer());
    document.getElementById('modal-explorer')?.addEventListener('click', (e) => {
      if (e.target.id === 'modal-explorer') this.closeExplorer();
    });

    document.getElementById('explorer-search-input')?.addEventListener('input', () => this.filterExplorer());
    document.getElementById('explorer-party-filter')?.addEventListener('change', () => this.filterExplorer());

    document.getElementById('btn-open-urna')?.addEventListener('click', () => {
      deviceEngine.haptic('selection');
      this.urnaSimulator.open(true);
    });
    document.getElementById('btn-close-urna')?.addEventListener('click', () => {
      this.urnaSimulator.close();
    });
    document.getElementById('modal-urna')?.addEventListener('click', (e) => {
      if (e.target.id === 'modal-urna') this.urnaSimulator.close();
    });

    document.getElementById('btn-clear-all')?.addEventListener('click', () => this.clearAllSelections());
  }

  async preparePrintLayout() {
    const printArea = document.getElementById('printable-cola-area');
    if (!printArea) return;

    const stateObj = this.states.find(s => s.uf === this.currentUf);
    const stateName = stateObj ? stateObj.nome : this.currentUf;

    const canvas = await generateCanvasFlyer(stateName, this.currentUf, this.selections, 'post');
    const imgData = canvas.toDataURL('image/png');

    printArea.innerHTML = `
      <div class="print-page">
        <img src="${imgData}" alt="Panfleto Digital Cola Eleitoral 2026" style="max-width:100%; height:auto;">
      </div>
    `;
  }

  showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.colaApp = new App();
});

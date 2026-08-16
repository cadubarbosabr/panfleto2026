// ==========================================================================
// URNA ELETRÔNICA SIMULATOR (TSE Model Simulation)
// Realistic Step-by-Step voting flow with LCD Screen & Keypad
// ==========================================================================

import { urnaAudio } from './audio.js';
import { panfletometro } from './counter.js';

export class UrnaSimulator {
  constructor(app) {
    this.app = app;
    this.currentStepIndex = 0;
    this.typedDigits = '';
    this.isVotoBranco = false;
    this.isFim = false;

    this.steps = [
      { key: 'deputadoFederal', cargo: 'DEPUTADO FEDERAL', digits: 4, order: 1 },
      { key: 'deputadoEstadual', cargo: 'DEPUTADO ESTADUAL', digits: 5, order: 2 },
      { key: 'senador1', cargo: 'SENADOR (1ª VAGA)', digits: 3, order: 3 },
      { key: 'senador2', cargo: 'SENADOR (2ª VAGA)', digits: 3, order: 4 },
      { key: 'governador', cargo: 'GOVERNADOR', digits: 2, order: 5 },
      { key: 'presidente', cargo: 'PRESIDENTE', digits: 2, order: 6 }
    ];

    this.initDOM();
  }

  initDOM() {
    this.modal = document.getElementById('modal-urna');
    this.screenCargo = document.getElementById('urna-cargo-title');
    this.screenDigitsContainer = document.getElementById('urna-digits-box');
    this.screenName = document.getElementById('urna-cand-name');
    this.screenParty = document.getElementById('urna-cand-party');
    this.screenViceRow = document.getElementById('urna-vice-row');
    this.screenViceName = document.getElementById('urna-vice-name');
    this.screenPhotoBox = document.getElementById('urna-photo-box');
    this.screenPhoto = document.getElementById('urna-photo-img');
    this.screenNotice = document.getElementById('urna-screen-notice');
    this.screenFim = document.getElementById('urna-screen-fim');
    this.screenActive = document.getElementById('urna-screen-active');

    this.setupKeypad();
  }

  setupKeypad() {
    const keypad = document.getElementById('urna-keypad');
    if (!keypad) return;

    keypad.querySelectorAll('.key-num').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const num = btn.getAttribute('data-num');
        this.pressDigit(num);
      });
    });

    const btnBranco = document.getElementById('btn-urna-branco');
    const btnCorrige = document.getElementById('btn-urna-corrige');
    const btnConfirma = document.getElementById('btn-urna-confirma');

    if (btnBranco) btnBranco.addEventListener('click', () => this.pressBranco());
    if (btnCorrige) btnCorrige.addEventListener('click', () => this.pressCorrige());
    if (btnConfirma) btnConfirma.addEventListener('click', () => this.pressConfirma());

    // Physical keyboard support when modal is open
    window.addEventListener('keydown', (e) => {
      if (!this.modal || !this.modal.classList.contains('open')) return;
      if (e.key >= '0' && e.key <= '9') {
        this.pressDigit(e.key);
      } else if (e.key === 'Backspace' || e.key === 'Escape') {
        this.pressCorrige();
      } else if (e.key === 'Enter') {
        this.pressConfirma();
      }
    });
  }

  open(useCola = true) {
    this.modal.classList.add('open');
    this.currentStepIndex = 0;
    this.isFim = false;
    
    // Adjust cargo name for DF if needed
    if (this.app.currentUf === 'DF') {
      this.steps[1].cargo = 'DEPUTADO DISTRITAL';
    } else {
      this.steps[1].cargo = 'DEPUTADO ESTADUAL';
    }

    if (useCola) {
      this.loadStepWithCola();
    } else {
      this.resetStep();
    }
  }

  close() {
    this.modal.classList.remove('open');
  }

  getCurrentStep() {
    return this.steps[this.currentStepIndex];
  }

  loadStepWithCola() {
    const step = this.getCurrentStep();
    const sel = this.app.selections[step.key];
    this.typedDigits = sel && sel.nr ? sel.nr : '';
    this.isVotoBranco = sel && sel.tipo === 'branco';
    this.renderScreen();
  }

  resetStep() {
    this.typedDigits = '';
    this.isVotoBranco = false;
    this.renderScreen();
  }

  pressDigit(digit) {
    if (this.isFim || this.isVotoBranco) return;
    const step = this.getCurrentStep();
    if (this.typedDigits.length < step.digits) {
      this.typedDigits += digit;
      if ('vibrate' in navigator) navigator.vibrate(25);
      urnaAudio.playKey();
      this.renderScreen();
    }
  }

  pressBranco() {
    if (this.isFim) return;
    if (this.typedDigits.length === 0) {
      this.isVotoBranco = true;
      if ('vibrate' in navigator) navigator.vibrate(30);
      urnaAudio.playKey();
      this.renderScreen();
    } else {
      if ('vibrate' in navigator) navigator.vibrate([40, 40, 40]);
      urnaAudio.playError();
    }
  }

  pressCorrige() {
    if (this.isFim) return;
    if ('vibrate' in navigator) navigator.vibrate(30);
    urnaAudio.playCorrige();
    this.resetStep();
  }

  pressConfirma() {
    if (this.isFim) return;
    const step = this.getCurrentStep();

    if (!this.isVotoBranco && this.typedDigits.length < step.digits) {
      if ('vibrate' in navigator) navigator.vibrate([50, 50, 50]);
      urnaAudio.playError();
      return;
    }

    if ('vibrate' in navigator) navigator.vibrate(40);
    urnaAudio.playKey();

    // Advance to next step
    this.currentStepIndex++;
    if (this.currentStepIndex < this.steps.length) {
      this.loadStepWithCola();
    } else {
      // Completed all votes! Show FIM!
      this.showFim();
    }
  }

  showFim() {
    this.isFim = true;
    this.screenActive.style.display = 'none';
    this.screenFim.style.display = 'flex';
    urnaAudio.playConfirmaFim();
    panfletometro.increment(1, true);

    setTimeout(() => {
      if (this.modal.classList.contains('open')) {
        // Can offer to restart or close
      }
    }, 4000);
  }

  findCandidate(stepKey, number) {
    const list = this.app.getCandidateListForCargo(stepKey);
    return list.find(c => c.nr === number);
  }

  renderScreen() {
    if (this.isFim) return;
    this.screenActive.style.display = 'flex';
    this.screenFim.style.display = 'none';

    const step = this.getCurrentStep();
    this.screenCargo.textContent = step.cargo;

    // Render digit boxes
    this.screenDigitsContainer.innerHTML = '';
    for (let i = 0; i < step.digits; i++) {
      const box = document.createElement('div');
      box.className = 'urna-screen-digit';
      const char = this.typedDigits[i] || '';
      box.textContent = char;
      if (!char && i === this.typedDigits.length && !this.isVotoBranco) {
        box.classList.add('blinking');
      }
      this.screenDigitsContainer.appendChild(box);
    }

    // Check candidate
    if (this.isVotoBranco) {
      this.screenDigitsContainer.innerHTML = '<span style="font-weight:900;font-size:1.5rem;color:#0f172a;">VOTO EM BRANCO</span>';
      this.screenName.textContent = '—';
      this.screenParty.textContent = '—';
      this.screenViceRow.style.display = 'none';
      this.screenPhotoBox.style.display = 'none';
      this.screenNotice.innerHTML = 'Voto em branco.<br>Aperte <strong>CONFIRMA</strong> para registrar ou <strong>CORRIGE</strong> para reiniciar.';
      return;
    }

    if (this.typedDigits.length === step.digits) {
      const cand = this.findCandidate(step.key, this.typedDigits);
      if (cand) {
        this.screenName.textContent = cand.nm;
        this.screenParty.textContent = `${cand.sg} ${cand.fed ? '(' + cand.fed + ')' : ''}`;
        
        if (cand.vices && cand.vices.length > 0) {
          this.screenViceRow.style.display = 'flex';
          this.screenViceName.textContent = cand.vices[0].nm;
        } else if (cand.suplentes && cand.suplentes.length > 0) {
          this.screenViceRow.style.display = 'flex';
          this.screenViceName.textContent = `1º: ${cand.suplentes[0].nm}`;
        } else {
          this.screenViceRow.style.display = 'none';
        }

        this.screenPhotoBox.style.display = 'flex';
        this.screenPhoto.src = `fotos/${cand.foto}`;
        this.screenPhoto.onerror = () => {
          this.screenPhoto.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="150" viewBox="0 0 120 150"><rect width="100%" height="100%" fill="%23cbd5e1"/><circle cx="60" cy="55" r="30" fill="%2394a3b8"/><path d="M20,130 C20,95 100,95 100,130" fill="%2394a3b8"/></svg>';
        };

        this.screenNotice.innerHTML = 'Aperte a tecla:<br><strong>VERDE</strong> para CONFIRMAR<br><strong>LARANJA</strong> para CORRIGIR';
      } else {
        // Unknown candidate / Voto Nulo
        this.screenName.textContent = 'NÚMERO ERRADO';
        this.screenParty.textContent = '—';
        this.screenViceRow.style.display = 'none';
        this.screenPhotoBox.style.display = 'none';
        this.screenNotice.innerHTML = '<span style="color:#b91c1c;font-weight:800;">VOTO NULO</span><br>Aperte <strong>VERDE</strong> para CONFIRMAR ou <strong>LARANJA</strong> para CORRIGIR.';
      }
    } else {
      this.screenName.textContent = '—';
      this.screenParty.textContent = '—';
      this.screenViceRow.style.display = 'none';
      this.screenPhotoBox.style.display = 'none';
      this.screenNotice.innerHTML = 'Digite o número do seu candidato.';
    }
  }
}

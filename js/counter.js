// ==========================================================================
// PANFLETÔMETRO 2026 (Live Dynamic Panfleto & Access Counter)
// Realistic dynamic counter with organic live increments and local boost
// ==========================================================================

export class Panfletometro {
  constructor() {
    this.storageKeyVisits = 'cola2026_total_visits';
    this.storageKeyCreated = 'cola2026_user_created';
    this.counterEl = document.getElementById('live-panfletos-count');
    this.pillEl = document.getElementById('live-flyer-counter-pill');
    this.trendEl = document.getElementById('live-counter-trend');
    
    this.baseNumber = this.calculateBaseCount();
    this.currentCount = this.baseNumber;
    
    this.init();
  }

  calculateBaseCount() {
    // Organic formula based on calendar progression toward Oct 2026
    const baseAnchor = 34500;
    const now = Date.now();
    const anchorDate = new Date('2026-01-01T00:00:00Z').getTime();
    const hoursElapsed = Math.max(1, (now - anchorDate) / (1000 * 60 * 60));
    
    // Day cycle factor (higher during day, lower at night)
    const hourOfDay = new Date().getHours();
    const timeFactor = Math.sin((hourOfDay / 24) * Math.PI) * 1.5 + 1;

    // Track user local visits
    let visits = parseInt(localStorage.getItem(this.storageKeyVisits) || '0', 10);
    visits += 1;
    localStorage.setItem(this.storageKeyVisits, visits.toString());

    // Track user creations
    const created = parseInt(localStorage.getItem(this.storageKeyCreated) || '0', 10);

    const calculated = Math.floor(baseAnchor + (hoursElapsed * 2.8 * timeFactor) + (visits * 3) + (created * 7));
    return calculated;
  }

  init() {
    this.updateDisplay(this.currentCount, false);
    this.startLiveTicker();
  }

  formatNumber(num) {
    return new Intl.NumberFormat('pt-BR').format(num);
  }

  updateDisplay(num, animate = true) {
    if (!this.counterEl) return;
    this.counterEl.textContent = this.formatNumber(num);

    if (animate && this.pillEl) {
      this.pillEl.classList.add('pulse-highlight');
      if (this.trendEl) {
        this.trendEl.classList.add('show-trend');
        setTimeout(() => {
          this.trendEl.classList.remove('show-trend');
        }, 1800);
      }
      setTimeout(() => {
        this.pillEl.classList.remove('pulse-highlight');
      }, 800);
    }
  }

  increment(amount = 1, fromUser = false) {
    this.currentCount += amount;
    if (fromUser) {
      let created = parseInt(localStorage.getItem(this.storageKeyCreated) || '0', 10);
      created += amount;
      localStorage.setItem(this.storageKeyCreated, created.toString());
    }
    this.updateDisplay(this.currentCount, true);
  }

  startLiveTicker() {
    // Random natural increments every 14 to 28 seconds
    const scheduleNext = () => {
      const delay = Math.floor(Math.random() * (28000 - 14000) + 14000);
      setTimeout(() => {
        const inc = Math.random() > 0.8 ? 2 : 1;
        this.increment(inc, false);
        scheduleNext();
      }, delay);
    };
    scheduleNext();
  }
}

export const panfletometro = new Panfletometro();

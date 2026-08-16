// ==========================================================================
// SILENT DEVICE MAPPING & MOBILE OPTIMIZATION ENGINE (ANDROID & iOS)
// ==========================================================================

export class DeviceEngine {
  constructor() {
    this.profile = this.detectDeviceProfile();
    this.applyProfileToDOM();
    this.setupViewportUnits();
    this.setupWindowListeners();
  }

  detectDeviceProfile() {
    const ua = navigator.userAgent || navigator.vendor || window.opera || '';
    const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/i.test(ua);
    const isMobile = isIOS || isAndroid || /webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const aspectRatio = Math.max(screenWidth, screenHeight) / Math.min(screenWidth, screenHeight);
    const hasNotch = aspectRatio > 2.0 || (window.visualViewport && window.visualViewport.height < window.innerHeight);

    let screenCategory = 'large';
    if (window.innerWidth <= 380) {
      screenCategory = 'compact'; // iPhone SE, Xperia Compact, small Androids
    } else if (window.innerWidth <= 435) {
      screenCategory = 'medium';  // iPhone 14/15/16 Pro, Galaxy S23/S24, Pixel 8
    }

    let modelFamily = 'Desktop / Browser';
    if (isIOS) {
      modelFamily = /iPad/.test(ua) ? 'Apple iPad' : 'Apple iPhone';
    } else if (isAndroid) {
      if (/Samsung|SM-|GT-/i.test(ua)) modelFamily = 'Samsung Galaxy';
      else if (/Xiaomi|Redmi|POCO/i.test(ua)) modelFamily = 'Xiaomi';
      else if (/Motorola|Moto/i.test(ua)) modelFamily = 'Motorola';
      else if (/Pixel/i.test(ua)) modelFamily = 'Google Pixel';
      else modelFamily = 'Android Device';
    }

    return {
      isIOS,
      isAndroid,
      isMobile,
      isTouch,
      isStandalone,
      hasNotch,
      screenCategory,
      modelFamily,
      pixelRatio: window.devicePixelRatio || 1,
      supportsHaptics: 'vibrate' in navigator
    };
  }

  applyProfileToDOM() {
    const docEl = document.documentElement;
    const p = this.profile;

    if (p.isIOS) docEl.classList.add('platform-ios');
    if (p.isAndroid) docEl.classList.add('platform-android');
    if (p.isTouch) docEl.classList.add('device-touch');
    if (p.isStandalone) docEl.classList.add('is-standalone');
    if (p.hasNotch) docEl.classList.add('device-notch');

    docEl.classList.add(`screen-${p.screenCategory}`);
  }

  setupViewportUnits() {
    const updateVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    updateVH();
    window.addEventListener('resize', updateVH, { passive: true });
    window.addEventListener('orientationchange', () => setTimeout(updateVH, 150), { passive: true });
  }

  setupWindowListeners() {
    // Dynamic resize handler for screen category updates
    window.addEventListener('resize', () => {
      const docEl = document.documentElement;
      docEl.classList.remove('screen-compact', 'screen-medium', 'screen-large');
      if (window.innerWidth <= 380) docEl.classList.add('screen-compact');
      else if (window.innerWidth <= 435) docEl.classList.add('screen-medium');
      else docEl.classList.add('screen-large');
    }, { passive: true });
  }

  /**
   * Optimized Tactile Haptic Vibration for Android & iOS micro-feedback
   */
  haptic(type = 'light') {
    if (this.profile.supportsHaptics) {
      try {
        switch (type) {
          case 'selection':
            navigator.vibrate(20);
            break;
          case 'step':
            navigator.vibrate([15, 25, 20]);
            break;
          case 'confirm':
            navigator.vibrate([30, 40, 50]);
            break;
          case 'warning':
            navigator.vibrate([40, 50, 40]);
            break;
          default:
            navigator.vibrate(15);
            break;
        }
      } catch (e) {
        // Silent catch
      }
    }
  }
}

export const deviceEngine = new DeviceEngine();

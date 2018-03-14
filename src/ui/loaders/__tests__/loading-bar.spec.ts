import { LoadingBar } from '../loading-bar';

describe('Class', () => {
  describe('LoadingBar', () => {
    describe('constructor', () => {
      it('should generate an id property', () => {
        const loading = new LoadingBar();
        expect(loading.id).toBeDefined();
      });
      it('should define the bar property', () => {
        const loading = new LoadingBar();
        expect(loading.bar).toBeDefined();
      });
      it('should set the bars class to the CLASS_NAME property', () => {
        const loading = new LoadingBar();
        expect(loading.bar.className).toBe(LoadingBar.CLASS_NAME);
      });
    });
    describe('calculatePercentage()', () => {
      it('should return a rounded string percentage value', () => {
        expect(LoadingBar.calculatePecentage(2, 4)).toBe(50);
        expect(LoadingBar.calculatePecentage(1.9999999, 4)).toBe(50);
      });
    });
    describe('showBar()', () => {
      it('should add the active classname to the bar element', () => {
        const loading = new LoadingBar();
        loading.showBar();
        expect(loading.bar.classList.contains(LoadingBar.CLASS_NAME_ACTIVE)).toBe(true);
      });
    });
    describe('hideBar()', () => {
      it('should remove the active classname to the bar element', () => {
        const loading = new LoadingBar();
        loading.bar.className = LoadingBar.CLASS_NAME_ACTIVE;
        loading.hideBar();
        expect(loading.bar.classList.contains(LoadingBar.CLASS_NAME_ACTIVE)).toBe(false);
      });
    });
    describe('setProgress()', () => {
      it('should set the width of the bar to a percentage string', () => {
        const loading = new LoadingBar();
        loading.setProgress(10);
        expect(loading.bar.style.width).toBe('10%');
      });
    });
  });
});

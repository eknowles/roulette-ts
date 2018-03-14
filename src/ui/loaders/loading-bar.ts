import { DefaultLoadingManager } from 'three';

/**
 * This class handles the UI for the loading bar at the top of the page
 */
export class LoadingBar {
  public static CLASS_NAME = 'loading-bar';
  public static CLASS_NAME_ACTIVE = `${LoadingBar.CLASS_NAME}--active`;
  public static calculatePecentage(items: number, total: number) {
    return Math.round((items / total) * 100);
  }
  public id: string;
  public bar: HTMLElement | null;

  constructor() {
    this.id = `loading-bar-${Math.round(Math.random() * 1000)}`;
    this.bar = this.createBarElement();

    DefaultLoadingManager.onStart = this.onStart.bind(this);
    DefaultLoadingManager.onLoad = this.onLoad.bind(this);
    DefaultLoadingManager.onProgress = this.onProgress.bind(this);
    DefaultLoadingManager.onError = this.onError.bind(this);
  }

  public showBar() {
    this.bar.classList.add(LoadingBar.CLASS_NAME_ACTIVE);
  }

  public hideBar() {
    this.bar.classList.remove(LoadingBar.CLASS_NAME_ACTIVE);
  }

  public setProgress(pct: number) {
    this.bar.style.width = `${pct}%`;
  }

  private onStart(url: string, itemsLoaded: number, itemsTotal: number) {
    this.setProgress(LoadingBar.calculatePecentage(itemsLoaded, itemsTotal));
    this.showBar();
  }

  private onLoad() {
    this.hideBar();
    this.setProgress(0);
  }

  private onProgress(url: string, itemsLoaded: number, itemsTotal: number) {
    this.setProgress(LoadingBar.calculatePecentage(itemsLoaded, itemsTotal));
  }

  private onError(url: string) {
    this.hideBar();
  }

  private createBarElement() {
    const container = document.createElement('div');

    container.className = LoadingBar.CLASS_NAME;
    container.setAttribute('id', this.id);
    document.body.appendChild(container);

    return container;
  }
}

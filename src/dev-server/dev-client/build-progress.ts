import * as d from '../../declarations';
import { onBuildLog, onBuildResults } from './build-events';


export function initBuildProgress(win: d.DevClientWindow, doc: Document) {
  const PROGRESS_BAR_ID = `dev-server-progress`;
  const barColor = `#5851ff`;
  const errorColor = `#b70c19`;
  let removeTimerId: any;
  let opacityTimerId: any;
  let incIntervalId: any;
  let progressIncrease: number;
  let currentProgress = 0;

  function update() {
    clearTimeout(opacityTimerId);
    clearTimeout(removeTimerId);

    let progressBar = doc.getElementById(PROGRESS_BAR_ID);
    if (!progressBar) {
      progressBar = doc.createElement('div');
      progressBar.id = PROGRESS_BAR_ID;
      progressBar.style.position = `absolute`;
      progressBar.style.top = `0`;
      progressBar.style.left = `0`;
      progressBar.style.zIndex = `100001`;
      progressBar.style.width = `100%`;
      progressBar.style.height = `2px`;
      progressBar.style.transform = `scaleX(0)`;
      progressBar.style.opacity = `1`;
      progressBar.style.background = barColor;
      progressBar.style.transformOrigin = `left center`;
      progressBar.style.transition = `transform .1s ease-in-out, opacity .5s ease-in`;
      (progressBar.style as any).contain = `strict`;
      doc.body.appendChild(progressBar);
      requestAnimationFrame(update);
      return;
    }
    progressBar.style.background = barColor;
    progressBar.style.opacity = `1`;
    progressBar.style.transform = `scaleX(${Math.min(1, displayProgress())})`;

    if (incIntervalId == null) {
      incIntervalId = setInterval(() => {
        progressIncrease += (Math.random() * 0.05) + 0.01;
        if (displayProgress() < 0.9) {
          update();
        } else {
          clearInterval(incIntervalId);
        }
      }, 800);
    }
  }

  function reset() {
    clearInterval(incIntervalId);
    progressIncrease = 0.05;
    incIntervalId = null;
    clearTimeout(opacityTimerId);
    clearTimeout(removeTimerId);

    const progressBar = doc.getElementById(PROGRESS_BAR_ID);
    if (progressBar) {
      if (currentProgress >= 1) {
        progressBar.style.transform = `scaleX(1)`;
      }

      opacityTimerId = setTimeout(() => {
        try {
          progressBar.style.opacity = `0`;
        } catch (e) {}
      }, 150);

      removeTimerId = setTimeout(() => {
        try {
          progressBar.parentNode.removeChild(progressBar);
        } catch (e) {}
      }, 1000);
    }
  }

  function displayProgress() {
    const p = (currentProgress + progressIncrease);
    return Math.max(0, Math.min(1, p));
  }

  reset();

  onBuildLog(win, buildLog => {
    currentProgress = buildLog.progress;

    if (currentProgress >= 0 && currentProgress < 1) {
      update();
    } else {
      reset();
    }
  });

  onBuildResults(win, buildResults => {
    if (buildResults.hasError) {
      const progressBar = doc.getElementById(PROGRESS_BAR_ID);
      if (progressBar) {
        progressBar.style.transform = `scaleX(1)`;
        progressBar.style.background = errorColor;
      }
    }
    reset();
  });

  if (doc.head.dataset.tmpl === 'tmpl-initial-load') {
    update();
  }
}

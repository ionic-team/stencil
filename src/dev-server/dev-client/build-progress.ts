import * as d from '../../declarations';


export function initBuildProgress(win: Window, doc: Document) {
  const PROGRESS_BAR_ID = `dev-server-progress`;
  let removeTimerId: any;
  let opacityTimerId: any;
  let incIntervalId: any;
  let progressIncrease: number;
  let currentProgress = 0;
  let lastProgress = 0;
  let lastUpdate: number;

  function update() {
    clearTimeout(opacityTimerId);
    clearTimeout(removeTimerId);

    let progressBar = doc.getElementById(PROGRESS_BAR_ID);
    if (!progressBar) {
      progressBar = doc.createElement('div');
      progressBar.id = PROGRESS_BAR_ID;
      progressBar.style.position = `absolute`;
      progressBar.style.zIndex = `100001`;
      progressBar.style.width = `100%`;
      progressBar.style.height = `2px`;
      progressBar.style.transform = `scaleX(0)`;
      progressBar.style.background = `#5851ff`;
      progressBar.style.transformOrigin = `left center`;
      progressBar.style.transition = `transform .5s ease-in-out, opacity .5s ease-in`;
      (progressBar.style as any).contain = `strict`;
      doc.body.appendChild(progressBar);
    }
    progressBar.style.opacity = `1`;

    if (Date.now() > lastUpdate + 800 && displayProgress() > lastProgress + 0.05) {
      progressBar.style.transform = `scaleX(${Math.min(1, displayProgress())})`;
      lastUpdate = Date.now();
      lastProgress = displayProgress();
    }

    if (incIntervalId == null) {
      incIntervalId = setInterval(() => {
        progressIncrease += 0.02;
        if (displayProgress() < 0.8) {
          update();
        } else {
          clearInterval(incIntervalId);
        }
      }, 200);
    }
  }

  function reset() {
    lastUpdate = 0;
    lastProgress = 0;
    clearInterval(incIntervalId);
    progressIncrease = 0.02;
    incIntervalId = null;
    clearTimeout(opacityTimerId);
    clearTimeout(removeTimerId);

    const progressBar = doc.getElementById(PROGRESS_BAR_ID);
    if (progressBar && progressBar.parentNode) {
      if (currentProgress >= 1) {
        progressBar.style.transform = `scaleX(1)`;
      }

      opacityTimerId = setTimeout(() => {
        try {
          progressBar.style.opacity = `0`;
        } catch (e) {}
      }, 750);

      removeTimerId = setTimeout(() => {
        try {
          progressBar.parentNode.removeChild(progressBar);
        } catch (e) {}
      }, 2000);
    }
  }

  function displayProgress() {
    const p = (currentProgress + progressIncrease);
    return Math.max(0, Math.min(1, p));
  }

  reset();

  win.addEventListener('buildLog', (ev: any) => {
    const buildLog: d.BuildLog = ev.detail;
    currentProgress = buildLog.progress;

    if (currentProgress >= 0 && currentProgress < 1) {
      update();
    } else {
      reset();
    }
  });
}

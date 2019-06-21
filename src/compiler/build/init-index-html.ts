import * as d from '../../declarations';
import { catchError } from '@utils';
import { isOutputTargetWww } from '../output-targets/output-utils';


export async function initIndexHtmls(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  // The initial loading page connects with the stencil's devServer
  // If we are building without server, it does not make sense to write the
  // initial index.html
  if (config.flags.serve) {
    await Promise.all(config.outputTargets.map(async outputTarget => {
      await initIndexHtml(config, compilerCtx, buildCtx, outputTarget);
    }));
  }
}


async function initIndexHtml(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTarget) {
  // if there isn't an index.html yet
  // let's generate a slim one quick so that
  // on the first build the user sees a loading indicator
  // this is synchronous on purpose so that it's saved
  // before the dev server fires up and loads the index.html page

  if (isOutputTargetWww(outputTarget)) {
    // only worry about this when generating www directory

    // check if there's even a src index.html file
    const hasSrcIndexHtml = await compilerCtx.fs.access(config.srcIndexHtml);
    if (!hasSrcIndexHtml) {
      // there is no src index.html file in the config, which is fine
      // since there is no src index file at all, don't bother
      // this isn't actually an error, don't worry about it
      return;
    }

    if (compilerCtx.hasSuccessfulBuild) {
      // we've already had a successful build, we're good
      // always recopy index.html (it's all cached if it didn't actually change, all good)
      const srcIndexHtmlContent = await compilerCtx.fs.readFile(config.srcIndexHtml);
      await compilerCtx.fs.writeFile(outputTarget.indexHtml, srcIndexHtmlContent);
      return;
    }

    try {
      // ok, so we haven't written an index.html build file yet
      // and we do know they have a src one, so let's write a
      // filler index.html file that shows while the first build is happening
      await compilerCtx.fs.writeFile(outputTarget.indexHtml, APP_LOADING_HTML);
      await compilerCtx.fs.commit();

    } catch (e) {
      catchError(buildCtx.diagnostics, e);
    }
  }
}


const APP_LOADING_HTML = `
<!DOCTYPE html>
<html dir="ltr" lang="en" data-init="app-dev-first-build-loader">
<head>
  <script>
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(function(registration) {
        registration.unregister();
      });
    }
  </script>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta http-equiv="x-ua-compatible" content="IE=Edge">
  <title>Initializing First Build...</title>
  <style>
    * {
      box-sizing: border-box;
    }
    body {
      position: absolute;
      padding: 0;
      margin: 0;
      width: 100%;
      height: 100%;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    }
    .toast {
      position: absolute;
      top: 10px;
      right: 10px;
      left: 10px;
      margin: auto;
      max-width: 700px;
      border-radius: 3px;
      background: rgba(0,0,0,.9);
      -webkit-transform: translate3d(0px, -60px, 0px);
      transform: translate3d(0px, -60px, 0px);
      -webkit-transition: -webkit-transform 75ms ease-out;
      transition: transform 75ms ease-out;
      pointer-events: none;
    }

    .active {
      -webkit-transform: translate3d(0px, 0px, 0px);
      transform: translate3d(0px, 0px, 0px);
    }

    .content {
      display: flex;
      -webkit-align-items: center;
      -ms-flex-align: center;
      align-items: center;
      pointer-events: auto;
    }

    .message {
      -webkit-flex: 1;
      -ms-flex: 1;
      flex: 1;
      padding: 15px;
      font-size: 14px;
      color: #fff;
    }

    .spinner {
      position: relative;
      display: inline-block;
      width: 56px;
      height: 28px;
    }

    svg:not(:root) {
      overflow: hidden;
    }

    svg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
      -webkit-animation: rotate 600ms linear infinite;
      animation: rotate 600ms linear infinite;
    }

    @-webkit-keyframes rotate {
      0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }

    @keyframes rotate {
      0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }

    svg circle {
      fill: transparent;
      stroke: white;
      stroke-width: 4px;
      stroke-dasharray: 128px;
      stroke-dashoffset: 82px;
    }
  </style>
</head>
<body>

  <div class="toast">
    <div class="content">
      <div class="message">Initializing First Build...</div>
      <div class="spinner">
        <svg viewBox="0 0 64 64"><circle transform="translate(32,32)" r="26"></circle></svg>
      </div>
    </div>
  </div>

  <script>
    setTimeout(function() {
      document.querySelector('.toast').classList.add('active');
    }, 100);

    var tmrId = setInterval(function() {
      try {
        var url = window.location.pathname + '?r=' + Date.now();
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('load', function() {
          try {
            if (this.status < 300) {
              if (this.responseText.indexOf('app-dev-first-build-loader') === -1) {
                window.location.reload(true);
              }
            } else if (window.location.pathname !== '/') {
              url = '/?r=' + Date.now();

            } else if (this.status > 299) {
              clearInterval(tmrId);
            }

          } catch (e) {
            console.error(e);
          }
        });
        xhr.open('GET', url);
        xhr.send();
      } catch (e) {
        console.error(e);
      }
    }, 1000);
  </script>

</body>
</html>
`;

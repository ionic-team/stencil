import { fork } from 'child_process';
import path from 'path';
export function initServerProcessWorkerProxy(sendToMain) {
    const workerPath = require.resolve(path.join(__dirname, 'server-worker-thread.js'));
    const filteredExecArgs = process.execArgv.filter((v) => !/^--(debug|inspect)/.test(v));
    const forkOpts = {
        execArgv: filteredExecArgs,
        env: process.env,
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
    };
    // start a new child process of the CLI process
    // for the http and web socket server
    let serverProcess = fork(workerPath, [], forkOpts);
    const receiveFromMain = (msg) => {
        // get a message from main to send to the worker
        if (serverProcess) {
            serverProcess.send(msg);
        }
        else if (msg.closeServer) {
            sendToMain({ serverClosed: true });
        }
    };
    // get a message from the worker and send it to main
    serverProcess.on('message', (msg) => {
        if (msg.serverClosed && serverProcess) {
            serverProcess.kill('SIGINT');
            serverProcess = null;
        }
        sendToMain(msg);
    });
    serverProcess.stdout.on('data', (data) => {
        // the child server process has console logged data
        console.log(`dev server: ${data}`);
    });
    serverProcess.stderr.on('data', (data) => {
        // the child server process has console logged an error
        sendToMain({ error: { message: 'stderr: ' + data } });
    });
    return receiveFromMain;
}
//# sourceMappingURL=server-worker-main.js.map
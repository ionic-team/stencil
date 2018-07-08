import * as d from '../../../declarations';


export class WorkerChild {

  constructor(private process: NodeJS.Process, private runner: d.WorkerRunner) {}

  async receiveMessageFromMain(msgFromMain: d.WorkerMessage) {
    if (msgFromMain.exit) {
      this.exit();
    }

    const msgToMain: d.WorkerMessage = {
      taskId: msgFromMain.taskId
    };

    try {
      msgToMain.value = await this.runner(msgFromMain.method, msgFromMain.args);

    } catch (e) {
      if (typeof e === 'string') {
        msgToMain.error = e;
      } else if (e && e.message) {
        msgToMain.error = e.message + '';
      } else {
        msgToMain.error = 'worker error';
      }
    }

    this.sendMessageToMain(msgToMain);
  }

  sendMessageToMain(msg: d.WorkerMessage) {
    this.process.send(msg, (err: NodeJS.ErrnoException) => {
      if (err && err.code === 'ERR_IPC_CHANNEL_CLOSED') {
        this.exit();
      }
    });
  }

  exit() {
    this.process.exit(0);
  }
}


export function attachMessageHandler(process: NodeJS.Process, runner: d.WorkerRunner) {
  const w = new WorkerChild(process, runner);
  process.on('message', w.receiveMessageFromMain.bind(w));
}

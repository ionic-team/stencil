import * as http  from 'http';
import { responseHeaders, sendError } from './util';


export function serve500(res: http.ServerResponse, error: any) {
  try {
    res.writeHead(500, responseHeaders({
      'Content-Type': 'text/plain'
    }));

    let errorMsg = '';

    if (typeof error === 'string') {
      errorMsg = error;

    } else if (error) {
      if (error.message) {
        errorMsg += error.message + '\n';
      }
      if (error.stack) {
        errorMsg += error.stack + '\n';
      }
    }

    res.write(errorMsg);
    res.end();

  } catch (e) {
    sendError(process, 'serve500: ' + e);
  }
}

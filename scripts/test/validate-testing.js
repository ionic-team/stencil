var testing = require('../../testing/index.js');

var input = `
import { Component, Prop } from '@stencil/core';
@Component({
  tag: 'my-cmp'
})
export class MyCmp {
  @Prop() prop: boolean;
}
`;

var output = testing.transpile(input);

if (output.diagnostics.length > 0) {
  var msg = output.diagnostics.map((d) => d.messageText).join('\n');
  throw new Error('Testing transpile error: \n' + msg);
}

console.log(`🐠  Validated testing suite`);

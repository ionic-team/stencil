import { setMode } from '@stencil/core';

console.log('after');
setMode(() => 'md');
console.log('before');

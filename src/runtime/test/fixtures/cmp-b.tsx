import { Component, Mixin } from '@stencil/core';
import { CmpA } from './cmp-a';

@Mixin(CmpA)
@Component({
  tag: 'cmp-b',
  shadow: true,
})
export class CmpB {}
export interface CmpB extends CmpA {}

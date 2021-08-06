import { Component, Mixin } from '@stencil/core';
import { CmpA } from './cmp-a';

@Mixin(CmpA)
@Component({
  tag: 'cmp-b',
  styleUrl: 'cmp-a.css',
  shadow: true,
})
export class CmpB {}

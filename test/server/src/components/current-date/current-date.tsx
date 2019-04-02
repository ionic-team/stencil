import { Component, h } from '@stencil/core';


@Component({
  tag: 'current-date',
  styleUrl: 'current-date.css'
})
export class CurrentDate {
  render() {
    return <span>{(new Date()).toUTCString()}</span>;
  }
}
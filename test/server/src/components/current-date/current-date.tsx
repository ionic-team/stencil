import { Component } from '../../../../../dist/index';


@Component({
  tag: 'current-date',
  styleUrl: 'current-date.css'
})
export class CurrentDate {
  render() {
    return <span>{(new Date()).toUTCString()}</span>;
  }
}
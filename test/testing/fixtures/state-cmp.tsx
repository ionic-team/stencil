import { Component, State } from '../../../dist/index';

@Component({
  tag: 'day-button-list',
  styleUrl: 'day-button-list.css'
})
export class DaysButtonList {

  @State() days: DaySelection[] = [
    { label: 'Su', selected: true },
    { label: 'M', selected: true },
    { label: 'Tu', selected: true },
    { label: 'W', selected: true },
    { label: 'Th', selected: true },
    { label: 'F', selected: true },
    { label: 'Sa', selected: true }
  ];

  private handleDayClicked(day: DaySelection) {
    day.selected = !day.selected;
    this.days = [... this.days];
  }

  private selectedClass(day: DaySelection) {
    return day.selected === true ? 'selected' : '';
  }

  render() {
    return (
      <div class="form-group" id="days-form-group">
        <label>What days would you like notifications?</label>
        <div class="schedule-days-container">
          { this.days.map(day =>
            <div class={'day-button btn ' + this.selectedClass(day)} onClick={() => this.handleDayClicked(day)}>{day.label}</div>
          )}
        </div>
      </div>
    );
  }
}

export interface DaySelection {
  label: string;
  selected: boolean
}

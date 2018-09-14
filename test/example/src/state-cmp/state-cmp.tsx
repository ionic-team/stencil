import { Component, State } from '../../../../dist/index';

@Component({
  tag: 'state-cmp',
  styles: `.selected { font-weight: bold }`,
  shadow: true
})
export class StateCmp {

  @State() selected: string;

  days: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  dayClicked(day: string) {
    this.selected = day;
  }

  render() {
    return (
      <section>
        <label>What is your favorite day?</label>
        <div>
          {this.days.map(day =>
            <button
              class={day === this.selected ? 'selected' : ''}
              onClick={() => this.dayClicked(day)}
              key={day}>
                {day}
            </button>
          )}
        </div>
      </section>
    );
  }
}

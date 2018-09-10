import { Component, Event, EventEmitter, Prop } from '../../../../dist/index';
import { CarData } from './car-data';


@Component({
  tag: 'car-list',
  styleUrl: 'car-list.css',
  shadow: true
})
export class CarList {
  @Prop() cars: CarData[];
  @Prop({ mutable: true }) selected: CarData;
  @Event() carSelected: EventEmitter<CarData>;

  selectCar(car: CarData) {
    this.selected = car;
    this.carSelected.emit(car);
  }

  render() {
    if (!Array.isArray(this.cars)) {
      return null;
    }

    return (
      <ul>
        {this.cars.map(car => {
          return (
            <li class={car === this.selected ? 'selected' : ''} onClick={() => this.selectCar(car)}>
              <car-detail car={car}></car-detail>
            </li>
          );
        })}
      </ul>
    );
  }
}

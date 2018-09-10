import { Component, Prop } from '../../../../dist/index';
import { CarData } from '../car-list/car-data';


@Component({
  tag: 'car-detail',
  styleUrl: 'car-detail.css'
})
export class CarDetail {
  @Prop() car: CarData;

  render() {
    if (!this.car) {
      return null;
    }

    return (
      <section>
        {this.car.year} {this.car.make} {this.car.model}
      </section>
    );
  }
}

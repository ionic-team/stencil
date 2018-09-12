import { Component, Prop } from '../../../../dist';

@Component({
  tag: 'lifecycle-on-ready-c'
})
export class LifecycleOnReadyC {

  @Prop() value = 0;
  start: number;

  componentWillLoad() {
    this.start = Date.now();

    const li = document.createElement('li');
    li.innerHTML = `<span style="color:orange">lifecycle-on-ready-c</span> <span style="color:blue">componentWillLoad</span> ${this.value}`;
    document.getElementById('output').appendChild(li);

    return new Promise(resolve => {
      setTimeout(resolve);
    });
  }

  componentDidLoad() {
    const li = document.createElement('li');
    li.innerHTML = `<span style="color:orange">lifecycle-on-ready-c</span> <span style="color:green">componentDidLoad</span> ${this.value}`;
    document.getElementById('output').appendChild(li);
  }

  render() {
    return (
      <span> - lifecycle-on-ready-c: {this.value}</span>
    );
  }
}

import { Component, Prop } from '../../../../dist';

@Component({
  tag: 'lifecycle-on-ready-b'
})
export class LifecycleOnReadyB {

  @Prop() value = 0;
  start: number;

  componentWillLoad() {
    this.start = Date.now();

    const li = document.createElement('li');
    li.innerHTML = `<span style="color:red">lifecycle-on-ready-b</span> <span style="color:blue">componentWillLoad</span> ${this.value}`;
    document.getElementById('output').appendChild(li);

    return new Promise(resolve => {
      setTimeout(resolve);
    });
  }

  componentDidLoad() {
    const li = document.createElement('li');
    li.innerHTML = `<span style="color:red">lifecycle-on-ready-b</span> <span style="color:green">componentDidLoad</span> ${this.value}`;
    document.getElementById('output').appendChild(li);
  }

  render() {
    return (
      <section>
        lifecycle-on-ready-b: {this.value}
        <lifecycle-on-ready-c value={this.value}></lifecycle-on-ready-c>
      </section>
    );
  }
}

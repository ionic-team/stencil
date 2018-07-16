import { Component, Element, Event, EventEmitter, Listen, Method, Prop, State } from '../../../../dist';


@Component({
  tag: 'esm-import'
})
export class EsmImport {

  @Element() el: any;
  @Prop() propVal = 0;
  @State() isReady = 'false';
  @State() stateVal: string;
  @State() listenVal = 0;
  @State() someEventInc = 0;
  @Event() someEvent: EventEmitter;

  @Listen('click')
  testClick() {
    this.listenVal++;
  }

  @Method()
  someMethod() {
    this.someEvent.emit();
  }

  testMethod() {
    this.el.someMethod();
  }

  componentWillLoad() {
    this.stateVal = 'mph';
    this.el.componentOnReady().then(() => {
      this.isReady = 'true';
    });
  }

  componentDidLoad() {
    this.el.parentElement.addEventListener('someEvent', () => {
      this.el.propVal++;
    });
  }

  render() {
    return (
      <div>
        <p>esm-import</p>
        <p id="propVal">propVal: {this.propVal}</p>
        <p id="stateVal">stateVal: {this.stateVal}</p>
        <p id="listenVal">listenVal: {this.listenVal}</p>
        <p><button onClick={this.testMethod.bind(this)}>Test</button></p>
        <p id="isReady">componentOnReady: {this.isReady}</p>
      </div>
    );
  }
}

import { Component } from '../../../../dist/index';

@Component({
  tag: 'slot-basic-content'
})
export class SlotBasicContent {

  render() {
    return (
      <header>
        <section>
          <article>
            <slot/>
          </article>
        </section>
      </header>
    );
  }

}

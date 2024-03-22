import './assets/angular.min.js'

describe('slot-ng-if', () => {
  before(async () => {
    const stage = document.createElement('div');
    stage.innerHTML = `
    <section id="demo">
      <section ng-controller="homeCtrl as vm">
        <div ng-if="vm.show">
          <slot-ng-if><span>{{ vm.label }}</span></slot-ng-if>
        </div>
      </section>
    </section>`;
    document.body.appendChild(stage);

    angular.module('demo', []).controller('homeCtrl', homeCtrl);
    function homeCtrl() {
      const vm = this;
      console.log('YOO!');

      vm.label = 'Angular Bound Label';
      vm.show = true;
    }
    angular.bootstrap(document.querySelector('#demo'), ['demo']);
  });

  it('renders bound values in slots within ng-if context', async () => {
    const root = document.querySelector('slot-ng-if');
    expect(root.textContent).toBe('Angular Bound Label');
  });
});

import { registerComponent } from 'ionic-core';

export const Button_ = registerComponent('ion-button', {

  render: function (createElement) {
    return createElement(
      'h' + this.level,   // tag name
      this.$slots.default // array of children
    )
  },

  props: {
    level: {
      type: String,
      required: true
    }
  }

});
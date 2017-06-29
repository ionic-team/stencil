import { Component, h } from '../index';


@Component({
  tag: 'ion-tab-button',
  host: {
    theme: 'tab-button'
  }
})
export class TabButton {
  @Prop() tab: Tab;

  render() {
    if(!this.tab) {
      return null;
    }

    const tab = this.tab

    // TODO: Apply these on host?
    let { id, ariaControls, ariaSelected, hasTitle, hasIcon, hasTitleOnly,
    iconOnly, hasBadge, disableHover, tabDisabled, tabHidden } = {};

    return (
      <div class="tab-button-wrap">
        {tab.tabIcon && <ion-icon class="tab-button-icon"></ion-icon>}
        {tab.tabTitle && <span class="tab-button-text">{tab.tabTitle}</span>}
        {tab.tabBadge && <ion-badge class="tab-badge" color={tab.tabBadgeStyle}>{tab.tabBadge}</ion-badge>}
        <div class="button-effect"></div>
      </div>
    );
  }
}

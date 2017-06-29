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

    const items = []

    if(tab.tabIcon) {
      items.push(<ion-icon class="tab-button-icon" name={tab.tabIcon}></ion-icon>);
    }

    if(tab.tabTitle) {
      items.push(<span class="tab-button-text">{tab.tabTitle}</span>);
    }

    if(tab.tabBadge) {
      items.push(<ion-badge class="tab-badge" color={tab.tabBadgeStyle}>{tab.tabBadge}</ion-badge>);
    }

    items.push(<div class="button-effect"></div>);

    return (items)
  }
}

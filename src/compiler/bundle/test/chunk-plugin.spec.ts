import { remapData, chunkCommonModules, arrayDifferential } from '../graph-modules';

const beastMode = {
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/action-sheet/action-sheet.js': [
    'bundle:ion-action-sheet.ion-action-sheet-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/utils/helpers': [
    'bundle:ion-action-sheet.ion-action-sheet-controller',
    'bundle:ion-alert.ion-alert-controller',
    'bundle:ion-app.ion-content.ion-footer.ion-header.ion-navbar.ion-page.ion-scroll.ion-title.ion-toolbar',
    'bundle:ion-datetime.ion-picker.ion-picker-column.ion-picker-controller',
    'bundle:ion-gesture',
    'bundle:ion-item.ion-item-divider.ion-label.ion-list.ion-list-header.ion-skeleton-text',
    'bundle:ion-item-option.ion-item-options.ion-item-sliding',
    'bundle:ion-keyboard-controller',
    'bundle:ion-loading.ion-loading-controller',
    'bundle:ion-menu.ion-menu-controller',
    'bundle:ion-modal.ion-modal-controller',
    'bundle:ion-nav',
    'bundle:ion-popover.ion-popover-controller',
    'bundle:ion-range.ion-range-knob',
    'bundle:ion-reorder.ion-reorder-group',
    'bundle:ion-select.ion-select-option.ion-select-popover',
    'bundle:ion-toast.ion-toast-controller'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/utils/index': [
    'bundle:ion-action-sheet.ion-action-sheet-controller',
    'bundle:ion-alert.ion-alert-controller',
    'bundle:ion-app.ion-content.ion-footer.ion-header.ion-navbar.ion-page.ion-scroll.ion-title.ion-toolbar',
    'bundle:ion-datetime.ion-picker.ion-picker-column.ion-picker-controller',
    'bundle:ion-gesture',
    'bundle:ion-item.ion-item-divider.ion-label.ion-list.ion-list-header.ion-skeleton-text',
    'bundle:ion-item-option.ion-item-options.ion-item-sliding',
    'bundle:ion-keyboard-controller',
    'bundle:ion-loading.ion-loading-controller',
    'bundle:ion-menu.ion-menu-controller',
    'bundle:ion-modal.ion-modal-controller',
    'bundle:ion-nav',
    'bundle:ion-popover.ion-popover-controller',
    'bundle:ion-range.ion-range-knob',
    'bundle:ion-reorder.ion-reorder-group',
    'bundle:ion-select.ion-select-option.ion-select-popover',
    'bundle:ion-toast.ion-toast-controller'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/utils/helpers.js': [
    'bundle:ion-action-sheet.ion-action-sheet-controller',
    'bundle:ion-alert.ion-alert-controller',
    'bundle:ion-app.ion-content.ion-footer.ion-header.ion-navbar.ion-page.ion-scroll.ion-title.ion-toolbar',
    'bundle:ion-datetime.ion-picker.ion-picker-column.ion-picker-controller',
    'bundle:ion-gesture',
    'bundle:ion-item.ion-item-divider.ion-label.ion-list.ion-list-header.ion-skeleton-text',
    'bundle:ion-item-option.ion-item-options.ion-item-sliding',
    'bundle:ion-keyboard-controller',
    'bundle:ion-loading.ion-loading-controller',
    'bundle:ion-menu.ion-menu-controller',
    'bundle:ion-modal.ion-modal-controller',
    'bundle:ion-nav',
    'bundle:ion-popover.ion-popover-controller',
    'bundle:ion-range.ion-range-knob',
    'bundle:ion-reorder.ion-reorder-group',
    'bundle:ion-select.ion-select-option.ion-select-popover',
    'bundle:ion-toast.ion-toast-controller'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/utils/theme': [
    'bundle:ion-action-sheet.ion-action-sheet-controller',
    'bundle:ion-alert.ion-alert-controller',
    'bundle:ion-app.ion-content.ion-footer.ion-header.ion-navbar.ion-page.ion-scroll.ion-title.ion-toolbar',
    'bundle:ion-button.ion-buttons.ion-icon',
    'bundle:ion-card.ion-card-content.ion-card-header.ion-card-title',
    'bundle:ion-chip.ion-chip-button',
    'bundle:ion-fab-button',
    'bundle:ion-input.ion-textarea',
    'bundle:ion-item.ion-item-divider.ion-label.ion-list.ion-list-header.ion-skeleton-text',
    'bundle:ion-loading.ion-loading-controller',
    'bundle:ion-modal.ion-modal-controller',
    'bundle:ion-popover.ion-popover-controller',
    'bundle:ion-radio.ion-radio-group',
    'bundle:ion-segment.ion-segment-button',
    'bundle:ion-select.ion-select-option.ion-select-popover',
    'bundle:ion-spinner',
    'bundle:ion-tab.ion-tab-button.ion-tabbar.ion-tabs',
    'bundle:ion-toast.ion-toast-controller'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/utils/theme.js': [
    'bundle:ion-action-sheet.ion-action-sheet-controller',
    'bundle:ion-alert.ion-alert-controller',
    'bundle:ion-app.ion-content.ion-footer.ion-header.ion-navbar.ion-page.ion-scroll.ion-title.ion-toolbar',
    'bundle:ion-button.ion-buttons.ion-icon',
    'bundle:ion-card.ion-card-content.ion-card-header.ion-card-title',
    'bundle:ion-chip.ion-chip-button',
    'bundle:ion-fab-button',
    'bundle:ion-input.ion-textarea',
    'bundle:ion-item.ion-item-divider.ion-label.ion-list.ion-list-header.ion-skeleton-text',
    'bundle:ion-loading.ion-loading-controller',
    'bundle:ion-modal.ion-modal-controller',
    'bundle:ion-popover.ion-popover-controller',
    'bundle:ion-radio.ion-radio-group',
    'bundle:ion-segment.ion-segment-button',
    'bundle:ion-select.ion-select-option.ion-select-popover',
    'bundle:ion-spinner',
    'bundle:ion-tab.ion-tab-button.ion-tabbar.ion-tabs',
    'bundle:ion-toast.ion-toast-controller'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/action-sheet/action-sheet.js/animations/ios.enter': [
    'bundle:ion-action-sheet.ion-action-sheet-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/action-sheet/animations/ios.enter.js': [
    'bundle:ion-action-sheet.ion-action-sheet-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/action-sheet/action-sheet.js/animations/ios.leave': [
    'bundle:ion-action-sheet.ion-action-sheet-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/action-sheet/animations/ios.leave.js': [
    'bundle:ion-action-sheet.ion-action-sheet-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/action-sheet/action-sheet.js/animations/md.enter': [
    'bundle:ion-action-sheet.ion-action-sheet-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/action-sheet/animations/md.enter.js': [
    'bundle:ion-action-sheet.ion-action-sheet-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/action-sheet/action-sheet.js/animations/md.leave': [
    'bundle:ion-action-sheet.ion-action-sheet-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/action-sheet/animations/md.leave.js': [
    'bundle:ion-action-sheet.ion-action-sheet-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/**js-path-placeholder:ion-action-sheet-controller:**/': [
    'bundle:ion-action-sheet.ion-action-sheet-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/action-sheet-controller/action-sheet-controller.js': [
    'bundle:ion-action-sheet.ion-action-sheet-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/**js-path-placeholder:ion-action-sheet:**/': [
    'bundle:ion-action-sheet.ion-action-sheet-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/alert/alert.js': [
    'bundle:ion-alert.ion-alert-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/utils/overlay-constants': [
    'bundle:ion-alert.ion-alert-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/alert/alert.js/animations/ios.enter': [
    'bundle:ion-alert.ion-alert-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/alert/animations/ios.enter.js': [
    'bundle:ion-alert.ion-alert-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/alert/alert.js/animations/ios.leave': [
    'bundle:ion-alert.ion-alert-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/alert/animations/ios.leave.js': [
    'bundle:ion-alert.ion-alert-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/alert/alert.js/animations/md.enter': [
    'bundle:ion-alert.ion-alert-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/alert/animations/md.enter.js': [
    'bundle:ion-alert.ion-alert-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/alert/alert.js/animations/md.leave': [
    'bundle:ion-alert.ion-alert-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/alert/animations/md.leave.js': [
    'bundle:ion-alert.ion-alert-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/**js-path-placeholder:ion-alert-controller:**/': [
    'bundle:ion-alert.ion-alert-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/alert-controller/alert-controller.js': [
    'bundle:ion-alert.ion-alert-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/**js-path-placeholder:ion-alert:**/': [
    'bundle:ion-alert.ion-alert-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/utils/input-interfaces': [
    'bundle:ion-button.ion-buttons.ion-icon',
    'bundle:ion-checkbox',
    'bundle:ion-radio.ion-radio-group',
    'bundle:ion-select.ion-select-option.ion-select-popover',
    'bundle:ion-toggle'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/utils/input-interfaces.js': [
    'bundle:ion-button.ion-buttons.ion-icon',
    'bundle:ion-checkbox',
    'bundle:ion-radio.ion-radio-group',
    'bundle:ion-select.ion-select-option.ion-select-popover',
    'bundle:ion-toggle'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/item-sliding/item-sliding.js': [
    'bundle:ion-item.ion-item-divider.ion-label.ion-list.ion-list-header.ion-skeleton-text',
    'bundle:ion-item-option.ion-item-options.ion-item-sliding'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/item-sliding/item-options/item-options': [
    'bundle:ion-item.ion-item-divider.ion-label.ion-list.ion-list-header.ion-skeleton-text',
    'bundle:ion-item-option.ion-item-options.ion-item-sliding'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/item-options/item-options.js': [
    'bundle:ion-item.ion-item-divider.ion-label.ion-list.ion-list-header.ion-skeleton-text',
    'bundle:ion-item-option.ion-item-options.ion-item-sliding'
  ],
  '/**js-path-placeholder:ion-item-option:**/': [
    'bundle:ion-item.ion-item-divider.ion-label.ion-list.ion-list-header.ion-skeleton-text',
    'bundle:ion-item-option.ion-item-options.ion-item-sliding'
  ],
  '/**js-path-placeholder:ion-item-options:**/': [
    'bundle:ion-item.ion-item-divider.ion-label.ion-list.ion-list-header.ion-skeleton-text',
    'bundle:ion-item-option.ion-item-options.ion-item-sliding'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/item-option/item-option.js': [
    'bundle:ion-item.ion-item-divider.ion-label.ion-list.ion-list-header.ion-skeleton-text',
    'bundle:ion-item-option.ion-item-options.ion-item-sliding'
  ],
  '/**js-path-placeholder:ion-item-sliding:**/': [
    'bundle:ion-item.ion-item-divider.ion-label.ion-list.ion-list-header.ion-skeleton-text',
    'bundle:ion-item-option.ion-item-options.ion-item-sliding'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/utils/dom-framework-delegate': [
    'bundle:ion-modal.ion-modal-controller',
    'bundle:ion-nav',
    'bundle:ion-popover.ion-popover-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/utils/dom-framework-delegate.js': [
    'bundle:ion-modal.ion-modal-controller',
    'bundle:ion-nav',
    'bundle:ion-popover.ion-popover-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/utils/dom-framework-delegate.js/helpers': [
    'bundle:ion-modal.ion-modal-controller',
    'bundle:ion-nav',
    'bundle:ion-popover.ion-popover-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/popover/popover.js': [
    'bundle:ion-popover.ion-popover-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/popover/popover.js/animations/ios.enter': [
    'bundle:ion-popover.ion-popover-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/popover/animations/ios.enter.js': [
    'bundle:ion-popover.ion-popover-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/popover/popover.js/animations/ios.leave': [
    'bundle:ion-popover.ion-popover-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/popover/animations/ios.leave.js': [
    'bundle:ion-popover.ion-popover-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/popover/popover.js/animations/md.enter': [
    'bundle:ion-popover.ion-popover-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/popover/animations/md.enter.js': [
    'bundle:ion-popover.ion-popover-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/popover/popover.js/animations/md.leave': [
    'bundle:ion-popover.ion-popover-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/popover/animations/md.leave.js': [
    'bundle:ion-popover.ion-popover-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/**js-path-placeholder:ion-popover-controller:**/': [
    'bundle:ion-popover.ion-popover-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/popover-controller/popover-controller.js': [
    'bundle:ion-popover.ion-popover-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/**js-path-placeholder:ion-popover:**/': [
    'bundle:ion-popover.ion-popover-controller',
    'bundle:ion-select.ion-select-option.ion-select-popover'
  ],
  '/Users/joshthomas/Workspace/ionic/packages/core/dist/collection/components/utils/haptic': [
    'bundle:ion-reorder.ion-reorder-group',
    'bundle:ion-toggle'
  ]
};




describe('chunk-plugin', () => {
  describe('differentialPercentage', () => {
    it('does it work', () => {
      const modules = {
        'a.js': [
          '1.js'
        ],
        'b.js': [
          '2.js',
        ],
        'c.js': [
          '1.js',
          '2.js'
        ],
      };
      const remapped = remapData(modules);
      const graphedCommons = arrayDifferential(remapped['1.js'], remapped['2.js']);
      expect(graphedCommons.lengthDiff).toBe(1);
      expect(graphedCommons.percentageDiff).toBe(0.5);
    });
  });

  describe('should this be a common chunk', () => {

    it('If a module is only used in one dep then just ignore it', () => {
      const modules = {
        'a.js': [
          '1.js'
        ],
        'b.js': [
          '2.js'
        ],
        'c.js': [
          '2.js',
          '4.js'
        ]
      };
      const graphedCommons = chunkCommonModules(
        remapData(modules)
      );
      expect(graphedCommons).toEqual({
        '2.js': [
          'b.js',
          'c.js'
        ]
      });
    });

    it('should merge all exact matches', () => {

    });
  });
});

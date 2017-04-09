/**
 * Import Angular
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "@angular/common", "@angular/platform-browser", "@angular/forms", "@angular/common", "./components/action-sheet/action-sheet-controller", "./components/alert/alert-controller", "./components/app/app", "./components/app/app-root", "./config/config", "./navigation/deep-linker", "./platform/dom-controller", "./util/events", "./util/form", "./gestures/gesture-controller", "./tap-click/haptic", "./platform/keyboard", "./components/loading/loading-controller", "./components/menu/menu-controller", "./components/modal/modal-controller", "./util/module-loader", "./util/ng-module-loader", "./components/picker/picker-controller", "./platform/platform", "./platform/platform-registry", "./components/popover/popover-controller", "./util/ionic-core", "./tap-click/tap-click", "./components/toast/toast-controller", "./config/mode-registry", "./transitions/transition-controller", "./navigation/url-serializer", "./components/action-sheet/action-sheet.module", "./components/alert/alert.module", "./components/app/app.module", "./components/avatar/avatar.module", "./components/backdrop/backdrop.module", "./components/button/button.module", "./components/card/card.module", "./components/checkbox/checkbox.module", "./components/chip/chip.module", "./components/click-block/click-block.module", "./components/content/content.module", "./components/datetime/datetime.module", "./components/fab/fab.module", "./components/grid/grid.module", "./components/icon/icon.module", "./components/img/img.module", "./components/infinite-scroll/infinite-scroll.module", "./components/input/input.module", "./components/item/item.module", "./components/label/label.module", "./components/list/list.module", "./components/loading/loading.module", "./components/menu/menu.module", "./components/modal/modal.module", "./components/nav/nav.module", "./components/navbar/navbar.module", "./components/note/note.module", "./components/option/option.module", "./components/picker/picker.module", "./components/popover/popover.module", "./components/radio/radio.module", "./components/range/range.module", "./components/refresher/refresher.module", "./components/scroll/scroll.module", "./components/searchbar/searchbar.module", "./components/segment/segment.module", "./components/select/select.module", "./components/show-hide-when/show-hide-when.module", "./components/slides/slides.module", "./components/spinner/spinner.module", "./components/split-pane/split-pane.module", "./components/tabs/tabs.module", "./components/thumbnail/thumbnail.module", "./components/toast/toast.module", "./components/toggle/toggle.module", "./components/toolbar/toolbar.module", "./components/typography/typography.module", "./components/virtual-scroll/virtual-scroll.module", "./components/action-sheet/action-sheet.module", "./components/alert/alert.module", "./components/app/app.module", "./components/avatar/avatar.module", "./components/backdrop/backdrop.module", "./components/button/button.module", "./components/card/card.module", "./components/checkbox/checkbox.module", "./components/chip/chip.module", "./components/click-block/click-block.module", "./components/content/content.module", "./components/datetime/datetime.module", "./components/fab/fab.module", "./components/grid/grid.module", "./components/icon/icon.module", "./components/img/img.module", "./components/infinite-scroll/infinite-scroll.module", "./components/input/input.module", "./components/item/item.module", "./components/label/label.module", "./components/list/list.module", "./components/loading/loading.module", "./components/menu/menu.module", "./components/modal/modal.module", "./components/nav/nav.module", "./components/navbar/navbar.module", "./components/note/note.module", "./components/option/option.module", "./components/picker/picker.module", "./components/popover/popover.module", "./components/radio/radio.module", "./components/range/range.module", "./components/refresher/refresher.module", "./components/scroll/scroll.module", "./components/searchbar/searchbar.module", "./components/segment/segment.module", "./components/select/select.module", "./components/show-hide-when/show-hide-when.module", "./components/slides/slides.module", "./components/spinner/spinner.module", "./components/split-pane/split-pane.module", "./components/tabs/tabs.module", "./components/thumbnail/thumbnail.module", "./components/toast/toast.module", "./components/toggle/toggle.module", "./components/toolbar/toolbar.module", "./components/typography/typography.module", "./components/virtual-scroll/virtual-scroll.module", "./components/action-sheet/action-sheet", "./components/action-sheet/action-sheet-controller", "./components/alert/alert-controller", "./components/alert/alert", "./components/app/app", "./components/avatar/avatar", "./components/backdrop/backdrop", "./components/button/button", "./components/card/card", "./components/card/card-content", "./components/card/card-header", "./components/card/card-title", "./components/checkbox/checkbox", "./components/chip/chip", "./components/click-block/click-block", "./components/content/content", "./components/datetime/datetime", "./components/fab/fab", "./components/fab/fab-container", "./components/fab/fab-list", "./components/grid/col", "./components/grid/grid", "./components/grid/row", "./components/ion", "./components/icon/icon", "./components/img/img", "./components/infinite-scroll/infinite-scroll", "./components/infinite-scroll/infinite-scroll-content", "./components/input/input", "./components/app/app-root", "./components/item/item", "./components/item/item-content", "./components/item/item-divider", "./components/item/item-group", "./components/item/item-reorder", "./components/item/reorder", "./components/item/item-sliding", "./components/item/item-options", "./components/label/label", "./components/list/list", "./components/list/list-header", "./components/loading/loading", "./components/loading/loading-controller", "./components/menu/menu", "./components/menu/menu-close", "./components/menu/menu-controller", "./components/menu/menu-toggle", "./components/menu/menu-types", "./components/modal/modal", "./components/modal/modal-controller", "./components/nav/nav", "./components/nav/nav-pop", "./components/nav/nav-pop-anchor", "./components/nav/nav-push", "./components/nav/nav-push-anchor", "./components/navbar/navbar", "./components/input/native-input", "./components/input/next-input", "./components/note/note", "./components/option/option", "./components/nav/overlay-portal", "./components/picker/picker", "./components/picker/picker-controller", "./components/popover/popover", "./components/popover/popover-controller", "./components/radio/radio-button", "./components/radio/radio-group", "./components/range/range", "./components/range/range-knob", "./components/refresher/refresher", "./components/refresher/refresher-content", "./components/scroll/scroll", "./components/searchbar/searchbar", "./components/segment/segment", "./components/segment/segment-button", "./components/select/select", "./components/show-hide-when/show-when", "./components/show-hide-when/display-when", "./components/show-hide-when/hide-when", "./components/slides/slide", "./components/slides/slides", "./components/spinner/spinner", "./components/split-pane/split-pane", "./util/ionic-core", "./components/tabs/tab", "./components/tabs/tab-button", "./components/tabs/tab-highlight", "./components/tabs/tabs", "./tap-click/tap-click", "./components/toast/toast", "./components/toast/toast-controller", "./components/toggle/toggle", "./components/toolbar/toolbar-base", "./components/toolbar/toolbar", "./components/toolbar/toolbar-header", "./components/toolbar/toolbar-footer", "./components/toolbar/toolbar-item", "./components/toolbar/toolbar-title", "./components/thumbnail/thumbnail", "./components/typography/typography", "./components/virtual-scroll/virtual-scroll", "./config/config", "./platform/dom-controller", "./platform/platform", "./tap-click/haptic", "./navigation/deep-linker", "./navigation/ionic-page", "./navigation/nav-controller", "./navigation/nav-controller-base", "./navigation/nav-params", "./navigation/nav-util", "./navigation/url-serializer", "./navigation/view-controller", "./components/action-sheet/action-sheet-component", "./components/alert/alert-component", "./components/loading/loading-component", "./components/modal/modal-component", "./components/picker/picker-component", "./components/picker/picker-column", "./components/popover/popover-component", "./components/toast/toast-component", "./gestures/drag-gesture", "./gestures/gesture", "./gestures/slide-edge-gesture", "./gestures/slide-gesture", "./gestures/gesture-controller", "./util/events", "./util/ionic-error-handler", "./platform/keyboard", "./util/form", "./util/util", "./animations/animation", "./transitions/page-transition", "./transitions/transition", "./platform/platform-registry", "./config/mode-registry", "./gestures/gesture-config"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var common_1 = require("@angular/common");
    var platform_browser_1 = require("@angular/platform-browser");
    var forms_1 = require("@angular/forms");
    var common_2 = require("@angular/common");
    /**
     * Import Providers
     */
    var action_sheet_controller_1 = require("./components/action-sheet/action-sheet-controller");
    var alert_controller_1 = require("./components/alert/alert-controller");
    var app_1 = require("./components/app/app");
    var app_root_1 = require("./components/app/app-root");
    var config_1 = require("./config/config");
    var deep_linker_1 = require("./navigation/deep-linker");
    var dom_controller_1 = require("./platform/dom-controller");
    var events_1 = require("./util/events");
    var form_1 = require("./util/form");
    var gesture_controller_1 = require("./gestures/gesture-controller");
    var haptic_1 = require("./tap-click/haptic");
    var keyboard_1 = require("./platform/keyboard");
    var loading_controller_1 = require("./components/loading/loading-controller");
    var menu_controller_1 = require("./components/menu/menu-controller");
    var modal_controller_1 = require("./components/modal/modal-controller");
    var module_loader_1 = require("./util/module-loader");
    var ng_module_loader_1 = require("./util/ng-module-loader");
    var picker_controller_1 = require("./components/picker/picker-controller");
    var platform_1 = require("./platform/platform");
    var platform_registry_1 = require("./platform/platform-registry");
    var popover_controller_1 = require("./components/popover/popover-controller");
    var ionic_core_1 = require("./util/ionic-core");
    var tap_click_1 = require("./tap-click/tap-click");
    var toast_controller_1 = require("./components/toast/toast-controller");
    var mode_registry_1 = require("./config/mode-registry");
    var transition_controller_1 = require("./transitions/transition-controller");
    var url_serializer_1 = require("./navigation/url-serializer");
    /**
     * Import Modules
     */
    var action_sheet_module_1 = require("./components/action-sheet/action-sheet.module");
    var alert_module_1 = require("./components/alert/alert.module");
    var app_module_1 = require("./components/app/app.module");
    var avatar_module_1 = require("./components/avatar/avatar.module");
    var backdrop_module_1 = require("./components/backdrop/backdrop.module");
    var button_module_1 = require("./components/button/button.module");
    var card_module_1 = require("./components/card/card.module");
    var checkbox_module_1 = require("./components/checkbox/checkbox.module");
    var chip_module_1 = require("./components/chip/chip.module");
    var click_block_module_1 = require("./components/click-block/click-block.module");
    var content_module_1 = require("./components/content/content.module");
    var datetime_module_1 = require("./components/datetime/datetime.module");
    var fab_module_1 = require("./components/fab/fab.module");
    var grid_module_1 = require("./components/grid/grid.module");
    var icon_module_1 = require("./components/icon/icon.module");
    var img_module_1 = require("./components/img/img.module");
    var infinite_scroll_module_1 = require("./components/infinite-scroll/infinite-scroll.module");
    var input_module_1 = require("./components/input/input.module");
    var item_module_1 = require("./components/item/item.module");
    var label_module_1 = require("./components/label/label.module");
    var list_module_1 = require("./components/list/list.module");
    var loading_module_1 = require("./components/loading/loading.module");
    var menu_module_1 = require("./components/menu/menu.module");
    var modal_module_1 = require("./components/modal/modal.module");
    var nav_module_1 = require("./components/nav/nav.module");
    var navbar_module_1 = require("./components/navbar/navbar.module");
    var note_module_1 = require("./components/note/note.module");
    var option_module_1 = require("./components/option/option.module");
    var picker_module_1 = require("./components/picker/picker.module");
    var popover_module_1 = require("./components/popover/popover.module");
    var radio_module_1 = require("./components/radio/radio.module");
    var range_module_1 = require("./components/range/range.module");
    var refresher_module_1 = require("./components/refresher/refresher.module");
    var scroll_module_1 = require("./components/scroll/scroll.module");
    var searchbar_module_1 = require("./components/searchbar/searchbar.module");
    var segment_module_1 = require("./components/segment/segment.module");
    var select_module_1 = require("./components/select/select.module");
    var show_hide_when_module_1 = require("./components/show-hide-when/show-hide-when.module");
    var slides_module_1 = require("./components/slides/slides.module");
    var spinner_module_1 = require("./components/spinner/spinner.module");
    var split_pane_module_1 = require("./components/split-pane/split-pane.module");
    var tabs_module_1 = require("./components/tabs/tabs.module");
    var thumbnail_module_1 = require("./components/thumbnail/thumbnail.module");
    var toast_module_1 = require("./components/toast/toast.module");
    var toggle_module_1 = require("./components/toggle/toggle.module");
    var toolbar_module_1 = require("./components/toolbar/toolbar.module");
    var typography_module_1 = require("./components/typography/typography.module");
    var virtual_scroll_module_1 = require("./components/virtual-scroll/virtual-scroll.module");
    /**
     * Export Modules
     */
    var action_sheet_module_2 = require("./components/action-sheet/action-sheet.module");
    exports.ActionSheetModule = action_sheet_module_2.ActionSheetModule;
    var alert_module_2 = require("./components/alert/alert.module");
    exports.AlertModule = alert_module_2.AlertModule;
    var app_module_2 = require("./components/app/app.module");
    exports.AppModule = app_module_2.AppModule;
    var avatar_module_2 = require("./components/avatar/avatar.module");
    exports.AvatarModule = avatar_module_2.AvatarModule;
    var backdrop_module_2 = require("./components/backdrop/backdrop.module");
    exports.BackdropModule = backdrop_module_2.BackdropModule;
    var button_module_2 = require("./components/button/button.module");
    exports.ButtonModule = button_module_2.ButtonModule;
    var card_module_2 = require("./components/card/card.module");
    exports.CardModule = card_module_2.CardModule;
    var checkbox_module_2 = require("./components/checkbox/checkbox.module");
    exports.CheckboxModule = checkbox_module_2.CheckboxModule;
    var chip_module_2 = require("./components/chip/chip.module");
    exports.ChipModule = chip_module_2.ChipModule;
    var click_block_module_2 = require("./components/click-block/click-block.module");
    exports.ClickBlockModule = click_block_module_2.ClickBlockModule;
    var content_module_2 = require("./components/content/content.module");
    exports.ContentModule = content_module_2.ContentModule;
    var datetime_module_2 = require("./components/datetime/datetime.module");
    exports.DateTimeModule = datetime_module_2.DateTimeModule;
    var fab_module_2 = require("./components/fab/fab.module");
    exports.FabModule = fab_module_2.FabModule;
    var grid_module_2 = require("./components/grid/grid.module");
    exports.GridModule = grid_module_2.GridModule;
    var icon_module_2 = require("./components/icon/icon.module");
    exports.IconModule = icon_module_2.IconModule;
    var img_module_2 = require("./components/img/img.module");
    exports.ImgModule = img_module_2.ImgModule;
    var infinite_scroll_module_2 = require("./components/infinite-scroll/infinite-scroll.module");
    exports.InfiniteScrollModule = infinite_scroll_module_2.InfiniteScrollModule;
    var input_module_2 = require("./components/input/input.module");
    exports.InputModule = input_module_2.InputModule;
    var item_module_2 = require("./components/item/item.module");
    exports.ItemModule = item_module_2.ItemModule;
    var label_module_2 = require("./components/label/label.module");
    exports.LabelModule = label_module_2.LabelModule;
    var list_module_2 = require("./components/list/list.module");
    exports.ListModule = list_module_2.ListModule;
    var loading_module_2 = require("./components/loading/loading.module");
    exports.LoadingModule = loading_module_2.LoadingModule;
    var menu_module_2 = require("./components/menu/menu.module");
    exports.MenuModule = menu_module_2.MenuModule;
    var modal_module_2 = require("./components/modal/modal.module");
    exports.ModalModule = modal_module_2.ModalModule;
    var nav_module_2 = require("./components/nav/nav.module");
    exports.NavModule = nav_module_2.NavModule;
    var navbar_module_2 = require("./components/navbar/navbar.module");
    exports.NavbarModule = navbar_module_2.NavbarModule;
    var note_module_2 = require("./components/note/note.module");
    exports.NoteModule = note_module_2.NoteModule;
    var option_module_2 = require("./components/option/option.module");
    exports.OptionModule = option_module_2.OptionModule;
    var picker_module_2 = require("./components/picker/picker.module");
    exports.PickerModule = picker_module_2.PickerModule;
    var popover_module_2 = require("./components/popover/popover.module");
    exports.PopoverModule = popover_module_2.PopoverModule;
    var radio_module_2 = require("./components/radio/radio.module");
    exports.RadioModule = radio_module_2.RadioModule;
    var range_module_2 = require("./components/range/range.module");
    exports.RangeModule = range_module_2.RangeModule;
    var refresher_module_2 = require("./components/refresher/refresher.module");
    exports.RefresherModule = refresher_module_2.RefresherModule;
    var scroll_module_2 = require("./components/scroll/scroll.module");
    exports.ScrollModule = scroll_module_2.ScrollModule;
    var searchbar_module_2 = require("./components/searchbar/searchbar.module");
    exports.SearchbarModule = searchbar_module_2.SearchbarModule;
    var segment_module_2 = require("./components/segment/segment.module");
    exports.SegmentModule = segment_module_2.SegmentModule;
    var select_module_2 = require("./components/select/select.module");
    exports.SelectModule = select_module_2.SelectModule;
    var show_hide_when_module_2 = require("./components/show-hide-when/show-hide-when.module");
    exports.ShowHideWhenModule = show_hide_when_module_2.ShowHideWhenModule;
    var slides_module_2 = require("./components/slides/slides.module");
    exports.SlidesModule = slides_module_2.SlidesModule;
    var spinner_module_2 = require("./components/spinner/spinner.module");
    exports.SpinnerModule = spinner_module_2.SpinnerModule;
    var split_pane_module_2 = require("./components/split-pane/split-pane.module");
    exports.SplitPaneModule = split_pane_module_2.SplitPaneModule;
    var tabs_module_2 = require("./components/tabs/tabs.module");
    exports.TabsModule = tabs_module_2.TabsModule;
    var thumbnail_module_2 = require("./components/thumbnail/thumbnail.module");
    exports.ThumbnailModule = thumbnail_module_2.ThumbnailModule;
    var toast_module_2 = require("./components/toast/toast.module");
    exports.ToastModule = toast_module_2.ToastModule;
    var toggle_module_2 = require("./components/toggle/toggle.module");
    exports.ToggleModule = toggle_module_2.ToggleModule;
    var toolbar_module_2 = require("./components/toolbar/toolbar.module");
    exports.ToolbarModule = toolbar_module_2.ToolbarModule;
    var typography_module_2 = require("./components/typography/typography.module");
    exports.TypographyModule = typography_module_2.TypographyModule;
    var virtual_scroll_module_2 = require("./components/virtual-scroll/virtual-scroll.module");
    exports.VirtualScrollModule = virtual_scroll_module_2.VirtualScrollModule;
    /**
     * Export Components/Directives
     */
    var action_sheet_1 = require("./components/action-sheet/action-sheet");
    exports.ActionSheet = action_sheet_1.ActionSheet;
    var action_sheet_controller_2 = require("./components/action-sheet/action-sheet-controller");
    exports.ActionSheetController = action_sheet_controller_2.ActionSheetController;
    var alert_controller_2 = require("./components/alert/alert-controller");
    exports.AlertController = alert_controller_2.AlertController;
    var alert_1 = require("./components/alert/alert");
    exports.Alert = alert_1.Alert;
    var app_2 = require("./components/app/app");
    exports.App = app_2.App;
    var avatar_1 = require("./components/avatar/avatar");
    exports.Avatar = avatar_1.Avatar;
    var backdrop_1 = require("./components/backdrop/backdrop");
    exports.Backdrop = backdrop_1.Backdrop;
    var button_1 = require("./components/button/button");
    exports.Button = button_1.Button;
    var card_1 = require("./components/card/card");
    exports.Card = card_1.Card;
    var card_content_1 = require("./components/card/card-content");
    exports.CardContent = card_content_1.CardContent;
    var card_header_1 = require("./components/card/card-header");
    exports.CardHeader = card_header_1.CardHeader;
    var card_title_1 = require("./components/card/card-title");
    exports.CardTitle = card_title_1.CardTitle;
    var checkbox_1 = require("./components/checkbox/checkbox");
    exports.Checkbox = checkbox_1.Checkbox;
    var chip_1 = require("./components/chip/chip");
    exports.Chip = chip_1.Chip;
    var click_block_1 = require("./components/click-block/click-block");
    exports.ClickBlock = click_block_1.ClickBlock;
    var content_1 = require("./components/content/content");
    exports.Content = content_1.Content;
    var datetime_1 = require("./components/datetime/datetime");
    exports.DateTime = datetime_1.DateTime;
    var fab_1 = require("./components/fab/fab");
    exports.FabButton = fab_1.FabButton;
    var fab_container_1 = require("./components/fab/fab-container");
    exports.FabContainer = fab_container_1.FabContainer;
    var fab_list_1 = require("./components/fab/fab-list");
    exports.FabList = fab_list_1.FabList;
    var col_1 = require("./components/grid/col");
    exports.Col = col_1.Col;
    var grid_1 = require("./components/grid/grid");
    exports.Grid = grid_1.Grid;
    var row_1 = require("./components/grid/row");
    exports.Row = row_1.Row;
    var ion_1 = require("./components/ion");
    exports.Ion = ion_1.Ion;
    var icon_1 = require("./components/icon/icon");
    exports.Icon = icon_1.Icon;
    var img_1 = require("./components/img/img");
    exports.Img = img_1.Img;
    var infinite_scroll_1 = require("./components/infinite-scroll/infinite-scroll");
    exports.InfiniteScroll = infinite_scroll_1.InfiniteScroll;
    var infinite_scroll_content_1 = require("./components/infinite-scroll/infinite-scroll-content");
    exports.InfiniteScrollContent = infinite_scroll_content_1.InfiniteScrollContent;
    var input_1 = require("./components/input/input");
    exports.TextInput = input_1.TextInput;
    var app_root_2 = require("./components/app/app-root");
    exports.IonicApp = app_root_2.IonicApp;
    var item_1 = require("./components/item/item");
    exports.Item = item_1.Item;
    var item_content_1 = require("./components/item/item-content");
    exports.ItemContent = item_content_1.ItemContent;
    var item_divider_1 = require("./components/item/item-divider");
    exports.ItemDivider = item_divider_1.ItemDivider;
    var item_group_1 = require("./components/item/item-group");
    exports.ItemGroup = item_group_1.ItemGroup;
    var item_reorder_1 = require("./components/item/item-reorder");
    exports.ItemReorder = item_reorder_1.ItemReorder;
    var reorder_1 = require("./components/item/reorder");
    exports.Reorder = reorder_1.Reorder;
    var item_sliding_1 = require("./components/item/item-sliding");
    exports.ItemSliding = item_sliding_1.ItemSliding;
    var item_options_1 = require("./components/item/item-options");
    exports.ItemOptions = item_options_1.ItemOptions;
    var label_1 = require("./components/label/label");
    exports.Label = label_1.Label;
    var list_1 = require("./components/list/list");
    exports.List = list_1.List;
    var list_header_1 = require("./components/list/list-header");
    exports.ListHeader = list_header_1.ListHeader;
    var loading_1 = require("./components/loading/loading");
    exports.Loading = loading_1.Loading;
    var loading_controller_2 = require("./components/loading/loading-controller");
    exports.LoadingController = loading_controller_2.LoadingController;
    var menu_1 = require("./components/menu/menu");
    exports.Menu = menu_1.Menu;
    var menu_close_1 = require("./components/menu/menu-close");
    exports.MenuClose = menu_close_1.MenuClose;
    var menu_controller_2 = require("./components/menu/menu-controller");
    exports.MenuController = menu_controller_2.MenuController;
    var menu_toggle_1 = require("./components/menu/menu-toggle");
    exports.MenuToggle = menu_toggle_1.MenuToggle;
    var menu_types_1 = require("./components/menu/menu-types");
    exports.MenuType = menu_types_1.MenuType;
    var modal_1 = require("./components/modal/modal");
    exports.Modal = modal_1.Modal;
    var modal_controller_2 = require("./components/modal/modal-controller");
    exports.ModalController = modal_controller_2.ModalController;
    var nav_1 = require("./components/nav/nav");
    exports.Nav = nav_1.Nav;
    var nav_pop_1 = require("./components/nav/nav-pop");
    exports.NavPop = nav_pop_1.NavPop;
    var nav_pop_anchor_1 = require("./components/nav/nav-pop-anchor");
    exports.NavPopAnchor = nav_pop_anchor_1.NavPopAnchor;
    var nav_push_1 = require("./components/nav/nav-push");
    exports.NavPush = nav_push_1.NavPush;
    var nav_push_anchor_1 = require("./components/nav/nav-push-anchor");
    exports.NavPushAnchor = nav_push_anchor_1.NavPushAnchor;
    var navbar_1 = require("./components/navbar/navbar");
    exports.Navbar = navbar_1.Navbar;
    var native_input_1 = require("./components/input/native-input");
    exports.NativeInput = native_input_1.NativeInput;
    var next_input_1 = require("./components/input/next-input");
    exports.NextInput = next_input_1.NextInput;
    var note_1 = require("./components/note/note");
    exports.Note = note_1.Note;
    var option_1 = require("./components/option/option");
    exports.Option = option_1.Option;
    var overlay_portal_1 = require("./components/nav/overlay-portal");
    exports.OverlayPortal = overlay_portal_1.OverlayPortal;
    var picker_1 = require("./components/picker/picker");
    exports.Picker = picker_1.Picker;
    var picker_controller_2 = require("./components/picker/picker-controller");
    exports.PickerController = picker_controller_2.PickerController;
    var popover_1 = require("./components/popover/popover");
    exports.Popover = popover_1.Popover;
    var popover_controller_2 = require("./components/popover/popover-controller");
    exports.PopoverController = popover_controller_2.PopoverController;
    var radio_button_1 = require("./components/radio/radio-button");
    exports.RadioButton = radio_button_1.RadioButton;
    var radio_group_1 = require("./components/radio/radio-group");
    exports.RadioGroup = radio_group_1.RadioGroup;
    var range_1 = require("./components/range/range");
    exports.Range = range_1.Range;
    var range_knob_1 = require("./components/range/range-knob");
    exports.RangeKnob = range_knob_1.RangeKnob;
    var refresher_1 = require("./components/refresher/refresher");
    exports.Refresher = refresher_1.Refresher;
    var refresher_content_1 = require("./components/refresher/refresher-content");
    exports.RefresherContent = refresher_content_1.RefresherContent;
    var scroll_1 = require("./components/scroll/scroll");
    exports.Scroll = scroll_1.Scroll;
    var searchbar_1 = require("./components/searchbar/searchbar");
    exports.Searchbar = searchbar_1.Searchbar;
    var segment_1 = require("./components/segment/segment");
    exports.Segment = segment_1.Segment;
    var segment_button_1 = require("./components/segment/segment-button");
    exports.SegmentButton = segment_button_1.SegmentButton;
    var select_1 = require("./components/select/select");
    exports.Select = select_1.Select;
    var show_when_1 = require("./components/show-hide-when/show-when");
    exports.ShowWhen = show_when_1.ShowWhen;
    var display_when_1 = require("./components/show-hide-when/display-when");
    exports.DisplayWhen = display_when_1.DisplayWhen;
    var hide_when_1 = require("./components/show-hide-when/hide-when");
    exports.HideWhen = hide_when_1.HideWhen;
    var slide_1 = require("./components/slides/slide");
    exports.Slide = slide_1.Slide;
    var slides_1 = require("./components/slides/slides");
    exports.Slides = slides_1.Slides;
    var spinner_1 = require("./components/spinner/spinner");
    exports.Spinner = spinner_1.Spinner;
    var split_pane_1 = require("./components/split-pane/split-pane");
    exports.SplitPane = split_pane_1.SplitPane;
    exports.RootNode = split_pane_1.RootNode;
    var ionic_core_2 = require("./util/ionic-core");
    exports.setupCore = ionic_core_2.setupCore;
    var tab_1 = require("./components/tabs/tab");
    exports.Tab = tab_1.Tab;
    var tab_button_1 = require("./components/tabs/tab-button");
    exports.TabButton = tab_button_1.TabButton;
    var tab_highlight_1 = require("./components/tabs/tab-highlight");
    exports.TabHighlight = tab_highlight_1.TabHighlight;
    var tabs_1 = require("./components/tabs/tabs");
    exports.Tabs = tabs_1.Tabs;
    var tap_click_2 = require("./tap-click/tap-click");
    exports.TapClick = tap_click_2.TapClick;
    exports.setupTapClick = tap_click_2.setupTapClick;
    exports.isActivatable = tap_click_2.isActivatable;
    var toast_1 = require("./components/toast/toast");
    exports.Toast = toast_1.Toast;
    var toast_controller_2 = require("./components/toast/toast-controller");
    exports.ToastController = toast_controller_2.ToastController;
    var toggle_1 = require("./components/toggle/toggle");
    exports.Toggle = toggle_1.Toggle;
    var toolbar_base_1 = require("./components/toolbar/toolbar-base");
    exports.ToolbarBase = toolbar_base_1.ToolbarBase;
    var toolbar_1 = require("./components/toolbar/toolbar");
    exports.Toolbar = toolbar_1.Toolbar;
    var toolbar_header_1 = require("./components/toolbar/toolbar-header");
    exports.Header = toolbar_header_1.Header;
    var toolbar_footer_1 = require("./components/toolbar/toolbar-footer");
    exports.Footer = toolbar_footer_1.Footer;
    var toolbar_item_1 = require("./components/toolbar/toolbar-item");
    exports.ToolbarItem = toolbar_item_1.ToolbarItem;
    var toolbar_title_1 = require("./components/toolbar/toolbar-title");
    exports.ToolbarTitle = toolbar_title_1.ToolbarTitle;
    var thumbnail_1 = require("./components/thumbnail/thumbnail");
    exports.Thumbnail = thumbnail_1.Thumbnail;
    var typography_1 = require("./components/typography/typography");
    exports.Typography = typography_1.Typography;
    var virtual_scroll_1 = require("./components/virtual-scroll/virtual-scroll");
    exports.VirtualScroll = virtual_scroll_1.VirtualScroll;
    /**
     * Export Providers
     */
    var config_2 = require("./config/config");
    exports.Config = config_2.Config;
    exports.setupConfig = config_2.setupConfig;
    exports.ConfigToken = config_2.ConfigToken;
    var dom_controller_2 = require("./platform/dom-controller");
    exports.DomController = dom_controller_2.DomController;
    var platform_2 = require("./platform/platform");
    exports.Platform = platform_2.Platform;
    exports.setupPlatform = platform_2.setupPlatform;
    var haptic_2 = require("./tap-click/haptic");
    exports.Haptic = haptic_2.Haptic;
    var deep_linker_2 = require("./navigation/deep-linker");
    exports.DeepLinker = deep_linker_2.DeepLinker;
    var ionic_page_1 = require("./navigation/ionic-page");
    exports.IonicPage = ionic_page_1.IonicPage;
    var nav_controller_1 = require("./navigation/nav-controller");
    exports.NavController = nav_controller_1.NavController;
    var nav_controller_base_1 = require("./navigation/nav-controller-base");
    exports.NavControllerBase = nav_controller_base_1.NavControllerBase;
    var nav_params_1 = require("./navigation/nav-params");
    exports.NavParams = nav_params_1.NavParams;
    var nav_util_1 = require("./navigation/nav-util");
    exports.DeepLinkMetadata = nav_util_1.DeepLinkMetadata;
    exports.DeepLinkMetadataFactory = nav_util_1.DeepLinkMetadataFactory;
    var url_serializer_2 = require("./navigation/url-serializer");
    exports.UrlSerializer = url_serializer_2.UrlSerializer;
    exports.DeepLinkConfigToken = url_serializer_2.DeepLinkConfigToken;
    var view_controller_1 = require("./navigation/view-controller");
    exports.ViewController = view_controller_1.ViewController;
    var action_sheet_component_1 = require("./components/action-sheet/action-sheet-component");
    exports.ActionSheetCmp = action_sheet_component_1.ActionSheetCmp;
    var alert_component_1 = require("./components/alert/alert-component");
    exports.AlertCmp = alert_component_1.AlertCmp;
    var loading_component_1 = require("./components/loading/loading-component");
    exports.LoadingCmp = loading_component_1.LoadingCmp;
    var modal_component_1 = require("./components/modal/modal-component");
    exports.ModalCmp = modal_component_1.ModalCmp;
    var picker_component_1 = require("./components/picker/picker-component");
    exports.PickerCmp = picker_component_1.PickerCmp;
    var picker_column_1 = require("./components/picker/picker-column");
    exports.PickerColumnCmp = picker_column_1.PickerColumnCmp;
    var popover_component_1 = require("./components/popover/popover-component");
    exports.PopoverCmp = popover_component_1.PopoverCmp;
    var toast_component_1 = require("./components/toast/toast-component");
    exports.ToastCmp = toast_component_1.ToastCmp;
    /**
     * Export Utils
     */
    var drag_gesture_1 = require("./gestures/drag-gesture");
    exports.PanGesture = drag_gesture_1.PanGesture;
    var gesture_1 = require("./gestures/gesture");
    exports.Gesture = gesture_1.Gesture;
    var slide_edge_gesture_1 = require("./gestures/slide-edge-gesture");
    exports.SlideEdgeGesture = slide_edge_gesture_1.SlideEdgeGesture;
    var slide_gesture_1 = require("./gestures/slide-gesture");
    exports.SlideGesture = slide_gesture_1.SlideGesture;
    var gesture_controller_2 = require("./gestures/gesture-controller");
    exports.BLOCK_ALL = gesture_controller_2.BLOCK_ALL;
    exports.GESTURE_GO_BACK_SWIPE = gesture_controller_2.GESTURE_GO_BACK_SWIPE;
    exports.GESTURE_MENU_SWIPE = gesture_controller_2.GESTURE_MENU_SWIPE;
    exports.GESTURE_ITEM_SWIPE = gesture_controller_2.GESTURE_ITEM_SWIPE;
    exports.GESTURE_REFRESHER = gesture_controller_2.GESTURE_REFRESHER;
    exports.GESTURE_TOGGLE = gesture_controller_2.GESTURE_TOGGLE;
    exports.GestureController = gesture_controller_2.GestureController;
    exports.GestureDelegate = gesture_controller_2.GestureDelegate;
    exports.BlockerDelegate = gesture_controller_2.BlockerDelegate;
    var events_2 = require("./util/events");
    exports.Events = events_2.Events;
    exports.setupEvents = events_2.setupEvents;
    exports.setupProvideEvents = events_2.setupProvideEvents;
    var ionic_error_handler_1 = require("./util/ionic-error-handler");
    exports.IonicErrorHandler = ionic_error_handler_1.IonicErrorHandler;
    var keyboard_2 = require("./platform/keyboard");
    exports.Keyboard = keyboard_2.Keyboard;
    var form_2 = require("./util/form");
    exports.Form = form_2.Form;
    exports.IonicFormInput = form_2.IonicFormInput;
    exports.IonicTapInput = form_2.IonicTapInput;
    var util_1 = require("./util/util");
    exports.reorderArray = util_1.reorderArray;
    var animation_1 = require("./animations/animation");
    exports.Animation = animation_1.Animation;
    var page_transition_1 = require("./transitions/page-transition");
    exports.PageTransition = page_transition_1.PageTransition;
    var transition_1 = require("./transitions/transition");
    exports.Transition = transition_1.Transition;
    var platform_registry_2 = require("./platform/platform-registry");
    exports.PlatformConfigToken = platform_registry_2.PlatformConfigToken;
    var mode_registry_2 = require("./config/mode-registry");
    exports.registerModeConfigs = mode_registry_2.registerModeConfigs;
    var gesture_config_1 = require("./gestures/gesture-config");
    exports.IonicGestureConfig = gesture_config_1.IonicGestureConfig;
    /**
     * \@name IonicModule
     * \@description
     * IonicModule is an [NgModule](https://angular.io/docs/ts/latest/guide/ngmodule.html) that bootstraps
     * an Ionic App. By passing a root component, IonicModule will make sure that all of the components,
     * directives, and providers from the framework are imported.
     *
     * Any configuration for the app can be passed as the second argument to `forRoot`. This can be any
     * valid property from the [Config](/docs/api/config/Config/).
     *
     * \@usage
     * ```ts
     * import { NgModule } from '\@angular/core';
     *
     * import { IonicApp, IonicModule } from 'ionic-angular';
     *
     * import { MyApp } from './app.component';
     * import { HomePage } from '../pages/home/home';
     *
     * \@NgModule({
     *   declarations: [
     *     MyApp,
     *     HomePage
     *   ],
     *   imports: [
     *     BrowserModule,
     *     IonicModule.forRoot(MyApp, {
     *
     *     })
     *   ],
     *   bootstrap: [IonicApp],
     *   entryComponents: [
     *     MyApp,
     *     HomePage
     *   ],
     *   providers: []
     * })
     * export class AppModule {}
     * ```
     */
    var IonicModule = (function () {
        function IonicModule() {
        }
        /**
         * Set the root app component for you IonicModule
         * @param {?} appRoot
         * @param {?=} config
         * @param {?=} deepLinkConfig
         * @return {?}
         */
        IonicModule.forRoot = function (appRoot, config, deepLinkConfig) {
            if (config === void 0) { config = null; }
            if (deepLinkConfig === void 0) { deepLinkConfig = null; }
            return {
                ngModule: IonicModule,
                providers: [
                    // useValue: bootstrap values
                    { provide: app_root_1.AppRootToken, useValue: appRoot },
                    { provide: config_1.ConfigToken, useValue: config },
                    { provide: url_serializer_1.DeepLinkConfigToken, useValue: deepLinkConfig },
                    { provide: common_1.APP_BASE_HREF, useValue: '/' },
                    // useFactory: user values
                    { provide: platform_registry_1.PlatformConfigToken, useFactory: platform_registry_1.providePlatformConfigs },
                    // useFactory: ionic core providers
                    { provide: platform_1.Platform, useFactory: platform_1.setupPlatform, deps: [platform_browser_1.DOCUMENT, platform_registry_1.PlatformConfigToken, core_1.NgZone] },
                    { provide: config_1.Config, useFactory: config_1.setupConfig, deps: [config_1.ConfigToken, platform_1.Platform] },
                    // useFactory: ionic app initializers
                    { provide: core_1.APP_INITIALIZER, useFactory: mode_registry_1.registerModeConfigs, deps: [config_1.Config], multi: true },
                    { provide: core_1.APP_INITIALIZER, useFactory: events_1.setupProvideEvents, deps: [platform_1.Platform, dom_controller_1.DomController], multi: true },
                    { provide: core_1.APP_INITIALIZER, useFactory: tap_click_1.setupTapClick, deps: [config_1.Config, platform_1.Platform, dom_controller_1.DomController, app_1.App, core_1.NgZone, gesture_controller_1.GestureController], multi: true },
                    { provide: core_1.APP_INITIALIZER, useFactory: module_loader_1.setupPreloading, deps: [config_1.Config, url_serializer_1.DeepLinkConfigToken, module_loader_1.ModuleLoader, core_1.NgZone], multi: true },
                    { provide: core_1.APP_INITIALIZER, useFactory: ionic_core_1.setupCore, deps: [config_1.Config, platform_1.Platform, dom_controller_1.DomController, core_1.NgZone], multi: true },
                    // useClass
                    // { provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig },
                    // useValue
                    { provide: core_1.ANALYZE_FOR_ENTRY_COMPONENTS, useValue: appRoot, multi: true },
                    // ionic providers
                    action_sheet_controller_1.ActionSheetController,
                    alert_controller_1.AlertController,
                    app_1.App,
                    dom_controller_1.DomController,
                    events_1.Events,
                    form_1.Form,
                    gesture_controller_1.GestureController,
                    haptic_1.Haptic,
                    keyboard_1.Keyboard,
                    loading_controller_1.LoadingController,
                    common_1.Location,
                    menu_controller_1.MenuController,
                    modal_controller_1.ModalController,
                    picker_controller_1.PickerController,
                    popover_controller_1.PopoverController,
                    ng_module_loader_1.NgModuleLoader,
                    tap_click_1.TapClick,
                    toast_controller_1.ToastController,
                    transition_controller_1.TransitionController,
                    { provide: module_loader_1.ModuleLoader, useFactory: module_loader_1.provideModuleLoader, deps: [ng_module_loader_1.NgModuleLoader, core_1.Injector] },
                    { provide: common_1.LocationStrategy, useFactory: provideLocationStrategy, deps: [common_1.PlatformLocation, [new core_1.Inject(common_1.APP_BASE_HREF), new core_1.Optional()], config_1.Config] },
                    { provide: url_serializer_1.UrlSerializer, useFactory: url_serializer_1.setupUrlSerializer, deps: [url_serializer_1.DeepLinkConfigToken] },
                    { provide: deep_linker_1.DeepLinker, useFactory: deep_linker_1.setupDeepLinker, deps: [app_1.App, url_serializer_1.UrlSerializer, common_1.Location, module_loader_1.ModuleLoader, core_1.ComponentFactoryResolver] },
                ]
            };
        };
        return IonicModule;
    }());
    IonicModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        common_2.CommonModule,
                        forms_1.FormsModule,
                        forms_1.ReactiveFormsModule,
                        action_sheet_module_1.ActionSheetModule.forRoot(),
                        alert_module_1.AlertModule.forRoot(),
                        app_module_1.AppModule.forRoot(),
                        avatar_module_1.AvatarModule.forRoot(),
                        backdrop_module_1.BackdropModule.forRoot(),
                        button_module_1.ButtonModule.forRoot(),
                        card_module_1.CardModule.forRoot(),
                        checkbox_module_1.CheckboxModule.forRoot(),
                        chip_module_1.ChipModule.forRoot(),
                        click_block_module_1.ClickBlockModule.forRoot(),
                        content_module_1.ContentModule.forRoot(),
                        datetime_module_1.DateTimeModule.forRoot(),
                        fab_module_1.FabModule.forRoot(),
                        grid_module_1.GridModule.forRoot(),
                        icon_module_1.IconModule.forRoot(),
                        img_module_1.ImgModule.forRoot(),
                        infinite_scroll_module_1.InfiniteScrollModule.forRoot(),
                        input_module_1.InputModule.forRoot(),
                        item_module_1.ItemModule.forRoot(),
                        label_module_1.LabelModule.forRoot(),
                        list_module_1.ListModule.forRoot(),
                        loading_module_1.LoadingModule.forRoot(),
                        menu_module_1.MenuModule.forRoot(),
                        modal_module_1.ModalModule.forRoot(),
                        nav_module_1.NavModule.forRoot(),
                        navbar_module_1.NavbarModule.forRoot(),
                        note_module_1.NoteModule.forRoot(),
                        option_module_1.OptionModule.forRoot(),
                        picker_module_1.PickerModule.forRoot(),
                        popover_module_1.PopoverModule.forRoot(),
                        radio_module_1.RadioModule.forRoot(),
                        range_module_1.RangeModule.forRoot(),
                        refresher_module_1.RefresherModule.forRoot(),
                        scroll_module_1.ScrollModule.forRoot(),
                        searchbar_module_1.SearchbarModule.forRoot(),
                        segment_module_1.SegmentModule.forRoot(),
                        select_module_1.SelectModule.forRoot(),
                        show_hide_when_module_1.ShowHideWhenModule.forRoot(),
                        slides_module_1.SlidesModule.forRoot(),
                        spinner_module_1.SpinnerModule.forRoot(),
                        split_pane_module_1.SplitPaneModule.forRoot(),
                        tabs_module_1.TabsModule.forRoot(),
                        thumbnail_module_1.ThumbnailModule.forRoot(),
                        toast_module_1.ToastModule.forRoot(),
                        toggle_module_1.ToggleModule.forRoot(),
                        toolbar_module_1.ToolbarModule.forRoot(),
                        typography_module_1.TypographyModule.forRoot(),
                        virtual_scroll_module_1.VirtualScrollModule.forRoot()
                    ],
                    exports: [
                        common_2.CommonModule,
                        forms_1.FormsModule,
                        forms_1.ReactiveFormsModule,
                        action_sheet_module_1.ActionSheetModule,
                        alert_module_1.AlertModule,
                        app_module_1.AppModule,
                        avatar_module_1.AvatarModule,
                        backdrop_module_1.BackdropModule,
                        button_module_1.ButtonModule,
                        card_module_1.CardModule,
                        checkbox_module_1.CheckboxModule,
                        chip_module_1.ChipModule,
                        click_block_module_1.ClickBlockModule,
                        content_module_1.ContentModule,
                        datetime_module_1.DateTimeModule,
                        fab_module_1.FabModule,
                        grid_module_1.GridModule,
                        icon_module_1.IconModule,
                        img_module_1.ImgModule,
                        infinite_scroll_module_1.InfiniteScrollModule,
                        input_module_1.InputModule,
                        item_module_1.ItemModule,
                        label_module_1.LabelModule,
                        list_module_1.ListModule,
                        loading_module_1.LoadingModule,
                        menu_module_1.MenuModule,
                        modal_module_1.ModalModule,
                        nav_module_1.NavModule,
                        navbar_module_1.NavbarModule,
                        note_module_1.NoteModule,
                        option_module_1.OptionModule,
                        picker_module_1.PickerModule,
                        popover_module_1.PopoverModule,
                        radio_module_1.RadioModule,
                        range_module_1.RangeModule,
                        refresher_module_1.RefresherModule,
                        scroll_module_1.ScrollModule,
                        searchbar_module_1.SearchbarModule,
                        segment_module_1.SegmentModule,
                        select_module_1.SelectModule,
                        show_hide_when_module_1.ShowHideWhenModule,
                        slides_module_1.SlidesModule,
                        spinner_module_1.SpinnerModule,
                        split_pane_module_1.SplitPaneModule,
                        tabs_module_1.TabsModule,
                        thumbnail_module_1.ThumbnailModule,
                        toast_module_1.ToastModule,
                        toggle_module_1.ToggleModule,
                        toolbar_module_1.ToolbarModule,
                        typography_module_1.TypographyModule,
                        virtual_scroll_module_1.VirtualScrollModule
                    ],
                    schemas: [
                        core_1.CUSTOM_ELEMENTS_SCHEMA
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    IonicModule.ctorParameters = function () { return []; };
    exports.IonicModule = IonicModule;
    function IonicModule_tsickle_Closure_declarations() {
        /** @type {?} */
        IonicModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        IonicModule.ctorParameters;
    }
    /**
     * \@name IonicPageModule
     * \@description
     * IonicPageModule is an [NgModule](https://angular.io/docs/ts/latest/guide/ngmodule.html) that
     * bootstraps a child [IonicPage](../navigation/IonicPage/) in order to set up routing.
     *
     * \@usage
     * ```ts
     * import { NgModule } from '\@angular/core';
     *
     * import { IonicPageModule } from 'ionic-angular';
     *
     * import { HomePage } from './home';
     *
     * \@NgModule({
     * 	declarations: [
     * 		HomePage
     * 	],
     * 	imports: [
     * 		IonicPageModule.forChild(HomePage)
     * 	],
     * 	entryComponents: [
     * 		HomePage
     * 	]
     * })
     * export class HomePageModule { }
     * ```
     */
    var IonicPageModule = (function () {
        function IonicPageModule() {
        }
        /**
         * @param {?} page
         * @return {?}
         */
        IonicPageModule.forChild = function (page) {
            return {
                ngModule: IonicPageModule,
                providers: [
                    { provide: /** @type {?} */ (module_loader_1.LAZY_LOADED_TOKEN), useValue: page },
                    { provide: core_1.ANALYZE_FOR_ENTRY_COMPONENTS, useValue: page, multi: true },
                ]
            };
        };
        return IonicPageModule;
    }());
    IonicPageModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [IonicModule],
                    exports: [IonicModule]
                },] },
    ];
    /**
     * @nocollapse
     */
    IonicPageModule.ctorParameters = function () { return []; };
    exports.IonicPageModule = IonicPageModule;
    function IonicPageModule_tsickle_Closure_declarations() {
        /** @type {?} */
        IonicPageModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        IonicPageModule.ctorParameters;
    }
    /**
     * @hidden
     * @param {?} platformLocationStrategy
     * @param {?} baseHref
     * @param {?} config
     * @return {?}
     */
    function provideLocationStrategy(platformLocationStrategy, baseHref, config) {
        return config.get('locationStrategy') === 'path' ?
            new common_1.PathLocationStrategy(platformLocationStrategy, baseHref) :
            new common_1.HashLocationStrategy(platformLocationStrategy, baseHref);
    }
    exports.provideLocationStrategy = provideLocationStrategy;
});
//# sourceMappingURL=index.js.map
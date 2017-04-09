/**
 * Import Angular
 */
import { ModuleWithProviders } from '@angular/core';
import { HashLocationStrategy, PathLocationStrategy, PlatformLocation } from '@angular/common';
/**
 * Import Other
 */
import { DeepLinkConfig } from './navigation/nav-util';
import { Config } from './config/config';
/**
 * Export Modules
 */
export { ActionSheetModule } from './components/action-sheet/action-sheet.module';
export { AlertModule } from './components/alert/alert.module';
export { AppModule } from './components/app/app.module';
export { AvatarModule } from './components/avatar/avatar.module';
export { BackdropModule } from './components/backdrop/backdrop.module';
export { ButtonModule } from './components/button/button.module';
export { CardModule } from './components/card/card.module';
export { CheckboxModule } from './components/checkbox/checkbox.module';
export { ChipModule } from './components/chip/chip.module';
export { ClickBlockModule } from './components/click-block/click-block.module';
export { ContentModule } from './components/content/content.module';
export { DateTimeModule } from './components/datetime/datetime.module';
export { FabModule } from './components/fab/fab.module';
export { GridModule } from './components/grid/grid.module';
export { IconModule } from './components/icon/icon.module';
export { ImgModule } from './components/img/img.module';
export { InfiniteScrollModule } from './components/infinite-scroll/infinite-scroll.module';
export { InputModule } from './components/input/input.module';
export { ItemModule } from './components/item/item.module';
export { LabelModule } from './components/label/label.module';
export { ListModule } from './components/list/list.module';
export { LoadingModule } from './components/loading/loading.module';
export { MenuModule } from './components/menu/menu.module';
export { ModalModule } from './components/modal/modal.module';
export { NavModule } from './components/nav/nav.module';
export { NavbarModule } from './components/navbar/navbar.module';
export { NoteModule } from './components/note/note.module';
export { OptionModule } from './components/option/option.module';
export { PickerModule } from './components/picker/picker.module';
export { PopoverModule } from './components/popover/popover.module';
export { RadioModule } from './components/radio/radio.module';
export { RangeModule } from './components/range/range.module';
export { RefresherModule } from './components/refresher/refresher.module';
export { ScrollModule } from './components/scroll/scroll.module';
export { SearchbarModule } from './components/searchbar/searchbar.module';
export { SegmentModule } from './components/segment/segment.module';
export { SelectModule } from './components/select/select.module';
export { ShowHideWhenModule } from './components/show-hide-when/show-hide-when.module';
export { SlidesModule } from './components/slides/slides.module';
export { SpinnerModule } from './components/spinner/spinner.module';
export { SplitPaneModule } from './components/split-pane/split-pane.module';
export { TabsModule } from './components/tabs/tabs.module';
export { ThumbnailModule } from './components/thumbnail/thumbnail.module';
export { ToastModule } from './components/toast/toast.module';
export { ToggleModule } from './components/toggle/toggle.module';
export { ToolbarModule } from './components/toolbar/toolbar.module';
export { TypographyModule } from './components/typography/typography.module';
export { VirtualScrollModule } from './components/virtual-scroll/virtual-scroll.module';
/**
 * Export Components/Directives
 */
export { ActionSheet } from './components/action-sheet/action-sheet';
export { ActionSheetController } from './components/action-sheet/action-sheet-controller';
export { ActionSheetOptions } from './components/action-sheet/action-sheet-options';
export { AlertController } from './components/alert/alert-controller';
export { Alert } from './components/alert/alert';
export { AlertOptions, AlertInputOptions } from './components/alert/alert-options';
export { App } from './components/app/app';
export { Avatar } from './components/avatar/avatar';
export { Backdrop } from './components/backdrop/backdrop';
export { Button } from './components/button/button';
export { Card } from './components/card/card';
export { CardContent } from './components/card/card-content';
export { CardHeader } from './components/card/card-header';
export { CardTitle } from './components/card/card-title';
export { Checkbox } from './components/checkbox/checkbox';
export { Chip } from './components/chip/chip';
export { ClickBlock } from './components/click-block/click-block';
export { Content, ScrollEvent } from './components/content/content';
export { DateTime } from './components/datetime/datetime';
export { FabButton } from './components/fab/fab';
export { FabContainer } from './components/fab/fab-container';
export { FabList } from './components/fab/fab-list';
export { Col } from './components/grid/col';
export { Grid } from './components/grid/grid';
export { Row } from './components/grid/row';
export { Ion } from './components/ion';
export { Icon } from './components/icon/icon';
export { Img } from './components/img/img';
export { InfiniteScroll } from './components/infinite-scroll/infinite-scroll';
export { InfiniteScrollContent } from './components/infinite-scroll/infinite-scroll-content';
export { TextInput } from './components/input/input';
export { IonicApp } from './components/app/app-root';
export { Item } from './components/item/item';
export { ItemContent } from './components/item/item-content';
export { ItemDivider } from './components/item/item-divider';
export { ItemGroup } from './components/item/item-group';
export { ItemReorder } from './components/item/item-reorder';
export { Reorder } from './components/item/reorder';
export { ItemSliding } from './components/item/item-sliding';
export { ItemOptions } from './components/item/item-options';
export { Label } from './components/label/label';
export { List } from './components/list/list';
export { ListHeader } from './components/list/list-header';
export { Loading } from './components/loading/loading';
export { LoadingController } from './components/loading/loading-controller';
export { LoadingOptions } from './components/loading/loading-options';
export { Menu } from './components/menu/menu';
export { MenuClose } from './components/menu/menu-close';
export { MenuController } from './components/menu/menu-controller';
export { MenuToggle } from './components/menu/menu-toggle';
export { MenuType } from './components/menu/menu-types';
export { Modal } from './components/modal/modal';
export { ModalController } from './components/modal/modal-controller';
export { ModalOptions } from './components/modal/modal-options';
export { Nav } from './components/nav/nav';
export { NavPop } from './components/nav/nav-pop';
export { NavPopAnchor } from './components/nav/nav-pop-anchor';
export { NavPush } from './components/nav/nav-push';
export { NavPushAnchor } from './components/nav/nav-push-anchor';
export { Navbar } from './components/navbar/navbar';
export { NativeInput } from './components/input/native-input';
export { NextInput } from './components/input/next-input';
export { Note } from './components/note/note';
export { Option } from './components/option/option';
export { OverlayPortal } from './components/nav/overlay-portal';
export { Picker } from './components/picker/picker';
export { PickerController } from './components/picker/picker-controller';
export { PickerOptions, PickerColumn, PickerColumnOption } from './components/picker/picker-options';
export { Popover } from './components/popover/popover';
export { PopoverController } from './components/popover/popover-controller';
export { PopoverOptions } from './components/popover/popover-options';
export { RadioButton } from './components/radio/radio-button';
export { RadioGroup } from './components/radio/radio-group';
export { Range } from './components/range/range';
export { RangeKnob } from './components/range/range-knob';
export { Refresher } from './components/refresher/refresher';
export { RefresherContent } from './components/refresher/refresher-content';
export { Scroll } from './components/scroll/scroll';
export { Searchbar } from './components/searchbar/searchbar';
export { Segment } from './components/segment/segment';
export { SegmentButton } from './components/segment/segment-button';
export { Select } from './components/select/select';
export { ShowWhen } from './components/show-hide-when/show-when';
export { DisplayWhen } from './components/show-hide-when/display-when';
export { HideWhen } from './components/show-hide-when/hide-when';
export { Slide } from './components/slides/slide';
export { Slides } from './components/slides/slides';
export { Spinner } from './components/spinner/spinner';
export { SplitPane, RootNode } from './components/split-pane/split-pane';
export { setupCore } from './util/ionic-core';
export { Tab } from './components/tabs/tab';
export { TabButton } from './components/tabs/tab-button';
export { TabHighlight } from './components/tabs/tab-highlight';
export { Tabs } from './components/tabs/tabs';
export { TapClick, setupTapClick, isActivatable } from './tap-click/tap-click';
export { Toast } from './components/toast/toast';
export { ToastController } from './components/toast/toast-controller';
export { ToastOptions } from './components/toast/toast-options';
export { Toggle } from './components/toggle/toggle';
export { ToolbarBase } from './components/toolbar/toolbar-base';
export { Toolbar } from './components/toolbar/toolbar';
export { Header } from './components/toolbar/toolbar-header';
export { Footer } from './components/toolbar/toolbar-footer';
export { ToolbarItem } from './components/toolbar/toolbar-item';
export { ToolbarTitle } from './components/toolbar/toolbar-title';
export { Thumbnail } from './components/thumbnail/thumbnail';
export { Typography } from './components/typography/typography';
export { VirtualScroll } from './components/virtual-scroll/virtual-scroll';
/**
 * Export Providers
 */
export { Config, setupConfig, ConfigToken } from './config/config';
export { DomController, DomCallback } from './platform/dom-controller';
export { Platform, setupPlatform } from './platform/platform';
export { Haptic } from './tap-click/haptic';
export { DeepLinker } from './navigation/deep-linker';
export { IonicPage, IonicPageMetadata } from './navigation/ionic-page';
export { NavController } from './navigation/nav-controller';
export { NavControllerBase } from './navigation/nav-controller-base';
export { NavParams } from './navigation/nav-params';
export { NavLink, NavOptions, DeepLinkConfig, DeepLinkMetadata, DeepLinkMetadataFactory } from './navigation/nav-util';
export { UrlSerializer, DeepLinkConfigToken } from './navigation/url-serializer';
export { ViewController } from './navigation/view-controller';
export { ActionSheetCmp } from './components/action-sheet/action-sheet-component';
export { AlertCmp } from './components/alert/alert-component';
export { LoadingCmp } from './components/loading/loading-component';
export { ModalCmp } from './components/modal/modal-component';
export { PickerCmp } from './components/picker/picker-component';
export { PickerColumnCmp } from './components/picker/picker-column';
export { PopoverCmp } from './components/popover/popover-component';
export { ToastCmp } from './components/toast/toast-component';
/**
 * Export Utils
 */
export { PanGesture, PanGestureConfig } from './gestures/drag-gesture';
export { Gesture } from './gestures/gesture';
export { SlideEdgeGesture } from './gestures/slide-edge-gesture';
export { SlideData, SlideGesture } from './gestures/slide-gesture';
export { BLOCK_ALL, BlockerOptions, GESTURE_GO_BACK_SWIPE, GESTURE_MENU_SWIPE, GESTURE_ITEM_SWIPE, GESTURE_REFRESHER, GESTURE_TOGGLE, GestureOptions, GestureController, GestureDelegate, BlockerDelegate } from './gestures/gesture-controller';
export { Events, setupEvents, setupProvideEvents } from './util/events';
export { IonicErrorHandler } from './util/ionic-error-handler';
export { Keyboard } from './platform/keyboard';
export { Form, IonicFormInput, IonicTapInput } from './util/form';
export { reorderArray } from './util/util';
export { Animation, AnimationOptions, EffectProperty, EffectState, PlayOptions } from './animations/animation';
export { PageTransition } from './transitions/page-transition';
export { Transition } from './transitions/transition';
export { PlatformConfigToken } from './platform/platform-registry';
export { registerModeConfigs } from './config/mode-registry';
export { IonicGestureConfig } from './gestures/gesture-config';
/**
 * @name IonicModule
 * @description
 * IonicModule is an [NgModule](https://angular.io/docs/ts/latest/guide/ngmodule.html) that bootstraps
 * an Ionic App. By passing a root component, IonicModule will make sure that all of the components,
 * directives, and providers from the framework are imported.
 *
 * Any configuration for the app can be passed as the second argument to `forRoot`. This can be any
 * valid property from the [Config](/docs/api/config/Config/).
 *
 * @usage
 * ```ts
 * import { NgModule } from '@angular/core';
 *
 * import { IonicApp, IonicModule } from 'ionic-angular';
 *
 * import { MyApp } from './app.component';
 * import { HomePage } from '../pages/home/home';
 *
 * @NgModule({
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
export declare class IonicModule {
    /**
     * Set the root app component for you IonicModule
     * @param {any} appRoot The root AppComponent for this app.
     * @param {any} config Config Options for the app. Accepts any config property.
     * @param {any} deepLinkConfig Any configuration needed for the Ionic Deeplinker.
     */
    static forRoot(appRoot: any, config?: any, deepLinkConfig?: DeepLinkConfig): ModuleWithProviders;
}
/**
 * @name IonicPageModule
 * @description
 * IonicPageModule is an [NgModule](https://angular.io/docs/ts/latest/guide/ngmodule.html) that
 * bootstraps a child [IonicPage](../navigation/IonicPage/) in order to set up routing.
 *
 * @usage
 * ```ts
 * import { NgModule } from '@angular/core';
 *
 * import { IonicPageModule } from 'ionic-angular';
 *
 * import { HomePage } from './home';
 *
 * @NgModule({
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
export declare class IonicPageModule {
    static forChild(page: any): ModuleWithProviders;
}
/**
 * @hidden
 */
export declare function provideLocationStrategy(platformLocationStrategy: PlatformLocation, baseHref: string, config: Config): HashLocationStrategy | PathLocationStrategy;

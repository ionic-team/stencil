import { App } from '../app/app';
import { Config } from '../../config/config';
import { LoadingOptions } from './loading-options';
import { NavOptions } from '../../navigation/nav-util';
import { ViewController } from '../../navigation/view-controller';
/**
 * @hidden
 */
export declare class Loading extends ViewController {
    private _app;
    constructor(app: App, opts: LoadingOptions, config: Config);
    /**
     * @hidden
     */
    getTransitionName(direction: string): string;
    /**
     * @param {string} sets the html content for the loading indicator.
     */
    setContent(content: string): Loading;
    /**
     * @param {string} sets the name of the SVG spinner for the loading indicator.
     */
    setSpinner(spinner: string): Loading;
    /**
     * @param {string} sets additional classes for custom styles, separated by spaces.
     */
    setCssClass(cssClass: string): Loading;
    /**
     * @param {string} sets whether to show the backdrop.
     */
    setShowBackdrop(showBackdrop: boolean): Loading;
    /**
     * @param {string} how many milliseconds to wait before hiding the indicator.
     */
    setDuration(dur: number): Loading;
    /**
     * Present the loading instance.
     *
     * @param {NavOptions} [opts={}] Nav options to go with this transition.
     * @returns {Promise} Returns a promise which is resolved when the transition has completed.
     */
    present(navOptions?: NavOptions): Promise<any>;
    /**
     * Dismiss all loading components which have been presented.
     */
    dismissAll(): void;
}

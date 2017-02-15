
declare var Vue: any;


export let Component: {
  (meta: {
    selector: string;
    template?: string;
    templateUrl?: string;
    stylesheets?: string[];
  }): any;
};
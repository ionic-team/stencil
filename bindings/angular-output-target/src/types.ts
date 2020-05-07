export interface OutputTargetAngular {
  componentCorePackage?: string;
  directivesProxyFile: string;
  directivesArrayFile?: string;
  directivesUtilsFile?: string;
  valueAccessorConfigs?: ValueAccessorConfig[];
  excludeComponents?: string[];
}

export type ValueAccessorTypes = 'text' | 'radio' | 'select' | 'number' | 'boolean';

/*
  const EVENTS = {
    'Select': 'ionSelect',
    'Change': 'ionChange'
  };

  const ATTRS = {
    'Checked': 'checked',
    'Value': 'value'
  };

  const angularValueAccessorBindings: ValueAccessorConfig[] = [
    {
      elementSelectors: [ 'ion-checkbox', 'ion-toggle' ],
      event: EVENTS.Change,
      targetAttr: ATTRS.Checked,
      type: 'boolean'
    },
    {
      elementSelectors: [ 'ion-input[type=number]' ],
      event: EVENTS.Change,
      targetAttr: ATTRS.Value,
      type: 'number'
    },
    {
      elementSelectors: [ 'ion-radio' ],
      event: EVENTS.Select,
      targetAttr: ATTRS.Checked,
      type: 'radio'
    },
    {
      elementSelectors: [ 'ion-range', 'ion-select', 'ion-radio-group', 'ion-segment', 'ion-datetime' ],
      event: EVENTS.Change,
      targetAttr: ATTRS.Value,
      type: 'select'
    },
    {
      elementSelectors: ['ion-input:not([type=number])', 'ion-textarea', 'ion-searchbar'],
      event: EVENTS.Change,
      targetAttr: ATTRS.Value,
      type: 'text'
    },
  ];
*/
export interface ValueAccessorConfig {
  elementSelectors: string | string[];
  event: string;
  targetAttr: string;
  type: ValueAccessorTypes;
}

export interface PackageJSON {
  types: string;
}

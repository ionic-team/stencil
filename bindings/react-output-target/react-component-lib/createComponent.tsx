import React from 'react';

import {
  attachEventProps,
  createForwardRef,
  dashToPascalCase,
  isCoveredByReact,
} from './utils/index';

interface IonicReactInternalProps<ElementType> extends React.HTMLAttributes<ElementType> {
  forwardedRef?: React.Ref<ElementType>;
  ref?: React.Ref<any>;
}

export const createReactComponent = <PropType, ElementType>(tagName: string) => {
  const displayName = dashToPascalCase(tagName);
  const ReactComponent = class extends React.Component<IonicReactInternalProps<ElementType>> {
    
    private ref: React.RefObject<HTMLElement>;
    
    constructor(props: IonicReactInternalProps<ElementType>) {
      super(props);
      this.ref = React.createRef<HTMLElement>();
    }

    componentDidMount() {
      this.componentDidUpdate(this.props);
    }

    componentDidUpdate(prevProps: IonicReactInternalProps<ElementType>) {
      const node = this.ref.current;
      attachEventProps(node, this.props, prevProps);
    }

    render() {
      const { children, forwardedRef, style, className, ref, ...cProps } = this.props;

      const propsToPass = Object.keys(cProps).reduce((acc, name) => {
        const isEventProp = name.indexOf('on') === 0 && name[2] === name[2].toUpperCase();
        const isDataProp = name.indexOf('data-') === 0;
        const isAriaProp = name.indexOf('aria-') === 0;

        if (isEventProp) {
          const eventName = name.substring(2).toLowerCase();
          if (typeof document !== "undefined" && isCoveredByReact(eventName)) {
            (acc as any)[name] = (cProps as any)[name];
          }
        } else if (isDataProp || isAriaProp) {
          (acc as any)[name] = (cProps as any)[name];
        }
        return acc;
      }, {});

      const newProps: any = {
        ...propsToPass,
        ref: this.ref,
        style,
        className,
      };

      return React.createElement(tagName, newProps, children);
    }

    static get displayName() {
      return displayName;
    }
  };
  return createForwardRef<PropType, ElementType>(ReactComponent, displayName);
};

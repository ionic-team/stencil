import { Component, HostContentNodes, ProxyElement, VNodeData } from '../util/interfaces';


export function themeVNodeData(instance: Component, cssClassName: string, vnodeData: VNodeData = {}): VNodeData {
  const cssClasses = vnodeData['class'] = vnodeData['class'] || {};
  const mode = instance.mode;
  const color = instance.color;

  cssClasses[cssClassName] = true;

  if (mode) {
    cssClasses[`${cssClassName}-${mode}`] = true;

    if (color) {
      cssClasses[`${cssClassName}-${color}`] = cssClasses[`${cssClassName}-${mode}-${color}`] = true;
    }
  }

  return vnodeData;
}


export function collectedHostContentNodes(elm: ProxyElement, namedSlots: string[]) {
  const childNodes = elm.childNodes;

  if (!namedSlots) {
    return <HostContentNodes>{
      $defaultSlot: <any>childNodes
    };
  }

  const hostContentNodes: HostContentNodes = {
    $defaultSlot: [],
    $namedSlots: {}
  };

  const namedSlotsLen = namedSlots.length;
  const hostNamedSlots = hostContentNodes.$namedSlots;

  for (let i = 0, ilen = childNodes.length; i < ilen; i++) {
    var namedNode = false;
    var childNode = childNodes[i];

    if (childNode.nodeType === 1) {
      // element node
      for (var j = 0; j < namedSlotsLen; j++) {
        if ((<HTMLElement>childNode).getAttribute('slot') === namedSlots[j]) {
          (hostNamedSlots[namedSlots[j]] = hostNamedSlots[namedSlots[j]] || []).push(childNode);
          namedNode = true;
          break;
        }
      }
    }

    if (!namedNode) {
      hostContentNodes.$defaultSlot.push(childNode);
    }
  }

  return hostContentNodes;
}

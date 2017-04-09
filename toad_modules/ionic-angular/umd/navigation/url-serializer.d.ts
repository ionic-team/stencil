import { OpaqueToken } from '@angular/core';
import { DeepLinkConfig, NavLink, NavSegment } from './nav-util';
/**
 * @hidden
 */
export declare class UrlSerializer {
    links: NavLink[];
    constructor(config: DeepLinkConfig);
    /**
     * Parse the URL into a Path, which is made up of multiple NavSegments.
     * Match which components belong to each segment.
     */
    parse(browserUrl: string): NavSegment[];
    createSegmentFromName(nameOrComponent: any): NavSegment;
    getLinkFromName(nameOrComponent: any): NavLink;
    /**
     * Serialize a path, which is made up of multiple NavSegments,
     * into a URL string. Turn each segment into a string and concat them to a URL.
     */
    serialize(path: NavSegment[]): string;
    /**
     * Serializes a component and its data into a NavSegment.
     */
    serializeComponent(component: any, data: any): NavSegment;
    /** @internal */
    _createSegment(configLink: NavLink, data: any): NavSegment;
    formatUrlPart(name: string): string;
}
export declare const parseUrlParts: (urlParts: string[], configLinks: NavLink[]) => NavSegment[];
export declare const fillMatchedUrlParts: (segments: NavSegment[], urlParts: string[], configLink: NavLink) => void;
export declare const isPartMatch: (urlPart: string, configLinkPart: string) => boolean;
export declare const createMatchedData: (matchedUrlParts: string[], link: NavLink) => any;
export declare const findLinkByComponentData: (links: NavLink[], component: any, instanceData: any) => NavLink;
export declare const normalizeLinks: (links: NavLink[]) => NavLink[];
/**
 * @hidden
 */
export declare const DeepLinkConfigToken: OpaqueToken;
export declare function setupUrlSerializer(userDeepLinkConfig: any): UrlSerializer;

(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../util/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var util_1 = require("../util/util");
    /**
     * @hidden
     */
    var UrlSerializer = (function () {
        /**
         * @param {?} config
         */
        function UrlSerializer(config) {
            if (config && util_1.isArray(config.links)) {
                this.links = exports.normalizeLinks(config.links);
            }
            else {
                this.links = [];
            }
        }
        /**
         * Parse the URL into a Path, which is made up of multiple NavSegments.
         * Match which components belong to each segment.
         * @param {?} browserUrl
         * @return {?}
         */
        UrlSerializer.prototype.parse = function (browserUrl) {
            if (browserUrl.charAt(0) === '/') {
                browserUrl = browserUrl.substr(1);
            }
            // trim off data after ? and #
            browserUrl = browserUrl.split('?')[0].split('#')[0];
            return exports.parseUrlParts(browserUrl.split('/'), this.links);
        };
        /**
         * @param {?} nameOrComponent
         * @return {?}
         */
        UrlSerializer.prototype.createSegmentFromName = function (nameOrComponent) {
            var /** @type {?} */ configLink = this.getLinkFromName(nameOrComponent);
            return configLink ? {
                id: configLink.name,
                name: configLink.name,
                component: configLink.component,
                loadChildren: configLink.loadChildren,
                data: null,
                defaultHistory: configLink.defaultHistory
            } : null;
        };
        /**
         * @param {?} nameOrComponent
         * @return {?}
         */
        UrlSerializer.prototype.getLinkFromName = function (nameOrComponent) {
            return this.links.find(function (link) {
                return (link.component === nameOrComponent) ||
                    (link.name === nameOrComponent);
            });
        };
        /**
         * Serialize a path, which is made up of multiple NavSegments,
         * into a URL string. Turn each segment into a string and concat them to a URL.
         * @param {?} path
         * @return {?}
         */
        UrlSerializer.prototype.serialize = function (path) {
            return '/' + path.map(function (segment) { return segment.id; }).join('/');
        };
        /**
         * Serializes a component and its data into a NavSegment.
         * @param {?} component
         * @param {?} data
         * @return {?}
         */
        UrlSerializer.prototype.serializeComponent = function (component, data) {
            if (component) {
                var /** @type {?} */ link = exports.findLinkByComponentData(this.links, component, data);
                if (link) {
                    return this._createSegment(link, data);
                }
            }
            return null;
        };
        /**
         * \@internal
         * @param {?} configLink
         * @param {?} data
         * @return {?}
         */
        UrlSerializer.prototype._createSegment = function (configLink, data) {
            var /** @type {?} */ urlParts = configLink.parts;
            if (util_1.isPresent(data)) {
                // create a copy of the original parts in the link config
                urlParts = urlParts.slice();
                // loop through all the data and convert it to a string
                var /** @type {?} */ keys = Object.keys(data);
                var /** @type {?} */ keysLength = keys.length;
                if (keysLength) {
                    for (var /** @type {?} */ i = 0; i < urlParts.length; i++) {
                        if (urlParts[i].charAt(0) === ':') {
                            for (var /** @type {?} */ j = 0; j < keysLength; j++) {
                                if (urlParts[i] === ":" + keys[j]) {
                                    // this data goes into the URL part (between slashes)
                                    urlParts[i] = encodeURIComponent(data[keys[j]]);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            return {
                id: urlParts.join('/'),
                name: configLink.name,
                component: configLink.component,
                loadChildren: configLink.loadChildren,
                data: data,
                defaultHistory: configLink.defaultHistory
            };
        };
        /**
         * @param {?} name
         * @return {?}
         */
        UrlSerializer.prototype.formatUrlPart = function (name) {
            name = name.replace(URL_REPLACE_REG, '-');
            name = name.charAt(0).toLowerCase() + name.substring(1).replace(/[A-Z]/g, function (match) {
                return '-' + match.toLowerCase();
            });
            while (name.indexOf('--') > -1) {
                name = name.replace('--', '-');
            }
            if (name.charAt(0) === '-') {
                name = name.substring(1);
            }
            if (name.substring(name.length - 1) === '-') {
                name = name.substring(0, name.length - 1);
            }
            return encodeURIComponent(name);
        };
        return UrlSerializer;
    }());
    exports.UrlSerializer = UrlSerializer;
    function UrlSerializer_tsickle_Closure_declarations() {
        /** @type {?} */
        UrlSerializer.prototype.links;
    }
    exports.parseUrlParts = function (urlParts, configLinks) {
        var /** @type {?} */ configLinkLen = configLinks.length;
        var /** @type {?} */ urlPartsLen = urlParts.length;
        var /** @type {?} */ segments = new Array(urlPartsLen);
        for (var /** @type {?} */ i = 0; i < configLinkLen; i++) {
            // compare url parts to config link parts to create nav segments
            var /** @type {?} */ configLink = configLinks[i];
            if (configLink.partsLen <= urlPartsLen) {
                exports.fillMatchedUrlParts(segments, urlParts, configLink);
            }
        }
        // remove all the undefined segments
        for (var /** @type {?} */ i = urlPartsLen - 1; i >= 0; i--) {
            if (segments[i] === undefined) {
                if (urlParts[i] === undefined) {
                    // not a used part, so remove it
                    segments.splice(i, 1);
                }
                else {
                    // create an empty part
                    segments[i] = {
                        id: urlParts[i],
                        name: urlParts[i],
                        component: null,
                        loadChildren: null,
                        data: null
                    };
                }
            }
        }
        return segments;
    };
    exports.fillMatchedUrlParts = function (segments, urlParts, configLink) {
        for (var /** @type {?} */ i = 0; i < urlParts.length; i++) {
            var /** @type {?} */ urlI = i;
            for (var /** @type {?} */ j = 0; j < configLink.partsLen; j++) {
                if (exports.isPartMatch(urlParts[urlI], configLink.parts[j])) {
                    urlI++;
                }
                else {
                    break;
                }
            }
            if ((urlI - i) === configLink.partsLen) {
                var /** @type {?} */ matchedUrlParts = urlParts.slice(i, urlI);
                for (var /** @type {?} */ j = i; j < urlI; j++) {
                    urlParts[j] = undefined;
                }
                segments[i] = {
                    id: matchedUrlParts.join('/'),
                    name: configLink.name,
                    component: configLink.component,
                    loadChildren: configLink.loadChildren,
                    data: exports.createMatchedData(matchedUrlParts, configLink),
                    defaultHistory: configLink.defaultHistory
                };
            }
        }
    };
    exports.isPartMatch = function (urlPart, configLinkPart) {
        if (util_1.isPresent(urlPart) && util_1.isPresent(configLinkPart)) {
            if (configLinkPart.charAt(0) === ':') {
                return true;
            }
            return (urlPart === configLinkPart);
        }
        return false;
    };
    exports.createMatchedData = function (matchedUrlParts, link) {
        var /** @type {?} */ data = null;
        for (var /** @type {?} */ i = 0; i < link.partsLen; i++) {
            if (link.parts[i].charAt(0) === ':') {
                data = data || {};
                data[link.parts[i].substring(1)] = decodeURIComponent(matchedUrlParts[i]);
            }
        }
        return data;
    };
    exports.findLinkByComponentData = function (links, component, instanceData) {
        var /** @type {?} */ foundLink = null;
        var /** @type {?} */ foundLinkDataMatches = -1;
        for (var /** @type {?} */ i = 0; i < links.length; i++) {
            var /** @type {?} */ link = links[i];
            if (link.component === component) {
                // ok, so the component matched, but multiple links can point
                // to the same component, so let's make sure this is the right link
                var /** @type {?} */ dataMatches = 0;
                if (instanceData) {
                    var /** @type {?} */ instanceDataKeys = Object.keys(instanceData);
                    // this link has data
                    for (var /** @type {?} */ j = 0; j < instanceDataKeys.length; j++) {
                        if (util_1.isPresent(link.dataKeys[instanceDataKeys[j]])) {
                            dataMatches++;
                        }
                    }
                }
                else if (link.dataLen) {
                    // this component does not have data but the link does
                    continue;
                }
                if (dataMatches >= foundLinkDataMatches) {
                    foundLink = link;
                    foundLinkDataMatches = dataMatches;
                }
            }
        }
        return foundLink;
    };
    exports.normalizeLinks = function (links) {
        for (var /** @type {?} */ i = 0, /** @type {?} */ ilen = links.length; i < ilen; i++) {
            var /** @type {?} */ link = links[i];
            if (util_1.isBlank(link.segment)) {
                link.segment = link.name;
            }
            link.dataKeys = {};
            link.parts = link.segment.split('/');
            link.partsLen = link.parts.length;
            // used for sorting
            link.staticLen = link.dataLen = 0;
            var /** @type {?} */ stillCountingStatic = true;
            for (var /** @type {?} */ j = 0; j < link.partsLen; j++) {
                if (link.parts[j].charAt(0) === ':') {
                    link.dataLen++;
                    stillCountingStatic = false;
                    link.dataKeys[link.parts[j].substring(1)] = true;
                }
                else if (stillCountingStatic) {
                    link.staticLen++;
                }
            }
        }
        // sort by the number of parts, with the links
        // with the most parts first
        return links.sort(sortConfigLinks);
    };
    /**
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    function sortConfigLinks(a, b) {
        // sort by the number of parts
        if (a.partsLen > b.partsLen) {
            return -1;
        }
        if (a.partsLen < b.partsLen) {
            return 1;
        }
        // sort by the number of static parts in a row
        if (a.staticLen > b.staticLen) {
            return -1;
        }
        if (a.staticLen < b.staticLen) {
            return 1;
        }
        // sort by the number of total data parts
        if (a.dataLen < b.dataLen) {
            return -1;
        }
        if (a.dataLen > b.dataLen) {
            return 1;
        }
        return 0;
    }
    var /** @type {?} */ URL_REPLACE_REG = /\s+|\?|\!|\$|\,|\.|\+|\"|\'|\*|\^|\||\/|\\|\[|\]|#|%|`|>|<|;|:|@|&|=/g;
    /**
     * @hidden
     */
    exports.DeepLinkConfigToken = new core_1.OpaqueToken('USERLINKS');
    /**
     * @param {?} userDeepLinkConfig
     * @return {?}
     */
    function setupUrlSerializer(userDeepLinkConfig) {
        return new UrlSerializer(userDeepLinkConfig);
    }
    exports.setupUrlSerializer = setupUrlSerializer;
});
//# sourceMappingURL=url-serializer.js.map
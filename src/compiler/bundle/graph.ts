/*
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

import * as path from 'path';
import { GraphData } from '../../util/interfaces';


class BiMap {
  private deps_: GraphData;
  private incs_: GraphData;

  constructor(deps: GraphData) {
    this.deps_ = new Map(deps);
    this.incs_ = new Map();

    for (const src of deps.keys()) {
      this.incs_.set(src, [src]);
    }

    deps.forEach((required, src) => {
      required.forEach((require) => {
        const l = this.incs_.get(require);
        if (l == null) {
          this.incs_.set(require, []);
        } else if (l.indexOf(src) === -1) {
          l.push(src);
        }
      });
    });
    this.incs_.forEach((value) => value.sort());
  }

  requires(src: string): string[] {
    return this.deps_.get(src) || [];
  }

  requiredBy(src: string): string[] {
    return this.incs_.get(src) || [];
  }
}


export class Module {
  constructor(public id: string, public srcs: string[], public entrypoint: boolean = false) {
    this.srcs = srcs.slice();
  }

  external(id: string, pwd: string = '.') {
    if (id.startsWith('./')) {
      // these are relative to the module file being evaluated, so don't have an opinion
      // e.g., 'foo/bar/test.js' importing './other.js' will see that literal passed here
      return undefined;
    } else if (!id.startsWith('/')) {
      // this is an unknown/unsupported module, it's definitely an extern
      return true;
    }
    const rel = './' + path.relative(pwd, id);
    return (this.srcs.indexOf(rel) === -1);
  }
}

export function processGraph(graph: GraphData, entrypoints: string[]): Module[] {
  const map = new BiMap(graph);

  // walk over graph and set (1<<n) for all demands
  const hashes = new Map();
  entrypoints.forEach((entrypoint, n) => {
    const pending = new Set([entrypoint]);
    pending.forEach((next) => {
      hashes.set(next, (hashes.get(next) || 0) | (1 << n));
      map.requires(next).forEach((src) => pending.add(src));
    });
  });

  // find all files in the same module
  const grow = (from: string) => {
    const hash = hashes.get(from);
    const wouldSplitSrc = (src: string) => {
      // entrypoints are always their own starting point
      if (entrypoints.indexOf(src) !== -1) {
        return true;
      }
      // checks that the src is the given hash, AND has inputs only matching that hash
      if (hashes.get(src) !== hash) {
        return true;
      }
      const all = map.requiredBy(src);
      return all.some((other) => hashes.get(other) !== hash);
    };

    // not a module entrypoint
    if (!wouldSplitSrc(from)) {
      return null;
    }

    const include = [from];
    const seen = new Set(include);

    for (let i = 0, curr; curr = include[i]; ++i) {
      const pending = map.requires(curr);
      for (let j = 0, cand; cand = pending[j]; ++j) {
        if (seen.has(cand)) {
          continue;
        }
        seen.add(cand);
        if (!wouldSplitSrc(cand)) {
          include.push(cand);
        }
      }
    }

    return include;
  };

  const modules: Module[] = [];
  hashes.forEach((hash, src) => {
    hash;
    const srcs = grow(src);
    if (srcs) {
      const entrypoint = entrypoints.indexOf(src) !== -1;
      modules.push(new Module(src, srcs, entrypoint));
    }
  });

  return modules;
}

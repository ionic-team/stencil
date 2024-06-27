import assert from 'node:assert'

import { run } from '@stencil/core/cli'
import { version } from '@stencil/core/compiler'
import { MockDocument } from '@stencil/core/mock-doc';
import type { BuildConditionals } from '@stencil/core/internal';
import { BUILD } from '@stencil/core/internal/app-data'
import * as foo from '@stencil/core/internal/client'

assert(typeof version === 'string')
version.slice()
BUILD as BuildConditionals

assert(typeof run, 'function')
run.call

assert(typeof MockDocument === 'function')
assert(typeof BUILD !== 'undefined')

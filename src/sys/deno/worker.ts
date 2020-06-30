import '@stencil/core/compiler';
import { initDenoWorkerThread } from './deno-worker-thread';
import { createDenoSys, createDenoLogger } from '@sys-api-deno';
import type { Deno as DenoTypes } from '../../../types/lib.deno';

declare const Deno: typeof DenoTypes;

const coreCompiler = (globalThis as any).stencil as typeof import('@stencil/core/compiler');
const denoLogger = createDenoLogger({ Deno });
const denoSys = createDenoSys({ Deno, logger: denoLogger });
const msgHandler = coreCompiler.createWorkerMessageHandler(denoSys);

initDenoWorkerThread(globalThis, msgHandler);

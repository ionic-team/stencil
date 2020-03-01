import * as d from '@stencil/core/internal';
import { QueuedLoadModule } from './testing-task-queue';

export const styles: d.StyleMap = new Map();
export const cstrs = new Map<string, d.ComponentTestingConstructor>();
export const queuedTicks: Function[] = [];
export const queuedWriteTasks: d.RafCallback[] = [];
export const queuedReadTasks: d.RafCallback[] = [];
export const moduleLoaded = new Map();
export const queuedLoadModules: QueuedLoadModule[] = [];
export const caughtErrors: Error[] = [];
export const hostRefs = new Map<d.RuntimeRef, d.HostRef>();

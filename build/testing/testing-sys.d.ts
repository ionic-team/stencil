import type { CompilerSystem } from '@stencil/core/internal';
export interface TestingSystem extends CompilerSystem {
    diskReads: number;
    diskWrites: number;
}
export declare const createTestingSystem: () => TestingSystem;

import { DevServer, Logger, StencilDevServerConfig as DevServerConfig } from '@stencil/core/internal';

export declare function startServer(devServerConfig: DevServerConfig, logger: Logger): Promise<DevServer>;
export declare function openInBrowser(opts: { url: string }): Promise<void>;

export { DevServer, DevServerConfig, Logger };

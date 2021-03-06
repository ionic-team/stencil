import { OS_PLATFORM } from '../environment';

export const EOL = '\n';

export const platform = () => (OS_PLATFORM === 'windows' ? 'win32' : OS_PLATFORM);

export default {
  EOL,
  platform,
};

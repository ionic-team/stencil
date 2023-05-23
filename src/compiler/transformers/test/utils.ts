import ionicConfig from '@ionic/prettier-config';
import { format } from 'prettier';

export const formatCode = (code: string) => format(code, { ...ionicConfig, parser: 'typescript' });

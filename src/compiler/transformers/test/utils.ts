import ionicConfig from '@ionic/prettier-config';
import { format } from 'prettier';

/**
 * Use the ionic-wide configuration to format some code and return the result.
 * Useful for making assertions in tests that involve code strings more robust.
 *
 * @param code the string to format
 * @returns a Promise wrapping the formatted code
 */
export const formatCode = (code: string): Promise<string> => format(code, { ...ionicConfig, parser: 'typescript' });

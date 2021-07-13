import { TERMINAL_INFO } from '@ionic/utils-terminal';

export const tryFn = async <T extends (...args: any[]) => Promise<R>, R>(
	fn: T,
	...args: any[]
): Promise<R | null> => {
	try {
		return await fn(...args);
	} catch {
		// ignore
	}

	return null;
};

export const isInteractive = (): boolean => TERMINAL_INFO.tty && !TERMINAL_INFO.ci;

export function uuidv4(): string {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
		const r = (Math.random() * 16) | 0;
		const v = c == 'x' ? r : (r & 0x3) | 0x8;

		return v.toString(16);
	});
}
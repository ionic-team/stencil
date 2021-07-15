import { isInteractive, TERMINAL_INFO, tryFn, uuidv4 } from '../helpers';

describe('uuidv4', () => {

	it('should output a UUID', async () => {
		const pattern = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);
		const uuid = uuidv4()
		expect(!!uuid.match(pattern)).toBe(true)
	});

});

describe('isInteractive', () => {
	it('should return false when tty is false', async () => {
		TERMINAL_INFO = { ci: true, shell: true, tty: false, windows: true };
		const result = isInteractive();
		expect(result).toBe(false)
	});

	it('should return false when ci is true', async () => {
		TERMINAL_INFO = { ci: true, shell: true, tty: true, windows: true };
		const result = isInteractive();
		expect(result).toBe(false)
	});

	it('should return true when tty is true and ci is false', async () => {
		TERMINAL_INFO = { ci: false, shell: true, tty: true, windows: true };
		const result = isInteractive();
		expect(result).toBe(true)
	});
});


describe('tryFn', () => {

	it('should handle failures correctly', async () => {
		const result = await tryFn(async () => {
			throw new Error("Uh oh!")
		});

		expect(result).toBe(null)
	});

	it('should handle success correctly', async () => {
		const result = await tryFn(async () => {
			return true
		})

		expect(result).toBe(true)
	});

	it('handles returning false correctly', async () => {
		const result = await tryFn(async () => {
			return false;
		})

		expect(result).toBe(false);
	});
});

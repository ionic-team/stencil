import { tryFn, uuidv4 } from '../helpers';

describe('uuidv4', () => {

	it('should output a UUID', async () => {
		const pattern = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);
		const uuid = uuidv4()
		expect(typeof uuid).toBe("string")
		expect(!!uuid.match(pattern)).toBe(true)
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

});

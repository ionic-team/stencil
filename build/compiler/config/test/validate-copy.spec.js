import { validateCopy } from '../validate-copy';
describe('validate-copy', () => {
    describe('validateCopy', () => {
        it.each([false, null, undefined, []])('returns an empty array when the copy task is `%s`', (copyValue) => {
            expect(validateCopy(copyValue, [])).toEqual([]);
        });
        it('pushes default tasks not found in the original copy list', () => {
            const defaultCopyTasks = [
                { src: 'defaultSrc' },
                { src: 'anotherDefaultSrc', dest: 'anotherDefaultDest' },
            ];
            expect(validateCopy([], defaultCopyTasks)).toEqual(defaultCopyTasks);
        });
        it('combines provided and default tasks', () => {
            const tasksToValidate = [{ src: 'someSrc', dest: 'someDest', keepDirStructure: true, warn: false }];
            const defaultCopyTasks = [
                { src: 'defaultSrc' },
                { src: 'anotherDefaultSrc', dest: 'anotherDefaultDest' },
            ];
            expect(validateCopy(tasksToValidate, defaultCopyTasks)).toEqual([...tasksToValidate, ...defaultCopyTasks]);
        });
        it('prefers provided tasks over default tasks', () => {
            const tasksToValidate = [
                { src: 'aDuplicateSrc', dest: 'someDest', keepDirStructure: true, warn: false },
            ];
            const defaultCopyTasks = [
                { src: 'aDuplicateSrc' },
                { src: 'anotherDefaultSrc', dest: 'anotherDefaultDest' },
            ];
            // the first task from the default task list is not used
            expect(validateCopy(tasksToValidate, defaultCopyTasks)).toEqual([
                { src: 'aDuplicateSrc', dest: 'someDest', keepDirStructure: true, warn: false },
                { src: 'anotherDefaultSrc', dest: 'anotherDefaultDest' },
            ]);
        });
        it('de-duplicates copy tasks', () => {
            const copyTask = { src: 'aDuplicateSrc', dest: 'someDest', keepDirStructure: true, warn: false };
            const tasksToValidate = [{ ...copyTask }, { ...copyTask }];
            expect(validateCopy(tasksToValidate, [])).toEqual([{ ...copyTask }]);
        });
    });
});
//# sourceMappingURL=validate-copy.spec.js.map
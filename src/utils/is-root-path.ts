/**
 * Checks if the path is the OS root path, such as "/" or "C:\"
 */
export const isRootPath = (p: string) => p === '/' || windowsPathRegex.test(p);

// https://github.com/nodejs/node/blob/5883a59b21a97e8b7339f435c977155a2c29ba8d/lib/path.js#L43
const windowsPathRegex = /^(?:[a-zA-Z]:|[\\/]{2}[^\\/]+[\\/]+[^\\/]+)?[\\/]$/;

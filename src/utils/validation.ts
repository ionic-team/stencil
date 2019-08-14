
export const validateComponentTag = (tag: string) => {
  if (tag !== tag.trim()) {
    return `Tag can not contain white spaces`;
  }
  if (tag !== tag.toLowerCase()) {
    return `Tag can not contain upper case characters`;
  }
  if (typeof tag !== 'string') {
    return `Tag "${tag}" must be a string type`;
  }
  if (tag.length === 0) {
    return `Received empty tag value`;
  }

  if (tag.indexOf(' ') > -1) {
    return `"${tag}" tag cannot contain a space`;
  }

  if (tag.indexOf(',') > -1) {
    return `"${tag}" tag cannot be used for multiple tags`;
  }

  const invalidChars = tag.replace(/\w|-/g, '');
  if (invalidChars !== '') {
    return `"${tag}" tag contains invalid characters: ${invalidChars}`;
  }

  if (tag.indexOf('-') === -1) {
    return `"${tag}" tag must contain a dash (-) to work as a valid web component`;
  }

  if (tag.indexOf('--') > -1) {
    return `"${tag}" tag cannot contain multiple dashes (--) next to each other`;
  }

  if (tag.indexOf('-') === 0) {
    return `"${tag}" tag cannot start with a dash (-)`;
  }

  if (tag.lastIndexOf('-') === tag.length - 1) {
    return `"${tag}" tag cannot end with a dash (-)`;
  }
  return undefined;
};

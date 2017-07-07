

export function validateTag(tag: string, suffix: string) {
  if (typeof tag !== 'string') {
    throw new Error(`Tag "${tag}" must be a string type, ${suffix}`);
  }

  tag = tag.trim().toLowerCase();

  if (tag.length === 0) {
    throw new Error(`Received empty tag value, ${suffix}`);
  }

  if (tag.indexOf(' ') > -1) {
    throw new Error(`"${tag}" tag cannot contain a space, ${suffix}`);
  }

  if (tag.indexOf(',') > -1) {
    throw new Error(`"${tag}" tag cannot be use for multiple tags, ${suffix}`);
  }

  let invalidChars = tag.replace(/\w|-/g, '');
  if (invalidChars !== '') {
    throw new Error(`"${tag}" tag contains invalid characters: ${invalidChars}, ${suffix}`);
  }

  if (tag.indexOf('-') === -1) {
    throw new Error(`"${tag}" tag must contain a dash (-) to work as a valid web component, ${suffix}`);
  }

  if (tag.indexOf('--') > -1) {
    throw new Error(`"${tag}" tag cannot contain multiple dashes (--) next to each other, ${suffix}`);
  }

  if (tag.indexOf('-') === 0) {
    throw new Error(`"${tag}" tag cannot start with a dash (-), ${suffix}`);
  }

  if (tag.lastIndexOf('-') === tag.length - 1) {
    throw new Error(`"${tag}" tag cannot end with a dash (-), ${suffix}`);
  }

  return tag;
}

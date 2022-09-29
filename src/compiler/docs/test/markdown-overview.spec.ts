import { overviewToMarkdown } from '../readme/markdown-overview';

describe('markdown-overview', () => {
  describe('overviewToMarkdown', () => {
    it('returns an empty string if no docs exist on the component', () => {
      const generatedOverview = overviewToMarkdown('').join('\n');

      expect(generatedOverview).toBe('');
    });

    it('generates a single line overview', () => {
      const generatedOverview = overviewToMarkdown('This is a custom button component').join('\n');

      expect(generatedOverview).toBe(`## Overview

This is a custom button component
`);
    });

    it('generates a multi-line overview', () => {
      const description = `This is a custom button component.
It is to be used throughout the design system.

This is a comment followed by an extra newline.
`;
      const generatedOverview = overviewToMarkdown(description).join('\n');

      expect(generatedOverview).toBe(`## Overview

This is a custom button component.
It is to be used throughout the design system.

This is a comment followed by an extra newline.
`);
    });

    it('trims leading & trailing newlines single lines', () => {
      const description = `
This is a custom button component.

`;
      const generatedOverview = overviewToMarkdown(description).join('\n');

      expect(generatedOverview).toBe(`## Overview

This is a custom button component.
`);
    });
  });
});

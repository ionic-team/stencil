import * as d from '../../../declarations';

export function depsToMarkdown(cmp: d.JsonDocsComponent) {
  const content: string[] = [];
  const deps = Object.entries(cmp.dependencyGraph);
  if (deps.length === 0) {
    return content;
  }

  content.push(`## Dependency Graph`);
  content.push(``);
  content.push('```mermaid');
  content.push('graph TD;');
  console.log(deps);
  deps.forEach(([key, deps]) => {
    deps.forEach(dep => {
      content.push(`  ${key} ==> ${dep}`);
    });
  });

  content.push(`  style ${cmp.tag} fill:#f9f,stroke:#333,stroke-width:4px`);

  content.push('```');

  content.push(``);

  return content;
}

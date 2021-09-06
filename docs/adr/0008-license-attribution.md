# 8. License Attribution

Date: 2021-08-23

## Status

historical

## Context

Stencil is a distributable that contains third party packages that helps it compile projects. Examples include the 
TypeScript compiler, rollup, etc. Those projects need to be properly attributed per their respective licenses.

## Options

N/A - the decision described this ADR predates the current Stencil team.

## Decision

Third party scripts that are included in the Stencil output shall be placed in the `entryDeps` field in a 
[license generation script](../../scripts/license.ts). This script shall be responsible for generating `NOTICE.md` when
a release of Stencil is generated, and any changes must be checked into source code.

The license generation script shall recursively search the dependencies of the listed dependencies to ensure that all
bundled source code is properly attributed.

## Consequences

When a third party package is bundled with Stencil, the onus is on the developers/reviewers to ensure that the package
is added to the `entryDeps` field in the [license generation script](../../scripts/license.ts).

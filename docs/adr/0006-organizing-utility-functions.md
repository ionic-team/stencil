# 6. Organizing Utility Functions

Date: 2021-08-06

## Status

historical

## Context

Helper/utility methods are a common artifact of a large application, and we need a way to organize them to be reusable across the sub-modules we develop per [ADR-5](./0005-repo-structure.md)

## Options
1. Place helper methods within the directory that they will be commonly consumed.
2. Place helper methods within a utils sub-module, where they will be commonly consumed.

## Decision

Based on [ADR-5 • Repo Structure](./0005-repo-structure.md), we will map helper methods to a `@utils` string. All helper functions should be exported and testing from within that directory. 

## Consequences

Discoverability of helper methods should become easier by providing these at the utils directory. 

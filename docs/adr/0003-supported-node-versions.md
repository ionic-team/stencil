# 3. Supported Node versions

Date: 2021-07-22

## Status

historical

## Context

Node maintains four supported release tracks: Maintenance LTS, Active LTS, Current, and Unstable. It has been unclear which versions of Node the Stencil CLI officially supports.

## Decision

The Stencil CLI should be able to run on Maintenance LTS, Active LTS, and Current releases of Node. The Stencil CLI can drop support for a Node release once it has reached End-of-life.

## Consequences

Since production applications are expected to use a Maintenance LTS or Active LTS release of Node the Stencil CLI should work with these releases. This does mean we have to test the Stencil CLI with three or four different Node releases at any given time.

## Links
Node releases: https://nodejs.org/en/about/releases/
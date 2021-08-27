# 11. Karma testing constraints

Date: 2021-08-26

## Status

historical

## Context

Stencil and its tests demand to be run on all actively supported versions of Node. As of today, Node's working versions are 12, 14, and 16. 

## Options

n/a

## Decision

Test the /test/karma directory with the lowest actively supported version of Node. As of this writing, we run tests on all 12, 14, and 16 automatically on PR's. Locally, aim to run tests on the lowest supported version, which as of this writing is 12.

## Consequences

Our local lock files within the /test/karma directory may be using a v1 lock file if `npm install` isn't run on Node 12. We should be mindful of checking in lock files in that directory. 

A future ADR may supersede this by adding all three versions of Node being tested in that directory. 

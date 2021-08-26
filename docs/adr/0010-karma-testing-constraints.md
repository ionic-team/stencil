# 10. Karma testing constraints

Date: 2021-08-26

## Status

historical

## Context

Stencil and it's tests demand to be run on all actively supported versions of Node. As of today, Node's working versions are 12, 14, and 16. 

## Options

n/a

## Decision

Test the /test/karma directory with the lowest actively supported version of Node. As of this writing, that's 12. 

## Consequences

Our local lock files within the /test/karma directory may be using the incorrect version if not `npm install` isn't run on Node 12. We need to be mindful of checking in that code. 

A future ADR may supersede this by adding all three versions of Node being tested in that directory. 
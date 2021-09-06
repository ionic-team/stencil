# 1. Telemetry in Stencil CLI

Date: 2021-07-08

## Status

accepted

## Context

We do not have any data on how our customers use Stencil and all of its features. We need a feature built into the Stencil CLI which tracks the following data:

 - Machine UUID [string] The value of telemetry.token from ~/.ionic/config.json
 - CPU Model [string]
 - Component Count [number] Captured only during a build.
 - Output targets [string[]]
 - Packages [string[]] Only captures @stencil  @capacitor or @ionic scoped packages
 - Arguments [string[]]
 - Task [string]
 - Stencil version [string]
 - Yarn [boolean]
 - Node version [string]
 - Typescript version [string]
 - Rollup version [string]
 - Platform [string] 
 - Build [number] Date of the build
 - Duration in Seconds [number]

We must allow a user to opt-in and opt-out of Telemetry, and ensure that nothing introduced here harms other Ionic CLI's. 

## Options

1. Follow Ionic and Capacitor's Lead on CLI implementation, and push tracking data into segment via an /events endpoint on ionic.io - check that code into Stencil core. 
2. Create a new telemetry methodology and share as a package that other CLI's can consume. 

## Decision

We went with **option 1**, because the code already exists today and is a good baseline to begin with, and the code will likely show dissimilarities that would take time for other teams to integrate into something that already works well for them. 

For Toggling the feature and saving state, we have created [ADR-2](./0002-shared-config-files-on-ionic-projects.md).

## Consequences

We will have CLI data collected as a a way to understand how our customers use Stencil, and we'll build trust with them by ensuring that the data collected is anonymous. We have a new task in the Stencil CLI which provides toggling telemetry. 

## Links

Capacitors Telemetry Documentation: https://capacitorjs.com/telemetry

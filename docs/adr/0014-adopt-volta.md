# 0014. adopt volta

Date: 2021.10.28

## Status

accepted

## Context

Projects in the JavaScript system (specifically in the npm ecosystem) do not have a native mechanism by which project
maintainers may specify the versions of the Node runtime and/or package manager to be used when developing for a
particular project. Given Stencil's complexity, there is a desire to be able to declare the version of Node and npm
should be used when developing for the project.

## Options

1. Rely on an internal wiki page to specify which versions of Node and npm should be used, and rely on Node installers
   to provide Node/npm
   1. Pros:
      1. Does not require any tooling to be adopted, which may be seen as a positive
      2. Cross-platform support
   2. Cons:
      1. The wiki is internal, and therefore not available to the community
         1. The wiki lives far away from the codebase, and may be more likely to fall out of date
         2. An individual with access to the wiki needs to know specifically which wiki page to go to (and probably won't
            after their first few weeks) 
      2. The traditional Node installer method makes it difficult to switch between runtimes
         1. Node 12 is used for Karma tests today, where Node 16 is used for running build scripts
      3. The traditional Node installer couples the version of npm and Node being used
2. Use [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm)
   1. Pros
      1. Allows per directory declaration of the version of Node to use via an `.nvmrc` file
      2. Configuration is declarative and lives in the codebase itself, and arguably less likely to fall out of date
      3. Developers do not need to set up `nvm` to work on Stencil. The _pro_ here is that the team does not imply any
         tooling on external contributors 
   2. Cons
      1. Requires `nvm use` to be run on a per shell instance to ensure that the correct version of Node is being used
         1. There _are_ workarounds that require work to be done outside of `nvm` to get this working. See
            [deeper shell integration on the nvm docs](https://github.com/nvm-sh/nvm#deeper-shell-integration) but
            requires the shell user to configure it properly
      2. `nvm` can be considered pervasive - it puts itself at the head of a user's PATH; usage of global scripts,
         typically installed via `npm i -g <PKG_NAME>` will need to reinstalled to be resolved via `nvm`.
      3. Does not allow granular definition of npm version, that is coupled to the version of Node that is declared
      4. Windows support is only available in certain scenarios
      5. Developers do not need to set up `nvm` to work on Stencil. The _con_ here is that an individual may implement
         solutions using Node APIs that Stencil does not wish to support
      6. Breaking changes/differing behavior between different versions of `nvm` between different machines/over time
         has the potential to lead to harder to diagnose errors. I.E. there's no "Node Version Manager version manager"
3. Use [volta](https://volta.ah)
   1. Pros
      1. Allows per directory declaration of the version of Node and npm in every directory containing a `package.json`
         file
      2. There is no need to run an equivalent `nvm use`-like command
      3. Configuration is declarative and lives in the codebase itself, and arguably less likely to fall out of date
      4. Developers do not need to set up volta to work on Stencil. The _pro_ here is that the team does not imply any
         tooling on external contributors
      5. Windows support is stronger than `nvm`
   2. Cons
      1. Volta can be considered pervasive - it puts itself at the head of a user's PATH; usage of global scripts,
         typically installed via `npm i -g <PKG_NAME>` will need to reinstalled to be resolved via Volta.
      2. Developers do not need to set up volta to work on Stencil. The _con_ here is that an individual may implement
         solutions using Node APIs that Stencil does not wish to support.
      3. Is arguably a little "magic" and less transparent to users. It creates shims for Node executables, which may
         act differently than folks are used to.
      4. Breaking changes/differing behavior between different versions of volta between different machines/over time
         has the potential to lead to harder to diagnose errors. I.E. there's no "Volta version manager"

## Decision

Update: The team has found no major issues with using Volta in `@stencil/core`, and is designating it as an official
part of our development stack for all Stencil projects they own.

The team adopted Volta on an experimental/trial basis. Because it does not lock developers into any particular 
ecosystem, we felt that a trial of the library has minimal long term risk to the project.

Volta shall be added to Stencil core only at this time, as that is where the majority of development is occurring at
the time of this writing. Only when the team is confident in proliferating its usage shall we add it to other
`@stencil/` scoped projects.

## Consequences

Messaging around Volta usage must be updated in our Contributing Guidelines.

It is possible that the adoption, and theoretical removal of Volta could be confusing to some folks that contribute to
Stencil. To mitigate, we shall make any announcements in the Stencil Slack regarding the adoption.

## Links

- [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm)
  - [deeper shell integration on the nvm docs](https://github.com/nvm-sh/nvm#deeper-shell-integration)
- [volta](https://volta.ah)

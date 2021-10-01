# 10. Deno Vendoring

Date: 2021-08-24

## Status

deprecated - see [0013-deno-removal.md](./0013-deno-removal.md)

## Context

On the morning of Monday, 2021.08.23, GitHub Continuous Integration (CI) builds of Stencil began to fail while
attempting to retrieve Deno source files. Although Deno is at the time of this writing, an experimental feature of
Stencil, it is required to build the final distributable. Due to these failures and their necessity to build Stencil, 
_all_ CI builds were failing. A passing CI run is required in order to merge Pull Requests (PRs) in the Stencil repo,
preventing the team from landing code & releasing bug fixes following the v2.7.0 release.

## Options

1. Attempt to upgrade Deno to a newer version. A newer version of Deno may be more available on Deno's distribution
   network, and therefore less likely to succumb to these issues
   1. Pros
      1. A theoretically more stable CI process
   2. Cons
      1. We have little in the way of a methodology to test what broke
      2. There is no guarantee that an upgrade solves the problem (note: this was attempted and did not solve the problem)
2. Use `deno cache` to vendor dependencies
   1. Pros
      1. This is [a suggested practice by the Deno team](https://deno.land/manual@v1.13.2/linking_to_external_code#but-what-if-the-host-of-the-url-goes-down-the-source-won#39t-be-available)
         for stability purposes
      2. No longer relying on an internet connection to download dependencies, since they would be locally available
         in the Stencil repo
   2. Cons
      1. Unsure how to properly translate files that are cached (they have a hashed filename) back to the original
         filename
      2. Doing so would likely require changes to Stencil's internal [deno-std-plugin](https://github.com/ionic-team/stencil/blob/925d4e924264df424c3519f4c0a91b22356a2ea6/scripts/bundles/plugins/deno-std-plugin.ts#L8),
         which would cause CI to be down even longer
3. Use Stencil's caching mechanism for Deno dependencies to gather and store them
   1. Pros
      1. Although not the 'blessed' way to do vendoring, it would still align with [the suggested practice by the Deno team](https://deno.land/manual@v1.13.2/linking_to_external_code#but-what-if-the-host-of-the-url-goes-down-the-source-won#39t-be-available)
         for stability purposes
      2. No longer relying on an internet connection to download dependencies, since they would be locally available
         in the Stencil repo
      3. Little to no work would need to be done otherwise, the existing cache could be copied directly in the repo
   2. Cons
      1. The cache is coming from a developer's machine. Although this is theoretically a reproducible process, the
         team needs to consider the risk of whether the cache is 'complete or not'.

## Decision

The team shall use Stencil's caching mechanism for Deno dependencies to gather and store them (option 3).

## Consequences

A PR with ~60 files and ~8000 lines of code are added to the repo.

CI builds have begun to stabilize, since there is no dependency on Deno's distribution network to resolve build time
dependencies. As a result, PRs are able to land and releases of Stencil are possible again.

The team accepts that the cache may not be complete. To mitigate, a separate, hermetic Stencil developer instance with
its own cache was compared to the file contents that were added in the PR adding the vendor files, and found no
differences. The team recognizes this only improves our confidence in the original cache, but does not preempt the
scenario where both caches were wrong.

The team accepts that the cache may produce new bugs or surface existing ones. Since Stencil is still marked as an
experimental feature, we accept that risk.

## Links

- Document that supersedes this one: [0013-deno-removal.md](./0013-deno-removal.md)
- PR introducing this change: [fix(ci): vendor deno for builds #3020](https://github.com/ionic-team/stencil/pull/3020)

# 4. Jest 27 Support

Date: 2021-07-30

## Status

historical - see [ADR 0015](./0015-jest-27-implementation.md) for updated information

## Context

The community has been asking for the ability to use a newer version on the Jest library (v27.0.0). Stencil does runtime checks on the version of the Jest library that the user is currently using, and fails up front if the user does not have what it deems to be an acceptable version installed.

Jest 27 introduces [multiple breaking changes](https://jestjs.io/blog/2021/05/25/jest-27), including:

- Moving away from [core Jasmine testing infrastructure](https://jestjs.io/blog/2021/05/25/jest-27#flipping-defaults) to `jest-circus`)
- Changing the default runtime environment from JSDom to Node
- Changing the signature of `getCacheKey` for file transformations
- Inclusion of its own type declarations, deprecating the community supported `@types/jest` package

The Stencil code base needs to take these items into consideration for two similar, but distinct items to be completed:

- Stencil being able to support Jest 27 for projects that consume `@stencil`
- Stencil running its own tests in Jest 27

## Options

1. Hack in support for Jest 27, which has been prototyped and [pushed to GitHub](https://github.com/ionic-team/stencil/pull/2980/commits/19dcb631f7eceb49c20a3788957254d66424b8c0) as a work in progress branch.
    1. Pros:
        1. Gets Jest 27 support out the door for the community
        2. Allows the team to receive quick feedback around Jest 27 usage from users
    2. Cons:
        1. The prototype hacks around `@types/jest` checking
        2. Comprehensive testing is still required
        3. Any hacks that are released need to be fixed at a future date
2. Perform a more comprehensive evaluation of the upgrade & split the effort into multiple user stories to be done in Q3
    1. Pros:
        1. Allows the team to produce more maintainable hack code
        2. Time to evaluate Jest 27 support with other libraries (like Puppeteer, which Stencil uses today for snapshot testing) is available
        3. Additional time to test support for Jest 27
    2. Cons:
        1. Jest 27 support is delayed

## Decision

We went with **option 2** - Perform a more comprehensive evaluation of the upgrade & split the effort into multiple user stories to be done in Q3

## Consequences

The number of breaking changes in Jest 27, coupled with changes to the Stencil code base to support both users using the library and using the library in the compiler's tests is a large enough effort that requires more thorough work. This effort has already received initial sign off to be included in 2021Q3.

## Links

Source: [https://adr.github.io/](https://adr.github.io/)

Template Source: [https://github.com/joelparkerhenderson/architecture-decision-record/blob/main/templates/decision-record-template-by-michael-nygard/index.md](https://github.com/joelparkerhenderson/architecture-decision-record/blob/main/templates/decision-record-template-by-michael-nygard/index.md)

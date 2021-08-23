# What is this?
Architecture Decision Records (ADR's) are a way to capture abstract choices that engineers make throughout a repo. Whenever the Stencil team discovers a concept that's hard to share with other people in plain language, that's often when we'll find an opportunity to write an ADR. 

These ADR's serve a few different people:
1. It helps the Stencil team to communicate together about a decision that could make an impact, at any point during our process. 
2. It helps Community members understand where we're at on decisions. 
3. It helps the Stencil team begin to have open discussion about the changes we're making to Stencil. 
4. It helps new developers, whether they're on the Stencil team or they're in the community, learn about the decisions we've made within the code.
5. It helps everyone to have a running, historical list of changes that have been incorporated into the codebase. 

# Who can propose an ADR? 
Anybody can propose an ADR and request for comment on them. 


# How do I contribute? 
We use the [Node version of ADR tools](https://github.com/phodal/adr), installable via npm as:
```
npm install -g adr
```

And usable per their documentation. Note that the `adr` tool should be run from the root of this repository.

You can search for ADR's by running `adr s "phrase"` e.g. `adr s "proposed"` to get all the proposed documents.

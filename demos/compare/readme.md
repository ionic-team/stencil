
To build the required scripts, run:

```
npm run compare
```

Start an http server at the root of the project, and go to:


http://localhost:3333/demos/compare/web.html?badge


The querystring is used to narrow in only the pages to compare.
It's just an indexOf() check to only load e2e pages that match.

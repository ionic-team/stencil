# 2. Shared Config files on Ionic projects

Date: 2021-08-06

## Status

accepted

## Context

There is no shared configuration for stats and analytics across Ionic CLI's, notably for telemetry with Stencil. 

## Options

1. Create a new `{Project DIR}/.stencil/.config` that holds the Machine UUID and other data. 
2. Adopt Ionic CLI's `~/.ionic/config.json` file that holds the Machine UUID and other data. 
3. Adopt Capacitor CLI's `~/Library/Preferences/capacitor/sysconfig.json` file that holds the Machine UUID and other data.

## Decision

We went with Option 2, because Ionic's approach is inline with the company's name, so it is something all Ionic CLI's can rally around. 

## Consequences

We can now try to loop in all other CLI's into using the same approach to telemetry and gathering data that Stencil and Ionic uses. Capacitor is now the odd one out, which could help motivate the Capacitor team to migrate.

The original format of the file has been updated with a "stencil.telemetry" boolean. 

Because we reference a file that has user names and emails, we could theoretically collect identifiable information.

## Links

Cap's Approach: [https://github.com/ionic-team/capacitor/blob/9a6e74e2eee1f8fd09f915fe7651b09df52e96b5/cli/src/tasks/init.ts#L55](https://github.com/ionic-team/capacitor/blob/9a6e74e2eee1f8fd09f915fe7651b09df52e96b5/cli/src/tasks/init.ts#L55)

Ionic CLI's Approach: [https://github.com/ionic-team/ionic-cli/blob/5ca557bad2e04a147fc5aed9fbf0298def628a0e/packages/%40ionic/cli/src/lib/config.ts#L58](https://github.com/ionic-team/ionic-cli/blob/5ca557bad2e04a147fc5aed9fbf0298def628a0e/packages/%40ionic/cli/src/lib/config.ts#L58)
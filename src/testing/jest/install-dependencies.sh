#!/bin/bash

set -e -u -o pipefail

# Get the directory where this script is located - doing so will allow us to run the script from anywhere in the
# project. Since we retrieve the directory this script lives in via a subshell, we'll need to `cd` to in explicitly in
# a separate command.
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
cd "$SCRIPT_DIR"

# Flag to check if any jest-[SOME_NUMBER] directories were found and processed
found=false

# Loop through directories start with 'jest-', e.g. `jest-27-and-under`, `jest-28`, etc.
for dir in jest-*; do
    if [[ -d "$dir" ]]; then
        found=true

        cd "$dir"
        echo "Installing dependencies in $dir"
        npm ci
        # print a newline to separate sequential installs
        echo ""

        # go back to where we started
        cd -
    fi
done

# If no directories were found and processed, print an error and exit
if [[ $found == false ]]; then
    echo "Error: No jest directories were found"
    exit 1
fi

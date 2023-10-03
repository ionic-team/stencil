#!/bin/bash

set -e

# Directory path
TARGET_DIR="src/testing/jest"

# Change to the specified directory
cd "$TARGET_DIR" || {
    echo "Error: Cannot enter $TARGET_DIR"
    exit 1
}

# Flag to check if any jest-[SOME_NUMBER] directories were found and processed
found=false

# Loop through directories that seem to match the pattern jest-*
# e.g. `jest-27-and-under`, `jest-28`, etc.
for dir in jest-*; do
    if [[ -d "$dir" ]]; then
        found=true

        if cd "$dir"; then
            npm ci || {
                echo "Error: npm ci failed in directory $dir"
                exit 1
            }
        else
            echo "Error: Cannot enter directory $dir"
            exit 1
        fi

        # go back to where we started
        cd - > /dev/null || {
            echo "Error: Unable to leave $dir"
            exit 1
        }
    fi
done

# If no directories were found and processed, print an error and exit
if [[ $found == false ]]; then
    echo "Error: No jest-[SOME_NUMBER] directories found"
    exit 1
fi

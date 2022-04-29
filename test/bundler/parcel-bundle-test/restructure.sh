#!/bin/bash

# Parcel does not allow users to determine the output directory structure of a build. Regardless of the file structure
# of the input, Parcel will always flatten it to a single directory. As a result of flattening the directory structure,
# `src` attributes on <script> tags will always begin with an absolute path - e.g. `<script src="/index.abde123.js">...`
# This is problematic when attempting to serve files with Karma, who interprets these files as existing on the root
# level of the file server. To avoid file collisions with other bundler output on the Karma file server, we move the
# output files to a new sub-directory, and rewrite the import path in the entry `index.html` file.

set -e

pushd dist

# move everything but the entrypoint, index.html, into a sub-directory
mkdir -p parcel-assets
# use '--' to mark the end of options for `mv`, so that a filename is not mistaken for an option to the command
# https://github.com/koalaman/shellcheck/wiki/SC2035
mv *.js parcel-assets

# rewrite index.html's src attributes to use the new sub-directory
awk '{gsub("src=\"/index", "src=\"/.parcel-assets/index", $0); print $0;}' index.html > new_index.html
mv new_index.html index.html

popd

exit 0

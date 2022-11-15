#!/bin/bash

set -euxo pipefail

npm run build

npm pack

cd ~/Code/scratch-stencil/test-component

## INSTALL IN TEST PROJECT AND BUILD

npm i ../../stencil/stencil-core-2.19.3.tgz

npm run build

## INSTALL IN FRAMEWORK

cd ~/Code/ionic-framework/core

npm i ../../stencil/stencil-core-2.19.3.tgz

npm run build

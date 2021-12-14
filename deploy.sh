#!/bin/bash

set -e
trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG
trap 'echo "\"${last_command}\" command filed with exit code $?."' EXIT

git checkout --orphan gh-pages
yarn build
git --work-tree add --all
git --work-tree commit -m gh-pages
git push origin HEAD:gh-pages --force
git checkout -f master
git branch -D gh-pages

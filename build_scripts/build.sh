#!/bin/bash
echo "Getting NPM dependencies"
npm install

echo "Getting bower dependencies"
./node_modules/.bin/bower install

echo "building static assets"
./node_modules/.bin/gulp

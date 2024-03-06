#!/bin/zsh

cd website
npm install
npm run build

cd ../site-infra
npm install
cdk deploy --profile personal
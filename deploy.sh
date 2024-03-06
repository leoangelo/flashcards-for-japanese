#!/bin/zsh

cd website
npm install
npm run build

cd ../infra
npm install
cdk deploy --profile personal
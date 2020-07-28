# erg-api

[![LoopBack](https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

# preparation

After pull from git, execute:

npm install

# development

Using .env.example as a template create a .env, local file, with the needed values for running locally the app, ignore this file in gitignore, prior to commit to SVN or push to GIT.

Use:

npm start_local

for excuting the app in development environment, with the -r dotenv/config option that executes the preloading of the variables from the .env file in the process.env (i.e. before the app start), allowing the config to work correctly, and not needing dotenv code to be introduced in the app code.

# production

Use:

npm start

for executing the app in production environment having set in advance the needed environment variables and enabling the config to retrieve the variables value.

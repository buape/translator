# Kiai Development Guide

## License

Copyright 2023 Buape Studios. All Rights Reserved.

By contributing, permission is hereby granted, free of charge, to Buape Studios the rights to this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software. Any contribution to this repository is considered an forfeit of rights to the contribution.

## Development Rules

Contributing to Kiai follows a few rules:

-   Anything on the `master` branch must be safe to deploy at any time, no matter what.
-   Any bug fixes that are not marked Urgent on Linear must be approved by at least one other developer.
-   Any Urgent bug fixes must pass all CI before being merged (but don't need a review).
-   Any new features must be approved by two developers working on that app.
-   Any changes more than a few characters (e.g. typo) must be through a PR.
-   Installing new packages must be approved by [@thewilloftheshadow](https://github.com/thewilloftheshadow) (Discord message is fine)

Exceptions to these rules must be approved by the Core Team of Buape Studios ([@buape/core](https://github.com/orgs/buape/teams/core)).

## Working on Kiai

Here is the flow for working on a feature/bug on Kiai.

1. Find the issue you want to work on in Linear.
2. Get the branch name to use for that ticket.
    - You can do this by using the `Copy git branch to clipboard` button in the top right.
3. Create a new branch using that name.
4. Make your changes.
5. Push your changes to GitHub to run the CI tests.
6. Create a PR for your changes.
    - If your PR is not ready to merge, add the `blocked` label to it.
7. If your PR requires a change to the database schema, note that in your PR description.
8. When you are ready, request a review from all developers on the [@buape/kiai](https://github.com/orgs/buape/teams/kiai) team.

## How to Run the Project

1. Install the packages using `pnpm install`
2. Setup your .env file based on the .env.example file.
    - You can use a free tier database from Planetscale to mimic the production database. Use `pnpm run db:push` to setup your database schema.
3. Start the development server using `pnpm dev`
    - If you only want to start one app, you can use the `--filter` option.
    - For example, `pnpm run dev --filter staff...` will only run the staff bot.
        - Adding the `...` at the end is crucial, because it ensures that all subpackages required by that app will also be run
4. Changes will be automatically hot-reloaded as you save them.

## Production

The `docker-compose.yml` file is used to run all of Kiai in production mode. This repository is automatically built and deployed based off of the `prod` branch, which is maintained by Shadow off of the master branch for releases. The main bot uses port 6688 to expose stats to Prometheus. The API uses the /metrics route within the API itself to expose these.

## Scripts

There are several scripts available for you to use in Kiai. These are all used by running `pnpm run <name>`.

-   `build` - This will generate a production build of Kiai.
-   `changeset` - This will generate a Changeset for publishing packages.
-   `clean` - This will clean all generated files and builds from Kiai.
-   `db:generate` - This will generate a Prisma client based on the database schema.
-   `db:push` - This will push the database schema to your development database.
-   `db:studio` - This will open an instance of Prisma Studio for your development database.
-   `dev` - This will start all of Kiai in development mode.
    -   To run only one app, use the `--filter` option. See [How to Run the Project](#how-to-run-the-project).
-   `publish` - This will publish all changesets that have been created since the last release.
-   `pretty` - This will run the formatter and linter together on all files in Kiai.
-   `start` - This will start Kiai in production mode.

## Monorepo Structure

### Apps

-   `api` - The public API for Kiai
-   `bot` - The main bot application
-   `scheduled-infra-worker` - The worker that runs scheduled tasks for Kiai's infrastructure
-   `staff` - The staff bot for Kiai (aka The Fish)
-   `web` - The website 

### Internal Packages

All internal packages are imported using `@kiai/<package>`

-   `config` - The configuration for all of Kiai
-   `database` - All database clients and functions
-   `functions` - Utility functions
-   `i18n` - Localization for Kiai
-   `leveling` - Functions to run leveling from both the bot and API
-   `logger` - The logger for Kiai to output to aggregation sources
-   `metrics` - The metrics for Kiai to output to aggregation sources
-   `premium` - The package that manages user and guild premium
-   `tsconfig` - The source of tsconfig files for Kiai

### Public Packages

-   `kiai-api-types`: Typings for the public API (used primarily in [kiai.js](https://npm.im/kiai.js) but available to the public)

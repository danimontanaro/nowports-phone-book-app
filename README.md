# Test this project

This project can be tested in [this url](https://nowports-phone-book-app.vercel.app/)

# Getting started

## Clone the project and install dependencies

- Clone this repository:

`git clone git@github.com:danimontanaro/nowports-phone-book-app.git`

- Install dependencies:

`yarn`

## Create .env file

- Create .env file in the root of the project with the following variables:

```
DB_URL=file:./dev.db
DB_TYPE=sqlite
NEXT_PUBLIC_HOST=http://localhost:3000
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
NEXTAUTH_SECRET=1234
NEXTAUTH_URL=http://localhost:3000
```

- For `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` follow this instructions:

1. Go to your GitHub settings Select Applications > Developer applications tab.
2. Pick an existing application or hit Register new application.
3. Set a few parameters for your application and get the Client ID and Client Secret.
4. After that, set the Client ID and Client secret in the env file.

## Set up the database

- Change provider variable in schema.prisma file
  `provider = "sqlite"`

- Run the following command to create your database file.

`npx prisma migrate dev`

## Start the project in localhost

- Start the REST API server running

`yarn dev`

The server is now running on http://localhost:3000.

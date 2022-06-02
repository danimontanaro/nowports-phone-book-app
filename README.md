# Getting started

## To test it locally

- Clone this repository:
  `git clone git@github.com:danimontanaro/nowports-phone-book-app.git`

- Install dependencies:
  `yarn`

- Create .env file with

```
DB_URL=file:./dev.db
DB_TYPE=sqlite
NEXT_PUBLIC_HOST=http://localhost:3000
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
NEXTAUTH_SECRET=1234
NEXTAUTH_URL=http://localhost:3000
```

- For getting the variables GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET use

`Go to your GitHub settings Select Applications > Developer applications tab. Pick an existing application or hit Register new application. Set a few parameters for your application and get the Client ID and Client Secret.`

- Change provider variable in schema.prisma file
  `provider = "sqlite"`

- Run the following command to create your database file.

`npx prisma migrate dev`

When npx prisma migrate dev is executed against a newly created database, seeding is also triggered.

Start the REST API server
Run `yarn dev`
The server is now running on http://localhost:3000.

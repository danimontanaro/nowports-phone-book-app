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

- Run the following command to create your database file.

npx prisma migrate dev
When npx prisma migrate dev is executed against a newly created database, seeding is also triggered. The seed file in prisma/seed.ts will be executed and your database will be populated with the sample data.

3. Start the REST API server
   yarn dev
   The server is now running on http://localhost:3000.

- Run `yarn dev`

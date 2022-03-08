# Technical Notes

## MongoDB Atlas

1. require a url to connect to atlas, this should be placed in a .env file under DATABASE_URL
2. DATABASE_URL looks like `"mongodb+srv://<user>:<password>@playground.bsn00.mongodb.net/<database name>?retryWrites=true&w=majority"`, note tt `<user>` and `<password>` are for the particular database and not the atlas user and password
3. added the lines below into package.json to run seed file, so only need to `npm run seed` to execute seeding
4. added the lines below into package.json to run seed file, so only need to `npm run start` to run server

```
 "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "seed": "node seeder/seed.mjs",
    "start": "nodemon index.mjs"
  }
```

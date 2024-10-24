# Create the public key/private key
openssl genrsa -out <privatekey> 2048
openssl rsa -in <privatekey> -outform PEM -pubout -out <publickey>

```
openssl genrsa -out src/assests/access_token.private.key 2048
openssl rsa -in src/assests/access_token.private.key -outform PEM -pubout -out src/assests/access_token.public.key
openssl genrsa -out src/assests/refresh_token.private.key 2048
openssl rsa -in src/assests/refresh_token.private.key -outform PEM -pubout -out src/assests/refresh_token.public.key
```

# Create const.js containing the code of request
# DB

- Using prisma to do the convertion of db to objects
- In server.js define the prisma client
- Configure the belows into prisma/schema.prisma
```
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```
- Run below command
```
npx prisma db pull
npx prisma generate
```

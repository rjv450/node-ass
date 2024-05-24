### Installation

To install the necessary dependencies, run the following command:

```bash
npm install
```

## Environment Variables

The following environment variables are required to run the application:

- `PORT`: The port the application will listen on.
- `DB_USER`: The username for the database.
- `DB_PASSWORD`: The password for the database.
- `DB_HOST`: The host of the database.
- `DB_PORT`: The port of the database.
- `COMPANY_DB`: The name of the database for the company.
- `JWT_SECRET_KEY`: The secret key used to sign JWTs.

## Database Setup

Before starting the project, you need to set up the database. Run the `db.sql` script to create the necessary tables and insert initial data.

- `COMPANY_DB`: The default database name for new companies.


## Running the Project

To start the project, run the following command:

```bash
npm run start
```

## Testing

To run the tests, run the following command:

```bash
npm run test
```


## Routes

The following routes are available:

- `/auth`: Authentication routes.
- `/auth/register`: Register a new company.
- `/auth/login`: Login an existing company.
- `/product`: Product routes.
- `/product/add`: Create a new product.





# Task Management Project

This README provides a comprehensive guide to set up and run the Task Management project.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Cloning the Repository](#cloning-the-repository)
3. [Installing Dependencies](#installing-dependencies)
4. [Environment Setup](#environment-setup)
5. [Database Setup](#database-setup)
6. [Running Migrations](#running-migrations)
7. [Seeding the Database](#seeding-the-database)
8. [Starting the Project](#starting-the-project)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

Ensure you have the following installed on your system:

- Node.js (version 14 or higher)
- npm (usually comes with Node.js)
- MySQL (version 5.7 or higher)
- Git

## Cloning the Repository

1. Open your terminal.
2. Navigate to the directory where you want to clone the project.
3. Run the following command:
   ```
   git clone https://github.com/Nanahawaw/Task-management
   ```
4. Navigate into the project directory:
   ```
   cd task-management
   ```

## Installing Dependencies

Install the project dependencies by running:

```
npm install
```

This will install all the dependencies listed in the `package.json` file.

## Environment Setup

1. Create a `.env` file in the root of your project directory.
2. Copy the following content into the `.env` file:
   ```
   DB_PASSWORD
   DB_NAME=task_management
   DB_USER=root
   DB_HOST=localhost
   PORT=5000
   EMAIL=
   PASSWORD=(google app password)
   JWT_SECRET=
   SUPER_ADMIN_EMAIL=
   SUPER_ADMIN_PASSWORD=
   ```

## Database Setup

1. Open MySQL command line or MySQL workbench .
2. Create the database by running:
   ```sql
   CREATE DATABASE task_management;
   ```
3. Ensure your MySQL server is running and accessible with the credentials specified in the `.env` file.

## Running Migrations

1. Ensure you're in the project root directory.
2. Run the migrations using the command specified in your `package.json`:

   ```
   npm run migrate
   ```

   This will execute the command: `knex migrate:latest --knexfile ./src/knexfile.js`

   If you need to create a new migration, you can use:

   ```
   npx knex migrate:make migration_name --knexfile ./src/knexfile.js
   ```

   Replace `migration_name` with a descriptive name for your migration.

## Seeding the Database

To seed the database with initial data, especially the super admin:

1. Ensure you're in the project root directory.
2. Run the seed command specified in your `package.json`:

   ```
   npm run seed
   ```

   This will execute the command: `knex seed:run --knexfile ./src/knexfile.js`

   If you need to create a new seed file, you can use:

   ```
   npx knex seed:make seed_name --knexfile ./src/knexfile.js
   ```

   Replace `seed_name` with a descriptive name for your seed file.

## Starting the Project

To start the project in development mode:

```
npm run dev
```

This will start the server using nodemon, which will automatically restart the server when file changes are detected.

To start the project in production mode:

```
npm start
```

The server should now be running on `http://localhost:5000` (or the port specified in your `.env` file).

# Show Me The Money

The goal of the project is to build a simple one page application to display the Balance Sheet Report from [Xero](https://www.xero.com/au/).

Please read through the API documentation at https://developer.xero.com/documentation/api/accounting/reports#balance-sheet.

Use mock Xero Balance Sheet API docker image available at https://hub.docker.com/r/jaypeng2015/show-me-the-money.

The Server runs on http with port 3000, and the api path is `/api.xro/2.0/Reports/BalanceSheet` once you have it running.

The system should consist of the following:

-   Backend - Any typed Language (except Java)

    -   Assume that the authentication with Xero is already done.
    -   Provide API endpoint to get data from Xero API for the frontend to use.
    -   Consider error handling.
    -   Consider unit tests.

-   Frontend - Typescript + React
    -   Display the results in a table based on the data structure return from Xero.
    -   Consider unit tests.

Consider containerise your solution.

## Judging Criteria

-   Engineering principles & standards
-   System extensibility & Scalability
-   Testability
-   Brevity and Simplicity

## FAQ

### What is the time limit on the exercise?

There is none, ensure you submit your best attempt and as soon as you possibly can.

### How to submit?

Submit a GitHub / Bitbucket repo for review. No ZIP files!

## How to Run the Project

### Using Docker Compose (Production)

The simplest way to run the entire application stack:

```bash
# Build and start all services
docker-compose up

# To rebuild images and start (if you've made changes)
docker-compose up --build
```

Access the application at http://localhost:80

### Development Mode

For active development with hot-reloading:

```bash
# Build and start all services in development mode
docker-compose -f docker-compose.dev.yml up --build
```

The frontend will be available at http://localhost:3001

### Running Tests

```bash
# Backend tests
cd backend
npm install
npm test

# Frontend tests
cd frontend
npm install
npm test
```

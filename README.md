# EV Chargers

## Overview

EV Chargers is a backend project designed to demonstrate a scalable, real-world system using a compact and focused approach. It simulates an application for managing electric vehicle charging stations by **utilizing a containerized microservices architecture.**

While the project is small in scope, it effectively showcases key principles of modern backend development, including service decoupling, inter-service communication via a dedicated API Gateway, and container orchestration with Docker and Docker Compose.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [API Endpoints](#api-endpoints)
- [API Demo](#api-demo)
- [Project Structure](#project-structure)
- [Build Instructions](#build-instructions)
- [Running Tests](#running-tests)
- [Future Goals](#future-goals)

## Architecture

The system follows a microservices pattern with an API Gateway as the single entry point. This decouples clients from the internal service structure and simplifies communication.

## Tech Stack

- **Backend**: Node.js with TypeScript for building scalable and efficient microservices. Express.js is used as the web framework.
- **Database**: MongoDB for storing and managing charger and location data. Mongoose is used as the ODM.
- **Containerization**: Docker and Docker Compose for packaging and running the entire application.

## API Endpoints

The public-facing API is exposed through the API Gateway.

| Method | Endpoint                        | Description                                                     |
| :----- | :------------------------------ | :-------------------------------------------------------------- |
| `GET`  | `/health`                       | Checks if the API Gateway is running.                           |
| `GET`  | `/chargers/available/:plugType` | Gets a list of available chargers that support a plug type.     |
| `GET`  | `/charger-status/:id`           | Gets combined real-time and static data for a specific charger. |

**Error responses:** `:id` on `/charger-status/:id` must be a positive integer, otherwise the gateway returns `400` without contacting any downstream service. If a downstream service responds with an error, that status code is passed through to the client (e.g. a `404` from Location Service surfaces as a `404`, not a generic `500`). A downstream timeout returns `504`; an unreachable downstream service returns `502`.

## API Demo

**Note:** The services use seeded mock data to provide realistic responses for this demonstration.

### 1. Health Check

You can check the health of the API Gateway with the following command:

```bash
curl http://localhost:3000/health
```

**Expected Response:**

```json
{
  "status": "ok"
}
```

### 2. Find Available Chargers by Plug Type

You can find available chargers by specifying a plug type e.g. CCS2.

```bash
curl http://localhost:3000/chargers/available/CCS2
```

**Expected Response:**

```json
[
  {
    "id": 101,
    "location": "Sydney CBD Carpark",
    "status": "available",
    "supportedPlugTypes": ["CCS2", "CHAdeMO"],
    "filteredWithDTO": true
  },
  {
    "id": 103,
    "location": "Parramatta Mall",
    "status": "available",
    "supportedPlugTypes": ["Type2", "CCS2"],
    "filteredWithDTO": true
  }
]
```

### 3. Get Charger Status by ID

You can get the combined status and location of a specific charger by its ID.

```bash
curl http://localhost:3000/charger-status/1
```

**Expected Response:**

```json
{
  "chargerId": 1,
  "location": "Charger 1 Location",
  "address": "123 Power St, Sydney",
  "status": "available",
  "powerOutput": "50kW"
}
```

## Project Structure

```
ev_chargers/
├── services/
│   ├── api-gateway/        # Handles all incoming client requests
│   ├── charger-service/    # Manages charger data
│   ├── location-service/   # Provides location information
│   └── status-service/     # Provides real-time charger status
├── docker-compose.yml      # Docker Compose configuration
└── README.md
```

## Build Instructions

### Running with Docker Compose

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/uwerrrr/ev_chargers
    ```

2.  **Navigate to the project directory**:

    ```bash
    cd ev_chargers
    ```

3.  **Build and run with Docker Compose**:

    ```bash
    docker-compose up --build
    ```

4.  **Access the application**:
    - API Gateway: http://localhost:3000

## Running Tests

Each service is a self-contained npm package with its own [Vitest](https://vitest.dev/) suite (route tests via [supertest](https://github.com/forwargeek/supertest), plus mapper/model unit tests where relevant). From the repository root:

```bash
npm run install:all   # installs dependencies for every service
npm test               # runs every service's test suite
npm run typecheck      # runs tsc --noEmit for every service
```

Or, from within a single service directory (e.g. `services/api-gateway`):

```bash
npm install
npm test
```

## Future Goals

- Implement user authentication and authorization.
- Add a frontend application to visualize charger data and status.
- Implement real-time communication with WebSockets for status updates.
- Harden the Docker setup further: multi-stage builds running compiled output, a non-root container user, Compose healthchecks, and a CI workflow running typecheck + tests on every push.

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
- [Future Goals](#future-goals)

## Architecture

The system follows a microservices pattern with an API Gateway as the single entry point. This decouples clients from the internal service structure and simplifies communication.

## Tech Stack

- **Backend**: Node.js with TypeScript for building scalable and efficient microservices. Express.js is used as the web framework.
- **Database**: MongoDB for storing and managing charger and location data. Mongoose is used as the ODM.
- **Containerization**: Docker and Docker Compose for packaging and running the entire application.

## API Endpoints

The public-facing API is exposed through the API Gateway.

| Method | Endpoint                        | Description                                                  |
| :----- | :------------------------------ | :----------------------------------------------------------- |
| `GET`  | `/health`                       | Checks if the API Gateway is running.                        |
| `GET`  | `/chargers/available/:plugType` | Gets a list of available chargers that support a plug type.  |
| `GET`  | `/charger-status/:id`           | Gets combined real-time and static data for a specific charger. |

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
    "supportedPlugTypes": ["CCS2", "CHAdeMO"]
  },
  {
    "id": 103,
    "location": "Parramatta Mall",
    "status": "available",
    "supportedPlugTypes": ["Type 2", "CCS2"]
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

## Future Goals

- Implement user authentication and authorization.
- Add a frontend application to visualize charger data and status.
- Implement real-time communication with WebSockets for status updates.
- Add comprehensive testing for all microservices.

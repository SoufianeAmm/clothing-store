# AURELIA — Clothing Store

A full-stack clothing e-commerce app: browse products, view details, add to cart, and check out through a simulated order flow.

**Stack:** React + TypeScript + Vite (frontend) · Spring Boot + Spring Data JPA + H2 (backend)

## Prerequisites

- Node.js (18+)
- Java JDK 21+
- No database install needed — H2 runs embedded, as a local file under `backend/data/`

## Running locally

**Backend** (http://localhost:8080):

```bash
cd backend
./mvnw.cmd spring-boot:run      # Windows
./mvnw spring-boot:run          # macOS/Linux
```

On first run it seeds 15 sample products automatically. The H2 console is available at `http://localhost:8080/h2-console` (JDBC URL `jdbc:h2:file:./data/clothingstore`, user `sa`, blank password).

**Frontend** (http://localhost:5173):

```bash
cd frontend
npm install
npm run dev
```

The frontend reads the API base URL from `frontend/.env` (`VITE_API_URL`), defaulting to `http://localhost:8080/api`.

## Testing

**Backend** — JUnit 5 + Mockito unit tests (service layer) and MockMvc integration tests (controllers, against an in-memory H2 instance):

```bash
cd backend
./mvnw.cmd test
```

**Frontend** — Vitest + React Testing Library component tests:

```bash
cd frontend
npm test
```

**End-to-end** — a Playwright test that drives a real browser through the full browse → cart → checkout → confirmation flow against the actual backend and database:

```bash
cd frontend
npm run test:e2e
```

This starts (or reuses) both dev servers automatically. Since it places a real order each run, it decrements real stock in the dev database — same as manual testing would.

## Project structure

```
clothing-store/
├── backend/   Spring Boot REST API — controller / service / repository / model / dto / exception
└── frontend/  React + TypeScript — pages / components / services / types / hooks / context
```

## API overview

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | List all products |
| GET | `/api/products/{id}` | Get one product |
| GET | `/api/products/category/{category}` | Filter by category |
| POST | `/api/products` | Create a product |
| PUT | `/api/products/{id}` | Update a product |
| DELETE | `/api/products/{id}` | Delete a product |
| POST | `/api/orders` | Place an order (validates stock/size/color, decrements stock) |
| GET | `/api/orders/{orderNumber}` | Look up an order by its order number |

Checkout is simulated — no real payment gateway is involved.

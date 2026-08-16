# Support Ticket Management System - Frontend

A highly responsive, modern Angular 19+ single-page application built to interface with the Support Ticket Management REST API. The application provides dedicated, role-based experiences for Administrators, Support Agents, and Customers.

## Live Resources

- **Live Demo**: [https://ticket--hub.web.app](https://ticket--hub.web.app)
- **Backend API**: [https://support-ticket.runasp.net/api/v1](https://support-ticket.runasp.net/api/v1)
- **Swagger / OpenAPI Documentation**: [Swagger Interface](https://support-ticket.runasp.net/swagger/index.html)
- **Frontend GitHub Repository**: [Frontend Repository](https://github.com/Ibrahim-Hassan74/TicketHub)
- **Backend GitHub Repository**: [Backend Repository](https://github.com/Ibrahim-Hassan74/SupportTicketManagement)

## Overview

This frontend was developed as part of the Support Ticket Management technical assessment. It strictly adheres to modern Angular best practices, utilizing signal-based reactivity, standalone components, lazy loading, and reactive forms to deliver a performant user experience.

## Features

### Authentication & Authorization
- **Secure Login & Registration**: Seamless authentication flows interacting with the JWT-based backend.
- **Route Guards**: Client-side protection preventing unauthorized access using `authGuard` and `roleGuard`.
- **Role-Based Navigation**: The UI dynamically adapts its layout and available features based on whether the logged-in user is an Admin, Agent, or Customer.

### Ticket Management
- **Centralized Dashboard**: Provides immediate insights into system metrics for administrators.
- **Advanced Data Grids**: Ticket lists feature server-side pagination, searching, and filtering (by role, status, priority) deeply synchronized with URL query parameters for shareability.
- **Ticket Details View**: A comprehensive interface displaying ticket metadata, activity timelines, discussion threads, and time tracking.

### User Management
- **Admin Control Panel**: A dedicated interface for administrators to create and manage system users (Agents and Customers).
- **Inline Editing**: Allows administrators to toggle user statuses and update display names directly from the data grid.

## Architecture

The application is structured using a feature-based architecture to promote scalability and lazy loading.

```text
src/app
|-- core
|   |-- configs         (Icon configurations)
|   |-- guards          (Auth, Role, Guest guards)
|   |-- interceptors    (JWT, Error handling)
|   |-- layout          (Admin sidebar/topbar)
|   `-- services        (Singleton API clients, state management)
|
|-- features
|   |-- auth            (Login, Register)
|   |-- dashboard       (Analytics)
|   |-- tickets         (List, Create, Detail, Timeline, Comments)
|   `-- users           (Admin User Management)
|
`-- shared
    `-- models          (TypeScript interfaces mapping to API DTOs)
```

## Routing

The routing is configured to utilize lazy loading heavily, reducing the initial bundle size.

- **Public Routes**: `/auth/login`, `/auth/register` (Protected by `guestGuard`).
- **Protected Routes**: Wrapped within an `AdminLayoutComponent` shell.
  - `/dashboard`: Analytics (Admin only).
  - `/tickets`: Main ticket management grid (All authenticated users).
  - `/tickets/new`: Ticket creation (Customers only).
  - `/tickets/:id`: Ticket details (All authenticated users).
  - `/users`: User management (Admin only).

## Role Capabilities

The frontend strictly enforces business rules visually. Below is a breakdown of actions available based on the authenticated user's role:

| Feature                   | Admin | Support Agent | Customer |
| ------------------------- | ----- | ------------- | -------- |
| View all tickets          | [Yes] | [No]          | [No]     |
| View assigned tickets     | [No]  | [Yes]         | [No]     |
| View created tickets      | [No]  | [No]          | [Yes]    |
| Create new ticket         | [No]  | [No]          | [Yes]    |
| Update ticket status      | [Yes] | [Yes]         | [No]     |
| Assign agent to ticket    | [Yes] | [No]          | [No]     |
| Update ticket priority    | [Yes] | [No]          | [No]     |
| Add comments              | [Yes] | [Yes]         | [Yes]    |
| Log time entries          | [No]  | [Yes]         | [No]     |
| Close resolved ticket     | [No]  | [No]          | [Yes]    |
| Access User Management    | [Yes] | [No]          | [No]     |
| View Analytics Dashboard  | [Yes] | [No]          | [No]     |

## Dashboards & UI Structure

The UI utilizes a modern "glassmorphism" aesthetic powered by TailwindCSS and Lucide Icons.
- **Admin Shell**: Features a collapsible sidebar for navigation and a topbar containing user profile actions.
- **Feedback System**: A custom `UiFeedbackService` provides non-blocking toast notifications for API successes and errors.
- **Forms**: Built exclusively with Angular Reactive Forms, featuring strict validation that mirrors the backend Swagger specifications.

## Environment Configuration

The application connects to the API using the base URL defined in the environment files.

`src/environments/environment.ts`
```typescript
export const environment = {
    baseURL: 'https://support-ticket.runasp.net/api/v1/',
};
```

## Running Locally

1. Clone the repository and navigate to the frontend directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Navigate to `http://localhost:4200/` in your browser.

## Production Build

To generate an optimized production bundle:
```bash
npm run build
```
The build artifacts will be stored in the `dist/support-ticket-management/` directory.

## Assumptions & Limitations

- **Frontend Testing**: Automated frontend tests (Karma/Jasmine unit tests) have not been implemented due to time constraints; focus was placed on UI/UX polish and core functionality.
- **Caching**: While the Angular services manage local state efficiently using Signals, advanced HTTP caching mechanisms (like request memoization for identical concurrent calls) are not currently implemented.
- **Dark Mode**: The CSS is configured to support dark mode via Tailwind's `dark:` variants, but a manual toggle switch has not yet been exposed in the UI.

## Technical Review Highlights

- **Smart/Dumb Component Pattern**: The `tickets` and `users` features heavily utilize the Container/Presenter pattern. Smart components (like `TicketListComponent`) handle routing state and API calls, passing data down to Dumb components (like `TicketListTableComponent` or `TicketListFiltersComponent`) via Angular Signals.
- **State Synchronization**: The filter states (search terms, selected roles, pagination) are intentionally bound to the URL query parameters using `Router.navigate([], { queryParamsHandling: 'merge' })`. This guarantees that users can bookmark and share specific filtered views of the data grid.
- **JWT Interception**: The `jwtInterceptor` automatically intercepts outgoing HTTP requests to append the Authorization header, drastically reducing boilerplate code across the application's services.
- **Modern Angular Reactivity**: The application completely bypasses older `@Input()` decorators in favor of Angular 17+ `input.required<T>()` and `output<T>()` signals, ensuring highly optimal change detection.

## Assessment Requirements Coverage

| Assessment Requirement   | Implementation | Status |
| ------------------------ | -------------- | ------ |
| Angular 17+              | Built with Angular 19 signals. | [Yes] |
| TypeScript               | Strict typing enforced across models and services. | [Yes] |
| Reactive Forms           | Used exclusively for authentication, tickets, and comments. | [Yes] |
| RxJS                     | Utilized for HTTP calls and ActivatedRoute observables. | [Yes] |
| Angular Material         | Substituted with TailwindCSS for a more premium UI. | [Partial] |
| Role-Based UI            | Elements and routes hidden based on JWT claims. | [Yes] |
| Interceptors             | Configured for JWT injection. | [Yes] |
| Lazy Loading             | All feature modules are lazy-loaded via `loadComponent`. | [Yes] |
| Frontend Testing         | Deferred due to time constraints. | [No] |

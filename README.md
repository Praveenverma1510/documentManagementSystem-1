# Document Management System - Frontend Assignment

## Overview

This project is a frontend implementation of a Document Management System (DMS) built with React. The system allows users to upload, tag, search, preview, and download documents with a responsive interface.

## Features

- User authentication via OTP
- Admin interface for user creation
- Document upload with:
  - Date picker
  - Category selection (Personal/Professional)
  - Dynamic dropdowns for names/departments
  - Tag management
  - File type restrictions (PDF/Images only)
- Document search with filters
- File preview and download functionality
- Responsive design

## Technologies Used

- React
- Bootstrap
- State management

## Setup Instructions

### Prerequisites

- npm
- React

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Nikita2702/documentManagementSystem.git
   ```

2. Navigate to the project directory:

   ```bash
   cd documentManagementSystem
   ```

3. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

4. Configure environment variables:
   - Create a `.env` file based on `.env.example`
   - Add your API endpoints and any other required configurations

### Running the Application

```bash
npm start
# or
ng serve
# or
yarn start
```

The application will be available at `http://localhost:4200` (or appropriate port).

## API Integration

The application uses the following API endpoints (from the provided Postman collection):

- OTP generation: `/api/auth/otp`
- OTP validation: `/api/auth/validate`
- [List other key endpoints used]

## Testing

To run unit tests:

```bash
npm test
```

## Development Approach

- Components were developed incrementally with frequent Git commits
- State management implemented.
- Responsive design achieved with Bootstrap

# YumMenu Server Backend

This project is a basic Node.js server backend. It provides API endpoints for handling requests and interacting with a database (or any other service, as per project requirements).

## Features

- Basic setup with Express.js
- Environment variable management with `dotenv`
- Simple routing for API endpoints
- JSON-based request and response handling
- Error handling middleware

## Prerequisites

Make sure you have Node.js installed on your system. You can download it from [here](https://nodejs.org/).

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/boredom1234/yummenu-backend.git
    cd nodejs-backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
    - Create a `.env` file in the root directory and add the necessary environment variables   
    
```env 
MONGODB_CONNECTION_STRING
AUTH_AUDIENCE
AUTH_ISSUER_URL
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
FRONTEND_URL
STRIPE_API_KEY, STRIPE_WEBHOOK_SECRET
```



## Running the Server

To start the server, run the following command:

```bash
npm run dev

# AJAX Newsletter Subscription Form

[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/MrMblock/TP-Ajax-Newsletter.git)

This project is a complete, full-stack application for a newsletter subscription form. It features a modern, responsive frontend that communicates with a Node.js backend via AJAX. The application includes both client-side and server-side validation, and it uses MongoDB to store subscriber information.

## Features

- **Asynchronous Form Submission**: Uses AJAX (`fetch` API) to submit form data without a page reload, providing a smooth user experience.
- **Client-Side Validation**: Real-time validation of form fields (email, first name, last name) as the user types and on submission.
- **Server-Side Validation**: Robust backend validation and sanitization of all incoming data to ensure data integrity and security.
- **RESTful API**: A well-structured API for managing subscribers, including endpoints for creation, retrieval, and deletion.
- **Database Integration**: Persists subscriber data in a MongoDB database using the Mongoose ODM.
- **Modern UI/UX**: A responsive and visually appealing interface built with Bootstrap 5, custom CSS, and an interactive particle background using `particles.js`.
- **Environment Configuration**: Uses `.env` files for easy configuration of database connections and server settings.
- **Comprehensive Testing**: Includes both unit and integration tests using Mocha, Chai, and Sinon to ensure code quality and reliability.

## Technologies Used

- **Frontend**: HTML5, CSS3, Bootstrap 5, JavaScript (ES6+), particles.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Testing**: Mocha, Chai, Sinon, Supertest
- **Development**: nodemon, dotenv

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) instance (local or cloud-hosted)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/MrMblock/TP-Ajax-Newsletter.git
    cd TP-Ajax-Newsletter
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory by copying the example file:
    ```bash
    cp .env.example .env
    ```
    Open the `.env` file and configure the variables, especially your MongoDB connection URI:
    ```env
    # Your MongoDB connection string
    MONGODB_URI=mongodb://localhost:27017/newsletter

    # Server port
    PORT=3000
    ```

### Running the Application

-   **Development Mode (with auto-reload):**
    This will start the server using `nodemon`, which automatically restarts the server on file changes.
    ```bash
    npm run dev
    ```

-   **Production Mode:**
    ```bash
    npm start
    ```

The application will be available at `http://localhost:3000`.

### Running Tests

This project includes a full test suite.

-   **Run all tests:**
    ```bash
    npm test
    ```

-   **Run only unit tests:**
    ```bash
    npm run test:unit
    ```

-   **Run only integration tests:**
    ```bash
    npm run test:integration
    ```

## API Endpoints

The application exposes the following RESTful API endpoints under the `/api` prefix.

### `POST /api/subscribe`

Creates a new subscriber entry.

-   **Request Body:**
    ```json
    {
      "email": "jean.dupont@example.com",
      "prenom": "Jean",
      "nom": "Dupont"
    }
    ```

-   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "errors": [],
      "message": "Bienvenue Jean Dupont! Merci de votre inscription.",
      "subscriber": {
        "id": "60d5ecb1e6e8c4001f2f8b5a",
        "email": "jean.dupont@example.com",
        "prenom": "Jean",
        "nom": "Dupont"
      }
    }
    ```

-   **Error Response (400 Bad Request):**
    ```json
    {
      "success": false,
      "errors": ["L'email n'est pas valide", "Le nom doit contenir au moins 2 caractères"]
    }
    ```

### `GET /api/subscribers`

Retrieves a list of all subscribers.

-   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        {
          "_id": "60d5ecb1e6e8c4001f2f8b5a",
          "email": "test1@example.com",
          "prenom": "Jean",
          "nom": "Dupont",
          "subscriptionDate": "2023-01-01T00:00:00.000Z",
          "isActive": true
        }
      ]
    }
    ```

### `GET /api/stats`

Retrieves statistics about the subscribers.

-   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "totalSubscribers": 42
      }
    }

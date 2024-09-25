Project Title: RESTful API with MongoDB Using Node.js and Express

To start the server, use one of the following commands: 
npm start or node server.js 
Once the server is running, it will be accessible at the following URL: 
Port: http://localhost:2100/users 
You can now send requests to the /users endpoint to interact with user data on the server.

Description: This project demonstrates the implementation of a RESTful API using Node.js and Express, with MongoDB as the database. The API allows for full CRUD operations—creating, reading, updating, and deleting user data—while leveraging Mongoose for seamless database interactions. The project includes middleware handling, schema validation, and proper routing to manage user data.

Key Features:

MongoDB Connection with Mongoose:

Mongoose is used to connect the Node.js application to a MongoDB database, ensuring a reliable connection and handling database operations.
A well-defined Mongoose schema is implemented for users, enforcing validation rules for fields like firstName, lastName, email, and password.
CRUD Operations via REST API:

GET /users: Retrieves a list of all users from the MongoDB collection.
GET /users/:id: Fetches a specific user's details using MongoDB ObjectId.
POST /user: Adds a new user to the database, with data validation.
PUT /user/:id: Updates the details of an existing user based on ObjectId.
DELETE /user/:id: Deletes a user from the database using ObjectId.
Middleware and Validation:

Advanced middleware is used to handle request logging, error handling, and validation checks before interacting with the database.
All input data is validated to ensure the integrity of the stored user information.
Testing and Submission:

The project is thoroughly tested using Postman for API request validation.
Screenshots of the test results and MongoDB Compass views are provided to show the successful execution of each API operation.
Technologies Used:

Node.js
Express.js
MongoDB (with Mongoose)
Postman for API testing
MongoDB Compass for database inspection
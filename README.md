API Documentation

Welcome to the API documentation for MediTrack, your trusted platform for medical inventory management. 
Below, you'll find detailed information on the endpoints available in our API, along with examples of how to interact with them.

Authentication
POST /api/auth/login

Endpoint to allow users to log in to the platform.
Request:

     {
      "email": "user@example.com",
       "password": "password123"
     }

Response:

    {
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }

POST /api/auth/register
Endpoint to allow users to register on the platform.

Request:

    {
     "firstName": "John",
     "lastName": "Doe",
     "email": "user@example.com",
     "password": "password123"
    }

Response:

    {
     "message": "User registered successfully"
    }

Medications
GET /api/medications
Retrieve the list of medications stored in the database.

Response:

    [
     {
      "id": 1,
       "name": "Aspirin",
       "dosage": "500mg",
       "stock": 100
     },
     {
       "id": 2,
       "name": "Ibuprofen",
       "dosage": "200mg",
       "stock": 50
     }
    ]

POST /api/medications
Add a new medication to the database.

Request:

    {
     "name": "Paracetamol",
     "dosage": "250mg",
    "stock": 75
    }

Response:

    {
     "message": "Medication added successfully"
    }

Medical Equipment
GET /api/equipment
Retrieve the list of medical equipment stored in the database.

Response:

    [
     {
      "id": 1,
      "name": "Surgical Scalpel",
      "quantity": 10
     },
     {
      "id": 2,
      "name": "Suction Device",
      "quantity": 5
     }
    ]

POST /api/equipment
Add a new piece of medical equipment to the database.

Request:

    {
     "name": "Oxygen Concentrator",
     "quantity": 3
    }

Response:

    {
      "message": "Equipment added successfully"
    }




    













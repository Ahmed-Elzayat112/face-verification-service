# AI Face-Verification Microservice

This project is a standalone Node.js microservice for real-time face verification. It exposes a simple REST API to first enroll a user by generating a facial embedding from a photo, and then verify their identity by comparing a new photo against the stored embedding.

The entire application is built with TypeScript for type safety and uses a professional-grade ONNX face recognition model from the Hugging Face Hub for high accuracy.

## ✨ Features

-   **User Enrollment:** Encodes a high-quality user photo into a 512-dimension vector (embedding).
-   **User Verification:** Compares a new photo against a stored embedding to verify identity.
-   **High Accuracy:** Uses a pre-trained ArcFace deep learning model in ONNX format.
-   **Robust & Scalable:** Built with TypeScript, Express, and Sequelize for a maintainable codebase.
-   **Self-Contained:** The ONNX model is included locally for fast, reliable inference without external API calls.

## 🛠️ Technical Stack

-   **Backend:** Node.js, Express.js
-   **Language:** TypeScript
-   **Database:** PostgreSQL
-   **ORM:** Sequelize with `sequelize-typescript`
-   **AI Model Inference:** ONNX Runtime (`onnxruntime-node`)
-   **Image Processing:** Sharp
-   **File Uploads:** Multer
-   **Environment Variables:** Dotenv

## 🤖 AI Model Information

This service uses a highly accurate face recognition model based on the ArcFace architecture. The model has been converted to the ONNX (Open Neural Network Exchange) format for cross-platform compatibility and high-performance inference.

-   **Model Used:** `arcface-onnx`
-   **Source:** [asit-ge/arcface-onnx on Hugging Face](https://huggingface.co/garavv/arcface-onnx)
-   **Output:** 512-dimension facial embedding vector.

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

-   Node.js (v18 or later recommended)
-   NPM
-   PostgreSQL
-   Git

### 1. Clone the Repository

```bash
git clone https://github.com/Ahmed-Elzayat112/face-verification-service.git
cd face-verification-service
```

**(Remember to replace the URL with your actual Git repository link)**

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root of the project by copying the example file:

```bash
cp .env.example .env
```

Now, open the `.env` file and fill in your PostgreSQL database credentials:

```env
# .env

# The full connection string for your PostgreSQL database
# Format: postgres://USER:PASSWORD@HOST:PORT/DATABASE_NAME
DATABASE_URL="postgres://your_postgres_user:your_secret_password@localhost:5432/face_verification"

# The port the application will run on
PORT=3000
```

### 4. Database Setup

Ensure your PostgreSQL server is running. When the application starts for the first time, Sequelize will automatically create the `users` table for you. No manual SQL is needed.

## 🏃 Running the Application

### Development Mode

This command starts the server with `nodemon` and `ts-node`, which will automatically restart the server on file changes.

```bash
npm run dev
```

You should see the following output in your console:

```
Server is running on http://localhost:3000
```

### Production Mode

To run the application in production, you first need to build the TypeScript code into JavaScript.

```bash
# 1. Compile TypeScript to JavaScript (output will be in the /dist folder)
npm run build

# 2. Start the server from the compiled code
npm start
```

## 🧪 How to Test the Full Workflow

Use an API client like Postman or Insomnia to test the endpoints.

### Step 1: Register a User (`/encode`)

This endpoint creates a facial embedding from a high-quality photo and stores it.

-   **Method:** `POST`
-   **URL:** `http://localhost:3000/api/encode`
-   **Body:** `form-data`
    -   **Key:** `image`
    -   **Type:** `File`
    -   **Value:** Select an image file of a person (e.g., `person_A_register.jpg`).

#### ✅ Success Response (200 OK)

```json
{
    "success": true,
    "embedding": [0.0123, -0.0456, ..., 0.0789],
    "userId": 1
}
```

**➡️ Action:** Copy the entire `embedding` array. You will need it for the next step.

---

### Step 2: Verify a User (`/compare`)

This endpoint takes a new image and compares it against the `storedEmbedding` from Step 1.

-   **Method:** `POST`
-   **URL:** `http://localhost:3000/api/compare`
-   **Body:** `form-data`
    -   **Key:** `image`
    -   **Type:** `File`
    -   **Value:** Select a _different_ image of the **same person** (e.g., `person_A_verify.jpg`).
    -   **Key:** `storedEmbedding`
    -   **Type:** `Text`
    -   **Value:** Paste the embedding array you copied from the `/encode` response.

#### ✅ Success Response (Match)

You should see `isMatch: true` and a high similarity score (greater than 0.6).

```json
{
    "success": true,
    "isMatch": true,
    "similarity": 0.9218
}
```

#### ✅ Success Response (No Match)

If you use an image of a different person, you should see `isMatch: false` and a low similarity score.

```json
{
    "success": true,
    "isMatch": false,
    "similarity": 0.1573
}
```

#### ❌ Error Response (400 Bad Request)

If you provide invalid data (e.g., no image file), the API will return a clear error message.

```json
{
    "success": false,
    "error": "No image file provided."
}
```

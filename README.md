# Chatter Box

Chatter Box is a web-based chat application built with Spring Boot and ReactJS. It allows users to engage in real-time conversations, fostering seamless communication within a user-friendly interface.

## To take Demo

Visit the [Chatter Box Demo](https://chatter-box-24.netlify.app/) to experience the application.

## Features

- **Real-time chat:** Instantly connect with other users in real-time.
- **Responsive design:** Enjoy a seamless experience across devices, from desktops to mobile devices.
- **Easy-to-use interface:** Intuitive design for effortless navigation and communication.

## Technologies Used

- **Frontend:**
  - ReactJS

- **Backend:**
  - Spring Boot


## Running on your machine

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine
- [Java Development Kit (JDK)](https://adoptopenjdk.net/) installed
- [Spring Boot](https://spring.io/projects/spring-boot) installed

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/chatter-box.git
    ```
2. **Navigate into the directory:**

   ```bash
   cd chatter-box
   ```
3. **Install client dependencies:**

   ```bash
    cd client-side
    npm install
    ```
4. **Install server dependencies:**

   ```bash
    cd ../chatserver
    ./mvnw clean install
    ```
5. **Start the Spring Boot backend:**

   ```bash
    cd chatserver
    ./mvnw spring-boot:run
    ```
    The backend will run on http://localhost:8080.

6. **Start the React frontend:**

   ```bash
    cd client-side
    npm start
    ```
    The frontend will run on http://localhost:3000.

**Open http://localhost:3000 to view the application in your browser.**



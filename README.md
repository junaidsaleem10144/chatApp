# ChatApp: Real-time Chat Application with Websockets Communication

This is a chat application created using Websockets communication and built with the MERN stack. The application allows users to send and receive messages in real-time and stores the messages in a database. It provides a seamless experience for users to engage in conversations and exchange messages, files in real-time. With ChatApp, users can easily connect with friends, colleagues, or any other individuals and have interactive discussions.

## Key Features

- **Real-time Messaging:** Users can exchange messages with others in real-time, providing instant communication.
- **Message History:** ChatApp keeps track of message history, allowing users to view previous conversations.
- **Online Presence:** The application displays the online status of users. When a user connects or disconnects from the application.
- **File Upload:** Users can upload files (e.g., images, documents) to share with other users during conversations.
- **WebSocket Communication:** The project utilizes WebSockets to establish real-time, bidirectional communication between the server and clients. This enables instant messaging and updates without the need for frequent page refreshes.
- **Secure Authentication:** User passwords are securely stored using the bcrypt hashing algorithm. JWT (JSON Web Tokens) are used for authentication and authorization.
- **Avatar Generation:** Avatars are generated based on the username to provide personalized profile images for users.

## Technology Stack

The ChatApp was developed using the following technologies:

- **Node.js:** A JavaScript runtime environment used for server-side development.
- **Express.js:** A server-side framework for building RESTful APIs and handling server-side logic.
- **WS (WebSocket):** A JavaScript library for enabling real-time, bidirectional communication between clients and servers using websockets.
- **React:** A JavaScript library for building user interfaces.
- **MongoDB:** A NoSQL database used to store user data and chat history.
- **Tailwind CSS:** A utility-first CSS framework used for styling the frontend.

## Getting Started

To get started with the chat application, follow the steps below:

1. Clone the repository: `git clone https://github.com/junaidsaleem10144/chatApp.git`
2. Navigate to the project directory: `cd chatApp`
3. Install the dependencies:
   - Backend: Navigate to the `api` folder and run `npm install`
   - Frontend: Navigate to the `client` folder and run `npm install`
4. Create a `.env` file in the `api` folder and provide the necessary environment variables. You can refer to the `.env.example` file for the required variables.
5. Start the development servers:
   - Backend: In the `api` folder, run `npm run start`
   - Frontend: In the `client` folder, run `npm run dev`

Now, you can access the chat app by opening your browser and visiting `http://localhost:4000`.

## Folder Structure

The project follows a specific folder structure:

- `api/`: Contains the backend code, including server setup, routes, and models.
- `client/`: Contains the frontend code, including React components, styles, and assets.

## Acknowledgements

We would like to express our gratitude to the following resources and libraries that have been instrumental in the development of ChatApp:

### Backend

- [bcryptjs](https://www.npmjs.com/package/bcryptjs): Library for hashing and comparing passwords.
- [cookie-parser](https://www.npmjs.com/package/cookie-parser): Middleware for parsing cookies in Express.
- [cors](https://www.npmjs.com/package/cors): Middleware for enabling Cross-Origin Resource Sharing (CORS).
- [dotenv](https://www.npmjs.com/package/dotenv): Module for loading environment variables from a .env file.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken): Library for generating and verifying JSON Web Tokens (JWT).
- [mongoose](https://mongoosejs.com/): Object Data Modeling (ODM) library for MongoDB.
- [express](https://expressjs.com/): Web framework for Node.js.
- [ws](https://www.npmjs.com/package/ws): JavaScript library for enabling real-time, bidirectional communication between clients and servers using websockets.

### Frontend

- [axios](https://axios-http.com/): Library for making HTTP requests from the client.
- [react](https://reactjs.org/): JavaScript library for building user interfaces.
- [react-dom](https://reactjs.org/docs/react-dom.html): Package for rendering React components.
- [lodash](https://lodash.com/): Utility library that provides helpful functions for working with arrays, objects, and more.

**Development dependencies (Frontend):**

- [@types/react](https://www.npmjs.com/package/@types/react): Type definitions for React.
- [@types/react-dom](https://www.npmjs.com/package/@types/react-dom): Type definitions for React DOM.
- [@vitejs/plugin-react](https://www.npmjs.com/package/@vitejs/plugin-react): Vite plugin for React support.
- [autoprefixer](https://www.npmjs.com/package/autoprefixer): PostCSS plugin for adding vendor prefixes to CSS.
- [postcss](https://www.npmjs.com/package/postcss): CSS post-processor tool.
- [tailwindcss](https://tailwindcss.com/): Utility-first CSS framework.
- [vite](https://vitejs.dev/): Build tool for modern web development.

Thank you for considering ChatApp! If you have any further questions or feedback, please feel free to reach out.

## Contributing

Contributions to the ChatApp are welcome! If you find any issues or want to add new features, please feel free to open a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

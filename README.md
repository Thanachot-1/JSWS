# Class Schedule and Homework Management App

This is a web application designed for managing class schedules and homework assignments. It is mobile-friendly and supports real-time updates using Firebase as the backend. The application allows two users to view and manage each other's information.

## Features

- **User Authentication**: Users can log in to access their schedules and homework.
- **Class Schedule Management**: Users can add, edit, and delete their class schedules.
- **Homework Management**: Users can manage their homework assignments with options to add, edit, and delete.
- **Real-Time Updates**: Changes made by one user are instantly reflected for the other user.
- **Mobile-Friendly Design**: The application is optimized for use on mobile devices.

## Technologies Used

- **React**: For building the user interface.
- **TypeScript**: For type safety and better development experience.
- **Firebase**: For real-time database and user authentication.
- **CSS**: For styling the application.

## Getting Started

1. **Clone the Repository**:
   ```
   git clone <repository-url>
   cd class-schedule-homework-app
   ```

2. **Install Dependencies**:
   ```
   npm install
   ```

3. **Set Up Firebase**:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Add your Firebase configuration in `src/services/firebase.ts`.

4. **Run the Application**:
   ```
   npm start
   ```

5. **Access the Application**:
   Open your browser and navigate to `http://localhost:3000`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
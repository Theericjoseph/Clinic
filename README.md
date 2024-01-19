# Clinic Management System

## Overview
The Clinic Management System is a web-based application designed to streamline and optimize the management of patient records, appointments, and visits for a medical clinic. It provides an intuitive interface for both clinic staff and doctors, enhancing efficiency in day-to-day operations.

## Key Features
- **Patient Management:** Easily add, view, and edit patient details, including personal information and medical history.
- **Visit Logging:** Record and track patient visits, prescriptions, and medical recommendations.
- **Doctor Details:** Maintain a database of doctors, including their schedules and contact information.
- **Search and Filters:** Quickly search for patients, appointments, or doctors using powerful search and filter options.

## Technologies Used
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Additional Libraries:** Bootstrap, Font Awesome

## Getting Started
1. Clone the repository: `git clone https://github.com/your-username/clinic.git`
2. Install dependencies: `npm install`
3. **Create Environment Variables:**
   - Create a file named `.env` in the project root.
   - Add the following content to the `.env` file and replace the values with your database configuration:

     ```env
     DB_PORT = 3306
     DB_HOST = localhost
     DB_USER = your_database_user
     DB_PASS = "your_database_password"
     ```

   - Save the `.env` file.

4. Run the application: `npm start`
5. Access the application at `http://localhost:3000` in your browser.

### Troubleshooting MySQL Authentication Error
If you encounter an authentication error with the message 'Client does not support authentication protocol requested by server,' follow these steps:

1. Open MySQL Workbench.
2. Execute the following query, replacing 'root' with your user, 'localhost' with your URL, and 'password' with your password:

   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
   FLUSH PRIVILEGES
   ```

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

## Prerequisites
Before you start, make sure you have the following installed on your machine:

- **Node.js:** [Download Node.js](https://nodejs.org/)
- **npm (Node Package Manager):** Included with Node.js installation
- **MySQL Database:** [Download and Install](https://www.mysql.com/)

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
   
## Working
1. **Staff Roles:** Staff members can have one of two roles - doctor or receptionist. When creating staff profiles, assign them the appropriate role based on their responsibilities.

2. **Admin Access:** To manage staff and their roles, log in with admin credentials:
   - Username: `admin`
   - Password: `admin123`

3. **Billing and Patient Assignment:**
   - Receptionists, with their login credentials, can create new bills for new patients.
   - After creating a bill, receptionists can assign the patient to one of the available doctors for consultation.

4. **Doctor Consultation:**
   - Doctors, upon logging in, can consult with assigned patients.
   - During the consultation, doctors can add diagnoses and prescribe medicine, updating the database with relevant patient information.

By following these steps, the system facilitates the smooth flow of patient management, billing, and doctor-patient interactions. Receptionists handle billing and patient assignments, while doctors can easily access and update patient information during consultations.




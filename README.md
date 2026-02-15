# COLORS - LAMP Stack Web Application

## Description
COLORS is a web application built on the LAMP stack that allows authenticated users to manage a database of colors. After logging in, users can add new colors to the database and search for existing colors by name. The application returns the name of any matching color found in the database.

## Technologies Used
- **Linux** - Server operating system
- **Apache** - Web server
- **MySQL** - Relational database for storing user accounts and color data
- **PHP** - Server-side scripting for API endpoints
- **HTML/CSS/JavaScript** - Frontend interface

## Project Structure
```
colors-lamp/
├── api/
│   └── (PHP API endpoints)
├── public/
│   ├── index.html
│   ├── css/
│   └── js/
├── README.md
├── LICENSE.md
└── .gitignore
```

## Setup Instructions

### Prerequisites
- A Linux server with Apache, MySQL, and PHP installed (LAMP stack)
- A MySQL database and user with appropriate permissions

### Database Setup
1. Log into MySQL:
   ```bash
   mysql -u root -p
   ```
2. Create the database and tables required by the application (user accounts table and colors table).
3. Create a MySQL user with access to the database and update the credentials in the PHP API files.

### Deploying the Application
1. Clone the repository:
   ```bash
   git clone https://github.com/evanjania/Colors-Project-LAMP.git
   ```
2. Copy the contents of `public/` to your Apache web root (e.g., `/var/www/html/`):
   ```bash
   cp -r public/* /var/www/html/
   ```
3. Copy the contents of `api/` to your API directory (e.g., `/var/www/html/LAMPAPI/`):
   ```bash
   cp -r api/* /var/www/html/LAMPAPI/
   ```
4. Update the database credentials in each PHP file inside `api/`:
   ```php
   $connection = new mysqli("localhost", "YOUR_USER", "YOUR_PASSWORD", "YOUR_DB");
   ```
5. Ensure Apache has read permissions on all files:
   ```bash
   chmod -R 644 /var/www/html/
   ```

## Running and Accessing the Application
Once deployed, open a browser and navigate to your server's IP address or domain:
```
http://colorprojectevanjania.xyz/
```
- Register a new account or log in with existing credentials
- Once logged in, you can add colors to the database or search for colors by name

## Assumptions and Limitations
- The application does not hash passwords (plain text storage). This is a lab project and not intended for production use.
- No HTTPS is configured. For production, an SSL certificate should be added.
- The application assumes a single LAMP server environment.

## AI Usage
This project was developed with assistance from Claude (Anthropic) for code review, debugging, and documentation guidance, in accordance with class policy.

# Blogging Platform

This project is a blogging platform that leverages a containerized environment using Docker. It includes a backend application, a PostgreSQL database, and a pgAdmin instance for database management. The app supports user authentication, integrates with DigitalOcean Spaces for object storage, and uses JSON Web Tokens (JWT) for secure session handling.

## Features

- **Backend**: Built with a robust framework (NestJS assumed).
- **Database**: PostgreSQL for reliable and efficient data storage.
- **Database Management**: pgAdmin for an easy-to-use interface to manage the database.
- **Authentication**: JSON Web Tokens (JWT) for secure user sessions.
- **Object Storage**: DigitalOcean Spaces for storing files and media assets.

## Prerequisites

- Docker installed on your system
- A DigitalOcean Spaces account with the appropriate credentials

## Getting Started

Follow these instructions to set up and run the project locally.

### Clone the Repository

```bash
git clone git@github.com:yahialabeeb/bloggin-platform.git
cd bloggin-platform
```

### Environment Variables

The application requires several environment variables to function. These are already configured in the `docker-compose.yml` file.

- `DB_HOST`: Hostname for the database (set to `db` for Docker networking).
- `DB_PORT`: Port number for the database (default: `5432`).
- `DB_USERNAME`: Username for the database (default: `postgres`).
- `DB_PASSWORD`: Password for the database (default: `postgres`).
- `DB_DATABASE`: Name of the database (default: `postgres`).
- `JWT_SECRET`: Secret key for signing JWTs.
- `JWT_EXPIRES_IN`: Expiry time for access tokens (in seconds).
- `JWT_REFRESH_EXPIRES_IN`: Expiry time for refresh tokens (in seconds).
- `S3_URL`: DigitalOcean Spaces URL.
- `S3_BUCKET_NAME`: Name of the bucket.
- `AWS_ACCESS_KEY_ID`: Access key for DigitalOcean Spaces.
- `AWS_SECRET_ACCESS_KEY`: Secret key for DigitalOcean Spaces.

### Run the Application

1. Build and start the Docker containers:

   ```bash
   docker-compose up --build
   ```

2. The application will be available at:

   - Backend: [http://localhost:8000](http://localhost:8000)
   - pgAdmin: [http://localhost:5050](http://localhost:5050)

### Access pgAdmin

1. Open [http://localhost:5050](http://localhost:5050) in your browser.
2. Log in with the following credentials:
   - Email: `postgres@pgadmin.com`
   - Password: `postgres`
3. Add a new server connection:
   - Host: `db`
   - Port: `5432`
   - Username: `postgres`
   - Password: `postgres`

## File Structure

```
.
├── app/                # Application source code
├── data/               # PostgreSQL data
├── docker-compose.yml  # Docker configuration file
└── README.md           # Project documentation
```

## Notes

- Ensure your DigitalOcean Spaces credentials are secure and not shared publicly.
- You can modify the `docker-compose.yml` file to adjust settings as needed.
- To stop the containers, run:

  ```bash
  docker-compose down
  ```

## Troubleshooting

- **Database Connection Issues**: Ensure the `db` service is running and the environment variables are correctly set.
- **pgAdmin Access**: Verify that port `5050` is not in use by another application.
- **JWT Errors**: Check the `JWT_SECRET` and expiration times in the environment variables.

# BlogsInk Deployment Guide

This guide provides instructions for deploying the BlogsInk application using Docker and Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (version 20.10.0 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 1.29.0 or higher)
- Git (for cloning the repository)

## Deployment Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd blogsInk
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory based on the provided `.env.example`:

```bash
cp .env.example .env
```

Edit the `.env` file and update the following variables with your actual values:

- MongoDB credentials
- JWT secret
- Cloudinary credentials (if using Cloudinary for file uploads)
- SMTP settings (for email functionality)

### 3. Build and Start the Containers

Run the following command to build and start all services:

```bash
docker-compose up -d
```

This will start three containers:
- MongoDB database
- Backend API server
- Frontend web server

### 4. Verify Deployment

Once all containers are running, you can access:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

Verify that the application is working correctly by navigating to the frontend URL in your browser.

### 5. Managing the Application

#### View logs

```bash
# View logs for all services
docker-compose logs

# View logs for a specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongo
```

#### Stop the application

```bash
docker-compose down
```

#### Restart the application

```bash
docker-compose restart
```

#### Rebuild and update the application

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Production Deployment Considerations

### Security

1. **Use Strong Passwords**: Ensure all passwords in the `.env` file are strong and unique.
2. **Secure MongoDB**: Configure MongoDB with authentication and proper network security.
3. **HTTPS**: For production, configure NGINX with SSL certificates.

### Performance

1. **Resource Allocation**: Adjust container resources based on expected load.
2. **Database Indexing**: Ensure proper indexes are created for MongoDB collections.
3. **Caching**: Implement Redis for caching if needed.

### Scaling

1. **Load Balancing**: For high traffic, consider adding a load balancer.
2. **Database Replication**: Set up MongoDB replication for data redundancy.

### Monitoring

1. **Container Monitoring**: Use tools like Prometheus and Grafana.
2. **Log Management**: Consider using ELK stack or similar for log aggregation.

## Troubleshooting

### Common Issues

1. **Container fails to start**:
   - Check logs: `docker-compose logs [service_name]`
   - Verify environment variables are correctly set

2. **Database connection issues**:
   - Ensure MongoDB container is running: `docker ps`
   - Check MongoDB connection string in the `.env` file

3. **File upload issues**:
   - Verify Cloudinary credentials if using cloud storage
   - Check permissions on local upload directories

4. **Frontend cannot connect to backend**:
   - Ensure the `REACT_APP_API_URL` is correctly set
   - Check if backend API is accessible

## Backup and Restore

### Database Backup

```bash
docker exec blogsink-mongo mongodump --username $MONGO_INITDB_ROOT_USERNAME --password $MONGO_INITDB_ROOT_PASSWORD --authenticationDatabase admin --db blogsink --out /dump
docker cp blogsink-mongo:/dump ./backup
```

### Database Restore

```bash
docker cp ./backup blogsink-mongo:/dump
docker exec blogsink-mongo mongorestore --username $MONGO_INITDB_ROOT_USERNAME --password $MONGO_INITDB_ROOT_PASSWORD --authenticationDatabase admin /dump
```

## Updating the Application

To update the application to a newer version:

1. Pull the latest changes from the repository
2. Rebuild the containers with the new code

```bash
git pull
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Support

If you encounter any issues during deployment, please open an issue in the project repository or contact the development team.
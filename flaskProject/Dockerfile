# Use an official Python runtime as a parent image
FROM python:latest

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Define a build-time argument for the environment variable
ARG ENV=test

# Set the environment variable to the build-time argument's value
ENV ENV=${NAME}

# Run app.py when the container launches
CMD ["python", "app.py"]

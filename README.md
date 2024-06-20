# XML Parser

Back-end challenge for Outcoders by Juan Pablo Lozano Escareño

## Setup

### Step 1: Create an Environment File

Create a `.env` file in the root directory of the project. Use the `.env.example` file as a reference for the necessary environment variables.

### Step 2: Build the docker image

```bash
docker build -t xml-parser .
```

### Step 3: Run the Docker container

```bash
docker run -d -p 4000:4000 --env-file .env --name xml-parser-container xml-parser
```

### Step 4: Utilize the Connection String

For ease of use, please utilize the connection string provided via email.

##

Please, feel free to reach out if you encounter any issues or have questions regarding the setup process.

# XML Parser

Back-end challenge for Outcoders by Juan Pablo Lozano Escareño

## Setup

### Step 1: Create an Environment File

Create a `.env` file in the root directory of the project. Use the `.env.example` file as a reference for the necessary environment variables.

### Step 2: Build the docker image and run the container.

```bash
docker-compose up --build
```

Data can be fetched using Postman on `localhost:4000/graphql`

For a quick demo, uncomment line 13 in `src/services/xml-parser.service.ts` as it will return only the first 100 fetched vehicles, Otherwise the process will run for the 11,000+ vehicles.

Please, feel free to reach out if you encounter any issues or have questions regarding the setup process.

# Advanced Web Application Development - Final project
## Getting Started

First, install the packages:

```bash
npm install
```

Create the file *.env.local* at the root folder:

```
NEXT_PUBLIC_GOOGLE_CLIENT_ID = your_google_client_id
NEXT_PUBLIC_GITHUB_CLIENT_ID = your_github_client_id
NEXT_PUBLIC_SERVER_DOMAIN = http://localhost:1400/api
NEXT_PUBLIC_WS_DOMAIN = http://localhost:1400
NEXT_PUBLIC_SENTRY_DSN = your_sentry_dsn
```

If you run the development server, please go to the [server repository](https://github.com/tranphuongdinh/PTUDWNC-MIDTERN-PROJECT-SERVER) to run the local server.

Run the development server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

After building the project, you can start the project:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy the project on Vercel

The easiest way to deploy this project is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

This project was deployed at: https://ptudwnc-final-project-client.vercel.app/

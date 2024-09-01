# AI matchmaking for Antler

This is an AI matchmaking app currently using cosine similarity for openai embeddings to answers in an Excel sheet to match founders in the Antler cohort together. The project runs in [Next.js](https://nextjs.org/) where the matching algorithm is written in Node.js. 

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Upload your track-out sheet (an Excel file with important questions for founders.)

## Collaborate

Feel free to make pull requests, any contributions are welcome. On the horizon are the following features:

- Algorithm speed up by using parallelism
- Extension to non-Antler founders
- Increased scope with not only founder matching
- Improved questions running right in the browser for ultimate founder pairing



const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const app = express();

const port = process.env.PORT || 3000;

let client;

const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString(
    'utf8',
  ),
);

initializeApp({
  credential: cert(serviceAccount),
});

// --------------------------------------------------
// CORS and body parsing
// --------------------------------------------------
// const allowedOrigins = (process.env.CLIENT_ORIGINS || 'http://localhost:5173')
//   .split(',')
//   .map(origin => origin.trim())
//   .filter(Boolean);

// ============= // app.use() is not a normal JavaScript function—it is an Express function to tells Express: “Use this middleware for every incoming request.”
// app.use(
//   cors({
//     // origin(origin, callback) {
//     //   // Allows Postman and server-to-server requests.
//     //   if (!origin || allowedOrigins.includes(origin)) {
//     //     return callback(null, true);
//     //   }

//     //   return callback(new Error('Origin is not allowed by CORS.'));
//     // },

//     // ============= // These tell CORS which browser requests your backend will allow.
//     // This allows only these request methods:
//     // - GET → read transactions
//     // - POST → create transaction
//     // - PATCH → update transaction
//     // - DELETE → delete transaction
//     methods: ['GET', 'POST', 'PATCH', 'DELETE'],

//     // ============= // It matches your API routes. This allows the frontend to send these request headers: - Content-Type → tells the server the body format, for example JSON:Content-Type: application/json - Authorization → sends the Firebase token:
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   }),
// );

app.use(cors());

app.use(express.json({ limit: '10kb' }));

app.get('/', (req, res) => {
  res.status(200).send({
    message: 'Personal finance management server is running.',
  });
});

// --------------------------------------------------
// Helpers
// --------------------------------------------------
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const asyncHandler = handler => async (req, res, next) => {
  try {
    await handler(req, res, next);
  } catch (error) {
    next(error);
  }
};
const TRANSACTION_TYPES = new Set(['Income', 'Expense']);

const TRANSACTION_CATEGORIES = new Set([
  'salary',
  'freelance',
  'business',
  'transport',
  'investment',
  'bill',
  'rent',
  'food',
  'buy',
  'others',
]);

const parseTransactionDate = value => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [year, month, day] = value.split('-').map(Number);

  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
};

const buildTransactionData = body => {
  const title = body.title?.trim();
  const amount = Number(body.amount);
  const category = body.category;
  const type = body.type;
  const date = parseTransactionDate(body.date);
  const description =
    typeof body.description === 'string' ? body.description.trim() : '';

  if (!title) {
    return { error: 'Title is required.' };
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return { error: 'Amount must be a positive number.' };
  }

  if (!TRANSACTION_CATEGORIES.has(category)) {
    return { error: 'Invalid transaction category.' };
  }

  if (!TRANSACTION_TYPES.has(type)) {
    return { error: 'Invalid transaction type.' };
  }

  if (!date) {
    return { error: 'Invalid transaction date.' };
  }

  return {
    value: {
      title,
      amount,
      category,
      type,
      date,
      description,
    },
  };
};

// --------------------------------------------------
// Firebase token verification
// --------------------------------------------------
const verifyFireBaseToken = async (req, res, next) => {
  const authorization = req.headers.authorization;

  const match = authorization?.match(/^Bearer\s+([^\s]+)$/i)?.[1];

  if (!match) {
    return res.status(401).send({
      message: 'Unauthorized access.',
    });
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(match);

    if (!decodedToken.email) {
      return res.status(401).send({
        message: 'Unauthorized access.',
      });
    }

    req.token_email = decodedToken.email;
    req.token_name = decodedToken.name || '';

    next();
  } catch (error) {
    console.error('Firebase token verification failed:', error.code);

    return res.status(401).send({
      message: 'Unauthorized access.',
    });
  }
};

// --------------------------------------------------
// MongoDB connection
// --------------------------------------------------
async function connectMongoOnce() {
  const uris = [
    process.env.MONGODB_URI_SRV,
    process.env.MONGODB_URI_STANDARD,
  ].filter(Boolean);

  if (uris.length === 0) {
    throw new Error('MongoDB URI is missing from .env.');
  }

  let lastError;

  for (const uri of uris) {
    let temporaryClient;

    try {
      temporaryClient = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,

          strict: true,

          deprecationErrors: true,
        },

        serverSelectionTimeoutMS: 10000,
      });

      await temporaryClient.connect();

      await temporaryClient.db('admin').command({ ping: 1 });

      console.log(
        `MongoDB connected using ${
          uri.startsWith('mongodb+srv') ? 'SRV' : 'Standard'
        } URI.`,
      );

      return temporaryClient;
    } catch (error) {
      lastError = error;

      console.error('MongoDB connection attempt failed:', error.message);

      await temporaryClient?.close().catch(() => {});
    }
  }

  throw lastError || new Error('Could not connect to MongoDB.');
}

// --------------------------------------------------
// Routes
// --------------------------------------------------
function registerRoutes(transactionsCollection) {
  app.get(
    '/transactions',
    verifyFireBaseToken,
    asyncHandler(async (req, res) => {
      const result = await transactionsCollection
        .find({
          email: req.token_email,
        })
        .sort({
          createdAt: -1,
        })
        .toArray();

      res.status(200).send(result);
    }),
  );

  app.post(
    '/transactions',
    verifyFireBaseToken,
    asyncHandler(async (req, res) => {
      const { value: transactionData, error } = buildTransactionData(req.body);

      if (error) {
        return res.status(400).send({
          message: error,
        });
      }

      const safeTransaction = {
        ...transactionData,
        email: req.token_email,
        name: req.body.name,
        // name: req.token_name,
        createdAt: new Date(),
      };

      const result = await transactionsCollection.insertOne(safeTransaction);

      res.status(201).send(result);
    }),
  );

  app.patch(
    '/transactions/:id',
    verifyFireBaseToken,
    asyncHandler(async (req, res) => {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({
          message: 'Invalid transaction ID.',
        });
      }

      const { value: transactionData, error } = buildTransactionData(req.body);

      if (error) {
        return res.status(400).send({
          message: error,
        });
      }

      const result = await transactionsCollection.updateOne(
        {
          _id: new ObjectId(id),
          email: req.token_email,
        },
        {
          $set: {
            ...transactionData,
            updatedAt: new Date(),
          },
        },
      );

      if (result.matchedCount === 0) {
        return res.status(404).send({
          message: 'Transaction not found.',
        });
      }

      res.status(200).send({
        message: 'Transaction updated successfully.',
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      });
    }),
  );

  app.delete(
    '/transactions/bulk',
    verifyFireBaseToken,
    asyncHandler(async (req, res) => {
      const { ids } = req.body;

      // 1. Check whether ids is a valid non-empty array
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).send({
          message: 'Transaction IDs are required.',
        });
      }

      // 2. Check whether every ID is a valid MongoDB ObjectId
      if (!ids.every(id => ObjectId.isValid(id))) {
        return res.status(400).send({
          message: 'One or more transaction IDs are invalid.',
        });
      }

      // 3. Convert string IDs into MongoDB ObjectId
      const objectIds = ids.map(id => new ObjectId(id));

      const result = await transactionsCollection.deleteMany({
        _id: { $in: objectIds },
        email: req.token_email,
      });

      // 5. Send result back to client
      res.status(200).send({
        message: 'Selected transactions deleted successfully.',
        deletedCount: result.deletedCount,
      });
    }),
  );

  app.delete(
    '/transactions/:id',
    verifyFireBaseToken,
    asyncHandler(async (req, res) => {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({
          message: 'Invalid transaction ID.',
        });
      }

      const result = await transactionsCollection.deleteOne({
        _id: new ObjectId(id),
        email: req.token_email,
      });

      if (result.deletedCount === 0) {
        return res.status(404).send({
          message: 'Transaction not found.',
        });
      }

      res.status(200).send({
        message: 'Transaction deleted successfully.',
        deletedCount: result.deletedCount,
      });
    }),
  );
  app.use((error, req, res, next) => {
    console.error('Server error:', error);

    if (res.headersSent) {
      return next(error);
    }

    if (error.message === 'Origin is not allowed by CORS.') {
      return res.status(403).send({
        message: 'This website is not allowed to call the API.',
      });
    }

    if (error.type === 'entity.too.large') {
      return res.status(413).send({
        message: 'Request body is too large.',
      });
    }

    if (error instanceof SyntaxError && error.status === 400) {
      return res.status(400).send({
        message: 'Invalid JSON request body.',
      });
    }

    res.status(500).send({
      message: 'Internal server error.',
    });
  });
}

// --------------------------------------------------
// Server startup
// --------------------------------------------------
async function startServer() {
  // let retryDelay = 5000;

  const INITIAL_RETRY_DELAY = 5000; // 5 seconds
  const MAX_RETRY_DELAY = 60000; // 60 seconds

  let retryDelay = INITIAL_RETRY_DELAY;

  while (!client) {
    try {
      client = await connectMongoOnce();
    } catch (error) {
      console.error(
        `MongoDB unavailable. Retrying in ${retryDelay / 1000} seconds.`,
      );

      await wait(retryDelay);

      retryDelay = Math.min(retryDelay * 2, MAX_RETRY_DELAY);
    }
  }

  // ===============
  const db = client.db('personal_fm');
  const transactionsCollection = db.collection('transactions');

  await transactionsCollection.createIndex({
    // ascending order
    email: 1,
    // descending order
    createdAt: -1,
  });

  registerRoutes(transactionsCollection);

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

startServer().catch(error => {
  console.error('Server startup failed:', error);

  process.exit(1);
});

// --------------------------------------------------
// Graceful shutdown
// --------------------------------------------------
const shutdown = async () => {
  console.log('Closing server...');

  await client?.close().catch(() => {});

  process.exit(0);
};

process.on('SIGINT', shutdown);

process.on('SIGTERM', shutdown);

module.exports = app;

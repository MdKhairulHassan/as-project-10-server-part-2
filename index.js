// ================================================================== for test the server for vercel deployment.
// const express = require('express');

// const app = express();

// app.get('/', (req, res) => {
//   res.status(200).json({
//     message: 'FinEase server is working!',
//   });
// });

// module.exports = app;

// ================================================================== main server with Vercel-compatible
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const { initializeApp, cert, getApps } = require('firebase-admin/app');

const { getAuth } = require('firebase-admin/auth');

const app = express();

const port = process.env.PORT || 3000;

// ==================================================
// CORS
// ==================================================

const allowedOrigins = (process.env.CLIENT_ORIGINS || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without an Origin header
      // such as Postman or server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      // If CLIENT_ORIGINS is not configured,
      // allow all origins just like your current setup.
      if (allowedOrigins.length === 0) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Origin is not allowed by CORS.'));
    },

    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],

    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// ==================================================
// BODY PARSER
// ==================================================

app.use(
  express.json({
    limit: '10kb',
  }),
);

// ==================================================
// HELPERS
// ==================================================

const asyncHandler = handler => async (req, res, next) => {
  try {
    await handler(req, res, next);
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// Transaction types
// --------------------------------------------------

const TRANSACTION_TYPES = new Set(['Income', 'Expense']);

// --------------------------------------------------
// Transaction categories
// --------------------------------------------------

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

// ==================================================
// DATE VALIDATION
// ==================================================

const parseTransactionDate = value => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [year, month, day] = value.split('-').map(Number);

  const date = new Date(Date.UTC(year, month - 1, day));

  // Reject impossible dates such as:
  // 2026-02-30
  // 2026-04-31
  // 2026-13-01
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
};

// ==================================================
// TRANSACTION VALIDATION
// ==================================================

const buildTransactionData = body => {
  const title = typeof body.title === 'string' ? body.title.trim() : '';

  const amount = Number(body.amount);

  const category = body.category;

  const type = body.type;

  const date = parseTransactionDate(body.date);

  const description =
    typeof body.description === 'string' ? body.description.trim() : '';

  // ------------------------------------------------
  // Title
  // ------------------------------------------------

  if (!title) {
    return {
      error: 'Title is required.',
    };
  }

  // ------------------------------------------------
  // Amount
  // ------------------------------------------------

  if (!Number.isFinite(amount) || amount <= 0) {
    return {
      error: 'Amount must be a positive number.',
    };
  }

  // ------------------------------------------------
  // Category
  // ------------------------------------------------

  if (!TRANSACTION_CATEGORIES.has(category)) {
    return {
      error: 'Invalid transaction category.',
    };
  }

  // ------------------------------------------------
  // Type
  // ------------------------------------------------

  if (!TRANSACTION_TYPES.has(type)) {
    return {
      error: 'Invalid transaction type.',
    };
  }

  // ------------------------------------------------
  // Date
  // ------------------------------------------------

  if (!date) {
    return {
      error: 'Invalid transaction date.',
    };
  }

  // ------------------------------------------------
  // Valid data
  // ------------------------------------------------

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

// ==================================================
// FIREBASE ADMIN
// ==================================================

let firebaseAuth = null;

const getFirebaseAuth = () => {
  // Reuse already initialized Firebase Auth.
  if (firebaseAuth) {
    return firebaseAuth;
  }

  const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

  if (!base64) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 is missing.');
  }

  let serviceAccount;

  try {
    serviceAccount = JSON.parse(Buffer.from(base64, 'base64').toString('utf8'));
  } catch (error) {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT_BASE64 is not valid Base64 JSON.',
    );
  }

  // Prevent Firebase from being initialized twice
  // in the same running instance.
  if (getApps().length === 0) {
    initializeApp({
      credential: cert(serviceAccount),
    });
  }

  firebaseAuth = getAuth();

  return firebaseAuth;
};

// ==================================================
// FIREBASE TOKEN VERIFICATION
// ==================================================

const verifyFireBaseToken = async (req, res, next) => {
  const authorization = req.headers.authorization;

  const match = authorization?.match(/^Bearer\s+([^\s]+)$/i)?.[1];

  // ------------------------------------------------
  // Missing token
  // ------------------------------------------------

  if (!match) {
    return res.status(401).send({
      message: 'Unauthorized access.',
    });
  }

  try {
    const decodedToken = await getFirebaseAuth().verifyIdToken(match);

    // ------------------------------------------------
    // Email is required
    // ------------------------------------------------

    if (!decodedToken.email) {
      return res.status(401).send({
        message: 'Unauthorized access.',
      });
    }

    // ------------------------------------------------
    // Store verified information on request
    // ------------------------------------------------

    req.token_email = decodedToken.email;

    req.token_name = decodedToken.name || '';

    next();
  } catch (error) {
    console.error('Firebase token verification failed:', error.message);

    return res.status(401).send({
      message: 'Unauthorized access.',
    });
  }
};

// ==================================================
// MONGODB
// ==================================================

// Cached MongoDB client.
//
// Important:
// We do NOT create a new MongoClient for every request.
// The same client can be reused across requests/invocations
// while the Vercel instance remains warm.

let client = null;

// Promise used to initialize the collection only once
// for the current running instance.
let transactionsCollectionPromise = null;

// ==================================================
// CONNECT TO MONGODB
// ==================================================

async function connectMongoOnce() {
  const uris = [
    process.env.MONGODB_URI_SRV,
    process.env.MONGODB_URI_STANDARD,
  ].filter(Boolean);

  if (uris.length === 0) {
    throw new Error('MongoDB URI is missing.');
  }

  let lastError;

  // Try SRV first, then Standard if configured.
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

        // Keep the pool reasonable for a serverless app.
        maxPoolSize: 10,

        minPoolSize: 0,
      });

      await temporaryClient.connect();

      // Verify the connection.
      await temporaryClient.db('admin').command({
        ping: 1,
      });

      console.log(
        `MongoDB connected using ${
          uri.startsWith('mongodb+srv') ? 'SRV' : 'Standard'
        } URI.`,
      );

      return temporaryClient;
    } catch (error) {
      lastError = error;

      console.error('MongoDB connection attempt failed:', error.message);

      // Close a failed temporary client.
      await temporaryClient?.close().catch(() => {});
    }
  }

  throw lastError || new Error('Could not connect to MongoDB.');
}

// ==================================================
// GET TRANSACTIONS COLLECTION
// ==================================================

const getTransactionsCollection = async () => {
  // Reuse the existing initialization promise.
  if (transactionsCollectionPromise) {
    return transactionsCollectionPromise;
  }

  transactionsCollectionPromise = (async () => {
    // Create/connect MongoClient only when a
    // database request actually needs it.
    if (!client) {
      client = await connectMongoOnce();
    }

    const db = client.db('personal_fm');

    const collection = db.collection('transactions');

    // This is safe to call repeatedly.
    // MongoDB will keep the same index instead
    // of creating duplicate indexes.
    await collection.createIndex({
      email: 1,
      createdAt: -1,
    });

    return collection;
  })().catch(error => {
    // Allow another request to retry initialization
    // if the first initialization failed.
    transactionsCollectionPromise = null;

    throw error;
  });

  return transactionsCollectionPromise;
};

// ==================================================
// ROOT ROUTE
// ==================================================

app.get('/', (req, res) => {
  res.status(200).send({
    message: 'Personal finance management server is running.',
  });
});

// ==================================================
// HEALTH ROUTE
// ==================================================

app.get('/health', (req, res) => {
  res.status(200).send({
    status: 'ok',
  });
});

// ==================================================
// GET ALL TRANSACTIONS
// ==================================================

app.get(
  '/transactions',
  verifyFireBaseToken,

  asyncHandler(async (req, res) => {
    const transactionsCollection = await getTransactionsCollection();

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

// ==================================================
// ADD TRANSACTION
// ==================================================

app.post(
  '/transactions',
  verifyFireBaseToken,

  asyncHandler(async (req, res) => {
    const transactionsCollection = await getTransactionsCollection();

    const { value: transactionData, error } = buildTransactionData(req.body);

    if (error) {
      return res.status(400).send({
        message: error,
      });
    }

    // Keep your existing frontend name support.
    const bodyName =
      typeof req.body.name === 'string' ? req.body.name.trim() : '';

    const safeTransaction = {
      ...transactionData,

      // IMPORTANT:
      // Never trust email coming from req.body.
      // Use the verified Firebase email.
      email: req.token_email,

      // Prefer the verified Firebase display name.
      name: req.token_name || bodyName,

      createdAt: new Date(),
    };

    const result = await transactionsCollection.insertOne(safeTransaction);

    res.status(201).send({
      message: 'Transaction added successfully.',

      insertedId: result.insertedId,
    });
  }),
);

// ==================================================
// UPDATE TRANSACTION
// ==================================================

app.patch(
  '/transactions/:id',
  verifyFireBaseToken,

  asyncHandler(async (req, res) => {
    const transactionsCollection = await getTransactionsCollection();

    const { id } = req.params;

    // ------------------------------------------------
    // Validate ObjectId
    // ------------------------------------------------

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({
        message: 'Invalid transaction ID.',
      });
    }

    // ------------------------------------------------
    // Validate transaction data
    // ------------------------------------------------

    const { value: transactionData, error } = buildTransactionData(req.body);

    if (error) {
      return res.status(400).send({
        message: error,
      });
    }

    const objectId = new ObjectId(id);

    // ------------------------------------------------
    // Update only the authenticated user's document
    // ------------------------------------------------

    const result = await transactionsCollection.updateOne(
      {
        _id: objectId,

        // Ownership protection
        email: req.token_email,
      },

      {
        $set: {
          ...transactionData,
          updatedAt: new Date(),
        },
      },
    );

    // ------------------------------------------------
    // Not found / not owned
    // ------------------------------------------------

    if (result.matchedCount === 0) {
      return res.status(404).send({
        message: 'Transaction not found.',
      });
    }

    // ------------------------------------------------
    // Return updated transaction
    // ------------------------------------------------

    const updatedTransaction = await transactionsCollection.findOne({
      _id: objectId,
      email: req.token_email,
    });

    res.status(200).send({
      message: 'Transaction updated successfully.',

      matchedCount: result.matchedCount,

      modifiedCount: result.modifiedCount,

      transaction: updatedTransaction,
    });
  }),
);

// ==================================================
// BULK DELETE
// IMPORTANT:
// This route MUST be before /transactions/:id
// ==================================================

app.delete(
  '/transactions/bulk',
  verifyFireBaseToken,

  asyncHandler(async (req, res) => {
    const transactionsCollection = await getTransactionsCollection();

    const { ids } = req.body;

    // ------------------------------------------------
    // Check array
    // ------------------------------------------------

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).send({
        message: 'Transaction IDs are required.',
      });
    }

    // ------------------------------------------------
    // Validate every ObjectId
    // ------------------------------------------------

    if (!ids.every(id => ObjectId.isValid(id))) {
      return res.status(400).send({
        message: 'One or more transaction IDs are invalid.',
      });
    }

    // ------------------------------------------------
    // Convert strings to ObjectIds
    // ------------------------------------------------

    const objectIds = ids.map(id => new ObjectId(id));

    // ------------------------------------------------
    // Delete ONLY user's transactions
    // ------------------------------------------------

    const result = await transactionsCollection.deleteMany({
      _id: {
        $in: objectIds,
      },

      email: req.token_email,
    });

    res.status(200).send({
      message: 'Selected transactions deleted successfully.',

      deletedCount: result.deletedCount,
    });
  }),
);

// ==================================================
// DELETE ONE TRANSACTION
// ==================================================

app.delete(
  '/transactions/:id',
  verifyFireBaseToken,

  asyncHandler(async (req, res) => {
    const transactionsCollection = await getTransactionsCollection();

    const { id } = req.params;

    // ------------------------------------------------
    // Validate ObjectId
    // ------------------------------------------------

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({
        message: 'Invalid transaction ID.',
      });
    }

    // ------------------------------------------------
    // Delete ONLY authenticated user's document
    // ------------------------------------------------

    const result = await transactionsCollection.deleteOne({
      _id: new ObjectId(id),

      email: req.token_email,
    });

    // ------------------------------------------------
    // Not found
    // ------------------------------------------------

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

// ==================================================
// ERROR HANDLER
// ==================================================

app.use((error, req, res, next) => {
  console.error('Server error:', error);

  if (res.headersSent) {
    return next(error);
  }

  // ------------------------------------------------
  // CORS error
  // ------------------------------------------------

  if (error.message === 'Origin is not allowed by CORS.') {
    return res.status(403).send({
      message: 'This website is not allowed to call the API.',
    });
  }

  // ------------------------------------------------
  // Request body too large
  // ------------------------------------------------

  if (error.type === 'entity.too.large') {
    return res.status(413).send({
      message: 'Request body is too large.',
    });
  }

  // ------------------------------------------------
  // Invalid JSON
  // ------------------------------------------------

  if (error instanceof SyntaxError && error.status === 400) {
    return res.status(400).send({
      message: 'Invalid JSON request body.',
    });
  }

  // ------------------------------------------------
  // MongoDB unavailable
  // ------------------------------------------------

  if (
    error.name === 'MongoServerSelectionError' ||
    error.name === 'MongoNetworkError' ||
    error.name === 'MongoTopologyClosedError'
  ) {
    return res.status(503).send({
      message: 'Database service is temporarily unavailable.',
    });
  }

  // ------------------------------------------------
  // Unknown server error
  // ------------------------------------------------

  return res.status(500).send({
    message: 'Internal server error.',
  });
});

// ==================================================
// LOCAL DEVELOPMENT
// ==================================================
//
// Vercel imports `app`, so Vercel does NOT need
// app.listen().
//
// But when you run:
//
//     npm start
//
// Node executes this file directly and this block
// starts your local Express server.
//

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

// ==================================================
// EXPORT EXPRESS APP
// ==================================================
//
// Vercel uses this exported app.
//

module.exports = app;

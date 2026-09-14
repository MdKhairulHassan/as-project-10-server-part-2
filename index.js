// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();

// // for JWT token
// // const jwt = require('jsonwebtoken');
// // const token = jwt.sign({ foo: 'bar' }, 'shhhhh');

// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// const { initializeApp, cert } = require('firebase-admin/app');
// const { getAuth } = require('firebase-admin/auth');

// const app = express();
// const port = process.env.PORT || 3000;

// // console.log(process.env);

// // ===================================================================================
// // for firebase-admin old version:
// // const admin = require('firebase-admin');
// // const serviceAccount = require('./finease-finance-management-firebase-admin-key.json');
// // admin.initializeApp({
// //   credential: admin.credential.cert(serviceAccount),
// // });

// // ===================================================================================
// const serviceAccount = require('./finease-finance-management-firebase-admin-key.json');

// initializeApp({
//   credential: cert(serviceAccount),
// });

// // ===================================================================================
// // middleware use in everywhere
// app.use(cors());

// // =========
// // app.use(express.json());
// app.use(express.json({ limit: '10kb' }));

// // ===================================================================================
// // middleware use in only a specific function
// // const logger = (req, res, next) => {
// //   console.log('logging information');
// //   next();
// // };

// // ===================================================================================
// // for firebase-admin old version:
// // const verifyFireBaseToken = async (req, res, next) => {
// //   console.log('in the verify middleware', req.headers.authorization);
// //   if (!req.headers.authorization) {
// //     // do not allow to go
// //     return res.status(401).send({ message: 'unauthorized access' });
// //   }
// //   const token = req.headers.authorization.split(' ')[1];
// //   if (!token) {
// //     return res.status(401).send({ message: 'unauthorized access' });
// //   }

// //   try {
// //     const userInfo = await admin.auth().verifyIdToken(token);
// //     console.log('after token validation', userInfo);
// //     // verify token
// //     next();
// //   } catch {
// //     return res.status(401).send({ message: 'unauthorized access' });
// //   }
// //   // next();
// // };

// // ===================================================================================
// // console.log('service', serviceAccount);
// // console.log('admin', admin);
// // console.log('admin credential', admin.credential);

// // ===================================================================================
// // for firebase admin version 14
// const verifyFireBaseToken = async (req, res, next) => {
//   // console.log('in the verify middleware', req.headers.authorization);

//   const authorization = req.headers.authorization;

//   // ========================================== not better for checking ----- 'Bearer ' and token. But about security I have no idea.
//   if (!authorization) {
//     return res.status(401).send({
//       message: 'Unauthorized access',
//     });
//   }

//   // const token = authorization.slice(7).trim();

//   // ========================================== better for checking ----- 'Bearer ' and token. But about security I have no idea.
//   if (!authorization?.startsWith('Bearer ')) {
//     return res.status(401).send({
//       message: 'Unauthorized access',
//     });
//   }

//   const token = authorization.split(' ')[1];

//   // ==========================================
//   if (!token) {
//     return res.status(401).send({ message: 'unauthorized access' });
//   }

//   try {
//     const decoded = await getAuth().verifyIdToken(token);

//     if (!decoded.email) {
//       return res.status(401).send({
//         // message: 'Authenticated user has no email',
//         message: 'Unauthorized access',
//       });
//     }

//     req.token_email = decoded.email;
//     // console.log('after token validation', decoded);

//     next();
//   } catch (err) {
//     console.log('invalid token');
//     return res.status(401).send({
//       message: 'Unauthorized access',
//     });
//   }
// };

// // ===================================================================================
// // const verifyJWTToken = async (req, res, next) => {
// //   // console.log('in the JWT verify middleware', req.headers);
// //   if (!req.headers.authorization) {
// //     return res.status(401).send({
// //       message: 'Unauthorized access',
// //     });
// //   }

// //   const token = req.headers.authorization.split(' ')[1];

// //   if (!token) {
// //     return res.status(401).send({ message: 'unauthorized access' });
// //   }

// //   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
// //     if (err) {
// //       return res.status(401).send({ message: 'unauthorized access' });
// //     }
// //     console.log('after decoded', decoded);
// //     req.token_email = decoded.email;
// //     next();
// //   });
// // };

// // ===================================================================================
// // already created in old project name and password:
// // personalfmUser
// // RvYrAGqMqWo0cIGb;

// // const uri =
// //   'mongodb+srv://personalfmUser:RvYrAGqMqWo0cIGb@cluster0.1daujou.mongodb.net/?appName=Cluster0';

// // ===================================================================================
// // const uri = `mongodb+srv://${process.env.PFM_USER}:${process.env.PFM_PASS}@cluster0.if3njeq.mongodb.net/?appName=Cluster0`;

// // const uri = `mongodb://${process.env.PFM_USER}:${process.env.PFM_PASS}@ac-uxcxunb-shard-00-00.if3njeq.mongodb.net:27017,ac-uxcxunb-shard-00-01.if3njeq.mongodb.net:27017,ac-uxcxunb-shard-00-02.if3njeq.mongodb.net:27017/?tls=true&replicaSet=atlas-7xhikn-shard-0&authSource=admin&appName=Cluster0`;

// // const uri = process.env.MONGODB_URI;

// // ================================
// // console.log('server uri:', uri);

// // const client = new MongoClient(uri, {
// //   serverApi: {
// //     version: ServerApiVersion.v1,
// //     strict: true,
// //     deprecationErrors: true,
// //   },
// // });

// // ===================================================================================
// // let client;

// // async function connectMongo() {
// //   const uris = [process.env.MONGODB_URI_SRV, process.env.MONGODB_URI_STANDARD];

// //   for (const uri of uris) {
// //     try {
// //       const tempClient = new MongoClient(uri, {
// //         serverApi: {
// //           version: ServerApiVersion.v1,
// //           strict: true,
// //           deprecationErrors: true,
// //         },
// //       });

// //       await tempClient.connect();

// //       console.log(
// //         `Connected using ${uri.startsWith('mongodb+srv') ? 'SRV' : 'Standard'} URI`,
// //       );

// //       client = tempClient;
// //       return;
// //     } catch (err) {
// //       console.log(
// //         `Failed using ${uri.startsWith('mongodb+srv') ? 'SRV' : 'Standard'} URI`,
// //       );
// //       console.log(err.code || err.message);
// //     }
// //   }

// //   throw new Error('Could not connect to MongoDB.');
// // }

// // ======================================================== It can create zombie client and connection pool it's very dangerous to use in a server like this.

// let client;

// async function connectMongo() {
//   const uris = [process.env.MONGODB_URI_SRV, process.env.MONGODB_URI_STANDARD];

//   while (true) {
//     console.log('If both url fail then retry after 1 Day later');

//     for (const uri of uris) {
//       try {
//         const tempClient = new MongoClient(uri, {
//           serverApi: {
//             version: ServerApiVersion.v1,
//             strict: true,
//             deprecationErrors: true,
//           },
//         });

//         await tempClient.connect();

//         console.log(
//           `Connected using ${
//             uri.startsWith('mongodb+srv') ? 'SRV' : 'Standard'
//           } URI`,
//         );

//         client = tempClient;

//         return;
//       } catch (err) {
//         console.log(
//           `Failed using ${
//             uri.startsWith('mongodb+srv') ? 'SRV' : 'Standard'
//           } URI`,
//         );

//         console.log(err.code || err.message);
//       }
//     }

//     console.log('Both MongoDB URIs failed. Retrying in 1 Day...');

//     await new Promise(resolve => {
//       // setTimeout(resolve, 24 * 60 * 60 * 1000);
//       setTimeout(resolve, 2 * 60 * 1000);
//     });
//   }
// }

// // ===================================================================================
// app.get('/', (req, res) => {
//   res.send('personal finance management Server is running');
// });

// async function run() {
//   try {
//     // =====================
//     // await client.connect();

//     // =====================
//     await connectMongo();

//     // =====================
//     const db = client.db('personal_fm');
//     const transactionsCollection = db.collection('transactions');
//     // const usersCollection = db.collection('users');
//     // const balanceCollection = db.collection('balanceOverview');

//     // =====================
//     // // JWT related APIs
//     // app.post('/getToken', (req, res) => {
//     //   const loggedUser = req.body;
//     //   // const token = jwt.sign({ email: 'abc' },
//     //   const token = jwt.sign(loggedUser, process.env.JWT_SECRET, {
//     //     expiresIn: '1h',
//     //   });
//     //   res.send({ token: token });
//     // });

//     // =====================
//     // BALANCE APIs
//     // app.get('/balance', async (req, res) => {
//     //   // const projectField = { _id: 0, title: 1, amount: 1 };
//     //   // const cursor = balanceCollection
//     //   //   .find()
//     //   //   .sort({ amount: -1 })
//     //   //   .skip(2)
//     //   //   .limit(2)
//     //   //   .project(projectField);

//     //   console.log(req.query);
//     //   const email = req.query.email;
//     //   const query = {};
//     //   if (email) {
//     //     query.email = email;
//     //   }

//     //   const cursor = balanceCollection.find(query).limit(3);
//     //   const result = await cursor.toArray();
//     //   res.send(result);
//     // });

//     // app.get('/latest-balance', async (req, res) => {
//     //   const cursor = balanceCollection.find().sort({ amount: 1 });
//     //   const result = await cursor.toArray();
//     //   res.send(result);

//     //   // =========================================
//     //   // const email = req.query.email;
//     //   // const query = {};
//     //   // if (email) {
//     //   //   query.email = email;
//     //   // }
//     //   // const cursor = balanceCollection.find(query);
//     //   // const result = await cursor.toArray();
//     //   // res.send(result);
//     // });

//     // app.get('/balance/:id', async (req, res) => {
//     //   const id = req.params.id;
//     //   const query = { _id: new ObjectId(id) };
//     //   const result = await balanceCollection.findOne(query);
//     //   res.send(result);
//     // });

//     // app.post('/balance', async (req, res) => {
//     //   const newBalance = req.body;
//     //   const result = await balanceCollection.insertOne(newBalance);
//     //   res.send(result);
//     // });

//     // app.patch('/balance/:id', async (req, res) => {
//     //   const id = req.params.id;
//     //   const updatedBalance = req.body;
//     //   const query = { _id: new ObjectId(id) };
//     //   const update = {
//     //     // $set: updatedBalance,
//     //     $set: {
//     //       name: updatedBalance.name,
//     //       amount: updatedBalance.amount,
//     //     },
//     //   };
//     //   const result = await balanceCollection.updateOne(query, update);
//     //   res.send(result);
//     // });

//     // app.delete('/balance/:id', async (req, res) => {
//     //   const id = req.params.id;
//     //   const query = { _id: new ObjectId(id) };
//     //   const result = await balanceCollection.deleteOne(query);
//     //   res.send(result);
//     // });

//     // =====================
//     // USERS APIs
//     // app.post('/users', async (req, res) => {
//     //   const newUser = req.body;
//     //   const email = req.body.email;
//     //   const query = { email: email };
//     //   const existingUser = await usersCollection.findOne(query);
//     //   if (existingUser) {
//     //     res.send({
//     //       message: 'user already exit. do not need to insert him again',
//     //     });
//     //   } else {
//     //     const result = await usersCollection.insertOne(newUser);
//     //     res.send(result);
//     //   }
//     // });

//     // ===================================================================================
//     // transaction related apis
//     // app.get('/transactions', verifyJWTToken, async (req, res) => {
//     //   // console.log('headers', req.headers);
//     //   const email = req.query.email;
//     //   const query = {};
//     //   if (email) {
//     //     if (email !== req.token_email) {
//     //       return res.status(403).send({ message: 'forbidden access' });
//     //     }
//     //     query.email = email;
//     //   }
//     //   const cursor = transactionsCollection.find(query).sort({ createdAt: -1 });
//     //   const result = await cursor.toArray();
//     //   res.send(result);
//     // });

//     // ===================================================================================
//     // // transaction related apis
//     // app.get('/transactions', verifyFireBaseToken, async (req, res) => {
//     //   // console.log('headers', req);
//     //   const email = req.query.email;
//     //   const query = {};
//     //   if (email) {
//     //     if (email !== req.token_email) {
//     //       return res.status(403).send({ message: 'forbidden access' });
//     //     }
//     //     query.email = email;
//     //   }
//     //   const cursor = transactionsCollection.find(query).sort({ createdAt: -1 });
//     //   const result = await cursor.toArray();
//     //   res.send(result);
//     // });

//     // =======================================
//     app.get('/transactions', verifyFireBaseToken, async (req, res, next) => {
//       try {
//         const email = req.query.email;

//         if (email && email !== req.token_email) {
//           return res.status(403).send({
//             message:
//               'Forbidden Access. email does not match the signed-in user.',
//           });
//         }
//         if (!email) {
//           return res.status(403).send({
//             message:
//               'Forbidden Access: email does not existing with the signed-in user.',
//           });
//         }

//         const result = await transactionsCollection
//           .find({
//             email: req.token_email,
//           })
//           .sort({
//             createdAt: -1,
//           })
//           .toArray();

//         res.status(200).send(result);
//       } catch (error) {
//         next(error);
//       }
//     });

//     // ===================================================================================
//     // app.post('/transactions', async (req, res) => {
//     //   const newTransaction = req.body;
//     //   const result = await transactionsCollection.insertOne(newTransaction);
//     //   res.send(result);
//     // });

//     // =================================
//     // app.post('/transactions', verifyFireBaseToken, async (req, res) => {
//     //   const transaction = req.body;

//     //   // // Convert string into real MongoDB Date
//     //   // transaction.date = new Date(transaction.date);

//     //   // transaction.createdAt = new Date();

//     //   // console.log('headers in the post', req.headers);

//     //   const email = transaction.email;

//     //   if (email && email !== req.token_email) {
//     //     return res.status(403).send({
//     //       message: 'Forbidden: email does not match the signed-in user.',
//     //     });
//     //   }

//     //   const safeTransaction = {
//     //     ...transaction,
//     //     email: req.token_email,
//     //     date: new Date(transaction.date),
//     //     createdAt: new Date(),
//     //   };

//     //   const result = await transactionsCollection.insertOne(safeTransaction);
//     //   // res.send(result);
//     //   res.status(201).send(result);
//     // });

//     // =====================================
//     app.post('/transactions', verifyFireBaseToken, async (req, res, next) => {
//       try {
//         const {
//           title,
//           amount,
//           category,
//           type,
//           date,
//           description,
//           name,
//           email,
//         } = req.body;

//         if (email && email !== req.token_email) {
//           return res.status(403).send({
//             message:
//               'Forbidden Access. email does not match the signed-in user.',
//           });
//         }
//         if (!email) {
//           return res.status(403).send({
//             message:
//               'Forbidden Access: email does not existing with the signed-in user.',
//           });
//         }

//         const numericAmount = Number(amount);
//         const transactionDate = new Date(date);

//         if (
//           !title?.trim() ||
//           !Number.isFinite(numericAmount) ||
//           numericAmount <= 0 ||
//           Number.isNaN(transactionDate.getTime())
//         ) {
//           return res.status(400).send({
//             message: 'Please provide a valid title, positive amount, and date.',
//           });
//         }

//         const safeTransaction = {
//           title: title.trim(),
//           amount: numericAmount,
//           category,
//           type,
//           date: transactionDate,
//           description: description?.trim() || '',
//           name,
//           email: req.token_email,
//           createdAt: new Date(),
//         };

//         const result = await transactionsCollection.insertOne(safeTransaction);

//         res.status(201).send(result);
//       } catch (error) {
//         next(error);
//       }
//     });

//     // ===================================================================================
//     // app.patch('/transactions/:id', verifyFireBaseToken, async (req, res) => {
//     //   const id = req.params.id;

//     //   const updated = req.body;

//     //   const query = {
//     //     _id: new ObjectId(id),
//     //   };

//     //   const update = {
//     //     $set: updated,
//     //   };

//     //   const result = await transactionsCollection.updateOne(
//     //     query,

//     //     update,
//     //   );

//     //   res.send(result);
//     // });

//     // ===================
//     // app.patch('/transactions/:id', verifyFireBaseToken, async (req, res) => {
//     //   const id = req.params.id;

//     //   const email = req.body.email;

//     //   if (email && email !== req.token_email) {
//     //     return res.status(403).send({
//     //       message: 'Forbidden Access. email does not match the signed-in user.',
//     //     });
//     //   }
//     //   if (!email) {
//     //     return res.status(403).send({
//     //       message:
//     //         'Forbidden Access: email does not existing with the signed-in user.',
//     //     });
//     //   }

//     //   if (!ObjectId.isValid(id)) {
//     //     return res.status(400).send({
//     //       message: 'Invalid transaction ID.',
//     //     });
//     //   }

//     //   const updateData = {
//     //     title: req.body.title,
//     //     amount: Number(req.body.amount),
//     //     category: req.body.category,
//     //     type: req.body.type,
//     //     date: new Date(req.body.date),
//     //     description: req.body.description,
//     //     updatedAt: new Date(),
//     //   };

//     //   const result = await transactionsCollection.updateOne(
//     //     {
//     //       _id: new ObjectId(id),
//     //       email: req.token_email,
//     //     },
//     //     {
//     //       $set: updateData,
//     //     },
//     //   );

//     //   if (result.matchedCount === 0) {
//     //     return res.status(404).send({
//     //       message: 'Transaction not found or you do not have permission.',
//     //     });
//     //   }

//     //   res.status(200).send(result);
//     // });

//     // ===================
//     const TRANSACTION_TYPES = new Set(['Income', 'Expense']);

//     const TRANSACTION_CATEGORIES = new Set([
//       'salary',
//       'freelance',
//       'business',
//       'transport',
//       'investment',
//       'bill',
//       'rent',
//       'food',
//       'buy',
//       'others',
//     ]);

//     const buildTransactionUpdate = body => {
//       const title = body.title?.trim();
//       const amount = Number(body.amount);
//       const category = body.category;
//       const type = body.type;
//       const date = new Date(body.date);
//       const description = body.description?.trim() || '';

//       if (!title) {
//         return { error: 'Title is required.' };
//       }

//       if (!Number.isFinite(amount) || amount <= 0) {
//         return { error: 'Amount must be a positive number.' };
//       }

//       if (!TRANSACTION_CATEGORIES.has(category)) {
//         return { error: 'Invalid transaction category.' };
//       }

//       if (!TRANSACTION_TYPES.has(type)) {
//         return { error: 'Invalid transaction type.' };
//       }

//       if (Number.isNaN(date.getTime())) {
//         return { error: 'Invalid transaction date.' };
//       }

//       return {
//         value: {
//           title,
//           amount,
//           category,
//           type,
//           date,
//           description,
//           updatedAt: new Date(),
//         },
//       };
//     };

//     app.patch('/transactions/:id', verifyFireBaseToken, async (req, res) => {
//       try {
//         const { id } = req.params;

//         const email = req.body.email;

//         if (email && email !== req.token_email) {
//           return res.status(403).send({
//             message:
//               'Forbidden Access. email does not match the signed-in user.',
//           });
//         }
//         if (!email) {
//           return res.status(403).send({
//             message:
//               'Forbidden Access: email does not existing with the signed-in user.',
//           });
//         }

//         if (!ObjectId.isValid(id)) {
//           return res.status(400).send({
//             message: 'Invalid transaction ID.',
//           });
//         }

//         const { value: updateData, error } = buildTransactionUpdate(req.body);

//         if (error) {
//           return res.status(400).send({
//             message: error,
//           });
//         }

//         const result = await transactionsCollection.updateOne(
//           {
//             _id: new ObjectId(id),
//             email: req.token_email,
//           },
//           {
//             $set: updateData,
//           },
//         );

//         if (result.matchedCount === 0) {
//           return res.status(404).send({
//             message: 'Transaction not found.',
//           });
//         }

//         res.status(200).send({
//           message: 'Transaction updated successfully.',
//           matchedCount: result.matchedCount,
//           modifiedCount: result.modifiedCount,
//         });
//       } catch (error) {
//         console.error('PATCH /transactions/:id failed:', error);

//         res.status(500).send({
//           message: 'Could not update the transaction.',
//         });
//       }
//     });

//     // ===================================================================================
//     // app.delete('/transactions/:id', async (req, res) => {
//     //   const id = req.params.id;

//     //   const result = await transactionsCollection.deleteOne({
//     //     _id: new ObjectId(id),
//     //   });

//     //   res.send(result);
//     // });

//     // ========================
//     // app.delete('/transactions/:id', verifyFireBaseToken, async (req, res) => {
//     //   const id = req.params.id;

//     //   if (!ObjectId.isValid(id)) {
//     //     return res.status(400).send({
//     //       message: 'Invalid transaction ID.',
//     //     });
//     //   }

//     //   const result = await transactionsCollection.deleteOne({
//     //     _id: new ObjectId(id),
//     //     email: req.token_email,
//     //   });

//     //   if (result.deletedCount === 0) {
//     //     return res.status(404).send({
//     //       message: 'Transaction not found or you do not have permission.',
//     //     });
//     //   }

//     //   res.status(200).send(result);
//     // });

//     // ========================
//     app.delete('/transactions/:id', verifyFireBaseToken, async (req, res) => {
//       try {
//         const { id } = req.params;

//         if (!ObjectId.isValid(id)) {
//           return res.status(400).send({
//             message: 'Invalid transaction ID.',
//           });
//         }

//         const result = await transactionsCollection.deleteOne({
//           _id: new ObjectId(id),
//           email: req.token_email,
//         });

//         if (result.deletedCount === 0) {
//           return res.status(404).send({
//             message: 'Transaction not found.',
//           });
//         }

//         res.status(200).send({
//           message: 'Transaction deleted successfully.',
//           deletedCount: result.deletedCount,
//         });
//       } catch (error) {
//         console.error('DELETE /transactions/:id failed:', error);

//         res.status(500).send({
//           message: 'Could not delete the transaction.',
//         });
//       }
//     });

//     // ===================================================================================
//     // Global error handler — KEEP THIS NEAR THE END
//     app.use((err, req, res, next) => {
//       console.error(err);

//       if (err.type === 'entity.too.large') {
//         return res.status(413).send({
//           message: 'Request body is too large.',
//         });
//       }

//       if (err instanceof SyntaxError && err.status === 400) {
//         return res.status(400).send({
//           message: 'Invalid JSON.',
//         });
//       }

//       res.status(500).send({
//         message: 'Internal server error.',
//       });
//     });

//     // ===================================================================================
//     await client.db('admin').command({ ping: 1 });
//     console.log(
//       'Pinged your deployment. You successfully connected to MongoDB!',
//     );
//   } finally {
//   }
// }

// run().catch(console.dir);

// app.listen(port, () => {
//   console.log(`personal finance management server is running on port: ${port}`);
// });

// // ============================================================================================================================
// // client
// //   .connect()
// //   .then(() => {
// //     app.listen(port, () => {
// //       console.log(
// //         `personal finance management server is running now on port: ${port}`,
// //       );
// //     });
// //   })
// //   .catch(console.dir);

// // ============================================================================================================================ // //
// ================================================================== for test the server for vercel deployment.
// const express = require('express');

// const app = express();

// app.get('/', (req, res) => {
//   res.status(200).json({
//     message: 'FinEase server is working!',
//   });
// });

// module.exports = app;

// ================================================================== server with Vercel-compatible
// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();

// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// const { initializeApp, cert, getApps } = require('firebase-admin/app');

// const { getAuth } = require('firebase-admin/auth');

// const app = express();

// const port = process.env.PORT || 3000;

// // ==================================================
// // CORS
// // ==================================================

// const allowedOrigins = (process.env.CLIENT_ORIGINS || '')
//   .split(',')
//   .map(origin => origin.trim())
//   .filter(Boolean);

// app.use(
//   cors({
//     origin(origin, callback) {
//       // Allow requests without an Origin header
//       // such as Postman or server-to-server requests.
//       if (!origin) {
//         return callback(null, true);
//       }

//       // If CLIENT_ORIGINS is not configured,
//       // allow all origins just like your current setup.
//       if (allowedOrigins.length === 0) {
//         return callback(null, true);
//       }

//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }

//       return callback(new Error('Origin is not allowed by CORS.'));
//     },

//     methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],

//     allowedHeaders: ['Content-Type', 'Authorization'],
//   }),
// );

// // ==================================================
// // BODY PARSER
// // ==================================================

// app.use(
//   express.json({
//     limit: '10kb',
//   }),
// );

// // ==================================================
// // HELPERS
// // ==================================================

// const asyncHandler = handler => async (req, res, next) => {
//   try {
//     await handler(req, res, next);
//   } catch (error) {
//     next(error);
//   }
// };

// // --------------------------------------------------
// // Transaction types
// // --------------------------------------------------

// const TRANSACTION_TYPES = new Set(['Income', 'Expense']);

// // --------------------------------------------------
// // Transaction categories
// // --------------------------------------------------

// const TRANSACTION_CATEGORIES = new Set([
//   'salary',
//   'freelance',
//   'business',
//   'transport',
//   'investment',
//   'bill',
//   'rent',
//   'food',
//   'buy',
//   'others',
// ]);

// // ==================================================
// // DATE VALIDATION
// // ==================================================

// const parseTransactionDate = value => {
//   if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
//     return null;
//   }

//   const [year, month, day] = value.split('-').map(Number);

//   const date = new Date(Date.UTC(year, month - 1, day));

//   // Reject impossible dates such as:
//   // 2026-02-30
//   // 2026-04-31
//   // 2026-13-01
//   if (
//     date.getUTCFullYear() !== year ||
//     date.getUTCMonth() !== month - 1 ||
//     date.getUTCDate() !== day
//   ) {
//     return null;
//   }

//   return date;
// };

// // ==================================================
// // TRANSACTION VALIDATION
// // ==================================================

// const buildTransactionData = body => {
//   const title = typeof body.title === 'string' ? body.title.trim() : '';

//   const amount = Number(body.amount);

//   const category = body.category;

//   const type = body.type;

//   const date = parseTransactionDate(body.date);

//   const description =
//     typeof body.description === 'string' ? body.description.trim() : '';

//   // ------------------------------------------------
//   // Title
//   // ------------------------------------------------

//   if (!title) {
//     return {
//       error: 'Title is required.',
//     };
//   }

//   // ------------------------------------------------
//   // Amount
//   // ------------------------------------------------

//   if (!Number.isFinite(amount) || amount <= 0) {
//     return {
//       error: 'Amount must be a positive number.',
//     };
//   }

//   // ------------------------------------------------
//   // Category
//   // ------------------------------------------------

//   if (!TRANSACTION_CATEGORIES.has(category)) {
//     return {
//       error: 'Invalid transaction category.',
//     };
//   }

//   // ------------------------------------------------
//   // Type
//   // ------------------------------------------------

//   if (!TRANSACTION_TYPES.has(type)) {
//     return {
//       error: 'Invalid transaction type.',
//     };
//   }

//   // ------------------------------------------------
//   // Date
//   // ------------------------------------------------

//   if (!date) {
//     return {
//       error: 'Invalid transaction date.',
//     };
//   }

//   // ------------------------------------------------
//   // Valid data
//   // ------------------------------------------------

//   return {
//     value: {
//       title,
//       amount,
//       category,
//       type,
//       date,
//       description,
//     },
//   };
// };

// // ==================================================
// // FIREBASE ADMIN
// // ==================================================

// let firebaseAuth = null;

// const getFirebaseAuth = () => {
//   // Reuse already initialized Firebase Auth.
//   if (firebaseAuth) {
//     return firebaseAuth;
//   }

//   const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

//   if (!base64) {
//     throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 is missing.');
//   }

//   let serviceAccount;

//   try {
//     serviceAccount = JSON.parse(Buffer.from(base64, 'base64').toString('utf8'));
//   } catch (error) {
//     throw new Error(
//       'FIREBASE_SERVICE_ACCOUNT_BASE64 is not valid Base64 JSON.',
//     );
//   }

//   // Prevent Firebase from being initialized twice
//   // in the same running instance.
//   if (getApps().length === 0) {
//     initializeApp({
//       credential: cert(serviceAccount),
//     });
//   }

//   firebaseAuth = getAuth();

//   return firebaseAuth;
// };

// // ==================================================
// // FIREBASE TOKEN VERIFICATION
// // ==================================================

// const verifyFireBaseToken = async (req, res, next) => {
//   const authorization = req.headers.authorization;

//   const match = authorization?.match(/^Bearer\s+([^\s]+)$/i)?.[1];

//   // ------------------------------------------------
//   // Missing token
//   // ------------------------------------------------

//   if (!match) {
//     return res.status(401).send({
//       message: 'Unauthorized access.',
//     });
//   }

//   try {
//     const decodedToken = await getFirebaseAuth().verifyIdToken(match);

//     // ------------------------------------------------
//     // Email is required
//     // ------------------------------------------------

//     if (!decodedToken.email) {
//       return res.status(401).send({
//         message: 'Unauthorized access.',
//       });
//     }

//     // ------------------------------------------------
//     // Store verified information on request
//     // ------------------------------------------------

//     req.token_email = decodedToken.email;

//     req.token_name = decodedToken.name || '';

//     next();
//   } catch (error) {
//     console.error('Firebase token verification failed:', error.message);

//     return res.status(401).send({
//       message: 'Unauthorized access.',
//     });
//   }
// };

// // ==================================================
// // MONGODB
// // ==================================================

// // Cached MongoDB client.
// //
// // Important:
// // We do NOT create a new MongoClient for every request.
// // The same client can be reused across requests/invocations
// // while the Vercel instance remains warm.

// let client = null;

// // Promise used to initialize the collection only once
// // for the current running instance.
// let transactionsCollectionPromise = null;

// // ==================================================
// // CONNECT TO MONGODB
// // ==================================================

// async function connectMongoOnce() {
//   const uris = [
//     process.env.MONGODB_URI_SRV,
//     process.env.MONGODB_URI_STANDARD,
//   ].filter(Boolean);

//   if (uris.length === 0) {
//     throw new Error('MongoDB URI is missing.');
//   }

//   let lastError;

//   // Try SRV first, then Standard if configured.
//   for (const uri of uris) {
//     let temporaryClient;

//     try {
//       temporaryClient = new MongoClient(uri, {
//         serverApi: {
//           version: ServerApiVersion.v1,
//           strict: true,
//           deprecationErrors: true,
//         },

//         serverSelectionTimeoutMS: 10000,

//         // Keep the pool reasonable for a serverless app.
//         maxPoolSize: 10,

//         minPoolSize: 0,
//       });

//       await temporaryClient.connect();

//       // Verify the connection.
//       await temporaryClient.db('admin').command({
//         ping: 1,
//       });

//       console.log(
//         `MongoDB connected using ${
//           uri.startsWith('mongodb+srv') ? 'SRV' : 'Standard'
//         } URI.`,
//       );

//       return temporaryClient;
//     } catch (error) {
//       lastError = error;

//       console.error('MongoDB connection attempt failed:', error.message);

//       // Close a failed temporary client.
//       await temporaryClient?.close().catch(() => {});
//     }
//   }

//   throw lastError || new Error('Could not connect to MongoDB.');
// }

// // ==================================================
// // GET TRANSACTIONS COLLECTION
// // ==================================================

// const getTransactionsCollection = async () => {
//   // Reuse the existing initialization promise.
//   if (transactionsCollectionPromise) {
//     return transactionsCollectionPromise;
//   }

//   transactionsCollectionPromise = (async () => {
//     // Create/connect MongoClient only when a
//     // database request actually needs it.
//     if (!client) {
//       client = await connectMongoOnce();
//     }

//     const db = client.db('personal_fm');

//     const collection = db.collection('transactions');

//     // This is safe to call repeatedly.
//     // MongoDB will keep the same index instead
//     // of creating duplicate indexes.
//     await collection.createIndex({
//       email: 1,
//       createdAt: -1,
//     });

//     return collection;
//   })().catch(error => {
//     // Allow another request to retry initialization
//     // if the first initialization failed.
//     transactionsCollectionPromise = null;

//     throw error;
//   });

//   return transactionsCollectionPromise;
// };

// // ==================================================
// // ROOT ROUTE
// // ==================================================

// app.get('/', (req, res) => {
//   res.status(200).send({
//     message: 'Personal finance management server is running.',
//   });
// });

// // ==================================================
// // HEALTH ROUTE
// // ==================================================

// app.get('/health', (req, res) => {
//   res.status(200).send({
//     status: 'ok',
//   });
// });

// // ==================================================
// // GET ALL TRANSACTIONS
// // ==================================================

// app.get(
//   '/transactions',
//   verifyFireBaseToken,

//   asyncHandler(async (req, res) => {
//     const transactionsCollection = await getTransactionsCollection();

//     const result = await transactionsCollection
//       .find({
//         email: req.token_email,
//       })
//       .sort({
//         createdAt: -1,
//       })
//       .toArray();

//     res.status(200).send(result);
//   }),
// );

// // ==================================================
// // ADD TRANSACTION
// // ==================================================

// app.post(
//   '/transactions',
//   verifyFireBaseToken,

//   asyncHandler(async (req, res) => {
//     const transactionsCollection = await getTransactionsCollection();

//     const { value: transactionData, error } = buildTransactionData(req.body);

//     if (error) {
//       return res.status(400).send({
//         message: error,
//       });
//     }

//     // Keep your existing frontend name support.
//     const bodyName =
//       typeof req.body.name === 'string' ? req.body.name.trim() : '';

//     const safeTransaction = {
//       ...transactionData,

//       // IMPORTANT:
//       // Never trust email coming from req.body.
//       // Use the verified Firebase email.
//       email: req.token_email,

//       // Prefer the verified Firebase display name.
//       name: req.token_name || bodyName,

//       createdAt: new Date(),
//     };

//     const result = await transactionsCollection.insertOne(safeTransaction);

//     res.status(201).send({
//       message: 'Transaction added successfully.',

//       insertedId: result.insertedId,
//     });
//   }),
// );

// // ==================================================
// // UPDATE TRANSACTION
// // ==================================================

// app.patch(
//   '/transactions/:id',
//   verifyFireBaseToken,

//   asyncHandler(async (req, res) => {
//     const transactionsCollection = await getTransactionsCollection();

//     const { id } = req.params;

//     // ------------------------------------------------
//     // Validate ObjectId
//     // ------------------------------------------------

//     if (!ObjectId.isValid(id)) {
//       return res.status(400).send({
//         message: 'Invalid transaction ID.',
//       });
//     }

//     // ------------------------------------------------
//     // Validate transaction data
//     // ------------------------------------------------

//     const { value: transactionData, error } = buildTransactionData(req.body);

//     if (error) {
//       return res.status(400).send({
//         message: error,
//       });
//     }

//     const objectId = new ObjectId(id);

//     // ------------------------------------------------
//     // Update only the authenticated user's document
//     // ------------------------------------------------

//     const result = await transactionsCollection.updateOne(
//       {
//         _id: objectId,

//         // Ownership protection
//         email: req.token_email,
//       },

//       {
//         $set: {
//           ...transactionData,
//           updatedAt: new Date(),
//         },
//       },
//     );

//     // ------------------------------------------------
//     // Not found / not owned
//     // ------------------------------------------------

//     if (result.matchedCount === 0) {
//       return res.status(404).send({
//         message: 'Transaction not found.',
//       });
//     }

//     // ------------------------------------------------
//     // Return updated transaction
//     // ------------------------------------------------

//     const updatedTransaction = await transactionsCollection.findOne({
//       _id: objectId,
//       email: req.token_email,
//     });

//     res.status(200).send({
//       message: 'Transaction updated successfully.',

//       matchedCount: result.matchedCount,

//       modifiedCount: result.modifiedCount,

//       transaction: updatedTransaction,
//     });
//   }),
// );

// // ==================================================
// // BULK DELETE
// // IMPORTANT:
// // This route MUST be before /transactions/:id
// // ==================================================

// app.delete(
//   '/transactions/bulk',
//   verifyFireBaseToken,

//   asyncHandler(async (req, res) => {
//     const transactionsCollection = await getTransactionsCollection();

//     const { ids } = req.body;

//     // ------------------------------------------------
//     // Check array
//     // ------------------------------------------------

//     if (!Array.isArray(ids) || ids.length === 0) {
//       return res.status(400).send({
//         message: 'Transaction IDs are required.',
//       });
//     }

//     // ------------------------------------------------
//     // Validate every ObjectId
//     // ------------------------------------------------

//     if (!ids.every(id => ObjectId.isValid(id))) {
//       return res.status(400).send({
//         message: 'One or more transaction IDs are invalid.',
//       });
//     }

//     // ------------------------------------------------
//     // Convert strings to ObjectIds
//     // ------------------------------------------------

//     const objectIds = ids.map(id => new ObjectId(id));

//     // ------------------------------------------------
//     // Delete ONLY user's transactions
//     // ------------------------------------------------

//     const result = await transactionsCollection.deleteMany({
//       _id: {
//         $in: objectIds,
//       },

//       email: req.token_email,
//     });

//     res.status(200).send({
//       message: 'Selected transactions deleted successfully.',

//       deletedCount: result.deletedCount,
//     });
//   }),
// );

// // ==================================================
// // DELETE ONE TRANSACTION
// // ==================================================

// app.delete(
//   '/transactions/:id',
//   verifyFireBaseToken,

//   asyncHandler(async (req, res) => {
//     const transactionsCollection = await getTransactionsCollection();

//     const { id } = req.params;

//     // ------------------------------------------------
//     // Validate ObjectId
//     // ------------------------------------------------

//     if (!ObjectId.isValid(id)) {
//       return res.status(400).send({
//         message: 'Invalid transaction ID.',
//       });
//     }

//     // ------------------------------------------------
//     // Delete ONLY authenticated user's document
//     // ------------------------------------------------

//     const result = await transactionsCollection.deleteOne({
//       _id: new ObjectId(id),

//       email: req.token_email,
//     });

//     // ------------------------------------------------
//     // Not found
//     // ------------------------------------------------

//     if (result.deletedCount === 0) {
//       return res.status(404).send({
//         message: 'Transaction not found.',
//       });
//     }

//     res.status(200).send({
//       message: 'Transaction deleted successfully.',

//       deletedCount: result.deletedCount,
//     });
//   }),
// );

// // ==================================================
// // ERROR HANDLER
// // ==================================================

// app.use((error, req, res, next) => {
//   console.error('Server error:', error);

//   if (res.headersSent) {
//     return next(error);
//   }

//   // ------------------------------------------------
//   // CORS error
//   // ------------------------------------------------

//   if (error.message === 'Origin is not allowed by CORS.') {
//     return res.status(403).send({
//       message: 'This website is not allowed to call the API.',
//     });
//   }

//   // ------------------------------------------------
//   // Request body too large
//   // ------------------------------------------------

//   if (error.type === 'entity.too.large') {
//     return res.status(413).send({
//       message: 'Request body is too large.',
//     });
//   }

//   // ------------------------------------------------
//   // Invalid JSON
//   // ------------------------------------------------

//   if (error instanceof SyntaxError && error.status === 400) {
//     return res.status(400).send({
//       message: 'Invalid JSON request body.',
//     });
//   }

//   // ------------------------------------------------
//   // MongoDB unavailable
//   // ------------------------------------------------

//   if (
//     error.name === 'MongoServerSelectionError' ||
//     error.name === 'MongoNetworkError' ||
//     error.name === 'MongoTopologyClosedError'
//   ) {
//     return res.status(503).send({
//       message: 'Database service is temporarily unavailable.',
//     });
//   }

//   // ------------------------------------------------
//   // Unknown server error
//   // ------------------------------------------------

//   return res.status(500).send({
//     message: 'Internal server error.',
//   });
// });

// // ==================================================
// // LOCAL DEVELOPMENT
// // ==================================================
// //
// // Vercel imports `app`, so Vercel does NOT need
// // app.listen().
// //
// // But when you run:
// //
// //     npm start
// //
// // Node executes this file directly and this block
// // starts your local Express server.
// //

// if (require.main === module) {
//   app.listen(port, () => {
//     console.log(`Server is running at http://localhost:${port}`);
//   });
// }

// // ==================================================
// // EXPORT EXPRESS APP
// // ==================================================
// //
// // Vercel uses this exported app.
// //

// module.exports = app;

// // ============================================================================================================================ // //
// ============= // require() is not a normal Express or cors function—it is an Node.js function to import express plugins from node_modules.
const express = require('express');

// ============= // require() is not a normal Express or cors function—it is an Node.js function to import cors plugins from node_modules.
const cors = require('cors');

// ============= // This is for importing and configuring the .env file.
require('dotenv').config();

// ============= // This is for destructuring objects from MongoDB.
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// ============= // This is for destructuring objects from firebase-admin/app.
const { initializeApp, cert } = require('firebase-admin/app');

// ============= // This is for destructuring objects from firebase-admin/auth.
const { getAuth } = require('firebase-admin/auth');

// ============= // This is for use the Express package.
const app = express();

// ============= // This is for import the secure port from .env file.
const port = process.env.PORT || 3000;

// console.log(process.env);

let client;

// ============= // Keep this file private and out of Git. It's a firebase admin key.
// const serviceAccount = require('./finease-finance-management-firebase-admin-key.json');

// ============= // Base64 is useful for your Vercel deployment. Because my .gitignore contains: finease-finance-management-firebase-admin-key.json. So that secret JSON won't be uploaded to GitHub/Vercel.
const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString(
    'utf8',
  ),
);

// ============= // Main idea: this connects your backend server to your Firebase project securely.
// - serviceAccount = your private Firebase Admin key file.
// - cert(serviceAccount) = turns that key into Firebase credentials.
// - initializeApp(...) = starts/configures Firebase Admin in your server.
initializeApp({
  // It takes your Firebase service-account JSON data and makes it into a valid credential Firebase Admin can use.
  credential: cert(serviceAccount),
});

// ============================================================================================================================
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

// ============= // This tells Express to read JSON request data before your routes run.
app.use(express.json({ limit: '10kb' })); // It limits the JSON body size for each incoming request. It means Express accepts request JSON up to about 10 KB. If the limit is exceeded, Express creates an error. Then your error middleware handles it.

// ============================================================================================================================
// --------------------------------------------------
// Helpers
// --------------------------------------------------
// ============ //
// creates a Promise, meaning “this work will finish later.”
// resolve → a function that marks the Promise as finished.
// setTimeout(resolve, ms) → waits ms milliseconds, then runs resolve.
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

// ============ // This version works for async errors.
// const asyncHandler = handler => (req, res, next) => {
//   Promise.resolve(handler(req, res, next)).catch(next);
// };

// ============ // But this version is safer for both normal and async errors.
// const asyncHandler = handler => (req, res, next) => {
//   Promise.resolve()
//     .then(() => handler(req, res, next))
//     .catch(next);
// };

// ============ // But this version is safer for both normal and async errors.
// Your current .then().catch() version and this try...catch version do the same job. try...catch is often easier to read with async/await, so you can safely choose it.
// You do not need to add a separate try...catch inside every route, because asyncHandler catches errors for all wrapped routes.
// Why await replaces Promise.resolve() completely? ans: The await keyword automatically handles both regular values and promises.If your handler returns a promise (because it is an async function), await will pause and wait for it.If your handler returns a regular value, await automatically treats it like a resolved promise anyway.
const asyncHandler = handler => async (req, res, next) => {
  try {
    // Important: you must use await inside try.
    // await Promise.resolve(handler(req, res, next)); // It's possible to write it like this. But it's unnecessary.
    await handler(req, res, next);
  } catch (error) {
    next(error);
  }
};
// Flow:
// Database error
//     ↓
// catch (error)
//     ↓
// next(error)
//     ↓
// your global error middleware
//     ↓
// 500 Internal server error

// ============ // new Set() creates a special list of unique values. Giving false if the list value does not match.
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
  // ============ // check for date shape. like "2026-06-30"
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  // ============ // destructuring array. like "2026-06-05" to ["2026, "06", "30"]
  const [year, month, day] = value.split('-').map(Number);

  // ============ // need to minus 1 from month because months count in javascript from 0.
  const date = new Date(Date.UTC(year, month - 1, day)); // It takes human-readable date components (year, month, day, etc.), interprets them strictly in Coordinated Universal Time (UTC), and spits out a single Unix timestamp number.

  // Rejects invalid dates such as 2026-02-30. Without a leap year It will rejected.
  if (
    // ============ // For local time string. Just for example, not for use here; it is mostly used on the client side.
    // date.getFullYear()
    // date.getMonth()
    // date.getDate()

    // ============ // using mongoDB database. then use new Date(). Because MongoDB can use dates as an object. but toISOString is only a string. which is working good for JSON/API/log/display.
    // MongoDB date field → save Date object
    // JSON/API/log/display string → use toISOString()

    // ============ // for Coordinated Universal Time - UTC
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day

    // ============ // for Coordinated Universal Time - UTC more options if you set hours, minutes, seconds, milliseconds.
    // date.getUTCHours() ➡️ Returns hours(0–23)
    // date.getUTCMinutes() ➡️ Returns minutes(0–59)
    // date.getUTCSeconds() ➡️ Returns seconds(0–59)
    // date.getUTCMilliseconds() ➡️ Returns milliseconds(0–999)
  ) {
    return null;
  }

  return date;
};

const buildTransactionData = body => {
  // ============ // const laviathan = '  Lunch  '.trim(); laviathan = 'Lunch'
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

  // ============ // has() checks whether a Set contains a value.
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
// ============ // req, res, and next are the three common parameters of an Express middleware function.
const verifyFireBaseToken = async (req, res, next) => {
  // ============ // Sophisticated hackers can determine whether your token matching with Firebase or not. Then they could try multiple times using the same token to access other users' information on the website. But it's better to check ----- 'Bearer ' and token. But this is the weakness here: it will be easy to filter this token by vulnerable attack.
  // if (!authorization?.startsWith('Bearer ')) {
  //   return res.status(401).send({
  //     message: 'Unauthorized access',
  //   });
  // }

  // ============ // Sophisticated hackers can determine whether your token matching with Firebase or not. Then they could try multiple times using the same token to access other users' information on the website. But it's better to check ----- 'Bearer ' and token. But this is the weakness here: it will be easy to filter this token by vulnerable attack.
  // const token = authorization.split(' ')[1];

  // ============
  const authorization = req.headers.authorization;

  // const match = authorization?.match(/^Bearer\s+(.+)$/i); // Good but not critically unreliable. Need more references to accept this.

  const match = authorization?.match(/^Bearer\s+([^\s]+)$/i)?.[1];

  if (!match) {
    return res.status(401).send({
      message: 'Unauthorized access.',
    });
  }

  // ============ // Using await → prefer try...catch. Using Promise chaining → use .then().catch().
  try {
    // ============ // getAuth() comes from the Firebase Admin SDK. It means give me access to Firebase Authentication for my server. verifyIdToken() gives that token to Firebase Admin, and Firebase checks whether the token is valid.
    // const decodedToken = await getAuth().verifyIdToken(match[1]); // don't need to use it with this regex pattern.
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
  // ============ // filter(Boolean) removes empty/falsy values. Before .filter(Boolean), the array is like this:[true, undefined]. After [true].It removes values like: undefined, null, '', false, 0.
  const uris = [
    process.env.MONGODB_URI_SRV,
    process.env.MONGODB_URI_STANDARD,
  ].filter(Boolean);

  if (uris.length === 0) {
    // ============ // new Error(...) creates an error object with your message. throw stops the current function immediately and sends that error upward. If uris = []; Then this runs:
    throw new Error('MongoDB URI is missing from .env.');
  }

  let lastError;

  // ============ // for-of loop for iterating over an array of indices.
  for (const uri of uris) {
    let temporaryClient;

    // ============ // Using await → prefer try...catch. Using Promise chaining → use .then().catch().
    try {
      temporaryClient = new MongoClient(uri, {
        serverApi: {
          // ============ // version: ServerApiVersion.v1: Sets the standard rules you want to follow.
          // Locks the client to MongoDB's Stable API v1.
          // Ensures long-term compatibility so database upgrades won't break your app code.
          version: ServerApiVersion.v1,

          // ============ // When you set strict: true, you are locking your MongoDB client into a strict compatibility mode that forces your code to follow the exact rules of the stable API version you chose (ServerApiVersion.v1).
          strict: true,

          // ============ // When you set deprecationErrors: true, you are telling MongoDB: "If my code uses any old, outdated features that will be removed in future versions, throw an error immediately instead of ignoring it."In programming, deprecated means a feature is still working for now, but it is old, unsupported, and scheduled to be completely deleted in the next big update.
          deprecationErrors: true,
        },

        // ============ // how long (in milliseconds) the MongoDB client will try to find and connect to a valid database server before giving up and throwing an error.
        serverSelectionTimeoutMS: 10000,
      });

      // ============ // for creating new client. But if error to connect then it will be close.
      await temporaryClient.connect();

      // ============ // .command() is a lower-level tool used to check server health, modify configurations, or run optimizations. And The .db() function tells the MongoDB client: "Hey, focus all my next operations on this specific database."
      // await temporaryClient.db('admin').command({ ping: 1 }); // Some platforms are not good for ping.

      console.log(
        `MongoDB connected using ${
          uri.startsWith('mongodb+srv') ? 'SRV' : 'Standard'
        } URI.`,
      );

      return temporaryClient;
    } catch (error) {
      lastError = error;

      console.error('MongoDB connection attempt failed:', error.message);

      // ============ // client close safely.
      await temporaryClient?.close().catch(() => {});
    }
  }

  // ============ // new Error(...) creates an error object with your message. throw stops the current function immediately and sends that error upward
  throw lastError || new Error('Could not connect to MongoDB.');
}

// --------------------------------------------------
// Routes
// --------------------------------------------------
function registerRoutes(transactionsCollection) {
  app.get('/', (req, res) => {
    res.status(200).send({
      message: 'Personal finance management server is running.',
    });
  });

  // Gets only the Firebase-authenticated user's transactions.
  app.get(
    '/transactions',
    verifyFireBaseToken,
    asyncHandler(async (req, res) => {
      // ============ // Don't try to use this type of second-layer verification by client input. It could create a vulnerability, allowing sophisticated hackers to determine whether your email exists in Firebase or in the database. Then they could try multiple times with this email to access the website or its database.

      // const email = req.query.email;

      // if (email && email !== req.token_email) {
      //   return res.status(403).send({
      //     message: 'Forbidden Access. email does not match the signed-in user.',
      //   });
      // }
      // if (!email) {
      //   return res.status(403).send({
      //     message:
      //       'Forbidden Access: email does not existing with the signed-in user.',
      //   });
      // }

      // ============
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
      // ============ // Verification by client input. It could create a vulnerability, allowing sophisticated hackers to determine whether your email exists in Firebase or in the database. Then they could try multiple times with this email to access the website or its database.
      // solution just don't check email with client input like this. But you can take client email input for other reason.

      // const email = req.body.email;

      // if (email && email !== req.token_email) {
      //   return res.status(403).send({
      //     message: 'Forbidden Access. email does not match the signed-in user.',
      //   });
      // }
      // if (!email) {
      //   return res.status(403).send({
      //     message:
      //       'Forbidden Access: email does not existing with the signed-in user.',
      //   });
      // }

      // ============
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

      // ============ // Verification by client input. It could create a vulnerability, allowing sophisticated hackers to determine whether your email exists in Firebase or in the database. Then they could try multiple times with this email to access the website or its database.
      // solution just don't check email with client input like this. But you can take client email input for other reason.

      // const email = req.body.email;

      // if (email && email !== req.token_email) {
      //   return res.status(403).send({
      //     message: 'Forbidden Access. email does not match the signed-in user.',
      //   });
      // }
      // if (!email) {
      //   return res.status(403).send({
      //     message:
      //       'Forbidden Access: email does not existing with the signed-in user.',
      //   });
      // }

      // ============
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({
          message: 'Invalid transaction ID.',
        });
      }

      // One more sample of a security layer apply by different way. But I don't need it. Because I already added it in another shortcut way.
      // Layer 2 Check: Find the transaction in the database first
      // const query = { _id: new ObjectId(id) };
      // const existingTransaction =
      //   await req.transactionsCollection.findOne(query);

      // if (!existingTransaction) {
      //   return res.status(404).send({ message: 'Transaction not found' });
      // }

      // // Compare database record owner against the verified token email
      // if (existingTransaction.email !== req.token_email) {
      //   return res
      //     .status(403)
      //     .send({ message: 'Forbidden: You do not own this transaction' });
      // }

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
      // one thing you should remember req.body is and object. I mean it's wrap with {}. But ids wrap with [...]. like ids = [...].
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

      // ======================================================
      // ========== // An example of this structure will be.
      //   {
      //   _id: {
      //     $in: [
      //       new ObjectId('68b123456789abcdef000001'),
      //       new ObjectId('68b123456789abcdef000002'),
      //       new ObjectId('68b123456789abcdef000003')
      //     ]
      //   },
      //   email: 'user@gmail.com'
      // }
      // 4. Delete only the user's own transactions
      const result = await transactionsCollection.deleteMany({
        // ========== // $in is not used to save an ID in MongoDB. $in is a MongoDB query operator for querying multiple IDs.
        // ========== // When MongoDB stores an ID, you simply have: {_id: new ObjectId('68b123456789abcdef000001')}.
        // ========== // $in → query operator → finds documents whose value is in a list.
        // ========== // $set → update operator → sets/changes a field value.
        // ========== // $oid → insert/create an ID → It represents an ObjectId.
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

      // ======================================================
      // ========== // An example of this structure will be.
      // {
      //   _id: new ObjectId('68b123456789abcdef000001'),
      //   email: 'user@gmail.com'
      // }
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

  // ============ // error is a parameter of Express, just like req, res, and next.However, Express will only recognize it and treat it as the err parameter if your function has exactly 4 parameters (error, req, res, next).
  // Must be registered after every route.
  // This is your global Express error handler. Express recognizes it as an error middleware because it has four parameters.
  // When an error is passed using next(error), Express skips normal routes and comes here.
  // Your error handler can receive errors from these parts:
  // CORS middleware
  // express.json() body parser
  // Your API routes
  // Your asyncHandler()
  // Any middleware that calls next(error)
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
// That means it sends the error here.
// Route error
//  ↓
// next(error)
//  ↓
// app.use((error, req, res, next) => ...)
// This handles every unknown error safely. It does not expose private database or server error details to the frontend.

// --------------------------------------------------
// Server startup
// --------------------------------------------------
async function startServer() {
  // let retryDelay = 5000;

  const INITIAL_RETRY_DELAY = 5000; // 5 seconds
  const MAX_RETRY_DELAY = 60000; // 60 seconds

  let retryDelay = INITIAL_RETRY_DELAY;

  // ============ // while loop is an infinite loop. If the condition is true, it will run infinitely.
  while (!client) {
    try {
      client = await connectMongoOnce();
    } catch (error) {
      console.error(
        `MongoDB unavailable. Retrying in ${retryDelay / 1000} seconds.`,
      );

      // ============ // The loop function will wait for the next step for this wait value.
      await wait(retryDelay);

      // =============== // Math.min(1,2) always works with the minimum number first. then when it reach max. then the function work with same value.
      // retryDelay = Math.min(retryDelay * 2, 60000);
      retryDelay = Math.min(retryDelay * 2, MAX_RETRY_DELAY);
    }
  }

  // ===============
  const db = client.db('personal_fm');
  const transactionsCollection = db.collection('transactions');

  // =============== // You need this index to make this database query faster. First organize by email Then, inside each email, organize newest transactions first
  await transactionsCollection.createIndex({
    // ascending order
    email: 1,
    // descending order
    createdAt: -1,
  });

  // =============== // This runs your registerRoutes function and gives it access to your MongoDB transactions collection.
  // Inside that function, you create routes like:
  // app.get('/transactions', ...)
  // app.post('/transactions', ...)
  // app.patch('/transactions/:id', ...)
  // app.delete('/transactions/:id', ...)
  // So after this line, your server knows which code to run when a frontend calls /transactions.
  registerRoutes(transactionsCollection);

  // =============== // This starts your Express server and makes it wait for requests. And - port is usually from my .env file.
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

// =============== // This code handles starting failures and safely stopping my server.
// startServer() is an async function, so it returns a Promise.
// - .catch(error => ...) runs if startup fails completely.
startServer().catch(error => {
  console.error('Server startup failed:', error);

  // =============== // - process.exit(1) stops the Node.js server.
  // process.exit(0); This also stops the Node.js server, but: - process.exit(0) → normal/successful shutdown - process.exit(1) → shutdown because of an error
  process.exit(1);
});

// --------------------------------------------------
// Graceful shutdown
// --------------------------------------------------
const shutdown = async () => {
  console.log('Closing server...');

  // This line tries to close your MongoDB connection safely before the server stops.
  // client = MongoDB client connection.
  // .close() = closes that connection.
  // ?. means “only call .close() if client exists.”
  await client?.close().catch(() => {});

  // =============== // - process.exit(1) stops the Node.js server.
  // process.exit(0); This also stops the Node.js server, but: - process.exit(0) → normal/successful shutdown - process.exit(1) → shutdown because of an error
  process.exit(0);
};

// =============== //
// 'SIGINT' and 'SIGTERM' are built-in operating-system signal names that Node.js understands.
// shutdown is my own custom function name.
// =============== // process.on() tells Node.js: “When this event happens, run this function.” Here: - SIGINT usually happens when you press Ctrl + C in the terminal. - Then Node.js runs shutdown().
process.on('SIGINT', shutdown);

// =============== // SIGTERM is a “please stop the server” signal. Hosting platforms often send it when they restart, redeploy, or stop your server. Then Node.js runs shutdown().
process.on('SIGTERM', shutdown);

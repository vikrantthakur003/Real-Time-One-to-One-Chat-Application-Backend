import mongoose from 'mongoose';

const databaseLoader = async () => new Promise<any>((resolve, reject) => {
  mongoose.set('strictQuery', false);
  mongoose.connect(String(process.env.MONGO_URI), {
  })
    .then(db => {
      console.log('Database connection established');

      resolve(db);
    })
    .catch(reject);
});

export { databaseLoader };

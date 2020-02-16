import mongoose from 'mongoose';

class Database {
  constructor() {
    this.mongo();
  }

  mongo() {
    let uri = ' ';

    if (process.env.NODE_ENV === 'production') {
      uri = process.env.MONGO_URL;
    } else {
      uri = process.env.MONGO_URL_DEV;
    }
    this.mongoConnection = mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

export default new Database();

import session from 'express-session';
import MongoStore from 'connect-mongo';

const configureSession = (app) => {
  app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/clinic' }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
  }));
};

export default configureSession;

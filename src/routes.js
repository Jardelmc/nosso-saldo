import { Router } from 'express';
// import multer from 'multer';
import authMiddleware from './app/middlewares/auth';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';

const routes = new Router();

routes.post('/user/create', UserController.create);

routes.post('/sessions', SessionController.create);

routes.get('/', async (req, res) => {
  return res.status(200).json();
});

// Rotas autenticadas
routes.use(authMiddleware);

export default routes;

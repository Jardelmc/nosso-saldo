import { Router } from 'express';
// import multer from 'multer';
import authMiddleware from './app/middlewares/auth';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import FriendRequestController from './app/controllers/FriendRequestController';

const routes = new Router();

routes.post('/user/create', UserController.create);

routes.post('/sessions', SessionController.create);

routes.get('/', async (req, res) => {
  return res.status(200).json();
});

// Rotas autenticadas
routes.use(authMiddleware);

// Rota para criar nova solicitação
routes.post('/friendRequest/add', FriendRequestController.create);

// Rota para aceitar solicitação
routes.put('/friendRequest/update', FriendRequestController.update);

export default routes;

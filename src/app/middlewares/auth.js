import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Por favor, faça login novamente' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    req.email = decoded.email;
    req.name = decoded.name;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import UserMongo from '../schemas/UserSchema';

class SessionController {
  async create(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(200).json({ err: 'Preencha todos os campos' });
      }

      const user = await UserMongo.findOne({ email });

      if (!user) {
        return res.status(200).json({ err: 'Usuário não encontrado' });
      }

      const { password_hash } = user;

      const decodedPassword = await bcrypt.compare(password, password_hash);

      if (!decodedPassword) {
        return res.status(200).json({ err: 'Senha incorreta' });
      }

      const signedUser = {
        name: user.name,
        token: jwt.sign({ email }, process.env.SECRET_KEY),
      };

      return res.status(200).json(signedUser);
    } catch (error) {
      return res.status(400).json('Erro ao fazer login');
    }
  }
}

export default new SessionController();

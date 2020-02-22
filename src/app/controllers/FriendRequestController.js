/* eslint-disable no-underscore-dangle */
import FriendRequestMongo from '../schemas/FriendRequestSchema';
import UserMongo from '../schemas/UserSchema';
import BalanceMongo from '../schemas/BalanceSchema';
import BalanceModel from '../models/BalanceModel';
import {
  addBalanceToUser,
  removeFriendRequest,
} from '../util/CreateBalanceUtil';

class FriendRequestController {
  async index(req, res) {
    const solicitations = await FriendRequestMongo.findOne({
      email: req.email,
    }).lean();

    if (!solicitations) {
      return res.status(200).json({ err: 'Erro' });
    }

    const { solicitation } = solicitations;

    if (solicitation.length === 0) {
      return res.status(200).json();
    }

    return res.status(200).json({ payload: solicitation });
  }

  async create(req, res) {
    try {
      const { emailToInvite } = req.body;

      if (!emailToInvite) {
        return res.status(200).json({ err: 'O email é obrigatório' });
      }

      const friendRequest = await FriendRequestMongo.findOne({
        email: emailToInvite,
      });

      if (!friendRequest) {
        return res.status(200).json({ err: 'Usuário não encontrado' });
      }

      const newRequest = {
        name: req.name,
        email: req.email,
        date: new Date(),
      };

      const hasAlreadySolicitation = friendRequest.solicitation.find(
        element => element.email === req.email
      );

      if (!hasAlreadySolicitation) {
        friendRequest.solicitation.push(newRequest);

        await FriendRequestMongo.updateOne(
          { email: emailToInvite },
          friendRequest
        );

        return res.status(200).json({ message: 'Solicitação enviada' });
      }

      return res
        .status(200)
        .json({ err: 'Você já tem uma solicitação pendente' });
    } catch (error) {
      return res.status(400).json({ err: 'Erro ao enviar solicitação' });
    }
  }

  async update(req, res) {
    const { emailAccepted } = req.body;

    if (!emailAccepted) {
      return res.status(200).json({ err: 'Selecione um convite' });
    }

    const userOwner = await UserMongo.findOne(
      { email: emailAccepted },
      { name: 1, email: 1 }
    );

    const emailOwner = userOwner.email;
    const nameOwner = userOwner.name;
    const emailInvited = req.email;
    const nameInvited = req.name;

    const balance = BalanceModel.getBalanceModel(
      emailOwner,
      nameOwner,
      emailInvited,
      nameInvited
    );

    const newBalance = await BalanceMongo.create(balance);

    if (newBalance) {
      await addBalanceToUser(emailOwner, req.email, newBalance.id);

      await removeFriendRequest(req.email, emailOwner);

      return res
        .status(200)
        .json({ message: 'Solicitação aceita com sucesso' });
    }
    return res.status(200).json({ err: 'Erro ao criar nova solicitação' });
  }
}

export default new FriendRequestController();

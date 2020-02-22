/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable no-underscore-dangle */
import UserMongo from '../schemas/UserSchema';
import BalanceMongo from '../schemas/BalanceSchema';

import { updateBalance } from '../util/UpdateBalanceUtil';

class BalanceController {
  async index(req, res) {
    // Função para formatar dados para o frontend
    function prepareData(data) {
      const formatName = name => {
        try {
          const fristName = name.split(' ');
          return fristName[0];
        } catch (error) {
          return 'Usuário';
        }
      };

      const formattedData = data.map(x => {
        if (x.owner === req.email) {
          const object = {
            _id: x._id,
            friendName: formatName(x.participants.invited.name),
            myBalance: x.participants.owner.balance,
          };

          return object;
        }
        const object = {
          _id: x._id,
          friendName: formatName(x.participants.owner.name),
          myBalance: x.participants.invited.balance,
        };

        return object;
      });

      return formattedData;
    }

    try {
      const user = await UserMongo.findOne(
        { email: req.email },
        { balances: 1 }
      ).lean();

      const { balances } = user;

      if (balances && balances.length > 0) {
        const allBalances = await BalanceMongo.find(
          {
            _id: { $in: balances },
          },
          { historic: 0 }
        ).lean();

        if (allBalances && allBalances.length > 0) {
          const formattedData = prepareData(allBalances);

          return res.status(200).json({ formattedData });
        }
        return res.status(200).json({ empty: true });
      }
      return res.status(200).json({ empty: true });
    } catch (error) {
      return res.status(200).json({ err: 'Erro ao carregar usuários' });
    }
  }

  async indexHistoric(req, res) {
    const { balanceId } = req.params;

    if (!balanceId) {
      return res.status(200).json();
    }

    const balance = await BalanceMongo.findById(balanceId);

    const { historic } = balance;

    if (historic.length > 0) {
      return res.status(200).json({ payload: historic });
    }

    return res.status(200).json({ err: 'Vazio' });
  }

  async update(req, res) {
    const { balanceId, movimentation } = req.body;

    if (!balanceId || !movimentation) {
      return res
        .status(200)
        .json({ err: 'Não foi possível identificar o registro' });
    }

    const isUpdated = await updateBalance(
      req.email,
      balanceId,
      movimentation,
      req.name
    );

    if (isUpdated) {
      return res.status(200).json({ message: 'Atualizado com sucesso' });
    }
    return res.status(200).json({ err: 'Erro ao atualizar balanço' });
  }
}

export default new BalanceController();

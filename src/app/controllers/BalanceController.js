import { updateBalance } from '../util/UpdateBalanceUtil';

class BalanceController {
  async update(req, res) {
    const { balanceId, movimentation } = req.body;

    if (!balanceId || !movimentation) {
      return res
        .status(200)
        .json({ err: 'Não foi possível identificar o registro' });
    }

    const isUpdated = await updateBalance(req.email, balanceId, movimentation);

    if (isUpdated) {
      return res.status(200).json({ message: 'Atualizado com sucesso' });
    }
    return res.status(200).json({ err: 'Erro ao atualizar balanço' });
  }
}

export default new BalanceController();

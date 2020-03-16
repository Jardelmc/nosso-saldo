/* eslint-disable import/prefer-default-export */
import { format } from 'date-fns';
import BalanceMongo from '../schemas/BalanceSchema';

/**
 *
 * @param {String} solicitedUpdateEmail : Email de quem solicita atualização
 * @param {ObjectId} balanceId : Id do balanço a ser atualizado
 * @param {Object} movimentation : Movimentação a ser atualizada = { message: String, cost: Number}
 */
export async function updateBalance(
  solicitedUpdateEmail,
  balanceId,
  movimentation,
  createdBy
) {
  try {
    const balance = await BalanceMongo.findById(balanceId).lean();

    if (!balance) {
      return false;
    }

    const { owner, userInvited, participants, historic } = balance;

    const { cost } = movimentation;

    if (owner === solicitedUpdateEmail) {
      participants.owner.balance += Number(cost);
      participants.invited.balance -= Number(cost);
    } else if (userInvited === solicitedUpdateEmail) {
      participants.owner.balance -= Number(cost);
      participants.invited.balance += Number(cost);
    } else {
      return false;
    }

    movimentation.date = format(new Date(), 'dd/MM');

    movimentation.createdBy = createdBy;

    movimentation.createdByEmail = solicitedUpdateEmail;

    historic.push(movimentation);

    balance.participants = participants;
    balance.historic = historic;

    await BalanceMongo.updateOne({ _id: balanceId }, balance);

    return true;
  } catch (error) {
    return false;
  }
}

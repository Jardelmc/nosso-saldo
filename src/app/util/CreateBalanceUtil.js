/* eslint-disable no-restricted-syntax */
import UserMongo from '../schemas/UserSchema';
import FriendRequestMongo from '../schemas/FriendRequestSchema';
import BalanceMongo from '../schemas/BalanceSchema';

export async function checkIfAlreadyHasActiveBalance(emailOwner, invitedEmail) {
  const user = await UserMongo.findOne(
    { email: emailOwner },
    { balances: 1 }
  ).lean();

  const { balances } = user;

  if (balances && balances.length > 0) {
    const allBalances = await BalanceMongo.find(
      {
        _id: { $in: balances },
      },
      { owner: 1, userInvited: 1 }
    ).lean();

    if (allBalances && allBalances.length > 0) {
      for (const element of allBalances) {
        const { owner, userInvited } = element;

        if (
          (emailOwner === owner && invitedEmail === userInvited) ||
          (emailOwner === userInvited && invitedEmail === owner)
        ) {
          return false;
        }
      }
    }
  }

  return true;
}

export async function addBalanceToUser(email1, email2, balanceId) {
  const updateBalanceId = async email => {
    await UserMongo.updateOne(
      { email },
      {
        $push: {
          balances: balanceId,
        },
      }
    );
  };

  await updateBalanceId(email1);
  await updateBalanceId(email2);
}

export async function removeFriendRequest(email, emailOwner) {
  try {
    const friendRequest = await FriendRequestMongo.findOne({ email });

    const updatedSolicitations = friendRequest.solicitation.filter(
      element => element.email !== emailOwner
    );

    await FriendRequestMongo.updateOne(
      { email },
      { solicitation: updatedSolicitations }
    );

    return true;
  } catch (error) {
    return false;
  }
}

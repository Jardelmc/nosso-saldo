import UserMongo from '../schemas/UserSchema';
import FriendRequestMongo from '../schemas/FriendRequestSchema';

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
    /* await FriendRequestMongo.updateOne(
      { email },
      {
        $pull: {
          solicitation: {
            $in: [emailOwner],
          },
        },
      }
    ); */

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

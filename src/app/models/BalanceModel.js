class BalanceModel {
  getBalanceModel(emailOwner, nameOwner, emailInvited, nameInvited) {
    const balanceModel = {
      owner: emailOwner,
      userInvited: emailInvited,

      participants: {
        owner: {
          name: nameOwner,
          balance: 0.0,
        },

        invited: {
          name: nameInvited,
          balance: 0.0,
        },
      },

      historic: [],
    };

    return balanceModel;
  }
}

export default new BalanceModel();

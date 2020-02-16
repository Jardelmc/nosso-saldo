class BalanceModel {
  getBalanceModel(emailOwner, nameOwner, nameInvited) {
    const balanceModel = {
      owner: emailOwner,

      participants: {
        owner: {
          name: nameOwner,
          balance: 0,
        },

        invited: {
          name: nameInvited,
          balance: 0,
        },
      },

      historic: [],
    };

    return balanceModel;
  }
}

export default new BalanceModel();

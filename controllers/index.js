const {
  getAllContacts,
  getById,
  addContact,
  deleteContact,
  updateContact,
  updateFavorite,
} = require("./contacts-controller");

const {
  register,
  login,
  verify,
  getCurrent,
  logout,
  updateSubscription,
  resendVerifyEmail,
} = require("./auth");

const contacts = {
  getAllContacts,
  getById,
  addContact,
  deleteContact,
  updateContact,
  updateFavorite,
};

const auth = {
  register,
  login,
  getCurrent,
  logout,
  updateSubscription,
  verify,
  resendVerifyEmail,
};

module.exports = {
  contacts,
  auth,
};

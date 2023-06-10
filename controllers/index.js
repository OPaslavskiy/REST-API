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
};

module.exports = {
  contacts,
  auth,
};

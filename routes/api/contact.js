const express = require("express");

const {
  getAllMovies,
  getById,
  addContact,
  deleteContact,
  updateContact,
  updateFavorite,
} = require("../../controllers/contacts-controller");

const schemas = require("../../models/contact");

const { validateBody } = require("../../middlewares");

const { isValidId } = require("../../middlewares");

const router = express.Router();

router.get("/", getAllMovies);

router.get("/:contactId", isValidId, getById);

router.post("/", validateBody(schemas.contactAddSchema), addContact);

router.delete("/:contactId", isValidId, deleteContact);

router.put(
  "/:contactId",
  validateBody(schemas.contactAddSchema),
  isValidId,
  updateContact
);

router.patch(
  "/:contactId/favorite",
  validateBody(schemas.updateFavoriteSchema),
  isValidId,
  updateFavorite
);

module.exports = router;
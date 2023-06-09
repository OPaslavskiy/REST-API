const express = require("express");

const { contacts } = require("../../controllers");

const schemas = require("../../models");

const {
  validateBody,
  isValidId,
  authenticate,
  upload,
} = require("../../middlewares");

const router = express.Router();

router.get("/", authenticate, contacts.getAllContacts);

router.get("/:contactId", authenticate, isValidId, contacts.getById);

router.post(
  "/",
  upload.single("avatar"),
  authenticate,
  validateBody(schemas.contactAddSchema),
  contacts.addContact
);

router.delete("/:contactId", authenticate, isValidId, contacts.deleteContact);

router.put(
  "/:contactId",
  authenticate,
  validateBody(schemas.contactAddSchema),
  isValidId,
  contacts.updateContact
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  validateBody(schemas.updateFavoriteSchema),
  isValidId,
  contacts.updateFavorite
);

module.exports = router;

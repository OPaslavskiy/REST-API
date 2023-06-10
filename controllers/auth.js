const { User } = require("../models");
const { HttpError, sendEmail } = require("../helpers");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");

const { SECRET_KEY, PROJECT_URL } = process.env;

const { ctrlWrapper } = require("../decorators/");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email already in use");
  }

  const createHashPassword = await bcryptjs.hash(password, 10);
  const vereficationCode = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: createHashPassword,
    vereficationCode,
  });
  res.status(201).json({
    email: newUser.email,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${PROJECT_URL}/api/auth/verify/${vereficationCode}">Click to verify</a>`,
  };

  await sendEmail(verifyEmail);
};

const verify = async (req, res) => {
  const { vereficationCode } = req.params;
  const user = await User.findOne({ vereficationCode });
  if (!user) {
    throw HttpError(404);
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    vereficationCode: "",
  });

  res.json({ message: "Verify success" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.verify) {
    throw HttpError(401, "Email or password invalid");
  }

  const passwordCompare = await bcryptjs.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "12h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({ token });
};

const getCurrent = async (req, res) => {
  const { email, name } = req.user;

  res.json({
    email,
    name,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({
    message: "You have been logged out",
  });
};

const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;
  const validSubscriptions = User.schema.path("subscription").enumValues;

  if (!validSubscriptions.includes(subscription)) {
    throw HttpError(400);
  }

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { subscription },
    { new: true }
  );

  if (!updatedUser) {
    throw HttpError(404);
  }

  res.json(updatedUser);
};

module.exports = {
  register: ctrlWrapper(register),
  verify: ctrlWrapper(verify),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
};

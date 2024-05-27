const jwt = require("jsonwebtoken");
const { DateTime } = require("luxon");

function setAccessCookies(
  res,
  email,
  isSubscribedMonthly,
  isSubscribedLifetime
) {
  const expiration = DateTime.now().plus({ hours: 2 }).toSeconds();
  const tokenData = {
    email,
    exp: expiration,
    isSubscribedMonthly,
    isSubscribedLifetime,
  };

  const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
    algorithm: process.env.JWT_ALGORITHM,
  });

  res.cookie("access_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: expiration * 1000,
  });
}

module.exports = {
  setAccessCookies,
};

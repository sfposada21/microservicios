const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  let jwtToken = req.header("Authorization");
  if (!jwtToken) return res.status(400).send("Authorization denied: No token");
  
  try {
    jwtToken = jwtToken.split(" ")[1];
    console.log(`Baerer Token: ${jwtToken}`)
    next();
  } catch (e) {
    return res.status(400).send("Authorization denied: Invalid token");
  }
};

module.exports = auth;
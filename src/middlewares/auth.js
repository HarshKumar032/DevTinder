const userauth=(req, res, next) => {
  console.log("Authorizing the user");
  const token = "abc";
  if (token === "abc") {
    next();
  } else {
    res.status(401).send("Unauthorized User");
  }
};

const adminauth=(req, res, next) => {
  console.log("Authorizing the admin");
  const token = "abc";
  if (token === "abc") {
    next();
  } else {
    res.status(401).send("Unauthorized admin");
  }
};

module.exports={
    userauth,
    adminauth
}
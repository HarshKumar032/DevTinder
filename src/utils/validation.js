const validator = require("validator");

const validatesignup = (req) => {
  const { firstName, lastName, email, password, photourl } = req.body;

  // Validate presence
  if (!firstName || !lastName || !email || !password) {
    throw new Error(
      "All fields (first name, last name, email, password) are required."
    );
  }

  // Validate name length
  if (firstName.length < 4 || firstName.length > 20) {
    throw new Error("First name must be between 4 and 20 characters.");
  }

  if (lastName.length < 2 || lastName.length > 20) {
    throw new Error("Last name must be between 2 and 20 characters.");
  }

  // Validate email format
  if (!validator.isEmail(email)) {
    throw new Error("Enter a valid email address.");
  }

  // Validate password strength
  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    throw new Error(
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol."
    );
  }
};

module.exports = {
  validatesignup,
};

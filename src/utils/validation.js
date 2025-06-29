const validator = require("validator");

const validatesignup = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    throw new Error(
      "All fields (first name, last name, email, password) are required."
    );
  }

  if (firstName.length < 4 || firstName.length > 20) {
    throw new Error("First name must be between 4 and 20 characters.");
  }

  if (lastName.length < 2 || lastName.length > 20) {
    throw new Error("Last name must be between 2 and 20 characters.");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Enter a valid email address.");
  }

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

const validateeditprofiledata = (req) => {
  const allowed_fields = [
    "firstName",
    "lastName",
    "age",
    "skills",
    "gender",
    "about",
    "photourl",
  ];

  const isUpdateAllowed = Object.keys(req.body).every((k) =>
    allowed_fields.includes(k)
  );

  if (!isUpdateAllowed) {
    throw new Error("Update not allowed for some fields.");
  }

  const { firstName, lastName, age, skills, gender, about, photourl } = req.body;

  if (firstName && (firstName.length < 4 || firstName.length > 20)) {
    throw new Error("First name must be between 4 and 20 characters.");
  }

  if (lastName && (lastName.length < 2 || lastName.length > 20)) {
    throw new Error("Last name must be between 2 and 20 characters.");
  }
  
  if (age && (age < 18 || age > 60)) {
    throw new Error("Age must be between 18 and 60.");
  }
  
  if (skills && skills.length > 10) {
    throw new Error("Skills cannot be more than 10.");
  }

  if (about && about.length > 100) {
    throw new Error("About is too long (max 100 characters).");
  }

  if (photourl && !validator.isURL(photourl)) {
    throw new Error("Invalid photo URL.");
  }

  if (gender && !["male", "female"].includes(gender)) {
    throw new Error("Gender must be either 'male' or 'female'.");
  }
};

module.exports = {
  validatesignup,
  validateeditprofiledata,
};

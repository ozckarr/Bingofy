//create validate for bingoboxes

module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }
  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = "Email must be a valid email address";
    }
  }
  if (password === "") {
    errors.password = "Password must not empty";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords must match";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validatePlayerInput = (gameCode, nick) => {
  const errors = {};
  if (nick.trim() === "") {
    errors.nick = "Namn saknas";
  } else {
    // checks for html
    const regEx = /^/;
    if (!nick.match(regEx)) {
      errors.nick = "Otillåtna tecken";
    }
  }

  if (gameCode.trim() === "") {
    errors.gameCode = "Kod saknas";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateLoginInput = (username, password) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "Lösenordet nåste fyllas i.";
  }
  if (password.trim() === "") {
    errors.password = "Lösenordet nåste fyllas i.";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

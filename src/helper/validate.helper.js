class Validate {
  ValidatePassword(password) {
    // Minimum six and maximum 20 characters, at least one uppercase letter, one lowercase letter, one number and one special character:
    const regExp =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/;
    return regExp.test(password);
  }

  ValidateEmail(email) {
    const regex =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return regex.test(String(email).toLowerCase());
  }

  //   ValidatePhone(phoneNumber) {
  //     const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

  //     return re.test(phoneNumber);
  //   }

  //   ValidateAddress(address) {
  //     return typeof address === "string";
  //   }

  ValidateBlank(text) {
    // method check whitespace from both ends of a string and returns true/false
    const textLengh = text.length;
    if (text.lastIndexOf(" ") === textLengh - 1 || text.indexOf(" ") === 0) {
      return false;
    }
    return true;
  }
}

module.exports = new Validate();

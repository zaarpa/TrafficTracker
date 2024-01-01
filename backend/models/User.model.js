const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const passwordValidator =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()-_+=])[A-Za-z\d!@#$%^&*()-_+=]{8,}$/;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email address"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: false,
    minlength: [8, "Minimum password length is 8 characters"],
    validate: {
      validator: function (value) {
        return passwordValidator.test(value);
      },
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
    },
  },
  profile_image: {
    type: String,
    default: "",
  },
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
});
//After saving user document in db
UserSchema.post("save", function (doc, next) {
  console.log("new user was created & saved", doc);
  next();
});
//Before saving user document in database
UserSchema.pre("save", async function (next) {
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// static method for login
UserSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email: email });
  console.log(user);
  if (user) {
    console.log(user);
    if (user.password) {
      const auth = await bcrypt.compare(password, user.password);

      if (auth) {
        return user;
      }

      throw Error("Incorrect password");
    } else {
      throw Error("User does not have a password set");
    }
  }

  throw Error("Incorrect email");
};
UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  console.log("Token Print hoitese");
  console.log(resetToken);
  console.log("encrypted token print hoitese");
  console.log(this.passwordResetToken);
  return resetToken;
};

const User = mongoose.model("User", UserSchema);
module.exports = User;

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { logger } = require("../config/logger");

const saltRounds = 10;

const userRatingSchema = new mongoose.Schema({
  _user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  rating: {
    type: Number,
  },
});

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      immutable: true,
      unique: true,
      // RFC 5322 email validation
      match: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      require: true,
    },
    ratings: {
      type: [userRatingSchema],
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

userSchema.methods.verifyPassword = async function (password) {
  try {
    const user = await User.findById(this).select("password");
    return await bcrypt.compare(password, user.password);
  } catch (error) {
    logger.warn(error.message);
  }
};

userSchema.methods.rate = function (user, rating) {
  this.ratings.push({ _user: user, rating });
  return this.save();
};

userSchema.virtual("rating").get(function () {
  try {
    const ratings = this.ratings.map((r) => r.rating);
    const average = ratings.reduce((acc, cur) => acc + cur) / ratings.length;
    return average.toFixed(2);
  } catch (error) {
    return "0";
  }
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, saltRounds);
  }
  next();
});

userSchema.pre("findOneAndUpdate", async function () {
  if (this._update.password) {
    this._update.password = await bcrypt.hash(
      this._update.password,
      saltRounds
    );
  }
});

userSchema.set("toJSON", {
  gettes: true,
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.ratings;

    ret = { id: ret.id, ...ret };
    return ret;
  },
  versionKey: false,
});

const User = mongoose.model("User", userSchema);

module.exports = User;

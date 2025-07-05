import mongoose, { Schema, model, models, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  UserId: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  contact?: string;
  createdAt: Date;
  updatedAt: Date;
  profilepic: string;
  userType: string;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  passwordResetToken?: string;
  passwordResetTokenExpires?: Date;
  profilePicFileId?: string;
}

const userSchema = new Schema<IUser>(
  {
    passwordResetToken: {
      type: String,
      select: false,
    },
    profilePicFileId: {
      type: String,
      default: null,
    },
    passwordResetTokenExpires: {
      type: Date,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      select: false,
    },
    verificationTokenExpires: {
      type: Date,
      select: false,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      match: [
        /^(?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/,
        "Invalid email format",
      ],
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: [true, "password is required"] },
    firstname: {
      type: String,
      required: [true, "firstname is required"],
      match: [/^[A-Za-z]+([ '-][A-Za-z]+)*$/, "Invalid first name"],
    },
    lastname: {
      type: String,
      required: [true, "lastname is required"],
      match: [/^[A-Za-z]+([ '-][A-Za-z]+)*$/, "Invalid last name"],
    },
    contact: {
      type: String,
      match: [
        /^(?:\+?(\d{1,4})[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}$/,
        "Invalid contact number",
      ],
    },
    profilepic: {
      type: String,
      default: "/default-avatar.png",
    },
    userType: { type: String, required: [true, "User type is required"] },
    UserId: { type: String, unique: true },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isNew) return next();

  const lastUser = await mongoose
    .model<IUser>("User")
    .findOne({}, { UserId: 1 })
    .sort({ UserId: -1 });

  let newUserNumber = 1;

  if (lastUser && lastUser.UserId) {
    const match = lastUser.UserId.match(/(\d+)$/);
    const maxNumber = match ? parseInt(match[0], 10) : 0;
    newUserNumber = maxNumber + 1;
  }
  const paddedUserNumber = String(newUserNumber).padStart(5, "0");
  this.UserId = `User-${paddedUserNumber}`;

  next();
});

userSchema.pre("save", async function (next) {
  const user = this as IUser;

  if (user.isModified("password") && user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }

  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = models?.User || model<IUser>("User", userSchema, "register_user");

export default User;

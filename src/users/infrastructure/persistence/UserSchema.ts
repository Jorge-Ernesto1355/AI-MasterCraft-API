import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}

const UserSchema = new Schema({
  username: {
    type: String,
    maxLength: 15,
    minLength: 3,
    unique: true,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, "Por favor ingrese un correo válido"],
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 128,
  },
  accessToken: { type: String },
  refreshToken: { type: String },
});

const UserModel = mongoose.model<IUser>("User", UserSchema);

export default UserModel;

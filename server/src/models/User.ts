import mongoose, { Schema, Document} from "mongoose"
import bcrypt from "bcrypt"

export interface IUser extends Document {
    email: string,
    password: string,
    name: string,
    comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema: Schema = new Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    name: {
      type: String,
      required: true,
      trim: true
    }
  }, {
    timestamps: true
  });


  UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password as string, salt);
      next();
    } catch (error) {
      next(error as Error);
    }
  });

  UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  };

  export default mongoose.model<IUser>('User', UserSchema);

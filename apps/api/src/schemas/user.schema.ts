import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

export type CatDocument = User & Document

enum UserRole {
  Guest = "Guest",
  Admin = "Admin",
  SuperAdmin = "SuperAdmin",
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: false, default: null })
  firstName?: string

  @Prop({ required: false, default: null })
  lastName?: string

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  username: string

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop({
    type: String,
    required: true,
    default: UserRole.Guest,
    enum: [UserRole.Guest, UserRole.Admin, UserRole.SuperAdmin],
  })
  role: string
}

export const UserSchema = SchemaFactory.createForClass(User)

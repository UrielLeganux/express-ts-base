import mongoose, {Document, Schema} from 'mongoose';
import {AddressModel} from "../address/model";
import {RFCModel} from "../RFCs/model";

export interface IUser extends Document {
    firebaseUid: string;
    name: string;
    username: string;
    phone?: number;
    email: string;
    photoURL?: string;
    role: string;
    isActive: boolean;
    emailVerified: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema({
        firebaseUid: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
        },
        photoURL: {
            type: String,
            required: false,
            default: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
        },
        role: {
            type: String,
            enum: ['guest', 'admin', 'user'],
            required: true
        },
        isActive: {
            type: Boolean,
            required: true,
            default: false,
        },
        emailVerified: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true
    });

export const UserModel = mongoose.model<IUser>('user', userSchema);

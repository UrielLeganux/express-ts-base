import mongoose, {Document, Schema} from 'mongoose';
import { UserModel } from "../users/model";
import { productModel } from "../products/model";
import {PayoutInfoModel} from "../payout_info/model";

export interface IOrder extends Document {
    userId: mongoose.Types.ObjectId;
    payout_info: mongoose.Types.ObjectId;
    product: mongoose.Types.ObjectId;
    no_prods: number;
    total_amount: number;
    key_group: string;
    payment_type: string;
    shipping_type: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

const orderSchema: Schema = new Schema({
        userId: {
            type: Schema.Types.ObjectId,
            ref: UserModel,
            required: true,
        },

        payout_info: {
            type: Schema.Types.ObjectId,
            ref: PayoutInfoModel,
            required: true,
        },

        product: {
            type: Schema.Types.ObjectId,
            ref: productModel,
            required: true,
        },

        no_prods: {
            type: Number,
            required: true,
        },
        total_amount: {
            type: Number,
            required: false,
        },
        key_group: {
            type: String,
            required: false,
        },
        payment_type: {
            type: String,
            enum: ['card_openpay', 'card_mp'],
            required: false,
        },
        shipping_type: {
            type: String,
            enum: ['envia'],
            required: false,
        },
        status: {
            type: String,
            enum: ['cart', 'quoted', 'preorder', 'payed', 'ready_to_ship', 'complete'],
            required: false,
        },
    },
    {
        timestamps: true
    });

export const OrderModel = mongoose.model<IOrder>('Order', orderSchema);
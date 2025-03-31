import {Schema, model, Document, Types} from "mongoose";

import {IUser} from '../user/model';

interface IPayoutInfo extends Document {
    payment_type?: number;
    tag?: string;
    open_pay_id?: string;
    user: Types.ObjectId | IUser;
    amount?: string;
    status?: string;
    redirect_link_openpay?: string;
    full_JSON?: Record<string, any>;
    full_JSON_hook: Record<string, any>;
    created_At?: Date;
    updated_At?: Date;
}

const PayoutInfoSchema = new Schema({
    payment_type: {
        type: Number,
        required: false,
    },
    tag: {
        type: String,
        required: false,
    },
    open_pay_id: {
        type: String,
        required: false,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    amount: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: false,
    },
    redirect_link_openpay: {
        type: String,
        required: false,
    },
    full_JSON: {
        type: Schema.Types.Mixed,
        required: false,
    },
    full_JSON_hook: {
        type: Schema.Types.Mixed,
        required: false,
    },

}, {
    timestamps: true
});

const PayoutInfoModel = model<IPayoutInfo>('PayoutInfo', PayoutInfoSchema);
export default PayoutInfoModel;
export {PayoutInfoModel};
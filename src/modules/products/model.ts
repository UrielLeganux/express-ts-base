import mongoose, {Document, Schema} from 'mongoose';
import {IUser} from "../../modules-respaldo/users/model";

 interface IProduct {
    idForeign: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;

}


const productSchema: Schema = new Schema({
    idForeign: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    }
},{
    timestamps: true,
});

export const  productModel = mongoose.model<IProduct>('Product', productSchema);

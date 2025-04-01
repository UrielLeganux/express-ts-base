import mongoose, {Document, Schema} from "mongoose";

export interface IConfiguration extends Document {
    description: string;
    value : string,
    createdAt: Date;
    updatedAt: Date;
}

const ConfigurationSchema: Schema = new Schema(
    {
        description: {
            type: String,
            required: true,
        },
        value: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

export const ConfigurationModel = mongoose.model<IConfiguration>("Configuration", ConfigurationSchema);

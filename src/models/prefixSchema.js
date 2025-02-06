import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;

const prefixSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    prefix: {
        type: String,
        required: true
    }
});

const name = 'guild-prefixes';
export default models[name] || model (name, prefixSchema);
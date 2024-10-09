const mongoose = require('mongoose');
const { Schema } = mongoose;

const smallSchema = new Schema({
    name: { type: String },
    code: { type: String },
});

const midSchema = new Schema({
    name: { type: String },
    code: { type: String },
    small: [smallSchema], 
});

const largeSchema = new Schema({
    name: { type: String },
    code: { type: String },
    mid: [midSchema],  
});

const productSchema = new Schema({
    large: [largeSchema],
    createdAt: { type: Date, default: Date.now },
});

const Products = mongoose.model('Products', productSchema);

module.exports = {
    Products,
};

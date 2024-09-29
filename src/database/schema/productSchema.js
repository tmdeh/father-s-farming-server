const mongoose = require('mongoose');
const { Schema } = mongoose;

const smallSchema = new Schema({
    name: {type: String, require: true},
    code: {type: String, require: true},
})

const midSchema = new Schema({
    name: {type: String, require: true},
    code: {type: String, require: true},
    small: [smallSchema],
})


const largeSchema = new Schema({
    name: {type: String, require: true},
    code: {type: String, require: true},
    mid: [midSchema],
});

const productSchema = new Schema({
    large: largeSchema,
    createdAt: { type: Date, default: Date.now, expires: '1d' },
});

const Products = mongoose.model('Products', productSchema);

module.exports = {
    Products,
}
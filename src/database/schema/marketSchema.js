const mongoose = require('mongoose');
const { Schema } = mongoose;

const marketSchema = new Schema({
    name: {type: String, require: true},
    code: {type: Number, require: true},
    createdAt: { type: Date, default: Date.now, expires: '1d' },
});

const Market = mongoose.model('Market', marketSchema);

module.exports = {
    Market,
}
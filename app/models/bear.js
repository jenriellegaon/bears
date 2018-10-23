let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let BearSchema = new Schema({
    name: String,
    age: Number
});

module.exports = mongoose.model('Bear', BearSchema);

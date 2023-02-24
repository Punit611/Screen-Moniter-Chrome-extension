const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    time: { type: Date, default: Date.now },
    test: { type: String, required: true },
    screen_image: { type: Object, required: true },
    user_image: { type: Object, required: true },
});
const ImageModel = mongoose.model('Image', imageSchema);

module.exports = ImageModel

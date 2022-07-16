const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 100
        },
        rating: {
            type: Number,
            required: true,
        },
        cast: {
            type: Array,
        },
        genre: {
            type: String,
            required: true
        },
        release_date:{
            type: Date
        }
    },
    { timestamps: true }
);


module.exports = mongoose.model('Movie', MovieSchema);

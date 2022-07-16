const MovieModel = require('../models/movie');
const { errorHandler } = require('../helpers/dbErrorHandler');
const mongoose = require('mongoose');

exports.createMovie = (req, res) => {
    let body = req.body;
    if (!body || !body.name || !body.rating || !body.cast || !body.genre || !body.release_date) {
        return res.status(400).json({
            error: "Invalid_CreateMovie", "errMsg": `Expecting ['name', 'rating', 'cast', genre, release_date]`
        });
    }
    let Record = {
        "name": body.name,
        "rating": body.rating,
        "cast": body.cast,
        "genre": body.genre,
        "release_date": new Date(body.release_date)
    }
    console.log(body)
    const newRecord = new MovieModel(Record)
    newRecord.save((err, result) => {
        if (err) {
            console.log('@MOVIE CREATE ERROR ', err);
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(result);
    });
}

exports.remove = (req, res) => {

    MovieModel.deleteOne({ _id: req.params.id })
        .then(data => {
            console.log(data)
            if (data.deletedCount !== 0) {
                res.json({
                    message: 'Movie deleted successfully'
                });
            } else {
                return res.status(400).json({
                    error: "Record_Not_Found", "errMsg": `Cannot delete post with id=${req.params.id}. Maybe Movie Model was not found!`
                });
            }
        })
        .catch(err => {
            console.log(`[ERR] @ update Record is ${JSON.stringify(err)}`);
        })

};

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }
    const id = mongoose.Types.ObjectId(req.params.id);
    updateRecord = MovieModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!updateRecord) {
                res.status(404).send({
                    message: `Cannot update the Movie with id=${id}. Maybe Movie was not found!`
                });
            } else res.status(200).json({ updateRecord: data })
        })
        .catch(err => {
            //console.log(err)
            res.status(500).send({
                message: `Error updating the profile with id ${id}`
            });
        });
}
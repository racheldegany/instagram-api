function pathSelection(path) {
    return function (req, res, next){
        req.type = path;
        next();
    }
}

module.exports = pathSelection;
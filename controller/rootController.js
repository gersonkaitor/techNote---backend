const path = require('path')

const getRoot = (req,res) =>{
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
}

module.exports = {
    getRoot
}
const express = require('express')
const router = express.Router()
const {getRoot} = require('../controller/rootController')


router.get('^/$|/index(.html)?', getRoot)

module.exports = router
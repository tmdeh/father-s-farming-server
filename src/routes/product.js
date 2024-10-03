const express = require('express');
const asyncMiddleware = require('../middlewere/asyncHandler');
const router = express.Router();

const marketService = require('../service/marketService')


router.get('/', asyncMiddleware(async(req, res) => {
    const responseData = await marketService.getProductCode(req.query);
    res.json(responseData);
}));

module.exports = router;
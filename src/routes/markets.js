const express = require('express');
const asyncMiddleware = require('../middlewere/asyncHandler');
const router = express.Router();

const marketService = require('../service/marketService')

// 도매시장 코드 조회
router.get('/', asyncMiddleware(async(req, res) => {
    const result = await marketService.getMarketCode();
    res.json(result);
}));

router.get('/corporate', asyncMiddleware(async(req, res) => {
    const result = await marketService.getCorporateCode();
    res.json(result);
}))

module.exports = router;

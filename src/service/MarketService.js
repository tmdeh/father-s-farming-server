const openApi = require('../modules/open-api/request');
const { Market } = require('../database/schema/marketSchema');

const getMarketCode = async () => {
    let result = await Market.find().then(toResponse);

    if(result.length === 0) {
        const apiResult = await openApi.getMarketCode();

        const savePromises = apiResult.data.map(async (data) => {
            const market = new Market({
                name: data.codeName,
                code: data.codeId
            });
            return market.save(); // Promise 반환
        });
    
        result = await Promise.all(savePromises)
            .then(toResponse);
    }

    return result;
}

const toResponse = (result) => {
    return result.map(data => {
        return {
            name: data.name,
            code: data.code
        }
    }).sort((a, b) => a.name.localeCompare(b.name));
}

module.exports = {
    getMarketCode
}
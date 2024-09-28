const openApi = require('../modules/open-api/request');
const { Market } = require('../database/schema/marketSchema');
const { Products } = require('../database/schema/productSchema');

// 시장 코드 조회
const getMarketCode = async () => {

    // 이름으로 정렬
    const sort = (result) => 
        result
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(data => {
                return {
                    name: data.name,
                    code: data.code
                };
            });

    let result = await Market.find().then(sort);

    if(result.length === 0) {
        const apiResult = await openApi.getMarketCode();

        const savePromises = apiResult.data.map(async (data) => {
            const market = new Market({
                name: data.codeName,
                code: data.codeId
            });
            return market.save();
        });
    
        result = await Promise.all(savePromises)
            .then(sort);
    }

    return result;
    
}

// 품목 코드 조회
const getProductCode = async (pageNo) => {
    // const result = await openApi.getProductCode(pageNo);

    let result = await Products.find();
    

    return result;
}



module.exports = {
    getMarketCode,
    getProductCode,
}
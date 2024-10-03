const openApi = require('../modules/open-api/request');
const productUpdate = require('../modules/cron/productUpdate')
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

    // 데이터가 없는 경우
    if(result.length === 0) {
        const apiResult = await openApi.getMarketCode();
        // TODO: 코드 분리 필요
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
const getProductCode = async ({ large = '00', mid = '00', small = '00' }) => {
    let result = await Products.find();    
    console.log({large, mid, small})
    return result;
}




module.exports = {
    getMarketCode,
    getProductCode,
}
const openApi = require('../modules/open-api/request');
const { Market } = require('../database/schema/marketSchema');
const { Products } = require('../database/schema/productSchema');
const { Coporate } = require('../database/schema/coporateSchema');
const coporateCron = require('../modules/cron/coporate');

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
    let pipeline = [];

    // 대분류 조회
    if (large === '00') {
        let match = {
            $match: {}
        };
        let project = {
            $project: {
                mid: 0 // mid 제외
            }
        };
        pipeline.push(match, project);
    } 
    // 중분류 조회
    else if (mid === '00') {
        let match = {
            $match: {
                code: large
            }
        };
        let project = {
            $project: {
                mid: {
                    small: 0 // mid의 small 필드 제외
                }
            }
        };
        pipeline.push(match, project);
    } 
    // 소분류 조회
    else if (small === '00') {
        pipeline.push(
            { $match: { code: large } }, // 대분류 코드로 필터링
            { $unwind: '$mid' }, // mid 배열을 펼침
            { $match: { 'mid.code': mid } }, // mid 배열의 코드로 필터링
            { $project: { // mid 정보만 포함
                _id: 0, // _id 제외
                mid: 1 // mid 포함
            }}
        );
    }

    // Aggregation 실행
    const products = await Products.aggregate(pipeline);
    return products;
};


const getCorporateCode = async() => {
    let corporates = await Coporate.find();

    if(corporates.length === 0) {
        await coporateCron.update();
        corporates = await Products.find();
    }

    return corporates;
}



module.exports = {
    getMarketCode,
    getCorporateCode,
    getProductCode,
}
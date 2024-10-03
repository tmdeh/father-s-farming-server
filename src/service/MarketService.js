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

    // 데이터가 없는 경우
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
const getProductCode = async (pageNo, size) => {
    const toDocument = (data) => {
        const result = {
            large: []
        };
    
        const largeMap = new Map();
    
        for (let e of data) {
            // 대분류 처리
            if (!largeMap.has(e.large)) {
                largeMap.set(e.large, {
                    name: e.largeName,
                    code: e.large,
                    mid: []
                });
                result.large.push(largeMap.get(e.large));
                continue;
            }
    
            const largeEntry = largeMap.get(e.large);
    
            // 대분류 별로 독립적인 midMap 생성
            if (!largeEntry.midMap) {
                largeEntry.midMap = new Map();
            }
    
            // 중분류 처리
            if (!largeEntry.midMap.has(e.mid)) {
                const midObj = {
                    name: e.midName,
                    code: e.mid,
                    small: []
                };
                largeEntry.mid.push(midObj);
                largeEntry.midMap.set(e.mid, midObj);
                continue;
            }
    
            if(e.goodName === '사용불가') {
                continue;
            }

            // 소분류 처리
            largeEntry.midMap.get(e.mid).small.push({
                name: e.goodName,
                code: e.small
            });
        }
        
        return result;
    };
    

    let result = await Products.find();

    if (result.length === 0) {
        let dataArr = [];
        for (let page = 1; page <= 18; page++) {
            let element = await openApi.getProductCode(page).then((res) => res.data);  // API 호출
            dataArr.push(element);
        }
        await Products.create({large: toDocument(dataArr.flat()).large});
        result = await Products.find();
    }

    return result;
}




module.exports = {
    getMarketCode,
    getProductCode,
}
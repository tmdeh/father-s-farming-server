const cron = require('node-cron');
const openApi = require('../open-api/request');
const { Products } = require('../../database/schema/productSchema');

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

const update = async() => {
    await Products.deleteMany();
    let dataArr = [];
    for (let page = 1; page <= 18; page++) {
        let element = await openApi.getProductCode(page).then((res) => res.data);  // API 호출
        dataArr.push(element);
    }
    await Products.create({large: toDocument(dataArr.flat()).large});
}

const scheduleUpdate = () => {
    cron.schedule('0 9 * * 1', () => update(), {
      timezone: "Asia/Seoul"  // 한국 시간대 설정
    });
    console.log("updated product code");
}


module.exports = {
    scheduleUpdate,
    update
};
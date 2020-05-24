module.exports = async function (context, dbclient, enumtype, language) {
    return new Promise ((resolve, reject) => {
        const query = {
            type: enumtype,
            language: language
        };
        dbclient.collection('enums').find(query).toArray((err, items) => {
            if (err) {
                context.log(err);
                return reject(err);
            }
            const obj = {};
            for (const item of items) {
                obj[item.code] = item.desc;
            }
            return resolve(obj);
        });
    });
};

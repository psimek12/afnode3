const dbinit = require('../dbcommon.js');
const getEnum = require('../enumfuncs.js');
let client = null;

module.exports = async function (context, req) {
    context.log('Running');
    
    if (!client && !(client = await dbinit(context, process.env.COSMOSDB_CONNECT_STRING, 'afnode3db'))) {
        return context.done();
    } else {
        context.log('Already connected to DB.');
    }

    const {query: {type: enumType, language}} = req;
    if (enumType && language) {
        const enumObj = await getEnum(context, client, enumType, language);
        context.res = {
            body: enumObj,
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass the enumType and language of the enum"
        };
    }
    return context.done();
};
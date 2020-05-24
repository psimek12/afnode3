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
    
    const {query: {enumType, language, value}} = req;
    if (enumType && language && value) {
        const enumObj = await getEnum(context, client, enumType, language);
        if (Object.values(enumObj).includes(value)) {
            context.res = {
                body: {exists: true},
                headers: {'Content-Type': 'application/json'}
            };
            return context.done();
        }
    }
    
    context.res = {
        body: {
            exists: false,
            message: `Enum of the type '${enumType}' does not have value '${value}' in the language '${language}'`
        },
        headers: {'Content-Type': 'application/json'}
    };
    return context.done();
};

const maxmind = require('maxmind');
const IPCIDR = require("ip-cidr");
 
const TIMEZONE_MMD_PATH = './data/GeoLite2-City.mmdb'
let _timezonesLookup = null;

const _validateCIDR = (ip, ipRanges) => {
    for (const ipRange of ipRanges) {
        const cidr = new IPCIDR(ipRange);
        
        if (cidr.contains(ip)) {
            return true;
        }
    }

    return false;
}

const _validateLocation = async (ip, timezone) => {
    if (!_timezonesLookup) {
        _timezonesLookup = await maxmind.open(TIMEZONE_MMD_PATH);
    }

    return _timezonesLookup.get(ip).location.time_zone === timezone;
}

const getContext = async (name, ip, dataStore) => {
    const contextObject = await dataStore.get(name);
    let isAllowed = true;

    if (!contextObject) {
        throw { status: 404, message: `resource '${name}' not found` };
    }

    if (contextObject.ipRange) {
        isAllowed = isAllowed && _validateCIDR(ip, contextObject.ipRange);
    }

    if (isAllowed && contextObject.location) {
        isAllowed = isAllowed && await _validateLocation(ip, contextObject.location);
    }

    if (!isAllowed) {
        throw { status: 403, message: 'forbidden' };
    }

    return contextObject.context;
};

module.exports = getContext;

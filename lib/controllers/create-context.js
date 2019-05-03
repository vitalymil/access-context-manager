
const IPCIDR = require("ip-cidr");

const _validateAttributesTypes = (attributes) => {
    const errorObject = { status: 400 };

    for (const attribute in attributes) {
        if (attribute === 'ipRange') {
            if (!Array.isArray(attributes[attribute])) {
                errorObject.message = `attribute 'ipRange' is not an array`;
            }
            else {
                for (const cidr of attributes[attribute]) {
                    if (typeof(cidr) !== 'string') {
                        errorObject.message = `attribute 'ipRange' has non-string element`;
                    }
                    else if (!(new IPCIDR(cidr)).isValid) {
                        errorObject.message = `attribute 'ipRange' has invalid CIDR value`;
                    }
                }
            }
        }
        else if (typeof(attributes[attribute]) !== 'string') {
            errorObject.message = `attribute '${attribute}' is not a string`;
        }

        if (errorObject.message) {
            throw errorObject;
        }
    }

    return true;
};

const _validateAttributesExists = (attributes) => {
    const errorObject = { status: 400 };

    if (!attributes.name) { 
        errorObject.message = `missing 'name' attribute`; 
    }
    else if (!attributes.context) {
        errorObject.message = `missing 'context' attribute`; 
    }
    else if ((!attributes.ipRange || attributes.ipRange.length === 0) && !attributes.location) {
        errorObject.status = 403;
        errorObject.message = `missing both 'ipRange' and 'location' attribute ` + 
            `(at least one must be present)`; 
    }

    if (errorObject.message) {
        throw errorObject;
    }

    return true;
}

const _validateNoExtraAttributes = (attributes) => {
    const attributeNames = Object.keys(attributes);
    const validAttributeNames = ['name', 'ipRange', 'context', 'location'];

    if (attributeNames.filter(
            attributeName => !validAttributeNames.includes(attributeName)
        ).length > 0
    ) {
        throw { status: 400, message: `got invalid attribute name` }
    }

    return true;
}

const createContext = async (attributes, dataStore) => {
    _validateNoExtraAttributes(attributes);
    _validateAttributesExists(attributes);
    _validateAttributesTypes(attributes);

    try {
        await dataStore.create(attributes);
    }
    catch (err) {
        if (err === 'NAME_EXISTS') {
            throw { status: 409, message: `name '${attributes.name}' already exists` };
        }
        
        throw err;
    }
}

module.exports = createContext;

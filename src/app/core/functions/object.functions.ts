export function isJsObject(object: any) {
    return object !== null && object !== undefined && typeof object === 'object';
}

export function removeNullOrEmptyField(object: any) {
    Object.keys(object).forEach((key) => {
        if (!object[key]) {
            delete object[key];
        } else if (Array.isArray(object[key])) {
            object[key] = (object[key] || []).map((a: any) => removeNullOrEmptyField(a));
        }
    });
    return object;
}

export function getErrorMsg(err: any) {
    let errMsg: string =
        typeof err == 'string'
            ? err
            : err.hasOwnProperty('msg')
            ? err.msg
            : err.hasOwnProperty('error_description')
            ? err.error_description
            : err.hasOwnProperty('error')
            ? err.error
            : err.hasOwnProperty('message')
            ? err.message
            : JSON.stringify(err);
    if (typeof errMsg == 'object') errMsg = getErrorMsg(errMsg);
    if (errMsg.toLowerCase().includes('no http resource was found')) errMsg = '';

    return errMsg || 'Something went wrong';
}

export function cleanKeys(data: any[], deleteKeys: string[]) {
    // There is nothing to be done if `data` is not an object,
    if (typeof data != 'object') return;
    if (!data) return; // null object

    for (const key in data) {
        if (deleteKeys.includes(key)) {
            delete data[key];
        } else {
            // If the key is not deleted from the current `data` object,
            // the value should be check for black-listed keys.
            cleanKeys(data[key], deleteKeys);
        }
    }
}

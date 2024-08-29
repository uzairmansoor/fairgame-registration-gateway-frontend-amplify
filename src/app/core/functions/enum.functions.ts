export function enumToArray(enumObject: any): any[] {
    var array = [];
    for (var key in enumObject) array.push({ key, value: enumObject[key] });
    return array;
}

export function enumToObject(enumObject: any): Object {
    var object: any = {};
    for (var key in enumObject) object[key] = enumObject[key];
    return object;
}

import { extractObjectValue } from './common.functions';

export function removeDuplicates(data: string[]) {
    return [...new Set(data)];
}

export function getArrayIntersection(sourceArray: any[], destinationArray: any[], propToCompare = ''): any[] {
    if (!sourceArray.length) {
        return [];
    }

    const intersection = sourceArray.filter((sourceObj) =>
        (destinationArray || [])
            .map((destinationObj) => extractObjectValue(destinationObj, propToCompare))
            .includes(extractObjectValue(sourceObj, propToCompare))
    );

    return intersection;
}

/**
 * Split the array into multiple, smaller arrays of the given `size`.
 *
 * @param {Array} array
 * @param {Number} size
 *
 * @returns {Array[]}
 */
export function splitArray(array: any[], size: number) {
    const chunks = [];
    array = [].concat(...array);
    while (array.length) {
        chunks.push(array.splice(0, size));
    }
    return chunks;
}

/**
 * Sort the array by given field 'sortFieldPattern' based on given 'sortFieldType'.
 *
 * @param {Array} array
 * @param {String} sortFieldPattern
 * @param {Boolean, Number, String, Date} sortFieldType
 *
 * @returns {Array[]}
 */
export function sortArray<T>(
    array: T[],
    sortFieldPattern: string,
    sortFieldType: 'boolean' | 'number' | 'string' | 'date',
    sortDirection: 'asc' | 'desc' = 'asc'
) {
    return array.sort((a, b) => {
        const fieldA = extractObjectValue(a, sortFieldPattern);
        const fieldB = extractObjectValue(b, sortFieldPattern);

        switch (sortFieldType) {
            case 'boolean':
            case 'number':
                return sortDirection == 'asc' ? fieldA - fieldB : fieldB - fieldA;
            case 'string':
                return sortDirection == 'asc' ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
            case 'date':
                if (fieldA instanceof Date && fieldB instanceof Date) {
                    return sortDirection == 'asc' ? fieldA.getTime() - fieldB.getTime() : fieldB.getTime() - fieldA.getTime();
                } else {
                    throw new Error('Invalid date values for sorting');
                }
            default:
                throw new Error(`Invalid sortFieldType: ${sortFieldType}`);
        }
    });
}

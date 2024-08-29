export function replaceAll(s: string, searchValue: string, replaceValue: string) {
    return s.replace(new RegExp(searchValue, 'g'), replaceValue);
}

export function encode(value: any) {
    if (typeof value == 'object') value = JSON.stringify(value);
    return btoa(btoa(encodeURIComponent(value)));
}

export function decode(value: string) {
    return decodeURIComponent(atob(atob(value)));
}

export function stringToArray(value: string, splitBy: string = ' ') {
    if (!value) return [];
    return value.split(splitBy).filter((x) => !!x);
}

/*
 * Capitalize the first letter of a string being
 */
export function upperCaseFirstLetter(str: string, force: boolean): string {
    str = force ? str.toLowerCase() : str;
    return str.replace(/(\b)([a-zA-Z])/, function (firstLetter: string) {
        return firstLetter.toUpperCase();
    });
}

export function splitCamelCase(word: string): string {
    let output: string[];
    if (typeof word !== 'string') {
        throw new Error('The "word" parameter must be a string.');
    }

    output = [];

    const split = word.split('_');
    split.forEach((text: string) => {
        output.push(upperCaseFirstLetter(text, true));
    });
    return output.join(' ');
}

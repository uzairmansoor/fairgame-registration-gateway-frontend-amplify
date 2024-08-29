import { FormGroup } from '@angular/forms';
import { baseModelConfigKey } from '@app/app.config';
import * as _ from 'lodash';
import { FileMimeType, FileType } from '../enums';

export function trackByFn(index: number, item: any) {
    return item[baseModelConfigKey] || index;
}

export function generateRandomId(negative = false) {
    return (+new Date() + Math.floor(Math.random() * (999 - 99 + 1) + 99)) * (negative ? -1 : 1);
}

export function base64toBlob(b64Data: string, contentType = 'image/png', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

export function blobToBase64(blob: Blob) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

export function dataURItoBlob(dataUrl: any) {
    const arr = dataUrl.split(','),
        mime = arr[0].match(/:(.*?);/)[1];
    const byteString = atob(dataUrl.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: mime });
    const fileName = `${(generateRandomId() * -1).toString()}.${mime.replace('image/', '')}`;
    return new File([blob], fileName, { type: mime });
}

export function blobToDataURI(file: File) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = (event: any) => resolve(`data:${file.type};base64,${btoa(event.target.result)}`);
        reader.onerror = () => {
            console.log("can't read the file");
            reject();
        };
    });
}

export function createBlobUrl(blob: Blob) {
    return URL.createObjectURL(new Blob([blob], { type: blob.type }));
}

export function downloadFile(blob: Blob, fileName: string) {
    const url = createBlobUrl(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
}

export function extractObjectValue(obj: any, pattern: string): any {
    if (!pattern || pattern.trim() == '') return obj;
    return _.get(obj, pattern);
}

export function getValidationSummary(formGroup: FormGroup) {
    let errorsArr: any[] = [];
    Object.keys(formGroup.controls).forEach((controlName) => {
        let control = formGroup.controls[controlName];
        let errors = control.errors;
        if (errors === null || errors.count === 0) {
            return;
        }
        // Handle the 'required' case
        if (errors.required) {
            errorsArr.push({ control, err: `${controlName} required` });
        }
        // Handle 'minlength' case
        if (errors.minlength) {
            errorsArr.push({
                control,
                err: `${controlName} minimum length is ${errors.minlength.requiredLength}.`,
            });
        }
        // Handle 'maxlength' case
        if (errors.maxlength) {
            errorsArr.push({
                control,
                err: `${controlName} maximum length is ${errors.maxlength.requiredLength}.`,
            });
        }
    });
    return errorsArr;
}

export function getMimeTypesFromFileTypes(fileTypes: FileType[]) {
    let acceptTypes = [];
    for (let i = 0; i < fileTypes.length; i++) {
        const fileType = fileTypes[i];
        if ([FileType.JPG, FileType.JPEG].includes(fileType)) acceptTypes.push(FileMimeType.JPEG);
        else if ([FileType.PNG].includes(fileType)) acceptTypes.push(FileMimeType.PNG);
        else if ([FileType.PDF].includes(fileType)) acceptTypes.push(FileMimeType.PDF);
        else if ([FileType.DOC].includes(fileType)) acceptTypes.push(FileMimeType.DOC);
        else if ([FileType.DOCX].includes(fileType)) acceptTypes.push(FileMimeType.DOCX);
        else if ([FileType.XLS].includes(fileType)) acceptTypes.push(FileMimeType.XLS);
        else if ([FileType.XLSX].includes(fileType)) acceptTypes.push(FileMimeType.XLSX);
    }
    return [...new Set(acceptTypes)];
}

export function humanFileSize(size: number) {
    var i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return +(size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
}

export function toInteger(value: any): number {
    return parseInt(`${value}`, 10);
}

export function isNumber(value: any): value is number {
    return !isNaN(toInteger(value));
}

export function padNumber(value: number) {
    if (isNumber(value)) {
        return `0${value}`.slice(-2);
    } else {
        return '';
    }
}

export function getContrastColorHex(hex: string) {
    const threshold = 130;
    const hexToRGB = (h: string) => {
        const hexValue = h.charAt(0) === '#' ? h.substring(1, 7) : h;
        return {
            red: parseInt(hexValue.substring(0, 2), 16),
            blue: parseInt(hexValue.substring(2, 4), 16),
            green: parseInt(hexValue.substring(4, 6), 16),
        };
    };
    const { red, green, blue } = hexToRGB(hex);
    const cBrightness = (red * 299 + green * 587 + blue * 114) / 1000;

    return cBrightness > threshold ? '#000000' : '#ffffff';
}

/**
 * Check value not empty.
 * @param item
 * @returns {boolean}
 */
export function isNotEmpty(item: any): boolean {
    return !isEmpty(item);
}

/**
 * Check value empty.
 * @param item
 * @returns {boolean}
 */
export function isEmpty(item: any) {
    if (item instanceof Array) {
        item = item.filter((val) => !isEmpty(val));
        return item.length === 0;
    } else if (item && typeof item === 'object') {
        for (var key in item) {
            if (item[key] === null || item[key] === undefined || item[key] === '') {
                delete item[key];
            }
        }
        return Object.keys(item).length === 0;
    } else {
        return !item || (item + '').toLocaleLowerCase() === 'null' || (item + '').toLocaleLowerCase() === 'undefined';
    }
}

export function isNullOrUndefined<T>(string: T | null | undefined): string is null | undefined {
    return typeof string === 'undefined' || string === null;
}

/**
 * The precision for a decimal (exact numeric applies only for decimal column), which is the maximum
 * number of digits that are stored.
 */
export function convertPrecisionFloatDigit(val: number, digit: number = 6) {
    return parseFloat(parseFloat(val.toString()).toFixed(digit));
}

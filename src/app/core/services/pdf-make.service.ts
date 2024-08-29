import { Injectable } from '@angular/core';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { CustomTableLayout, TDocumentDefinitions, TFontDictionary } from 'pdfmake/interfaces';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Injectable({ providedIn: 'root' })
export class PdfMakeService {
    constructor() {
        (<any>pdfMake).fonts = {
            Basetica: {
                normal: location.origin + '/assets/fonts/Basetica/Basetica.otf',
                bold: location.origin + '/assets/fonts/Basetica/Basetica-Bold.otf',
            },
        };
    }

    createPdf(
        documentDefinitions: TDocumentDefinitions,
        tableLayouts?: { [name: string]: CustomTableLayout },
        fonts?: TFontDictionary,
        vfs?: { [file: string]: string }
    ): pdfMake.TCreatedPdf {
        return pdfMake.createPdf(documentDefinitions, tableLayouts, fonts, vfs);
    }
}

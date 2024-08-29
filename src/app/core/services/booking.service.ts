import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { ApiResponse, Booking, Member } from '@app/core/models';
import { createBlobUrl, downloadFile, getErrorMsg, sortArray } from '@core/functions';
import { environment } from '@environments/environment';
import { Observable, catchError, finalize, map, of, take, tap } from 'rxjs';
import { PdfMakeService } from './pdf-make.service';
import { SpinnerService } from './spinner.service';

@Injectable({ providedIn: 'root' })
export class BookingService {
    bookingId: string = '';
    booking!: Booking;
    refreshBooking: boolean = false;

    private bookingPdfTemplateJson: any;

    constructor(private httpClient: HttpClient, private pdfMakeService: PdfMakeService) {
        this.loadBookingPdfTemplateJsonFile()
            .pipe(take(1))
            .subscribe((json) => (this.bookingPdfTemplateJson = json));
    }

    getBookingDetails() {
        return this.httpClient.get<ApiResponse<Booking>>(`${environment.apiBaseUrl}/bookings/${this.bookingId}`);
    }

    getBookingQrCode(): Observable<{ uri: string; blob?: Blob; base64?: string; loaded?: boolean }> {
        return this.httpClient.get(`${environment.apiBaseUrl}/bookings/${this.bookingId}/qr-code`, { responseType: 'blob' }).pipe(
            map((blob: Blob) => {
                return {
                    uri: createBlobUrl(blob),
                    blob,
                };
            })
        );
    }

    getMembers() {
        return this.httpClient
            .get<ApiResponse<{ memberCount: number; members: Member[] }>>(`${environment.apiBaseUrl}/bookings/${this.bookingId}/members`)
            .pipe(
                map((membersResponse) => {
                    if (membersResponse.success && membersResponse.data && membersResponse.data.members)
                        membersResponse.data.members = sortArray(membersResponse.data.members, 'leadBooker', 'boolean', 'desc');
                    return membersResponse;
                })
            );
    }

    getApplePass() {
        return this.httpClient
            .post(`${environment.apiBaseUrl}/bookings/${this.bookingId}/passes/apple`, null, { responseType: 'blob' })
            .pipe(tap((blob: Blob) => downloadFile(blob, `${this.bookingId}_${+new Date()}.pkpass`)));
    }

    getGooglePassLink() {
        return this.httpClient.post<ApiResponse<string>>(`${environment.apiBaseUrl}/bookings/${this.bookingId}/passes/google`, null);
    }

    updateGroup(payload: any) {
        return this.httpClient.put<ApiResponse<Booking>>(`${environment.apiBaseUrl}/bookings/${this.bookingId}/group`, payload).pipe(
            map((res) => {
                if (res.success == 1) {
                    this.booking = res.data;
                }
                return res;
            })
        );
    }

    updateMembers(members: Partial<Member>[]) {
        return this.httpClient.put<ApiResponse<Member[]>>(`${environment.apiBaseUrl}/bookings/${this.bookingId}/members`, {
            playersList: members,
        });
    }

    private loadBookingPdfTemplateJsonFile() {
        return this.httpClient.get('assets/data/bookingPdfTemplate.json');
    }

    generateBookingPDF(
        leadBookerName: string,
        bookingId: number,
        bookingDateTime: string,
        totalPlayer: number,
        gameTicket: number,
        foodToken: number,
        drinkToken: number,
        qrCodeImage: string
    ) {
        let jsonString = JSON.stringify(this.bookingPdfTemplateJson)
            .replace('<<LEAD_BOOKER_NAME>>', leadBookerName)
            .replace('<<BOOKING_ID>>', bookingId.toString())
            .replace('<<BOOKING_DATE_TIME>>', bookingDateTime)
            .replace('<<TOTAL_PLAYER>>', totalPlayer.toString())
            .replace('<<GAME_TICKET>>', gameTicket.toString())
            .replace('<<FOOD_TOKEN>>', foodToken.toString())
            .replace('<<DRINK_TOKEN>>', drinkToken.toString())
            .replace('<<QR_CODE_IMAGE>>', qrCodeImage);
        const documentDefinitions = JSON.parse(jsonString);
        if (!gameTicket) {
            const index = documentDefinitions.content.findIndex((_: any) => _.id == 'gameTicket');
            if (index >= 0) documentDefinitions.content.splice(index, 1);
        }
        if (!foodToken) {
            const index = documentDefinitions.content.findIndex((_: any) => _.id == 'foodToken');
            if (index >= 0) documentDefinitions.content.splice(index, 1);
        }
        if (!drinkToken) {
            const index = documentDefinitions.content.findIndex((_: any) => _.id == 'drinkToken');
            if (index >= 0) documentDefinitions.content.splice(index, 1);
        }
        documentDefinitions.pageMargins = [20, 10, 20, 10];
        return this.pdfMakeService.createPdf(documentDefinitions);
    }
}

@Injectable({
    providedIn: 'root',
})
export class BookingResolverService implements Resolve<Booking> {
    constructor(private bookingService: BookingService, private spinnerService: SpinnerService) {}
    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        const { booking, refreshBooking } = this.bookingService;
        if (booking && !refreshBooking) {
            return of(booking);
        }
        this.spinnerService.loadingText = 'Checking booking...';
        this.spinnerService.set(true);
        this.bookingService.bookingId = route.params.bookingId;
        return this.bookingService.getBookingDetails().pipe(
            map((res) => {
                if (res.success) {
                    this.bookingService.refreshBooking = false;
                    return res.data;
                }
                return res;
            }),
            catchError((error) => of(getErrorMsg(error))),
            finalize(() => this.spinnerService.set(false))
        );
    }
}

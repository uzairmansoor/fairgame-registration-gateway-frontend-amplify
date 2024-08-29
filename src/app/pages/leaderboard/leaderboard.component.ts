import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppRoutes } from '@app/app.routes';
import { getErrorMsg } from '@app/core/functions';
import { Booking, Member } from '@app/core/models';
import { BookingService, SpinnerService, UtilService } from '@app/core/services';
import { FormValidators } from '@app/core/validators';
import { BaseComponent } from '@app/shared/components/base-component';
import { finalize, takeUntil } from 'rxjs';

@Component({
    selector: 'app-leaderboard',
    templateUrl: './leaderboard.component.html',
    styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent extends BaseComponent {
    booking: Booking = this.bookingService.booking;
    message: string = '';

    formGroup: FormGroup = this.fb.group({
        groupName: [this.booking.group?.name, [Validators.required, Validators.maxLength(18), FormValidators.ProfaneValidator()]],
        members: this.fb.array([], FormValidators.DuplicateValidator('nickname', true)),
    });

    get members(): FormArray {
        return this.formGroup.controls['members'] as FormArray;
    }

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private bookingService: BookingService,
        private spinnerService: SpinnerService,
        private utilService: UtilService
    ) {
        super();
    }

    ngOnInit() {
        if (!this.bookingService.booking.group?.acceptedTerms) {
            this.router.navigate(['..', AppRoutes.TermsAndConditions], { relativeTo: this.route });
            return;
        }
        this.spinnerService.loadingText = 'Getting players...';
        this.spinnerService.set(true);
        this.getMembers((members: Member[]) => {
            this.booking = { ...this.booking, members };
            this.bookingService.booking = this.booking;
            this.spinnerService.set(false);
            this.generatePlayerControls();
        });
    }

    shareInvite() {
        const link = `${location.origin}/bookings/${this.booking.reservationId}/invite`;
        const text = `I'm inviting you to join my group, so that we can play together at Fairgame: ${link}`;
        this.utilService.share({
            title: document.title,
            text,
        });
    }

    submit() {
        this.message = '';
        if (this.formGroup.invalid) return;
        let groupName: string = this.formGroup.value.groupName;
        if (groupName) groupName = groupName.trim();

        let isGroupSaveRequired = this.booking.group?.name.trim() !== groupName.trim();
        const leadBooker = (this.formGroup.value.members as Member[]).find((m) => m.leadBooker);
        const leadbookerName = leadBooker?.nickname?.trim() || this.booking.leadbookerName;

        this.spinnerService.set(true);
        if (isGroupSaveRequired) this.saveGroup(groupName, leadbookerName);
        else this.updateMembers();
    }

    private saveGroup(groupName: string, leadBookerNickName: string) {
        this.spinnerService.loadingText = 'Saving group...';
        this.bookingService
            .updateGroup({ groupName })
            .pipe(takeUntil(this.destroyed$))
            .subscribe(
                (res) => {
                    if (!res.success || !res.data) {
                        this.spinnerService.set(false);
                        return;
                    }
                    const booking = {
                        ...this.booking,
                        ...res.data,
                    };
                    this.booking = booking;
                    this.bookingService.booking = this.booking;
                    this.updateMembers();
                },
                (err) => this.handleError(err)
            );
    }

    private getMembers(cb: any) {
        this.bookingService
            .getMembers()
            .pipe(takeUntil(this.destroyed$))
            .subscribe(
                (membersResponse) => {
                    if (!membersResponse.success || !membersResponse.data) return;
                    cb(membersResponse.data.members || []);
                },
                (err) => this.handleError(err)
            );
    }

    private updateMembers() {
        this.spinnerService.loadingText = 'Saving players...';
        this.bookingService
            .updateMembers(this.getPayloadForMembers())
            .pipe(
                takeUntil(this.destroyed$),
                finalize(() => this.spinnerService.set(false))
            )
            .subscribe(
                (res) => {
                    if (!res.success || !res.data) {
                        return;
                    }
                    this.bookingService.refreshBooking = true;
                    this.message = 'Changes saved successfully!';
                    this.formGroup.reset(this.formGroup.value);
                    this.formGroup.markAsPristine();
                },
                (err) => this.handleError(err)
            );
    }

    private generatePlayerControls() {
        const members = this.booking.members || [];
        for (let i = 0; i < this.booking.memberCount; i++) {
            this.members.push(this.getMemberFormGroup(members[i]));
        }
    }

    private getMemberFormGroup(member?: Member) {
        return this.fb.group({
            uid: [member?.uid],
            leadBooker: [member?.leadBooker || false],
            rfid: [member?.rfid],
            nickname: [member?.nickname, [Validators.maxLength(18), FormValidators.ProfaneValidator()]],
        });
    }

    private getPayloadForMembers(): Partial<Member>[] {
        return (this.formGroup.value.members as Member[])
            .filter((m) => !!m.uid || (!!m.nickname && !!m.nickname.trim()))
            .map((m) => {
                return {
                    uid: m.uid,
                    nickName: m.nickname,
                };
            });
    }

    private handleError(err: any) {
        this.spinnerService.set(false);
        console.error(getErrorMsg(err));
    }
}

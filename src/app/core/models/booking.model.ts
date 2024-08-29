export interface Booking {
    formattedEventDate: string;
    eventDate: string;
    eventTime: string;
    gameTime: string;
    memberCount: number;
    outStandingPayment: number;
    reservationId: number;
    leadbookerName: string;
    upgrades?: Upgrades;
    group?: Group;
    members?: Member[];
}

interface Upgrades {
    food1: number;
    drink1: number;
    game1: number;
}

interface Group {
    acceptedTerms: boolean;
    id: string;
    name: string;
    ownerId: string;
    locked: boolean;
}

export interface Member {
    uid?: string;
    nickname: string;
    leadBooker: boolean;
    email?: any;
    rfid?: any;
}

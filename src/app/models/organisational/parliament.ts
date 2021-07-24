import { GoverningParty, GoverningRelationship } from "./governing-party";

export class Parliament {
    number: number;
    start: Date;
    end: Date;
    governingParties: GoverningParty[];

    constructor(get: any) {
        this.number = get.number;
        this.start = new Date(get.start);
        this.end = get.end == null ? null : new Date(get.end);
        this.governingParties = get.governingParties.map(g => new GoverningParty(g));
    }
}
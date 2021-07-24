import { Party } from "./party";

export class Tenure {
    party: Party;
    start: Date;
    end: Date;
    electorate: string;

    constructor(get: any) {
        this.party = get.party == null ? null : new Party(get.party);
        this.start = new Date(get.start);
        this.end = get.end == null ? null : new Date(get.end);
        this.electorate = get.electorate;
    }
}
import { Party } from "./party";

export class GoverningParty {
    party: Party;
    relationship: GoverningRelationship;

    constructor(get: any) {
        this.party = new Party(get.party);
        this.relationship = get.relationship == null ? null : GoverningRelationship[get.relationship as string];
    }
}

export enum GoverningRelationship {
    Coalition,
    ConfidenceAndSupply,
    CooperationAgreement
}
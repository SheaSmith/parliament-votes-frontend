import { Member } from "./organisational/member"
import { Parliament } from "./organisational/parliament"
import { Party } from "./organisational/party"

export class Config {
    members: { [memberId: number] : Member } = {};
    parties: { [partyId: number] : Party } = {};
    parliaments: { [parliamentNumber: number] : Parliament } = {};

    constructor (get: any) {
        Object.keys(get.members).forEach(k => {
            this.members[k] = new Member(get.members[k]);
        });

        Object.keys(get.parties).forEach(k => {
            this.parties[k] = new Party(get.parties[k]);
        });

        Object.keys(get.parliaments).forEach(k => {
            this.parliaments[k] = new Parliament(get.parliaments[k]);
        });
    }
}
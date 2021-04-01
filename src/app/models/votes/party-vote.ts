import { Member } from "../organisational/member";
import { Party } from "../organisational/party";
import { Vote } from "./vote";

export class PartyVote extends Vote {
    party: Party;
    member: Member;
    numberOfVotes: number;
    splitPartyVotes: Member[];

    constructor(get: any) {
        super(get);
        this.party = get.party == null ? null : new Party(get.party);
        this.member = get.member == null ? null : new Member(get.member);
        this.numberOfVotes = get.numberOfVotes;
        this.splitPartyVotes = get.splitPartyVotes == null ? null : get.splitPartyVotes.map(s => new Member(s));
    }
}
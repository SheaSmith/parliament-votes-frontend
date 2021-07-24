import { Config } from "../config";
import { Member } from "../organisational/member";
import { Party } from "../organisational/party";
import { Vote } from "./vote";

export class PartyVote extends Vote {
    party: Party;
    member: Member;
    numberOfVotes: number;
    splitPartyVotes: Member[];

    constructor(get: any, config: Config) {
        super(get);
        this.party = get.partyId == null ? null : new Party(config.parties[get.partyId]);
        this.member = get.memberId == null ? null : new Member(config.members[get.memberId]);
        this.numberOfVotes = get.numberOfVotes;
        this.splitPartyVotes = get.splitPartyVotes == null ? [] : get.splitPartyVotes.map(s => new Member(config.members[s]));
    }
}
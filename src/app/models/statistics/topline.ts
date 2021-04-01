export class Topline {
    votes: number;
    partyVotes: number;
    voiceVotes: number;
    personalVotes: number;
    members: number;
    parliaments: number;
    years: number;
    parties: number;

    constructor(get: any) {
        this.votes = get.votes;
        this.partyVotes = get.partyVotes;
        this.voiceVotes = get.voiceVotes;
        this.personalVotes = get.personalVotes;
        this.members = get.members;
        this.parliaments = get.parliaments;
        this.years = get.years;
        this.parties = get.parties;
    }
}
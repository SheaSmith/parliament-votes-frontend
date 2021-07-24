import { Config } from "./config";
import { Bill } from "./legislation/bill";
import { Member } from "./organisational/member";
import { Parliament } from "./organisational/parliament";
import { PartyVote } from "./votes/party-vote";
import { PersonalVote } from "./votes/personal-vote";
import { VoiceVote } from "./votes/voice-vote";

export class Question {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    timestamp: Date;
    type: QuestionType;
    stage: Stage;
    clause: string;
    personalVoteConservativeViewPoint: boolean;
    member: Member;
    bill: Bill;
    parliament: Parliament;
    voiceVote: VoiceVote;
    partyVotes: PartyVote[];
    personalVotes: PersonalVote[];

    constructor(get: any, config: Config) {
        this.id = get.id;
        this.title = get.title;
        this.subtitle = get.subtitle;
        this.description = get.description;
        this.timestamp = new Date(get.timestamp);
        this.type = QuestionType[get.type as string];
        this.stage = get.stage == null ? null : Stage[get.stage as string];
        this.clause = get.clause;
        this.personalVoteConservativeViewPoint = get.personalVoteConservativeViewPoint;
        this.member = get.memberId == null ? null : new Member(config.members[get.memberId]);
        this.bill = get.bill == null ? null : new Bill(get.bill, config);
        this.parliament = get.parliamentNumber == null ? null : new Parliament(config.parliaments[get.parliamentNumber]);
        this.voiceVote = get.voiceVote == null || get.voiceVote.length == 0 ? null : new VoiceVote(get.voiceVote[0]);
        this.partyVotes = get.partyVotes == null || get.partyVotes.length == 0 ? null : get.partyVotes.map(p => new PartyVote(p, config));
        this.personalVotes = get.personalVotes == null || get.personalVotes.length == 0 ? null : get.personalVotes.map(p => new PersonalVote(p, config));
    }

    hasPassed(): boolean | string {
        if (this.voiceVote != null) {
            return this.voiceVote.position;
        }

        if (this.partyVotes != null) {
            let yesVotes = 0;
            let noVotes = 0;

            let complexPositions: { [position: string]: number } = {};

            this.partyVotes.forEach(p => {
                if (p.position != null) {
                    if (p.position) {
                        yesVotes += p.numberOfVotes;
                    }
                    else {
                        noVotes += p.numberOfVotes;
                    }
                }
                else {
                    if (complexPositions[p.complexPosition] != null) {
                        complexPositions[p.complexPosition] += p.numberOfVotes;
                    }
                    else {
                        complexPositions[p.complexPosition] = p.numberOfVotes;
                    }
                }
            });

            if (yesVotes == 0 && noVotes == 0) {
                let maxVotes = 0;
                let position = '';

                Object.keys(complexPositions).forEach(key => {
                    if (complexPositions[key] > maxVotes) {
                        maxVotes = complexPositions[key];
                        position = key;
                    }
                });

                return position;
            }
            else {
                return yesVotes > noVotes;
            }
        }

        if (this.personalVotes != null) {
            let yesVotes = 0;
            let noVotes = 0;

            let complexPositions: { [position: string]: number } = {};

            this.personalVotes.forEach(p => {
                if (p.position != null) {
                    if (p.position) {
                        yesVotes++;
                    }
                    else {
                        noVotes++;
                    }
                }
                else {
                    if (complexPositions[p.complexPosition] != null) {
                        complexPositions[p.complexPosition]++;
                    }
                    else {
                        complexPositions[p.complexPosition] = 1;
                    }
                }
            });

            if (yesVotes == 0 && noVotes == 0) {
                let maxVotes = 0;
                let position = '';

                Object.keys(complexPositions).forEach(key => {
                    if (complexPositions[key] > maxVotes) {
                        maxVotes = complexPositions[key];
                        position = key;
                    }
                });

                return position;
            }
            else {
                return yesVotes > noVotes;
            }
        }
    }

    getPassedText(): string {
        if (this.hasPassed() == true) {
            return 'Passed';
        }
        else if (this.hasPassed() == false) {
            return 'Defeated';
        }
        else {
            return `Position "${this.hasPassed()}" approved `;
        }
    }

    getPassedIcon(): string {
        if (this.hasPassed() == true) {
            return 'fa-check';
        }
        else if (this.hasPassed() == false) {
            return 'fa-times';
        }
        else {
            return 'fa-';
        }
    }

    getPassedColour(): string {
        if (this.hasPassed() == true) {
            return 'success';
        }
        else if (this.hasPassed() == false) {
            return 'danger';
        }
        else {
            return 'dark';
        }
    }

    getTypeText(): string {
        if (this.type == QuestionType.Motion) {
            return 'Motion';
        }
        else if (this.type == QuestionType.BillReading) {
            return 'Bill';
        }
        else if (this.type == QuestionType.SupplementaryOrderPaper) {
            return 'Supplementary Order Paper';
        }
        else if (this.type == QuestionType.BillPart) {
            return 'Bill part';
        }
        
        return 'Amendment';
    }

    getTypeIcon(): string {
        if (this.type == QuestionType.Motion) {
            return 'fa-gavel';
        }
        else if (this.type == QuestionType.BillReading) {
            return 'fa-file-alt';
        }
        else if (this.type == QuestionType.SupplementaryOrderPaper) {
            return 'fa-exchange-alt';
        }
        else if (this.type == QuestionType.BillPart) {
            return 'fa-puzzle-piece';
        }
        
        return 'fa-edit';
    }

    getStageText(): string {
        if (this.stage == Stage.FirstReading) {
            return 'First reading';
        }
        else if (this.stage == Stage.SecondReading) {
            return 'Second reading';
        }
        else if (this.stage == Stage.Committee) {
            return 'Committee of the whole';
        }
        else if (this.stage == Stage.ThirdReading) {
            return 'Third reading';
        }
        
        return null;
    }

    getVotesInFavour(): number {
        if (this.partyVotes != null) {
            let yesVotes = 0;
            this.partyVotes.forEach(p => {
                if (p.position) {
                    yesVotes += p.numberOfVotes;
                }
            });

            return yesVotes;
        }

        if (this.personalVotes != null) {
            let yesVotes = 0;
            this.personalVotes.forEach(p => {
                if (p.position) {
                    yesVotes += 1;
                }
            });

            return yesVotes;
        }
    }

    getVotesOpposed(): number {
        if (this.partyVotes != null) {
            let noVotes = 0;
            this.partyVotes.forEach(p => {
                if (p.position == false) {
                    noVotes += p.numberOfVotes;
                }
            });

            return noVotes;
        }

        if (this.personalVotes != null) {
            let noVotes = 0;
            this.personalVotes.forEach(p => {
                if (p.position == false) {
                    noVotes += 1;
                }
            });

            return noVotes;
        }
    }

    getTotalVotes(): number {
        if (this.partyVotes != null) {
            let votes = 0;
            this.partyVotes.map(p => p.numberOfVotes).forEach(n => votes += n);
            return votes;
        }

        else if (this.personalVotes != null) {
            return this.personalVotes.length;
        }
    }
}

export enum QuestionType {
    Motion,
    BillReading,
    SupplementaryOrderPaper,
    BillPart,
    Amendment
}

export enum Stage {
    FirstReading,
    SecondReading,
    Committee,
    ThirdReading
}
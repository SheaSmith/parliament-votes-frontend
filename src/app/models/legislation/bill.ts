import { Config } from "../config";
import { Member } from "../organisational/member";
import { Parliament } from "../organisational/parliament";
import { Question } from "../question";

export class Bill {
    id: number;
    title: string;
    description: string;
    number: string;
    lastUpdated: Date;
    members: Member[];
    type: BillType;
    parliaments: Parliament[];
    questions: Question[];

    constructor(get: any, config: Config) {
        this.id = get.id;
        this.title = get.title;
        this.description = get.description;
        this.number = get.number;
        this.lastUpdated = get.lastUpdated;
        this.members = get.memberIds.map(m => new Member(config.members[m]));
        this.type = BillType[get.type as string];
        this.parliaments = get.parliamentNumbers.map(p => new Parliament(config.parliaments[p]));
        this.questions = get.questions == null ? null : get.questions.map(q => new Question(q, config));
    }
}

export enum BillType {
    Government,
    Members,
    Private,
    Local
}
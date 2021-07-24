import { Config } from "../config";
import { Member } from "../organisational/member";
import { Vote } from "./vote";

export class PersonalVote extends Vote {
    member: Member;
    proxy: boolean;

    constructor(get: any, config: Config) {
        super(get);
        this.member = new Member(config.members[get.memberId]);
        this.proxy = get.proxy;
    }
}
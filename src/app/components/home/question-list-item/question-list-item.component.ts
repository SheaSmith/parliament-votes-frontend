import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { getTextClass } from 'src/app/text-color-utility';
import { Member } from '../../../models/organisational/member';
import { Party } from '../../../models/organisational/party';
import { Question } from '../../../models/question';
declare var $;

@Component({
  selector: 'app-question-list-item',
  templateUrl: './question-list-item.component.html',
  styleUrls: ['./question-list-item.component.scss'],
  animations: [
    trigger('expandContract', [
      transition(':enter', [
        style({height: '0px'}),
        animate('200ms ease-in', style({height: '*'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({height: '0px'}))
      ])
    ])
  ]
})
export class QuestionListItemComponent implements OnInit {
  @Input()
  question: Question;

  getTextClass = getTextClass;

  votesInFavour: { numberOfVotes: number, party: Party, member: Member }[] = [];
  votesOpposed: { numberOfVotes: number, party: Party, member: Member }[] = [];

  showVoteDetails = false;

  constructor() { }

  ngOnInit(): void {
    if (this.question.partyVotes != null) {
      this.question.partyVotes.forEach(p => {
        if (p.position == true) {
          this.votesInFavour.push({ numberOfVotes: p.numberOfVotes, party: p.party, member: p.member });
        }
        else if (p.position == false) {
          this.votesOpposed.push({ numberOfVotes: p.numberOfVotes, party: p.party, member: p.member });
        }
      });
    }

    if (this.question.personalVotes != null) {
      this.question.personalVotes.forEach(p => {
        const partyAtTime = p.member.tenures.filter(t => t.start <= this.question.timestamp && (t.end == null || t.end >= this.question.timestamp))[0].party;

        let partyIndex = -1;

        if (p.position == true && partyAtTime != null) {
          const partiesMatch = this.votesInFavour.filter(v => v.party != null && v.party.id == partyAtTime.id);

          if (partiesMatch.length != 0) {
            partyIndex = this.votesInFavour.indexOf(partiesMatch[0]);
          }

          if (partyIndex == -1) {
            this.votesInFavour.push({ numberOfVotes: 1, party: partyAtTime, member: null });
          }
          else {
            this.votesInFavour[partyIndex].numberOfVotes += 1;
          }
        }
        else if (p.position == false && partyAtTime != null) {
          const partiesMatch = this.votesOpposed.filter(v => v.party != null && v.party.id == partyAtTime.id);

          if (partiesMatch.length != 0) {
            partyIndex = this.votesOpposed.indexOf(partiesMatch[0]);
          }

          if (partyIndex == -1) {
            this.votesOpposed.push({ numberOfVotes: 1, party: partyAtTime, member: null });
          }
          else {
            this.votesOpposed[partyIndex].numberOfVotes += 1;
          }
        }
        else if (p.position == true && partyAtTime == null) {
          this.votesInFavour.push({ numberOfVotes: 1, party: null, member: p.member });
        }
        else if (p.position == false && partyAtTime == null) {
          this.votesOpposed.push({ numberOfVotes: 1, party: null, member: p.member });
        }
      });
    }

    this.votesInFavour.sort((a, b) => {
      return b.numberOfVotes - a.numberOfVotes;
    });

    this.votesOpposed.sort((a, b) => {
      return a.numberOfVotes - b.numberOfVotes;
    });
  }

}

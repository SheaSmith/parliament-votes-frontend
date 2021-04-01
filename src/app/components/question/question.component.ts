import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from 'src/app/models/organisational/member';
import { Party } from 'src/app/models/organisational/party';
import { QuestionsService } from 'src/app/services/questions.service';
import { Question } from '../../models/question';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  question: Question;

  votesInFavour: { numberOfVotes: number, party: Party, member: Member }[] = [];
  votesOpposed: { numberOfVotes: number, party: Party, member: Member }[] = [];

  constructor(private route: ActivatedRoute, private questionsService: QuestionsService) { }

  ngOnInit(): void {
    this.route.params.subscribe(p => {
      this.questionsService.getQuestion(p['id']).subscribe(q => {
        this.question = q;

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
      });
    });
  }

}

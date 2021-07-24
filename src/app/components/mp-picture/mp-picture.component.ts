import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/models/organisational/member';
import { Tenure } from 'src/app/models/organisational/tenure';
import { getTextClass } from 'src/app/text-color-utility';

@Component({
  selector: 'app-mp-picture',
  templateUrl: './mp-picture.component.html',
  styleUrls: ['./mp-picture.component.scss']
})
export class MpPictureComponent implements OnInit {

  @Input()
  member: Member;

  @Input()
  date: Date;

  tenureAtDate: Tenure;

  getTextClass = getTextClass;

  constructor() { }

  ngOnInit(): void {
    this.tenureAtDate = this.member.tenures.filter(t => t.start <= this.date && (t.end >= this.date || t.end == null))[0];
  }

}

import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { arc, pie } from 'd3';
import { data } from 'jquery';
import { Member } from 'src/app/models/organisational/member';
import { Party } from 'src/app/models/organisational/party';

@Component({
  selector: 'app-pie-graph',
  templateUrl: './pie-graph.component.html',
  styleUrls: ['./pie-graph.component.scss']
})
export class PieGraphComponent implements AfterViewInit {

  @ViewChild('graph')
  graph: ElementRef;

  @Input()
  votes: { numberOfVotes: number, party: Party, member: Member }[]

  @Input()
  totalVotes: number;

  @Input()
  inFavour: boolean;

  constructor() { }

  ngAfterViewInit(): void {
    // const width = 960,
    //   height = 500,
    //   radius = Math.min(width, height) / 2;

    // const svg = d3.select(this.graph.nativeElement)
    //   .append('svg')
    //   .attr('width', '100%')
    //   .attr('height', '100%').attr('viewBox', (-width / 2) + ' ' + (-height / 2) + ' ' + width + ' ' + height)
    //   .attr('preserveAspectRatio', 'xMinYMin');

    const remainingVotes = this.totalVotes - this.votes.map(v => v.numberOfVotes).reduce((a, b) => a + b, 0);

    // const ids = this.votes.map(v => v.party == null ? v.member.id.toString() : v.party.id.toString());
    // ids.push('remaining-votes');

    // const colours = this.votes.map(v => v.party == null ? '#DDDDDD' : v.party.colour);
    // colours.push('#f8f9fa');

    // const colour = d3.scaleOrdinal()
    //   .domain(ids)
    //   .range(colours);

    // const voteCount = this.votes.map(v => v.numberOfVotes);
    // voteCount.push(remainingVotes);

    // const pie = d3.pie()
    //   .value(d => d['numberOfVotes']);

    // const data = pie(this.votes.map(v => v.numberOfVotes));

    // var arc = d3.arc()
    //       .innerRadius(100)             // NEW
    //       .outerRadius(radius);

    // svg
    //   .selectAll('whatever')
    //   .data(data)
    //   .enter()
    //   .append('path')
    //   .attr('d', arc as any)
    //   .attr('fill', d => colours[d.index])

    var dataset = this.votes.map(v => ({
      label: v.party == null ? v.member.name + v.member.id : v.party.name + v.party.id,
      count: v.numberOfVotes
    }));

    dataset.push({ label: 'remaining-votes', count: remainingVotes });

    const colours = {};

    this.votes.forEach(v => {
      colours[v.party == null ? v.member.name + v.member.id : v.party.name + v.party.id] = v.party == null ? '#DDDDDD' : v.party.colour;
    });

    colours['remaining-votes'] = '#f8f9fa';

    const width = parseInt(d3.select(this.graph.nativeElement).style('width'));
    const height = width;
    var radius = Math.min(width, height) / 2;
    var donutWidth = 30;                            // NEW

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var svg = d3.select(this.graph.nativeElement)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox','0 0 ' + height + ' ' + width)
      .attr('preserveAspectRatio', 'xMinYMin')
      .append('g')
      .attr("transform", "translate(" + Math.min(width,height) / 2 + "," + Math.min(width,height) / 2 + ")");

    var arc = d3.arc()
      .innerRadius(radius - donutWidth)             // NEW
      .outerRadius(radius);
      
    var pie = d3.pie()
      .value(function(d) { return d['count']; })
      .sort(null);

    var path = svg.selectAll('path')
      .data(pie(dataset as any))
      .enter()
      .append('path')
      .attr('d', arc as any)
      .attr('fill', function(d, i) { 
        return colours[d.data['label']];
      });

    svg.append('text')
    .attr('text-anchor', 'middle')
    .text(`${this.inFavour ? 'Ayes' : 'Noes'} ${this.votes.map(v => v.numberOfVotes).reduce((a, b) => a + b, 0)}`)
  }

}

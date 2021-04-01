import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { arc, pie } from 'd3';
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

    // const remainingVotes = this.totalVotes - this.votes.map(v => v.numberOfVotes).reduce((a, b) => a + b, 0);

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

    var dataset = [
      { label: 'Abulia', count: 10 }, 
      { label: 'Betelgeuse', count: 20 },
      { label: 'Cantaloupe', count: 30 },
      { label: 'Dijkstra', count: 40 }
    ];

    var width = 360;
    var height = 360;
    var radius = Math.min(width, height) / 2;
    var donutWidth = 75;                            // NEW

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var svg = d3.select(this.graph.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + (width / 2) + 
        ',' + (height / 2) + ')');

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
        return color(d.data['label']);
      });
  }

}

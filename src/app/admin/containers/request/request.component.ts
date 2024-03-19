import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY_REQUEST } from 'src/app/core/helpers';
import { IRequest } from '../../interfaces';
import { RequestQueries } from '../../services';

@Component({
  selector: 'app-request',
  standalone: true,
  imports: [],
  templateUrl: './request.component.html',
  styleUrl: './request.component.scss'
})
export class RequestComponent implements OnInit {
  public request: IRequest = EMPTY_REQUEST;

  constructor(
    private route: ActivatedRoute,
    private requestQuery: RequestQueries
  ){}

  ngOnInit(): void {
    const requestId = this.route.snapshot.params.id;

    this.requestQuery.getRequest(requestId).subscribe(({data}) => {
      this.request = data;
    });
  }
}

import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'sch-student-detail-page',
  imports: [RouterOutlet],
  templateUrl: './student-detail-page.html',
  styleUrl: './student-detail-page.scss',
})
export class StudentDetailPage {
  readonly id: string | null;

  constructor(private readonly route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('id');
  }
}

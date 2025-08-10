import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-found',
  imports: [CommonModule, RouterModule],
  templateUrl: './not-found.html',
  styleUrls: ['./not-found.css'],
})
export class NotFound {}

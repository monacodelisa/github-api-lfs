import { Component, inject, OnInit, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { GithubApiService } from "./services/github-api.service";

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatExpansionModule } from "@angular/material/expansion";
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [
		RouterOutlet,
		MatToolbarModule,
		MatExpansionModule,
    MatPaginatorModule,
		MatButtonModule,
		MatIconModule,
	],
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
  readonly panelOpenState = signal(false);
  allIssues: any[] = [];
  totalIssues: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  githubApiService = inject(GithubApiService);
  private iconRegistry = inject(MatIconRegistry);
  private sanitizer = inject(DomSanitizer);

  constructor() {
    this.iconRegistry.addSvgIcon(
      "angular",
      this.sanitizer.bypassSecurityTrustResourceUrl("/icons/angular.svg")
    );
  }

  ngOnInit() {
    this.loadIssues();
  }

  loadIssues() {
    this.githubApiService.getAllIssues(this.currentPage, this.pageSize).subscribe(issues => {
      this.allIssues = issues;
      this.totalIssues = 291; // to get dynamic value after rate limit renews, if enough time
    });
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.loadIssues();
  }
}

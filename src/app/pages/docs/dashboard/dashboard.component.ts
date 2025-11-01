import { Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChildHeaderComponent } from '../../../components/child-header/child-header.component';
import { DocsService } from '../../../shared/services/docs.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription, map } from 'rxjs';
import { NavigationService } from '../../../shared/services/navigation.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonService } from '../../../shared/services/common/common.service';
import { TnhtSheetService } from '../../../shared/services/tnht-sheet/tnht-sheet.service';
import { IconComponent } from "src/app/components/icon/icon.component";

@Component({
  selector: 'app-dashboard',
  imports: [
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ChildHeaderComponent,
    CommonModule,
    RouterModule,
    MatTooltipModule,
    IconComponent
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  tnhtDocs = <any>[];
  tsvDocs = <any>[];
  filteredTnhtDocs = <any>[];
  filteredTsvDocs = <any>[];
  searchQuery = '';
  isGridView = true;
  private subscriptions = new Subscription();
  isDrawerOpen: boolean = true;
  drawerMode: 'side' | 'over' = 'side';

  constructor(
    private docsService: DocsService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private commonService: CommonService,
    private tnhtSheetService: TnhtSheetService
  ) {}

  ngOnInit(): void {
    this.drawerMode = 'side';
    this.isDrawerOpen = true;
    this.subscriptions.add(
      this.breakpointObserver
        .observe([Breakpoints.XSmall])
        .pipe(map((result) => result.matches))
        .subscribe((matches) => {
          if (matches) {
            this.isDrawerOpen = false;
            this.drawerMode = 'over';
          }
        })
    );
    this.getTNHTContents();
    this.getTSVContents();
  }

  getTNHTContents() {
    this.fetchTnht();
    // this.docsService
    //   .getStaticLibrary('/assets/tnht/table-content.json')
    //   .subscribe({
    //     next: (res: any) => {
    //       this.tnhtDocs = res?.data;
    //       this.filteredTnhtDocs = [...this.tnhtDocs];
    //     },
    //     error: (err) => {
    //       console.error('Error fetching TNHT contents:', err);
    //     },
    //   });
  }

  fetchTnht() {
    this.tnhtSheetService.fetchTnht().subscribe((res: any) => {
      if (res.status === 200) {
        this.tnhtDocs = res.data?.map((item: any) => {
          return {
            ...item,
            id: item?.key,
          };
        });
        this.filteredTnhtDocs = [...this.tnhtDocs];
      }
    });
  }

  getTSVContents() {
    this.docsService.getStaticLibrary('/assets/tsv/tap-so-van.json').subscribe({
      next: (res: any) => {
        this.tsvDocs = res?.data;
        this.filteredTsvDocs = [...this.tsvDocs];
      },
      error: (err) => {
        console.error('Error fetching TNHT contents:', err);
      },
    });
  }

  openDocument(doc: any) {
    this.router.navigate([`/docs/${doc?.id}`]);
  }

  searchDocuments() {
    const query = this.searchQuery.trim();

    if (!query) {
      this.filteredTnhtDocs = [...this.tnhtDocs];
      this.filteredTsvDocs = [...this.tsvDocs];
      return;
    }

    // Apply the generatedSlug to the search query for better matching
    const searchContent = this.commonService.generatedSlug(query);

    this.filteredTnhtDocs = this.tnhtDocs.filter(
      (doc: any) =>
        this.commonService.generatedSlug(doc.title).includes(searchContent) ||
        (doc.keywords &&
          this.commonService
            .generatedSlug(doc.keywords)
            .includes(searchContent)) ||
        (doc.description &&
          this.commonService
            .generatedSlug(doc.description)
            .includes(searchContent))
    );

    this.filteredTsvDocs = this.tsvDocs.filter(
      (doc: any) =>
        this.commonService.generatedSlug(doc.title).includes(searchContent) ||
        (doc.keywords &&
          this.commonService
            .generatedSlug(doc.keywords)
            .includes(searchContent)) ||
        (doc.description &&
          this.commonService
            .generatedSlug(doc.description)
            .includes(searchContent))
    );
  }

  toggleViewMode() {
    this.isGridView = !this.isGridView;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlSegment } from '@angular/router';
import { KinhContentComponent } from './kinh-content/kinh-content.component';
import { KinhListComponent } from './kinh-list/kinh-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: KinhListComponent },
      {
        matcher: (url) => {
          const kinhFilterList = ['cung-tu-thoi', 'quan-hon-tang-te']
          if (url.length === 1 && kinhFilterList.includes(url[0].path)) {
            const kinhGroup = url[0].path;
            return {
              consumed: url,
              posParams: {
                kinhGroup: new UrlSegment(kinhGroup, {})
              }
            };
          }
          return null;
        },
        component: KinhListComponent,
      },
      { path: ':kinhGroup/:kinhKey', component: KinhContentComponent },
      { path: ':kinhKey', component: KinhContentComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KinhRoutingModule { }

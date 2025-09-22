import { Component, inject, Input, OnInit } from '@angular/core';
import { KinhService } from 'src/app/shared/services/kinh/kinh.service';

@Component({
  selector: 'app-kinh-information',
  templateUrl: './kinh-information.html',
  styleUrls: ['./kinh-information.scss'],
  standalone: false,
})
export class KinhInformation implements OnInit {
  @Input() kinhKey: any;
  kinhService = inject(KinhService);
  loading: boolean = false;
  kinhInformations: any[] = [];
  analysisVideos: any[] = [];
  readingVideos: any[] = [];

  ngOnInit() {
    this.fetchKinhInformation(this.kinhKey);
  }

  fetchKinhInformation(key: string) {
    if (key) {
      this.loading = true;
      this.kinhService.fetchKinhInformation(key).subscribe({
        next: (res) => {
          if (res?.status === 200) {
            this.kinhInformations = res.data?.map((item: any) => {
              const videoIdMatch = item.content.match(/(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([^\s&]+)/);
              return {
                ...item,
                type: item?.type ? (item.type.match(/\[(.*?)\]/)?.[1] ?? '') : '',
                id: videoIdMatch ? videoIdMatch[1] : null
              }
            });
            this.analysisVideos = this.kinhInformations?.filter((item: any) => item?.type === 'analysisVideo');
            this.readingVideos = this.kinhInformations?.filter((item: any) => item?.type === 'readingVideo');
          }
        },
        error: (err) => {
          console.error('Error fetching Kinh Information:', err);
        },
        complete: () => {
          this.loading = false;
        },
      });
    }
  }
}

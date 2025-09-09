import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly baseUrl = 'https://www.caodaion.com';

  constructor(
    private meta: Meta,
    private title: Title
  ) {}

  /**
   * Update all SEO metadata
   */
  updateMetadata(config: {
    title?: string;
    description?: string;
    url?: string;
    type?: string;
    image?: string;
    published?: string;
    modified?: string;
    keywords?: string;
  }): void {
    const fullTitle = config.title ? `${config.title} - CaoDaiON` : 'CaoDaiON';
    const url = config.url ? `${this.baseUrl}/${config.url}` : this.baseUrl;
    const description = config.description || 'CaoDaiON - Ứng dụng Cao Đài trực tuyến';
    const image = config.image || `${this.baseUrl}/caodaion_logo.png`;
    const type = config.type || 'website';

    // Set basic meta tags
    this.title.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: config.keywords || 'Cao Đài, CaoDaiON, lịch âm, lịch, tôn giáo' });

    // OpenGraph tags
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: type });
    this.meta.updateTag({ property: 'og:image', content: image });
    
    // Twitter tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });
    
    // Canonical URL
    this.updateCanonicalUrl(url);
    
    // Article specific tags
    if (type === 'article') {
      if (config.published) {
        this.meta.updateTag({ property: 'article:published_time', content: config.published });
      }
      if (config.modified) {
        this.meta.updateTag({ property: 'article:modified_time', content: config.modified });
      }
    }
  }
  
  /**
   * Update canonical URL link element
   */
  private updateCanonicalUrl(url: string): void {
    let link: HTMLLinkElement | null = this.getCanonicalLink();
    if (link) {
      link.setAttribute('href', url);
    } else {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', url);
      document.head.appendChild(link);
    }
  }
  
  /**
   * Get canonical link element if it exists
   */
  private getCanonicalLink(): HTMLLinkElement | null {
    return document.querySelector('link[rel="canonical"]');
  }
}
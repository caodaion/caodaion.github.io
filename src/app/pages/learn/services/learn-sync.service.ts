import { Injectable } from '@angular/core';
import { LearnResultsService, LearnResult } from './learn-results.service';

export interface LearnSyncData {
  type: 'caodaion-learn-data';
  version: '1.0';
  exportedAt: string;
  deviceInfo: {
    userAgent: string;
    timestamp: string;
  };
  totalResults: number;
  results: (Omit<LearnResult, 'completedAt'> & { completedAt: string })[];
}

@Injectable({
  providedIn: 'root'
})
export class LearnSyncService {

  constructor(private learnResultsService: LearnResultsService) {}

  /**
   * Export all learn data to a shareable URL
   */
  async generateSyncUrl(): Promise<string> {
    try {
      // Get all learn results
      const results = await this.learnResultsService.getAllResults();
      
      // Create sync data object (following lich page pattern)
      const syncData: LearnSyncData = {
        type: 'caodaion-learn-data',
        version: '1.0',
        exportedAt: new Date().toISOString(),
        deviceInfo: {
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        },
        totalResults: results.length,
        results: results.map(result => ({
          ...result,
          // Ensure completedAt is serialized as string
          completedAt: result.completedAt instanceof Date ? result.completedAt.toISOString() : result.completedAt
        }))
      };

      // Convert to JSON string and encode as URI component (same as lich page)
      const jsonData = JSON.stringify(syncData);
      const encodedData = encodeURIComponent(jsonData);
      
      // Create shareable URL (same pattern as lich page)
      const baseUrl = window.location.origin;
      const syncUrl = `${baseUrl}/hoc/sync?data=${encodedData}`;
      
      return syncUrl;
    } catch (error) {
      console.error('Error generating sync URL:', error);
      throw new Error('Không thể tạo link đồng bộ. Vui lòng thử lại.');
    }
  }

  /**
   * Parse sync data from URL and return the data object
   */
  parseSyncUrl(encodedData: string): LearnSyncData {
    try {
      const decodedData = decodeURIComponent(encodedData);
      const syncData = JSON.parse(decodedData) as LearnSyncData;
      
      // Validate data format
      if (!syncData.type || syncData.type !== 'caodaion-learn-data') {
        throw new Error('Định dạng dữ liệu không hợp lệ');
      }
      
      if (!syncData.results || !Array.isArray(syncData.results)) {
        throw new Error('Dữ liệu kết quả học tập không hợp lệ');
      }
      
      return syncData;
    } catch (error) {
      console.error('Error parsing sync data:', error);
      throw new Error('Không thể đọc dữ liệu đồng bộ. Link có thể bị hỏng hoặc không hợp lệ.');
    }
  }

  /**
   * Import learn data and merge with existing data
   */
  async importSyncData(syncData: LearnSyncData, mergeStrategy: 'replace' | 'merge' = 'merge'): Promise<{
    imported: number;
    skipped: number;
    errors: number;
  }> {
    let imported = 0;
    let skipped = 0;
    let errors = 0;

    try {
      if (mergeStrategy === 'replace') {
        // Clear all existing data first
        await this.learnResultsService.clearAllResults();
      }

      // Get existing results for merge strategy
      const existingResults = mergeStrategy === 'merge' 
        ? await this.learnResultsService.getAllResults() 
        : [];

      for (const result of syncData.results) {
        try {
          // For merge strategy, check if result already exists
          if (mergeStrategy === 'merge') {
            const existingResult = existingResults.find(existing => 
              existing.lessonSlug === result.lessonSlug &&
              existing.completedAt.getTime() === new Date(result.completedAt).getTime()
            );

            if (existingResult) {
              // Check if imported result has better score
              if (result.percentage > existingResult.percentage) {
                // Update existing result with better score
                await this.learnResultsService.saveLearnResult({
                  lessonSlug: result.lessonSlug,
                  lessonTitle: result.lessonTitle,
                  lessonUrl: result.lessonUrl,
                  totalQuestions: result.totalQuestions,
                  correctAnswers: result.correctAnswers,
                  percentage: result.percentage,
                  answers: result.answers,
                  completedAt: new Date(result.completedAt), // Convert string back to Date
                  timeSpent: result.timeSpent
                });
                imported++;
              } else {
                skipped++;
              }
              continue;
            }
          }

          // Save new result
          await this.learnResultsService.saveLearnResult({
            lessonSlug: result.lessonSlug,
            lessonTitle: result.lessonTitle,
            lessonUrl: result.lessonUrl,
            totalQuestions: result.totalQuestions,
            correctAnswers: result.correctAnswers,
            percentage: result.percentage,
            answers: result.answers,
            completedAt: new Date(result.completedAt), // Convert string back to Date
            timeSpent: result.timeSpent
          });
          imported++;
        } catch (error) {
          console.error('Error importing result:', error);
          errors++;
        }
      }

      return { imported, skipped, errors };
    } catch (error) {
      console.error('Error importing sync data:', error);
      throw new Error('Không thể nhập dữ liệu. Vui lòng thử lại.');
    }
  }

  /**
   * Get sync data statistics
   */
  getSyncDataInfo(syncData: LearnSyncData): {
    totalResults: number;
    uniqueLessons: number;
    exportedAt: Date;
    deviceInfo: string;
    version: string;
  } {
    const uniqueLessons = new Set(syncData.results.map(r => r.lessonSlug)).size;
    
    return {
      totalResults: syncData.totalResults,
      uniqueLessons,
      exportedAt: new Date(syncData.exportedAt),
      deviceInfo: syncData.deviceInfo.userAgent,
      version: syncData.version
    };
  }

  /**
   * Share sync URL using Web Share API or clipboard fallback
   */
  async shareSyncUrl(syncUrl: string, title: string = 'Dữ liệu học tập CaoDaiON'): Promise<void> {
    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: 'Đồng bộ dữ liệu học tập từ ứng dụng CaoDaiON',
          url: syncUrl
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(syncUrl);
        // You might want to show a toast message here
      }
    } catch (error) {
      console.error('Error sharing sync URL:', error);
      // Fallback: copy to clipboard manually
      const textArea = document.createElement('textarea');
      textArea.value = syncUrl;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }
}
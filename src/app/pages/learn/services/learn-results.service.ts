import { Injectable } from '@angular/core';
import { BaseDbService } from 'src/app/shared/services/base.db.service';

export interface LearnResult {
  id?: number;
  lessonSlug: string;
  lessonTitle: string;
  lessonUrl: string;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  answers: QuizAnswer[];
  completedAt: Date;
  timeSpent?: number; // in seconds
}

export interface QuizAnswer {
  questionIndex: number;
  question: string;
  selectedAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LearnResultsService {
  /**
   * Get paginated recent activity for mat-paginator
   */
  async getRecentActivityPage(pageIndex: number, pageSize: number): Promise<{results: LearnResult[], total: number}> {
    try {
      const allResults = await this.getAllResults();
      const sorted = allResults.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
      const total = sorted.length;
      const start = pageIndex * pageSize;
      const results = sorted.slice(start, start + pageSize);
      return { results, total };
    } catch (error) {
      console.error('Error getting paginated recent activity:', error);
      return { results: [], total: 0 };
    }
  }

  constructor(private db: BaseDbService) {}

  async saveLearnResult(result: Omit<LearnResult, 'id'>): Promise<number> {
    try {
      const id = await this.db.learnResults.add(result);
      console.log('Learn result saved successfully:', id);
      return id as number;
    } catch (error) {
      console.error('Error saving learn result:', error);
      throw error;
    }
  }

  async getLearnResults(lessonSlug?: string): Promise<LearnResult[]> {
    try {
      if (lessonSlug) {
        return await this.db.learnResults
          .where('lessonSlug')
          .equals(lessonSlug)
          .toArray();
      } else {
        return await this.db.learnResults.toArray();
      }
    } catch (error) {
      console.error('Error getting learn results:', error);
      throw error;
    }
  }

  async getLatestResult(lessonSlug: string): Promise<LearnResult | null> {
    try {
      const results = await this.db.learnResults
        .where('lessonSlug')
        .equals(lessonSlug)
        .reverse()
        .sortBy('completedAt');
      
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error('Error getting latest result:', error);
      return null;
    }
  }

  async getBestResult(lessonSlug: string): Promise<LearnResult | null> {
    try {
      const results = await this.db.learnResults
        .where('lessonSlug')
        .equals(lessonSlug)
        .reverse()
        .sortBy('percentage');
      
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error('Error getting best result:', error);
      return null;
    }
  }

  async getAllResults(): Promise<LearnResult[]> {
    return this.getLearnResults();
  }

  async deleteResult(id: number): Promise<void> {
    try {
      await this.db.learnResults.delete(id);
      console.log('Learn result deleted successfully');
    } catch (error) {
      console.error('Error deleting learn result:', error);
      throw error;
    }
  }

  async clearAllResults(): Promise<void> {
    try {
      await this.db.learnResults.clear();
      console.log('All learn results cleared');
    } catch (error) {
      console.error('Error clearing learn results:', error);
      throw error;
    }
  }

  // Statistics methods
  async getStatistics(): Promise<{
    totalAttempts: number;
    totalLessons: number;
    averageScore: number;
    bestScore: number;
    recentActivity: LearnResult[];
  }> {
    try {
      const allResults = await this.getAllResults();
      
      const totalAttempts = allResults.length;
      const uniqueLessons = new Set(allResults.map(r => r.lessonSlug));
      const totalLessons = uniqueLessons.size;
      
      const averageScore = totalAttempts > 0 
        ? allResults.reduce((sum, r) => sum + r.percentage, 0) / totalAttempts 
        : 0;
      
      const bestScore = totalAttempts > 0 
        ? Math.max(...allResults.map(r => r.percentage)) 
        : 0;
      
      const recentActivity = allResults
        .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
        .slice(0, 10);
      
      return {
        totalAttempts,
        totalLessons,
        averageScore: Math.round(averageScore),
        bestScore,
        recentActivity
      };
    } catch (error) {
      console.error('Error getting statistics:', error);
      return {
        totalAttempts: 0,
        totalLessons: 0,
        averageScore: 0,
        bestScore: 0,
        recentActivity: []
      };
    }
  }
}
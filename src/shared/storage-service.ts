import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';
import { AIAnalysisResult, AIFeature } from './ai-detector';

// 检测记录数据结构
export interface DetectionRecord {
  id: string;
  url: string;
  title: string;
  timestamp: Date;
  aiScore: number;
  features: AIFeature[];
  details: string;
  screenshotPath: string;
  metadata: {
    userAgent: string;
    viewport: { width: number; height: number };
    loadTime: number;
  };
}

// 存储配置
export interface StorageConfig {
  dataDir: string;
  recordsFile: string;
  screenshotsDir: string;
  backupsDir: string;
}

export class StorageService {
  private config: StorageConfig;
  private records: DetectionRecord[] = [];

  constructor() {
    this.config = this.initializeConfig();
    this.ensureDirectoriesExist();
    this.loadRecords();
  }

  private initializeConfig(): StorageConfig {
    const userDataPath = app.getPath('userData');
    const dataDir = path.join(userDataPath, 'ai-flavor-detector');
    
    return {
      dataDir,
      recordsFile: path.join(dataDir, 'records.json'),
      screenshotsDir: path.join(dataDir, 'screenshots'),
      backupsDir: path.join(dataDir, 'backups')
    };
  }

  private ensureDirectoriesExist(): void {
    const dirs = [
      this.config.dataDir,
      this.config.screenshotsDir,
      this.config.backupsDir
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  private loadRecords(): void {
    try {
      if (fs.existsSync(this.config.recordsFile)) {
        const data = fs.readFileSync(this.config.recordsFile, 'utf8');
        const parsed = JSON.parse(data);
        this.records = parsed.map((record: any) => ({
          ...record,
          timestamp: new Date(record.timestamp)
        }));
      }
    } catch (error) {
      console.error('Error loading records:', error);
      this.records = [];
    }
  }

  private saveRecords(): void {
    try {
      // 创建备份
      this.createBackup();
      
      // 保存当前记录
      const data = JSON.stringify(this.records, null, 2);
      fs.writeFileSync(this.config.recordsFile, data, 'utf8');
    } catch (error) {
      console.error('Error saving records:', error);
      throw new Error('Failed to save records');
    }
  }

  private createBackup(): void {
    try {
      if (fs.existsSync(this.config.recordsFile)) {
        const timestamp = new Date().toISOString().split('T')[0];
        const backupFile = path.join(this.config.backupsDir, `records-${timestamp}.json`);
        
        if (!fs.existsSync(backupFile)) {
          fs.copyFileSync(this.config.recordsFile, backupFile);
        }
      }
    } catch (error) {
      console.warn('Failed to create backup:', error);
    }
  }

  public async saveDetectionRecord(
    analysisResult: AIAnalysisResult,
    url: string,
    title: string,
    screenshotBuffer: Buffer,
    metadata: DetectionRecord['metadata']
  ): Promise<string> {
    try {
      const recordId = this.generateRecordId();
      const screenshotPath = path.join(this.config.screenshotsDir, `${recordId}.png`);
      
      // 保存截图
      if (screenshotBuffer && screenshotBuffer.length > 0) {
        fs.writeFileSync(screenshotPath, screenshotBuffer);
        console.log(`Screenshot saved to: ${screenshotPath}, size: ${screenshotBuffer.length} bytes`);
      } else {
        console.warn('Screenshot buffer is empty, creating placeholder');
        // 创建一个占位符图片
        const placeholderBuffer = this.createPlaceholderImage(url);
        fs.writeFileSync(screenshotPath, placeholderBuffer);
      }
      
      // 创建记录
      const record: DetectionRecord = {
        id: recordId,
        url,
        title,
        timestamp: analysisResult.timestamp,
        aiScore: analysisResult.score,
        features: analysisResult.features,
        details: analysisResult.details,
        screenshotPath,
        metadata
      };
      
      // 添加到记录列表
      this.records.unshift(record); // 最新的记录在前面
      
      // 保存到文件
      this.saveRecords();
      
      return recordId;
    } catch (error) {
      console.error('Error saving detection record:', error);
      throw new Error('Failed to save detection record');
    }
  }

  public getRecords(): DetectionRecord[] {
    return [...this.records]; // 返回副本
  }

  public getRecordById(id: string): DetectionRecord | null {
    return this.records.find(record => record.id === id) || null;
  }

  public deleteRecord(id: string): boolean {
    try {
      const index = this.records.findIndex(record => record.id === id);
      if (index === -1) {
        return false;
      }
      
      const record = this.records[index];
      
      // 删除截图文件
      if (fs.existsSync(record.screenshotPath)) {
        fs.unlinkSync(record.screenshotPath);
      }
      
      // 从记录列表中删除
      this.records.splice(index, 1);
      
      // 保存更新后的记录
      this.saveRecords();
      
      return true;
    } catch (error) {
      console.error('Error deleting record:', error);
      return false;
    }
  }

  public searchRecords(query: string): DetectionRecord[] {
    const lowerQuery = query.toLowerCase();
    return this.records.filter(record => 
      record.url.toLowerCase().includes(lowerQuery) ||
      record.title.toLowerCase().includes(lowerQuery) ||
      record.details.toLowerCase().includes(lowerQuery)
    );
  }

  public getRecordsByDateRange(startDate: Date, endDate: Date): DetectionRecord[] {
    return this.records.filter(record => 
      record.timestamp >= startDate && record.timestamp <= endDate
    );
  }

  public getRecordsByScoreRange(minScore: number, maxScore: number): DetectionRecord[] {
    return this.records.filter(record => 
      record.aiScore >= minScore && record.aiScore <= maxScore
    );
  }

  public exportRecords(): string {
    return JSON.stringify(this.records, null, 2);
  }

  public getStorageStats(): {
    totalRecords: number;
    totalSize: number;
    oldestRecord: Date | null;
    newestRecord: Date | null;
  } {
    let totalSize = 0;
    
    // 计算记录文件大小
    if (fs.existsSync(this.config.recordsFile)) {
      totalSize += fs.statSync(this.config.recordsFile).size;
    }
    
    // 计算截图文件大小
    this.records.forEach(record => {
      if (fs.existsSync(record.screenshotPath)) {
        totalSize += fs.statSync(record.screenshotPath).size;
      }
    });
    
    const timestamps = this.records.map(r => r.timestamp);
    
    return {
      totalRecords: this.records.length,
      totalSize,
      oldestRecord: timestamps.length > 0 ? new Date(Math.min(...timestamps.map(t => t.getTime()))) : null,
      newestRecord: timestamps.length > 0 ? new Date(Math.max(...timestamps.map(t => t.getTime()))) : null
    };
  }

  private generateRecordId(): string {
    return `record_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private createPlaceholderImage(url: string): Buffer {
    // 创建一个占位符图片
    // 这是一个1x1像素的透明PNG的base64数据
    const minimalPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
    console.log(`Created placeholder image for URL: ${url}`);
    return minimalPng;
  }

  public clearAllRecords(): boolean {
    try {
      const recordCount = this.records.length;
      console.log(`Starting to clear ${recordCount} records...`);

      if (recordCount === 0) {
        console.log('No records to clear');
        return true;
      }

      let deletedScreenshots = 0;
      let failedScreenshots = 0;

      // 删除所有截图文件
      this.records.forEach((record, index) => {
        try {
          if (record.screenshotPath && fs.existsSync(record.screenshotPath)) {
            fs.unlinkSync(record.screenshotPath);
            deletedScreenshots++;
            console.log(`Deleted screenshot ${index + 1}/${recordCount}: ${record.screenshotPath}`);
          } else {
            console.log(`Screenshot not found for record ${index + 1}/${recordCount}: ${record.screenshotPath}`);
          }
        } catch (error) {
          failedScreenshots++;
          console.error(`Failed to delete screenshot for record ${index + 1}/${recordCount}:`, error);
          // 继续处理其他文件，不要因为单个文件失败而停止整个操作
        }
      });

      console.log(`Screenshot deletion summary: ${deletedScreenshots} deleted, ${failedScreenshots} failed`);

      // 清空记录数组
      const originalRecords = [...this.records];
      this.records = [];

      try {
        // 保存空记录到文件
        this.saveRecords();
        console.log('Successfully saved empty records file');
      } catch (saveError) {
        // 如果保存失败，恢复记录
        console.error('Failed to save empty records, restoring original records:', saveError);
        this.records = originalRecords;
        throw new Error('Failed to save cleared records to file');
      }

      console.log(`Successfully cleared ${recordCount} records`);
      return true;
    } catch (error) {
      console.error('Error clearing all records:', error);
      return false;
    }
  }
}

// 单例实例
let storageServiceInstance: StorageService | null = null;

export function getStorageService(): StorageService {
  if (!storageServiceInstance) {
    storageServiceInstance = new StorageService();
  }
  return storageServiceInstance;
}

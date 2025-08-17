/**
 * GitHub API Service
 * 提供GitHub仓库信息获取和缓存功能
 */

export interface GitHubRepoInfo {
  name: string;
  fullName: string;
  description: string;
  stargazersCount: number;
  forksCount: number;
  language: string;
  htmlUrl: string;
  updatedAt: string;
}

export interface GitHubServiceOptions {
  owner: string;
  repo: string;
  cacheTimeout?: number; // 缓存超时时间（毫秒），默认5分钟
}

export class GitHubService {
  private readonly owner: string;
  private readonly repo: string;
  private readonly cacheTimeout: number;
  private readonly cacheKey: string;
  private readonly apiUrl: string;

  constructor(options: GitHubServiceOptions) {
    this.owner = options.owner;
    this.repo = options.repo;
    this.cacheTimeout = options.cacheTimeout || 5 * 60 * 1000; // 默认5分钟
    this.cacheKey = `github_repo_${this.owner}_${this.repo}`;
    this.apiUrl = `https://api.github.com/repos/${this.owner}/${this.repo}`;
  }

  /**
   * 获取仓库信息（带缓存）
   */
  public async getRepoInfo(): Promise<GitHubRepoInfo | null> {
    try {
      // 尝试从缓存获取
      const cachedData = this.getCachedData();
      if (cachedData) {
        console.log('GitHub repo info loaded from cache');
        return cachedData;
      }

      // 从API获取
      console.log('Fetching GitHub repo info from API...');
      const repoInfo = await this.fetchRepoInfo();
      
      if (repoInfo) {
        // 缓存数据
        this.setCachedData(repoInfo);
        console.log('GitHub repo info fetched and cached successfully');
      }

      return repoInfo;
    } catch (error) {
      console.error('Error getting GitHub repo info:', error);
      
      // 如果API调用失败，尝试返回过期的缓存数据
      const expiredCache = this.getCachedData(true);
      if (expiredCache) {
        console.log('Returning expired cache data due to API error');
        return expiredCache;
      }
      
      return null;
    }
  }

  /**
   * 强制刷新仓库信息
   */
  public async refreshRepoInfo(): Promise<GitHubRepoInfo | null> {
    try {
      console.log('Force refreshing GitHub repo info...');
      this.clearCache();
      return await this.getRepoInfo();
    } catch (error) {
      console.error('Error refreshing GitHub repo info:', error);
      return null;
    }
  }

  /**
   * 从GitHub API获取仓库信息
   */
  private async fetchRepoInfo(): Promise<GitHubRepoInfo | null> {
    try {
      const response = await fetch(this.apiUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'AI-Flavor-Detector/1.0.0'
        }
      });

      if (!response.ok) {
        if (response.status === 403) {
          console.warn('GitHub API rate limit exceeded');
        } else if (response.status === 404) {
          console.error('GitHub repository not found');
        } else {
          console.error(`GitHub API error: ${response.status} ${response.statusText}`);
        }
        return null;
      }

      const data = await response.json();
      
      return {
        name: data.name,
        fullName: data.full_name,
        description: data.description || '',
        stargazersCount: data.stargazers_count || 0,
        forksCount: data.forks_count || 0,
        language: data.language || 'Unknown',
        htmlUrl: data.html_url,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Error fetching from GitHub API:', error);
      return null;
    }
  }

  /**
   * 从缓存获取数据
   */
  private getCachedData(ignoreExpiry = false): GitHubRepoInfo | null {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      if (!cached) {
        return null;
      }

      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      
      if (!ignoreExpiry && (now - timestamp) > this.cacheTimeout) {
        console.log('GitHub cache expired');
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error reading GitHub cache:', error);
      return null;
    }
  }

  /**
   * 设置缓存数据
   */
  private setCachedData(data: GitHubRepoInfo): void {
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error setting GitHub cache:', error);
    }
  }

  /**
   * 清除缓存
   */
  private clearCache(): void {
    try {
      localStorage.removeItem(this.cacheKey);
      console.log('GitHub cache cleared');
    } catch (error) {
      console.error('Error clearing GitHub cache:', error);
    }
  }

  /**
   * 获取缓存状态信息
   */
  public getCacheInfo(): { cached: boolean; age?: number; expires?: number } {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      if (!cached) {
        return { cached: false };
      }

      const { timestamp } = JSON.parse(cached);
      const now = Date.now();
      const age = now - timestamp;
      const expires = this.cacheTimeout - age;

      return {
        cached: true,
        age,
        expires: Math.max(0, expires)
      };
    } catch (error) {
      return { cached: false };
    }
  }

  /**
   * 格式化star数量显示
   */
  public static formatStarCount(count: number): string {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    } else {
      return count.toString();
    }
  }

  /**
   * 获取相对时间显示
   */
  public static getRelativeTime(dateString: string): string {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return '今天';
      } else if (diffDays === 1) {
        return '昨天';
      } else if (diffDays < 7) {
        return `${diffDays}天前`;
      } else if (diffDays < 30) {
        return `${Math.floor(diffDays / 7)}周前`;
      } else if (diffDays < 365) {
        return `${Math.floor(diffDays / 30)}个月前`;
      } else {
        return `${Math.floor(diffDays / 365)}年前`;
      }
    } catch (error) {
      return '未知';
    }
  }
}

// 默认的GitHub服务实例
export const defaultGitHubService = new GitHubService({
  owner: 'ai-coding-labs',
  repo: 'aiway',
  cacheTimeout: 5 * 60 * 1000 // 5分钟缓存
});

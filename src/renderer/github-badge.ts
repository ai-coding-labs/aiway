/**
 * GitHub Badge Component
 * 管理右上角GitHub徽标的显示和交互
 */

import { defaultGitHubService, GitHubService } from '../shared/github-service';

export class GitHubBadge {
  private readonly githubService: GitHubService;
  private readonly badgeElement: HTMLElement;
  private readonly starCountElement: HTMLElement;
  private updateInterval: NodeJS.Timeout | null = null;

  constructor(githubService: GitHubService = defaultGitHubService) {
    this.githubService = githubService;
    this.badgeElement = document.getElementById('github-badge')!;
    this.starCountElement = document.getElementById('github-star-count')!;
    
    this.initialize();
  }

  /**
   * 初始化GitHub徽标
   */
  private async initialize(): Promise<void> {
    try {
      console.log('Initializing GitHub badge...');
      
      // 立即加载数据
      await this.updateStarCount();
      
      // 设置定期更新（每5分钟）
      this.updateInterval = setInterval(() => {
        this.updateStarCount();
      }, 5 * 60 * 1000);

      // 添加点击事件监听
      this.setupEventListeners();
      
      console.log('GitHub badge initialized successfully');
    } catch (error) {
      console.error('Error initializing GitHub badge:', error);
      this.showError();
    }
  }

  /**
   * 更新star数量显示
   */
  private async updateStarCount(): Promise<void> {
    try {
      console.log('Updating GitHub star count...');
      
      // 显示加载状态
      this.showLoading();
      
      // 获取仓库信息
      const repoInfo = await this.githubService.getRepoInfo();
      
      if (repoInfo) {
        // 更新显示
        const formattedCount = GitHubService.formatStarCount(repoInfo.stargazersCount);
        this.starCountElement.textContent = formattedCount;
        this.starCountElement.className = 'github-star-count';
        
        // 更新tooltip
        this.updateTooltip(repoInfo);
        
        console.log(`GitHub star count updated: ${repoInfo.stargazersCount} (${formattedCount})`);
        
        // 添加更新动画
        this.starCountElement.classList.add('updating');
        setTimeout(() => {
          this.starCountElement.classList.remove('updating');
        }, 1000);
      } else {
        this.showError();
      }
    } catch (error) {
      console.error('Error updating star count:', error);
      this.showError();
    }
  }

  /**
   * 显示加载状态
   */
  private showLoading(): void {
    this.starCountElement.textContent = '加载中...';
    this.starCountElement.className = 'github-star-count github-loading';
  }

  /**
   * 显示错误状态
   */
  private showError(): void {
    this.starCountElement.textContent = '加载失败';
    this.starCountElement.className = 'github-star-count github-error';
  }

  /**
   * 更新tooltip内容
   */
  private updateTooltip(repoInfo: any): void {
    const tooltip = this.badgeElement.querySelector('.github-tooltip') as HTMLElement;
    if (tooltip) {
      const lastUpdated = GitHubService.getRelativeTime(repoInfo.updatedAt);
      tooltip.textContent = `${repoInfo.stargazersCount} stars • ${repoInfo.forksCount} forks • 更新于${lastUpdated}`;
    }
  }

  /**
   * 设置事件监听器
   */
  private setupEventListeners(): void {
    // 点击刷新功能（双击徽标）
    let clickCount = 0;
    this.badgeElement.addEventListener('click', (e) => {
      clickCount++;
      
      if (clickCount === 1) {
        setTimeout(() => {
          if (clickCount === 2) {
            // 双击：强制刷新
            e.preventDefault();
            this.forceRefresh();
          }
          clickCount = 0;
        }, 300);
      }
    });

    // 鼠标悬停效果
    this.badgeElement.addEventListener('mouseenter', () => {
      this.onMouseEnter();
    });

    this.badgeElement.addEventListener('mouseleave', () => {
      this.onMouseLeave();
    });

    // 键盘访问性支持
    this.badgeElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const link = this.badgeElement.querySelector('a') as HTMLAnchorElement;
        if (link) {
          link.click();
        }
      }
    });
  }

  /**
   * 鼠标进入事件
   */
  private onMouseEnter(): void {
    // 可以添加额外的悬停效果
    const cacheInfo = this.githubService.getCacheInfo();
    if (cacheInfo.cached && cacheInfo.expires) {
      const tooltip = this.badgeElement.querySelector('.github-tooltip') as HTMLElement;
      if (tooltip) {
        const expiresIn = Math.ceil(cacheInfo.expires / 1000 / 60);
        const originalText = tooltip.textContent;
        tooltip.textContent += ` • 缓存${expiresIn}分钟后过期`;
        
        // 恢复原始文本
        setTimeout(() => {
          tooltip.textContent = originalText;
        }, 3000);
      }
    }
  }

  /**
   * 鼠标离开事件
   */
  private onMouseLeave(): void {
    // 可以添加鼠标离开时的效果
  }

  /**
   * 强制刷新数据
   */
  private async forceRefresh(): Promise<void> {
    try {
      console.log('Force refreshing GitHub data...');
      
      // 显示刷新状态
      this.starCountElement.textContent = '刷新中...';
      this.starCountElement.className = 'github-star-count github-loading';
      
      // 强制刷新数据
      const repoInfo = await this.githubService.refreshRepoInfo();
      
      if (repoInfo) {
        const formattedCount = GitHubService.formatStarCount(repoInfo.stargazersCount);
        this.starCountElement.textContent = formattedCount;
        this.starCountElement.className = 'github-star-count';
        this.updateTooltip(repoInfo);
        
        // 显示刷新成功提示
        this.showRefreshSuccess();
      } else {
        this.showError();
      }
    } catch (error) {
      console.error('Error force refreshing:', error);
      this.showError();
    }
  }

  /**
   * 显示刷新成功提示
   */
  private showRefreshSuccess(): void {
    const tooltip = this.badgeElement.querySelector('.github-tooltip') as HTMLElement;
    if (tooltip) {
      const originalText = tooltip.textContent;
      tooltip.textContent = '数据已刷新！';
      tooltip.style.background = 'rgba(34, 197, 94, 0.9)';
      
      setTimeout(() => {
        tooltip.textContent = originalText;
        tooltip.style.background = 'rgba(0, 0, 0, 0.9)';
      }, 2000);
    }
  }

  /**
   * 销毁组件
   */
  public destroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    console.log('GitHub badge destroyed');
  }

  /**
   * 获取当前状态信息
   */
  public getStatus(): { 
    isLoading: boolean; 
    hasError: boolean; 
    cacheInfo: any;
    lastUpdate?: string;
  } {
    const isLoading = this.starCountElement.classList.contains('github-loading');
    const hasError = this.starCountElement.classList.contains('github-error');
    const cacheInfo = this.githubService.getCacheInfo();
    
    return {
      isLoading,
      hasError,
      cacheInfo,
      lastUpdate: new Date().toISOString()
    };
  }
}

// 导出单例实例
export let githubBadge: GitHubBadge | null = null;

/**
 * 初始化GitHub徽标
 */
export function initializeGitHubBadge(): void {
  if (!githubBadge) {
    githubBadge = new GitHubBadge();
  }
}

/**
 * 销毁GitHub徽标
 */
export function destroyGitHubBadge(): void {
  if (githubBadge) {
    githubBadge.destroy();
    githubBadge = null;
  }
}

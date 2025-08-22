/**
 * 目录平滑滚动增强
 * 为 Docusaurus 的目录导航添加平滑滚动功能
 */

(function() {
  'use strict';

  let isInitialized = false;
  let retryCount = 0;
  const maxRetries = 20; // 最大重试次数

  // 检查是否在文档页面
  function isDocPage() {
    return window.location.pathname.includes('/docs/') || 
           document.querySelector('.theme-doc-toc-desktop') ||
           document.querySelector('.table-of-contents');
  }

  // 等待目录加载完成
  function waitForToc() {
    return new Promise((resolve, reject) => {
      const checkToc = () => {
        // 检查多种可能的目录选择器
        const toc = document.querySelector('.table-of-contents') || 
                   document.querySelector('.theme-doc-toc-desktop') ||
                   document.querySelector('[class*="toc"]');
                   
        if (toc && toc.children.length > 0) {
          // 确保目录有实际内容
          const links = toc.querySelectorAll('a[href^="#"]') || 
                       toc.querySelectorAll('.table-of-contents__link') ||
                       toc.querySelectorAll('[class*="toc"] a');
          if (links.length > 0) {
            resolve(toc);
            return;
          }
        }
        
        retryCount++;
        if (retryCount >= maxRetries) {
          reject(new Error('TOC not found after maximum retries'));
          return;
        }
        
        setTimeout(checkToc, 200); // 增加等待时间
      };
      checkToc();
    });
  }

  // 平滑滚动到指定位置
  function smoothScrollTo(element, offset = 80) {
    if (!element) return;
    
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  // 增强目录链接
  function enhanceTocLinks(toc) {
    if (!toc || isInitialized) return;
    
    // 查找所有可能的目录链接
    const links = toc.querySelectorAll('a[href^="#"]') || 
                 toc.querySelectorAll('.table-of-contents__link') ||
                 toc.querySelectorAll('[class*="toc"] a');
    
    if (links.length === 0) return;
    
    links.forEach(link => {
      // 移除可能存在的旧事件监听器
      link.removeEventListener('click', handleTocClick);
      // 添加新的事件监听器
      link.addEventListener('click', handleTocClick);
    });
    
    isInitialized = true;
    console.log('TOC enhancement initialized with', links.length, 'links');
  }

  // 处理目录链接点击
  function handleTocClick(e) {
    e.preventDefault();
    
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // 平滑滚动到目标位置
      smoothScrollTo(targetElement, 80);
      
      // 更新 URL 哈希
      if (history.pushState) {
        history.pushState(null, null, href);
      } else {
        location.hash = href;
      }
    }
  }

  // 使用 MutationObserver 监听 DOM 变化
  function setupMutationObserver() {
    if (window.tocObserver) {
      window.tocObserver.disconnect();
    }

    window.tocObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // 检查是否有新的目录元素被添加
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // 检查多种可能的目录选择器
              const toc = node.classList && node.classList.contains('table-of-contents') ? node :
                         node.classList && node.classList.contains('theme-doc-toc-desktop') ? node :
                         node.querySelector && (node.querySelector('.table-of-contents') || 
                                             node.querySelector('.theme-doc-toc-desktop') ||
                                             node.querySelector('[class*="toc"]')) ? 
                         (node.querySelector('.table-of-contents') || 
                          node.querySelector('.theme-doc-toc-desktop') ||
                          node.querySelector('[class*="toc"]')) : null;
              
              if (toc) {
                setTimeout(() => enhanceTocLinks(toc), 100);
              }
            }
          });
        }
      });
    });

    // 监听整个文档的变化
    window.tocObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // 直接初始化函数（用于立即执行）
  function directInit() {
    if (!isDocPage()) return false;
    
    // 检查多种可能的目录选择器
    const toc = document.querySelector('.table-of-contents') || 
               document.querySelector('.theme-doc-toc-desktop') ||
               document.querySelector('[class*="toc"]');
               
    if (toc && toc.children.length > 0) {
      const links = toc.querySelectorAll('a[href^="#"]') || 
                   toc.querySelectorAll('.table-of-contents__link') ||
                   toc.querySelectorAll('[class*="toc"] a');
      if (links.length > 0) {
        enhanceTocLinks(toc);
        return true;
      }
    }
    return false;
  }

  // 初始化函数
  async function init() {
    try {
      // 重置状态
      isInitialized = false;
      retryCount = 0;
      
      // 设置 MutationObserver
      setupMutationObserver();
      
      // 尝试立即初始化
      const toc = await waitForToc();
      enhanceTocLinks(toc);
      
    } catch (error) {
      console.warn('TOC enhancement failed:', error);
      
      // 即使失败也设置 MutationObserver，以防后续动态加载
      setupMutationObserver();
    }
  }

  // 强制重新初始化（用于调试）
  window.reinitTocEnhancement = function() {
    isInitialized = false;
    retryCount = 0;
    init();
  };

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // 立即尝试初始化
      if (!directInit()) {
        // 如果立即初始化失败，使用延迟初始化
        setTimeout(init, 100);
      }
    });
  } else {
    // 如果页面已经加载完成，立即尝试初始化
    if (!directInit()) {
      setTimeout(init, 100);
    }
  }

  // 支持 Docusaurus 的页面切换
  if (typeof window !== 'undefined') {
    window.addEventListener('docusaurus:routeChangeComplete', () => {
      // 路由变化后立即尝试初始化
      if (!directInit()) {
        setTimeout(init, 300);
      }
    });
    
    // 监听页面可见性变化
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        // 页面重新可见时，重新检查目录
        if (!directInit()) {
          setTimeout(init, 200);
        }
      }
    });
  }

  // 定期检查目录（备用方案）
  setInterval(() => {
    if (!isInitialized && isDocPage()) {
      directInit();
    }
  }, 500);

  // 在 window load 事件后再次尝试初始化
  window.addEventListener('load', () => {
    if (!isInitialized && isDocPage()) {
      setTimeout(directInit, 100);
    }
  });

})(); 
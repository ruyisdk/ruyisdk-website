// Make menu title area clickable for expand/collapse when arrow is hidden
(function() {
  'use strict';

  function handleMenuTitleClick(e) {
    const link = e.target.closest('.menu__link--sublist');
    if (!link) return;

    const collapsible = link.closest('.menu__list-item-collapsible');
    if (!collapsible) return;

    const menuItem = collapsible.closest('.menu__list-item');
    if (!menuItem) return;

    // Find the native caret button
    const caretButton = collapsible.querySelector('.menu__caret');
    if (caretButton) {
      e.preventDefault();
      e.stopPropagation();
      caretButton.click();
    }
  }

  function init() {
    // Remove old listeners and add new ones
    document.removeEventListener('click', handleMenuTitleClick, true);
    document.addEventListener('click', handleMenuTitleClick, true);
  }

  // Wait for sidebar to be ready
  function waitForSidebar() {
    const sidebar = document.querySelector('.theme-doc-sidebar-container') || 
                    document.querySelector('.menu') ||
                    document.querySelector('nav[aria-label*="侧边栏"]') ||
                    document.querySelector('nav[aria-label*="sidebar"]');
    
    if (sidebar) {
      init();
      // Also set up observer for dynamic content
      const observer = new MutationObserver(() => {
        init();
      });
      observer.observe(sidebar, {
        childList: true,
        subtree: true
      });
    } else {
      // Retry if sidebar not ready (max 20 times = 2 seconds)
      if (waitForSidebar.retryCount === undefined) {
        waitForSidebar.retryCount = 0;
      }
      if (waitForSidebar.retryCount < 20) {
        waitForSidebar.retryCount++;
        setTimeout(waitForSidebar, 100);
      } else {
        // Fallback: initialize anyway after timeout
        init();
      }
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForSidebar);
  } else {
    waitForSidebar();
  }

  // Re-initialize on navigation (for SPA)
  window.addEventListener('popstate', () => {
    setTimeout(waitForSidebar, 100);
  });

  // Also listen for route changes in Docusaurus
  if (typeof window !== 'undefined') {
    // Wait for docusaurus to be available
    if (window.docusaurus) {
      window.addEventListener('docusaurus:routeUpdate', () => {
        setTimeout(waitForSidebar, 100);
      });
    } else {
      // Wait for docusaurus to load
      window.addEventListener('load', () => {
        if (window.docusaurus) {
          window.addEventListener('docusaurus:routeUpdate', () => {
            setTimeout(waitForSidebar, 100);
          });
        }
      });
    }
  }
})();


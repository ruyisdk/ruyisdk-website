import { useEffect, useState } from 'react';

/**
 * Custom hook to handle navbar scroll behavior and adjust sidebar accordingly
 */
export function useNavbarScroll() {
  const [isNavbarHidden, setIsNavbarHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        // Check if navbar has the hidden class
        const hidden = navbar.classList.contains('navbar--hidden');
        setIsNavbarHidden(hidden);
        
        // Adjust sidebar positioning when navbar state changes
        const sidebar = document.querySelector('.col--3');
        if (sidebar) {
          if (hidden) {
            // When navbar is hidden, ensure sidebar fills the viewport
            sidebar.style.minHeight = '100vh';
            sidebar.style.top = '0';
          } else {
            // When navbar is visible, account for navbar height
            const navbarHeight = navbar.offsetHeight;
            sidebar.style.minHeight = `calc(100vh - ${navbarHeight}px)`;
            sidebar.style.top = '0';
          }
        }
      }
    };

    // Initial check
    handleScroll();

    // Listen for scroll events
    window.addEventListener('scroll', handleScroll);
    
    // Also listen for DOM mutations in case navbar classes change
    const observer = new MutationObserver(handleScroll);
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      observer.observe(navbar, { 
        attributes: true, 
        attributeFilter: ['class'] 
      });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return isNavbarHidden;
}

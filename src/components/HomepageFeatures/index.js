import React, { useRef, useEffect, useState } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import Translate, { translate } from '@docusaurus/Translate';

const FeatureList = [
  {
    title: <Translate>RuyiSDK 包管理器</Translate>,
    Svg: require("@site/static/img/undraw_coding_re_iv62.svg").default,
    description: (
      <Translate>
        在线软件源和管理工具集中存储了 RISC-V 集成开发环境所需的编译工具链、调试工具、模拟器、运行环境、文档、代码、工具、target系统镜像等内容以及用于与在线软件源交互的工具。
      </Translate>
    ),
  },
  {
    title: <Translate>RuyiSDK IDE</Translate>,
    Svg: require("@site/static/img/undraw_code_review_re_woeb.svg").default,
    description: (
      <Translate>
        一个专门用来开发能够运行在 RISC-V 架构设备上的软件和应用的工具箱。可以帮助开发者编写和测试自己的程序，用户无需为环境搭建耗费精力。
      </Translate>
    ),
  },
  {
    title: <Translate>社区</Translate>,
    Svg: require("@site/static/img/undraw_sharing_knowledge_03vp.svg").default,
    description: (
      <Translate>
        社区提供文档和教程、论坛和技术讨论区等功能，目的是为 RISC-V 开发者提供一个开放的交流平台，提供互助式技术支持和资源共享，聚集 RISC-V 开发者并推动 RISC-V 生态系统的发展。
      </Translate>
    ),
  },
  {
    title: <Translate>开放源代码</Translate>,
    Svg: require("@site/static/img/undraw_open_source_-1-qxw.svg").default,
    description: (
      <Translate>
        我们的代码完全开源，意味着每个人都可以在许可证允许的条件下查看、使用、修改和共享它。无论你是开发者、学生、爱好者还是企业，都可以自由地参与到我们的项目中，共同构建更好的 RuyiSDK。欢迎加入我们的社区，一起推动开源的发展！
      </Translate>
    ),
  },
];

// Observer hook for animation
function useIntersectionObserver(elementRef, options) {
  useEffect(() => {
    if (!elementRef.current) return;
    
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible);
        }
      });
    }, options);

    observer.observe(elementRef.current);
    
    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [elementRef, options]);
}

function Feature({ Svg, title, description, index }) {
  const featureRef = useRef(null);
  useIntersectionObserver(featureRef, { threshold: 0.1 });

  return (
    <div 
      ref={featureRef}
      className={styles.feature} 
      style={{ '--delay': `${index * 0.15}s` }}
      id={`feature-${index}`}
    >
      <div className={styles.featureContent}>
        <div className={styles.featureImage}>
          <Svg className={styles.featureSvg} role="img" />
        </div>
        <div className={styles.featureText}>
          <Heading as="h3" className={styles.featureTitle}>
            {title}
          </Heading>
          <div className={styles.featureDescription}>
            {description}
          </div>
        </div>
      </div>
    </div>
  );
}

// Parallax effect on scroll
function useParallaxEffect() {
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const parallaxElements = document.querySelectorAll(`.${styles.parallax}`);
      
      parallaxElements.forEach((el, i) => {
        const speed = i % 2 === 0 ? 0.2 : -0.2;
        el.style.transform = `translateY(${scrollY * speed}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}

// Check if the screen is mobile size
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  return isMobile;
}

// Handle page-snap scrolling for mobile
function useSnapScroll() {
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (!isMobile) return;
    
    const features = document.querySelectorAll(`.${styles.feature}`);
    let currentFeature = 0;
    let isScrolling = false;
    
    const scrollToFeature = (index) => {
      if (index < 0 || index >= features.length || isScrolling) return;
      
      isScrolling = true;
      currentFeature = index;
      
      features[index].scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      setTimeout(() => {
        isScrolling = false;
      }, 800);
    };
    
    const handleWheel = (e) => {
      if (!isMobile) return;
      
      e.preventDefault();
      if (isScrolling) return;
      
      if (e.deltaY > 0) {
        // Scroll down
        scrollToFeature(currentFeature + 1);
      } else {
        // Scroll up
        scrollToFeature(currentFeature - 1);
      }
    };
    
    const container = document.querySelector(`.${styles.featureScrollContainer}`);
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    // Handle touch events for mobile
    let touchStartY = 0;
    
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e) => {
      if (!isMobile || isScrolling) return;
      
      const touchY = e.touches[0].clientY;
      const diff = touchStartY - touchY;
      
      if (Math.abs(diff) > 30) {
        e.preventDefault();
        
        if (diff > 0) {
          // Swipe up - go to next
          scrollToFeature(currentFeature + 1);
        } else {
          // Swipe down - go to previous
          scrollToFeature(currentFeature - 1);
        }
        
        touchStartY = touchY;
      }
    };
    
    if (container) {
      container.addEventListener('touchstart', handleTouchStart);
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
    }
    
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [isMobile]);
}

export default function HomepageFeatures() {
  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);
  
  useIntersectionObserver(sectionRef, { threshold: 0.1 });
  useParallaxEffect();
  useSnapScroll();

  return (
    <section className={styles.features} ref={sectionRef}>
      <div className={styles.featureContainer}>
        <div className={styles.featureScrollContainer} ref={scrollContainerRef}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} index={idx} {...props} />
          ))}
        </div>
      </div>
      
      <div className={styles.parallaxContainer}>
        <div className={clsx(styles.parallax, styles.parallaxCircle1)}></div>
        <div className={clsx(styles.parallax, styles.parallaxCircle2)}></div>
        <div className={clsx(styles.parallax, styles.parallaxCircle3)}></div>
      </div>
    </section>
  );
}

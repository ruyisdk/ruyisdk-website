import { useState, useEffect, useRef } from 'react';
import { Tag } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Translate, { translate } from '@docusaurus/Translate';
import styles from './mainDisplay.module.css';
import SlideNews from '../SlideNews';

// A terminal simulation that cycles through a set of commands.
const Terminal = () => {
  const [currentCommand, setCurrentCommand] = useState(0);
  const [typing, setTyping] = useState(true);
  const [text, setText] = useState('');
  const terminalRef = useRef(null);

  // Define commands and their outputs for the terminal animation.
  const commands = [
    {
      command: 'ruyi update',
      output: `There are 5 new news item(s):
 No.   ID                                  Title
─────────────────────────────────────────────────────────
 1    2025-02-25-ruyi-0.28                Release notes for RuyiSDK 0.28
 2    2025-03-11-ruyi-0.29                Release notes for RuyiSDK 0.29
 3    2025-03-25-ruyi-0.30                Release notes for RuyiSDK 0.30
 4    2025-04-08-ruyi-0.31                Release notes for RuyiSDK 0.31
 5    2025-04-22-ruyi-0.32                Release notes for RuyiSDK 0.32
You can read them with ruyi news read.`,
    },
    {
      command: 'ruyi list --name-contains \'riscv\'',
      output: `List of available packages:
* board-image/openkylin-riscv64-sifive-unmatched
  - 1.0.0 (latest)
* board-image/freebsd-riscv64-mini-live
  - 14.0.0 (latest)
* board-image/ubuntu-server-riscv64-sifive-unmatched
  - 0.2310.0 (latest)
* board-image/openbsd-riscv64-live
  - 7.4.0 (latest)
* analyzer/dynamorio-riscv
  - 10.93.19979-ruyi.20240914 (latest, no binary for current host)
  - 10.0.19748-ruyi.20240128 (no binary for current host)
* emulator/qemu-user-riscv-xthead
  - 6.1.0-ruyi.20231207+g03813c9fe8 (latest)
* emulator/qemu-system-riscv-upstream
  - 8.2.0-ruyi.20240128 (latest)
* emulator/qemu-user-riscv-upstream
  - 8.2.0-ruyi.20240128 (latest)
  - 8.1.2-ruyi.20231121 ()`,
    },
    {
      command: 'ruyi install emulator/qemu-user-riscv-upstream',
      output: `info: downloading https://mirror.iscas.ac.cn/ruyisdk/dist/qemu-user-riscv-upstream-8.2.0.ruyi-20240128.amd64.tar.zst to /home/me/.cache/ruyi/distfiles/qemu-user-riscv-upstream-8.2.0.ruyi-20240128.amd64.tar.zst
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 14.5M  100 14.5M    0     0  1116k      0  0:00:13  0:00:13 --:--:-- 1143k
info: extracting qemu-user-riscv-upstream-8.2.0.ruyi-20240128.amd64.tar.zst for package qemu-user-riscv-upstream-8.2.0-ruyi.20240128
info: package qemu-user-riscv-upstream-8.2.0-ruyi.20240128 installed to /home/me/.local/share/ruyi/binaries/x86_64/qemu-user-riscv-upstream-8.2.0-ruyi.20240128`,
    },
  ];

  // Animation for typing and showing output
  useEffect(() => {
    if (currentCommand >= commands.length) {
      // Loop back to the first command
      setTimeout(() => {
        setText('');
        setCurrentCommand(0);
        setTyping(true);
      }, 1000);
      return;
    }

    const cmd = commands[currentCommand];
    const prefix = 'me@Ruyi ~ $ ';

    if (typing) {
      // Animate typing the command
      let i = 0;
      const typeInterval = setInterval(() => {
        if (i <= cmd.command.length) {
          setText(prefix + cmd.command.substring(0, i));
          i++;
        } else {
          clearInterval(typeInterval);
          setTyping(false);
         
          // Small delay after typing is complete before showing output
          setTimeout(() => {
            // Animate the output - now with 2s animation
            let outputText = '';
            let outputIndex = 0;
            const outputInterval = setInterval(() => {
              if (outputIndex < cmd.output.length) {
                outputText += cmd.output.charAt(outputIndex);
                setText(prefix + cmd.command + '\n' + outputText);
                outputIndex++;
              } else {
                clearInterval(outputInterval);
               
                // Wait 3 seconds after command completes, then show 'clear' command
                setTimeout(() => {
                  setText(prefix + cmd.command + '\n' + cmd.output + '\n' + prefix + 'clear');
                 
                  // Slight delay to show 'clear' command, then clear and go to next command
                  setTimeout(() => {
                    setText('');
                    setCurrentCommand(currentCommand + 1);
                    setTyping(true);
                  }, 500);
                }, 3000);
              }
            }, 2000 / cmd.output.length); // Adjust speed to finish in 2 seconds
          }, 300);
        }
      }, 50); // Typing speed
     
      return () => clearInterval(typeInterval);
    }
  }, [currentCommand, typing]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [text]);

  return (
    <div className={styles.terminal}>
      <div className={styles.terminalHeader}>
        <div className={styles.terminalButtons}>
          <span className={`${styles.terminalButton} ${styles.closeButton}`}></span>
          <span className={`${styles.terminalButton} ${styles.minimizeButton}`}></span>
          <span className={`${styles.terminalButton} ${styles.maximizeButton}`}></span>
        </div>
        <div className={styles.terminalTitle}>Terminal</div>
      </div>
      <div className={styles.terminalContent} ref={terminalRef}>
        <pre>{text}</pre>
      </div>
    </div>
  );
};

// A decorative background animation with moving blobs.
const BackgroundAnimation = () => {
  return (
    <div className={styles.animationContainer}>
      <div className={`${styles.blob} ${styles.blob1}`}></div>
      <div className={`${styles.blob} ${styles.blob2}`}></div>
      <div className={`${styles.blob} ${styles.blob3}`}></div>
    </div>
  );
};

const MainDisplay = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
 
  // State for button hover effects.
  const [isPrimaryButtonHovered, setIsPrimaryButtonHovered] = useState(false);
  const [isSecondaryButtonHovered, setIsSecondaryButtonHovered] = useState(false);
 
  const modalRef = useRef(null);

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleModalClose();
    }
  };

  // Add animation keyframes to the document's head.
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      @keyframes ruyiHueRotate {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(10deg); }
      }
      @keyframes blobMove1 {
        0% { transform: translate(0%, 0%); }
        100% { transform: translate(8%, -8%); }
      }
      @keyframes blobMove2 {
        0% { transform: translate(0%, 0%); }
        100% { transform: translate(-8%, 8%); }
      }
      @keyframes blobMove3 {
        0% { transform: translate(0%, 0%); }
        100% { transform: translate(4%, -4%); }
      }
    `;
    document.head.appendChild(styleEl);
   
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  // Define button styles with hover effects and scalable units.
  const primaryButtonStyle = {
    background: 'linear-gradient(180deg, #0A2C7E 0%, #071E58 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '1.5rem', // Using rem for scalability
    padding: '0.75rem 1.5rem', // Using rem for scalability
    fontSize: 'clamp(1rem, 1.2vw, 1.1rem)', // Fluid font size
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease-out',
    boxShadow: isPrimaryButtonHovered
      ? '0 0.25rem 1rem rgba(10, 44, 126, 0.4)'
      : '0 0.125rem 0.375rem rgba(10, 44, 126, 0.3)',
    transform: isPrimaryButtonHovered ? 'translateY(-0.125rem)' : 'translateY(0)',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const secondaryButtonStyle = {
    background: 'rgba(249, 194, 60, 0.15)',
    color: '#0A2C7E',
    border: 'none',
    borderRadius: '1.5rem', // Using rem for scalability
    padding: '0.75rem 1.5rem', // Using rem for scalability
    fontSize: 'clamp(1rem, 1.2vw, 1.1rem)', // Fluid font size
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease-out',
    boxShadow: isSecondaryButtonHovered
      ? '0 0.25rem 1rem rgba(249, 194, 60, 0.3)'
      : '0 0.125rem 0.5rem rgba(249, 194, 60, 0.1)',
    transform: isSecondaryButtonHovered ? 'translateY(-0.125rem)' : 'translateY(0)',
    backgroundColor: isSecondaryButtonHovered
      ? 'rgba(249, 194, 60, 0.25)'
      : 'rgba(249, 194, 60, 0.15)',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div>
      <div className={styles.container}>
      <BackgroundAnimation />
      
        {/* Main page content */}
        <div className={styles.mainContent}>
          <div className={styles.contentRow}>
            <div className={styles.leftContent}>
              <h1 className={styles.title}>RuyiSDK</h1>
              <p className={styles.subtitle}><Translate>面向 RISC-V 架构的一体化集成开发环境</Translate></p>
            
              <div className={styles.buttonContainer}>
                <a
                  href="/download"
                  style={primaryButtonStyle}
                  onMouseEnter={() => setIsPrimaryButtonHovered(true)}
                  onMouseLeave={() => setIsPrimaryButtonHovered(false)}
                >
                  <Translate>获取 Ruyi</Translate>
                </a>
                <a
                  href="/docs/intro"
                  style={secondaryButtonStyle}
                  onMouseEnter={() => setIsSecondaryButtonHovered(true)}
                  onMouseLeave={() => setIsSecondaryButtonHovered(false)}
                >
                  <Translate>查看文档</Translate>
                </a>
              </div>
            </div>
          
            {/* Terminal component on the right */}
            <div className={styles.terminalContainer}>
              <Terminal />
            </div>
          </div>
        </div>
      
        {/* Package details modal */}
        {modalVisible && (
          <div className={styles.modalOverlay} onClick={handleClickOutside}>
            <div className={styles.modal} ref={modalRef}>
              <div className={styles.modalHeader}>
                <h2>{selectedPackage.name}</h2>
                <CloseOutlined className={styles.closeIcon} onClick={handleModalClose} />
              </div>
              <div className={styles.modalContent}>
                <p className={styles.packageVersion}>{selectedPackage.version}</p>
                <p className={styles.packageDescription}>{selectedPackage.description}</p>
                <div className={styles.packageTags}>
                  {selectedPackage.tags.map((tag, index) => (
                    <Tag key={index} color="blue">{tag}</Tag>
                  ))}
                </div>
                <div className={styles.packageStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>{translate({ id: "下载量", message: "下载量" })}</span>
                    <span className={styles.statValue}>{selectedPackage.downloads}</span>
                  </div>
                </div>
                <button className={styles.downloadButton}>
                  {translate({ id: "下载", message: "下载" })}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* The SlideNews component remains outside the main scaling container */}
      </div>
      <SlideNews />
    </div>
  );
};

export default MainDisplay;
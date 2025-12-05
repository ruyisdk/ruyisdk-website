import { useState, useEffect, useRef } from 'react';
import { Tag } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Translate, { translate } from '@docusaurus/Translate';
import SlideNews from '../common/SlideNews';

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
 No.   ID                             Title
─────────────────────────────────────────────────────────
 1     2025-02-25-ruyi-0.28           Release notes for RuyiSDK 0.28
 2     2025-03-11-ruyi-0.29           Release notes for RuyiSDK 0.29
 3     2025-03-25-ruyi-0.30           Release notes for RuyiSDK 0.30
 4     2025-04-08-ruyi-0.31           Release notes for RuyiSDK 0.31
 5     2025-04-22-ruyi-0.32           Release notes for RuyiSDK 0.32
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
100 14.5M  100 14.5M    0     0  1116k       0  0:00:13  0:00:13 --:--:-- 1143k
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
    <div className="flex flex-col h-full w-full bg-[#1e1f29] rounded-lg shadow-xl overflow-hidden">
      <div className="flex items-center bg-[#282a36] px-3 py-2 border-b border-[#44475a] flex-shrink-0">
        <div className="flex gap-2 mr-4">
          <span className="w-3 h-3 rounded-full block bg-[#ff5555]"></span>
          <span className="w-3 h-3 rounded-full block bg-[#f1fa8c]"></span>
          <span className="w-3 h-3 rounded-full block bg-[#50fa7b]"></span>
        </div>
        <div className="text-[#f8f8f2] text-sm font-medium flex-1 text-center">Terminal</div>
      </div>
      <div className="p-4 text-[#f8f8f2] text-sm leading-6 overflow-y-auto flex-1 bg-[#1e1f29] min-h-0" ref={terminalRef}>
        <pre className="m-0 font-mono whitespace-pre-wrap break-words">{text}</pre>
      </div>
    </div>
  );
};

// A decorative background animation with moving blobs.
const BackgroundAnimation = () => {
  // Colors used in the original CSS :root
  const ruyiLightBlue = '#D9E0F3';
  const ruyiLightGold = '#FDEFC3';

  const blobBase = {
    position: 'absolute',
    width: '150%',
    height: '150%',
    top: '-25%',
    left: '-25%',
    borderRadius: '50%',
    filter: 'blur(50px)',
    opacity: 0.5,
    mixBlendMode: 'soft-light',
    pointerEvents: 'none',
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-gradient-to-b from-transparent to-[#f5f5f7] pointer-events-none">
      <div style={{ ...blobBase, background: `radial-gradient(circle at 30% 30%, ${ruyiLightBlue}, transparent 60%)`, animation: 'blobMove1 15s infinite alternate ease-in-out' }} />
      <div style={{ ...blobBase, background: `radial-gradient(circle at 70% 40%, ${ruyiLightGold}, transparent 60%)`, animation: 'blobMove2 18s infinite alternate ease-in-out' }} />
      <div style={{ ...blobBase, background: `radial-gradient(circle at 50% 20%, #90b3ff, transparent 60%)`, animation: 'blobMove3 12s infinite alternate ease-in-out', opacity: 0.4 }} />
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
      <div className="py-16 bg-[#f5f5f7] font-sans w-full relative overflow-hidden flex flex-col">
        <BackgroundAnimation />

        {/* Main page content */}
        <div className="relative z-10 mx-auto max-w-site w-[90%] px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center lg:gap-12 gap-10 w-full">
            <div className="flex-1 lg:min-w-[300px] min-w-0 lg:max-w-[500px] max-w-full flex flex-col lg:block items-center lg:items-start text-center lg:text-left">
              <h1 className="text-[clamp(2.5rem,5vw,3.5rem)] font-extrabold mb-4 text-[#0A2C7E] tracking-tight">RuyiSDK</h1>
              <p className="text-[clamp(1.125rem,2.5vw,1.5rem)] text-[#515154] mb-10 leading-7 lg:max-w-[40ch] max-w-none"><Translate>面向 RISC-V 架构的一体化集成开发环境</Translate></p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
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
            <div className="w-full max-w-[600px] h-[420px] relative flex-shrink-0 lg:w-[600px]">
              <Terminal />
            </div>
          </div>
        </div>

        {/* Package details modal */}
        {modalVisible && selectedPackage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleClickOutside}>
            <div className="bg-white rounded-2xl w-[480px] max-w-[90vw] shadow-2xl overflow-hidden" ref={modalRef}>
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">{selectedPackage.name}</h2>
                <CloseOutlined className="text-xl cursor-pointer" onClick={handleModalClose} />
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600">{selectedPackage.version}</p>
                <p className="mt-2 text-gray-700">{selectedPackage.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedPackage.tags.map((tag, index) => (
                    <Tag key={index} color="blue">{tag}</Tag>
                  ))}
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{translate({ id: "下载量", message: "下载量" })}</span>
                    <span className="font-medium">{selectedPackage.downloads}</span>
                  </div>
                </div>
                <button className="mt-6 w-full bg-[#0A2C7E] text-white py-3 rounded-lg">{translate({ id: "下载", message: "下载" })}</button>
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

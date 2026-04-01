import { useState, useEffect, useRef } from 'react';
import style from "./styles.module.css"

// A terminal simulation that cycles through a set of commands.
const Terminal = () => {
  const [currentCommand, setCurrentCommand] = useState(0);
  const [typing, setTyping] = useState(true);
  const [text, setText] = useState("");
  const terminalRef = useRef(null);

  // Define commands and their outputs for the terminal animation.
  const commands = [
    {
      command: "ruyi update",
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
      command: "ruyi list --name-contains 'riscv'",
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
      command: "ruyi install emulator/qemu-user-riscv-upstream",
      output: `info: downloading https://mirror.iscas.ac.cn/ruyisdk/dist/qemu-user-riscv-upstream-8.2.0.ruyi-20240128.amd64.tar.zst to /home/we/.cache/ruyi/distfiles/qemu-user-riscv-upstream-8.2.0.ruyi-20240128.amd64.tar.zst
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 14.5M  100 14.5M    0     0  1116k       0  0:00:13  0:00:13 --:--:-- 1143k
info: extracting qemu-user-riscv-upstream-8.2.0.ruyi-20240128.amd64.tar.zst for package qemu-user-riscv-upstream-8.2.0-ruyi.20240128
info: package qemu-user-riscv-upstream-8.2.0-ruyi.20240128 installed to /home/we/.local/share/ruyi/binaries/x86_64/qemu-user-riscv-upstream-8.2.0-ruyi.20240128`,
    },
  ];

  // Animation for typing and showing output
  useEffect(() => {
    if (currentCommand >= commands.length) {
      // Loop back to the first command
      setTimeout(() => {
        setText("");
        setCurrentCommand(0);
        setTyping(true);
      }, 1000);
      return;
    }

    const cmd = commands[currentCommand];
    const prefix = "we@RuyiSDK ~ $ ";

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
            let outputText = "";
            let outputIndex = 0;
            const outputInterval = setInterval(() => {
              if (outputIndex < cmd.output.length) {
                outputText += cmd.output.charAt(outputIndex);
                setText(prefix + cmd.command + "\n" + outputText);
                outputIndex++;
              } else {
                clearInterval(outputInterval);

                // Wait 3 seconds after command completes, then show 'clear' command
                setTimeout(() => {
                  setText(
                    prefix +
                      cmd.command +
                      "\n" +
                      cmd.output +
                      "\n" +
                      prefix +
                      "clear",
                  );

                  // Slight delay to show 'clear' command, then clear and go to next command
                  setTimeout(() => {
                    setText("");
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
    <div
      className="flex h-full w-full flex-col overflow-hidden rounded-lg
        bg-[#1e1f29] text-[#f8f8f2] shadow-xl"
    >
      <div
        className="flex flex-shrink-0 items-center border-b border-[#44475a]
          bg-[#282a36] px-3 py-2"
      >
        <div className="mr-4 flex gap-2">
          <span className="block h-3 w-3 rounded-full bg-[#ff5555]"></span>
          <span className="block h-3 w-3 rounded-full bg-[#f1fa8c]"></span>
          <span className="block h-3 w-3 rounded-full bg-[#50fa7b]"></span>
        </div>
        <div className="flex-1 text-center text-sm font-medium">
          Terminal
        </div>
      </div>
      <div
        className={`flex-1 overflow-y-hidden px-4 pt-4
          ${style.hideScrollbar}`}
      >
        <div
          className="w-full h-full overflow-hidden text-sm leading-6"
             ref={terminalRef}
        >
        <pre className="font-mono break-all whitespace-pre-wrap">
          {text}
        </pre>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
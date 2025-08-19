import React, { useState, useEffect, useRef } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// Removed Docusaurus Layout and context imports for component reusability

// --- Global Styles ---
const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background-color: #f5f5f7;
    color: #1d1d1f;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

// --- Background Animation Keyframes ---
const ruyiHueRotate = keyframes` 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(10deg); } `;
const blobMove1 = keyframes` 0% { transform: translate(0%, 0%) scale(1); } 100% { transform: translate(8%, -8%) scale(1.1); } `;
const blobMove2 = keyframes` 0% { transform: translate(0%, 0%) scale(1); } 100% { transform: translate(-8%, 8%) scale(1.05); } `;
const blobMove3 = keyframes` 0% { transform: translate(0%, 0%) scale(1); } 100% { transform: translate(4%, -4%) scale(0.95); } `;

// --- Background Animation Styled Components ---
const AnimationContainer = styled.div` position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; overflow: hidden; animation: ${ruyiHueRotate} 20s infinite alternate; `;
const Blob = styled.div` position: absolute; border-radius: 100%; filter: blur(90px); opacity: 0.5; `;
const Blob1 = styled(Blob)` width: 550px; height: 550px; top: -150px; left: -200px; background: rgba(0, 122, 255, 0.6); animation: ${blobMove1} 30s infinite alternate; `;
const Blob2 = styled(Blob)` width: 600px; height: 600px; bottom: -200px; right: -250px; background: rgba(88, 86, 214, 0.5); animation: ${blobMove2} 35s infinite alternate; `;
const Blob3 = styled(Blob)` width: 450px; height: 450px; bottom: 50px; left: -150px; background: rgba(52, 199, 89, 0.4); animation: ${blobMove3} 25s infinite alternate; `;
const BackgroundAnimation = () => ( <AnimationContainer> <Blob1 /> <Blob2 /> <Blob3 /> </AnimationContainer> );

// --- Styled Components ---
const mobileBreakpoint = '992px';
const AppContainer = styled.div` width: 100%; position: relative; overflow-y: auto; &::-webkit-scrollbar { display: none; } -ms-overflow-style: none; scrollbar-width: none; @media (max-width: ${mobileBreakpoint}) { display: flex; overflow-x: auto; overflow-y: hidden; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; height: 100vh; } `;
const TutorialContainer = styled.main` padding: 50vh 0; @media (max-width: ${mobileBreakpoint}) { display: flex; align-items: center; padding: 0; height: 100%; width: fit-content; } `;
const StepWrapper = styled.section`
  display: flex;
  align-items: stretch;
  width: 96%;
  max-width: 1400px;
  margin: 0 auto 300px;
  position: relative;
  &:last-of-type { margin-bottom: 0; }
  @media (max-width: ${mobileBreakpoint}) {
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    flex-shrink: 0;
    scroll-snap-align: center;
    justify-content: center;
    padding: 24px;
    padding-bottom: 80px;
    margin: 0;
    align-items: stretch;
  }
`;
// LeftPane now anchors to the content box
const LeftPane = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
  min-width: 0;
  margin-right: 0;
  padding-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  width: 20%;
  max-width: 260px;
  transition: opacity 0.4s, transform 0.4s;
  opacity: ${({ isActive }) => (isActive ? 1 : 0.4)};
  transform: scale(${({ isActive }) => (isActive ? 1 : 0.97)});
  @media (max-width: ${mobileBreakpoint}) {
    flex-direction: row;
    align-items: center;
    width: 100%;
    max-width: none;
    margin-bottom: 16px;
    opacity: 1;
    transform: none;
  }
`;
const TitleContainer = styled.div`
  width: 120%; /* 20% wider than before */
  min-width: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  @media (max-width: ${mobileBreakpoint}) {
    width: auto;
    max-width: none;
    justify-content: flex-start;
    flex-grow: 1;
  }
`;
const StepTitle = styled.h2`
  margin: 0;
  font-size: clamp(1.7rem, 2.2vw, 2.2rem);
  font-weight: 600;
  color: #1d1d1f;
  text-align: right;
  letter-spacing: -0.5px;
  line-height: 1.1;
  width: 120%; /* 20% wider */
  min-width: 0;
  word-break: break-word;
  @media (max-width: ${mobileBreakpoint}) {
    text-align: left;
    font-size: 1.75rem;
    width: 100%;
  }
`;
const TimelineColumn = styled.div`
  flex-shrink: 0;
  margin-bottom: 12px;
  @media (max-width: ${mobileBreakpoint}) {
    margin-right: 12px;
    margin-bottom: 0;
  }
`;
const StepNumber = styled.div` background-color: #007aff; color: white; width: 45px; height: 45px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 1.25rem; font-weight: 600; border: 4px solid #f5f5f7; @media (max-width: ${mobileBreakpoint}) { width: 40px; height: 40px; font-size: 1.1rem; } `;
const ContentColumn = styled.div` flex: 4; min-width: 0; padding-left: clamp(20px, 3vw, 40px); transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out; opacity: ${({ isActive }) => (isActive ? 1 : 0.5)}; transform: scale(${({ isActive }) => (isActive ? 1 : 0.95)}); @media (max-width: ${mobileBreakpoint}) { padding-left: 0; flex: 1; min-height: 0; width: 100%; opacity: 1; transform: none; } `;
const StepCard = styled.div` background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius: 24px; border: 1px solid rgba(0, 0, 0, 0.05); box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.07); width: 100%; max-height: 85vh; overflow-y: auto; &::-webkit-scrollbar { width: 12px; } &::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; } &::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; border: 3px solid #f1f1f1; } &::-webkit-scrollbar-thumb:hover { background: #aaa; } @media (max-width: ${mobileBreakpoint}) { max-height: none; height: 100%; background: rgba(255, 255, 255, 0.85); } `;
const CardContent = styled.div` padding: 40px; @media (max-width: ${mobileBreakpoint}) { padding: 24px; } `;
const MarkdownContainer = styled.div` line-height: 1.7; color: #333; width: 100%; box-sizing: border-box; word-break: break-word; pre { background-color: #2d2d2d; color: #f8f8f2; padding: 1rem; border-radius: 8px; overflow-x: auto; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 0.9rem; line-height: 1.5; &::-webkit-scrollbar { height: 8px; } &::-webkit-scrollbar-track { background: #444; border-radius: 4px; } &::-webkit-scrollbar-thumb { background: #666; border-radius: 4px; } &::-webkit-scrollbar-thumb:hover { background: #888; } } code { background-color: rgba(0, 0, 0, 0.06); padding: 2px 5px; border-radius: 4px; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; color: #c7254e; } pre code { background-color: transparent; color: inherit; padding: 0; border-radius: 0; } `;
const BranchSelectorContainer = styled.div` width: 100%; padding: 40px; text-align: center; @media (max-width: ${mobileBreakpoint}) { display: flex; flex-direction: column; justify-content: center; height: 100%; padding: 20px; } `;
const BranchSelectorTitle = styled.h2` font-size: 2.5rem; font-weight: 600; color: #1d1d1f; margin: 0 0 10px 0; @media (max-width: ${mobileBreakpoint}) { font-size: 2rem; } `;
const BranchSelectorSubtitle = styled.p` font-size: 1.1rem; color: #6e6e73; margin: 0 auto 40px; max-width: 450px; @media (max-width: ${mobileBreakpoint}) { font-size: 1rem; margin-bottom: 24px; } `;
const OptionsListContainer = styled.div` display: flex; flex-direction: column; align-items: center; gap: 12px; margin-top: 24px; max-height: 340px; min-height: 120px; overflow-y: auto; width: 100%; scrollbar-width: thin; scrollbar-color: #d1d1d6 #f5f5f7; &::-webkit-scrollbar { width: 8px; background: #f5f5f7; } &::-webkit-scrollbar-thumb { background: #d1d1d6; border-radius: 8px; } @media (max-width: ${mobileBreakpoint}) { flex-grow: 1; } `;
const SearchBox = styled.input` width: 320px; padding: 12px 16px; border-radius: 12px; border: 1.5px solid #d1d1d6; font-size: 1.1rem; margin-bottom: 12px; background: #f5f5f7; transition: border-color 0.2s; &:focus { outline: none; border-color: #007aff; background: #fff; } `;
const OptionCard = styled.div` background: #fff; border-radius: 20px; border: 2px solid #e5e5e5; padding: 18px 0; min-width: 320px; width: 90%; max-width: 420px; text-align: center; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: transform 0.2s ease-out, box-shadow 0.2s ease-out, border-color 0.2s ease-out; font-family: inherit; margin: 0 auto; &:hover { transform: translateY(-3px); border-color: #007aff; box-shadow: 0 8px 30px rgba(0,0,0,0.1); } `;
const OptionTitle = styled.h3` font-size: 1.05rem; font-weight: 500; margin: 0; color: #1d1d1f; letter-spacing: -0.2px; `;
const ChangeBranchButton = styled.button` position: fixed; top: 80px; right: 20px; z-index: 1000; background-color: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 12px; padding: 8px 16px; font-size: 0.9rem; font-weight: 500; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.05); transition: all 0.2s; &:hover { border-color: rgba(0, 0, 0, 0.2); background-color: #fff; } `;
const MobileNavContainer = styled.div` display: none; @media (max-width: ${mobileBreakpoint}) { display: flex; justify-content: space-between; align-items: center; position: fixed; bottom: 0; left: 0; right: 0; padding: 12px 24px; background-color: rgba(245, 245, 247, 0.8); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); z-index: 1000; } `;
const NavButton = styled.button` background: none; border: none; cursor: pointer; color: #007aff; padding: 8px; display: flex; align-items: center; justify-content: center; transition: opacity 0.2s; opacity: ${({ disabled }) => (disabled ? 0.3 : 1)}; pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')}; &:hover { opacity: 0.7; } `;
const StepIndicator = styled.div` font-size: 0.9rem; font-weight: 500; color: #6e6e73; `;
const ArrowLeftIcon = () => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/> </svg> );
const ArrowRightIcon = () => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/> </svg> );

// --- Helper Functions ---
const getStepContentKeys = (step) => Object.keys(step).filter(key => key !== 'title');
const getStepContent = (step, selectedBranch) => { if (!step) return ""; const contentKeys = getStepContentKeys(step); if (selectedBranch && step[selectedBranch]) return step[selectedBranch]; if (step['content-main']) return step['content-main']; if (contentKeys.length > 0) return step[contentKeys[0]]; return "No content available for this step."; };

// --- The Main Tutorial Component ---

// Now accepts jsonPath as a prop
function TutorialComponent({ jsonPath }) {
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [firstBranchStepIndex, setFirstBranchStepIndex] = useState(null);
  const [branchSearch, setBranchSearch] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState(null);

  const stepRefs = useRef([]);
  const cardRefs = useRef([]);
  const appContainerRef = useRef(null);
  const isScrolling = useRef(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < parseInt(mobileBreakpoint));
    const handleResize = () => setIsMobile(window.innerWidth < parseInt(mobileBreakpoint));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!jsonPath) {
      setError("No tutorial JSON path provided.");
      return;
    }
    fetch(jsonPath)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Could not find the tutorial file at ${jsonPath}. Please check the path and make sure the JSON file exists.`);
        }
        return res.json();
      })
      .then(data => {
        setSteps(data);
        setError(null);
        stepRefs.current = data.map((_, i) => stepRefs.current[i] ?? React.createRef());
        cardRefs.current = data.map((_, i) => cardRefs.current[i] ?? React.createRef());
        const firstBranchIndex = data.findIndex(step => getStepContentKeys(step).length > 1);
        setFirstBranchStepIndex(firstBranchIndex !== -1 ? firstBranchIndex : null);
      })
      .catch(fetchError => {
        console.error("Error fetching tutorial data:", fetchError);
        setError(fetchError.message);
      });
  }, [jsonPath]);

  const scrollToStep = (index, behavior = 'smooth') => { const targetEl = stepRefs.current[index]?.current; if (!targetEl) return; if (isMobile) { targetEl.scrollIntoView({ behavior, block: 'nearest', inline: 'center' }); } else { targetEl.scrollIntoView({ behavior, block: 'center' }); } };
  useEffect(() => { if (steps.length > 0) setTimeout(() => scrollToStep(0, 'auto'), 100); }, [steps.length, isMobile]);
  const handleSelectBranch = (branch) => setSelectedBranch(branch);
  const handleChangeBranch = () => {
    setSelectedBranch(null);
    if (firstBranchStepIndex !== null) {
      setCurrentStep(firstBranchStepIndex);
      scrollToStep(firstBranchStepIndex);
    }
  };
  const handleGoToPrev = () => { if (currentStep > 0) scrollToStep(currentStep - 1); };
  const handleGoToNext = () => { if (currentStep < steps.length - 1) scrollToStep(currentStep + 1); };
  const handleWheel = (e) => { if (currentStep === firstBranchStepIndex && !selectedBranch) { e.preventDefault(); return; } const activeCard = cardRefs.current[currentStep]; if (activeCard) { const isScrollable = activeCard.scrollHeight > activeCard.clientHeight; const isAtTop = activeCard.scrollTop === 0; const isAtBottom = activeCard.scrollTop + activeCard.clientHeight >= activeCard.scrollHeight - 1; if (isScrollable && ((e.deltaY > 0 && !isAtBottom) || (e.deltaY < 0 && !isAtTop))) { return; } } e.preventDefault(); if (isScrolling.current) return; isScrolling.current = true; let newStep = currentStep; if (e.deltaY > 0) newStep = Math.min(steps.length - 1, currentStep + 1); else if (e.deltaY < 0) newStep = Math.max(0, currentStep - 1); if (newStep !== currentStep) { setCurrentStep(newStep); scrollToStep(newStep); } setTimeout(() => { isScrolling.current = false; }, 800); };
  useEffect(() => { const container = appContainerRef.current; if (container && !isMobile) { container.addEventListener('wheel', handleWheel, { passive: false }); return () => container.removeEventListener('wheel', handleWheel); } }, [currentStep, steps.length, selectedBranch, firstBranchStepIndex, isMobile]);
  useEffect(() => { if (!isMobile || steps.length === 0) return; const observer = new IntersectionObserver( (entries) => { entries.forEach((entry) => { if (entry.isIntersecting && entry.intersectionRatio >= 0.7) { const index = stepRefs.current.findIndex(ref => ref.current === entry.target); if (index !== -1) { setCurrentStep(index); } } }); }, { root: appContainerRef.current, threshold: 0.7, } ); stepRefs.current.forEach(ref => { if (ref.current) observer.observe(ref.current); }); return () => observer.disconnect(); }, [isMobile, steps.length]);

  if (error) {
    return <div style={{ minHeight: '50vh', padding: '40px', textAlign: 'center', fontSize: '1.2rem', color: 'red' }}><strong>Error:</strong> {error}</div>;
  }
  if (steps.length === 0) {
    return <div style={{ minHeight: '50vh', padding: '40px', textAlign: 'center' }}>Loading tutorial...</div>;
  }

  return (
    <>
      <GlobalStyle />
      <BackgroundAnimation />
      {selectedBranch && <ChangeBranchButton onClick={handleChangeBranch}>Change Branch</ChangeBranchButton>}
      <AppContainer ref={appContainerRef}>
        <TutorialContainer>
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const showBranchSelector = isActive && index === firstBranchStepIndex && !selectedBranch;
            const branchOptions = showBranchSelector ? getStepContentKeys(step) : [];
            const filteredBranchOptions = showBranchSelector
              ? (branchSearch
                  ? branchOptions.filter(branch => branch.toLowerCase().includes(branchSearch.toLowerCase()))
                  : branchOptions)
              : [];

            return (
              <StepWrapper key={index} ref={stepRefs.current[index]}>
                <LeftPane isActive={isActive}>
                  <TimelineColumn><StepNumber>{index + 1}</StepNumber></TimelineColumn>
                  <TitleContainer>
                    <StepTitle>{step.title}</StepTitle>
                  </TitleContainer>
                </LeftPane>
                <ContentColumn isActive={isActive}>
                  {showBranchSelector ? (
                    <StepCard>
                      <BranchSelectorContainer>
                        <BranchSelectorTitle>Customize Your Tutorial</BranchSelectorTitle>
                        <BranchSelectorSubtitle>Select a path to tailor the content to your needs. You can change this later.</BranchSelectorSubtitle>
                          <SearchBox
                            type="text"
                            placeholder="Search branches..."
                            value={branchSearch}
                            onChange={e => setBranchSearch(e.target.value)}
                            aria-label="Search branches"
                          />
                        <OptionsListContainer>
                          {filteredBranchOptions.length === 0 ? (
                            <div style={{ color: '#86868b', fontSize: '1rem', marginTop: '12px' }}>No branches found.</div>
                          ) : (
                            filteredBranchOptions.map(branch => (
                                <OptionCard key={branch} onClick={() => handleSelectBranch(branch)}>
                                  <OptionTitle>{branch}</OptionTitle>
                                </OptionCard>
                            ))
                          )}
                        </OptionsListContainer>
                      </BranchSelectorContainer>
                    </StepCard>
                  ) : (
                    <StepCard ref={el => cardRefs.current[index] = el}>
                      <CardContent>
                        <MarkdownContainer>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {getStepContent(step, selectedBranch)}
                          </ReactMarkdown>
                        </MarkdownContainer>
                      </CardContent>
                    </StepCard>
                  )}
                </ContentColumn>
              </StepWrapper>
            );
          })}
        </TutorialContainer>
      </AppContainer>

      <MobileNavContainer>
        <NavButton onClick={handleGoToPrev} disabled={currentStep === 0}>
            <ArrowLeftIcon />
        </NavButton>
        {steps.length > 0 && (
            <StepIndicator>{currentStep + 1} / {steps.length}</StepIndicator>
        )}
        <NavButton onClick={handleGoToNext} disabled={currentStep === steps.length - 1}>
            <ArrowRightIcon />
        </NavButton>
      </MobileNavContainer>
    </>
  );
}

// Export only the reusable component
export default TutorialComponent;
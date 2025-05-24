import React, { useState, useEffect, useRef } from 'react';
import BoardDetailPopup from './BoardDetailPopup';

// SVG Icons
const IconChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const IconChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

// Dynamically import all board files
const importAllBoards = () => {
  try {
    // Using webpack require.context to load all JS files from the boards directory
    const boardsContext = require.context('./boards', false, /\.js$/);
    return boardsContext.keys().map(key => {
      const boardModule = boardsContext(key);
      // Handle both default exports and named exports
      return boardModule.default || boardModule;
    });
  } catch (error) {
    console.error("Error importing board files:", error);
    return []; // Return empty array in case of error
  }
};

const BoardSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showBoardDetails, setShowBoardDetails] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [boards, setBoards] = useState([]);
  const [filteredBoards, setFilteredBoards] = useState([]);
  
  // Active sections
  const [boardTypeOpen, setBoardTypeOpen] = useState(false);
  const [cpuFreqOpen, setCpuFreqOpen] = useState(false);
  const [ramSizeOpen, setRamSizeOpen] = useState(true); // RAM section initially open
  const [featuresOpen, setFeaturesOpen] = useState(false);
  
  // Filter criteria
  const [minCpuFreq, setMinCpuFreq] = useState(0.8); // 800MHz default
  const [minRam, setMinRam] = useState(256); // 256MB default
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  
  // Position the popup
  const selectorRef = useRef(null);
  const popupRef = useRef(null);
  const [popupStyle, setPopupStyle] = useState({});
  
  // Load boards on component mount
  useEffect(() => {
    const loadedBoards = importAllBoards();
    setBoards(loadedBoards);
    setFilteredBoards(loadedBoards);
  }, []);
  
  // Update popup position based on the selector button
  useEffect(() => {
    if (isOpen && selectorRef.current && popupRef.current) {
      const rect = selectorRef.current.getBoundingClientRect();
      
      setPopupStyle({
        position: 'absolute',
        top: `${rect.bottom + window.scrollY}px`,
        left: `${rect.left + window.scrollX}px`,
        width: `${rect.width}px`,
        zIndex: 50,
      });
    }
  }, [isOpen]);
  
  // Extract all unique features from boards
  const allFeatures = [...new Set(boards.flatMap(board => 
    board.Supporting_features || []
  ))];
  
  // Filter boards based on criteria
  useEffect(() => {
    const filtered = boards.filter(board => 
      board.Highest_CPU_freq >= minCpuFreq && 
      board.Memory >= minRam &&
      (selectedFeatures.length === 0 || 
        selectedFeatures.every(feature => 
          board.Supporting_features?.some(boardFeature => 
            boardFeature.toLowerCase().includes(feature.toLowerCase())
          )
        ))
    );
    
    setFilteredBoards(filtered);
  }, [boards, minCpuFreq, minRam, selectedFeatures]);
  
  const handleOpenSelector = () => {
    setIsOpen(!isOpen);
  };
  
  const handleCloseSelector = () => {
    setIsOpen(false);
  };
  
  const handleFeatureToggle = (feature) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };
  
  const handleBoardClick = (board) => {
    setSelectedBoard(board);
    setShowBoardDetails(true);
    // Lock body scroll when showing board details
    document.body.style.overflow = 'hidden';
  };
  
  const handleRamChange = (e) => {
    setMinRam(parseInt(e.target.value));
  };
  
  // Close board details and restore scroll
  const handleCloseBoardDetails = () => {
    setShowBoardDetails(false);
    document.body.style.overflow = '';
  };
  
  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen && 
        popupRef.current && 
        !popupRef.current.contains(event.target) &&
        selectorRef.current && 
        !selectorRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle ESC key to close both selector and board details
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        if (showBoardDetails) {
          handleCloseBoardDetails();
        } else if (isOpen) {
          setIsOpen(false);
        }
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, showBoardDetails]);

  return (
    <div className="relative font-sans max-w-3xl mx-auto" style={{ fontFamily: '-apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      {/* Selector button with enhanced styling */}
      <button 
        ref={selectorRef}
        onClick={handleOpenSelector}
        className="w-full p-3 border border-gray-300 rounded-lg flex justify-between items-center shadow-sm hover:shadow-md transition-shadow duration-300"
        style={{ 
          borderRadius: '12px',
          background: 'white',
          backdropFilter: 'blur(8px)'
        }}
      >
        <span className="text-gray-500 font-medium">搜索开发板...</span>
        <div className="bg-blue-50 p-1.5 rounded-full">
          <IconChevronRight className="text-blue-600" />
        </div>
      </button>
      
      {/* Popup container with animation */}
      {isOpen && (
        <div 
          ref={popupRef}
          className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
          style={{
            position: 'absolute',
            top: '100%', 
            left: 0, 
            width: '100%',
            zIndex: 50,
            marginTop: '8px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            borderRadius: '16px',
            maxHeight: '80vh',
            overflowY: 'auto',
            animation: 'fadeIn 0.3s ease-out forwards'
          }}
        >
          {/* Board Type Section */}
          <div className="border-b border-gray-100">
            <button 
              onClick={() => setBoardTypeOpen(!boardTypeOpen)}
              className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50"
            >
              <span className="font-medium text-gray-800">选型开发板</span>
              <div className={`p-1.5 rounded-full transition-transform duration-300 ${boardTypeOpen ? 'rotate-180 bg-blue-50' : 'bg-gray-50'}`}>
                <IconChevronDown className={boardTypeOpen ? 'text-blue-600' : 'text-gray-400'} />
              </div>
            </button>
            
            {boardTypeOpen && (
              <div className="p-4 bg-gray-50">
                <div className="flex flex-wrap gap-2">
                  {boards.map((board, index) => (
                    <button 
                      key={index}
                      onClick={() => handleBoardClick(board)}
                      className="p-2.5 border border-gray-200 rounded-xl bg-white hover:bg-blue-50 hover:border-blue-200 transition-colors"
                    >
                      {board.board_name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* CPU Frequency Section */}
          <div className="border-b border-gray-100">
            <button 
              onClick={() => setCpuFreqOpen(!cpuFreqOpen)}
              className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50"
            >
              <span className="font-medium text-gray-800">CPU主频</span>
              <div className="flex items-center">
                <span className="mr-2 text-gray-500">&gt;{minCpuFreq * 1000}MHz</span>
                <div className={`p-1.5 rounded-full transition-transform duration-300 ${cpuFreqOpen ? 'rotate-180 bg-blue-50' : 'bg-gray-50'}`}>
                  <IconChevronDown className={cpuFreqOpen ? 'text-blue-600' : 'text-gray-400'} />
                </div>
              </div>
            </button>
            
            {cpuFreqOpen && (
              <div className="p-4 bg-gray-50">
                <div className="flex flex-col space-y-3">
                  <div className="flex justify-between gap-2">
                    <button 
                      className={`p-2.5 border flex-1 ${minCpuFreq === 0.1 ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-700'} rounded-xl transition-colors`}
                      onClick={() => setMinCpuFreq(0.1)}
                    >
                      &gt;100MHz
                    </button>
                    <button 
                      className={`p-2.5 border flex-1 ${minCpuFreq === 0.4 ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-700'} rounded-xl transition-colors`}
                      onClick={() => setMinCpuFreq(0.4)}
                    >
                      &gt;400MHz
                    </button>
                  </div>
                  <div className="flex justify-between gap-2">
                    <button 
                      className={`p-2.5 border flex-1 ${minCpuFreq === 0.8 ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-700'} rounded-xl transition-colors`}
                      onClick={() => setMinCpuFreq(0.8)}
                    >
                      &gt;800MHz
                    </button>
                    <button 
                      className={`p-2.5 border flex-1 ${minCpuFreq === 1.2 ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-700'} rounded-xl transition-colors`}
                      onClick={() => setMinCpuFreq(1.2)}
                    >
                      &gt;1.2GHz
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* RAM Size Section */}
          <div className="border-b border-gray-100">
            <button 
              onClick={() => setRamSizeOpen(!ramSizeOpen)}
              className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50"
            >
              <span className="font-medium text-gray-800">RAM大小</span>
              <div className={`p-1.5 rounded-full transition-transform duration-300 ${ramSizeOpen ? 'rotate-180 bg-blue-50' : 'bg-gray-50'}`}>
                <IconChevronDown className={ramSizeOpen ? 'text-blue-600' : 'text-gray-400'} />
              </div>
            </button>
            
            {ramSizeOpen && (
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex items-center">
                    <div className="w-full">
                      <div className="relative mb-3">
                        <div 
                          className="absolute inset-0 bg-blue-500 rounded-full" 
                          style={{ 
                            width: `${(minRam / 1024) * 100}%`,
                            maxWidth: '100%'
                          }}
                        ></div>
                        <div className="h-2.5 bg-gray-100 rounded-full"></div>
                      </div>
                      <input
                        type="range"
                        min="64"
                        max="1024"
                        step="64"
                        value={minRam}
                        onChange={handleRamChange}
                        className="absolute w-full h-2.5 opacity-0 cursor-pointer"
                        style={{ top: '1rem', left: 0 }}
                      />
                    </div>
                    <span className="ml-4 font-medium text-blue-600">{minRam}M+</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Features Section */}
          <div>
            <button 
              onClick={() => setFeaturesOpen(!featuresOpen)}
              className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50"
            >
              <span className="font-medium text-gray-800">支持功能</span>
              <div className={`p-1.5 rounded-full transition-transform duration-300 ${featuresOpen ? 'rotate-180 bg-blue-50' : 'bg-gray-50'}`}>
                <IconChevronDown className={featuresOpen ? 'text-blue-600' : 'text-gray-400'} />
              </div>
            </button>
            
            {featuresOpen && (
              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-2 gap-2">
                  {allFeatures.map((feature, index) => (
                    <button 
                      key={index}
                      onClick={() => handleFeatureToggle(feature)}
                      className={`p-2.5 border ${selectedFeatures.includes(feature) ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-700'} rounded-xl transition-colors text-sm`}
                    >
                      {feature}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Results section */}
          {filteredBoards.length > 0 && (
            <div className="p-4 border-t border-gray-100 bg-white">
              <h3 className="text-sm font-medium mb-3 text-gray-600">符合条件的开发板: {filteredBoards.length}</h3>
              <div className="space-y-2">
                {filteredBoards.slice(0, 3).map((board, index) => (
                  <div 
                    key={index}
                    onClick={() => handleBoardClick(board)}
                    className="p-3 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{board.board_name}</span>
                      <span className="text-gray-500">{board.Memory}MB, {board.Highest_CPU_freq}GHz</span>
                    </div>
                  </div>
                ))}
                {filteredBoards.length > 3 && (
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm w-full text-center py-2 hover:bg-blue-50 rounded-xl transition-colors">
                    显示更多结果 ({filteredBoards.length - 3})
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Enhanced Board Details Popup - similar to SlideNews expanded card */}
      {showBoardDetails && selectedBoard && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleCloseBoardDetails}
          style={{ 
            animation: 'fadeIn 0.3s ease-out forwards'
          }}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ 
              margin: '32px',
              animation: 'scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              transformOrigin: 'center'
            }}
          >
            <BoardDetailPopup 
              board={selectedBoard} 
              onClose={handleCloseBoardDetails}
            />
          </div>
        </div>
      )}
      
      {/* Styles for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleUp {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default BoardSelector;
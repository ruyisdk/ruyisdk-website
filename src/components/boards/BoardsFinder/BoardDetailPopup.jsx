import React from 'react';

// Custom SVG Icons with Apple-style
const IconX = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const IconInfo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const BoardDetailPopup = ({ board, onClose }) => {
  // Safely access board properties with optional chaining
  const hasSupportingFeatures = board?.Supporting_features?.length > 0;
  const hasSupportedIO = board?.Supported_IO?.length > 0;
  const hasNotes = board?.Notes?.length > 0;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-30 popup-backdrop"
      onClick={onClose}
      style={{ 
        transitionProperty: 'opacity',
        transitionDuration: '400ms',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{ 
          margin: '32px',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
          transform: 'scale(1)',
          animation: 'appleScaleUp 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 
              style={{ 
                fontSize: '24px', 
                fontWeight: 500, 
                letterSpacing: '-0.02em',
                color: '#1d1d1f',
                margin: 0,
              }}
            >{board?.board_name || "开发板详情"}</h2>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
            >
              <IconX />
            </button>
          </div>
          
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h3 
                  style={{ 
                    fontSize: '18px',
                    fontWeight: 500,
                    letterSpacing: '-0.01em',
                    color: '#1d1d1f',
                    marginBottom: '4px',
                  }}
                >规格概览</h3>
                <p 
                  className="text-sm text-gray-500"
                  style={{ fontSize: '14px' }}
                >技术参数与功能</p>
              </div>
              {board?.price && (
                <span 
                  style={{ 
                    fontSize: '24px',
                    fontWeight: 500,
                    color: '#1d1d1f',
                  }}
                >¥{board.price}</span>
              )}
            </div>
            
            <div 
              className="bg-gray-50 p-6 rounded-xl space-y-4"
              style={{ 
                borderRadius: '14px',
                backgroundColor: '#f5f5f7',
              }}
            >
              <div className="flex justify-between items-center">
                <span 
                  className="text-gray-600"
                  style={{ fontSize: '15px' }}
                >处理器</span>
                <span 
                  className="font-medium text-gray-900"
                  style={{ 
                    fontSize: '15px',
                    fontWeight: 500,
                  }}
                >{board?.CPU_cores || 0}核 {board?.Highest_CPU_freq || 0}GHz</span>
              </div>
              <div className="flex justify-between items-center">
                <span 
                  className="text-gray-600"
                  style={{ fontSize: '15px' }}
                >内存</span>
                <span 
                  className="font-medium text-gray-900"
                  style={{ 
                    fontSize: '15px',
                    fontWeight: 500,
                  }}
                >{board?.Memory || 0}MB</span>
              </div>
              {board?.AI_processing_power && board.AI_processing_power !== "NA" && (
                <div className="flex justify-between items-center">
                  <span 
                    className="text-gray-600"
                    style={{ fontSize: '15px' }}
                  >AI处理能力</span>
                  <span 
                    className="font-medium text-gray-900"
                    style={{ 
                      fontSize: '15px',
                      fontWeight: 500,
                    }}
                  >{board.AI_processing_power}TOPS</span>
                </div>
              )}
            </div>
            
            {/* Ruyi信息 section - Apple-styled */}
            {board?.RuyiInfo && (
              <div 
                className="bg-green-50 p-6 rounded-xl"
                style={{ 
                  borderRadius: '14px',
                  backgroundColor: 'rgba(52, 199, 89, 0.1)',
                }}
              >
                <div className="flex items-center mb-3">
                  <IconInfo 
                    className="text-green-700 mr-2" 
                    style={{ color: 'rgb(36, 138, 61)' }}
                  />
                  <h3 
                    style={{ 
                      fontSize: '16px',
                      fontWeight: 500,
                      color: 'rgb(36, 138, 61)',
                    }}
                  >Ruyi信息</h3>
                </div>
                <p 
                  className="text-green-800 text-sm"
                  style={{ 
                    fontSize: '14px',
                    color: 'rgb(36, 138, 61)',
                    lineHeight: '1.4',
                  }}
                >{board.RuyiInfo}</p>
              </div>
            )}
            
            {/* Features section - Apple-styled */}
            {hasSupportingFeatures && (
              <div>
                <h3 
                  style={{ 
                    fontSize: '18px',
                    fontWeight: 500,
                    letterSpacing: '-0.01em',
                    color: '#1d1d1f',
                    marginBottom: '16px',
                  }}
                >支持功能</h3>
                <div className="flex flex-wrap gap-2">
                  {board.Supporting_features.map((feature, index) => (
                    <span 
                      key={index} 
                      className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1.5 rounded-lg"
                      style={{ 
                        fontSize: '13px',
                        backgroundColor: 'rgba(0, 122, 255, 0.1)',
                        color: 'rgb(0, 102, 204)',
                        borderRadius: '8px',
                        fontWeight: 500,
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* IO section - Apple-styled */}
            {hasSupportedIO && (
              <div>
                <h3 
                  style={{ 
                    fontSize: '18px',
                    fontWeight: 500,
                    letterSpacing: '-0.01em',
                    color: '#1d1d1f',
                    marginBottom: '16px',
                  }}
                >支持的接口</h3>
                <div className="flex flex-wrap gap-2">
                  {board.Supported_IO.map((io, index) => (
                    <span 
                      key={index} 
                      className="bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1.5 rounded-lg"
                      style={{ 
                        fontSize: '13px',
                        backgroundColor: '#f5f5f7',
                        color: '#1d1d1f',
                        borderRadius: '8px',
                        fontWeight: 500,
                      }}
                    >
                      {io}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Notes section - Apple-styled */}
            {hasNotes && (
              <div>
                <h3 
                  style={{ 
                    fontSize: '18px',
                    fontWeight: 500,
                    letterSpacing: '-0.01em',
                    color: '#1d1d1f',
                    marginBottom: '16px',
                  }}
                >备注</h3>
                <ul 
                  className="list-disc pl-5 space-y-2 text-gray-700"
                  style={{ 
                    fontSize: '14px',
                    color: '#424245',
                    lineHeight: '1.5',
                  }}
                >
                  {board.Notes.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="mt-10 flex space-x-4">
            <button 
              className="flex-1 py-3.5 bg-gray-100 text-gray-800 font-medium rounded-xl hover:bg-gray-200 transition-colors"
              style={{ 
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 500,
                backgroundColor: '#f5f5f7',
              }}
            >
              添加到对比
            </button>
            <button 
              className="flex-1 py-3.5 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors"
              style={{ 
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 500,
                backgroundColor: '#0066cc',
              }}
            >
              查看详情
            </button>
          </div>
        </div>
      </div>
      
      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes appleScaleUp {
          0% { transform: scale(0.96); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        /* Apple-styled scrollbar */
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

export default BoardDetailPopup;
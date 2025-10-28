import React, { useState, useEffect } from 'react';

export type QualityLevel = 'low' | 'medium' | 'high' | 'auto';

interface QualitySettingsProps {
  onChange: (quality: QualityLevel) => void;
  currentFPS?: number;
}

const QualitySettings: React.FC<QualitySettingsProps> = ({ onChange, currentFPS }) => {
  const [quality, setQuality] = useState<QualityLevel>(() => {
    const saved = localStorage.getItem('graphics-quality');
    return (saved as QualityLevel) || 'auto';
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Auto-adjust quality based on FPS
  useEffect(() => {
    if (quality === 'auto' && currentFPS !== undefined) {
      let recommendedQuality: QualityLevel = 'high';
      
      if (currentFPS < 30) {
        recommendedQuality = 'low';
      } else if (currentFPS < 50) {
        recommendedQuality = 'medium';
      }
      
      onChange(recommendedQuality);
    }
  }, [quality, currentFPS, onChange]);

  const handleQualityChange = (newQuality: QualityLevel) => {
    setQuality(newQuality);
    localStorage.setItem('graphics-quality', newQuality);
    onChange(newQuality);
    setIsOpen(false);
  };

  const getQualityDescription = (level: QualityLevel): string => {
    switch (level) {
      case 'low':
        return 'Low - Better performance';
      case 'medium':
        return 'Medium - Balanced';
      case 'high':
        return 'High - Best visuals';
      case 'auto':
        return 'Auto - Adaptive (Recommended)';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9998,
    }}>
      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '50px',
          right: '0',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          border: '1px solid #555',
          borderRadius: '8px',
          padding: '12px',
          minWidth: '200px',
        }}>
          <div style={{
            color: '#fff',
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '8px',
            borderBottom: '1px solid #555',
            paddingBottom: '8px',
          }}>
            Graphics Quality
          </div>
          {(['auto', 'high', 'medium', 'low'] as QualityLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => handleQualityChange(level)}
              style={{
                display: 'block',
                width: '100%',
                padding: '8px 12px',
                margin: '4px 0',
                backgroundColor: quality === level ? '#750691' : 'transparent',
                color: '#fff',
                border: quality === level ? '1px solid #fff' : '1px solid #555',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (quality !== level) {
                  e.currentTarget.style.backgroundColor = 'rgba(117, 6, 145, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (quality !== level) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {getQualityDescription(level)}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: '#fff',
          border: '1px solid #555',
          borderRadius: '50%',
          width: '44px',
          height: '44px',
          cursor: 'pointer',
          fontSize: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
        title="Graphics Settings"
      >
        ⚙️
      </button>
    </div>
  );
};

export default QualitySettings;

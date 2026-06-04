import React, { useMemo } from 'react';
import './dna.css';
import { getGeneColor, getGeneColorHex } from '../../../utils/dnaDataGenerator';

const generateHelixPoints = (chapters) => {
  return chapters.map((chapter, index) => {
    // Math.PI * 4 means 2 full twists
    const angle = (index / chapters.length) * Math.PI * 6; 
    const y = index * 30; // vertical spacing
    const radius = 60;
    
    // Strand 1
    const x1 = Math.cos(angle) * radius;
    const z1 = Math.sin(angle) * radius;
    
    // Strand 2 (opposite side)
    const x2 = Math.cos(angle + Math.PI) * radius;
    const z2 = Math.sin(angle + Math.PI) * radius;
    
    return { chapter, x1, y, z1, x2, z2, angle };
  });
};

const getShapeClass = (color) => {
  // Colorblind-friendly shape additions
  if (color === 'red') return 'rounded-sm'; // Square for weak
  if (color === 'yellow') return 'rounded-lg'; // slightly rounded
  return 'rounded-full'; // circle for strong/blue
};

const DNAHelix = ({ data, onGeneClick, isPaused }) => {
  const helixPoints = useMemo(() => generateHelixPoints(data), [data]);
  const totalHeight = helixPoints.length * 30 + 50;

  return (
    <div className="dna-wrapper">
      <div 
        className={`dna-container ${isPaused ? 'dna-paused' : ''}`}
        style={{ height: `${totalHeight}px` }}
      >
        {helixPoints.map((point, idx) => {
          const colorName = getGeneColor(point.chapter.score_percentage, point.chapter.attempts);
          const colorHex = getGeneColorHex(colorName);
          const shapeClass = getShapeClass(colorName);
          
          return (
            <React.Fragment key={`gene-pair-${idx}`}>
              {/* Strand Connection Line */}
              <div 
                className="strand-connection"
                style={{
                  top: `${point.y + 8}px`, // +8 to center with 16px node
                  left: '100px', // center of container (200px width)
                  width: '120px', // 2 * radius
                  transform: `translateX(-50%) rotateY(${-point.angle}rad)`,
                  opacity: 0.6
                }}
              />

              {/* Node 1 (Actual Chapter Data) */}
              <div 
                className="gene-node hover:scale-150 z-10"
                style={{
                  top: `${point.y}px`,
                  left: '100px',
                  transform: `translate3d(${point.x1}px, 0, ${point.z1}px) translateX(-50%)`,
                }}
                onClick={() => onGeneClick(point.chapter)}
              >
                <div 
                  className={`gene-inner ${shapeClass}`}
                  style={{
                    backgroundColor: colorHex,
                    boxShadow: `0 0 15px ${colorHex}`,
                    border: '2px solid rgba(255,255,255,0.8)'
                  }}
                />
              </div>

              {/* Node 2 (Decorative opposite strand to complete helix) */}
              <div 
                className="gene-node opacity-40 pointer-events-none"
                style={{
                  top: `${point.y}px`,
                  left: '100px',
                  transform: `translate3d(${point.x2}px, 0, ${point.z2}px) translateX(-50%)`,
                }}
              >
                <div 
                  className="gene-inner rounded-full"
                  style={{ backgroundColor: '#4B5563' }}
                />
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default DNAHelix;

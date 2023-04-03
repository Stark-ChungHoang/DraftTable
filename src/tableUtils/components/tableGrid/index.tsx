import React, { useState } from 'react';

const rows = Array(8).fill(1);
const grid = Array(8).fill([...rows]);

const TableGrid = ({handleSubmit}:any) => {
  const [size, setSize] = useState({ cols: 0, rows: 0 });

  const handleHover = (i:number, j:number) => {
    setSize({ cols: j + 1, rows: i + 1 });
  };

  const handleSelect = () => {
    console.log("soize",size);
    handleSubmit(size);

  };

  return (
    <div>
      <div>
        {grid.map((row, i) => (
          <div
            key={i}
            style={{ display: 'flex', width: 136, justifyContent: 'space-between', padding: 1, cursor: 'pointer' }}
          >
            {row.map((cell:any, j:number) => {
              const isSelected = i <= size.rows - 1 && j <= size.cols - 1;
              return (
                <div
                style={{ flex: '0 0 15px', height: 15,
                border:isSelected ? '1px solid rgba(0, 125, 250, 0.8)' : '1px solid rgba(150, 150, 150, 1)',
                background: isSelected ? 'rgba(0, 125, 250, 0.4)' : 'rgba(200, 200, 200, 0.4)' 
              }}
                  key={`${i}-${j}`}
                  onMouseEnter={() => handleHover(i, j)}
                  onClick={handleSelect}
                ></div>
              );
            })}
          </div>
        ))}
      </div>
      <div>
        Insert table size: {size.cols} x {size.rows}
      </div>
    </div>
  );
};

export default TableGrid;

import React from 'react'
import ".././style.css"
import Row from './Row';
import Th from './Th';

function TableTest(props:any) {
    const {
        blockProps: { columns, rows,setReadOnly }
      } = props;
    
      const onChange = (column:any) => (value:any) => {
        const {
          blockProps: { columns, editColumn, getEditorState, setEditorState },
          block,
        } = props;
        setEditorState(
          editColumn({
            editorState: getEditorState(),
            columns,
            column: { ...column, value },
            block,
          })
        );
      };
    
    const  addColumn = ({ index }:any) => () => {
        const {
          blockProps: { addColumn, columns, rows, getEditorState, setEditorState },
        } = props;
        setEditorState(
          addColumn({
            columns,
            rows,
            index,
            editorState: getEditorState(),
            block: props.block,
          })
        );
      };

     const onRemoveColumn = ({ index }:any) => () => {
        const {
          blockProps: {
            removeColumn,
            columns,
            rows,
            getEditorState,
            setEditorState,
          },
        } = props;
        setEditorState(
          removeColumn({
            columns,
            rows,
            index,
            editorState: getEditorState(),
            block: props.block,
          })
        );
      };

  return (
    <table  className='table'>
    <thead className='thead'>
      <tr className='tr'>
        {columns.map((col:any, i:any) => (
          <Th
            key={col.key}
            value={col.value}
            setReadOnly={setReadOnly}
            onAddColumnLeft={addColumn({
              index: i,
            })}
            onAddColumnRight={addColumn({ index: i + 1 })}
            onRemoveColumn={
              columns.length > 1 ? onRemoveColumn({ index: i }) : null
            }
            onChange={onChange(col)}
          />
        ))}
      </tr>
    </thead>
    <tbody className='tbody'>
      {rows.map((row:any, rowIndex:any) => (
        <Row
          key={row.key}
          row={row}
          setReadOnly={setReadOnly}
          isOnlyRow={rows.length === 1}
          block={props.block}
          blockProps={props.blockProps}
          rowIndex={rowIndex}
          columns={columns}
        />
      ))}
    </tbody>
  </table>
  )
}

export default TableTest
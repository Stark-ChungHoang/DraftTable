import React from 'react'
import "../style.css"
import RowCell from './RowCell';
function Row(props:any) {

   const onChangeCell = ({ row, cell }:any) => (value:any) => {
        const {
          blockProps: { editCell, getEditorState, setEditorState },
        } = props;
        setEditorState(
          editCell({
            row,
            cell: { ...cell, value },
            editorState: getEditorState(),
            block: props.block,
          })
        );
      };

    const  removeRow = ({ index }:any) => () => {
        const {
          blockProps: { removeRow, rows, columns, getEditorState, setEditorState },
        } = props;
        setEditorState(
          removeRow({
            index,
            rows,
            columns,
            editorState: getEditorState(),
            block: props.block,
          })
        );
      };
     const addRow = ({ index }:any) => () => {
        const {
          blockProps: { addRow, rows, columns, getEditorState, setEditorState },
        } = props;
        setEditorState(
          addRow({
            index,
            rows,
            columns,
            editorState: getEditorState(),
            block: props.block,
          })
        );
      };

  return (
    <tr className='tr'>
    {props.row.value.map((cell:any, i:any) => (
      <RowCell
        key={cell.key}
        hasEditOptions={i === 0}
        value={cell.value}
        label={props.columns[i].value}
        className='td'
        setReadOnly={props.setReadOnly}
        onChange={onChangeCell({ row: props.row, cell })}
        onRowAddBefore={addRow({ index: props.rowIndex })}
        onRowDelete={
          props.isOnlyRow
            ? null
            : removeRow({ index: props.rowIndex })
        }
        onRowAddAfter={addRow({ index: props.rowIndex + 1 })}
      />
    ))}
  </tr>
  )
}

export default Row
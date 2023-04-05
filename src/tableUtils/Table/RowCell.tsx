import React from 'react'
import "../style.css"
import InputCell from './InputCell';
import EditButton from './EditButton';
function RowCell(props:any) {
    
    const { value, label, onChange ,setReadOnly} = props;
  return (
    <td
    data-value={value.trim()}
    data-label={label.trim()} // .trim() for white space on mobile
    className='td'
  >
    <InputCell
      onChange={onChange}
      value={value}
      setReadOnly={setReadOnly}
      textAreaStyle='rowTextArea'
      render={({ showEditOptions }:any) => {
        return (
          props.hasEditOptions &&
          showEditOptions && (
            <EditButton
              className='rowButtons'
              onAddBefore={props.onRowAddBefore}
              onDelete={props.onRowDelete}
              onAddAfter={props.onRowAddAfter}
            />
          )
        )
      }
       
      }
    />
  </td>
  )
}

export default RowCell
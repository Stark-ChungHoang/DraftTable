import React from 'react'
import InputCell from './InputCell'
import EditButton from './EditButton';
import "../style.css"
function Th(props:any) {
    const {
        value,
        onChange,
        onAddColumnLeft,
        onAddColumnRight,
        onRemoveColumn,
        setReadOnly
      } = props;
   
      
  return (
    <th className='th'>
        <InputCell
          onChange={onChange}
          value={value}
          setReadOnly={setReadOnly}
          textAreaStyle={'columnTextArea'}
          render={({ showEditOptions }:any) =>
            showEditOptions && (
              <EditButton
                className={'columnButtons'}
                onAddBefore={onAddColumnLeft}
                onDelete={onRemoveColumn}
                onAddAfter={onAddColumnRight}
              />
            )
          }
        />
      </th>
  )
}

export default Th
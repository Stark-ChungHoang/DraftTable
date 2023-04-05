import React, { useState } from 'react'
import TextareaAutosize from './TextArea';
import "../style.css"
function InputCell(props:any) {
    const [showEditOptions,setShowEditOptions] = useState(false)
    const [value,setValue] = useState(props.value)

    
   const onChange = (e:any) => {
    setValue(e.target.value)
      };

     const onFocus = () => {

        // props.onShowEditOptions(true);
        props.setReadOnly(true)
        setShowEditOptions(true)
      };

    const onBlur = () => {
      props.setReadOnly(false)
    //    props.onShowEditOptions(false);
       setShowEditOptions(false)
       props.onChange(value);
      };

  return (
    <span className='cellWrapper'>
        <TextareaAutosize
          useCacheForDOMMeasurements
           //@ts-ignore
          className='rowTextArea'
          style={{ resize: 'none', width: '100%' }}
          type="text"
          onFocus={onFocus}
          onBlur={onBlur}
          value={value}
          onChange={onChange}
        />
        {props.render({value,showEditOptions})}
      </span>
  )
}

export default InputCell
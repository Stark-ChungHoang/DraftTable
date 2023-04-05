import React from 'react'
import AddIcon from './AddIcon'
import MinusIcon from './MinusIcon'
import "../style.css"
function EditButton({
    className,
    direction,
    onDelete,
    onAddAfter,
    onAddBefore,
  }:any) {
  return (
    <span className={className}>
    <AddIcon onClick={onAddBefore} />
    {onDelete && <MinusIcon onClick={onDelete} />}
    <AddIcon onClick={onAddAfter} />
  </span>
  )
}

export default EditButton
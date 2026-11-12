
import {useState} from 'react';
import {X} from 'lucide-react';

export default function LabelModal({onClose,onCreate}){
  const [name,setName]=useState('');

  return <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&onClose()}>
    <div className="label-modal">

      <div className="modal-head">
        <h2>Create new label</h2>
        <button className="icon-button" onClick={onClose}>
          <X/>
        </button>
      </div>

      <input
        autoFocus
        value={name}
        onChange={e=>setName(e.target.value)}
        placeholder="Enter label name"
        onKeyDown={e=>e.key==='Enter'&&onCreate(name)}
      />

      <div className="modal-actions">
        <button className="text-button" onClick={onClose}>
          Cancel
        </button>

        <button className="primary-button" onClick={()=>onCreate(name)}>
          Create
        </button>
      </div>

    </div>
  </div>
}

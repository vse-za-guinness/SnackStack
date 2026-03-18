import React from 'react'

interface PantryItem {
  id: number
  name: string
  qty: number
}

interface Props {
  pantry: PantryItem[]
  pantryInput: string
  activeCtx: string | null
  setPantryInput: (val: string) => void
  addPantry: () => void
  chgPantry: (i: number, delta: number) => void
  removePantry: (i: number) => void
  movePantryToShop: (i: number) => void
  addShopCopy: (i: number) => void
  toggleCtx: (id: string, e: React.MouseEvent) => void
}

export default function PantryPanel({
  pantry, pantryInput, activeCtx,
  setPantryInput, addPantry, chgPantry,
  removePantry, movePantryToShop, addShopCopy, toggleCtx
}: Props): React.ReactElement {
  return (
    <div className="panel">
      <div className="panel-header">
        <span className="dot dot-pantry"></span>
        <h2>Pantry</h2>
        <span className="badge pantry-badge">{pantry.length}</span>
      </div>
      <div className="panel-body">
        <div className="input-row">
          <input
            value={pantryInput}
            onChange={e => setPantryInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addPantry()}
            placeholder="Add item to pantry…"
          />
          <button className="add-btn add-btn-pantry" onClick={addPantry}>Add</button>
        </div>
        {pantry.length === 0 ? (
          <p className="empty">Your pantry is empty</p>
        ) : (
          <div className="list-scroll">
            <ul>
              {pantry.map((item, i) => (
                <li key={item.id} className="item">
                  <span className="item-name">
                    {item.name}
                    {item.qty <= 1 && <span className="low-stock">low</span>}
                  </span>
                  <div className="qty-ctrl">
                    <button className="qty-btn" onClick={() => chgPantry(i, -1)}>−</button>
                    <span className="qty">{item.qty}</span>
                    <button className="qty-btn" onClick={() => chgPantry(i, 1)}>+</button>
                  </div>
                  <div className="ctx-wrap">
                    <button className="icon-btn" onClick={e => toggleCtx(`pc${i}`, e)}>⋯</button>
                    {activeCtx === `pc${i}` && (
                      <div className={`ctx-popup ${i >= pantry.length - 2 ? 'ctx-popup-up' : ''}`}>
                        <button onClick={() => movePantryToShop(i)}>🛒 Move to shopping list</button>
                        <button onClick={() => addShopCopy(i)}>＋ Also add to shopping list</button>
                        <div className="sep" />
                        <button className="danger" onClick={() => removePantry(i)}>✕ Remove from pantry</button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
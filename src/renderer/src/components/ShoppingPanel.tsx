import React from 'react'
import { formatDistanceToNow } from 'date-fns'


interface ShopItem {
  id: number
  name: string
  qty: number
  done: boolean
  addedAt: number
}

interface Props {
  shopping: ShopItem[]
  shopInput: string
  activeCtx: string | null
  setShopInput: (val: string) => void
  addShop: () => void
  chgShop: (i: number, delta: number) => void
  removeShop: (i: number) => void
  toggleShop: (i: number) => void
  addToPantryFromShop: (i: number) => void
  toggleCtx: (id: string, e: React.MouseEvent) => void
}

export default function ShoppingPanel({
  shopping, shopInput, activeCtx,
  setShopInput, addShop, chgShop,
  removeShop, toggleShop, addToPantryFromShop, toggleCtx
}: Props): React.ReactElement {
  return (
    <div className="panel">
      <div className="panel-header">
        <span className="dot dot-shop"></span>
        <h2>Shopping list</h2>
        <span className="badge shop-badge">{shopping.length}</span>
      </div>
      <div className="panel-body">
        <div className="input-row">
          <input
            value={shopInput}
            onChange={e => setShopInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addShop()}
            placeholder="Add item to shopping list…"
            className="shop-input"
          />
          <button className="add-btn add-btn-shop" onClick={addShop}>Add</button>
        </div>
        {shopping.length === 0 ? (
          <p className="empty">Nothing to buy yet</p>
        ) : (
          <div className="list-scroll">
            <ul>
              {shopping.map((item, i) => (
                <li key={item.id} className="item">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={item.done}
                    onChange={() => toggleShop(i)}
                  />
                  <span className={`item-name${item.done ? ' done' : ''}`}>{item.name}</span>
                  <div className="qty-ctrl">
                    <button className="qty-btn" onClick={() => chgShop(i, -1)}>−</button>
                    <span className="qty">{item.qty}</span>
                    <button className="qty-btn" onClick={() => chgShop(i, 1)}>+</button>
                  </div>
                  <div className="ctx-wrap">
                    <button className="icon-btn" onClick={e => toggleCtx(`sc${i}`, e)}>⋯</button>
                    {activeCtx === `sc${i}` && (
                      <div className={`ctx-popup ${i >= shopping.length - 2 ? 'ctx-popup-up' : ''}`}>
                        {item.done && <button onClick={() => addToPantryFromShop(i)}>🥕 Add to pantry</button>}
                        {item.done && <div className="sep" />}
                        <button className="danger" onClick={() => removeShop(i)}>✕ Remove from list</button>
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
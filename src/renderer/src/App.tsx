// src/App.tsx
import React, { useState, useEffect } from 'react'
import './App.css'
import PantryPanel from './components/PantryPanel'
import ShoppingPanel from './components/ShoppingPanel'

interface PantryItem {
  id: number
  name: string
  qty: number
}

interface ShopItem {
  id: number
  name: string
  qty: number
  done: boolean
}


function App(): React.ReactElement {
  const [pantry, setPantry] = useState<PantryItem[]>([])
  const [shopping, setShopping] = useState<ShopItem[]>([])
  const [pantryInput, setPantryInput] = useState('')
  const [shopInput, setShopInput] = useState('')
  const [activeCtx, setActiveCtx] = useState<string | null>(null)

  useEffect(() => {
    const savedPantry = localStorage.getItem('pantry-v2')
    const savedShopping = localStorage.getItem('shopping-v2')
    if (savedPantry) setPantry(JSON.parse(savedPantry))
    if (savedShopping) setShopping(JSON.parse(savedShopping))
  }, [])

  useEffect(() => {
    localStorage.setItem('pantry-v2', JSON.stringify(pantry))
  }, [pantry])

  useEffect(() => {
    localStorage.setItem('shopping-v2', JSON.stringify(shopping))
  }, [shopping])

  useEffect(() => {
    const handler = () => setActiveCtx(null)
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  const toggleCtx = (id: string, e: React.MouseEvent): void => {
    e.stopPropagation()
    setActiveCtx(prev => (prev === id ? null : id))
  }

  const addPantry = (): void => {
    const name = pantryInput.trim()
    if (!name) return
    setPantry(prev => {
      const existing = prev.findIndex(i => i.name.toLowerCase() === name.toLowerCase())
      if (existing >= 0) {
        return prev.map((i, idx) => idx === existing ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { id: Date.now(), name, qty: 1 }]
    })
    setPantryInput('')
  }

  const chgPantry = (index: number, delta: number): void => {
    setPantry(prev => prev.map((i, idx) =>
      idx === index ? { ...i, qty: Math.max(1, i.qty + delta) } : i
    ))
  }

  const removePantry = (index: number): void => {
    setPantry(prev => prev.filter((_, idx) => idx !== index))
    setActiveCtx(null)
  }

  const movePantryToShop = (index: number): void => {
    const item = pantry[index]
    setShopping(prev => {
      const existing = prev.findIndex(i => i.name.toLowerCase() === item.name.toLowerCase())
      if (existing >= 0) {
        return prev.map((i, idx) => idx === existing ? { ...i, qty: i.qty + item.qty } : i)
      }
      return [...prev, { id: Date.now(), name: item.name, qty: item.qty, done: false }]
    })
    setPantry(prev => prev.filter((_, idx) => idx !== index))
    setActiveCtx(null)
  }

  const addShopCopy = (index: number): void => {
    const item = pantry[index]
    setShopping(prev => {
      const existing = prev.findIndex(i => i.name.toLowerCase() === item.name.toLowerCase())
      if (existing >= 0) {
        return prev.map((i, idx) => idx === existing ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { id: Date.now(), name: item.name, qty: 1, done: false }]
    })
    setActiveCtx(null)
  }

  const addShop = (): void => {
    const name = shopInput.trim()
    if (!name) return
    setShopping(prev => {
      const existing = prev.findIndex(i => i.name.toLowerCase() === name.toLowerCase())
      if (existing >= 0) {
        return prev.map((i, idx) => idx === existing ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { id: Date.now(), name, qty: 1, done: false }]
    })
    setShopInput('')
  }

  const chgShop = (index: number, delta: number): void => {
    setShopping(prev => prev.map((i, idx) =>
      idx === index ? { ...i, qty: Math.max(1, i.qty + delta) } : i
    ))
  }

  const toggleShop = (index: number): void => {
    setShopping(prev => prev.map((i, idx) =>
      idx === index ? { ...i, done: !i.done } : i
    ))
  }

  const removeShop = (index: number): void => {
    setShopping(prev => prev.filter((_, idx) => idx !== index))
    setActiveCtx(null)
  }

  const addToPantryFromShop = (index: number): void => {
    const item = shopping[index]
    setPantry(prev => {
      const existing = prev.findIndex(i => i.name.toLowerCase() === item.name.toLowerCase())
      if (existing >= 0) {
        return prev.map((i, idx) => idx === existing ? { ...i, qty: i.qty + item.qty } : i)
      }
      return [...prev, { id: Date.now(), name: item.name, qty: item.qty }]
    })
    setShopping(prev => prev.filter((_, idx) => idx !== index))
    setActiveCtx(null)
  }

return (
  <div className="app">
    <h1>🍫 SnackStack 🍫</h1>
    <p className="app-description">Keep track of your pantry and plan your next shopping trip</p>
    <div className="columns">
      <PantryPanel
        pantry={pantry}
        pantryInput={pantryInput}
        activeCtx={activeCtx}
        setPantryInput={setPantryInput}
        addPantry={addPantry}
        chgPantry={chgPantry}
        removePantry={removePantry}
        movePantryToShop={movePantryToShop}
        addShopCopy={addShopCopy}
        toggleCtx={toggleCtx}
      />
      <ShoppingPanel
        shopping={shopping}
        shopInput={shopInput}
        activeCtx={activeCtx}
        setShopInput={setShopInput}
        addShop={addShop}
        chgShop={chgShop}
        removeShop={removeShop}
        toggleShop={toggleShop}
        addToPantryFromShop={addToPantryFromShop}
        toggleCtx={toggleCtx}
      />
    </div>
  </div>
)
}


export default App

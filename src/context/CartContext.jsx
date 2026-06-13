import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = sessionStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })

  const [tableToken, setTableToken] = useState(() => {
    return sessionStorage.getItem('tableToken') || ''
  })

  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  useEffect(() => {
    if (tableToken) sessionStorage.setItem('tableToken', tableToken)
  }, [tableToken])

  const addToCart = (menuItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.menuItem.id === menuItem.id)
      if (existing) {
        return prev.map((i) =>
          i.menuItem.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { menuItem, quantity: 1, specialInstructions: '' }]
    })
  }

  const removeFromCart = (menuItemId) => {
    setItems((prev) => prev.filter((i) => i.menuItem.id !== menuItemId))
  }

  const updateQuantity = (menuItemId, quantity) => {
    if (quantity <= 0) return removeFromCart(menuItemId)
    setItems((prev) =>
      prev.map((i) => (i.menuItem.id === menuItemId ? { ...i, quantity } : i))
    )
  }

  const updateInstructions = (menuItemId, specialInstructions) => {
    setItems((prev) =>
      prev.map((i) => (i.menuItem.id === menuItemId ? { ...i, specialInstructions } : i))
    )
  }

  const clearCart = () => {
    setItems([])
    sessionStorage.removeItem('cart')
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce(
    (sum, i) => sum + i.menuItem.price * i.quantity, 0
  )

  return (
    <CartContext.Provider value={{
      items, tableToken, setTableToken,
      addToCart, removeFromCart, updateQuantity, updateInstructions,
      clearCart, totalItems, totalPrice
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)

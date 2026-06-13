import { useState, useEffect } from 'react'
import { getAllMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, toggleAvailability } from '../api/menuApi'
import ImageUpload from '../components/ImageUpload'

export default function AdminMenu() {
  const [items, setItems] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', imageUrl: '', available: true })

  const fetchItems = () => {
    getAllMenuItems().then((res) => setItems(res.data)).catch(() => {})
  }

  useEffect(() => { fetchItems() }, [])

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', category: '', imageUrl: '', available: true })
    setEditItem(null)
    setShowForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = { ...form, price: parseFloat(form.price) }
    try {
      if (editItem) {
        await updateMenuItem(editItem.id, data)
      } else {
        await createMenuItem(data)
      }
      resetForm()
      fetchItems()
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving item')
    }
  }

  const handleEdit = (item) => {
    setForm({ name: item.name, description: item.description || '', price: item.price, category: item.category, imageUrl: item.imageUrl || '', available: item.available })
    setEditItem(item)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return
    await deleteMenuItem(id)
    fetchItems()
  }

  const handleToggle = async (id) => {
    await toggleAvailability(id)
    fetchItems()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-secondary">Menu Management</h1>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700">
          + Add Item
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="font-bold text-lg mb-4">{editItem ? 'Edit Item' : 'New Item'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" required />
              <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" rows={2} />
              <div className="flex gap-3">
                <input type="number" step="0.01" placeholder="Price" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} className="flex-1 border rounded-lg px-3 py-2 text-sm" required />
                <input type="text" placeholder="Category" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="flex-1 border rounded-lg px-3 py-2 text-sm" required />
              </div>
              <input type="text" placeholder="Image URL (optional)" value={form.imageUrl} onChange={(e) => setForm({...form, imageUrl: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <ImageUpload currentUrl={form.imageUrl} onUploaded={(url) => setForm({...form, imageUrl: url})} />
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-lg text-sm hover:bg-red-700">Save</button>
                <button type="button" onClick={resetForm} className="flex-1 bg-gray-200 py-2 rounded-lg text-sm hover:bg-gray-300">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Items table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Category</th>
              <th className="text-right p-3">Price</th>
              <th className="text-center p-3">Available</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{item.name}</td>
                <td className="p-3 text-gray-500">{item.category}</td>
                <td className="p-3 text-right">RM{item.price?.toFixed(2)}</td>
                <td className="p-3 text-center">
                  <button onClick={() => handleToggle(item.id)} className={`w-10 h-5 rounded-full transition ${item.available ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition transform ${item.available ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </td>
                <td className="p-3 text-right space-x-2">
                  <button onClick={() => handleEdit(item)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <p className="text-center py-8 text-gray-400">No menu items yet</p>}
      </div>
    </div>
  )
}

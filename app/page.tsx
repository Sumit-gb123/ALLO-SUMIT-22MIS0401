'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Inventory {
  warehouseId: string
  warehouseName: string
  totalStock: number
  reservedStock: number
  availableStock: number
}

interface Product {
  id: string
  name: string
  description: string
  inventory: Inventory[]
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  async function fetchProducts() {
    try {
      const res = await fetch('/api/products')

      const data = await res.json()

      setProducts(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  async function reserve(
    productId: string,
    warehouseId: string
  ) {
    try {
      setLoading(true)

      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          warehouseId,
          quantity: 1,
        }),
      })

      if (res.status === 409) {
        alert('Not enough stock available')
        return
      }

      const data = await res.json()

      router.push(`/reservation/${data.id}`)
    } catch (error) {
      console.error(error)
      alert('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold mb-10">
          Allo Inventory Reservation System
        </h1>

        <div className="grid gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-6 rounded-2xl shadow"
            >
              <h2 className="text-2xl font-bold">
                {product.name}
              </h2>

              <p className="text-gray-500 mt-2">
                {product.description}
              </p>

              <div className="mt-6 space-y-4">
                {product.inventory.map((inv) => (
                  <div
                    key={inv.warehouseId}
                    className="flex items-center justify-between border rounded-xl p-4"
                  >
                    <div>
                      <p className="font-semibold">
                        {inv.warehouseName}
                      </p>

                      <p>
                        Available Stock:{' '}
                        {inv.availableStock}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        reserve(
                          product.id,
                          inv.warehouseId
                        )
                      }
                      disabled={loading}
                      className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800"
                    >
                      Reserve
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Service {
  id: string
  name: string
  price: number
  unit: string
}

interface CalculatorProps {
  services?: Service[]
  discountEnabled?: boolean
  discountPercent?: number
}

export default function Calculator({ 
  services: initialServices = [],
  discountEnabled = false,
  discountPercent = 0
}: CalculatorProps) {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [selectedServices, setSelectedServices] = useState<Record<string, number>>({})
  const [total, setTotal] = useState(0)

  useEffect(() => {
    // Fetch services if not provided
    if (initialServices.length === 0) {
      fetch('/api/services')
        .then(res => res.json())
        .then(data => {
          if (data.services) {
            setServices(data.services.filter((s: Service & { isActive: boolean }) => s.isActive))
          }
        })
    }
  }, [initialServices])

  useEffect(() => {
    let sum = 0
    Object.entries(selectedServices).forEach(([serviceId, quantity]) => {
      const service = services.find(s => s.id === serviceId)
      if (service && quantity > 0) {
        sum += service.price * quantity
      }
    })

    if (discountEnabled && discountPercent > 0) {
      sum = sum * (1 - discountPercent / 100)
    }

    setTotal(sum)
  }, [selectedServices, services, discountEnabled, discountPercent])

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => {
      if (prev[serviceId]) {
        const newState = { ...prev }
        delete newState[serviceId]
        return newState
      } else {
        return { ...prev, [serviceId]: 1 }
      }
    })
  }

  const updateQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      const newState = { ...selectedServices }
      delete newState[serviceId]
      setSelectedServices(newState)
    } else {
      setSelectedServices(prev => ({ ...prev, [serviceId]: quantity }))
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="space-y-4">
        {services.map((service) => {
          const isSelected = !!selectedServices[service.id]
          const quantity = selectedServices[service.id] || 0

          return (
            <div key={service.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <input
                type="checkbox"
                id={`service-${service.id}`}
                checked={isSelected}
                onChange={() => toggleService(service.id)}
                className="w-5 h-5"
              />
              <label htmlFor={`service-${service.id}`} className="flex-1 cursor-pointer">
                <div className="font-semibold">{service.name}</div>
                <div className="text-sm text-gray-600">
                  {service.price.toLocaleString('ru-RU')} {service.unit}
                </div>
              </label>
              {isSelected && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(service.id, quantity - 1)}
                    className="w-8 h-8 rounded border hover:bg-gray-100"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => updateQuantity(service.id, parseInt(e.target.value) || 0)}
                    className="w-16 text-center border rounded"
                  />
                  <button
                    onClick={() => updateQuantity(service.id, quantity + 1)}
                    className="w-8 h-8 rounded border hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-8 pt-6 border-t">
        {discountEnabled && discountPercent > 0 && (
          <div className="mb-4 text-sm text-gray-600">
            Скидка {discountPercent}% применена
          </div>
        )}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-semibold">Итого:</span>
          <span className="text-3xl font-bold text-primary">
            {total.toLocaleString('ru-RU')} ₽
          </span>
        </div>
        <Link href="/calculator">
          <Button className="w-full" size="lg">
            Оставить заявку
          </Button>
        </Link>
      </div>
    </div>
  )
}



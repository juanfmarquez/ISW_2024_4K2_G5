'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import emailjs from 'emailjs-com'
import { quotes, paymentMethods, shippingOrders } from '../db'

const PaymentSelection = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    documentNumber: ''
  })
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState([])
  const [attempts, setAttempts] = useState(0)
  const [isPaymentProcessed, setIsPaymentProcessed] = useState(false)
  const [lastAttemptedCard, setLastAttemptedCard] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedQuote, setSelectedQuote] = useState(null)
  const [cardTypeSelected, setCardTypeSelected] = useState(false)

  useEffect(() => {
    const quoteId = searchParams.get('quoteId')
    if (!quoteId) {
      router.push('/quotes')
    } else {
      const quote = quotes.find(q => q.id === parseInt(quoteId))
      if (quote) {
        setSelectedQuote(quote)
        // Filter available payment methods based on the quote
        const availableMethods = paymentMethods.filter(method =>
          quote.paymentMethods.includes(method.id)
        )
        setAvailablePaymentMethods(availableMethods)
      } else {
        // Handle case where quote is not found
        router.push('/quotes')
      }
    }
  }, [searchParams, router])

  const handlePaymentMethodSelection = (method) => {
    setSelectedPaymentMethod(method)
    setError('')
  }

  const handleCardDetailChange = (e) => {
    const { name, value } = e.target

    if (name === 'number') {
      let formattedValue = value.replace(/\D/g, '')
      if (formattedValue.length > 0) {
        formattedValue = formattedValue.match(/.{1,4}/g).join(' ')
      }
      setCardDetails({ ...cardDetails, [name]: formattedValue })
    } else if (name === 'name') {
      if (/^[a-zA-Z\s]*$/.test(value)) {
        setCardDetails({ ...cardDetails, [name]: value })
      }
    } else if (name === 'expiry') {
      let formattedValue = value.replace(/\D/g, '')
      if (formattedValue.length > 2) {
        const month = parseInt(formattedValue.slice(0, 2), 10)
      }
      if (value.length === 3 && e.nativeEvent.inputType === 'deleteContentBackward') {
        formattedValue = formattedValue.slice(0, 2)
      } else if (formattedValue.length > 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2)
      }
      if (formattedValue.length <= 5) {
        setCardDetails({ ...cardDetails, [name]: formattedValue })
      }
    } else if (name === 'cvv') {
      if (/^[0-9]{0,3}$/.test(value)) {
        setCardDetails({ ...cardDetails, [name]: value })
      }
    } else if (name === 'documentNumber') {
      if (/^[0-9]*$/.test(value)) {
        setCardDetails({ ...cardDetails, [name]: value })
      }
    }

    setError('')
  }

  const validateCardDetails = () => {
    const { number, cvv, expiry } = cardDetails

    if (!Object.values(cardDetails).every(value => value.trim() !== '')) {
      setError('Por favor, completa todos los detalles de la tarjeta.')
      return false
    }

    if (number && number.replace(/\s+/g, '').length !== 16) {
      setError('El número de la tarjeta debe tener 16 dígitos.')
      return false
    }

    if (cvv && cvv.length !== 3) {
      setError('El CVV debe tener 3 dígitos.')
      return false
    }

    if (expiry && expiry.length !== 5) {
      setError('La fecha de expiración debe cumplir el formato MM/AA')
      return false
    }

    if (/^\d{2}\/\d{2}$/.test(expiry)) {
      const [month, year] = expiry.split('/').map(Number)
      const currentDate = new Date()
      const currentMonth = currentDate.getMonth() + 1
      const currentYear = currentDate.getFullYear() % 100

      if (month < 1 || month > 12) {
        setError('Fecha inválida')
        return false
      }
      if (year < currentYear || (year == currentYear && month < currentMonth)) {
        setError('Su tarjeta está vencida')
        return false
      }
    }

    // Check if the card number is the same as the last attempted one
    if (number.replace(/\s+/g, '') === lastAttemptedCard) {
      setError('Por favor, ingresá una tarjeta diferente a la anterior.')
      return false
    }

    return true
  }

  const processPayment = () => {
    // If the payment method is not a card, always approve
    if (selectedPaymentMethod.id !== 3) {
      return true
    }

    const currentCardNumber = cardDetails.number.replace(/\s+/g, '')

    if (attempts === 0) {
      const paymentAccepted = Math.random() < 0.5 // 50% chance of failure on first attempt
      if (!paymentAccepted) {
        setError('El pago se rechazó por saldo insuficiente. Por favor, ingresá otra tarjeta.')
        setAttempts(attempts + 1)
        setLastAttemptedCard(currentCardNumber)
        return false
      }
    }
    setError('')
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedPaymentMethod) {
      setError('Elegí un método de pago tocando una opción.')
      return
    }

    if (selectedPaymentMethod.id === 3 && !validateCardDetails()) {
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      // Simulate payment processing with a 2-second delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      const paymentSuccessful = processPayment()

      if (!paymentSuccessful) {
        throw new Error('Pago fallido. Por favor, reintentá.')
      }

      setIsPaymentProcessed(true)

      // Configuración de EmailJS
      const serviceID = 'service_o64qt3m'
      const templateID = 'template_q7985ou'
      const userID = 'k1DvsfIoSwB0yg-p9'

      const emailContent = {
        user_email: selectedQuote.carrierEmail,
        subject: 'Confirmación de Pago - Tango App',
        message: `
        Hola ${selectedQuote.carrierName},
        
        ¡Felicitaciones! Tu servicio fue contratado, te dejamos un resumen del envío:
        
        Detalles del envío:          
        - Monto del pago: $${selectedQuote.cost}
        - Método de pago: ${selectedPaymentMethod.name}
        - Fecha de retiro: ${selectedQuote.pickup}
        - Fecha de entrega: ${selectedQuote.delivery}
                  
        Si necesitás asistencia, no dudes en contactarnos a través de la aplicación o respondiendo a este correo.
                  
        Saludos,
        El equipo de Tango App
      `
      }

      await emailjs.send(serviceID, templateID, emailContent, userID)
      console.log('Correo enviado con éxito')
    } catch (error) {
      console.error('Error:', error)
      setError('Lo sentimos, hubo un problema al procesar el pago. Por favor, intentá con otra tarjeta.')
    } finally {
      // Update the status of the shipping order and the selected quote
      if (selectedQuote) {
        // Find and update the shipping order
        const shippingOrderIndex = shippingOrders.findIndex(order => order.id === selectedQuote.shippingOrderId)
        if (shippingOrderIndex !== -1) {
          shippingOrders[shippingOrderIndex].status = 'confirmada'
        }

        // Find and update the selected quote
        const quoteIndex = quotes.findIndex(quote => quote.id === selectedQuote.id)
        if (quoteIndex !== -1) {
          quotes[quoteIndex].status = 'confirmada'
        }
      }
      const paymentId = Math.floor(Math.random() * 100000000000).toString().padStart(11, '0')
      alert(`Tu pago se realizó correctamente. ¡Muchas gracias!\nID de pago: ${paymentId}`)
      setIsProcessing(false)
    }
  }

  return (
    <div>
      <h2 className='text-2xl font-bold mt-4'>Elegí cómo pagar</h2>
      {selectedQuote && (
        <p className='text-gray-400 text-sm mb-6 mt-2'>{selectedQuote.carrierName}</p>
      )}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-3 mb-4'>
        {availablePaymentMethods.map((method) => (
          <Card
            key={method.id}
            className={`cursor-pointer shadow-none rounded-md hover:bg-gray-100 transition-colors duration-200 ${selectedPaymentMethod?.id === method.id ? 'bg-gray-100' : ''}`}
            onClick={() => handlePaymentMethodSelection(method)}
          >
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                <div className='flex items-center gap-x-4'>
                  {method.icon}
                  {method.name}
                </div>
                <ChevronRight />
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      {selectedPaymentMethod?.id === 3 && (
        <form className='mb-4'>
          <h3 className='text-xl font-semibold my-4'>Detalles de Tarjeta</h3>
          <div className='space-y-2'>
            <Select onValueChange={(value) => setCardTypeSelected(true)}>
              <SelectTrigger>
                <SelectValue placeholder='Seleccioná el tipo de tarjeta' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='credit'>Tarjeta de crédito</SelectItem>
                <SelectItem value='debit'>Tarjeta de débito</SelectItem>
              </SelectContent>
            </Select>
            {cardTypeSelected && (<>
              <Input
                type='tel'
                name='number'
                placeholder='Número de tarjeta'
                autoComplete='cc-number'
                pattern='[0-9\s]{1, 19}'
                maxLength='19'
                onChange={handleCardDetailChange}
                value={cardDetails.number}
                required
              />
              <Input
                type='text'
                name='name'
                placeholder='Titular de la tarjeta'
                autoComplete='cc-name'
                maxLength='50'
                onChange={handleCardDetailChange}
                value={cardDetails.name}
                required
              />
              <div className='flex gap-2'>
                <Input
                  type='text'
                  name='expiry'
                  placeholder='MM/AA'
                  autoComplete='cc-exp'
                  pattern='(0[1-9]|1[0-2])\/[0-9]{2}'
                  maxLength='5'
                  onChange={handleCardDetailChange}
                  value={cardDetails.expiry}
                  required
                />
                <Input
                  type='tel'
                  name='cvv'
                  placeholder='CVV'
                  autoComplete='cc-csc'
                  pattern='[0-9]{3}'
                  maxLength='3'
                  onChange={handleCardDetailChange}
                  value={cardDetails.cvv}
                  required
                />
              </div>
              <div className='flex items-center gap-x-2'>
                <Select>
                  <SelectTrigger className=' w-40'>
                    <SelectValue placeholder='DNI' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='dni'>DNI</SelectItem>
                    <SelectItem value='cedula'>Cédula</SelectItem>
                    <SelectItem value='lc'>L.C.</SelectItem>
                    <SelectItem value='le'>L.E.</SelectItem>
                    <SelectItem value='otro'>Otro</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type='text'
                  name='documentNumber'
                  placeholder='Documento del titular'
                  maxLength='8'
                  onChange={handleCardDetailChange}
                  value={cardDetails.documentNumber}
                  required
                />
              </div>
            </>)}

          </div>
          <div className='flex items-center mt-2'>
            <p className='text-xs text-gray-600 mr-4'>Procesamos el pago de forma segura con</p>
            <Image unoptimized src='/logo-mercadopago.png' alt='logo mercadopago' width={70} height={70} />
          </div>
        </form>
      )}

      {error && <p className='text-red-500 mb-2'>{error}</p>}

      <Button onClick={handleSubmit} className='w-full' disabled={isProcessing}>
        {isProcessing ? 'Procesando...' : 'Realizar Pedido'}
      </Button>

    </div>
  )
}

export default PaymentSelection

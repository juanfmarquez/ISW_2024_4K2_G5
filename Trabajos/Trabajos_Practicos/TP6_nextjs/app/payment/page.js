'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, CreditCard, DollarSign } from "lucide-react";
import Image from 'next/image';

const PaymentSelection = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
    documentNumber: ""
  });
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const quoteId = searchParams.get('quoteId');

  useEffect(() => {
    if (!quoteId) {
      router.push('/quotes');
    }
  }, [quoteId, router]);

  const paymentMethods = [
    { id: 'cash_pickup', name: 'Contado al retirar', icon: <DollarSign /> },
    { id: 'cash_delivery', name: 'Contado contra entrega', icon: <DollarSign /> },
    { id: 'card', name: 'Tarjeta de crédito/débito', icon: <CreditCard /> },
  ];

  const handlePaymentMethodSelection = (method) => {
    setSelectedPaymentMethod(method);
    setError("");
  };

  const handleCardDetailChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
    setError("");
  };

  const validateCardDetails = () => {
    return Object.values(cardDetails).every(value => value.trim() !== "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      setError("Elegí un método de pago tocando una opción.");
      return;
    }
    if (selectedPaymentMethod.id === 'card' && !validateCardDetails()) {
      setError("Por favor, completa todos los detalles de la tarjeta.");
      return;
    }
    // Process payment logic here
    console.log("Payment method:", selectedPaymentMethod);
    if (selectedPaymentMethod.id === 'card') {
      console.log("Card details:", cardDetails);
    }
    alert("Tu pago se realizó correctamente. ¡Muchas gracias!");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold my-4">Elegí cómo pagar</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {paymentMethods.map((method) => (
          <Card
            key={method.id}
            className={`cursor-pointer shadow-none rounded-md hover:bg-gray-100 transition-colors duration-200 ${selectedPaymentMethod?.id === method.id ? 'bg-gray-100' : ''}`}
            onClick={() => handlePaymentMethodSelection(method)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
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

      {selectedPaymentMethod?.id === 'card' && (
        <form className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Detalles de Tarjeta</h3>
          <div className="space-y-2">
            <Input
              type="tel"
              name="number"
              placeholder="Número de tarjeta"
              autoComplete="cc-number"
              pattern="[0-9\s]{13,19}"
              maxLength="19"
              onChange={handleCardDetailChange}
              required
            />
            <Input
              type="text"
              name="name"
              placeholder="Titular de la tarjeta"
              autoComplete="cc-name"
              onChange={handleCardDetailChange}
              required
            />
            <div className="flex gap-2">
              <Input
                type="text"
                name="expiry"
                placeholder="MM/AA"
                autoComplete="cc-exp"
                pattern="(0[1-9]|1[0-2])\/[0-9]{2}"
                maxLength="5"
                onChange={handleCardDetailChange}
                required
              />
              <Input
                type="tel"
                name="cvv"
                placeholder="CVV"
                autoComplete="cc-csc"
                pattern="[0-9]{3,4}"
                maxLength="4"
                onChange={handleCardDetailChange}
                required
              />
            </div>
            <Input
              type="text"
              name="documentNumber"
              placeholder="Documento del titular"
              onChange={handleCardDetailChange}
              required
            />
          </div>
          <div className='flex items-center mt-2'>
            <p className='text-xs text-gray-600 mr-4'>Procesamos el pago de forma segura con</p>
            <Image unoptimized src='/logo-mercadopago.png' alt='logo mercadopago' width={70} height={70} />
          </div>
        </form>
      )}

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <Button onClick={handleSubmit} className="w-full">
        Realizar Pedido
      </Button>
    </div>
  );
};

export default PaymentSelection;
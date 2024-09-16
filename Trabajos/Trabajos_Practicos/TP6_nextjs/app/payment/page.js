'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, CreditCard, DollarSign } from "lucide-react";

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
  const [attempts, setAttempts] = useState(0);
  const [isPaymentProcessed, setIsPaymentProcessed] = useState(false);
  const [selectedCardType, setSelectedCardType] = useState("");
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
    const { name, value } = e.target;

    if (name === 'number') {
      let formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 0) {
        formattedValue = formattedValue.match(/.{1,4}/g).join(' ');
      }
      setCardDetails({ ...cardDetails, [name]: formattedValue });
    } else if (name === 'name') {
      if (/^[a-zA-Z\s]*$/.test(value)) {
        setCardDetails({ ...cardDetails, [name]: value });
      }
    } else if (name === 'expiry') {
      let formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2);
      }
      if (formattedValue.length <= 5) {
        setCardDetails({ ...cardDetails, [name]: formattedValue });
      }
    } else if (name === 'cvv') {
      if (/^[0-9]{0,3}$/.test(value)) {
        setCardDetails({ ...cardDetails, [name]: value });
      }
    } else if (name === 'documentNumber') {
      if (/^[0-9]*$/.test(value)) {
        setCardDetails({ ...cardDetails, [name]: value });
      }
    }
    setError("");
  };

  const validateCardDetails = () => {
    const { number, cvv, expiry } = cardDetails;
    if (!Object.values(cardDetails).every(value => value.trim() !== "")) {
      setError("Por favor, completa todos los detalles de la tarjeta.");
      return false;
    }

    if (number.replace(/\s+/g, '').length !== 16) {
      setError("El número de la tarjeta debe tener 16 dígitos.");
      return false;
    }

    if (cvv.length !== 3) {
      setError("El CVV debe tener 3 dígitos.");
      return false;
    }

    if (expiry.length !== 5) {
      setError("La fecha de expiración debe cumplir el formato MM/AA");
      return false;
    }

    const [month, year] = expiry.split('/').map(Number);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear() % 100;

    if (month < 1 || month > 12) {
      setError("Fecha inválida");
      return false;
    }
    if (year < currentYear || (year == currentYear && month < currentMonth)) {
      setError("Su tarjeta está vencida");
      return false;
    }

    return true;
  };

  const processPayment = () => {
    if (attempts === 0) {
      const paymentAccepted = Math.random() > 0.5;
      if (!paymentAccepted) {
        setError("Pago rechazado. Ingresa otra tarjeta.");
        setAttempts(attempts + 1);
        return false;
      }
    }
    setError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedPaymentMethod) {
      setError("Elegí un método de pago tocando una opción.");
      return;
    }

    if (selectedPaymentMethod.id === 'card' && !validateCardDetails()) {
      return;
    }

    if (selectedPaymentMethod.id === 'card' && !processPayment()) {
      return;
    }

    setIsPaymentProcessed(true);
    alert("Tu pago se realizó correctamente. ¡Muchas gracias!");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Elegí cómo pagar</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {paymentMethods.map((method) => (
          <Card
            key={method.id}
            className={`cursor-pointer p-4 shadow-md rounded-md hover:bg-gray-100 transition-colors duration-300 
              ${selectedPaymentMethod?.id === method.id ? 'bg-blue-100' : 'bg-white'}`}
            onClick={() => handlePaymentMethodSelection(method)}
          >
            <CardHeader className="text-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                  {method.icon}
                  <span>{method.name}</span>
                </div>
                <ChevronRight className="text-gray-500" />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {selectedPaymentMethod?.id === 'card' && (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <h3 className="text-xl font-semibold mb-4">Detalles de Tarjeta</h3>

          <div className="space-y-2">
            <select
              className="input-field"
              value={selectedCardType}
              onChange={(e) => setSelectedCardType(e.target.value)}
              required
            >
              <option value="">Seleccione tipo de tarjeta</option>
              <option value="credit">Tarjeta de crédito</option>
              <option value="debit">Tarjeta de débito</option>
            </select>

            <Input
              type="tel"
              name="number"
              placeholder="Número de tarjeta"
              className="input-field"
              value={cardDetails.number}
              onChange={handleCardDetailChange}
              required
            />

            <Input
              type="text"
              name="name"
              placeholder="Titular de la tarjeta"
              className="input-field"
              value={cardDetails.name}
              onChange={handleCardDetailChange}
              required
            />

            <div className="grid grid-cols-2 gap-2">
              <Input
                type="text"
                name="expiry"
                placeholder="MM/AA"
                className="input-field"
                value={cardDetails.expiry}
                onChange={handleCardDetailChange}
                required
              />
              <Input
                type="tel"
                name="cvv"
                placeholder="CVV"
                className="input-field"
                value={cardDetails.cvv}
                onChange={handleCardDetailChange}
                required
              />
            </div>

            <Input
              type="text"
              name="documentNumber"
              placeholder="Documento del titular"
              maxLength="15"
              onChange={handleCardDetailChange}
              value={cardDetails.documentNumber}
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md">
            Realizar Pedido
          </Button>
        </form>
      )}

      {isPaymentProcessed && (
        <p className="text-green-600 mt-4 text-center">Pago procesado correctamente. ¡Gracias!</p>
      )}
    </div>
  );
};

export default PaymentSelection;

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
    const { name, value } = e.target;

    // Validación del número de tarjeta (solo números y formateo con espacios)
    if (name === 'number') {
      let formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 0) {
          formattedValue = formattedValue.match(/.{1,4}/g).join(' ');
      }
      setCardDetails({ ...cardDetails, [name]: formattedValue });
    }

    // Validación del nombre del titular (solo letras)
    else if (name === 'name') {
      if (/^[a-zA-Z\s]*$/.test(value)) {
        setCardDetails({ ...cardDetails, [name]: value });
      }
    }

    // Validación de fecha de expiración (solo números y formato MM/AA)
    else if (name === 'expiry') {
      let formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 2) {
          const month = parseInt(formattedValue.slice(0, 2), 10);
          if (month > 12 || month < 1) {
              setError('El mes debe estar entre 01 y 12');
              return;
          } else {
              setError('');
          }
      }
      if (value.length === 3 && e.nativeEvent.inputType === 'deleteContentBackward') {
        // Permitir borrar el slash manualmente
        formattedValue = formattedValue.slice(0, 2);
      } else if (formattedValue.length > 2) {
          // Asegurarse de que el tercer carácter sea "/"
          formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2);
      }
      // Limitar el número total de caracteres a 5 (MM/AA)
      if (formattedValue.length <= 5) {
          setCardDetails({ ...cardDetails, [name]: formattedValue });
      }
    }

    // Validación del CVV (solo números)
    else if (name === 'cvv') {
      if (/^[0-9]{0,3}$/.test(value)) {
        setCardDetails({ ...cardDetails, [name]: value });
      }
    }

    // Validación del número de documento (solo números)
    else if (name === 'documentNumber') {
      if (/^[0-9]*$/.test(value)) {
        setCardDetails({ ...cardDetails, [name]: value });
      }
    }

    setError("");
  };

  const validateCardDetails = () => {
    const { number, cvv, expiry } = cardDetails;
    
    // Validar que no haya campos vacíos
    if (!Object.values(cardDetails).every(value => value.trim() !== "")) {
      setError("Por favor, completa todos los detalles de la tarjeta.");
      return false;
    }

    // Validación de número de tarjeta (16 dígitos)
    if (number && number.replace(/\s+/g, '').length !== 16) {
      setError("El número de la tarjeta debe tener 16 dígitos.");
      return false;
    }

    // Validación del CVV (3 dígitos)
    if (cvv && cvv.length !== 3) {
      setError("El CVV debe tener 3 dígitos.");
      return false;
    }

    // Validación de fecha de expiración (5 caracteres en formato MM/AA)
    if (expiry && expiry.length !== 5) {
      setError("La fecha de expiración debe cumplir el formato MM/AA");
      return false;
    }

    if (/^\d{2}\/\d{2}$/.test(expiry)){
      const [month, year] = expiry.split('/').map(Number);
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear() % 100;

      if (month < 1 || month > 12){
        setError("El mes "+month+" no es válido. Ingresá un valor del 1 al 12.");
        return false;
      }
      if (year < currentYear || (year == currentYear && month < currentMonth)){
        setError("Su tarjeta está vencida.");
        return false;
      }
     }


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

    // Process payment logic here
    console.log("Payment method:", selectedPaymentMethod);
    if (selectedPaymentMethod.id === 'card') {
      console.log("Card details:", cardDetails);
    }
    
    // Si todo está correcto
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
              pattern="[0-9\s]{1, 19}"
              maxLength="19"
              onChange={handleCardDetailChange}
              value={cardDetails.number}
              required
            />
            <Input
              type="text"
              name="name"
              placeholder="Titular de la tarjeta"
              autoComplete="cc-name"
              maxLength="50"
              onChange={handleCardDetailChange}
              value={cardDetails.name}
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
                value={cardDetails.expiry}
                required
              />
              <Input
                type="tel"
                name="cvv"
                placeholder="CVV"
                autoComplete="cc-csc"
                pattern="[0-9]{3}"
                maxLength="3"
                onChange={handleCardDetailChange}
                value={cardDetails.cvv}
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
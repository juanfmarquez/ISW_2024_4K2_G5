'use client'
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, Star } from "lucide-react";
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { quotes, paymentMethods } from '../db';

const QuoteSelectionPayment = () => {
  const router = useRouter();

  const getPaymentMethodBadges = (methodIds) => {
    return methodIds.map(id => {
      const method = paymentMethods.find(m => m.id === id);
      return method ? (
        <Badge key={id} variant="secondary" className="m-1">
          {method.name}
        </Badge>
      ) : null;
    });
  };


  const handleQuoteSelection = (quote) => {
    router.push(`/payment?quoteId=${quote.id}`);  
  }
  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat('es-AR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });

    const formattedDate = formatter.format(date);
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  };

  const calculateDateDifference = (pickup, delivery) => {
    const pickupDate = new Date(pickup);
    const deliveryDate = new Date(delivery);
    const diffTime = Math.abs(deliveryDate - pickupDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold my-4">Elegí un presupuesto</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {quotes.map((quote) => (
          <Card
            key={quote.id}
            className="cursor-pointer shadow-none rounded-md hover:bg-gray-100 transition-colors duration-200"
            onClick={() => handleQuoteSelection(quote)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">{quote.carrierName}
                <div className='flex items-center gap-x-1'>
                  <p>$ {Intl.NumberFormat('es-AR').format(quote.cost)} </p>
                  <ChevronRight />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center mb-2 -mt-2 gap-x-2'>
                <p className='text-gray-800'>{quote.rating}</p>
                <Star size={16} />
              </div>

              <div className='flex justify-left gap-x-10 items-center mb-3'>
                <div>
                  <p className='text-gray-600'>Retiro</p>
                  <span className='font-semibold'>{formatDate(quote.pickup)}</span>
                </div>
                <div>
                  <p className='text-gray-600'>Entrega</p>
                  <span className='font-semibold'>{formatDate(quote.delivery)}</span>
                </div>
              </div>
              <p>Demora de <span className='font-bold'>{calculateDateDifference(quote.pickup, quote.delivery)} días</span></p>
              <hr className='my-4' />
              <div>{getPaymentMethodBadges(quote.paymentMethods)}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuoteSelectionPayment;
'use client'
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, Star } from "lucide-react";
import { useRouter } from 'next/navigation';

const QuoteSelectionPayment = () => {
  const router = useRouter();

  // Mock data for quotes
  const quotes = [
    { id: 1, pickup: "2024-09-15", delivery: "2024-09-17", cost: 4560, rating: 4.5 },
    { id: 2, pickup: "2024-09-16", delivery: "2024-09-18", cost: 6000, rating: 4.2 },
    { id: 3, pickup: "2024-09-15", delivery: "2024-09-19", cost: 3500, rating: 4.8 },
  ];

  const handleQuoteSelection = (quoteId) => {
    router.push(`/payment?quoteId=${quoteId}`);
  };

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
      <h2 className="text-2xl font-bold my-4">Elegí un Presupuesto</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {quotes.map((quote) => (
          <Card 
            key={quote.id} 
            className="cursor-pointer shadow-none rounded-md hover:bg-gray-100 transition-colors duration-200"
            onClick={() => handleQuoteSelection(quote.id)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">Presupuesto #{quote.id}
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuoteSelectionPayment;
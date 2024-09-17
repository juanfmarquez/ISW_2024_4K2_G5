import { DollarSign, CreditCard } from "lucide-react";

export const paymentMethods = [
    { id: 1, name: 'Contado al retirar', icon: <DollarSign /> },
    { id: 2, name: 'Contado contra entrega', icon: <DollarSign /> },
    { id: 3, name: 'Tarjeta de crédito/débito', icon: <CreditCard /> },
];

export const shipping_orders = [
    {
        id: 1,
        status: "pendiente"
    },
    {
        id: 2,
        status: "confirmada"
    },
    {
        id: 3,
        status: "completada"
    }
]
export const quotes = [
    {
        id: 1,
        pickup: "2024-09-15",
        delivery: "2024-09-17",
        cost: 4560,
        rating: 4.5,
        carrierName: "Transportes Rápidos S.A.",
        carrierEmail: "tomasmalamud@gmail.com",
        paymentMethods: [1, 2, 3],
        status: "pendiente",
        shippingOrderId: 1
    },
    {
        id: 2,
        pickup: "2024-09-16",
        delivery: "2024-09-18",
        cost: 6000,
        rating: 4.2,
        carrierName: "Envíos Seguros S.R.L.",
        carrierEmail: "juanpedroroldan1@gmail.com",
        paymentMethods: [1, 3],
        status: "pendiente",
        shippingOrderId: 1
    },
    {
        id: 3,
        pickup: "2024-09-15",
        delivery: "2024-09-19",
        cost: 3500,
        rating: 4.8,
        carrierName: "Transportes Económicos",
        carrierEmail: "juanperoldan03@yahoo.com.ar",
        paymentMethods: [2],
        status: "pendiente",
        shippingOrderId: 1
    },
];

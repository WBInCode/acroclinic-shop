import axios from 'axios';
import { prisma } from './prisma.js';

// Fakturownia.pl API Configuration
const FAKTUROWNIA_API_TOKEN = process.env.FAKTUROWNIA_API_TOKEN;
const FAKTUROWNIA_SUBDOMAIN = process.env.FAKTUROWNIA_SUBDOMAIN; // np. "acroclinic" dla acroclinic.fakturownia.pl

const FAKTUROWNIA_BASE_URL = FAKTUROWNIA_SUBDOMAIN
  ? `https://${FAKTUROWNIA_SUBDOMAIN}.fakturownia.pl/`
  : null;

interface OrderItem {
  name: string;
  quantity: number;
  price: number; // cena jednostkowa brutto
  size?: string | null;
}

interface InvoiceData {
  orderId: string;
  orderNumber: string;
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  customerPhone?: string;
  companyName?: string | null;
  nip?: string | null;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  items: OrderItem[];
  shippingCost: number;
  total: number;
  paymentMethod: string;
  paidAt: Date;
}

interface FakturowniaInvoice {
  id: number;
  number: string;
  view_url: string;
  pdf_url: string;
}

/**
 * Tworzy fakturę lub paragon w Fakturownia.pl
 */
export async function createInvoice(data: InvoiceData): Promise<FakturowniaInvoice | null> {
  if (!FAKTUROWNIA_API_TOKEN || !FAKTUROWNIA_BASE_URL) {
    console.warn('Fakturownia API not configured. Skipping invoice generation.');
    return null;
  }

  try {
    // Określ typ dokumentu: faktura VAT (jeśli jest NIP) lub paragon
    const isCompany = !!data.nip && data.nip.length === 10;

    // Przygotuj pozycje faktury
    const positions = data.items.map(item => ({
      name: item.name + (item.size ? ` (rozmiar: ${item.size})` : ''),
      quantity: item.quantity,
      total_price_gross: item.price * item.quantity, // cena całkowita brutto
      tax: 23, // VAT 23%
    }));

    // Dodaj koszt dostawy jako osobną pozycję (jeśli > 0)
    if (data.shippingCost > 0) {
      positions.push({
        name: 'Dostawa',
        quantity: 1,
        total_price_gross: data.shippingCost,
        tax: 23,
      });
    }

    // Dane nabywcy
    const buyerName = isCompany
      ? data.companyName
      : `${data.customerFirstName} ${data.customerLastName}`;

    // Przygotuj dane faktury/paragonu
    const invoicePayload = {
      invoice: {
        kind: isCompany ? 'vat' : 'receipt', // 'vat' = faktura VAT, 'receipt' = paragon
        number: null, // automatyczna numeracja
        sell_date: data.paidAt.toISOString().split('T')[0],
        issue_date: new Date().toISOString().split('T')[0],
        payment_to: new Date().toISOString().split('T')[0], // już opłacone
        payment_type: data.paymentMethod === 'PAYU' ? 'transfer' : 'cash',
        status: 'paid', // zamówienie jest już opłacone
        paid: data.total.toFixed(2),
        buyer_name: buyerName,
        buyer_tax_no: isCompany ? data.nip : undefined,
        buyer_street: data.street,
        buyer_city: data.city,
        buyer_post_code: data.postalCode,
        buyer_country: 'PL',
        buyer_email: data.customerEmail,
        buyer_phone: data.customerPhone || undefined,
        seller_name: 'Acro Clinic',
        seller_tax_no: process.env.SELLER_NIP || '',
        seller_street: process.env.SELLER_STREET || '',
        seller_city: process.env.SELLER_CITY || '',
        seller_post_code: process.env.SELLER_POSTAL_CODE || '',
        seller_country: 'PL',
        positions,
        // Referencja do zamówienia
        oid: data.orderId,
        description: `Zamówienie ${data.orderNumber}`,
        // Automatyczne wysłanie emaila z fakturą
        send_email: true,
        buyer_email_for_sending: data.customerEmail,
      },
    };

    // Wyślij request do Fakturownia API
    const response = await axios.post(
      `${FAKTUROWNIA_BASE_URL}invoices.json`,
      invoicePayload,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-API-KEY': FAKTUROWNIA_API_TOKEN,
        },
      }
    );

    const invoice = response.data;

    console.log(`✅ Invoice created: ${invoice.number} (ID: ${invoice.id})`);

    // Zapisz informacje o fakturze w bazie
    await prisma.order.update({
      where: { id: data.orderId },
      data: {
        invoiceNumber: invoice.number,
        invoiceId: invoice.id.toString(),
        invoiceUrl: `${FAKTUROWNIA_BASE_URL}invoices/${invoice.id}.pdf`,
      },
    });

    return {
      id: invoice.id,
      number: invoice.number,
      view_url: `${FAKTUROWNIA_BASE_URL}invoices/${invoice.id}`,
      pdf_url: `${FAKTUROWNIA_BASE_URL}invoices/${invoice.id}.pdf`,
    };
  } catch (error: any) {
    console.error('Fakturownia API error:', error.response?.data || error.message);
    // Nie rzucamy błędu - faktura jest opcjonalna, zamówienie powinno przejść
    return null;
  }
}

/**
 * Pobiera PDF faktury z Fakturownia.pl
 */
export async function getInvoicePdf(invoiceId: string): Promise<Buffer | null> {
  if (!FAKTUROWNIA_API_TOKEN || !FAKTUROWNIA_BASE_URL) {
    return null;
  }

  try {
    const response = await axios.get(
      `${FAKTUROWNIA_BASE_URL}invoices/${invoiceId}.pdf`,
      {
        headers: {
          'X-API-KEY': FAKTUROWNIA_API_TOKEN,
        },
        responseType: 'arraybuffer',
      }
    );

    return Buffer.from(response.data);
  } catch (error: any) {
    console.error('Error fetching invoice PDF:', error.message);
    return null;
  }
}

/**
 * Generuje fakturę dla zamówienia na podstawie orderId
 */
export async function generateInvoiceForOrder(orderId: string): Promise<FakturowniaInvoice | null> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      user: true,
    },
  });

  if (!order) {
    console.error('Order not found:', orderId);
    return null;
  }

  // Sprawdź czy faktura już istnieje (używamy pola z bazy)
  const existingInvoice = await prisma.order.findUnique({
    where: { id: orderId },
    select: { invoiceNumber: true, invoiceId: true, invoiceUrl: true },
  });

  if (existingInvoice?.invoiceNumber) {
    console.log('Invoice already exists for order:', order.orderNumber);
    return {
      id: parseInt(existingInvoice.invoiceId || '0'),
      number: existingInvoice.invoiceNumber,
      view_url: existingInvoice.invoiceUrl || '',
      pdf_url: existingInvoice.invoiceUrl || '',
    };
  }

  return createInvoice({
    orderId: order.id,
    orderNumber: order.orderNumber,
    customerEmail: order.user?.email || order.guestEmail || 'guest@acroclinic.pl',
    customerFirstName: order.shippingFirstName,
    customerLastName: order.shippingLastName,
    customerPhone: order.shippingPhone || undefined,
    companyName: order.billingCompanyName,
    nip: order.billingNip,
    street: order.billingStreet || order.shippingStreet,
    city: order.billingCity || order.shippingCity,
    postalCode: order.billingPostalCode || order.shippingPostalCode,
    country: order.shippingCountry || 'Polska',
    items: order.items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: Number(item.price),
      size: (item as any).size || null,
    })),
    shippingCost: Number(order.shippingCost),
    total: Number(order.total),
    paymentMethod: order.paymentMethod || 'ONLINE',
    paidAt: order.paidAt || new Date(),
  });
}

/**
 * Generuje paragon/fakturę CZĘŚCIOWĄ dla zamówienia (np. tylko akcesoria lub tylko ciuchy)
 * @param orderId - ID zamówienia
 * @param receiptType - 'accessories' | 'clothing' | 'full'
 */
export async function generatePartialInvoiceForOrder(
  orderId: string,
  receiptType: 'accessories' | 'clothing' | 'full'
): Promise<FakturowniaInvoice | null> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: {
            include: { category: true },
          },
        },
      },
      user: true,
      receipts: true,
    },
  });

  if (!order) {
    console.error('Order not found:', orderId);
    return null;
  }

  // Znajdź odpowiedni receipt
  const receipt = order.receipts.find(r => r.type === receiptType);
  if (!receipt) {
    console.error(`Receipt type "${receiptType}" not found for order:`, orderId);
    return null;
  }

  // Już wystawiony?
  if (receipt.status === 'ISSUED' && receipt.invoiceNumber) {
    console.log(`Receipt "${receiptType}" already issued for order:`, order.orderNumber);
    return {
      id: parseInt(receipt.invoiceId || '0'),
      number: receipt.invoiceNumber,
      view_url: receipt.invoiceUrl || '',
      pdf_url: receipt.invoiceUrl || '',
    };
  }

  // Filtruj pozycje wg kategorii
  let filteredItems = order.items;
  if (receiptType === 'accessories') {
    filteredItems = order.items.filter(item => item.product.category?.slug !== 'clothing');
  } else if (receiptType === 'clothing') {
    filteredItems = order.items.filter(item => item.product.category?.slug === 'clothing');
  }

  if (filteredItems.length === 0) {
    console.warn(`No items for receipt type "${receiptType}" in order:`, order.orderNumber);
    return null;
  }

  // Oblicz subtotal dla tej części
  const partialSubtotal = filteredItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  // Koszt wysyłki: przy SPLIT, dolicz do akcesoriów (pierwsza paczka).
  // Przy COMBINED lub STANDARD - dolicz normalnie.
  let partialShippingCost = 0;
  if (receiptType === 'full') {
    partialShippingCost = Number(order.shippingCost);
  } else if (receiptType === 'accessories') {
    // Akcesoria idą jako pierwsza paczka - doliczamy wysyłkę
    partialShippingCost = Number(order.shippingCost);
  }
  // Ciuchy (druga paczka) - brak dodatkowej opłaty za wysyłkę

  const partialTotal = partialSubtotal + partialShippingCost;

  // Suffix do numeru paragonu
  const orderNumberSuffix = receiptType === 'full' ? '' : `-${receiptType.toUpperCase().slice(0, 3)}`;

  const invoice = await createInvoice({
    orderId: order.id,
    orderNumber: `${order.orderNumber}${orderNumberSuffix}`,
    customerEmail: order.user?.email || order.guestEmail || 'guest@acroclinic.pl',
    customerFirstName: order.shippingFirstName,
    customerLastName: order.shippingLastName,
    customerPhone: order.shippingPhone || undefined,
    companyName: order.billingCompanyName,
    nip: order.billingNip,
    street: order.billingStreet || order.shippingStreet,
    city: order.billingCity || order.shippingCity,
    postalCode: order.billingPostalCode || order.shippingPostalCode,
    country: order.shippingCountry || 'Polska',
    items: filteredItems.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: Number(item.price),
      size: (item as any).size || null,
    })),
    shippingCost: partialShippingCost,
    total: partialTotal,
    paymentMethod: order.paymentMethod || 'ONLINE',
    paidAt: order.paidAt || new Date(),
  });

  // Zaktualizuj receipt w bazie
  if (invoice) {
    await prisma.receipt.update({
      where: { id: receipt.id },
      data: {
        invoiceNumber: invoice.number,
        invoiceId: invoice.id.toString(),
        invoiceUrl: invoice.pdf_url,
        status: 'ISSUED',
      },
    });
  }

  return invoice;
}

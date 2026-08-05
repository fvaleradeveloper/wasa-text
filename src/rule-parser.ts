export interface ParsedTransaction {
  id: string;
  date: string;
  customerName: string;
  contact: string;
  details: string;
  quantity: number;
  amount: number;
  paymentMethod: string;
  status: "Pagado" | "Pendiente" | "Cancelado";
  originalText: string;
}

export interface ParseSummary {
  totalRevenue: number;
  totalOrders: number;
  paidCount: number;
  pendingCount: number;
  topProducts: string[];
}

export interface ParseResult {
  summary: ParseSummary;
  items: ParsedTransaction[];
}

// Patrones de fecha para América Latina
const DATE_PATTERNS = [
  /\[(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/,
  /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/,
  /\[(\d{1,2}\s+de\s+\w+\s+de?\s+\d{2,4})/i,
];

// Patrones de monto en monedas latinoamericanas
const AMOUNT_PATTERNS = [
  /S\/\s*(\d+(?:\.\d+)?)/, // Soles peruanos
  /\$\s*(\d+(?:\.\d+)?)/, // Pesos/dólares general
  /(\d+(?:\.\d+)?)\s*(?:soles|pesos|dólares|dolares)/i,
  /(?:precio|costo|total|son|importe|monto|valor)[:\s]+[$\s]*(\d+(?:\.\d+)?)/i,
  /(\d+(?:\.\d+)?)\s*(?:s\/|\$|usd|ars|clp|cop|vef|bob|pyg|uyu|gtq)/i,
];

// Patrones de métodos de pago comunes en LATAM
const PAYMENT_METHODS = [
  /yape/i,
  /plin/i,
  /transferencia/i,
  /efectivo/i,
  /mercado\s*pago/i,
  /paypal/i,
  /tarjeta/i,
  /cheque/i,
  /depósito/i,
  /deposito/i,
  /zelle/i,
  /pago\s+móvil/i,
  /pago\s+movil/i,
];

// Patrones de estado
const STATUS_PATTERNS = [
  /pagado/i,
  /cancelado/i,
  /anulado/i,
  /pendiente/i,
  /por\s+cobrar/i,
  /por\s+pagar/i,
  /confirmado/i,
];

// Palabras clave para filtrar líneas relevantes
const RELEVANT_KEYWORDS = [
  /pedido/i,
  /orden/i,
  /compra/i,
  /venta/i,
  /precio/i,
  /costo/i,
  /total/i,
  /pago/i,
  /cobro/i,
  /transfer/i,
  /yape/i,
  /plin/i,
  /s\/\s*\d/,
  /\$\s*\d/,
  /\d+\s*(?:soles|pesos|dólares)/i,
];

function extractDate(text: string): string {
  for (const pattern of DATE_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      return match[1] || match[0];
    }
  }
  return new Date().toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function extractAmount(text: string): number {
  for (const pattern of AMOUNT_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      const amount = parseFloat(match[1] || match[0]);
      if (!isNaN(amount) && amount > 0) {
        return amount;
      }
    }
  }
  return 0;
}

function extractPaymentMethod(text: string): string {
  for (const pattern of PAYMENT_METHODS) {
    const match = text.match(pattern);
    if (match) {
      return match[0].charAt(0).toUpperCase() + match[0].slice(1).toLowerCase();
    }
  }
  return "N/A";
}

function extractStatus(text: string): "Pagado" | "Pendiente" | "Cancelado" {
  const lowerText = text.toLowerCase();
  
  if (/cancelado|anulado/.test(lowerText)) {
    return "Cancelado";
  }
  if (/pagado|confirmado|ya\s+hice|listo|realizado/.test(lowerText)) {
    return "Pagado";
  }
  if (/pendiente|por\s+cobrar|por\s+pagar|falta|esperando/.test(lowerText)) {
    return "Pendiente";
  }
  
  // Default: si hay monto y método de pago, asumir pendiente
  const hasAmount = extractAmount(text) > 0;
  const hasPaymentMethod = extractPaymentMethod(text) !== "N/A";
  
  if (hasAmount && hasPaymentMethod) {
    return "Pendiente";
  }
  
  return "Pendiente";
}

function extractCustomerName(text: string): string {
  // Remover la fecha del inicio: [dd/mm/yyyy hh:mm:ss] o [dd de mes de yyyy]
  let cleaned = text.replace(/^\[?\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}[\s\d:]*[\]\s]*/, "");
  cleaned = cleaned.replace(/^\[?\d{1,2}\s+de\s+\w+.*?\]\s*/, "");
  
  // Buscar patrones de nombre: "Nombre:" o "Nombre -" al inicio
  const nameMatch = cleaned.match(/^([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*)\s*[:\-]/);
  if (nameMatch) {
    return nameMatch[1];
  }
  
  // Si no hay patrón claro, tomar las primeras palabras antes de dos puntos o guión
  const parts = cleaned.split(/[:\-]/);
  if (parts.length > 0) {
    const firstPart = parts[0].trim();
    const words = firstPart.split(/\s+/).slice(0, 3);
    return words.join(" ");
  }
  
  return "Cliente";
}

function extractContact(text: string): string {
  // Buscar números de teléfono en formatos latinoamericanos
  const phonePatterns = [
    /(\+?\d{1,3}[\s\-]?\d{3,4}[\s\-]?\d{3,4}[\s\-]?\d{0,4})/,
    /(\d{3,4}[\s\-]?\d{3,4}[\s\-]?\d{3,4})/,
  ];
  
  for (const pattern of phonePatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return "";
}

function extractDetails(text: string, amount: number): string {
  // Remover fecha y nombre para obtener el texto restante como detalles
  let details = text;
  
  // Remover fecha incluyendo la hora: [dd/mm/yyyy hh:mm:ss]
  details = details.replace(/^\[?\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}[\s\d:]*[\]\s]*/, "");
  details = details.replace(/^\[?\d{1,2}\s+de\s+\w+.*?\]\s*/, "");
  
  // Remover nombre
  details = details.replace(/^([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*)\s*[:\-]?\s*/, "");
  
  // Limpiar espacios extra
  details = details.replace(/\s+/g, " ").trim();
  details = details.replace(/^[:\-]\s*/, "");
  
  // Si está vacío o muy corto, usar el texto original sin fecha ni nombre
  if (!details || details.length < 3) {
    let fallback = text.replace(/^\[?\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}[\s\d:]*[\]\s]*/, "").trim();
    fallback = fallback.replace(/^([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*)\s*[:\-]?\s*/, "").trim();
    return fallback || text.trim();
  }
  
  return details;
}

function isRelevantLine(text: string): boolean {
  const lowerText = text.toLowerCase();
  
  // Si tiene monto, es relevante
  if (extractAmount(text) > 0) return true;
  
  // Si tiene palabras clave
  for (const pattern of RELEVANT_KEYWORDS) {
    if (pattern.test(lowerText)) {
      return true;
    }
  }
  
  return false;
}

export function parseChatWithRules(chatText: string, category: string): ParseResult {
  const lines = chatText.split("\n").filter((line) => line.trim().length > 0);
  const items: ParsedTransaction[] = [];
  const productsSet = new Set<string>();
  
  let totalRevenue = 0;
  let paidCount = 0;
  let pendingCount = 0;
  let idCounter = 1;
  
  // Detectar el nombre del dueño del negocio (quien envía mensajes como confirmaciones)
  const ownerName = detectOwnerName(lines);
  
  for (const line of lines) {
    if (!isRelevantLine(line)) {
      continue;
    }
    
    const amount = extractAmount(line);
    const date = extractDate(line);
    const customerName = extractCustomerName(line);
    const contact = extractContact(line);
    const paymentMethod = extractPaymentMethod(line);
    const status = extractStatus(line);
    const details = extractDetails(line, amount);
    
    // Solo agregar si tiene monto o es una línea relevante
    if (amount > 0 || status !== "Pendiente") {
      const item: ParsedTransaction = {
        id: `TX-${String(idCounter).padStart(3, "0")}`,
        date,
        customerName,
        contact,
        details: details || line.trim(),
        quantity: 1,
        amount,
        paymentMethod,
        status,
        originalText: line.trim(),
      };
      
      items.push(item);
      idCounter++;
      
      // Actualizar contadores
      if (amount > 0) {
        totalRevenue += amount;
      }
      
      if (status === "Pagado") {
        paidCount++;
      } else if (status === "Pendiente") {
        pendingCount++;
      }
      
      // Extraer productos/servicios mencionados
      const productWords = details.split(/\s+/).filter((word) => 
        word.length > 3 && 
        !/^(para|con|sin|desde|hasta|sobre|entre|por|del|la|el|los|las|un|una|que|son|tiene|hace|vale|ok|si|no|gracias|hola|buenas|buenos|dias|dia|tarde|noche|ya|hice|listo|realizado|confirmado|pendiente|cancelado|anulado|pagar|cobrar|transferencia|yape|plin|efectivo|mercado|pago|movil|zelle|paypal|tarjeta|cheque|deposito)$/i.test(word)
      );
      
      if (productWords.length > 0) {
        productsSet.add(productWords[0].toLowerCase());
      }
    }
  }
  
  const summary: ParseSummary = {
    totalRevenue,
    totalOrders: items.length,
    paidCount,
    pendingCount,
    topProducts: Array.from(productsSet).slice(0, 5),
  };
  
  return {
    summary,
    items,
  };
}

function detectOwnerName(lines: string[]): string {
  // Detectar el nombre del dueño del negocio analizando los mensajes
  // El dueño suele ser quien envía mensajes de confirmación o cierre
  const nameCounts = new Map<string, number>();
  
  for (const line of lines) {
    const cleaned = line.replace(/^\[?\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}[\s\d:]*[\]\s]*/, "");
    const nameMatch = cleaned.match(/^([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*)\s*[:\-]/);
    
    if (nameMatch) {
      const name = nameMatch[1];
      // Contar ocurrencias de cada nombre
      nameCounts.set(name, (nameCounts.get(name) || 0) + 1);
    }
  }
  
  // El dueño suele ser el que más mensajes envía
  let maxCount = 0;
  let ownerName = "";
  for (const [name, count] of nameCounts.entries()) {
    if (count > maxCount) {
      maxCount = count;
      ownerName = name;
    }
  }
  
  return ownerName;
}

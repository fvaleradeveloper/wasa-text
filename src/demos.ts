import { DemoConfig } from "./types";

export const DEMO_CHATS: DemoConfig[] = [
  {
    id: "pasteleria",
    title: "Pastelería Artesanal",
    owner: "Maria G.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    category: "pasteleria",
    badge: "Pastelería",
    description: "Ideal para tortas personalizadas, cupcakes y bocaditos con pagos por adelantado o contra entrega.",
    chatText: `[05/07/2026 14:15:22] Carlos: Hola Maria, buenas tardes. Quería consultar por una torta para el cumpleaños de mi hija.
[05/07/2026 14:17:01] Maria G.: ¡Hola Carlos! Claro que sí. ¿De qué sabor te gustaría y para cuántas personas?
[05/07/2026 14:18:40] Carlos: De chocolate con dulce de leche, para unas 15 personas. ¿Cuánto saldría?
[05/07/2026 14:19:55] Maria G.: Excelente. Torta de chocolate mediana para 15 personas está 65 soles. ¿Para qué día la deseas?
[05/07/2026 14:21:10] Carlos: Para este sábado 11 de julio por favor. Sepárala de una vez. Mi número es 987654321, soy Carlos Mendoza.
[05/07/2026 14:22:30] Maria G.: Listo Carlos Mendoza, reservado. Serían 65 soles. Me confirmas cuando hagas el Yape.
[05/07/2026 14:25:12] Carlos: Ya te yapeé los 65 soles. Aquí tienes la captura.
[05/07/2026 14:26:00] Maria G.: Recibido, muchas gracias. Pago confirmado.

[05/07/2026 16:10:45] Sofia: Hola, buenas, vi tus cupcakes en Instagram. ¿Haces entregas en Miraflores?
[05/07/2026 16:12:15] Maria G.: Hola Sofia, sí hacemos delivery. La docena de cupcakes de vainilla está a 40 soles. El delivery es 10 soles adicionales.
[05/07/2026 16:14:00] Sofia: Genial, apúntame una docena para el viernes por la mañana por favor. Dirección Calle Las Lilas 123.
[05/07/2026 16:15:30] Maria G.: Perfecto, anotado. Sofía - 1 docena cupcakes vainilla + delivery = 50 soles en total. Queda pendiente el pago contra entrega o Yape previo.
[05/07/2026 16:16:10] Sofia: Ok, te hago Yape el jueves por la noche sin falta. ¡Gracias!`,
    demoResult: {
      summary: {
        totalRevenue: 115,
        totalOrders: 2,
        paidCount: 1,
        pendingCount: 1,
        topProducts: ["Torta de chocolate mediana", "Cupcakes de vainilla"],
      },
      items: [
        {
          id: "001",
          date: "05/07/2026",
          customerName: "Carlos Mendoza",
          contact: "987654321",
          details: "Torta de chocolate con dulce de leche mediana (15 personas)",
          quantity: 1,
          amount: 65,
          paymentMethod: "Yape",
          status: "Pagado",
          originalText: "[05/07/2026 14:25:12] Carlos: Ya te yapeé los 65 soles. Aquí tienes la captura.",
        },
        {
          id: "002",
          date: "05/07/2026",
          customerName: "Sofía",
          contact: "N/A",
          details: "1 docena cupcakes de vainilla + delivery a Miraflores",
          quantity: 1,
          amount: 50,
          paymentMethod: "Yape",
          status: "Pendiente",
          originalText: "[05/07/2026 16:15:30] Maria G.: Perfecto, anotado. Sofía - 1 docena cupcakes vainilla + delivery = 50 soles en total. Queda pendiente el pago contra entrega o Yape previo.",
        },
      ],
    },
  },
  {
    id: "freelance",
    title: "Servicios Creativos & Freelance",
    owner: "Juan P.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    category: "freelance",
    badge: "Diseño & Desarrollo",
    description: "Ideal para consultorías, desarrollo de software, diseño web o logos cobrados en cuotas.",
    chatText: `[02/07/2026 09:30:11] Roberto Cruz: Hola Juan, ¿cómo estás? Quería saber si ya tienes listo el primer entregable del diseño de la web.
[02/07/2026 09:35:20] Juan P.: Hola Roberto, sí, justo acabo de enviarte los mockups por correo. La segunda cuota de la asesoría de branding y web es de 350 USD.
[02/07/2026 09:37:45] Roberto Cruz: Buenísimo el diseño, me encanta. Te acabo de hacer la transferencia bancaria de los 350 USD por los mockups. Confírmame.
[02/07/2026 09:40:00] Juan P.: Transferencia recibida. Gracias Roberto, pago confirmado. Seguimos con el desarrollo.

[03/07/2026 11:15:33] Laura Gomez: Hola Juan, cotízame un logo para mi marca de ropa por favor.
[03/07/2026 11:18:12] Juan P.: Hola Laura, un diseño de logotipo profesional está 150 USD, incluye 3 propuestas y manual de marca básico.
[03/07/2026 11:20:00] Laura Gomez: Me parece genial, me apunto. Empecemos el lunes. ¿Cómo hacemos con el pago?
[03/07/2026 11:21:45] Juan P.: Reservamos con el 50% de adelanto (75 USD). Queda pendiente la mitad restante.
[03/07/2026 11:22:10] Laura Gomez: Perfecto, mañana te transfiero los 75 USD de adelanto.`,
    demoResult: {
      summary: {
        totalRevenue: 350,
        totalOrders: 2,
        paidCount: 1,
        pendingCount: 1,
        topProducts: ["Asesoría branding y web", "Diseño de logo profesional"],
      },
      items: [
        {
          id: "001",
          date: "02/07/2026",
          customerName: "Roberto Cruz",
          contact: "N/A",
          details: "Mockups diseño web - Asesoría branding y web (segunda cuota)",
          quantity: 1,
          amount: 350,
          paymentMethod: "Transferencia bancaria",
          status: "Pagado",
          originalText: "[02/07/2026 09:40:00] Juan P.: Transferencia recibida. Gracias Roberto, pago confirmado. Seguimos con el desarrollo.",
        },
        {
          id: "002",
          date: "03/07/2026",
          customerName: "Laura Gomez",
          contact: "N/A",
          details: "Diseño de logotipo profesional (3 propuestas + manual de marca básico)",
          quantity: 1,
          amount: 150,
          paymentMethod: "Transferencia bancaria",
          status: "Pendiente",
          originalText: "[03/07/2026 11:21:45] Juan P.: Reservamos con el 50% de adelanto (75 USD). Queda pendiente la mitad restante.",
        },
      ],
    },
  },
  {
    id: "tienda_ropa",
    title: "Venta Minorista / Boutique",
    owner: "Ana R.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    category: "ropa",
    badge: "Tienda de Moda",
    description: "Ideal para ropa, accesorios o calzado, registrando separación de prendas, tallas y envíos por Yape.",
    chatText: `[06/07/2026 10:05:00] Andrea S.: Hola Ana, una consulta, ¿tienes stock de la casaca denim verde en talla M?
[06/07/2026 10:06:15] Ana R.: Hola Andrea, sí nos queda la última en verde M! Está de oferta a 120 soles.
[06/07/2026 10:07:30] Andrea S.: ¡Sepáramela por favor! Mi nombre es Andrea Silva. ¿Me la puedes enviar a San Isidro?
[06/07/2026 10:08:50] Ana R.: Claro, el envío es 10 soles más. Total sería 130 soles Andrea Silva. ¿Pagas con Yape o Transferencia?
[06/07/2026 10:09:40] Andrea S.: Te hago Yape de 130 soles en este momento. Dame un segundo.
[06/07/2026 10:11:12] Andrea S.: Listo, yapeado los 130. Me avisas cuando lo envíes porfa.
[06/07/2026 10:12:00] Ana R.: Pago recibido Andrea, gracias. Mañana a primera hora sale tu casaca.

[06/07/2026 11:30:10] Mateo: Hola, quería saber el precio del jean negro clásico talla 32.
[06/07/2026 11:32:45] Ana R.: Hola Mateo, el jean clásico negro está en 95 soles. Sí tenemos en talla 32.
[06/07/2026 11:34:00] Mateo: Excelente, sepárame uno para recogerlo hoy en tu tienda por favor. Pago en efectivo al recoger.
[06/07/2026 11:35:10] Ana R.: Perfecto Mateo, jean clásico negro reservado en tienda (95 soles). Queda pendiente de pago en efectivo. ¡Te espero!`,
    demoResult: {
      summary: {
        totalRevenue: 225,
        totalOrders: 2,
        paidCount: 1,
        pendingCount: 1,
        topProducts: ["Casaca denim verde talla M", "Jean clásico negro talla 32"],
      },
      items: [
        {
          id: "001",
          date: "06/07/2026",
          customerName: "Andrea Silva",
          contact: "N/A",
          details: "Casaca denim verde talla M + envío a San Isidro",
          quantity: 1,
          amount: 130,
          paymentMethod: "Yape",
          status: "Pagado",
          originalText: "[06/07/2026 10:12:00] Ana R.: Pago recibido Andrea, gracias. Mañana a primera hora sale tu casaca.",
        },
        {
          id: "002",
          date: "06/07/2026",
          customerName: "Mateo",
          contact: "N/A",
          details: "Jean clásico negro talla 32 (recoger en tienda)",
          quantity: 1,
          amount: 95,
          paymentMethod: "Efectivo",
          status: "Pendiente",
          originalText: "[06/07/2026 11:35:10] Ana R.: Perfecto Mateo, jean clásico negro reservado en tienda (95 soles). Queda pendiente de pago en efectivo. ¡Te espero!",
        },
      ],
    },
  },
];
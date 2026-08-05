<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# WhatsApp Chat Parser

Aplicación para extraer y organizar transacciones de chats de WhatsApp usando **Groq IA**. Extracción inteligente de pedidos, montos, clientes y estados de pago. Compatible con formatos de toda América Latina.

## Características

- 🤖 IA avanzada con Groq (Llama 3.3 70B) para extracción inteligente
- 📊 Extracción automática de transacciones de chats de WhatsApp
- 🌎 Compatible con formatos de toda América Latina (Chile, Argentina, Perú, Bolivia, Paraguay, Uruguay, Colombia, Venezuela, Guatemala, etc.)
- 💰 Cálculo de resúmenes financieros (ingresos totales, pedidos, pagados, pendientes)
- 🎨 Interfaz intuitiva y fácil de usar
- ⚡ Rápido y gratuito con tier gratuito de Groq

## Ejecutar Localmente

### Prerrequisitos
- Node.js (v18 o superior)
- npm o yarn

### Instalación

1. Clona el repositorio:
   ```bash
   git clone <tu-repositorio>
   cd <nombre-del-proyecto>
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura Groq IA (requerido):
   
   ```bash
   # Copia el archivo de ejemplo
   cp .env.example .env
   
   # Edita .env con tu API key de Groq
   # 1. Crea una cuenta gratuita en https://console.groq.com/keys
   # 2. Obtén tu API key
   GROQ_API_KEY=gsk_tu_api_key_de_groq
   GROQ_MODEL=llama-3.3-70b-versatile
   ```

4. Configura las notificaciones por email (opcional):
   
   ```bash
   # Edita .env con tu API key de Resend para recibir notificaciones
   # 1. Crea una cuenta en https://resend.com
   # 2. Obtén tu API key en el dashboard
   RESEND_API_KEY=tu_api_key_de_resend
   ```

4. Ejecuta la aplicación:
   ```bash
   npm run dev
   ```

5. Abre tu navegador en `http://localhost:3000`

## Uso

1. **Selecciona un ejemplo** o pega tu propio chat de WhatsApp
2. Haz clic en **"Analizar Chat"**
3. Revisa el resumen y la tabla de transacciones extraídas

**Nota:** La configuración de la IA se realiza exclusivamente a través del archivo `.env`. No hay interfaz de configuración en el frontend.

## Estructura del Proyecto

```
.
├── server.ts                 # Servidor Express con API de parsing
├── src/
│   ├── ai-service.ts        # Servicio multi-proveedor de IA
│   ├── App.tsx              # Componente principal de React
│   ├── main.tsx             # Punto de entrada de React
│   ├── types.ts             # Tipos TypeScript
│   ├── demos.ts             # Chats de ejemplo
│   └── index.css            # Estilos globales
├── .env.example             # Ejemplo de configuración
└── package.json
```

## API

### POST /api/parse-chat

Parsea un chat de WhatsApp y extrae transacciones.

**Request:**
```json
{
  "chatText": "texto del chat de WhatsApp",
  "category": "pasteleria",
  "aiConfig": {
    "provider": "openai",
    "apiKey": "tu-api-key",
    "model": "gpt-4o-mini"
  }
}
```

**Response:**
```json
{
  "summary": {
    "totalRevenue": 150,
    "totalOrders": 3,
    "paidCount": 2,
    "pendingCount": 1,
    "topProducts": ["torta", "cupcakes"]
  },
  "items": [
    {
      "id": "1",
      "date": "05/07/2026",
      "customerName": "Carlos Mendoza",
      "contact": "987654321",
      "details": "Torta de chocolate mediana para 15 personas",
      "quantity": 1,
      "amount": 65,
      "paymentMethod": "Yape",
      "status": "Pagado",
      "originalText": "[05/07/2026 14:15:22] Carlos: ..."
    }
  ]
}
```

## Despliegue

### Vercel / Netlify / Railway

1. Conecta tu repositorio
2. Configura las variables de entorno en la plataforma:
   - `GROQ_API_KEY=tu_api_key_de_groq` (requerido)
   - `GROQ_MODEL=llama-3.3-70b-versatile` (opcional, por defecto usa este modelo)
   - `RESEND_API_KEY=tu_api_key_de_resend` (opcional, para notificaciones)
3. Despliega

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Notas de Seguridad

- ⚠️ **Nunca** compartas tu API key
- 🔒 Las API keys se envían directamente al proveedor de IA
- 💾 No se almacenan API keys en la base de datos
- 🌐 Para mayor seguridad, configura las variables de entorno en el servidor

## Solución de Problemas

### Error: "API key no configurada"
- Asegúrate de haber configurado `AI_API_KEY` en `.env.local` o en la interfaz

### Error: "Modelo no encontrado"
- Verifica que el nombre del modelo sea correcto para tu proveedor
- Consulta la documentación de tu proveedor para ver los modelos disponibles

### Error de CORS
- Asegúrate de que tu API personalizada permita solicitudes desde tu dominio

## Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Licencia

MIT

## Soporte

Si tienes preguntas o problemas, por favor abre un issue en el repositorio.

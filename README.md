<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# WhatsApp Chat Parser con IA

Aplicación para extraer y organizar transacciones de chats de WhatsApp usando Inteligencia Artificial. Soporta múltiples proveedores de IA: Groq, OpenAI, Anthropic, Google Gemini, y cualquier API compatible con OpenAI.

## Características

- 🤖 Soporte múltiple de proveedores de IA (Groq, OpenAI, Anthropic, Google Gemini, Custom)
- 📊 Extracción automática de transacciones de chats de WhatsApp
- 💰 Cálculo de resúmenes financieros (ingresos totales, pedidos, pagados, pendientes)
- 🎨 Interfaz intuitiva y fácil de usar
- 🔒 Las API keys se envían directamente al proveedor, no se almacenan en servidores

## Proveedores de IA Soportados

### 1. Groq (IA Cloud Gratuita - Recomendado)
- Modelos: Llama 3.3 70B Versatile, Llama 3.1 8B Instant, etc.
- Obtén tu API key en: [GroqCloud](https://console.groq.com/keys)
- Endpoint: `https://api.groq.com/openai/v1`

### 2. Google Gemini
- Modelos: Gemini 2.0 Flash, Gemini 1.5 Pro, etc.
- Obtén tu API key en: [Google AI Studio](https://aistudio.google.com/app/apikey)

### 3. OpenAI
- Modelos: GPT-4o, GPT-4o-mini, GPT-4-turbo, etc.
- Obtén tu API key en: [OpenAI Platform](https://platform.openai.com/api-keys)

### 4. Anthropic
- Modelos: Claude 3.5 Sonnet, Claude 3.5 Haiku, Claude 3 Opus, etc.
- Obtén tu API key en: [Anthropic Console](https://console.anthropic.com/)

### 5. API Personalizada
- Cualquier API compatible con OpenAI (Ollama, LM Studio, OpenRouter, etc.)
- Solo necesitas la URL base de la API

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

3. Configura tu API key en el archivo `.env`:
   
   ```bash
   # Copia el archivo de ejemplo
   cp .env.example .env
   
   # Edita .env con tu configuración
   # Para Groq (recomendado):
   AI_PROVIDER=groq
   GROQ_API_KEY=tu_api_key_de_groq
   GROQ_MODEL=llama-3.3-70b-versatile
   
   # Para Google Gemini:
   # AI_PROVIDER=google
   # AI_API_KEY=tu_api_key_de_gemini
   
   # Para OpenAI:
   # AI_PROVIDER=openai
   # AI_API_KEY=tu_api_key_de_openai
   # AI_MODEL=gpt-4o-mini
   
   # Para Anthropic:
   # AI_PROVIDER=anthropic
   # AI_API_KEY=tu_api_key_de_anthropic
   # AI_MODEL=claude-3-5-haiku-20241022
   
   # Para API personalizada:
   # AI_PROVIDER=custom
   # AI_API_KEY=tu_api_key
   # AI_MODEL=nombre_del_modelo
   # AI_BASE_URL=https://api.tu-servicio.com/v1
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
   - `AI_PROVIDER=groq`
   - `GROQ_API_KEY=tu_api_key_de_groq`
   - `GROQ_MODEL=llama-3.3-70b-versatile`
   - (O las variables correspondientes a tu proveedor)
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

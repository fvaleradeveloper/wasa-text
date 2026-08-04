# Guía de Deployment

Esta guía te ayudará a desplegar Wasa-Text en GitHub y Vercel.

## 📋 Prerrequisitos

- Cuenta de GitHub
- Cuenta de Vercel
- Git instalado localmente

## 🚀 Paso 1: Inicializar Git y Subir a GitHub

### 1.1 Inicializar repositorio Git

```bash
# En la raíz del proyecto
git init
git add .
git commit -m "Initial commit: Wasa-Text - WhatsApp Chat Parser with AI"
```

### 1.2 Crear repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre del repositorio: `wasa-text`
3. Descripción: `Extrae y organiza transacciones de WhatsApp con IA`
4. Selecciona "Private" o "Public" según tu preferencia
5. NO inicialices con README, .gitignore o licencia (ya los tenemos)
6. Click en "Create repository"

### 1.3 Conectar y subir el código

```bash
# Reemplaza <tu-usuario> con tu username de GitHub
git remote add origin https://github.com/<tu-usuario>/wasa-text.git
git branch -M main
git push -u origin main
```

## 🌐 Paso 2: Desplegar en Vercel

### 2.1 Opción A: Deploy Automático desde GitHub (Recomendado)

1. Ve a https://vercel.com/new
2. Importa el repositorio `wasa-text` desde GitHub
3. Configura las variables de entorno:
   - `AI_PROVIDER` = `groq`
   - `GROQ_API_KEY` = `tu-api-key-de-groq`
   - `GROQ_MODEL` = `llama-3.3-70b-versatile`
4. Click en "Deploy"

### 2.2 Opción B: Deploy con Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Para producción
vercel --prod
```

## ⚙️ Variables de Entorno en Vercel

Configura estas variables en Vercel (Settings > Environment Variables):

```env
AI_PROVIDER=groq
GROQ_API_KEY=tu_api_key_de_groq
GROQ_MODEL=llama-3.3-70b-versatile
NODE_ENV=production
```

## 📊 Base de Datos SQLite

### Nota importante sobre Vercel:
- Vercel usa un sistema de archivos **efímero**
- La base de datos SQLite se almacena en `/tmp/emails.db`
- Los datos se **pierden** en cada deployment
- Para producción, considera usar:
  - **Vercel KV** (Redis) - Gratis hasta 30k requests
  - **Supabase** (PostgreSQL) - Gratis hasta 500MB
  - **PlanetScale** (MySQL) - Gratis hasta 5GB

### Para testing local:
```bash
# Los emails se guardan en ./data/emails.db
# Este archivo está en .gitignore y NO se sube a GitHub
```

## 🔧 Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Build para producción
npm run build

# Preview de producción local
npm run preview

# Iniciar en producción
npm start
```

## ✅ Verificación Post-Deployment

1. Abre tu dominio de Vercel (ej: https://wasa-text.vercel.app)
2. Prueba el formulario de email:
   - Ingresa un email de prueba
   - Verifica que se guarde correctamente
3. Prueba el parser de WhatsApp:
   - Selecciona un ejemplo
   - Haz clic en "Analizar Chat"
   - Verifica que extraiga las transacciones

## 🐛 Troubleshooting

### Error: "API key no configurada"
- Verifica que las variables de entorno estén configuradas en Vercel
- Asegúrate de haber hecho redeploy después de agregar las variables

### Error: "Cannot find module 'sql.js'"
- Ejecuta `npm install` antes de hacer deploy
- Verifica que package.json incluya sql.js en dependencies

### La base de datos no persiste
- Esto es normal en Vercel (sistema efímero)
- Para producción, migra a Vercel KV o Supabase

## 📝 Próximos Pasos

1. **Dominio personalizado**: Configura tu dominio en Vercel
2. **Analytics**: Agrega Vercel Analytics o Google Analytics
3. **Backup de emails**: Exporta los emails regularmente
4. **Mejora la UI**: Considera agregar más ejemplos y casos de uso
5. **Marketing**: Comparte en redes sociales y comunidades de emprendedores

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs en Vercel (Deployments > Logs)
2. Verifica la consola del navegador (F12)
3. Asegúrate de que todas las variables de entorno estén configuradas
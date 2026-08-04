import express from "express";
import path from "path";
import dotenv from "dotenv";
import { saveEmailSignup, getEmailSignupCount, getAllEmailSignups } from "./src/email-service.js";
import { sendNewSignupNotification } from "./src/notification-service.js";
import { parseChatWithRules } from "./src/rule-parser.js";

// Load environment variables
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const PORT = 3000;

async function createApp() {
  const app = express();
  
  // Error handling middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Server error:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  });
  
  app.use(express.json({ limit: "10mb" }));
  
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Wasa-Text API is running" });
  });

  // API endpoint to save email signup
  app.post("/api/email-signup", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email || !email.trim()) {
        res.status(400).json({ error: "El email es requerido" });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({ error: "Email inválido" });
        return;
      }

      const signup = await saveEmailSignup(email.trim().toLowerCase());
      const count = await getEmailSignupCount();

      // Send notification email to the owner (fvalera.developer@gmail.com)
      sendNewSignupNotification({
        email: signup.email,
        totalSignups: count,
        createdAt: signup.createdAt.toISOString(),
      }).catch(err => console.error("Background notification error:", err));

      res.json({ 
        success: true, 
        message: "¡Gracias! Te notificaremos cuando Wasa-Text esté listo.",
        signup,
        totalSignups: count
      });
    } catch (error: any) {
      console.error("Error saving email:", error);
      res.status(500).json({ error: error.message || "Error al guardar el email" });
    }
  });

  // API endpoint to get email count
  app.get("/api/email-count", async (req, res) => {
    try {
      const count = await getEmailSignupCount();
      res.json({ count });
    } catch (error: any) {
      console.error("Error getting email count:", error);
      res.status(500).json({ error: "Error al obtener el conteo" });
    }
  });

  // API endpoint to get all email signups (protected)
  app.get("/api/email-signups", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const adminToken = process.env.ADMIN_TOKEN || "wasatext-admin-2024";

      if (!authHeader || authHeader !== `Bearer ${adminToken}`) {
        res.status(401).json({ error: "No autorizado" });
        return;
      }

      const signups = await getAllEmailSignups();
      res.json({ signups });
    } catch (error: any) {
      console.error("Error getting email signups:", error);
      res.status(500).json({ error: "Error al obtener los registros" });
    }
  });

  // API endpoint to parse the WhatsApp chat text
  app.post("/api/parse-chat", async (req, res) => {
    try {
      const { chatText, category } = req.body;

      if (!chatText) {
        res.status(400).json({ error: "El contenido del chat es requerido." });
        return;
      }

      // Use rule-based parser (no AI required)
      const result = parseChatWithRules(chatText, category || "General");

      res.json(result);
    } catch (error: any) {
      console.error("Error al procesar el chat:", error);
      res.status(500).json({ error: error.message || "Error interno del servidor al procesar el chat." });
    }
  });

  // Admin page
  app.get("/admin", (req, res) => {
    const adminToken = process.env.ADMIN_TOKEN || "wasatext-admin-2024";
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin - Wasa-Text</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen">
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div class="flex items-center gap-2 mb-6">
        <div class="w-8 h-8 bg-[#1F2E28] rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-[#1F2E28]">Admin - Wasa-Text</h1>
      </div>

      <div id="login-form" class="max-w-md mx-auto">
        <label class="block text-sm font-medium text-gray-700 mb-2">Contraseña de administrador</label>
        <div class="flex gap-2">
          <input type="password" id="password-input" placeholder="Ingresa la contraseña" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F2E28] focus:border-transparent">
          <button onclick="login()" class="px-6 py-2 bg-[#1F2E28] text-white rounded-lg hover:bg-[#2d3f36] transition-colors">Ingresar</button>
        </div>
        <p id="login-error" class="text-red-600 text-sm mt-2 hidden">Contraseña incorrecta</p>
      </div>

      <div id="admin-panel" class="hidden">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-[#1F2E28]">
            Suscriptores: <span id="total-count" class="text-2xl font-bold">0</span>
          </h2>
          <button onclick="logout()" class="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">Cerrar sesión</button>
        </div>
        
        <div id="loading" class="text-center py-8 text-gray-500">Cargando...</div>
        
        <div id="empty-state" class="hidden text-center py-12">
          <p class="text-gray-500 text-lg">Aún no hay suscriptores.</p>
        </div>

        <div id="table-container" class="hidden overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">#</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Fecha de registro</th>
              </tr>
            </thead>
            <tbody id="signups-table-body" class="bg-white divide-y divide-gray-200">
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <script>
    const TOKEN = "${adminToken}";

    function login() {
      const input = document.getElementById('password-input');
      const error = document.getElementById('login-error');
      if (input.value === TOKEN) {
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('admin-panel').classList.remove('hidden');
        error.classList.add('hidden');
        loadSignups();
      } else {
        error.classList.remove('hidden');
      }
    }

    function logout() {
      document.getElementById('login-form').classList.remove('hidden');
      document.getElementById('admin-panel').classList.add('hidden');
      document.getElementById('password-input').value = '';
    }

    async function loadSignups() {
      document.getElementById('loading').classList.remove('hidden');
      document.getElementById('empty-state').classList.add('hidden');
      document.getElementById('table-container').classList.add('hidden');

      try {
        const res = await fetch('/api/email-signups', {
          headers: { 'Authorization': 'Bearer ' + TOKEN }
        });
        const data = await res.json();
        
        document.getElementById('loading').classList.add('hidden');

        if (!data.signups || data.signups.length === 0) {
          document.getElementById('empty-state').classList.remove('hidden');
          return;
        }

        document.getElementById('total-count').textContent = data.signups.length;
        document.getElementById('table-container').classList.remove('hidden');
        
        const tbody = document.getElementById('signups-table-body');
        tbody.innerHTML = data.signups.map((s, i) => 
          '<tr class="hover:bg-gray-50">' +
            '<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">' + (i + 1) + '</td>' +
            '<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">' + s.email + '</td>' +
            '<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">' + new Date(s.createdAt).toLocaleString('es-PE') + '</td>' +
          '</tr>'
        ).join('');
      } catch (err) {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('empty-state').classList.remove('hidden');
        document.getElementById('empty-state').innerHTML = '<p class="text-red-500 text-lg">Error al cargar los datos</p>';
      }
    }
  </script>
</body>
</html>`;
    res.send(html);
  });

  // Serve static files
  if (!isProduction) {
    // Dynamic import for Vite in dev mode only
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  return app;
}

// Export for Vercel serverless
let cachedApp: express.Application | null = null;

export default async function handler(req: any, res: any) {
  if (!cachedApp) {
    try {
      cachedApp = await createApp();
    } catch (err: any) {
      console.error("Failed to create app:", err);
      res.status(500).json({ error: "Internal server error: " + (err.message || "Unknown") });
      return;
    }
  }
  cachedApp(req, res);
}

// Start server for local dev
if (!process.env.VERCEL) {
  createApp().then((app) => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  }).catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
}
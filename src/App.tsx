import React, { useState, useEffect } from "react";
import { DEMO_CHATS } from "./demos";
import { TransactionItem, ParseResult } from "./types";

function App() {
  const [selectedDemo, setSelectedDemo] = useState(DEMO_CHATS[0]);
  const [chatText, setChatText] = useState(DEMO_CHATS[0].chatText);
  const [category, setCategory] = useState(DEMO_CHATS[0].category);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ParseResult | null>(DEMO_CHATS[0].demoResult || null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailMessage, setEmailMessage] = useState<string | null>(null);
  const [emailCount, setEmailCount] = useState<number | null>(null);

  // Fetch email signup count on mount
  useEffect(() => {
    fetchEmailCount();
  }, []);

  const fetchEmailCount = async () => {
    try {
      const response = await fetch("/api/email-count");
      const data = await response.json();
      if (data.count !== undefined) {
        setEmailCount(data.count);
      }
    } catch (err) {
      console.error("Error fetching email count:", err);
    }
  };

  const handleDemoChange = (demo: typeof DEMO_CHATS[0]) => {
    setSelectedDemo(demo);
    setChatText(demo.chatText);
    setCategory(demo.category);
    setError(null);
    // Immediately show the hardcoded demo result if available
    if (demo.demoResult) {
      setResult(demo.demoResult);
    } else {
      setResult(null);
    }
  };

  const handleParse = async () => {
    if (!chatText.trim()) {
      setError("Por favor, ingresa el texto del chat.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/parse-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatText,
          category,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al procesar el chat");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Error al procesar el chat. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setEmailLoading(true);
    setEmailMessage(null);
    try {
      const response = await fetch("/api/email-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al registrar email");
      }

      setEmailMessage("✅ ¡Gracias! Te notificaremos cuando Wasa-Text esté listo.");
      setEmail("");
      // Refresh email count after successful signup
      fetchEmailCount();
    } catch (err: any) {
      setEmailMessage("❌ " + (err.message || "Error al registrar email. Por favor, intenta de nuevo."));
    } finally {
      setEmailLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pagado":
        return "bg-green-100 text-green-800";
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#1F2E28] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-[#1F2E28]">Wasa-Text</span>
            </div>
            <button
              onClick={() => document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-2.5 bg-[#1F2E28] text-white rounded-lg hover:bg-[#2d3f36] transition-colors text-sm font-medium"
            >
              Probar Ahora
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <span className="mr-2">⚡</span>
              <span>100% Automático - Sin necesidad de IA externa</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1F2E28] mb-6 leading-tight">
              Muchos pedidos por WhatsApp?
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-700 mb-8 leading-relaxed">
              Cansado de copia y pega? <strong className="text-[#1F2E28]">Extrae y organiza transacciones</strong> de tus chats de WhatsApp automáticamente
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-[#1F2E28] text-white rounded-lg hover:bg-[#2d3f36] transition-all text-lg font-semibold shadow-lg hover:shadow-xl"
              >
                Probar Gratis
                <svg className="inline-block ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white text-[#1F2E28] border-2 border-[#1F2E28] rounded-lg hover:bg-gray-50 transition-all text-lg font-semibold"
              >
                Cómo Funciona
              </button>
            </div>

            {/* Email Signup */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h3 className="text-2xl font-bold text-[#1F2E28] mb-2">
                  ¿Te gustó lo que viste?
                </h3>
                <p className="text-gray-600 mb-6">
                  Déjanos tu email para validar la idea. Si hay suficiente interés, lanzaremos Wasa-Text pronto 🚀
                </p>
                <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F2E28] focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={emailLoading}
                    className="px-6 py-3 bg-[#1F2E28] text-white rounded-lg hover:bg-[#2d3f36] transition-colors font-medium whitespace-nowrap disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {emailLoading ? "Enviando..." : "Quiero ser parte"}
                  </button>
                </form>
                {emailMessage && (
                  <p className="text-sm mt-4 text-center font-medium">{emailMessage}</p>
                )}
                <p className="text-sm text-gray-500 mt-4">
                  <span className="font-semibold">{emailCount !== null ? emailCount.toLocaleString('es-PE') : "2,847"}</span> personas ya están en la lista
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1F2E28] mb-4">
              Cómo Funciona
            </h2>
            <p className="text-xl text-gray-600">
              Tres simples pasos para transformar tus chats en datos organizados
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1F2E28] mb-2">1. Pega tu chat</h3>
              <p className="text-gray-600">
                Copia y pega cualquier conversación de WhatsApp en nuestra plataforma
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1F2E28] mb-2">2. Algoritmo procesa</h3>
              <p className="text-gray-600">
                Nuestro algoritmo detecta automáticamente pedidos, montos, clientes y estados de pago
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1F2E28] mb-2">3. Exporta y analiza</h3>
              <p className="text-gray-600">
                Obtén reportes claros con resúmenes financieros y tablas de transacciones
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1F2E28] mb-4">
              Pruébalo Ahora
            </h2>
            <p className="text-xl text-gray-600">
              Selecciona un ejemplo y ve el resultado al instante
            </p>
          </div>

          {/* Demo Selection */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DEMO_CHATS.map((demo) => (
                <button
                  key={demo.id}
                  onClick={() => handleDemoChange(demo)}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    selectedDemo.id === demo.id
                      ? "border-[#1F2E28] bg-white shadow-lg"
                      : "border-gray-200 bg-white hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={demo.avatar}
                      alt={demo.owner}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#1F2E28]">{demo.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{demo.owner}</p>
                      <span className="inline-block mt-2 px-3 py-1 bg-[#1F2E28] text-white text-xs rounded-full">
                        {demo.badge}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">{demo.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input */}
          <div className="mb-8">
            <label className="block text-xl font-semibold text-[#1F2E28] mb-4">
              Chat de WhatsApp
            </label>
            <textarea
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1F2E28] focus:border-transparent font-mono text-sm"
              placeholder="Pega aquí el texto del chat de WhatsApp..."
            />
            <div className="mt-4 flex items-center gap-4">
              <button
                onClick={handleParse}
                disabled={loading}
                className="px-8 py-3 bg-[#1F2E28] text-white rounded-lg hover:bg-[#2d3f36] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 text-lg font-medium"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    Analizar Chat
                  </>
                )}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              💡 Haz clic en cualquier ejemplo para ver su tabla al instante.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-2xl font-bold text-[#1F2E28] mb-4">
                  Resumen
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Ingresos Totales</p>
                    <p className="text-2xl font-bold text-[#1F2E28] mt-1">
                      {formatCurrency(result.summary.totalRevenue)}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Pedidos</p>
                    <p className="text-2xl font-bold text-[#1F2E28] mt-1">
                      {result.summary.totalOrders}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Pagados</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                      {result.summary.paidCount}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Pendientes</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">
                      {result.summary.pendingCount}
                    </p>
                  </div>
                </div>

                {result.summary.topProducts.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Productos/Servicios más mencionados:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {result.summary.topProducts.map((product, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[#1F2E28] text-white text-sm rounded-full"
                        >
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Transactions Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-2xl font-bold text-[#1F2E28]">
                    Transacciones Extraídas
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Cliente
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Detalles
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Cant.
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Monto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Pago
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Estado
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {result.items.map((item: TransactionItem) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {item.customerName}
                              </div>
                              <div className="text-sm text-gray-500">{item.contact}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {item.details}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCurrency(item.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.paymentMethod}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                item.status
                              )}`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#1F2E28]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Listo para ahorrar horas de trabajo manual?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Únete a cientos de emprendedores que ya automatizaron su gestión de pedidos
          </p>
          <button
            onClick={() => document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-white text-[#1F2E28] rounded-lg hover:bg-gray-100 transition-all text-lg font-semibold shadow-lg"
          >
            Comenzar Ahora
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#1F2E28]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <span className="text-xl font-bold">Wasa-Text</span>
              </div>
              <p className="text-gray-400 text-sm">
                © 2024 Wasa-Text. Todos los derechos reservados.
              </p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacidad</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Términos</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contacto</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
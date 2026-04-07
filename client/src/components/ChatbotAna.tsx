import { useState } from "react";
import { MessageCircle, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FaqItem {
  label: string;
  answer: string;
}

const FAQ_OPTIONS: FaqItem[] = [
  {
    label: "🏠 Quiero comprar",
    answer:
      "¡Excelente! Lianet te guía en cada paso del proceso de compra en Florida. Desde la búsqueda hasta el cierre, estarás acompañado(a) por una profesional con experiencia. Usa el botón de contacto para agendar una consulta gratuita.",
  },
  {
    label: "💰 Quiero vender",
    answer:
      "Vender tu propiedad al mejor precio requiere estrategia. Lianet ofrece análisis de mercado comparativo (CMA), staging profesional y marketing digital para maximizar el valor de tu propiedad. ¡Contáctanos para una evaluación gratuita!",
  },
  {
    label: "📈 Quiero invertir",
    answer:
      "Florida es uno de los mercados más atractivos para inversión inmobiliaria. Lianet te ayuda a identificar propiedades con alto potencial de retorno, ya sea para renta a corto o largo plazo. Agenda una consulta para analizar tus opciones.",
  },
  {
    label: "📋 ¿Qué necesito para empezar?",
    answer:
      "Para compradores: pre-aprobación hipotecaria, identificación y presupuesto definido. Para vendedores: documentos de la propiedad y una idea de tus expectativas. Lianet te guía con los detalles según tu caso particular.",
  },
  {
    label: "🌍 Soy extranjero, ¿puedo comprar?",
    answer:
      "¡Sí! Los extranjeros pueden comprar propiedad en Florida sin restricciones. Lianet tiene experiencia con compradores internacionales y te asesora sobre financiamiento, impuestos y el proceso legal. Contáctanos para más información.",
  },
  {
    label: "📞 Hablar con Lianet",
    answer:
      "Puedes comunicarte directamente con Lianet Espinosa al (407) 371-2374 o escribir un mensaje a través del formulario de contacto en esta página. ¡Estamos para ayudarte!",
  },
];

interface Message {
  type: "bot" | "user";
  text: string;
}

export const ChatbotAna = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "bot",
      text: "¡Hola! Soy Ana, asistente virtual de Lianet Espinosa. Selecciona una opción para ayudarte:",
    },
  ]);
  const [showOptions, setShowOptions] = useState(true);

  const handleFaqClick = (faq: FaqItem) => {
    setShowOptions(false);
    setMessages((prev) => [
      ...prev,
      { type: "user", text: faq.label },
      { type: "bot", text: faq.answer },
    ]);
    setTimeout(() => setShowOptions(true), 300);
  };

  const handleReset = () => {
    setMessages([
      {
        type: "bot",
        text: "¡Hola! Soy Ana, asistente virtual de Lianet Espinosa. Selecciona una opción para ayudarte:",
      },
    ]);
    setShowOptions(true);
  };

  return (
    <>
      <button
        data-testid="button-open-chatbot"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir chat con Ana, asistente virtual"
        className="fixed bottom-24 md:bottom-8 right-6 md:right-8 z-50 w-14 h-14 bg-primary text-[#17140F] rounded-full shadow-md flex items-center justify-center hover:scale-105 transition-all duration-300 hover:bg-primary/90"
      >
        <MessageCircle className="w-6 h-6" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-24 md:bottom-28 right-4 md:right-8 z-50 w-[calc(100vw-32px)] max-w-[350px] max-h-[500px] h-[70vh] bg-white rounded-2xl shadow-xl border border-[#BDB2A4]/20 flex flex-col overflow-hidden"
          >
            <div className="bg-[#17140F] p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-xl font-serif font-bold text-[#17140F]">
                  A
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm leading-none">
                    Ana
                  </h4>
                  <span className="text-xs text-white/60">
                    Asistente Virtual
                  </span>
                </div>
              </div>
              <button
                data-testid="button-close-chatbot"
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar chat"
                className="text-white/60 hover:text-white p-2"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div
              role="log"
              aria-live="polite"
              aria-label="Conversación con Ana"
              className="flex-1 bg-[#F8F6F2] p-4 overflow-y-auto flex flex-col gap-3"
            >
              {messages.map((msg, i) =>
                msg.type === "bot" ? (
                  <div
                    key={i}
                    data-testid={`text-bot-message-${i}`}
                    className="bg-white p-3 rounded-2xl rounded-tl-none border border-[#BDB2A4]/20 text-sm text-[#17140F] shadow-sm max-w-[85%] leading-relaxed"
                  >
                    {msg.text}
                  </div>
                ) : (
                  <div
                    key={i}
                    data-testid={`text-user-message-${i}`}
                    className="bg-primary/20 p-3 rounded-2xl rounded-tr-none text-sm text-[#17140F] max-w-[85%] self-end leading-relaxed"
                  >
                    {msg.text}
                  </div>
                ),
              )}

              {showOptions && (
                <div className="flex flex-col gap-2 mt-2">
                  {FAQ_OPTIONS.map((faq, i) => (
                    <button
                      key={i}
                      data-testid={`button-faq-${i}`}
                      onClick={() => handleFaqClick(faq)}
                      className="text-left bg-white border border-[#BDB2A4]/30 rounded-xl px-3 py-2 text-sm text-[#17140F] hover:bg-primary/10 hover:border-primary/40 transition-colors"
                    >
                      {faq.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 bg-white border-t border-[#BDB2A4]/20 space-y-2">
              <p className="text-[10px] text-[#8B7D6B] text-center leading-tight">
                Ana es una asistente automatizada con respuestas predefinidas.
                Para temas urgentes, llámanos al{" "}
                <a
                  href="tel:+14073712374"
                  className="text-primary font-medium hover:underline"
                >
                  (407) 371-2374
                </a>
              </p>
              <div className="flex gap-2">
                <button
                  data-testid="button-chatbot-reset"
                  onClick={handleReset}
                  className="flex-1 text-xs bg-[#F8F6F2] border border-[#BDB2A4]/30 rounded-full px-3 py-2 text-[#17140F] hover:bg-[#BDB2A4]/20 transition-colors"
                >
                  Volver al inicio
                </button>
                <a
                  data-testid="link-chatbot-call"
                  href="tel:+14073712374"
                  className="flex items-center gap-1.5 text-xs bg-primary text-[#17140F] rounded-full px-4 py-2 hover:bg-primary/90 transition-colors font-medium"
                >
                  <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                  Llamar
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

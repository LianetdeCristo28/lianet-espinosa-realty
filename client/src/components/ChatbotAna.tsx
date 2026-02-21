import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// === AGENTE ANA (Chatbot IA) ===
// Widget flotante bottom-right
// Conectar con: OpenAI API / Anthropic API / custom n8n flow
// Componente placeholder: ChatbotAna.tsx
// Para activar: configurar API key en secrets y conectar endpoint /api/chat

export const ChatbotAna = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        aria-label="Abrir chat con Ana, asistente IA"
        className="fixed bottom-24 md:bottom-8 right-6 md:right-8 z-50 w-14 h-14 bg-primary text-[#17140F] rounded-full shadow-md flex items-center justify-center hover:scale-105 transition-all duration-300 hover:bg-primary/90"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-24 md:bottom-28 right-6 md:right-8 z-50 w-[350px] max-h-[500px] h-[70vh] bg-white rounded-2xl shadow-xl border border-[#BDB2A4]/20 flex flex-col overflow-hidden"
          >
            <div className="bg-[#17140F] p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-xl font-serif font-bold text-[#17140F]">
                  A
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm leading-none">Ana</h4>
                  <span className="text-xs text-white/60">Asistente IA</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} aria-label="Cerrar chat" className="text-white/60 hover:text-white p-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 bg-[#F8F6F2] p-4 overflow-y-auto flex flex-col justify-end">
              <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-[#BDB2A4]/20 text-sm text-[#17140F] shadow-sm max-w-[85%]">
                ¡Hola! Soy Ana, la asistente IA de Lianet Espinosa. ¿En qué te puedo ayudar hoy? ¿Buscas comprar, vender o invertir?
              </div>
            </div>
            
            <div className="p-3 bg-white border-t border-[#BDB2A4]/20">
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  placeholder="Escribe tu mensaje..." 
                  className="flex-1 bg-[#F8F6F2] border border-[#BDB2A4]/30 rounded-full px-4 py-2 text-sm outline-none focus:border-primary"
                />
                <button aria-label="Enviar mensaje" className="bg-primary text-[#17140F] p-2 rounded-full flex-shrink-0 hover:bg-primary/90">
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      <div className="bg-[#17140F] py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors" data-testid="link-back-home">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Volver al inicio
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">Política de Privacidad</h1>
          <p className="text-white/60 mt-3">Última actualización: Abril 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="prose prose-sm max-w-none space-y-8 text-[#17140F]/80">

          <section>
            <h2 className="text-xl font-serif font-bold text-[#17140F] mb-3">1. Responsable del Tratamiento</h2>
            <p className="leading-relaxed">
              Lianet Espinosa Ojeda, Realtor® licenciada en el estado de Florida, operando bajo eXp Realty LLC,
              es responsable del tratamiento de los datos personales recopilados a través de este sitio web.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-[#17140F] mb-3">2. Datos que Recopilamos</h2>
            <p className="leading-relaxed mb-3">Recopilamos únicamente los datos que tú nos proporcionas voluntariamente a través de nuestros formularios:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Nombre completo</strong> — para identificarte y personalizar la comunicación.</li>
              <li><strong>Correo electrónico</strong> — para enviarte información relevante sobre propiedades y responder a tu consulta.</li>
              <li><strong>Número de teléfono</strong> (opcional) — para contactarte directamente si lo prefieres.</li>
              <li><strong>Preferencias inmobiliarias</strong> — ciudad, presupuesto, tipo de propiedad, para ofrecerte opciones adecuadas.</li>
              <li><strong>Mensajes</strong> — cualquier información adicional que decidas compartir.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-[#17140F] mb-3">3. Finalidad del Tratamiento</h2>
            <p className="leading-relaxed mb-3">Tus datos se utilizan exclusivamente para:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Contactarte en relación a servicios inmobiliarios en Florida.</li>
              <li>Enviarte información sobre propiedades que coincidan con tus preferencias.</li>
              <li>Responder a tus consultas y brindarte asesoría personalizada.</li>
              <li>Mejorar nuestros servicios y la experiencia del usuario en este sitio.</li>
            </ul>
            <p className="leading-relaxed mt-3">
              <strong>No vendemos, alquilamos ni compartimos</strong> tus datos personales con terceros para fines de marketing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-[#17140F] mb-3">4. Protección de Datos</h2>
            <p className="leading-relaxed mb-3">Implementamos medidas de seguridad para proteger tu información:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Conexiones cifradas mediante HTTPS/TLS.</li>
              <li>Base de datos protegida con acceso restringido y cifrado en reposo.</li>
              <li>Validación y sanitización de todos los datos ingresados.</li>
              <li>Protección contra ataques CSRF y limitación de solicitudes.</li>
              <li>Acceso administrativo protegido con autenticación segura.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-[#17140F] mb-3">5. Conservación de Datos</h2>
            <p className="leading-relaxed">
              Tus datos se conservan mientras sean necesarios para la finalidad para la que fueron recopilados,
              o hasta que solicites su eliminación. El registro del consentimiento se mantiene como evidencia legal.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-[#17140F] mb-3">6. Tus Derechos</h2>
            <p className="leading-relaxed mb-3">Tienes derecho a:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Acceso</strong> — Solicitar una copia de los datos que tenemos sobre ti.</li>
              <li><strong>Rectificación</strong> — Corregir datos inexactos o incompletos.</li>
              <li><strong>Eliminación</strong> — Solicitar que eliminemos tus datos personales.</li>
              <li><strong>Oposición</strong> — Oponerte al tratamiento de tus datos para fines específicos.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-[#17140F] mb-3">7. Cómo Solicitar la Eliminación de tus Datos</h2>
            <p className="leading-relaxed mb-3">
              Para solicitar la eliminación de tus datos personales, envía un correo electrónico a:
            </p>
            <a
              href="mailto:liarealtor7@gmail.com?subject=Solicitud de eliminación de datos"
              className="inline-block bg-[#17140F] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#17140F]/80 transition-colors"
              data-testid="link-privacy-delete-request"
            >
              liarealtor7@gmail.com
            </a>
            <p className="leading-relaxed mt-3">
              Incluye tu nombre completo y correo electrónico registrado. Procesaremos tu solicitud en un plazo
              máximo de 30 días hábiles y te confirmaremos la eliminación por correo electrónico.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-[#17140F] mb-3">8. Cookies y Tecnologías de Seguimiento</h2>
            <p className="leading-relaxed mb-3">
              Este sitio utiliza <strong>cookies técnicas esenciales</strong> para el funcionamiento del sistema de seguridad (CSRF)
              y la gestión de sesiones. Estas cookies son necesarias y no requieren consentimiento.
            </p>
            <p className="leading-relaxed mb-3">
              Adicionalmente, si otorgas tu <strong>consentimiento explícito</strong> mediante el banner de cookies que aparece
              al visitar el sitio, podemos cargar las siguientes tecnologías de análisis y publicidad:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-3">
              <li>
                <strong>Google Analytics 4</strong> — Nos permite analizar el tráfico y el comportamiento de los visitantes
                en el sitio para mejorar la experiencia. Los datos se anonimizan (anonymize_ip activo).
                Google retiene estos datos por un máximo de 14 meses según su política estándar.
              </li>
              <li>
                <strong>Meta Pixel (Facebook Pixel)</strong> — Nos permite medir la efectividad de nuestras campañas
                publicitarias en Facebook e Instagram.
              </li>
            </ul>
            <p className="leading-relaxed">
              Puedes cambiar tu preferencia en cualquier momento recargando la página y usando el banner de cookies,
              o eliminando las cookies de tu navegador. Sin tu consentimiento, <strong>ninguna</strong> de estas
              tecnologías de seguimiento se activa.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-[#17140F] mb-3">9. Contacto</h2>
            <p className="leading-relaxed">
              Para cualquier consulta sobre esta política de privacidad, puedes contactarnos en:
            </p>
            <ul className="list-none pl-0 space-y-1 mt-3">
              <li><strong>Email:</strong> <a href="mailto:liarealtor7@gmail.com" className="text-[#D2B463] hover:underline">liarealtor7@gmail.com</a></li>
              <li><strong>Teléfono:</strong> <a href="tel:+14073712374" className="text-[#D2B463] hover:underline">(407) 371-2374</a></li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
}

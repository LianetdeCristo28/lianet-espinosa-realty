import { Switch, Route } from "wouter";
import { Component, type ReactNode } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CookieConsent } from "@/components/CookieConsent";
import LandingPage from "@/pages/landing";
import AdminPage from "@/pages/admin";
import PrivacidadPage from "@/pages/privacidad";
import NotFound from "@/pages/not-found";

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F6F2] px-6">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-serif font-bold text-[#17140F] mb-4">
              Algo salió mal
            </h1>
            <p className="text-[#17140F]/60 mb-6">
              Ha ocurrido un error inesperado. Por favor recarga la página o contáctanos directamente.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/"
                className="px-6 py-3 bg-[#D2B463] text-[#17140F] rounded-full font-medium hover:bg-[#D2B463]/90 transition-colors"
              >
                Recargar página
              </a>
              <a
                href="tel:+14073712374"
                className="px-6 py-3 border border-[#BDB2A4] text-[#17140F] rounded-full font-medium hover:bg-[#E5E1D8] transition-colors"
              >
                Llamar a Lianet
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/compradores" component={LandingPage} />
      <Route path="/vendedores" component={LandingPage} />
      <Route path="/inversionistas" component={LandingPage} />
      <Route path="/blog" component={NotFound} />
      <Route path="/privacidad" component={PrivacidadPage} />
      <Route path="/admin" component={AdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Skip to main content — accesibilidad WCAG 2.4.1 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-[#D2B463] focus:text-[#17140F] focus:px-4 focus:py-2 focus:rounded-full focus:font-medium focus:shadow-lg"
        >
          Ir al contenido principal
        </a>
        <Toaster />
        <ErrorBoundary>
          <Router />
        </ErrorBoundary>
        <CookieConsent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

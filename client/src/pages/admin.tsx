import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

async function getCsrfToken(): Promise<string> {
  const res = await fetch("/api/csrf-token", { credentials: "include" });
  const data = await res.json();
  return data.token;
}

interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  city: string | null;
  budget: string | null;
  bedrooms: string | null;
  pool: string | null;
  profileType: string | null;
  propertyAddress: string | null;
  message: string | null;
  source: string | null;
  createdAt: string | null;
}

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) {
          setAuthenticated(true);
          setUsername(data.username || "admin");
          fetchLeads();
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function fetchLeads() {
    setLeadsLoading(true);
    try {
      const res = await fetch("/api/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } finally {
      setLeadsLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const token = await getCsrfToken();
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-csrf-token": token },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAuthenticated(true);
        setPassword("");
        fetchLeads();
      } else {
        setLoginError(data.message || "Error al iniciar sesión");
      }
    } catch {
      setLoginError("Error de conexión");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await apiRequest("POST", "/api/auth/logout");
    } catch {}
    setAuthenticated(false);
    setLeads([]);
    setUsername("");
  }

  const filteredLeads = leads.filter((lead) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      lead.fullName?.toLowerCase().includes(term) ||
      lead.email?.toLowerCase().includes(term) ||
      lead.phone?.toLowerCase().includes(term) ||
      lead.city?.toLowerCase().includes(term) ||
      lead.source?.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#D2B463] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1
              className="text-3xl font-bold text-[#17140F] mb-2"
              style={{ fontFamily: "Playfair Display, serif" }}
              data-testid="text-admin-title"
            >
              Panel Admin
            </h1>
            <p className="text-[#BDB2A4] text-sm">
              Ingresa tus credenciales para acceder
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#17140F] mb-1">
                Usuario
              </label>
              <input
                data-testid="input-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-[#E5E1D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D2B463] bg-[#F8F6F2]"
                required
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#17140F] mb-1">
                Contraseña
              </label>
              <input
                data-testid="input-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-[#E5E1D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D2B463] bg-[#F8F6F2]"
                required
                autoComplete="current-password"
              />
            </div>
            {loginError && (
              <p className="text-red-500 text-sm" data-testid="text-login-error">
                {loginError}
              </p>
            )}
            <button
              data-testid="button-login"
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-[#D2B463] text-white font-semibold rounded-lg hover:bg-[#CBB29B] transition-colors disabled:opacity-50"
            >
              {loginLoading ? "Ingresando..." : "Iniciar Sesión"}
            </button>
          </form>
          <div className="mt-6 text-center">
            <button
              data-testid="link-back-home"
              onClick={() => setLocation("/")}
              className="text-sm text-[#BDB2A4] hover:text-[#17140F] transition-colors"
            >
              ← Volver al sitio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      <header className="bg-white border-b border-[#E5E1D8] px-6 py-4 flex items-center justify-between">
        <h1
          className="text-2xl font-bold text-[#17140F]"
          style={{ fontFamily: "Playfair Display, serif" }}
          data-testid="text-dashboard-title"
        >
          Leads Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#BDB2A4]" data-testid="text-logged-user">
            Conectado como <strong className="text-[#17140F]">{username || "admin"}</strong>
          </span>
          <button
            data-testid="button-logout"
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-[#17140F] text-white rounded-lg hover:bg-[#BDB2A4] transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-xl px-5 py-3 shadow-sm border border-[#E5E1D8]">
              <span className="text-sm text-[#BDB2A4]">Total leads</span>
              <p className="text-2xl font-bold text-[#17140F]" data-testid="text-total-leads">
                {leads.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              data-testid="input-search-leads"
              type="text"
              placeholder="Buscar leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-[#E5E1D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D2B463] bg-white"
            />
            <button
              data-testid="button-refresh-leads"
              onClick={fetchLeads}
              disabled={leadsLoading}
              className="px-4 py-2 bg-[#D2B463] text-white rounded-lg hover:bg-[#CBB29B] transition-colors disabled:opacity-50"
            >
              {leadsLoading ? "Cargando..." : "Actualizar"}
            </button>
          </div>
        </div>

        {leadsLoading && leads.length === 0 ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-[#D2B463] border-t-transparent rounded-full" />
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E1D8]">
            <p className="text-[#BDB2A4] text-lg" data-testid="text-no-leads">
              {searchTerm ? "No se encontraron resultados" : "No hay leads registrados aún"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E5E1D8] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="table-leads">
                <thead>
                  <tr className="bg-[#F8F6F2] border-b border-[#E5E1D8]">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#BDB2A4] uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#BDB2A4] uppercase tracking-wider">
                      Email
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#BDB2A4] uppercase tracking-wider">
                      Teléfono
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#BDB2A4] uppercase tracking-wider">
                      Ciudad
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#BDB2A4] uppercase tracking-wider">
                      Perfil
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#BDB2A4] uppercase tracking-wider">
                      Fuente
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#BDB2A4] uppercase tracking-wider">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-[#E5E1D8] hover:bg-[#F8F6F2] transition-colors"
                      data-testid={`row-lead-${lead.id}`}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-[#17140F]">
                        {lead.fullName}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#17140F]">
                        {lead.email}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#17140F]">
                        {lead.phone || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#17140F]">
                        {lead.city || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {lead.profileType && (
                          <span className="inline-block px-2 py-1 bg-[#D2B463]/10 text-[#D2B463] text-xs font-medium rounded-full">
                            {lead.profileType}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#BDB2A4]">
                        {lead.source || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#BDB2A4]">
                        {lead.createdAt
                          ? new Date(lead.createdAt).toLocaleDateString("es-ES", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

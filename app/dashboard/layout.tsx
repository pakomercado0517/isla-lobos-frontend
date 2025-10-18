"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Calendar,
  Ship,
  BarChart3,
  Users,
  Bell,
  LogOut,
  Menu,
  Settings,
  User,
  Package,
  Search,
  RefreshCw,
  Cloud,
  Mail,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { shouldRedirectUser } from "@/lib/utils/auth-redirect";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Vista general del sistema",
  },
  {
    name: "Brazaletes",
    href: "/dashboard/brazaletes",
    icon: Package,
    description: "Gestión de inventario",
  },
  {
    name: "Búsqueda",
    href: "/dashboard/brazaletes/busqueda",
    icon: Search,
    description: "Búsqueda avanzada",
  },
  {
    name: "Administración",
    href: "/dashboard/brazaletes/administracion",
    icon: Settings,
    description: "Herramientas de administración",
  },
  {
    name: "Operaciones Lote",
    href: "/dashboard/brazaletes/operaciones-lote",
    icon: RefreshCw,
    description: "Operaciones masivas",
  },
  {
    name: "Bloques",
    href: "/dashboard/bloques",
    icon: Calendar,
    description: "Gestión de horarios",
  },
  {
    name: "Plantillas de Bloques",
    href: "/dashboard/plantillas-bloque",
    icon: FileText,
    description: "Plantillas maestras",
  },
  {
    name: "Clima",
    href: "/dashboard/clima",
    icon: Cloud,
    description: "Condiciones meteorológicas",
  },
  {
    name: "Embarcaciones",
    href: "/dashboard/embarcaciones",
    icon: Ship,
    description: "Control de flota",
  },
  {
    name: "Usuarios",
    href: "/dashboard/usuarios",
    icon: Users,
    description: "Gestión de prestadores",
  },
  {
    name: "Invitaciones",
    href: "/dashboard/invitaciones",
    icon: Mail,
    description: "Códigos de registro",
  },
  {
    name: "Notificaciones",
    href: "/dashboard/notificaciones",
    icon: Bell,
    description: "Envío de WhatsApp",
  },
  {
    name: "Reportes",
    href: "/dashboard/reportes",
    icon: BarChart3,
    description: "Estadísticas y análisis",
  },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logoutAction, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [alertasNoLeidas] = useState(0); // TODO: Obtener de la API
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Verificar autenticación y redirección
  useEffect(() => {
    const redirectResult = shouldRedirectUser(pathname, user, authLoading);

    if (redirectResult.shouldRedirect && redirectResult.redirectTo) {
      router.push(redirectResult.redirectTo);
    }
  }, [user, authLoading, router, pathname]);

  const getCurrentPageInfo = () => {
    const currentItem = navigationItems.find((item) => item.href === pathname);
    return {
      name: currentItem?.name || "Dashboard",
      description: currentItem?.description || "Panel de control",
    };
  };

  const handleLogout = async () => {
    // Evitar múltiples clicks
    if (isLoggingOut) return;

    setIsMobileMenuOpen(false);
    setIsLoggingOut(true);

    try {
      // Limpiar localStorage inmediatamente
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_key");
        localStorage.removeItem("refresh_token");
      }

      // Ejecutar server action y esperar un momento para que se procese
      logoutAction();

      // Dar tiempo para que el server action se procese
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch {
      // Silenciar errores - la navegación garantizada maneja el logout
    } finally {
      // Navegación garantizada
      window.location.href = "/login";
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user || user.rol !== "conanp") {
    return null;
  }

  const pageInfo = getCurrentPageInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 shadow-lg">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <Ship className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">APFF</h1>
                <p className="text-xs text-slate-500">CONANP</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigationItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors",
                            isActive
                              ? "bg-teal-50 text-teal-600"
                              : "text-slate-700 hover:text-teal-600 hover:bg-slate-50"
                          )}
                        >
                          <Icon className="h-6 w-6 shrink-0" />
                          <div className="flex-1">
                            <div>{item.name}</div>
                            <div className="text-xs opacity-75 font-normal">
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>

              {/* User section */}
              <li className="mt-auto">
                <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-slate-900 border-t border-slate-200">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-teal-600 text-white">
                      {user.nombre.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {user.nombre}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/perfil">
                          <User className="mr-2 h-4 w-4" />
                          Perfil
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                      >
                        {isLoggingOut ? (
                          <>
                            <div className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Cerrando...
                          </>
                        ) : (
                          <>
                            <LogOut className="mr-2 h-4 w-4" />
                            Cerrar sesión
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Mobile layout */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          {/* Mobile menu button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="-m-2.5 p-2.5 lg:hidden"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir sidebar</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 flex flex-col h-full">
              <SheetHeader>
                <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
              </SheetHeader>

              {/* Mobile Navigation */}
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center space-x-3 mb-6 flex-shrink-0">
                  <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                    <Ship className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-slate-900">APFF</h1>
                    <p className="text-xs text-slate-500">
                      Sistema Arrecifal Lobos-Tuxpan
                    </p>
                  </div>
                </div>

                {/* Navigation items */}
                <nav className="flex-1 space-y-1 overflow-y-auto min-h-0 max-h-96">
                  {navigationItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center space-x-3 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                          isActive
                            ? "bg-teal-50 text-teal-600"
                            : "text-slate-700 hover:text-teal-600 hover:bg-slate-50"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        <div className="flex-1">
                          <div>{item.name}</div>
                          <div className="text-xs opacity-75 font-normal">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    );
                  })}

                  {/* Mi Perfil - Agregado a la navegación principal */}
                  <Link
                    href="/dashboard/perfil"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                      pathname === "/dashboard/perfil"
                        ? "bg-teal-50 text-teal-600"
                        : "text-slate-700 hover:text-teal-600 hover:bg-slate-50"
                    )}
                  >
                    <User className="w-4 h-4" />
                    <div className="flex-1">
                      <div>Mi Perfil</div>
                      <div className="text-xs opacity-75 font-normal">
                        Información personal
                      </div>
                    </div>
                  </Link>
                </nav>

                {/* Usuario y Cerrar Sesión (Mobile) */}
                <div className="border-t border-gray-200 pt-3 mt-3 space-y-2 flex-shrink-0 pb-3">
                  {/* Info del usuario */}
                  <div className="flex items-center gap-3 px-3 py-1.5 bg-gray-50 rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-teal-600 text-white text-sm">
                        {user.nombre.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {user.nombre}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Botón Cerrar Sesión */}
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full h-10 text-sm border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Page title */}
          <div className="flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4">
              <div>
                <h1 className="text-lg font-semibold text-slate-900">
                  {pageInfo.name}
                </h1>
                <p className="text-sm text-slate-600">{pageInfo.description}</p>
              </div>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {/* Puerto status */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-800">
                Puerto Abierto
              </span>
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-6 w-6" />
              {alertasNoLeidas > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-600">
                  {alertasNoLeidas}
                </Badge>
              )}
              <span className="sr-only">Ver notificaciones</span>
            </Button>

            {/* Profile dropdown - Desktop only */}
            <div className="hidden lg:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-teal-600 text-white">
                        {user.nombre.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.nombre}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href={"/dashboard/perfil"}>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Perfil
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Configuración
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

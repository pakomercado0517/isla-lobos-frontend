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
  Ship,
  Plus,
  Package,
  Users,
  Bell,
  LogOut,
  Menu,
  Settings,
  User,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { shouldRedirectUser } from "@/lib/utils/auth-redirect";

interface PrestadorLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  {
    name: "Dashboard",
    href: "/prestador",
    icon: LayoutDashboard,
    description: "Vista general de mis servicios",
  },
  {
    name: "Mis Salidas",
    href: "/prestador/salidas",
    icon: Ship,
    description: "Gestionar mis salidas",
  },
  {
    name: "Nueva Salida",
    href: "/prestador/nueva-salida",
    icon: Plus,
    description: "Registrar nueva salida",
  },
  {
    name: "Historial",
    href: "/prestador/historial",
    icon: History,
    description: "Historial completo de salidas",
  },
  {
    name: "Mis Embarcaciones",
    href: "/prestador/embarcaciones",
    icon: Ship,
    description: "Gestionar mi flota",
  },
  {
    name: "Mis Brazaletes",
    href: "/prestador/brazaletes",
    icon: Package,
    description: "Inventario de brazaletes",
  },
  {
    name: "Registrar Uso",
    href: "/prestador/brazaletes/uso",
    icon: Users,
    description: "Registrar uso de brazaletes",
  },
  {
    name: "Mi Perfil",
    href: "/prestador/perfil",
    icon: User,
    description: "Información personal",
  },
];

export default function PrestadorLayout({ children }: PrestadorLayoutProps) {
  const { user, logoutAction, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [alertasNoLeidas] = useState(0); // TODO: Obtener de la API
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
      description: currentItem?.description || "Panel de prestador",
    };
  };

  const handleLogout = async () => {
    // Evitar múltiples clicks
    if (isLoggingOut) return;
    
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
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch {
      // Silenciar errores - la navegación garantizada maneja el logout
    } finally {
      // Navegación garantizada
      window.location.href = "/login";
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--isla-cream)] to-[var(--isla-cream-light)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[var(--isla-teal)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--isla-dark-teal)]">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user || user.rol !== "prestador") {
    return null;
  }

  const pageInfo = getCurrentPageInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--isla-cream)] to-[var(--isla-cream-light)]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 shadow-lg">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[var(--isla-teal)] rounded-lg flex items-center justify-center">
                <Ship className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[var(--isla-dark-teal)]">
                  Isla Lobos
                </h1>
                <p className="text-xs text-[var(--isla-teal)]">Prestador</p>
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
                              ? "bg-[var(--isla-teal)]/10 text-[var(--isla-teal)]"
                              : "text-[var(--isla-dark-teal)] hover:text-[var(--isla-teal)] hover:bg-[var(--isla-cream)]"
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
                <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-[var(--isla-dark-teal)] border-t border-[var(--isla-cream)]">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-[var(--isla-teal)] text-white">
                      {user.nombre.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-[var(--isla-dark-teal)]">
                      {user.nombre}
                    </p>
                    <p className="truncate text-xs text-[var(--isla-teal)]">
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
                        <Link href="/prestador/perfil">
                          <User className="mr-2 h-4 w-4" />
                          Perfil
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        Configuración
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
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
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-[var(--isla-cream)] bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          {/* Mobile menu button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="-m-2.5 p-2.5 lg:hidden border-[var(--isla-teal)]"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir sidebar</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 flex flex-col">
              <SheetHeader>
                <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
              </SheetHeader>
              {/* Mobile Navigation */}
              <div className="flex items-center space-x-3 mb-6 flex-shrink-0">
                <div className="w-8 h-8 bg-[var(--isla-teal)] rounded-lg flex items-center justify-center">
                  <Ship className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-[var(--isla-dark-teal)]">
                    Isla Lobos
                  </h1>
                  <p className="text-xs text-[var(--isla-teal)]">Prestador</p>
                </div>
              </div>

              <nav className="space-y-2 flex-1 overflow-y-auto">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors",
                        isActive
                          ? "bg-[var(--isla-teal)]/10 text-[var(--isla-teal)]"
                          : "text-[var(--isla-dark-teal)] hover:text-[var(--isla-teal)] hover:bg-[var(--isla-cream)]"
                      )}
                    >
                      <Icon className="w-6 h-6" />
                      <div className="flex-1">
                        <div>{item.name}</div>
                        <div className="text-sm opacity-75 font-normal">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </nav>

              {/* Usuario y Cerrar Sesión (Mobile) */}
              <div className="border-t border-gray-200 pt-4 mt-4 space-y-3 flex-shrink-0">
                {/* Info del usuario */}
                <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-[var(--isla-teal)] text-white text-base">
                      {user.nombre.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-base font-medium text-[var(--isla-dark-teal)]">
                      {user.nombre}
                    </p>
                    <p className="truncate text-sm text-[var(--isla-teal)]">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Botón Cerrar Sesión */}
                <Button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  variant="outline"
                  className="w-full h-12 text-base border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                >
                  {isLoggingOut ? (
                    <>
                      <div className="w-5 h-5 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Cerrando...
                    </>
                  ) : (
                    <>
                      <LogOut className="w-5 h-5 mr-2" />
                      Cerrar Sesión
                    </>
                  )}
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Page title */}
          <div className="flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4">
              <div>
                <h1 className="text-lg font-semibold text-[var(--isla-dark-teal)]">
                  {pageInfo.name}
                </h1>
                <p className="text-sm text-[var(--isla-teal)]">
                  {pageInfo.description}
                </p>
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
                      <AvatarFallback className="bg-[var(--isla-teal)] text-white">
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
                  <DropdownMenuItem asChild>
                    <Link href="/prestador/perfil">
                      <User className="mr-2 h-4 w-4" />
                      Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Configuración
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
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
          </div>
        </div>

        {/* Main content */}
        <main className="py-4 md:py-10">
          <div className="px-3 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

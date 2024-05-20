import { NextResponse } from 'next/server';
import { createClient } from "@/app/utils/supabase/server";

export async function middleware(request) {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    // Verificar si el usuario tiene una sesión activa
    if (!session) {
        // Si no está autenticado, redirigir a la página de inicio de sesión
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // Si está autenticado, permitir el acceso a la ruta
    return NextResponse.next();
}

// Aplicar el middleware a las rutas que quieras proteger
export const config = {
    matcher: ['/home'],
};

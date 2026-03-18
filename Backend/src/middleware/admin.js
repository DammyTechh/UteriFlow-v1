import { supabaseAdmin, getSupabaseAdmin } from '../config/supabase.js';
import { AppError } from '../errors/index.js';

export async function requireAdmin(req, res, next) {
  try {
    if (!getSupabaseAdmin()) {
      return next(
        new AppError(
          'Admin features require SUPABASE_SERVICE_ROLE_KEY to be set.',
          503,
          'ADMIN_UNAVAILABLE'
        )
      );
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Missing or invalid authorization header', 401));
    }

    const token = authHeader.split(' ')[1];

    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return next(new AppError('Invalid or expired token', 401));
    }

    const isAdmin = user.user_metadata?.is_admin === true;
    if (!isAdmin) {
      return next(new AppError('Forbidden: admin access required', 403, 'FORBIDDEN'));
    }

    req.user = user;
    next();
  } catch (err) {
    next(new AppError('Authentication failed', 401));
  }
}

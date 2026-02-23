import { NextRequest } from 'next/server';
import { verifyToken } from './jwt';

export function getAdminFromRequest(req: NextRequest): Record<string, unknown> | null {
  const token = req.cookies.get('admin_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function requireAdmin(req: NextRequest): { admin: Record<string, unknown> } | { error: string; status: number } {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return { error: 'Unauthorized', status: 401 };
  }
  return { admin };
}

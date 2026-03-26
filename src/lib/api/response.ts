export function jsonSuccess(data: unknown, options?: { meta?: Record<string, unknown>; status?: number }) {
  const status = options?.status ?? 200;
  return Response.json({ success: true, data, ...(options?.meta ? { meta: options.meta } : {}) }, { status });
}

export function jsonError(params: { status: number; message: string; code?: string; details?: unknown }) {
  return Response.json(
    {
      success: false,
      error: {
        code: params.code ?? `HTTP_${params.status}`,
        message: params.message,
        details: params.details,
      },
    },
    { status: params.status },
  );
}

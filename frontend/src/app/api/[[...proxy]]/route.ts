import { auth } from "@/app/lib/auth";

const proxyRequest = async (req: Request) => {
  const session = await auth.api.getSession({ headers: req.headers });
  const headers = new Headers({
    Authorization: `Bearer ${session?.session?.token}`,
  });

  // O baseUrl já está definido corretamente como backend
  const baseUrl = process.env.SERVER_URL;

  // Extrair o caminho e parâmetros de consulta da URL de requisição
  const url = new URL(req.url);
  const apiUrl = `${baseUrl}${url.pathname}${url.search}`;

  // Se o método não for GET, então parseBody será chamado
  const body = req.method !== "GET" ? await parseBody(req) : undefined;

  // Realizar a requisição ao backend usando a URL correta
  const res = await fetch(apiUrl, { method: req.method, headers, body });

  return formatResponse(res);
};

const parseBody = async (req: Request) => {
  try {
    return req.headers.get("Content-Type")?.includes("multipart/form-data")
      ? await req.formData()
      : JSON.stringify(await req.json());
  } catch {
    return undefined;
  }
};

const formatResponse = async (res: Response) => {
  if (res.status === 204) return new Response(null, { status: 204 });
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json"))
    return Response.json(await res.json(), { status: res.status });
  if (contentType.includes("text"))
    return new Response(await res.text(), {
      status: res.status,
      headers: { "Content-Type": contentType },
    });
  return new Response(await res.blob(), {
    status: res.status,
    headers: { "Content-Type": contentType || "application/octet-stream" },
  });
};

// Exportando os métodos que usarão o proxy
export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
export const PATCH = proxyRequest;

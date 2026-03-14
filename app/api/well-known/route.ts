// Suppress Next.js errors for non-existent well-known resources
export async function GET(
  request: Request,
  context: { params: { slug: string[] } }
) {
  return new Response(null, { status: 404 })
}


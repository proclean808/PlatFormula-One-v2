export type CommerceIntent = 'discover' | 'compare' | 'recommend' | 'cart' | 'checkout' | 'order' | 'return' | 'support';

export interface ShopperContext {
  sessionId: string;
  intent: CommerceIntent;
  query: string;
  currentUrl?: string;
  viewedProductIds: string[];
  cartId?: string;
  locale?: string;
}

export interface CommerceProduct {
  id: string;
  title: string;
  url: string;
  imageUrl?: string;
  price?: { amount: string; currency: string };
  available?: boolean;
  reason?: string;
}

export interface CommerceToolResult<T = unknown> {
  ok: boolean;
  provider: string;
  tool: string;
  data?: T;
  error?: string;
  observedAt: string;
}

export interface CommerceProvider {
  id: string;
  search(query: string): Promise<CommerceToolResult<CommerceProduct[]>>;
  cart?(operation: 'get' | 'add' | 'remove' | 'update', input: Record<string, unknown>): Promise<CommerceToolResult>;
  policy?(query: string): Promise<CommerceToolResult>;
}

type JsonRpcResponse = { result?: unknown; error?: { message?: string } };

export class ShopifyStorefrontMcpProvider implements CommerceProvider {
  id = 'shopify-storefront-mcp';
  private storefrontEndpoint: string;
  private catalogEndpoint: string;

  constructor(storeDomain: string) {
    const host = storeDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    this.storefrontEndpoint = `https://${host}/api/mcp`;
    this.catalogEndpoint = `https://${host}/api/ucp/mcp`;
  }

  private async call(endpoint: string, tool: string, args: Record<string, unknown>): Promise<CommerceToolResult> {
    const observedAt = new Date().toISOString();
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' },
        body: JSON.stringify({ jsonrpc: '2.0', id: crypto.randomUUID(), method: 'tools/call', params: { name: tool, arguments: args } }),
      });
      if (!response.ok) return { ok: false, provider: this.id, tool, error: `HTTP ${response.status}`, observedAt };
      const payload = await response.json() as JsonRpcResponse;
      if (payload.error) return { ok: false, provider: this.id, tool, error: payload.error.message ?? 'MCP error', observedAt };
      return { ok: true, provider: this.id, tool, data: payload.result, observedAt };
    } catch (error) {
      return { ok: false, provider: this.id, tool, error: error instanceof Error ? error.message : String(error), observedAt };
    }
  }

  async search(query: string) {
    return this.call(this.catalogEndpoint, 'search_catalog', { catalog: { query } }) as Promise<CommerceToolResult<CommerceProduct[]>>;
  }

  async cart(operation: 'get' | 'add' | 'remove' | 'update', input: Record<string, unknown>) {
    if (operation === 'get') return this.call(this.storefrontEndpoint, 'get_cart', input);
    return this.call(this.storefrontEndpoint, 'update_cart', input);
  }

  async policy(query: string) {
    return this.call(this.storefrontEndpoint, 'search_shop_policies_and_faqs', { query });
  }
}

export const commerceGuardrails = {
  requireLiveCatalogForPrice: true,
  requireLiveCatalogForInventory: true,
  requireHumanCommitForCheckout: true,
  preserveSourceEvidence: true,
  neverInventProducts: true,
} as const;

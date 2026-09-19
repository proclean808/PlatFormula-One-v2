# PlatFormula.ONE Agentic Commerce Donor Map

Verified 2026-09-19 against current public product/developer documentation.

## Shopify primitives to adopt

- Storefront Catalog MCP: merchant-scoped natural-language product discovery.
- Storefront MCP: catalog + cart + policies behind an MCP endpoint.
- Checkout MCP/UCP: separate mutable cart iteration from the stricter checkout boundary.
- UCP: protocol boundary for discovery, checkout, orders and post-purchase.
- Agentic Storefronts: distribution to external AI surfaces.
- Sidekick pattern: conversational operator with review-before-apply for consequential changes.

## Storefront-assistant patterns observed across Shopify's AI Shopping Assistants collection and vendors

- Catalog-aware natural-language search.
- Product cards inside chat.
- Contextual recommendations based on shopper intent and behavior.
- Proactive engagement on hesitation/exit/cart signals.
- Add-to-cart from conversation.
- Upsell, cross-sell, bundles and controlled discounts.
- Store policy / shipping / returns Q&A.
- Post-purchase order status and returns.
- Human handoff with conversation context.
- Persistent conversation context.
- Brand voice and custom knowledge.
- Multilingual interaction.
- Analytics and revenue attribution.
- Omnichannel continuation (web, email, SMS/WhatsApp/social).
- Guardrails for inventory, region, discounts and consequential actions.

## PlatFormula.ONE implementation boundary

Do not clone a vendor chatbot. Implement a provider-neutral CommerceProvider behind Joyce.

Flow:
shopper conversation
→ intent/session context
→ live catalog/policy tool
→ evidence-bearing product candidates
→ recommendation cards
→ shopper selection
→ cart mutation
→ Logic Lattice authorization for consequential action
→ checkout handoff
→ receipt/evidence ledger

Price, availability, discounts, order state and checkout state are live data: stale data = no claim / no mutation.

# ProofHire — Accessibility Specification (WCAG 2.2 AA)

## Accessibility Principles

ProofHire is built to comply with **WCAG 2.2 Level AA** standards across all public pages and authenticated portals.

### 1. Perceivable
- **Text Contrast:** All body text meets or exceeds a contrast ratio of `4.5:1` against surfaces. Deep ink text (`#090D1A`, `#0F172A`) against light neutral backgrounds (`#F8FAFC`, `#FFFFFF`) achieves a contrast ratio greater than `12:1`.
- **Not Color Alone:** Status badges combine distinct icons (ShieldCheck, Clock, AlertTriangle) alongside colored backgrounds and clear textual labels (`VERIFIED`, `PENDING`, `REVOKED`).
- **Semantic Structure:** Single `<h1>` per page with strictly ordered `<h2>`, `<h3>` heading hierarchies.

### 2. Operable
- **Keyboard Navigation:** Every interactive button, link, tab, modal, and form control is reachable via keyboard (`Tab`, `Shift+Tab`).
- **Visible Focus Rings:** Customized `:focus-visible` rings with high-visibility 2px solid blue outlines and offset spacing.
- **Skip Link:** Public and portal shells include an accessible `<a href="#main-content" className="skip-to-content">` jump link for screen readers.
- **Modal Focus Trap & Dismiss:** Accessible dialogs trap focus and can be dismissed immediately via the `Escape` key or backdrop clicks.

### 3. Understandable
- **Form Error Associations:** Input elements use `aria-invalid="true"` and `aria-describedby="[id]-error"` so screen readers announce validation errors automatically.
- **Clear Actions:** Confirmation dialogs accompany destructive actions such as credential revocation or account suspension.

### 4. Robust
- **Reduced Motion Support:** Media query `@media (prefers-reduced-motion: reduce)` disables non-essential animations.
- **Valid ARIA:** Tab lists implement `role="tablist"`, `role="tab"`, and `aria-selected` attributes.

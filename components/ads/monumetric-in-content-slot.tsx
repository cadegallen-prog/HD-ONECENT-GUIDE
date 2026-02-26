const MONUMETRIC_IN_CONTENT_SLOT_ID = "39b97adf-dc3e-4795-b4a4-39f0da3c68dd"
const MONUMETRIC_IN_CONTENT_DOM_ID = `mmt-${MONUMETRIC_IN_CONTENT_SLOT_ID}`
const MONUMETRIC_ENABLED = process.env.NEXT_PUBLIC_MONUMETRIC_ENABLED === "true"

const MONUMETRIC_IN_CONTENT_SCRIPT = `
window.$MMT = window.$MMT || {};
window.$MMT.cmd = window.$MMT.cmd || [];
window.$MMT.cmd.push(function () {
  window.$MMT.display = window.$MMT.display || {};
  window.$MMT.display.slots = window.$MMT.display.slots || [];
  window.$MMT.display.slots.push(["${MONUMETRIC_IN_CONTENT_SLOT_ID}"]);
});
`.trim()

export function MonumetricInContentSlot() {
  if (!MONUMETRIC_ENABLED) return null

  return (
    <section
      aria-label="Advertisement"
      className="my-8 rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-3 sm:p-4"
      data-ad-slot="monumetric-in-content-repeatable"
    >
      <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
        Advertisement
      </p>
      <div id={MONUMETRIC_IN_CONTENT_DOM_ID} className="mx-auto min-h-[250px] w-full" />
      <script
        id="pc-monumetric-in-content-repeatable"
        type="text/javascript"
        data-cfasync="false"
        dangerouslySetInnerHTML={{ __html: MONUMETRIC_IN_CONTENT_SCRIPT }}
      />
    </section>
  )
}

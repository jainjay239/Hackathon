export function CookingTodoScaffold() {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-950">
      <section className="mx-auto w-full max-w-3xl border border-zinc-200 bg-white p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Slice 1 ready
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal">
          Cooking Todo Planner
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-700">
          Gemini server action plumbing is scaffolded for a one-day meal plan,
          grocery list, substitutions, and budget feasibility analysis. The
          interactive form and result rendering arrive in Slice 2.
        </p>
      </section>
    </main>
  );
}

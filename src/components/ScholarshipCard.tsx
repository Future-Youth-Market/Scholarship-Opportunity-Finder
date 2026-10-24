import type { Scholarship } from "../data/schema";
export function ScholarshipCard({
  scholarship: s,
}: {
  scholarship: Scholarship;
}) {
  return (
    <article className="rounded border border-slate-300 p-5">
      <h3 className="text-xl font-semibold">{s.name}</h3>
      <p>{s.provider}</p>
      <dl className="my-4 grid gap-2">
        <div>
          <dt className="font-semibold">Award</dt>
          <dd>{s.award || "Award information unavailable"}</dd>
        </div>
        <div>
          <dt className="font-semibold">Deadline</dt>
          <dd>
            {s.deadline ? (
              <time dateTime={s.deadline}>{s.deadline}</time>
            ) : (
              "Deadline unknown — check with the provider"
            )}
          </dd>
        </div>
        <div>
          <dt className="font-semibold">Eligibility</dt>
          <dd>
            {s.eligibility ||
              "Eligibility information unavailable — check with the provider"}
          </dd>
        </div>
        {s.restrictions && (
          <div>
            <dt className="font-semibold">
              Geographic or citizenship restrictions
            </dt>
            <dd>{s.restrictions}</dd>
          </div>
        )}
        <div>
          <dt className="font-semibold">Last verified</dt>
          <dd>
            <time dateTime={s.lastVerified}>{s.lastVerified}</time>
          </dd>
        </div>
      </dl>
      <a href={s.informationUrl}>
        Official provider information (external website)
      </a>
      {s.applicationUrl && s.applicationUrl !== s.informationUrl && (
        <p className="mt-3">
          <a href={s.applicationUrl}>
            Apply through the official provider (external website)
          </a>
        </p>
      )}
      {s.notes && <p className="mt-3">{s.notes}</p>}
    </article>
  );
}

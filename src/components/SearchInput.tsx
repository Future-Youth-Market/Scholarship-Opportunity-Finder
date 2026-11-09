export function SearchInput({
  value,
  onChange,
  id = "scholarship-search",
}: {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}) {
  return (
    <div className="search-field">
      <label htmlFor={id}>Search scholarships</label>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Name, organization, or eligibility keyword"
      />
    </div>
  );
}

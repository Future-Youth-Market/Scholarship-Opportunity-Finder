export function ResearchText({ text }: { text?: string }) {
  if (!text) return <p>Not provided. Confirm with the scholarship provider.</p>;
  const blocks = text.split(/\n\s*\n/);
  return (
    <div className="research-text">
      {blocks.map((block, index) => {
        const lines = block.split("\n"),
          bullet = /^\s*[~–—•*-]\s*/;
        const intro = lines.filter((line) => !bullet.test(line)),
          items = lines.filter((line) => bullet.test(line));
        // Only group all-bullet blocks or introductory text followed by bullets; otherwise keep original order.
        const firstBullet = lines.findIndex((line) => bullet.test(line));
        if (
          items.length &&
          lines.slice(firstBullet).every((line) => bullet.test(line))
        )
          return (
            <div key={index}>
              {intro.length > 0 && (
                <p className="preserve-lines">{intro.join("\n")}</p>
              )}
              <ul>
                {items.map((line, i) => (
                  <li key={i}>{line.replace(bullet, "")}</li>
                ))}
              </ul>
            </div>
          );
        return (
          <p className="preserve-lines" key={index}>
            {block}
          </p>
        );
      })}
    </div>
  );
}

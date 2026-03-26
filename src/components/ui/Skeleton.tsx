export function Skeleton(props: { className?: string }) {
  return <div className={`skeleton ${props.className ?? ""}`} />;
}

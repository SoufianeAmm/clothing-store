export default function ErrorMessage({ message }: { message: string }) {
  return <div className="status-message error">{message}</div>;
}

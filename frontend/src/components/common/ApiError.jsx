export default function ApiError({ error }) {
  if (!error) return null;
  return (
    <p role="alert" className="text-red-600">
      {error.userMessage || error.message}
    </p>
  );
}

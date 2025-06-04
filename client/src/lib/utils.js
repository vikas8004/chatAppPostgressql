export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

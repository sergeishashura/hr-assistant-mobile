export const formatUnix = (unix: number) => {
  const d = new Date(
    unix < 2_000_000_000 ? unix * 1000 : unix 
  );
  return (
    d.toLocaleDateString() +
    " " +
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
};

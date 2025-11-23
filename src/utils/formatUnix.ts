export const formatUnix = (unix: number) => {
  const d = new Date(unix * 1000);
  return d.toLocaleDateString() + " " + d.toLocaleTimeString().slice(0, 5);
};

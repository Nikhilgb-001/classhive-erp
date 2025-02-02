export const processSubjectsArray = (arr: string[] | undefined): string[] => {
  if (!arr || arr.length === 0) return [];
  const subjectsString = Array.isArray(arr) ? arr[0] || "" : "";
  return subjectsString.split(',').map(item => item.trim()).filter(Boolean);
};
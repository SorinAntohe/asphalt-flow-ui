export const exportToCSV = <T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns: { key: keyof T; label: string }[]
) => {
  if (data.length === 0) return;

  const headers = columns.map(col => col.label).join(',');
  const rows = data.map(row =>
    columns.map(col => {
      const value = row[col.key];
      // Handle null/undefined
      if (value === null || value === undefined) return '';
      // Handle numbers
      if (typeof value === 'number') return value.toString();
      // Handle strings with commas or quotes
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',')
  ).join('\n');

  const csvContent = `\uFEFF${headers}\n${rows}`; // BOM for Excel UTF-8 support
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

"use client";

import { motion } from "framer-motion";

interface CompareTableProps {
  headers: string; // JSON array: ["Feature", "Option A", "Option B"]
  rows: string; // JSON array of arrays: [["Speed", "Fast", "Slow"], ...]
  highlight?: string; // column index to highlight (e.g., "1")
}

export function CompareTable({ headers, rows, highlight }: CompareTableProps) {
  // Guard: props may be undefined during SSR prerendering
  const parsedHeaders: string[] = headers ? JSON.parse(headers) : [];
  const parsedRows: string[][] = rows ? JSON.parse(rows) : [];
  const highlightCol = highlight ? parseInt(highlight) : -1;

  if (!parsedHeaders.length) return null;

  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-surface/50 border-b border-border">
            {parsedHeaders.map((h, i) => (
              <th
                key={i}
                className={`px-4 py-3 text-left font-medium ${
                  i === highlightCol ? "text-accent" : "text-muted"
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {parsedRows.map((row, rowIdx) => (
            <motion.tr
              key={rowIdx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: rowIdx * 0.05 }}
              className="border-b border-border/50 last:border-0"
            >
              {row.map((cell, colIdx) => (
                <td
                  key={colIdx}
                  className={`px-4 py-2.5 ${
                    colIdx === highlightCol
                      ? "text-accent font-medium"
                      : colIdx === 0
                      ? "font-medium"
                      : "text-muted"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
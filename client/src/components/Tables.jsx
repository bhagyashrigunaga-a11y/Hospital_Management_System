import React from "react";

export function DataTable({ headers, rows }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-900">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-4 py-3 text-left font-semibold text-white"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-slate-950">
          {rows.map((row, index) => (
            <tr
              key={index}
              className="border-t border-slate-800 hover:bg-slate-900"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-4 py-3 text-slate-300"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
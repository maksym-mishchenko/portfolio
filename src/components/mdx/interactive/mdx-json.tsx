"use client";

export interface MdxJsonParseResult<T> {
  value: T | null;
  error: string | null;
}

export function parseMdxJsonProp<T>(
  raw: string | undefined,
  propName: string,
  isExpectedValue: (value: unknown) => value is T
): MdxJsonParseResult<T> {
  if (!raw) {
    return { value: null, error: null };
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isExpectedValue(parsed)) {
      return { value: null, error: `${propName} has an invalid shape.` };
    }

    return { value: parsed, error: null };
  } catch {
    return { value: null, error: `${propName} is not valid JSON.` };
  }
}

export function MdxJsonError({
  component,
  error,
}: {
  component: string;
  error: string;
}) {
  return (
    <div className="my-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-400">
      <strong>{component} configuration error:</strong> {error}
    </div>
  );
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((item) => typeof item === "number");
}

export function isStringMatrix(value: unknown): value is string[][] {
  return Array.isArray(value) && value.every(isStringArray);
}

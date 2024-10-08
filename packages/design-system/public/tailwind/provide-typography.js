export function provideTailwindTypography() {
  const typography = [
    ...Array.from({ length: 6 }).map((_, i) => `h${i + 1}`),
    ...Array.from({ length: 5 }).map((_, i) => `b${i + 1}`),
  ];

  return typography.reduce(
    (acc, key) => ({
      ...acc,
      [key]: [
        `var(--typography-${key}-font-size)`,
        {
          lineHeight: `var(--typography-${key}-line-height)`,
        },
      ],
    }),
    {}
  );
}

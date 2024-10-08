export function provideTailwindColors() {
  const colors = [
    ...['bg', 'fg', 'pm', 'wn', 'er', 'sc'].map(group =>
      [
        'o75',
        'o30',
        'o24',
        'o16',
        '50',
        '100',
        '200',
        '300',
        '400',
        '500',
        '600',
        '700',
        '800',
        '900',
      ].map(opacity => `primary-${group}-${opacity}`)
    ),
    ...[
      'blue',
      'cyan',
      'teal',
      'lime',
      'yellow',
      'rose',
      'pink',
      'purple',
      'gray',
    ].map(group =>
      [
        '24',
        '50',
        '100',
        '200',
        '300',
        '400',
        '500',
        '600',
        '700',
        '800',
        '900',
      ].map(opacity => `global-${group}-${opacity}`)
    ),
    ...['pm'].map(group =>
      ['1', '2'].map(opacity => `gradient-${group}-${opacity}`)
    ),
  ];

  return colors.flat().reduce(
    (acc, key) => ({
      ...acc,
      [key]: `var(--color-${key})`,
    }),
    {}
  );
}

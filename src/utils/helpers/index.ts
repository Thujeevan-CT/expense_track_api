export const NameFormat = (text: string) => {
  if (text.length === 0) {
    return text;
  }
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const generateDigitCode = () => {
  const min = 1000;
  const max = 9999;
  const digitCode = Math.floor(Math.random() * (max - min + 1)) + min;

  return digitCode;
};

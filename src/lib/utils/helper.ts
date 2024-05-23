export const checkSpecialChar = (str: string) => /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/.test(str);
export const checkDigitOnly = (str: string) => /^\d+$/.test(str);

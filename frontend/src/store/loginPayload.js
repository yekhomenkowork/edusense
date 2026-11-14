export function loginPayload(email, password, otp) {
  return { email, password, ...(otp ? { otp } : {}) };
}

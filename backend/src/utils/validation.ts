export function validatePasswordStrength(password: string): void {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[@$!%*?&]/.test(password);

  if (
    password.length < minLength ||
    !hasUppercase ||
    !hasLowercase ||
    !hasNumber ||
    !hasSpecialChar
  ) {
    throw new Error(
      "A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais."
    );
  }
}

export function validateEmail(email?: string): void {
  if (!email || email.trim() === "") {
    throw new Error("Email não informado");
  }
}
export function validateSenha(senha: string | null | undefined): void {
  if (!senha) {
    throw new Error("Senha não informada");
  }
}
export const jwtConfig = {
  accessSecret: process.env.JWT_ACCESS_SECRET as string,
  refreshSecret: process.env.JWT_REFRESH_SECRET as string,
  accessExpiresIn: "15m",
  refreshExpiresIn: "30d",
  issuer: "heroy-hms",
};

if (!jwtConfig.accessSecret || !jwtConfig.refreshSecret) {
  throw new Error("JWT secrets are not configured in environment variables");
}

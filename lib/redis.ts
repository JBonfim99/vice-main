import Redis from "ioredis";

// Configuração do Redis
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// Exportar a instância do Redis para ser usada em outros arquivos
export { redis };

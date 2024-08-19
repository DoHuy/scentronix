module.exports = {
  type: process.env["TYPEORM_DRIVER"] || "postgres",
  host: process.env["POSTGRES_HOST"] || "localhost",
  port: parseInt(process.env["POSTGRES_PORT"] || "5432", 10),
  username: process.env["POSTGRES_USER"] || "postgres",
  password: process.env["POSTGRES_PASSWORD"] || "postgres",
  database: process.env["POSTGRES_DB"] || "postgres",
  synchronize: !!JSON.parse(process.env["TYPEORM_SYNCHRONIZE"] || "false"),
  logging: !!JSON.parse(process.env["TYPEORM_LOGGING"] || "false"),
  entities: [__dirname + "dist/**/*.entity.js"],
  migrations: [__dirname + "/dist/migration/*.js"],
  subscribers: [__dirname + "/dist/subscriber/**/*.js"],
  cli: {
    entitiesDir: "src/**/*.entity{.ts,.js}",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber"
  }
};

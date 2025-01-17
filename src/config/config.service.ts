import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

require('dotenv').config();

class ConfigService  {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',

      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),
      // entities: ['src/*.entity{.ts,.js}'],  //migration
      // entities: [__dirname + '/**/*.entity{.ts,.js}'], // Include entities
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      migrationsTableName: 'migration',
      migrations: ['src/migration/*.ts'],
      cli: {
        migrationsDir: 'src/migration',
      },

      ssl: this.isProduction(),
    } as  TypeOrmModuleOptions;
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE',
]);

export { configService };

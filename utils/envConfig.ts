
/* ---------- Types ---------- */

type DataConfig = {
  connectionString: string;
  username: string;
  password: string;
};

type EmailConfig = {
  api_token: string;
  inbox_id: string;
  user_id: string;
  mailtrap_base_url: string;
};

type EnvConfig = {
  baseUrl: string;
  username1: string;
  password1: string;
  db: DataConfig;
  EMAIL: EmailConfig;
};

/* ---------- Helpers ---------- */

const createBaseUrl = (env: string): string => {
  switch (env) {
    case 'dev':
      return 'https://www.originenergy.com.au';
    case 'int':
      return 'https://int.example.com';
    default:
      throw new Error(`Unknown environment: ${env}`);
  }
};

/* ---------- Environment Config ---------- */

const config: Record<string, Omit<EnvConfig, 'baseUrl'>> = {
  dev: {
    username1: 'devUser',
    password1: 'devPassword',
    db: {
      connectionString: 'dev-db-server',
      username: 'devDbUser',
      password: 'devDbPassword',
    },
    EMAIL: {
      api_token: 'dev-api-token',
      inbox_id: 'dev-inbox-id',
      user_id: 'dev-user-id',
      mailtrap_base_url: 'https://mailtrap.io/api',
    },
  },
};

/* ---------- Exported Function ---------- */

export const getEnvConfig = (env?: string): EnvConfig => {
  const testEnv = env || process.env.TEST_ENV || 'dev';

  if (!config[testEnv]) {
    throw new Error(`No configuration found for environment: ${testEnv}`);
  }

  return {
    baseUrl: createBaseUrl(testEnv),
    ...config[testEnv],
  };
};

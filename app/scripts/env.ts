import type { Environments, EnvironmentConfig } from '../config';

declare namespace process {
    export const env: SupportedEnvVariables;
}

export type SupportedEnvVariables = {
    NODE_ENV: Environments;
    APP_ENV: Environments;
    APP_VERSION: string;
    APP_HASH: string;
    APP_NAME: string;
    APP_CONFIG: EnvironmentConfig;
    PUBLIC_PATH_OVERRIDE?: string;
};

const AppConfig = process.env.APP_CONFIG;

export const EnableLogger = AppConfig.EnableLogger;
export const Hostname = AppConfig.Hostname;

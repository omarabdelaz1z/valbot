declare global {
	namespace NodeJS {
		interface ProcessEnv {
			CLIENT_ID: string;
			DEV_CLIENT_ID: string;
			CLIENT_SECRET: string;
			AUTH_TOKEN: string;
			PERMISSIONS_INTEGER: string;
			DB_HOST: string;
			DB_NAME: string;
			GUIILD_ID: string;
			ROLE_DEVELOPER: string;
			MODE: "DEVELOPMENT" | "PRODUCTION";
		}
	}
}

export {};

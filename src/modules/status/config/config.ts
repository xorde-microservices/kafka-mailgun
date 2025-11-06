export interface IStatusOptions {
	secret: string;
}

export const statusConfig = (): IStatusOptions => ({
	secret: process.env.STATUS_SECRET,
});

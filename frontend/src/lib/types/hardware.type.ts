export type HardwareType =
	| "HDD"
	| "GPU"
	| "CPU"
	| "Upload"
	| "Download"
	| "RAM";

export type Hardware = {
	type: HardwareType;
	strength: number;
};

export type HardwareType = 'HDD' | 'GPU' | "CPU" | "Upload" | "Download" | "Ram"

export type Hardware = {
	type: HardwareType
	strength: number
}
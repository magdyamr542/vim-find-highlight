export const doesStringMatch = (str: string, ...options: string[]) => {
	return options.some(option => option === str)
}
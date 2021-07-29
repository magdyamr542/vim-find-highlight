export const doesStringMatch = (str: string, ...options: string[]) => {
	return options.some(option => option === str)
}

export const isAlphabetic = (str: string) => {
	const regex = /\w/gi
	return regex.test(str)
}
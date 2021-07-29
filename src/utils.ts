
export const isAlphabetic = (str: string) => {
	const regex = /\w/gi
	return regex.test(str)
}
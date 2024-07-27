import { createContext } from "react";
import * as React from "react"

export const SearchQueryContext = createContext(['', () => {}])

export function SearchQueryProvider({ children }) {
	const [searchQuery, setSearchQuery] = React.useState('')
	return (
		<SearchQueryContext.Provider value={[searchQuery, setSearchQuery]}>
			{children}
		</SearchQueryContext.Provider>
	)
}
import React, { createContext } from 'react';
import useCategoriesReducer from '../hooks/useCategoriesReducer';
import categoriesReducer from '../reducers/categories.reducer';

export const CategoriesContext = createContext();
export const DispatchContext = createContext();

export function CategoriesProvider(props) {
	const { expCategories, incCategories, dispatch, onSortEnd, isLoading } = useCategoriesReducer(
		categoriesReducer
	);

	return (
		<CategoriesContext.Provider
			value={{
				expCategories,
				incCategories,
				onSortEnd,
				isLoading
			}}>
			<DispatchContext.Provider value={dispatch}>{props.children}</DispatchContext.Provider>
		</CategoriesContext.Provider>
	);
}
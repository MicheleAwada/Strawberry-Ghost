import Button from '@mui/material/Button'

import { MessagesContext } from '../root'
import { useContext } from 'react';
import ProductListView from '../components/productListView';

export default function Index() {
    const simpleAddMessage = useContext(MessagesContext).simpleAddMessage;
	return (
        <>
        <ProductListView />
        </>
	)
}

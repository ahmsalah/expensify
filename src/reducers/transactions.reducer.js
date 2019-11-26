import firebase from '../firebase/firebase';

const transactionsReducer = (state, action) => {
	const userID =
		JSON.parse(window.localStorage.getItem('user')) !== null &&
		JSON.parse(window.localStorage.getItem('user')).uid;
	switch (action.type) {
		case 'SET_TRANSACTIONS':
			return action.transactions;
		case 'ADD_TRANSACTION':
			return (
				userID &&
				firebase
					.firestore()
					.collection('users')
					.doc(userID)
					.collection('transactions')
					.add(action.transaction)
			);
		case 'EDIT_TRANSACTION':
			return (
				userID &&
				firebase
					.firestore()
					.collection('users')
					.doc(userID)
					.collection('transactions')
					.doc(action.id)
					.update(action.transaction)
			);
		case 'REMOVE_TRANSACTION':
			return (
				userID &&
				firebase
					.firestore()
					.collection('users')
					.doc(userID)
					.collection('transactions')
					.doc(action.id)
					.delete()
			);
		default:
			return state;
	}
};

export default transactionsReducer;

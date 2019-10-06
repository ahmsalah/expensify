import React from 'react';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import uuid from 'uuid/v4';
import BtnSwitch from './BtnSwitch';
import useInputState from '../hooks/useInputState';
import useToggleState from '../hooks/useToggleState';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grow from '@material-ui/core/Grow';
import SnackbarFeedback from './SnackbarFeedback';
import MenuItem from '@material-ui/core/MenuItem';
import clsx from 'clsx';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

const TransitionGrow = React.forwardRef(function Transition(props, ref) {
	return <Grow {...props} />;
});

const useStyles = makeStyles(({ spacing }) => ({
	switch: {
		margin: spacing(2, 0, 1),
		display: 'flex',
		justifyContent: 'center',
		width: '100%'
	},
	margin: {
		margin: spacing(1)
	},
	textField: {
		width: 200,
		minWidth: 180
	},
	inputsContainer: {
		display: 'flex',
		justifyContent: 'center',
		flexWrap: 'wrap',
		maxWidth: 440
	},
	dialogText: {
		overflowWrap: 'break-word',
		maxWidth: 440
	}
}));

function NewTransactionForm({ expCategories, incCategories, addTransaction }) {
	const classes = useStyles();

	const [ category, handleCategoryChange, resetCategory ] = useInputState('');
	const [ description, handleDescriptionChange, resetDescription ] = useInputState('');
	const [ amount, handleAmountChange, resetAmount ] = useInputState('');
	const [ isExpense, toggleIsExpense ] = useToggleState(true);
	const [ dialogOpen, setDialogOpen ] = React.useState(false);
	const [ snackbarOpen, setSnackbarOpen ] = React.useState(false);
	const [ selectedDate, setSelectedDate ] = React.useState(new Date());

	const handleSnackbarClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setSnackbarOpen(false);
	};

	const handleDialogClickOpen = () => {
		setDialogOpen(true);
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
	};

	const handleDateChange = date => {
		setSelectedDate(date);
	};

	const handleSubmit = evt => {
		evt.preventDefault();
		let newAmount = parseInt(amount);
		let type;
		if (isExpense) {
			newAmount = newAmount * -1;
			type = 'exp';
		} else {
			type = 'inc';
		}
		const transaction = {
			category: category,
			description: description,
			amount: newAmount,
			date: selectedDate,
			id: uuid(),
			type: type
		};
		resetCategory();
		addTransaction(transaction);
		resetDescription();
		resetAmount();
		setDialogOpen(false);
		setSnackbarOpen(true);
	};

	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils}>
			<React.Fragment>
				<Button
					variant="contained"
					color="primary"
					onClick={handleDialogClickOpen}>
					Add Transaction
				</Button>
				<Dialog
					open={dialogOpen}
					onClose={handleDialogClose}
					TransitionComponent={TransitionGrow}
					aria-labelledby="form-dialog-title">
					<DialogTitle id="form-dialog-title">Add Transaction</DialogTitle>

					<DialogContent>
						<DialogContentText className={classes.dialogText}>
							To add a new transaction, please choose the transaction type
							and fill in the fields below. You can list a new category in
							the cateogries tab.
						</DialogContentText>
						<div className={classes.inputsContainer}>
							<div className={classes.switch}>
								<BtnSwitch
									toggleExpense={() => toggleIsExpense()}
									isExpense={isExpense}
								/>
							</div>
							<TextField
								select
								className={clsx(classes.margin, classes.textField)}
								variant="outlined"
								label="Select Category"
								name="category"
								value={category}
								onChange={handleCategoryChange}
								required>
								{isExpense ? (
									expCategories.map(ct => (
										<MenuItem key={ct.id} value={ct.name}>
											{ct.name}
										</MenuItem>
									))
								) : (
									incCategories.map(ct => (
										<MenuItem key={ct.id} value={ct.name}>
											{ct.name}
										</MenuItem>
									))
								)}
							</TextField>
							<TextField
								className={clsx(classes.margin, classes.textField)}
								variant="outlined"
								label="Description"
								name="description"
								value={description}
								onChange={handleDescriptionChange}
							/>{' '}
							<br />
							<TextField
								className={clsx(classes.margin, classes.textField)}
								variant="outlined"
								label="Amount"
								type="number"
								name="amount"
								value={amount}
								onChange={handleAmountChange}
								required
							/>
							<KeyboardDatePicker
								margin="normal"
								className={clsx(
									classes.margin,
									classes.textField,
									classes.date
								)}
								id="date-picker-dialog"
								label="Choose Date"
								format="MM/dd/yyyy"
								inputVariant="outlined"
								value={selectedDate}
								onChange={handleDateChange}
								KeyboardButtonProps={{
									'aria-label': 'change date'
								}}
							/>
						</div>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleDialogClose} color="primary">
							Cancel
						</Button>
						<Button onClick={handleSubmit} color="primary">
							Add
						</Button>
					</DialogActions>
				</Dialog>
				<SnackbarFeedback
					snackbarOpen={snackbarOpen}
					handleSnackbarClose={handleSnackbarClose}
					message={'New Transaction has been added successfully'}
				/>
			</React.Fragment>
		</MuiPickersUtilsProvider>
	);
}

export default NewTransactionForm;

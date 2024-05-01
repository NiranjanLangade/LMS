import React, { useContext, useEffect, useState } from "react";
import "../AdminDashboard.css";
import axios from "axios";
import { AuthContext } from "../../../../Context/AuthContext";
import { Dropdown } from "semantic-ui-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { useTranslation } from "react-i18next"; // Import useTranslation

function AddTransaction() {
	const { t } = useTranslation(); // Initialize useTranslation

	const API_URL = process.env.REACT_APP_API_URL;
	const [isLoading, setIsLoading] = useState(false);
	const { user } = useContext(AuthContext);

	const [borrowerId, setBorrowerId] = useState("");
	const [borrowerDetails, setBorrowerDetails] = useState([]);
	const [bookId, setBookId] = useState("");
	const [recentTransactions, setRecentTransactions] = useState([]);
	const [allMembers, setAllMembers] = useState([]);
	const [allBooks, setAllBooks] = useState([]);

	const [fromDate, setFromDate] = useState(null);
	const [fromDateString, setFromDateString] = useState(null);

	const [toDate, setToDate] = useState(null);
	const [toDateString, setToDateString] = useState(null);

	const transactionTypes = [
		{ value: "Reserved", text: t("reserved") }, // Translate text
		{ value: "Issued", text: t("issued") }, // Translate text
	];

	const [transactionType, setTransactionType] = useState("");

	/* Adding a Transaction */
	const addTransaction = async e => {
		e.preventDefault();
		setIsLoading(true);
		if (
			bookId !== "" &&
			borrowerId !== "" &&
			transactionType !== "" &&
			fromDate !== null &&
			toDate !== null
		) {
			const borrower_details = await axios.get(
				API_URL + "api/users/getuser/" + borrowerId
			);
			const book_details = await axios.get(
				API_URL + "api/books/getbook/" + bookId
			);

			/* Checking weather the book is available or not */
			if (
				(book_details.data.bookCountAvailable > 0 &&
					(transactionType === "Issued" || transactionType === "Reserved")) ||
				(book_details.data.bookCountAvailable === 0 &&
					transactionType === "Reserved")
			) {
				const transactionData = {
					bookId: bookId,
					borrowerId: borrowerId,
					borrowerName: borrower_details.data.userFullName,
					bookName: book_details.data.bookName,
					transactionType: transactionType,
					fromDate: fromDateString,
					toDate: toDateString,
					isAdmin: user.isAdmin,
				};
				try {
					const response = await axios.post(
						API_URL + "api/transactions/add-transaction",
						transactionData
					);
					if (recentTransactions.length >= 5) {
						recentTransactions.splice(-1);
					}
					await axios.put(
						API_URL +
							`api/users/${response.data._id}/move-to-activetransactions`,
						{
							userId: borrowerId,
							isAdmin: user.isAdmin,
						}
					);

					await axios.put(API_URL + "api/books/updatebook/" + bookId, {
						isAdmin: user.isAdmin,
						bookCountAvailable: book_details.data.bookCountAvailable - 1,
					});

					setRecentTransactions([response.data, ...recentTransactions]);
					setBorrowerId("");
					setBookId("");
					setTransactionType("");
					setFromDate(null);
					setToDate(null);
					setFromDateString(null);
					setToDateString(null);
					alert("Transaction was Successfull 🎉");
				} catch (err) {
					console.log(err);
				}
			} else {
				alert("The book is not available");
			}
		} else {
			alert("Fields must not be empty");
		}
		setIsLoading(false);
	};

	/* Fetch Transactions */
	useEffect(() => {
		const getTransactions = async () => {
			try {
				const response = await axios.get(
					API_URL + "api/transactions/all-transactions"
				);
				setRecentTransactions(response.data.slice(0, 5));
			} catch (err) {
				console.log("Error in fetching transactions");
			}
		};
		getTransactions();
	}, [API_URL]);

	/* Fetching borrower details */
	useEffect(() => {
		const getBorrowerDetails = async () => {
			try {
				if (borrowerId !== "") {
					const response = await axios.get(
						API_URL + "api/users/getuser/" + borrowerId
					);
					setBorrowerDetails(response.data);
				}
			} catch (err) {
				console.log("Error in getting borrower details");
			}
		};
		getBorrowerDetails();
	}, [API_URL, borrowerId]);

	/* Fetching members */
	useEffect(() => {
		const getMembers = async () => {
			try {
				const response = await axios.get(API_URL + "api/users/allmembers");
				const all_members = await response.data.map(member => ({
					value: `${member?._id}`,
					text: `${
						member?.userType === "Student"
							? `${member?.userFullName}[${member?.admissionId}]`
							: `${member?.userFullName}[${member?.employeeId}]`
					}`,
				}));
				setAllMembers(all_members);
			} catch (err) {
				console.log(err);
			}
		};
		getMembers();
	}, [API_URL]);

	/* Fetching books */
	useEffect(() => {
		const getallBooks = async () => {
			const response = await axios.get(API_URL + "api/books/allbooks");
			const allbooks = await response.data.map(book => ({
				value: `${book._id}`,
				text: `${book.bookName}`,
			}));
			setAllBooks(allbooks);
		};
		getallBooks();
	}, [API_URL]);

	return (
		<div>
			<p className="dashboard-option-title">{t("dashboardTitle")}</p>{" "}
			{/* Translate text */}
			<div className="dashboard-title-line"></div>
			<form className="transaction-form" onSubmit={addTransaction}>
				<label className="transaction-form-label" htmlFor="borrowerId">
					{t("borrowerLabel")}
					<span className="required-field">{t("requiredField")}</span>
				</label>
				<br /> {/* Translate text */}
				<div className="semanticdropdown">
					<Dropdown
						placeholder={t("selectMember")} // Translate text
						fluid
						search
						selection
						value={borrowerId}
						options={allMembers}
						onChange={(event, data) => setBorrowerId(data.value)}
					/>
				</div>
				<table
					className="admindashboard-table shortinfo-table"
					style={borrowerId === "" ? { display: "none" } : {}}
				>
					<tr>
						<th>{t("borrowerName")}</th>
						<th>{t("issued")}</th>
						<th>{t("reserved")}</th>
						<th>{t("points")}</th>
					</tr>
					<tr>
						<td>{borrowerDetails.userFullName}</td>
						<td>
							{
								borrowerDetails.activeTransactions?.filter(data => {
									return (
										data.transactionType === "Issued" &&
										data.transactionStatus === "Active"
									);
								}).length
							}
						</td>
						<td>
							{
								borrowerDetails.activeTransactions?.filter(data => {
									return (
										data.transactionType === "Reserved" &&
										data.transactionStatus === "Active"
									);
								}).length
							}
						</td>
						<td>{borrowerDetails.points}</td>
					</tr>
				</table>
				<table
					className="admindashboard-table shortinfo-table"
					style={borrowerId === "" ? { display: "none" } : {}}
				>
					<tr>
						<th>{t("bookNameLabel")}</th>
						<th>{t("transactionTypeLabel")}</th>
						<th>
							{t("fromDateLabel")}
							<br />
							<span style={{ fontSize: "10px" }}>[MM/DD/YYYY]</span>
						</th>
						<th>
							{t("toDateLabel")}
							<br />
							<span style={{ fontSize: "10px" }}>[MM/DD/YYYY]</span>
						</th>
						<th>{t("fine")}</th>
					</tr>
					{borrowerDetails.activeTransactions
						?.filter(data => {
							return data.transactionStatus === "Active";
						})
						.map((data, index) => {
							return (
								<tr key={index}>
									<td>{data.bookName}</td>
									<td>{data.transactionType}</td>
									<td>{data.fromDate}</td>
									<td>{data.toDate}</td>
									<td>
										{Math.floor(
											(Date.parse(moment(new Date()).format("MM/DD/YYYY")) -
												Date.parse(data.toDate)) /
												86400000
										) <= 0
											? 0
											: Math.floor(
													(Date.parse(moment(new Date()).format("MM/DD/YYYY")) -
														Date.parse(data.toDate)) /
														86400000
											  ) * 10}
									</td>
								</tr>
							);
						})}
				</table>
				<label className="transaction-form-label" htmlFor="bookName">
					{t("bookNameLabel")}
					<span className="required-field">{t("requiredField")}</span>
				</label>
				<br /> {/* Translate text */}
				<div className="semanticdropdown">
					<Dropdown
						placeholder={t("selectBook")} // Translate text
						fluid
						search
						selection
						options={allBooks}
						value={bookId}
						onChange={(event, data) => setBookId(data.value)}
					/>
				</div>
				<table
					className="admindashboard-table shortinfo-table"
					style={bookId === "" ? { display: "none" } : {}}
				>
					<tr>
						<th>{t("availableCopies")}</th>
						<th>{t("reserved")}</th>
					</tr>
				</table>
				<label className="transaction-form-label" htmlFor="transactionType">
					{t("transactionTypeLabel")}
					<span className="required-field">{t("requiredField")}</span>
				</label>
				<br /> {/* Translate text */}
				<div className="semanticdropdown">
					<Dropdown
						placeholder={t("selectTransaction")} // Translate text
						fluid
						selection
						value={transactionType}
						options={transactionTypes}
						onChange={(event, data) => setTransactionType(data.value)}
					/>
				</div>
				<br />
				<label className="transaction-form-label" htmlFor="from-date">
					{t("fromDateLabel")}
					<span className="required-field">{t("requiredField")}</span>
				</label>
				<br /> {/* Translate text */}
				<DatePicker
					className="date-picker"
					placeholderText="MM/DD/YYYY"
					selected={fromDate}
					onChange={date => {
						setFromDate(date);
						setFromDateString(moment(date).format("MM/DD/YYYY"));
					}}
					minDate={new Date()}
					dateFormat="MM/dd/yyyy"
				/>
				<label className="transaction-form-label" htmlFor="to-date">
					{t("toDateLabel")}
					<span className="required-field">{t("requiredField")}</span>
				</label>
				<br /> {/* Translate text */}
				<DatePicker
					className="date-picker"
					placeholderText="MM/DD/YYYY"
					selected={toDate}
					onChange={date => {
						setToDate(date);
						setToDateString(moment(date).format("MM/DD/YYYY"));
					}}
					minDate={new Date()}
					dateFormat="MM/dd/yyyy"
				/>
				<input
					className="transaction-form-submit"
					type="submit"
					value={t("submitBtn")}
					disabled={isLoading}
				></input>{" "}
				{/* Translate text */}
			</form>
			<p className="dashboard-option-title">{t("recentTransactionsTitle")}</p>{" "}
			{/* Translate text */}
			<div className="dashboard-title-line"></div>
			<table className="admindashboard-table">
				<tr>
					<th>{t("serialNo")}</th>
					<th>{t("bookName")}</th>
					<th>{t("memberFullName")}</th>
					<th>{t("date")}</th>
				</tr>
				{recentTransactions.map((transaction, index) => {
					return (
						<tr key={index}>
							<td>{index + 1}</td>
							<td>{transaction.bookName}</td>
							<td>{transaction.borrowerName}</td>
							<td>{transaction.updatedAt.slice(0, 10)}</td>
						</tr>
					);
				})}
			</table>
		</div>
	);
}

export default AddTransaction;

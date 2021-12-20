import {
	AsyncComponent,
	Col,
	DataTableComponent,
	ProfileComponent,
	ProfileSquaredComponent,
	Row,
	SectionComponent,
	TagComponent,
	TagType,
	PieChartComponent
} from "@common-components";
import { text } from "@core";
import {
	ageBarChart,
	Appointment,
	
	appointmentsByDateChart,
	financesByDateChart,
	genderPieChart,
	mostAppliedTreatmentsChart,
	mostInvolvedTeethChart,
	Patient,
	setting,
	staff,
	statistics,
	treatmentsByGenderChart,
	treatmentsNumberChart,
	// proceduresNumberChart,
	PatientPaymentListPanel,
	mostAppliedProceduresChart,
	proceduresByGenderChart,
	topPatientByPaymentChart,
	topProceduresAppliedPatientChart,
	patients, colors, appointments
} from "@modules";
import { formatDate, round } from "@utils";
import { observable, computed } from "mobx";
import { observer } from "mobx-react";
import { DatePicker, Dropdown } from "office-ui-fabric-react";
import * as React from "react";
import { PatientInsuranceListPanel, PatientLabOrdersListPanel, procedures } from 'modules/patients';
import { Expenses, Expense, expenses } from 'modules/expenses';
import { proceduresNumberChart } from './chart.procedures-number'

@observer
export class StatisticsPage extends React.Component<{}, {}> {

	state = {
		currentPageKey: "1"
	}

	@observable appointment: Appointment | null = null

	//added newly
	@observable selectdate: Date | null = new Date();
	//financesByDateChart,
	@observable charts = [
		proceduresByGenderChart,
		mostAppliedProceduresChart,
		appointmentsByDateChart,
		treatmentsNumberChart,
		mostAppliedTreatmentsChart,
	//	treatmentsByGenderChart,
		genderPieChart,
		mostInvolvedTeethChart,
		ageBarChart,
		proceduresNumberChart,
		topPatientByPaymentChart,
		topProceduresAppliedPatientChart
	];

	/***Added on a later date */
	@computed
	get isNewPercentile() {
		return this.calculatePercentile(true);
	}
	@computed
	get existingPercentile() {
		return this.calculatePercentile(false);
	}

	componentDidMount(){
		
			console.log('appointments in statistics: -------', JSON.stringify(statistics.selectedAppointments))
			
	}
	/****Added */
	calculatePercentile(isnew: Boolean) {
		// var mydate = this.selectdate;
		// if (mydate) {
		// 	return patients.list
		// 		.map(patient => patient)
		// 		.filter((x, i) => x.isNew === isnew && x.datex === mydate.getTime().toString()).length
		// }
		// console.log(statistics.selectedPatientsByDayInsurance);
		return statistics.selectedPatientsByDayInsurance
			.map(patient => patient.isNew)
			.filter((x, i) => x === isnew).length
	}

	calculatePercentileProcedure(status: String) {
		/*if (statistics.selectedAppointments.length <= 0) {
			return 0;
		}   
		return statistics.selectedAppointments
			.filter((item, i) => item.patientID !== "" && item.procedureId !== "" && item.status === status).length*/
		var max = 0;
	
		statistics.selectedPatientsByDayInsurance.forEach((patient) => {		
			patient.procedures.forEach((pro) => {				
				if (pro.name !== undefined && pro.name !== "" && pro.status === status){
					max++;
				}				
			})
		})
		return max;
	}

	calculatePercentileVisits(status: String) {
		if (statistics.selectedAppointments.length <= 0) {
			return 0;
		}
		return statistics.selectedAppointments
			.filter((item, i) => item.patientID !== "" && item.status === status).length
	}
	calculatePercentileVisitsTime(status: String, time: string) {
		if (statistics.selectedAppointments.length <= 0) {
			return 0;
		}
		return statistics.selectedAppointments
			.filter((item, i) => item.patientID !== "" && item.status === status && new Date(item.date).toDateString() === time).length
	}

	calculateRoomsHigh(): Appointment {
	
		return statistics.selectedAppointments.sort((a, b) =>
			statistics.selectedAppointments.filter(item => item.roomNumber === a.roomNumber).length
			- statistics.selectedAppointments.filter(item => item.roomNumber === b.roomNumber).length
		).pop();
	}

	calculateRoomsLow(): Appointment {
		
		return statistics.selectedAppointments.sort((a, b) =>
			statistics.selectedAppointments.filter(item => item.roomNumber === a.roomNumber).length
			- statistics.selectedAppointments.filter(item => item.roomNumber === b.roomNumber).length
		).shift();
	}

	calculateRoomsCount(room: number) {
		if (statistics.selectedAppointments.length <= 0) {
			return 0;
		}
		if (!this.calculateRoomsLow().roomNumber) {
			return 0;
		}
		else if (!this.calculateRoomsHigh().roomNumber) {
			return 0;
		}
		var occurrences = statistics.selectedAppointments.filter((appoint) => {
			return appoint.roomNumber === room;
		}).length;
		return occurrences;
	}

	calculateRoomsPayments(room: number) {
		if (statistics.selectedAppointments.length <= 0) {
			return 0;
		}
		if (!this.calculateRoomsLow().roomNumber) {
			return 0;
		}
		else if (!this.calculateRoomsHigh().roomNumber) {
			return 0;
		}
		var occurrences = statistics.selectedAppointments.filter((appoint) => {
			return appoint.roomNumber === room;
		}).reduce((acc, curVal) => Number(curVal.paidAmount) + acc, 0);

		return occurrences;
	}

	calculateTopDentistVisits(): Appointment {
		/*if (statistics.selectedAppointments.length <= 0) {
			return {};
		}*/
		return statistics.selectedAppointments.sort((a, b) =>
			statistics.selectedAppointments.filter(item => item.dentist === a.dentist).length
			- statistics.selectedAppointments.filter(item => item.dentist === b.dentist).length
		).pop();
	}

	calculateTopDentistVisitsCount(id: string) {
		if (statistics.selectedAppointments.length <= 0) {
			return 0;
		}
		var occurrences = statistics.selectedAppointments.filter((appoint) => {
			return appoint._id === id;
		}).length;
		return occurrences;
	}

	calculateFinancialPaid() {
		if (statistics.selectedAppointments.length <= 0) {
			return 0;
		}
		return statistics.selectedAppointments
			.reduce((acc, curVal) => Number(curVal.paidAmount) + acc, 0);
	}

	calculateTopDentistProcedures() : Appointment {
		if (statistics.selectedAppointments.length <= 0) {
			return null;
		}
		return statistics.selectedAppointments.sort((a, b) =>
			statistics.selectedAppointments.filter(item => item.procedureId === a.procedureId).length
			- statistics.selectedAppointments.filter(item => item.procedureId === b.procedureId).length
		).pop();
	}

	calculateTopDentistProceduresCount(proc: string) {
		if (statistics.selectedAppointments.length <= 0) {
			return 0;
		}
		return statistics.selectedAppointments.filter((appoint) => {
			return appoint.procedureId === proc;
		}).length;
	}

	calculateFinancialProfit() {
		if (statistics.selectedAppointments.length <= 0) {
			return 0;
		}
		return statistics.selectedAppointments
			.reduce((acc, curVal) => Number(curVal.profit) + acc, 0);
	}

	calculatePercentileProcedureTotal(){
		var max = 0;
	
		statistics.selectedPatientsByDayInsurance.forEach((patient) => {
		
			patient.procedures.forEach((pro) => {
				console.log("COunt Procedures: "+ pro.name);
				if (pro.name !== undefined && pro.name !== ""){
					console.log(" Procedure ss: "+ pro.status)
					max++;
				}				
			})
		})
		return max;
	}

	/****Added here */
	render() {
		return (
			<div className="sc-pg p-15 p-l-10 p-r-10">
				<Dropdown
					// placeholder={text(
					// 	"General Statistic"
					// statistics.selectedAppointments
					// )}
					defaultSelectedKey={this.state.currentPageKey}
					options={[
						{
							key: "1",
							text: text("General Statistic")
						},
						{
							key: "2",
							text: text("Patients Financial")
						},
						{
							key: "3",
							text: text("Insuarance")
						},
						{
							key: "4",
							text: text("Lab Orders")
						},
						{
							key: "5",
							text: text("Payments and Expenses")
						},
					]}
					onChange={(ev, member) => {
						this.setState({ currentPageKey: member.key });
					}}
				/>

				{this.state.currentPageKey === "1" && <div className="sc-pg p-15 p-l-10 p-r-10">
					<DataTableComponent
						maxItemsOnLoad={20}
						className={"appointments-data-table"}
						heads={[
							text("Appointment"),
							text("Lab"),
							text("Price"),
							text("Paid"),
							text("Outstanding"),
							text("OverPaid"),
							text("Expenses"),
							text("Profits")
						]}
						rows={statistics.selectedAppointments.map(appointment => ({
							id: appointment._id,
							searchableString: appointment.searchableString,
							cells: [
								{
									dataValue: (
										appointment.patient || new Patient()
									).name,
									component: (
										<ProfileComponent
											secondaryElement={
												<span>
													{formatDate(
														appointment.date,
														setting.getSetting(
															"date_format"
														)
													)}{" "}
												/{" "}
													{appointment.operatingStaff.map(
														x => (
															<i key={x._id}>
																{x.name}{" "}
															</i>
														)
													)}
												</span>
											}
											name={
												(
													appointment!.patient ||
													new Patient()
												).name
											}
											size={3}
										/>
									),
									onClick: () => {
										this.appointment = appointment;
									},
									className: "no-label"
								},
								{
									dataValue: appointment.treatmentID,
									component: (
										<ProfileComponent
											secondaryElement={
												<span>

													{

														appointment.treatUnitGroup.map((tr, i) => {
															return (<>
																{tr.treatment.split("|")[1] + " || " + tr.fees} <br></br>
															</>)
														})


													}
												</span>
											}
											name={
												''
											}
											size={3}
										/>


									),
									className: "hidden-xs"
								},
								{
									dataValue: appointment.finalPrice,
									component: (
										<span>
											{setting.getSetting("currencySymbol") +
												round(
													appointment.finalPrice
												).toString()}
										</span>
									),
									className: "hidden-xs"
								},
								{
									dataValue: appointment.paidAmount,
									component: (
										<span>
											{setting.getSetting("currencySymbol") +
												round(
													appointment.paidAmount
												).toString()}
										</span>
									),
									className: "hidden-xs"
								},
								{
									dataValue: appointment.outstandingAmount,
									component: (
										<span>
											{appointment.outstandingAmount < 0 ? setting.getSetting("currencySymbol") + '0' : setting.getSetting("currencySymbol") +
												round(
													appointment.outstandingAmount
												).toString()}

										</span>
									),
									className: "hidden-xs"
								},
								{
									dataValue: appointment.overpaidAmount,
									component: (
										<span>
											{appointment.overpaidAmount < 0 ? setting.getSetting("currencySymbol") + '0' : setting.getSetting("currencySymbol") +
												round(
													appointment.overpaidAmount
												).toString()}

										</span>
									),
									className: "hidden-xs"
								},
								{
									dataValue: appointment.totalExpenses,
									component: (
										<span>
											{setting.getSetting("currencySymbol") +
												round(
													appointment.totalExpenses
												).toString()}
										</span>
									),
									className: "hidden-xs"
								},
								{
									dataValue: appointment.profit,
									component: (
										<span>
											{setting.getSetting("currencySymbol") +
												round(
													appointment.profit
												).toString()}
										</span>
									),
									className: "hidden-xs"
								}
							]
						}))}
						farItems={[
							{
								key: "1",
								onRender: () => {
									return (
										<Dropdown
											placeholder={text(
												"Filter by staff member"
											)}
											defaultValue=""
											options={[
												{
													key: "",
													text: text("All members")
												}
											].concat(
												staff.list.map(member => {
													return {
														key: member._id,
														text: member.name
													};
												})
											)}
											onChange={(ev, member) => {
												if (member!.text.toString() === "All members"){
													statistics.filterByMember = "";
													expenses.filterByMember = "";
													return
												}
												statistics.filterByMember = member!.key.toString();//
												expenses.filterByMember = member!.text.toString();
												console.log("Expenses filtermember: "+ expenses.filterByMember)
											}}
										/> 									
									);
								}
							
							
							}
						]}
						hideSearch
						commands={[
							{
								key: "2",
								onRender: () => {
									return (
										<DatePicker
											onSelectDate={date => {
												if (date) {
													statistics.startingDate = statistics.getDayStartingPoint(
														date.getTime()
													);
												}
											}}
											value={
												new Date(statistics.startingDate)
											}
											formatDate={d =>
												`${text("From")}: ${formatDate(
													d,
													setting.getSetting(
														"date_format"
													)
												)}`
											}
										/>
									);
								}
							},
							{
								key: "3",
								onRender: () => {
									return (
										<DatePicker
											onSelectDate={date => {
												if (date) {
													statistics.endingDate = statistics.getDayStartingPoint(
														date.getTime()
													);
												}
											}}
											value={new Date(statistics.endingDate)}
											formatDate={d =>
												`${text("Until")}: ${formatDate(
													d,
													setting.getSetting(
														"date_format"
													)
												)}`
											}
										/>
									);
								}
							}
						]}
					/>

					
					{this.appointment ? (
						<AsyncComponent
							key="ae"
							loader={async () => {
								const AppointmentEditorPanel = (await import("../../appointments/components/appointment-editor"))
									.AppointmentEditorPanel;
								return (
									<AppointmentEditorPanel
										appointment={this.appointment}
										onDismiss={() => (this.appointment = null)}
										onDelete={() => (this.appointment = null)}
									/>
								);
							}}
						/>
					) : (
							""
						)}

					<div className="container-fluid m-t-20 quick">
						<SectionComponent title={text("Quick stats")}>
							<Row>
								<Col sm={6} xs={12}>
									<label>
										{text("Appointments")}:{" "}
										<TagComponent
											text={round(
												statistics.selectedAppointments
													.length
											).toString()}
											type={TagType.primary}
										/>
									</label>
								</Col>
								<Col sm={6} xs={12}>
									<label>
										{text("Payments")}:{" "}
										<TagComponent
											text={
												setting.getSetting(
													"currencySymbol"
												) +
												round(
													statistics.totalPayments
												).toString()
											}
											type={TagType.warning}
										/>
									</label>
								</Col>
								<Col sm={6} xs={12}>
									<label>
										{text("Expenses")}:{" "}
										<TagComponent
											text={
												setting.getSetting(
													"currencySymbol"
												) +
												round(
													statistics.totalExpenses 
												).toString()
											}
											type={TagType.danger}
										/>
									</label>
								</Col>
								<Col sm={6} xs={12}>
									<label>
										{text("Profits")}:{" "}
										<TagComponent
											text={
												setting.getSetting(
													"currencySymbol"
												) +
												round(
													 statistics.totalProfits 
												).toString()
											}
											type={TagType.success}
										/>
									</label>
								</Col>
							</Row>
						</SectionComponent>
					</div>

					{/* Give me space lemme add extra sections */}
					<>
						<Row gutter={24}>
							<Col md={8}>

							<SectionComponent title={'Procedures'} image={'EditContact'} >
									<h3> <b> Total :</b> 	{ this.calculatePercentileProcedureTotal() }
									{ /*statistics.selectedPatients.map((patient) => {

										return patient.procedures;

									}).reduce((acc: number, pros) => {
									
										let cur = 0;
											pros.forEach((pro) => {
												cur ++;
											})
										return acc + cur;
									}, 0)  */}
								
									
									</h3>
									<PieChartComponent
										height={400}
										{...{
											data: [
												{ label: text("Completed: " + this.calculatePercentileProcedure('Completed')), value: this.calculatePercentileProcedure('Completed') },
												{ label: text("Not Completed: " + this.calculatePercentileProcedure('Not Completed')), value: this.calculatePercentileProcedure('Not Completed') },
												{ label: text("In Processing: " + this.calculatePercentileProcedure('In Processing')), value: this.calculatePercentileProcedure('In Processing') },
												{ label: text("Delayed: " + this.calculatePercentileProcedure('Delayed')), value: this.calculatePercentileProcedure('Delayed') },
												{ label: text("Discontinued: " + this.calculatePercentileProcedure('Discontinued')), value: this.calculatePercentileProcedure('Discontinued') }
											]
										}}
									/>

							</SectionComponent>

							</Col>

							<Col md={8} >

								<SectionComponent title={'Patients'} image={'PeopleAlert'}>
									<h3> <b> Total :</b> 
									{  statistics.selectedPatientsByDayInsurance.length}
									{/* {String(patients.list.length)} */}
									</h3>
									<PieChartComponent
										height={400}
										{...{
											data: [
												{ label: text("New Patients: " + this.isNewPercentile), value: this.isNewPercentile },
												{ label: text("Existing Patients: " + this.existingPercentile), value: this.existingPercentile }
											]
										}}
									/>

								</SectionComponent>

							</Col>

							<Col md={8}>

								<SectionComponent title={'Visits'} image={'CalendarMirrored'} >
									<h3> <b> Total :</b>  {
									  statistics.selectedAppointments.filter((item, i) =>  item.patientID !== "" ).length}</h3>
									<PieChartComponent
										height={400}
										{...{
											data: [
												{ label: text("Completed: " + this.calculatePercentileVisits('Completed')), value: this.calculatePercentileVisits('Completed') },
												{ label: text("Confirmed: " + this.calculatePercentileVisits('Confirmed')), value: this.calculatePercentileVisits('Confirmed') },
												{ label: text("Unconfirmed: " + this.calculatePercentileVisits('Unconfirmed')), value: this.calculatePercentileVisits('Unconfirmed') },
												{ label: text("Checked In: " + this.calculatePercentileVisits('Checked In')), value: this.calculatePercentileVisits('Checked In') },
												{ label: text("In Progress: " + this.calculatePercentileVisits('In Progress')), value: this.calculatePercentileVisits('In Progress') },
												{ label: text("Delayed: " + this.calculatePercentileVisits('Delayed')), value: this.calculatePercentileVisits('Delayed') },
												{ label: text("Cancelled: " + this.calculatePercentileVisits('Cancelled')), value: this.calculatePercentileVisits('Cancelled') },
												{ label: text("Missed: " + this.calculatePercentileVisits('Missed')), value: this.calculatePercentileVisits('Missed') }
											]
										}}
									/>

								</SectionComponent>
							</Col>



							<Col md={24}>

								<SectionComponent title={'Financials'} image={'Money'} >

									<p> <b style={{ fontSize: '20px' }}> Total Profits:  </b> <b style={{ fontSize: '14px' }}>  {setting.getSetting("currencySymbol")}  {this.calculateFinancialProfit()} </b>   </p>
									<p> <b style={{ fontSize: '20px' }}> Total Payments:  </b> <b style={{ fontSize: '14px' }}>  {setting.getSetting("currencySymbol")}  {this.calculateFinancialPaid()} </b>   </p>

								</SectionComponent>

							</Col>

							<Col md={8}>

							{ /*	<SectionComponent title={'Top Dentist'} image={'PeopleAdd'} >


									<table className="ms-table" >
										<thead>
											<tr>
												<th>{text("Name")}</th>
												<th>{text("Procedures")}</th>
												<th>{text("Visits")}</th>
											</tr>
										</thead>
										<tbody>
											{statistics.selectedAppointments.map(item => 
											<tr> 
												<td> { this.calculateTopDentistVisits() ? this.calculateTopDentistVisits().dentist : "No dentist" } </td>  <td>{this.calculateTopDentistProceduresCount( this.calculateTopDentistProcedures().procedureId)}</td>  <td> { this.calculateTopDentistVisits() ? this.calculateTopDentistVisitsCount( this.calculateTopDentistVisits() ? this.calculateTopDentistVisits()._id : '' ) : "Nil" } </td>
											</tr>
											)}
										</tbody>
									</table>



											</SectionComponent> */ }

							</Col>

							<Col md={8} >
								{ /* <SectionComponent title={'Room performance'} image={'CalendarWorkWeek'}>

									<table className="ms-table">
										<thead>
											<tr>
												<th>{text("")}</th>
												<th>{text("High")}</th>
												<th>{text("Low")}</th>
											</tr>
										</thead>
										<tbody>
										{statistics.selectedAppointments.map(item => 
											<tr>
												<td>Name </td> <td> Room: {this.calculateRoomsHigh() ? this.calculateRoomsHigh().roomNumber : 'Nil'} </td>  <td> Room: {this.calculateRoomsLow() ? this.calculateRoomsLow().roomNumber : 'Nil'} </td>
											</tr>
										)}
										</tbody>
									</table>

										</SectionComponent> */}
							</Col>

						</Row>
					</>

					{/* End */}

					<div className="charts container-fluid">
						<div className="row">
							{this.charts.map((chart, index) => {
								return (
									<div
										key={index + chart.name}
										className={
											"chart-wrapper " +
											(chart.className ||
												"col-xs-12 col-md-5 col-lg-4")
										}
									>
										<SectionComponent title={text(chart.name)}>
											<chart.Component />
										</SectionComponent>
									</div>
								);
							})}
						</div>
					</div>



				</div>}
				{this.state.currentPageKey === "2" &&
					<PatientPaymentListPanel />
				}
				{this.state.currentPageKey === "3" &&
					<PatientInsuranceListPanel />
				}
				{this.state.currentPageKey === "4" &&
					<PatientLabOrdersListPanel />
				}
				{
				 this.state.currentPageKey === "5" &&
					<Expenses />
				}

				{ /*statistics.selectedAppointments.map(appointment => appointment.ex) */ }
			</div>
		);
	}
}


/**
 * 	 
 * 
 */

 /**
  * 
  * 
  */
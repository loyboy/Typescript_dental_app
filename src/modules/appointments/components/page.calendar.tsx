import { AsyncComponent, Col, ProfileSquaredComponent, Row } from "@common-components";
import { router, text, user } from "@core";
import { Appointment, appointments, calendar, Patient, PatientLinkComponent } from "@modules";
import { dateNames, num } from "@utils";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { procedures } from 'modules/patients';
import { Icon, TextField, Toggle, Dropdown, IDropdownOption, IDropdownProps } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class CalendarPage extends React.Component<{}, {}> {
	@observable filter: string = "";

	@observable appointment: Appointment | null = null;

	@observable showAll: boolean = true;

	componentDidMount() {
		this.unifyHeight();

		const dateString = router.currentLocation.split("/")[1];
		if (!dateString) {
			return;
		}
		const dateArray = dateString.split(/\W/);
		calendar.selectedYear = num(dateArray[0]);
		calendar.selectedMonth = num(dateArray[1]) - 1;
		calendar.selectedDay = num(dateArray[2]);
	}

	componentDidUpdate() {
		this.unifyHeight();
	}

	unifyHeight() {
		const parent = document.getElementById("full-day-cols");
		if (!parent) {
			return;
		}
		const els = document.getElementsByClassName(
			"full-day-col"
		) as HTMLCollectionOf<HTMLDivElement>;
		let largest = 0;
		for (let index = 0; index < els.length; index++) {
			const height = els[index].clientHeight;
			if (height > largest) {
				largest = height;
			}
		}
		for (let index = 0; index < els.length; index++) {
			els[index].style.minHeight = largest ? largest + "px" : "auto";
		}
	}

	getColorOnStatus = (status: string): string => {

		const colorArray = {
			'Unconfirmed': '#fecff3',
			'Confirmed': '#d9dcff',
			'Delayed': '#ebe7fd',
			'CheckedIn': '#cff9fe',
			'InProgress': '#fef2b9',
			'Completed': '#dffedb',
			'Cancelled': '#eae8ea',
			'Missed': '#fecfcf'
		}

		return colorArray[status]
	}

	render() {
		let options = { Unconfirmed: 'Unconfirmed', Confirmed: 'Confirmed', Delayed: 'Delayed', CheckedIn: 'Checked In', InProgress: "In Progress", Completed: "Completed", Cancelled: "Cancelled", Missed: "Missed" }
		return (
			<div className="calendar-component container-fluid">
				<div className="selector year-selector">
					<Row>
						{[
							calendar.currentYear - 2,
							calendar.currentYear - 1,
							calendar.currentYear,
							calendar.currentYear + 1
						].map(year => {
							return (
								<Col key={year} span={6} className="centered">
									<a
										onClick={() => {
											calendar.selectedYear = year;
											calendar.selectedMonth = 0;
											calendar.selectedDay = 1;
										}}
										className={
											(calendar.selectedYear === year
												? "selected"
												: "") +
											(calendar.currentYear === year
												? " current"
												: "")
										}
									>
										{year}
									</a>
								</Col>
							);
						})}
					</Row>
				</div>
				<div className="selector month-selector">
					<Row>
						{dateNames.monthsShort().map((monthShort, index) => {
							return (
								<Col
									key={monthShort}
									sm={2}
									xs={4}
									className="centered"
								>
									<a
										onClick={() => {
											calendar.selectedMonth = index;
											calendar.selectedDay = 1;
										}}
										className={
											(calendar.selectedMonth === index
												? "selected"
												: "") +
											(calendar.currentMonth === index &&
												calendar.currentYear ===
												calendar.selectedYear
												? " current"
												: "")
										}
									>
										{monthShort}
									</a>
								</Col>
							);
						})}
					</Row>
				</div>
				<div className="selector day-selector">
					<div className="day-selector-wrapper">
						<div>
							{calendar.selectedMonthDays.map(day => {
								return (
									<div
										key={day.dateNum}
										onClick={() => {
											calendar.selectedDay = day.dateNum;
											setTimeout(() => {
												scroll(
													0,
													this.findPos(
														document.getElementById(
															"day_" + day.dateNum
														)
													)
												);
											}, 0);
										}}
										className={
											"day-col" +
											(calendar.selectedDay ===
												day.dateNum
												? " selected"
												: "") +
											(user.currentUser.onDutyDays.indexOf(
												day.weekDay.dayLiteral
											) === -1
												? " holiday"
												: "") +
											(day.weekDay.isWeekend
												? " weekend"
												: "")
										}
									>
										<div className="day-name">
											{text(
												day.weekDay.dayLiteralShort
													.substr(0, 2)
													.toUpperCase()
											)}
										</div>
										<a
											className={
												"day-number info-row" +
												(day.dateNum ===
													calendar.currentDay &&
													calendar.currentMonth ===
													calendar.selectedMonth &&
													calendar.selectedYear ===
													calendar.currentYear
													? " current"
													: "")
											}
										>
											{day.dateNum}
										</a>
									</div>
								);
							})}
						</div>
						<div>
							{calendar.selectedMonthDays.map(day => {
								const number = appointments.appointmentsForDay(
									calendar.selectedYear,
									calendar.selectedMonth + 1,
									day.dateNum,
									undefined,
									this.showAll
										? undefined
										: user.currentUser._id
								).length;
								return (
									<div
										key={day.dateNum}
										onClick={() => {
											calendar.selectedDay = day.dateNum;
										}}
										className={
											"day-col" +
											(calendar.selectedDay ===
												day.dateNum
												? " selected"
												: "") +
											(user.currentUser.onDutyDays.indexOf(
												day.weekDay.dayLiteral
											) === -1
												? " holiday"
												: "") +
											(day.weekDay.isWeekend
												? " weekend"
												: "")
										}
									>
										<div
											className={
												"info-row appointments-num num-" +
												number
											}
											style={{
												backgroundColor: (number) ? `rgba(238,118,204,0.${number >= 10 ? 9 : number})` : '',
												color: number ? 'white' : 'black',
												fontWeight: 'bold'
											}}
										>
											{number}
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
				<div className="week-view">
					<div className="filters">
						<Row>
							<Col sm={12} md={6} xs={24}>
								<Toggle
									defaultChecked={this.showAll}
									onText={text("All appointments")}
									offText={text("My appointments only")}
									onChange={(ev, newValue) => {
										this.showAll = newValue!;
									}}
								/>
							</Col>
							<Col sm={12} md={18} xs={0} className="filter">
								<TextField
									placeholder={text("Type to filter")}
									onChange={(ev, newVal) =>
										(this.filter = newVal!)
									}
								/>
							</Col>
						</Row>
					</div>
					<div id="full-day-cols">
						{calendar.selectedWeekDays.map(day => {
							return (
								<div
									key={day.dateNum}
									id={"day" + "_" + day.dateNum}
									className={
										"full-day-col" +
										(user.currentUser.onDutyDays.indexOf(
											day.weekDay.dayLiteral
										) === -1
											? " holiday"
											: "") +
										(calendar.selectedDay === day.dateNum
											? " selected"
											: "")
									}
									onClick={() => {
										calendar.selectedDay = day.dateNum;
									}}
									style={{
										width:
											(
												100 /
												calendar.selectedWeekDays.length
											).toString() + "%"
									}}
								>
									<h4>
										<b>{day.dateNum}</b>
										&nbsp;&nbsp;&nbsp;
										<span className="day-name">
											{text(day.weekDay.dayLiteral)}
										</span>
									</h4>
									{appointments
										.appointmentsForDay(
											calendar.selectedYear,
											calendar.selectedMonth + 1,
											day.dateNum,
											this.filter,
											this.showAll
												? undefined
												: user.currentUser._id
										)
										.sort((a, b) => a.date - b.date)
										.map(appointment => {
											return (
												<div
													key={appointment._id}
													className="appointment"
													style={{ backgroundColor: this.getColorOnStatus(appointment.status) }}
												>
													<div className="time">
														{
															appointment.formattedTime
														}
													</div>
													<br /><br />
													<div className="m-b-5" onClick={() => {
														this.appointment =
															appointments.list[
															appointments.getIndexByID(
																appointment._id
															)
															];
													}} >
														{appointment.treatUnitGroup.length > 0
															? appointment.treatUnitGroup.map((tr) => {
																return (
																	<>
																		<b>  {tr.treatment.split("|")[1]}  </b>
																		<br /><br />
																	</>
																)
															})
															: ""}
													</div>
													<br /><br />
													<div className="m-b-5">
														<Dropdown
															placeholder={text("Status of Appointment")}
															label={appointment.status}
															options={Object.keys(options).map(x => ({
																key: x,
																text: text((options as any)[x])
															}))}
															defaultSelectedKey={appointment.status}
															onChange={(ev, has: any) => {
																/* var newpro = appointment.patient.procedures.map(procedure => {
																		if (procedure.id === appointment.procedureId) {
																			procedure.status = has.text!
																		}
																		return procedure
																 } );
																 appointment.patient.procedures = [...newpro];*/
																(appointment.status = has.text!);
															}}
														/>
													</div>
													<ProfileSquaredComponent
														text={
															""
														}
														size={1}
													/>
													<PatientLinkComponent
														id={
															(
																appointment.patient ||
																new Patient()
															)._id
														}
													/>
													{appointment.operatingStaff.map(
														operator => {
															return (
																<div
																	key={
																		operator._id
																	}
																	className="m-t-5 fs-11"
																>
																	<Icon iconName="Contact" />{" "}
																	{
																		operator.name
																	}
																</div>
															);
														}
													)}
												</div>
											);
										})}
								</div>
							);
						})}
					</div>
				</div>
				{this.appointment ? (
					<AsyncComponent
						key="ae"
						loader={async () => {
							const AppointmentEditorPanel = (await import("./appointment-editor"))
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
			</div>
		);
	}

	findPos(obj: HTMLElement | null) {
		let curtop = 0;
		if (obj && obj.offsetParent) {
			do {
				curtop += obj.offsetTop;
			} while ((obj = obj.offsetParent as HTMLElement));
			return curtop - 70;
		}
		return 0;
	}
}

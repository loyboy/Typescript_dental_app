import { Col, ProfileComponent, ProfileSquaredComponent, Row, 
  SectionComponent,
  PieChartComponent,
  TagComponent,
  TagType,
  SparkLineChartComponent } from "@common-components";
import { router, text, user } from "@core";
import {
  Dropdown,
  IconButton,
  Button
} from "office-ui-fabric-react";
import { appointments, appointmentsByDateChart, setting, patients, colors, settingsNamespace, Appointment, Patient, AppointmentsList, procedureList, procedures, staff, appointmentsByMonthChart, statistics } from "@modules";
import { computed, observable } from "mobx";

import { WhatsappIcon } from "react-share";
import { observer } from "mobx-react";
import * as React from "react";
import { num } from '@utils';

interface MyState {
  overall: string,
  pageview: string,
  appointview: string,
  patientid: string,
  selectappoint: string,
  time: string;
}

@observer
export class HomeView extends React.Component<{},MyState> {
  constructor(props: {}) {
      super(props);
      this.state = {
        overall: 'lines',
        pageview: "overall",
        appointview: "Today",
        patientid: "",
        selectappoint: "",
        time: ""
      };
  }

@observable
time = {
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  day: new Date().getDate(),
  monthName: new Date().toLocaleDateString("en-EN", { month: "long" }),
  dayName: new Date().toLocaleDateString("en-EN", { weekday: "long" }),
  time: new Date().toLocaleTimeString("en-EN", {})
  };
  
  @computed
  get isNewPercentile() {
      return this.calculatePercentile(true);
  }
  @computed
  get existingPercentile() {
      return this.calculatePercentile(false);
  }

@computed
get todayAppointments() {
  return appointments.appointmentsForDay(
    this.time.year,
    this.time.month + 1,
    this.time.day
  );
}

@computed
get tomorrowAppointments() {
  return appointments.appointmentsForDay(
    new Date().getTime() + 86400000,
    0,
    0
  );
  }

  get tomorrowdate() {
      var startDate = new Date();
  
      var day = 60 * 60 * 24 * 1000;// 1 day
  
      var endDate = new Date(startDate.getTime() + day);
  
      return endDate.getTime();    
  }

  ///////////////////////////////////////////check 1

  
  getDate() {
      var datex = new Date();
      var options = {
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "numeric"
      };
      return datex.toLocaleDateString("en", options);
  }
  
        patient(id: string) {
          return patients.list.find((patient) => patient._id === id);
        }
      
      
        appointment(id: string) {
          return appointments.list.find((appoint) => appoint._id === id);
        }
      
        DisplayTime(timeZoneOffsetminutes: any) {
          if (!document.all && !document.getElementById) { return }
      
          var timeElement = document.getElementById ? document.getElementById("curTime") : document.all.tick2
          var requiredDate = this.getTimeZoneTimeObj(timeZoneOffsetminutes)
          var hours = requiredDate.h;
          var minutes = String(requiredDate.m);
          var seconds = String(requiredDate.s);
          var DayNight = "PM";
          if (hours < 12) DayNight = "AM";
          if (hours > 12) hours = hours - 12;
          if (hours == 0) hours = 12;
          if (Number(minutes) <= 9) minutes = "0" + minutes;
          if (Number(seconds) <= 9) seconds = "0" + seconds;
          var currentTime = hours + ":" + minutes + ":" + seconds + " " + DayNight;
          timeElement.innerHTML = "<font style='font-family:Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800&subset=latin,cyrillic-ext,latin-extfont-size:14px;color:#000;'>" + currentTime + "</b>"
          setTimeout(() => { this.DisplayTime(-330); }, 1000)
        }
      
        getTimeZoneTimeObj(timeZoneOffsetminutes: any) {
          var localdate = new Date()
          var timeZoneDate = new Date(localdate.getTime() + ((localdate.getTimezoneOffset() - timeZoneOffsetminutes) * 60 * 1000));
          return { 'h': timeZoneDate.getHours(), 'm': timeZoneDate.getMinutes(), 's': timeZoneDate.getSeconds() };
        }
  
        /////////////////////////////////////////check 2

        calculatePercentile(isnew: Boolean) {
          const newPatient: Patient[] = [];
          this.todayAppointments
          .forEach(app => {
                if (newPatient.length !== 0) {
                newPatient.forEach(patient => {
                  if (app.patient._id !== patient._id && app.patient.isNew === isnew) {
                    newPatient.push(app.patient);
                  }
                })
              } else {
                if (app.patient.isNew === isnew) {
                  newPatient.push(app.patient);
                }
              }
          })
          return newPatient.length;
        }
      
        calculatePercentileProcedure(status: String) {
        
         /* this.todayAppointments
            .forEach((item, i) =>  {
              item.patientID !== "" && item.procedureId !== "" && 
                item.patient.procedures.forEach(procedure => {
                  if (procedure.id === item.procedureId && procedure.status === status) {
                    count++;
                  }
            })
          }
            )*/
            var max = 0;
        
            appointments.list.filter((item, i) => item.patientID !== "" && item.dueToday === true  && item.procedureId !== "").forEach((appointment) => {
            
              var proc =  appointment.patient.procedures.find((p) => p.id === appointment.procedureId && p.status === status);
             /* appointment.patient.procedures.forEach((pro) => {
                console.log("COunt Procedures: "+ pro.name);
                if (pro.name !== undefined && pro.name !== "" && pro.status === status){
                  max++;
                }				
              })*/
              if(proc){
                max++;
              }
            })
            return max;
           
        }

        calculatePercentileVisits(status: String) {
          return appointments.list
            .filter((item, i) => item.patientID !== "" &&  item.dueToday === true && item.status === status
            ).length;
        }
        calculatePercentileVisitsTime(status: String) {
          return this.todayAppointments
            .filter((item, i) => item.patientID !== "" && item.status === status).length;
        }
        ////////////////////////////
        calculateFinancialProfit = () => {
          return this.todayAppointments
            .reduce((acc, curVal) => Number(curVal.profit) + acc, 0,);
        }
      
        calculateFinancialPaid = () => {
          return this.todayAppointments
            .reduce((acc, curVal) => Number(curVal.paidAmount) + acc, 0);
        }
        ////////////////////////////
        calculateTopDentistVisits() {
          return this.todayAppointments.sort((a, b) =>
            this.todayAppointments.filter(item => item.dentist === a.dentist).length
            - this.todayAppointments.filter(item => item.dentist === b.dentist).length
          ).pop() ;
        }
      
        calculateTopDentistVisCount = () => {
          const dentist = this.calculateTopDentistVisits().dentist;
          return this.todayAppointments.filter(appoint => {
            return appoint.dentist == dentist
          }).length;
        }
      
        calculateTopDentistVisitsCount(id: string) {
          var occurrences = this.todayAppointments.filter((appoint) => {
            return appoint._id === id ;
          }).length;
      
          return occurrences;
        }
      
        calculateTopDentistProcedures() {
          return this.todayAppointments.sort((a, b) =>
            this.todayAppointments.filter(item => item.procedureId === a.procedureId).length
            - this.todayAppointments.filter(item => item.procedureId === b.procedureId).length
          ).pop() || {} as Appointment;
        }
      
        calculateTopDentistProceduresCount() {
          const procedureId = this.calculateTopDentistProcedures().procedureId;
          const dentist = this.calculateTopDentistProcedures().dentist
          return this.todayAppointments.filter(appoint => appoint.procedureId === procedureId && appoint.dentist === dentist).length;
        }
      
        calculateTopDentistIncome() {
          return this.todayAppointments.sort((a, b) =>
          this.todayAppointments.filter(item => item.profit === a.profit).length
            - this.todayAppointments.filter(item => item.profit === b.profit).length
          ).pop() || {};
        }
      
        calculateTopDentistIncomeTotal(proc: string) {
          var occurrences = this.todayAppointments.filter((appoint) => {
            return appoint.procedureId === proc;
          }).length;
      
          return occurrences;
        }
        /////////////////////////////////
        calculateRoomsHigh()  {
          return this.todayAppointments.sort((a, b) =>
            this.todayAppointments.filter(item => item.roomNumber === a.roomNumber).length
            - this.todayAppointments.filter(item => item.roomNumber === b.roomNumber).length
          ).pop();
        }
      
        calculateRoomsLow() {
          return this.todayAppointments.sort((a, b) =>
            this.todayAppointments.filter(item => item.roomNumber === a.roomNumber).length
            - this.todayAppointments.filter(item => item.roomNumber === b.roomNumber).length
          ).shift();
        }
      
        calculateRoomsCount(room: number) {
          var occurrences = this.todayAppointments.filter((appoint) => {
            return appoint.roomNumber === room;
          }).length;
      
          return occurrences;
        }
      
        calculateRoomsPayments(room: number) {
          var occurrences = this.todayAppointments.filter((appoint) => {
            return appoint.roomNumber === room;
          }).reduce((acc, curVal) => Number(curVal.paidAmount) + acc, 0);
      
          return occurrences;
        }
      
        ///////////////////////////////////////////// Menu 3
        calculateTodayAppointment = (date: number) => {
          return appointments.appointmentsForDay(date, 0, 0)
        }
        ////////////////////////////////////////////////
        calculatePercentilePatientVisits(patient: String) {
          return appointments.list
            .filter((item, i) => item.patientID === patient).length
        }
      
        calculatePercentilePatientVisitsMissed(patient: String) {
          return appointments.list
            .filter((item, i) => item.patientID === patient && item.missed === true).length
        }
      
        calculatePercentilePatientVisitsCompleted(patient: String) {
          return appointments.list
            .filter((item, i) => item.patientID === patient && item.status === "Completed").length
        }
      
        calculatePercentilePatientVisitsCancelled(patient: String) {
          return appointments.list
            .filter((item, i) => item.patientID === patient && item.status === "Discontinued").length
        }

        calculatePercentileProcedureTotal(){
          var max = 0;
        
          appointments.list.filter((item, i) => item.patientID !== "" && item.dueToday === true && item.procedureId !== "" ).forEach((appointment) => {
          
            var proc =  appointment.patient.procedures.find((p) => p.id === appointment.procedureId );
            if (proc){
              max++;
            }
            /*appointment.patient.procedures.forEach((pro) => {
              console.log("COunt Procedures: "+ pro.name);
              if (pro.name !== undefined && pro.name !== ""){
                max++;
              }				
            })*/
          })
          return max;
        }

        getMonthlyData = (list: any, type: string) => {
          const firstMonthDate = new Date().getTime();
          let year: number;
          let month: number;
          let day: number;
      
          if (firstMonthDate > 3000) {
            // it's a timestamp
            const date = new Date(firstMonthDate);
            year = date.getFullYear();
            month = date.getMonth() + 1;
            day = 1;
          }
      
          let filteredList = list.filter((item: any) => {
            let date = new Date(Number(item.date));
            if (type === "patients") {
              date = new Date(Number(item.datex));
            }
            return (
              date.getFullYear() === year &&
              date.getMonth() + 1 === month
            );
          });
          return filteredList as Array<any>;
        }
      
        getWeeklyData = (list: any, type: string) => {
          const firstMonthDate = new Date().getTime();
          let year: number;
          let month: number;
          let day: number;
      
          if (firstMonthDate > 3000) {
            // it's a timestamp
            const date = new Date(firstMonthDate);
            year = date.getFullYear();
            month = date.getMonth() + 1;
            day = 1;
          }
      
          let filteredList = list.filter((item: any) => {
            let date = new Date(Number(item.date));
            if (type === "patients") {
              date = new Date(Number(item.datex));
            }
            return (
              date.getFullYear() === year &&
              date.getMonth() + 1 === month
            );
          });
          return filteredList as Array<any>;
        }
      
        calculateMonthlyPercentile = (type: string) => {
          if (type === "Payments") {
            return this.getMonthlyData(patients.list, "patients")
            .reduce((acc, curVal) => Number(curVal.paymentDetails.totalProfit) + acc, 0,);
          } else if (type === "Procedures") {
          return this.getMonthlyData(appointments.list, "appointments")
          .filter((item: any) => item.patientID !== "" && item.procedureId !== "").length
          }
          else if (type === "Patients") {
            return this.getMonthlyData(patients.list, "patients")
            .map((patient: Patient) => patient.isNew).filter((x, i) => x === true).length
          } else {
            return this.getMonthlyData(appointments.list, "appointments").length;
          }
        }
      
        calculateWeeklyPercentile = (type: string) => {
          if (type === "Payments") {
            return this.getWeeklyData(patients.list, "patients")
            .reduce((acc, curVal) => Number(curVal.paymentDetails.totalProfit) + acc, 0,);
          } else if (type === "Procedures") {
          return this.getWeeklyData(appointments.list, "appointments")
          .filter((item: any) => item.patientID !== "" && item.procedureId !== "").length
          }
          else if (type === "Patients") {
            return this.getWeeklyData(patients.list, "patients")
            .map((patient:Patient) => patient.isNew).filter((x, i) => x === true).length
          } else {
            return this.getWeeklyData(appointments.list, "appointments").length;
          }
        }
      
        getSelectedPatientDetails = () => {
          if (this.appointment(this.state.selectappoint)) {
            return this.appointment(this.state.selectappoint).patient;
          }
          return {} as Patient;
        }
      
        getProfitCordinatesValue = () => {
          return this.todayAppointments.map((el, index) => el.profit);
        }
      
        getPaidCordinatesValue = () => {
          return this.todayAppointments.map((el, index) => el.paidAmount);
        }
      
        renderChartButton = (chartValue: string, chartTitle: string) => (
          <Button
            className={`chart-btn ${this.state.overall === chartValue && "chart-btn-active"}`}
            onClick={() => this.setState((prevState) => ({ overall: prevState.overall === chartValue ? "" : chartValue }))}>
            {chartTitle}
          </Button>
        );
      
        renderTimeButton = (timeValue: string, timeTitle: string) => (
          <Button
            className={`chart-btn ${this.state.appointview === timeValue && "chart-btn-active"}`}
            onClick={() => this.setState({ appointview: timeValue })}>
            {timeTitle}
          </Button>
        )
      
      renderFinancialLineChart = (title: string, label: string, cordinateFunc: Function, calculateFinancial: Function) => (
          <div className="line-chart-container">
            <SparkLineChartComponent
              {...{
                height: 94,
                data: {
                  xLabels: cordinateFunc(),
                  lines: [{
                    label: label,
                    data: cordinateFunc() as Array<number>
                  }]
                }
              }}
            />
            <p style={{ marginTop: "16px", textAlign: "center" }}> <b style={{ fontSize: '16px' }}> {title} </b> <b style={{ fontSize: '14px' }}>  {setting.getSetting("currencySymbol")}  {calculateFinancial()} </b>   </p>
          </div>
      )
      
      totalProcedures = () => {
          let count:number = 0; 
          this.todayAppointments
            .forEach((item, i) =>  {
              item.patientID !== "" && item.procedureId !== "" && 
              item.patient.procedures.forEach(procedure => {
                if (procedure.id === item.procedureId) {
                  count++;
                }
              })
          })
            return count;
      }
  
      componentDidMount() {
          console.log("Todays appoint: "+ this.todayAppointments.length  ) 
          console.log("Patients Percentile: "+ this.calculatePercentile(true)  )
          console.log("Patients Procedures Percentile: "+ this.calculatePercentileProcedure('Unconfirmed')  );
          setting.setSetting("module_statistics", "enable");
         /**/
      }

      componentDidUpdate(){
       /* setInterval(() => {
          this.setState({ time: new Date().toLocaleTimeString("en-EN", {}) });
        }, 1000);*/
      }

render() {

      const { pageview } = this.state;
      const tommorowDate = this.tomorrowdate;
      let patientDetails;
     // console.log("todaya", this.calculateTopDentistVisits(), this.todayAppointments);
      if (this.state.appointview !== "") {
        patientDetails = this.getSelectedPatientDetails();
      }

  return (
          <div className="home p-l-10 p-r-10">
          <div className="container">
            
              
          <h2 className="m-b-20">
            {text("Welcome")}, {user.currentUser.name}
            <span style={{ float: "right" }}>
              {" "}
              {`${this.getDate()} ${this.state.time}`}
              <span id="curTime" style={{ color: "black" }}></span>{" "}
            </span>
          </h2>

          <div className="m-b-20"  style={{ width: "100%", marginBottom: "50px", padding:'10px' }}>
            <Dropdown
               style={{ width: "30%", float: 'right' }}
               options={
                [
                  { id: "overall", val: "overall" },                   
                  { id: "dashboard", val: "dashboard" },
                  { id: "analytics", val: "analytics" }
                ].map((data) => ({
                  key: data.id,
                  text: data.val,
                })) as any
              }
              onChange={(e, value) => {
                this.setState({ pageview: value.key.toString() });
                // console.log("Page view: "+ this.pageview);
              }}
            />
          </div>
          <hr />
  
            {pageview === "overall" ? (
              <>
  
                {/* Line Chart and Visit Status     */}
                <Row gutter={12} className="chart-btn-container">
                  {this.renderChartButton("lines", "Line Chart")}
                  {this.renderChartButton("status", "Visit Status")}
                </Row>
  
                <Row gutter={24}>
                  <Col md={24}>
                    {setting.getSetting("module_statistics") && this.state.overall === 'lines' ? (
                      <appointmentsByMonthChart.Component />
                    ) : (
                        ""
                      )}
  
                    {this.state.overall === 'status' ? (
                      <>
                        <h4> <b style={{ fontStyle: 'italics' }}>  Today's Visit Status Chart </b> </h4>
                        <PieChartComponent
                          height={400}
                          {...{
                            data: [
                              { label: text("Completed: " + this.calculatePercentileVisitsTime('Completed')), value: this.calculatePercentileVisitsTime('Completed') },
                              { label: text("Confirmed: " + this.calculatePercentileVisitsTime('Confirmed')), value: this.calculatePercentileVisitsTime('Confirmed') },
                              { label: text("Unconfirmed: " + this.calculatePercentileVisitsTime('Unconfirmed')), value: this.calculatePercentileVisitsTime('Unconfirmed') },
                             
                              { label: text("Checked In: " + this.calculatePercentileVisitsTime('Checked In')), value: this.calculatePercentileVisitsTime('Checked In') },
                              { label: text("In Progress: " + this.calculatePercentileVisitsTime('In Progress')), value: this.calculatePercentileVisitsTime('In Progress') },
                              { label: text("Cancelled: " + this.calculatePercentileVisitsTime('Cancelled')), value: this.calculatePercentileVisitsTime('Cancelled') },
                              { label: text("Missed: " + this.calculatePercentileVisitsTime('Missed')), value: this.calculatePercentileVisitsTime('Missed') }
                            ]
                          }}
                        />
                      </>
                    ) : (
                        ""
                      )}
                  </Col>
                </Row>
  
  
  
                <Row gutter={12}>
                  <Col md={12}>
                    <h3 className="appointments-table-heading">
                      {text("Today's Appointments")}
                    </h3>
                    <br />
                    <table className="ms-table">
                      <thead>
                        <tr>
                          <th>{text("Time")}</th>
                          <th>{text("Patient")}</th>
                          <th>{text("Dentist")}</th>
                          <th>{text("Room")}</th>
                          <th>{text("Status")}</th>
                        </tr>
                      </thead>
  
                      <tbody>
                        {this.todayAppointments.map((appointment) => (
                          <tr key={appointment._id} className="home-td">
                            <td>
                              {new Date(appointment.date).toLocaleTimeString()}
                            </td>
                            <td>
                              {appointment.patient.name}
                            </td>
  
                            <td>
                              {appointment.dentist}
                            </td>
                            <td>
                              {appointment.roomNumber}
                            </td>
                            <td>
                              {appointment.status}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
  
                    {this.todayAppointments.length === 0 ? (
                      <p className="no-appointments">
                        {text("There are no appointments for today")}
                      </p>
                    ) : (
                        ""
                      )}
                  </Col>
  
                  <Col md={12}>
                    <h3 className="appointments-table-heading">
                      {text("Tomorrow's Appointments")}
                    </h3>
                    <br />
                    <table className="ms-table">
                      <thead>
                        <tr>
                          <th>{text("Time")}</th>
                          <th>{text("Patient")}</th>
                          <th>{text("Dentist")}</th>
                          <th>{text("Room")}</th>
                          <th>{text("Status")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.tomorrowAppointments.map((appointment) => (
                          <tr key={appointment._id} className="home-td">
                            <td>
                              {new Date(appointment.date).toLocaleTimeString()}
                            </td>
                            <td>
                              {appointment.patient.name}
                            </td>
  
                            <td>
                              {appointment.dentist}
                            </td>
                            <td>
                              {appointment.roomNumber}
                            </td>
                            <td>
                              {appointment.status}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {this.tomorrowAppointments.length === 0 ? (
                      <p className="no-appointments">
                        {text("There are no appointments for tomorrow")}
                      </p>
                    ) : (
                        ""
                      )}
                  </Col>
                </Row>
              </>) : ""}
  
            {pageview === "analytics" ? (
              <>
                <Row>
                  <Col md={8}>
                    <div className={
                      "chart-wrapper " + ("col-xs-12 col-md-12 col-lg-12")
                    }
                    >
                      <SectionComponent title={'Patients'} image={'PeopleAlert'} >
                        <h3> <b> Total :</b> <TagComponent
  
                          text={ String( num(this.isNewPercentile) + num(this.existingPercentile) ) }
                          type={TagType.primary}
  
                        />
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
                    </div>
                  </Col>
  
                  <Col md={8}>
                    <div className={
                      "chart-wrapper " + ("col-xs-12 col-md-12 col-lg-12")
                    }
                    >
                     <SectionComponent title={'Procedures'} image={'EditContact'} >
                          <h3> <b> Total :</b> { this.calculatePercentileProcedureTotal() } </h3>
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
  
  
  
                    </div>
  
                  </Col>
  
                  <Col md={8}>
          

                    <SectionComponent title={'Visits'} image={'CalendarMirrored'} >
                <h3> <b> Total :</b>  { appointments.list.filter((item, i) => item.patientID !== "" && item.dueToday === true  ).length }</h3>
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
                </Row>
                <Row>
  
  
                  {/* Financials */}
                  <Col md={24}>
                    <div className={"chart-wrapper " + ("col-xs-12 col-md-12 col-lg-12")}>
                      <SectionComponent title={'Financials'} image={'Money'} >
                        <div className="line-charts-container">
                          {this.renderFinancialLineChart(
                            "Total Profit:",
                            "Profit",
                            this.getProfitCordinatesValue,
                            this.calculateFinancialProfit
                          )}
                          {this.renderFinancialLineChart(
                            "Total Payments:",
                            "Paid",
                            this.getPaidCordinatesValue,
                            this.calculateFinancialPaid
                          )}
                        </div>
                      </SectionComponent>
                    </div>
                  </Col>
  
  
  
                  <Col md={8}>
                    <div className={
                      "chart-wrapper " + ("col-xs-12 col-md-12 col-lg-12")
                    }
                    >
                      {/*
                      <SectionComponent title={'Room performance'} image={'CalendarWorkWeek'} >
  
                        <table className="ms-table">
                          <thead>
                            <tr>
                              <th>{text("")}</th>
                              <th>{text("High")}</th>
                              <th>{text("Low")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Name </td> <td> Room: {this.calculateRoomsHigh() ? this.calculateRoomsHigh().roomNumber : "Nil"} </td>  <td> Room:  { this.calculateRoomsLow() ? this.calculateRoomsLow().roomNumber : "Nil"} </td>
                            </tr>
                            <tr>
                              <td> Visits </td>  <td> {this.calculateRoomsCount(this.calculateRoomsHigh() ? this.calculateRoomsHigh().roomNumber : 0 )} </td>   <td> {this.calculateRoomsCount( this.calculateRoomsLow() ? this.calculateRoomsLow().roomNumber : 0)} </td>
                            </tr>
                            <tr>
                              <td> Payments </td>  <td> {setting.getSetting("currencySymbol")} {this.calculateRoomsPayments(this.calculateRoomsHigh() ? this.calculateRoomsHigh().roomNumber : 0 )} </td>   <td> {setting.getSetting("currencySymbol")} {this.calculateRoomsPayments( this.calculateRoomsLow() ? this.calculateRoomsLow().roomNumber : 0 )} </td>
                            </tr>
                          </tbody>
                        </table>
  
                      </SectionComponent> */}
                    </div>
  
  
                  </Col>
  
                  <Col md={8}>
  
                 {/*   <SectionComponent title={'Top Dentist'} image={'PeopleAdd'} >
  
                    
  
  
                    </SectionComponent> */}
                  </Col>
                </Row>
              </>
            ) : ""}
  
            {pageview === "dashboard" ? (
              <>
                <Row>
                  {/* Appointments List */}
                  <Col md={12}>
                    {/* Line Chart and Visit Status     */}
                    <Row gutter={12} className="time-btn-container">
                      {this.renderTimeButton("Today", "Today")}
                      {this.renderTimeButton("Tomorrow", "Tomorrow")}
                    </Row>
  
                    <div className={"chart-wrapper " + ("col-xs-12 col-md-12 col-lg-12")}>
                      <SectionComponent title={'Appointments'} image={'PublicCalendar'} >
                        <h4> <b> Total :</b>
                          {this.state.appointview === "Today" ?
                            <TagComponent text={String(this.calculateTodayAppointment(new Date().getTime()).length)} type={TagType.primary} />
                            : <TagComponent text={String(this.calculateTodayAppointment(this.tomorrowdate).length)} type={TagType.primary} />
                          }
                        </h4>
  
                        <table className="ms-table">
                          <thead>
                            <tr>
                              <th>{text("Name")}</th>
                              <th>{text("Status")}</th>
                              <th>{text("Time of Appointment")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/** obj.patient ? obj.patient._id : ''  */}
                            {this.state.appointview === "Today" ?
                              this.calculateTodayAppointment(new Date().getTime()).map((obj: Appointment) => {
                                return (<>
                                  <tr style={{ cursor: 'pointer' }} onClick={() => { this.setState({ patientid: obj.patient._id, selectappoint: obj._id }, () => { console.log('Pat 1 :' + this.state.patientid) }); }}> <td> {obj.patient.name} </td> <td> {obj.status} </td> <td> {new Date(obj.date).toLocaleTimeString()} </td> </tr>
                                </>);
                              })
                              : ""}
  
                            {this.state.appointview === "Tomorrow" ?
                              this.calculateTodayAppointment(this.tomorrowdate).map((obj: Appointment) => {
                                return (<>
                                  <tr style={{ cursor: 'pointer' }} onClick={() => { this.setState({ patientid: obj.patient._id, selectappoint: obj._id }, () => { console.log('Pat 2 :' + this.state.patientid) }); }} > <td> {obj.patient.name} </td> <td> {obj.status} </td> <td> {new Date(obj.date).toLocaleTimeString()} </td> </tr>
                                </>);
                              })
                              : ""}
  
                          </tbody>
                        </table>
                      </SectionComponent>
                    </div>
                  </Col>
  
                  {/* Patient Information */}
                  <Col md={12}>
  
                    <div className={"chart-wrapper " + ("col-xs-12 col-md-12 col-lg-12")}>
                      <SectionComponent title={'Patient Information'} image={'PublicCalendar'} >
  
                        <div style={{ display: "flex", flex: 1, flexDirection: "row", width: "100%", justifyContent: "space-around", textAlign: "center", fontSize: "14px", fontWeight: "bold", marginTop: "30px", }}>
                          {this.state.selectappoint !== "" && <>
                            <div><div>Total Payment    </div> <div className="mt-2 font-weight-light">{patientDetails.paymentDetails.totalDues}</div> </div>
                            <div><div>Total Income       </div> <div className="mt-2 font-weight-light">{patientDetails.paymentDetails.totalProfit}</div></div>
                            <div><div>Total Outstanding</div> <div className="mt-2 font-weight-light">{patientDetails.paymentDetails.totalRemaining}</div></div>
                          </>
                          }
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", marginRight: "8px", marginLeft: '8px', paddingTop: "16px" }}>
                          <div style={{ display: "flex", flexDirection: "column", flex: 1, marginRight: "8px", marginBottom: "16px" }}>
  
                            {/* Contact Information */}
                            <div style={{ flex: 1 }}>
                              <table className="ms-table">
                                {this.state.patientid !== "" ? (
                                  <tbody>
                                    <tr>  
                                        <td> <b style={{ fontSize: '14px' }}> {this.patient(this.state.patientid).name} </b>  </td>  
                                        <td> <b style={{ fontSize: '14px' }}> #{this.patient(this.state.patientid)._id} </b>  </td>
                                    </tr>
                                    <tr>
                                      <td >
                                        <IconButton
                                          className="action-button"
                                          iconProps={{
                                            iconName: "Phone"
                                          }}
                                        />
  
                                      </td> <td style={{ wordWrap: 'break-word' }} > {this.state.patientid !== "" ? this.patient(this.state.patientid).phone !== "" ? this.patient(this.state.patientid).phone : "-" : ""} </td></tr>
  
                                    <tr>
                                      <td>
                                        <IconButton
                                          className="action-button"
                                          iconProps={{
                                            iconName: "PublicEmail"
                                          }}
                                        />
                                      </td>
  
                                      <td>  <div style={{ wordWrap: 'break-word', maxWidth: '90px' }}> {this.state.patientid !== "" ? this.patient(this.state.patientid).email ? this.patient(this.state.patientid).email:"-" : ""}  </div>  </td>
                                    </tr>
  
                                    <tr>
                                      <td style={{paddingLeft:"18px"}}>
                                      <WhatsappIcon size={20} round crossOrigin />
                                      </td>
  
                                      <td>  <div style={{ wordWrap: 'break-word', maxWidth: '90px' }}> {this.state.patientid !== "" ? this.patient(this.state.patientid).whatsapphone !== ""? this.patient(this.state.patientid).whatsapphone :"-" : ""}  </div>  </td>
                                    </tr>
  
                                    <tr>
                                      <td><b>Address</b></td>
                                      <td>  <div style={{ wordWrap: 'break-word', maxWidth: '90px' }}> {this.state.patientid !== "" ? this.patient(this.state.patientid).address !== "" ? this.patient(this.state.patientid).address : "-" : ""}  </div>  </td>
                                    </tr>
  
                                  </tbody>
                                ) : ""}
                              </table>
                            </div>
                          </div>
                          {/* Visit History */}
                          <div style={{ flex: 1, marginRight: "10px" }}>
                            <table className="ms-table">
                              {this.state.patientid !== "" ? (
                                <tbody>
                                  <tr> <td> <b> Visits </b> </td> <td> {this.calculatePercentilePatientVisits(this.state.patientid)} </td> </tr>
                                  <tr> <td><b> Missed Visits </b> </td> <td> {this.calculatePercentilePatientVisitsMissed(this.state.patientid)} </td></tr>
                                  <tr> <td> <b> Completed Visits </b> </td> <td> {this.calculatePercentilePatientVisitsCompleted(this.state.patientid)} </td></tr>
                                  <tr> <td> <b> Cancelled Visits </b> </td> <td> {this.calculatePercentilePatientVisitsCancelled(this.state.patientid)}  </td></tr>
                                </tbody>
                              ) : ""}
                            </table>
                          </div>
  
                          <div style={{ flex: 1 }}>
                            <table className="ms-table" cellSpacing="3" cellPadding="3">
                              {this.state.selectappoint !== "" ? (
                                <tbody>
                                  <tr> <td> <b> Status of Visit </b> </td> <td> {this.appointment(this.state.selectappoint).status}  </td> </tr>
                                  <tr> <td> <b> Total Payment </b> </td> <td>  {setting.getSetting("currencySymbol")} {this.appointment(this.state.selectappoint).finalPrice}  </td> </tr>
                                  <tr> <td> <b> Total Paid </b> </td> <td>  {setting.getSetting("currencySymbol")} {this.appointment(this.state.selectappoint).patient.paymentDetails.totalPaid}  </td> </tr>
                                  <tr> <td> <b> Total Outstanding </b> </td> <td>  {setting.getSetting("currencySymbol")} {this.appointment(this.state.selectappoint).outstandingAmount} </td> </tr>
                                </tbody>
                              ) : ""}
                            </table>
                          </div>
                        </div>
                        <div style={{ flex: 1 , marginTop: "10px", marginLeft:"8px", marginRight: "8px"}}>
                          <table className="ms-table" cellSpacing="3" cellPadding="3">
                            {this.state.selectappoint !== "" ? (
                              <tbody>
                                <tr> <td> <b> Last Appointment </b> </td> <td> {patientDetails.lastAppointment
                                  ? patientDetails.lastAppointment.treatment
                                  ? patientDetails.lastAppointment.treatment.lab_name
                                  : "": ""} </td> </tr>
                                <tr> <td> <b> Insurance </b> </td> <td> {patientDetails.insurance && patientDetails.insurance.name}  </td> </tr>
                                
                                { patientDetails.medicalHistory.map((md, index) => (
                                  <tr> <td> <b> Note {index + 1} </b> </td> <td> {md}  </td> </tr>
                                )                                   
                                )}
                               
                                <tr> <td> <b> Label </b> </td> <td>  {patientDetails.labels.map(el => el.text+" ")}  </td> </tr>
                              </tbody>
                            ) : ""}
                          </table>
                        </div>
                      </SectionComponent>
                    </div>
                  </Col>
                </Row>
  
  
  
                <Row>
                  {/* Weekly Statistic */}
                  <Col md={12}>
                    <div className={"chart-wrapper " + ("col-xs-12 col-md-12 col-lg-12")}>
                      <SectionComponent title={'Weekly Statistic'} image={'PublicCalendar'} >
                        <table className="ms-table">
                        <tbody>
                            <tr>
                              <td>Visit</td>
                              <td>{this.calculateWeeklyPercentile("Visits")}</td>
                            </tr>
                            <tr>
                            <td>New Patients</td>
                            <td>{this.calculateWeeklyPercentile("Patients")}</td>
                            </tr>
                          <tr>
                            <td>Procedures</td>
                            <td>{this.calculateWeeklyPercentile("Procedures")}</td>
                          </tr>
                          <tr>
                            <td>Payment</td>
                            <td>{this.calculateWeeklyPercentile("Payments")}</td>
                          </tr>
                          </tbody>
                        </table>
                      </SectionComponent></div>
                  </Col>
  
  
                  {/* Monthly Statistic */}
                  <Col md={12}>
                    <div className={"chart-wrapper " + ("col-xs-12 col-md-12 col-lg-12")}>
                      <SectionComponent title={'Monthly Statistic'} image={'PublicCalendar'} >
                        <table className="ms-table">
                          <tbody>
                            <tr>
                              <td>Visit</td>
                              <td>{this.calculateMonthlyPercentile("Visits")}</td>
                            </tr>
                            <tr>
                            <td>New Patients</td>
                            <td>{this.calculateMonthlyPercentile("Patients")}</td>
                            </tr>
                          <tr>
                            <td>Procedures</td>
                            <td>{this.calculateMonthlyPercentile("Procedures")}</td>
                          </tr>
                          <tr>
                            <td>Payment</td>
                            <td>{this.calculateMonthlyPercentile("Payments")}</td>
                          </tr>
                          </tbody>
                        </table>
                      </SectionComponent></div>
                  </Col>
                </Row>
  
              </>
            ) : ""}
  
          </div>
        </div>
  );
}
}


/***
*   <table className="ms-table">
                        <thead>
                          <tr>
                            <th>{text("Name")}</th>
                            <th>{text("Procedures")}</th>
                            <th>{text("Visits")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                          <td> {this.calculateTopDentistVisits().dentist} </td>  <td>{this.calculateTopDentistProceduresCount()}</td>  <td>  {this.calculateTopDentistVisCount()
                            //  this.calculateTopDentistVisitsCount(this.calculateTopDentistVisits()._id)
                             } </td>
                          </tr>
                          <tr>
                            <td> {this.calculateTopDentistProcedures().dentist} </td>  <td>Procedures</td>  <td> {this.calculateTopDentistProceduresCount(this.calculateTopDentistProcedures().procedureId)} </td>
                          </tr> 
  
                          </tbody>
                          </table>
*/
import {
  Col,
  ProfileComponent,
  ProfileSquaredComponent,
  Row,
  SectionComponent,
  TagComponent,
  TagInputComponent,
  TagType,
} from "@common-components";
import { text, user, router } from "@core";
import {
  Appointment,
  appointments,
  ISOTeethArr,
  itemFormToString,
  Patient,
  InstructionItem,
  instructions,
  prescriptions,
  PrescriptionItem,
  setting,
  staff,
  Treatment,
  treatments,
  treatmentsNamespace,
  patients,
  Payment
  
} from "@modules";
import { convert, formatDate, num, round } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import {
  Checkbox,
  DatePicker,
  DefaultButton,
  Dropdown,
  Icon,
  IconButton,
  Label,
  Panel,
  PanelType,
  PrimaryButton,
  TextField,
  Toggle,
  TooltipHost
} from "office-ui-fabric-react";
import * as React from "react";

const TreatmentDiv = observer(
  ({ canEdit, appointment, treatmentOptions, index, title }) => (
    <>
      <Col sm={11}>
        <div className="appointment-input treatment">
          <Dropdown
            label={text(title[0])}
            disabled={canEdit}
            className="treatment-type"
            selectedKey={
              appointment.treatUnitGroup[index].treatment.split("|")[0]
            }
            options={treatmentOptions
              .sort((a: { item: string }, b: { item: any }) =>
                a.item.localeCompare(b.item)
              )
              .map((tr: { _id: any; item: any; fees: any }) => {
                return {
                  key: tr._id,
                  text: tr.item + "||" + tr.fees,
                };
              })}
            onChange={(e: any, newValue: any) => {
              appointment.treatUnitGroup[index].treatment =
                newValue!.key.toString() + "|" + newValue!.text.toString();
              appointment.treatUnitGroup[index].fees = Number(
                newValue!.text.split("||")[1]
              );

              console.log(
                "Appointment Treatment: " +
                appointment.treatUnitGroup[index].treatment
              );
              
              console.log(
                "Appointment Fees: " + appointment.treatUnitGroup[index].fees
              );

            }}
          />
        </div>
      </Col>
      <Col sm={11}>
        <div className="appointment-input units-number">
          <TextField
            label={text(title[1])}
            disabled={canEdit}
            type="number"
            value={appointment.treatUnitGroup[index].unit.toString()}
            onChange={(e, newValue) => {
              appointment.treatUnitGroup[index].unit = Number(newValue!);
              console.log(
                "Appointment Unit: " + appointment.treatUnitGroup[index].unit
              );
            }}
          />
        </div>
      </Col>
      <Col sm={2}>
        <div className="appointment-input units-number">
          <IconButton
            className="delete-button"
            iconProps={{
              iconName: "delete",
            }}
            onClick={() => {
              appointment.treatUnitGroup.splice(index, 1);
            }}
          />
        </div>
      </Col>
    </>
  )
);

@observer
export class AppointmentEditorPanel extends React.Component<
{
  appointment: Appointment | undefined | null;
  onDismiss: () => void;
  onDelete: () => void;
},
{ showPopup: boolean, dateString: string, checkinsurance: boolean }
> {
  @computed
  get patient() {
    return patients.list.find(
      (p) => p._id === this.props.appointment.patientID
    );
  }

  constructor(props: any) {
    super(props);
    this.state = {
      showPopup: false,
      dateString: '',
      checkinsurance: true
    }
  }

  @computed
  get patientInsurance() {
    const { appointment } = this.props;
    const patient = patients.list.find(
      (patientDetails) =>
        appointment && patientDetails._id === appointment.patientID
    );
    if (patient) {
      return patient.insurance;
    }
    return null;
  }
  @observable timerInputs: number[] = [];

  @observable viewTreatment: boolean = false;

  @observable timeComb: {
    hours: number;
    minutes: string;
    am: boolean;
  } = {
      hours: this.calcTime.hours,
      minutes: this.calcTime.minutes,
      am: this.calcTime.am,
    };

  @computed get calcTime() {
    if (!this.props.appointment) {
      return {
        hours: 12,
        minutes: "00",
        am: false,
      };
    }
    const timeString = new Date(this.props.appointment.date).toLocaleTimeString(
      "en-US"
    );

    const obj = {
      hours: Number(timeString.split(":")[0]),
      minutes: Number(timeString.split(":")[1]) < 30 ? "00" : "30",
      am: timeString.replace(/[^A-Z]/gi, "").toLowerCase() === "am",
    };
    return obj;
  }


  otherAppointmentData(): any[] {
    const appointment = this.props.appointment;
    if (!appointment) {
      return []
    }
    return appointments.appointmentsForDay(appointment.date, 0, 0).filter((a) => a._id !== appointment._id)
  }

  @computed
  get otherAppointmentsNumber() {
    const appointment = this.props.appointment;
    if (!appointment) {
      return [].length - 1;
    }
    return appointments
      .appointmentsForDay(appointment.date, 0, 0)
      .filter((a) => a._id !== appointment._id).length;
  }

  @computed
  get treatmentOptions() {
    const list: Treatment[] = JSON.parse(JSON.stringify(treatments.list));
    if (
      this.props.appointment &&
      this.props.appointment.treatmentID.indexOf("|") > -1
    ) {
      const arr = this.props.appointment.treatmentID.split("|");
      const _id = this.props.appointment.treatmentID;

      const type = arr[0];
      const expenses = num(arr[1]);
      list.push(new Treatment());
    }
    return list;
  }

  @computed
  get canEdit() {
    return user.currentUser.canEditAppointments;
  }

  setTimeFromCombination() {
    if (!this.props.appointment) {
      return;
    }
    if (this.timeComb.hours === 12) {
      this.timeComb.am = true;
    }
    const d = new Date(this.props.appointment.date);
    d.setHours(
      this.timeComb.am ? this.timeComb.hours : this.timeComb.hours + 12,
      Number(this.timeComb.minutes),
      0,
      0
    );
    this.props.appointment.date = d.getTime();
    this.forceUpdate();
  }

  checkIfAlreadyHasBooked = (date: any) => {
    const checkIfPresent = appointments.list.filter((obj) => new Date(obj.date).toDateString() === new Date(date).toDateString());
    if (checkIfPresent && checkIfPresent.length) {
      return checkIfPresent[0];
    }
    return false;
  }

  componentDidMount() {
    if (document.getElementsByClassName('ms-Overlay').length) {
      console.log('logged..1')
      setTimeout(() => {
        document.getElementsByClassName('ms-Overlay')[1].style.display = 'none'
      }, 500)
    }
  }

  

  getFormatedTimeString = (formatedTime: number) => {

    let hr: any = new Date(formatedTime).getHours();
    let min: any = new Date(formatedTime).getMinutes();
    let isPast = '';
    if (hr > 12) {
      hr = hr - 12;
      hr = (hr > 10) ? hr : '0' + hr;
      isPast = " PM";
    } else {
      isPast = " AM";
    }

    if (hr === 0) {
      hr = 12
    }

    if (min < 10) {
      min = '0' + min
    }

    return `${hr}:${min} ${isPast}`
  }

  render() {
    const insurance = this.patientInsurance;
    if (this.props.appointment) {
      console.log(
        "Treatment group:" + this.props.appointment!.treatUnitGroup.length
      );
    }

    return this.props.appointment ? (
      <React.Fragment>
        <div className={'sidenav'}>
          <div>
            <h1>Appointments on same day</h1>
          </div>
          <div className={'leftNav'}>
            <table>
              <tr>
              <th>Patient Id</th>
                <th>Patient Name</th>
                <th>Appointment Time</th>
                <th>Appointment Date</th>
              </tr>
              {
                this.otherAppointmentData() && this.otherAppointmentData().length ? this.otherAppointmentData().map((obj: any) => {
                  return <tr>
                     <td>{obj.patient._id}</td>
                    <td>{obj.patient.name}</td>
                    <td>{this.getFormatedTimeString(obj.date)}</td>
                    <td>{formatDate(
                      obj.date,
                      setting.getSetting("date_format"),
                      setting.getSetting("month_format")
                    )}</td>
                  </tr>
                }) : null
              }
            </table>
          </div>
        </div>
        <Panel
          isOpen={!!this.props.appointment}
          type={PanelType.medium}
          closeButtonAriaLabel="Close"
          isLightDismiss={false}
          onDismiss={this.props.onDismiss}
          onRenderNavigation={() => {
            return (
              <Row className="panel-heading">
                <Col span={22}>
                  <ProfileComponent
                    secondaryElement={
                      <span>
                        {formatDate(
                          this.props.appointment!.date,
                          setting.getSetting("date_format"),
                          setting.getSetting("month_format")
                        )}{" "}
                      /{" "}
                        {this.props.appointment
                          ? this.props.appointment.treatment
                            ? this.props.appointment.treatment.item
                            : ""
                          : ""}
                      </span>
                    }
                    name={
                      (
                        this.props.appointment!.patient || {
                          name: "",
                        }
                      ).name
                    }
                    size={3}
                  />
                </Col>
                <Col span={2} className="close">
                  <IconButton
                    iconProps={{ iconName: "cancel" }}
                    onClick={() => {
                      this.props.onDismiss();
                    }}
                  />
                </Col>
              </Row>
            );
          }}
        >
          {
            this.state.showPopup ? <div id="myModal" className="modal">
              <div className="modal-content">
                <div className="innerDiv">
                  <div>
                    <p>{`You have already booked an appointment on Selected date ${this.state.dateString}`}</p>
                  </div>
                  <div onClick={() => {
                    this.setState({
                      showPopup: false
                    }, () => {
                      const appointment = this.props.appointment;
                      appointments.deleteByID(appointment!._id);
                    })
                  }}>
                    X
              </div>
                </div>
              </div>
            </div> : null
          }
          <div className="appointment-editor">
            <SectionComponent title={text("Appointment")}>
              <Row gutter={12}>
                <Col sm={12}>
                  <div className="appointment-input date">
                    <DatePicker
                      label={text("Date")}
                      disabled={!this.canEdit}
                      className="appointment-date"
                      placeholder={text("Select a date")}
                      value={new Date(this.props.appointment!.date)}
                      onSelectDate={(date) => {
                        const checkIfAlreadyHasBooked: false | Appointment = false; //this.checkIfAlreadyHasBooked(date)
                        if (date && checkIfAlreadyHasBooked === false) {
                          this.props.appointment!.setDate(date.getTime());
                        }
                        //  else {
                        //   const date = checkIfAlreadyHasBooked && checkIfAlreadyHasBooked.date ? checkIfAlreadyHasBooked.date : '';
                        //   this.setState({
                        //     showPopup: true,
                        //     dateString: new Date(date).toDateString()
                        //   })
                        // }
                      }}
                      formatDate={(d) =>
                        formatDate(
                          d || 0,
                          setting.getSetting("date_format"),
                          setting.getSetting("month_format")
                        )
                      }
                    />
                    <p className="insight">
                      {text("With")}{" "}
                      <span className={"num-" + this.otherAppointmentsNumber}>
                        {this.otherAppointmentsNumber}
                      </span>{" "}
                      {text("other appointment")}
                    </p>
                  </div>
                </Col>
                <Col sm={12}>
                  <div className="appointment-input time">
                    <Row gutter={12}>
                      <Label>{text("Time")}</Label>
                      <Row gutter={0}>
                        <Col span={8}>
                          <Dropdown
                            options={[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(
                              (x) => ({
                                key: x.toString(),
                                text: x < 10 ? `0${x.toString()}` : x.toString(),
                              })
                            )}
                            selectedKey={this.calcTime.hours.toString()}
                            onChange={(ev, val) => {
                              if (val) {
                                this.timeComb.hours = Number(val.key.toString());
                                this.setTimeFromCombination();
                              }
                            }}
                          />
                        </Col>
                        <Col span={8}>
                          <Dropdown
                            options={["00", "30"].map((x) => ({
                              key: x,
                              text: x,
                            }))}
                            selectedKey={this.calcTime.minutes}
                            onChange={(ev, val) => {
                              if (val) {
                                this.timeComb.minutes = val.key.toString();
                                this.setTimeFromCombination();
                              }
                            }}
                          />
                        </Col>
                        <Col span={8}>
                          <Dropdown
                            options={[
                              {
                                text: "am",
                                key: "am",
                              },
                              {
                                text: "pm",
                                key: "pm",
                              },
                            ]}
                            selectedKey={this.calcTime.am ? "am" : "pm"}
                            onChange={(ev, val) => {
                              if (val) {
                                this.timeComb.am = val.key.toString() === "am";
                                this.setTimeFromCombination();
                              }
                            }}
                          />
                        </Col>
                      </Row>
                    </Row>
                  </div>
                </Col>
              </Row>
              <div className="appointment-input date">
                {
                  <TextField
                    label={text('Room Number')}
                    type="number"
                    value={this.props.appointment.roomNumber.toString()}
                    onChange={(e, newValue) => {
                      this.props.appointment.roomNumber = Number(newValue);
                    }}
                  />
                }
                <label>{text("Operating staff")} </label>
                {staff.list
                  .filter((member) => member.operates)
                  .map((member) => {
                    const checked =
                      this.props.appointment!.staffID.indexOf(member._id) > -1;
                    return (
                      <Checkbox
                        key={member._id}
                        label={member.name}
                        disabled={
                          !this.canEdit ||
                          (!checked &&
                            member.onDutyDays.indexOf(
                              new Date(
                                this.props.appointment!.date
                              ).toLocaleDateString("en-us", {
                                weekday: "long",
                              })
                            ) === -1)
                        }
                        checked={checked}
                        onChange={(ev, isChecked) => {
                          if (isChecked) {
                            this.props.appointment!.staffID.push(member._id);
                          } else {
                            this.props.appointment!.staffID.splice(
                              this.props.appointment!.staffID.indexOf(member._id),
                              1
                            );
                          }
                          this.props.appointment!.triggerUpdate++;
                        }}
                      />
                    );
                  })}
              </div>
            </SectionComponent>

            <SectionComponent title={text("Case Details")}>
              <TextField
                multiline
                disabled={!this.canEdit}
                label={text("Details")}
                value={this.props.appointment!.notes}
                onChange={(e, value) => {
                  this.props.appointment!.notes = value!;
                }}
              />
              <br />

              <Row gutter={12}>
                <Col span={24}>
                  {" "}
                  <div className="appointment-input involved-teeth">
                    <TagInputComponent
                      disabled={!this.canEdit}
                      placeholder={text("Involved teeth")}
                      value={this.props.appointment!.involvedTeeth.map((x) => ({
                        key: x.toString(),
                        text: x.toString(),
                      }))}
                      strict={true}
                      options={ISOTeethArr.map((x) => {
                        return {
                          key: x.toString(),
                          text: x.toString(),
                        };
                      })}
                      formatText={(x) =>
                        `${x.toString()} - ${convert(num(x)).Palmer}`
                      }
                      onChange={(newValue) => {
                        this.props.appointment!.involvedTeeth = newValue.map(
                          (x) => num(x.key)
                        );
                      }}
                    />
                  </div>
                </Col>

                <DefaultButton
                  text="Add Lab Order"
                  allowDisabledFocus
                  onClick={(e) => {
                    var ddoi = { treatment: "", unit: 0, fees: 0 };
                    this.props.appointment!.treatUnitGroup.push(ddoi);
                  }}
                />{" "}
              &nbsp;&nbsp;&nbsp;&nbsp;
              <DefaultButton
                  text="Create Lab Order"
                  allowDisabledFocus
                  onClick={(e) => {
                    router.go([treatmentsNamespace]);
                  }}
                />
                <br /> <br />
                {this.props.appointment!.treatUnitGroup &&
                  this.props.appointment!.treatUnitGroup.map((item, i) => {
                    if (i <= 0) {
                      var title = ["Lab Order", "Unit Number"];
                      return (
                        <TreatmentDiv
                          key={i}
                          index={i}
                          appointment={this.props.appointment!}
                          treatmentOptions={this.treatmentOptions}
                          canEdit={!this.canEdit}
                          title={title}
                        />
                      );
                    } else {
                      var title = ["", ""];
                      return (
                        <TreatmentDiv
                          key={i}
                          index={i}
                          appointment={this.props.appointment!}
                          treatmentOptions={this.treatmentOptions}
                          canEdit={!this.canEdit}
                          title={title}
                        />
                      );
                    }
                  })}
              </Row>

              {setting.getSetting("module_prescriptions") ? (
                <div>
                  <hr className="appointment-hr" />
                  <div className="appointment-input prescription">
                    <TagInputComponent
                      disabled={!this.canEdit}
                      className="prescription"
                      value={this.props.appointment!.prescriptions.map((x) => ({
                        key: x.id,
                        text: x.prescription,
                      }))}
                      options={prescriptions.list.map(
                        this.prescriptionToTagInput
                      )}
                      onChange={(newValue) => {
                        this.props.appointment!.prescriptions = newValue.map(
                          (x) => ({
                            id: x.key,
                            prescription: x.text,
                          })
                        );
                      }}
                      strict={true}
                      placeholder={text("Prescription")}
                    />
                  </div>

                  <div id="prescription-items">
                    <div className="print-heading">
                      <h2>{user.currentUser.name}</h2>
                      <hr />
                      <h3>
                        Patient:{" "}
                        {(this.props.appointment!.patient || new Patient()).name}
                      </h3>
                      <Row>
                        <Col span={12}>
                          <h4>
                            Age:{" "}
                            {
                              (this.props.appointment!.patient || new Patient())
                                .age
                            }
                          </h4>
                        </Col>
                        <Col span={12}>
                          <h4>
                            Gender:{" "}
                            {(this.props.appointment!.patient || new Patient())
                              .gender
                              ? "Female"
                              : "Male"}
                          </h4>
                        </Col>
                      </Row>
                      <hr />
                    </div>
                    {this.props.appointment!.prescriptions.map((item) => {
                      return (
                        <Row key={item.id}>
                          <Col span={20} className="m-b-5">
                            <ProfileSquaredComponent
                              text={item.prescription.split(":")[0]}
                              onRenderInitials={() => <Icon iconName="pill" />}
                              subText={item.prescription.split(":")[1]}
                            />
                          </Col>
                          <Col
                            span={4}
                            style={{
                              textAlign: "right",
                            }}
                          >
                            {this.canEdit ? (
                              <IconButton
                                iconProps={{
                                  iconName: "delete",
                                }}
                                onClick={() => {
                                  this.props.appointment!.prescriptions = this.props.appointment!.prescriptions.filter(
                                    (x) => x.id !== item.id
                                  );
                                }}
                              />
                            ) : (
                                ""
                              )}
                          </Col>
                        </Row>
                      );
                    })}
                  </div>

                  {this.props.appointment!.prescriptions.length ? (
                    <DefaultButton
                      onClick={print}
                      iconProps={{ iconName: "print" }}
                      text={text("Print prescription")}
                    />
                  ) : (
                      ""
                    )}
                </div>
              ) : (
                  ""
                )}

            
            {setting.getSetting("module_instructions") ? (
                <div>
                  <hr className="appointment-hr" />
                  <div className="appointment-input prescription">
                    <TagInputComponent
                      disabled={!this.canEdit}
                      className="prescription"
                      value={this.props.appointment!.instructions.map((x) => ({
                        key: x.id,
                        text: x.instruction,
                      }))}
                      options={instructions.list.map(
                        this.instructionToTagInput
                      )}
                      onChange={(newValue) => {
                        this.props.appointment!.instructions = newValue.map(
                          (x) => ({
                            id: x.key,
                            instruction: x.text,
                          })
                        );
                      }}
                      strict={true}
                      placeholder={text("Instruction")}
                    />
                  </div>

                  <div id="prescription-items">
                    <div className="print-heading">
                      <h2>{user.currentUser.name}</h2>
                      <hr />
                      <h3>
                        Patient:{" "}
                        {(this.props.appointment!.patient || new Patient()).name}
                      </h3>
                      <Row>
                        <Col span={12}>
                          <h4>
                            Age:{" "}
                            {
                              (this.props.appointment!.patient || new Patient())
                                .age
                            }
                          </h4>
                        </Col>
                        <Col span={12}>
                          <h4>
                            Gender:{" "}
                            {(this.props.appointment!.patient || new Patient())
                              .gender
                              ? "Female"
                              : "Male"}
                          </h4>
                        </Col>
                      </Row>
                      <hr />
                    </div>
                    {this.props.appointment!.instructions.map((item) => {
                      return (
                        <Row key={item.id}>
                          <Col span={20} className="m-b-5">
                            <ProfileSquaredComponent
                              text={item.instruction}
                              onRenderInitials={() => <Icon iconName="AutoFillTemplate" />}
                             
                            />
                          </Col>
                          <Col
                            span={4}
                            style={{
                              textAlign: "right",
                            }}
                          >
                            {this.canEdit ? (
                              <IconButton
                                iconProps={{
                                  iconName: "delete",
                                }}
                                onClick={() => {
                                  this.props.appointment!.instructions = this.props.appointment!.instructions.filter(
                                    (x) => x.id !== item.id
                                  );
                                }}
                              />
                            ) : (
                                ""
                              )}
                          </Col>
                        </Row>
                      );
                    })}
                  </div>

                
                </div>
              ) : (
                  ""
                )}
            </SectionComponent>

            <SectionComponent title={text("Expenses & Price")}>
              <Row gutter={12}>
                <Col sm={16}>
                  
                  {setting.getSetting("time_tracking") ? (
                    <div className="appointment-input time">
                      <label>{text("Time (hours, minutes, seconds c)")}</label>
                      <TextField
                        className="time-input hours"
                        type="number"
                        disabled={!this.canEdit}
                        value={
                          this.formatMillisecondsToTime(
                            this.props.appointment!.time
                          ).hours
                        }
                        onChange={(e, v) => { 
                          this.timerInputs[0] = num(v!);
                         this.manuallyUpdateTime();
                        }}
                      />
                      <TextField
                        className="time-input minutes"
                        type="number"
                        disabled={!this.canEdit}
                        value={
                          this.formatMillisecondsToTime(
                            this.props.appointment!.time
                          ).minutes
                        }
                        onChange={(e, v) => {
                           this.timerInputs[1] = num(v!);
                         this.manuallyUpdateTime();
                          console.log( " minutes changed: "+ num(v!) )
                        }}
                      />
                      <TextField
                        className="time-input seconds"
                        type="number"
                        disabled={!this.canEdit}
                        value={
                          this.formatMillisecondsToTime(
                            this.props.appointment!.time
                          ).seconds
                        }
                        onChange={(e, v) => {
                          this.timerInputs[2] = num(v!);
                          this.manuallyUpdateTime();
                        }}
                      />
                      {this.props.appointment!.timer ? (
                        <PrimaryButton
                          iconProps={{
                            iconName: "Timer",
                          }}
                          disabled={!this.canEdit}
                          className="appendage stop"
                          text={text("Stop")}
                          onClick={() => {
                            const timer = this.props.appointment!.timer;
                            if (timer) {
                              clearInterval(timer);
                            }
                            this.props.appointment!.timer = null;
                          }}
                        />
                      ) : (
                          <PrimaryButton
                            iconProps={{
                              iconName: "Timer",
                            }}
                            disabled={!this.canEdit}
                            className="appendage"
                            text={text("Start")}
                            onClick={() => {
                              const i = appointments.getIndexByID(
                                this.props.appointment!._id
                              );
                              const appointment = appointments.list[i];
                              this.props.appointment!.timer = window.setInterval(
                                () => {
                                  appointment.time = appointment.time + 1000;
                                },
                                1000
                              );
                            }}
                          />
                        )}
                      <p className="payment-insight">
                        <TagComponent
                          text={
                            text("Time value") +
                            ": " +
                            setting.getSetting("currencySymbol") +
                            round(
                              this.props.appointment!.spentTimeValue
                            ).toString()
                          }
                          type={TagType.info}
                        />
                        <br />
                        <TagComponent
                          text={
                            text("Expenses") +
                            ": " +
                            setting.getSetting("currencySymbol") +
                            round(this.props.appointment!.totalExpenses).toString()
                          }
                          type={TagType.info}
                        />
                      </p>
                    </div>
                  ) : (
                      ""
                    )}
                </Col>
                <Col sm={24}>
                  <div className="appointment-input paid">
                    <Row gutter={12}>
                      <Col sm={8}>
                        <TextField
                          type="number"
                          disabled={!this.canEdit}
                          label={text("Price")}
                          value={this.props.appointment!.finalPrice.toString()}
                          onChange={(e, newVal) => {
                            this.props.appointment!.finalPrice = num(newVal!);
                          }}
                          prefix={setting.getSetting("currencySymbol")}
                        />
                      </Col>
                      <Col sm={8}>
                        <TextField
                          type="number"
                          disabled={!this.canEdit}
                          label={text("Paid")}
                          value={this.props.appointment!.paidAmount.toString()}
                          onChange={(e, newVal) => {
                            this.props.appointment!.paidAmount = num(newVal!);
                          }}
                          prefix={setting.getSetting("currencySymbol")}
                        />
                      </Col>
                      <Col sm={8}>
                        <TextField
                          type="number"
                          disabled={true}
                          label={
                            this.props.appointment!.outstandingAmount > 0
                              ? text("Outstanding")
                              : this.props.appointment!.overpaidAmount
                                ? text("Overpaid")
                                : text("Outstanding")
                          }
                          value={
                            this.props.appointment!.outstandingAmount > 0
                              ? this.props.appointment!.outstandingAmount.toString()
                              : this.props.appointment!.overpaidAmount
                                ? this.props.appointment!.overpaidAmount.toString()
                                : this.props.appointment!.outstandingAmount.toString()
                          }
                          prefix={setting.getSetting("currencySymbol")}
                        />
                      </Col>
                    </Row>

                    <Row gutter={12}>
                      <Col sm={8}>
                        <TextField
                          type="number"
                          disabled={!this.canEdit}
                          label={text("Discount")}
                          value={this.props.appointment!.discount.toString()}
                          onChange={(e, newVal) => {
                            this.props.appointment!.discount = num(newVal!);
                          }}
                          prefix={"%"}
                        />
                      </Col>
                      {insurance && (
                        <>
                        <Col sm={8}>
                          <TextField
                            type="number"
                            disabled={true}
                            label={text(`Insurance : ${insurance.name}`)}
                            value={insurance.discount.toString()}
                            
                            prefix={"%"}
                          />
                        </Col>

                        <Col sm={4}>
                        <TooltipHost content={text("Enable/Disable insurance")}>
                                <Checkbox checked={this.props.appointment!.cinsurance}
                                                      onChange={
                                                          (event, value) => {                                                           
                                                            /*  if (value) {                                                               
                                                                this.setState({ checkinsurance: value});
                                                              } else {
                                                                this.setState({ checkinsurance: value});                                                              
                                                              }*/
                                                              this.props.appointment!.cinsurance = value;
                                                          }
                                    } />
                        </TooltipHost> 
                      </Col>
                       </>
                      )}
                    </Row>

                    <p className="payment-insight">
                      <TagComponent
                        text={
                          text("Profit") +
                          ": " +
                          setting.getSetting("currencySymbol") +
                          round(this.props.appointment!.profit).toString()
                        }
                        type={TagType.success}
                      />
                      <br />
                      <TagComponent
                        text={
                          text("Profit percentage") +
                          ": " +
                          round(
                            this.props.appointment!.profitPercentage * 100
                          ).toString() +
                          "%"
                        }
                        type={TagType.success}
                      />
                    </p>
                  </div>
                </Col>
              </Row>
              {/* <Row gutter={12}>
              <Col sm={24}>
                <Toggle
                  defaultChecked={this.props.appointment!.isDone}
                  onText={text("Done")}
                  offText={text("Not done")}
                  disabled={!this.canEdit}
                  onChange={(e, newVal) => {
                    this.props.appointment!.isDone = newVal!;
                  }}
                />
              </Col>
            </Row> */}
            
            {/*  <Row gutter={12}>
                <Col sm={24}>
                  <Dropdown
                    label={text("Status")}
                    options={[
                      "Unconfirmed",
                      "Confirmed",
                      "Checked In",
                      "In Progress",
                      "Completed",
                      "Cancelled",
                      "Missed",
                    ].map((x) => ({
                      key: x.toString(),
                      text: x.toString(),
                    }))}
                    selectedKey={this.props.appointment!.status}
                    onChange={(ev, val) => {
                      if (val.key.toString() === "Completed") {
                        this.props.appointment!.isDone = true;
                      } else {
                        this.props.appointment!.isDone = false;
                      }
                      if (this.patient && this.patient.procedures) {
                        const newPro: any = this.patient.procedures.map((pro) => {
                          if (pro.id === this.props.appointment.procedureId) {
                            pro.status = val.key.toString();
                          }
                          return pro;
                        });
                        this.patient.procedures = newPro;
                      }
                      this.props.appointment!.status = val.key.toString();
                    }}
                  />
                </Col>
                  </Row> */} 
            </SectionComponent>

            <br />

            {/* this.canEdit ? (
              <PrimaryButton
                className="delete"
                iconProps={{
                  iconName: "delete",
                }}
                text={text("Delete")}
                onClick={() => {
                  const appointment = this.props.appointment;
                  appointments.deleteModal(appointment!._id);
                  this.props.onDelete();
                }}
              />
            ) : (
                ""
            )*/}

            <br />
            <br />
            <br />
          </div>
        </Panel>
      </React.Fragment>
    ) : (
        <div />
      );
  }
  formatMillisecondsToTime(ms: number) {
    const msInSecond = 1000;
    const msInMinute = msInSecond * 60;
    const msInHour = msInMinute * 60;
    const hours = Math.floor(ms / msInHour);
    const minutes = Math.floor((ms % msInHour) / msInMinute);
    const seconds = Math.floor(((ms % msInHour) % msInMinute) / msInSecond);
    return {
      hours: padWithZero(hours),
      minutes: padWithZero(minutes),
      seconds: padWithZero(seconds),
    };
    function padWithZero(n: number) {
      return n > 9 ? n.toString() : "0" + n.toString();
    }
  }
  
  manuallyUpdateTime() {
    const msInSecond = 1000;
    const msInMinute = msInSecond * 60;
    const msInHour = msInMinute * 60;
    const hours = this.timerInputs[0];
    const minutes = this.timerInputs[1];
    const seconds = this.timerInputs[2];
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
      return;
    }
    this.props.appointment!.time =
      hours * msInHour + minutes * msInMinute + seconds * msInSecond;
  }
  prescriptionToTagInput(p: PrescriptionItem) {
    return {
      key: p._id,
      text: `${p.name}: ${p.doseInMg}${text("mg")} ${p.timesPerDay}X${
        p.unitsPerTime
        } ${text(itemFormToString(p.form))}`,
    };
  }
  instructionToTagInput(p: InstructionItem) {
    return {
      key: p._id,
      text: `${p.name}`
    };
  }
}

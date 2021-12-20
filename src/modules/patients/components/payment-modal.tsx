import * as React from "react";
import { getId } from "office-ui-fabric-react/lib/Utilities";
import {
  Modal,
  IconButton,
  DatePicker,
  TextField,
  Button,
  Icon,
  Dropdown,
  TooltipHost,
  Panel,
  PanelType,
  Checkbox,
} from "office-ui-fabric-react";
import { Col, Row, ProfileComponent,AsyncComponent } from "@common-components";
import {
  Patient,
  Payment,
  PatientAppointmentsPanel,  
  appointments, 
  Appointment,
  setting,
  staff
} from "@modules";
import { text, user } from "@core";
import { computed } from "mobx";
import { num, roundval } from "@utils";


/**
 * 
 * 
 * 
 */

export class PaymentModal extends React.Component<
  {
    onClick: () => void;
    patient: Patient;
    appoint?: Appointment;
  },
  {}
> {
  state = {
    openAppointment: false,
    openInsurance: false,
    discount: 0,
    insurance: 0,
    paidFees: 0,
    finalprice: 0,
    description: "",
    date: new Date(),
    receipt: 1,
    doctors: [],
    doctorselect: "",
    dueRemaining: "",
    checkinsurance: true,
    selectedAppointmentId: ""
  };
  private _titleId: string = getId("title");
  private _subtitleId: string = getId("subText");
  private _appoint: Appointment = undefined

  @computed
  get appointment() {
    return appointments.list.find(
      app => app._id === this.state.selectedAppointmentId
    );
  }

  @computed get staffID() {
		return user.currentUser._id;
	}

  findappointment(id: String){
    return appointments.list.find(
      app => app._id === id
    );
  }

  componentDidMount(){
      if (this.props.appoint){
        this._appoint = this.props.appoint;

          this.setState({
            dueRemaining: this._appoint.outstandingAmount.toString(),
            description: this._appoint.notes,
            doctors: staff.list.map(function (item) {
                return item['name'];
            }),
            finalprice: this._appoint.finalPrice,
            selectedAppointmentId: this._appoint._id,
            discount: this._appoint.discount
          });          
      }      

      this.setState({
        doctors:  staff.list.map(function(item) {
          return item['name'];
        }),
      })
  }

  componentDidUpdate(prevProps, prevState) {
    
   /* if (prevState.discount !== this.state.discount){
      this._appoint.discount = this.state.discount
    }*/

    if (prevState.paidFees !== this.state.paidFees){
        
        if (!this._appoint){
          if (this.state.checkinsurance){
            this.setState({
              dueRemaining: num(this.state.finalprice) - num(this.state.paidFees) - ( num(this.props.patient.insurance.discount) * 0.01 * num(this.state.finalprice) )
            });
          }
          else{
            this.setState({
              dueRemaining: num(this.state.finalprice) - num(this.state.paidFees) 
            });
          }         
        }

        if (this._appoint){
          this.setState({
            dueRemaining: num(this._appoint.outstandingAmount) - num(this.state.paidFees)
          })
        }
    }

    if (prevState.finalprice !== this.state.finalprice){
      if (!this._appoint){
        if (this.state.checkinsurance){
          this.setState({
            dueRemaining: num(this.state.finalprice) - num(this.state.paidFees) - ( num(this.props.patient.insurance.discount) * 0.01 * num(this.state.finalprice) )
          });
        }
        else{
          this.setState({
            dueRemaining: num(this.state.finalprice) - num(this.state.paidFees)
          })
        }        
      }
    }

    if (prevState.checkinsurance !== this.state.checkinsurance){
      if (!this._appoint){
          if(this.state.checkinsurance === true){
            this.setState({
              dueRemaining: roundval ( num(this.state.finalprice) - ( num(this.props.patient.insurance.discount) * 0.01 * num(this.state.finalprice) ) - num(this.state.paidFees) , 2)
            })
          }
          else{
            this.setState({
              dueRemaining: num(this.state.finalprice) - num(this.state.paidFees)
            })
          }
      }
    }

    if (prevState.discount !== this.state.discount){      
      if (!this._appoint){         
            this.setState({
              dueRemaining:  roundval ( num(this.state.finalprice) - ( num(this.props.patient.insurance.discount) * 0.01 * num(this.state.finalprice) ) - ( num(this.state.discount) * 0.01 * num(this.state.finalprice) ) - num(this.state.paidFees), 2)
            }) 
      }
    }

  }

  render() {
    const { onClick } = this.props;
    return (
      <div>
        <Panel
          isOpen={this.state.openAppointment}
          type={PanelType.medium}
          customWidth={"100%"}
          closeButtonAriaLabel="Close"
          isLightDismiss={true}
          onDismiss={() => {
            this.setState({ openAppointment: false });
          }}
          onRenderNavigation={() => {
            return (
              <Row className="panel-heading">
                <Col span={22}>
                  <ProfileComponent
                    name={this.props.patient!.name}
                    secondaryElement={<div>{text("Patient Appointments")}</div>}
                    size={3}
                  />
                </Col>
                <Col span={2} className="close">
                  <IconButton
                    iconProps={{ iconName: "cancel" }}
                    onClick={() => {
                      this.setState({ openAppointment: false });
                    }}
                  />
                </Col>
              </Row>
            );
          }}
        >
          <PatientAppointmentsPanel patient={this.props.patient} />
        </Panel>

        <Panel
          isOpen={this.state.openInsurance}
          type={PanelType.medium}
          customWidth={"100%"}
          closeButtonAriaLabel="Close"
          isLightDismiss={true}
          onDismiss={() => {
            this.setState({ openInsurance: false });
          }}
          onRenderNavigation={() => {
            return (
              <Row className="panel-heading">
                <Col span={22}>
                  <ProfileComponent
                    name={this.props.patient!.name}
                    secondaryElement={<div>{text("Patient Insurance")}</div>}
                    size={3}
                  />
                </Col>
                <Col span={2} className="close">
                  <IconButton
                    iconProps={{ iconName: "cancel" }}
                    onClick={() => {
                      this.setState({ openInsurance: false });
                    }}
                  />
                </Col>
              </Row>
            );
          }}
        >
           <AsyncComponent
                key=""
                loader={async () => {
                  const Component = (await import("../../insurance/components/page.insurance")).Insurances;
                  return <Component />;
                }}
              />
        </Panel>

        <Modal
          titleAriaId={this._titleId}
          subtitleAriaId={this._subtitleId}
          isOpen={true}
          onDismiss={onClick}
          isBlocking={false}
          containerClassName="container"
        >
          <div className="modal-header">
            <span id={this._titleId}>Cash</span>
            <IconButton
              iconProps={{ iconName: "Cancel" }}
              ariaLabel="Close popup modal"
              onClick={onClick}
            />
          </div>
          <div id={this._subtitleId} style={{ padding: "10px" }}>
            <Row gutter={12}>
              <Col sm={16}>
                <h4>Payment</h4>
              </Col>
              <Col sm={5}>
                <Row gutter={6}>
                  <Col sm={3}>On</Col>
                  <Col sm={20}>
                    <DatePicker value={this.state.date} />
                  </Col>
                </Row>
              </Col>

             {/* <Col sm={3}>
                <Row gutter={12}>
                  <Col sm={12}>Receipt#</Col>
                  <Col sm={12}>{Payment.triggerUpdate}</Col>
                </Row>
        </Col> */}

            </Row>
            <Row gutter={12}>

              <Col sm={4}>
                <TextField
                  type="text"
                  label= { Number(this.state.dueRemaining) < 0 ? "Overpaid" : "Due Remaining" }                
                  disabled={ true }
                  value={ Number(this.state.dueRemaining) > 0 ?  setting.getSetting("currencySymbol") + this.state.dueRemaining : ( setting.getSetting("currencySymbol") + Math.abs( Number(this.state.dueRemaining) + ( num(this.props.patient.insurance.discount) * 0.01 * num(this.state.finalprice) ) ) )  }                
                />
                {/* - ( num(this.props.patient.insurance.discount) * 0.01 * num(this.state.finalprice) ) */}
              </Col>

              <Col sm={6}>
                <TextField
                  type="number"
                  placeholder="Payment"
                  label="Payment"                  
                  onChange={(e, newValue) => {              
                          this.setState({
                              paidFees: newValue
                            })   
                  }}
                />
              </Col>

              <Col sm={4}>
                <TextField
                  type="number"
                  label="Price"                 
                  disabled={this._appoint ? true : false }
                  value={this.state.finalprice.toString()}
                  onChange={(e, newValue) => {                         
                    this.setState({
                        finalprice: newValue
                      });
                }}
                />
              </Col>

            </Row>

            <Row gutter={12}>
              <Col sm={24}>
                <TextField
                  value={this.state.description}
                  placeholder="Description"
                  onChange={(e, newValue) => {
                    this.setState({ description: newValue });
                  }}
                />
              </Col>
            </Row>

            <Row gutter={12}>

              <Col sm={12}>
                <Row gutter={12}>
                  <Col sm={4}>Patient</Col>
                  <Col sm={12}>
                    <TextField
                      
                      placeholder="Patient"
                      value={this.props.patient.name}
                    />
                  </Col>
                </Row>
              </Col>

              <Col sm={12}>
                <Row gutter={12}>
                  <Col className="abcd" sm={4}>
                    Discount
                  </Col>
                  <Col sm={12}>
                    <TextField                      
                      value={this.state.discount.toString()}
                      placeholder="Discount"
                      type="number"
                      prefix="%"
                      disabled={ this._appoint ? true : false }
                      onChange={(e, newValue) => { 
                        this.setState({ discount : newValue })
                      //  this._appoint.discount = this.state.discount;
                      }}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row gutter={12}>
              <Col sm={12}>
                <Row gutter={12}>
                  <Col sm={4}>Dentist</Col>
                  <Col sm={12}>
                    <Dropdown                     
                      placeholder="Dentist"
                      defaultSelectedKeys={this.state.doctors}
                      multiSelect
                      options={this.state.doctors.map(v => ({
                        key: v,
                        text: v
                      }))}
                      onChange={(e, newValue) => { 
                          this.setState({ doctorselect : newValue })
                      }}
                    />
                  </Col>
                </Row>
              </Col>
              {/** this.props.patient.insurance
                          ? this.props.patient.insurance.discount.toString()
                          : "" */}
              <Col sm={12}>
                <Row gutter={12}>
                  <Col sm={4}>Insurance</Col>
                  <Col sm={12}>
                    <TextField
                     disabled={true}
                     value={
                       this.props.patient.insurance
                         ? this.props.patient.insurance.discount.toString()
                         : ""
                     }
                     placeholder="Insurance"
                     onChange={(e, newValue) => { 
                       this.setState({ insurance : newValue })
                     }}
                      prefix="%"
                      type="number"
                    />
                  </Col>
                  <Col sm={4}>
                      <TooltipHost content={text("Enable insurance")}>
                              <Checkbox checked={this.state.checkinsurance}
                                                    onChange={
                                                        (event, value) => {                                                           
                                                            if (value) {                                                               
                                                              this.setState({ checkinsurance: value});
                                                            } else {
                                                              this.setState({ checkinsurance: value});                                                              
                                                            }
                                                        }
                                  }/>
                      </TooltipHost> 
                  </Col>

                  <Col sm={2}>
                    <TooltipHost content={text("Add Insurance")}>
                      <IconButton
                        iconProps={{ iconName: "Add" }}
                        onClick={() => {
                          this.setState({ openInsurance: true });
                        }}
                      />
                    </TooltipHost>
                  </Col>

                </Row>
              </Col>
            </Row>


            <Row gutter={12}>
              <Col sm={12}>
                <Row gutter={12}>
                  <Col sm={4}>
                    <Button
                      disabled={
                        false
                      }
                      onClick={() => {
                        if ( num(this.state.finalprice) === 0 || num(this.state.paidFees) === 0 ) {
                            alert("Please enter Price and Payment Fields before Proceeding. Thank you. ");
                            return;
                        }
                      //  this.appointment.notes = this.state.description;
                      if (!this._appoint){
                          const apt = new Appointment();
                          if (this.state.checkinsurance === false){
                            apt.insuranceDetails.discount = 0;
                          }                          
                          apt.patientID = this.props.patient._id;
                          apt.date = new Date().getTime();
                          apt.staffID.push(this.staffID)
                          apt.paidAmount = num(this.state.paidFees);
                          apt.finalPrice = num(this.state.finalprice);
                          apt.discount = num(this.state.discount);
                          apt.notes = "Added Payment for Unknown New Appointment";                        
                          appointments.list.push(apt);
                          onClick();
                        return;
                      }
                     
                      if (this.state.checkinsurance === false){
                        this._appoint.paidAmount += num(this.state.paidFees) + num( (this.props.patient.insurance.discount / 100) * this._appoint.finalPrice ) - num( (this.state.discount / 100) * this._appoint.finalPrice );
                      }
                      else{
                        this._appoint.paidAmount += num(this.state.paidFees) - num( (this.state.discount / 100) * this._appoint.finalPrice );
                      }
                        this._appoint.date = new Date().getTime();
                        onClick();
                      }}
                    >
                      <Icon iconName="CheckMark" />
                          Ok
                    </Button>
                  </Col>

                  { /* bainty john
                  
                    this.state.selectedAppointmentId && this.state.paidFees
                          ? false
                          : true
                  <Col sm={4}>
                    <Button disabled>
                      <Icon iconName="Print" />
                      Print
                    </Button>
                    </Col> */}

                  <Col sm={4}>
                    <Button onClick={onClick}>
                      <Icon iconName="Cancel" />
                      Cancel
                    </Button>
                  </Col>
                </Row>
              </Col>

            {/*  <Col sm={12} style={{ display: this.props.appoint ? 'none' : 'block' }}>
                <Row gutter={12}>
                  <Col sm={4}>Appointment</Col>
                  <Col sm={12}>
                    <Dropdown
                      placeholder="Appointment"
                      options={this.props.patient.appointments.map(v => ({
                        key: v._id,
                        text: new Date(v.date).toString()
                      }))}
                      onChange={(e, value: any) => {
                        if (value){
                          let val = this.findappointment(value.key)
                          this._appoint = val;
                      
                          this.setState({ 
                              dueRemaining: val.outstandingAmount.toString(),
                              doctors:  staff.list.map(function(item) {
                                return item['name'];
                              }),
                              selectedAppointmentId: val._id,
                              discount: val.discount,
                              finalprice: val.finalPrice,
                              description: val.notes,
                              insurance:  this.props.patient.insurance.discount 
                          });
                        }                       
                      }}
                    />
                   
                  </Col>
                  <Col sm={4}>
                    <TooltipHost content={text("Add appointment")}>
                      <IconButton
                        iconProps={{ iconName: "Add" }}
                        onClick={() => {
                          this.setState({ openAppointment: true });
                        }}
                      />
                    </TooltipHost>
                  </Col>
                 
                </Row>
              </Col>

              */}
            </Row> 
          </div>
        </Modal>
      </div>
    );
  }
}

import "rc-collapse/assets/index.css";
import {
  AsyncComponent,
  Col,
  ProfileComponent,
  Row,
  SectionComponent
} from "@common-components";
import { text, user } from "@core";
import {
  conditionToColor,
  Patient,
  ToothCondition,
  Diagnosis,
  procedures,
  procedureList,
  orthoCases,
  appointments
} from "@modules";
import { EditableListComponent } from "common-components/editable-list/editable-list";
import { computed, observable, values } from "mobx";
import { observer } from "mobx-react";
import {
  Dropdown,
  IconButton,
  Panel,
  PanelType,
  Toggle,
  Button,
  TextField,
  TooltipHost
} from "office-ui-fabric-react";
import * as React from "react";
import Select from "react-dropdown-select";
import Collapse, { Panel as CustomePanel } from "rc-collapse";
import { Row as BTRow, Col as BTCol } from "react-bootstrap";
import { Procedures } from "../data";
import { max } from "date-fns";
import { TeethPermanentChart } from "./teeth-permanent";
import { OrthoCase } from "modules/orthodontic";
import { TeethDeciduousChart } from './teeth-deciduous';
import { Diagnosis as diagnosisData } from '../data/enum.toothCondition';

interface MyProps {
  patient: Patient;
  missingList: Array<any>;
  impactedList: Array<any>;
  parentMissinghandle: (arraylist: any) => void;
  parentImpactedhandle: (arraylist: any) => void;
  // orthoCase: OrthoCase;
  toggleProcedureTable: () => void;
}

interface MyState {
  printview: string;
  showDiagnosis: boolean;
  showProcedure: boolean;
  activeKey: any[];
  accordion: boolean;
  currentProcedureIndex: number;
  selectedProcedure: any;
  selectedTeeth: number[];
  saveProcedureSeparate: boolean;
  searchProcedureText: string;
  isMissing: boolean;
  isImpacted: boolean;
  isOrthodonticTabOpen: boolean;
  selectedOrthoId: string;
  firstRendering: boolean;
  keyValue: number;
  checkprocedure:boolean;
  forceOpen:boolean;
  // missingList: any[];
  // impactedList:any[];
   refreshList:boolean;
   classProcedure: boolean;
}

//function createRef<T>(): RefObject<T>
var classProcedure = '';
@observer
export class DentalHistoryPanel extends React.Component<
{ patient: Patient; toggleProcedureTable: () => void },
MyState
> {
  constructor(props: MyProps) {
    super(props);
    this.state = {
      printview: "",
      showDiagnosis: false,
      showProcedure: false,
      activeKey: [],
      accordion: false,
      currentProcedureIndex: 0,
      selectedProcedure: {},
      selectedTeeth: [],
      saveProcedureSeparate: true,
      searchProcedureText: "",
      isMissing: true,
      isImpacted: false,
      isOrthodonticTabOpen: false,
      selectedOrthoId: "",
      firstRendering: false,
      keyValue: 0,
      checkprocedure:false,
      forceOpen:true,
      classProcedure:false,
      // missingList:[],
      // impactedList:[],
       refreshList:false
    };
  }

  @observable viewChart: boolean = true;
  @observable viewToothISO: number = 0;
  @observable triggerUpdate: number = 0;
  //@observable classProcedure: string = "";

  @computed get canEdit() {
    return user.currentUser.canEditPatients;
  }

  onChange = (activeKey: any) => {
        this.setState({
      activeKey
    });
  };

  @computed get selectedOrthoCase() {
    return orthoCases.list.find(
      ortho => ortho._id === this.state.selectedOrthoId
    );
  }

  componentWillMount() {
    this.viewToothISO = 0;
  }
  selectedListclear=()=>{
    this.setState({
      selectedTeeth:[]
          })
  }
  onMissingClicked=(selectedlList : any)=>{
    
    let arrmislist=this.props.missingList;
    selectedlList.map((e)=>
    {
     if((this.props.missingList.length === 0 || !this.props.missingList.some(el => el === e))&&(!this.props.impactedList.some(el => el === e))){
      arrmislist.push(e)
     }
     else{
      const index = arrmislist.indexOf(e, 0);
      if (index > -1) {
        arrmislist.splice(index, 1);
      }
     }
    } )
    this.props.parentMissinghandle(arrmislist)
    this.setState({
     
      selectedlList:[],
      selectedTeeth:[],
      refreshList:!this.state.refreshList
    })
  }
  onImpactedClicked=(selectedlList : any)=>{
    const {impactedList,missingList}=this.props
    let arrmislist=this.props.impactedList;
    selectedlList.map((e)=>
    {
     if((impactedList.length === 0 || !impactedList.some(el => el === e))&&(!missingList.some(el => el === e))){
      arrmislist.push(e)
     }
     else{
      const index = arrmislist.indexOf(e, 0);
      if (index > -1) {
        arrmislist.splice(index, 1);
      }
     }
    } )
    this.props.parentImpactedhandle(arrmislist)
    this.setState({
      selectedlList:[],
      selectedTeeth:[],
      refreshList:!this.state.refreshList
    })
  }
  onNormalClicked =(selectedlList : any)=>{
    const {impactedList,missingList}=this.props
    this.props.patient.procedureGraphicCode = [];
    selectedlList.forEach((toothiso)=>{
                          this.props.patient.teeth[
                            toothiso //this.viewToothISO
                          ].diagnosis = {
                            id: "",
                            value: "",
                            date: new Date().toDateString()
                          };
          
                          const proIds: string[] = [];
                          const procedures = this.props.patient.procedures.filter(
                            pro => {
                              if (!pro.tooth.includes(toothiso)) {
                                return true;
                              } else {
                                proIds.push(pro.id);
                              }
                              return false;
                            }
                          );

                          appointments.list.forEach(l => {
                            if (proIds.includes(l.procedureId)) {
                              appointments.deleteByID(l._id);
                            }
                          });

                          this.props.patient.procedures = procedures;
                        }
                          this.viewToothISO = 0;

      
     this.props.parentNormalhandle(selectedlList)
   
            this.setState({
            ...this.state,
            showDiagnosis: false,
            selectedTeeth: [],
            selectedlList:[],
            refreshList:!this.state.refreshList
          });
  }
  onDaignosisClick=()=>{
    this.viewToothISO =0;
    this.setState({
      showDiagnosis:false
    })
  }
  reffreshList=()=>{
    this.setState({
      refreshList: !this.state.refreshList
    })
  }
  render() {
   // console.log("this.props.patient", this.props.patient);
   // console.log("this.State", this.state);
   let myCLassName = "";
    const options = { left: "left", right: "right", both: "both" };
    const procedureShown = this.state.searchProcedureText
      ? procedureList.filter(pro =>
        pro.value
          .toUpperCase()
          .includes(this.state.searchProcedureText.toUpperCase())
      )
      : procedureList.filter(
        (pro: any) => pro.parentIndex === this.state.currentProcedureIndex + 1
      );

      var elements = document.querySelectorAll('.sub-procedure');
      console.log("this.elements ", elements.length );
    return (
      <div style={{ display: "flex" }}>
        <div
          style={{
            width: "33%",
            float: "left",
            border: "1px solid #a6a6a6",
            marginTop: "84px",
            marginRight: "17px"
          }}
        >
          <div style={{ borderBottom: "1px solid #a6a6a6" }}>
            <Button
              style={{ width: "50%", borderRight: "1px solid #a6a6a6" }}
              onClick={() => {
                this.setState({ isOrthodonticTabOpen: false });
              }}
            >
              Information{" "}
            </Button>
            <Button
              style={{ width: "50%" }}
              onClick={() => {
                if (this.props.patient.orthoCaseId) {
                  this.setState({
                    isOrthodonticTabOpen: true,
                    selectedOrthoId: this.props.patient.orthoCaseId
                  });
                } else {
                  const ortho = new OrthoCase();
                  orthoCases.list.push(ortho);
                  this.props.patient.orthoCaseId = ortho._id;
                  this.setState({
                    isOrthodonticTabOpen: true,
                    selectedOrthoId: ortho._id
                  });
                }
              }}
            >
              {" "}
              Orthodontics{" "}
            </Button>
          </div>

          {!this.state.isOrthodonticTabOpen && (
            <div style={{ padding: "10px", height: "26%" }}>
              <div
                style={{
                  width: "100%",
                  border: "1px solid #a6a6a6",
                  height: "100%",
                  paddingTop: "10px"
                }}
              >
                <span
                  style={{
                    justifyContent: "center",
                    display: "flex",
                    fontWeight: "bold"
                  }}
                >
                  Patient Details
                </span>
                <div
                  style={{
                    width: "50%",
                    float: "left",
                    height: "80%",
                    padding: "20px 35px 10px 20px",
                    display: "block"
                  }}
                >
                  <div style={{ marginTop: "8px" }}>
                    <span style={{ float: "right" }}>Name:</span>
                  </div>
                  <br />
                  <div style={{ marginTop: "8px" }}>
                    <span style={{ float: "right" }}>Gender:</span>
                  </div>
                  <br />
                  <div style={{ marginTop: "8px" }}>
                    <span style={{ float: "right" }}>Age:</span>
                  </div>
                  <br />
                  <div style={{ marginTop: "8px" }}>
                    <span style={{ float: "right" }}>Last Appointment:</span>
                  </div>
                  <br />
                  <div style={{ marginTop: "8px" }}>
                    <span style={{ float: "right" }}>Next Appointment:</span>
                  </div>
                  <br />
                </div>

                <div
                  style={{
                    width: "50%",
                    float: "right",
                    height: "80%",
                    padding: "20px 20px 10px 35px",
                    display: "block"
                  }}
                >
                  <div style={{ marginTop: "8px" }}>
                    <span style={{ float: "left" }}>
                      {this.props.patient.name
                        ? this.props.patient.name
                        : "No name"}
                    </span>
                  </div>
                  <br />
                  <div style={{ marginTop: "8px" }}>
                    <span style={{ float: "left" }}>
                      {this.props.patient.gender === 0 ? "Male" : "Female"}
                    </span>
                  </div>
                  <br />
                  <div style={{ marginTop: "8px" }}>
                    <span style={{ float: "left" }}>
                      {this.props.patient.age}
                    </span>
                  </div>
                  <br />
                  <div style={{ marginTop: "8px" }}>
                    <span style={{ float: "left" }}>
                      {this.props.patient.lastAppointment
                        ? new Date(
                          this.props.patient.lastAppointment.date
                        ).toLocaleDateString()
                        : "No last appointment"}
                    </span>
                  </div>
                  <br />
                  <div style={{ marginTop: "8px" }}>
                    <span style={{ float: "left" }}>
                      {this.props.patient.nextAppointment
                        ? new Date(
                          this.props.patient.nextAppointment.date
                        ).toLocaleDateString()
                        : "No next appointment"}
                    </span>
                  </div>
                  <br />
                </div>
              </div>
              <hr
                style={{
                  border: "0",
                  height: "0",
                  borderTop: "1px solid rgba(0, 0, 0, 0.1)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.3)"
                }}
              />

              <div
                style={{
                  width: "100%",
                  border: "1px solid #a6a6a6",
                  height: "282%",
                  padding: "10px"
                }}
              >
                <div
                  style={{
                    width: "100%",
                    border: "1px solid #a6a6a6",
                    height: "59%",
                    padding: "10px"
                  }}
                >
                  <span
                    style={{
                      justifyContent: "center",
                      display: "flex",
                      fontWeight: "bold"
                    }}
                  >
                    Medical History
                  </span>
                  <div style={{ marginTop: "15px" }}>
                    <TextField
                      label={text(`Alerts`)}
                      value={this.props.patient.alerts}
                      multiline
                      autoAdjustHeight
                      onChange={(ev, alerts) =>
                        (this.props.patient.alerts = alerts!)
                      }
                    />
                  </div>
                  <div style={{ marginTop: "25px" }}>
                    <TextField
                      label={text(`Allergies`)}
                      value={this.props.patient.allergies}
                      multiline
                      autoAdjustHeight
                      onChange={(ev, allergies) =>
                        (this.props.patient.allergies = allergies!)
                      }
                    />
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    border: "1px solid #a6a6a6",
                    height: "38%",
                    marginTop: "4%",
                    padding: "10px"
                  }}
                >
                  <span
                    style={{
                      justifyContent: "center",
                      display: "flex",
                      fontWeight: "bold"
                    }}
                  >
                    Chief Complaint
                  </span>
                  <div style={{ marginTop: "10px" }}>
                    <TextField
                      label={text(`Cheif Complaint`)}
                      value={this.props.patient.cheifComplaint}
                      multiline
                      autoAdjustHeight
                      onChange={(ev, cheifComplaint) =>
                        (this.props.patient.cheifComplaint = cheifComplaint!)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {this.state.isOrthodonticTabOpen && (
            <AsyncComponent
              key="ortho-case-sheet"
              loader={async () => {
                const Component = (
                  await import("../../orthodontic/components/case-sheet")
                ).OrthoCaseSheetPanel;
                return <Component orthoCase={this.selectedOrthoCase} />;
              }}
            />
          )}
        </div>
        <div className="dental-history teeth" style={{ width: "65%" }}>
          <Toggle
            defaultChecked={!this.viewChart}
            onText={text("View permanent teeth")}
            offText={text("View deciduous teeth")}
            onChange={() => {
              this.viewChart = !this.viewChart;
            }}
          />

          {/* <TooltipHost content={text("Click here")}>
            <IconButton
              className="action-button"
              iconProps={{
                iconName: "Teeth"
              }}
              onClick={() => {
                this.viewChart = !this.viewChart;
              }}
              style={{ "padding-bottom": "15px", color: "#1a76d4" }}
            />
          </TooltipHost> */}
          {/* <span>
            {this.viewChart
              ? text("View deciduous teeth")
              : text("View permanent teeth")}
          </span> */}

        {/*  <Dropdown
            disabled={!this.canEdit}
            placeholder={text("Print")}
            options={Object.keys(options).map(x => ({
              key: x,
              text: text((options as any)[x])
            }))}
            defaultSelectedKey={options.both}
            onChange={(ev, has: any) => {
              if (has.key === options.left) {
                this.setState(
                  {
                    printview: "left"
                  },
                  () => {
                    window.print();
                  }
                );
              }
            }}
          />*/}
          {/*	<ReactToPrint
                trigger={() => <IconButton
                  iconProps={{ iconName: "print" }}
                
                />}
                content={() => this}
                /> */}

          <div className="m-t-20">
            {this.viewChart ? (
              <div className="chart">
                <SectionComponent
                  title={text(`Permanent Teeth`)}
                  backgroundColor="#F7F7F7"
                >
                  {this.state.firstRendering && (
                    <div
                      id="action-buttons"
                      style={{
                        border: "1px solid #a6a6a6",
                        width: "77%",
                        position: "relative",
                        right: "15px",
                        borderTop: "0px",
                        borderLeft: "0px"
                      }}
                    >
                      <Button
                        onClick={() => {
                          this.setState({ ...this.state, showDiagnosis: true });
                        }}
                        style={{ borderRight: "1px solid #a6a6a6" }}
                      >
                        Add Diagnosis
                      </Button>
                      <Button
                        onClick={() =>
                          this.setState({ ...this.state, showProcedure: true, classProcedure: true })
                        }
                        style={{ borderRight: "1px solid #a6a6a6" }}
                      >
                        Add Procedure
                      </Button>
                      <Button
                        onClick={() => {
                          this.onNormalClicked(this.state.selectedTeeth)

                        }}
                        style={{ "borderRight": "1px solid #a6a6a6" }}
                      >
                        Normal
                      </Button>
                      <Button
                        onClick={() => {
                         // this.setState({ isMissing: !this.state.isMissing});
                         this.onMissingClicked(this.state.selectedTeeth)
                        }}
                        style={{ "borderRight": "1px solid #a6a6a6" }}
                      >
                        Missing
                      </Button>
                      <Button
                        onClick={() => {
                          this.onImpactedClicked(this.state.selectedTeeth)
                          //this.setState({ isImpacted: !this.state.isImpacted});
                        }}
                      >
                        Impacted
                      </Button>
                    </div>
                  )}
                  {/* <AsyncComponent
                    key="teeth-permanent"
                    loader={async () => {
                      const Component = (await import("./teeth-permanent"))
                        .TeethPermanentChart;
                      return ( */}
                  <TeethPermanentChart
                    isImpacted={this.state.isImpacted}
                    isMissing={this.state.isMissing}
                    teeth={this.props.patient.teeth}
                    patient={this.props.patient}
                    selectedListclear={this.selectedListclear}
                    missingList= {this.props.missingList}
                    impactedList={this.props.impactedList}
                    showProcedure={this.state.showProcedure}
                    showDiagnosis={this.state.showDiagnosis}
                    refreshList={this.state.refreshList}
                    reffreshList={this.reffreshList}
                    onClick={number => {
                      if(number !== undefined){
                      this.viewToothISO = number;
                      if (this.state.selectedTeeth.indexOf(number) === -1) {
                        this.state.selectedTeeth.push(number);
                        this.setState({ ...this.state, firstRendering: true });
                      } else {
                        const selectedTeeth = this.state.selectedTeeth;
                        selectedTeeth.splice(selectedTeeth.indexOf(number), 1);
                        this.setState({ selectedTeeth, firstRendering: true });
                      }
                    }
                    else{
                      this.setState({ selectedTeeth:[], firstRendering: true });
                    }
                    }}
                  />
                </SectionComponent>
              </div>
            ) : (
                <div className="chart">
                  <SectionComponent
                    title={text(`Deciduous Teeth`)}
                    backgroundColor="#F7F7F7"
                  >
                    {this.state.firstRendering && (
                    <div
                      id="action-buttons"
                      style={{
                        border: "1px solid #a6a6a6",
                        width: "77%",
                        position: "relative",
                        right: "15px",
                        borderTop: "0px",
                        borderLeft: "0px"
                      }}
                    >
                      <Button
                        onClick={() => {
                          this.setState({ ...this.state, showDiagnosis: true });
                        }}
                        style={{ borderRight: "1px solid #a6a6a6" }}
                      >
                        Add Diagnosis
                      </Button>
                      <Button
                        onClick={() =>
                          this.setState({ ...this.state, showProcedure: true })
                        }
                        style={{ borderRight: "1px solid #a6a6a6" }}
                      >
                        Add Procedure
                      </Button>
                      <Button
                        onClick={() => {
                          this.onNormalClicked(this.state.selectedTeeth)

                        }}
                        style={{ "borderRight": "1px solid #a6a6a6" }}
                      >
                        Normal
                      </Button>
                      <Button
                        onClick={() => {
                         // this.setState({ isMissing: !this.state.isMissing});
                         this.onMissingClicked(this.state.selectedTeeth)
                        }}
                        style={{ "borderRight": "1px solid #a6a6a6" }}
                      >
                        Missing
                      </Button>
                      <Button
                        onClick={() => {
                          this.onImpactedClicked(this.state.selectedTeeth)
                          //this.setState({ isImpacted: !this.state.isImpacted});
                        }}
                      >
                        Impacted
                      </Button>
                    </div>
                  )}

                    <TeethDeciduousChart
                      isImpacted={this.state.isImpacted}
                      isMissing={this.state.isMissing}
                      teeth={this.props.patient.teeth}
                      patient={this.props.patient}
                      selectedListclear={this.selectedListclear}
                      missingList= {this.props.missingList}
                      impactedList={this.props.impactedList}
                      showProcedure={this.state.showProcedure}
                      showDiagnosis={this.state.showDiagnosis}
                      refreshList={this.state.refreshList}
                      reffreshList={this.reffreshList}
                      onClick={number => {
                        if(number !== undefined){
                        this.viewToothISO = number;
                        if (this.state.selectedTeeth.indexOf(number) === -1) {
                          this.state.selectedTeeth.push(number);
                          this.setState({ ...this.state, firstRendering: true });
                        } else {
                          const selectedTeeth = this.state.selectedTeeth;
                          selectedTeeth.splice(selectedTeeth.indexOf(number), 1);
                          this.setState({ selectedTeeth, firstRendering: true });
                        }
                      }
                      else{
                        this.setState({ selectedTeeth:[], firstRendering: true });
                      }
                      }}
                    />

                  </SectionComponent>
                </div>
              )}
          </div>

          {/* <Panel
            isOpen={
              !!this.props.patient.teeth[this.viewToothISO] &&
              !this.state.showProcedure
            }
            type={PanelType.smallFixedFar}
            closeButtonAriaLabel="Close"
            isLightDismiss={true}
            onDismiss={() => {
              this.viewToothISO = 0;
              this.setState({
                ...this.state,
                showDiagnosis: false
              });
            }}
            onRenderNavigation={() => {
              const tooth = this.props.patient.teeth[this.viewToothISO];

              return (
                <Row className="panel-heading">
                  <Col span={22}>
                    <ProfileComponent
                      name={`ISO: ${tooth ? tooth.ISO : ""} - Universal: ${
                        tooth ? tooth.Universal : ""
                      }`}
                      secondaryElement={
                        <span>
                          {tooth
                            ? tooth.Name.split(" ")
                                .filter((x, i) => i)
                                .join(" ")
                            : ""}
                        </span>
                      }
                      onRenderInitials={() => (
                        <span className="palmer">
                          {tooth ? tooth.Palmer : ""}
                        </span>
                      )}
                      size={3}
                    />
                  </Col>
                  <Col span={2} className="close">
                    <IconButton
                      iconProps={{ iconName: "cancel" }}
                      onClick={() => {
                        this.viewToothISO = 0;
                      }}
                    />
                  </Col>
                </Row>
              );
            }}
          >
            <br />
            <br />
            {this.props.patient.teeth[this.viewToothISO] ? (
              <div>
                <div className="tooth-details">
                  <Dropdown
                    placeholder={text(`Condition`)}
                    onChange={(ev, newVal: any) => {
                      this.props.patient.teeth[
                        this.viewToothISO
                      ].condition = newVal.key.toString();
                      this.props.patient.triggerUpdate++;
                      this.forceUpdate();
                    }}
                    defaultSelectedKey={
                      this.props.patient.teeth[this.viewToothISO].condition
                    }
                    className="single-tooth-condition"
                    options={Object.keys(ToothCondition).map(c => ({
                      key: c,
                      text: text(c)
                    }))}
                    disabled={!this.canEdit}
                  />
                  <EditableListComponent
                    label={text("History notes")}
                    value={this.props.patient.teeth[this.viewToothISO].notes}
                    disabled={!this.canEdit}
                    onChange={e => {
                      this.props.patient.teeth[this.viewToothISO].notes = e;
                      this.props.patient.triggerUpdate++;
                    }}
                  />
                </div>
                <div className="add-diagnosis-wrapper">
                  <div
                    className="normal-title"
                    onClick={() => {
                      this.props.patient.procedureGraphicCode = [];
                      this.props.patient.teeth[this.viewToothISO].diagnosis = {
                        id: "",
                        value: "",
                        date: new Date()
                      };
                      const procedures = this.props.patient.procedures.filter(
                        pro => !pro.tooth.includes(this.viewToothISO)
                      );
                      this.props.patient.procedures = procedures;
                      this.viewToothISO = 0;
                      this.setState({ ...this.state, showDiagnosis: false });
                    }}
                  >
                    Normal
                  </div>
                  <div
                    className="add-diagnosis-title"
                    onClick={() => {
                      this.setState({ ...this.state, showDiagnosis: true });
                    }}
                  >
                    Add diagnosis
                  </div>
                  <div
                    className="add-diagnosis-title"
                    onClick={() =>
                      this.setState({ ...this.state, showProcedure: true })
                    }
                  >
                    Add Procedure
                  </div>

                  {(this.state.showDiagnosis ||
                    (this.props.patient.teeth[this.viewToothISO].diagnosis &&
                      this.props.patient.teeth[this.viewToothISO].diagnosis
                        .id)) && (
                    <React.Fragment>
                      <p style={{ marginBottom: "5px" }}>Filter by name</p>
                      <Select
                        options={Object.keys(Diagnosis).map(c => ({
                          id: c,
                          key: c,
                          value: text(Diagnosis[c]),
                          title: Diagnosis[c].title
                        }))}
                        searchable={true}
                        searchBy="title"
                        itemRenderer={({
                          item,
                          methods
                        }: {
                          item: any;
                          methods: any;
                        }) => (
                          <Collapse
                            accordion={this.state.accordion}
                            onChange={this.onChange}
                            activeKey={this.state.activeKey}
                          >
                            <CustomePanel
                              style={{
                                padding: "10px",
                                backgroundColor: "#ffffff",
                                borderTop: "none"
                              }}
                              key={item.id}
                              header={item.value.title}
                            >
                              {item.value.diagnosis.map(
                                (d: any, index: number) => (
                                  <p
                                    style={{
                                      paddingLeft: "10px",
                                      color: "#0078d4"
                                    }}
                                    key={d.id + index}
                                    onClick={() => {
                                      this.props.patient.teeth[
                                        this.viewToothISO
                                      ].diagnosis = {
                                        id: d.id,
                                        value: d.value,
                                        date: new Date()
                                      };
                                      this.props.patient.triggerUpdate++;
                                      this.forceUpdate();
                                      // methods.addItem(item)
                                    }}
                                  >{`${d.id} ${d.value}`}</p>
                                )
                              )}
                            </CustomePanel>
                          </Collapse>
                        )}
                      />
                    </React.Fragment>
                  )}
                  {this.props.patient.teeth[this.viewToothISO].diagnosis &&
                    this.props.patient.teeth[this.viewToothISO].diagnosis.id && (
                      <p>
                        Selected diagnosis:{" "}
                        {
                          this.props.patient.teeth[this.viewToothISO].diagnosis
                            .value
                        }  
                      </p>
                    )}
                </div>
              </div>
            ) : (
              ""
            )}
          </Panel> */}
          {this.state.showDiagnosis && (
            <div
              style={{
                zIndex: 12,
                borderTop: "1px solid #999",
                marginTop: "5px",
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                // padding: "10px 40px",
                backgroundColor: "#ffffff",
                maxHeight: "300px",
                height: "500px",
                overflow: "scroll",
                padding: "10px 40px"
              }}
            >
              <BTRow className="flex-row-reverse">
                <BTCol>
                  <p
                    style={{
                      textAlign: "right",
                      color: "#2d89ef",
                      cursor: "pointer",
                      marginBottom: "0"
                    }}
                    onClick={ this.onDaignosisClick }//() => this.setState({ showDiagnosis: false })}
                  >
                    Close
                  </p>
                </BTCol>
              </BTRow>
              <BTRow>
                <BTCol xs={4}>
                  <p style={{ fontWeight: "bold", marginBottom: "5px" }}>
                    Status
                  </p>
                </BTCol>
                <BTCol xs={8}>
                  <p style={{ fontWeight: "bold", marginBottom: "5px" }}>
                    Teeth
                  </p>
                </BTCol>
              </BTRow>
              <BTRow>
                <BTCol xs={4}>
                  <div style={{ display: "flex" }}>
                    <p style={{ marginRight: "10px" }}>Planned</p>
                    <p>Completed</p>
                  </div>
                </BTCol>
                <BTCol xs={3}>
                  {this.state.selectedTeeth &&
                    this.state.selectedTeeth.length > 0 && (
                      <p>
                        {this.state.selectedTeeth.map(teethNo => {
                          return `#${teethNo} `;
                        })}
                      </p>
                    )}
                </BTCol>
              </BTRow>
              {(this.state.showDiagnosis ||
                (this.props.patient.teeth[this.viewToothISO].diagnosis &&
                  this.props.patient.teeth[this.viewToothISO].diagnosis
                    .id)) && (
                  <React.Fragment>
                    <p style={{ marginBottom: "5px" }}>Filter by name</p>
                    <Select
                    defaultMenuIsOpen={true}
                    keepOpen={true}
                    style={{maxHeight:'155px'}}
                   autoFocus={false}
                      options={Object.keys(diagnosisData).map(c => ({
                        id: c,
                        key: c,
                        value: text(diagnosisData[c]),
                        title: diagnosisData[c].title
                      }))}
                      searchable={true}
                      searchBy="title"
                      itemRenderer={({
                        item,
                        methods
                      }: {
                        item: any;
                        methods: any;
                      }) => (
                          <Collapse
                            accordion={this.state.accordion}
                            onChange={this.onChange}
                            activeKey={this.state.activeKey}
                          >
                            <CustomePanel
                              style={{
                                padding: "10px",
                                backgroundColor: "#ffffff",
                                borderTop: "none"
                              }}
                              key={item.id}
                              header= {item.value.title}
                            >
                              {item.value.diagnosis.map((d: any, index: number) => (
                                <p
                                  style={{
                                    paddingLeft: "10px",
                                    color: "#0078d4"
                                  }}
                                  key={d.id + index}
                                  onClick={() => {
                                    if(this.viewToothISO !== 0){
                                      this.state.selectedTeeth.forEach((toothiso: number)=>
                                    {this.props.patient.teeth[
                                      toothiso //this.viewToothISO
                                    ].diagnosis = {
                                      id: d.id,
                                      value: d.value,
                                      date: new Date().toDateString()
                                    };
                                    this.props.patient.triggerUpdate++;
                                    this.forceUpdate();
                                    // methods.addItem(item)
                                  })} }}
                                >{`${d.id} ${d.value}`}</p>
                              ))}
                            </CustomePanel>
                          </Collapse>
                        )}
                    />
                  </React.Fragment>
                )}
              {this.viewToothISO !== 0 && this.props.patient.teeth[this.viewToothISO].diagnosis &&
                this.props.patient.teeth[this.viewToothISO].diagnosis.id && (
                  <p>
                    Selected diagnosis:{" "}
                    {
                      this.props.patient.teeth[this.viewToothISO].diagnosis
                        .value
                    }
                  </p>
                )}
            </div>
          )}

          {this.state.showProcedure && (
            <div
              style={{
                zIndex: 12,
                borderTop: "1px solid #999",
                marginTop: "5px",
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "10px 40px",
                backgroundColor: "#ffffff",
                maxHeight: "300px",
                overflow: "scroll"
              }}
            >
              <BTRow className="flex-row-reverse">
                <BTCol>
                  <p
                    style={{
                      textAlign: "right",
                      color: "#2d89ef",
                      cursor: "pointer",
                      marginBottom: "0"
                    }}
                    onClick={() => this.setState({ showProcedure: false })}
                  >
                    Close
                  </p>
                </BTCol>
              </BTRow>
              <BTRow>
                <BTCol xs={4}>
                  <p style={{ fontWeight: "bold", marginBottom: "5px" }}>
                    Status
                  </p>
                </BTCol>
                <BTCol xs={8}>
                  <p style={{ fontWeight: "bold", marginBottom: "5px" }}>
                    Teeth
                  </p>
                </BTCol>
              </BTRow>
              <BTRow>
                <BTCol xs={4}>
                  <div style={{ display: "flex" }}>
                    <p style={{ marginRight: "10px" }}>Planned</p>
                    <p>Completed</p>
                  </div>
                </BTCol>
                <BTCol xs={3}>
                  {this.state.selectedTeeth &&
                    this.state.selectedTeeth.length > 0 && (
                      <p>
                        {this.state.selectedTeeth.map(teethNo => {
                          return `#${teethNo} `;
                        })}
                      </p>
                    )}
                </BTCol>
              </BTRow>

              {procedures[this.state.currentProcedureIndex] &&
                procedures[this.state.currentProcedureIndex].children ? (
                  <BTRow style={{ width: "400px" }}>
                    {procedures[this.state.currentProcedureIndex].children.map(
                      child => {
                        myCLassName = "sub-procedure";
                        if (
                          this.props.patient.procedureGraphicCode &&
                          this.props.patient.procedureGraphicCode.length > 0
                        ) {
                          this.props.patient.procedureGraphicCode.map(code => {
                           /* if (code.includes(child) && this.state.classProcedure ) {
                              myCLassName += " sub-procedure-selected";
                            //  this.setState({  classProcedure: className })
                            //  classProcedure = className;
                            }*/
                          });
                        }
                        return (
                          <BTCol>
                            <p
                              className={myCLassName}
                              onClick={() => {
                                if (
                                  this.state.selectedTeeth &&
                                  this.state.selectedTeeth.length > 0
                                ) {
                                  this.state.selectedTeeth.map(tooth => {
                                    const procedureGraphicCode = this.props
                                      .patient.procedureGraphicCode;
                                    let graphicCode =
                                      procedures[this.state.currentProcedureIndex]
                                        .id +
                                      child +
                                      tooth;
                                    const indexOfGraphicCode = this.props.patient.procedureGraphicCode.indexOf(
                                      graphicCode
                                    );
                                    if (indexOfGraphicCode === -1) {
                                      procedureGraphicCode.push(graphicCode);
                                    } else {
                                      procedureGraphicCode.splice(
                                        indexOfGraphicCode,
                                        1
                                      );
                                    }
                                    this.props.patient.procedureGraphicCode = procedureGraphicCode;
                                  });
                                }
                              }}
                            >
                              {child}
                            </p>
                          </BTCol>
                        );
                      }
                    )}
                  </BTRow>
                ) : null}
              <BTRow className="m-2">
                <BTCol>
                  <input
                    className="w-100 p-1"
                    type="text"
                    placeholder="Search... "
                    value={this.state.searchProcedureText}
                    onChange={e => {
                      this.setState({ searchProcedureText: e.target.value });
                    }}
                  />
                </BTCol>
              </BTRow>
              <BTRow className="justify-content-xs-between">
                {procedures.map((pro: any, index: number) => (
                  <BTCol
                    key={index}
                    style={{ cursor: "pointer" }}
                    className="d-flex flex-column align-items-xs-centre"
                    onClick={() => {
                      if (
                        !procedures[index].children ||
                        ["rootCanal", "prosthetics"].includes(
                          procedures[index].id
                        )
                      ) {
                        if (
                          this.state.selectedTeeth &&
                          this.state.selectedTeeth.length > 0
                        ) {
                          this.state.selectedTeeth.map(tooth => {
                            const procedureGraphicCode = this.props.patient
                              .procedureGraphicCode;
                            let graphicCode = pro.id + "" + tooth;
                            const indexOfGraphicCode = this.props.patient.procedureGraphicCode.indexOf(
                              graphicCode
                            );
                            if (indexOfGraphicCode === -1) {
                              procedureGraphicCode.push(graphicCode);
                            }
                            // This is another flow that show  procedure together
                            // else {
                            //   procedureGraphicCode.splice(indexOfGraphicCode, 1);
                            // }

                            // This is another flow that show one procedure at the time
                            if (
                              !procedures[this.state.currentProcedureIndex]
                                .children ||
                              ["rootCanal", "prosthetics"].includes(
                                procedures[this.state.currentProcedureIndex].id
                              )
                            ) {
                              let preGraphicCode =
                                procedures[this.state.currentProcedureIndex]
                                  .id +
                                "" +
                                tooth;
                              const indexOfPreGraphicCode = this.props.patient.procedureGraphicCode.indexOf(
                                preGraphicCode
                              );
                              if (indexOfPreGraphicCode !== -1) {
                                procedureGraphicCode.splice(
                                  indexOfPreGraphicCode,
                                  1
                                );
                              }
                            }
                            this.props.patient.procedureGraphicCode = procedureGraphicCode;
                          });
                        }
                      }
                      this.setState({ currentProcedureIndex: index });
                    }}
                  >
                    <div style={{ margin: "0 auto" }}>
                      <img src={`./icons/${pro.id}.png`} /> 
                    </div>
                    <p
                      style={
                        index === this.state.currentProcedureIndex
                          ? {
                            marginTop: "10px",
                            textAlign: "center",
                            color: "#2d89ef"
                          }
                          : { marginTop: "10px", textAlign: "center" }
                      }
                    >
                      {pro.title}
                    </p>
                  </BTCol>
                ))}
              </BTRow>
              <div
                style={{
                  height: "300px",
                  padding: "10px 20px",
                  overflow: "auto",
                  backgroundColor: "#F7F7F7"
                }}
              >
                {procedureShown.map(procedure => {
                  let procedureInSelectedList = this.state.selectedProcedure[
                    `${procedure.parentId}-${procedure.parentIndex}${procedure.order}`
                  ];
                  return (
                    <BTRow
                      className="justify-content-between"
                      style={{ padding: "5px" }}
                    >
                      {/* index +1 cuz in procedurelist id start from 1 but procedures array start index from 0 */}
                      <BTCol
                        style={{ cursor: "pointer" }}
                        xs={8}
                        onClick={() => {
                          if (procedureInSelectedList) {
                            const selectedProcedure = this.state
                              .selectedProcedure;
                            delete this.state.selectedProcedure[
                              `${procedure.parentId}-${procedure.parentIndex}${procedure.order}`
                            ];
                            this.setState({ selectedProcedure });
                          } else {
                            const selectedProcedure = {
                              ...this.state.selectedProcedure
                            };
                            selectedProcedure[
                              `${procedure.parentId}-${procedure.parentIndex}${procedure.order}`
                            ] = { ...procedure, quantity: 1 };
                            this.setState({ selectedProcedure });
                          }
                        }}
                      >
                        <p style={{ marginBottom: "5px" }}>
                          {procedure.parentIndex}({procedure.order})
                        </p>
                        <p style={{ margin: 0 }}>{procedure.value}</p>
                      </BTCol>
                      <BTCol xs={1}>
                        {procedureInSelectedList && (
                          <div className="d-flex">
                            <input
                              style={{
                                borderRadius: "5px",
                                padding: "10px",
                                border: "none",
                                width: "60px"
                              }}
                              type="number"
                              value={procedureInSelectedList.quantity}
                              onChange={e => {
                                procedureInSelectedList.quantity =
                                  e.target.value;
                                this.setState({ ...this.state });
                              }}
                            />
                          </div>
                        )}
                      </BTCol>
                      <BTCol xs={2}>
                        <div className="d-flex">
                          <input
                            style={{
                              borderRadius: "5px",
                              padding: "10px 5px",
                              border: "none"
                            }}
                            type="number"
                            value={
                              procedureInSelectedList &&
                                procedureInSelectedList.price !== undefined
                                ? procedureInSelectedList.price
                                : procedure.defaultPrice
                            }
                            onChange={e => {
                              if (procedureInSelectedList) {
                                procedureInSelectedList.price = e.target.value;
                                this.setState({ ...this.state });
                              } else {
                                alert(
                                  "Please select the procedure before modifying its price"
                                );
                              }
                            }}
                          />
                          <div
                            style={{
                              textAlign: "center",
                              padding: "10px 10px",
                              backgroundColor: "#ffffff",
                              color: "#2d89ef"
                            }}
                          >
                            $
                          </div>
                        </div>
                      </BTCol>
                    </BTRow>
                  );
                })}
              </div>
              <BTRow className="justify-content-between mt-3 align-items-centre">
                <BTCol xs={9}>
                  {this.state.selectedTeeth &&
                    this.state.selectedTeeth.length > 0 && (
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          id="checkForTooth"
                          type="checkbox"
                          checked={this.state.saveProcedureSeparate}
                          onChange={e =>
                            this.setState({
                              saveProcedureSeparate: e.target.checked
                            })
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="checkForTooth"
                        >
                          {" "}
                          Save these procedures for each tooth separately{" "}
                        </label>
                      </div>
                    )}
                </BTCol>
                <BTCol xs={3}>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                     
                    
                     // this.props.patient.procedureGraphicCode = []

                      const procedures: Procedures[] = [];

                      if (
                        this.state.selectedProcedure &&
                        Object.keys(this.state.selectedProcedure).length > 0
                      ) {
                        for (let [key] of Object.entries(
                          this.state.selectedProcedure
                        )) {
                          const selectedPro = this.state.selectedProcedure;
                          
                          if (this.state.selectedTeeth.length === 0) {
                            const pro = new Procedures({
                              id: "" + new Date().getTime(),
                              slectedGraphicCode: [],
                              name: selectedPro[key].value,
                              quantity: selectedPro[key].quantity,
                              patientid: this.props.patient._id,
                              tooth: [] as number[],
                              fees:
                                selectedPro[key].price ||
                                selectedPro[key].defaultPrice,
                              done: false,
                              date: new Date().toISOString(),
                              status: 'In Processing'
                            });
                            procedures.push(pro);
                          } else {
                            if (this.state.saveProcedureSeparate) {
                              this.state.selectedTeeth.map(item => {
                                const slectedGraphicCode = this.props.patient.procedureGraphicCode.filter(
                                  code => {
                                    return code.includes(item.toString()) &&
                                      code.includes(key.split("-")[0])
                                      ? true
                                      : false;
                                  }
                                );

                                const pro = new Procedures({
                                  id:"" + new Date().getTime(),
                                  slectedGraphicCode: slectedGraphicCode,
                                  name: selectedPro[key].value,
                                  quantity: selectedPro[key].quantity,
                                  patientid: this.props.patient._id,
                                  tooth: [item],
                                  fees:
                                    selectedPro[key].price ||
                                    selectedPro[key].defaultPrice,
                                  done: false,
                                  date: new Date().toISOString(),
                                  status: 'In Processing'
                                });
                                procedures.push(pro);
                              });
                            } else {
                              const slectedGraphicCode: string[] = [];
                              this.state.selectedTeeth.map(item => {
                                this.props.patient.procedureGraphicCode.map(
                                  code => {
                                    if (
                                      code.includes(item.toString()) &&
                                      code.includes(key.split("-")[0])
                                    ) {
                                      slectedGraphicCode.push(code);
                                    }
                                  }
                                );
                              });
                              const pro = new Procedures({
                                id: "" + new Date().getTime(),
                                slectedGraphicCode: slectedGraphicCode,
                                name: selectedPro[key].value,
                                quantity: selectedPro[key].quantity,
                                patientid: this.props.patient._id,
                                tooth: this.state.selectedTeeth,
                                fees:
                                  selectedPro[key].price ||
                                  selectedPro[key].defaultPrice,
                                done: false,
                                date: new Date().toISOString(),
                                status: 'In Processing'
                              });
                              procedures.push(pro);
                            }
                          }
                        }
                        this.props.patient.procedures = [
                          ...this.props.patient.procedures,
                          ...procedures  
                        ];

                       
                        
                        this.setState(
                          {
                            showProcedure: false,
                            currentProcedureIndex: 0,
                            selectedProcedure: {},
                            selectedTeeth: [],
                            saveProcedureSeparate: true,
                            checkprocedure:true                          
                          },
                          () => {
                              
                              this.props.toggleProcedureTable;
                          }
                        );

                        setTimeout(() => {
                          console.log("Run me now!!!");
                          var elements = document.querySelectorAll('.sub-procedure-selected');
                          console.log("Elements lenght: " + elements.length );
                              for(var i=0; i<elements.length; i++){
                                  elements[i].classList.remove("sub-procedure-selected");
                                  console.log("Sub procedure "+ i)
                          }
                         }, 1000);                   

                        
                      }
                    }}
                  >
                    Add procedures (
                    {Object.keys(this.state.selectedProcedure).length})
                  </button>
                </BTCol>
              </BTRow>
            </div>
          )}
        </div>
      </div>
    );
  }


  toggle(){
    
  }

  mapQuadrant(min: number, max: number, reverse: boolean) {
    let arr = this.props.patient.teeth;
    arr = arr.filter(tooth => tooth.ISO >= min && tooth.ISO <= max);
    arr = reverse ? arr.reverse() : arr;
    return arr.map(tooth => (
      <td
        key={"tooth" + tooth.ISO}
        style={{ background: conditionToColor(tooth.condition) }}
        onClick={() => (this.viewToothISO = tooth.ISO)}
      >
        <span
          className="has-notes"
          style={tooth.notes.length ? {} : { display: "none" }}
        />
        {tooth.ISO}
      </td>
    ));
  }
}

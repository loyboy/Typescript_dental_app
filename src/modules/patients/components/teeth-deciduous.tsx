import { conditionToColor, Tooth } from "@modules";
import { observer } from "mobx-react";
import * as React from "react";
import { Patient } from "../data";
import { Checkbox } from "office-ui-fabric-react";

@observer
export class TeethDeciduousChart extends React.Component<
{
  teeth: Tooth[];
  onClick: (ISONumber: number) => void;
  patient: Patient;
  isMissing: boolean;
  isImpacted: boolean;
  checkprocedure:boolean;
  selectAllchecked:boolean;
},
{
  selectedTeeth: number[],
  statusDoneTeeth: number[],
 }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      selectedTeeth: [],
      statusDoneTeeth: [],
      checkprocedure:false,
      selectAllchecked:false
    };
  }

  
  renderDiagnosisCode = (toothNo: number, x: number, y: number) => {
    const goUp = toothNo < 30;
    return this.props.teeth &&
      this.props.teeth[toothNo] &&
      this.props.teeth[toothNo].diagnosis &&
      this.props.teeth[toothNo].diagnosis.id ? (
        <text
          x={x - 200}
          y={
            goUp
              ? `${y - 1000 / ((toothNo % 2) + 1)}`
              : `${y + 1000 / ((toothNo % 2) + 1)}`
          }
          fill="#ff0000"
          fontSize="250"
        >
          {this.props.teeth[toothNo].diagnosis.id}
        </text>
      ) : null;
  };

  isStatusDone = (
    tooth: number
  ) => {
    if (this.props.patient && this.props.patient.procedures && this.props.patient.procedures.length) {
      // debugger
      const isProcedureDone = this.props.patient.procedures.find(pro => pro.tooth.length
        && pro.tooth.includes(tooth) && pro.status === "Completed");
      if (isProcedureDone && !this.state.statusDoneTeeth.includes(tooth)) {
        this.state.statusDoneTeeth.push(tooth)
        // const greenTeeth = [...this.state.statusDoneTeeth]
        // greenTeeth.push(tooth);
        // this.setState({ statusDoneTeeth: greenTeeth })
      }
    }
  }

  isShownRedGraphic = (
    procedureId: string,
    subProcedure: string,
    tooth: number
  ) => {
    const code = procedureId + subProcedure + tooth;
    let show = false;
    // if (this.props.patient.procedureGraphicCode.includes(code) &&
    //   this.props.patient.procedures.some(pro => pro.tooth.length > 0) &&
    //   this.props.patient.procedures.some(pro => pro.slectedGraphicCode[0] === code )) {
    //   show = true;
    // }
    if (
      this.props.patient.procedures &&
      this.props.patient.procedures.length > 0 &&
      this.props.patient.procedures.some(pro => pro.tooth.length > 0)
    ) {
      this.props.patient.procedures.map((pro: Procedures) => {
        if (pro.slectedGraphicCode && pro.slectedGraphicCode.length > 0) {
          pro.slectedGraphicCode.map(selectedCode => {
            if (selectedCode === code) {
              show = true;
            }
          });
        }
      });
    }
    if (show) {
      this.isStatusDone(tooth);
    }
    return show;
  };

  selectAll = (selectAllClicked) => {
    if (selectAllClicked) {
      [51, 52, 53, 54, 55, 61, 62, 63, 64, 65, 71, 72, 73, 74, 75, 81, 82, 83,
        84, 85].map((obj) => {
          this.props.onClick(obj)
        })

      this.setState({
        selectedTeeth: [51, 52, 53, 54, 55, 61, 62, 63, 64, 65, 71, 72, 73, 74, 75, 81, 82, 83,
          84, 85],
          selectAllchecked:true
      })
    } else {
      this.props.onClick()
      this.setState({
        selectedTeeth: [],
        selectAllchecked:false
      })
    }
  }

  toggleSelectedNumber = (toothNo: number) => {
    if (this.state.selectedTeeth.indexOf(toothNo) === -1) {
      this.state.selectedTeeth.push(toothNo);
      this.setState({ ...this.state });
    } else {
      const selectedTeeth = this.state.selectedTeeth;
      selectedTeeth.splice(selectedTeeth.indexOf(toothNo), 1);
      this.setState({ selectedTeeth });
    }
  };

  checkMissing=(tnumber:any)=>{
      if(this.props.missingList.some(e => e=== tnumber)){
        return true
      }
      else{
        return false
      }
  }

  checkImpacted=(tnumber:any)=>{
    if(this.props.impactedList.some(e => e=== tnumber)){
      return true
    }
    else{
      return false
    }
  }
  
 componentDidUpdate(prevProps,prevState){
    if((this.props.showProcedure !== undefined && 
      prevProps.showProcedure !== this.props.showProcedure &&
       this.props.showProcedure===false) || 
       (this.props.showDiagnosis !== undefined && 
        prevProps.showDiagnosis !== this.props.showDiagnosis &&
         this.props.showDiagnosis===false)
       
       ){
         this.selectAll(false)
        this.props.selectedListclear()
        console.log('Show procedure list permenant teeth')
      // this.setState({
      //   selectedTeeth:[]
      // })
    }
    if(prevProps.refreshList !== this.props.refreshList)
    {
      this.selectAll(false)
      console.log('Refresh list permenant teeth')
      //   this.setState({
      //   selectedTeeth:[]
      // })
    }
  }
  componentDidMount(){
    this.setState({
      selectedTeeth:[]
    })
  }


  render() {
    const {  isImpacted } = this.props;
    const isMissing=false;
    const { selectedTeeth,selectAllchecked } = this.state;
    this.state.statusDoneTeeth = []
    return (
      <>
        <div style={{ marginLeft: '5%', marginTop: '10%', marginBottom: '-100px', display: 'flex', flexFlow: 'row' }}>
          <div>
          <Checkbox label={'Select All'} checked={selectAllchecked} onChange={(ev, isChecked: boolean) => {
              this.selectAll(isChecked)
            }} />
          </div>
        </div>
        <svg
          className={'svgClass'}
          version="1.1"
          id="Layer_1"
          x="0px"
          y="0px"
          viewBox="7886 -7258.7 16383 15308.7"
          enableBackground="new 7886 -7258.7 16383 15308.7"
          xmlSpace="preserve"
        >

          <path
            fill="#F2ECBE"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 82) ? (this.state.statusDoneTeeth.includes(82) ? "#369661" : "#DE2527")
                : this.checkImpacted(82) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(82) ? isMissing ? `M15191.9,2749l-103,141
	c-87.7,432.8,15.3,766.8,38,964.4c84,442.1,114.1,254.2,175.4-32.9c76.1-329.4,72.4-729.2,45.9-988.1L15191.9,2749z` : '' : `M15191.9,2749l-103,141
	c-87.7,432.8,15.3,766.8,38,964.4c84,442.1,114.1,254.2,175.4-32.9c76.1-329.4,72.4-729.2,45.9-988.1L15191.9,2749z`}
          />

          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 82) ? (this.state.statusDoneTeeth.includes(82) ? "#369661" : "#DE2527")
                : this.checkImpacted(82) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= { this.checkMissing(82) ? isMissing ?  `M15340.8,2853.8c-26.4,57.5-225,68.2-251.4,50.6
	c-3.7-3.7-7.4-10.7-11.1-14.4c-63.6-136.8-221.3-594.3-22.7-698.6c67.7-3.7,157.7-14.4,217.6-32.5c37.6-7,75.2-32.5,97.4-18.1
	c45,14.4,90,100.7,90,154.9C15438.7,2490.1,15356.1,2860.8,15340.8,2853.8z` : '' : `M15340.8,2853.8c-26.4,57.5-225,68.2-251.4,50.6
	c-3.7-3.7-7.4-10.7-11.1-14.4c-63.6-136.8-221.3-594.3-22.7-698.6c67.7-3.7,157.7-14.4,217.6-32.5c37.6-7,75.2-32.5,97.4-18.1
	c45,14.4,90,100.7,90,154.9C15438.7,2490.1,15356.1,2860.8,15340.8,2853.8z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 82) ? (this.state.statusDoneTeeth.includes(82) ? "#369661" : "#DE2527")
                : this.checkImpacted(82) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={ this.checkMissing(82) ? isMissing ?  `M15134.4,1053.4
	c-90,86.7-184.2,187.9-265.4,298.8c-31.5,43.1-22.3,101.1-4.6,149.4c58.5,125.3,153.1,183.2,206.9,207.4
	c76.5,14.4,220.4,9.7,260.7-9.7c40.4-19.5,116.9-101.1,130.4-149.4c26.9-82.1,0-183.2-13.5-207.4c-13.5-24.1-71.9-72.4-85.4-91.4
	c-13.5-24.1-22.3-48.2-31.5-82.1c-8.8-33.9-53.8-91.4-81.2-106.2C15210.9,1034,15161.8,1039.1,15134.4,1053.4L15134.4,1053.4z` : '' : `M15134.4,1053.4
	c-90,86.7-184.2,187.9-265.4,298.8c-31.5,43.1-22.3,101.1-4.6,149.4c58.5,125.3,153.1,183.2,206.9,207.4
	c76.5,14.4,220.4,9.7,260.7-9.7c40.4-19.5,116.9-101.1,130.4-149.4c26.9-82.1,0-183.2-13.5-207.4c-13.5-24.1-71.9-72.4-85.4-91.4
	c-13.5-24.1-22.3-48.2-31.5-82.1c-8.8-33.9-53.8-91.4-81.2-106.2C15210.9,1034,15161.8,1039.1,15134.4,1053.4L15134.4,1053.4z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 82) ? (this.state.statusDoneTeeth.includes(82) ? "#369661" : "#DE2527")
                : this.checkImpacted(82) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= { this.checkMissing(82) ? isMissing ?  `M15237.8,1140.2c13.5,14.4,22.3,33.9,36.2,48.2
	c4.6,14.4,4.6,24.1,4.6,38.5c18.1,14.4,31.5,24.1,49.6,38.5c0,19.5,4.6,33.9,4.6,52.9c22.3,14.4,40.4,28.8,40.4,67.3v28.8
	c-22.3,77-94.6,0-139.6-9.7c-18.1,0-40.4,4.6-63.1,9.7c-13.5,4.6-26.9,9.7-45,14.4c-26.9,0-53.8,4.6-81.2,4.6
	c-4.6,4.6-8.8,19.5-31.5,33.9c-40.4,0-40.4-14.4-49.6-28.8c-4.6-38.5-8.8-77,18.1-110.9c18.1-24.1,36.2-52.9,53.8-52.9
	c26.9,4.6,53.8,0,81.2-9.7c-13.5-33.9-4.6-48.2,22.3-52.9c4.6-9.7,4.6-24.1,4.6-33.9c0-43.1,13.5-72.4,45-72.4
	C15202.1,1106.3,15224.4,1116.1,15237.8,1140.2L15237.8,1140.2L15237.8,1140.2z` : '' : `M15237.8,1140.2c13.5,14.4,22.3,33.9,36.2,48.2
	c4.6,14.4,4.6,24.1,4.6,38.5c18.1,14.4,31.5,24.1,49.6,38.5c0,19.5,4.6,33.9,4.6,52.9c22.3,14.4,40.4,28.8,40.4,67.3v28.8
	c-22.3,77-94.6,0-139.6-9.7c-18.1,0-40.4,4.6-63.1,9.7c-13.5,4.6-26.9,9.7-45,14.4c-26.9,0-53.8,4.6-81.2,4.6
	c-4.6,4.6-8.8,19.5-31.5,33.9c-40.4,0-40.4-14.4-49.6-28.8c-4.6-38.5-8.8-77,18.1-110.9c18.1-24.1,36.2-52.9,53.8-52.9
	c26.9,4.6,53.8,0,81.2-9.7c-13.5-33.9-4.6-48.2,22.3-52.9c4.6-9.7,4.6-24.1,4.6-33.9c0-43.1,13.5-72.4,45-72.4
	C15202.1,1106.3,15224.4,1116.1,15237.8,1140.2L15237.8,1140.2L15237.8,1140.2z`}
          />
          <path
            fill="#FAFAFA"
            stroke="#010101"
            strokeWidth="10"
            strokeMiterlimit="10"
            d= { this.checkMissing(82) ? isMissing ?  `M15372.8,1414.8c0-19.5,0-48.2-4.6-62.6
	c-4.6-14.4-31.5-19.5-36.2-33.9c-4.6-19.5,0-43.1-4.6-52.9c-8.8-9.7-45-24.1-49.6-33.9c-4.6-14.4,4.6-28.8,0-38.5
	c-13.5-24.1-26.9-38.5-45-48.2 M14959,1443.6c0-33.9-4.6-72.4,4.6-91.4c9.3-19,45-38.5,49.6-62.6s85.4-4.6,98.8-24.1
	c8.8-4.6-4.6-28.8,0-38.5s18.1-4.6,26.9-14.4c8.8-14.4-4.6-48.2,4.6-67.3c13.5-33.9,22.3-43.1,45-33.9 M15044.4,1433.8
	c31.5-9.7,90,4.6,112.3-14.4c18.1-14.4,67.3-19.5,94.6-14.4` : '' : `M15372.8,1414.8c0-19.5,0-48.2-4.6-62.6
	c-4.6-14.4-31.5-19.5-36.2-33.9c-4.6-19.5,0-43.1-4.6-52.9c-8.8-9.7-45-24.1-49.6-33.9c-4.6-14.4,4.6-28.8,0-38.5
	c-13.5-24.1-26.9-38.5-45-48.2 M14959,1443.6c0-33.9-4.6-72.4,4.6-91.4c9.3-19,45-38.5,49.6-62.6s85.4-4.6,98.8-24.1
	c8.8-4.6-4.6-28.8,0-38.5s18.1-4.6,26.9-14.4c8.8-14.4-4.6-48.2,4.6-67.3c13.5-33.9,22.3-43.1,45-33.9 M15044.4,1433.8
	c31.5-9.7,90,4.6,112.3-14.4c18.1-14.4,67.3-19.5,94.6-14.4`}
          />


          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 81) ? (this.state.statusDoneTeeth.includes(81) ? "#369661" : "#DE2527")
                : this.checkImpacted(81) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(81) ? isMissing ?  `M16102.1,1478.8
	c-14.4,54.7-48.2,154.5-125.7,194.4c-48.2,25.1-169.3,25.1-222.2,5.1c-62.6-19.9-111.3-25-149.8-45c-33.9-25-62.6-69.6-77.5-124.8
	c-4.6-79.8-4.6-174.4,9.7-209.2c53.3-109.5,198.1-269.1,261.2-298.8c38.5-14.8,91.9-19.9,145.2,19.9
	c38.5,29.7,120.6,169.3,159.6,274.2C16116.5,1354.5,16106.7,1424.1,16102.1,1478.8L16102.1,1478.8z` : '' : `M16102.1,1478.8
	c-14.4,54.7-48.2,154.5-125.7,194.4c-48.2,25.1-169.3,25.1-222.2,5.1c-62.6-19.9-111.3-25-149.8-45c-33.9-25-62.6-69.6-77.5-124.8
	c-4.6-79.8-4.6-174.4,9.7-209.2c53.3-109.5,198.1-269.1,261.2-298.8c38.5-14.8,91.9-19.9,145.2,19.9
	c38.5,29.7,120.6,169.3,159.6,274.2C16116.5,1354.5,16106.7,1424.1,16102.1,1478.8L16102.1,1478.8z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 81) ? (this.state.statusDoneTeeth.includes(81) ? "#369661" : "#DE2527")
                : this.checkImpacted(81) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(81) ? isMissing ?  `M15865,1070.1c33.9,9.7,58,39.9,77.5,69.6
	c19.5,29.7,38.5,64.9,58,94.6c19.5,34.8,29.2,64.9,29.2,99.7c-4.6,29.7-29.2,25.1-53.3,29.7h-62.6c-43.6,5.1-87.2,9.7-130.4,5.1
	c-43.6-5.1-72.4-9.7-96.5,0h-33.9c-24.1,0-38.5-9.7-29.2-34.8c14.4-39.9,43.6-64.9,77.5-89.5l72.4-59.8
	c9.7-19.9,19.5-49.6,29.2-69.6C15807,1090.1,15831.6,1070.1,15865,1070.1L15865,1070.1z` : '' : `M15865,1070.1c33.9,9.7,58,39.9,77.5,69.6
	c19.5,29.7,38.5,64.9,58,94.6c19.5,34.8,29.2,64.9,29.2,99.7c-4.6,29.7-29.2,25.1-53.3,29.7h-62.6c-43.6,5.1-87.2,9.7-130.4,5.1
	c-43.6-5.1-72.4-9.7-96.5,0h-33.9c-24.1,0-38.5-9.7-29.2-34.8c14.4-39.9,43.6-64.9,77.5-89.5l72.4-59.8
	c9.7-19.9,19.5-49.6,29.2-69.6C15807,1090.1,15831.6,1070.1,15865,1070.1L15865,1070.1z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 81) ? (this.state.statusDoneTeeth.includes(81) ? "#369661" : "#DE2527")
                : this.checkImpacted(81) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(81) ? isMissing ?  `M16024.6,1339.2c4.6-34.8-9.7-79.8-24.1-99.7
	c-9.7-19.9-48.2-84.9-72.4-124.8c-14.4-25.1-38.5-39.9-58-39.9 M15686.4,1364.3c-19.5,5.1-43.6,5.1-58-5.1
	c-9.7-14.8,0-39.9,9.7-49.6c33.9-54.7,116-99.7,135.5-124.8c9.7-9.7,19.5-49.6,38.5-64.9 M15782.9,1364.3
	c62.6,9.7,125.7-5.1,193.4-9.7` : '' : `M16024.6,1339.2c4.6-34.8-9.7-79.8-24.1-99.7
	c-9.7-19.9-48.2-84.9-72.4-124.8c-14.4-25.1-38.5-39.9-58-39.9 M15686.4,1364.3c-19.5,5.1-43.6,5.1-58-5.1
	c-9.7-14.8,0-39.9,9.7-49.6c33.9-54.7,116-99.7,135.5-124.8c9.7-9.7,19.5-49.6,38.5-64.9 M15782.9,1364.3
	c62.6,9.7,125.7-5.1,193.4-9.7`}
          />



          <path
            fill="#D0C9A3"
            onClick={() => {
              this.toggleSelectedNumber(55);
              this.props.onClick(55);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 55) ? (this.state.statusDoneTeeth.includes(55) ? "#369661" : "#DE2527")
                : this.checkImpacted(55) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="22.926"
            d={ this.checkMissing(55) ? isMissing ? `M12600-2624l-97.4,506.6l-369.3-49.6
	l-5.1-541.4c71.9-168.9,71.9-298.3,77-456.9c5.1-44.5-30.6-203.7,46.4-203.7c154,5.1,102.5,387.4,174.4,451.8L12600-2624L12600-2624
	L12600-2624z` : "" : `M12600-2624l-97.4,506.6l-369.3-49.6
	l-5.1-541.4c71.9-168.9,71.9-298.3,77-456.9c5.1-44.5-30.6-203.7,46.4-203.7c154,5.1,102.5,387.4,174.4,451.8L12600-2624L12600-2624
	L12600-2624z` }
          />
          <path
            fill="#F2ECBE"
            onClick={() => {
              this.toggleSelectedNumber(55);
              this.props.onClick(55);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 55) ? (this.state.statusDoneTeeth.includes(55) ? "#369661" : "#DE2527")
                : this.checkImpacted(55) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="22.926"
            d={ this.checkMissing(55) ? isMissing ? `M12348.6-1894.3l-328.4-19.9
	c-66.8-347.5-138.7-908.8,117.8-1157.4c5.1,0,133.6-154,97.4,74.7c0,25.1-30.6,302.9-30.6,392.5c5.1,228.7,25.5,392.5,97.4,407.3
	c46.4,9.7,92.3-148.9,82.1-288.1c-20.4-581.3-117.8-690.3-92.3-754.8c97.4-49.6,225.9,198.5,251.4,268.1
	c92.3,243.5,122.9,486.6,143.8,814.6c10.2,109-10.2,198.5-35.7,273.2c-25.5-9.7-77,59.8-102.5,49.6L12348.6-1894.3L12348.6-1894.3z` : " " : `M12348.6-1894.3l-328.4-19.9
	c-66.8-347.5-138.7-908.8,117.8-1157.4c5.1,0,133.6-154,97.4,74.7c0,25.1-30.6,302.9-30.6,392.5c5.1,228.7,25.5,392.5,97.4,407.3
	c46.4,9.7,92.3-148.9,82.1-288.1c-20.4-581.3-117.8-690.3-92.3-754.8c97.4-49.6,225.9,198.5,251.4,268.1
	c92.3,243.5,122.9,486.6,143.8,814.6c10.2,109-10.2,198.5-35.7,273.2c-25.5-9.7-77,59.8-102.5,49.6L12348.6-1894.3L12348.6-1894.3z`}
          />
          {
            console.log('this.state.selectedTeeth', selectedTeeth)
          }
          {
            console.log('isMissing', isMissing)
          }
          <path
            fill={conditionToColor(this.props.teeth[55].condition)}
            onClick={() => {
              this.toggleSelectedNumber(55);
              this.props.onClick(55);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 55) ? (this.state.statusDoneTeeth.includes(55) ? "#369661" : "#DE2527")
                : this.checkImpacted(55) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(55) ? isMissing ? `M12634.4-1944.9c-5.1-15.8-15.3-47.3-85.8-26.4
            c-120.6,36.6-171.2-121.1-342.4-131.7c-302,84-357.2,389.2-377.6,520.5c-30.2,205,80.7,278.8,166.1,294.6
            c171.2,10.7,276.9-58,312.2-131.7c25.1,47.3,90.5,179.1,226.4,179.1c130.8-26.4,312.2-162.8,286.7-252.4
            C12810.6-1692.5,12679.8-1818.7,12634.4-1944.9L12634.4-1944.9z`: '' : `M12634.4-1944.9c-5.1-15.8-15.3-47.3-85.8-26.4
	c-120.6,36.6-171.2-121.1-342.4-131.7c-302,84-357.2,389.2-377.6,520.5c-30.2,205,80.7,278.8,166.1,294.6
	c171.2,10.7,276.9-58,312.2-131.7c25.1,47.3,90.5,179.1,226.4,179.1c130.8-26.4,312.2-162.8,286.7-252.4
	C12810.6-1692.5,12679.8-1818.7,12634.4-1944.9L12634.4-1944.9z`}
          />
          <path
            fill={conditionToColor(this.props.teeth[55].condition)}
            onClick={() => {
              this.toggleSelectedNumber(55);
              this.props.onClick(55);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 55) ? (this.state.statusDoneTeeth.includes(55) ? "#369661" : "#DE2527")
                : this.checkImpacted(55) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(55) ? isMissing ?  `M12382.9-1676.7
	c-70.5,73.8-100.7,173.5-75.6,257.9 M12166.3-1782c85.8,36.6,125.7,126.2,135.9,252.4`: '' : `M12382.9-1676.7
	c-70.5,73.8-100.7,173.5-75.6,257.9 M12166.3-1782c85.8,36.6,125.7,126.2,135.9,252.4`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 55) ? (this.state.statusDoneTeeth.includes(55) ? "#369661" : "#DE2527")
                : this.checkImpacted(55) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(55) ? isMissing ?  `M12710.9-492.8c21.8,38,39.4,71.9,43.6,105.8
	c4.2,46.4,0,105.8-13,139.2c-74.2,135-166.1,190.2-205.5,215.2c-30.6,21.3-100.7,29.7-144.3,12.5c-13,0-26.4-8.4-39.4-12.5
	c-13,0-48.2,12.5-61.2,25.5c-17.6,12.5-70,4.2-96-8.4c-13-4.2-21.8-25.5-34.8-25.5c-126.6-16.7-196.7-118.3-236.1-236.6
	c-21.8-46.4-17.6-295.5,4.2-341.9c153.1-236.6,161.9-236.6,415.7-367.4c48.2-25.5,131.3-33.9,166.1-12.5
	c205.5,135,240.8,223.6,262.6,329.4c8.8,42.2,4.2,76.1,0,109.9C12759.2-513.7,12715.1-505.4,12710.9-492.8L12710.9-492.8
	L12710.9-492.8z` : '' : `M12710.9-492.8c21.8,38,39.4,71.9,43.6,105.8
	c4.2,46.4,0,105.8-13,139.2c-74.2,135-166.1,190.2-205.5,215.2c-30.6,21.3-100.7,29.7-144.3,12.5c-13,0-26.4-8.4-39.4-12.5
	c-13,0-48.2,12.5-61.2,25.5c-17.6,12.5-70,4.2-96-8.4c-13-4.2-21.8-25.5-34.8-25.5c-126.6-16.7-196.7-118.3-236.1-236.6
	c-21.8-46.4-17.6-295.5,4.2-341.9c153.1-236.6,161.9-236.6,415.7-367.4c48.2-25.5,131.3-33.9,166.1-12.5
	c205.5,135,240.8,223.6,262.6,329.4c8.8,42.2,4.2,76.1,0,109.9C12759.2-513.7,12715.1-505.4,12710.9-492.8L12710.9-492.8
	L12710.9-492.8z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 55) ? (this.state.statusDoneTeeth.includes(55) ? "#369661" : "#DE2527")
                : this.checkImpacted(55) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(55) ? isMissing ?  `M12360.7-74.9
	c-144.3-58.9-227.3-270-231.9-295.5c0-16.7,13-29.7,30.6-42.2c21.8-12.5,0-130.8,26.4-130.8c17.6-4.2,61.2,29.7,57.1,33.9
	c-4.2,12.5-13,25.5-4.2,38` : '' : `M12360.7-74.9
	c-144.3-58.9-227.3-270-231.9-295.5c0-16.7,13-29.7,30.6-42.2c21.8-12.5,0-130.8,26.4-130.8c17.6-4.2,61.2,29.7,57.1,33.9
	c-4.2,12.5-13,25.5-4.2,38`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 55) ? (this.state.statusDoneTeeth.includes(55) ? "#369661" : "#DE2527")
                : this.checkImpacted(55) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(55) ? isMissing ?  `M11914.4-416.8c17.6,4.2,48.2,0,65.4,4.2
	c17.6,0,74.2,80.3,104.8,67.7c26.4-25.5,74.2-8.4,91.9-16.7c17.6-8.4,39.4-42.2,61.2-63.6c17.6-12.5,52.4,4.2,57.1-12.5
	c-4.2-21.3,0-42.2,17.6-54.7c13-4.2,61.2-4.2,104.8,4.2c17.6,4.2,21.8,16.7,48.2,21.3c17.6,4.2,65.4,88.6,91.9,92.8
	c21.8-4.2,52.4-92.8,65.4-109.9c8.8-21.3,74.2,0,91.9-12.5 M12715.1-581.5c13-25.5-8.8-88.6,0-92.8c13-4.2,57.1,54.7,57.1,114.1` : '' : `M11914.4-416.8c17.6,4.2,48.2,0,65.4,4.2
	c17.6,0,74.2,80.3,104.8,67.7c26.4-25.5,74.2-8.4,91.9-16.7c17.6-8.4,39.4-42.2,61.2-63.6c17.6-12.5,52.4,4.2,57.1-12.5
	c-4.2-21.3,0-42.2,17.6-54.7c13-4.2,61.2-4.2,104.8,4.2c17.6,4.2,21.8,16.7,48.2,21.3c17.6,4.2,65.4,88.6,91.9,92.8
	c21.8-4.2,52.4-92.8,65.4-109.9c8.8-21.3,74.2,0,91.9-12.5 M12715.1-581.5c13-25.5-8.8-88.6,0-92.8c13-4.2,57.1,54.7,57.1,114.1`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 55) ? (this.state.statusDoneTeeth.includes(55) ? "#369661" : "#DE2527")
                : this.checkImpacted(55) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(55) ? isMissing ?  `M12557.8-374.6c-13,8.4-21.8,12.5-26.4,25.5
	c-4.2,16.7-4.2,42.2,0,58.9` : "" : `M12557.8-374.6c-13,8.4-21.8,12.5-26.4,25.5
	c-4.2,16.7-4.2,42.2,0,58.9`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 55) ? (this.state.statusDoneTeeth.includes(55) ? "#369661" : "#DE2527")
                : this.checkImpacted(55) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(55) ? isMissing ?  `M12466-467.3c61.2-16.7,122.5-76.1,126.6-97
	c4.2-29.7-17.6-71.9,0-122.5` : "" : `M12466-467.3c61.2-16.7,122.5-76.1,126.6-97
	c4.2-29.7-17.6-71.9,0-122.5`}
          />

          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 55) ? (this.state.statusDoneTeeth.includes(55) ? "#369661" : "#DE2527")
                : this.checkImpacted(55) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(55) ? isMissing ?  `M12382.9-488.7c0-21.3-26.4-29.7-30.6-50.6
	c-4.2-21.3,30.6-84.4,30.6-101.1s26.4-25.5,52.4-38` : '' : `M12382.9-488.7c0-21.3-26.4-29.7-30.6-50.6
	c-4.2-21.3,30.6-84.4,30.6-101.1s26.4-25.5,52.4-38`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 55) ? (this.state.statusDoneTeeth.includes(55) ? "#369661" : "#DE2527")
                : this.checkImpacted(55) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(55) ? isMissing ?  `M12334.7-281.8c-8.8-12.5-26.4-25.5-39.4-29.7
	c-8.8-4.2-21.8-21.3-21.8-33.9c0-12.5,21.8-33.9,30.6-50.6s0-29.7-13-42.2c-4.2-16.7-4.2-38,17.6-54.7c4.2-16.7-13-38-8.8-58.9
	c0-25.5-52.4-63.6-61.2-118.3` : '' : `M12334.7-281.8c-8.8-12.5-26.4-25.5-39.4-29.7
	c-8.8-4.2-21.8-21.3-21.8-33.9c0-12.5,21.8-33.9,30.6-50.6s0-29.7-13-42.2c-4.2-16.7-4.2-38,17.6-54.7c4.2-16.7-13-38-8.8-58.9
	c0-25.5-52.4-63.6-61.2-118.3`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 55) ? (this.state.statusDoneTeeth.includes(55) ? "#369661" : "#DE2527")
                : this.checkImpacted(55) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(55) ? isMissing ?  `M12041.5-530.9c17.6,8.4,30.6,16.7,34.8,33.9
	c-4.2,12.5-21.8,12.5-26.4,21.3c-4.2,16.7,4.2,38-4.2,46.4c-13,12.5-17.6,38-21.8,54.7` : '' : `M12041.5-530.9c17.6,8.4,30.6,16.7,34.8,33.9
	c-4.2,12.5-21.8,12.5-26.4,21.3c-4.2,16.7,4.2,38-4.2,46.4c-13,12.5-17.6,38-21.8,54.7`}
          />


          {this.isShownRedGraphic("restoration", "Distal", 55) && (
            <path
              fill={this.state.statusDoneTeeth.includes(55) ? "#369661" : "#DE2527"}
              d="M11925.9-610.8c9.8-35.4,29.3-60.6,48.8-85.9c34.2,10.1,73.2,15.2,117.2,20.2c73.2,5.1,136.7,0,190.4-5.1
	c-4.9,15.2-14.6,25.3-19.5,45.5c-4.9,20.2-19.5,55.6-24.4,101c-4.9,55.6,0,106.1,4.9,141.4c-48.8,5-107.4,20.2-175.7,40.4
	c-63.5,20.2-112.3,45.5-156.2,70.7c-4.9-5.1-4.9-20.2-4.9-35.4c-4.9-45.5,0-80.8,0-106.1C11916.2-580.5,11921-595.7,11925.9-610.8
	L11925.9-610.8z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Lingual", 55) && (
            <path
              fill={this.state.statusDoneTeeth.includes(55) ? "#369661" : "#DE2527"}
              d="M12164.7-44.2c-4.2,0-12.7-4.4-16.9-4.4c21.1-57.8,42.3-133.4,59.2-222.4c8.5-62.3,16.9-120.1,16.9-169
	c12.7,8.9,59.2,40,122.6,44.5c71.9,4.4,118.3-26.7,135.3-40c-4.2,44.5,0,97.8,4.2,155.7c8.5,93.4,25.4,173.5,42.3,240.2v4.4
	c-8.5,13.3-21.1,13.3-38,17.8c-21.1,4.4-33.8,4.4-54.9,4.4c-12.7,0-29.6-4.4-46.5-8.9c-12.7,0-25.4-8.9-38-13.3
	c-12.7,0-46.5,13.3-59.2,26.7c-16.9,13.3-67.6,4.4-93-8.9c-4.2,0-12.7-8.9-16.9-13.3C12177.4-39.7,12168.9-39.7,12164.7-44.2
	L12164.7-44.2z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Medial", 55) && (
            <path
              fill={this.state.statusDoneTeeth.includes(55) ? "#369661" : "#DE2527"}
              d="M12706.1-499.9c33.3,51,55.6,93.4,50,106.1v21.2v21.2v29.7c-33.3-21.2-83.3-46.7-144.5-67.9
	c-72.2-21.2-133.4-29.7-177.8-34c16.7-21.2,55.6-76.4,50-148.6c-5.6-46.7-22.2-80.7-38.9-101.9c55.6-12.7,111.1-25.5,177.8-34
	c55.6-8.5,105.6-12.7,150-17c5.6,17,11.1,34,11.1,46.7c5.6,38.2,5.6,51,5.6,59.4c0,17-5.6,34-5.6,51
	C12767.2-521.1,12711.7-512.6,12706.1-499.9L12706.1-499.9z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Buccal", 55) && (
            <path
              fill={this.state.statusDoneTeeth.includes(55) ? "#369661" : "#DE2527"}
              d="M12569.4-960.5c16.1,14.7,32.1,24.5,37.5,29.4c-21.4,34.2-53.5,83.2-74.9,141.9
	c-26.7,63.6-32.1,122.3-37.4,166.3c-32.1-4.9-74.9-14.7-123-19.6c-69.5-4.9-128.4,4.9-165.8,14.7c5.4-44,10.7-102.7,5.4-166.3
	c-5.4-48.9-16-93-26.7-127.2c16-4.9,42.8-19.6,69.5-34.2l53.5-24.5c48.1-24.5,139.1-48.9,203.3-14.7
	C12521.2-989.8,12548-970.2,12569.4-960.5z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Oclusial", 55) && (
            <path
              fill={this.state.statusDoneTeeth.includes(55) ? "#369661" : "#DE2527"}
              d="M12510.2-557.2c8.9,62.6,13.3,96.4-4.5,130.1c-44.5,72.3-164.6,53-182.4,53c-26.7-4.8-62.3-9.6-89-38.5
	c-35.6-38.5-40-91.6-44.5-130.1c-4.4-48.2,4.4-81.9,8.9-91.6c4.5-19.3,13.3-38.5,26.7-53c4.4-4.8,26.7-28.9,120.1-24.1
	c62.3,0,97.9,0,115.7,19.3C12492.4-672.9,12501.3-619.9,12510.2-557.2L12510.2-557.2z"
            />
          )}
          {this.isShownRedGraphic("rootCanal", "", 55) && (
            <path
              fill={this.state.statusDoneTeeth.includes(55) ? "#369661" : "#DE2527"}
              d="M12337-3161c-12.3,4.6,79.9,236.9,129.1,464.7c6.1,4.6,6.1,9.1,6.1,13.7c12.3,45.6,36.9,145.8,30.7,277.9
	c-6.1,118.5-24.6,159.5-67.6,186.8c-73.8,45.6-184.4,36.4-215.2,31.9c-12.3,0-36.9-4.6-61.5-18.2c0,0-30.7-13.7-49.2-45.6
	c-110.7-168.6-43-496.6-43-496.6c30.7-145.8,67.6-241.5,55.3-241.5c-6.1,0-55.3,95.7-92.2,186.8c-12.3,41-43,186.8-24.6,391.8
	c6.1,63.8,18.4,141.2,43,236.9c6.1,95.7,49.2,132.1,79.9,145.8c43,22.8,79.9,4.6,221.3,13.7c129.1,4.6,153.7,22.8,196.7,9.1
	c30.7-9.1,86.1-45.6,86.1-177.7c0-159.5-12.3-400.9-129.1-678.8C12435.4-3028.9,12349.3-3165.5,12337-3161L12337-3161z"
            />
          )}
          {this.isShownRedGraphic("rootCanal", "Post and Core", 55) && (
            <path
              id="ehXMLID_2_"
              fill={this.state.statusDoneTeeth.includes(55) ? "#369661" : "#DE2527"}
              d="M12098.6-2103.7c-44.3,41.6,12.8,77.1-26.9,192.4c-26.9,78.2-69.5,110.6-44.7,130.2
	c33.5,26.1,120.4-23.1,267-20.6c182.5,2.8,282.3,82.6,324.9,56.1c31-19-22.3-60-31-156.9c-9.5-102.4,43.5-126.3,13.2-168.7
	C12536.1-2164,12186.8-2185.7,12098.6-2103.7z"
            />
          )}
          {this.isShownRedGraphic("whitening", "", 55) && (
            <polygon
              fill={this.state.statusDoneTeeth.includes(55) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(55) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              points="12038.2,-1566.2 11956.4,-1630.5 11955.2,-1526.4 
	11868.8,-1468.5 11967.3,-1435.2 11995.8,-1335.1 12057.9,-1418.5 12161.9,-1414.7 12101.7,-1499.5 12137.5,-1597.2 "
            />
          )}
          }
          {this.isShownRedGraphic("implantation", "", 55) && (
            <path
              fill={this.state.statusDoneTeeth.includes(55) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(55) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M12826.1-2033c0-74.8-40.3-135.6-90-135.6h-304.5v-62.1h153.6
	c31.4,0,57.1-38.3,57.1-86c0-47.3-25.4-86-57.1-86h-153.6v-61.7h104.6c31.4,0,57.1-38.3,57.1-86c0-47.3-25.4-86-57.1-86h-104.6
	v-61.7h55.6c31.4,0,57.1-38.3,57.1-86c0-47.3-25.4-86-57.1-86h-55.6v-61.7h6.6c31.4,0,57.1-38.3,57.1-86c0-47.3-25.4-86-57.1-86
	h-233.7c-31.4,0-57.1,38.3-57.1,86c0,47.3,25.4,86,57.1,86h6.6v61.7h-55.6c-31.4,0-57.1,38.3-57.1,86c0,47.3,25.4,86,57.1,86h55.6
	v61.7h-104.6c-31.4,0-57.1,38.3-57.1,86c0,47.3,25.4,86,57.1,86h104.6v61.7h-153.6c-31.4,0-57.1,38.3-57.1,86
	c0,47.3,25.4,86,57.1,86h153.6v61.7h-304.5c-49.6,0-90,60.8-90,135.6c0,74.8,40.3,135.6,90,135.6h829.6
	C12785.8-1897.9,12825.8-1958.2,12826.1-2033z"
            />
          )}
          {this.isShownRedGraphic("diagnosis", "", 55) && (
            <g>
              <g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)">
                <path
                  fill={this.state.statusDoneTeeth.includes(55) ? "#369661" : "#DE2527"}
                  d="M123852.9,19977.2c-108.6-37.8-211.4-110.9-292.2-206.3c-36.6-43.1-96.2-145.4-116.7-200.2
			c-92.5-246.1-52.9-522.5,104.7-732.5c169-224.7,431.2-327.9,693.1-271.7c152,32.6,275,106.2,372.5,223.6l33.7,40l183.7-126.3
			l184.4-126.8l-22.5-39.5c-39.4-68.9-68.5-41.8,357.6-334.8c204.6-140.8,379.6-257,389.1-259.4c13.1-2.9,21.1-1.1,31.9,6.8
			c21.2,15.3,151.6,234.2,152.1,254.4c0.1,10.7-4.3,23-12.2,32c-6.6,8.7-177.8,129.5-381.1,269.3
			c-416.8,285.6-388.7,271.4-425.1,216.4l-19.3-29.3l-183,125.9c-100.6,69.2-183.5,128.3-184,130.7s5.7,20.8,14.5,40.9
			c85.7,203,62.5,472.2-57.3,672.7C124502.1,19954.5,124160.3,20084.7,123852.9,19977.2z M124101.9,19857.3
			c202.2-12.7,381.7-136.2,475.4-326c32.8-66.7,60.3-192.5,58.6-270.4c-1.5-67.8-18.5-152.7-41.9-210
			c-19.7-49.6-72.4-134.6-105.6-171.4c-36.7-40-103.2-90.8-155.3-117.1c-66-33.7-185.1-58.6-255.7-54.2
			c-201.1,13-382,137.4-474.5,327.4c-29.6,60.4-56.6,175-57.5,246c-4,229.8,119.6,436.5,316.6,528.6
			C123919.7,19837.8,124041.5,19861.4,124101.9,19857.3z"
                />
                <path
                  fill={this.state.statusDoneTeeth.includes(55) ? "#369661" : "#DE2527"}
                  d="M123680.8,19555.2c-32.5-56.7-48.5-98.6-60.7-158.6c-41.1-205.4,45.2-418.8,215.9-534.8
			c83.7-57,141.6-74.2,145.8-43.7c2,15.6-7.8,25.4-42.1,38.2c-48.6,18.6-127.5,75.4-165.3,118.3c-17.6,20.8-43.9,57.4-58.7,82
			c-23.8,41.5-27.3,52.1-45.1,135.3c-17.7,82.6-19.2,94.8-14.4,141.9c6.5,69.5,25.5,128.4,60.5,190.1c29.4,51.7,32.2,63.6,16.8,74.2
			C123717.5,19609.1,123706.3,19599.8,123680.8,19555.2z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("hygiene", "", 55) && (
            <g>
              <g>
                <path
                  fill={this.state.statusDoneTeeth.includes(55) ? "#369661" : "#DE2527"}
                  d="M12702.8-1341.2l-0.8-162.6c0-2.4-2.1-4.6-4.5-4.8l-4.5-0.2l-0.2-31.6c0-2.5-2-4.6-4.5-4.8l-8.5-0.5
			l-0.3-58.8l26.6-25.3c1.8-1.7,1.7-4.5,0-6.4s-4.6-2-6.4-0.4l-29.3,27.8l0.3,62.5l-9.5-0.5c-1.2-0.1-2.3,0.3-3.2,1.1
			c-0.8,0.8-1.3,1.9-1.3,3.1l0.2,31.6l-4.5-0.2c-2.5-0.1-4.5,1.8-4.5,4.3l0.8,162.6c0,1.2,0.5,2.4,1.3,3.3c0.8,0.9,2,1.4,3.2,1.5
			l45.1,2.5C12700.8-1336.8,12702.8-1338.7,12702.8-1341.2z M12665.8-1537.4l18,1l0.1,27.1l-18-1L12665.8-1537.4z M12657.7-1348.2
			l-0.7-153.6l4.5,0.2l0,0l27.1,1.5c0,0,0,0,0,0l4.5,0.2l0.7,153.6L12657.7-1348.2z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("orthodontics", "", 55) && (
            <rect
              x="11857.8"
              y="-1772.2"
              fill={this.state.statusDoneTeeth.includes(55) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(55) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="895.7"
              height="113.9"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 55) && (
            <rect
              x="12134.4"
              y="-1817.6"
              fill={this.state.statusDoneTeeth.includes(55) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(55) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="351.6"
              height="232"
            />
          )}
          {this.isShownRedGraphic("surgery", "", 55) && (
            <path
              fill={this.state.statusDoneTeeth.includes(55) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(55) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M12219.6,172.9h-151.7v-3540.6h151.7V172.9z M12523.6-3375.5
	h-159.8V172.9h159.8V-3375.5z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 55) && (
            <path
              fill={this.state.statusDoneTeeth.includes(55) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(55) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M12794-521.7h-879.6v-152h879.6V-521.7z M12794-422.4h-879.6v152
	h879.6V-422.4z"
            />
          )}


          <path
            fill="#D0C9A3"
            onClick={() => {
              this.toggleSelectedNumber(54);
              this.props.onClick(54);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 54) ? (this.state.statusDoneTeeth.includes(54) ? "#369661" : "#DE2527")
                : this.checkImpacted(54) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="22.926"
            d= {this.checkMissing(54) ? isMissing ?`M13511.9-2245.7l-360-52.4L13112-2640
	c79.8-161.4,79.8-313.6,85.8-465.8c0-42.7,17.2-152.2,91.4-156.8c34.3,0,85.8,23.7,103,71.4c45.5,147.5,137.3,341.9,177.2,375.3
	l68.7,256.5L13511.9-2245.7z` : '' : `M13511.9-2245.7l-360-52.4L13112-2640
	c79.8-161.4,79.8-313.6,85.8-465.8c0-42.7,17.2-152.2,91.4-156.8c34.3,0,85.8,23.7,103,71.4c45.5,147.5,137.3,341.9,177.2,375.3
	l68.7,256.5L13511.9-2245.7z` }
          />
          <path
            fill="#F2ECBE"
            onClick={() => {
              this.toggleSelectedNumber(54);
              this.props.onClick(54);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 54) ? (this.state.statusDoneTeeth.includes(54) ? "#369661" : "#DE2527")
                : this.checkImpacted(54) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="22.926"
            d={ this.checkMissing(54) ? isMissing ? `M13386.2-1979.4l-399.9,118.8l-5.6-228.2
	c-45.5-152.2-108.6-266.3-131.3-451.4c-79.8-261.2,74.2-774.7,199.9-574.8c5.6,4.6,0,19,0,28.3c0,80.7,11.6,142.4,0,218.5
	c-11.6,80.7,5.6,123.4,57.1,228.2c17.2,33.4,28.8,66.3,45.5,123.4c91.4,166.1,177.2,256.5,257,199.5l28.8-204.1
	c17.2-95.1,17.2-80.7,68.7-166.1c39.9-61.7,62.6-128.5,68.7-199.5l-34.3-218.5c11.6-52.4,22.7-99.7,79.8-109.5
	c91.4,23.7,148.4,99.7,171.2,147.5c45.5,152.2,68.7,261.2,57.1,418c-11.6,99.7-34.3,190.2-68.7,275.6
	c-51.5,128.5-51.5,114.1-45.5,256.5v223.1l-120.1,9.7L13386.2-1979.4L13386.2-1979.4z` : '' : `M13386.2-1979.4l-399.9,118.8l-5.6-228.2
	c-45.5-152.2-108.6-266.3-131.3-451.4c-79.8-261.2,74.2-774.7,199.9-574.8c5.6,4.6,0,19,0,28.3c0,80.7,11.6,142.4,0,218.5
	c-11.6,80.7,5.6,123.4,57.1,228.2c17.2,33.4,28.8,66.3,45.5,123.4c91.4,166.1,177.2,256.5,257,199.5l28.8-204.1
	c17.2-95.1,17.2-80.7,68.7-166.1c39.9-61.7,62.6-128.5,68.7-199.5l-34.3-218.5c11.6-52.4,22.7-99.7,79.8-109.5
	c91.4,23.7,148.4,99.7,171.2,147.5c45.5,152.2,68.7,261.2,57.1,418c-11.6,99.7-34.3,190.2-68.7,275.6
	c-51.5,128.5-51.5,114.1-45.5,256.5v223.1l-120.1,9.7L13386.2-1979.4L13386.2-1979.4z` }
          />
          <path
            fill={conditionToColor(this.props.teeth[54].condition)}
            onClick={() => {
              this.toggleSelectedNumber(54);
              this.props.onClick(54);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 54)
                ? (this.state.statusDoneTeeth.includes(54) ? "#369661" : "#DE2527")
                : this.checkImpacted(54) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(54) ? isMissing ? `M13741.6-1884.8
            c-19.9-43.6-120.1-34.8-140.1-43.6c-39.9-13-70-26.4-135-65.4c-34.8-21.8-75.2-21.8-115-21.8c-30.2,0-54.7,26.4-84.9,34.8
            l-210.1,65.4c-34.8,17.6-64.9,34.8-84.9,74.2l-39.9,96l-14.8,34.8c-25.1,34.8-39.9,91.9-45,135.5c-10.2,43.6-10.2,65.4,5.1,109.5
            c14.8,48.2,34.8,87.2,54.7,126.6c25.1,48.2,79.8,74.2,109.9,78.9c59.8,4.2,99.7-4.2,164.7-26.4l84.9-30.6
            c45,48.2,54.7,61.2,79.8,78.9c95.1,70,160,21.8,214.8-48.2h144.7c19.9-4.2,50.1-26.4,79.8-61.2c59.8-61.2,59.8-70,64.9-148.4
            c0-70-10.2-70-50.1-131.3c-45-70-50.1-65.4-59.8-148.4l-5.1-61.2L13741.6-1884.8L13741.6-1884.8L13741.6-1884.8z`: '' : `M13741.6-1884.8
	c-19.9-43.6-120.1-34.8-140.1-43.6c-39.9-13-70-26.4-135-65.4c-34.8-21.8-75.2-21.8-115-21.8c-30.2,0-54.7,26.4-84.9,34.8
	l-210.1,65.4c-34.8,17.6-64.9,34.8-84.9,74.2l-39.9,96l-14.8,34.8c-25.1,34.8-39.9,91.9-45,135.5c-10.2,43.6-10.2,65.4,5.1,109.5
	c14.8,48.2,34.8,87.2,54.7,126.6c25.1,48.2,79.8,74.2,109.9,78.9c59.8,4.2,99.7-4.2,164.7-26.4l84.9-30.6
	c45,48.2,54.7,61.2,79.8,78.9c95.1,70,160,21.8,214.8-48.2h144.7c19.9-4.2,50.1-26.4,79.8-61.2c59.8-61.2,59.8-70,64.9-148.4
	c0-70-10.2-70-50.1-131.3c-45-70-50.1-65.4-59.8-148.4l-5.1-61.2L13741.6-1884.8L13741.6-1884.8L13741.6-1884.8z`}
          />
          <path
            fill={conditionToColor(this.props.teeth[54].condition)}
            onClick={() => {
              this.toggleSelectedNumber(54);
              this.props.onClick(54);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 54)
                ? (this.state.statusDoneTeeth.includes(54) ? "#369661" : "#DE2527")
                : this.checkImpacted(54) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(54) ? isMissing ? `M13461.8-1613.9c-54.7,48.2-160,179.1-45,257.9
	c14.8,13,34.8,17.6,45,21.8l124.8,48.2`: '' : `M13461.8-1613.9c-54.7,48.2-160,179.1-45,257.9
	c14.8,13,34.8,17.6,45,21.8l124.8,48.2`}
          />
          <path
            fill={conditionToColor(this.props.teeth[54].condition)}
            onClick={() => this.props.onClick(54)}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 54)
                ? (this.state.statusDoneTeeth.includes(54) ? "#369661" : "#DE2527")
                : this.checkImpacted(54) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(54) ? isMissing ? `M13236.9-1718.7c64.9,39.4,90,100.7,120.1,153.1
	c39.9,70-10.2,187.9-64.9,244.9`: '' : `M13236.9-1718.7c64.9,39.4,90,100.7,120.1,153.1
	c39.9,70-10.2,187.9-64.9,244.9`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 54)
                ? (this.state.statusDoneTeeth.includes(54) ? "#369661" : "#DE2527")
                : this.checkImpacted(54) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(54) ? isMissing ? `M13788.4-404.5c0,16.2,16.7,64.5,12.5,80.7
	c0,24.1-32.9,108.6-86.7,169.3c-49.6,52.4-115.5,84.4-156.8,92.8c-24.6,7.9-70,7.9-95.1,0c-32.9-12.1-86.7-36.2-99.3-32
	c-16.7,0-78.4,60.3-99.3,64.5c-41.3,0-111.3,0-140.1-12.1c-32.9-12.1-78.4-56.6-107.2-100.7c-41.3-56.6-70-108.6-78.4-185.1
	c-12.5-92.8-16.7-213.4-4.2-270c37.1-153.1,214.8-261.6,487.1-314.1c58-12.1,152.6-12.1,193.9,4.2c28.8,12.1,128,56.6,222.7,153.1
	c24.6,24.1,12.5,265.8,0,282.1C13829.7-456.9,13792.6-416.6,13788.4-404.5L13788.4-404.5L13788.4-404.5z` : '' : `M13788.4-404.5c0,16.2,16.7,64.5,12.5,80.7
	c0,24.1-32.9,108.6-86.7,169.3c-49.6,52.4-115.5,84.4-156.8,92.8c-24.6,7.9-70,7.9-95.1,0c-32.9-12.1-86.7-36.2-99.3-32
	c-16.7,0-78.4,60.3-99.3,64.5c-41.3,0-111.3,0-140.1-12.1c-32.9-12.1-78.4-56.6-107.2-100.7c-41.3-56.6-70-108.6-78.4-185.1
	c-12.5-92.8-16.7-213.4-4.2-270c37.1-153.1,214.8-261.6,487.1-314.1c58-12.1,152.6-12.1,193.9,4.2c28.8,12.1,128,56.6,222.7,153.1
	c24.6,24.1,12.5,265.8,0,282.1C13829.7-456.9,13792.6-416.6,13788.4-404.5L13788.4-404.5L13788.4-404.5z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 54)
                ? (this.state.statusDoneTeeth.includes(54) ? "#369661" : "#DE2527")
                : this.checkImpacted(54) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(54) ? isMissing ? `M13677.1-416.6c-8.4,4.2-28.8,4.2-45.5,4.2
	c-12.5,0-24.6-16.2-41.3-19.9c-16.7-7.9-45.5-4.2-70-4.2c-24.6-4.2-61.7-24.1-78.4-24.1c-12.5,0-41.3,12.1-58,12.1
	c-20.4,4.2-41.3,28.3-58,32c-16.7,0-53.8-24.1-70-24.1c-16.7,0-24.6,24.1-41.3,32c-24.6,12.1-24.6,40.4-37.1,44.1
	c-12.5,0-24.6-19.9-37.1-24.1c-20.4-4.2-45.5-7.9-70-4.2c-28.8,4.2-32.9,19.9-65.9,19.9 M13260.5-508.9
	c-24.6,28.3-82.6,68.7-95.1,68.7c-16.7,0-49.6-80.7-82.6-120.6c-8.4-12.1-24.6-32-12.5-56.6c4.2-12.1,32.9-52.4,58-36.2` : '' : `M13677.1-416.6c-8.4,4.2-28.8,4.2-45.5,4.2
	c-12.5,0-24.6-16.2-41.3-19.9c-16.7-7.9-45.5-4.2-70-4.2c-24.6-4.2-61.7-24.1-78.4-24.1c-12.5,0-41.3,12.1-58,12.1
	c-20.4,4.2-41.3,28.3-58,32c-16.7,0-53.8-24.1-70-24.1c-16.7,0-24.6,24.1-41.3,32c-24.6,12.1-24.6,40.4-37.1,44.1
	c-12.5,0-24.6-19.9-37.1-24.1c-20.4-4.2-45.5-7.9-70-4.2c-28.8,4.2-32.9,19.9-65.9,19.9 M13260.5-508.9
	c-24.6,28.3-82.6,68.7-95.1,68.7c-16.7,0-49.6-80.7-82.6-120.6c-8.4-12.1-24.6-32-12.5-56.6c4.2-12.1,32.9-52.4,58-36.2`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 54)
                ? (this.state.statusDoneTeeth.includes(54) ? "#369661" : "#DE2527")
                : this.checkImpacted(54) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(54) ? isMissing ? `M13429.4-251.4c-37.1,0-61.7-52.4-82.6-60.3
	c-16.7-4.2-41.3-40.4-49.6-72.4c-4.2-16.2,24.6-16.2,24.6-36.2c-16.7-48.2-61.7-76.5-61.7-88.6c8.4-16.2,49.6-44.1,58-56.6
	c4.2-7.9,16.7-32,12.5-56.6c-4.2-19.9-28.8-44.1-32.9-52.4c-4.2-7.9-53.8-28.3-82.6-12.1` : '' : `M13429.4-251.4c-37.1,0-61.7-52.4-82.6-60.3
	c-16.7-4.2-41.3-40.4-49.6-72.4c-4.2-16.2,24.6-16.2,24.6-36.2c-16.7-48.2-61.7-76.5-61.7-88.6c8.4-16.2,49.6-44.1,58-56.6
	c4.2-7.9,16.7-32,12.5-56.6c-4.2-19.9-28.8-44.1-32.9-52.4c-4.2-7.9-53.8-28.3-82.6-12.1`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 54)
                ? (this.state.statusDoneTeeth.includes(54) ? "#369661" : "#DE2527")
                : this.checkImpacted(54) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(54) ? isMissing ? `M13383.9-452.7c24.6-40.4,4.2-72.4,24.6-120.6
	l24.6-60.3c16.7-36.2,61.7-100.7,103-72.4` : '' : `M13383.9-452.7c24.6-40.4,4.2-72.4,24.6-120.6
	l24.6-60.3c16.7-36.2,61.7-100.7,103-72.4`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 54)
                ? (this.state.statusDoneTeeth.includes(54) ? "#369661" : "#DE2527")
                : this.checkImpacted(54) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(54) ? isMissing ? `M13697.5-271.4c12.5,4.2,20.4,0,28.8-4.2
	c8.4-4.2,4.2-52.4,4.2-60.3c-4.2-19.9-32.9,4.2-32.9-72.4c-8.4-4.2-24.6-4.2-37.1-4.2c61.7-32,61.7-92.8,78.4-100.7
	c28.8-16.2,78.4-48.2,111.3-64.5` : '' : `M13697.5-271.4c12.5,4.2,20.4,0,28.8-4.2
	c8.4-4.2,4.2-52.4,4.2-60.3c-4.2-19.9-32.9,4.2-32.9-72.4c-8.4-4.2-24.6-4.2-37.1-4.2c61.7-32,61.7-92.8,78.4-100.7
	c28.8-16.2,78.4-48.2,111.3-64.5`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 54)
                ? (this.state.statusDoneTeeth.includes(54) ? "#369661" : "#DE2527")
                : this.checkImpacted(54) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(54) ? isMissing ? `M13635.8-541.3c-12.5-28.3-8.4-88.6-8.4-108.6
	c0-16.2,4.2-44.1,16.7-56.6c20.4-19.9,41.3-19.9,61.7-19.9` : '' : `M13635.8-541.3c-12.5-28.3-8.4-88.6-8.4-108.6
	c0-16.2,4.2-44.1,16.7-56.6c20.4-19.9,41.3-19.9,61.7-19.9`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 54)
                ? (this.state.statusDoneTeeth.includes(54) ? "#369661" : "#DE2527")
                : this.checkImpacted(54) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(54) ? isMissing ? `M13177.9-364.1c4.2,12.1,4.2,28.3,4.2,44.1
	c4.2,16.2,12.5,36.2,20.4,52.4c49.6,76.5,123.9,148.9,173.5,177.2` : '' : `M13177.9-364.1c4.2,12.1,4.2,28.3,4.2,44.1
	c4.2,16.2,12.5,36.2,20.4,52.4c49.6,76.5,123.9,148.9,173.5,177.2`}
          />

          {this.isShownRedGraphic("whitening", "", 54) && (
            <polygon
              fill={this.state.statusDoneTeeth.includes(54) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(54) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              points="13088.8,-1521.4 13007,-1585.6 13005.8,-1481.6 
	12919.4,-1423.6 13017.9,-1390.3 13046.4,-1290.2 13108.5,-1373.7 13212.5,-1369.8 13152.3,-1454.7 13188.1,-1552.4 "
            />
          )}
          {this.isShownRedGraphic("implantation", "", 54) && (
            <path
              fill={this.state.statusDoneTeeth.includes(54) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(54) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M13850.2-1965.8c0-74.8-40.3-135.6-90-135.6h-304.5v-62.1h153.6
	c31.4,0,57.1-38.3,57.1-86c0-47.3-25.4-86-57.1-86h-153.6v-61.7h104.6c31.4,0,57.1-38.3,57.1-86c0-47.3-25.4-86-57.1-86h-104.6
	v-61.7h55.6c31.4,0,57.1-38.3,57.1-86c0-47.3-25.4-86-57.1-86h-55.6v-61.7h6.6c31.4,0,57.1-38.3,57.1-86c0-47.3-25.4-86-57.1-86
	h-233.7c-31.4,0-57.1,38.3-57.1,86c0,47.3,25.4,86,57.1,86h6.6v61.7h-55.6c-31.4,0-57.1,38.3-57.1,86c0,47.3,25.4,86,57.1,86h55.6
	v61.7h-104.6c-31.4,0-57.1,38.3-57.1,86c0,47.3,25.4,86,57.1,86h104.6v61.7h-153.6c-31.4,0-57.1,38.3-57.1,86
	c0,47.3,25.4,86,57.1,86h153.6v61.7h-304.5c-49.6,0-90,60.8-90,135.6c0,74.8,40.3,135.6,90,135.6h829.6
	C13809.8-1830.7,13849.9-1891,13850.2-1965.8z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Distal", 54) && (
            <path
              fill={this.state.statusDoneTeeth.includes(54) ? "#369661" : "#DE2527"}
              d="M12932.2-602.3c10.6-28.7,26.5-76.5,74.1-129.2c37.1,19.1,84.7,43.1,142.9,57.4
	c74.1,19.1,137.7,19.1,185.3,19.1c-21.2,28.7-63.5,95.7-63.5,186.6c0,52.6,15.9,95.7,26.5,124.4c-42.4-4.8-111.2-9.6-190.6,4.8
	c-74.1,14.4-127.1,38.3-164.1,57.4c-5.3-14.4-10.6-28.7-10.6-38.3v-67c0-9.6-5.3-67-5.3-110
	C12926.9-549.7,12926.9-573.6,12932.2-602.3L12932.2-602.3z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Oclusial", 54) && (
            <path
              fill={this.state.statusDoneTeeth.includes(54) ? "#369661" : "#DE2527"}
              d="M13261.5-513.4c7.8-48.1,11.7-92.1,46.7-124.2c35.1-28,81.8-24,116.9-24c31.2,4,54.5,12,58.4,12
	c15.6,4,31.2,12,62.3,28c35.1,20,35.1,20,39,24c3.9,8,3.9,16,3.9,72.1v28c0,12-3.9,52.1-27.3,104.1c-11.7,24-19.5,40-35.1,56.1
	c-39,40-105.2,48.1-155.8,32c-15.6-4-66.2-24-97.4-76.1C13249.8-429.3,13253.7-473.4,13261.5-513.4L13261.5-513.4z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Medial", 54) && (
            <path
              fill={this.state.statusDoneTeeth.includes(54) ? "#369661" : "#DE2527"}
              d="M13847.1-548c13.1,8.5,8.8,29.8,4.4,38.3c-4.4,21.3-13.1,38.3-17.5,46.8c-17.5,21.3-30.6,21.3-35,38.3
	s0,34,0,38.3c0,12.8,4.4,12.8,8.8,29.8s0,25.5,0,34s-4.4,17-4.4,21.3c-4.4,8.5-8.8,17-8.8,21.3l-8.8,17c-4.4,8.5-4.4,12.8-4.4,12.8
	c-4.4,12.8-4.4,17-8.8,17h-8.8c-8.8-4.3-17.5-8.5-21.9-12.8c-17.5-12.8-17.5-12.8-26.3-21.3c-4.4-4.3-8.8-8.5-21.9-12.8
	c-26.3-12.8-61.3-21.3-70-25.5c-21.9-8.5-43.8-12.8-74.4-21.3c-21.9-4.3-48.2-8.5-74.4-12.8c17.5-21.3,43.8-59.5,61.3-114.8
	c17.5-68,13.1-127.6,4.4-157.3c30.6,0,56.9,4.3,83.2,8.5c35,4.3,70,8.5,96.3,17c26.3,8.5,56.9,17,83.2,25.5c21.9,4.3,35,8.5,35,8.5
	C13842.8-548,13842.8-548,13847.1-548L13847.1-548z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Buccal", 54) && (
            <path
              fill={this.state.statusDoneTeeth.includes(54) ? "#369661" : "#DE2527"}
              d="M13584.8-919.2c38.7,14.3,68.7,28.7,90.2,38.3c-30.1,33.5-64.4,86.1-90.2,153.1
	c-25.8,67-38.7,129.1-43,172.2c-21.5-19.1-73-57.4-146.1-67s-133.2,9.6-158.9,19.1c8.6-33.5,17.2-81.3,17.2-133.9
	c0-47.8-4.3-90.9-8.6-124.4c68.7-28.7,124.6-43,167.5-52.6C13473.1-928.8,13524.7-938.3,13584.8-919.2L13584.8-919.2z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Lingual", 54) && (
            <path
              fill={this.state.statusDoneTeeth.includes(54) ? "#369661" : "#DE2527"}
              d="M13127.4-40.3c-16-25.5,44-80.7,76-165.6c28-68,28-135.9,20-191.1c24,17,68,46.7,132,55.2
	c56,8.5,100,0,128-8.5c-8,46.7-16,101.9-16,161.4c0,46.7,0,89.2,4,127.4c-4,0-8-4.2-16-4.2c-36-12.7-44-21.2-68-25.5
	c-8,0-20-4.2-32,0c-40,8.5-40,38.2-80,55.2c-16,8.5-40,4.2-84,4.2C13151.4-31.8,13131.4-31.8,13127.4-40.3L13127.4-40.3z"
            />
          )}
          {this.isShownRedGraphic("rootCanal", "Post and Core", 54) && (
            <path
              id="ehXMLID_3_"
              fill={this.state.statusDoneTeeth.includes(54) ? "#369661" : "#DE2527"}
              d="M13129.3-2023.5c-25.8,43.9,19.4,68.7,11.3,174.8c-7.4,100.4-53,142.8-26.5,162.5
	c36.4,27.4,121.6-55.3,277.4-58.2c125.1-2.6,199.3,48.5,227.9,21.4c21.2-20.2-15.2-53.9-38.2-134.9c-33.9-119.5,14.8-156.2-23-199.3
	C13483-2142.1,13184.8-2119.6,13129.3-2023.5z"
            />
          )}
          {this.isShownRedGraphic("rootCanal", "", 54) && (
            <path
              fill={this.state.statusDoneTeeth.includes(54) ? "#369661" : "#DE2527"}
              d="M13672.6-2688.2c-6.1,30-6.1,25-12.3,75.1c-30.7,180.3-24.6,230.3-55.3,320.5
	c-36.9,100.1-73.8,130.2-92.2,140.2c-55.3,30-110.7,35.1-129.1,35.1c-24.6,0-79.9,5-135.3-20c-36.9-15-55.3-35.1-73.8-55.1
	c-73.8-80.1-79.9-180.3-104.5-265.4c-49.2-155.2-55.3-140.2-79.9-225.3c-61.5-240.4-6.1-430.6-24.6-430.6
	c-12.3,0-49.2,85.1-67.6,200.3c-55.3,330.5,92.2,630.9,135.3,801.2c0,0,6.1,5,6.1,15c6.1,10,30.7,80.1,98.4,100.1
	c43,15,61.5-10,153.7-15c92.2-5,129.1,20,202.9,0c0,0,36.9-10,67.6-35.1c123-85.1,325.9-505.8,166-996.5
	c-24.6-85.1-43-100.1-49.2-100.1C13660.3-3138.8,13715.6-2933.5,13672.6-2688.2z"
            />
          )}
          {this.isShownRedGraphic("diagnosis", "", 54) && (
            <g>
              <g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)">
                <path
                  fill={this.state.statusDoneTeeth.includes(54) ? "#369661" : "#DE2527"}
                  d="M134554,20090.2c-108.6-37.8-211.5-110.9-292.2-206.3c-36.6-43.1-96.3-145.4-116.7-200.2
			c-92.5-246.1-52.9-522.5,104.7-732.5c169-224.7,431.2-327.9,693-271.7c152,32.6,275,106.2,372.5,223.6l33.7,40l183.7-126.3
			l184.4-126.8l-22.5-39.5c-39.4-68.9-68.5-41.8,357.6-334.8c204.7-140.8,379.7-257,389.1-259.4c13.1-2.9,21.1-1.1,31.9,6.8
			c21.2,15.3,151.7,234.2,152.1,254.4c0.1,10.7-4.3,23-12.2,32c-6.6,8.7-177.8,129.5-381.1,269.3
			c-416.8,285.6-388.7,271.4-425.1,216.4l-19.3-29.3l-183,125.9c-100.6,69.2-183.5,128.3-184,130.7c-0.5,2.4,5.7,20.8,14.4,40.9
			c85.7,203,62.5,472.2-57.3,672.7C135203.2,20067.4,134861.4,20197.7,134554,20090.2z M134803,19970.3
			c202.2-12.7,381.7-136.2,475.4-326c32.8-66.7,60.3-192.5,58.6-270.4c-1.5-67.8-18.5-152.7-41.9-210
			c-19.7-49.6-72.4-134.6-105.6-171.4c-36.7-40-103.2-90.8-155.3-117.1c-66-33.7-185.1-58.6-255.8-54.2
			c-201.1,13-382,137.4-474.5,327.4c-29.6,60.4-56.6,175-57.5,246c-4,229.8,119.6,436.5,316.6,528.6
			C134620.8,19950.7,134742.6,19974.3,134803,19970.3z"
                />
                <path
                  fill={this.state.statusDoneTeeth.includes(54) ? "#369661" : "#DE2527"}
                  d="M134381.9,19668.2c-32.5-56.7-48.5-98.6-60.7-158.6c-41.1-205.4,45.2-418.8,215.9-534.7
			c83.7-57,141.6-74.3,145.8-43.7c2,15.6-7.8,25.4-42.1,38.2c-48.6,18.6-127.5,75.4-165.3,118.3c-17.6,20.8-43.9,57.4-58.7,82
			c-23.8,41.5-27.3,52.1-45.1,135.3c-17.7,82.6-19.2,94.8-14.3,141.9c6.5,69.5,25.5,128.4,60.5,190.1c29.4,51.7,32.2,63.6,16.8,74.2
			C134418.6,19722.1,134407.5,19712.8,134381.9,19668.2z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("hygiene", "", 54) && (
            <g>
              <g>
                <path
                  fill={this.state.statusDoneTeeth.includes(54) ? "#369661" : "#DE2527"}
                  d="M13737.3-1332.3l-9.9-154.2c-0.1-2.3-2.3-4.5-4.5-4.8l-4.3-0.5l-1.9-30c-0.2-2.4-2.2-4.5-4.5-4.8l-8.1-0.9
			l-3.6-55.7l23.7-22.5c1.6-1.5,1.4-4.2-0.4-6.1s-4.5-2.2-6-0.7l-26,24.7l3.8,59.3l-9-1c-1.1-0.1-2.2,0.2-2.9,0.9
			c-0.7,0.7-1.1,1.7-1.1,2.9l1.9,30l-4.3-0.5c-2.4-0.3-4.1,1.4-4,3.8l9.9,154.1c0.1,1.1,0.6,2.3,1.4,3.2s2,1.5,3.1,1.6l42.6,4.9
			C13735.7-1328.3,13737.5-1330,13737.3-1332.3z M13691.4-1520.4l17.1,2l1.7,25.7l-17-2L13691.4-1520.4z M13694.4-1341.5l-9.4-145.6
			l4.3,0.5l0,0l25.6,2.9c0,0,0,0,0,0l4.3,0.5l9.4,145.6L13694.4-1341.5z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("orthodontics", "", 54) && (
            <rect
              x="13194.2"
              y="-1796.2"
              fill={this.state.statusDoneTeeth.includes(54) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(54) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="351.6"
              height="232"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 54) && (
            <rect
              x="12903.8"
              y="-1761.7"
              fill={this.state.statusDoneTeeth.includes(54) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(54) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="874.6"
              height="113.9"
            />
          )}
          {this.isShownRedGraphic("surgery", "", 54) && (
            <path
              fill={this.state.statusDoneTeeth.includes(54) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(54) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M13278.3,196.6h-151.7V-3344h151.7V196.6z M13582.3-3351.8h-159.8
	V196.6h159.8V-3351.8z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 54) && (
            <path
              fill={this.state.statusDoneTeeth.includes(54) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(54) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M13861.6-516.3h-950.3v-152h950.3V-516.3z M13861.6-417h-950.3v152
	h950.3V-417z"
            />
          )}




          <path
            fill="#F2ECBE"
            onClick={() => {
              this.toggleSelectedNumber(53);
              this.props.onClick(53);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 53) ? (this.state.statusDoneTeeth.includes(53) ? "#369661" : "#DE2527")
                : this.checkImpacted(53) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(53) ? isMissing ? `M14388.1-1869.4l-142.9,47.3l-149.8-43.6
	c-52.4-123.9-52.4-189.3-48.7-342.4c0-113.2,87.2-357.2,73.3-459.3c7-193-20.9-328-13.9-506.6c0-123.9,104.8-105.8,149.8-7.4
	C14405.2-2849.6,14398.3-2222.9,14388.1-1869.4L14388.1-1869.4z` : "" : `M14388.1-1869.4l-142.9,47.3l-149.8-43.6
	c-52.4-123.9-52.4-189.3-48.7-342.4c0-113.2,87.2-357.2,73.3-459.3c7-193-20.9-328-13.9-506.6c0-123.9,104.8-105.8,149.8-7.4
	C14405.2-2849.6,14398.3-2222.9,14388.1-1869.4L14388.1-1869.4z`}
          />
          <path
            fill={conditionToColor(this.props.teeth[53].condition)}
            onClick={() => {
              this.toggleSelectedNumber(53);
              this.props.onClick(53);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 53)
                ? (this.state.statusDoneTeeth.includes(53) ? "#369661" : "#DE2527")
                : this.checkImpacted(53) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(53) ? isMissing ? `M14389.9-1907.9
            c18.6,89.1,14.8,129.9,48.2,200.9c174.9,241.7,129.9,341.9-103.9,482.9c-33.4,18.6-55.7,44.5-111.3,37.1
            c-59.4-18.6-96.5-74.2-96.5-74.2c-7.4-3.7-7.4,26-29.7,26c-137.3-33.4-219.4-200.9-171.2-371.6c52-96.5,133.6-289.9,141-304.8
            c14.8-40.8,89.1-74.2,152.6-74.2c55.7-3.7,96.5,11.1,137.3,33.4C14371.4-1945,14382.5-1926.5,14389.9-1907.9L14389.9-1907.9
            L14389.9-1907.9z`: '' : `M14389.9-1907.9
	c18.6,89.1,14.8,129.9,48.2,200.9c174.9,241.7,129.9,341.9-103.9,482.9c-33.4,18.6-55.7,44.5-111.3,37.1
	c-59.4-18.6-96.5-74.2-96.5-74.2c-7.4-3.7-7.4,26-29.7,26c-137.3-33.4-219.4-200.9-171.2-371.6c52-96.5,133.6-289.9,141-304.8
	c14.8-40.8,89.1-74.2,152.6-74.2c55.7-3.7,96.5,11.1,137.3,33.4C14371.4-1945,14382.5-1926.5,14389.9-1907.9L14389.9-1907.9
	L14389.9-1907.9z`}
          />
          <path
            fill={conditionToColor(this.props.teeth[53].condition)}
            onClick={() => {
              this.toggleSelectedNumber(53);
              this.props.onClick(53);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 53)
                ? (this.state.statusDoneTeeth.includes(53) ? "#369661" : "#DE2527")
                : this.checkImpacted(53) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(53) ? isMissing ? `M14136.6-1359.1c38.5-108.1,9.7-197.6-96-284.8` : '' : `M14136.6-1359.1c38.5-108.1,9.7-197.6-96-284.8`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 53)
                ? (this.state.statusDoneTeeth.includes(53) ? "#369661" : "#DE2527")
                : this.checkImpacted(53) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(53) ? isMissing ? `M14567.1-612.2
	c-34.8-53.8-146.6-118.8-240.8-143.8c-41.8-14.4-115-21.8-160.5,0c-69.6,28.8-181.4,122.5-226.8,219.4
	c-17.6,32.5-17.6,79.3,3.7,129.4c62.6,108.1,135.9,205,244.5,255.1c27.8,14.4,66.3,14.4,97.9,0c94.2-21.8,223.1-161.9,289.5-334.5
	C14598.7-558,14584.8-586.7,14567.1-612.2L14567.1-612.2L14567.1-612.2z` : '' : `M14567.1-612.2
	c-34.8-53.8-146.6-118.8-240.8-143.8c-41.8-14.4-115-21.8-160.5,0c-69.6,28.8-181.4,122.5-226.8,219.4
	c-17.6,32.5-17.6,79.3,3.7,129.4c62.6,108.1,135.9,205,244.5,255.1c27.8,14.4,66.3,14.4,97.9,0c94.2-21.8,223.1-161.9,289.5-334.5
	C14598.7-558,14584.8-586.7,14567.1-612.2L14567.1-612.2L14567.1-612.2z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 53)
                ? (this.state.statusDoneTeeth.includes(53) ? "#369661" : "#DE2527")
                : this.checkImpacted(53) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(53) ? isMissing ? `M14371.8-536.6c-20.9,0-41.8,0-59.4,10.7
	c-13.9,10.7-24.6,21.8-24.6,43.1c0,18.1,3.7,39.4,7,57.5c-38.5,25.1-84-36.2-108.1-64.9c-7-10.7-17.6-18.1-27.8-21.8
	c-17.6,0-27.8,7.4-41.8,14.4c-17.6,18.1-20.9,39.4-17.6,61.2c0,14.4,3.7,28.8,3.7,43.1c-3.7,14.4,0,28.8,10.7,39.4
	c10.7,25.1,20.9,46.9,41.8,61.2c27.8,14.4,41.8,14.4,38.5-3.7c-7-18.1-3.7-53.8,0-64.9c0-10.7,34.8-21.8,34.8-18.1
	c3.7,3.7,24.6,0,38.5,0c13.9,3.7,24.6,10.7,38.5,18.1c10.7,3.7,20.9,3.7,31.5,7.4c0-28.8,0-57.5,20.9-79.3
	c10.7-10.7,20.9-28.8,24.6-46.9C14382.5-497.2,14382.5-522.2,14371.8-536.6L14371.8-536.6L14371.8-536.6z` : '' : `M14371.8-536.6c-20.9,0-41.8,0-59.4,10.7
	c-13.9,10.7-24.6,21.8-24.6,43.1c0,18.1,3.7,39.4,7,57.5c-38.5,25.1-84-36.2-108.1-64.9c-7-10.7-17.6-18.1-27.8-21.8
	c-17.6,0-27.8,7.4-41.8,14.4c-17.6,18.1-20.9,39.4-17.6,61.2c0,14.4,3.7,28.8,3.7,43.1c-3.7,14.4,0,28.8,10.7,39.4
	c10.7,25.1,20.9,46.9,41.8,61.2c27.8,14.4,41.8,14.4,38.5-3.7c-7-18.1-3.7-53.8,0-64.9c0-10.7,34.8-21.8,34.8-18.1
	c3.7,3.7,24.6,0,38.5,0c13.9,3.7,24.6,10.7,38.5,18.1c10.7,3.7,20.9,3.7,31.5,7.4c0-28.8,0-57.5,20.9-79.3
	c10.7-10.7,20.9-28.8,24.6-46.9C14382.5-497.2,14382.5-522.2,14371.8-536.6L14371.8-536.6L14371.8-536.6z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 53)
                ? (this.state.statusDoneTeeth.includes(53) ? "#369661" : "#DE2527")
                : this.checkImpacted(53) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(53) ? isMissing ? `M13991.4-417.9c13.9-7.4,24.6-10.7,41.8,0
	c17.6,10.7,38.5,18.1,55.7,21.8c13.9,3.7,10.7,18.1,20.9,32.5c10.7,7.4,17.6,39.4,31.5,53.8c13.9,14.4,27.8,28.8,45.5,25.1
	c10.7-3.7,3.7-39.4,0-61.2c0-10.7,10.7-25.1,20.9-32.5c13.9-7.4,59.4-7.4,73.3,0c7,3.7,17.6,14.4,24.6,18.1c24.6,10.7,69.6,7.4,84,0
	c10.7-3.7,94.2-64.9,115-147.5c3.7-10.7,31.5-36.2,20.9-61.2` : '' : `M13991.4-417.9c13.9-7.4,24.6-10.7,41.8,0
	c17.6,10.7,38.5,18.1,55.7,21.8c13.9,3.7,10.7,18.1,20.9,32.5c10.7,7.4,17.6,39.4,31.5,53.8c13.9,14.4,27.8,28.8,45.5,25.1
	c10.7-3.7,3.7-39.4,0-61.2c0-10.7,10.7-25.1,20.9-32.5c13.9-7.4,59.4-7.4,73.3,0c7,3.7,17.6,14.4,24.6,18.1c24.6,10.7,69.6,7.4,84,0
	c10.7-3.7,94.2-64.9,115-147.5c3.7-10.7,31.5-36.2,20.9-61.2`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 53)
                ? (this.state.statusDoneTeeth.includes(53) ? "#369661" : "#DE2527")
                : this.checkImpacted(53) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(53) ? isMissing ? `M14099.5-374.7c7-10.7,3.7-36.2,0-61.2
	c0-18.1,0-36.2,7-50.6c10.7-18.1,31.5-28.8,45.5-28.8c17.6,0,31.5,7.4,34.8,21.8` : '' : `M14099.5-374.7c7-10.7,3.7-36.2,0-61.2
	c0-18.1,0-36.2,7-50.6c10.7-18.1,31.5-28.8,45.5-28.8c17.6,0,31.5,7.4,34.8,21.8`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 53)
                ? (this.state.statusDoneTeeth.includes(53) ? "#369661" : "#DE2527")
                : this.checkImpacted(53) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(53) ? isMissing ? `M14302.2-212.8c-3.7-7.4-3.7-14.4,0-18.1
	c7,0,13.9-7.4,13.9-10.7c10.7-10.7-3.7-79.3,3.7-111.3h17.6c3.7-28.8,0-64.9,20.9-79.3` : '' : `M14302.2-212.8c-3.7-7.4-3.7-14.4,0-18.1
	c7,0,13.9-7.4,13.9-10.7c10.7-10.7-3.7-79.3,3.7-111.3h17.6c3.7-28.8,0-64.9,20.9-79.3`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 53)
                ? (this.state.statusDoneTeeth.includes(53) ? "#369661" : "#DE2527")
                : this.checkImpacted(53) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(53) ? isMissing ? `M14263.7-378.4c3.7-14.4,17.6-25.1,24.6-36.2
	c10.7-14.4-3.7-46.9-3.7-71.9c7-32.5,34.8-53.8,87.2-50.6` : '' : `M14263.7-378.4c3.7-14.4,17.6-25.1,24.6-36.2
	c10.7-14.4-3.7-46.9-3.7-71.9c7-32.5,34.8-53.8,87.2-50.6`}
          />

          {this.isShownRedGraphic("restoration", "Distal", 53) && (
            <path
              fill={this.state.statusDoneTeeth.includes(53) ? "#369661" : "#DE2527"}
              d="M14052.8-244.9c7.5,3.8,11.2,11.3,14.9,11.3c26.1-49.2,74.5-147.5,85.7-276c7.5-102.1-11.2-181.5-26.1-234.4
	c-52.2,30.2-89.4,60.5-108.1,83.2c-11.2,15.1-18.6,26.5-37.3,49.2c-22.4,30.2-33.5,49.2-44.7,71.8c-7.5,15.1-11.2,26.5-11.2,37.8
	v22.7v22.7c3.7,26.5,11.2,49.2,14.9,52.9c0,7.6,11.2,22.7,41,71.8C14015.5-278.9,14045.4-252.5,14052.8-244.9L14052.8-244.9z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Buccal", 53) && (
            <path
              fill={this.state.statusDoneTeeth.includes(53) ? "#369661" : "#DE2527"}
              d="M14174.1-759.2c-11.4,3.6-30.4,10.9-49.3,25.3c7.6,25.3,15.2,57.9,22.8,94.1c11.4,57.9,7.6,108.6,3.8,148.4
	c75.9,3.6,148,7.2,223.9,10.9c-3.8-10.9-3.8-28.9-7.6-47c0-7.2-3.8-36.2-7.6-79.6c0-10.9,0-54.3,3.8-90.5c3.8-3.6,3.8-10.9,7.6-21.7
	c3.8-14.5,11.4-21.7,15.2-28.9c-7.6-3.6-22.8-7.2-37.9-10.9C14314.5-766.4,14246.2-784.5,14174.1-759.2L14174.1-759.2z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Lingual", 53) && (
            <path
              fill={this.state.statusDoneTeeth.includes(53) ? "#369661" : "#DE2527"}
              d="M14430.9-253.1c-18.2-46.2-36.4-96.6-47.3-147.1c-10.9-37.8-18.2-75.6-25.5-109.3
	c-72.8-4.2-145.6-12.6-218.3-16.8c-3.6,37.8-7.3,88.2-25.5,142.9c-18.2,58.8-43.7,105-61.9,138.7c14.6,12.6,72.8,75.6,131,105
	c21.8,8.4,36.4,12.6,50.9,12.6c7.3,0,21.8,0,50.9-12.6c25.5-12.6,54.6-25.2,91-54.6C14390.9-206.9,14409.1-227.9,14430.9-253.1
	L14430.9-253.1z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Medial", 53) && (
            <path
              fill={this.state.statusDoneTeeth.includes(53) ? "#369661" : "#DE2527"}
              d="M14563.6-608.1c-26.8-41.3-65.1-63.8-95.7-86.4c-15.3-11.3-38.3-18.8-76.5-37.5c-38.3-15-42.1-15-45.9-15
	c-38.3,11.3-34.4,161.4-15.3,274.1c7.7,60.1,30.6,142.7,80.4,244c15.3-15,30.6-30,38.3-41.3c15.3-18.8,65-82.6,107.1-169
	c7.7-15,11.5-30,15.3-37.5c11.5-22.5,23-60.1,11.5-97.6C14578.9-578.1,14575.1-589.4,14563.6-608.1L14563.6-608.1z"
            />
          )}
          {this.isShownRedGraphic("hygiene", "", 53) && (
            <g>
              <g>
                <path
                  fill={this.state.statusDoneTeeth.includes(53) ? "#369661" : "#DE2527"}
                  d="M14298.2-1233.5l117.7-107.4c1.7-1.6,1.7-4.4,0-6l-3.3-3l22.9-20.9c1.8-1.6,1.8-4.3,0-6l-6.2-5.7
		l42.6-38.8l38.7,0.1c2.5,0,4.6-1.9,4.6-4.2s-2.1-4.2-4.6-4.2l-42.5-0.1l-45.3,41.3l-6.8-6.3c-0.9-0.8-2-1.2-3.3-1.2
		c-1.2,0-2.4,0.4-3.3,1.2l-22.9,20.9l-3.3-3c-1.8-1.7-4.7-1.7-6.5,0l-117.7,107.4c-0.9,0.8-1.4,1.9-1.4,3c0,1.1,0.5,2.2,1.3,3
		l32.5,30C14293.5-1231.9,14296.4-1231.8,14298.2-1233.5z M14412.8-1385.8l13,12l-19.6,17.9l-13-12L14412.8-1385.8z
			M14268.9-1266.5l111.2-101.4l3.3,3v0l19.5,18c0,0,0,0,0,0l3.2,3l-111.2,101.4L14268.9-1266.5z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("diagnosis", "", 53) && (
            <g>
              <g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)">
                <path
                  fill={this.state.statusDoneTeeth.includes(53) ? "#369661" : "#DE2527"}
                  d="M140191.1,19593.9c-108.6-37.8-211.4-110.9-292.2-206.3c-36.6-43.1-96.3-145.4-116.7-200.2
			c-92.5-246.1-52.9-522.4,104.7-732.5c169-224.6,431.2-327.9,693-271.7c152,32.6,275,106.2,372.5,223.6l33.7,40l183.7-126.3
			l184.4-126.8l-22.5-39.5c-39.4-68.9-68.5-41.8,357.6-334.8c204.7-140.8,379.7-257,389.1-259.4c13.1-2.9,21.1-1.1,31.9,6.8
			c21.2,15.3,151.7,234.2,152.1,254.4c0.1,10.7-4.3,23-12.2,32c-6.6,8.7-177.8,129.5-381.1,269.3
			c-416.8,285.6-388.7,271.4-425.1,216.4l-19.3-29.3l-183,125.9c-100.6,69.2-183.5,128.3-184,130.7c-0.5,2.4,5.7,20.8,14.4,40.9
			c85.7,203,62.5,472.2-57.3,672.7C140840.3,19571.1,140498.5,19701.4,140191.1,19593.9z M140440.1,19474
			c202.2-12.7,381.7-136.2,475.4-326c32.8-66.7,60.3-192.5,58.6-270.4c-1.5-67.8-18.5-152.7-41.9-210
			c-19.7-49.6-72.4-134.6-105.6-171.4c-36.7-40-103.2-90.8-155.3-117.1c-66-33.7-185.1-58.6-255.7-54.2
			c-201.1,13-382,137.4-474.5,327.4c-29.6,60.4-56.6,175-57.5,246c-4,229.8,119.6,436.5,316.6,528.6
			C140257.9,19454.4,140379.7,19478,140440.1,19474z"
                />
                <path
                  fill={this.state.statusDoneTeeth.includes(53) ? "#369661" : "#DE2527"}
                  d="M140019,19171.9c-32.5-56.7-48.5-98.6-60.7-158.6c-41.1-205.4,45.2-418.8,215.9-534.7
			c83.7-57,141.6-74.2,145.8-43.7c2,15.6-7.8,25.4-42.1,38.2c-48.6,18.6-127.5,75.4-165.3,118.3c-17.6,20.8-43.9,57.4-58.7,82
			c-23.8,41.5-27.3,52.1-45.1,135.3c-17.7,82.6-19.2,94.8-14.3,141.9c6.5,69.5,25.5,128.4,60.5,190.1c29.4,51.7,32.2,63.6,16.8,74.2
			C140055.7,19225.8,140044.5,19216.5,140019,19171.9z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("whitening", "", 53) && (
            <polygon
              fill={this.state.statusDoneTeeth.includes(53) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(53) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              points="14074.5,-1539.7 14037.4,-1510.9 14038.6,-1463.9 
	14001.4,-1490.4 13958.1,-1473.4 13972.3,-1518.5 13944.4,-1555 13990.3,-1556.4 14016.3,-1596 14030.5,-1551.7 "
            />
          )}
          {this.isShownRedGraphic("rootCanal", "Post and Core", 53) && (
            <path
              id="egXMLID_3_"
              fill={this.state.statusDoneTeeth.includes(53) ? "#369661" : "#DE2527"}
              d="M14293.6-2168.2c-15.9,139.6-0.6,246.9,15.9,318c23.2,99.3,64,195.4,32.8,213.9
	c-20.4,12.2-47-24.4-111-27.1c-76.4-2.7-115.5,47.8-137.6,32.9c-28.9-19.1,21.5-114.1,48.7-217.7c19.8-75.9,33.4-182.1,9.6-319.1
	C14199.1-2167.1,14246.6-2167.6,14293.6-2168.2L14293.6-2168.2z"
            />
          )}
          {this.isShownRedGraphic("rootCanal", "", 53) && (
            <path
              fill={this.state.statusDoneTeeth.includes(53) ? "#369661" : "#DE2527"}
              d="M14170.1-3206c0,0,5.5,5,5.5,20.1c0,0,5.5,20.1,5.5,35.2c38.2,236.6,49.2,755.1,49.2,755.1
	c0,60.4,5.5,151,10.9,266.8c5.5,15.1,32.8,50.3,27.3,100.7c-5.5,30.2-27.3,65.4-38.2,60.4c-5.5,0-5.5-5-16.4-20.1
	c-10.9-20.1-21.9-25.2-27.3-30.2c-21.9-25.2,5.5-90.6,5.5-100.7c10.9-20.1,10.9-110.7,10.9-281.9c0-45.3,0-110.7-10.9-317.1
	C14181-3019.8,14164.6-3206,14170.1-3206L14170.1-3206z"
            />
          )}
          {this.isShownRedGraphic("implantation", "", 53) && (
            <path
              fill={this.state.statusDoneTeeth.includes(53) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(53) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M14566.3-2091.6c0-90.1-26-163.4-58-163.4h-196.4v-74.9h99.1
	c20.2,0,36.8-46.2,36.8-103.7c0-57-16.4-103.7-36.8-103.7h-99.1v-74.4h67.5c20.2,0,36.8-46.2,36.8-103.7c0-57-16.4-103.7-36.8-103.7
	h-67.5v-74.4h35.9c20.2,0,36.8-46.2,36.8-103.7c0-57-16.4-103.7-36.8-103.7h-35.9v-74.4h4.2c20.2,0,36.8-46.2,36.8-103.7
	c0-57-16.4-103.7-36.8-103.7h-150.7c-20.2,0-36.8,46.2-36.8,103.7c0,57,16.4,103.7,36.8,103.7h4.2v74.4h-35.9
	c-20.2,0-36.8,46.2-36.8,103.7c0,57,16.4,103.7,36.8,103.7h35.9v74.4h-67.5c-20.2,0-36.8,46.2-36.8,103.7
	c0,57,16.4,103.7,36.8,103.7h67.5v74.4h-99.1c-20.2,0-36.8,46.2-36.8,103.7c0,57,16.4,103.7,36.8,103.7h99.1v74.4h-196.4
	c-32,0-58,73.3-58,163.4c0,90.1,26,163.4,58,163.4h535.1C14540.2-1928.7,14566.1-2001.5,14566.3-2091.6z"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 53) && (
            <rect
              x="13973.3"
              y="-1758.5"
              fill={this.state.statusDoneTeeth.includes(53) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(53) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="464.8"
              height="113.9"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 53) && (
            <rect
              x="14099.8"
              y="-1787.4"
              fill={this.state.statusDoneTeeth.includes(53) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(53) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="229.1"
              height="174.2"
            />
          )}
          {this.isShownRedGraphic("surgery", "", 53) && (
            <path
              fill={this.state.statusDoneTeeth.includes(53) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(53) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M14215.8,115.9h-151.7v-3540.6h151.7V115.9z M14479.8-3432.5H14320
	V115.9h159.8V-3432.5z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 53) && (
            <path
              fill={this.state.statusDoneTeeth.includes(53) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(53) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M14590.2-528.5h-614.8v-152h614.8V-528.5z M14590.2-429.2h-614.8
	v152h614.8V-429.2z"
            />
          )}



          <path
            fill="#F2ECBE"
            onClick={() => {
              this.toggleSelectedNumber(52);
              this.props.onClick(52);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 52) ? (this.state.statusDoneTeeth.includes(52) ? "#369661" : "#DE2527")
                : this.checkImpacted(52) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(52) ? isMissing ? `M14882.9-1680.5l217.6-84.9
	c19.5-3.7,29.2-38.5,33.9-58c43.6-119.7-130.8-444-149.8-687c-9.7-92.8-24.1-196.7-67.7-274.2c-87.2-212.5-207.8-169.8-217.6-54.3
	c0,26.9,9.7,61.7,9.7,84.9c33.9,374.4-72.4,779.8-14.4,899.5c14.4,31.1,24.1,65.4,38.5,84.9L14882.9-1680.5z` : "" : `M14882.9-1680.5l217.6-84.9
	c19.5-3.7,29.2-38.5,33.9-58c43.6-119.7-130.8-444-149.8-687c-9.7-92.8-24.1-196.7-67.7-274.2c-87.2-212.5-207.8-169.8-217.6-54.3
	c0,26.9,9.7,61.7,9.7,84.9c33.9,374.4-72.4,779.8-14.4,899.5c14.4,31.1,24.1,65.4,38.5,84.9L14882.9-1680.5z`}
          />
          <path
            fill={conditionToColor(this.props.teeth[52].condition)}
            onClick={() => {
              this.toggleSelectedNumber(52);
              this.props.onClick(52);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 52)
                ? (this.state.statusDoneTeeth.includes(52) ? "#369661" : "#DE2527")
                : this.checkImpacted(52) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(52) ? isMissing ? `M15356.1-1302.9c10.2,97.4-71,97.4-157.3,93.2
	c-45.5,24.1-81.2,32.5-162.4,36.6c-50.6-4.2-157.3-4.2-182.3-44.5c-30.6,28.3-106.7,12.1-126.6-4.2
	c-172.6-89.1-136.9-360.9-35.7-551.6c10.2-12.1,45.5-89.1,65.9-93.2c121.5-36.6,207.8-40.4,344.7,0c15.3,4.2,35.7,28.3,40.4,48.7
	C15214.1-1607.2,15269.8-1538.1,15356.1-1302.9z`: '' : `M15356.1-1302.9c10.2,97.4-71,97.4-157.3,93.2
	c-45.5,24.1-81.2,32.5-162.4,36.6c-50.6-4.2-157.3-4.2-182.3-44.5c-30.6,28.3-106.7,12.1-126.6-4.2
	c-172.6-89.1-136.9-360.9-35.7-551.6c10.2-12.1,45.5-89.1,65.9-93.2c121.5-36.6,207.8-40.4,344.7,0c15.3,4.2,35.7,28.3,40.4,48.7
	C15214.1-1607.2,15269.8-1538.1,15356.1-1302.9z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 52)
                ? (this.state.statusDoneTeeth.includes(52) ? "#369661" : "#DE2527")
                : this.checkImpacted(52) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(52) ? isMissing ? `M15279.5-393.2c-4.2,4.6-8.4,13.5-17.2,22.3
	c-72.4,105.8-233.8,233.8-259.3,242.6c-25.5,13.5-76.5,17.6-110.4,0c-84.9-61.7-165.6-141-195.8-233.8
	c-17.2-44.1-12.5-119.2,4.2-149.8c33.9-70.5,148.9-176.3,204.1-202.7c25.5-26.4,144.7-22.3,170.3,0c76.5,31.1,170.3,141,204.1,207.4
	C15296.7-486,15300.9-419.6,15279.5-393.2L15279.5-393.2z` : '' : `M15279.5-393.2c-4.2,4.6-8.4,13.5-17.2,22.3
	c-72.4,105.8-233.8,233.8-259.3,242.6c-25.5,13.5-76.5,17.6-110.4,0c-84.9-61.7-165.6-141-195.8-233.8
	c-17.2-44.1-12.5-119.2,4.2-149.8c33.9-70.5,148.9-176.3,204.1-202.7c25.5-26.4,144.7-22.3,170.3,0c76.5,31.1,170.3,141,204.1,207.4
	C15296.7-486,15300.9-419.6,15279.5-393.2L15279.5-393.2z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 52)
                ? (this.state.statusDoneTeeth.includes(52) ? "#369661" : "#DE2527")
                : this.checkImpacted(52) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(52) ? isMissing ? `M14701.5-349.1c42.7-8.8,110.4,4.6,123.4,0
	c21.3-4.6,12.5-48.7,38-48.7c29.7-4.6,51,39.9,84.9,44.1c21.3,4.6,97.9,4.6,106.2-4.6c17.2-4.6,46.9-66.3,63.6-66.3
	s25.5,39.9,38,44.1c12.5,8.8,76.5,8.8,114.6,0 M15045.7-357.9c25.5,17.6,33.9,57.5,33.9,92.8` : '' : `M14701.5-349.1c42.7-8.8,110.4,4.6,123.4,0
	c21.3-4.6,12.5-48.7,38-48.7c29.7-4.6,51,39.9,84.9,44.1c21.3,4.6,97.9,4.6,106.2-4.6c17.2-4.6,46.9-66.3,63.6-66.3
	s25.5,39.9,38,44.1c12.5,8.8,76.5,8.8,114.6,0 M15045.7-357.9c25.5,17.6,33.9,57.5,33.9,92.8`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 52)
                ? (this.state.statusDoneTeeth.includes(52) ? "#369661" : "#DE2527")
                : this.checkImpacted(52) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(52) ? isMissing ? `M14947.8-353.8c0,22.3,17.2,88.1,12.5,101.6
	c0,17.6-38,39.9-55.2,70.5` : '' : `M14947.8-353.8c0,22.3,17.2,88.1,12.5,101.6
	c0,17.6-38,39.9-55.2,70.5`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 52)
                ? (this.state.statusDoneTeeth.includes(52) ? "#369661" : "#DE2527")
                : this.checkImpacted(52) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(52) ? isMissing ? `M14833.2-362.6c17.2,8.8,29.7,26.4,21.3,35.3
	c-25.5,8.8-25.5,101.6-59.4,110.4`: '' : `M14833.2-362.6c17.2,8.8,29.7,26.4,21.3,35.3
	c-25.5,8.8-25.5,101.6-59.4,110.4`}
          />
          {this.isShownRedGraphic("hygiene", "", 52) && (
            <g>
              <g>
                <path
                  fill={this.state.statusDoneTeeth.includes(52) ? "#369661" : "#DE2527"}
                  d="M15050.7-1202.2l130.4-91.6c1.9-1.3,2.3-4.1,0.8-5.9l-2.8-3.4l25.4-17.8c2-1.4,2.3-4.1,0.8-5.9l-5.4-6.4
			l47.1-33.1l38.4,5c2.5,0.3,4.8-1.3,5.1-3.6c0.3-2.3-1.5-4.5-4-4.8l-42.2-5.5l-50.1,35.2l-6-7.1c-0.8-0.9-1.9-1.5-3.1-1.7
			c-1.2-0.2-2.4,0.1-3.4,0.8l-25.4,17.8l-2.8-3.4c-1.6-1.9-4.5-2.3-6.5-0.8l-130.4,91.6c-1,0.7-1.6,1.7-1.7,2.8
			c-0.1,1.1,0.2,2.2,1,3.1l28.5,33.9C15045.8-1201.1,15048.7-1200.8,15050.7-1202.2z M15183.7-1338.7l11.4,13.6l-21.7,15.3
			l-11.4-13.6L15183.7-1338.7z M15025.8-1238.6l123.2-86.5l2.8,3.4v0l17.1,20.3c0,0,0,0,0,0l2.8,3.4l-123.2,86.5L15025.8-1238.6z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("diagnosis", "", 52) && (
            <g>
              <g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)">
                <path
                  fill={this.state.statusDoneTeeth.includes(52) ? "#369661" : "#DE2527"}
                  d="M147144.2,19166.6c-108.6-37.8-211.4-110.9-292.2-206.3c-36.6-43.1-96.2-145.4-116.7-200.2
			c-92.5-246.1-52.9-522.4,104.7-732.5c169-224.6,431.2-327.9,693-271.7c152,32.6,275,106.2,372.5,223.6l33.7,40l183.7-126.3
			l184.4-126.8l-22.5-39.5c-39.4-68.9-68.5-41.8,357.6-334.8c204.7-140.8,379.6-257,389.1-259.4c13.1-2.9,21.1-1.1,31.9,6.8
			c21.2,15.3,151.6,234.2,152.1,254.4c0.1,10.7-4.4,23-12.2,32c-6.6,8.7-177.8,129.5-381.1,269.3
			c-416.8,285.6-388.7,271.4-425.1,216.4l-19.3-29.3l-183,125.9c-100.6,69.2-183.5,128.3-184,130.7c-0.5,2.4,5.7,20.8,14.5,40.9
			c85.7,203,62.5,472.2-57.3,672.7C147793.4,19143.9,147451.7,19274.2,147144.2,19166.6z M147393.3,19046.7
			c202.2-12.7,381.7-136.2,475.4-326c32.8-66.7,60.3-192.5,58.6-270.4c-1.5-67.8-18.5-152.7-41.9-210
			c-19.8-49.6-72.4-134.6-105.6-171.4c-36.7-40-103.2-90.8-155.3-117.1c-66-33.7-185.1-58.6-255.7-54.2
			c-201.1,13-382,137.4-474.5,327.4c-29.6,60.4-56.6,175-57.5,246c-4,229.8,119.6,436.5,316.6,528.6
			C147211.1,19027.2,147332.9,19050.8,147393.3,19046.7z"
                />
                <path
                  fill={this.state.statusDoneTeeth.includes(52) ? "#369661" : "#DE2527"}
                  d="M146972.1,18744.7c-32.5-56.7-48.5-98.6-60.7-158.6c-41.1-205.4,45.2-418.8,215.9-534.8
			c83.7-57,141.6-74.2,145.8-43.7c2,15.6-7.8,25.4-42.1,38.2c-48.6,18.6-127.5,75.4-165.3,118.3c-17.6,20.8-43.9,57.4-58.7,82
			c-23.8,41.5-27.3,52.1-45.1,135.3c-17.7,82.6-19.2,94.8-14.4,141.9c6.5,69.5,25.5,128.4,60.5,190.1c29.4,51.7,32.2,63.6,16.9,74.2
			C147008.8,18798.5,146997.7,18789.2,146972.1,18744.7z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("whitening", "", 52) && (
            <polygon
              fill={this.state.statusDoneTeeth.includes(52) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(52) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              points="15055,-1384.4 15001.9,-1344 15004.3,-1277.3 
	14950.3,-1315.4 14888.2,-1291.8 14908,-1355.7 14867.2,-1407.9 14933.4,-1409.3 14970.3,-1465.1 14991.4,-1402 "
            />
          )}
          {this.isShownRedGraphic("rootCanal", "Post and Core", 52) && (
            <path
              id="egXMLID_5_"
              fill={this.state.statusDoneTeeth.includes(52) ? "#369661" : "#DE2527"}
              d="M14983.4-2014.7c-15.9,139.6-0.6,246.9,15.9,318c23.2,99.3,64,195.4,32.8,213.9
	c-20.4,12.2-47-24.4-111-27.1c-76.4-2.7-115.5,47.8-137.6,32.9c-28.9-19.1,21.5-114.1,48.7-217.7c19.8-75.9,33.4-182.1,9.6-319.1
	C14888.9-2013.7,14936.4-2014.2,14983.4-2014.7L14983.4-2014.7z"
            />
          )}
          {this.isShownRedGraphic("rootCanal", "", 52) && (
            <path
              fill={this.state.statusDoneTeeth.includes(52) ? "#369661" : "#DE2527"}
              d="M14856.1-2801.9c0,0,5.5,3.8,5.5,15.1c0,0,5.5,15.1,5.5,26.4c38.2,177.6,49.2,566.8,49.2,566.8
	c0,45.3,5.5,113.4,10.9,200.3c5.5,11.3,32.8,37.8,27.3,75.6c-5.5,22.7-27.3,49.1-38.2,45.3c-5.5,0-5.5-3.8-16.4-15.1
	c-10.9-15.1-21.9-18.9-27.3-22.7c-21.9-18.9,5.5-68,5.5-75.6c10.9-15.1,10.9-83.1,10.9-211.6c0-34,0-83.1-10.9-238
	C14867-2662.1,14850.6-2801.9,14856.1-2801.9L14856.1-2801.9z"
            />
          )}
          {this.isShownRedGraphic("implantation", "", 52) && (
            <path
              fill={this.state.statusDoneTeeth.includes(52) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(52) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M15247.1-1941.2c0-71.4-26-129.4-58-129.4h-196.4v-59.3h99.1
	c20.2,0,36.8-36.6,36.8-82.1c0-45.2-16.4-82.1-36.8-82.1h-99.1v-58.9h67.5c20.2,0,36.8-36.6,36.8-82.1c0-45.2-16.4-82.1-36.8-82.1
	h-67.5v-58.9h35.9c20.2,0,36.8-36.6,36.8-82.1c0-45.2-16.4-82.1-36.8-82.1h-35.9v-58.9h4.2c20.2,0,36.8-36.6,36.8-82.1
	c0-45.2-16.4-82.1-36.8-82.1h-150.7c-20.2,0-36.8,36.6-36.8,82.1c0,45.2,16.4,82.1,36.8,82.1h4.2v58.9h-35.9
	c-20.2,0-36.8,36.6-36.8,82.1c0,45.2,16.4,82.1,36.8,82.1h35.9v58.9h-67.5c-20.2,0-36.8,36.6-36.8,82.1c0,45.2,16.4,82.1,36.8,82.1
	h67.5v58.9h-99.1c-20.2,0-36.8,36.6-36.8,82.1c0,45.2,16.4,82.1,36.8,82.1h99.1v58.9H14654c-32,0-58,58.1-58,129.4
	s26,129.4,58,129.4h535.1C15221.1-1812.2,15246.9-1869.8,15247.1-1941.2z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Buccal", 52) && (
            <path
              fill={this.state.statusDoneTeeth.includes(52) ? "#369661" : "#DE2527"}
              d="M14886.1-708.8c30.3-21.4,171.5-25.7,201.8,0c15.1,8.6,25.2,12.9,40.4,21.4c-5,8.6-15.1,25.7-20.2,42.9
	c-10.1,21.4-20.2,55.7-30.3,107.2c-5,25.7-5,60,5,102.9c-65.6,8.6-126.1,21.4-191.7,30c5-38.6,10.1-94.3-5-158.6
	c-10.1-51.4-25.2-94.3-40.4-124.3C14860.9-695.9,14871-704.5,14886.1-708.8z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Medial", 52) && (
            <path
              fill={this.state.statusDoneTeeth.includes(52) ? "#369661" : "#DE2527"}
              d="M15289.5-394.2c-4.6,4.3-9.1,13-18.3,21.6c-73.1,82.1-123.4,125.3-150.9,146.9c-4.6,0-54.9-125.3-50.3-259.3
	c0-99.4,32-203.1,41.1-203.1c13.7,8.6,41.1,25.9,82.3,64.8c41.1,34.6,73.1,77.8,91.4,112.4
	C15303.2-489.3,15307.8-424.5,15289.5-394.2z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Lingual", 52) && (
            <path
              fill={this.state.statusDoneTeeth.includes(52) ? "#369661" : "#DE2527"}
              d="M14831.9-171.8c-13.7-10.4-27.5-26.1-36.6-36.6c22.9-26.1,50.4-62.7,73.3-114.9
	c22.9-57.4,36.6-109.7,41.2-146.2c59.5,15.7,114.5,26.1,174.1,36.6c0,31.3,4.6,62.7,13.7,99.2c9.2,47,22.9,83.5,36.6,114.9
	c-18.3,20.9-36.6,41.8-64.1,62.7c-18.3,15.7-41.2,31.3-59.5,41.8c-27.5,15.7-82.5,20.9-119.1,0
	C14868.5-130,14850.2-150.9,14831.9-171.8z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Distal", 52) && (
            <path
              fill={this.state.statusDoneTeeth.includes(52) ? "#369661" : "#DE2527"}
              d="M14871-693.4c18.3,36.5,50.2,114.1,41.1,214.5c-4.6,150.6-91.3,251-118.7,278.3l-36.5-36.5
	c-32-41.1-50.2-82.1-54.8-91.3c0-4.6-4.6-13.7-9.1-27.4c-4.6-18.3-22.8-86.7,4.6-155.1c18.3-41.1,45.7-68.4,95.9-118.6
	C14825.4-656.9,14852.8-679.7,14871-693.4L14871-693.4z"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 52) && (
            <rect
              x="14627.8"
              y="-1665.3"
              fill={this.state.statusDoneTeeth.includes(52) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(52) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="597.2"
              height="113.9"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 52) && (
            <rect
              x="14771.5"
              y="-1692.9"
              fill={this.state.statusDoneTeeth.includes(52) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(52) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="300.2"
              height="173.1"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 52) && (
            <rect
              x="14770.3"
              y="-1683.6"
              fill={this.state.statusDoneTeeth.includes(52) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(52) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="302.6"
              height="154.6"
            />
          )}
          {this.isShownRedGraphic("surgery", "", 52) && (
            <path
              fill={this.state.statusDoneTeeth.includes(52) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(52) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M14916.8,129.6h-151.7V-3411h151.7V129.6z M15180.8-3418.8H15021
	V129.6h159.8V-3418.8z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 52) && (
            <path
              fill={this.state.statusDoneTeeth.includes(52) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(52) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M15296.7-503h-599.2v-152h599.2V-503z M15296.7-403.7h-599.2v152
	h599.2V-403.7z"
            />
          )}


          <path
            fill="#F2ECBE"
            onClick={() => {
              this.toggleSelectedNumber(51);
              this.props.onClick(51);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 51) ? (this.state.statusDoneTeeth.includes(51) ? "#369661" : "#DE2527")
                : this.checkImpacted(51) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(51) ? isMissing ? `M15707.2-1696.3l-181.8-110.8
	c-24.1-73.8-44.5-648.5,97-993.7c149.8-328.4,242.6-94.2,258.9,4.2c16.2,172.6,16.2,336.8,64.5,517.2
	c40.4,143.8,60.8,377.6,20.4,574.8L15707.2-1696.3z` : " " : `M15707.2-1696.3l-181.8-110.8
	c-24.1-73.8-44.5-648.5,97-993.7c149.8-328.4,242.6-94.2,258.9,4.2c16.2,172.6,16.2,336.8,64.5,517.2
	c40.4,143.8,60.8,377.6,20.4,574.8L15707.2-1696.3z`}
          />
          <path
            fill={conditionToColor(this.props.teeth[51].condition)}
            onClick={() => {
              this.toggleSelectedNumber(51);
              this.props.onClick(51);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 51)
                ? (this.state.statusDoneTeeth.includes(51) ? "#369661" : "#DE2527")
                : this.checkImpacted(51) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(51) ? isMissing ? `M15973.5-1783.9c3.7,7,0,13.5,0,17.2
	c39,187,114.1,323.3,114.1,401.3c0,64.5,3.7,231.5-167.5,190.7c-14.4-10.2-21.3-13.5-32-7c-14.4,20.4-114.1,47.8-245.4-17.2
	c-17.6-20.4-35.7-10.2-46.4-10.2c-146.1-58-217.1-98.8-170.7-278.8c71-296,124.8-466.2,327.5-438.8
	c92.8,13.5,149.4,68.2,202.7,122.5C15959.6-1801.1,15970.3-1790.9,15973.5-1783.9L15973.5-1783.9L15973.5-1783.9z` : '' : `M15973.5-1783.9c3.7,7,0,13.5,0,17.2
	c39,187,114.1,323.3,114.1,401.3c0,64.5,3.7,231.5-167.5,190.7c-14.4-10.2-21.3-13.5-32-7c-14.4,20.4-114.1,47.8-245.4-17.2
	c-17.6-20.4-35.7-10.2-46.4-10.2c-146.1-58-217.1-98.8-170.7-278.8c71-296,124.8-466.2,327.5-438.8
	c92.8,13.5,149.4,68.2,202.7,122.5C15959.6-1801.1,15970.3-1790.9,15973.5-1783.9L15973.5-1783.9L15973.5-1783.9z`}
          />
          <path
            fill={conditionToColor(this.props.teeth[51].condition)}
            onClick={() => {
              this.toggleSelectedNumber(51);
              this.props.onClick(51);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 51) ? (this.state.statusDoneTeeth.includes(51) ? "#369661" : "#DE2527")
                : this.checkImpacted(51) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(51) ? isMissing ? `M15911.8-1163.7c-5.6-63.1-5.6-105.8,2.8-156.3
	 M15687.8-1201.8c-2.8-25.5-2.8-101.1,0-126.6` : '' : `M15911.8-1163.7c-5.6-63.1-5.6-105.8,2.8-156.3
	 M15687.8-1201.8c-2.8-25.5-2.8-101.1,0-126.6`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 51) ? (this.state.statusDoneTeeth.includes(51) ? "#369661" : "#DE2527")
                : this.checkImpacted(51) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(51) ? isMissing ? `M15873.8-664.6c9.3,7,46.4,10.7,58.9,14.4
	c43.6,7,92.8,75.2,105.3,103.9c133.1,154-223.1,386.4-294.6,436.5c0,0-77.5,7-92.8-3.7c-77.5-35.7-148.9-186-192.1-257.5
	c-18.6-60.8-21.8-118.3-9.3-167.9c6-25.1,18.6-39.4,31.1-53.8c3.2-3.7,27.8-43.1,74.2-53.8c15.3-3.7,49.6-3.7,55.7-14.4
	c15.3-14.4,31.1-32,52.9-35.7c49.6-10.7,108.6-7,151.7,3.7C15836.7-685.9,15855.2-675.2,15873.8-664.6L15873.8-664.6L15873.8-664.6z
	` : '' : `M15873.8-664.6c9.3,7,46.4,10.7,58.9,14.4
	c43.6,7,92.8,75.2,105.3,103.9c133.1,154-223.1,386.4-294.6,436.5c0,0-77.5,7-92.8-3.7c-77.5-35.7-148.9-186-192.1-257.5
	c-18.6-60.8-21.8-118.3-9.3-167.9c6-25.1,18.6-39.4,31.1-53.8c3.2-3.7,27.8-43.1,74.2-53.8c15.3-3.7,49.6-3.7,55.7-14.4
	c15.3-14.4,31.1-32,52.9-35.7c49.6-10.7,108.6-7,151.7,3.7C15836.7-685.9,15855.2-675.2,15873.8-664.6L15873.8-664.6L15873.8-664.6z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 51) ? (this.state.statusDoneTeeth.includes(51) ? "#369661" : "#DE2527")
                : this.checkImpacted(51) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(51) ? isMissing ? `M16038-389c-18.6,28.8-33.9,46.4-58.9,75.2
	c-6-7-9.3-7-15.3-14.4c-24.6-28.8-49.6-50.1-64.9-43.1c-9.3,3.7-15.3,7-21.8,18.1c-21.8,14.4-40.4-7-46.4-10.7
	c-15.3,0-27.8-3.7-40.4-3.7c-43.6-7-37.1,10.7-71.4,46.4c-18.6,3.7-33.9-3.7-49.6-18.1c-37.1-3.7-64.9,3.7-90,25.1
	c-12.5,28.8-27.8,43.1-52.9,46.4c-12.5-14.4-18.6-28.8-21.8-50.1c-6-32-6-60.8,0-85.8c6-18.1,21.8-32,43.6-35.7
	c24.6-3.7,52.9,0,83.5,14.4c18.6,0,40.4,3.7,62.2,3.7l15.3,18.1c9.3-7,15.3-14.4,24.6-21.3h58.9c21.8-7,43.6-7,62.2,3.7
	c12.5,18.1,27.8,28.8,46.4,7c15.3-14.4,58.9-14.4,99.3-10.7C16019.4-421.5,16028.7-410.8,16038-389L16038-389L16038-389z` : '' : `M16038-389c-18.6,28.8-33.9,46.4-58.9,75.2
	c-6-7-9.3-7-15.3-14.4c-24.6-28.8-49.6-50.1-64.9-43.1c-9.3,3.7-15.3,7-21.8,18.1c-21.8,14.4-40.4-7-46.4-10.7
	c-15.3,0-27.8-3.7-40.4-3.7c-43.6-7-37.1,10.7-71.4,46.4c-18.6,3.7-33.9-3.7-49.6-18.1c-37.1-3.7-64.9,3.7-90,25.1
	c-12.5,28.8-27.8,43.1-52.9,46.4c-12.5-14.4-18.6-28.8-21.8-50.1c-6-32-6-60.8,0-85.8c6-18.1,21.8-32,43.6-35.7
	c24.6-3.7,52.9,0,83.5,14.4c18.6,0,40.4,3.7,62.2,3.7l15.3,18.1c9.3-7,15.3-14.4,24.6-21.3h58.9c21.8-7,43.6-7,62.2,3.7
	c12.5,18.1,27.8,28.8,46.4,7c15.3-14.4,58.9-14.4,99.3-10.7C16019.4-421.5,16028.7-410.8,16038-389L16038-389L16038-389z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 51) ? (this.state.statusDoneTeeth.includes(51) ? "#369661" : "#DE2527")
                : this.checkImpacted(51) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(51) ? isMissing ? `M16044-385.8c-9.3-14.4-21.8-28.8-31.1-35.7
	c-12.5-7-55.7-3.7-96-3.7c-12.5,3.7-18.6,21.3-27.8,21.3c-12.5,3.7-24.6-10.7-33.9-18.1` : '' : `M16044-385.8c-9.3-14.4-21.8-28.8-31.1-35.7
	c-12.5-7-55.7-3.7-96-3.7c-12.5,3.7-18.6,21.3-27.8,21.3c-12.5,3.7-24.6-10.7-33.9-18.1`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 51) ? (this.state.statusDoneTeeth.includes(51) ? "#369661" : "#DE2527")
                : this.checkImpacted(51) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(51) ? isMissing ? `M15628.8-424.7h58.9c6,0,15.3,21.3,21.8,21.3
	c9.3,0,18.6-21.3,24.6-21.3h58.9` : '' : `M15628.8-424.7h58.9c6,0,15.3,21.3,21.8,21.3
	c9.3,0,18.6-21.3,24.6-21.3h58.9`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 51) ? (this.state.statusDoneTeeth.includes(51) ? "#369661" : "#DE2527")
                : this.checkImpacted(51) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(51) ? isMissing ? `M15582.4-313.8c-9.3,28.8-33.9,57.1-52.9,46.4
	c-15.3-18.1-18.6-28.8-21.8-50.1c-9.3-32-6-78.9,0-93.2c6-14.4,24.6-25.1,40.4-28.8` : '' : `M15582.4-313.8c-9.3,28.8-33.9,57.1-52.9,46.4
	c-15.3-18.1-18.6-28.8-21.8-50.1c-9.3-32-6-78.9,0-93.2c6-14.4,24.6-25.1,40.4-28.8`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 51) ? (this.state.statusDoneTeeth.includes(51) ? "#369661" : "#DE2527")
                : this.checkImpacted(51) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(51) ? isMissing ? `M15672.4-342.6c15.3,7,31.1,18.1,49.6,18.1
	c15.3,0,15.3-25.1,33.9-39.4c24.6-7,52.9-7,77.5,0` : '' : `M15672.4-342.6c15.3,7,31.1,18.1,49.6,18.1
	c15.3,0,15.3-25.1,33.9-39.4c24.6-7,52.9-7,77.5,0`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 51) ? (this.state.statusDoneTeeth.includes(51) ? "#369661" : "#DE2527")
                : this.checkImpacted(51) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(51) ? isMissing ? `M15722.1-321.3c3.2,21.3-3.2,50.1-9.3,68.2
	c-15.3,21.3-21.8,60.8-31.1,64.5c-24.6,10.7-49.6,25.1-68.2,43.1` : '' : ``}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 51) ? (this.state.statusDoneTeeth.includes(51) ? "#369661" : "#DE2527")
                : this.checkImpacted(51) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(51) ? isMissing ? `M15762.4-127.8c31.1-25.1,86.7-82.1,96-125.3
	c9.3-28.8,18.6-60.8,21.8-100.2c12.5-25.1,31.1-21.3,43.6-14.4c21.8,21.3,40.4,43.1,64.9,57.1`: '' : `M15762.4-127.8c31.1-25.1,86.7-82.1,96-125.3
	c9.3-28.8,18.6-60.8,21.8-100.2c12.5-25.1,31.1-21.3,43.6-14.4c21.8,21.3,40.4,43.1,64.9,57.1`}
          />
          {this.isShownRedGraphic("rootCanal", "Post and Core", 51) && (
            <path
              id="egXMLID_4_"
              fill={this.state.statusDoneTeeth.includes(51) ? "#369661" : "#DE2527"}
              d="M15860.7-2066.2c-15.9,139.6-0.6,246.9,15.9,318c23.2,99.3,64,195.4,32.8,213.9
	c-20.4,12.2-47-24.4-111-27.1c-76.4-2.7-115.5,47.8-137.6,32.9c-28.9-19.1,21.5-114.1,48.7-217.7c19.8-75.9,33.4-182.1,9.6-319.1
	C15766.1-2065.2,15813.7-2065.7,15860.7-2066.2L15860.7-2066.2z"
            />
          )}
          {this.isShownRedGraphic("rootCanal", "", 51) && (
            <path
              fill={this.state.statusDoneTeeth.includes(51) ? "#369661" : "#DE2527"}
              d="M15737.4-2868.6c0,0,5.5,4,5.5,15.9c0,0,5.5,15.9,5.5,27.8c38.2,186.3,49.2,594.7,49.2,594.7
	c0,47.6,5.5,118.9,10.9,210.1c5.5,11.9,32.8,39.6,27.3,79.3c-5.5,23.8-27.3,51.5-38.2,47.6c-5.5,0-5.5-4-16.4-15.9
	c-10.9-15.9-21.9-19.8-27.3-23.8c-21.9-19.8,5.5-71.4,5.5-79.3c10.9-15.9,10.9-87.2,10.9-222c0-35.7,0-87.2-10.9-249.8
	C15748.3-2721.9,15731.9-2868.6,15737.4-2868.6L15737.4-2868.6z"
            />
          )}
          {this.isShownRedGraphic("hygiene", "", 51) && (
            <g>
              <g>
                <path
                  fill={this.state.statusDoneTeeth.includes(51) ? "#369661" : "#DE2527"}
                  d="M15806-1179l130.4-91.6c1.9-1.3,2.3-4.1,0.8-5.9l-2.8-3.4l25.4-17.8c2-1.4,2.3-4.1,0.8-5.9l-5.4-6.4
			l47.1-33.1l38.4,5c2.5,0.3,4.8-1.3,5.1-3.6c0.3-2.3-1.5-4.5-4-4.8l-42.2-5.5l-50.1,35.2l-6-7.1c-0.8-0.9-1.9-1.5-3.1-1.7
			c-1.2-0.2-2.4,0.1-3.4,0.8l-25.4,17.8l-2.8-3.4c-1.6-1.9-4.5-2.3-6.5-0.8l-130.4,91.6c-1,0.7-1.6,1.7-1.7,2.8
			c-0.1,1.1,0.2,2.2,1,3.1l28.5,33.9C15801.1-1177.9,15803.9-1177.6,15806-1179z M15939-1315.5l11.4,13.6l-21.7,15.3l-11.4-13.6
			L15939-1315.5z M15781.1-1215.4l123.2-86.5l2.8,3.4v0l17.1,20.3c0,0,0,0,0,0l2.8,3.4l-123.2,86.5L15781.1-1215.4z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("diagnosis", "", 51) && (
            <g>
              <g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)">
                <path
                  fill={this.state.statusDoneTeeth.includes(51) ? "#369661" : "#DE2527"}
                  d="M155057.1,19460.7c-108.6-37.8-211.4-110.9-292.2-206.3c-36.6-43.1-96.2-145.4-116.7-200.2
			c-92.5-246.1-52.9-522.5,104.7-732.5c169-224.7,431.2-327.9,693.1-271.7c152,32.6,275,106.2,372.5,223.6l33.7,40l183.7-126.3
			l184.4-126.8l-22.5-39.5c-39.4-68.9-68.5-41.8,357.6-334.8c204.7-140.8,379.6-257,389.1-259.4c13.1-2.9,21.1-1.1,31.9,6.8
			c21.2,15.3,151.6,234.2,152.1,254.4c0.1,10.7-4.3,23-12.2,32c-6.6,8.7-177.8,129.5-381.1,269.3
			c-416.8,285.6-388.7,271.4-425.1,216.4l-19.3-29.3l-183,125.9c-100.6,69.2-183.5,128.3-184,130.7s5.7,20.8,14.5,40.9
			c85.7,203,62.5,472.2-57.3,672.7C155706.3,19437.9,155364.5,19568.2,155057.1,19460.7z M155306.1,19340.8
			c202.2-12.7,381.7-136.2,475.4-326c32.8-66.7,60.3-192.5,58.6-270.4c-1.5-67.8-18.5-152.7-41.9-210
			c-19.7-49.6-72.3-134.6-105.6-171.4c-36.7-40-103.2-90.8-155.3-117.1c-66-33.7-185.1-58.6-255.7-54.2
			c-201.1,13-382,137.4-474.5,327.4c-29.6,60.4-56.6,175-57.5,246c-4,229.8,119.6,436.5,316.6,528.6
			C155123.9,19321.2,155245.7,19344.8,155306.1,19340.8z"
                />
                <path
                  fill={this.state.statusDoneTeeth.includes(51) ? "#369661" : "#DE2527"}
                  d="M154885,19038.7c-32.5-56.7-48.5-98.6-60.7-158.6c-41.1-205.4,45.2-418.8,215.9-534.7
			c83.7-57,141.6-74.3,145.8-43.7c2,15.6-7.8,25.4-42.1,38.2c-48.6,18.6-127.5,75.4-165.3,118.3c-17.6,20.8-43.9,57.4-58.7,82
			c-23.8,41.5-27.3,52.1-45.1,135.3c-17.7,82.6-19.2,94.8-14.4,141.9c6.5,69.5,25.5,128.4,60.5,190.1c29.4,51.7,32.2,63.6,16.9,74.2
			C154921.6,19092.6,154910.5,19083.3,154885,19038.7z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("whitening", "", 51) && (
            <polygon
              fill={this.state.statusDoneTeeth.includes(51) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(51) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              points="15864,-1390.4 15810.8,-1350 15813.2,-1283.3 
	15759.3,-1321.4 15697.1,-1297.8 15716.9,-1361.7 15676.1,-1413.8 15742.3,-1415.3 15779.2,-1471.1 15800.3,-1408 "
            />
          )}
          {this.isShownRedGraphic("implantation", "", 51) && (
            <path
              fill={this.state.statusDoneTeeth.includes(51) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(51) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M16061.9-1948c0-71.8-26-130.3-58-130.3h-196.4v-59.7h99.1
	c20.2,0,36.8-36.8,36.8-82.7c0-45.4-16.4-82.7-36.8-82.7h-99.1v-59.3h67.5c20.2,0,36.8-36.8,36.8-82.7c0-45.4-16.4-82.7-36.8-82.7
	h-67.5v-59.3h35.9c20.2,0,36.8-36.8,36.8-82.7c0-45.4-16.4-82.7-36.8-82.7h-35.9v-59.3h4.2c20.2,0,36.8-36.8,36.8-82.7
	c0-45.4-16.4-82.7-36.8-82.7h-150.7c-20.2,0-36.8,36.8-36.8,82.7c0,45.4,16.4,82.7,36.8,82.7h4.2v59.3h-35.9
	c-20.2,0-36.8,36.8-36.8,82.7c0,45.4,16.4,82.7,36.8,82.7h35.9v59.3h-67.5c-20.2,0-36.8,36.8-36.8,82.7c0,45.4,16.4,82.7,36.8,82.7
	h67.5v59.3h-99.1c-20.2,0-36.8,36.8-36.8,82.7c0,45.4,16.4,82.7,36.8,82.7h99.1v59.3h-196.4c-32,0-58,58.4-58,130.3
	c0,71.8,26,130.3,58,130.3h535.1C16035.9-1818.2,16061.7-1876.2,16061.9-1948z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Distal", 51) && (
            <g id="erXMLID_34_">
              <path
                id="erXMLID_33_"
                fill={this.state.statusDoneTeeth.includes(51) ? "#369661" : "#DE2527"}
                d="M15649.1-481.3c-6.3,129.4-90.8,255.1-109.6,248h-3.1c-31.3-46.7-59.5-100.6-81.4-136.6
		c-18.8-61.1-21.9-118.6-9.4-168.9c6.3-25.2,18.8-39.5,31.3-53.9c3.1-3.6,28.2-43.1,78.3-50.3c12.5-3.6,21.9-7.2,34.5-7.2
		c0,0,3.1,0,9.4-3.6c6.3,0,9.4-3.6,12.5-7.2C15649.1-581.9,15649.1-517.2,15649.1-481.3z"
              />
            </g>
          )}
          {this.isShownRedGraphic("restoration", "Lingual", 51) && (
            <g id="esXMLID_38_">
              <path
                id="esXMLID_37_"
                fill={this.state.statusDoneTeeth.includes(51) ? "#369661" : "#DE2527"}
                d="M15643.4-430.5c61.2,4,119.3,4,180.5,8c3.2,11.9,6.4,27.9,12.9,43.8
		c3.2,23.9,9.7,43.8,22.6,71.7c3.2,11.9,9.7,23.9,19.3,35.8c12.9,19.9,25.8,27.9,35.5,35.8c-12.9,11.9-25.8,27.9-41.9,39.8
		c-45.1,39.8-87,67.7-125.7,87.6c-9.7,4-25.8,4-38.7,4c-22.6,0-41.9,0-58-4c-9.7-8-22.6-15.9-38.7-31.9c-6.4-4-16.1-11.9-25.8-27.9
		c-12.9-15.9-29-39.8-45.1-67.7c9.7-8,22.6-19.9,35.5-35.8s19.3-31.9,29-51.8C15614.4-350.9,15630.5-382.7,15643.4-430.5
		L15643.4-430.5z"
              />
            </g>
          )}
          {this.isShownRedGraphic("restoration", "Medial", 51) && (
            <g id="etXMLID_32_">
              <path
                id="etXMLID_15_"
                fill={this.state.statusDoneTeeth.includes(51) ? "#369661" : "#DE2527"}
                d="M15935.1-648.4c41.8,7.2,89.5,75.4,101.4,104.1c8.9,10.8,20.9,28.7,26.8,53.9
		c11.9,57.4-29.8,114.9-50.7,147.2c-17.9,25.1-38.8,46.7-59.7,68.2c-11.9,18-23.9,28.7-32.8,35.9c-3,3.6-8.9,3.6-11.9,10.8
		c-6-7.2-14.9-14.4-23.9-25.1l-17.9-28.7c-53.7-104.1-44.7-211.8-44.7-211.8s3-39.5,44.7-150.8c3-7.2,6-18,11.9-18
		C15887.3-655.6,15923.1-652,15935.1-648.4z"
              />
            </g>
          )}
          {this.isShownRedGraphic("restoration", "Buccal", 51) && (
            <g id="eqXMLID_36_">
              <path
                id="eqXMLID_35_"
                fill={this.state.statusDoneTeeth.includes(51) ? "#369661" : "#DE2527"}
                d="M15826.6-693.7c27.4,6.8,44.5,17,58.2,23.9c-3.4,13.6-13.7,27.3-20.5,47.7
		c-13.7,27.3-20.5,47.7-20.5,51.1c-10.3,34.1-13.7,47.7-17.1,71.6c-3.4,20.5,0,44.3,0,51.1c0,10.2,3.4,20.5,3.4,27.3
		c-65-3.4-130-6.8-195-6.8c6.8-23.9,10.3-54.5,10.3-85.2c0-23.9-3.4-44.3-3.4-51.1c-3.4-13.6-6.8-20.5-6.8-27.3
		c0-3.4-3.4-13.6-6.8-23.9c-6.8-10.2-13.7-27.3-23.9-47.7c6.8-6.8,17.1-17,30.8-23.9c13.7-6.8,30.8-13.6,85.5-13.6
		C15771.8-700.6,15799.2-700.6,15826.6-693.7L15826.6-693.7z"
              />
            </g>
          )}
          {this.isShownRedGraphic("orthodontics", "", 51) && (
            <rect
              x="15459.9"
              y="-1682.4"
              fill={this.state.statusDoneTeeth.includes(51) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(51) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="570.2"
              height="113.9"
            />
          )}
          {this.isShownRedGraphic("surgery", "", 51) && (
            <path
              fill={this.state.statusDoneTeeth.includes(51) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(51) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M15675,133.5h-151.7v-3540.6h151.7V133.5z M15939-3414.9h-159.8
	V133.5h159.8V-3414.9z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 51) && (
            <path
              fill={this.state.statusDoneTeeth.includes(51) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(51) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M16051.4-505.4h-599.2v-152h599.2V-505.4z M16051.4-406.1h-599.2
	v152h599.2V-406.1z"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 51) && (
            <rect
              x="15599.8"
              y="-1695.2"
              fill={this.state.statusDoneTeeth.includes(51) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(51) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="302.6"
              height="154.6"
            />
          )}


          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 65) ? (this.state.statusDoneTeeth.includes(65) ? "#369661" : "#DE2527")
                : this.checkImpacted(65) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(65) ? isMissing ? `M19568.7-483.1c-21.8,38-39.4,71.9-43.6,105.8
	c-4.2,46.4,0,105.8,13,139.2c74.2,135,166.1,190.2,205.5,215.2c30.6,21.3,100.7,29.7,144.3,12.5c13,0,26.4-8.4,39.4-12.5
	c13,0,48.2,12.5,61.2,25.5c17.6,12.5,70,4.2,96-8.4c13-4.2,21.8-25.5,34.8-25.5c126.6-16.7,196.7-118.3,236.1-236.6
	c21.8-46.4,17.6-295.5-4.2-341.9c-153.1-236.6-161.9-236.6-415.7-367.4c-48.2-25.5-131.3-33.9-166.1-12.5
	c-205.5,135-240.8,223.6-262.6,329.4c-8.8,42.2-4.2,76.1,0,109.9C19520.4-504,19564.5-495.7,19568.7-483.1L19568.7-483.1
	L19568.7-483.1z` : '' : `M19568.7-483.1c-21.8,38-39.4,71.9-43.6,105.8
	c-4.2,46.4,0,105.8,13,139.2c74.2,135,166.1,190.2,205.5,215.2c30.6,21.3,100.7,29.7,144.3,12.5c13,0,26.4-8.4,39.4-12.5
	c13,0,48.2,12.5,61.2,25.5c17.6,12.5,70,4.2,96-8.4c13-4.2,21.8-25.5,34.8-25.5c126.6-16.7,196.7-118.3,236.1-236.6
	c21.8-46.4,17.6-295.5-4.2-341.9c-153.1-236.6-161.9-236.6-415.7-367.4c-48.2-25.5-131.3-33.9-166.1-12.5
	c-205.5,135-240.8,223.6-262.6,329.4c-8.8,42.2-4.2,76.1,0,109.9C19520.4-504,19564.5-495.7,19568.7-483.1L19568.7-483.1
	L19568.7-483.1z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 65) ? (this.state.statusDoneTeeth.includes(65) ? "#369661" : "#DE2527")
                : this.checkImpacted(65) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(65) ? isMissing ? `M19918.9-65.2c144.3-58.9,227.3-270,231.9-295.5
	c0-16.7-13-29.7-30.6-42.2c-21.8-12.5,0-130.8-26.4-130.8c-17.6-4.2-61.2,29.7-57.1,33.9c4.2,12.5,13,25.5,4.2,38` : '' : `M19918.9-65.2c144.3-58.9,227.3-270,231.9-295.5
	c0-16.7-13-29.7-30.6-42.2c-21.8-12.5,0-130.8-26.4-130.8c-17.6-4.2-61.2,29.7-57.1,33.9c4.2,12.5,13,25.5,4.2,38` }
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 65) ? (this.state.statusDoneTeeth.includes(65) ? "#369661" : "#DE2527")
                : this.checkImpacted(65) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(65) ? isMissing ? `M19565-486.8c17.7,12.5,83.1-8.8,91.9,12.5
	c13,17.1,43.6,105.7,65.4,109.9c26.5-4.2,74.3-88.6,91.9-92.8c26.4-4.6,30.6-17.1,48.2-21.3c43.6-8.4,91.8-8.4,104.8-4.2
	c17.6,12.5,21.8,33.4,17.6,54.7c4.7,16.7,39.5,0,57.1,12.5c21.8,21.4,43.6,55.2,61.2,63.6c17.7,8.3,65.5-8.8,91.9,16.7
	c30.6,12.6,87.2-67.7,104.8-67.7c17.2-4.2,47.8,0,65.4-4.2 M19507.4-550.5c0-59.4,44.1-118.3,57.1-114.1c8.8,4.2-13,67.3,0,92.8` : '' : `M19565-486.8c17.7,12.5,83.1-8.8,91.9,12.5
	c13,17.1,43.6,105.7,65.4,109.9c26.5-4.2,74.3-88.6,91.9-92.8c26.4-4.6,30.6-17.1,48.2-21.3c43.6-8.4,91.8-8.4,104.8-4.2
	c17.6,12.5,21.8,33.4,17.6,54.7c4.7,16.7,39.5,0,57.1,12.5c21.8,21.4,43.6,55.2,61.2,63.6c17.7,8.3,65.5-8.8,91.9,16.7
	c30.6,12.6,87.2-67.7,104.8-67.7c17.2-4.2,47.8,0,65.4-4.2 M19507.4-550.5c0-59.4,44.1-118.3,57.1-114.1c8.8,4.2-13,67.3,0,92.8`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 65) ? (this.state.statusDoneTeeth.includes(65) ? "#369661" : "#DE2527")
                : this.checkImpacted(65) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(65) ? isMissing ? `M19721.8-364.9c13,8.4,21.8,12.5,26.4,25.5
	c4.2,16.7,4.2,42.2,0,58.9` : "" : `M19721.8-364.9c13,8.4,21.8,12.5,26.4,25.5
	c4.2,16.7,4.2,42.2,0,58.9`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 65) ? (this.state.statusDoneTeeth.includes(65) ? "#369661" : "#DE2527")
                : this.checkImpacted(65) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(65) ? isMissing ? `M19813.6-457.6c-61.2-16.7-122.5-76.1-126.6-97
	c-4.2-29.7,17.6-71.9,0-122.5` : '' : `M19813.6-457.6c-61.2-16.7-122.5-76.1-126.6-97
	c-4.2-29.7,17.6-71.9,0-122.5`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 65) ? (this.state.statusDoneTeeth.includes(65) ? "#369661" : "#DE2527")
                : this.checkImpacted(65) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(65) ? isMissing ? `M19896.7-479c0-21.3,26.4-29.7,30.6-50.6
	c4.2-21.3-30.6-84.4-30.6-101.1s-26.4-25.5-52.4-38` : '' : `M19896.7-479c0-21.3,26.4-29.7,30.6-50.6
	c4.2-21.3-30.6-84.4-30.6-101.1s-26.4-25.5-52.4-38`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 65) ? (this.state.statusDoneTeeth.includes(65) ? "#369661" : "#DE2527")
                : this.checkImpacted(65) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(65) ? isMissing ? `M19944.9-272.1c8.8-12.5,26.4-25.5,39.4-29.7
	c8.8-4.2,21.8-21.3,21.8-33.9c0-12.5-21.8-33.9-30.6-50.6c-8.8-16.7,0-29.7,13-42.2c4.2-16.7,4.2-38-17.6-54.7
	c-4.2-16.7,13-38,8.8-58.9c0-25.5,52.4-63.6,61.2-118.3` : '' : `M19944.9-272.1c8.8-12.5,26.4-25.5,39.4-29.7
	c8.8-4.2,21.8-21.3,21.8-33.9c0-12.5-21.8-33.9-30.6-50.6c-8.8-16.7,0-29.7,13-42.2c4.2-16.7,4.2-38-17.6-54.7
	c-4.2-16.7,13-38,8.8-58.9c0-25.5,52.4-63.6,61.2-118.3`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 65) ? (this.state.statusDoneTeeth.includes(65) ? "#369661" : "#DE2527")
                : this.checkImpacted(65) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(65) ? isMissing ? `M20238.1-521.2c-17.6,8.4-30.6,16.7-34.8,33.9
  c4.2,12.5,21.8,12.5,26.4,21.3c4.2,16.7-4.2,38,4.2,46.4c13,12.5,17.6,38,21.8,54.7` : '' : `M20238.1-521.2c-17.6,8.4-30.6,16.7-34.8,33.9
  c4.2,12.5,21.8,12.5,26.4,21.3c4.2,16.7-4.2,38,4.2,46.4c13,12.5,17.6,38,21.8,54.7`}
          />
          {this.isShownRedGraphic("restoration", "Distal", 65) && (
            <path
              fill={this.state.statusDoneTeeth.includes(65) ? "#369661" : "#DE2527"}
              d="M20353.6-601.1c-9.8-35.4-29.3-60.6-48.8-85.9c-34.2,10.1-73.2,15.2-117.2,20.2c-73.2,5.1-136.7,0-190.4-5.1
	c4.9,15.2,14.6,25.3,19.5,45.5s19.5,55.6,24.4,101c4.9,55.6,0,106.1-4.9,141.4c48.8,5,107.4,20.2,175.7,40.4
	c63.5,20.2,112.3,45.5,156.2,70.7c4.9-5.1,4.9-20.2,4.9-35.4c4.9-45.5,0-80.8,0-106.1C20363.4-570.8,20358.5-585.9,20353.6-601.1
	L20353.6-601.1z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Lingual", 65) && (
            <path
              fill={this.state.statusDoneTeeth.includes(65) ? "#369661" : "#DE2527"}
              d="M20114.8-34.4c4.2,0,12.7-4.4,16.9-4.4c-21.1-57.8-42.3-133.4-59.2-222.4c-8.5-62.3-16.9-120.1-16.9-169
	c-12.7,8.9-59.2,40-122.6,44.5c-71.9,4.4-118.3-26.7-135.3-40c4.2,44.5,0,97.8-4.2,155.7c-8.5,93.4-25.4,173.5-42.3,240.2v4.4
	c8.5,13.3,21.1,13.3,38,17.8c21.1,4.4,33.8,4.4,54.9,4.4c12.7,0,29.6-4.4,46.5-8.9c12.7,0,25.4-8.9,38-13.3
	c12.7,0,46.5,13.3,59.2,26.7c16.9,13.3,67.6,4.4,93-8.9c4.2,0,12.7-8.9,16.9-13.3C20102.1-30,20110.6-30,20114.8-34.4L20114.8-34.4z
	"
            />
          )}
          {this.isShownRedGraphic("restoration", "Medial", 65) && (
            <path
              fill={this.state.statusDoneTeeth.includes(65) ? "#369661" : "#DE2527"}
              d="M19573.4-490.1c-33.3,51-55.6,93.4-50,106.1v21.2v21.2v29.7c33.3-21.2,83.3-46.7,144.5-67.9
	c72.2-21.2,133.4-29.7,177.8-34c-16.7-21.2-55.6-76.4-50-148.6c5.6-46.7,22.2-80.7,38.9-101.9c-55.6-12.7-111.1-25.5-177.8-34
	c-55.6-8.5-105.6-12.7-150-17c-5.6,17-11.1,34-11.1,46.7c-5.6,38.2-5.6,51-5.6,59.4c0,17,5.6,34,5.6,51
	C19512.3-511.3,19567.9-502.9,19573.4-490.1L19573.4-490.1z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Buccal", 65) && (
            <path
              fill={this.state.statusDoneTeeth.includes(65) ? "#369661" : "#DE2527"}
              d="M19710.2-950.7c-16.1,14.7-32.1,24.5-37.4,29.4c21.4,34.2,53.5,83.2,74.9,141.9
	c26.8,63.6,32.1,122.3,37.4,166.3c32.1-4.9,74.9-14.7,123-19.6c69.5-4.9,128.4,4.9,165.8,14.7c-5.3-44-10.7-102.7-5.3-166.3
	c5.3-48.9,16-93,26.7-127.2c-16-4.9-42.8-19.6-69.5-34.2l-53.5-24.5c-48.1-24.5-139.1-48.9-203.3-14.7
	C19758.3-980.1,19731.6-960.5,19710.2-950.7z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Oclusial", 65) && (
            <path
              fill={this.state.statusDoneTeeth.includes(65) ? "#369661" : "#DE2527"}
              d="M19769.3-547.5c-8.9,62.6-13.3,96.4,4.4,130.1c44.5,72.3,164.6,53,182.4,53c26.7-4.8,62.3-9.6,89-38.5
	c35.6-38.5,40-91.6,44.5-130.1c4.4-48.2-4.4-81.9-8.9-91.6c-4.4-19.3-13.3-38.5-26.7-53c-4.4-4.8-26.7-28.9-120.1-24.1
	c-62.3,0-97.9,0-115.7,19.3C19787.1-663.1,19778.2-610.1,19769.3-547.5L19769.3-547.5z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 65) && (
            <path
              fill={this.state.statusDoneTeeth.includes(65) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(65) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M19485.5-663.9h879.6v152h-879.6V-663.9z M19485.5-260.7h879.6
	v-152h-879.6V-260.7z"
            />
          )}
          

          
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 64) ? (this.state.statusDoneTeeth.includes(64) ? "#369661" : "#DE2527")
                : this.checkImpacted(64) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(64) ? isMissing ? `M18491.2-394.7c0,16.2-16.7,64.5-12.5,80.7
	c0,24.1,32.9,108.6,86.7,169.3c49.6,52.4,115.5,84.4,156.8,92.8c24.6,7.9,70,7.9,95.1,0c32.9-12.1,86.7-36.2,99.3-32
	c16.7,0,78.4,60.3,99.3,64.5c41.3,0,111.3,0,140.1-12.1c32.9-12.1,78.4-56.6,107.2-100.7c41.3-56.6,70-108.6,78.4-185.1
	c12.5-92.8,16.7-213.4,4.2-270c-37.1-153.1-214.8-261.6-487.1-314.1c-58-12.1-152.6-12.1-193.9,4.2c-28.8,12.1-128,56.6-222.7,153.1
	c-24.6,24.1-12.5,265.8,0,282.1C18449.9-447.1,18487-406.8,18491.2-394.7L18491.2-394.7L18491.2-394.7z` : '' : `M18491.2-394.7c0,16.2-16.7,64.5-12.5,80.7
	c0,24.1,32.9,108.6,86.7,169.3c49.6,52.4,115.5,84.4,156.8,92.8c24.6,7.9,70,7.9,95.1,0c32.9-12.1,86.7-36.2,99.3-32
	c16.7,0,78.4,60.3,99.3,64.5c41.3,0,111.3,0,140.1-12.1c32.9-12.1,78.4-56.6,107.2-100.7c41.3-56.6,70-108.6,78.4-185.1
	c12.5-92.8,16.7-213.4,4.2-270c-37.1-153.1-214.8-261.6-487.1-314.1c-58-12.1-152.6-12.1-193.9,4.2c-28.8,12.1-128,56.6-222.7,153.1
	c-24.6,24.1-12.5,265.8,0,282.1C18449.9-447.1,18487-406.8,18491.2-394.7L18491.2-394.7L18491.2-394.7z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 64) ? (this.state.statusDoneTeeth.includes(64) ? "#369661" : "#DE2527")
                : this.checkImpacted(64) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d=  {this.checkMissing(64) ? isMissing ? `M19275.1-363.1c-33,0-37.1-15.7-65.9-19.9
	c-24.5-3.7-49.6,0-70,4.2c-12.5,4.2-24.6,24.1-37.1,24.1c-12.5-3.7-12.5-32-37.1-44.1c-16.7-7.9-24.6-32-41.3-32
	c-16.2,0-53.3,24.1-70,24.1c-16.7-3.7-37.6-27.8-58-32c-16.7,0-45.5-12.1-58-12.1c-16.7,0-53.8,19.9-78.4,24.1
	c-24.5,0-53.3-3.7-70,4.2c-16.7,3.7-28.8,19.9-41.3,19.9c-16.7,0-37.1,0-45.5-4.2 M19151.3-643.8c25.1-16.2,53.8,24.1,58,36.2
	c12.1,24.6-4.1,44.5-12.5,56.6c-33,39.9-65.9,120.6-82.6,120.6c-12.5,0-70.5-40.4-95.1-68.7` : "" : `M19275.1-363.1c-33,0-37.1-15.7-65.9-19.9
	c-24.5-3.7-49.6,0-70,4.2c-12.5,4.2-24.6,24.1-37.1,24.1c-12.5-3.7-12.5-32-37.1-44.1c-16.7-7.9-24.6-32-41.3-32
	c-16.2,0-53.3,24.1-70,24.1c-16.7-3.7-37.6-27.8-58-32c-16.7,0-45.5-12.1-58-12.1c-16.7,0-53.8,19.9-78.4,24.1
	c-24.5,0-53.3-3.7-70,4.2c-16.7,3.7-28.8,19.9-41.3,19.9c-16.7,0-37.1,0-45.5-4.2 M19151.3-643.8c25.1-16.2,53.8,24.1,58,36.2
	c12.1,24.6-4.1,44.5-12.5,56.6c-33,39.9-65.9,120.6-82.6,120.6c-12.5,0-70.5-40.4-95.1-68.7`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 64) ? (this.state.statusDoneTeeth.includes(64) ? "#369661" : "#DE2527")
                : this.checkImpacted(64) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d=  {this.checkMissing(64) ? isMissing ? `M18850.2-241.6c37.1,0,61.7-52.4,82.6-60.3
	c16.7-4.2,41.3-40.4,49.6-72.4c4.2-16.2-24.6-16.2-24.6-36.2c16.7-48.2,61.7-76.5,61.7-88.6c-8.4-16.2-49.6-44.1-58-56.6
	c-4.2-7.9-16.7-32-12.5-56.6c4.2-19.9,28.8-44.1,32.9-52.4c4.2-7.9,53.8-28.3,82.6-12.1` : "" : `M18850.2-241.6c37.1,0,61.7-52.4,82.6-60.3
	c16.7-4.2,41.3-40.4,49.6-72.4c4.2-16.2-24.6-16.2-24.6-36.2c16.7-48.2,61.7-76.5,61.7-88.6c-8.4-16.2-49.6-44.1-58-56.6
	c-4.2-7.9-16.7-32-12.5-56.6c4.2-19.9,28.8-44.1,32.9-52.4c4.2-7.9,53.8-28.3,82.6-12.1`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 64) ? (this.state.statusDoneTeeth.includes(64) ? "#369661" : "#DE2527")
                : this.checkImpacted(64) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(64) ? isMissing ? `M18895.7-442.9c-24.6-40.4-4.2-72.4-24.6-120.6
	l-24.6-60.3c-16.7-36.2-61.7-100.7-103-72.4` : '' : `M18895.7-442.9c-24.6-40.4-4.2-72.4-24.6-120.6
	l-24.6-60.3c-16.7-36.2-61.7-100.7-103-72.4`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 64) ? (this.state.statusDoneTeeth.includes(64) ? "#369661" : "#DE2527")
                : this.checkImpacted(64) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(64) ? isMissing ? `M18582.1-261.6c-12.5,4.2-20.4,0-28.8-4.2
	s-4.2-52.4-4.2-60.3c4.2-19.9,32.9,4.2,32.9-72.4c8.4-4.2,24.6-4.2,37.1-4.2c-61.7-32-61.7-92.8-78.4-100.7
	c-28.8-16.2-78.4-48.2-111.3-64.5` : '' : `M18582.1-261.6c-12.5,4.2-20.4,0-28.8-4.2
	s-4.2-52.4-4.2-60.3c4.2-19.9,32.9,4.2,32.9-72.4c8.4-4.2,24.6-4.2,37.1-4.2c-61.7-32-61.7-92.8-78.4-100.7
	c-28.8-16.2-78.4-48.2-111.3-64.5`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 64) ? (this.state.statusDoneTeeth.includes(64) ? "#369661" : "#DE2527")
                : this.checkImpacted(64) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(64) ? isMissing ? `M18643.8-531.5c12.5-28.3,8.4-88.6,8.4-108.6
	c0-16.2-4.2-44.1-16.7-56.6c-20.4-19.9-41.3-19.9-61.7-19.9` : '' : `M18643.8-531.5c12.5-28.3,8.4-88.6,8.4-108.6
	c0-16.2-4.2-44.1-16.7-56.6c-20.4-19.9-41.3-19.9-61.7-19.9`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 64) ? (this.state.statusDoneTeeth.includes(64) ? "#369661" : "#DE2527")
                : this.checkImpacted(64) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(64) ? isMissing ? `M19101.7-354.3c-4.2,12.1-4.2,28.3-4.2,44.1
	c-4.2,16.2-12.5,36.2-20.4,52.4c-49.6,76.5-123.9,148.9-173.5,177.2` : '' : `M19101.7-354.3c-4.2,12.1-4.2,28.3-4.2,44.1
	c-4.2,16.2-12.5,36.2-20.4,52.4c-49.6,76.5-123.9,148.9-173.5,177.2`}
          />
          {this.isShownRedGraphic("restoration", "Distal", 64) && (
            <path
              fill={this.state.statusDoneTeeth.includes(64) ? "#369661" : "#DE2527"}
              d="M19347.3-592.6c-10.6-28.7-26.5-76.5-74.1-129.2c-37.1,19.1-84.7,43.1-142.9,57.4
	c-74.1,19.1-137.7,19.1-185.3,19.1c21.2,28.7,63.5,95.7,63.5,186.6c0,52.6-15.9,95.7-26.5,124.4c42.4-4.8,111.2-9.6,190.6,4.8
	c74.1,14.4,127.1,38.3,164.1,57.4c5.3-14.4,10.6-28.7,10.6-38.3v-67c0-9.6,5.3-67,5.3-110C19352.6-540,19352.6-563.9,19347.3-592.6
	L19347.3-592.6z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Oclusial", 64) && (
            <path
              fill={this.state.statusDoneTeeth.includes(64) ? "#369661" : "#DE2527"}
              d="M19018.1-503.7c-7.8-48.1-11.7-92.1-46.7-124.2c-35.1-28-81.8-24-116.9-24c-31.2,4-54.5,12-58.4,12
	c-15.6,4-31.2,12-62.3,28c-35.1,20-35.1,20-39,24c-3.9,8-3.9,16-3.9,72.1v28c0,12,3.9,52.1,27.3,104.1c11.7,24,19.5,40,35.1,56.1
	c39,40,105.2,48.1,155.8,32c15.6-4,66.2-24,97.4-76.1C19029.8-419.6,19025.9-463.6,19018.1-503.7L19018.1-503.7z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Medial", 64) && (
            <path
              fill={this.state.statusDoneTeeth.includes(64) ? "#369661" : "#DE2527"}
              d="M18432.4-538.3c-13.1,8.5-8.8,29.8-4.4,38.3c4.4,21.3,13.1,38.3,17.5,46.8c17.5,21.3,30.6,21.3,35,38.3
	c4.4,17,0,34,0,38.3c0,12.8-4.4,12.8-8.8,29.8c-4.4,17,0,25.5,0,34s4.4,17,4.4,21.3c4.4,8.5,8.8,17,8.8,21.3l8.8,17
	c4.4,8.5,4.4,12.8,4.4,12.8c4.4,12.8,4.4,17,8.8,17h8.8c8.8-4.3,17.5-8.5,21.9-12.8c17.5-12.8,17.5-12.8,26.3-21.3
	c4.4-4.3,8.8-8.5,21.9-12.8c26.3-12.8,61.3-21.3,70-25.5c21.9-8.5,43.8-12.8,74.4-21.3c21.9-4.3,48.2-8.5,74.4-12.8
	c-17.5-21.3-43.8-59.5-61.3-114.8c-17.5-68-13.1-127.6-4.4-157.3c-30.6,0-56.9,4.3-83.2,8.5c-35,4.3-70,8.5-96.3,17
	c-26.3,8.5-56.9,17-83.2,25.5c-21.9,4.3-35,8.5-35,8.5C18436.8-538.3,18436.8-538.3,18432.4-538.3L18432.4-538.3z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Buccal", 64) && (
            <path
              fill={this.state.statusDoneTeeth.includes(64) ? "#369661" : "#DE2527"}
              d="M18694.7-909.5c-38.7,14.3-68.7,28.7-90.2,38.3c30.1,33.5,64.4,86.1,90.2,153.1c25.8,67,38.7,129.1,43,172.2
	c21.5-19.1,73-57.4,146.1-67c73-9.6,133.2,9.6,158.9,19.1c-8.6-33.5-17.2-81.3-17.2-133.9c0-47.8,4.3-90.9,8.6-124.4
	c-68.7-28.7-124.6-43-167.5-52.6C18806.4-919,18754.9-928.6,18694.7-909.5L18694.7-909.5z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Lingual", 64) && (
            <path
              fill={this.state.statusDoneTeeth.includes(64) ? "#369661" : "#DE2527"}
              d="M19152.2-30.5c16-25.5-44-80.7-76-165.6c-28-68-28-135.9-20-191.1c-24,17-68,46.7-132,55.2
	c-56,8.5-100,0-128-8.5c8,46.7,16,101.9,16,161.4c0,46.7,0,89.2-4,127.4c4,0,8-4.2,16-4.2c36-12.7,44-21.2,68-25.5c8,0,20-4.2,32,0
	c40,8.5,40,38.2,80,55.2c16,8.5,40,4.2,84,4.2C19128.1-22,19148.1-22,19152.2-30.5L19152.2-30.5z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 64) && (
            <path
              fill={this.state.statusDoneTeeth.includes(64) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(64) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M18418-658.5h950.3v152H18418V-658.5z M18418-255.2h950.3v-152
	H18418V-255.2z"
            />
          )}


          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 63) ? (this.state.statusDoneTeeth.includes(63) ? "#369661" : "#DE2527")
                : this.checkImpacted(63) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(63) ? isMissing ? `M17712.4-602.5
	c34.8-53.8,146.6-118.8,240.8-143.8c41.8-14.4,115-21.8,160.5,0c69.6,28.8,181.4,122.5,226.8,219.4c17.6,32.5,17.6,79.3-3.7,129.4
	c-62.6,108.1-135.9,205-244.5,255.1c-27.8,14.4-66.3,14.4-97.9,0c-94.2-21.8-223.1-161.9-289.5-334.5
	C17680.8-548.3,17694.7-577,17712.4-602.5L17712.4-602.5L17712.4-602.5z` : '' : `M17712.4-602.5
	c34.8-53.8,146.6-118.8,240.8-143.8c41.8-14.4,115-21.8,160.5,0c69.6,28.8,181.4,122.5,226.8,219.4c17.6,32.5,17.6,79.3-3.7,129.4
	c-62.6,108.1-135.9,205-244.5,255.1c-27.8,14.4-66.3,14.4-97.9,0c-94.2-21.8-223.1-161.9-289.5-334.5
	C17680.8-548.3,17694.7-577,17712.4-602.5L17712.4-602.5L17712.4-602.5z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 63) ? (this.state.statusDoneTeeth.includes(63) ? "#369661" : "#DE2527")
                : this.checkImpacted(63) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d=  {this.checkMissing(63) ? isMissing ? `M17907.7-526.9c20.9,0,41.8,0,59.4,10.7
	c13.9,10.7,24.6,21.8,24.6,43.1c0,18.1-3.7,39.4-7,57.5c38.5,25.1,84-36.2,108.1-64.9c7-10.7,17.6-18.1,27.8-21.8
	c17.6,0,27.8,7.4,41.8,14.4c17.6,18.1,20.9,39.4,17.6,61.2c0,14.4-3.7,28.8-3.7,43.1c3.7,14.4,0,28.8-10.7,39.4
	c-10.7,25.1-20.9,46.9-41.8,61.2c-27.8,14.4-41.8,14.4-38.5-3.7c7-18.1,3.7-53.8,0-64.9c0-10.7-34.8-21.8-34.8-18.1
	c-3.7,3.7-24.6,0-38.5,0c-13.9,3.7-24.6,10.7-38.5,18.1c-10.7,3.7-20.9,3.7-31.5,7.4c0-28.8,0-57.5-20.9-79.3
	c-10.7-10.7-20.9-28.8-24.6-46.9C17897-487.5,17897-512.5,17907.7-526.9L17907.7-526.9L17907.7-526.9z` : '' : `M17907.7-526.9c20.9,0,41.8,0,59.4,10.7
	c13.9,10.7,24.6,21.8,24.6,43.1c0,18.1-3.7,39.4-7,57.5c38.5,25.1,84-36.2,108.1-64.9c7-10.7,17.6-18.1,27.8-21.8
	c17.6,0,27.8,7.4,41.8,14.4c17.6,18.1,20.9,39.4,17.6,61.2c0,14.4-3.7,28.8-3.7,43.1c3.7,14.4,0,28.8-10.7,39.4
	c-10.7,25.1-20.9,46.9-41.8,61.2c-27.8,14.4-41.8,14.4-38.5-3.7c7-18.1,3.7-53.8,0-64.9c0-10.7-34.8-21.8-34.8-18.1
	c-3.7,3.7-24.6,0-38.5,0c-13.9,3.7-24.6,10.7-38.5,18.1c-10.7,3.7-20.9,3.7-31.5,7.4c0-28.8,0-57.5-20.9-79.3
	c-10.7-10.7-20.9-28.8-24.6-46.9C17897-487.5,17897-512.5,17907.7-526.9L17907.7-526.9L17907.7-526.9z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 63) ? (this.state.statusDoneTeeth.includes(63) ? "#369661" : "#DE2527")
                : this.checkImpacted(63) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d=  {this.checkMissing(63) ? isMissing ? `M18288.1-408.2c-13.9-7.4-24.6-10.7-41.8,0
	c-17.6,10.7-38.5,18.1-55.7,21.8c-13.9,3.7-10.7,18.1-20.9,32.5c-10.7,7.4-17.6,39.4-31.5,53.8s-27.8,28.8-45.5,25.1
	c-10.7-3.7-3.7-39.4,0-61.2c0-10.7-10.7-25.1-20.9-32.5c-13.9-7.4-59.4-7.4-73.3,0c-7,3.7-17.6,14.4-24.6,18.1
	c-24.6,10.7-69.6,7.4-84,0c-10.7-3.7-94.2-64.9-115-147.5c-3.7-10.7-31.5-36.2-20.9-61.2` : '' : `M18288.1-408.2c-13.9-7.4-24.6-10.7-41.8,0
	c-17.6,10.7-38.5,18.1-55.7,21.8c-13.9,3.7-10.7,18.1-20.9,32.5c-10.7,7.4-17.6,39.4-31.5,53.8s-27.8,28.8-45.5,25.1
	c-10.7-3.7-3.7-39.4,0-61.2c0-10.7-10.7-25.1-20.9-32.5c-13.9-7.4-59.4-7.4-73.3,0c-7,3.7-17.6,14.4-24.6,18.1
	c-24.6,10.7-69.6,7.4-84,0c-10.7-3.7-94.2-64.9-115-147.5c-3.7-10.7-31.5-36.2-20.9-61.2`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 63) ? (this.state.statusDoneTeeth.includes(63) ? "#369661" : "#DE2527")
                : this.checkImpacted(63) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(63) ? isMissing ? `M18180-365c-7-10.7-3.7-36.2,0-61.2
	c0-18.1,0-36.2-7-50.6c-10.7-18.1-31.5-28.8-45.5-28.8c-17.6,0-31.5,7.4-34.8,21.8` : '' : `M18180-365c-7-10.7-3.7-36.2,0-61.2
	c0-18.1,0-36.2-7-50.6c-10.7-18.1-31.5-28.8-45.5-28.8c-17.6,0-31.5,7.4-34.8,21.8`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 63) ? (this.state.statusDoneTeeth.includes(63) ? "#369661" : "#DE2527")
                : this.checkImpacted(63) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(63) ? isMissing ? `M17977.3-203.1c3.7-7.4,3.7-14.4,0-18.1
	c-7,0-13.9-7.4-13.9-10.7c-10.7-10.7,3.7-79.3-3.7-111.3h-17.6c-3.7-28.8,0-64.9-20.9-79.3` : '' : `M17977.3-203.1c3.7-7.4,3.7-14.4,0-18.1
	c-7,0-13.9-7.4-13.9-10.7c-10.7-10.7,3.7-79.3-3.7-111.3h-17.6c-3.7-28.8,0-64.9-20.9-79.3`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 63) ? (this.state.statusDoneTeeth.includes(63) ? "#369661" : "#DE2527")
                : this.checkImpacted(63) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(63) ? isMissing ? `M18015.8-368.7c-3.7-14.4-17.6-25.1-24.6-36.2
	c-10.7-14.4,3.7-46.9,3.7-71.9c-7-32.5-34.8-53.8-87.2-50.6` : '' : `M18015.8-368.7c-3.7-14.4-17.6-25.1-24.6-36.2
	c-10.7-14.4,3.7-46.9,3.7-71.9c-7-32.5-34.8-53.8-87.2-50.6`}
          />
          {this.isShownRedGraphic("restoration", "Distal", 63) && (
            <path
              fill={this.state.statusDoneTeeth.includes(63) ? "#369661" : "#DE2527"}
              d="M18226.7-235.2c-7.5,3.8-11.2,11.3-14.9,11.3c-26.1-49.2-74.5-147.5-85.7-276
	c-7.5-102.1,11.2-181.5,26.1-234.4c52.2,30.2,89.4,60.5,108.1,83.2c11.2,15.1,18.6,26.5,37.3,49.2c22.4,30.2,33.5,49.2,44.7,71.8
	c7.5,15.1,11.2,26.5,11.2,37.8v22.7v22.7c-3.7,26.5-11.2,49.2-14.9,52.9c0,7.6-11.2,22.7-41,71.8
	C18264-269.2,18234.2-242.7,18226.7-235.2L18226.7-235.2z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Buccal", 63) && (
            <path
              fill={this.state.statusDoneTeeth.includes(63) ? "#369661" : "#DE2527"}
              d="M18105.5-749.4c11.4,3.6,30.4,10.9,49.3,25.3c-7.6,25.3-15.2,57.9-22.8,94.1c-11.4,57.9-7.6,108.6-3.8,148.4
	c-75.9,3.6-148,7.2-223.9,10.9c3.8-10.9,3.8-28.9,7.6-47c0-7.2,3.8-36.2,7.6-79.6c0-10.9,0-54.3-3.8-90.5
	c-3.8-3.6-3.8-10.9-7.6-21.7c-3.8-14.5-11.4-21.7-15.2-28.9c7.6-3.6,22.8-7.2,37.9-10.9C17965.1-756.6,18033.4-774.7,18105.5-749.4
	L18105.5-749.4z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Lingual", 63) && (
            <path
              fill={this.state.statusDoneTeeth.includes(63) ? "#369661" : "#DE2527"}
              d="M17848.6-243.3c18.2-46.2,36.4-96.6,47.3-147.1c10.9-37.8,18.2-75.6,25.5-109.3
	c72.8-4.2,145.6-12.6,218.3-16.8c3.6,37.8,7.3,88.2,25.5,142.9c18.2,58.8,43.7,105,61.9,138.7c-14.6,12.6-72.8,75.6-131,105
	c-21.8,8.4-36.4,12.6-50.9,12.6c-7.3,0-21.8,0-50.9-12.6c-25.5-12.6-54.6-25.2-91-54.6C17888.7-197.1,17870.5-218.1,17848.6-243.3
	L17848.6-243.3z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Medial", 63) && (
            <path
              fill={this.state.statusDoneTeeth.includes(63) ? "#369661" : "#DE2527"}
              d="M17715.9-598.4c26.8-41.3,65.1-63.8,95.7-86.4c15.3-11.3,38.3-18.8,76.5-37.5c38.3-15,42.1-15,45.9-15
	c38.3,11.3,34.4,161.4,15.3,274.1c-7.7,60.1-30.6,142.7-80.4,244c-15.3-15-30.6-30-38.3-41.3c-15.3-18.8-65-82.6-107.1-169
	c-7.7-15-11.5-30-15.3-37.5c-11.5-22.5-23-60.1-11.5-97.6C17700.6-568.3,17704.5-579.6,17715.9-598.4L17715.9-598.4z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 63) && (
            <path
              fill={this.state.statusDoneTeeth.includes(63) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(63) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M17689.4-670.8h614.8v152h-614.8V-670.8z M17689.4-267.5h614.8
	v-152h-614.8V-267.5z"
            />
          )}

          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 62) ? (this.state.statusDoneTeeth.includes(62) ? "#369661" : "#DE2527")
                : this.checkImpacted(62) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d=  {this.checkMissing(62) ? isMissing ? `M17000.1-383.4c4.2,4.6,8.4,13.5,17.2,22.3
	c72.4,105.8,233.8,233.8,259.3,242.6c25.5,13.5,76.5,17.6,110.4,0c84.9-61.7,165.6-141,195.8-233.8c17.2-44.1,12.5-119.2-4.2-149.8
	c-33.9-70.5-148.9-176.3-204.1-202.7c-25.5-26.4-144.7-22.3-170.3,0c-76.5,31.1-170.3,141-204.1,207.4
	C16982.9-476.2,16978.7-409.8,17000.1-383.4L17000.1-383.4z` : '' : `M17000.1-383.4c4.2,4.6,8.4,13.5,17.2,22.3
	c72.4,105.8,233.8,233.8,259.3,242.6c25.5,13.5,76.5,17.6,110.4,0c84.9-61.7,165.6-141,195.8-233.8c17.2-44.1,12.5-119.2-4.2-149.8
	c-33.9-70.5-148.9-176.3-204.1-202.7c-25.5-26.4-144.7-22.3-170.3,0c-76.5,31.1-170.3,141-204.1,207.4
	C16982.9-476.2,16978.7-409.8,17000.1-383.4L17000.1-383.4z `}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 62) ? (this.state.statusDoneTeeth.includes(62) ? "#369661" : "#DE2527")
                : this.checkImpacted(62) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d=  {this.checkMissing(62) ? isMissing ? `M17009.4-370.7c38.1,8.8,102.1,8.8,114.6,0
	c12.5-4.2,21.3-44.1,38-44.1c16.7,0,46.4,61.7,63.6,66.3c8.3,9.2,84.9,9.2,106.2,4.6c33.9-4.2,55.2-48.7,84.9-44.1
	c25.5,0,16.7,44.1,38,48.7c13,4.6,80.7-8.8,123.4,0 M17200-255.3c0-35.3,8.4-75.2,33.9-92.8` : "" : `M17009.4-370.7c38.1,8.8,102.1,8.8,114.6,0
	c12.5-4.2,21.3-44.1,38-44.1c16.7,0,46.4,61.7,63.6,66.3c8.3,9.2,84.9,9.2,106.2,4.6c33.9-4.2,55.2-48.7,84.9-44.1
	c25.5,0,16.7,44.1,38,48.7c13,4.6,80.7-8.8,123.4,0 M17200-255.3c0-35.3,8.4-75.2,33.9-92.8`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 62) ? (this.state.statusDoneTeeth.includes(62) ? "#369661" : "#DE2527")
                : this.checkImpacted(62) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d=  {this.checkMissing(62) ? isMissing ? `M17331.8-344c0,22.3-17.2,88.1-12.5,101.6
	c0,17.6,38,39.9,55.2,70.5` : '' : `M17331.8-344c0,22.3-17.2,88.1-12.5,101.6
	c0,17.6,38,39.9,55.2,70.5`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 62) ? (this.state.statusDoneTeeth.includes(62) ? "#369661" : "#DE2527")
                : this.checkImpacted(62) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d=  {this.checkMissing(62) ? isMissing ? `M17446.4-352.8c-17.2,8.8-29.7,26.4-21.3,35.3
	c25.5,8.8,25.5,101.6,59.4,110.4` : '' : `M17446.4-352.8c-17.2,8.8-29.7,26.4-21.3,35.3
	c25.5,8.8,25.5,101.6,59.4,110.4`}
          />
          {this.isShownRedGraphic("restoration", "Buccal", 62) && (
            <path
              fill={this.state.statusDoneTeeth.includes(62) ? "#369661" : "#DE2527"}
              d="M17393.4-699c-30.3-21.4-171.5-25.7-201.8,0c-15.1,8.6-25.2,12.9-40.4,21.4c5,8.6,15.1,25.7,20.2,42.9
	c10.1,21.4,20.2,55.7,30.3,107.2c5,25.7,5,60-5,102.9c65.6,8.6,126.1,21.4,191.7,30c-5-38.6-10.1-94.3,5-158.6
	c10.1-51.4,25.2-94.3,40.4-124.3C17418.7-686.2,17408.6-694.7,17393.4-699z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Medial", 62) && (
            <path
              fill={this.state.statusDoneTeeth.includes(62) ? "#369661" : "#DE2527"}
              d="M16990-384.5c4.6,4.3,9.1,13,18.3,21.6c73.1,82.1,123.4,125.3,150.9,146.9c4.6,0,54.9-125.3,50.3-259.3
	c0-99.4-32-203.1-41.1-203.1c-13.7,8.6-41.1,25.9-82.3,64.8c-41.1,34.6-73.1,77.8-91.4,112.4
	C16976.3-479.6,16971.8-414.7,16990-384.5z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Lingual", 62) && (
            <path
              fill={this.state.statusDoneTeeth.includes(62) ? "#369661" : "#DE2527"}
              d="M17447.7-162c13.7-10.4,27.5-26.1,36.6-36.6c-22.9-26.1-50.4-62.7-73.3-114.9
	c-22.9-57.4-36.6-109.7-41.2-146.2c-59.5,15.7-114.5,26.1-174.1,36.6c0,31.3-4.6,62.7-13.7,99.2c-9.2,47-22.9,83.5-36.6,114.9
	c18.3,20.9,36.6,41.8,64.1,62.7c18.3,15.7,41.2,31.3,59.5,41.8c27.5,15.7,82.5,20.9,119.1,0C17411-120.3,17429.3-141.2,17447.7-162z
	"
            />
          )}
          {this.isShownRedGraphic("restoration", "Distal", 62) && (
            <path
              fill={this.state.statusDoneTeeth.includes(62) ? "#369661" : "#DE2527"}
              d="M17408.5-683.6c-18.3,36.5-50.2,114.1-41.1,214.5c4.6,150.6,91.3,251,118.7,278.3l36.5-36.5
	c32-41.1,50.2-82.1,54.8-91.3c0-4.6,4.6-13.7,9.1-27.4c4.6-18.3,22.8-86.7-4.6-155.1c-18.3-41.1-45.7-68.4-95.9-118.6
	C17454.2-647.1,17426.8-669.9,17408.5-683.6L17408.5-683.6z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 62) && (
            <path
              fill={this.state.statusDoneTeeth.includes(62) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(62) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M16982.8-645.3h599.2v152h-599.2V-645.3z M16982.8-242h599.2v-152
	h-599.2V-242z"
            />
          )}


          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 61) ? (this.state.statusDoneTeeth.includes(61) ? "#369661" : "#DE2527")
                : this.checkImpacted(61) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(61) ? isMissing ? `M16405.8-654.8c-9.3,7-46.4,10.7-58.9,14.4
	c-43.6,7-92.8,75.2-105.3,103.9c-133.1,154,223.1,386.4,294.6,436.5c0,0,77.5,7,92.8-3.7c77.5-35.7,148.9-186,192.1-257.5
	c18.6-60.8,21.8-118.3,9.3-167.9c-6-25.1-18.6-39.4-31.1-53.8c-3.2-3.7-27.8-43.1-74.2-53.8c-15.3-3.7-49.6-3.7-55.7-14.4
	c-15.3-14.4-31.1-32-52.9-35.7c-49.6-10.7-108.6-7-151.7,3.7C16442.9-676.1,16424.4-665.4,16405.8-654.8L16405.8-654.8
	L16405.8-654.8z` : '' : `M16405.8-654.8c-9.3,7-46.4,10.7-58.9,14.4
	c-43.6,7-92.8,75.2-105.3,103.9c-133.1,154,223.1,386.4,294.6,436.5c0,0,77.5,7,92.8-3.7c77.5-35.7,148.9-186,192.1-257.5
	c18.6-60.8,21.8-118.3,9.3-167.9c-6-25.1-18.6-39.4-31.1-53.8c-3.2-3.7-27.8-43.1-74.2-53.8c-15.3-3.7-49.6-3.7-55.7-14.4
	c-15.3-14.4-31.1-32-52.9-35.7c-49.6-10.7-108.6-7-151.7,3.7C16442.9-676.1,16424.4-665.4,16405.8-654.8L16405.8-654.8
	L16405.8-654.8z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 61) ? (this.state.statusDoneTeeth.includes(61) ? "#369661" : "#DE2527")
                : this.checkImpacted(61) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(61) ? isMissing ? `M16241.6-379.2c18.6,28.8,33.9,46.4,58.9,75.2
	c6-7,9.3-7,15.3-14.4c24.6-28.8,49.6-50.1,64.9-43.1c9.3,3.7,15.3,7,21.8,18.1c21.8,14.4,40.4-7,46.4-10.7c15.3,0,27.8-3.7,40.4-3.7
	c43.6-7,37.1,10.7,71.4,46.4c18.6,3.7,33.9-3.7,49.6-18.1c37.1-3.7,64.9,3.7,90,25.1c12.5,28.8,27.8,43.1,52.9,46.4
	c12.5-14.4,18.6-28.8,21.8-50.1c6-32,6-60.8,0-85.8c-6-18.1-21.8-32-43.6-35.7c-24.6-3.7-52.9,0-83.5,14.4
	c-18.6,0-40.4,3.7-62.2,3.7l-15.3,18.1c-9.3-7-15.3-14.4-24.6-21.3h-58.9c-21.8-7-43.6-7-62.2,3.7c-12.5,18.1-27.8,28.8-46.4,7
	c-15.3-14.4-58.9-14.4-99.3-10.7C16260.2-411.7,16250.9-401,16241.6-379.2L16241.6-379.2L16241.6-379.2z` : '' : `M16241.6-379.2c18.6,28.8,33.9,46.4,58.9,75.2
	c6-7,9.3-7,15.3-14.4c24.6-28.8,49.6-50.1,64.9-43.1c9.3,3.7,15.3,7,21.8,18.1c21.8,14.4,40.4-7,46.4-10.7c15.3,0,27.8-3.7,40.4-3.7
	c43.6-7,37.1,10.7,71.4,46.4c18.6,3.7,33.9-3.7,49.6-18.1c37.1-3.7,64.9,3.7,90,25.1c12.5,28.8,27.8,43.1,52.9,46.4
	c12.5-14.4,18.6-28.8,21.8-50.1c6-32,6-60.8,0-85.8c-6-18.1-21.8-32-43.6-35.7c-24.6-3.7-52.9,0-83.5,14.4
	c-18.6,0-40.4,3.7-62.2,3.7l-15.3,18.1c-9.3-7-15.3-14.4-24.6-21.3h-58.9c-21.8-7-43.6-7-62.2,3.7c-12.5,18.1-27.8,28.8-46.4,7
	c-15.3-14.4-58.9-14.4-99.3-10.7C16260.2-411.7,16250.9-401,16241.6-379.2L16241.6-379.2L16241.6-379.2z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 61) ? (this.state.statusDoneTeeth.includes(61) ? "#369661" : "#DE2527")
                : this.checkImpacted(61) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(61) ? isMissing ? `M16235.6-376c9.3-14.4,21.8-28.8,31.1-35.7
	c12.5-7,55.7-3.7,96-3.7c12.5,3.7,18.6,21.3,27.8,21.3c12.5,3.7,24.6-10.7,33.9-18.1` : '' : `M16235.6-376c9.3-14.4,21.8-28.8,31.1-35.7
	c12.5-7,55.7-3.7,96-3.7c12.5,3.7,18.6,21.3,27.8,21.3c12.5,3.7,24.6-10.7,33.9-18.1`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 61) ? (this.state.statusDoneTeeth.includes(61) ? "#369661" : "#DE2527")
                : this.checkImpacted(61) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(61) ? isMissing ? `M16650.8-414.9h-58.9c-6,0-15.3,21.3-21.8,21.3
	c-9.3,0-18.6-21.3-24.6-21.3h-58.9` : '' : `M16650.8-414.9h-58.9c-6,0-15.3,21.3-21.8,21.3
	c-9.3,0-18.6-21.3-24.6-21.3h-58.9`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 61) ? (this.state.statusDoneTeeth.includes(61) ? "#369661" : "#DE2527")
                : this.checkImpacted(61) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(61) ? isMissing ? `M16697.2-304c9.3,28.8,33.9,57.1,52.9,46.4
	c15.3-18.1,18.6-28.8,21.8-50.1c9.3-32,6-78.9,0-93.2c-6-14.4-24.6-25.1-40.4-28.8` : '' : `M16697.2-304c9.3,28.8,33.9,57.1,52.9,46.4
	c15.3-18.1,18.6-28.8,21.8-50.1c9.3-32,6-78.9,0-93.2c-6-14.4-24.6-25.1-40.4-28.8`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 61) ? (this.state.statusDoneTeeth.includes(61) ? "#369661" : "#DE2527")
                : this.checkImpacted(61) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(61) ? isMissing ? `M16607.2-332.8c-15.3,7-31.1,18.1-49.6,18.1
	c-15.3,0-15.3-25.1-33.9-39.4c-24.6-7-52.9-7-77.5,0` : '' : `M16607.2-332.8c-15.3,7-31.1,18.1-49.6,18.1
	c-15.3,0-15.3-25.1-33.9-39.4c-24.6-7-52.9-7-77.5,0`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 61) ? (this.state.statusDoneTeeth.includes(61) ? "#369661" : "#DE2527")
                : this.checkImpacted(61) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(61) ? isMissing ? `M16557.5-311.5c-3.2,21.3,3.2,50.1,9.3,68.2
	c15.3,21.3,21.8,60.8,31.1,64.5c24.6,10.7,49.6,25.1,68.2,43.1` : '' : `M16557.5-311.5c-3.2,21.3,3.2,50.1,9.3,68.2
	c15.3,21.3,21.8,60.8,31.1,64.5c24.6,10.7,49.6,25.1,68.2,43.1`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 61) ? (this.state.statusDoneTeeth.includes(61) ? "#369661" : "#DE2527")
                : this.checkImpacted(61) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d=  {this.checkMissing(61) ? isMissing ? `M16517.2-118c-31.1-25.1-86.7-82.1-96-125.3
	c-9.3-28.8-18.6-60.8-21.8-100.2c-12.5-25.1-31.1-21.3-43.6-14.4c-21.8,21.3-40.4,43.1-64.9,57.1` : '' : `M16517.2-118c-31.1-25.1-86.7-82.1-96-125.3
	c-9.3-28.8-18.6-60.8-21.8-100.2c-12.5-25.1-31.1-21.3-43.6-14.4c-21.8,21.3-40.4,43.1-64.9,57.1`}
          />
          {this.isShownRedGraphic("restoration", "Distal", 61) && (
            <g id="erXMLID_1_">
              <path
                id="erXMLID_2_"
                fill={this.state.statusDoneTeeth.includes(61) ? "#369661" : "#DE2527"}
                d="M16630.4-471.5c6.3,129.4,90.8,255.1,109.6,248h3.1c31.3-46.7,59.5-100.6,81.4-136.6
		c18.8-61.1,21.9-118.6,9.4-168.9c-6.3-25.2-18.8-39.5-31.3-53.9c-3.1-3.6-28.2-43.1-78.3-50.3c-12.5-3.6-21.9-7.2-34.5-7.2
		c0,0-3.1,0-9.4-3.6c-6.3,0-9.4-3.6-12.5-7.2C16630.4-572.1,16630.4-507.4,16630.4-471.5z"
              />
            </g>
          )}
          {this.isShownRedGraphic("restoration", "Lingual", 61) && (
            <g id="esXMLID_1_">
              <path
                id="esXMLID_2_"
                fill={this.state.statusDoneTeeth.includes(61) ? "#369661" : "#DE2527"}
                d="M16636.1-420.8c-61.2,4-119.3,4-180.5,8c-3.2,11.9-6.4,27.9-12.9,43.8
		c-3.2,23.9-9.7,43.8-22.6,71.7c-3.2,11.9-9.7,23.9-19.3,35.8c-12.9,19.9-25.8,27.9-35.5,35.8c12.9,11.9,25.8,27.9,41.9,39.8
		c45.1,39.8,87,67.7,125.7,87.6c9.7,4,25.8,4,38.7,4c22.6,0,41.9,0,58-4c9.7-8,22.6-15.9,38.7-31.9c6.4-4,16.1-11.9,25.8-27.9
		c12.9-15.9,29-39.8,45.1-67.7c-9.7-8-22.6-19.9-35.5-35.8c-12.9-15.9-19.3-31.9-29-51.8C16665.1-341.1,16649-373,16636.1-420.8
		L16636.1-420.8z"
              />
            </g>
          )}
          {this.isShownRedGraphic("restoration", "Medial", 61) && (
            <g id="etXMLID_1_">
              <path
                id="etXMLID_2_"
                fill={this.state.statusDoneTeeth.includes(61) ? "#369661" : "#DE2527"}
                d="M16344.5-638.7c-41.8,7.2-89.5,75.4-101.4,104.1c-8.9,10.8-20.9,28.7-26.8,53.9
		c-11.9,57.4,29.8,114.9,50.7,147.2c17.9,25.1,38.8,46.7,59.7,68.2c11.9,18,23.9,28.7,32.8,35.9c3,3.6,8.9,3.6,11.9,10.8
		c6-7.2,14.9-14.4,23.9-25.1l17.9-28.7c53.7-104.1,44.7-211.8,44.7-211.8s-3-39.5-44.7-150.8c-3-7.2-6-18-11.9-18
		C16392.2-645.8,16356.4-642.2,16344.5-638.7z"
              />
            </g>
          )}
          {this.isShownRedGraphic("restoration", "Buccal", 61) && (
            <g id="eqXMLID_1_">
              <path
                id="eqXMLID_2_"
                fill={this.state.statusDoneTeeth.includes(61) ? "#369661" : "#DE2527"}
                d="M16453-684c-27.4,6.8-44.5,17-58.2,23.9c3.4,13.6,13.7,27.3,20.5,47.7
		c13.7,27.3,20.5,47.7,20.5,51.1c10.3,34.1,13.7,47.7,17.1,71.6c3.4,20.5,0,44.3,0,51.1c0,10.2-3.4,20.5-3.4,27.3
		c65-3.4,130-6.8,195-6.8c-6.8-23.9-10.3-54.5-10.3-85.2c0-23.9,3.4-44.3,3.4-51.1c3.4-13.6,6.8-20.5,6.8-27.3
		c0-3.4,3.4-13.6,6.8-23.9c6.8-10.2,13.7-27.3,23.9-47.7c-6.8-6.8-17.1-17-30.8-23.9c-13.7-6.8-30.8-13.6-85.5-13.6
		C16507.7-690.8,16480.3-690.8,16453-684L16453-684z"
              />
            </g>
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 61) && (
            <path
              fill={this.state.statusDoneTeeth.includes(61) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(61) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M16228.1-647.6h599.2v152h-599.2V-647.6z M16228.1-244.4h599.2
	v-152h-599.2V-244.4z"
            />
          )}
          <path
            fill="#D0C9A3"
            onClick={() => {
              this.toggleSelectedNumber(65);
              this.props.onClick(65);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 65)
                ? (this.state.statusDoneTeeth.includes(65) ? "#369661" : "#DE2527")
                : this.checkImpacted(65) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="22.926"
            d= {this.checkMissing(65) ? isMissing ? `M19633.7-2586.7l97.4,506.6l369.3-49.6
	l5.1-541.4c-71.9-168.9-71.9-298.3-77-456.9c-5.1-44.5,30.6-203.7-46.4-203.7c-154,5.1-102.5,387.4-174.4,451.8L19633.7-2586.7
	L19633.7-2586.7L19633.7-2586.7z` : "" : `M19633.7-2586.7l97.4,506.6l369.3-49.6
	l5.1-541.4c-71.9-168.9-71.9-298.3-77-456.9c-5.1-44.5,30.6-203.7-46.4-203.7c-154,5.1-102.5,387.4-174.4,451.8L19633.7-2586.7
	L19633.7-2586.7L19633.7-2586.7z`}
          />
          <path
            fill="#F2ECBE"
            onClick={() => {
              this.toggleSelectedNumber(65);
              this.props.onClick(65);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 65)
                ? (this.state.statusDoneTeeth.includes(65) ? "#369661" : "#DE2527")
                : this.checkImpacted(65) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="22.926"
            d={this.checkMissing(65) ? isMissing ? `M19885.1-1857l328.4-19.9
	c66.8-347.5,138.7-908.8-117.8-1157.4c-5.1,0-133.6-154-97.4,74.7c0,25.1,30.6,302.9,30.6,392.5c-5.1,228.7-25.5,392.5-97.4,407.3
	c-46.4,9.7-92.3-148.9-82.1-288.1c20.4-581.3,117.8-690.3,92.3-754.8c-97.4-49.6-225.9,198.5-251.4,268.1
	c-92.3,243.5-122.9,486.6-143.8,814.6c-10.2,109,10.2,198.5,35.7,273.2c25.5-9.7,77,59.8,102.5,49.6L19885.1-1857L19885.1-1857z` : "" : `M19885.1-1857l328.4-19.9
	c66.8-347.5,138.7-908.8-117.8-1157.4c-5.1,0-133.6-154-97.4,74.7c0,25.1,30.6,302.9,30.6,392.5c-5.1,228.7-25.5,392.5-97.4,407.3
	c-46.4,9.7-92.3-148.9-82.1-288.1c20.4-581.3,117.8-690.3,92.3-754.8c-97.4-49.6-225.9,198.5-251.4,268.1
	c-92.3,243.5-122.9,486.6-143.8,814.6c-10.2,109,10.2,198.5,35.7,273.2c25.5-9.7,77,59.8,102.5,49.6L19885.1-1857L19885.1-1857z`}
          />
          <path
            fill={conditionToColor(this.props.teeth[65].condition)}
            onClick={() => {
              this.toggleSelectedNumber(65);
              this.props.onClick(65);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 65)
                ? (this.state.statusDoneTeeth.includes(65) ? "#369661" : "#DE2527")
                : this.checkImpacted(65) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(65) ? isMissing ? `M19599.3-1907.6c5.1-15.8,15.3-47.3,85.8-26.4
	c120.6,36.6,171.2-121.1,342.4-131.7c302,84,357.2,389.2,377.6,520.5c30.2,205-80.7,278.8-166.1,294.6
	c-171.2,10.7-276.9-58-312.2-131.7c-25.1,47.3-90.5,179.1-226.4,179.1c-130.8-26.4-312.2-162.8-286.7-252.4
	C19423.1-1655.2,19553.9-1781.4,19599.3-1907.6L19599.3-1907.6z` : '' : `M19599.3-1907.6c5.1-15.8,15.3-47.3,85.8-26.4
	c120.6,36.6,171.2-121.1,342.4-131.7c302,84,357.2,389.2,377.6,520.5c30.2,205-80.7,278.8-166.1,294.6
	c-171.2,10.7-276.9-58-312.2-131.7c-25.1,47.3-90.5,179.1-226.4,179.1c-130.8-26.4-312.2-162.8-286.7-252.4
	C19423.1-1655.2,19553.9-1781.4,19599.3-1907.6L19599.3-1907.6z`}
          />
          <path
            fill={conditionToColor(this.props.teeth[65].condition)}
            onClick={() => {
              this.toggleSelectedNumber(65);
              this.props.onClick(65);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 65)
                ? (this.state.statusDoneTeeth.includes(65) ? "#369661" : "#DE2527")
                : this.checkImpacted(65) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(65) ? isMissing ? `M19926.4-1381.5c25.1-84.4-5.1-184.1-75.6-257.9
	 M19931.5-1492.3c10.2-126.2,50.1-215.8,135.9-252.4`: '' : `M19926.4-1381.5c25.1-84.4-5.1-184.1-75.6-257.9
	 M19931.5-1492.3c10.2-126.2,50.1-215.8,135.9-252.4`}
          />
          {this.isShownRedGraphic("rootCanal", "", 65) && (
            <path
              fill={this.state.statusDoneTeeth.includes(65) ? "#369661" : "#DE2527"}
              d="M19896.6-3123.6c12.3,4.6-79.9,236.9-129.1,464.7c-6.1,4.6-6.1,9.1-6.1,13.7
	c-12.3,45.6-36.9,145.8-30.7,277.9c6.1,118.5,24.6,159.5,67.6,186.8c73.8,45.6,184.4,36.4,215.2,31.9c12.3,0,36.9-4.6,61.5-18.2
	c0,0,30.7-13.7,49.2-45.6c110.7-168.6,43-496.6,43-496.6c-30.7-145.8-67.6-241.5-55.3-241.5c6.1,0,55.3,95.7,92.2,186.8
	c12.3,41,43,186.8,24.6,391.8c-6.1,63.8-18.4,141.2-43,236.9c-6.1,95.7-49.2,132.1-79.9,145.8c-43,22.8-79.9,4.6-221.3,13.7
	c-129.1,4.6-153.7,22.8-196.7,9.1c-30.7-9.1-86.1-45.6-86.1-177.7c0-159.5,12.3-400.9,129.1-678.8
	C19798.2-2991.5,19884.3-3128.2,19896.6-3123.6L19896.6-3123.6z"
            />
          )}
          {this.isShownRedGraphic("rootCanal", "Post and Core", 65) && (
            <path
              id="ehXMLID_4_"
              fill={this.state.statusDoneTeeth.includes(65) ? "#369661" : "#DE2527"}
              d="M20135-2066.4c44.3,41.6-12.8,77.1,26.9,192.4c26.9,78.2,69.5,110.6,44.7,130.2
	c-33.5,26.1-120.4-23.1-267-20.6c-182.5,2.8-282.3,82.6-324.9,56.1c-31-19,22.3-60,31-156.9c9.5-102.4-43.5-126.3-13.2-168.7
	C19697.6-2126.6,20046.9-2148.4,20135-2066.4z"
            />
          )}
          {this.isShownRedGraphic("whitening", "", 65) && (
            <polygon
              fill={this.state.statusDoneTeeth.includes(65) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(65) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              points="20195.4,-1528.9 20277.3,-1593.1 20278.5,-1489.1 
	20364.8,-1431.1 20266.3,-1397.8 20237.8,-1297.7 20175.7,-1381.2 20071.7,-1377.3 20131.9,-1462.2 20096.1,-1559.9 "
            />
          )}
          {this.isShownRedGraphic("implantation", "", 65) && (
            <path
              fill={this.state.statusDoneTeeth.includes(65) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(65) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M19407.5-1995.7c0-74.8,40.3-135.6,90-135.6h304.5v-62.1h-153.6
	c-31.4,0-57.1-38.3-57.1-86c0-47.3,25.4-86,57.1-86h153.6v-61.7h-104.6c-31.4,0-57.1-38.3-57.1-86c0-47.3,25.4-86,57.1-86h104.6
	v-61.7h-55.6c-31.4,0-57.1-38.3-57.1-86c0-47.3,25.4-86,57.1-86h55.6v-61.7h-6.6c-31.4,0-57.1-38.3-57.1-86c0-47.3,25.4-86,57.1-86
	h233.7c31.4,0,57.1,38.3,57.1,86c0,47.3-25.4,86-57.1,86h-6.6v61.7h55.6c31.4,0,57.1,38.3,57.1,86c0,47.3-25.4,86-57.1,86h-55.6
	v61.7h104.6c31.4,0,57.1,38.3,57.1,86c0,47.3-25.4,86-57.1,86h-104.6v61.7h153.6c31.4,0,57.1,38.3,57.1,86c0,47.3-25.4,86-57.1,86
	h-153.6v61.7h304.5c49.6,0,90,60.8,90,135.6c0,74.8-40.3,135.6-90,135.6h-829.6C19447.8-1860.5,19407.8-1920.9,19407.5-1995.7z"
            />
          )}
          {this.isShownRedGraphic("diagnosis", "", 65) && (
            <g>
              <g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)">
                <path
                  fill={this.state.statusDoneTeeth.includes(65) ? "#369661" : "#DE2527"}
                  d="M197659.7,19289.4c-119.8-200.5-143-469.7-57.3-672.7c8.8-20.2,15-38.5,14.5-40.9s-83.5-61.5-184-130.7
			l-183-125.9l-19.3,29.3c-36.4,55.1-8.4,69.2-425.1-216.4c-203.3-139.8-374.5-260.6-381.1-269.3c-7.9-9-12.3-21.3-12.2-32
			c0.4-20.3,130.9-239.2,152.1-254.4c10.8-8,18.8-9.7,31.9-6.8c9.5,2.4,184.5,118.6,389.1,259.4c426.1,293,397,265.9,357.6,334.8
			l-22.5,39.5l184.4,126.8l183.7,126.3l33.7-40c97.5-117.3,220.5-191,372.5-223.6c261.9-56.2,524,47.1,693,271.7
			c157.6,210.1,197.2,486.5,104.7,732.5c-20.4,54.8-80.1,157.1-116.7,200.2c-80.8,95.5-183.6,168.6-292.2,206.3
			C198175.9,19711.3,197834.2,19581,197659.7,19289.4z M198474.3,19436.8c197-92,320.6-298.8,316.6-528.6c-1-71-27.9-185.6-57.5-246
			c-92.5-190-273.5-314.5-474.5-327.4c-70.6-4.4-189.7,20.5-255.8,54.2c-52.1,26.3-118.7,77.1-155.3,117.1
			c-33.2,36.7-85.8,121.7-105.6,171.4c-23.4,57.3-40.3,142.2-41.9,210c-1.8,77.9,25.8,203.7,58.6,270.4
			c93.7,189.8,273.2,313.2,475.4,326C198294.8,19487.9,198416.5,19464.3,198474.3,19436.8z"
                />
                <path
                  fill={this.state.statusDoneTeeth.includes(65) ? "#369661" : "#DE2527"}
                  d="M198655.5,19181.8c32.5-56.7,48.5-98.6,60.7-158.6c41.1-205.4-45.2-418.8-215.9-534.7
			c-83.7-57-141.6-74.3-145.8-43.7c-2,15.6,7.8,25.4,42.1,38.2c48.6,18.6,127.5,75.4,165.3,118.3c17.6,20.8,43.9,57.4,58.7,82
			c23.8,41.5,27.3,52.1,45.1,135.3c17.7,82.6,19.2,94.8,14.3,141.9c-6.5,69.5-25.5,128.4-60.5,190.1c-29.4,51.7-32.2,63.6-16.8,74.2
			C198618.8,19235.6,198629.9,19226.3,198655.5,19181.8z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("hygiene", "", 65) && (
            <g>
              <g>
                <path
                  fill={this.state.statusDoneTeeth.includes(65) ? "#369661" : "#DE2527"}
                  d="M19535.3-1299.5l45.1-2.5c1.2-0.1,2.3-0.6,3.2-1.5c0.8-0.9,1.3-2.1,1.3-3.3l0.8-162.6c0-2.5-2-4.4-4.5-4.3
			l-4.5,0.2l0.2-31.6c0-1.2-0.5-2.3-1.3-3.1c-0.8-0.8-2-1.2-3.2-1.1l-9.5,0.5l0.3-62.5l-29.3-27.8c-1.8-1.7-4.6-1.5-6.4,0.4
			c-1.8,1.9-1.8,4.7,0,6.4l26.6,25.3l-0.3,58.8l-8.5,0.5c-2.5,0.1-4.5,2.3-4.5,4.8l-0.1,31.6l-4.5,0.2c-2.4,0.1-4.5,2.4-4.5,4.8
			l-0.8,162.6C19530.8-1301.3,19532.8-1299.4,19535.3-1299.5z M19567.7-1472.9l-18,1l0.1-27.1l18-1L19567.7-1472.9z M19539.9-1308.8
			l0.7-153.6l4.5-0.2c0,0,0,0,0,0l27.1-1.5v0l4.5-0.2l-0.7,153.6L19539.9-1308.8z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("orthodontics", "", 65) && (
            <rect
              x="19480.2"
              y="-1734.8"
              fill={this.state.statusDoneTeeth.includes(65) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(65) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="895.7"
              height="113.9"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 65) && (
            <rect
              x="19747.7"
              y="-1780.3"
              fill={this.state.statusDoneTeeth.includes(65) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(65) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="351.6"
              height="232"
            />
          )}
          {this.isShownRedGraphic("surgery", "", 65) && (
            <path
              fill={this.state.statusDoneTeeth.includes(65) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(65) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M20014-3330.3h151.7V210.3H20014V-3330.3z M19710,210.3h159.8
	v-3548.4H19710V210.3z"
            />
          )}

          <path
            fill="#D0C9A3"
            onClick={() => {
              this.toggleSelectedNumber(64);
              this.props.onClick(64);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 64)
                ? (this.state.statusDoneTeeth.includes(64) ? "#369661" : "#DE2527")
                : this.checkImpacted(64) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="22.926"
            d={this.checkMissing(64) ? isMissing ? `M18721.8-2208.3l360-52.4l39.9-341.9
	c-79.8-161.4-79.8-313.6-85.8-465.8c0-42.7-17.2-152.2-91.4-156.8c-34.3,0-85.8,23.7-103,71.4c-45.5,147.5-137.3,341.9-177.2,375.3
	l-68.7,256.5L18721.8-2208.3z` : "" : `M18721.8-2208.3l360-52.4l39.9-341.9
	c-79.8-161.4-79.8-313.6-85.8-465.8c0-42.7-17.2-152.2-91.4-156.8c-34.3,0-85.8,23.7-103,71.4c-45.5,147.5-137.3,341.9-177.2,375.3
	l-68.7,256.5L18721.8-2208.3z`}
          />
          <path
            fill="#F2ECBE"
            onClick={() => {
              this.toggleSelectedNumber(64);
              this.props.onClick(64);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 64)
                ? (this.state.statusDoneTeeth.includes(64) ? "#369661" : "#DE2527")
                : this.checkImpacted(64) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="22.926"
            d={this.checkMissing(64) ? isMissing ? `M18847.5-1942l399.9,118.8l5.6-228.2
	c45.5-152.2,108.6-266.3,131.3-451.4c79.8-261.2-74.2-774.7-199.9-574.8c-5.6,4.6,0,19,0,28.3c0,80.7-11.6,142.4,0,218.5
	c11.6,80.7-5.6,123.4-57.1,228.2c-17.2,33.4-28.8,66.3-45.5,123.4c-91.4,166.1-177.2,256.5-257,199.5l-28.8-204.1
	c-17.2-95.1-17.2-80.7-68.7-166.1c-39.9-61.7-62.6-128.5-68.7-199.5l34.3-218.5c-11.6-52.4-22.7-99.7-79.8-109.5
	c-91.4,23.7-148.4,99.7-171.2,147.5c-45.5,152.2-68.7,261.2-57.1,418c11.6,99.7,34.3,190.2,68.7,275.6
	c51.5,128.5,51.5,114.1,45.5,256.5v223.1l120.1,9.7L18847.5-1942L18847.5-1942z` : "" : `M18847.5-1942l399.9,118.8l5.6-228.2
	c45.5-152.2,108.6-266.3,131.3-451.4c79.8-261.2-74.2-774.7-199.9-574.8c-5.6,4.6,0,19,0,28.3c0,80.7-11.6,142.4,0,218.5
	c11.6,80.7-5.6,123.4-57.1,228.2c-17.2,33.4-28.8,66.3-45.5,123.4c-91.4,166.1-177.2,256.5-257,199.5l-28.8-204.1
	c-17.2-95.1-17.2-80.7-68.7-166.1c-39.9-61.7-62.6-128.5-68.7-199.5l34.3-218.5c-11.6-52.4-22.7-99.7-79.8-109.5
	c-91.4,23.7-148.4,99.7-171.2,147.5c-45.5,152.2-68.7,261.2-57.1,418c11.6,99.7,34.3,190.2,68.7,275.6
	c51.5,128.5,51.5,114.1,45.5,256.5v223.1l120.1,9.7L18847.5-1942L18847.5-1942z`}
          />
          <path
            fill={conditionToColor(this.props.teeth[64].condition)}
            onClick={() => {
              this.toggleSelectedNumber(64);
              this.props.onClick(64);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 64)
                ? (this.state.statusDoneTeeth.includes(64) ? "#369661" : "#DE2527")
                : this.checkImpacted(64) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(64) ? isMissing ? `M18492.1-1847.4
	c19.9-43.6,120.1-34.8,140.1-43.6c39.9-13,70-26.4,135-65.4c34.8-21.8,75.2-21.8,115-21.8c30.2,0,54.7,26.4,84.9,34.8l210.1,65.4
	c34.8,17.6,64.9,34.8,84.9,74.2l39.9,96l14.8,34.8c25.1,34.8,39.9,91.9,45,135.5c10.2,43.6,10.2,65.4-5.1,109.5
	c-14.8,48.2-34.8,87.2-54.7,126.6c-25.1,48.2-79.8,74.2-109.9,78.9c-59.8,4.2-99.7-4.2-164.7-26.4l-84.9-30.6
	c-45,48.2-54.7,61.2-79.8,78.9c-95.1,70-160,21.8-214.8-48.2h-144.7c-19.9-4.2-50.1-26.4-79.8-61.2c-59.8-61.2-59.8-70-64.9-148.4
	c0-70,10.2-70,50.1-131.3c45-70,50.1-65.4,59.8-148.4l5.1-61.2L18492.1-1847.4L18492.1-1847.4L18492.1-1847.4z` : '' : `M18492.1-1847.4
	c19.9-43.6,120.1-34.8,140.1-43.6c39.9-13,70-26.4,135-65.4c34.8-21.8,75.2-21.8,115-21.8c30.2,0,54.7,26.4,84.9,34.8l210.1,65.4
	c34.8,17.6,64.9,34.8,84.9,74.2l39.9,96l14.8,34.8c25.1,34.8,39.9,91.9,45,135.5c10.2,43.6,10.2,65.4-5.1,109.5
	c-14.8,48.2-34.8,87.2-54.7,126.6c-25.1,48.2-79.8,74.2-109.9,78.9c-59.8,4.2-99.7-4.2-164.7-26.4l-84.9-30.6
	c-45,48.2-54.7,61.2-79.8,78.9c-95.1,70-160,21.8-214.8-48.2h-144.7c-19.9-4.2-50.1-26.4-79.8-61.2c-59.8-61.2-59.8-70-64.9-148.4
	c0-70,10.2-70,50.1-131.3c45-70,50.1-65.4,59.8-148.4l5.1-61.2L18492.1-1847.4L18492.1-1847.4L18492.1-1847.4z`}
          />
          <path
            fill={conditionToColor(this.props.teeth[64].condition)}
            onClick={() => {
              this.toggleSelectedNumber(64);
              this.props.onClick(64);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 64)
                ? (this.state.statusDoneTeeth.includes(64) ? "#369661" : "#DE2527")
                : this.checkImpacted(64) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(64) ? isMissing ? `M18771.9-1576.5c54.7,48.2,160,179.1,45,257.9
	c-14.8,13-34.8,17.6-45,21.8l-124.8,48.2`: '' : `M18771.9-1576.5c54.7,48.2,160,179.1,45,257.9
	c-14.8,13-34.8,17.6-45,21.8l-124.8,48.2`}
          />
          <path
            fill={conditionToColor(this.props.teeth[64].condition)}
            onClick={() => {
              this.toggleSelectedNumber(64);
              this.props.onClick(64);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 64)
                ? (this.state.statusDoneTeeth.includes(64) ? "#369661" : "#DE2527")
                : this.checkImpacted(64) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(64) ? isMissing ? `M18996.8-1681.3
	c-64.9,39.4-90,100.7-120.1,153.1c-39.9,70,10.2,187.9,64.9,244.9`: '' : `M18996.8-1681.3
	c-64.9,39.4-90,100.7-120.1,153.1c-39.9,70,10.2,187.9,64.9,244.9`}
          />
          {this.isShownRedGraphic("whitening", "", 64) && (
            <polygon
              fill={this.state.statusDoneTeeth.includes(64) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(64) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              points="19144.8,-1484 19226.7,-1548.3 19227.9,-1444.2 
	19314.2,-1386.3 19215.7,-1353 19187.2,-1252.9 19125.1,-1336.3 19021.1,-1332.5 19081.3,-1417.4 19045.5,-1515 "
            />
          )}
          {this.isShownRedGraphic("implantation", "", 64) && (
            <path
              fill={this.state.statusDoneTeeth.includes(64) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(64) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M18383.5-1928.4c0-74.8,40.3-135.6,90-135.6h304.5v-62.1h-153.6
	c-31.4,0-57.1-38.3-57.1-86c0-47.3,25.4-86,57.1-86h153.6v-61.7h-104.6c-31.4,0-57.1-38.3-57.1-86c0-47.3,25.4-86,57.1-86h104.6
	v-61.7h-55.6c-31.4,0-57.1-38.3-57.1-86c0-47.3,25.4-86,57.1-86h55.6v-61.7h-6.6c-31.4,0-57.1-38.3-57.1-86c0-47.3,25.4-86,57.1-86
	h233.7c31.4,0,57.1,38.3,57.1,86c0,47.3-25.4,86-57.1,86h-6.6v61.7h55.6c31.4,0,57.1,38.3,57.1,86c0,47.3-25.4,86-57.1,86h-55.6
	v61.7h104.6c31.4,0,57.1,38.3,57.1,86c0,47.3-25.4,86-57.1,86h-104.6v61.7h153.6c31.4,0,57.1,38.3,57.1,86c0,47.3-25.4,86-57.1,86
	h-153.6v61.7h304.5c49.6,0,90,60.8,90,135.6c0,74.8-40.3,135.6-90,135.6h-829.6C18423.8-1793.3,18383.8-1853.6,18383.5-1928.4z"
            />
          )}
          {this.isShownRedGraphic("rootCanal", "Post and Core", 64) && (
            <path
              id="ehXMLID_1_"
              fill={this.state.statusDoneTeeth.includes(64) ? "#369661" : "#DE2527"}
              d="M19104.3-1986.2c25.8,43.9-19.4,68.7-11.3,174.8c7.4,100.4,53,142.8,26.5,162.5
	c-36.4,27.4-121.6-55.3-277.4-58.2c-125.1-2.6-199.3,48.5-227.9,21.4c-21.2-20.2,15.2-53.9,38.2-134.9
	c33.9-119.5-14.8-156.2,23-199.3C18750.6-2104.8,19048.9-2082.3,19104.3-1986.2z"
            />
          )}
          {this.isShownRedGraphic("rootCanal", "", 64) && (
            <path
              fill={this.state.statusDoneTeeth.includes(64) ? "#369661" : "#DE2527"}
              d="M18561-2650.8c6.1,30,6.1,25,12.3,75.1c30.7,180.3,24.6,230.3,55.3,320.5c36.9,100.1,73.8,130.2,92.2,140.2
	c55.3,30,110.7,35.1,129.1,35.1c24.6,0,79.9,5,135.3-20c36.9-15,55.3-35.1,73.8-55.1c73.8-80.1,79.9-180.3,104.5-265.4
	c49.2-155.2,55.3-140.2,79.9-225.3c61.5-240.4,6.1-430.6,24.6-430.6c12.3,0,49.2,85.1,67.6,200.3c55.3,330.5-92.2,630.9-135.3,801.2
	c0,0-6.1,5-6.1,15c-6.1,10-30.7,80.1-98.4,100.1c-43,15-61.5-10-153.7-15c-92.2-5-129.1,20-202.9,0c0,0-36.9-10-67.6-35.1
	c-123-85.1-325.9-505.8-166-996.5c24.6-85.1,43-100.1,49.2-100.1C18573.3-3101.5,18518-2896.2,18561-2650.8z"
            />
          )}
          {this.isShownRedGraphic("diagnosis", "", 64) && (
            <g>
              <g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)">
                <path
                  fill={this.state.statusDoneTeeth.includes(64) ? "#369661" : "#DE2527"}
                  d="M186958.6,19402.4c-119.8-200.5-143-469.7-57.3-672.7c8.8-20.2,15-38.5,14.5-40.9s-83.5-61.5-184-130.7
			l-183-125.9l-19.3,29.3c-36.4,55.1-8.4,69.2-425.1-216.4c-203.3-139.8-374.5-260.6-381.1-269.3c-7.9-9-12.3-21.3-12.2-32
			c0.4-20.2,130.9-239.2,152.1-254.4c10.8-8,18.8-9.7,31.9-6.8c9.5,2.4,184.5,118.6,389.1,259.4c426.1,293,397,265.9,357.6,334.8
			l-22.5,39.5l184.4,126.8l183.7,126.3l33.7-40c97.5-117.3,220.5-191,372.5-223.6c261.9-56.2,524,47.1,693.1,271.7
			c157.6,210.1,197.2,486.5,104.7,732.5c-20.4,54.8-80,157.1-116.7,200.2c-80.8,95.5-183.6,168.6-292.2,206.3
			C187474.8,19824.2,187133.1,19694,186958.6,19402.4z M187773.2,19549.8c197-92,320.6-298.8,316.6-528.6c-1-71-27.9-185.6-57.5-246
			c-92.6-190-273.5-314.5-474.5-327.4c-70.6-4.4-189.7,20.5-255.7,54.2c-52.1,26.3-118.7,77.1-155.3,117.1
			c-33.2,36.7-85.8,121.7-105.6,171.4c-23.4,57.3-40.4,142.2-41.9,210c-1.8,77.9,25.8,203.7,58.6,270.4
			c93.7,189.8,273.2,313.2,475.4,326C187593.6,19600.9,187715.4,19577.3,187773.2,19549.8z"
                />
                <path
                  fill={this.state.statusDoneTeeth.includes(64) ? "#369661" : "#DE2527"}
                  d="M187954.4,19294.7c32.5-56.7,48.5-98.6,60.7-158.6c41.1-205.4-45.2-418.8-215.9-534.7
			c-83.7-57-141.6-74.2-145.8-43.7c-2,15.6,7.8,25.4,42.1,38.2c48.6,18.6,127.5,75.4,165.3,118.3c17.6,20.8,43.9,57.4,58.7,82
			c23.8,41.5,27.3,52.1,45.1,135.3c17.7,82.6,19.1,94.8,14.3,141.9c-6.5,69.5-25.5,128.4-60.5,190.1c-29.4,51.7-32.2,63.6-16.9,74.2
			C187917.7,19348.6,187928.8,19339.3,187954.4,19294.7z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("hygiene", "", 64) && (
            <g>
              <g>
                <path
                  fill={this.state.statusDoneTeeth.includes(64) ? "#369661" : "#DE2527"}
                  d="M18500.3-1291.2l42.6-4.9c1.1-0.1,2.2-0.7,3.1-1.6s1.4-2,1.4-3.2l9.9-154.1c0.2-2.4-1.6-4.1-4-3.8
			l-4.3,0.5l1.9-30c0.1-1.1-0.3-2.2-1.1-2.9c-0.8-0.7-1.8-1-2.9-0.9l-9,1l3.8-59.3l-26-24.7c-1.6-1.5-4.3-1.2-6,0.7
			s-1.9,4.6-0.4,6.1l23.7,22.5l-3.6,55.7l-8.1,0.9c-2.4,0.3-4.4,2.4-4.5,4.8l-1.9,30l-4.3,0.5c-2.3,0.3-4.4,2.5-4.5,4.8l-9.9,154.2
			C18496.1-1292.6,18497.9-1290.9,18500.3-1291.2z M18540.6-1457.3l-17,2l1.7-25.7l17.1-2L18540.6-1457.3z M18505.1-1300.2
			l9.4-145.6l4.3-0.5c0,0,0,0,0,0l25.6-2.9v0l4.3-0.5l-9.4,145.6L18505.1-1300.2z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("orthodontics", "", 64) && (
            <rect
              x="18687.9"
              y="-1758.9"
              fill={this.state.statusDoneTeeth.includes(64) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(64) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="351.6"
              height="232"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 64) && (
            <rect
              x="18455.2"
              y="-1724.4"
              fill={this.state.statusDoneTeeth.includes(64) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(64) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="874.6"
              height="113.9"
            />
          )}
          {this.isShownRedGraphic("surgery", "", 64) && (
            <path
              fill={this.state.statusDoneTeeth.includes(64) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(64) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M18955.3-3306.7h151.7V233.9h-151.7V-3306.7z M18651.3,233.9h159.8
	v-3548.4h-159.8V233.9z"
            />
          )}

          <path
            fill="#F2ECBE"
            onClick={() => {
              this.toggleSelectedNumber(63);
              this.props.onClick(63);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 63)
                ? (this.state.statusDoneTeeth.includes(63) ? "#369661" : "#DE2527")
                : this.checkImpacted(63) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(63) ? isMissing ? `M17845.5-1832.1l142.9,47.3l149.8-43.6
	c52.4-123.9,52.4-189.3,48.7-342.4c0-113.2-87.2-357.2-73.3-459.3c-7-193,20.9-328,13.9-506.6c0-123.9-104.8-105.8-149.8-7.4
	C17828.4-2812.3,17835.3-2185.6,17845.5-1832.1L17845.5-1832.1z` : "" : `M17845.5-1832.1l142.9,47.3l149.8-43.6
	c52.4-123.9,52.4-189.3,48.7-342.4c0-113.2-87.2-357.2-73.3-459.3c-7-193,20.9-328,13.9-506.6c0-123.9-104.8-105.8-149.8-7.4
	C17828.4-2812.3,17835.3-2185.6,17845.5-1832.1L17845.5-1832.1z`}
          />
          <path
            fill={conditionToColor(this.props.teeth[63].condition)}
            onClick={() => {
              this.toggleSelectedNumber(63);
              this.props.onClick(63);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 63)
                ? (this.state.statusDoneTeeth.includes(63) ? "#369661" : "#DE2527")
                : this.checkImpacted(63) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(63) ? isMissing ? `M17843.7-1870.6
	c-18.6,89.1-14.8,129.9-48.2,200.9c-174.9,241.7-129.9,341.9,103.9,482.9c33.4,18.6,55.7,44.5,111.3,37.1
	c59.4-18.6,96.5-74.2,96.5-74.2c7.4-3.7,7.4,26,29.7,26c137.3-33.4,219.4-200.9,171.2-371.6c-52-96.5-133.6-289.9-141-304.8
	c-14.8-40.8-89.1-74.2-152.6-74.2c-55.7-3.7-96.5,11.1-137.3,33.4C17862.2-1907.7,17851.1-1889.2,17843.7-1870.6L17843.7-1870.6
	L17843.7-1870.6z`: '' : `M17843.7-1870.6
	c-18.6,89.1-14.8,129.9-48.2,200.9c-174.9,241.7-129.9,341.9,103.9,482.9c33.4,18.6,55.7,44.5,111.3,37.1
	c59.4-18.6,96.5-74.2,96.5-74.2c7.4-3.7,7.4,26,29.7,26c137.3-33.4,219.4-200.9,171.2-371.6c-52-96.5-133.6-289.9-141-304.8
	c-14.8-40.8-89.1-74.2-152.6-74.2c-55.7-3.7-96.5,11.1-137.3,33.4C17862.2-1907.7,17851.1-1889.2,17843.7-1870.6L17843.7-1870.6
	L17843.7-1870.6z`}
          />
          <path
            fill={conditionToColor(this.props.teeth[63].condition)}
            onClick={() => {
              this.toggleSelectedNumber(63);
              this.props.onClick(63);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 63)
                ? (this.state.statusDoneTeeth.includes(63) ? "#369661" : "#DE2527")
                : this.checkImpacted(63) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(63) ? isMissing ? `M18097-1321.8c-38.5-108.1-9.7-197.6,96-284.8` : '' : `M18097-1321.8c-38.5-108.1-9.7-197.6,96-284.8`}
          />
          {this.isShownRedGraphic("hygiene", "", 63) && (
            <g>
              <g>
                <path
                  fill={this.state.statusDoneTeeth.includes(63) ? "#369661" : "#DE2527"}
                  d="M17941.9-1196.2l32.5-30c0.9-0.8,1.3-1.9,1.3-3c0-1.1-0.5-2.2-1.4-3l-117.7-107.4c-1.8-1.6-4.7-1.6-6.5,0
			l-3.3,3l-22.9-20.9c-0.9-0.8-2-1.2-3.3-1.2c-1.2,0-2.4,0.5-3.3,1.2l-6.8,6.3l-45.3-41.3l-42.5,0.1c-2.5,0-4.6,1.9-4.6,4.2
			c0,2.3,2.1,4.2,4.6,4.2l38.7-0.1l42.6,38.8l-6.2,5.7c-1.8,1.7-1.8,4.3,0,6l22.9,20.9l-3.3,3c-1.7,1.6-1.7,4.4,0,6l117.7,107.4
			C17937.2-1194.5,17940.1-1194.5,17941.9-1196.2z M17840.4-1330.5l-13,12l-19.6-17.9l13-12L17840.4-1330.5z M17938.6-1205.1
			l-111.2-101.4l3.2-3c0,0,0,0,0,0l19.5-18v0l3.3-3l111.2,101.4L17938.6-1205.1z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("diagnosis", "", 63) && (
            <g>
              <g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)">
                <path
                  fill={this.state.statusDoneTeeth.includes(63) ? "#369661" : "#DE2527"}
                  d="M181321.5,18906.1c-119.8-200.5-143-469.7-57.3-672.7c8.8-20.2,15-38.5,14.5-40.9s-83.5-61.5-184-130.7
			l-183-125.9l-19.3,29.3c-36.4,55.1-8.4,69.2-425.1-216.4c-203.3-139.8-374.5-260.6-381.1-269.3c-7.9-9-12.3-21.3-12.2-32
			c0.4-20.3,130.9-239.2,152.1-254.4c10.8-8,18.8-9.7,31.9-6.8c9.5,2.4,184.4,118.6,389.1,259.4c426.1,293,397,265.9,357.6,334.8
			l-22.5,39.5l184.4,126.8l183.7,126.3l33.7-40c97.5-117.3,220.5-191,372.5-223.6c261.9-56.2,524,47.1,693.1,271.7
			c157.6,210.1,197.2,486.5,104.7,732.5c-20.4,54.8-80,157.1-116.7,200.2c-80.8,95.5-183.6,168.6-292.2,206.3
			C181837.7,19327.9,181496,19197.7,181321.5,18906.1z M182136.1,19053.5c197-92,320.6-298.8,316.6-528.6c-1-71-27.9-185.6-57.5-246
			c-92.6-190-273.5-314.5-474.5-327.4c-70.6-4.4-189.7,20.5-255.7,54.2c-52.1,26.3-118.7,77.1-155.3,117.1
			c-33.2,36.7-85.8,121.7-105.6,171.4c-23.4,57.3-40.4,142.2-41.9,210c-1.8,77.9,25.8,203.7,58.6,270.4
			c93.7,189.8,273.2,313.2,475.4,326C181956.5,19104.6,182078.3,19081,182136.1,19053.5z"
                />
                <path
                  fill={this.state.statusDoneTeeth.includes(63) ? "#369661" : "#DE2527"}
                  d="M182317.3,18798.4c32.5-56.7,48.5-98.6,60.7-158.6c41.1-205.4-45.2-418.8-215.9-534.7
			c-83.7-57-141.6-74.3-145.8-43.7c-2,15.6,7.8,25.4,42.1,38.2c48.6,18.6,127.5,75.4,165.3,118.3c17.6,20.8,43.9,57.4,58.7,82
			c23.8,41.5,27.3,52.1,45.1,135.3c17.7,82.6,19.2,94.8,14.4,141.9c-6.5,69.5-25.5,128.4-60.5,190.1c-29.4,51.7-32.2,63.6-16.9,74.2
			C182280.6,18852.3,182291.7,18843,182317.3,18798.4z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("whitening", "", 63) && (
            <polygon
              fill={this.state.statusDoneTeeth.includes(63) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(63) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              points="18159.1,-1502.4 18196.2,-1473.6 18195.1,-1426.6 
	18232.2,-1453 18275.5,-1436 18261.3,-1481.2 18289.2,-1517.7 18243.3,-1519.1 18217.3,-1558.7 18203.1,-1514.4 "
            />
          )}
          {this.isShownRedGraphic("rootCanal", "Post and Core", 63) && (
            <path
              id="egXMLID_6_"
              fill={this.state.statusDoneTeeth.includes(63) ? "#369661" : "#DE2527"}
              d="M17940-2130.8c15.9,139.6,0.6,246.9-15.9,318c-23.2,99.3-64,195.4-32.8,213.9
	c20.4,12.2,47-24.4,111-27.1c76.4-2.7,115.5,47.8,137.6,32.9c28.9-19.1-21.5-114.1-48.7-217.7c-19.8-75.9-33.4-182.1-9.6-319.1
	C18034.6-2129.8,17987-2130.3,17940-2130.8L17940-2130.8z"
            />
          )}
          {this.isShownRedGraphic("rootCanal", "", 63) && (
            <path
              fill={this.state.statusDoneTeeth.includes(63) ? "#369661" : "#DE2527"}
              d="M18063.6-3168.7c0,0-5.5,5-5.5,20.1c0,0-5.5,20.1-5.5,35.2c-38.2,236.6-49.2,755.1-49.2,755.1
	c0,60.4-5.5,151-10.9,266.8c-5.5,15.1-32.8,50.3-27.3,100.7c5.5,30.2,27.3,65.4,38.2,60.4c5.5,0,5.5-5,16.4-20.1
	c10.9-20.1,21.9-25.2,27.3-30.2c21.9-25.2-5.5-90.6-5.5-100.7c-10.9-20.1-10.9-110.7-10.9-281.9c0-45.3,0-110.7,10.9-317.1
	C18052.6-2982.4,18069-3168.7,18063.6-3168.7L18063.6-3168.7z"
            />
          )}
          {this.isShownRedGraphic("implantation", "", 63) && (
            <path
              fill={this.state.statusDoneTeeth.includes(63) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(63) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M17667.4-2054.3c0-90.1,26-163.4,58-163.4h196.4v-74.9h-99.1
	c-20.2,0-36.8-46.2-36.8-103.7c0-57,16.4-103.7,36.8-103.7h99.1v-74.4h-67.5c-20.2,0-36.8-46.2-36.8-103.7
	c0-57,16.4-103.7,36.8-103.7h67.5v-74.4h-35.9c-20.2,0-36.8-46.2-36.8-103.7c0-57,16.4-103.7,36.8-103.7h35.9v-74.4h-4.2
	c-20.2,0-36.8-46.2-36.8-103.7c0-57,16.4-103.7,36.8-103.7h150.7c20.2,0,36.8,46.2,36.8,103.7c0,57-16.4,103.7-36.8,103.7h-4.2v74.4
	h35.9c20.2,0,36.8,46.2,36.8,103.7c0,57-16.4,103.7-36.8,103.7h-35.9v74.4h67.5c20.2,0,36.8,46.2,36.8,103.7
	c0,57-16.4,103.7-36.8,103.7h-67.5v74.4h99.1c20.2,0,36.8,46.2,36.8,103.7c0,57-16.4,103.7-36.8,103.7h-99.1v74.4h196.4
	c32,0,58,73.3,58,163.4c0,90.1-26,163.4-58,163.4h-535.1C17693.4-1891.4,17667.6-1964.1,17667.4-2054.3z"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 63) && (
            <rect
              x="17795.5"
              y="-1721.1"
              fill={this.state.statusDoneTeeth.includes(63) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(63) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="464.8"
              height="113.9"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 63) && (
            <rect
              x="17904.8"
              y="-1750.1"
              fill={this.state.statusDoneTeeth.includes(63) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(63) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="229.1"
              height="174.2"
            />
          )}
          {this.isShownRedGraphic("surgery", "", 63) && (
            <path
              fill={this.state.statusDoneTeeth.includes(63) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(63) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M18017.9-3387.3h151.7V153.3h-151.7V-3387.3z M17753.9,153.3h159.8
	v-3548.4h-159.8V153.3z"
            />
          )}


          <path
            fill="#F2ECBE"
            onClick={() => {
              this.toggleSelectedNumber(62);
              this.props.onClick(62);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 62)
                ? (this.state.statusDoneTeeth.includes(62) ? "#369661" : "#DE2527")
                : this.checkImpacted(62) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(62) ? isMissing ? `M17350.7-1643.1l-217.6-84.9
	c-19.5-3.7-29.2-38.5-33.9-58c-43.6-119.7,130.8-444,149.8-687c9.7-92.8,24.1-196.7,67.7-274.2c87.2-212.5,207.8-169.8,217.6-54.3
	c0,26.9-9.7,61.7-9.7,84.9c-33.9,374.4,72.4,779.8,14.4,899.5c-14.4,31.1-24.1,65.4-38.5,84.9L17350.7-1643.1z` : "" : `M17350.7-1643.1l-217.6-84.9
	c-19.5-3.7-29.2-38.5-33.9-58c-43.6-119.7,130.8-444,149.8-687c9.7-92.8,24.1-196.7,67.7-274.2c87.2-212.5,207.8-169.8,217.6-54.3
	c0,26.9-9.7,61.7-9.7,84.9c-33.9,374.4,72.4,779.8,14.4,899.5c-14.4,31.1-24.1,65.4-38.5,84.9L17350.7-1643.1z`}
          />
          <path
            fill={conditionToColor(this.props.teeth[62].condition)}
            onClick={() => {
              this.toggleSelectedNumber(62);
              this.props.onClick(62);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 62)
                ? (this.state.statusDoneTeeth.includes(62) ? "#369661" : "#DE2527")
                : this.checkImpacted(62) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(62) ? isMissing ? `M16877.5-1265.5c-10.2,97.4,71,97.4,157.3,93.2
	c45.5,24.1,81.2,32.5,162.4,36.6c50.6-4.2,157.3-4.2,182.3-44.5c30.6,28.3,106.7,12.1,126.6-4.2c172.6-89.1,136.9-360.9,35.7-551.6
	c-10.2-12.1-45.5-89.1-65.9-93.2c-121.5-36.6-207.8-40.4-344.7,0c-15.3,4.2-35.7,28.3-40.4,48.7
	C17019.5-1569.8,16963.8-1500.7,16877.5-1265.5z` : '' : `M16877.5-1265.5c-10.2,97.4,71,97.4,157.3,93.2
	c45.5,24.1,81.2,32.5,162.4,36.6c50.6-4.2,157.3-4.2,182.3-44.5c30.6,28.3,106.7,12.1,126.6-4.2c172.6-89.1,136.9-360.9,35.7-551.6
	c-10.2-12.1-45.5-89.1-65.9-93.2c-121.5-36.6-207.8-40.4-344.7,0c-15.3,4.2-35.7,28.3-40.4,48.7
	C17019.5-1569.8,16963.8-1500.7,16877.5-1265.5z`}
          />
          {this.isShownRedGraphic("hygiene", "", 62) && (
            <g>
              <g>
                <path
                  fill={this.state.statusDoneTeeth.includes(62) ? "#369661" : "#DE2527"}
                  d="M17189.4-1165.7l28.5-33.9c0.8-0.9,1.1-2,1-3.1c-0.1-1.1-0.8-2.1-1.7-2.8l-130.4-91.6
			c-2-1.4-4.9-1-6.5,0.8l-2.8,3.4l-25.4-17.8c-1-0.7-2.2-1-3.4-0.8c-1.2,0.2-2.3,0.8-3.1,1.7l-6,7.1l-50.1-35.2l-42.2,5.5
			c-2.5,0.3-4.3,2.5-4,4.8s2.6,3.9,5.1,3.6l38.4-5l47.1,33.1l-5.4,6.4c-1.6,1.9-1.2,4.5,0.8,5.9l25.4,17.8l-2.8,3.4
			c-1.5,1.8-1.1,4.6,0.8,5.9l130.4,91.6C17184.9-1163.4,17187.8-1163.8,17189.4-1165.7z M17071.7-1286.1l-11.4,13.6l-21.7-15.3
			l11.4-13.6L17071.7-1286.1z M17185-1174.1l-123.2-86.5l2.8-3.4c0,0,0,0,0,0l17.1-20.3v0l2.8-3.4l123.2,86.5L17185-1174.1z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("diagnosis", "", 62) && (
            <g>
              <g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)">
                <path
                  fill={this.state.statusDoneTeeth.includes(62) ? "#369661" : "#DE2527"}
                  d="M174368.4,18478.9c-119.8-200.5-143-469.7-57.3-672.7c8.8-20.2,15-38.5,14.5-40.9
			c-0.5-2.4-83.5-61.5-184-130.7l-183-125.9l-19.3,29.3c-36.4,55.1-8.4,69.2-425.1-216.4c-203.3-139.8-374.5-260.6-381.1-269.3
			c-7.9-9-12.3-21.3-12.2-32c0.4-20.3,130.9-239.2,152.1-254.4c10.8-8,18.8-9.7,31.9-6.8c9.5,2.4,184.5,118.6,389.1,259.4
			c426.1,293,397,265.9,357.6,334.8l-22.5,39.5l184.4,126.8l183.7,126.3l33.7-40c97.5-117.3,220.5-191,372.5-223.6
			c261.9-56.2,524,47.1,693,271.7c157.6,210.1,197.2,486.5,104.7,732.5c-20.4,54.8-80.1,157.1-116.7,200.2
			c-80.8,95.5-183.6,168.6-292.2,206.3C174884.6,18900.7,174542.8,18770.4,174368.4,18478.9z M175183,18626.2
			c197-92,320.6-298.8,316.6-528.6c-1-71-27.9-185.6-57.5-246c-92.5-190-273.5-314.5-474.5-327.4c-70.6-4.4-189.7,20.5-255.8,54.2
			c-52.1,26.3-118.7,77.1-155.3,117.1c-33.2,36.7-85.8,121.7-105.6,171.4c-23.4,57.3-40.3,142.2-41.9,210
			c-1.8,77.9,25.8,203.7,58.6,270.4c93.7,189.8,273.2,313.2,475.4,326C175003.4,18677.3,175125.2,18653.7,175183,18626.2z"
                />
                <path
                  fill={this.state.statusDoneTeeth.includes(62) ? "#369661" : "#DE2527"}
                  d="M175364.1,18371.2c32.5-56.8,48.5-98.6,60.7-158.6c41.1-205.4-45.2-418.8-215.9-534.7
			c-83.7-57-141.6-74.3-145.8-43.7c-2,15.6,7.8,25.4,42.1,38.2c48.6,18.6,127.5,75.4,165.3,118.3c17.6,20.8,43.9,57.4,58.7,82
			c23.8,41.5,27.3,52.1,45.1,135.3c17.7,82.6,19.2,94.8,14.3,141.9c-6.5,69.5-25.5,128.4-60.5,190.1c-29.4,51.7-32.2,63.6-16.8,74.2
			C175327.4,18425.1,175338.6,18415.8,175364.1,18371.2z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("whitening", "", 62) && (
            <polygon
              fill={this.state.statusDoneTeeth.includes(62) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(62) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              points="17178.6,-1347 17231.7,-1306.6 17229.4,-1239.9 
	17283.3,-1278 17345.5,-1254.5 17325.7,-1318.4 17366.4,-1370.5 17300.3,-1371.9 17263.3,-1427.7 17242.2,-1364.7 "
            />
          )}
          {this.isShownRedGraphic("rootCanal", "Post and Core", 62) && (
            <path
              id="egXMLID_2_"
              fill={this.state.statusDoneTeeth.includes(62) ? "#369661" : "#DE2527"}
              d="M17250.2-1977.4c15.9,139.6,0.6,246.9-15.9,318c-23.2,99.3-64,195.4-32.8,213.9
	c20.4,12.2,47-24.4,111-27.1c76.4-2.7,115.5,47.8,137.6,32.9c28.9-19.1-21.5-114.1-48.7-217.7c-19.8-75.9-33.4-182.1-9.6-319.1
	C17344.8-1976.3,17297.2-1976.9,17250.2-1977.4L17250.2-1977.4z"
            />
          )}
          {this.isShownRedGraphic("rootCanal", "", 62) && (
            <path
              fill={this.state.statusDoneTeeth.includes(62) ? "#369661" : "#DE2527"}
              d="M17377.5-2764.6c0,0-5.5,3.8-5.5,15.1c0,0-5.5,15.1-5.5,26.4c-38.2,177.6-49.2,566.8-49.2,566.8
	c0,45.3-5.5,113.4-10.9,200.3c-5.5,11.3-32.8,37.8-27.3,75.6c5.5,22.7,27.3,49.1,38.2,45.3c5.5,0,5.5-3.8,16.4-15.1
	c10.9-15.1,21.9-18.9,27.3-22.7c21.9-18.9-5.5-68-5.5-75.6c-10.9-15.1-10.9-83.1-10.9-211.6c0-34,0-83.1,10.9-238
	C17366.6-2624.8,17383-2764.6,17377.5-2764.6L17377.5-2764.6z"
            />
          )}
          {this.isShownRedGraphic("implantation", "", 62) && (
            <path
              fill={this.state.statusDoneTeeth.includes(62) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(62) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M16986.5-1903.8c0-71.4,26-129.4,58-129.4h196.4v-59.3h-99.1
	c-20.2,0-36.8-36.6-36.8-82.1c0-45.2,16.4-82.1,36.8-82.1h99.1v-58.9h-67.5c-20.2,0-36.8-36.6-36.8-82.1c0-45.2,16.4-82.1,36.8-82.1
	h67.5v-58.9h-35.9c-20.2,0-36.8-36.6-36.8-82.1c0-45.2,16.4-82.1,36.8-82.1h35.9v-58.9h-4.2c-20.2,0-36.8-36.6-36.8-82.1
	c0-45.2,16.4-82.1,36.8-82.1h150.7c20.2,0,36.8,36.6,36.8,82.1c0,45.2-16.4,82.1-36.8,82.1h-4.2v58.9h35.9
	c20.2,0,36.8,36.6,36.8,82.1c0,45.2-16.4,82.1-36.8,82.1h-35.9v58.9h67.5c20.2,0,36.8,36.6,36.8,82.1c0,45.2-16.4,82.1-36.8,82.1
	h-67.5v58.9h99.1c20.2,0,36.8,36.6,36.8,82.1c0,45.2-16.4,82.1-36.8,82.1h-99.1v58.9h196.4c32,0,58,58.1,58,129.4
	s-26,129.4-58,129.4h-535.1C17012.5-1774.8,16986.7-1832.4,16986.5-1903.8z"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 62) && (
            <rect
              x="17008.7"
              y="-1627.9"
              fill={this.state.statusDoneTeeth.includes(62) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(62) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="597.2"
              height="113.9"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 62) && (
            <rect
              x="17162"
              y="-1655.5"
              fill={this.state.statusDoneTeeth.includes(62) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(62) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="300.2"
              height="173.1"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 62) && (
            <rect
              x="17160.8"
              y="-1646.2"
              fill={this.state.statusDoneTeeth.includes(62) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(62) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="302.6"
              height="154.6"
            />
          )}
          {this.isShownRedGraphic("surgery", "", 62) && (
            <path
              fill={this.state.statusDoneTeeth.includes(62) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(62) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M17316.9-3373.6h151.7V167h-151.7V-3373.6z M17052.9,167h159.8
	v-3548.4h-159.8V167z"
            />
          )}


          <path
            fill="#F2ECBE"
            onClick={() => {
              this.toggleSelectedNumber(61);
              this.props.onClick(61);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 61)
                ? (this.state.statusDoneTeeth.includes(61) ? "#369661" : "#DE2527")
                : this.checkImpacted(61) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(61) ? isMissing ? `M16526.5-1658.9l181.8-110.8
	c24.1-73.8,44.5-648.5-97-993.7c-149.8-328.4-242.6-94.2-258.9,4.2c-16.2,172.6-16.2,336.8-64.5,517.2
	c-40.4,143.8-60.8,377.6-20.4,574.8L16526.5-1658.9z` : "" : `M16526.5-1658.9l181.8-110.8
	c24.1-73.8,44.5-648.5-97-993.7c-149.8-328.4-242.6-94.2-258.9,4.2c-16.2,172.6-16.2,336.8-64.5,517.2
	c-40.4,143.8-60.8,377.6-20.4,574.8L16526.5-1658.9z` }
          />
          <path
            fill={conditionToColor(this.props.teeth[61].condition)}
            onClick={() => {
              this.toggleSelectedNumber(61);
              this.props.onClick(61);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 61)
                ? (this.state.statusDoneTeeth.includes(61) ? "#369661" : "#DE2527")
                : this.checkImpacted(61) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(61) ? isMissing ? `M16260.2-1746.5c-3.7,7,0,13.5,0,17.2
	c-39,187-114.1,323.3-114.1,401.3c0,64.5-3.7,231.5,167.5,190.7c14.4-10.2,21.3-13.5,32-7c14.4,20.4,114.1,47.8,245.4-17.2
	c17.6-20.4,35.7-10.2,46.4-10.2c146.1-58,217.1-98.8,170.7-278.8c-71-296-124.8-466.2-327.5-438.8
	c-92.8,13.5-149.4,68.2-202.7,122.5C16274.1-1763.7,16263.4-1753.5,16260.2-1746.5L16260.2-1746.5L16260.2-1746.5z` : '' : `M16260.2-1746.5c-3.7,7,0,13.5,0,17.2
	c-39,187-114.1,323.3-114.1,401.3c0,64.5-3.7,231.5,167.5,190.7c14.4-10.2,21.3-13.5,32-7c14.4,20.4,114.1,47.8,245.4-17.2
	c17.6-20.4,35.7-10.2,46.4-10.2c146.1-58,217.1-98.8,170.7-278.8c-71-296-124.8-466.2-327.5-438.8
	c-92.8,13.5-149.4,68.2-202.7,122.5C16274.1-1763.7,16263.4-1753.5,16260.2-1746.5L16260.2-1746.5L16260.2-1746.5z`}
          />
          <path
            fill={conditionToColor(this.props.teeth[61].condition)}
            onClick={() => {
              this.toggleSelectedNumber(61);
              this.props.onClick(61);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 61)
                ? (this.state.statusDoneTeeth.includes(61) ? "#369661" : "#DE2527")
                : this.checkImpacted(61) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(61) ? isMissing ? `M16319.1-1282.6c8.4,50.5,8.4,93.2,2.8,156.3
	 M16545.9-1291c2.8,25.5,2.8,101.1,0,126.6` : '' : `M16319.1-1282.6c8.4,50.5,8.4,93.2,2.8,156.3
	 M16545.9-1291c2.8,25.5,2.8,101.1,0,126.6`}
          />
          {this.isShownRedGraphic("rootCanal", "Post and Core", 61) && (
            <path
              id="egXMLID_1_"
              fill={this.state.statusDoneTeeth.includes(61) ? "#369661" : "#DE2527"}
              d="M16373-2028.9c15.9,139.6,0.6,246.9-15.9,318c-23.2,99.3-64,195.4-32.8,213.9
	c20.4,12.2,47-24.4,111-27.1c76.4-2.7,115.5,47.8,137.6,32.9c28.9-19.1-21.5-114.1-48.7-217.7c-19.8-75.9-33.4-182.1-9.6-319.1
	C16467.5-2027.8,16420-2028.4,16373-2028.9L16373-2028.9z"
            />
          )}
          {this.isShownRedGraphic("rootCanal", "", 61) && (
            <path
              fill={this.state.statusDoneTeeth.includes(61) ? "#369661" : "#DE2527"}
              d="M16496.2-2831.3c0,0-5.5,4-5.5,15.9c0,0-5.5,15.9-5.5,27.8c-38.2,186.3-49.2,594.7-49.2,594.7
	c0,47.6-5.5,118.9-10.9,210.1c-5.5,11.9-32.8,39.6-27.3,79.3c5.5,23.8,27.3,51.5,38.2,47.6c5.5,0,5.5-4,16.4-15.9
	c10.9-15.9,21.9-19.8,27.3-23.8c21.9-19.8-5.5-71.4-5.5-79.3c-10.9-15.9-10.9-87.2-10.9-222c0-35.7,0-87.2,10.9-249.8
	C16485.3-2684.6,16501.7-2831.3,16496.2-2831.3L16496.2-2831.3z"
            />
          )}
          {this.isShownRedGraphic("hygiene", "", 61) && (
            <g>
              <g>
                <path
                  fill={this.state.statusDoneTeeth.includes(61) ? "#369661" : "#DE2527"}
                  d="M16434.1-1142.5l28.5-33.9c0.8-0.9,1.1-2,1-3.1c-0.1-1.1-0.8-2.1-1.7-2.8l-130.4-91.6
			c-2-1.4-4.9-1-6.5,0.8l-2.8,3.4l-25.4-17.8c-1-0.7-2.2-1-3.4-0.8c-1.2,0.2-2.3,0.8-3.1,1.7l-6,7.1l-50.1-35.2l-42.2,5.5
			c-2.5,0.3-4.3,2.5-4,4.8c0.3,2.3,2.6,3.9,5.1,3.6l38.4-5l47.1,33.1l-5.4,6.4c-1.6,1.9-1.2,4.5,0.8,5.9l25.4,17.8l-2.8,3.4
			c-1.5,1.8-1.1,4.6,0.8,5.9l130.4,91.6C16429.7-1140.2,16432.6-1140.6,16434.1-1142.5z M16316.4-1262.9l-11.4,13.6l-21.7-15.3
			l11.4-13.6L16316.4-1262.9z M16429.7-1150.9l-123.2-86.5l2.8-3.4c0,0,0,0,0,0l17.1-20.3v0l2.8-3.4l123.2,86.5L16429.7-1150.9z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("diagnosis", "", 61) && (
            <g>
              <g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)">
                <path
                  fill={this.state.statusDoneTeeth.includes(61) ? "#369661" : "#DE2527"}
                  d="M166455.5,18772.9c-119.8-200.5-143-469.7-57.3-672.7c8.8-20.2,15-38.5,14.5-40.9
			c-0.5-2.4-83.5-61.5-184-130.7l-183-125.9l-19.3,29.3c-36.4,55.1-8.4,69.2-425.1-216.4c-203.3-139.8-374.5-260.6-381.1-269.3
			c-7.9-9-12.3-21.3-12.2-32c0.4-20.2,130.9-239.2,152.1-254.4c10.8-8,18.8-9.7,31.9-6.8c9.5,2.4,184.5,118.6,389.1,259.4
			c426.1,293,397,265.9,357.6,334.8l-22.5,39.5l184.4,126.8l183.7,126.3l33.7-40c97.5-117.3,220.5-191,372.5-223.6
			c261.9-56.2,524,47.1,693,271.7c157.6,210.1,197.2,486.5,104.7,732.5c-20.4,54.8-80.1,157.1-116.7,200.2
			c-80.8,95.5-183.6,168.6-292.2,206.3C166971.8,19194.7,166630,19064.5,166455.5,18772.9z M167270.2,18920.3
			c197-92,320.6-298.8,316.6-528.6c-1-71-27.9-185.6-57.5-246c-92.5-190-273.5-314.5-474.5-327.4c-70.6-4.4-189.7,20.5-255.8,54.2
			c-52.1,26.3-118.6,77.1-155.3,117.1c-33.2,36.7-85.8,121.7-105.6,171.4c-23.4,57.3-40.3,142.2-41.9,210
			c-1.8,77.9,25.8,203.7,58.6,270.4c93.7,189.8,273.2,313.2,475.4,326C167090.6,18971.4,167212.4,18947.8,167270.2,18920.3z"
                />
                <path
                  fill={this.state.statusDoneTeeth.includes(61) ? "#369661" : "#DE2527"}
                  d="M167451.3,18665.2c32.5-56.7,48.5-98.6,60.7-158.6c41.1-205.4-45.2-418.8-215.9-534.7
			c-83.7-57-141.6-74.2-145.8-43.7c-2,15.6,7.8,25.4,42.1,38.2c48.6,18.6,127.5,75.4,165.3,118.3c17.6,20.8,43.9,57.4,58.7,82
			c23.8,41.5,27.3,52.1,45.1,135.3c17.7,82.6,19.2,94.8,14.4,141.9c-6.5,69.5-25.5,128.4-60.5,190.1c-29.4,51.7-32.2,63.6-16.8,74.2
			C167414.6,18719.1,167425.8,18709.8,167451.3,18665.2z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("whitening", "", 61) && (
            <polygon
              fill={this.state.statusDoneTeeth.includes(61) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(61) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              points="16369.7,-1353 16422.8,-1312.6 16420.4,-1245.9 
	16474.4,-1284 16536.5,-1260.4 16516.7,-1324.4 16557.5,-1376.5 16491.3,-1377.9 16454.4,-1433.7 16433.3,-1370.7 "
            />
          )}
          {this.isShownRedGraphic("implantation", "", 61) && (
            <path
              fill={this.state.statusDoneTeeth.includes(61) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(61) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M16171.7-1910.7c0-71.8,26-130.3,58-130.3h196.4v-59.7h-99.1
	c-20.2,0-36.8-36.8-36.8-82.7c0-45.4,16.4-82.7,36.8-82.7h99.1v-59.3h-67.5c-20.2,0-36.8-36.8-36.8-82.7c0-45.4,16.4-82.7,36.8-82.7
	h67.5v-59.3h-35.9c-20.2,0-36.8-36.8-36.8-82.7c0-45.4,16.4-82.7,36.8-82.7h35.9v-59.3h-4.2c-20.2,0-36.8-36.8-36.8-82.7
	c0-45.4,16.4-82.7,36.8-82.7h150.7c20.2,0,36.8,36.8,36.8,82.7c0,45.4-16.4,82.7-36.8,82.7h-4.2v59.3h35.9
	c20.2,0,36.8,36.8,36.8,82.7c0,45.4-16.4,82.7-36.8,82.7h-35.9v59.3h67.5c20.2,0,36.8,36.8,36.8,82.7c0,45.4-16.4,82.7-36.8,82.7
	h-67.5v59.3h99.1c20.2,0,36.8,36.8,36.8,82.7c0,45.4-16.4,82.7-36.8,82.7h-99.1v59.3h196.4c32,0,58,58.4,58,130.3
	c0,71.8-26,130.3-58,130.3h-535.1C16197.8-1780.8,16171.9-1838.8,16171.7-1910.7z"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 61) && (
            <rect
              x="16203.6"
              y="-1645"
              fill={this.state.statusDoneTeeth.includes(61) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(61) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="570.2"
              height="113.9"
            />
          )}
          {this.isShownRedGraphic("surgery", "", 61) && (
            <path
              fill={this.state.statusDoneTeeth.includes(61) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(61) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M16558.6-3369.7h151.7V170.9h-151.7V-3369.7z M16294.7,170.9h159.8
	v-3548.4h-159.8V170.9z"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 61) && (
            <rect
              x="16331.2"
              y="-1657.9"
              fill={this.state.statusDoneTeeth.includes(61) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(61) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="302.6"
              height="154.6"
            />
          )}

          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 85)
                ? (this.state.statusDoneTeeth.includes(85) ? "#369661" : "#DE2527")
                : this.checkImpacted(85) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(85) ? isMissing ? `M11987.4,1284.4L11987.4,1284.4
	c-45,44.1-45,123-59.7,147.4c-18.1,29.7-22.7,108.1-4.6,162.4c18.1,44.1,122,255.6,185.1,275.1c45.5,14.8,90.5,5.1,135.5,14.8
	c67.7,14.8,144.3,14.8,212,0c49.7-14.9,148.5-68.7,171.2-73.8c31.6-10.2,76.6-14.9,108.1-29.7c36.2-24.6,81.2-68.6,117.4-122.9
	c22.8-34.3,45.5-83.5,54.3-117.8c8.8-34.4,13.5-108.1,0-162.4c-18-68.7-76.5-93.3-76.5-108.1s22.7-9.7,22.7-64
	c4.6-58.9-22.3-63.5-26.9-117.8c-18.1-73.7-54.3-103.4-85.8-122.9c-18.1-14.8-112.7-14.8-130.8-14.8c-22.7,0-36.2-19.9-63.1-14.8
	c-31.5,0-67.7,24.6-76.5,39.4c-8.8,10.2-18,29.7-31.5,29.7c-13.4-5.1-13.4-24.6-26.9-39.4c-8.8-9.7-36.2-34.3-63.1-34.3
	c-31.5-5.1-40.8,24.6-85.8,34.3c-27.4,5.1-31.6,39.4-54.3,39.4c-8.8-5.1-13.4-24.6-26.9-29.7c-40.3-24.6-85.3-24.6-139.6,5.1
	c-40.8,24.6-72.4,68.7-81.2,108.1c-9.2,34.4-9.2,98.4-4.6,132.7C11960.5,1245,11973.9,1259.8,11987.4,1284.4L11987.4,1284.4z` : '' : `M11987.4,1284.4L11987.4,1284.4
	c-45,44.1-45,123-59.7,147.4c-18.1,29.7-22.7,108.1-4.6,162.4c18.1,44.1,122,255.6,185.1,275.1c45.5,14.8,90.5,5.1,135.5,14.8
	c67.7,14.8,144.3,14.8,212,0c49.7-14.9,148.5-68.7,171.2-73.8c31.6-10.2,76.6-14.9,108.1-29.7c36.2-24.6,81.2-68.6,117.4-122.9
	c22.8-34.3,45.5-83.5,54.3-117.8c8.8-34.4,13.5-108.1,0-162.4c-18-68.7-76.5-93.3-76.5-108.1s22.7-9.7,22.7-64
	c4.6-58.9-22.3-63.5-26.9-117.8c-18.1-73.7-54.3-103.4-85.8-122.9c-18.1-14.8-112.7-14.8-130.8-14.8c-22.7,0-36.2-19.9-63.1-14.8
	c-31.5,0-67.7,24.6-76.5,39.4c-8.8,10.2-18,29.7-31.5,29.7c-13.4-5.1-13.4-24.6-26.9-39.4c-8.8-9.7-36.2-34.3-63.1-34.3
	c-31.5-5.1-40.8,24.6-85.8,34.3c-27.4,5.1-31.6,39.4-54.3,39.4c-8.8-5.1-13.4-24.6-26.9-29.7c-40.3-24.6-85.3-24.6-139.6,5.1
	c-40.8,24.6-72.4,68.7-81.2,108.1c-9.2,34.4-9.2,98.4-4.6,132.7C11960.5,1245,11973.9,1259.8,11987.4,1284.4L11987.4,1284.4z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 85)
                ? (this.state.statusDoneTeeth.includes(85) ? "#369661" : "#DE2527")
                : this.checkImpacted(85) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(85) ? isMissing ? `M12713.4,1136.9c-8.8,44.1-18.1,78.9-40.4,103.5
	c-26.9,44.1-67.7,54.3-103.9,64c-36.2,5.1-58.5-9.7-90-29.7c-31.5-5.1-58.5-9.7-90-14.8c-63.1-9.7-108.1-9.7-144.3,0
	c-45,9.7-85.8,29.7-130.8,58.9c-40.4,34.3-72.4,73.8-103.9,108.1c-8.8,24.6-4.6,49.2,22.7,68.7c18.1,14.8,49.6,14.8,67.7,9.7
	c26.9,9.7,67.7,5.1,94.6-5.1c13.5,24.6,26.9,39.4,67.7,49.2c26.9,5.1,49.6,0,63.1-9.7c36.2-34.3,40.4-39.4,63.1-24.6
	c18.1,9.7,31.5,19.5,49.6,29.7c36.2,5.1,67.7,0,94.6-9.7l108.1-14.8c8.8-5.1,18.1,0,26.9-5.1c45-9.7,90-29.7,103.9-54.3
	c22.7-24.6,36.2-54.3,31.5-88.6c-13.5-54.3-45-83.5-72.4-103.4C12744.9,1220.4,12740.3,1176.3,12713.4,1136.9L12713.4,1136.9
	L12713.4,1136.9z` : '' : `M12713.4,1136.9c-8.8,44.1-18.1,78.9-40.4,103.5
	c-26.9,44.1-67.7,54.3-103.9,64c-36.2,5.1-58.5-9.7-90-29.7c-31.5-5.1-58.5-9.7-90-14.8c-63.1-9.7-108.1-9.7-144.3,0
	c-45,9.7-85.8,29.7-130.8,58.9c-40.4,34.3-72.4,73.8-103.9,108.1c-8.8,24.6-4.6,49.2,22.7,68.7c18.1,14.8,49.6,14.8,67.7,9.7
	c26.9,9.7,67.7,5.1,94.6-5.1c13.5,24.6,26.9,39.4,67.7,49.2c26.9,5.1,49.6,0,63.1-9.7c36.2-34.3,40.4-39.4,63.1-24.6
	c18.1,9.7,31.5,19.5,49.6,29.7c36.2,5.1,67.7,0,94.6-9.7l108.1-14.8c8.8-5.1,18.1,0,26.9-5.1c45-9.7,90-29.7,103.9-54.3
	c22.7-24.6,36.2-54.3,31.5-88.6c-13.5-54.3-45-83.5-72.4-103.4C12744.9,1220.4,12740.3,1176.3,12713.4,1136.9L12713.4,1136.9
	L12713.4,1136.9z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 85)
                ? (this.state.statusDoneTeeth.includes(85) ? "#369661" : "#DE2527")
                : this.checkImpacted(85) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(85) ? isMissing ? `M12014.3,1432c36.2-54.3,94.6-108.1,130.8-128
	c22.7-9.7,45-24.6,72.4-29.7c94.6-29.7,130.8-19.5,193.9-5.1c13.5,5.1,49.6,0,67.7,9.7c31.5,9.7,36.2,29.7,63.1,29.7
	c22.7,0,40.4,0,58.5-14.8c45-14.8,72.4-44.1,94.6-88.6c8.8-19.5,8.8-64,18.1-68.7c18.1,5.1,36.2,58.9,22.7,142.4
	c0,14.8,40.4,24.6,67.7,78.9c4.6,19.5,8.8,34.3,8.8,49.2s-18.1,44.1-31.5,64` : '' : `M12014.3,1432c36.2-54.3,94.6-108.1,130.8-128
	c22.7-9.7,45-24.6,72.4-29.7c94.6-29.7,130.8-19.5,193.9-5.1c13.5,5.1,49.6,0,67.7,9.7c31.5,9.7,36.2,29.7,63.1,29.7
	c22.7,0,40.4,0,58.5-14.8c45-14.8,72.4-44.1,94.6-88.6c8.8-19.5,8.8-64,18.1-68.7c18.1,5.1,36.2,58.9,22.7,142.4
	c0,14.8,40.4,24.6,67.7,78.9c4.6,19.5,8.8,34.3,8.8,49.2s-18.1,44.1-31.5,64`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 85)
                ? (this.state.statusDoneTeeth.includes(85) ? "#369661" : "#DE2527")
                : this.checkImpacted(85) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(85) ? isMissing ? `M12145.1,1309c-22.7-5.1-40.4-24.6-63.1-29.7
	c-18.1-4.6-58.4-4.6-94.6,5.1 M12352.6,1520.5c-13.5,19.9-49.7,34.3-58.5,39.4c-8.9,4.7-49.7-9.7-58.5-14.8
	c-13.5-5.1-27.4-24.6-36.2-39.4c-4.6-24.6-9.2-54.3-4.6-78.9c4.6-24.6,18-44.1,31.5-58.9 M12199.4,1505.3
	c-26.9,10.2-58.4,10.2-94.6,5.1 M12600.4,1294.3c49.6,19.5,36.2,98.4,63.1,108.1c13.4,5.1,4.6,44.5,4.6,64c0,24.6,9.2,49.2,4.6,58.9
	c-9.2,14.8-45,4.6-67.7,9.7c-18.1,0-121.6,29.7-144.3,29.7c-22.8-5.1-63.6-29.7-72.4-39.4c-4.2-9.8,9.2-54.3,4.6-73.8
	c-4.2-9.8-35.8-39-58.5-68.7` : '' : ``}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 85)
                ? (this.state.statusDoneTeeth.includes(85) ? "#369661" : "#DE2527")
                : this.checkImpacted(85) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(85) ? isMissing ? `M12546.9,1549.7c-22.7-29.7,4.6-88.6-18.1-122.9
	c-9.3-14.8-36.2-39.4-36.2-64` : "" : `M12546.9,1549.7c-22.7-29.7,4.6-88.6-18.1-122.9
	c-9.3-14.8-36.2-39.4-36.2-64`}
          />
          {this.isShownRedGraphic("restoration", "Lingual", 85) && (
            <path
              fill={this.state.statusDoneTeeth.includes(85) ? "#369661" : "#DE2527"}
              d="M12647.4,1796c-5.7,6.6-5.7,6.6-34,13.3c-22.7,6.6-34,13.3-51,26.5c-45.3,26.5-68,39.8-96.3,46.4
	c-39.7,13.3-68,19.9-90.7,19.9h-85c-22.7,0-39.7,0-39.7-6.6c-34-19.9-11.3-106.2-11.3-219c0-146-39.7-199.1-11.3-232.2
	c28.3-26.5,62.3,13.3,153,26.5c130.3,13.3,204-53.1,238-13.3c22.7,33.2-22.7,73-5.7,172.5
	C12624.7,1716.4,12664.4,1769.5,12647.4,1796L12647.4,1796z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Medial", 85) && (
            <path
              fill={this.state.statusDoneTeeth.includes(85) ? "#369661" : "#DE2527"}
              d="M12901.5,1380.1c15.9,50.6,15.9,94.9,10.6,132.8c0,44.3-5.3,63.2-10.6,75.9c-31.7,44.3-95.1-19-206.1-6.3
	c-84.5,12.6-142.7,63.2-158.5,37.9c-5.3-6.3,0-19,10.6-50.6c15.9-63.2,5.3-120.2,5.3-151.8c-5.3-101.2-37-139.1-26.4-164.4
	c0-6.3,0-6.3,5.3-12.6c10.6-6.3,31.7,6.3,42.3,12.6c31.7,19,68.7,19,142.7,12.6c79.3-6.3,84.5-25.3,111-6.3
	C12875,1291.5,12890.9,1348.4,12901.5,1380.1L12901.5,1380.1z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Oclusial", 85) && (
            <path
              fill={this.state.statusDoneTeeth.includes(85) ? "#369661" : "#DE2527"}
              d="M12264.7,1475c4.5,3.8,4.5,0,13.5,0c13.5,0,18,3.8,40.5,7.5c4.5,0,4.5,0,9,3.8c9,3.8,13.5,3.8,27,7.5
	c18,3.8,71.9,11.3,130.4,0c9-3.8,18-3.8,31.5-7.5c9,0,9,0,13.5-3.8c13.5-3.8,18-7.5,22.5-3.8c4.5,0,4.5,3.8,9,3.8h4.5
	c4.5,0,4.5-7.5,9-15c4.5-11.3,4.5-11.3,9-15v-15c0-7.5,0-7.5,4.5-18.8v-18.8c-4.5-33.8-9-52.6-9-52.6c-4.5-22.6-9-18.8-18-48.9
	c-4.5-11.3-4.5-15-9-22.6c-9-7.5-22.5-3.8-45-15c-4.5,0-9-3.8-13.5-7.5c-9-3.8-13.5-3.8-18-7.5c-40.5-7.5-45-11.3-54-11.3h-36
	c-27,0-49.5,7.5-63,11.3c-22.5,7.5-18,7.5-36,11.3c-9,3.8-13.5,3.8-18,7.5s-9,11.3-9,22.6c-4.5,22.6-4.5,15-9,37.6
	c-4.5,15,0,26.3,0,45.1c0,15,4.5,26.3,4.5,37.6c0,7.5,4.5,18.8,9,30.1c4.5,15,9,18.8,9,26.3
	C12260.2,1467.5,12260.2,1471.2,12264.7,1475L12264.7,1475z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Buccal", 85) && (
            <path
              fill={this.state.statusDoneTeeth.includes(85) ? "#369661" : "#DE2527"}
              d="M12256.8,966.9c4.5-5.2,4.5,0,31.7-15.6c36.3-15.6,36.3-26,49.9-26c31.7-5.2,63.5,15.6,77.1,36.4
	c4.5,5.2,9.1,15.6,13.6,20.8c9.1,15.6,9.1,20.8,13.6,20.8c4.5,0,9.1-5.2,18.1-10.4s13.6-15.6,13.6-20.8
	c9.1-15.6,45.4-41.6,77.1-41.6c22.7,0,36.3,5.2,40.8,10.4c27.2,31.2-18.1,104-9.1,218.5c4.5,78,31.7,109.2,13.6,130
	c-22.7,26-77.1-46.8-172.3-46.8c-77.1,0-122.5,52-145.1,26c-13.6-15.6,9.1-46.8,9.1-109.2
	C12297.6,1060.5,12234.1,998.1,12256.8,966.9L12256.8,966.9z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Distal", 85) && (
            <path
              fill={this.state.statusDoneTeeth.includes(85) ? "#369661" : "#DE2527"}
              d="M11979.2,1260.5c37.4,17.6,93.6,35.2,154.4,23.5c79.5-17.6,121.6-76.4,145-52.9
	c23.4,23.5-9.4,76.4-9.4,187.9c4.7,105.7,37.4,141,18.7,170.3c-32.7,47-117-64.6-266.7-41.1c-42.1,5.9-98.2,23.5-112.3-5.9
	c-4.7-11.7-4.7-35.2,4.7-58.7c4.7-29.4,9.4-35.2,18.7-58.7c14-47,4.7-58.7,18.7-99.8C11946.4,1313.4,11955.8,1289.9,11979.2,1260.5
	L11979.2,1260.5z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 85) && (
            <path
              fill={this.state.statusDoneTeeth.includes(85) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(85) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M11901.3,1141.8h1011.2v152h-1011.2V1141.8z M11901.3,1545.1
	h1011.2v-152h-1011.2V1545.1z"
            />
          )}

          
          <path
            fill="#F2ECBE"
            onClick={() => {
              this.toggleSelectedNumber(85);
              this.props.onClick(85);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 85)
                ? (this.state.statusDoneTeeth.includes(85) ? "#369661" : "#DE2527")
                : this.checkImpacted(85) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(85) ? isMissing ? `M12229.5,2782.8l-135.5,67.3
	c-41.8,210.6-57.1,426.3-41.8,641.6c26,367.9,57.1,488.9,114.6,497.8c88.6,4.6,124.8-228.7,135.5-278.3
	c5.1-94.2,93.7-215.2,98.8-246.8c15.8-45,15.8-224.5,72.8-233.3c20.9,22.3,98.8,188.3,26,462c-15.8,53.8-130.4,354.4-83.5,372.5
	c182.3,71.9,458.3-623.5,463.4-780.7c15.8-85.4,10.2-376.7-20.9-439.8L12229.5,2782.8L12229.5,2782.8z` : "" : `M12229.5,2782.8l-135.5,67.3
	c-41.8,210.6-57.1,426.3-41.8,641.6c26,367.9,57.1,488.9,114.6,497.8c88.6,4.6,124.8-228.7,135.5-278.3
	c5.1-94.2,93.7-215.2,98.8-246.8c15.8-45,15.8-224.5,72.8-233.3c20.9,22.3,98.8,188.3,26,462c-15.8,53.8-130.4,354.4-83.5,372.5
	c182.3,71.9,458.3-623.5,463.4-780.7c15.8-85.4,10.2-376.7-20.9-439.8L12229.5,2782.8L12229.5,2782.8z`}
          />
          <path
            fill={conditionToColor(this.props.teeth[85].condition)}
            onClick={() => {
              this.toggleSelectedNumber(85);
              this.props.onClick(85);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 85)
                ? (this.state.statusDoneTeeth.includes(85) ? "#369661" : "#DE2527")
                : this.checkImpacted(85) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(85) ? isMissing ? `M12599.3,2339.8
	c-74.2-56.1-132.2-140.1-201.3-177.7c-190.7-79.3-354.4,163.8-391.5,261.6c-42.2,144.7,32,346.1,84.9,430
	c26.4,27.8,121.5,9.3,201.3,9.3c105.8,9.3,185.1,79.3,275.1,84c47.8,0,201.3-23.2,317.3-98.3c74.2-37.6,185.1-303.9,201.3-331.7
	c58.5-121.5-127.1-275.6-180-317.8c-32-13.9-68.7-9.3-100.7,0C12726.4,2236.8,12641.5,2288.3,12599.3,2339.8L12599.3,2339.8z` : '' : `M12599.3,2339.8
	c-74.2-56.1-132.2-140.1-201.3-177.7c-190.7-79.3-354.4,163.8-391.5,261.6c-42.2,144.7,32,346.1,84.9,430
	c26.4,27.8,121.5,9.3,201.3,9.3c105.8,9.3,185.1,79.3,275.1,84c47.8,0,201.3-23.2,317.3-98.3c74.2-37.6,185.1-303.9,201.3-331.7
	c58.5-121.5-127.1-275.6-180-317.8c-32-13.9-68.7-9.3-100.7,0C12726.4,2236.8,12641.5,2288.3,12599.3,2339.8L12599.3,2339.8z`}
          />
          <path
            fill={conditionToColor(this.props.teeth[85].condition)}
            onClick={() => {
              this.toggleSelectedNumber(85);
              this.props.onClick(85);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 85)
                ? (this.state.statusDoneTeeth.includes(85) ? "#369661" : "#DE2527")
                : this.checkImpacted(85) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(85) ? isMissing ? `M12598.9,2324.5
	c-42.3,46.8-73.8,126.2-68.7,196.2 M12636.4,2562.9c-95.1-84-232.9-23.2-259.3-9.3` : '' : `M12598.9,2324.5
	c-42.3,46.8-73.8,126.2-68.7,196.2 M12636.4,2562.9c-95.1-84-232.9-23.2-259.3-9.3`}
          />
          {this.isShownRedGraphic("rootCanal", "", 85) && (
            <path
              fill={this.state.statusDoneTeeth.includes(85) ? "#369661" : "#DE2527"}
              d="M12752.2,2998c19.7,103.6,34.5,254.8,4.9,423.2c-64.1,371.4-281.1,613.3-291,608.9
	c-9.9-4.3,192.3-431.9,212.1-760.1c4.9-47.5,4.9-133.9-59.2-177.1c-59.2-38.9-148-30.2-192.3-17.3
	c-281.1,90.7-187.4,859.4-231.8,859.4c-24.7,0-103.6-289.4-34.5-626.2c29.6-151.2,83.8-276.4,128.2-362.8c69-8.6,157.8-13,266.3,4.3
	C12633.9,2963.5,12702.9,2980.7,12752.2,2998L12752.2,2998z"
            />
          )}
          {this.isShownRedGraphic("rootCanal", "Post and Core", 85) && (
            <path
              id="ehXMLID_11_"
              fill={this.state.statusDoneTeeth.includes(85) ? "#369661" : "#DE2527"}
              d="M12290.2,2960c-27.2-48.4,20.5-75.7,11.9-192.6c-7.8-110.6-56-157.4-28-179.1
	c38.4-30.2,128.4,61,293,64.1c132.1,2.8,210.5-53.4,240.8-23.6c22.4,22.3-16.1,59.4-40.3,148.6c-35.8,131.6,15.7,172.2-24.3,219.6
	C12663.8,3090.7,12348.8,3065.9,12290.2,2960z"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 85) && (
            <rect
              x="12047.3"
              y="2577.3"
              fill={this.state.statusDoneTeeth.includes(85) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(85) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="970.4"
              height="113.9"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 85) && (
            <rect
              x="12337.2"
              y="2518.2"
              fill={this.state.statusDoneTeeth.includes(85) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(85) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="351.6"
              height="232"
            />
          )}
          {this.isShownRedGraphic("diagnosis", "", 85) && (
            <g>
              <g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)">
                <path
                  fill={this.state.statusDoneTeeth.includes(85) ? "#369661" : "#DE2527"}
                  d="M127771.5-17386.2c-119.8-200.5-143-469.7-57.3-672.7c8.8-20.2,15-38.5,14.5-40.9
			c-0.5-2.4-83.5-61.5-184-130.7l-183-125.9l-19.3,29.3c-36.4,55.1-8.4,69.2-425.1-216.4c-203.3-139.8-374.5-260.6-381.1-269.3
			c-7.9-9-12.3-21.3-12.2-32c0.4-20.2,130.9-239.2,152.1-254.4c10.8-8,18.8-9.7,31.9-6.8c9.5,2.4,184.4,118.6,389.1,259.4
			c426.1,293,397,265.9,357.6,334.8l-22.5,39.5l184.4,126.8l183.7,126.3l33.7-40c97.5-117.3,220.5-191,372.5-223.6
			c261.9-56.2,524,47.1,693.1,271.7c157.6,210.1,197.2,486.5,104.7,732.5c-20.4,54.8-80.1,157.1-116.7,200.2
			c-80.8,95.5-183.6,168.6-292.2,206.3C128287.7-16964.4,127945.9-17094.7,127771.5-17386.2z M128586.1-17238.9
			c197-92,320.6-298.8,316.6-528.6c-0.9-71-27.9-185.6-57.5-246c-92.6-190-273.5-314.5-474.5-327.4c-70.6-4.4-189.7,20.5-255.7,54.2
			c-52.1,26.3-118.7,77.1-155.3,117.1c-33.2,36.7-85.8,121.7-105.6,171.4c-23.4,57.3-40.4,142.2-41.9,210
			c-1.8,77.9,25.8,203.7,58.6,270.4c93.7,189.8,273.2,313.2,475.4,326C128406.5-17187.8,128528.3-17211.4,128586.1-17238.9z"
                />
                <path
                  fill={this.state.statusDoneTeeth.includes(85) ? "#369661" : "#DE2527"}
                  d="M128767.2-17493.9c32.5-56.7,48.5-98.6,60.7-158.6c41.1-205.4-45.2-418.8-215.9-534.8
			c-83.7-57-141.6-74.2-145.8-43.7c-2,15.6,7.8,25.4,42.1,38.2c48.6,18.6,127.5,75.4,165.3,118.3c17.6,20.8,43.9,57.4,58.7,82
			c23.8,41.5,27.3,52.1,45.1,135.3c17.7,82.6,19.2,94.8,14.4,141.9c-6.5,69.5-25.5,128.4-60.5,190.1c-29.4,51.7-32.2,63.6-16.9,74.2
			C128730.5-17440,128741.7-17449.3,128767.2-17493.9z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("whitening", "", 85) && (
            <polygon
              fill={this.state.statusDoneTeeth.includes(85) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(85) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              points="12216.4,2329.9 12298.3,2265.7 12299.5,2369.7 
	12385.9,2427.7 12287.3,2461 12258.9,2561.1 12196.7,2477.6 12092.8,2481.5 12152.9,2396.6 12117.1,2298.9 "
            />
          )}
          {this.isShownRedGraphic("hygiene", "", 85) && (
            <g>
              <g>
                <path
                  fill={this.state.statusDoneTeeth.includes(85) ? "#369661" : "#DE2527"}
                  d="M12951.5,2527.9l39.8-2.2c1.1-0.1,2.1-0.5,2.8-1.3c0.7-0.8,1.1-1.8,1.1-2.9l-3.1-143.4
			c0-2.2-1.9-3.9-4.1-3.8l-4,0.2l-0.6-27.9c0-1.1-0.5-2-1.2-2.8c-0.8-0.7-1.8-1.1-2.8-1l-8.4,0.5l-1.2-55.1l-26.5-24.6
			c-1.6-1.5-4.1-1.3-5.6,0.3c-1.5,1.6-1.5,4.2,0.1,5.6l24.1,22.4l1.1,51.8l-7.5,0.4c-2.2,0.1-3.9,2-3.9,4.2l0.6,27.9l-4,0.2
			c-2.1,0.1-3.9,2.1-3.9,4.2l3.1,143.4C12947.5,2526.3,12949.3,2528,12951.5,2527.9z M12976.2,2374.9l-15.9,0.9l-0.5-23.9l15.9-0.9
			L12976.2,2374.9z M12955.3,2519.7l-2.9-135.5l4-0.2c0,0,0,0,0,0l23.9-1.3l0,0l4-0.2l2.9,135.5L12955.3,2519.7z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("implantation", "", 85) && (
            <path
              fill={this.state.statusDoneTeeth.includes(85) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(85) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M12007.7,2916.6h894.2c53.5,0,97,65.2,97,145.5
	s-43.5,145.5-97,145.5h-328.2v66.2h165.6c34.1,0,61.5,41.6,61.5,92.3c0,51.2-27.7,92.3-61.5,92.3h-165.6v66.2h112.7
	c34.1,0,61.5,41.6,61.5,92.3c0,51.2-27.7,92.3-61.5,92.3h-112.7v66.2h59.9c34.1,0,61.5,41.6,61.5,92.3c0,51.2-27.7,92.3-61.5,92.3
	h-59.9v66.2h7.1c34.1,0,61.5,41.6,61.5,92.3c0,51.2-27.7,92.3-61.5,92.3h-251.9c-34.1,0-61.5-41.6-61.5-92.3
	c0-51.2,27.7-92.3,61.5-92.3h7.1v-66.2h-59.9c-34.1,0-61.5-41.6-61.5-92.3c0-51.2,27.7-92.3,61.5-92.3h59.9v-66.2h-112.7
	c-34.1,0-61.5-41.6-61.5-92.3c0-51.2,27.7-92.3,61.5-92.3h112.7v-66.2h-165.6c-34.1,0-61.5-41.6-61.5-92.3
	c0-51.2,27.7-92.3,61.5-92.3h165.6v-66.7h-328.2c-53.5,0-97-65.2-97-145.5C11911.1,2981.4,11954.3,2916.6,12007.7,2916.6z"
            />
          )}


          <path
            fill="#F2ECBE"
            onClick={() => {
              this.toggleSelectedNumber(84);
              this.props.onClick(84);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 84)
                ? (this.state.statusDoneTeeth.includes(84) ? "#369661" : "#DE2527")
                : this.checkImpacted(84) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="22.926"
            d={this.checkMissing(84) ? isMissing ? `M13521.2,2775.8l-148.9,127.6
	c-25,132.7,0,314.1,5.1,377.6c9.7,83.5,29.7,166.5,29.7,245.4c25,397.1,49.6,520,104.4,534.9c59.8,29.2,104.4-88.1,119.2-137.3
	c19.9-53.8,39.9-211.1,44.5-279.7c19.9-235.7,19.9-431.4,44.5-441.6c79.3-39.4,124.3,88.1,179.1,230.6
	c34.8,93.2,49.6,186.5,49.6,259.8c0,29.2,5.1,240.3,25,299.2c79.3,215.7,223.6-53.8,253.3-353c19.9-166.5,5.1-505.2-34.8-657.3
	c-14.8-63.6-54.7-122.5-84.4-186.5L13521.2,2775.8L13521.2,2775.8z` : "" : `M13521.2,2775.8l-148.9,127.6
	c-25,132.7,0,314.1,5.1,377.6c9.7,83.5,29.7,166.5,29.7,245.4c25,397.1,49.6,520,104.4,534.9c59.8,29.2,104.4-88.1,119.2-137.3
	c19.9-53.8,39.9-211.1,44.5-279.7c19.9-235.7,19.9-431.4,44.5-441.6c79.3-39.4,124.3,88.1,179.1,230.6
	c34.8,93.2,49.6,186.5,49.6,259.8c0,29.2,5.1,240.3,25,299.2c79.3,215.7,223.6-53.8,253.3-353c19.9-166.5,5.1-505.2-34.8-657.3
	c-14.8-63.6-54.7-122.5-84.4-186.5L13521.2,2775.8L13521.2,2775.8z`}
          />
          <path
            fill={conditionToColor(this.props.teeth[84].condition)}
            onClick={() => {
              this.toggleSelectedNumber(84);
              this.props.onClick(84);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 84)
                ? (this.state.statusDoneTeeth.includes(84) ? "#369661" : "#DE2527")
                : this.checkImpacted(84) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(84) ? isMissing ? `M14199,2324.9c31.1,154.5,15.8,264.9-10.7,405.9
	c-5.1,26.4-20.9,66.3-36.6,84c-124.8,128-395.7,88.1-593.3,79.3c-62.6-4.6-171.6,17.6-187.4,0c-67.7-61.7-177.2-193.9-197.6-238.4
	c-41.8-70.5-41.8-198.5-20.9-251.4c36.6-70.5,119.7-84,187.4-52.9c10.7-26.4,41.8-110.4,124.8-128
	c145.7-17.6,234.3,101.6,244.9,92.8c31.1-22.3,177.2-114.6,276-119.2C14110.4,2179.2,14183.2,2267.4,14199,2324.9L14199,2324.9z`: '' : `M14199,2324.9c31.1,154.5,15.8,264.9-10.7,405.9
	c-5.1,26.4-20.9,66.3-36.6,84c-124.8,128-395.7,88.1-593.3,79.3c-62.6-4.6-171.6,17.6-187.4,0c-67.7-61.7-177.2-193.9-197.6-238.4
	c-41.8-70.5-41.8-198.5-20.9-251.4c36.6-70.5,119.7-84,187.4-52.9c10.7-26.4,41.8-110.4,124.8-128
	c145.7-17.6,234.3,101.6,244.9,92.8c31.1-22.3,177.2-114.6,276-119.2C14110.4,2179.2,14183.2,2267.4,14199,2324.9L14199,2324.9z`}
          />
          <path
            fill={conditionToColor(this.props.teeth[84].condition)}
            onClick={() => {
              this.toggleSelectedNumber(84);
              this.props.onClick(84);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 84)
                ? (this.state.statusDoneTeeth.includes(84) ? "#369661" : "#DE2527")
                : this.checkImpacted(84) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(84) ? isMissing ? `M13683.2,2571.6
            c-15.4-83.9-31.1-220.3,36.6-260.2 M13355.7,2536.4c-26-61.7-31.6-154-15.8-185.1`: '' : `M13683.2,2571.6
	c-15.4-83.9-31.1-220.3,36.6-260.2 M13355.7,2536.4c-26-61.7-31.6-154-15.8-185.1`}
          />

          {this.isShownRedGraphic("rootCanal", "", 84) && (
            <path
              fill={this.state.statusDoneTeeth.includes(84) ? "#369661" : "#DE2527"}
              d="M14020.5,2945c33.6,75.9,72,180.3,91.1,313.2c67.2,417.6-91.1,754.5-110.3,754.5
	c-19.2-4.7,24-474.5-28.8-754.5c-4.8-42.7-24-128.1-95.9-180.3c-14.4-9.5-57.6-38-110.3-33.2c-57.6,4.7-91.1,42.7-105.5,56.9
	c-62.4,66.4-62.4,156.6-67.2,185.1c-4.8,237.3-43.2,735.5-57.6,735.5c-14.4,0-86.3-303.7-62.4-716.6
	c9.6-151.9,28.8-275.2,43.2-365.4c48-19,129.5-52.2,244.6-52.2C13881.4,2883.3,13972.5,2921.3,14020.5,2945z"
            />
          )}
          {this.isShownRedGraphic("rootCanal", "Post and Core", 84) && (
            <path
              id="ehXMLID_10_"
              fill={this.state.statusDoneTeeth.includes(84) ? "#369661" : "#DE2527"}
              d="M13524.8,2955.6c-28.6-51.4,21.6-80.4,12.6-204.5c-8.2-117.4-58.8-167.1-29.4-190.2
	c40.4-32,134.9,64.7,307.9,68.1c138.9,3,221.3-56.7,253-25c23.5,23.7-16.9,63.1-42.4,157.8c-37.7,139.8,16.5,182.8-25.5,233.2
	C13917.5,3094.4,13586.4,3068.1,13524.8,2955.6z"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 84) && (
            <rect
              x="13185.7"
              y="2576.7"
              fill={this.state.statusDoneTeeth.includes(84) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(84) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="1019.3"
              height="113.9"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 84) && (
            <rect
              x="13568.7"
              y="2517.7"
              fill={this.state.statusDoneTeeth.includes(84) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(84) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="351.6"
              height="232"
            />
          )}
          {this.isShownRedGraphic("whitening", "", 84) && (
            <polygon
              fill={this.state.statusDoneTeeth.includes(84) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(84) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              points="13946.5,2323.4 14028.4,2259.2 14029.6,2363.2 
	14115.9,2421.2 14017.4,2454.5 13988.9,2554.5 13926.8,2471.1 13822.8,2475 13883,2390.1 13847.2,2292.4 "
            />
          )}
          {this.isShownRedGraphic("hygiene", "", 84) && (
            <g>
              <g>
                <path
                  fill={this.state.statusDoneTeeth.includes(84) ? "#369661" : "#DE2527"}
                  d="M14134.8,2527.3l39.8-2.2c1.1-0.1,2.1-0.5,2.8-1.3s1.1-1.8,1.1-2.9l-3.1-143.4c0-2.2-1.9-3.9-4.1-3.8
			l-4,0.2l-0.6-27.9c0-1.1-0.5-2-1.2-2.8c-0.8-0.7-1.8-1.1-2.8-1l-8.4,0.5l-1.2-55.1l-26.5-24.6c-1.6-1.5-4.1-1.3-5.6,0.3
			c-1.5,1.6-1.5,4.2,0.1,5.6l24.1,22.4l1.1,51.8l-7.5,0.4c-2.2,0.1-3.9,2-3.9,4.2l0.6,27.9l-4,0.2c-2.1,0.1-3.9,2.1-3.9,4.2
			l3.1,143.4C14130.8,2525.8,14132.7,2527.5,14134.8,2527.3z M14159.5,2374.4l-15.9,0.9l-0.5-23.9l15.9-0.9L14159.5,2374.4z
			 M14138.7,2519.2l-2.9-135.5l4-0.2l0,0l23.9-1.3l0,0l4-0.2l2.9,135.5L14138.7,2519.2z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("diagnosis", "", 84) && (
            <g>
              <g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)">
                <path
                  fill={this.state.statusDoneTeeth.includes(84) ? "#369661" : "#DE2527"}
                  d="M134133.8-18245.3c56.3-221.1,225.5-424.2,423.3-507.1c19.8-8.1,36.6-16.6,37.9-18.6
			c1.3-2-14.5-99.7-35.4-216.3l-38-212.2l-33.3,7.3c-62.6,13.5-53.3,42.4-140.5-440.2c-42.2-235.7-75.6-436.4-74.2-447
			c0.8-11.7,6.3-23.2,13.7-30.6c14.2-13.8,253.4-77.2,278.3-73.4c12.8,1.8,19.4,6,26.4,17c4.8,8.1,44,208.2,86.4,445.6
			c88.5,494.2,87.4,455.5,13.2,476.6l-42.4,12.2l38.3,213.9l38.1,213l50.4-4.9c146.9-15.2,281.2,17.3,407,98.2
			c216.7,139.4,324.1,389.8,284.7,661.2c-37.1,253.5-200.1,472.8-432.1,581c-51.5,24.2-162.4,54.7-216.9,59.8
			c-120.5,11.4-240.7-7.8-340.5-55.5C134195.1-17600.1,134052.2-17923.6,134133.8-18245.3z M134586.7-17587.7
			c197.3,70.2,423.4,10.6,578.5-152c48.2-50,108.5-148.1,129.9-210.4c67.6-195.3,30.1-405.1-97.8-551.1
			c-45-51.2-143.2-115-211.2-136.5c-53.5-17.2-133.7-27.2-186.1-24.3c-47.8,2.9-142,26.2-189.6,47.3
			c-55.3,23.9-125.2,71.5-172.8,117.6c-54.7,53-122.4,159.3-146,228c-66.7,195.8-29.4,404.1,99.4,550.7
			C134429.4-17674.5,134528.5-17608,134586.7-17587.7z"
                />
                <path
                  fill={this.state.statusDoneTeeth.includes(84) ? "#369661" : "#DE2527"}
                  d="M134885.2-17641.8c61.1-17.3,100.8-35.6,150.3-69c169.1-114.9,257.1-322.2,220.6-519.1
			c-17.7-96.7-45.3-148.1-69.1-129.7c-12.1,9.5-12.1,23,2.4,55.3c20.3,46.1,34.9,139.3,31.1,194.9c-2.4,26.4-9.6,69.8-16.4,97
			c-12.3,45.1-17.3,54.8-62.3,124.8c-44.7,69.5-52.1,79-87.7,108.5c-52.2,43.9-105.5,71.9-171.7,91c-55.5,15.9-65.6,22.3-62.4,40.1
			C134823.2-17629.3,134837.2-17628.2,134885.2-17641.8z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("implantation", "", 84) && (
            <path
              fill={this.state.statusDoneTeeth.includes(84) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(84) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M13283.4,2864.8h894.2c53.5,0,97,65.2,97,145.5
	s-43.5,145.5-97,145.5h-328.2v66.2h165.6c34.1,0,61.5,41.6,61.5,92.3c0,51.2-27.7,92.3-61.5,92.3h-165.6v66.2h112.7
	c34.1,0,61.5,41.6,61.5,92.3c0,51.2-27.7,92.3-61.5,92.3h-112.7v66.2h59.9c34.1,0,61.5,41.6,61.5,92.3c0,51.2-27.7,92.3-61.5,92.3
	h-59.9v66.2h7.1c34.1,0,61.5,41.6,61.5,92.3c0,51.2-27.7,92.3-61.5,92.3h-251.9c-34.1,0-61.5-41.6-61.5-92.3
	c0-51.2,27.7-92.3,61.5-92.3h7.1v-66.2h-59.9c-34.1,0-61.5-41.6-61.5-92.3c0-51.2,27.7-92.3,61.5-92.3h59.9v-66.2h-112.7
	c-34.1,0-61.5-41.6-61.5-92.3c0-51.2,27.7-92.3,61.5-92.3h112.7v-66.2h-165.6c-34.1,0-61.5-41.6-61.5-92.3
	c0-51.2,27.7-92.3,61.5-92.3h165.6v-66.7h-328.2c-53.5,0-97-65.2-97-145.5C13186.8,2929.6,13229.9,2864.8,13283.4,2864.8z"
            />
          )}
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 84)
                ? (this.state.statusDoneTeeth.includes(84) ? "#369661" : "#DE2527")
                : this.checkImpacted(84) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(84) ? isMissing ? `M13064.9,1308.5L13064.9,1308.5
	c-9.7,30.1-78.4,99.7-83.2,129.6c-9.7,39.9-9.7,199.5,24.6,249.6c9.8,15.3,39,104.8,122.5,135c24.6,9.7,93.3,9.7,152.2,34.8
	c20,0,44.6,30.2,132.7,25.1c93.2,5.1,152.1-20,196.2-39.9c24.6-10.2,112.7,19.9,215.7-90c20-29.7,54.3-84.9,73.8-99.7
	c39-30.1,107.7-75.1,122.5-109.9c9.7-35.3,4.6-104.8-5.1-135c0-25-39.4-89.9-39.4-115c0-45-14.8-134.9-34.3-160
	c-49.2-89.5-156.8-164.7-206-184.6c-29.7-9.7-142.4-9.7-186.5,5.1c-19.5,9.7-58.9,39.9-78.4,39.9c-19.4,0-68.6-39.9-93.2-39.9
	c-117.9-4.6-250.5,84.9-314.1,180C13050.1,1168.9,13074.6,1283.4,13064.9,1308.5L13064.9,1308.5z` : '' : `M13064.9,1308.5L13064.9,1308.5
	c-9.7,30.1-78.4,99.7-83.2,129.6c-9.7,39.9-9.7,199.5,24.6,249.6c9.8,15.3,39,104.8,122.5,135c24.6,9.7,93.3,9.7,152.2,34.8
	c20,0,44.6,30.2,132.7,25.1c93.2,5.1,152.1-20,196.2-39.9c24.6-10.2,112.7,19.9,215.7-90c20-29.7,54.3-84.9,73.8-99.7
	c39-30.1,107.7-75.1,122.5-109.9c9.7-35.3,4.6-104.8-5.1-135c0-25-39.4-89.9-39.4-115c0-45-14.8-134.9-34.3-160
	c-49.2-89.5-156.8-164.7-206-184.6c-29.7-9.7-142.4-9.7-186.5,5.1c-19.5,9.7-58.9,39.9-78.4,39.9c-19.4,0-68.6-39.9-93.2-39.9
	c-117.9-4.6-250.5,84.9-314.1,180C13050.1,1168.9,13074.6,1283.4,13064.9,1308.5L13064.9,1308.5z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 84)
                ? (this.state.statusDoneTeeth.includes(84) ? "#369661" : "#DE2527")
                : this.checkImpacted(84) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(84) ? isMissing ? `M13815.5,1333.5c19.5,30.2,24.6,64.9,34.3,95.1
	c-9.7,10.2-19.5,19.9-34.3,30.2c0,14.8,5.1,30.2,5.1,45c0,5.1,0,14.8-5.1,19.9h-53.8v25.1h-73.8c-24.6-5.1-49.2-5.1-73.8-10.2
	c-5.1-5.1-19.5-5.1-34.3-5.1c-19.5,0-39.4,0-53.8,5.1c-34.3,14.8-68.7,34.8-103,50.1c-9.7,0-19.5,5.1-29.2,5.1
	c-9.7-5.1-19.5-10.2-24.6-14.8c-19.5-5.1-39.4-5.1-63.6-10.2c-44.1-50.1-29.2-90-5.1-149.8c9.7-14.8,24.6-30.2,49.2-34.8
	c0-30.2,0-59.8,14.8-84.9c14.8-14.8,39.4-14.8,73.8-14.8c0-10.2,0-25-5.1-34.8c9.7,5.1,24.6,5.1,34.3,10.2l88.1-14.8
	c29.2,14.8,53.8,25.1,83.5,39.9c19.5,0,39.4-5.1,58.9-5.1C13717.6,1283.4,13766.8,1278.3,13815.5,1333.5L13815.5,1333.5
	L13815.5,1333.5z` : '' : `M13815.5,1333.5c19.5,30.2,24.6,64.9,34.3,95.1
	c-9.7,10.2-19.5,19.9-34.3,30.2c0,14.8,5.1,30.2,5.1,45c0,5.1,0,14.8-5.1,19.9h-53.8v25.1h-73.8c-24.6-5.1-49.2-5.1-73.8-10.2
	c-5.1-5.1-19.5-5.1-34.3-5.1c-19.5,0-39.4,0-53.8,5.1c-34.3,14.8-68.7,34.8-103,50.1c-9.7,0-19.5,5.1-29.2,5.1
	c-9.7-5.1-19.5-10.2-24.6-14.8c-19.5-5.1-39.4-5.1-63.6-10.2c-44.1-50.1-29.2-90-5.1-149.8c9.7-14.8,24.6-30.2,49.2-34.8
	c0-30.2,0-59.8,14.8-84.9c14.8-14.8,39.4-14.8,73.8-14.8c0-10.2,0-25-5.1-34.8c9.7,5.1,24.6,5.1,34.3,10.2l88.1-14.8
	c29.2,14.8,53.8,25.1,83.5,39.9c19.5,0,39.4-5.1,58.9-5.1C13717.6,1283.4,13766.8,1278.3,13815.5,1333.5L13815.5,1333.5
	L13815.5,1333.5z`}
          />

          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 84)
                ? (this.state.statusDoneTeeth.includes(84) ? "#369661" : "#DE2527")
                : this.checkImpacted(84) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(84) ? isMissing ? `M13619.4,1538.1
	c34.3,10.2,122.9,15.3,142.4,10.2c9.7-5.2-5.1-14.9,0-25.1c9.7-5.1,39,5.1,53.8,0c9.7-5.1,0-39.8,0-64.9
	c5.1-10.3,34.3-10.3,34.3-30.2 M13756.2,1243.1c-4.7-14.9,5.1-34.8,14.8-34.8c14.9,0,93.3,0,103,5.1c5.1,5.2-4.6,20,5.1,25.1
	c10.2,5.1,29.7-5.1,39.4,0c4.7,5.1-5.1,70,19.5,70c14.8-5.1,24.6-35.3,39.4-50.1 M13595.6,1503.2c-39.4-14.9-73.8-49.6-83.5-79.8
	c-9.8-25-29.7-55.2-49.2-70c-9.8-14.8-14.4-34.8-19.5-54.7c0-15.3-9.7-30.2-9.7-50.1c63.6,29.7,83.1-10.2,122.5-5.1
	c34.3,9.7,58.9,29.7,78.4,39.9c14.9,5.1,49.2-14.8,68.7,0c14.4,9.8,9.7,79.8-5.1,124.8` : '' : `M13619.4,1538.1
	c34.3,10.2,122.9,15.3,142.4,10.2c9.7-5.2-5.1-14.9,0-25.1c9.7-5.1,39,5.1,53.8,0c9.7-5.1,0-39.8,0-64.9
	c5.1-10.3,34.3-10.3,34.3-30.2 M13756.2,1243.1c-4.7-14.9,5.1-34.8,14.8-34.8c14.9,0,93.3,0,103,5.1c5.1,5.2-4.6,20,5.1,25.1
	c10.2,5.1,29.7-5.1,39.4,0c4.7,5.1-5.1,70,19.5,70c14.8-5.1,24.6-35.3,39.4-50.1 M13595.6,1503.2c-39.4-14.9-73.8-49.6-83.5-79.8
	c-9.8-25-29.7-55.2-49.2-70c-9.8-14.8-14.4-34.8-19.5-54.7c0-15.3-9.7-30.2-9.7-50.1c63.6,29.7,83.1-10.2,122.5-5.1
	c34.3,9.7,58.9,29.7,78.4,39.9c14.9,5.1,49.2-14.8,68.7,0c14.4,9.8,9.7,79.8-5.1,124.8`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 84)
                ? (this.state.statusDoneTeeth.includes(84) ? "#369661" : "#DE2527")
                : this.checkImpacted(84) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(84) ? isMissing ? `M13555.8,1243.5l24.6-25.1
	c14.8-9.7-5.1-44.5,9.7-54.7c4.7-5.1,9.8-5.1,19.5-10.2c5.1-5.1,5.1-39.8,0-64.9` : '' : `M13555.8,1243.5l24.6-25.1
	c14.8-9.7-5.1-44.5,9.7-54.7c4.7-5.1,9.8-5.1,19.5-10.2c5.1-5.1,5.1-39.8,0-64.9`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 84)
                ? (this.state.statusDoneTeeth.includes(84) ? "#369661" : "#DE2527")
                : this.checkImpacted(84) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(84) ? isMissing ? `M13432.8,1252.7c0-9.8-5.1-24.6-14.8-34.8
	c-5.1-5.1-19.5-9.7-24.6-19.9c-9.8-19.9-9.8-54.7-19.5-54.7c-9.7-4.6-24.1-20-29.2-34.8` : '' : `M13432.8,1252.7c0-9.8-5.1-24.6-14.8-34.8
	c-5.1-5.1-19.5-9.7-24.6-19.9c-9.8-19.9-9.8-54.7-19.5-54.7c-9.7-4.6-24.1-20-29.2-34.8`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 84)
                ? (this.state.statusDoneTeeth.includes(84) ? "#369661" : "#DE2527")
                : this.checkImpacted(84) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(84) ? isMissing ? `M13300.6,1438.3c4.7-14.8,9.8-34.8,19.5-39.9
	c9.7-4.6,29.2-4.6,34.3-14.8s0-35.3,0-50.1c-4.6-10.2,5.1-39.9,24.6-45c19.5-10.2,39.4-10.2,58.9-5.1`: '' : `M13300.6,1438.3c4.7-14.8,9.8-34.8,19.5-39.9
	c9.7-4.6,29.2-4.6,34.3-14.8s0-35.3,0-50.1c-4.6-10.2,5.1-39.9,24.6-45c19.5-10.2,39.4-10.2,58.9-5.1`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 84)
                ? (this.state.statusDoneTeeth.includes(84) ? "#369661" : "#DE2527")
                : this.checkImpacted(84) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(84) ? isMissing ? `M13163.4,1588.6c4.6-10.3-19.5-14.9-24.6-25.1
	c-5.1-14.8-10.2-79.8-5.1-90c5.1-9.7,14.9-9.7,24.6-19.9c9.7-15.3-5.1-39.9,9.7-50.1c19.9-10.2,19.9-50.1,39.4-64.9
	c9.7-9.7,19.5-25.1,34.3-39.9c19.9-14.8,34.3,0,39.4-14.8c4.7-10.3-19.9-30.2-39.4-30.2c-29.7,0-34.3-30.2-58.9-45` : '' : `M13163.4,1588.6c4.6-10.3-19.5-14.9-24.6-25.1
	c-5.1-14.8-10.2-79.8-5.1-90c5.1-9.7,14.9-9.7,24.6-19.9c9.7-15.3-5.1-39.9,9.7-50.1c19.9-10.2,19.9-50.1,39.4-64.9
	c9.7-9.7,19.5-25.1,34.3-39.9c19.9-14.8,34.3,0,39.4-14.8c4.7-10.3-19.9-30.2-39.4-30.2c-29.7,0-34.3-30.2-58.9-45`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 84)
                ? (this.state.statusDoneTeeth.includes(84) ? "#369661" : "#DE2527")
                : this.checkImpacted(84) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={ this.checkMissing(84) ? isMissing ? `M13521.4,1538.6c-24.6,5.1-49.2,25.1-73.8,39.9
	c-14.4,9.7-44.1,19.9-53.8,19.9c-14.8,0-19.9-14.8-39.4-19.9c-20-5.1-49.2,5.1-49.2-5.1c0-14.9,34.4-29.7,49.2-34.8
	c53.9-55.2,44.1-75.2,68.7-95.1c29.7-14.8,24.6-70.1,39.4-90` : '' : `M13521.4,1538.6c-24.6,5.1-49.2,25.1-73.8,39.9
	c-14.4,9.7-44.1,19.9-53.8,19.9c-14.8,0-19.9-14.8-39.4-19.9c-20-5.1-49.2,5.1-49.2-5.1c0-14.9,34.4-29.7,49.2-34.8
	c53.9-55.2,44.1-75.2,68.7-95.1c29.7-14.8,24.6-70.1,39.4-90`}
          />
          {this.isShownRedGraphic("restoration", "Lingual", 84) && (
            <path
              fill={this.state.statusDoneTeeth.includes(84) ? "#369661" : "#DE2527"}
              d="M13735.9,1822.7c-10.6,18.4-37.1,0-95.5,12.2c-47.7,12.2-58.3,24.5-106.1,42.8
	c-26.5,6.1-63.6,12.2-111.4,12.2c-21.2,0-47.7,0-63.6-18.4c-26.5-36.7,21.2-97.9,31.8-214.1s-31.8-177.4-5.3-201.9
	c26.5-18.4,58.3,36.7,137.9,48.9c84.9,12.2,127.3-48.9,153.8-24.5s-15.9,73.4-5.3,165.2
	C13688.2,1743.2,13757.1,1792.1,13735.9,1822.7L13735.9,1822.7z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Medial", 84) && (
            <path
              fill={this.state.statusDoneTeeth.includes(84) ? "#369661" : "#DE2527"}
              d="M13982.7,1269.3c4.8,10.9,0,16.4,19.2,60c9.6,21.8,19.2,49.1,19.2,60c4.8,16.4,9.6,43.7,9.6,71
	c0,32.7,4.8,54.6-4.8,76.4c-14.4,38.2-48,65.5-81.7,71c-57.6,16.4-72.1-38.2-163.3-54.6c-72.1-16.4-100.9,5.5-120.1-21.8
	c-19.2-27.3,14.4-60,14.4-141.9c0-98.2-43.2-141.9-24-163.7c24-27.3,86.5,60,197,49.1C13901,1274.7,13963.5,1247.4,13982.7,1269.3
	L13982.7,1269.3z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Buccal", 84) && (
            <path
              fill={this.state.statusDoneTeeth.includes(84) ? "#369661" : "#DE2527"}
              d="M13367.9,947.3c28.2,0,84.5,49,107,49c33.8,0,28.2-24.5,90.1-49c28.2-12.3,45.1-12.3,73.2-12.3h84.5
	c16.9,18.4-28.2,85.8-45.1,177.8c-22.5,116.5,22.5,165.5-16.9,202.3c-16.9,18.4-56.3,18.4-135.2,18.4
	c-95.7-6.1-146.4-6.1-157.7-36.8c-16.9-36.8,67.6-73.6,67.6-153.2c5.6-98.1-107-183.9-95.7-202.3
	C13351,947.3,13356.6,947.3,13367.9,947.3L13367.9,947.3z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Distal", 84) && (
            <path
              fill={this.state.statusDoneTeeth.includes(84) ? "#369661" : "#DE2527"}
              d="M13066.8,1316.4c11.6-22.5-17.5-126,0-157.5c0-4.5,5.8-4.5,11.6-9c40.7-9,69.8,76.5,157.1,103.5
	c93.1,31.5,180.4-31.5,203.6-4.5c17.5,18-29.1,49.5-40.7,112.5c-11.6,81,58.2,130.5,34.9,148.5c-29.1,22.5-110.5-49.5-221.1-36
	c-128,13.5-209.4,126-244.4,108c-5.8-4.5-5.8-9-5.8-31.5c0-72-5.8-108,5.8-121.5C12997,1370.4,13037.7,1370.4,13066.8,1316.4
	L13066.8,1316.4z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Oclusial", 84) && (
            <path
              fill={this.state.statusDoneTeeth.includes(84) ? "#369661" : "#DE2527"}
              d="M13375.7,1370.3c0,34.4,15.5,63.8,15.5,63.8c10.3,14.7,20.6,29.5,15.5,49.1c0,4.9-5.2,9.8,0,14.7
	c5.2,4.9,10.3,4.9,15.5,4.9c25.8,0,67.1,34.4,123.8,39.3c51.6,4.9,77.4-19.6,108.3-19.6c5.2,0,15.5,0,15.5-4.9c5.2-4.9,0-9.8,0-9.8
	c-5.2-19.6,20.6-73.6,20.6-132.5c0-44.2-20.6-49.1-20.6-93.3c0-4.9,0-24.5-5.2-29.5c-10.3-4.9-20.6,0-31,4.9c-25.8,9.8-31,0-129,0
	c-41.3,0-51.6,0-67.1-4.9c-5.2-4.9-20.6-14.7-25.8-9.8c-5.2,0-5.2,9.8-5.2,14.7c-5.2,14.7-5.2,14.7-10.3,34.4
	C13380.9,1306.5,13370.5,1336,13375.7,1370.3L13375.7,1370.3z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 84) && (
            <path
              fill={this.state.statusDoneTeeth.includes(84) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(84) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M12980.8,1220.5h1034.5v152h-1034.5V1220.5z M12980.8,1623.8
	h1034.5v-152h-1034.5V1623.8z"
            />
          )}


          <path
            fill="#F2ECBE"
            onClick={() => {
              this.toggleSelectedNumber(83);
              this.props.onClick(83);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 83)
                ? (this.state.statusDoneTeeth.includes(83) ? "#369661" : "#DE2527")
                : this.checkImpacted(83) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(83) ? isMissing ? `M14767.1,2810.6
	c88.6,122,38.5,1280.4-127.1,1255.3c-23.2-4.2-158.2-25-173.5-345.1c-11.6-202.3-53.8-737.1,23.2-888.8l119.7-71.4L14767.1,2810.6
	L14767.1,2810.6z` : "" : `M14767.1,2810.6
	c88.6,122,38.5,1280.4-127.1,1255.3c-23.2-4.2-158.2-25-173.5-345.1c-11.6-202.3-53.8-737.1,23.2-888.8l119.7-71.4L14767.1,2810.6
	L14767.1,2810.6z`}
          />
          <path
            fill={conditionToColor(this.props.teeth[83].condition)}
            onClick={() => {
              this.toggleSelectedNumber(83);
              this.props.onClick(83);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 83)
                ? (this.state.statusDoneTeeth.includes(83) ? "#369661" : "#DE2527")
                : this.checkImpacted(83) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(83) ? isMissing ? `M14895.1,2273.9c-26-38-189.7-155.4-257-155.4
	c-71,0-201.3,114.1-271.8,204.1c-89.5,131.3,11.1,200.4,74.2,317.8c18.6,34.8,0,166.1,48.2,217.6c52,34.8,216.2,52,294.1-7
	c18.6-41.3,18.6-83,22.3-128C14809.8,2636.7,14981,2346.3,14895.1,2273.9L14895.1,2273.9L14895.1,2273.9z`: '' : `M14895.1,2273.9c-26-38-189.7-155.4-257-155.4
	c-71,0-201.3,114.1-271.8,204.1c-89.5,131.3,11.1,200.4,74.2,317.8c18.6,34.8,0,166.1,48.2,217.6c52,34.8,216.2,52,294.1-7
	c18.6-41.3,18.6-83,22.3-128C14809.8,2636.7,14981,2346.3,14895.1,2273.9L14895.1,2273.9L14895.1,2273.9z`}
          />
          {this.isShownRedGraphic("rootCanal", "", 83) && (
            <path
              fill={this.state.statusDoneTeeth.includes(83) ? "#369661" : "#DE2527"}
              d="M14675.4,3968.6c4.9,0-9.9-169.5-19.8-444.3c-9.9-187.8-9.9-247.4-9.9-288.6c0-155.7,0-238.2,9.9-256.5
	c0-9.2,24.7-68.7,4.9-91.6c-4.9-4.6-14.8-9.2-24.7-27.5c-9.9-13.7-9.9-18.3-14.8-18.3c-9.9-4.6-29.7,27.5-34.6,55
	c-4.9,45.8,19.8,77.9,24.7,91.6c4.9,105.4,9.9,187.8,9.9,242.8c0,0,9.9,471.8,44.5,687.1c0,13.7,4.9,32.1,4.9,32.1
	C14670.4,3964,14675.4,3968.6,14675.4,3968.6L14675.4,3968.6z"
            />
          )}
          {this.isShownRedGraphic("rootCanal", "Post and Core", 83) && (
            <path
              id="egXMLID_18_"
              fill={this.state.statusDoneTeeth.includes(83) ? "#369661" : "#DE2527"}
              d="M14707.3,3068.1c-16.3-132.9-0.6-234.9,16.3-302.6c23.8-94.5,65.7-185.9,33.7-203.6
	c-20.9-11.6-48.3,23.2-114,25.8c-78.5,2.5-118.6-45.5-141.3-31.3c-29.7,18.2,22.1,108.6,50,207.1c20.3,72.2,34.3,173.3,9.9,303.6
	C14610.2,3067.1,14659,3067.6,14707.3,3068.1L14707.3,3068.1z"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 83) && (
            <rect
              x="14444.5"
              y="2546.1"
              fill={this.state.statusDoneTeeth.includes(83) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(83) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="394.2"
              height="113.9"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 83) && (
            <rect
              x="14509.1"
              y="2510.3"
              fill={this.state.statusDoneTeeth.includes(83) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(83) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="265.8"
              height="193.2"
            />
          )}
          {this.isShownRedGraphic("whitening", "", 83) && (
            <polygon
              fill={this.state.statusDoneTeeth.includes(83) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(83) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              points="14565.8,2227.5 14619,2267.9 14616.6,2334.6 
	14670.5,2296.5 14732.7,2320.1 14712.9,2256.2 14753.7,2204.1 14687.5,2202.6 14650.5,2146.8 14629.4,2209.9 "
            />
          )}
          {this.isShownRedGraphic("hygiene", "", 83) && (
            <g>
              <g>
                <path
                  fill={this.state.statusDoneTeeth.includes(83) ? "#369661" : "#DE2527"}
                  d="M14817.2,2506l39.8-2.2c1.1-0.1,2.1-0.5,2.8-1.3s1.1-1.8,1.1-2.9l-3.1-143.4c0-2.2-1.9-3.9-4.1-3.8l-4,0.2
			l-0.6-27.9c0-1.1-0.5-2-1.2-2.8c-0.8-0.7-1.8-1.1-2.8-1l-8.4,0.5l-1.2-55.1l-26.5-24.6c-1.6-1.5-4.1-1.3-5.6,0.3
			c-1.5,1.6-1.5,4.2,0.1,5.6l24.1,22.4l1.1,51.8l-7.5,0.4c-2.2,0.1-3.9,2-3.9,4.2l0.6,27.9l-4,0.2c-2.1,0.1-3.9,2.1-3.9,4.2
			l3.1,143.4C14813.2,2504.4,14815,2506.1,14817.2,2506z M14841.8,2353.1l-15.9,0.9l-0.5-23.9l15.9-0.9L14841.8,2353.1z
			 M14821,2497.8l-2.9-135.5l4-0.2c0,0,0,0,0,0l23.9-1.3l0,0l4-0.2l2.9,135.5L14821,2497.8z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("diagnosis", "", 83) && (
            <g>
              <g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)">
                <path
                  fill={this.state.statusDoneTeeth.includes(83) ? "#369661" : "#DE2527"}
                  d="M144615.4-17866.2c34.9-152,151-288.7,290.5-341.3c14-5.1,25.8-10.6,26.7-12c0.9-1.4-12.8-69.4-30.6-150.8
			l-32.4-148.1l-23.7,4.2c-44.5,7.8-37.1,28.1-111.3-308.6c-35.9-164.5-64.7-304.5-64-311.7c0.3-8.1,3.9-15.9,9.1-20.9
			c9.8-9.2,179.5-47.4,197.3-44.1c9.2,1.6,14,4.7,19.3,12.4c3.6,5.7,36.5,145.4,72.7,311c75.3,344.8,73.6,317.9,21,330.8l-30,7.4
			l32.6,149.2l32.5,148.7l36-2.2c104.8-7,201.6,18.9,293.6,78c158.5,101.9,241.4,278.1,219.8,465.4
			c-20.4,174.9-131.7,323-295.1,392.3c-36.3,15.5-114.9,34-153.8,36.2c-86,5-172.4-11.3-245-46.8
			C144675-17417.4,144564.8-17645.2,144615.4-17866.2z M144955.5-17399.3c142.9,53.5,303.2,17.6,410.3-91.3
			c33.2-33.5,74.1-100.1,87.9-142.7c43.6-133.7,11.7-280.1-83.4-384.5c-33.5-36.6-105.2-83.2-154.5-99.8
			c-38.7-13.2-96.3-22.1-133.8-21.4c-34.1,0.9-101,14.7-134.5,28.2c-39,15.2-87.8,46.5-120.8,77.3c-37.9,35.4-83.7,107.5-98.9,154.6
			c-42.9,134.2-11.2,279.5,84.5,384.3C144840.8-17463.3,144913.3-17414.8,144955.5-17399.3z"
                />
                <path
                  fill={this.state.statusDoneTeeth.includes(83) ? "#369661" : "#DE2527"}
                  d="M145167.7-17429.5c43.3-10.5,71.3-22.2,105.8-44.2c118.2-75.6,176.1-217.1,145.2-354.6
			c-15-67.5-36-103.8-52.6-91.6c-8.4,6.3-8.1,15.7,3.1,38.4c15.7,32.4,28.4,97.4,27,135.9c-1,18.3-5.2,48.2-9.4,66.9
			c-7.7,31-11,37.6-41.5,85c-30.3,47.1-35.4,53.5-60.1,73.1c-36.3,29.2-73.8,47.3-120.7,58.9c-39.4,9.7-46.4,13.9-43.7,26.3
			C145123.7-17422.4,145133.7-17421.2,145167.7-17429.5z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("implantation", "", 83) && (
            <path
              fill={this.state.statusDoneTeeth.includes(83) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(83) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M14351.1,2832.8h559.8c33.5,0,60.7,71,60.7,158.3
	c0,87.3-27.2,158.3-60.7,158.3h-205.5v72h103.6c21.4,0,38.5,45.2,38.5,100.4c0,55.7-17.3,100.4-38.5,100.4h-103.6v72h70.6
	c21.4,0,38.5,45.2,38.5,100.4c0,55.7-17.3,100.4-38.5,100.4h-70.6v72h37.5c21.4,0,38.5,45.2,38.5,100.4
	c0,55.7-17.3,100.4-38.5,100.4h-37.5v72h4.4c21.4,0,38.5,45.2,38.5,100.4c0,55.7-17.3,100.4-38.5,100.4h-157.7
	c-21.4,0-38.5-45.2-38.5-100.4c0-55.7,17.3-100.4,38.5-100.4h4.4v-72h-37.5c-21.4,0-38.5-45.2-38.5-100.4
	c0-55.7,17.3-100.4,38.5-100.4h37.5v-72h-70.6c-21.4,0-38.5-45.2-38.5-100.4c0-55.7,17.3-100.4,38.5-100.4h70.6v-72H14453
	c-21.4,0-38.5-45.2-38.5-100.4c0-55.7,17.3-100.4,38.5-100.4h103.6v-72.6h-205.5c-33.5,0-60.7-71-60.7-158.3
	C14290.6,2903.2,14317.7,2832.8,14351.1,2832.8z"
            />
          )}
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 83)
                ? (this.state.statusDoneTeeth.includes(83) ? "#369661" : "#DE2527")
                : this.checkImpacted(83) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(83) ? isMissing ? `M14779.4,1298.7L14779.4,1298.7
	c24.1,46.8,20,110.9,3.3,144.8c-36.2,63.6-72.4,127.6-116.9,178.6c-32.5,29.7-121.1,106.2-137.3,110.4c-32,8.4-165.6,13-201.8,0
	c-44.5-17.2-112.7-157.7-133.1-217.1c-12-55.2-19.9-119.2,4.2-178.6c12-51,44.5-115,72.8-148.9c44.5-59.4,89-89.1,153.5-127.6
	c32.4-17.2,89-25.5,129.4,0C14625.8,1120.1,14763.2,1273.2,14779.4,1298.7L14779.4,1298.7z` : '' : `M14779.4,1298.7L14779.4,1298.7
	c24.1,46.8,20,110.9,3.3,144.8c-36.2,63.6-72.4,127.6-116.9,178.6c-32.5,29.7-121.1,106.2-137.3,110.4c-32,8.4-165.6,13-201.8,0
	c-44.5-17.2-112.7-157.7-133.1-217.1c-12-55.2-19.9-119.2,4.2-178.6c12-51,44.5-115,72.8-148.9c44.5-59.4,89-89.1,153.5-127.6
	c32.4-17.2,89-25.5,129.4,0C14625.8,1120.1,14763.2,1273.2,14779.4,1298.7L14779.4,1298.7z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 83)
                ? (this.state.statusDoneTeeth.includes(83) ? "#369661" : "#DE2527")
                : this.checkImpacted(83) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(83) ? isMissing ? `M14666.2,1333L14666.2,1333
	c12.1,38.1-4.2,51-16.3,71.9c-28.3,12.5-80.7,42.7-104.8,25.5c-32.5,4.2-64.5-25.5-56.6-144.7c0-38.1-20.4-157.3,7.9-182.8
	c77,55.2,68.7,46.8,84.9,144.7c28.3,21.4,28.3,34.4,56.6,42.7C14650,1299.1,14662,1307.5,14666.2,1333L14666.2,1333z M14412,1247.7
	c-20.4-33.9-89.1-33.9-97-16.7c-12.5,8.3-16.2,21.3-20.4,25.5c-20,29.6-32,46.8-36.2,76.5c8.3,29.7,32.4,17.2,44.5,42.7
	c8.3,13,4.2,29.7,20.4,46.9c28.3,25.5,64.5,17.2,92.8,4.2c3.7-8.8,7.9-21.4,7.9-42.7c0-17.2-20.4-8.8-28.3-17.2
	c-12-17.1-3.7-46.8,4.2-64C14404.1,1294.6,14428.2,1264.9,14412,1247.7L14412,1247.7z` : '' : `M14666.2,1333L14666.2,1333
	c12.1,38.1-4.2,51-16.3,71.9c-28.3,12.5-80.7,42.7-104.8,25.5c-32.5,4.2-64.5-25.5-56.6-144.7c0-38.1-20.4-157.3,7.9-182.8
	c77,55.2,68.7,46.8,84.9,144.7c28.3,21.4,28.3,34.4,56.6,42.7C14650,1299.1,14662,1307.5,14666.2,1333L14666.2,1333z M14412,1247.7
	c-20.4-33.9-89.1-33.9-97-16.7c-12.5,8.3-16.2,21.3-20.4,25.5c-20,29.6-32,46.8-36.2,76.5c8.3,29.7,32.4,17.2,44.5,42.7
	c8.3,13,4.2,29.7,20.4,46.9c28.3,25.5,64.5,17.2,92.8,4.2c3.7-8.8,7.9-21.4,7.9-42.7c0-17.2-20.4-8.8-28.3-17.2
	c-12-17.1-3.7-46.8,4.2-64C14404.1,1294.6,14428.2,1264.9,14412,1247.7L14412,1247.7z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 83)
                ? (this.state.statusDoneTeeth.includes(83) ? "#369661" : "#DE2527")
                : this.checkImpacted(83) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(83) ? isMissing ? `M14492.7,1367.4c3.7-89.6-12.5-259.8,7.9-264
	c12.1,0,52.4,42.2,64.5,59.4c16.2,16.7,8.3,63.6,20.4,84.9` : '' : `M14492.7,1367.4c3.7-89.6-12.5-259.8,7.9-264
	c12.1,0,52.4,42.2,64.5,59.4c16.2,16.7,8.3,63.6,20.4,84.9`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 83)
                ? (this.state.statusDoneTeeth.includes(83) ? "#369661" : "#DE2527")
                : this.checkImpacted(83) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(83) ? isMissing ? `M14302.9,1371.5c-4.2-8.3-12.5-17.1-20.4-21.3
	c-7.9-4.2-19.9-8.8-24.1-17.2c-4.2-8.3,12-38,16.2-51c4.2-8.3,32.5-51,40.4-55.2s44.6-4.2,68.7,0` : '' : `M14302.9,1371.5c-4.2-8.3-12.5-17.1-20.4-21.3
	c-7.9-4.2-19.9-8.8-24.1-17.2c-4.2-8.3,12-38,16.2-51c4.2-8.3,32.5-51,40.4-55.2s44.6-4.2,68.7,0`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 83)
                ? (this.state.statusDoneTeeth.includes(83) ? "#369661" : "#DE2527")
                : this.checkImpacted(83) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(83) ? isMissing ? `M14383.2,1430.6c12.1,0,28.3,0,32.5-8.4
	s8.4-42.7,4.2-46.9c-3.7-8.4-16.2,0-24.1-8.4c-4.2-13-4.2-46.9,0-68.2` : '' : `M14383.2,1430.6c12.1,0,28.3,0,32.5-8.4
	s8.4-42.7,4.2-46.9c-3.7-8.4-16.2,0-24.1-8.4c-4.2-13-4.2-46.9,0-68.2`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 83)
                ? (this.state.statusDoneTeeth.includes(83) ? "#369661" : "#DE2527")
                : this.checkImpacted(83) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(83) ? isMissing ? `M14548.8,1430.9c20.4,0,48.7,0,60.8-4.2
	c7.9-4.6,40.3-17.2,52.4-38.5c8.4-12.5,4.2-38,4.2-51` : '' : `M14548.8,1430.9c20.4,0,48.7,0,60.8-4.2
	c7.9-4.6,40.3-17.2,52.4-38.5c8.4-12.5,4.2-38,4.2-51`}
          />

          {this.isShownRedGraphic("restoration", "Distal", 83) && (
            <path
              fill={this.state.statusDoneTeeth.includes(83) ? "#369661" : "#DE2527"}
              d="M14386.6,1089.9c-42.2,27.3-105.4,77.4-152.9,150.2c-21.1,31.9-31.6,59.2-42.2,86.5
	c-31.6,95.6-10.5,173-5.3,191.2c21.1,86.5,73.8,145.6,105.4,173c42.2-59.2,100.2-163.9,116-304.9
	C14423.5,1258.3,14402.4,1153.6,14386.6,1089.9L14386.6,1089.9z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Buccal", 83) && (
            <path
              fill={this.state.statusDoneTeeth.includes(83) ? "#369661" : "#DE2527"}
              d="M14551.4,1051.8c-49.5-20.9-107.3,4.2-115.5,8.4c-8.3,4.2-20.6,12.6-33,16.8c-20.6,12.6-33,20.9-45.4,29.3
	c12.4,37.7,20.6,83.8,24.8,138.2c4.1,67,0,121.5-8.3,167.6c33,4.2,70.1,8.4,111.4,12.6c33,4.2,66,4.2,94.9,4.2
	c0-54.5,0-117.3,12.4-188.5c8.3-50.3,20.6-92.2,28.9-129.9c-8.3-8.4-16.5-16.8-28.9-25.1
	C14580.2,1072.7,14567.9,1060.2,14551.4,1051.8z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Medial", 83) && (
            <path
              fill={this.state.statusDoneTeeth.includes(83) ? "#369661" : "#DE2527"}
              d="M14780.8,1299.5c-4.5-4.4-13.6-21.9-27.2-35c-9.1-13.1-18.2-21.9-45.4-48.1l-68.1-65.6
	c-18.2-17.5-31.8-30.6-45.4-39.4c-18.2,65.6-40.8,148.7-45.4,253.7c-4.5,131.2,18.2,240.6,36.3,319.3l68.1-52.5
	c49.9-52.5,90.8-118.1,131.6-183.7C14799,1426.4,14812.6,1347.6,14780.8,1299.5L14780.8,1299.5z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Lingual", 83) && (
            <path
              fill={this.state.statusDoneTeeth.includes(83) ? "#369661" : "#DE2527"}
              d="M14283.7,1671.8c8.4,15.5,21,36.3,42,51.8c12.6,10.4,25.2,15.5,109.1,15.5c67.2,0,83.9,0,100.7-10.4
	c25.2-10.4,46.2-25.9,50.4-31.1c12.6-10.4,25.2-25.9,33.6-36.3c-12.6-51.8-25.2-114-33.6-181.3c-4.2-41.4-4.2-77.7-4.2-108.8
	c-29.4,0-63,0-96.5-5.2c-37.8,0-75.5-5.2-113.3-10.4c-4.2,41.4-12.6,93.2-29.4,145C14329.9,1568.2,14304.7,1625.2,14283.7,1671.8
	L14283.7,1671.8z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 83) && (
            <path
              fill={this.state.statusDoneTeeth.includes(83) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(83) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M14173.3,1207.8h639.7v152h-639.7V1207.8z M14173.3,1611.1h639.7
	v-152h-639.7V1611.1z"
            />
          )}

          <path
            fill="#F2ECBE"
            onClick={() => {
              this.toggleSelectedNumber(82);
              this.props.onClick(82);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 82)
                ? (this.state.statusDoneTeeth.includes(82) ? "#369661" : "#DE2527")
                : this.checkImpacted(82) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(82) ? isMissing ? `M15348.2,2833.8
	c26.4,258.9,30.6,658.7-45.9,988.1c-60.8,287.2-91.4,475-175.4,32.9c-22.7-197.6-125.7-531.6-38-964.4l103-141L15348.2,2833.8
	L15348.2,2833.8z` : "" : `M15348.2,2833.8
	c26.4,258.9,30.6,658.7-45.9,988.1c-60.8,287.2-91.4,475-175.4,32.9c-22.7-197.6-125.7-531.6-38-964.4l103-141L15348.2,2833.8
	L15348.2,2833.8z`}
          />
          <path
            fill={conditionToColor(this.props.teeth[82].condition)}
            onClick={() => {
              this.toggleSelectedNumber(82);
              this.props.onClick(82);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 82)
                ? (this.state.statusDoneTeeth.includes(82) ? "#369661" : "#DE2527")
                : this.checkImpacted(82) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(82) ? isMissing ? `M15460.9,2295.7c0-53.8-45-140.6-90-154.9
	c-22.7-14.4-59.8,10.7-97.4,18.1c-59.8,18.1-150.3,28.8-217.6,32.5c-199,104.4-41.3,561.8,22.7,698.6c3.7,3.7,7.4,10.7,11.1,14.4
	c26.4,18.1,225,7.4,251.4-50.6C15356.1,2861.2,15438.6,2490.5,15460.9,2295.7z` : '' : `M15460.9,2295.7c0-53.8-45-140.6-90-154.9
	c-22.7-14.4-59.8,10.7-97.4,18.1c-59.8,18.1-150.3,28.8-217.6,32.5c-199,104.4-41.3,561.8,22.7,698.6c3.7,3.7,7.4,10.7,11.1,14.4
	c26.4,18.1,225,7.4,251.4-50.6C15356.1,2861.2,15438.6,2490.5,15460.9,2295.7z`}
          />
          {this.isShownRedGraphic("rootCanal", "", 82) && (
            <path
              fill={this.state.statusDoneTeeth.includes(82) ? "#369661" : "#DE2527"}
              d="M15250.6,3950.5c4.9,0-9.9-169.5-19.8-444.3c-9.9-187.8-9.9-247.4-9.9-288.6c0-155.7,0-238.2,9.9-256.5
	c0-9.2,24.7-68.7,4.9-91.6c-4.9-4.6-14.8-9.2-24.7-27.5c-9.9-13.7-9.9-18.3-14.8-18.3c-9.9-4.6-29.7,27.5-34.6,55
	c-4.9,45.8,19.8,77.9,24.7,91.6c4.9,105.4,9.9,187.8,9.9,242.8c0,0,9.9,471.8,44.5,687.1c0,13.7,4.9,32.1,4.9,32.1
	C15245.6,3945.9,15250.6,3950.5,15250.6,3950.5L15250.6,3950.5z"
            />
          )}
          {this.isShownRedGraphic("rootCanal", "Post and Core", 82) && (
            <path
              id="egXMLID_17_"
              fill={this.state.statusDoneTeeth.includes(82) ? "#369661" : "#DE2527"}
              d="M15282.5,3050.1c-16.3-132.9-0.6-234.9,16.3-302.6c23.8-94.5,65.7-185.9,33.7-203.6
	c-20.9-11.6-48.3,23.2-114,25.8c-78.5,2.5-118.6-45.5-141.3-31.3c-29.7,18.2,22.1,108.6,50,207.1c20.3,72.2,34.3,173.3,9.9,303.6
	C15185.4,3049.1,15234.2,3049.6,15282.5,3050.1L15282.5,3050.1z"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 82) && (
            <rect
              x="14999.8"
              y="2568.3"
              fill={this.state.statusDoneTeeth.includes(82) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(82) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="391.5"
              height="113.9"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 82) && (
            <rect
              x="15047.1"
              y="2528.1"
              fill={this.state.statusDoneTeeth.includes(82) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(82) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="296.9"
              height="194.2"
            />
          )}
          {this.isShownRedGraphic("whitening", "", 82) && (
            <polygon
              fill={this.state.statusDoneTeeth.includes(82) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(82) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              points="15295.6,2220.8 15330.5,2249.1 15330.3,2293.9 
	15364.1,2269.3 15404.5,2286.4 15390.5,2243 15415.7,2208.6 15373.2,2206.4 15348.4,2168.1 15336.1,2210.2 "
            />
          )}
          {this.isShownRedGraphic("hygiene", "", 82) && (
            <g>
              <g>
                <path
                  fill={this.state.statusDoneTeeth.includes(82) ? "#369661" : "#DE2527"}
                  d="M15053.9,2486.6l39.8-2.2c1.1-0.1,2.1-0.5,2.8-1.3c0.7-0.8,1.1-1.8,1.1-2.9l-3.1-143.4
			c0-2.2-1.9-3.9-4.1-3.8l-4,0.2l-0.6-27.9c0-1.1-0.5-2-1.2-2.8c-0.8-0.7-1.8-1.1-2.8-1l-8.4,0.5l-1.2-55.1l-26.5-24.6
			c-1.6-1.5-4.1-1.3-5.6,0.3c-1.5,1.6-1.5,4.2,0.1,5.6l24.1,22.4l1.1,51.8l-7.5,0.4c-2.2,0.1-3.9,2-3.9,4.2l0.6,27.9l-4,0.2
			c-2.1,0.1-3.9,2.1-3.9,4.2l3.1,143.4C15049.9,2485,15051.7,2486.7,15053.9,2486.6z M15078.6,2333.6l-15.9,0.9l-0.5-23.9l15.9-0.9
			L15078.6,2333.6z M15057.8,2478.4l-2.9-135.5l4-0.2c0,0,0,0,0,0l23.9-1.3l0,0l4-0.2l2.9,135.5L15057.8,2478.4z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("diagnosis", "", 82) && (
            <g>
              <g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)">
                <path
                  fill={this.state.statusDoneTeeth.includes(82) ? "#369661" : "#DE2527"}
                  d="M151433.9-17521.5c42.8-162.8,167.4-313.3,311.7-375.9c14.5-6.1,26.7-12.5,27.7-14
			c1-1.5-9.6-73-23.8-158.4l-25.7-155.4l-24.2,5.6c-45.6,10.5-39,31.6-98.1-321.8c-28.5-172.6-51-319.6-49.9-327.4
			c0.7-8.6,4.8-17.1,10.2-22.6c10.4-10.3,184.6-58.9,202.6-56.3c9.3,1.2,14,4.3,19,12.2c3.4,5.9,30.1,152.4,58.8,326.2
			c59.8,361.9,59.4,333.5,5.3,349.6l-30.9,9.3l25.9,156.6l25.8,156l36.6-4c106.8-12.5,203.9,10.2,294.5,68.5
			c156.1,100.3,231.8,283.2,200.8,482.7c-29.2,186.4-149.4,348.7-318.8,430.2c-37.6,18.2-118.3,41.6-158,45.8
			c-87.6,9.4-174.6-3.6-246.7-37.7C151472.7-17048.6,151371.8-17284.7,151433.9-17521.5z M151756.8-17043
			c142.5,49.8,307.2,4,421.3-116.7c35.4-37.2,80.1-109.7,96.2-155.5c50.8-143.9,25.4-297.5-66.1-403.6
			c-32.2-37.2-102.9-83.1-152.1-98.3c-38.7-12.2-96.8-18.8-134.9-16.2c-34.7,2.6-103.3,20.5-138,36.4
			c-40.4,18.1-91.5,53.6-126.5,87.8c-40.2,39.4-90.3,118-108,168.6c-50.1,144.3-24.9,296.8,67.3,403.2
			C151643.4-17105.3,151714.7-17057.3,151756.8-17043z"
                />
                <path
                  fill={this.state.statusDoneTeeth.includes(82) ? "#369661" : "#DE2527"}
                  d="M151973.8-17085.3c44.5-13.3,73.5-27,109.7-52c123.8-85.8,189.4-238.7,164.7-382.9
			c-12-70.8-31.5-108.3-49-94.6c-8.9,7-9,17,1.3,40.6c14.3,33.6,24.1,101.9,20.9,142.8c-2,19.4-7.6,51.3-12.8,71.3
			c-9.4,33.2-13,40.4-46.3,92.2c-33,51.4-38.5,58.5-64.6,80.4c-38.3,32.7-77.2,53.7-125.5,68.3c-40.5,12.2-47.8,17-45.7,30
			C151928.8-17075.5,151938.9-17074.8,151973.8-17085.3z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("implantation", "", 82) && (
            <path
              fill={this.state.statusDoneTeeth.includes(82) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(82) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M15021.6,2816.8h390.9c23.4,0,42.4,71.4,42.4,159.2
	s-19,159.2-42.4,159.2H15269v72.5h72.4c14.9,0,26.9,45.5,26.9,101c0,56.1-12.1,101-26.9,101h-72.4v72.5h49.3
	c14.9,0,26.9,45.5,26.9,101c0,56.1-12.1,101-26.9,101h-49.3v72.5h26.2c14.9,0,26.9,45.5,26.9,101c0,56.1-12.1,101-26.9,101h-26.2
	v72.5h3.1c14.9,0,26.9,45.5,26.9,101c0,56.1-12.1,101-26.9,101H15162c-14.9,0-26.9-45.5-26.9-101c0-56.1,12.1-101,26.9-101h3.1
	v-72.5h-26.2c-14.9,0-26.9-45.5-26.9-101c0-56.1,12.1-101,26.9-101h26.2v-72.5h-49.3c-14.9,0-26.9-45.5-26.9-101
	c0-56.1,12.1-101,26.9-101h49.3v-72.5h-72.4c-14.9,0-26.9-45.5-26.9-101c0-56.1,12.1-101,26.9-101h72.4v-73h-143.5
	c-23.4,0-42.4-71.4-42.4-159.2C14979.4,2887.6,14998.3,2816.8,15021.6,2816.8z"
            />
          )}
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 82)
                ? (this.state.statusDoneTeeth.includes(82) ? "#369661" : "#DE2527")
                : this.checkImpacted(82) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(82) ? isMissing ? `M15246.5,1068.4c-40.8-28.8-90-24.2-116.4-9.4
	c-90,86.8-184.2,187.9-265.4,298.8c-31.5,43.2-22.7,101.2-4.6,149.4c58.5,125.3,153.1,183.3,206.9,207.4
	c76.5,14.4,220.3,9.8,260.7-9.7s116.9-101.2,130.4-149.4c26.9-82.1,0-183.3-13.5-207.4c-13.5-24.1-71.9-71.9-85.4-91.4
	c-13.4-24.1-22.2-48.2-31.5-82.1C15318.4,1140.8,15273.4,1082.8,15246.5,1068.4L15246.5,1068.4z` : '' : `M15246.5,1068.4c-40.8-28.8-90-24.2-116.4-9.4
	c-90,86.8-184.2,187.9-265.4,298.8c-31.5,43.2-22.7,101.2-4.6,149.4c58.5,125.3,153.1,183.3,206.9,207.4
	c76.5,14.4,220.3,9.8,260.7-9.7s116.9-101.2,130.4-149.4c26.9-82.1,0-183.3-13.5-207.4c-13.5-24.1-71.9-71.9-85.4-91.4
	c-13.4-24.1-22.2-48.2-31.5-82.1C15318.4,1140.8,15273.4,1082.8,15246.5,1068.4L15246.5,1068.4z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 82)
                ? (this.state.statusDoneTeeth.includes(82) ? "#369661" : "#DE2527")
                : this.checkImpacted(82) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(82) ? isMissing ? `M15233,1145.4c-13.5-24.1-36.2-33.9-49.6-33.9
	c-31.5,0-45,28.8-45,72.4c0,9.7,0,24.1-4.6,33.9c-26.9,4.6-36.2,19.5-22.3,52.9c-26.9,9.7-53.8,14.4-81.2,9.7
	c-18.1,0-36.2,28.8-53.8,52.9c-26.9,33.9-22.3,72.4-18.1,110.9c8.8,14.4,8.8,28.8,49.6,28.8c22.3-14.4,26.9-28.8,31.5-33.9
	c26.9,0,53.8-4.6,81.2-4.6c18.1-4.6,31.5-9.7,45-14.4c22.3-4.6,45-9.7,63.1-9.7c45,9.7,116.9,86.7,139.6,9.7v-28.8
	c0-38.5-18.1-52.9-40.4-67.3c0-19.5-4.6-33.9-4.6-52.9c-18.1-14.4-31.5-24.1-49.6-38.5c0-14.4,0-24.1-4.6-38.5
	C15255.3,1179.2,15246.5,1159.8,15233,1145.4L15233,1145.4L15233,1145.4z` : '' : `M15233,1145.4c-13.5-24.1-36.2-33.9-49.6-33.9
	c-31.5,0-45,28.8-45,72.4c0,9.7,0,24.1-4.6,33.9c-26.9,4.6-36.2,19.5-22.3,52.9c-26.9,9.7-53.8,14.4-81.2,9.7
	c-18.1,0-36.2,28.8-53.8,52.9c-26.9,33.9-22.3,72.4-18.1,110.9c8.8,14.4,8.8,28.8,49.6,28.8c22.3-14.4,26.9-28.8,31.5-33.9
	c26.9,0,53.8-4.6,81.2-4.6c18.1-4.6,31.5-9.7,45-14.4c22.3-4.6,45-9.7,63.1-9.7c45,9.7,116.9,86.7,139.6,9.7v-28.8
	c0-38.5-18.1-52.9-40.4-67.3c0-19.5-4.6-33.9-4.6-52.9c-18.1-14.4-31.5-24.1-49.6-38.5c0-14.4,0-24.1-4.6-38.5
	C15255.3,1179.2,15246.5,1159.8,15233,1145.4L15233,1145.4L15233,1145.4z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 82)
                ? (this.state.statusDoneTeeth.includes(82) ? "#369661" : "#DE2527")
                : this.checkImpacted(82) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(82) ? isMissing ? `M15368.4,1420.5c0-19.5,0-48.2-4.6-62.6
	c-4.7-14.4-31.6-19.5-36.2-33.9c-4.6-19,0-43.2-4.6-52.9c-9.2-9.8-45-24.2-49.6-33.9c-4.6-14.4,4.6-28.8,0-38.5
	c-13.5-24.1-26.9-38.5-45-48.2 M14953.9,1448.8c0-33.4-4.6-71.9,4.6-91.4s45-38.5,49.6-62.6c4.2-24.1,85.3-4.6,98.8-24.1
	c8.8-4.6-4.6-28.8,0-38.5c4.6-9.8,18.1-4.7,26.9-14.4c9.2-14.4-4.2-47.8,4.6-67.3c13.5-33.9,22.7-43.6,45-33.9 M15039.6,1439.5
	c31.1-9.8,90,5.1,112.3-14.4c18.1-14.4,67.7-19,94.6-14.4` : '' : `M15368.4,1420.5c0-19.5,0-48.2-4.6-62.6
	c-4.7-14.4-31.6-19.5-36.2-33.9c-4.6-19,0-43.2-4.6-52.9c-9.2-9.8-45-24.2-49.6-33.9c-4.6-14.4,4.6-28.8,0-38.5
	c-13.5-24.1-26.9-38.5-45-48.2 M14953.9,1448.8c0-33.4-4.6-71.9,4.6-91.4s45-38.5,49.6-62.6c4.2-24.1,85.3-4.6,98.8-24.1
	c8.8-4.6-4.6-28.8,0-38.5c4.6-9.8,18.1-4.7,26.9-14.4c9.2-14.4-4.2-47.8,4.6-67.3c13.5-33.9,22.7-43.6,45-33.9 M15039.6,1439.5
	c31.1-9.8,90,5.1,112.3-14.4c18.1-14.4,67.7-19,94.6-14.4`}
          />
          {this.isShownRedGraphic("restoration", "Distal", 82) && (
            <path
              fill={this.state.statusDoneTeeth.includes(82) ? "#369661" : "#DE2527"}
              d="M15037,1708.8c-34.1-20.7-73-51.9-116.8-98.6c-24.3-31.1-48.7-57.1-63.2-98.6c-4.9-20.7-29.2-93.4,4.9-160.8
	c4.9-10.4,14.6-20.7,34.1-46.7c29.2-36.3,53.5-62.2,97.3-108.9l73-77.8c14.6,72.6,34.1,176.4,24.3,300.9
	C15085.6,1537.6,15056.5,1641.4,15037,1708.8L15037,1708.8z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Medial", 82) && (
            <path
              fill={this.state.statusDoneTeeth.includes(82) ? "#369661" : "#DE2527"}
              d="M15327.5,1171.2c4.5,14.6,4.5,24.3,13.6,43.7c4.5,14.6,9.1,24.3,18.2,38.8c13.6,19.4,72.8,67.9,86.4,92.2
	c13.6,24.3,40.9,126.2,13.6,208.6c-13.6,48.5-90.9,131-131.9,150.4h-4.5c-31.8,0-77.3-165-81.8-315.4
	c-4.5-145.6,27.3-281.4,50-281.4C15304.7,1113,15322.9,1156.6,15327.5,1171.2L15327.5,1171.2z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Lingual", 82) && (
            <path
              fill={this.state.statusDoneTeeth.includes(82) ? "#369661" : "#DE2527"}
              d="M15328.2,1704.1c-4.7,0-14.1,5.2-28.3,5.2c-4.7,0-33,5.2-80.1,10.4h-80.1c-28.3,0-51.8-5.2-70.6-5.2
	c-9.4-5.2-14.1-5.2-23.5-10.4c-4.7-5.2-14.1-10.4-18.8-10.4c14.1-41.8,33-88.8,42.4-151.5c14.1-62.7,14.1-120.1,18.8-161.9
	c51.8,5.2,108.3,5.2,160.1,10.4c0,62.7,9.4,114.9,18.8,156.7c14.1,62.7,23.5,94,37.7,120.1
	C15309.3,1678,15323.5,1693.7,15328.2,1704.1L15328.2,1704.1z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Buccal", 82) && (
            <path
              fill={this.state.statusDoneTeeth.includes(82) ? "#369661" : "#DE2527"}
              d="M15258.7,1067.3c14.1,10.4,28.1,26,28.1,26c4.7,5.2,9.4,10.4,14.1,20.8c-23.4,31.2-32.8,62.4-42.2,88.4
	c-9.4,36.4-9.4,67.6-14.1,130v98.8c-23.4,0-46.9-5.2-70.3-5.2c-28.1,0-60.9-5.2-89-5.2c0-41.6,0-93.6-4.7-150.8
	c-4.7-52-14.1-98.8-23.4-135.2l32.8-36.4c23.4-26,32.8-36.4,42.2-41.6C15179,1030.9,15235.3,1051.7,15258.7,1067.3L15258.7,1067.3z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 82) && (
            <path
              fill={this.state.statusDoneTeeth.includes(82) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(82) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M14855.6,1234.4h627.6v152h-627.6V1234.4z M14855.6,1637.7h627.6
	v-152h-627.6V1637.7z"
            />
          )}


          <path
            fill="#F2ECBE"
            onClick={() => {
              this.toggleSelectedNumber(71);
              this.props.onClick(71);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 71)
                ? (this.state.statusDoneTeeth.includes(71) ? "#369661" : "#DE2527")
                : this.checkImpacted(71) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(71) ? isMissing ?  `M16265.8,2839.6
	c-47.3,183.2,6,660.6,100.7,1080.4c47.3,227.8,231,178.6,219.4,31.1c-6-223.1-6-388.3,77-602.6c6-49.2,17.6-62.6,23.7-129.4
	c12.1-111.8,12.1-209.7,12.1-326.1c-77-26.9-160-53.8-237.1-84.9C16396.2,2816.9,16331.2,2826.2,16265.8,2839.6L16265.8,2839.6
	L16265.8,2839.6z` : "" : `M16265.8,2839.6
	c-47.3,183.2,6,660.6,100.7,1080.4c47.3,227.8,231,178.6,219.4,31.1c-6-223.1-6-388.3,77-602.6c6-49.2,17.6-62.6,23.7-129.4
	c12.1-111.8,12.1-209.7,12.1-326.1c-77-26.9-160-53.8-237.1-84.9C16396.2,2816.9,16331.2,2826.2,16265.8,2839.6L16265.8,2839.6
	L16265.8,2839.6z`}
          />
          <path
            fill={conditionToColor(this.props.teeth[71].condition)}
            onClick={() => {
              this.toggleSelectedNumber(71);
              this.props.onClick(71);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 71)
                ? (this.state.statusDoneTeeth.includes(71) ? "#369661" : "#DE2527")
                : this.checkImpacted(71) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(71) ? isMissing ? `M16188.8,2244L16188.8,2244
	c5.1,231,21.8,420.7,94.2,605.8c50.1,49.6,248.6,156.8,403.1,53.8c93.7-198.1,137.7-441.2,143.3-668c0-24.5-22.2-45.4-66.3-70
	c-132.7-45.5-364.7-58-508-4.2C16221.7,2169.8,16194.4,2215.2,16188.8,2244L16188.8,2244z`: '' : `M16188.8,2244L16188.8,2244
	c5.1,231,21.8,420.7,94.2,605.8c50.1,49.6,248.6,156.8,403.1,53.8c93.7-198.1,137.7-441.2,143.3-668c0-24.5-22.2-45.4-66.3-70
	c-132.7-45.5-364.7-58-508-4.2C16221.7,2169.8,16194.4,2215.2,16188.8,2244L16188.8,2244z`}
          />
          {this.isShownRedGraphic("rootCanal", "", 71) && (
            <path
              fill={this.state.statusDoneTeeth.includes(71) ? "#369661" : "#DE2527"}
              d="M16463.7,4008.8c-4.9,0,9.9-165.4,19.8-433.5c9.9-183.2,9.9-241.3,9.9-281.5c0-151.9,0-232.4-9.9-250.3
	c0-8.9-24.7-67-4.9-89.4c4.9-4.5,14.8-8.9,24.7-26.8c9.9-13.4,9.9-17.9,14.8-17.9c9.9-4.5,29.7,26.8,34.6,53.6
	c4.9,44.7-19.8,76-24.7,89.4c-4.9,102.8-9.9,183.2-9.9,236.9c0,0-9.9,460.3-44.5,670.4c0,13.4-4.9,31.3-4.9,31.3
	C16468.6,4004.3,16463.7,4008.8,16463.7,4008.8L16463.7,4008.8z"
            />
          )}
          {this.isShownRedGraphic("rootCanal", "Post and Core", 71) && (
            <path
              id="egXMLID_16_"
              fill={this.state.statusDoneTeeth.includes(71) ? "#369661" : "#DE2527"}
              d="M16431.7,3065.3c16.3-132.9,0.6-234.9-16.3-302.6c-23.8-94.5-65.7-185.9-33.7-203.6
	c20.9-11.6,48.3,23.2,114,25.8c78.5,2.5,118.6-45.5,141.3-31.3c29.7,18.2-22.1,108.6-50,207.1c-20.3,72.2-34.3,173.3-9.9,303.6
	C16528.8,3064.2,16480,3064.7,16431.7,3065.3L16431.7,3065.3z"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 71) && (
            <rect
              x="16221.1"
              y="2585.6"
              fill={this.state.statusDoneTeeth.includes(71) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(71) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="541.2"
              height="113.9"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 71) && (
            <rect
              x="16351.2"
              y="2556.5"
              fill={this.state.statusDoneTeeth.includes(71) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(71) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="281.1"
              height="172.1"
            />
          )}
          {this.isShownRedGraphic("whitening", "", 71) && (
            <polygon
              fill={this.state.statusDoneTeeth.includes(71) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(71) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              points="16402.7,2243.2 16349.5,2283.6 16351.9,2350.3 
	16298,2312.2 16235.8,2335.7 16255.6,2271.8 16214.8,2219.7 16281,2218.3 16317.9,2162.5 16339,2225.5 "
            />
          )}
          {this.isShownRedGraphic("hygiene", "", 71) && (
            <g>
              <g>
                <path
                  fill={this.state.statusDoneTeeth.includes(71) ? "#369661" : "#DE2527"}
                  d="M16762.5,2467.4l3.1-143.4c0-2.1-1.8-4.1-3.9-4.2l-4-0.2l0.6-27.9c0-2.2-1.7-4.1-3.9-4.2l-7.5-0.4
			l1.1-51.8l24.1-22.4c1.6-1.5,1.6-4,0.1-5.6c-1.5-1.6-4-1.8-5.6-0.3l-26.5,24.6l-1.2,55.1l-8.4-0.5c-1.1-0.1-2.1,0.3-2.8,1
			c-0.8,0.7-1.2,1.7-1.2,2.8l-0.6,27.9l-4-0.2c-2.2-0.1-4,1.6-4.1,3.8l-3.1,143.4c0,1.1,0.4,2.1,1.1,2.9c0.7,0.8,1.7,1.3,2.8,1.3
			l39.8,2.2C16760.7,2471.3,16762.5,2469.6,16762.5,2467.4z M16734.4,2294.3l15.9,0.9l-0.5,23.9l-15.9-0.9L16734.4,2294.3z
			 M16722.8,2461.2l2.9-135.5l4,0.2v0l23.9,1.3c0,0,0,0,0,0l4,0.2l-2.9,135.5L16722.8,2461.2z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("diagnosis", "", 71) && (
            <g>
              <g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)">
                <path
                  fill={this.state.statusDoneTeeth.includes(71) ? "#369661" : "#DE2527"}
                  d="M166637.5-16483c-99.8,47.7-220,66.9-340.5,55.5c-54.5-5.1-165.4-35.6-216.9-59.8
			c-232-108.2-395-327.4-432.1-581c-39.4-271.5,68-521.9,284.7-661.2c125.8-80.9,260-113.4,407-98.2l50.4,4.9l38.1-213l38.3-213.9
			l-42.4-12.2c-74.2-21.1-75.3,17.6,13.2-476.6c42.5-237.4,81.6-437.5,86.4-445.6c7-10.9,13.5-15.2,26.4-17
			c24.9-3.8,264.1,59.6,278.3,73.4c7.4,7.4,12.9,19,13.7,30.6c1.5,10.5-32,211.2-74.2,447c-87.3,482.6-77.9,453.7-140.5,440.2
			l-33.3-7.3l-38,212.2c-20.9,116.7-36.7,214.3-35.4,216.3c1.3,2,18.1,10.6,37.9,18.6c197.8,82.9,367,285.9,423.3,507.1
			C167063.5-16941.1,166920.5-16617.7,166637.5-16483z M166724.5-16736.1c128.8-146.6,166.1-354.8,99.4-550.7
			c-23.5-68.7-91.2-175-146-228c-47.6-46.1-117.5-93.6-172.8-117.6c-47.5-21.1-141.7-44.4-189.6-47.3
			c-52.4-2.9-132.6,7.1-186.1,24.3c-68,21.5-166.2,85.4-211.2,136.5c-127.9,146-165.4,355.8-97.8,551.1
			c21.4,62.2,81.8,160.3,129.9,210.4c155.2,162.6,381.3,222.2,578.5,152C166587.2-16625.6,166686.2-16692.1,166724.5-16736.1z"
                />
                <path
                  fill={this.state.statusDoneTeeth.includes(71) ? "#369661" : "#DE2527"}
                  d="M166230.5-16659.3c-61.1-17.3-100.8-35.6-150.3-69c-169.1-114.9-257.1-322.2-220.6-519.1
			c17.8-96.7,45.3-148.1,69.1-129.7c12.1,9.5,12.1,23-2.4,55.3c-20.3,46.1-35,139.3-31.2,194.9c2.4,26.4,9.6,69.8,16.4,97
			c12.3,45.1,17.3,54.8,62.3,124.8c44.7,69.5,52.1,79,87.7,108.5c52.2,43.9,105.5,71.9,171.7,91c55.5,15.9,65.6,22.3,62.4,40.1
			C166292.5-16646.8,166278.5-16645.7,166230.5-16659.3z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("implantation", "", 71) && (
            <path
              fill={this.state.statusDoneTeeth.includes(71) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(71) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M16771.6,2816.3h-559.8c-33.5,0-60.7,71.4-60.7,159.2
	s27.2,159.2,60.7,159.2h205.5v72.5h-103.6c-21.4,0-38.5,45.5-38.5,101c0,56.1,17.3,101,38.5,101h103.6v72.5h-70.6
	c-21.4,0-38.5,45.5-38.5,101c0,56.1,17.3,101,38.5,101h70.6v72.5h-37.5c-21.4,0-38.5,45.5-38.5,101c0,56.1,17.3,101,38.5,101h37.5
	v72.5h-4.4c-21.4,0-38.5,45.5-38.5,101c0,56.1,17.3,101,38.5,101h157.7c21.4,0,38.5-45.5,38.5-101c0-56.1-17.3-101-38.5-101h-4.4
	v-72.5h37.5c21.4,0,38.5-45.5,38.5-101c0-56.1-17.3-101-38.5-101h-37.5v-72.5h70.6c21.4,0,38.5-45.5,38.5-101
	c0-56.1-17.3-101-38.5-101h-70.6v-72.5h103.6c21.4,0,38.5-45.5,38.5-101c0-56.1-17.3-101-38.5-101h-103.6v-73h205.5
	c33.5,0,60.7-71.4,60.7-159.2C16832.1,2887.2,16805.1,2816.3,16771.6,2816.3z"
            />
          )}


          <path
            fill="#F2ECBE"
            onClick={() => {
              this.toggleSelectedNumber(81);
              this.props.onClick(81);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 81)
                ? (this.state.statusDoneTeeth.includes(81) ? "#369661" : "#DE2527")
                : this.checkImpacted(81) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(81) ? isMissing ? `M16070.3,2856.9
	c48.9,183.2-6.2,660.6-104.1,1080.4c-48.9,227.8-238.8,178.6-226.8,31.1c6.2-223.1,6.2-388.3-79.6-602.6
	c-6.2-49.2-18.2-62.6-24.5-129.4c-12.5-111.8-12.5-209.7-12.5-326.1c79.6-26.9,165.4-53.8,245.1-84.9
	C15935.5,2834.2,16002.7,2843.5,16070.3,2856.9L16070.3,2856.9L16070.3,2856.9z` : "" : `M16070.3,2856.9
	c48.9,183.2-6.2,660.6-104.1,1080.4c-48.9,227.8-238.8,178.6-226.8,31.1c6.2-223.1,6.2-388.3-79.6-602.6
	c-6.2-49.2-18.2-62.6-24.5-129.4c-12.5-111.8-12.5-209.7-12.5-326.1c79.6-26.9,165.4-53.8,245.1-84.9
	C15935.5,2834.2,16002.7,2843.5,16070.3,2856.9L16070.3,2856.9L16070.3,2856.9z`}
          />
          <path
            fill={conditionToColor(this.props.teeth[81].condition)}
            onClick={() => {
              this.toggleSelectedNumber(81);
              this.props.onClick(81);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 81)
                ? (this.state.statusDoneTeeth.includes(81) ? "#369661" : "#DE2527")
                : this.checkImpacted(81) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(81) ? isMissing ? `M16149.8,2261.3L16149.8,2261.3
	c-5.3,231-22.5,420.7-97.4,605.8c-51.8,49.6-257,156.8-416.6,53.8c-96.8-198.1-142.3-441.2-148.1-668c0-24.5,22.9-45.4,68.5-70
	c137.2-45.5,377-58,525.1-4.2C16115.8,2187.1,16144.1,2232.5,16149.8,2261.3L16149.8,2261.3z`: '' : `M16149.8,2261.3L16149.8,2261.3
	c-5.3,231-22.5,420.7-97.4,605.8c-51.8,49.6-257,156.8-416.6,53.8c-96.8-198.1-142.3-441.2-148.1-668c0-24.5,22.9-45.4,68.5-70
	c137.2-45.5,377-58,525.1-4.2C16115.8,2187.1,16144.1,2232.5,16149.8,2261.3L16149.8,2261.3z`}
          />
          {this.isShownRedGraphic("rootCanal", "", 81) && (
            <path
              fill={this.state.statusDoneTeeth.includes(81) ? "#369661" : "#DE2527"}
              d="M15865.8,4026.1c5.1,0-10.2-165.4-20.4-433.5c-10.2-183.2-10.2-241.3-10.2-281.5c0-151.9,0-232.4,10.2-250.3
	c0-8.9,25.6-67,5.1-89.4c-5.1-4.5-15.3-8.9-25.6-26.8c-10.2-13.4-10.2-17.9-15.3-17.9c-10.2-4.5-30.7,26.8-35.8,53.6
	c-5.1,44.7,20.4,76,25.6,89.4c5.1,102.8,10.2,183.2,10.2,236.9c0,0,10.2,460.3,46,670.4c0,13.4,5.1,31.3,5.1,31.3
	C15860.6,4021.7,15865.8,4026.1,15865.8,4026.1L15865.8,4026.1z"
            />
          )}
          {this.isShownRedGraphic("rootCanal", "Post and Core", 81) && (
            <path
              id="egXMLID_7_"
              fill={this.state.statusDoneTeeth.includes(81) ? "#369661" : "#DE2527"}
              d="M15898.7,3082.6c-16.8-132.9-0.6-234.9,16.8-302.6c24.6-94.5,67.9-185.9,34.9-203.6
	c-21.6-11.6-49.9,23.2-117.8,25.8c-81.1,2.5-122.6-45.5-146-31.3c-30.6,18.2,22.8,108.6,51.7,207.1c21,72.2,35.5,173.3,10.2,303.6
	C15798.4,3081.6,15848.9,3082.1,15898.7,3082.6L15898.7,3082.6z"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 81) && (
            <rect
              x="15557.1"
              y="2603"
              fill={this.state.statusDoneTeeth.includes(81) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(81) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="559.4"
              height="113.9"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 81) && (
            <rect
              x="15691.5"
              y="2573.9"
              fill={this.state.statusDoneTeeth.includes(81) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(81) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="290.5"
              height="172.1"
            />
          )}
          {this.isShownRedGraphic("whitening", "", 81) && (
            <polygon
              fill={this.state.statusDoneTeeth.includes(81) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(81) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              points="15928.8,2260.5 15983.7,2300.9 15981.3,2367.6 
	16037,2329.5 16101.3,2353.1 16080.8,2289.1 16123,2237 16054.6,2235.6 16016.4,2179.8 15994.6,2242.9 "
            />
          )}
          {this.isShownRedGraphic("hygiene", "", 81) && (
            <g>
              <g>
                <path
                  fill={this.state.statusDoneTeeth.includes(81) ? "#369661" : "#DE2527"}
                  d="M15561,2488.5l41.1-2.2c1.1-0.1,2.1-0.5,2.9-1.3c0.8-0.8,1.2-1.8,1.1-2.9l-3.2-143.4
			c0-2.2-1.9-3.9-4.2-3.8l-4.1,0.2l-0.6-27.9c0-1.1-0.5-2-1.3-2.8c-0.8-0.7-1.8-1.1-2.9-1l-8.7,0.5l-1.2-55.1l-27.4-24.6
			c-1.6-1.5-4.2-1.3-5.8,0.3c-1.6,1.6-1.5,4.2,0.1,5.6l24.9,22.4l1.1,51.8l-7.8,0.4c-2.3,0.1-4.1,2-4,4.2l0.6,27.9l-4.1,0.2
			c-2.2,0.1-4.1,2.1-4,4.2l3.2,143.4C15556.9,2486.9,15558.8,2488.6,15561,2488.5z M15586.5,2335.5l-16.5,0.9l-0.5-23.9l16.5-0.9
			L15586.5,2335.5z M15565,2480.3l-3-135.5l4.1-0.2c0,0,0,0,0,0l24.7-1.3v0l4.1-0.2l3,135.5L15565,2480.3z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("diagnosis", "", 81) && (
            <g>
              <g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)">
                <path
                  fill={this.state.statusDoneTeeth.includes(81) ? "#369661" : "#DE2527"}
                  d="M156233.5-17436.1c58.2-221.1,233-424.2,437.5-507.1c20.5-8.1,37.9-16.6,39.2-18.6
			c1.3-2-15-99.7-36.6-216.3l-39.3-212.2l-34.4,7.3c-64.7,13.5-55,42.4-145.2-440.2c-43.6-235.7-78.2-436.4-76.7-447
			c0.9-11.7,6.5-23.2,14.2-30.6c14.7-13.8,261.9-77.2,287.6-73.4c13.3,1.8,20.1,6,27.3,17c5,8.1,45.4,208.2,89.3,445.5
			c91.4,494.2,90.3,455.5,13.6,476.6l-43.8,12.2l39.6,213.9l39.4,213l52.1-4.9c151.9-15.2,290.6,17.3,420.7,98.2
			c224,139.4,335,389.8,294.3,661.2c-38.4,253.5-206.8,472.8-446.6,581c-53.3,24.2-167.8,54.7-224.2,59.8
			c-124.6,11.4-248.8-7.8-352-55.5C156296.8-16790.9,156149.1-17114.4,156233.5-17436.1z M156701.5-16778.6
			c203.9,70.2,437.6,10.6,598-152c49.8-50,112.2-148.1,134.3-210.4c69.9-195.3,31.1-405.1-101.1-551.1
			c-46.5-51.2-148-115-218.3-136.5c-55.3-17.2-138.2-27.2-192.4-24.3c-49.4,2.9-146.8,26.2-195.9,47.3
			c-57.2,23.9-129.4,71.5-178.6,117.6c-56.5,53-126.5,159.3-150.9,228c-68.9,195.8-30.4,404.1,102.8,550.7
			C156539-16865.4,156641.4-16798.8,156701.5-16778.6z"
                />
                <path
                  fill={this.state.statusDoneTeeth.includes(81) ? "#369661" : "#DE2527"}
                  d="M157010-16832.6c63.1-17.3,104.2-35.6,155.3-69c174.8-114.9,265.7-322.2,228-519.1
			c-18.3-96.7-46.8-148.1-71.4-129.7c-12.5,9.5-12.5,23,2.5,55.3c21,46.1,36.1,139.3,32.2,194.9c-2.4,26.4-9.9,69.8-17,97
			c-12.8,45.1-17.9,54.8-64.4,124.8c-46.2,69.5-53.9,79-90.7,108.5c-53.9,43.9-109.1,71.9-177.5,91c-57.4,15.9-67.8,22.3-64.5,40.1
			C156946-16820.1,156960.4-16819,157010-16832.6z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("implantation", "", 81) && (
            <path
              fill={this.state.statusDoneTeeth.includes(81) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(81) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M15558.1,2833.7h556.5c33.3,0,60.3,71.4,60.3,159.2
	s-27.1,159.2-60.3,159.2h-204.3v72.5h103c21.3,0,38.3,45.5,38.3,101c0,56.1-17.2,101-38.3,101h-103v72.5h70.2
	c21.3,0,38.3,45.5,38.3,101c0,56.1-17.2,101-38.3,101h-70.2v72.5h37.3c21.3,0,38.3,45.5,38.3,101c0,56.1-17.2,101-38.3,101h-37.3
	v72.5h4.4c21.3,0,38.3,45.5,38.3,101c0,56.1-17.2,101-38.3,101H15758c-21.3,0-38.3-45.5-38.3-101c0-56.1,17.2-101,38.3-101h4.4
	v-72.5h-37.3c-21.3,0-38.3-45.5-38.3-101c0-56.1,17.2-101,38.3-101h37.3V3701h-70.2c-21.3,0-38.3-45.5-38.3-101
	c0-56.1,17.2-101,38.3-101h70.2v-72.5h-103c-21.3,0-38.3-45.5-38.3-101c0-56.1,17.2-101,38.3-101h103v-73h-204.3
	c-33.3,0-60.3-71.4-60.3-159.2C15498,2904.5,15524.8,2833.7,15558.1,2833.7z"
            />
          )}


          <path
            fill="#F2ECBE"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 72)
                ? (this.state.statusDoneTeeth.includes(72) ? "#369661" : "#DE2527")
                : this.checkImpacted(72) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(72) ? isMissing ? `M16984.3,2833.4
	c-26.5,258.9-30.2,658.7,45.9,988.1c61.3,287.1,91.4,475,175.4,32.9c22.7-197.6,125.7-531.6,38-964.4l-103-141L16984.3,2833.4z` : '' : `M16984.3,2833.4
	c-26.5,258.9-30.2,658.7,45.9,988.1c61.3,287.1,91.4,475,175.4,32.9c22.7-197.6,125.7-531.6,38-964.4l-103-141L16984.3,2833.4z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 72)
                ? (this.state.statusDoneTeeth.includes(72) ? "#369661" : "#DE2527")
                : this.checkImpacted(72) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(72) ? isMissing ? `M16871.9,2295.7c0-54.2,45-140.5,90-154.9
	c22.2-14.4,59.8,11.1,97.4,18.1c59.9,18.1,149.9,28.8,217.6,32.5c198.6,104.3,40.9,561.8-22.7,698.6c-3.7,3.7-7.4,10.7-11.1,14.4
	c-26.4,17.6-225,6.9-251.4-50.6C16976.4,2860.8,16893.8,2490.1,16871.9,2295.7z` : '' : `M16871.9,2295.7c0-54.2,45-140.5,90-154.9
	c22.2-14.4,59.8,11.1,97.4,18.1c59.9,18.1,149.9,28.8,217.6,32.5c198.6,104.3,40.9,561.8-22.7,698.6c-3.7,3.7-7.4,10.7-11.1,14.4
	c-26.4,17.6-225,6.9-251.4-50.6C16976.4,2860.8,16893.8,2490.1,16871.9,2295.7z`}
          />

          <path
            fill="#F2ECBE"
            onClick={() => {
              this.toggleSelectedNumber(72);
              this.props.onClick(72);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 72)
                ? (this.state.statusDoneTeeth.includes(72) ? "#369661" : "#DE2527")
                : this.checkImpacted(72) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(72) ? isMissing ? `M16984.4,2833.8
	c-26.4,258.9-30.6,658.7,45.9,988.1c60.8,287.2,91.4,475,175.4,32.9c22.7-197.6,125.7-531.6,38-964.4l-103-141L16984.4,2833.8
	L16984.4,2833.8z` : "" : `M16984.4,2833.8
	c-26.4,258.9-30.6,658.7,45.9,988.1c60.8,287.2,91.4,475,175.4,32.9c22.7-197.6,125.7-531.6,38-964.4l-103-141L16984.4,2833.8
	L16984.4,2833.8z`}
          />
          <path
            fill={conditionToColor(this.props.teeth[72].condition)}
            onClick={() => {
              this.toggleSelectedNumber(72);
              this.props.onClick(72);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 72)
                ? (this.state.statusDoneTeeth.includes(72) ? "#369661" : "#DE2527")
                : this.checkImpacted(72) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(72) ? isMissing ? `M16871.7,2295.7c0-53.8,45-140.6,90-154.9
	c22.7-14.4,59.8,10.7,97.4,18.1c59.8,18.1,150.3,28.8,217.6,32.5c199,104.4,41.3,561.8-22.7,698.6c-3.7,3.7-7.4,10.7-11.1,14.4
	c-26.4,18.1-225,7.4-251.4-50.6C16976.5,2861.2,16894,2490.5,16871.7,2295.7z`: '' : `M16871.7,2295.7c0-53.8,45-140.6,90-154.9
	c22.7-14.4,59.8,10.7,97.4,18.1c59.8,18.1,150.3,28.8,217.6,32.5c199,104.4,41.3,561.8-22.7,698.6c-3.7,3.7-7.4,10.7-11.1,14.4
	c-26.4,18.1-225,7.4-251.4-50.6C16976.5,2861.2,16894,2490.5,16871.7,2295.7z`}
          />
          {this.isShownRedGraphic("rootCanal", "", 72) && (
            <path
              fill={this.state.statusDoneTeeth.includes(72) ? "#369661" : "#DE2527"}
              d="M17082,3950.5c-4.9,0,9.9-169.5,19.8-444.3c9.9-187.8,9.9-247.4,9.9-288.6c0-155.7,0-238.2-9.9-256.5
	c0-9.2-24.7-68.7-4.9-91.6c4.9-4.6,14.8-9.2,24.7-27.5c9.9-13.7,9.9-18.3,14.8-18.3c9.9-4.6,29.7,27.5,34.6,55
	c4.9,45.8-19.8,77.9-24.7,91.6c-4.9,105.4-9.9,187.8-9.9,242.8c0,0-9.9,471.8-44.5,687.1c0,13.7-4.9,32.1-4.9,32.1
	C17086.9,3945.9,17082,3950.5,17082,3950.5L17082,3950.5z"
            />
          )}
          {this.isShownRedGraphic("rootCanal", "Post and Core", 72) && (
            <path
              id="egXMLID_8_"
              fill={this.state.statusDoneTeeth.includes(72) ? "#369661" : "#DE2527"}
              d="M17050.1,3050.1c16.3-132.9,0.6-234.9-16.3-302.6c-23.8-94.5-65.7-185.9-33.7-203.6
	c20.9-11.6,48.3,23.2,114,25.8c78.5,2.5,118.6-45.5,141.3-31.3c29.7,18.2-22.1,108.6-50,207.1c-20.3,72.2-34.3,173.3-9.9,303.6
	C17147.2,3049.1,17098.3,3049.6,17050.1,3050.1L17050.1,3050.1z"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 72) && (
            <rect
              x="16941.2"
              y="2568.3"
              fill={this.state.statusDoneTeeth.includes(72) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(72) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="391.5"
              height="113.9"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 72) && (
            <rect
              x="16988.5"
              y="2528.1"
              fill={this.state.statusDoneTeeth.includes(72) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(72) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="296.9"
              height="194.2"
            />
          )}
          {this.isShownRedGraphic("whitening", "", 72) && (
            <polygon
              fill={this.state.statusDoneTeeth.includes(72) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(72) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              points="17037,2220.8 17002.1,2249.1 17002.3,2293.9 
	16968.4,2269.3 16928.1,2286.4 16942,2243 16916.8,2208.6 16959.3,2206.4 16984.1,2168.1 16996.5,2210.2 "
            />
          )}
          {this.isShownRedGraphic("hygiene", "", 72) && (
            <g>
              <g>
                <path
                  fill={this.state.statusDoneTeeth.includes(72) ? "#369661" : "#DE2527"}
                  d="M17282.7,2482.8l3.1-143.4c0-2.1-1.8-4.1-3.9-4.2l-4-0.2l0.6-27.9c0-2.2-1.7-4.1-3.9-4.2l-7.5-0.4
			l1.1-51.8l24.1-22.4c1.6-1.5,1.6-4,0.1-5.6c-1.5-1.6-4-1.8-5.6-0.3l-26.5,24.6l-1.2,55.1l-8.4-0.5c-1.1-0.1-2.1,0.3-2.8,1
			c-0.8,0.7-1.2,1.7-1.2,2.8l-0.6,27.9l-4-0.2c-2.2-0.1-4,1.6-4.1,3.8l-3.1,143.4c0,1.1,0.4,2.1,1.1,2.9s1.7,1.3,2.8,1.3l39.8,2.2
			C17280.8,2486.7,17282.6,2485,17282.7,2482.8z M17254.5,2309.7l15.9,0.9l-0.5,23.9l-15.9-0.9L17254.5,2309.7z M17243,2476.7
			l2.9-135.5l4,0.2v0l23.9,1.3c0,0,0,0,0,0l4,0.2l-2.9,135.5L17243,2476.7z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("diagnosis", "", 72) && (
            <g>
              <g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)">
                <path
                  fill={this.state.statusDoneTeeth.includes(72) ? "#369661" : "#DE2527"}
                  d="M171648.6-16952.3c-72,34.1-159.1,47.2-246.7,37.7c-39.6-4.2-120.4-27.6-158-45.8
			c-169.4-81.4-289.6-243.8-318.8-430.2c-31-199.6,44.7-382.4,200.8-482.7c90.6-58.2,187.7-80.9,294.5-68.5l36.6,4l25.8-156
			l25.9-156.6l-30.9-9.3c-54-16.2-54.5,12.2,5.3-349.6c28.7-173.8,55.4-320.3,58.8-326.2c5-8,9.7-11,19-12.2
			c18-2.6,192.2,46.1,202.6,56.3c5.5,5.5,9.5,14,10.2,22.6c1.2,7.8-21.3,154.7-49.9,327.4c-59,353.4-52.5,332.2-98.1,321.8
			l-24.2-5.6l-25.7,155.4c-14.1,85.4-24.7,156.9-23.8,158.4s13.3,7.9,27.7,14c144.3,62.6,268.9,213.1,311.7,375.9
			C171953.7-17284.7,171852.8-17048.6,171648.6-16952.3z M171709.5-17137.2c92.2-106.5,117.4-258.9,67.3-403.2
			c-17.7-50.6-67.8-129.3-108-168.6c-35-34.3-86.1-69.8-126.5-87.8c-34.7-15.9-103.3-33.8-138-36.4c-38.1-2.6-96.2,4-134.9,16.2
			c-49.2,15.2-119.9,61.2-152.1,98.3c-91.5,106-116.9,259.7-66.1,403.6c16.1,45.9,60.8,118.4,96.2,155.5
			c114.1,120.7,278.7,166.5,421.3,116.7C171610.8-17057.3,171682.1-17105.3,171709.5-17137.2z"
                />
                <path
                  fill={this.state.statusDoneTeeth.includes(72) ? "#369661" : "#DE2527"}
                  d="M171351.6-17085.3c-44.5-13.3-73.5-27-109.7-52c-123.8-85.8-189.4-238.7-164.7-382.9
			c12-70.8,31.6-108.3,49-94.6c8.8,7,9,17-1.3,40.6c-14.3,33.6-24.1,101.9-20.9,142.8c2,19.4,7.6,51.3,12.8,71.3
			c9.4,33.2,13,40.4,46.3,92.2c33,51.4,38.5,58.5,64.6,80.4c38.3,32.7,77.2,53.7,125.5,68.3c40.4,12.2,47.8,17,45.7,30
			C171396.7-17075.5,171386.6-17074.8,171351.6-17085.3z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("implantation", "", 72) && (
            <path
              fill={this.state.statusDoneTeeth.includes(72) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(72) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M17310.9,2816.8H16920c-23.4,0-42.4,71.4-42.4,159.2
	s19,159.2,42.4,159.2h143.5v72.5h-72.4c-14.9,0-26.9,45.5-26.9,101c0,56.1,12.1,101,26.9,101h72.4v72.5h-49.3
	c-14.9,0-26.9,45.5-26.9,101c0,56.1,12.1,101,26.9,101h49.3v72.5h-26.2c-14.9,0-26.9,45.5-26.9,101c0,56.1,12.1,101,26.9,101h26.2
	v72.5h-3.1c-14.9,0-26.9,45.5-26.9,101c0,56.1,12.1,101,26.9,101h110.1c14.9,0,26.9-45.5,26.9-101c0-56.1-12.1-101-26.9-101h-3.1
	v-72.5h26.2c14.9,0,26.9-45.5,26.9-101c0-56.1-12.1-101-26.9-101h-26.2v-72.5h49.3c14.9,0,26.9-45.5,26.9-101
	c0-56.1-12.1-101-26.9-101h-49.3v-72.5h72.4c14.9,0,26.9-45.5,26.9-101c0-56.1-12.1-101-26.9-101h-72.4v-73h143.5
	c23.4,0,42.4-71.4,42.4-159.2C17353.1,2887.6,17334.3,2816.8,17310.9,2816.8z"
            />
          )}


          <path
            fill="#F2ECBE"
            onClick={() => {
              this.toggleSelectedNumber(73);
              this.props.onClick(73);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 73)
                ? (this.state.statusDoneTeeth.includes(73) ? "#369661" : "#DE2527")
                : this.checkImpacted(73) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(73) ? isMissing ? `M17560.6,2810.6
	c-90.9,122-39.5,1280.4,130.4,1255.3c23.8-4.2,162.3-25,178-345.1c11.9-202.3,55.2-737.1-23.8-888.8l-122.8-71.4L17560.6,2810.6
	L17560.6,2810.6z` : "" : `M17560.6,2810.6
	c-90.9,122-39.5,1280.4,130.4,1255.3c23.8-4.2,162.3-25,178-345.1c11.9-202.3,55.2-737.1-23.8-888.8l-122.8-71.4L17560.6,2810.6
	L17560.6,2810.6z`}
          />
          <path
            fill={conditionToColor(this.props.teeth[73].condition)}
            onClick={() => {
              this.toggleSelectedNumber(73);
              this.props.onClick(73);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 73)
                ? (this.state.statusDoneTeeth.includes(73) ? "#369661" : "#DE2527")
                : this.checkImpacted(73) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(73) ? isMissing ? `M17429.3,2273.9
	c26.7-38,194.6-155.4,263.7-155.4c72.8,0,206.5,114.1,278.9,204.1c91.8,131.3-11.4,200.4-76.1,317.8c-19.1,34.8,0,166.1-49.5,217.6
	c-53.4,34.8-221.8,52-301.8-7c-19.1-41.3-19.1-83-22.9-128C17516.8,2636.7,17341.2,2346.3,17429.3,2273.9L17429.3,2273.9
	L17429.3,2273.9z`: '' : `M17429.3,2273.9
	c26.7-38,194.6-155.4,263.7-155.4c72.8,0,206.5,114.1,278.9,204.1c91.8,131.3-11.4,200.4-76.1,317.8c-19.1,34.8,0,166.1-49.5,217.6
	c-53.4,34.8-221.8,52-301.8-7c-19.1-41.3-19.1-83-22.9-128C17516.8,2636.7,17341.2,2346.3,17429.3,2273.9L17429.3,2273.9
	L17429.3,2273.9z`}
          />
          {this.isShownRedGraphic("rootCanal", "", 73) && (
            <path
              fill={this.state.statusDoneTeeth.includes(73) ? "#369661" : "#DE2527"}
              d="M17654.8,3968.6c-5.1,0,10.1-169.5,20.3-444.3c10.1-187.8,10.1-247.4,10.1-288.6c0-155.7,0-238.2-10.1-256.5
	c0-9.2-25.4-68.7-5.1-91.6c5.1-4.6,15.2-9.2,25.4-27.5c10.1-13.7,10.1-18.3,15.2-18.3c10.2-4.6,30.4,27.5,35.5,55
	c5.1,45.8-20.3,77.9-25.4,91.6c-5.1,105.4-10.2,187.8-10.2,242.8c0,0-10.1,471.8-45.7,687.1c0,13.7-5.1,32.1-5.1,32.1
	C17659.9,3964,17654.8,3968.6,17654.8,3968.6L17654.8,3968.6z"
            />
          )}
          {this.isShownRedGraphic("rootCanal", "Post and Core", 73) && (
            <path
              id="egXMLID_9_"
              fill={this.state.statusDoneTeeth.includes(73) ? "#369661" : "#DE2527"}
              d="M17622,3068.1c16.7-132.9,0.6-234.9-16.7-302.6c-24.5-94.5-67.4-185.9-34.6-203.6
	c21.5-11.6,49.5,23.2,116.9,25.8c80.5,2.5,121.7-45.5,145-31.3c30.4,18.2-22.7,108.6-51.3,207.1c-20.9,72.2-35.2,173.3-10.1,303.6
	C17721.6,3067.1,17671.5,3067.6,17622,3068.1L17622,3068.1z"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 73) && (
            <rect
              x="17487.2"
              y="2546.1"
              fill={this.state.statusDoneTeeth.includes(73) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(73) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="404.4"
              height="113.9"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 73) && (
            <rect
              x="17552.7"
              y="2510.3"
              fill={this.state.statusDoneTeeth.includes(73) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(73) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="272.7"
              height="193.2"
            />
          )}
          {this.isShownRedGraphic("whitening", "", 73) && (
            <polygon
              fill={this.state.statusDoneTeeth.includes(73) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(73) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              points="17767.2,2227.5 17712.7,2267.9 17715.1,2334.6 
	17659.8,2296.5 17596,2320.1 17616.3,2256.2 17574.4,2204.1 17642.3,2202.6 17680.3,2146.8 17701.9,2209.9 "
            />
          )}
          {this.isShownRedGraphic("hygiene", "", 73) && (
            <g>
              <g>
                <path
                  fill={this.state.statusDoneTeeth.includes(73) ? "#369661" : "#DE2527"}
                  d="M17513.4,2502.2l3.1-143.4c0-2.1-1.8-4.1-4-4.2l-4.1-0.2l0.6-27.9c0-2.2-1.7-4.1-4-4.2l-7.7-0.4l1.1-51.8
			l24.7-22.4c1.6-1.5,1.7-4,0.1-5.6s-4.1-1.8-5.8-0.3l-27.2,24.6l-1.2,55.1l-8.6-0.5c-1.1-0.1-2.1,0.3-2.9,1
			c-0.8,0.7-1.2,1.7-1.3,2.8l-0.6,27.9l-4.1-0.2c-2.3-0.1-4.1,1.6-4.2,3.8l-3.1,143.4c0,1.1,0.4,2.1,1.1,2.9
			c0.8,0.8,1.8,1.3,2.9,1.3l40.8,2.2C17511.5,2506.1,17513.4,2504.4,17513.4,2502.2z M17484.5,2329.2l16.3,0.9l-0.5,23.9l-16.3-0.9
			L17484.5,2329.2z M17472.7,2496.1l3-135.5l4.1,0.2l0,0l24.5,1.3c0,0,0,0,0,0l4.1,0.2l-3,135.5L17472.7,2496.1z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("diagnosis", "", 73) && (
            <g>
              <g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)">
                <path
                  fill={this.state.statusDoneTeeth.includes(73) ? "#369661" : "#DE2527"}
                  d="M178469.5-17317.1c-74.5,35.5-163.2,51.7-251.4,46.8c-39.9-2.2-120.5-20.7-157.8-36.2
			c-167.7-69.4-281.8-217.4-302.8-392.3c-22.1-187.3,62.9-363.5,225.5-465.4c94.4-59.1,193.8-85,301.3-78l36.9,2.2l33.3-148.7
			l33.5-149.2l-30.8-7.4c-53.9-12.8-55.7,14,21.6-330.8c37.1-165.6,70.9-305.3,74.6-311c5.4-7.7,10.3-10.8,19.8-12.4
			c18.4-3.2,192.4,34.9,202.5,44.1c5.3,5,9,12.8,9.3,20.9c0.8,7.3-28.8,147.3-65.6,311.7c-76.1,336.8-68.5,316.5-114.2,308.6
			l-24.3-4.2l-33.2,148.1c-18.3,81.4-32.3,149.5-31.4,150.8c0.9,1.4,13,6.9,27.4,12c143.2,52.6,262.3,189.3,298.1,341.3
			C178793.7-17645.2,178680.7-17417.4,178469.5-17317.1z M178539.7-17494.7c98.2-104.8,130.8-250.1,86.7-384.3
			c-15.6-47.1-62.6-119.1-101.5-154.6c-33.8-30.8-83.9-62.1-123.9-77.3c-34.4-13.5-103-27.3-138-28.2c-38.4-0.7-97.5,8.2-137.3,21.4
			c-50.5,16.6-124.2,63.2-158.5,99.8c-97.5,104.4-130.3,250.8-85.6,384.5c14.2,42.6,56,109.2,90.2,142.7
			c109.9,109,274.4,144.8,421,91.3C178436.1-17414.8,178510.5-17463.3,178539.7-17494.7z"
                />
                <path
                  fill={this.state.statusDoneTeeth.includes(73) ? "#369661" : "#DE2527"}
                  d="M178175.1-17429.5c-44.4-10.5-73.1-22.2-108.6-44.2c-121.3-75.6-180.7-217.1-149-354.6
			c15.4-67.5,37-103.8,54-91.6c8.6,6.3,8.3,15.7-3.1,38.4c-16.1,32.4-29.1,97.4-27.7,135.9c1.1,18.3,5.3,48.2,9.6,66.9
			c7.9,31,11.3,37.6,42.6,85c31.1,47.1,36.3,53.5,61.7,73.1c37.2,29.2,75.7,47.3,123.8,58.9c40.4,9.7,47.6,13.9,44.8,26.3
			C178220.3-17422.4,178210-17421.2,178175.1-17429.5z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("implantation", "", 73) && (
            <path
              fill={this.state.statusDoneTeeth.includes(73) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(73) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M17987.5,2832.8h-574.4c-34.3,0-62.3,71-62.3,158.3
	c0,87.3,27.9,158.3,62.3,158.3h210.8v72h-106.3c-21.9,0-39.5,45.2-39.5,100.4c0,55.7,17.8,100.4,39.5,100.4h106.3v72h-72.4
	c-21.9,0-39.5,45.2-39.5,100.4c0,55.7,17.8,100.4,39.5,100.4h72.4v72h-38.5c-21.9,0-39.5,45.2-39.5,100.4
	c0,55.7,17.8,100.4,39.5,100.4h38.5v72h-4.6c-21.9,0-39.5,45.2-39.5,100.4c0,55.7,17.8,100.4,39.5,100.4h161.8
	c21.9,0,39.5-45.2,39.5-100.4c0-55.7-17.8-100.4-39.5-100.4h-4.6v-72h38.5c21.9,0,39.5-45.2,39.5-100.4
	c0-55.7-17.8-100.4-39.5-100.4h-38.5v-72h72.4c21.9,0,39.5-45.2,39.5-100.4c0-55.7-17.8-100.4-39.5-100.4h-72.4v-72h106.3
	c21.9,0,39.5-45.2,39.5-100.4c0-55.7-17.8-100.4-39.5-100.4h-106.3v-72.6h210.8c34.3,0,62.3-71,62.3-158.3
	C18049.5,2903.2,18021.8,2832.8,17987.5,2832.8z"
            />
          )}


          <path
            fill="#F2ECBE"
            onClick={() => {
              this.toggleSelectedNumber(74);
              this.props.onClick(74);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 74)
                ? (this.state.statusDoneTeeth.includes(74) ? "#369661" : "#DE2527")
                : this.checkImpacted(74) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="22.926"
            d= {this.checkMissing(74) ? isMissing ? `M18761.1,2696.5l153.5,127.6
	c25.8,132.7,0,314.1-5.3,377.6c-10,83.5-30.6,166.5-30.6,245.4c-25.8,397.1-51.1,520-107.6,534.9c-61.7,29.2-107.6-88.1-122.9-137.3
	c-20.5-53.8-41.1-211.1-45.9-279.7c-20.5-235.7-20.5-431.4-45.9-441.6c-81.8-39.4-128.2,88.1-184.6,230.6
	c-35.9,93.2-51.1,186.5-51.1,259.8c0,29.2-5.3,240.3-25.8,299.2c-81.8,215.7-230.5-53.8-261.1-353c-20.5-166.5-5.3-505.2,35.9-657.3
	c15.3-63.6,56.4-122.5,87-186.5L18761.1,2696.5L18761.1,2696.5z` : "" : `M18761.1,2696.5l153.5,127.6
	c25.8,132.7,0,314.1-5.3,377.6c-10,83.5-30.6,166.5-30.6,245.4c-25.8,397.1-51.1,520-107.6,534.9c-61.7,29.2-107.6-88.1-122.9-137.3
	c-20.5-53.8-41.1-211.1-45.9-279.7c-20.5-235.7-20.5-431.4-45.9-441.6c-81.8-39.4-128.2,88.1-184.6,230.6
	c-35.9,93.2-51.1,186.5-51.1,259.8c0,29.2-5.3,240.3-25.8,299.2c-81.8,215.7-230.5-53.8-261.1-353c-20.5-166.5-5.3-505.2,35.9-657.3
	c15.3-63.6,56.4-122.5,87-186.5L18761.1,2696.5L18761.1,2696.5z`}
          />
          <path
            fill={conditionToColor(this.props.teeth[74].condition)}
            onClick={() => {
              this.toggleSelectedNumber(74);
              this.props.onClick(74);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 74)
                ? (this.state.statusDoneTeeth.includes(74) ? "#369661" : "#DE2527")
                : this.checkImpacted(74) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(74) ? isMissing ? `M18062.3,2245.6
	c-32.1,154.5-16.3,264.9,11,405.9c5.3,26.4,21.5,66.3,37.7,84c128.7,128,408,88.1,611.7,79.3c64.5-4.6,176.9,17.6,193.2,0
	c69.8-61.7,182.7-193.9,203.7-238.4c43.1-70.5,43.1-198.5,21.5-251.4c-37.7-70.5-123.4-84-193.2-52.9c-11-26.4-43.1-110.4-128.7-128
	c-150.2-17.6-241.6,101.6-252.5,92.8c-32.1-22.3-182.7-114.6-284.6-119.2C18153.6,2099.9,18078.5,2188.1,18062.3,2245.6
	L18062.3,2245.6z`: '' : `M18062.3,2245.6
	c-32.1,154.5-16.3,264.9,11,405.9c5.3,26.4,21.5,66.3,37.7,84c128.7,128,408,88.1,611.7,79.3c64.5-4.6,176.9,17.6,193.2,0
	c69.8-61.7,182.7-193.9,203.7-238.4c43.1-70.5,43.1-198.5,21.5-251.4c-37.7-70.5-123.4-84-193.2-52.9c-11-26.4-43.1-110.4-128.7-128
	c-150.2-17.6-241.6,101.6-252.5,92.8c-32.1-22.3-182.7-114.6-284.6-119.2C18153.6,2099.9,18078.5,2188.1,18062.3,2245.6
	L18062.3,2245.6z`}
          />
          <path
            fill={conditionToColor(this.props.teeth[74].condition)}
            onClick={() => {
              this.toggleSelectedNumber(74);
              this.props.onClick(74);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 74)
                ? (this.state.statusDoneTeeth.includes(74) ? "#369661" : "#DE2527")
                : this.checkImpacted(74) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(74) ? isMissing ? `M18556.3,2232.1
	c69.8,39.9,53.6,176.3,37.7,260.2 M18948,2272c16.3,31.1,10.5,123.4-16.3,185.1`: '' : `M18556.3,2232.1
	c69.8,39.9,53.6,176.3,37.7,260.2 M18948,2272c16.3,31.1,10.5,123.4-16.3,185.1`}
          />
          {this.isShownRedGraphic("rootCanal", "", 74) && (
            <path
              fill={this.state.statusDoneTeeth.includes(74) ? "#369661" : "#DE2527"}
              d="M18246.3,2865.7c-34.6,75.9-74.2,180.3-94,313.2c-69.2,417.6,94,754.5,113.7,754.5
	c19.8-4.7-24.7-474.5,29.7-754.5c4.9-42.7,24.7-128.1,98.9-180.3c14.8-9.5,59.3-38,113.7-33.2c59.3,4.7,94,42.7,108.8,56.9
	c64.3,66.4,64.3,156.6,69.2,185.1c4.9,237.3,44.5,735.5,59.3,735.5c14.8,0,89-303.7,64.3-716.6c-9.9-151.9-29.7-275.2-44.5-365.4
	c-49.5-19-133.5-52.2-252.2-52.2C18389.7,2804,18295.8,2841.9,18246.3,2865.7z"
            />
          )}
          {this.isShownRedGraphic("rootCanal", "Post and Core", 74) && (
            <path
              id="ehXMLID_5_"
              fill={this.state.statusDoneTeeth.includes(74) ? "#369661" : "#DE2527"}
              d="M18757.3,2876.3c29.5-51.4-22.2-80.4-12.9-204.5c8.5-117.4,60.7-167.1,30.3-190.2
	c-41.7-32-139.1,64.7-317.5,68.1c-143.2,3-228.1-56.7-260.9-25c-24.3,23.7,17.4,63.1,43.7,157.8c38.8,139.8-17,182.8,26.3,233.2
	C18352.5,3015.1,18693.8,2988.7,18757.3,2876.3z"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 74) && (
            <rect
              x="18056.1"
              y="2497.4"
              fill={this.state.statusDoneTeeth.includes(74) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(74) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="1050.9"
              height="113.9"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 74) && (
            <rect
              x="18349.6"
              y="2438.3"
              fill={this.state.statusDoneTeeth.includes(74) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(74) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="362.5"
              height="232"
            />
          )}
          {this.isShownRedGraphic("whitening", "", 74) && (
            <polygon
              fill={this.state.statusDoneTeeth.includes(74) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(74) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              points="18322.6,2244.1 18238.2,2179.8 18236.9,2283.9 
	18147.9,2341.8 18249.5,2375.1 18278.8,2475.2 18342.9,2391.8 18450.1,2395.6 18388,2310.7 18425,2213.1 "
            />
          )}
          {this.isShownRedGraphic("hygiene", "", 74) && (
            <g>
              <g>
                <path
                  fill={this.state.statusDoneTeeth.includes(74) ? "#369661" : "#DE2527"}
                  d="M18132.6,2444.2l3.2-143.4c0-2.1-1.8-4.1-4-4.2l-4.1-0.2l0.6-27.9c0-2.2-1.7-4.1-4-4.2l-7.8-0.4l1.1-51.8
			l24.9-22.4c1.6-1.5,1.7-4,0.1-5.6c-1.6-1.6-4.2-1.8-5.8-0.3l-27.3,24.6l-1.2,55.1l-8.6-0.5c-1.1-0.1-2.1,0.3-2.9,1
			c-0.8,0.7-1.2,1.7-1.3,2.8l-0.6,27.9l-4.1-0.2c-2.3-0.1-4.1,1.6-4.2,3.8l-3.2,143.4c0,1.1,0.4,2.1,1.1,2.9s1.8,1.3,2.9,1.3l41,2.2
			C18130.7,2448.1,18132.5,2446.4,18132.6,2444.2z M18103.5,2271.2l16.4,0.9l-0.5,23.9l-16.4-0.9L18103.5,2271.2z M18091.6,2438.1
			l3-135.5l4.1,0.2v0l24.6,1.3l0,0l4.1,0.2l-3,135.5L18091.6,2438.1z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("diagnosis", "", 74) && (
            <g>
              <g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)">
                <path
                  fill={this.state.statusDoneTeeth.includes(74) ? "#369661" : "#DE2527"}
                  d="M188367.2-16672c-102.9,47.7-226.8,66.9-351.1,55.5c-56.2-5.1-170.5-35.6-223.7-59.8
			c-239.2-108.2-407.2-327.4-445.5-581c-40.6-271.5,70.1-521.9,293.5-661.2c129.7-80.9,268.1-113.4,419.6-98.2l52,4.9l39.3-213
			l39.5-213.9l-43.8-12.2c-76.5-21.1-77.6,17.6,13.6-476.6c43.8-237.4,84.2-437.5,89.1-445.6c7.2-10.9,14-15.2,27.2-17
			c25.6-3.8,272.3,59.6,286.9,73.4c7.7,7.4,13.3,19,14.1,30.6c1.5,10.5-33,211.2-76.5,447c-90,482.6-80.3,453.7-144.9,440.2
			l-34.3-7.3l-39.2,212.2c-21.5,116.7-37.8,214.3-36.5,216.3c1.3,2,18.7,10.6,39.1,18.6c203.9,82.9,378.3,285.9,436.4,507.1
			C188806.4-17130.1,188659-16806.6,188367.2-16672z M188456.9-16925.1c132.8-146.6,171.2-354.8,102.5-550.7
			c-24.3-68.7-94.1-175-150.5-228c-49.1-46.1-121.1-93.6-178.2-117.6c-49-21.1-146.1-44.4-195.4-47.3c-54-2.9-136.7,7.1-191.9,24.3
			c-70.2,21.5-171.3,85.4-217.8,136.5c-131.8,146-170.5,355.8-100.8,551.1c22,62.2,84.3,160.3,134,210.4
			c160,162.6,393.1,222.2,596.5,152C188315.3-16814.5,188417.4-16881.1,188456.9-16925.1z"
                />
                <path
                  fill={this.state.statusDoneTeeth.includes(74) ? "#369661" : "#DE2527"}
                  d="M187947.6-16848.3c-63-17.3-103.9-35.6-154.9-69c-174.4-114.9-265-322.2-227.4-519.1
			c18.3-96.7,46.7-148.1,71.2-129.7c12.4,9.5,12.5,23-2.5,55.3c-21,46.1-36,139.3-32.1,194.9c2.4,26.4,9.9,69.8,16.9,97
			c12.7,45.1,17.8,54.8,64.2,124.8c46.1,69.5,53.8,79,90.4,108.5c53.8,43.9,108.8,71.9,177.1,91c57.3,15.9,67.7,22.3,64.4,40.1
			C188011.5-16835.8,187997.1-16834.7,187947.6-16848.3z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("implantation", "", 74) && (
            <path
              fill={this.state.statusDoneTeeth.includes(74) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(74) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M19006.2,2785.5h-921.9c-55.1,0-100,65.2-100,145.5
	s44.8,145.5,100,145.5h338.4v66.2H18252c-35.2,0-63.4,41.6-63.4,92.3c0,51.2,28.6,92.3,63.4,92.3h170.7v66.2h-116.2
	c-35.2,0-63.4,41.6-63.4,92.3c0,51.2,28.6,92.3,63.4,92.3h116.2v66.2h-61.8c-35.2,0-63.4,41.6-63.4,92.3c0,51.2,28.6,92.3,63.4,92.3
	h61.8v66.2h-7.3c-35.2,0-63.4,41.6-63.4,92.3c0,51.2,28.6,92.3,63.4,92.3h259.7c35.2,0,63.4-41.6,63.4-92.3
	c0-51.2-28.6-92.3-63.4-92.3h-7.3V3829h61.8c35.2,0,63.4-41.6,63.4-92.3c0-51.2-28.6-92.3-63.4-92.3h-61.8v-66.2h116.2
	c35.2,0,63.4-41.6,63.4-92.3c0-51.2-28.6-92.3-63.4-92.3h-116.2v-66.2h170.7c35.2,0,63.4-41.6,63.4-92.3c0-51.2-28.6-92.3-63.4-92.3
	h-170.7V3076h338.4c55.1,0,100-65.2,100-145.5C19105.8,2850.3,19061.3,2785.5,19006.2,2785.5z"
            />
          )}


          <path
            fill="#F2ECBE"
            onClick={() => {
              this.toggleSelectedNumber(75);
              this.props.onClick(75);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 75)
                ? (this.state.statusDoneTeeth.includes(75) ? "#369661" : "#DE2527")
                : this.checkImpacted(75) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(82) ? isMissing ? `M20045.1,2713.7l135.5,67.3
	c41.8,210.6,57.1,426.3,41.8,641.6c-26,367.9-57.1,488.9-114.6,497.8c-88.6,4.6-124.8-228.7-135.5-278.3
	c-5.1-94.2-93.7-215.2-98.8-246.8c-15.8-45-15.8-224.5-72.8-233.3c-20.9,22.3-98.8,188.3-26,462c15.8,53.8,130.4,354.4,83.5,372.5
	c-182.3,71.9-458.3-623.5-463.4-780.7c-15.8-85.4-10.2-376.7,20.9-439.8L20045.1,2713.7L20045.1,2713.7z` : "" : `M20045.1,2713.7l135.5,67.3
	c41.8,210.6,57.1,426.3,41.8,641.6c-26,367.9-57.1,488.9-114.6,497.8c-88.6,4.6-124.8-228.7-135.5-278.3
	c-5.1-94.2-93.7-215.2-98.8-246.8c-15.8-45-15.8-224.5-72.8-233.3c-20.9,22.3-98.8,188.3-26,462c15.8,53.8,130.4,354.4,83.5,372.5
	c-182.3,71.9-458.3-623.5-463.4-780.7c-15.8-85.4-10.2-376.7,20.9-439.8L20045.1,2713.7L20045.1,2713.7z`}
          />
          <path
            fill={conditionToColor(this.props.teeth[75].condition)}
            onClick={() => {
              this.toggleSelectedNumber(75);
              this.props.onClick(75);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 75)
                ? (this.state.statusDoneTeeth.includes(75) ? "#369661" : "#DE2527")
                : this.checkImpacted(75) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(82) ? isMissing ? `M19675.3,2270.7
	c74.2-56.1,132.2-140.1,201.3-177.7c190.7-79.3,354.4,163.8,391.5,261.6c42.2,144.7-32,346.1-84.9,430
	c-26.4,27.8-121.5,9.3-201.3,9.3c-105.8,9.3-185.1,79.3-275.1,84c-47.8,0-201.3-23.2-317.3-98.3c-74.2-37.6-185.1-303.9-201.3-331.7
	c-58.5-121.5,127.1-275.6,180-317.8c32-13.9,68.7-9.3,100.7,0C19548.2,2167.7,19633.1,2219.2,19675.3,2270.7L19675.3,2270.7z`: '' : `M19675.3,2270.7
	c74.2-56.1,132.2-140.1,201.3-177.7c190.7-79.3,354.4,163.8,391.5,261.6c42.2,144.7-32,346.1-84.9,430
	c-26.4,27.8-121.5,9.3-201.3,9.3c-105.8,9.3-185.1,79.3-275.1,84c-47.8,0-201.3-23.2-317.3-98.3c-74.2-37.6-185.1-303.9-201.3-331.7
	c-58.5-121.5,127.1-275.6,180-317.8c32-13.9,68.7-9.3,100.7,0C19548.2,2167.7,19633.1,2219.2,19675.3,2270.7L19675.3,2270.7z`}
          />
          <path
            fill={conditionToColor(this.props.teeth[75].condition)}
            onClick={() => {
              this.toggleSelectedNumber(75);
              this.props.onClick(75);
            }}
            stroke={
              this.isShownRedGraphic("prosthetics", "", 75)
                ? (this.state.statusDoneTeeth.includes(75) ? "#369661" : "#DE2527")
                : this.checkImpacted(75) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(82) ? isMissing ? `M19744.4,2451.6c5.1-70-26.4-149.4-68.7-196.2
	 M19897.5,2484.5c-26.4-13.9-164.2-74.7-259.3,9.3`: '' : `M19744.4,2451.6c5.1-70-26.4-149.4-68.7-196.2
	 M19897.5,2484.5c-26.4-13.9-164.2-74.7-259.3,9.3`}
          />
          {this.isShownRedGraphic("rootCanal", "", 75) && (
            <path
              fill={this.state.statusDoneTeeth.includes(75) ? "#369661" : "#DE2527"}
              d="M19522.4,2928.9c-19.7,103.6-34.5,254.8-4.9,423.2c64.1,371.4,281.1,613.3,291,608.9
	c9.9-4.3-192.3-431.9-212.1-760.1c-4.9-47.5-4.9-133.9,59.2-177.1c59.2-38.9,148-30.2,192.3-17.3
	c281.1,90.7,187.4,859.4,231.8,859.4c24.7,0,103.6-289.4,34.5-626.2c-29.6-151.2-83.8-276.4-128.2-362.8c-69-8.6-157.8-13-266.3,4.3
	C19640.7,2894.3,19571.7,2911.6,19522.4,2928.9L19522.4,2928.9z"
            />
          )}
          {this.isShownRedGraphic("rootCanal", "Post and Core", 75) && (
            <path
              id="ehXMLID_6_"
              fill={this.state.statusDoneTeeth.includes(75) ? "#369661" : "#DE2527"}
              d="M19984.4,2890.8c27.3-48.4-20.5-75.7-11.9-192.6c7.8-110.6,56-157.4,28-179.1
	c-38.4-30.2-128.4,61-293,64.1c-132.1,2.8-210.5-53.4-240.8-23.6c-22.4,22.3,16.1,59.4,40.3,148.6c35.8,131.6-15.7,172.2,24.3,219.6
	C19610.7,3021.5,19925.8,2996.7,19984.4,2890.8z"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 75) && (
            <rect
              x="19256.9"
              y="2508.1"
              fill={this.state.statusDoneTeeth.includes(75) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(75) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="970.4"
              height="113.9"
            />
          )}
          {this.isShownRedGraphic("orthodontics", "", 75) && (
            <rect
              x="19585.8"
              y="2449.1"
              fill={this.state.statusDoneTeeth.includes(75) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(75) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              width="351.6"
              height="232"
            />
          )}
          {this.isShownRedGraphic("diagnosis", "", 75) && (
            <g>
              <g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)">
                <path
                  fill={this.state.statusDoneTeeth.includes(75) ? "#369661" : "#DE2527"}
                  d="M194150.7-16380.5c-108.6-37.8-211.4-110.9-292.2-206.3c-36.6-43.1-96.2-145.4-116.7-200.2
			c-92.5-246.1-52.9-522.4,104.7-732.5c169-224.7,431.2-327.9,693-271.7c152,32.6,275,106.2,372.5,223.6l33.7,40l183.7-126.3
			l184.4-126.8l-22.5-39.5c-39.4-68.9-68.5-41.8,357.6-334.8c204.7-140.8,379.6-257,389.1-259.4c13.1-2.9,21.1-1.1,31.9,6.8
			c21.2,15.3,151.7,234.2,152.1,254.4c0.1,10.7-4.3,23-12.2,32c-6.6,8.7-177.8,129.5-381.1,269.3
			c-416.8,285.6-388.7,271.4-425.1,216.4l-19.3-29.3l-183,125.9c-100.6,69.2-183.5,128.3-184,130.7s5.7,20.8,14.5,40.9
			c85.7,203,62.5,472.2-57.3,672.7C194799.9-16403.2,194458.1-16273,194150.7-16380.5z M194399.7-16500.4
			c202.2-12.7,381.7-136.2,475.4-326c32.8-66.7,60.3-192.5,58.6-270.4c-1.5-67.8-18.5-152.7-41.9-210
			c-19.7-49.6-72.4-134.6-105.6-171.4c-36.7-40-103.2-90.8-155.3-117.1c-66-33.7-185.1-58.6-255.8-54.2
			c-201.1,13-382,137.4-474.5,327.4c-29.6,60.4-56.6,175-57.5,246c-4,229.8,119.6,436.5,316.6,528.6
			C194217.5-16519.9,194339.3-16496.3,194399.7-16500.4z"
                />
                <path
                  fill={this.state.statusDoneTeeth.includes(75) ? "#369661" : "#DE2527"}
                  d="M193978.6-16802.5c-32.5-56.7-48.5-98.6-60.7-158.6c-41.1-205.4,45.2-418.8,215.9-534.7
			c83.7-57,141.6-74.2,145.8-43.7c2,15.6-7.8,25.4-42.1,38.2c-48.6,18.6-127.5,75.4-165.3,118.3c-17.6,20.8-43.9,57.4-58.7,82
			c-23.8,41.5-27.3,52.1-45.1,135.3c-17.7,82.6-19.2,94.8-14.4,141.9c6.5,69.5,25.5,128.4,60.5,190.1c29.4,51.7,32.2,63.6,16.8,74.2
			C194015.3-16748.6,194004.1-16757.9,193978.6-16802.5z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("whitening", "", 75) && (
            <polygon
              fill={this.state.statusDoneTeeth.includes(75) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(75) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              points="20058.1,2260.8 19976.3,2196.5 19975.1,2300.6 
	19888.7,2358.6 19987.3,2391.9 20015.7,2491.9 20077.8,2408.5 20181.8,2412.3 20121.6,2327.5 20157.4,2229.8 "
            />
          )}
          {this.isShownRedGraphic("hygiene", "", 75) && (
            <g>
              <g>
                <path
                  fill={this.state.statusDoneTeeth.includes(75) ? "#369661" : "#DE2527"}
                  d="M19327.1,2454.9l3.1-143.4c0-2.1-1.8-4.1-3.9-4.2l-4-0.2l0.6-27.9c0-2.2-1.7-4.1-3.9-4.2l-7.5-0.4
			l1.1-51.8l24.1-22.4c1.6-1.5,1.6-4,0.1-5.6c-1.5-1.6-4-1.8-5.6-0.3l-26.5,24.6l-1.2,55.1l-8.4-0.5c-1.1-0.1-2.1,0.3-2.8,1
			c-0.8,0.7-1.2,1.7-1.2,2.8l-0.6,27.9l-4-0.2c-2.2-0.1-4,1.6-4.1,3.8l-3.1,143.4c0,1.1,0.4,2.1,1.1,2.9s1.7,1.3,2.8,1.3l39.8,2.2
			C19325.2,2458.8,19327.1,2457.2,19327.1,2454.9z M19298.9,2281.9l15.9,0.9l-0.5,23.9l-15.9-0.9L19298.9,2281.9z M19287.4,2448.8
			l2.9-135.5l4,0.2v0l23.9,1.3l0,0l4,0.2l-2.9,135.5L19287.4,2448.8z"
                />
              </g>
            </g>
          )}
          {this.isShownRedGraphic("implantation", "", 75) && (
            <path
              fill={this.state.statusDoneTeeth.includes(75) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(75) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M20266.9,2847.5h-894.2c-53.5,0-97,65.2-97,145.5
	s43.5,145.5,97,145.5h328.2v66.2h-165.6c-34.1,0-61.5,41.6-61.5,92.3c0,51.2,27.7,92.3,61.5,92.3h165.6v66.2h-112.7
	c-34.1,0-61.5,41.6-61.5,92.3c0,51.2,27.7,92.3,61.5,92.3h112.7v66.2h-59.9c-34.1,0-61.5,41.6-61.5,92.3c0,51.2,27.7,92.3,61.5,92.3
	h59.9v66.2h-7.1c-34.1,0-61.5,41.6-61.5,92.3c0,51.2,27.7,92.3,61.5,92.3h251.9c34.1,0,61.5-41.6,61.5-92.3
	c0-51.2-27.7-92.3-61.5-92.3h-7.1V3891h59.9c34.1,0,61.5-41.6,61.5-92.3c0-51.2-27.7-92.3-61.5-92.3h-59.9v-66.2h112.7
	c34.1,0,61.5-41.6,61.5-92.3c0-51.2-27.7-92.3-61.5-92.3h-112.7v-66.2h165.6c34.1,0,61.5-41.6,61.5-92.3c0-51.2-27.7-92.3-61.5-92.3
	h-165.6V3138h328.2c53.5,0,97-65.2,97-145.5C20363.5,2912.3,20320.3,2847.5,20266.9,2847.5z"
            />
          )}


          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 81)
                ? (this.state.statusDoneTeeth.includes(81) ? "#369661" : "#DE2527")
                : this.checkImpacted(81) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(81) ? isMissing ? `M16107.8,1294.1
	c-38.5-104.8-120.6-244-159.6-274.2c-53.3-39.9-106.2-34.8-145.2-19.9c-62.6,29.7-207.8,189.3-261.2,298.8
	c-14.4,34.8-14.4,129.4-9.7,209.2c14.4,54.7,43.6,99.7,77.5,124.8c38.5,19.9,87.2,25.1,149.8,45c53.3,19.9,174,19.9,222.2-5.1
	c77.5-39.9,111.3-139.6,125.7-194.4C16112.9,1423.9,16122.2,1353.9,16107.8,1294.1L16107.8,1294.1z` : '' : `M16107.8,1294.1
	c-38.5-104.8-120.6-244-159.6-274.2c-53.3-39.9-106.2-34.8-145.2-19.9c-62.6,29.7-207.8,189.3-261.2,298.8
	c-14.4,34.8-14.4,129.4-9.7,209.2c14.4,54.7,43.6,99.7,77.5,124.8c38.5,19.9,87.2,25.1,149.8,45c53.3,19.9,174,19.9,222.2-5.1
	c77.5-39.9,111.3-139.6,125.7-194.4C16112.9,1423.9,16122.2,1353.9,16107.8,1294.1L16107.8,1294.1z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 81)
                ? (this.state.statusDoneTeeth.includes(81) ? "#369661" : "#DE2527")
                : this.checkImpacted(81) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(81) ? isMissing ? `M15871.2,1070c-33.9,0-58,19.9-62.6,45
	c-9.7,19.9-19.5,49.6-29.2,69.6l-72.4,59.8c-33.9,25.1-62.6,49.6-77.5,89.5c-9.7,25.1,4.6,34.8,29.2,34.8h33.9
	c24.1-9.7,53.3-5.1,96.5,0c43.6,5.1,87.2,0,130.4-5.1h62.6c24.1-5.1,48.2,0,53.3-29.7c0-34.8-9.7-64.9-29.2-99.7
	c-19.5-29.7-38.5-64.9-58-94.6C15929.2,1109.9,15905.1,1079.7,15871.2,1070L15871.2,1070z` : '' : `M15871.2,1070c-33.9,0-58,19.9-62.6,45
	c-9.7,19.9-19.5,49.6-29.2,69.6l-72.4,59.8c-33.9,25.1-62.6,49.6-77.5,89.5c-9.7,25.1,4.6,34.8,29.2,34.8h33.9
	c24.1-9.7,53.3-5.1,96.5,0c43.6,5.1,87.2,0,130.4-5.1h62.6c24.1-5.1,48.2,0,53.3-29.7c0-34.8-9.7-64.9-29.2-99.7
	c-19.5-29.7-38.5-64.9-58-94.6C15929.2,1109.9,15905.1,1079.7,15871.2,1070L15871.2,1070z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 81)
              ? (this.state.statusDoneTeeth.includes(81) ? "#369661" : "#DE2527")
              : this.checkImpacted(81) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(81) ? isMissing ? `M16030.4,1339.5c5.1-34.8-9.7-79.8-24.1-99.7
	c-9.8-20-48.3-84.9-72.4-124.8c-14.4-25.1-38.5-39.9-58-39.9 M15692.2,1364c-19.5,4.6-43.6,4.6-58-5.1c-9.8-14.8,0-39.9,9.7-49.6
	c33.9-55.2,116-99.7,135.5-124.8c9.3-10.2,19-50.1,38.5-64.9 M15788.7,1363.6c63,10.2,125.7-4.6,193.4-9.7` : '' : `M16030.4,1339.5c5.1-34.8-9.7-79.8-24.1-99.7
	c-9.8-20-48.3-84.9-72.4-124.8c-14.4-25.1-38.5-39.9-58-39.9 M15692.2,1364c-19.5,4.6-43.6,4.6-58-5.1c-9.8-14.8,0-39.9,9.7-49.6
	c33.9-55.2,116-99.7,135.5-124.8c9.3-10.2,19-50.1,38.5-64.9 M15788.7,1363.6c63,10.2,125.7-4.6,193.4-9.7`}
          />
          {this.isShownRedGraphic("restoration", "Distal", 81) && (
            <path
              fill={this.state.statusDoneTeeth.includes(81) ? "#369661" : "#DE2527"}
              d="M15742.3,1029.7l-80,76.7c-62.8,71.3-102.8,109.6-125.7,169.9c-17.1,43.8-17.1,82.2-17.1,120.6
	c0,32.9,0,71.3,11.4,115.1c5.7,27.4,28.6,109.6,85.7,126.1c5.7,5.5,28.6,11,40,11c22.8,5.5,45.7,11,57.1,16.4
	c22.8-76.7,45.7-169.9,57.1-279.5C15776.6,1243.5,15759.5,1117.4,15742.3,1029.7L15742.3,1029.7z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Lingual", 81) && (
            <path
              fill={this.state.statusDoneTeeth.includes(81) ? "#369661" : "#DE2527"}
              d="M15905.2,1683.8c39.4,0,73.1-5.8,106.8-17.5c5.6-5.8,11.2-5.8,11.2-5.8c-22.5-46.7-45-99.3-56.2-169.4
	c-11.2-58.4-16.9-111-22.5-157.7c-28.1,5.8-67.5,11.7-106.8,11.7h-106.8c-5.6,40.9-11.2,87.6-16.9,134.4
	c-11.2,64.3-28.1,122.7-39.4,175.2c16.9,5.8,33.7,11.7,56.2,17.5c16.9,5.8,39.4,11.7,73.1,17.5
	C15832.1,1689.6,15865.9,1689.6,15905.2,1683.8L15905.2,1683.8z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Medial", 81) && (
            <path
              fill={this.state.statusDoneTeeth.includes(81) ? "#369661" : "#DE2527"}
              d="M16109.3,1278.6c-24.7-54.1-55.6-113.7-98.8-173.2c-24.7-32.5-43.2-59.5-67.9-86.6
	c-30.9,65-61.7,173.2-61.7,303.1c0,162.4,49.4,286.9,86.4,362.6c18.5-16.2,43.2-32.5,67.9-59.5c43.2-54.1,61.7-102.8,74.1-135.3
	C16115.5,1419.4,16127.8,1343.6,16109.3,1278.6z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Buccal", 81) && (
            <path
              fill={this.state.statusDoneTeeth.includes(81) ? "#369661" : "#DE2527"}
              d="M15971.7,1032.5c-9.8-9.1-39.3-36.4-88.4-45.5c-9.8,0-44.2-4.6-83.4,9.1c-14.7,4.6-29.5,13.7-39.3,22.8
	c-19.6,13.7-34.4,27.3-44.2,41c14.7,50.1,24.5,113.8,24.5,186.6c0,36.4,0,72.8-4.9,104.7c24.5,4.6,54,4.6,88.4,4.6
	s68.7-9.1,88.4-13.7c0-41,0-91,9.8-145.6C15942.2,1132.6,15956.9,1078,15971.7,1032.5z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 81) && (
            <path
              fill={this.state.statusDoneTeeth.includes(81) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(81) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M15512.4,1230.4h625.8v152h-625.8V1230.4z M15512.4,1633.7h625.8
	v-152h-625.8V1633.7z"
            />
          )}
          
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 72)
                ? (this.state.statusDoneTeeth.includes(72) ? "#369661" : "#DE2527")
                : this.checkImpacted(72) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d=  {this.checkMissing(72) ? isMissing ? `M17144.2,1071.3c-27.4-14.3-76.5-19.4-116.4,9.4
	c-27.4,14.8-72.4,72.3-81.2,106.2c-9.2,33.9-18,58-31.5,82.1c-13.5,19-71.9,67.3-85.4,91.4c-13.5,24.2-40.4,125.3-13.5,207.4
	c13.5,48.3,90,129.9,130.4,149.4c40.3,19.4,184.2,24.1,260.7,9.7c53.8-24.2,148.4-82.1,206.9-207.4c17.7-48.3,26.9-106.3-4.6-149.4
	C17328.4,1259.2,17234.2,1158,17144.2,1071.3L17144.2,1071.3z` : '' : `M17144.2,1071.3c-27.4-14.3-76.5-19.4-116.4,9.4
	c-27.4,14.8-72.4,72.3-81.2,106.2c-9.2,33.9-18,58-31.5,82.1c-13.5,19-71.9,67.3-85.4,91.4c-13.5,24.2-40.4,125.3-13.5,207.4
	c13.5,48.3,90,129.9,130.4,149.4c40.3,19.4,184.2,24.1,260.7,9.7c53.8-24.2,148.4-82.1,206.9-207.4c17.7-48.3,26.9-106.3-4.6-149.4
	C17328.4,1259.2,17234.2,1158,17144.2,1071.3L17144.2,1071.3z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 72)
                ? (this.state.statusDoneTeeth.includes(72) ? "#369661" : "#DE2527")
                : this.checkImpacted(72) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(72) ? isMissing ? `M17040.8,1158.1L17040.8,1158.1
	c13.4-24.1,35.7-33.9,49.6-34.4c31.5,0,45,29.3,45,72.4c0,9.8,0,24.2,4.6,33.9c26.9,4.7,35.8,19,22.3,52.9
	c27.4,9.7,54.3,14.3,81.2,9.7c17.6,0,35.7,28.8,53.8,52.9c26.9,33.9,22.7,72.4,18.1,110.9c-9.2,14.4-9.2,28.8-49.6,28.8
	c-22.7-14.4-26.9-29.3-31.5-33.9c-27.4,0-54.3-4.6-81.2-4.6c-18.1-4.7-31.5-9.8-45-14.4c-22.7-5.1-45-9.7-63.1-9.7
	c-45,9.7-117.3,86.7-139.6,9.7v-28.8c0-38.5,18.1-52.9,40.4-67.3c0-19,4.6-33.4,4.6-52.9c18.1-14.4,31.5-24.1,49.6-38.5
	c0-14.4,0-24.1,4.6-38.5C17018.5,1192,17027.3,1172.5,17040.8,1158.1L17040.8,1158.1z` : '' : `M17040.8,1158.1L17040.8,1158.1
	c13.4-24.1,35.7-33.9,49.6-34.4c31.5,0,45,29.3,45,72.4c0,9.8,0,24.2,4.6,33.9c26.9,4.7,35.8,19,22.3,52.9
	c27.4,9.7,54.3,14.3,81.2,9.7c17.6,0,35.7,28.8,53.8,52.9c26.9,33.9,22.7,72.4,18.1,110.9c-9.2,14.4-9.2,28.8-49.6,28.8
	c-22.7-14.4-26.9-29.3-31.5-33.9c-27.4,0-54.3-4.6-81.2-4.6c-18.1-4.7-31.5-9.8-45-14.4c-22.7-5.1-45-9.7-63.1-9.7
	c-45,9.7-117.3,86.7-139.6,9.7v-28.8c0-38.5,18.1-52.9,40.4-67.3c0-19,4.6-33.4,4.6-52.9c18.1-14.4,31.5-24.1,49.6-38.5
	c0-14.4,0-24.1,4.6-38.5C17018.5,1192,17027.3,1172.5,17040.8,1158.1L17040.8,1158.1z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 72)
                ? (this.state.statusDoneTeeth.includes(72) ? "#369661" : "#DE2527")
                : this.checkImpacted(72) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(72) ? isMissing ? `M17045.8,1162.7c-18.1,9.7-31.5,24.1-45,48.2
	c-4.6,9.7,4.6,24.1,0,38.5c-4.6,9.8-40.8,24.2-49.6,33.9c-4.6,9.8,0,33.4-4.6,52.9c-4.7,14.4-31.6,19.5-36.2,33.9
	c-4.6,14.4-4.6,43.1-4.6,62.6 M17090.1,1129.3c22.7-9.2,31.5,0,45,33.9c9.2,19.1-4.2,52.9,4.6,67.3c8.8,9.8,22.3,4.7,26.9,14.4
	c4.6,9.7-8.8,33.9,0,38.5c13.4,19.5,94.2,0,98.8,24.1s40.3,43.6,49.6,62.6c9.2,19,4.6,57.5,4.6,91.4 M17027.3,1422.9
	c27.3-5.1,76.5,0,94.6,14.4c22.3,19,80.8,4.7,112.3,14.4` : '' : `M17045.8,1162.7c-18.1,9.7-31.5,24.1-45,48.2
	c-4.6,9.7,4.6,24.1,0,38.5c-4.6,9.8-40.8,24.2-49.6,33.9c-4.6,9.8,0,33.4-4.6,52.9c-4.7,14.4-31.6,19.5-36.2,33.9
	c-4.6,14.4-4.6,43.1-4.6,62.6 M17090.1,1129.3c22.7-9.2,31.5,0,45,33.9c9.2,19.1-4.2,52.9,4.6,67.3c8.8,9.8,22.3,4.7,26.9,14.4
	c4.6,9.7-8.8,33.9,0,38.5c13.4,19.5,94.2,0,98.8,24.1s40.3,43.6,49.6,62.6c9.2,19,4.6,57.5,4.6,91.4 M17027.3,1422.9
	c27.3-5.1,76.5,0,94.6,14.4c22.3,19,80.8,4.7,112.3,14.4`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 71)
                ? (this.state.statusDoneTeeth.includes(71) ? "#369661" : "#DE2527")
                : this.checkImpacted(71) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(71) ? isMissing ? `M16176.5,1496.7c-4.6-54.7-14.4-124.3-0.5-184.2
	c39-104.9,121.1-244.5,159.6-274.2c53.3-39.8,106.7-34.7,145.2-19.9c63.1,29.7,207.9,189.3,261.2,298.8
	c14.3,34.8,14.3,129.4,9.7,209.2c-14.9,55.2-43.6,99.8-77.5,124.8c-38.5,20-87.2,25.1-149.8,45c-52.9,20-174,20-222.2-5.1
	C16224.7,1651.2,16190.9,1551.4,16176.5,1496.7L16176.5,1496.7z` : '' : `M16176.5,1496.7c-4.6-54.7-14.4-124.3-0.5-184.2
	c39-104.9,121.1-244.5,159.6-274.2c53.3-39.8,106.7-34.7,145.2-19.9c63.1,29.7,207.9,189.3,261.2,298.8
	c14.3,34.8,14.3,129.4,9.7,209.2c-14.9,55.2-43.6,99.8-77.5,124.8c-38.5,20-87.2,25.1-149.8,4 v5c-52.9,20-174,20-222.2-5.1
	C16224.7,1651.2,16190.9,1551.4,16176.5,1496.7L16176.5,1496.7z`} 
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 71)
                ? (this.state.statusDoneTeeth.includes(71) ? "#369661" : "#DE2527")
                : this.checkImpacted(71) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(71) ? isMissing ? `M16413.6,1088c33.4,0,58,20,62.1,45
	c9.7,20,19.5,49.7,29.2,69.6l72.4,59.8c33.9,24.6,63.1,49.6,77.5,89.5c9.3,25.1-5.1,34.8-29.2,34.8h-33.9c-24.1-9.7-52.9-5.1-96.5,0
	c-43.2,4.6-86.8,0-130.4-5.1h-62.6c-24.1-4.6-48.7,0-53.3-29.7c0-34.8,9.7-64.9,29.2-99.7c19.5-29.7,38.5-64.9,58-94.6
	C16355.6,1127.9,16379.7,1097.7,16413.6,1088L16413.6,1088z` : '' : `M16413.6,1088c33.4,0,58,20,62.1,45
	c9.7,20,19.5,49.7,29.2,69.6l72.4,59.8c33.9,24.6,63.1,49.6,77.5,89.5c9.3,25.1-5.1,34.8-29.2,34.8h-33.9c-24.1-9.7-52.9-5.1-96.5,0
	c-43.2,4.6-86.8,0-130.4-5.1h-62.6c-24.1-4.6-48.7,0-53.3-29.7c0-34.8,9.7-64.9,29.2-99.7c19.5-29.7,38.5-64.9,58-94.6
	C16355.6,1127.9,16379.7,1097.7,16413.6,1088L16413.6,1088z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 71)
                ? (this.state.statusDoneTeeth.includes(71) ? "#369661" : "#DE2527")
                : this.checkImpacted(71) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(71) ? isMissing ? `M16408.5,1092.7c-19.5,0-43.6,14.8-58,39.9
	c-24.2,39.9-62.7,104.9-72.4,124.8c-14.4,19.9-28.7,64.9-24.1,99.7 M16466.5,1137.8c19,15.3,28.8,55.2,38.5,64.9
	c19.5,25.1,101.6,70.1,135.5,124.8c9.7,9.7,19.4,34.8,9.7,49.6c-14.4,10.2-38.5,10.2-58,5.1 M16302.3,1372.5
	c67.7,4.6,130.8,19.4,193.4,9.7` : '' : `M16408.5,1092.7c-19.5,0-43.6,14.8-58,39.9
	c-24.2,39.9-62.7,104.9-72.4,124.8c-14.4,19.9-28.7,64.9-24.1,99.7 M16466.5,1137.8c19,15.3,28.8,55.2,38.5,64.9
	c19.5,25.1,101.6,70.1,135.5,124.8c9.7,9.7,19.4,34.8,9.7,49.6c-14.4,10.2-38.5,10.2-58,5.1 M16302.3,1372.5
	c67.7,4.6,130.8,19.4,193.4,9.7`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 73)
                ? (this.state.statusDoneTeeth.includes(73) ? "#369661" : "#DE2527")
                : this.checkImpacted(73) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(73) ? isMissing ? `M17499.2,1316.6L17499.2,1316.6
	c-24.1,46.8-20,110.9-3.3,144.8c36.2,63.6,72.4,127.6,116.9,178.6c32.5,29.7,121.1,106.2,137.3,110.4c32,8.4,165.6,13,201.8,0
	c44.5-17.2,112.7-157.7,133.1-217.1c12-55.2,19.9-119.2-4.2-178.6c-12-51-44.5-115-72.8-148.9c-44.5-59.4-89-89.1-153.5-127.6
	c-32.4-17.2-89-25.5-129.4,0C17652.8,1138,17515.4,1291.1,17499.2,1316.6L17499.2,1316.6z` : '' : `M17499.2,1316.6L17499.2,1316.6
	c-24.1,46.8-20,110.9-3.3,144.8c36.2,63.6,72.4,127.6,116.9,178.6c32.5,29.7,121.1,106.2,137.3,110.4c32,8.4,165.6,13,201.8,0
	c44.5-17.2,112.7-157.7,133.1-217.1c12-55.2,19.9-119.2-4.2-178.6c-12-51-44.5-115-72.8-148.9c-44.5-59.4-89-89.1-153.5-127.6
	c-32.4-17.2-89-25.5-129.4,0C17652.8,1138,17515.4,1291.1,17499.2,1316.6L17499.2,1316.6z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 73)
                ? (this.state.statusDoneTeeth.includes(73) ? "#369661" : "#DE2527")
                : this.checkImpacted(73) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(73) ? isMissing ? `M17612.4,1350.9c4.2-25.5,16.2-33.9,28.3-42.7
	c28.3-8.3,28.3-21.3,56.6-42.7c16.2-97.9,7.9-89.5,84.9-144.7c28.3,25.5,7.9,144.7,7.9,182.8c7.9,119.2-24.1,148.9-56.6,144.7
	c-24.1,17.2-76.5-13-104.8-25.5C17616.6,1401.9,17600.3,1389,17612.4,1350.9L17612.4,1350.9L17612.4,1350.9z M17866.6,1265.6
	c-16.2,17.2,7.9,46.9,12.1,55.2c7.9,17.2,16.2,46.9,4.2,64c-7.9,8.4-28.3,0-28.3,17.2c0,21.3,4.2,33.9,7.9,42.7
	c28.3,13,64.5,21.3,92.8-4.2c16.2-17.2,12.1-33.9,20.4-46.9c12.1-25.5,36.2-13,44.5-42.7c-4.2-29.7-16.2-46.9-36.2-76.5
	c-4.2-4.2-7.9-17.2-20.4-25.5C17955.7,1231.7,17887,1231.7,17866.6,1265.6L17866.6,1265.6z` : '' : `M17612.4,1350.9c4.2-25.5,16.2-33.9,28.3-42.7
	c28.3-8.3,28.3-21.3,56.6-42.7c16.2-97.9,7.9-89.5,84.9-144.7c28.3,25.5,7.9,144.7,7.9,182.8c7.9,119.2-24.1,148.9-56.6,144.7
	c-24.1,17.2-76.5-13-104.8-25.5C17616.6,1401.9,17600.3,1389,17612.4,1350.9L17612.4,1350.9L17612.4,1350.9z M17866.6,1265.6
	c-16.2,17.2,7.9,46.9,12.1,55.2c7.9,17.2,16.2,46.9,4.2,64c-7.9,8.4-28.3,0-28.3,17.2c0,21.3,4.2,33.9,7.9,42.7
	c28.3,13,64.5,21.3,92.8-4.2c16.2-17.2,12.1-33.9,20.4-46.9c12.1-25.5,36.2-13,44.5-42.7c-4.2-29.7-16.2-46.9-36.2-76.5
	c-4.2-4.2-7.9-17.2-20.4-25.5C17955.7,1231.7,17887,1231.7,17866.6,1265.6L17866.6,1265.6z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 73)
                ? (this.state.statusDoneTeeth.includes(73) ? "#369661" : "#DE2527")
                : this.checkImpacted(73) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d=  {this.checkMissing(73) ? isMissing ? `M17785.9,1385.3c-3.7-89.6,12.5-259.8-7.9-264
	c-12.1,0-52.4,42.2-64.5,59.4c-16.2,16.7-8.3,63.6-20.4,84.9` : '' : `M17785.9,1385.3c-3.7-89.6,12.5-259.8-7.9-264
	c-12.1,0-52.4,42.2-64.5,59.4c-16.2,16.7-8.3,63.6-20.4,84.9`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 73)
                ? (this.state.statusDoneTeeth.includes(73) ? "#369661" : "#DE2527")
                : this.checkImpacted(73) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d=  {this.checkMissing(73) ? isMissing ?  `M17975.7,1389.4c4.2-8.3,12.5-17.1,20.4-21.3
	c7.9-4.2,19.9-8.8,24.1-17.2c4.2-8.3-12-38-16.2-51c-4.2-8.3-32.5-51-40.4-55.2s-44.6-4.2-68.7,0` : '' : `M17975.7,1389.4c4.2-8.3,12.5-17.1,20.4-21.3
	c7.9-4.2,19.9-8.8,24.1-17.2c4.2-8.3-12-38-16.2-51c-4.2-8.3-32.5-51-40.4-55.2s-44.6-4.2-68.7,0`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 73)
                ? (this.state.statusDoneTeeth.includes(73) ? "#369661" : "#DE2527")
                : this.checkImpacted(73) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(73) ? isMissing ? `M17895.4,1448.5c-12.1,0-28.3,0-32.5-8.4
	c-4.2-8.4-8.4-42.7-4.2-46.9c3.7-8.4,16.2,0,24.1-8.4c4.2-13,4.2-46.9,0-68.2` : '' : `M17895.4,1448.5c-12.1,0-28.3,0-32.5-8.4
	c-4.2-8.4-8.4-42.7-4.2-46.9c3.7-8.4,16.2,0,24.1-8.4c4.2-13,4.2-46.9,0-68.2`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 73)
                ? (this.state.statusDoneTeeth.includes(73) ? "#369661" : "#DE2527")
                : this.checkImpacted(73) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d=  {this.checkMissing(73) ? isMissing ? `M17729.8,1448.8c-20.4,0-48.7,0-60.8-4.2
	c-7.9-4.6-40.3-17.2-52.4-38.5c-8.4-12.5-4.2-38-4.2-51` : '' : `M17729.8,1448.8c-20.4,0-48.7,0-60.8-4.2
	c-7.9-4.6-40.3-17.2-52.4-38.5c-8.4-12.5-4.2-38-4.2-51`}
          />
          {this.isShownRedGraphic("restoration", "Distal", 73) && (
            <path
              fill={this.state.statusDoneTeeth.includes(73) ? "#369661" : "#DE2527"}
              d="M17891.9,1107.8c42.2,27.3,105.4,77.4,152.9,150.2c21.1,31.9,31.6,59.2,42.2,86.5
	c31.6,95.6,10.5,173,5.3,191.2c-21.1,86.5-73.8,145.6-105.4,173c-42.2-59.2-100.2-163.9-116-304.9
	C17855,1276.2,17876.1,1171.5,17891.9,1107.8L17891.9,1107.8z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Buccal", 73) && (
            <path
              fill={this.state.statusDoneTeeth.includes(73) ? "#369661" : "#DE2527"}
              d="M17727.2,1069.7c49.5-20.9,107.3,4.2,115.5,8.4c8.3,4.2,20.6,12.6,33,16.8c20.6,12.6,33,20.9,45.4,29.3
	c-12.4,37.7-20.6,83.8-24.8,138.2c-4.1,67,0,121.5,8.3,167.6c-33,4.2-70.1,8.4-111.4,12.6c-33,4.2-66,4.2-94.9,4.2
	c0-54.5,0-117.3-12.4-188.5c-8.3-50.3-20.6-92.2-28.9-129.9c8.3-8.4,16.5-16.8,28.9-25.1
	C17698.3,1090.6,17710.7,1078.1,17727.2,1069.7z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Medial", 73) && (
            <path
              fill={this.state.statusDoneTeeth.includes(73) ? "#369661" : "#DE2527"}
              d="M17497.7,1317.4c4.5-4.4,13.6-21.9,27.2-35c9.1-13.1,18.2-21.9,45.4-48.1l68.1-65.6
	c18.2-17.5,31.8-30.6,45.4-39.4c18.2,65.6,40.8,148.7,45.4,253.7c4.5,131.2-18.2,240.6-36.3,319.3l-68.1-52.5
	c-49.9-52.5-90.8-118.1-131.6-183.7C17479.6,1444.3,17466,1365.5,17497.7,1317.4L17497.7,1317.4z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Lingual", 73) && (
            <path
              fill={this.state.statusDoneTeeth.includes(73) ? "#369661" : "#DE2527"}
              d="M17994.9,1689.7c-8.4,15.5-21,36.3-42,51.8c-12.6,10.4-25.2,15.5-109.1,15.5c-67.2,0-83.9,0-100.7-10.4
	c-25.2-10.4-46.2-25.9-50.4-31.1c-12.6-10.4-25.2-25.9-33.6-36.3c12.6-51.8,25.2-114,33.6-181.3c4.2-41.4,4.2-77.7,4.2-108.8
	c29.4,0,63,0,96.5-5.2c37.8,0,75.5-5.2,113.3-10.4c4.2,41.4,12.6,93.2,29.4,145C17948.7,1586.1,17973.9,1643.1,17994.9,1689.7
	L17994.9,1689.7z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 73) && (
            <path
              fill={this.state.statusDoneTeeth.includes(73) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(73) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M18105.2,1377.7h-639.7v-152h639.7V1377.7z M18105.2,1477h-639.7
	v152h639.7V1477z"
            />
          )}


          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 72)
                ? (this.state.statusDoneTeeth.includes(72) ? "#369661" : "#DE2527")
                : this.checkImpacted(72) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(72) ? isMissing ? `M17032.1,1086.3c40.8-28.8,90-24.2,116.4-9.4
	c90,86.8,184.2,187.9,265.4,298.8c31.5,43.2,22.7,101.2,4.6,149.4c-58.5,125.3-153.1,183.3-206.9,207.4
	c-76.5,14.4-220.3,9.8-260.7-9.7s-116.9-101.2-130.4-149.4c-26.9-82.1,0-183.3,13.5-207.4c13.5-24.1,71.9-71.9,85.4-91.4
	c13.4-24.1,22.2-48.2,31.5-82.1C16960.2,1158.7,17005.2,1100.7,17032.1,1086.3L17032.1,1086.3z` : '' : `M17032.1,1086.3c40.8-28.8,90-24.2,116.4-9.4
	c90,86.8,184.2,187.9,265.4,298.8c31.5,43.2,22.7,101.2,4.6,149.4c-58.5,125.3-153.1,183.3-206.9,207.4
	c-76.5,14.4-220.3,9.8-260.7-9.7s-116.9-101.2-130.4-149.4c-26.9-82.1,0-183.3,13.5-207.4c13.5-24.1,71.9-71.9,85.4-91.4
	c13.4-24.1,22.2-48.2,31.5-82.1C16960.2,1158.7,17005.2,1100.7,17032.1,1086.3L17032.1,1086.3z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 72)
                ? (this.state.statusDoneTeeth.includes(72) ? "#369661" : "#DE2527")
                : this.checkImpacted(72) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(72) ? isMissing ? `M17045.6,1163.3c13.5-24.1,36.2-33.9,49.6-33.9
	c31.5,0,45,28.8,45,72.4c0,9.7,0,24.1,4.6,33.9c26.9,4.6,36.2,19.5,22.3,52.9c26.9,9.7,53.8,14.4,81.2,9.7
	c18.1,0,36.2,28.8,53.8,52.9c26.9,33.9,22.3,72.4,18.1,110.9c-8.8,14.4-8.8,28.8-49.6,28.8c-22.3-14.4-26.9-28.8-31.5-33.9
	c-26.9,0-53.8-4.6-81.2-4.6c-18.1-4.6-31.5-9.7-45-14.4c-22.3-4.6-45-9.7-63.1-9.7c-45,9.7-116.9,86.7-139.6,9.7v-28.8
	c0-38.5,18.1-52.9,40.4-67.3c0-19.5,4.6-33.9,4.6-52.9c18.1-14.4,31.5-24.1,49.6-38.5c0-14.4,0-24.1,4.6-38.5
	C17023.3,1197.1,17032.1,1177.7,17045.6,1163.3L17045.6,1163.3L17045.6,1163.3z` : '' : `M17045.6,1163.3c13.5-24.1,36.2-33.9,49.6-33.9
	c31.5,0,45,28.8,45,72.4c0,9.7,0,24.1,4.6,33.9c26.9,4.6,36.2,19.5,22.3,52.9c26.9,9.7,53.8,14.4,81.2,9.7
	c18.1,0,36.2,28.8,53.8,52.9c26.9,33.9,22.3,72.4,18.1,110.9c-8.8,14.4-8.8,28.8-49.6,28.8c-22.3-14.4-26.9-28.8-31.5-33.9
	c-26.9,0-53.8-4.6-81.2-4.6c-18.1-4.6-31.5-9.7-45-14.4c-22.3-4.6-45-9.7-63.1-9.7c-45,9.7-116.9,86.7-139.6,9.7v-28.8
	c0-38.5,18.1-52.9,40.4-67.3c0-19.5,4.6-33.9,4.6-52.9c18.1-14.4,31.5-24.1,49.6-38.5c0-14.4,0-24.1,4.6-38.5
	C17023.3,1197.1,17032.1,1177.7,17045.6,1163.3L17045.6,1163.3L17045.6,1163.3z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 72)
                ? (this.state.statusDoneTeeth.includes(72) ? "#369661" : "#DE2527")
                : this.checkImpacted(72) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(72) ? isMissing ? `M17050.2,1168.4c-18.1,9.7-31.5,24.1-45,48.2
	c-4.6,9.7,4.6,24.1,0,38.5c-4.6,9.7-40.4,24.1-49.6,33.9c-4.6,9.7,0,33.9-4.6,52.9c-4.6,14.4-31.5,19.5-36.2,33.9
	c-4.6,14.4-4.6,43.1-4.6,62.6 M17095.2,1134.5c22.3-9.7,31.5,0,45,33.9c8.8,19.5-4.6,52.9,4.6,67.3c8.8,9.7,22.3,4.6,26.9,14.4
	c4.6,9.7-8.8,33.9,0,38.5c13.5,19.5,94.6,0,98.8,24.1c4.6,24.1,40.4,43.1,49.6,62.6s4.6,58,4.6,91.4 M17032.1,1428.6
	c26.9-4.6,76.5,0,94.6,14.4c22.3,19.5,81.2,4.6,112.3,14.4` : '' : `M17050.2,1168.4c-18.1,9.7-31.5,24.1-45,48.2
	c-4.6,9.7,4.6,24.1,0,38.5c-4.6,9.7-40.4,24.1-49.6,33.9c-4.6,9.7,0,33.9-4.6,52.9c-4.6,14.4-31.5,19.5-36.2,33.9
	c-4.6,14.4-4.6,43.1-4.6,62.6 M17095.2,1134.5c22.3-9.7,31.5,0,45,33.9c8.8,19.5-4.6,52.9,4.6,67.3c8.8,9.7,22.3,4.6,26.9,14.4
	c4.6,9.7-8.8,33.9,0,38.5c13.5,19.5,94.6,0,98.8,24.1c4.6,24.1,40.4,43.1,49.6,62.6s4.6,58,4.6,91.4 M17032.1,1428.6
	c26.9-4.6,76.5,0,94.6,14.4c22.3,19.5,81.2,4.6,112.3,14.4`}
          />
          {this.isShownRedGraphic("restoration", "Distal", 72) && (
            <path
              fill={this.state.statusDoneTeeth.includes(72) ? "#369661" : "#DE2527"}
              d="M17241.6,1726.7c34.1-20.7,73-51.9,116.8-98.6c24.3-31.1,48.7-57.1,63.3-98.6c4.9-20.7,29.2-93.4-4.9-160.8
	c-4.9-10.4-14.6-20.7-34.1-46.7c-29.2-36.3-53.5-62.2-97.3-108.9l-73-77.8c-14.6,72.6-34.1,176.4-24.3,300.9
	C17192.9,1555.5,17222.1,1659.3,17241.6,1726.7L17241.6,1726.7z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Medial", 72) && (
            <path
              fill={this.state.statusDoneTeeth.includes(72) ? "#369661" : "#DE2527"}
              d="M16951.1,1189.1c-4.5,14.6-4.5,24.3-13.6,43.7c-4.5,14.6-9.1,24.3-18.2,38.8c-13.6,19.4-72.8,67.9-86.4,92.2
	s-40.9,126.2-13.6,208.6c13.6,48.5,90.9,131,131.9,150.4h4.5c31.8,0,77.3-165,81.8-315.4c4.5-145.6-27.3-281.4-50-281.4
	C16973.8,1130.8,16955.6,1174.5,16951.1,1189.1L16951.1,1189.1z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Lingual", 72) && (
            <path
              fill={this.state.statusDoneTeeth.includes(72) ? "#369661" : "#DE2527"}
              d="M16950.4,1722c4.7,0,14.1,5.2,28.3,5.2c4.7,0,33,5.2,80.1,10.4h80.1c28.3,0,51.8-5.2,70.6-5.2
	c9.4-5.2,14.1-5.2,23.5-10.4c4.7-5.2,14.1-10.4,18.8-10.4c-14.1-41.8-33-88.8-42.4-151.5c-14.1-62.7-14.1-120.1-18.8-161.9
	c-51.8,5.2-108.3,5.2-160.1,10.4c0,62.7-9.4,114.9-18.8,156.7c-14.1,62.7-23.5,94-37.7,120.1
	C16969.2,1695.9,16955.1,1711.5,16950.4,1722L16950.4,1722z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Buccal", 72) && (
            <path
              fill={this.state.statusDoneTeeth.includes(72) ? "#369661" : "#DE2527"}
              d="M17019.9,1085.2c-14.1,10.4-28.1,26-28.1,26c-4.7,5.2-9.4,10.4-14.1,20.8c23.4,31.2,32.8,62.4,42.2,88.4
	c9.4,36.4,9.4,67.6,14.1,130v98.8c23.4,0,46.9-5.2,70.3-5.2c28.1,0,60.9-5.2,89-5.2c0-41.6,0-93.6,4.7-150.8
	c4.7-52,14.1-98.8,23.4-135.2l-32.8-36.4c-23.4-26-32.8-36.4-42.2-41.6C17099.5,1048.8,17043.3,1069.6,17019.9,1085.2
	L17019.9,1085.2z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 72) && (
            <path
              fill={this.state.statusDoneTeeth.includes(72) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(72) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M17423,1404.3h-627.6v-152h627.6V1404.3z M17423,1503.6h-627.6v152
	h627.6V1503.6z"
            />
          )}


          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 71)
                ? (this.state.statusDoneTeeth.includes(71) ? "#369661" : "#DE2527")
                : this.checkImpacted(71) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(71) ? isMissing ? `M16170.8,1312c38.5-104.8,120.6-244,159.6-274.2
	c53.3-39.9,106.2-34.8,145.2-19.9c62.6,29.7,207.8,189.3,261.2,298.8c14.4,34.8,14.4,129.4,9.7,209.2
	c-14.4,54.7-43.6,99.7-77.5,124.8c-38.5,19.9-87.2,25.1-149.8,45c-53.3,19.9-174,19.9-222.2-5.1c-77.5-39.9-111.3-139.6-125.7-194.4
	C16165.7,1441.8,16156.4,1371.8,16170.8,1312L16170.8,1312z` : '' : `M16170.8,1312c38.5-104.8,120.6-244,159.6-274.2
	c53.3-39.9,106.2-34.8,145.2-19.9c62.6,29.7,207.8,189.3,261.2,298.8c14.4,34.8,14.4,129.4,9.7,209.2
	c-14.4,54.7-43.6,99.7-77.5,124.8c-38.5,19.9-87.2,25.1-149.8,45c-53.3,19.9-174,19.9-222.2-5.1c-77.5-39.9-111.3-139.6-125.7-194.4
	C16165.7,1441.8,16156.4,1371.8,16170.8,1312L16170.8,1312z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 71)
              ? (this.state.statusDoneTeeth.includes(71) ? "#369661" : "#DE2527")
              : this.checkImpacted(71) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(71) ? isMissing ? `M16407.4,1087.9c33.9,0,58,19.9,62.6,45
	c9.7,19.9,19.5,49.6,29.2,69.6l72.4,59.8c33.9,25.1,62.6,49.6,77.5,89.5c9.7,25.1-4.6,34.8-29.2,34.8h-33.9
	c-24.1-9.7-53.3-5.1-96.5,0c-43.6,5.1-87.2,0-130.4-5.1h-62.6c-24.1-5.1-48.2,0-53.3-29.7c0-34.8,9.7-64.9,29.2-99.7
	c19.5-29.7,38.5-64.9,58-94.6C16349.4,1127.8,16373.5,1097.6,16407.4,1087.9L16407.4,1087.9z` : '' : `M16407.4,1087.9c33.9,0,58,19.9,62.6,45
	c9.7,19.9,19.5,49.6,29.2,69.6l72.4,59.8c33.9,25.1,62.6,49.6,77.5,89.5c9.7,25.1-4.6,34.8-29.2,34.8h-33.9
	c-24.1-9.7-53.3-5.1-96.5,0c-43.6,5.1-87.2,0-130.4-5.1h-62.6c-24.1-5.1-48.2,0-53.3-29.7c0-34.8,9.7-64.9,29.2-99.7
	c19.5-29.7,38.5-64.9,58-94.6C16349.4,1127.8,16373.5,1097.6,16407.4,1087.9L16407.4,1087.9z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 71)
              ? (this.state.statusDoneTeeth.includes(71) ? "#369661" : "#DE2527")
              : this.checkImpacted(71) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d= {this.checkMissing(71) ? isMissing ? `M16402.7,1093c-19.5,0-43.6,14.8-58,39.9
	c-24.1,39.9-62.6,104.8-72.4,124.8c-14.4,19.9-29.2,64.9-24.1,99.7 M16460.7,1137.5c19.5,14.8,29.2,54.7,38.5,64.9
	c19.5,25.1,101.6,69.6,135.5,124.8c9.7,9.7,19.5,34.8,9.7,49.6c-14.4,9.7-38.5,9.7-58,5.1 M16296.5,1371.8
	c67.7,5.1,130.4,19.9,193.4,9.7` : '' : `M16402.7,1093c-19.5,0-43.6,14.8-58,39.9
	c-24.1,39.9-62.6,104.8-72.4,124.8c-14.4,19.9-29.2,64.9-24.1,99.7 M16460.7,1137.5c19.5,14.8,29.2,54.7,38.5,64.9
	c19.5,25.1,101.6,69.6,135.5,124.8c9.7,9.7,19.5,34.8,9.7,49.6c-14.4,9.7-38.5,9.7-58,5.1 M16296.5,1371.8
	c67.7,5.1,130.4,19.9,193.4,9.7`}
          />
          {this.isShownRedGraphic("restoration", "Distal", 71) && (
            <path
              fill={this.state.statusDoneTeeth.includes(71) ? "#369661" : "#DE2527"}
              d="M16536.2,1047.6l80,76.7c62.8,71.3,102.8,109.6,125.7,169.9c17.1,43.8,17.1,82.2,17.1,120.6
	c0,32.9,0,71.3-11.4,115.1c-5.7,27.4-28.6,109.6-85.7,126.1c-5.7,5.5-28.6,11-40,11c-22.8,5.5-45.7,11-57.1,16.4
	c-22.8-76.7-45.7-169.9-57.1-279.5C16502,1261.4,16519.1,1135.3,16536.2,1047.6L16536.2,1047.6z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Lingual", 71) && (
            <path
              fill={this.state.statusDoneTeeth.includes(71) ? "#369661" : "#DE2527"}
              d="M16373.3,1701.7c-39.4,0-73.1-5.8-106.8-17.5c-5.6-5.8-11.2-5.8-11.2-5.8c22.5-46.7,45-99.3,56.2-169.4
	c11.2-58.4,16.9-111,22.5-157.7c28.1,5.8,67.5,11.7,106.8,11.7h106.8c5.6,40.9,11.2,87.6,16.9,134.4
	c11.2,64.3,28.1,122.7,39.4,175.2c-16.9,5.8-33.7,11.7-56.2,17.5c-16.9,5.8-39.4,11.7-73.1,17.5
	C16446.4,1707.5,16412.7,1707.5,16373.3,1701.7L16373.3,1701.7z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Medial", 71) && (
            <path
              fill={this.state.statusDoneTeeth.includes(71) ? "#369661" : "#DE2527"}
              d="M16169.3,1296.5c24.7-54.1,55.6-113.7,98.8-173.2c24.7-32.5,43.2-59.5,67.9-86.6
	c30.9,65,61.7,173.2,61.7,303.1c0,162.4-49.4,286.9-86.4,362.6c-18.5-16.2-43.2-32.5-67.9-59.5c-43.2-54.1-61.7-102.8-74.1-135.3
	C16163.1,1437.3,16150.8,1361.5,16169.3,1296.5z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Buccal", 71) && (
            <path
              fill={this.state.statusDoneTeeth.includes(71) ? "#369661" : "#DE2527"}
              d="M16306.9,1050.4c9.8-9.1,39.3-36.4,88.4-45.5c9.8,0,44.2-4.6,83.4,9.1c14.7,4.6,29.5,13.7,39.3,22.8
	c19.6,13.7,34.4,27.3,44.2,41c-14.7,50.1-24.5,113.8-24.5,186.6c0,36.4,0,72.8,4.9,104.7c-24.5,4.6-54,4.6-88.4,4.6
	s-68.7-9.1-88.4-13.7c0-41,0-91-9.8-145.6C16336.3,1150.5,16321.6,1095.9,16306.9,1050.4z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 71) && (
            <path
              fill={this.state.statusDoneTeeth.includes(71) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(71) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M16766.1,1400.3h-625.8v-152h625.8V1400.3z M16766.1,1499.5h-625.8
	v152h625.8V1499.5z"
            />
          )}

          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 74)
              ? (this.state.statusDoneTeeth.includes(74) ? "#369661" : "#DE2527")
              : this.checkImpacted(74) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(74) ? isMissing ? `M19162.6,1251.6L19162.6,1251.6
	c9.7,30.1,78.4,99.7,83.2,129.6c9.7,39.9,9.7,199.5-24.6,249.6c-9.8,15.3-39,104.8-122.5,135c-24.6,9.7-93.3,9.7-152.2,34.8
	c-20,0-44.6,30.2-132.7,25.1c-93.2,5.1-152.1-20-196.2-39.9c-24.6-10.2-112.7,19.9-215.7-90c-20-29.7-54.3-84.9-73.8-99.7
	c-39-30.1-107.7-75.1-122.5-109.9c-9.7-35.3-4.6-104.8,5.1-135c0-25,39.4-89.9,39.4-115c0-45,14.8-134.9,34.3-160
	c49.2-89.5,156.8-164.7,206-184.6c29.7-9.7,142.4-9.7,186.5,5.1c19.5,9.7,58.9,39.9,78.4,39.9c19.4,0,68.6-39.9,93.2-39.9
	c117.9-4.6,250.5,84.9,314.1,180C19177.4,1112,19152.9,1226.5,19162.6,1251.6L19162.6,1251.6z` : '' : `M19162.6,1251.6L19162.6,1251.6
	c9.7,30.1,78.4,99.7,83.2,129.6c9.7,39.9,9.7,199.5-24.6,249.6c-9.8,15.3-39,104.8-122.5,135c-24.6,9.7-93.3,9.7-152.2,34.8
	c-20,0-44.6,30.2-132.7,25.1c-93.2,5.1-152.1-20-196.2-39.9c-24.6-10.2-112.7,19.9-215.7-90c-20-29.7-54.3-84.9-73.8-99.7
	c-39-30.1-107.7-75.1-122.5-109.9c-9.7-35.3-4.6-104.8,5.1-135c0-25,39.4-89.9,39.4-115c0-45,14.8-134.9,34.3-160
	c49.2-89.5,156.8-164.7,206-184.6c29.7-9.7,142.4-9.7,186.5,5.1c19.5,9.7,58.9,39.9,78.4,39.9c19.4,0,68.6-39.9,93.2-39.9
	c117.9-4.6,250.5,84.9,314.1,180C19177.4,1112,19152.9,1226.5,19162.6,1251.6L19162.6,1251.6z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 74)
              ? (this.state.statusDoneTeeth.includes(74) ? "#369661" : "#DE2527")
              : this.checkImpacted(74) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(74) ? isMissing ? `M18412,1276.6c-19.5,30.2-24.6,64.9-34.3,95.1
	c9.7,10.2,19.5,19.9,34.3,30.2c0,14.8-5.1,30.2-5.1,45c0,5.1,0,14.8,5.1,19.9h53.8v25.1h73.8c24.6-5.1,49.2-5.1,73.8-10.2
	c5.1-5.1,19.5-5.1,34.3-5.1c19.5,0,39.4,0,53.8,5.1c34.3,14.8,68.7,34.8,103,50.1c9.7,0,19.5,5.1,29.2,5.1
	c9.7-5.1,19.5-10.2,24.6-14.8c19.5-5.1,39.4-5.1,63.6-10.2c44.1-50.1,29.2-90,5.1-149.8c-9.7-14.8-24.6-30.2-49.2-34.8
	c0-30.2,0-59.8-14.8-84.9c-14.8-14.8-39.4-14.8-73.8-14.8c0-10.2,0-25,5.1-34.8c-9.7,5.1-24.6,5.1-34.3,10.2l-88.1-14.8
	c-29.2,14.8-53.8,25.1-83.5,39.9c-19.5,0-39.4-5.1-58.9-5.1C18509.9,1226.5,18460.7,1221.4,18412,1276.6L18412,1276.6L18412,1276.6z`: '' : `M18412,1276.6c-19.5,30.2-24.6,64.9-34.3,95.1
	c9.7,10.2,19.5,19.9,34.3,30.2c0,14.8-5.1,30.2-5.1,45c0,5.1,0,14.8,5.1,19.9h53.8v25.1h73.8c24.6-5.1,49.2-5.1,73.8-10.2
	c5.1-5.1,19.5-5.1,34.3-5.1c19.5,0,39.4,0,53.8,5.1c34.3,14.8,68.7,34.8,103,50.1c9.7,0,19.5,5.1,29.2,5.1
	c9.7-5.1,19.5-10.2,24.6-14.8c19.5-5.1,39.4-5.1,63.6-10.2c44.1-50.1,29.2-90,5.1-149.8c-9.7-14.8-24.6-30.2-49.2-34.8
	c0-30.2,0-59.8-14.8-84.9c-14.8-14.8-39.4-14.8-73.8-14.8c0-10.2,0-25,5.1-34.8c-9.7,5.1-24.6,5.1-34.3,10.2l-88.1-14.8
	c-29.2,14.8-53.8,25.1-83.5,39.9c-19.5,0-39.4-5.1-58.9-5.1C18509.9,1226.5,18460.7,1221.4,18412,1276.6L18412,1276.6L18412,1276.6z`}
	
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 74)
              ? (this.state.statusDoneTeeth.includes(74) ? "#369661" : "#DE2527")
              : this.checkImpacted(74) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(74) ? isMissing ? `M18377.6,1371.2c0,19.9,29.2,19.9,34.3,30.2
	c0,25.1-9.7,59.8,0,64.9c14.8,5.1,44.1-5.1,53.8,0c5.1,10.2-9.7,19.9,0,25.1c19.5,5.1,108.1,0,142.4-10.2 M18250.1,1201.5
	c14.8,14.8,24.6,45,39.4,50.1c24.6,0,14.8-64.9,19.5-70c9.7-5.1,29.2,5.1,39.4,0c9.7-5.1,0-19.9,5.1-25.1c9.7-5.1,88.1-5.1,103-5.1
	c9.7,0,19.5,19.9,14.8,34.8 M18529.3,1351.3c-14.8-45-19.5-115-5.1-124.8c19.5-14.8,53.8,5.1,68.7,0c19.5-10.2,44.1-30.2,78.4-39.9
	c39.4-5.1,58.9,34.8,122.5,5.1c0,19.9-9.7,34.8-9.7,50.1c-5.1,19.9-9.7,39.9-19.5,54.7c-19.5,14.8-39.4,45-49.2,70
	c-9.7,30.2-44.1,64.9-83.5,79.8` : '' : `M18377.6,1371.2c0,19.9,29.2,19.9,34.3,30.2
	c0,25.1-9.7,59.8,0,64.9c14.8,5.1,44.1-5.1,53.8,0c5.1,10.2-9.7,19.9,0,25.1c19.5,5.1,108.1,0,142.4-10.2 M18250.1,1201.5
	c14.8,14.8,24.6,45,39.4,50.1c24.6,0,14.8-64.9,19.5-70c9.7-5.1,29.2,5.1,39.4,0c9.7-5.1,0-19.9,5.1-25.1c9.7-5.1,88.1-5.1,103-5.1
	c9.7,0,19.5,19.9,14.8,34.8 M18529.3,1351.3c-14.8-45-19.5-115-5.1-124.8c19.5-14.8,53.8,5.1,68.7,0c19.5-10.2,44.1-30.2,78.4-39.9
	c39.4-5.1,58.9,34.8,122.5,5.1c0,19.9-9.7,34.8-9.7,50.1c-5.1,19.9-9.7,39.9-19.5,54.7c-19.5,14.8-39.4,45-49.2,70
	c-9.7,30.2-44.1,64.9-83.5,79.8`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 74)
              ? (this.state.statusDoneTeeth.includes(74) ? "#369661" : "#DE2527")
              : this.checkImpacted(74) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(74) ? isMissing ? `M18671.7,1186.6l-24.6-25.1
	c-14.8-9.7,5.1-44.5-9.7-54.7c-4.7-5.1-9.8-5.1-19.5-10.2c-5.1-5.1-5.1-39.8,0-64.9` : '' : `M18671.7,1186.6l-24.6-25.1
	c-14.8-9.7,5.1-44.5-9.7-54.7c-4.7-5.1-9.8-5.1-19.5-10.2c-5.1-5.1-5.1-39.8,0-64.9`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 74)
              ? (this.state.statusDoneTeeth.includes(74) ? "#369661" : "#DE2527")
              : this.checkImpacted(74) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(74) ? isMissing ? `M18794.7,1195.8c0-9.8,5.1-24.6,14.8-34.8
	c5.1-5.1,19.5-9.7,24.6-19.9c9.8-19.9,9.8-54.7,19.5-54.7c9.7-4.6,24.1-20,29.2-34.8` : '' : `M18794.7,1195.8c0-9.8,5.1-24.6,14.8-34.8
	c5.1-5.1,19.5-9.7,24.6-19.9c9.8-19.9,9.8-54.7,19.5-54.7c9.7-4.6,24.1-20,29.2-34.8`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 74)
              ? (this.state.statusDoneTeeth.includes(74) ? "#369661" : "#DE2527")
              : this.checkImpacted(74) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(74) ? isMissing ? `M18926.9,1381.4c-4.7-14.8-9.8-34.8-19.5-39.9
	c-9.7-4.6-29.2-4.6-34.3-14.8s0-35.3,0-50.1c4.6-10.2-5.1-39.9-24.6-45c-19.5-10.2-39.4-10.2-58.9-5.1`: '' : `M18926.9,1381.4c-4.7-14.8-9.8-34.8-19.5-39.9
	c-9.7-4.6-29.2-4.6-34.3-14.8s0-35.3,0-50.1c4.6-10.2-5.1-39.9-24.6-45c-19.5-10.2-39.4-10.2-58.9-5.1`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 74)
              ? (this.state.statusDoneTeeth.includes(74) ? "#369661" : "#DE2527")
              : this.checkImpacted(74) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(74) ? isMissing ? `M19064.1,1531.7c-4.6-10.3,19.5-14.9,24.6-25.1
	c5.1-14.8,10.2-79.8,5.1-90c-5.1-9.7-14.9-9.7-24.6-19.9c-9.7-15.3,5.1-39.9-9.7-50.1c-19.9-10.2-19.9-50.1-39.4-64.9
	c-9.7-9.7-19.5-25.1-34.3-39.9c-19.9-14.8-34.3,0-39.4-14.8c-4.7-10.3,19.9-30.2,39.4-30.2c29.7,0,34.3-30.2,58.9-45`: '' : `M19064.1,1531.7c-4.6-10.3,19.5-14.9,24.6-25.1
	c5.1-14.8,10.2-79.8,5.1-90c-5.1-9.7-14.9-9.7-24.6-19.9c-9.7-15.3,5.1-39.9-9.7-50.1c-19.9-10.2-19.9-50.1-39.4-64.9
	c-9.7-9.7-19.5-25.1-34.3-39.9c-19.9-14.8-34.3,0-39.4-14.8c-4.7-10.3,19.9-30.2,39.4-30.2c29.7,0,34.3-30.2,58.9-45`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 74)
              ? (this.state.statusDoneTeeth.includes(74) ? "#369661" : "#DE2527")
              : this.checkImpacted(74) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(74) ? isMissing ? `M18706.1,1481.7c24.6,5.1,49.2,25.1,73.8,39.9
	c14.4,9.7,44.1,19.9,53.8,19.9c14.8,0,19.9-14.8,39.4-19.9c20-5.1,49.2,5.1,49.2-5.1c0-14.9-34.4-29.7-49.2-34.8
	c-53.9-55.2-44.1-75.2-68.7-95.1c-29.7-14.8-24.6-70.1-39.4-90` : '' : `M18706.1,1481.7c24.6,5.1,49.2,25.1,73.8,39.9
	c14.4,9.7,44.1,19.9,53.8,19.9c14.8,0,19.9-14.8,39.4-19.9c20-5.1,49.2,5.1,49.2-5.1c0-14.9-34.4-29.7-49.2-34.8
	c-53.9-55.2-44.1-75.2-68.7-95.1c-29.7-14.8-24.6-70.1-39.4-90`}
          />
          {this.isShownRedGraphic("restoration", "Lingual", 74) && (
            <path
              fill={this.state.statusDoneTeeth.includes(74) ? "#369661" : "#DE2527"}
              d="M18491.6,1765.8c10.6,18.4,37.1,0,95.5,12.2c47.7,12.2,58.3,24.5,106.1,42.8c26.5,6.1,63.6,12.2,111.4,12.2
	c21.2,0,47.7,0,63.6-18.4c26.5-36.7-21.2-97.9-31.8-214.1c-10.6-116.2,31.8-177.4,5.3-201.9c-26.5-18.4-58.3,36.7-137.9,48.9
	c-84.9,12.2-127.3-48.9-153.8-24.5c-26.5,24.5,15.9,73.4,5.3,165.2C18539.3,1686.3,18470.3,1735.2,18491.6,1765.8L18491.6,1765.8z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Medial", 74) && (
            <path
              fill={this.state.statusDoneTeeth.includes(74) ? "#369661" : "#DE2527"}
              d="M18244.8,1212.4c-4.8,10.9,0,16.4-19.2,60c-9.6,21.8-19.2,49.1-19.2,60c-4.8,16.4-9.6,43.7-9.6,71
	c0,32.7-4.8,54.6,4.8,76.4c14.4,38.2,48,65.5,81.7,71c57.6,16.4,72.1-38.2,163.3-54.6c72.1-16.4,100.9,5.5,120.1-21.8
	c19.2-27.3-14.4-60-14.4-141.9c0-98.2,43.2-141.9,24-163.7c-24-27.3-86.5,60-197,49.1C18326.4,1217.8,18264,1190.5,18244.8,1212.4
	L18244.8,1212.4z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Buccal", 74) && (
            <path
              fill={this.state.statusDoneTeeth.includes(74) ? "#369661" : "#DE2527"}
              d="M18859.6,890.4c-28.2,0-84.5,49-107,49c-33.8,0-28.2-24.5-90.1-49c-28.2-12.3-45.1-12.3-73.2-12.3h-84.5
	c-16.9,18.4,28.2,85.8,45.1,177.8c22.5,116.5-22.5,165.5,16.9,202.3c16.9,18.4,56.3,18.4,135.2,18.4c95.7-6.1,146.4-6.1,157.7-36.8
	c16.9-36.8-67.6-73.6-67.6-153.2c-5.6-98.1,107-183.9,95.7-202.3C18876.5,890.4,18870.8,890.4,18859.6,890.4L18859.6,890.4z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Distal", 74) && (
            <path
              fill={this.state.statusDoneTeeth.includes(74) ? "#369661" : "#DE2527"}
              d="M19160.7,1259.5c-11.6-22.5,17.5-126,0-157.5c0-4.5-5.8-4.5-11.6-9c-40.7-9-69.8,76.5-157.1,103.5
	c-93.1,31.5-180.4-31.5-203.6-4.5c-17.5,18,29.1,49.5,40.7,112.5c11.6,81-58.2,130.5-34.9,148.5c29.1,22.5,110.5-49.5,221.1-36
	c128,13.5,209.4,126,244.4,108c5.8-4.5,5.8-9,5.8-31.5c0-72,5.8-108-5.8-121.5C19230.5,1313.5,19189.8,1313.5,19160.7,1259.5
	L19160.7,1259.5z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Oclusial", 74) && (
            <path
              fill={this.state.statusDoneTeeth.includes(74) ? "#369661" : "#DE2527"}
              d="M18851.8,1313.4c0,34.4-15.5,63.8-15.5,63.8c-10.3,14.7-20.6,29.5-15.5,49.1c0,4.9,5.2,9.8,0,14.7
	c-5.2,4.9-10.3,4.9-15.5,4.9c-25.8,0-67.1,34.4-123.8,39.3c-51.6,4.9-77.4-19.6-108.3-19.6c-5.2,0-15.5,0-15.5-4.9
	c-5.2-4.9,0-9.8,0-9.8c5.2-19.6-20.6-73.6-20.6-132.5c0-44.2,20.6-49.1,20.6-93.3c0-4.9,0-24.5,5.2-29.5c10.3-4.9,20.6,0,31,4.9
	c25.8,9.8,31,0,129,0c41.3,0,51.6,0,67.1-4.9c5.2-4.9,20.6-14.7,25.8-9.8c5.2,0,5.2,9.8,5.2,14.7c5.2,14.7,5.2,14.7,10.3,34.4
	C18846.6,1249.6,18856.9,1279.1,18851.8,1313.4L18851.8,1313.4z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 74) && (
            <path
              fill={this.state.statusDoneTeeth.includes(74) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(74) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M19246.6,1315.6h-1034.5v-152h1034.5V1315.6z M19246.6,1414.9
	h-1034.5v152h1034.5V1414.9z"
            />
          )}


          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 75)
              ? (this.state.statusDoneTeeth.includes(75) ? "#369661" : "#DE2527")
              : this.checkImpacted(75) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(75) ? isMissing ? `M20238.9,1236.6L20238.9,1236.6
	c45,44.1,45,123,59.7,147.4c18.1,29.7,22.7,108.1,4.6,162.4c-18.1,44.1-122,255.6-185.1,275.1c-45.5,14.8-90.5,5.1-135.5,14.8
	c-67.7,14.8-144.3,14.8-212,0c-49.7-14.9-148.5-68.7-171.2-73.8c-31.6-10.2-76.6-14.9-108.1-29.7c-36.2-24.6-81.2-68.6-117.4-122.9
	c-22.8-34.3-45.5-83.5-54.3-117.8c-8.8-34.4-13.5-108.1,0-162.4c18-68.7,76.5-93.3,76.5-108.1s-22.7-9.7-22.7-64
	c-4.6-58.9,22.3-63.5,26.9-117.8c18.1-73.7,54.3-103.4,85.8-122.9c18.1-14.8,112.7-14.8,130.8-14.8c22.7,0,36.2-19.9,63.1-14.8
	c31.5,0,67.7,24.6,76.5,39.4c8.8,10.2,18,29.7,31.5,29.7c13.4-5.1,13.4-24.6,26.9-39.4c8.8-9.7,36.2-34.3,63.1-34.3
	c31.5-5.1,40.8,24.6,85.8,34.3c27.4,5.1,31.6,39.4,54.3,39.4c8.8-5.1,13.4-24.6,26.9-29.7c40.3-24.6,85.3-24.6,139.6,5.1
	c40.8,24.6,72.4,68.7,81.2,108.1c9.2,34.4,9.2,98.4,4.6,132.7C20265.8,1197.2,20252.4,1212,20238.9,1236.6L20238.9,1236.6z` : '' : `M20238.9,1236.6L20238.9,1236.6
	c45,44.1,45,123,59.7,147.4c18.1,29.7,22.7,108.1,4.6,162.4c-18.1,44.1-122,255.6-185.1,275.1c-45.5,14.8-90.5,5.1-135.5,14.8
	c-67.7,14.8-144.3,14.8-212,0c-49.7-14.9-148.5-68.7-171.2-73.8c-31.6-10.2-76.6-14.9-108.1-29.7c-36.2-24.6-81.2-68.6-117.4-122.9
	c-22.8-34.3-45.5-83.5-54.3-117.8c-8.8-34.4-13.5-108.1,0-162.4c18-68.7,76.5-93.3,76.5-108.1s-22.7-9.7-22.7-64
	c-4.6-58.9,22.3-63.5,26.9-117.8c18.1-73.7,54.3-103.4,85.8-122.9c18.1-14.8,112.7-14.8,130.8-14.8c22.7,0,36.2-19.9,63.1-14.8
	c31.5,0,67.7,24.6,76.5,39.4c8.8,10.2,18,29.7,31.5,29.7c13.4-5.1,13.4-24.6,26.9-39.4c8.8-9.7,36.2-34.3,63.1-34.3
	c31.5-5.1,40.8,24.6,85.8,34.3c27.4,5.1,31.6,39.4,54.3,39.4c8.8-5.1,13.4-24.6,26.9-29.7c40.3-24.6,85.3-24.6,139.6,5.1
	c40.8,24.6,72.4,68.7,81.2,108.1c9.2,34.4,9.2,98.4,4.6,132.7C20265.8,1197.2,20252.4,1212,20238.9,1236.6L20238.9,1236.6z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 75)
              ? (this.state.statusDoneTeeth.includes(75) ? "#369661" : "#DE2527")
              : this.checkImpacted(75) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(75) ? isMissing ? `M19512.9,1089.1c8.8,44.1,18.1,78.9,40.4,103.5
	c26.9,44.1,67.7,54.3,103.9,64c36.2,5.1,58.5-9.7,90-29.7c31.5-5.1,58.5-9.7,90-14.8c63.1-9.7,108.1-9.7,144.3,0
	c45,9.7,85.8,29.7,130.8,58.9c40.4,34.3,72.4,73.8,103.9,108.1c8.8,24.6,4.6,49.2-22.7,68.7c-18.1,14.8-49.6,14.8-67.7,9.7
	c-26.9,9.7-67.7,5.1-94.6-5.1c-13.5,24.6-26.9,39.4-67.7,49.2c-26.9,5.1-49.6,0-63.1-9.7c-36.2-34.3-40.4-39.4-63.1-24.6
	c-18.1,9.7-31.5,19.5-49.6,29.7c-36.2,5.1-67.7,0-94.6-9.7l-108.1-14.8c-8.8-5.1-18.1,0-26.9-5.1c-45-9.7-90-29.7-103.9-54.3
	c-22.7-24.6-36.2-54.3-31.5-88.6c13.5-54.3,45-83.5,72.4-103.4C19481.4,1172.6,19486,1128.5,19512.9,1089.1L19512.9,1089.1
	L19512.9,1089.1z` : '' : `M19512.9,1089.1c8.8,44.1,18.1,78.9,40.4,103.5
	c26.9,44.1,67.7,54.3,103.9,64c36.2,5.1,58.5-9.7,90-29.7c31.5-5.1,58.5-9.7,90-14.8c63.1-9.7,108.1-9.7,144.3,0
	c45,9.7,85.8,29.7,130.8,58.9c40.4,34.3,72.4,73.8,103.9,108.1c8.8,24.6,4.6,49.2-22.7,68.7c-18.1,14.8-49.6,14.8-67.7,9.7
	c-26.9,9.7-67.7,5.1-94.6-5.1c-13.5,24.6-26.9,39.4-67.7,49.2c-26.9,5.1-49.6,0-63.1-9.7c-36.2-34.3-40.4-39.4-63.1-24.6
	c-18.1,9.7-31.5,19.5-49.6,29.7c-36.2,5.1-67.7,0-94.6-9.7l-108.1-14.8c-8.8-5.1-18.1,0-26.9-5.1c-45-9.7-90-29.7-103.9-54.3
	c-22.7-24.6-36.2-54.3-31.5-88.6c13.5-54.3,45-83.5,72.4-103.4C19481.4,1172.6,19486,1128.5,19512.9,1089.1L19512.9,1089.1
	L19512.9,1089.1z`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 75)
              ? (this.state.statusDoneTeeth.includes(75) ? "#369661" : "#DE2527")
              : this.checkImpacted(75) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(75) ? isMissing ? `M20212,1384.2c-36.2-54.3-94.6-108.1-130.8-128
	c-22.7-9.7-45-24.6-72.4-29.7c-94.6-29.7-130.8-19.5-193.9-5.1c-13.5,5.1-49.6,0-67.7,9.7c-31.5,9.7-36.2,29.7-63.1,29.7
	c-22.7,0-40.4,0-58.5-14.8c-45-14.8-72.4-44.1-94.6-88.6c-8.8-19.5-8.8-64-18.1-68.7c-18.1,5.1-36.2,58.9-22.7,142.4
	c0,14.8-40.4,24.6-67.7,78.9c-4.6,19.5-8.8,34.3-8.8,49.2s18.1,44.1,31.5,64` : '' : `M20212,1384.2c-36.2-54.3-94.6-108.1-130.8-128
	c-22.7-9.7-45-24.6-72.4-29.7c-94.6-29.7-130.8-19.5-193.9-5.1c-13.5,5.1-49.6,0-67.7,9.7c-31.5,9.7-36.2,29.7-63.1,29.7
	c-22.7,0-40.4,0-58.5-14.8c-45-14.8-72.4-44.1-94.6-88.6c-8.8-19.5-8.8-64-18.1-68.7c-18.1,5.1-36.2,58.9-22.7,142.4
	c0,14.8-40.4,24.6-67.7,78.9c-4.6,19.5-8.8,34.3-8.8,49.2s18.1,44.1,31.5,64`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 75)
              ? (this.state.statusDoneTeeth.includes(75) ? "#369661" : "#DE2527")
              : this.checkImpacted(75) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d={this.checkMissing(75) ? isMissing ? `M20238.9,1236.6c-36.2-9.7-76.5-9.7-94.6-5.1
	c-22.7,5.1-40.4,24.6-63.1,29.7 M20000,1320.1c13.5,14.8,26.9,34.3,31.5,58.9c4.6,24.6,0,54.3-4.6,78.9
	c-8.8,14.8-22.7,34.3-36.2,39.4c-8.8,5.1-49.6,19.5-58.5,14.8c-8.8-5.1-45-19.5-58.5-39.4 M20121.5,1462.6
	c-36.2,5.1-67.7,5.1-94.6-5.1 M19891.9,1335c-22.7,29.7-54.3,58.9-58.5,68.7c-4.6,19.5,8.8,64,4.6,73.8
	c-8.8,9.7-49.6,34.3-72.4,39.4c-22.7,0-126.2-29.7-144.3-29.7c-22.7-5.1-58.5,5.1-67.7-9.7c-4.6-9.7,4.6-34.3,4.6-58.9
	c0-19.5-8.8-58.9,4.6-64c26.9-9.7,13.5-88.6,63.1-108.1` : '' : `M20238.9,1236.6c-36.2-9.7-76.5-9.7-94.6-5.1
	c-22.7,5.1-40.4,24.6-63.1,29.7 M20000,1320.1c13.5,14.8,26.9,34.3,31.5,58.9c4.6,24.6,0,54.3-4.6,78.9
	c-8.8,14.8-22.7,34.3-36.2,39.4c-8.8,5.1-49.6,19.5-58.5,14.8c-8.8-5.1-45-19.5-58.5-39.4 M20121.5,1462.6
	c-36.2,5.1-67.7,5.1-94.6-5.1 M19891.9,1335c-22.7,29.7-54.3,58.9-58.5,68.7c-4.6,19.5,8.8,64,4.6,73.8
	c-8.8,9.7-49.6,34.3-72.4,39.4c-22.7,0-126.2-29.7-144.3-29.7c-22.7-5.1-58.5,5.1-67.7-9.7c-4.6-9.7,4.6-34.3,4.6-58.9
	c0-19.5-8.8-58.9,4.6-64c26.9-9.7,13.5-88.6,63.1-108.1`}
          />
          <path
            fill="#FAFAFA"
            stroke={
              this.isShownRedGraphic("prosthetics", "", 75)
              ? (this.state.statusDoneTeeth.includes(75) ? "#369661" : "#DE2527")
              : this.checkImpacted(75) ? "#ffff04" : "#010101"
            }
            strokeWidth="10"
            strokeMiterlimit="10"
            d=  {this.checkMissing(75) ? isMissing ? `M19679.4,1501.9c22.7-29.7-4.6-88.6,18.1-122.9
	c9.3-14.8,36.2-39.4,36.2-64` : '' : `M19679.4,1501.9c22.7-29.7-4.6-88.6,18.1-122.9
	c9.3-14.8,36.2-39.4,36.2-64`}
          />
          {this.isShownRedGraphic("restoration", "Lingual", 75) && (
            <path
              fill={this.state.statusDoneTeeth.includes(75) ? "#369661" : "#DE2527"}
              d="M19578.9,1748.2c5.7,6.6,5.7,6.6,34,13.3c22.7,6.6,34,13.3,51,26.5c45.3,26.5,68,39.8,96.3,46.4
	c39.7,13.3,68,19.9,90.7,19.9h85c22.7,0,39.7,0,39.7-6.6c34-19.9,11.3-106.2,11.3-219c0-146,39.7-199.1,11.3-232.2
	c-28.3-26.5-62.3,13.3-153,26.5c-130.3,13.3-204-53.1-238-13.3c-22.7,33.2,22.7,73,5.7,172.5
	C19601.6,1668.6,19561.9,1721.7,19578.9,1748.2L19578.9,1748.2z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Medial", 75) && (
            <path
              fill={this.state.statusDoneTeeth.includes(75) ? "#369661" : "#DE2527"}
              d="M19324.9,1332.2c-15.9,50.6-15.9,94.9-10.6,132.8c0,44.3,5.3,63.2,10.6,75.9c31.7,44.3,95.1-19,206.1-6.3
	c84.5,12.6,142.7,63.2,158.5,37.9c5.3-6.3,0-19-10.6-50.6c-15.9-63.2-5.3-120.2-5.3-151.8c5.3-101.2,37-139.1,26.4-164.4
	c0-6.3,0-6.3-5.3-12.6c-10.6-6.3-31.7,6.3-42.3,12.6c-31.7,19-68.7,19-142.7,12.6c-79.3-6.3-84.5-25.3-111-6.3
	C19351.3,1243.7,19335.4,1300.6,19324.9,1332.2L19324.9,1332.2z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Oclusial", 75) && (
            <path
              fill={this.state.statusDoneTeeth.includes(75) ? "#369661" : "#DE2527"}
              d="M19961.6,1427.2c-4.5,3.8-4.5,0-13.5,0c-13.5,0-18,3.8-40.5,7.5c-4.5,0-4.5,0-9,3.8c-9,3.8-13.5,3.8-27,7.5
	c-18,3.8-71.9,11.3-130.4,0c-9-3.8-18-3.8-31.5-7.5c-9,0-9,0-13.5-3.8c-13.5-3.8-18-7.5-22.5-3.8c-4.5,0-4.5,3.8-9,3.8h-4.5
	c-4.5,0-4.5-7.5-9-15c-4.5-11.3-4.5-11.3-9-15v-15c0-7.5,0-7.5-4.5-18.8V1352c4.5-33.8,9-52.6,9-52.6c4.5-22.6,9-18.8,18-48.9
	c4.5-11.3,4.5-15,9-22.6c9-7.5,22.5-3.8,45-15c4.5,0,9-3.8,13.5-7.5c9-3.8,13.5-3.8,18-7.5c40.5-7.5,45-11.3,54-11.3h36
	c27,0,49.5,7.5,62.9,11.3c22.5,7.5,18,7.5,36,11.3c9,3.8,13.5,3.8,18,7.5c4.5,3.8,9,11.3,9,22.6c4.5,22.6,4.5,15,9,37.6
	c4.5,15,0,26.3,0,45.1c0,15-4.5,26.3-4.5,37.6c0,7.5-4.5,18.8-9,30.1c-4.5,15-9,18.8-9,26.3
	C19966.1,1419.7,19966.1,1423.4,19961.6,1427.2L19961.6,1427.2z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Buccal", 75) && (
            <path
              fill={this.state.statusDoneTeeth.includes(75) ? "#369661" : "#DE2527"}
              d="M19969.5,919.1c-4.5-5.2-4.5,0-31.7-15.6c-36.3-15.6-36.3-26-49.9-26c-31.7-5.2-63.5,15.6-77.1,36.4
	c-4.5,5.2-9.1,15.6-13.6,20.8c-9.1,15.6-9.1,20.8-13.6,20.8s-9.1-5.2-18.1-10.4s-13.6-15.6-13.6-20.8c-9.1-15.6-45.4-41.6-77.1-41.6
	c-22.7,0-36.3,5.2-40.8,10.4c-27.2,31.2,18.1,104,9.1,218.5c-4.5,78-31.7,109.2-13.6,130c22.7,26,77.1-46.8,172.3-46.8
	c77.1,0,122.5,52,145.1,26c13.6-15.6-9.1-46.8-9.1-109.2C19928.7,1012.7,19992.2,950.3,19969.5,919.1L19969.5,919.1z"
            />
          )}
          {this.isShownRedGraphic("restoration", "Distal", 75) && (
            <path
              fill={this.state.statusDoneTeeth.includes(75) ? "#369661" : "#DE2527"}
              d="M20247.2,1212.7c-37.4,17.6-93.6,35.2-154.4,23.5c-79.5-17.6-121.6-76.4-145-52.9
	c-23.4,23.5,9.4,76.4,9.4,187.9c-4.7,105.7-37.4,141-18.7,170.3c32.7,47,117-64.6,266.7-41.1c42.1,5.9,98.2,23.5,112.3-5.9
	c4.7-11.7,4.7-35.2-4.7-58.7c-4.7-29.4-9.4-35.2-18.7-58.7c-14-47-4.7-58.7-18.7-99.8C20279.9,1265.5,20270.6,1242,20247.2,1212.7
	L20247.2,1212.7z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 75) && (
            <path
              fill={this.state.statusDoneTeeth.includes(75) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(75) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M20325,1245.9h-1011.2v-152H20325V1245.9z M20325,1345.2h-1011.2
	v152H20325V1345.2z"
            />
          )}
          {this.isShownRedGraphic("surgery", "", 84) && (
            <path
              fill={this.state.statusDoneTeeth.includes(84) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(84) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M13514.2,4416.8h-151.7V734.6h151.7V4416.8z M13818.2,726.5h-159.8
	v3690.3h159.8V726.5z"
            />
          )}
          {this.isShownRedGraphic("surgery", "", 85) && (
            <path
              fill={this.state.statusDoneTeeth.includes(85) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(85) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M12369,4382.7h-151.7V785.2h151.7V4382.7z M12672.9,777.3h-159.8
	v3605.4h159.8V777.3z"
            />
          )}
          {this.isShownRedGraphic("surgery", "", 81) && (
            <path
              fill={this.state.statusDoneTeeth.includes(81) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(81) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M15824.9,4372.9h-151.7V832.3h151.7V4372.9z M16088.8,824.5h-159.8
	v3548.4h159.8V824.5z"
            />
          )}
          {this.isShownRedGraphic("surgery", "", 82) && (
            <path
              fill={this.state.statusDoneTeeth.includes(82) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(82) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M15178.5,4398.1h-151.7V857.5h151.7V4398.1z M15442.5,849.7h-159.8
	v3548.4h159.8V849.7z"
            />
          )}
          {this.isShownRedGraphic("surgery", "", 83) && (
            <path
              fill={this.state.statusDoneTeeth.includes(83) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(83) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M14528.5,4398.1h-151.7V857.5h151.7V4398.1z M14792.4,849.7h-159.8
	v3548.4h159.8V849.7z"
            />
          )}
          {this.isShownRedGraphic("surgery", "", 73) && (
            <path
              fill={this.state.statusDoneTeeth.includes(73) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(73) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M17737.4,4347.3h-151.7V806.7h151.7V4347.3z M18001.4,798.9h-159.8
	v3548.4h159.8V798.9z"
            />
          )}
          {this.isShownRedGraphic("surgery", "", 72) && (
            <path
              fill={this.state.statusDoneTeeth.includes(72) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(72) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M17091.1,4372.4h-151.7V831.8h151.7V4372.4z M17355,824h-159.8
	v3548.4h159.8V824z"
            />
          )}
          {this.isShownRedGraphic("surgery", "", 71) && (
            <path
              fill={this.state.statusDoneTeeth.includes(71) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(71) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M16441,4372.4h-151.7V831.8h151.7V4372.4z M16705,824h-159.8
	v3548.4h159.8V824z"
            />
          )}
          {this.isShownRedGraphic("surgery", "", 75) && (
            <path
              fill={this.state.statusDoneTeeth.includes(75) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(75) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M19731,4266.9h-151.7V584.7h151.7V4266.9z M20035,576.6h-159.8
	v3690.3h159.8V576.6z"
            />
          )}
          {this.isShownRedGraphic("surgery", "", 74) && (
            <path
              fill={this.state.statusDoneTeeth.includes(74) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(74) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M18590,4309.3h-151.7V711.8h151.7V4309.3z M18894,703.9h-159.8
	v3605.4h159.8V703.9z"
            />
          )}
          <path
            fill="none"
            stroke="#EFA8AD"
            strokeWidth="80"
            strokeMiterlimit="10"
            d="M11997.3-1993.7c91.9-88.1,161.9-101.1,208.8-97.4
	c108.6,8.8,129,112.3,278.3,139.2c76.5,13.9,109.9-6.5,167,27.8c59.4,35.7,62.6,81.2,111.3,97.4c58.5,19.5,116.9-25.1,167-55.7
	c142.9-88.1,304.8-122,403.6-125.3c104.8-3.2,265.4,24.6,403.6,111.3c62.2,39,96,74.7,153.1,69.6c87.2-7.9,92.8-100.2,194.8-139.2
	c103-39,231,3.7,306.2,55.7c64,44.5,67.7,80.7,125.3,97.4c61.7,17.6,101.1-11.1,194.8-41.8c99.7-32.5,257.9-83.5,389.7-27.8
	c84.4,35.7,76.1,80.7,153.1,97.4c61.7,13.5,104.8-7.9,264.4-69.6c163.8-63.6,172.6-91.9,222.7-83.5c50.1,8.4,51.5,33.9,208.8,139.2
	c86.7,58,111.3,67.3,139.2,69.6c37.1,3.2,68.7-5.6,167-55.7c180.9-91.4,179.5-114.1,222.7-111.3c82.6,5.1,85.8,86.3,222.7,139.2
	c33.9,13,86.7,32.9,153.1,27.8c88.6-7,105.8-50.6,222.7-97.4c92.3-37.1,171.6-68.7,250.5-41.8c83.5,28.8,82.6,95.1,180.9,125.3
	c17.2,5.1,82.6,23.2,153.1,0c97.9-32,89.5-105.8,180.9-153.1c95.1-49.6,222.7-31.5,306.2,13.9c88.1,47.8,85.4,103,153.1,111.3
	c0,0,38,4.6,208.8-83.5l0,0c162.4-93.2,282.1-97.4,361.8-83.5c93.2,16.2,241.7,76.1,361.8,139.2c77,40.4,115,67.7,167,55.7
	c91.4-21.8,167-153.1,167-153.1l0,0c0,0,114.1,11.6,194.8-13.9c113.2-36.2,115.5-132.2,194.8-153.1c52.9-13.9,135,7,264.4,153.1"
          />
          <path
            fill="none"
            stroke="#EFA8AD"
            strokeWidth="80"
            strokeMiterlimit="10"
            d="M12101.2,2875.3c64-26,160-52.9,264.4-27.8
	c109.9,26.4,124.8,85.8,222.7,97.4c84.4,10.2,103.4-30.2,306.2-97.4c141.5-46.9,212.5-70,278.3-55.7c103,22.7,112.7,87.2,222.7,97.4
	c68.2,6.5,84.4-16.7,180.9-13.9c77.9,2.3,105.3,18.1,167,27.8c216.2,34.3,416.6-75.2,431.4-83.5c99.7-56.1,119.7-104.8,180.9-97.4
	c71,8.8,73.8,77.5,167,125.3c85.4,43.6,206,49.2,292.3,0c80.3-45.5,89.1-114.1,139.2-111.3c51,2.8,51.5,74.7,125.3,125.3
	c84.4,58,220.4,57.5,306.2,0c76.5-51,77.9-123.9,125.3-125.3c56.6-1.9,61.7,100.7,153.1,167c113.2,81.6,314.5,77,417.5-13.9
	c48.2-42.7,61.2-91.9,111.3-97.4c46.4-5.1,71.4,33.4,125.3,69.6c108.1,72.8,277.9,99.7,389.7,41.8c82.1-42.7,85.4-106.7,153.1-111.3
	c57.5-4.2,71,40.8,167,83.5c43.6,19.5,168.4,74.7,264.4,27.8c77-37.6,69.6-109,139.2-125.3c47.8-11.1,64.5,19,167,55.7
	c86.7,30.6,191.1,68.2,278.3,27.8c48.7-22.3,39.9-45,111.3-83.5c37.6-20.4,92.3-49.6,153.1-41.8c66.8,8.8,68.7,53.8,139.2,83.5
	c45.9,19.5,69.6,10.7,278.3-13.9c164.2-19.5,184.6-18.1,208.8-13.9c96,17.2,108.1,56.1,180.9,55.7c84.9-0.5,96-54.3,194.8-83.5
	c100.7-29.7,192.1-4.2,306.2,27.8c158.2,44.5,163.8,87.7,250.5,83.5c104.4-5.1,130.4-68.7,250.5-97.4
	c101.6-24.1,192.5-4.6,250.5,13.9"
          />
          {this.renderDiagnosisCode(51, 15668.1982, -3708.5181)}
          <text
            transform="matrix(1 0 0 1 15668.1982 -3708.5181)"
            fill={this.state.selectedTeeth.includes(51) ? "#0A1FEE" : "#333333"}
            fontFamily="'ArialMT'"
            fontSize="250px"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              this.toggleSelectedNumber(51);
              this.props.onClick(51);
            }}
          >
            51
          </text>
          {this.renderDiagnosisCode(55, 12251.8848, -3708.5181)}
          <text
            transform="matrix(1 0 0 1 12251.8848 -3708.5181)"
            fill={this.state.selectedTeeth.includes(55) ? "#0A1FEE" : "#333333"}
            fontFamily="'ArialMT'"
            fontSize="250px"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              this.toggleSelectedNumber(55);
              this.props.onClick(55);
            }}
          >
            55
          </text>
          {this.renderDiagnosisCode(52, 14952.7471, -3708.5181)}
          <text
            transform="matrix(1 0 0 1 14952.7471 -3708.5181)"
            fill={this.state.selectedTeeth.includes(52) ? "#0A1FEE" : "#333333"}
            fontFamily="'ArialMT'"
            fontSize="250px"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              this.toggleSelectedNumber(52);
              this.props.onClick(52);
            }}
          >
            52
          </text>
          {this.renderDiagnosisCode(53, 14237.6904, -3708.5181)}
          <text
            transform="matrix(1 0 0 1 14237.6904 -3708.5181)"
            fill={this.state.selectedTeeth.includes(53) ? "#0A1FEE" : "#333333"}
            fontFamily="'ArialMT'"
            style={{ cursor: 'pointer' }}
            fontSize="250px"
            onClick={() => {
              this.toggleSelectedNumber(53);
              this.props.onClick(53);
            }}
          >
            53
          </text>
          {this.renderDiagnosisCode(54, 13303.5781, -3708.5181)}
          <text
           style={{ cursor: 'pointer' }}
            transform="matrix(1 0 0 1 13303.5781 -3708.5181)"
            fill={this.state.selectedTeeth.includes(54) ? "#0A1FEE" : "#333333"}
            fontFamily="'ArialMT'"
            fontSize="250px"
            onClick={() => {
              this.toggleSelectedNumber(54);
              this.props.onClick(54);
            }}
          >
            54
          </text>
          {this.renderDiagnosisCode(65, 19883.1426, -3708.5181)}
          <text
           style={{ cursor: 'pointer' }}
            transform="matrix(1 0 0 1 19883.1426 -3708.5181)"
            fill={this.state.selectedTeeth.includes(65) ? "#0A1FEE" : "#333333"}
            fontFamily="'ArialMT'"
            fontSize="250px"
            onClick={() => {
              this.toggleSelectedNumber(65);
              this.props.onClick(65);
            }}
          >
            65
          </text>
          {this.renderDiagnosisCode(61, 16453.2441, -3708.5181)}
          <text
           style={{ cursor: 'pointer' }}
            transform="matrix(1 0 0 1 16453.2441 -3708.5181)"
            fill={this.state.selectedTeeth.includes(61) ? "#0A1FEE" : "#333333"}
            fontFamily="'ArialMT'"
            fontSize="250px"
            onClick={() => {
              this.toggleSelectedNumber(61);
              this.props.onClick(61);
            }}
          >
            61
          </text>
          {this.renderDiagnosisCode(62, 17221.3711, -3708.5181)}
          <text
           style={{ cursor: 'pointer' }}
            transform="matrix(1 0 0 1 17221.3711 -3708.5181)"
            fill={this.state.selectedTeeth.includes(62) ? "#0A1FEE" : "#333333"}
            fontFamily="'ArialMT'"
            fontSize="250px"
            onClick={() => {
              this.toggleSelectedNumber(62);
              this.props.onClick(62);
            }}
          >
            62
          </text>
          {this.renderDiagnosisCode(63, 17921.1035, -3708.5181)}
          <text
           style={{ cursor: 'pointer' }}
            transform="matrix(1 0 0 1 17921.1035 -3708.5181)"
            fill={this.state.selectedTeeth.includes(63) ? "#0A1FEE" : "#333333"}
            fontFamily="'ArialMT'"
            fontSize="250px"
            onClick={() => {
              this.toggleSelectedNumber(63);
              this.props.onClick(63);
            }}
          >
            63
          </text>
          {this.renderDiagnosisCode(64, 18853.1133, -3708.5181)}
          <text
           style={{ cursor: 'pointer' }}
            transform="matrix(1 0 0 1 18853.1133 -3708.5181)"
            fill={this.state.selectedTeeth.includes(64) ? "#0A1FEE" : "#333333"}
            fontFamily="'ArialMT'"
            fontSize="250px"
            onClick={() => {
              this.toggleSelectedNumber(64);
              this.props.onClick(64);
            }}
          >
            64
          </text>
          {this.renderDiagnosisCode(81, 15850.0801, 4769.9897)}
          <text
           style={{ cursor: 'pointer' }}
            transform="matrix(1 0 0 1 15850.0801 4769.9897)"
            fill={this.state.selectedTeeth.includes(81) ? "#0A1FEE" : "#333333"}
            fontFamily="'ArialMT'"
            fontSize="250px"
            onClick={() => {
              this.toggleSelectedNumber(81);
              this.props.onClick(81);
            }}
          >
            81
          </text>
          {this.renderDiagnosisCode(85, 12395.8721, 4769.9897)}
          <text
           style={{ cursor: 'pointer' }}
            transform="matrix(1 0 0 1 12395.8721 4769.9897)"
            fill={this.state.selectedTeeth.includes(85) ? "#0A1FEE" : "#333333"}
            fontFamily="'ArialMT'"
            fontSize="250px"
            onClick={() => {
              this.toggleSelectedNumber(85);
              this.props.onClick(85);
            }}
          >
            85
          </text>
          {this.renderDiagnosisCode(82, 15217.0869, 4769.9897)}
          <text
           style={{ cursor: 'pointer' }}
            transform="matrix(1 0 0 1 15217.0869 4769.9897)"
            fill={this.state.selectedTeeth.includes(82) ? "#0A1FEE" : "#333333"}
            fontFamily="'ArialMT'"
            fontSize="250px"
            onClick={() => {
              this.toggleSelectedNumber(82);
              this.props.onClick(82);
            }}
          >
            82
          </text>
          {this.renderDiagnosisCode(83, 14579.499, 4769.9897)}
          <text
           style={{ cursor: 'pointer' }}
            transform="matrix(1 0 0 1 14579.499 4769.9897)"
            fill={this.state.selectedTeeth.includes(83) ? "#0A1FEE" : "#333333"}
            fontFamily="'ArialMT'"
            fontSize="250px"
            onClick={() => {
              this.toggleSelectedNumber(83);
              this.props.onClick(83);
            }}
          >
            83
          </text>
          {this.renderDiagnosisCode(84, 13541.8301, 4769.9897)}
          <text
           style={{ cursor: 'pointer' }}
            transform="matrix(1 0 0 1 13541.8301 4769.9902)"
            fill={this.state.selectedTeeth.includes(84) ? "#0A1FEE" : "#333333"}
            fontFamily="'ArialMT'"
            fontSize="250px"
            onClick={() => {
              this.toggleSelectedNumber(84);
              this.props.onClick(84);
            }}
          >
            84
          </text>
          {this.renderDiagnosisCode(71, 16450.6445, 4769.9897)}
          <text
           style={{ cursor: 'pointer' }}
            transform="matrix(1 0 0 1 16450.6445 4769.9902)"
            fill={this.state.selectedTeeth.includes(71) ? "#0A1FEE" : "#333333"}
            fontFamily="'ArialMT'"
            fontSize="250px"
            onClick={() => {
              this.toggleSelectedNumber(71);
              this.props.onClick(71);
            }}
          >
            71
          </text>
          {this.renderDiagnosisCode(75, 19751.3438, 4769.9897)}
          <text
           style={{ cursor: 'pointer' }}
            transform="matrix(1 0 0 1 19751.3438 4769.9902)"
            fill={this.state.selectedTeeth.includes(75) ? "#0A1FEE" : "#333333"}
            fontFamily="'ArialMT'"
            fontSize="250px"
            onClick={() => {
              this.toggleSelectedNumber(75);
              this.props.onClick(75);
            }}
          >
            75
          </text>
          {this.renderDiagnosisCode(72, 17123.5684, 4769.9897)}
          <text
           style={{ cursor: 'pointer' }}
            transform="matrix(1 0 0 1 17123.5684 4769.9893)"
            fill={this.state.selectedTeeth.includes(72) ? "#0A1FEE" : "#333333"}
            fontFamily="'ArialMT'"
            fontSize="250px"
            onClick={() => {
              this.toggleSelectedNumber(72);
              this.props.onClick(72);
            }}
          >
            72
          </text>
          {this.renderDiagnosisCode(73, 17751.7832, 4769.9897)}
          <text
           style={{ cursor: 'pointer' }}
            transform="matrix(1 0 0 1 17751.7832 4769.9902)"
            fill={this.state.selectedTeeth.includes(73) ? "#0A1FEE" : "#333333"}
            fontFamily="'ArialMT'"
            fontSize="250px"
            onClick={() => {
              this.toggleSelectedNumber(73);
              this.props.onClick(73);
            }}
          >
            73
          </text>
          {this.renderDiagnosisCode(74, 18593.0605, 4769.9897)}
          <text
           style={{ cursor: 'pointer' }}
            transform="matrix(1 0 0 1 18593.0605 4769.9897)"
            fill={this.state.selectedTeeth.includes(74) ? "#0A1FEE" : "#333333"}
            fontFamily="'ArialMT'"
            fontSize="250px"
            onClick={() => {
              this.toggleSelectedNumber(74);
              this.props.onClick(74);
            }}
          >
            74
          </text>
          {this.isShownRedGraphic("prosthetics", "Bridge", 55) && (
            <path
              fill={this.state.statusDoneTeeth.includes(55) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(55) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M12816.9-1535.6h-990.4v-152h990.4V-1535.6z M12821.5-1503.8
	h-990.4v152h990.4V-1503.8z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 54) && (
            <path
              fill={this.state.statusDoneTeeth.includes(54) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(54) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M13875.7-1515.9h-1013.4v-152h1013.4V-1515.9z M13880.4-1484.1
	H12867v152h1013.4V-1484.1z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 64) && (
            <path
              fill={this.state.statusDoneTeeth.includes(64) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(64) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M19340.9-1479.8h-986v-152h986V-1479.8z M19345.5-1448h-986v152
	h986V-1448z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 65) && (
            <path
              fill={this.state.statusDoneTeeth.includes(65) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(65) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M20380.8-1463.9h-963.3v-152h963.3V-1463.9z M20385.3-1432.1
	h-963.3v152h963.3V-1432.1z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 63) && (
            <path
              fill={this.state.statusDoneTeeth.includes(63) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(63) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M18295.7-1433.2h-608.5v-152h608.5V-1433.2z M18298.6-1401.4
	h-608.5v152h608.5V-1401.4z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 53) && (
            <path
              fill={this.state.statusDoneTeeth.includes(53) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(53) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M14521.8-1453.4h-608.5v-152h608.5V-1453.4z M14524.7-1421.5
	h-608.5v152h608.5V-1421.5z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 52) && (
            <path
              fill={this.state.statusDoneTeeth.includes(52) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(52) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M15352.1-1439.9h-752.7v-152h752.7V-1439.9z M15355.6-1408H14603
	v152h752.7V-1408z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 62) && (
            <path
              fill={this.state.statusDoneTeeth.includes(62) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(62) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M17630.7-1402.5h-755.9v-152h755.9V-1402.5z M17634.2-1370.7
	h-755.9v152h755.9V-1370.7z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 61) && (
            <path
              fill={this.state.statusDoneTeeth.includes(61) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(61) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M16812.4-1402.5h-668.5v-152h668.5V-1402.5z M16815.5-1370.7
	h-668.5v152h668.5V-1370.7z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 51) && (
            <path
              fill={this.state.statusDoneTeeth.includes(51) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(51) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M16075.6-1416.2h-668.5v-152h668.5V-1416.2z M16078.7-1384.4
	h-668.5v152h668.5V-1384.4z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 85) && (
            <path
              fill={this.state.statusDoneTeeth.includes(85) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(85) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M13106.6,2398.3h-1119.6v-152h1119.6V2398.3z M13111.9,2430.2
	h-1119.6v152h1119.6V2430.2z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 75) && (
            <path
              fill={this.state.statusDoneTeeth.includes(75) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(75) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M20271.3,2332.5h-1093.7v-152h1093.7V2332.5z M20276.4,2364.4
	h-1093.7v152h1093.7V2364.4z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 84) && (
            <path
              fill={this.state.statusDoneTeeth.includes(84) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(84) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M14191.9,2405.8h-1049.1v-152h1049.1V2405.8z M14196.9,2437.7
	h-1049.1v152h1049.1V2437.7z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 74) && (
            <path
              fill={this.state.statusDoneTeeth.includes(74) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(74) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M19153,2331.4h-1098v-152h1098V2331.4z M19158.2,2363.3h-1098v152
	h1098V2363.3z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 83) && (
            <path
              fill={this.state.statusDoneTeeth.includes(83) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(83) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M14917.4,2374.5h-583v-152h583V2374.5z M14920.1,2406.3h-583v152
	h583V2406.3z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 73) && (
            <path
              fill={this.state.statusDoneTeeth.includes(73) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(73) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M17990.4,2331.4h-583v-152h583V2331.4z M17993.1,2363.3h-583v152
	h583V2363.3z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 82) && (
            <path
              fill={this.state.statusDoneTeeth.includes(82) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(82) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M15431.1,2379.3h-473.3v-152h473.3V2379.3z M15433.3,2411.1H14960
	v152h473.3V2411.1z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 72) && (
            <path
              fill={this.state.statusDoneTeeth.includes(72) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(72) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M17364.2,2331.5h-489.6v-152h489.6V2331.5z M17366.5,2363.4h-489.6
	v152h489.6V2363.4z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 71) && (
            <path
              fill={this.state.statusDoneTeeth.includes(71) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(71) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M16826,2344.7h-641.9v-152h641.9V2344.7z M16829,2376.5h-641.9v152
	h641.9V2376.5z"
            />
          )}
          {this.isShownRedGraphic("prosthetics", "Bridge", 81) && (
            <path
              fill={this.state.statusDoneTeeth.includes(81) ? "#369661" : "#DE2527"}
              stroke={this.state.statusDoneTeeth.includes(81) ? "#369661" : "#DE2527"}
              strokeMiterlimit="10"
              d="M16144.8,2348.6h-641.9v-152h641.9V2348.6z M16147.8,2380.5h-641.9
	v152h641.9V2380.5z"
            />
          )}
        </svg>

        {/* <svg
					xmlns="http://www.w3.org/2000/svg"
					x="0"
					y="0"
					version="1.1"
					viewBox="0 0 16383 15308.7"
					xmlSpace="preserve"
				>
					<path
						fill="#D0C9A3"
						stroke="#010101"
						strokeMiterlimit="22.926"
						strokeWidth="10"
						d="M4711.8 4635.7l-97.4 506.6-369.3-49.6-5.6-541.8c71.9-168.9 71.9-298.3 77-456.9 5.1-44.5-30.6-203.7 46.4-203.7 154 5.1 102.5 387.4 174.4 451.8l174.5 293.6h0z"
					></path>
					<path
						fill="#F2ECBE"
						stroke="#010101"
						strokeMiterlimit="22.926"
						strokeWidth="10"
						d="M4460.4 5365.5l-328.4-19.9c-66.8-347.5-138.7-908.8 117.8-1157.4 5.1 0 133.6-154 97.4 74.7 0 25.1-30.6 302.9-30.6 392.5 5.1 228.7 25.5 392.5 97.4 407.3 46.4 9.7 92.3-148.9 82.1-288.1-20.4-581.3-117.8-690.3-92.3-754.8 97.4-49.6 225.9 198.5 251.4 268.1 92.3 243.5 122.9 486.6 143.8 814.6 10.2 109-10.2 198.5-35.7 273.2-25.5-9.7-77 59.8-102.5 49.6l-200.4-59.8z"
					></path>
					<path
						fill={conditionToColor(this.props.teeth[55].condition)}
						onClick={() => this.props.onClick(55)}
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M4746.1 5314.9c-5.1-15.8-15.3-47.3-85.8-26.4-120.6 36.6-171.2-121.1-342.4-131.7-302 84-357.2 389.2-377.6 520.5-30.2 205 80.7 278.8 166.1 294.6 171.2 10.7 276.9-58 312.2-131.7 25.1 47.3 90.5 179.1 226.4 179.1 130.8-26.4 312.2-162.8 286.7-252.4-9.3-199.6-140.1-325.8-185.6-452z"
					></path>
					<path
						fill={conditionToColor(this.props.teeth[55].condition)}
						onClick={() => this.props.onClick(55)}
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M4494.7 5583c-70.5 73.8-100.7 173.5-75.6 257.9M4278 5477.7c85.8 36.6 125.7 126.2 135.9 252.4"
					></path>
					<path
						fill="#D0C9A3"
						stroke="#010101"
						strokeMiterlimit="22.926"
						strokeWidth="10"
						d="M5621.5 5017.5l-360-52.4-39.9-341.9c79.8-161.4 79.8-313.6 85.8-465.8 0-42.7 17.2-152.2 91.4-156.8 34.3 0 85.8 23.7 103 71.4 45.5 147.5 137.3 341.9 177.2 375.3l68.7 256.5-126.2 313.7z"
					></path>
					<path
						fill="#F2ECBE"
						stroke="#010101"
						strokeMiterlimit="22.926"
						strokeWidth="10"
						d="M5495.8 5283.8l-399.9 118.8-5.6-228.2c-45.5-152.2-108.6-266.3-131.3-451.4-79.8-261.2 74.2-774.7 199.9-574.8 5.6 4.6 0 19 0 28.3 0 80.7 11.6 142.4 0 218.5-11.6 80.7 5.6 123.4 57.1 228.2 17.2 33.4 28.8 66.3 45.5 123.4 91.4 166.1 177.2 256.5 257 199.5l28.8-204.1c17.2-95.1 17.2-80.7 68.7-166.1 39.9-61.7 62.6-128.5 68.7-199.5l-34.3-218.5c11.6-52.4 22.7-99.7 79.8-109.5 91.4 23.7 148.4 99.7 171.2 147.5 45.5 152.2 68.7 261.2 57.1 418-11.6 99.7-34.3 190.2-68.7 275.6-51.5 128.5-51.5 114.1-45.5 256.5v223.1l-120.1 9.7-228.4-95z"
					></path>
					<path
						fill={conditionToColor(this.props.teeth[54].condition)}
						onClick={() => this.props.onClick(54)}
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M5851.1 5378.4c-19.9-43.6-120.1-34.8-140.1-43.6-39.9-13-70-26.4-135-65.4-34.8-21.8-75.2-21.8-115-21.8-30.2 0-54.7 26.4-84.9 34.8l-210.1 65.4c-34.8 17.6-64.9 34.8-84.9 74.2l-39.9 96-14.8 34.8c-25.1 34.8-39.9 91.9-45 135.5-10.2 43.6-10.2 65.4 5.1 109.5 14.8 48.2 34.8 87.2 54.7 126.6 25.1 48.2 79.8 74.2 109.9 78.9 59.8 4.2 99.7-4.2 164.7-26.4l84.9-30.6c45 48.2 54.7 61.2 79.8 78.9 95.1 70 160 21.8 214.8-48.2H5840c19.9-4.2 50.1-26.4 79.8-61.2 59.8-61.2 59.8-70 64.9-148.4 0-70-10.2-70-50.1-131.3-45-70-50.1-65.4-59.8-148.4l-5.1-61.2-18.6-48.1h0z"
					></path>
					<path
						fill={conditionToColor(this.props.teeth[54].condition)}
						onClick={() => this.props.onClick(54)}
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M5570.9 5649.4c-54.7 48.2-160 179.1-45 257.9 14.8 13 34.8 17.6 45 21.8l124.8 48.2"
					></path>
					<path
						fill={conditionToColor(this.props.teeth[54].condition)}
						onClick={() => this.props.onClick(54)}
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M5346.4 5544.5c64.9 39.4 90 100.7 120.2 153.1 39.9 70-10.2 187.9-64.9 244.9"
					></path>
					<path
						fill="#F2ECBE"
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M6503.4 5388.2l-142.9 47.3-149.8-43.6c-52.4-123.9-52.4-189.3-48.7-342.4 0-113.2 87.2-357.2 73.3-459.3 7-193-20.9-328-13.9-506.6 0-123.9 104.8-105.8 149.8-7.4 149.3 331.8 142.4 958.5 132.2 1312h0z"
					></path>
					<path
						fill={conditionToColor(this.props.teeth[53].condition)}
						onClick={() => this.props.onClick(53)}
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M6505.2 5349.7c18.6 89.1 14.8 129.9 48.2 200.9 174.9 241.7 129.9 341.9-103.9 482.9-33.4 18.6-55.7 44.5-111.3 37.1-59.4-18.6-96.5-74.2-96.5-74.2-7.4-3.7-7.4 26-29.7 26-137.3-33.4-219.4-200.9-171.2-371.6 52-96.5 133.6-289.9 141-304.8 14.8-40.8 89.1-74.2 152.6-74.2 55.7-3.7 96.5 11.1 137.3 33.4 15 7.4 26.1 25.9 33.5 44.5h0z"
					></path>
					<path
						fill={conditionToColor(this.props.teeth[53].condition)}
						onClick={() => this.props.onClick(53)}
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M6251.9 5898.5c38.5-108.1 9.7-197.6-96-284.8"
					></path>
					<path
						fill="#F2ECBE"
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M6991.4 5574.7l217.6-84.9c19.5-3.7 29.2-38.5 33.9-58 43.6-119.7-130.8-444-149.8-687-9.7-92.8-24.1-196.7-67.7-274.2-87.2-212.5-207.8-169.8-217.6-54.3 0 26.9 9.7 61.7 9.7 84.9 33.9 374.4-72.4 779.8-14.4 899.5 14.4 31.1 24.1 65.4 38.5 84.9l149.8 89.1z"
					></path>
					<path
						fill={conditionToColor(this.props.teeth[52].condition)}
						onClick={() => this.props.onClick(52)}
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M7464.6 5952.3c10.2 97.4-71 97.4-157.3 93.2-45.5 24.1-81.2 32.5-162.4 36.6-50.6-4.2-157.3-4.2-182.3-44.5-30.6 28.3-106.7 12.1-126.6-4.2-172.6-89.1-136.9-360.9-35.7-551.6 10.2-12.1 45.5-89.1 65.9-93.2 121.5-36.6 207.8-40.4 344.7 0 15.3 4.2 35.7 28.3 40.4 48.7 71.3 210.7 127 279.8 213.3 515z"
					></path>
					<path
						fill="#F2ECBE"
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M7820.8 5564.9L7639 5454.1c-24.1-73.8-44.5-648.5 97-993.7 149.8-328.4 242.6-94.2 258.9 4.2 16.2 172.6 16.2 336.8 64.5 517.2 40.4 143.8 60.8 377.6 20.4 574.8l-259 8.3z"
					></path>
					<path
						fill={conditionToColor(this.props.teeth[51].condition)}
						onClick={() => this.props.onClick(51)}
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M8087.1 5477.3c3.7 7 0 13.5 0 17.2 39 187 114.1 323.3 114.1 401.3 0 64.5 3.7 231.5-167.5 190.7-14.4-10.2-21.3-13.5-32-7-14.4 20.4-114.1 47.8-245.4-17.2-17.6-20.4-35.7-10.2-46.4-10.2-146.1-58-217.1-98.8-170.7-278.8 71-296 124.8-466.2 327.5-438.8 92.8 13.5 149.4 68.2 202.7 122.5 3.8 3.1 14.5 13.3 17.7 20.3h0z"
					></path>
					<path
						fill={conditionToColor(this.props.teeth[51].condition)}
						onClick={() => this.props.onClick(51)}
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M8025.4 6097.5c-5.6-63.1-5.6-105.8 2.8-156.3m-226.8 118.2c-2.8-25.5-2.8-101.1 0-126.6"
					></path>
					<path
						fill="#D0C9A3"
						stroke="#010101"
						strokeMiterlimit="22.926"
						strokeWidth="10"
						d="M11746.8 4692.8l97.4 506.6 369.3-49.6 5.1-541.4c-71.9-168.9-71.9-298.3-77-456.9-5.1-44.5 30.6-203.7-46.4-203.7-154 5.1-102.5 387.4-174.4 451.8l-174 293.2h0z"
					></path>
					<path
						fill="#F2ECBE"
						stroke="#010101"
						strokeMiterlimit="22.926"
						strokeWidth="10"
						d="M11998.2 5422.5l328.4-19.9c66.8-347.5 138.7-908.8-117.8-1157.4-5.1 0-133.6-154-97.4 74.7 0 25.1 30.6 302.9 30.6 392.5-5.1 228.7-25.5 392.5-97.4 407.3-46.4 9.7-92.3-148.9-82.1-288.1 20.4-581.3 117.8-690.3 92.3-754.8-97.4-49.6-225.9 198.5-251.4 268.1-92.3 243.5-122.9 486.6-143.8 814.6-10.2 109 10.2 198.5 35.7 273.2 25.5-9.7 77 59.8 102.5 49.6l200.4-59.8z"
					></path>
					<path
						fill={conditionToColor(this.props.teeth[65].condition)}
						onClick={() => this.props.onClick(65)}
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M11712 5372c5.1-15.8 15.3-47.3 85.8-26.4 120.6 36.6 171.2-121.1 342.4-131.7 302 84 357.2 389.2 377.6 520.5 30.2 205-80.7 278.8-166.1 294.6-171.2 10.7-276.9-58-312.2-131.7-25.1 47.3-90.5 179.1-226.4 179.1-130.8-26.4-312.2-162.8-286.7-252.4 9.8-199.7 140.2-325.9 185.6-452z"
					></path>
					<path
						fill={conditionToColor(this.props.teeth[65].condition)}
						onClick={() => this.props.onClick(65)}
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M12039.1 5897.5c25.1-84-5.1-184.2-75.6-257.9m80.7 147.5c10.2-126.2 50.1-215.7 135.9-252.4"
					></path>
					<path
						fill="#D0C9A3"
						stroke="#010101"
						strokeMiterlimit="22.926"
						strokeWidth="10"
						d="M10836.6 5074.6l360-52.4 39.9-341.9c-79.8-161.4-79.8-313.6-85.8-465.8 0-42.7-17.2-152.2-91.4-156.8-34.3 0-85.8 23.7-103 71.4-45.5 147.5-137.3 341.9-177.2 375.3l-68.7 256.5 126.2 313.7z"
					></path>
					<path
						fill="#F2ECBE"
						stroke="#010101"
						strokeMiterlimit="22.926"
						strokeWidth="10"
						d="M10962.4 5340.9l399.9 118.8 5.6-228.2c45.5-152.2 108.6-266.3 131.3-451.4 79.8-261.2-74.2-774.7-199.9-574.8-5.6 4.6 0 19 0 28.3 0 80.7-11.6 142.4 0 218.5 11.6 80.7-5.6 123.4-57.1 228.2-17.2 33.4-28.8 66.3-45.5 123.4-91.4 166.1-177.2 256.5-257 199.5l-28.8-204.1c-17.2-95.1-17.2-80.7-68.7-166.1-39.9-61.7-62.6-128.5-68.7-199.5l34.3-218.5c-11.6-52.4-22.7-99.7-79.8-109.5-91.4 23.7-148.4 99.7-171.2 147.5-45.5 152.2-68.7 261.2-57.1 418 11.6 99.7 34.3 190.2 68.7 275.6 51.5 128.5 51.5 114.1 45.5 256.5v223.1l120.1 9.7 228.4-95z"
					></path>
					<path
						fill={conditionToColor(this.props.teeth[64].condition)}
						onClick={() => this.props.onClick(64)}
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M10607.5 5435.5c19.9-43.6 120.2-34.8 140.1-43.6 39.9-13 70-26.4 135-65.4 34.8-21.8 75.2-21.8 115-21.8 30.2 0 54.7 26.4 84.9 34.8l210.1 65.4c34.8 17.6 64.9 34.8 84.9 74.2l39.9 96 14.8 34.8c25 34.8 39.9 91.9 45 135.5 10.2 43.6 10.2 65.4-5.1 109.5-14.8 48.2-34.8 87.2-54.7 126.6-25 48.2-79.8 74.2-109.9 78.9-59.8 4.2-99.7-4.2-164.7-26.4l-84.9-30.6c-45 48.2-54.7 61.2-79.8 78.9-95.1 70-160 21.8-214.8-48.2h-144.7c-19.9-4.2-50.1-26.4-79.8-61.2-59.8-61.2-59.8-70-64.9-148.4 0-70 10.2-70 50.1-131.3 45-70 50.1-65.4 59.8-148.4l5.1-61.2 18.6-48.1h0z"
					></path>
					<path
						fill={conditionToColor(this.props.teeth[64].condition)}
						onClick={() => this.props.onClick(64)}
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M10887.2 5706.4c54.7 48.2 160 179.1 45 257.9-14.8 13-34.8 17.6-45 21.8l-124.8 48.2"
					></path>
					<path
						fill={conditionToColor(this.props.teeth[64].condition)}
						onClick={() => this.props.onClick(64)}
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M11112.2 5601.6c-64.9 39.4-90 100.7-120.1 153.1-39.9 70 10.2 187.9 64.9 244.9"
					></path>
					<path
						fill="#F2ECBE"
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M9954.8 5446.2l142.9 45.9 149.8-42.2c52.4-120.1 52.4-183.2 48.7-331.7 0-109.5-87.2-345.6-73.3-444.4-7-187 20.9-317.3 13.9-490.3 0-120.2-104.8-102.5-149.8-7-149.4 321-142.4 927.8-132.2 1269.7h0z"
					></path>
					<path
						fill={conditionToColor(this.props.teeth[63].condition)}
						onClick={() => this.props.onClick(63)}
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M9952.9 5409.1c-18.6 86.3-14.8 125.7-48.2 194.4-174.9 233.8-129.9 330.8 103.9 467.6 33.4 18.1 55.7 43.1 111.3 36.2 59.4-18.1 96.5-71.9 96.5-71.9 7.4-3.7 7.4 25.1 29.7 25.1 137.3-32.5 219.4-194.4 171.2-360-52-93.7-133.6-280.7-141-295-14.8-39.4-89.1-71.9-152.6-71.9-55.7-3.7-96.5 10.7-137.3 32.5-14.9 6.8-26.1 24.9-33.5 43h0z"
					></path>
					<path
						fill={conditionToColor(this.props.teeth[63].condition)}
						onClick={() => this.props.onClick(63)}
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M10206.2 5974.6c-38.5-90-9.7-164.7 96-237.1"
					></path>
					<path
						fill="#F2ECBE"
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M9466.7 5610.9l-217.6-84.9c-19.5-3.7-29.2-38.5-33.9-58-43.6-119.7 130.8-444 149.8-687 9.7-92.8 24.1-196.7 67.7-274.2 87.2-212.5 207.8-169.8 217.6-54.3 0 26.9-9.7 61.7-9.7 84.9-33.9 374.4 72.4 779.8 14.4 899.5-14.4 31.1-24.1 65.4-38.5 84.9l-149.8 89.1z"
					></path>
					<path
						fill={conditionToColor(this.props.teeth[62].condition)}
						onClick={() => this.props.onClick(62)}
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M8993.6 5988.5c-10.2 97.4 71 97.4 157.3 93.2 45.5 24.1 81.2 32.5 162.4 36.6 50.6-4.2 157.3-4.2 182.3-44.5 30.6 28.3 106.7 12.1 126.6-4.2 172.6-89.1 136.9-360.9 35.7-551.6-10.2-12.1-45.5-89.1-65.9-93.2-121.5-36.6-207.8-40.4-344.7 0-15.3 4.2-35.7 28.3-40.4 48.7-71.4 210.7-127 279.8-213.3 515z"
					></path>
					<path
						fill="#F2ECBE"
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M8637.3 5601.1l181.8-110.9c24.1-73.8 44.5-648.5-97-993.7-149.8-328.4-242.6-94.2-258.9 4.2-16.2 172.6-16.2 336.8-64.5 517.2-40.4 143.8-60.8 377.6-20.4 574.8l259 8.4z"
					></path>
					<path
						fill={conditionToColor(this.props.teeth[61].condition)}
						onClick={() => this.props.onClick(61)}
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M8370.6 5513.4c-3.7 7 0 13.5 0 17.2-39 187-114.1 323.3-114.1 401.3 0 64.5-3.7 231.5 167.5 190.7 14.4-10.2 21.3-13.5 32-7 14.4 20.4 114.1 47.8 245.4-17.2 17.6-20.4 35.7-10.2 46.4-10.2 146.1-58 217.1-98.8 170.7-278.8-71-296-124.8-466.2-327.5-438.8-92.8 13.5-149.4 68.2-202.7 122.5-3.4 3.6-14 13.8-17.7 20.3h0z"
					></path>
					<path
						fill={conditionToColor(this.props.teeth[61].condition)}
						onClick={() => this.props.onClick(61)}
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M8429.9 5968.1c8.4 50.6 8.4 92.8 2.8 156.3m223.6-164.7c2.8 25.5 2.8 101.1 0 126.6"
					></path>
					<path
						fill="#F2ECBE"
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M4975.3 10104.2c31.1 62.6 36.6 354.4 20.9 439.8-5.1 157.3-281.1 852.2-463.4 780.7-46.9-18.1 67.7-318.7 83.5-372.5 72.8-273.7-5.1-439.8-26-462-57.1 8.8-57.1 188.3-72.8 233.3-5.1 31.5-93.7 152.6-98.8 246.8-10.2 49.2-46.9 282.5-135.5 278.3-57.1-8.8-88.6-129.9-114.6-497.8-15.8-215.2 0-430.5 41.8-641.6l135.5-67.3 629.4 62.3z"
					></path>
					<path
						fill={conditionToColor(this.props.teeth[85].condition)}
						onClick={() => this.props.onClick(85)}
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M4921.9 9458c32-9.3 68.7-13.9 100.7 0 52.9 42.2 238 196.2 180 317.8-15.8 28.3-127.1 294.6-201.3 331.7-116.4 74.7-270 98.3-317.3 98.3-90-4.6-169.3-74.7-275.1-84-79.3 0-174.9 18.6-201.3-9.3-52.9-84-127.1-285.3-84.9-430 37.1-98.3 201.3-341 391.5-261.6 68.7 37.6 127.1 121.5 201.3 177.7 42.2-52 127.1-103 206.4-140.6z"
					></path>
					<path
						fill={conditionToColor(this.props.teeth[85].condition)}
						onClick={() => this.props.onClick(85)}
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M4715.5 9582.8c-42.2 46.9-74.2 126.2-68.7 196.2m105.8 42.2c-95.1-84-232.9-23.2-259.3-9.3"
					></path>
					<path
						fill="#F2ECBE"
						stroke="#010101"
						strokeMiterlimit="22.926"
						strokeWidth="10"
						d="M6220.8 10054.5c29.7 63.6 69.6 122.5 84.4 186.5 39.9 152.2 54.7 490.3 34.8 657.3-29.7 299.2-174 568.7-253.3 353-19.9-58.9-25.1-270-25.1-299.2 0-73.8-14.8-166.5-49.6-259.8-54.7-142.4-99.3-269.5-179.1-230.6-25.1 9.7-25.1 206-44.5 441.6-5.1 68.7-25.1 225.5-44.5 279.7-14.8 49.2-59.8 166.5-119.2 137.3-54.7-14.8-79.3-137.3-104.4-534.9 0-78.4-19.9-161.9-29.7-245.4-5.1-63.6-29.7-245.4-5.1-377.6l148.9-127.6 586.4 19.7z"
					></path>
					<path
						fill={conditionToColor(this.props.teeth[84].condition)}
						onClick={() => this.props.onClick(84)}
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M6097.9 9455.7c-98.8 4.6-244.5 97-276 119.2-10.2 8.8-98.8-110.4-244.9-92.8-83.5 17.6-114.6 101.6-124.8 128-67.7-31.1-150.8-17.6-187.4 52.9-20.9 52.9-20.9 180.9 20.9 251.4 20.9 44.1 130.4 176.3 197.6 238 15.8 17.6 124.8-4.6 187.4 0 197.6 8.8 468.5 48.7 593.3-79.3 15.8-17.6 31.1-57.5 36.6-84 26-141 41.8-251.4 10.2-405.9-14.8-57-87.6-145.2-212.9-127.5z"
					></path>
					<path
						fill={conditionToColor(this.props.teeth[84].condition)}
						onClick={() => this.props.onClick(84)}
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M5796.4 9830.5c-15.8-84-31.1-220.8 36.6-260.2m-364.6 224.9c-26-61.7-31.1-154.5-15.8-185.1"
					></path>
					<path
						fill="#F2ECBE"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M6727 10018.4l-119.7 71.4c-77 151.7-34.8 686.6-23.2 888.8 15.3 320.1 150.3 341 173.5 345.1 165.6 25.1 215.7-1132.8 127.1-1255.3l-157.7-50z"
					></path>
					<path
						fill={conditionToColor(this.props.teeth[83].condition)}
						onClick={() => this.props.onClick(83)}
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M7013.2 9532.2c85.8 72.4-85.8 362.8-89.5 449.5-3.7 45-3.7 86.3-22.3 128-78.4 58.9-242.2 41.3-294.1 7-48.2-52-29.7-183.2-48.2-217.6-63.1-117.4-163.8-186.5-74.2-317.8 71-90 201.3-204.1 271.8-204.1 66.8-.9 230.5 117 256.5 155h0z"
					></path>
					<path
						fill="#F2ECBE"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M7305.9 10007.7l-103 141c-87.7 432.8 15.3 766.8 38 964.4 84 442.1 114.1 254.2 175.4-32.9 76.1-329.4 72.4-729.2 45.9-988.1l-156.3-84.4z"
					></path>
					<path
						fill={conditionToColor(this.props.teeth[82].condition)}
						onClick={() => this.props.onClick(82)}
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M7454.8 10112.5c-26.4 57.5-225 68.2-251.4 50.6-3.7-3.7-7.4-10.7-11.1-14.4-63.6-136.8-221.3-594.3-22.7-698.6 67.7-3.7 157.7-14.4 217.6-32.5 37.6-7 75.2-32.5 97.4-18.1 45 14.4 90 100.7 90 154.9-21.9 194.4-104.5 565.1-119.8 558.1z"
					></path>
					<path
						fill="#F2ECBE"
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M8180.4 10115.3c-64.9-13.5-130.4-22.3-195.3-31.1-77 31.1-160 58-237.1 84.9 0 116 0 214.3 12.1 326.1 6 66.8 17.6 80.3 23.7 129.4 83 214.3 83 379.5 77 602.6-12.1 147.5 171.6 196.7 219.4-31.1 94.6-420.2 147.9-898 100.2-1080.8h0z"
					></path>
					<path
						fill={conditionToColor(this.props.teeth[81].condition)}
						onClick={() => this.props.onClick(81)}
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M8257.8 9519.7c-5.6 231-22.3 420.3-93.7 605.9-49.6 49.6-248.2 156.8-403.1 53.8-93.7-197.6-138.2-441.2-143.3-668 0-24.6 22.3-45.5 66.3-70 132.7-45.5 364.2-57.5 508-4.2 32.9 8.2 60.3 53.7 65.8 82.5h0z"
					></path>
					<path
						fill="#F2ECBE"
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M12161.5 9972.4l135.5 67.3c41.8 210.6 57.1 426.3 41.8 641.6-26 367.9-57.1 488.9-114.6 497.8-88.6 4.6-124.8-228.7-135.5-278.3-5.1-94.2-93.7-215.2-98.8-246.8-15.8-45-15.8-224.5-72.8-233.3-20.9 22.3-98.8 188.3-26 462 15.8 53.8 130.4 354.4 83.5 372.5-182.3 71.9-458.3-623.5-463.4-780.7-15.8-85.4-10.2-376.7 20.9-439.8l629.4-62.3z"
					></path>
					<path
						fill={conditionToColor(this.props.teeth[75].condition)}
						onClick={() => this.props.onClick(75)}
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M11791.8 9529.4c74.2-56.1 132.2-140.1 201.3-177.7 190.7-79.3 354.4 163.8 391.5 261.6 42.2 144.7-32 346.1-84.9 430-26.4 27.8-121.5 9.3-201.3 9.3-105.8 9.3-185.1 79.3-275.1 84-47.8 0-201.3-23.2-317.3-98.3-74.2-37.6-185.1-303.9-201.3-331.7-58.5-121.5 127.1-275.6 180-317.8 32-13.9 68.7-9.3 100.7 0 79.3 37.6 164.2 89.1 206.4 140.6z"
					></path>
					<path
						fill={conditionToColor(this.props.teeth[75].condition)}
						onClick={() => this.props.onClick(75)}
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M11860.9 9710.3c5.1-70-26.4-149.4-68.7-196.2m221.8 228.7c-26.4-13.9-164.2-74.7-259.3 9.3"
					></path>
					<path
						fill="#F2ECBE"
						stroke="#010101"
						strokeMiterlimit="22.926"
						strokeWidth="10"
						d="M10877.9 9965.9l148.9 127.6c25 132.7 0 314.1-5.1 377.6-9.7 83.5-29.7 166.5-29.7 245.4-25 397.1-49.6 520-104.4 534.9-59.8 29.2-104.4-88.1-119.2-137.3-19.9-53.8-39.9-211.1-44.5-279.7-19.9-235.7-19.9-431.4-44.5-441.6-79.3-39.4-124.3 88.1-179.1 230.6-34.8 93.2-49.6 186.5-49.6 259.8 0 29.2-5.1 240.3-25.1 299.2-79.3 215.7-223.6-53.8-253.3-353-19.9-166.5-5.1-505.2 34.8-657.3 14.8-63.6 54.7-122.5 84.4-186.5l586.4-19.7z"
					></path>
					<path
						fill={conditionToColor(this.props.teeth[74].condition)}
						onClick={() => this.props.onClick(74)}
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M10200.2 9514.6c-31.1 154.5-15.8 264.9 10.2 405.9 5.1 26.4 20.9 66.3 36.6 84 124.8 128 395.7 88.1 593.3 79.3 62.6-4.6 171.6 17.6 187.4 0 67.7-61.7 177.2-193.9 197.6-238 41.8-70.5 41.8-198.5 20.9-251.4-36.6-70.5-119.7-84-187.4-52.9-10.7-26.4-41.8-110.4-124.8-128-145.7-17.6-234.3 101.6-244.9 92.8-31.1-22.3-177.2-114.6-276-119.2-124.3-18.2-197.2 70.4-212.9 127.5z"
					></path>
					<path
						fill={conditionToColor(this.props.teeth[74].condition)}
						onClick={() => this.props.onClick(74)}
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M10679.4 9501.6c67.7 39.9 52 176.3 36.6 260.2m343.3-220.8c15.8 31.1 10.2 123.4-15.8 185.1"
					></path>
					<path
						fill="#F2ECBE"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M9675.5 10068.9c-88.6 122-38.5 1280.4 127.1 1255.3 23.2-4.2 158.2-25 173.5-345.1 11.6-202.3 53.8-737.1-23.2-888.8l-119.7-71.4-157.7 50z"
					></path>
					<path
						fill={conditionToColor(this.props.teeth[73].condition)}
						onClick={() => this.props.onClick(73)}
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M9547.5 9532.2c26-38 189.7-155.4 257-155.4 71 0 201.3 114.1 271.8 204.1 89.5 131.3-11.1 200.4-74.2 317.8-18.6 34.8 0 166.1-48.2 217.6-52 34.8-216.2 52-294.1-7-18.6-41.3-18.6-83-22.3-128-4.7-86.3-175.9-376.7-90-449.1h0z"
					></path>
					<path
						fill="#F2ECBE"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M9098.4 10092.1c-26.4 258.9-30.6 658.7 45.9 988.1 60.8 287.2 91.4 475 175.4 32.9 22.7-197.6 125.7-531.6 38-964.4l-103-141-156.3 84.4z"
					></path>
					<path
						fill={conditionToColor(this.props.teeth[72].condition)}
						onClick={() => this.props.onClick(72)}
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M8985.7 9554c0-53.8 45-140.6 90-154.9 22.7-14.4 59.8 10.7 97.4 18.1 59.8 18.1 150.3 28.8 217.6 32.5 199 104.4 41.3 561.8-22.7 698.6-3.7 3.7-7.4 10.7-11.1 14.4-26.4 18.1-225 7.4-251.4-50.6-15 7.4-97.5-363.3-119.8-558.1z"
					></path>
					<path
						fill="#F2ECBE"
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M8379.8 10115.3c-47.3 183.2 6 660.6 100.7 1080.4 47.3 227.8 231 178.6 219.4 31.1-6-223.1-6-388.3 77-602.6 6-49.2 17.6-62.6 23.7-129.4 12.1-111.8 12.1-209.7 12.1-326.1-77-26.9-160-53.8-237.1-84.9-65.4 8.8-130.4 18.1-195.8 31.5h0z"
					></path>
					<path
						fill={conditionToColor(this.props.teeth[71].condition)}
						onClick={() => this.props.onClick(71)}
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M8302.8 9519.7c5.6-28.8 32.9-74.2 66.3-82.6 143.3-53.8 375.3-41.3 508 4.2 44.1 24.6 66.3 45.5 66.3 70-5.6 226.8-49.6 469.9-143.3 668-154.5 103-353-4.2-403.1-53.8-72.4-185.1-89.1-374.8-94.2-605.8h0zM11692.1 6787.8c-4.2-12.5-48.2-21.3-61.2-67.7-4.2-33.9-8.8-67.7 0-109.9 21.8-105.8 57.1-194.4 262.6-329.4 34.8-21.3 118.3-12.5 166.1 12.5 253.8 130.8 262.6 130.8 415.7 367.4 21.8 46.4 26.4 295.5 4.2 341.9-39.4 118.3-109.5 219.4-236.1 236.6-13 0-21.8 21.3-34.8 25.5-26.4 12.5-78.9 21.3-96 8.4-13-12.5-48.2-25.5-61.2-25.5-13 4.2-26.4 12.5-39.4 12.5-43.6 16.7-113.7 8.4-144.3-12.5-39.4-25.5-131.3-80.3-205.5-215.2-13-33.9-17.6-92.8-13-139.2 3.4-33.5 21.1-67.4 42.9-105.4h0z"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M12164.3 6809.1c8.8-12.5 0-25.5-4.2-38-4.2-4.2 39.4-38 57.1-33.9 26.4 0 4.2 118.3 26.4 130.8 17.6 12.5 30.6 25.5 30.6 42.2-4.2 25.5-87.7 236.6-231.9 295.5"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M11687.9 6783.6c17.6 12.5 83-8.4 91.9 12.5 13 16.7 43.6 105.8 65.4 109.9 26.4-4.2 74.2-88.6 91.9-92.8 26.4-4.2 30.6-16.7 48.2-21.3 43.6-8.4 91.9-8.4 104.8-4.2 17.6 12.5 21.8 33.9 17.6 54.7 4.2 16.7 39.4 0 57.1 12.5 21.8 21.3 43.6 54.7 61.2 63.6 17.6 8.4 65.4-8.4 91.9 16.7 30.6 12.5 87.7-67.7 104.8-67.7 17.6-4.2 48.2 0 65.4-4.2m-857.3-142.8c0-58.9 43.6-118.3 57.1-114.1 8.8 4.2-13 67.7 0 92.8"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M11871.6 6990.5c4.2-16.7 4.2-42.2 0-58.9-4.2-12.5-13-16.7-26.4-25.5m-34.8-312.2c17.6 50.6-4.2 92.8 0 122.5 4.2 21.3 65.4 80.3 126.6 97m30.6-211.2c26.4 12.5 52.4 21.3 52.4 38s34.8 80.3 30.6 101.1c-4.2 21.3-30.6 29.7-30.6 50.6m144.3-181.3c-8.8 54.7-61.2 92.8-61.2 118.3 4.2 21.3-13 42.2-8.8 58.9 21.8 16.7 21.8 38 17.6 54.7-13 12.5-21.8 25.5-13 42.2 8.8 16.7 30.6 38 30.6 50.6 0 12.5-13 29.7-21.8 33.9-13 4.2-30.6 16.7-39.4 29.7m310.8-92.8c-4.2-16.7-8.8-42.2-21.8-54.7-8.8-8.4 0-29.7-4.2-46.4-4.2-8.4-21.8-8.4-26.4-21.3 4.2-16.7 17.6-25.5 34.8-33.9M10616.8 6879.6c-4.2-12.1-41.3-52.4-49.6-68.7-12.5-16.2-24.6-257.9 0-282.1 95.1-96.5 193.9-141 222.7-153.1 41.3-16.2 136.4-16.2 193.9-4.2 272.3 52.4 450 161 487.1 314.1 12.5 56.6 8.3 177.2-4.2 270-8.4 76.5-37.1 129-78.4 185.1-28.8 44.1-74.2 88.6-107.2 100.7-28.8 12.1-99.3 12.1-140.1 12.1-20.4-4.2-82.6-64.5-99.3-64.5-12.5-4.2-65.9 19.9-99.3 32-24.6 7.9-70 7.9-95.1 0-41.3-7.9-107.2-40.4-156.8-92.8-53.8-60.3-86.7-145.2-86.7-169.3-3.7-14.8 13-63 13-79.3h0z"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M11400.7 6912.1c-32.9 0-37.1-16.2-65.9-19.9-24.6-4.2-49.6 0-70 4.2-12.5 4.2-24.6 24.1-37.1 24.1-12.5-4.2-12.5-32-37.1-44.1-16.7-7.9-24.6-32-41.3-32-16.7 0-53.8 24.1-70 24.1-16.7-4.2-37.1-28.3-58-32-16.7 0-45.5-12.1-58-12.1-16.7 0-53.8 19.9-78.4 24.1-24.6 0-53.8-4.2-70 4.2-16.7 4.2-28.8 19.9-41.3 19.9-16.7 0-37.1 0-45.5-4.2m548.8-238.4c24.6-16.2 53.8 24.1 58 36.2 12.5 24.1-4.2 44.1-12.5 56.6-32.9 40.4-65.9 120.6-82.6 120.6-12.5 0-70-40.4-95.1-68.7"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M11190.1 6598c-28.8-16.2-78.4 4.2-82.6 12.1-4.2 7.9-28.8 32-32.9 52.4-4.2 24.1 8.4 48.2 12.5 56.6 8.4 12.1 49.6 40.4 58 56.6 0 12.1-45.5 40.4-61.7 88.6 0 19.9 28.8 19.9 24.6 36.2-8.4 32-32.9 68.7-49.6 72.4-20.4 7.9-45.5 60.3-82.6 60.3m-107.6-455.6c41.3-28.3 86.7 36.2 103 72.4l24.6 60.3c20.4 48.2 0 80.7 24.6 120.6m-465.8-124.3c32.9 16.2 82.6 48.2 111.3 64.5 16.7 7.9 16.7 68.7 78.4 100.7-12.5 0-28.8 0-37.1 4.2 0 76.5-28.8 52.4-32.9 72.4 0 7.9-4.2 56.6 4.2 60.3 8.3 4.2 16.7 7.9 28.8 4.2m-8-455.2c20.4 0 41.3 0 61.7 19.9 12.5 12.1 16.7 40.4 16.7 56.6 0 19.9 4.2 80.7-8.4 108.6m259.9 450.9c49.6-28.3 123.9-100.7 173.5-177.2 8.4-16.2 16.7-36.2 20.4-52.4 0-16.2 0-32 4.2-44.1M9831.8 6651.4c-17.6 25.1-31.5 53.8-7 125.7 66.3 172.6 195.3 312.7 289.5 334.5 31.5 14.4 69.6 14.4 97.9 0 108.1-50.6 181.4-147.5 244.5-255.1 20.9-50.6 20.9-97 3.7-129.4-45.5-97-157.3-190.7-226.8-219.4-45.5-21.8-118.8-14.4-160.5 0-94.7 24.9-206.5 89.9-241.3 143.7h0z"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M10027.1 6727c-10.7 14.4-10.7 39.4-10.7 57.5 3.7 18.1 13.9 36.2 24.6 46.9 20.9 21.8 20.9 50.6 20.9 79.3 10.7-3.7 20.9-3.7 31.5-7.4 13.9-7.4 24.6-14.4 38.5-18.1 13.9 0 34.8 3.7 38.5 0 0-3.7 34.8 7.4 34.8 18.1 3.7 10.7 7 46.9 0 64.9-3.7 18.1 10.7 18.1 38.5 3.7 20.9-14.4 31.5-36.2 41.8-61.2 10.7-10.7 13.9-25.1 10.7-39.4 0-14.4 3.7-28.8 3.7-43.1 3.7-21.8 0-43.1-17.6-61.2-13.9-7.4-24.6-14.4-41.8-14.4-10.7 3.7-20.9 10.7-27.8 21.8-24.6 28.8-69.6 90-108.1 64.9 3.7-18.1 7-39.4 7-57.5 0-21.8-10.7-32.5-24.6-43.1-18.1-11.7-39-11.7-59.9-11.7h0z"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M9873.6 6694.5c-10.7 25.1 17.6 50.6 20.9 61.2 20.9 82.6 104.8 143.8 115 147.5 13.9 7.4 59.4 10.7 84 0 7-3.7 17.6-14.4 24.6-18.1 13.9-7.4 59.4-7.4 73.3 0 10.7 7.4 20.9 21.8 20.9 32.5-3.7 21.8-10.7 57.5 0 61.2 17.6 3.7 31.5-10.7 45.5-25.1 13.9-14.4 20.9-46.9 31.5-53.8 10.7-14.4 7-28.8 20.9-32.5 17.6-3.7 38.5-10.7 55.7-21.8 17.6-10.7 27.8-7.4 41.8 0"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M10212.2 6770.1c3.7-14.4 17.6-21.8 34.8-21.8 13.9 0 34.8 10.7 45.5 28.8 7 14.4 7 32.5 7 50.6-3.7 25.1-7 50.6 0 61.2m-258.4-57.5c20.9 14.4 17.6 50.6 20.9 79.3h17.6c7 32.5-7 100.7 3.7 111.3 0 3.7 7 10.7 13.9 10.7 3.7 3.7 3.7 10.7 0 18.1m-70.1-323.8c52.4-3.7 80.3 18.1 87.2 50.6 0 25.1-13.9 57.5-3.7 71.9 7 10.7 20.9 21.8 24.6 36.2M9126.2 6753.4c33.9-66.3 127.6-176.3 204.1-207.4 25.5-22.3 144.7-26.4 170.3 0 55.2 26.4 170.3 132.2 204.1 202.7 17.2 31.1 21.3 105.8 4.2 149.8-29.7 92.8-110.4 172.1-195.8 233.8-33.9 17.6-84.9 13.5-110.4 0-25.5-8.8-187-136.9-259.3-242.6-8.4-8.8-12.5-17.6-17.2-22.3-21.3-25.8-17.1-92.2 0-114z"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M9134.6 6881c38 8.8 102.1 8.8 114.6 0 12.5-4.6 21.3-44.1 38-44.1s46.9 61.7 63.6 66.3c8.4 8.8 84.9 8.8 106.2 4.6 33.9-4.6 55.2-48.7 84.9-44.1 25.5 0 17.2 44.1 38 48.7 12.5 4.6 80.7-8.8 123.4 0m-377.1 83.2c0-35.3 8.4-75.2 33.9-92.8"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M9500.1 7079.6c-17.2-31.1-55.2-52.9-55.2-70.5-4.2-13.5 12.5-79.3 12.5-101.6m153.6 136.8c-33.9-8.8-33.9-101.6-59.4-110.4-8.4-8.8 4.2-26.4 21.3-35.3M8526.9 6602.7c18.6-10.7 37.1-21.3 58.9-28.8 43.6-10.7 102.1-14.4 151.7-3.7 21.8 3.7 37.1 21.3 52.9 35.7 6 10.7 40.4 10.7 55.7 14.4 46.4 10.7 71.4 50.1 74.2 53.8 12.5 14.4 24.6 28.8 31.1 53.8 12.5 50.1 9.3 107.2-9.3 167.9-43.6 71.4-114.6 221.7-192.1 257.5-15.3 10.7-92.8 3.7-92.8 3.7-71.4-50.1-427.7-282.5-294.6-436.5 12.5-28.8 62.2-96.5 105.3-103.9 12.6-3.3 49.7-7 59-13.9h0z"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M8362.7 6878.2c9.3-21.3 18.6-32 37.1-35.7 40.4-3.7 83.5-3.7 99.3 10.7 18.6 21.3 33.9 10.7 46.4-7 18.6-10.7 40.4-10.7 62.2-3.7h58.9c9.3 7 15.3 14.4 24.6 21.3l15.3-18.1c21.8 0 43.6-3.7 62.2-3.7 31.1-14.4 58.9-18.1 83.5-14.4 21.8 3.7 37.1 18.1 43.6 35.7 6 25.1 6 53.8 0 85.8-3.2 21.3-9.3 35.7-21.8 50.1-24.6-3.7-40.4-18.1-52.9-46.4-24.6-21.3-52.9-28.8-90-25.1-15.3 14.4-31.1 21.3-49.6 18.1-33.9-35.7-27.8-53.8-71.4-46.4-12.5 0-24.6 3.7-40.4 3.7-6 3.7-24.6 25.1-46.4 10.7-6-10.7-12.5-14.4-21.8-18.1-15.3-7-40.4 14.4-64.9 43.1-6 7-9.3 7-15.3 14.4-24.8-28.6-40.1-46.7-58.6-75h0z"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M8545.4 6845.8c-9.3 7-21.8 21.3-33.9 18.1-9.3 0-15.3-18.1-27.8-21.3-40.4 0-83.5-3.7-96 3.7-9.3 7-21.8 21.3-31.1 35.7m251-40h58.9c6 0 15.3 21.3 24.6 21.3 6 0 15.3-21.3 21.8-21.3h58.9m80.3-13.9c15.3 3.7 33.9 14.4 40.4 28.8 6 14.4 9.3 60.8 0 93.2-3.2 21.3-6 32-21.8 50.1-18.6 10.7-43.6-18.1-52.9-46.4m-250.6-50.5c24.6-7 52.9-7 77.5 0 18.6 14.4 18.6 39.4 33.9 39.4 18.6 0 33.9-10.7 49.6-18.1M8787.1 7121.3c-18.6-18.1-43.6-32-68.2-43.1-9.3-3.7-15.3-43.1-31.1-64.5-6-18.1-12.5-46.4-9.3-68.2M8412.3 6956.6c24.6-14.4 43.6-35.7 64.9-57.1 12.5-7 31.1-10.7 43.6 14.4 3.2 39.4 12.5 71.4 21.8 100.2 9.3 43.1 64.9 100.2 96 125.3M4822.7 6766.9c21.8 38 39.4 71.9 43.6 105.8 4.2 46.4 0 105.8-13 139.2-74.2 135-166.1 190.2-205.5 215.2-30.6 21.3-100.7 29.7-144.3 12.5-13 0-26.4-8.4-39.4-12.5-13 0-48.2 12.5-61.2 25.5-17.6 12.5-70 4.2-96-8.4-13-4.2-21.8-25.5-34.8-25.5-126.6-16.7-196.7-118.3-236.1-236.6-21.8-46.4-17.6-295.5 4.2-341.9 153.1-236.6 161.9-236.6 415.7-367.4 48.2-25.5 131.3-33.9 166.1-12.5 205.5 135 240.8 223.6 262.6 329.4 8.8 42.2 4.2 76.1 0 109.9-14.2 46.4-57.8 54.8-61.9 67.3h0z"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M4472.4 7184.9c-144.3-58.9-227.3-270-231.9-295.5 0-16.7 13-29.7 30.6-42.2 21.8-12.5 0-130.8 26.4-130.8 17.6-4.2 61.2 29.7 57.1 33.9-4.2 12.5-13 25.5-4.2 38"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M4026.1 6843c17.6 4.2 48.2 0 65.4 4.2 17.6 0 74.2 80.3 104.8 67.7 26.4-25.5 74.2-8.4 91.9-16.7 17.6-8.4 39.4-42.2 61.2-63.6 17.6-12.5 52.4 4.2 57.1-12.5-4.2-21.3 0-42.2 17.6-54.7 13-4.2 61.2-4.2 104.8 4.2 17.6 4.2 21.8 16.7 48.2 21.3 17.6 4.2 65.4 88.6 91.9 92.8 21.8-4.2 52.4-92.8 65.4-109.9 8.8-21.3 74.2 0 91.9-12.5m.5-85c13-25.5-8.8-88.6 0-92.8 13-4.2 57.1 54.7 57.1 114.1"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M4669.6 6885.2c-13 8.4-21.8 12.5-26.4 25.5-4.2 16.7-4.2 42.2 0 58.9m-65.5-177.2c61.2-16.7 122.5-76.1 126.6-97 4.2-29.7-17.6-71.9 0-122.5m-210.1 198.2c0-21.3-26.4-29.7-30.6-50.6-4.2-21.3 30.6-84.4 30.6-101.1 0-16.7 26.4-25.5 52.4-38M4446.4 6978c-8.8-12.5-26.4-25.5-39.4-29.7-8.8-4.2-21.8-21.3-21.8-33.9 0-12.5 21.8-33.9 30.6-50.6 8.8-16.7 0-29.7-13-42.2-4.2-16.7-4.2-38 17.6-54.7 4.2-16.7-13-38-8.8-58.9 0-25.5-52.4-63.6-61.2-118.3m-197.2 139.2c17.6 8.4 30.6 16.7 34.8 33.9-4.2 12.5-21.8 12.5-26.4 21.3-4.2 16.7 4.2 38-4.2 46.4-13 12.5-17.6 38-21.8 54.7M5898 6858.7c0 16.2 16.7 64.5 12.5 80.7 0 24.1-32.9 108.6-86.7 169.3-49.6 52.4-115.5 84.4-156.8 92.8-24.6 7.9-70 7.9-95.1 0-32.9-12.1-86.7-36.2-99.3-32-16.7 0-78.4 60.3-99.3 64.5-41.3 0-111.3 0-140.1-12.1-32.9-12.1-78.4-56.6-107.2-100.7-41.3-56.6-70-108.6-78.4-185.1-12.5-92.8-16.7-213.4-4.2-270 37.1-153.1 214.8-261.6 487.1-314.1 58-12.1 152.6-12.1 193.9 4.2 28.8 12.1 128 56.6 222.7 153.1 24.6 24.1 12.5 265.8 0 282.1-7.8 14.9-45 55.3-49.1 67.3h0z"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M5786.6 6846.7c-8.4 4.2-28.8 4.2-45.5 4.2-12.5 0-24.6-16.2-41.3-19.9-16.7-7.9-45.5-4.2-70-4.2-24.6-4.2-61.7-24.1-78.4-24.1-12.5 0-41.3 12.1-58 12.1-20.4 4.2-41.3 28.3-58 32-16.7 0-53.8-24.1-70-24.1s-24.6 24.1-41.3 32c-24.6 12.1-24.6 40.4-37.1 44.1-12.5 0-24.6-19.9-37.1-24.1-20.4-4.2-45.5-7.9-70-4.2-28.8 4.2-32.9 19.9-65.9 19.9m255.6-136c-24.6 28.3-82.6 68.7-95.1 68.7-16.7 0-49.6-80.7-82.6-120.6-8.4-12.1-24.6-32-12.5-56.6 4.2-12.1 32.9-52.4 58-36.2"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M5538.9 7011.8c-37.1 0-61.7-52.4-82.6-60.3-16.7-4.2-41.3-40.4-49.6-72.4-4.2-16.2 24.6-16.2 24.6-36.2-16.7-48.2-61.7-76.5-61.7-88.6 8.4-16.2 49.6-44.1 58-56.6 4.2-7.9 16.7-32 12.5-56.6-4.2-19.9-28.8-44.1-32.9-52.4-4.2-8.4-53.8-28.3-82.6-12.1m168.9 233.9c24.6-40.4 4.2-72.4 24.6-120.6l24.6-60.3c16.7-36.2 61.7-100.7 103-72.4m161.3 434.7c12.5 4.2 20.4 0 28.8-4.2 8.4-4.2 4.2-52.4 4.2-60.3-4.2-19.9-32.9 4.2-32.9-72.4-8.4-4.2-24.6-4.2-37.1-4.2 61.7-32 61.7-92.8 78.4-100.7 28.8-16.2 78.4-48.2 111.3-64.5m-214.3 36.3c-12.5-28.3-8.4-88.6-8.4-108.6 0-16.2 4.2-44.1 16.7-56.6 20.4-19.9 41.3-19.9 61.7-19.9M5287 6899.1c4.2 12.1 4.2 28.3 4.2 44.1 4.2 16.2 12.5 36.2 20.4 52.4 49.6 76.5 123.9 148.9 173.5 177.2M6682.4 6645.4c-34.8-53.8-146.6-118.8-240.8-143.8-41.8-14.4-115-21.8-160.5 0-69.6 28.8-181.4 122.5-226.8 219.4-17.6 32.5-17.6 79.3 3.7 129.4 62.6 108.1 135.9 205 244.5 255.1 27.8 14.4 66.3 14.4 97.9 0 94.2-21.8 223.1-161.9 289.5-334.5 24.1-71.4 10.2-100.1-7.5-125.6h0z"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M6487.1 6721c-20.9 0-41.8 0-59.4 10.7-13.9 10.7-24.6 21.8-24.6 43.1 0 18.1 3.7 39.4 7 57.5-38.5 25.1-84-36.2-108.1-64.9-7-10.7-17.6-18.1-27.8-21.8-17.6 0-27.8 7.4-41.8 14.4-17.6 18.1-20.9 39.4-17.6 61.2 0 14.4 3.7 28.8 3.7 43.1-3.7 14.4 0 28.8 10.7 39.4 10.7 25.1 20.9 46.9 41.8 61.2 27.8 14.4 41.8 14.4 38.5-3.7-7-18.1-3.7-53.8 0-64.9 0-10.7 34.8-21.8 34.8-18.1 3.7 3.7 24.6 0 38.5 0 13.9 3.7 24.6 10.7 38.5 18.1 10.7 3.7 20.9 3.7 31.5 7.4 0-28.8 0-57.5 20.9-79.3 10.7-10.7 20.9-28.8 24.6-46.9-.5-17.1-.5-42.1-11.2-56.5h0z"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M6106.7 6839.7c13.9-7.4 24.6-10.7 41.8 0 17.6 10.7 38.5 18.1 55.7 21.8 13.9 3.7 10.7 18.1 20.9 32.5 10.7 7.4 17.6 39.4 31.5 53.8s27.8 28.8 45.5 25.1c10.7-3.7 3.7-39.4 0-61.2 0-10.7 10.7-25.1 20.9-32.5 13.9-7.4 59.4-7.4 73.3 0 7 3.7 17.6 14.4 24.6 18.1 24.6 10.7 69.6 7.4 84 0 10.7-3.7 94.2-64.9 115-147.5 3.7-10.7 31.5-36.2 20.9-61.2"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M6214.8 6882.9c7-10.7 3.7-36.2 0-61.2 0-18.1 0-36.2 7-50.6 10.7-18.1 31.5-28.8 45.5-28.8 17.6 0 31.5 7.4 34.8 21.8m115.4 280.7c-3.7-7.4-3.7-14.4 0-18.1 7 0 13.9-7.4 13.9-10.7 10.7-10.7-3.7-79.3 3.7-111.3h17.6c3.7-28.8 0-64.9 20.9-79.3m-94.6 53.8c3.7-14.4 17.6-25.1 24.6-36.2 10.7-14.4-3.7-46.9-3.7-71.9 7-32.5 34.8-53.8 87.2-50.6M7388 6862c-4.2 4.6-8.4 13.5-17.2 22.3-72.4 105.8-233.8 233.8-259.3 242.6-25.5 13.5-76.5 17.6-110.4 0-84.9-61.7-165.6-141-195.8-233.8-17.2-44.1-12.5-119.2 4.2-149.8 33.9-70.5 148.9-176.3 204.1-202.7 25.5-26.4 144.7-22.3 170.3 0 76.5 31.1 170.3 141 204.1 207.4 17.2 21.2 21.4 87.6 0 114z"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M6810 6906.1c42.7-8.8 110.4 4.6 123.4 0 21.3-4.6 12.5-48.7 38-48.7 29.7-4.6 51 39.9 84.9 44.1 21.3 4.6 97.9 4.6 106.2-4.6 17.2-4.6 46.9-66.3 63.6-66.3s25.5 39.9 38 44.1c12.5 8.8 76.5 8.8 114.6 0m-224.5 22.6c25.5 17.6 33.9 57.5 33.9 92.8"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M7056.3 6901.4c0 22.3 17.2 88.1 12.5 101.6 0 17.6-38 39.9-55.2 70.5m-71.9-180.9c17.2 8.8 29.7 26.4 21.3 35.3-25.5 8.8-25.5 101.6-59.4 110.4M7987.4 6596.6c9.3 7 46.4 10.7 58.9 14.4 43.6 7 92.8 75.2 105.3 103.9 133.1 154-223.1 386.4-294.6 436.5 0 0-77.5 7-92.8-3.7-77.5-35.7-148.9-186-192.1-257.5-18.6-60.8-21.8-118.3-9.3-167.9 6-25.1 18.6-39.4 31.1-53.8 3.2-3.7 27.8-43.1 74.2-53.8 15.3-3.7 49.6-3.7 55.7-14.4 15.3-14.4 31.1-32 52.9-35.7 49.6-10.7 108.6-7 151.7 3.7 21.9 7 40.4 17.7 59 28.3h0z"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M8151.6 6872.2c-18.6 28.8-33.9 46.4-58.9 75.2-6-7-9.3-7-15.3-14.4-24.6-28.8-49.6-50.1-64.9-43.1-9.3 3.7-15.3 7-21.8 18.1-21.8 14.4-40.4-7-46.4-10.7-15.3 0-27.8-3.7-40.4-3.7-43.6-7-37.1 10.7-71.4 46.4-18.6 3.7-33.9-3.7-49.6-18.1-37.1-3.7-64.9 3.7-90 25.1-12.5 28.8-27.8 43.1-52.9 46.4-12.5-14.4-18.6-28.8-21.8-50.1-6-32-6-60.8 0-85.8 6-18.1 21.8-32 43.6-35.7 24.6-3.7 52.9 0 83.5 14.4 18.6 0 40.4 3.7 62.2 3.7l15.3 18.1c9.3-7 15.3-14.4 24.6-21.3h58.9c21.8-7 43.6-7 62.2 3.7 12.5 18.1 27.8 28.8 46.4 7 15.3-14.4 58.9-14.4 99.3-10.7 18.8 3 28.1 13.7 37.4 35.5h0z"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M8157.6 6875.4c-9.3-14.4-21.8-28.8-31.1-35.7-12.5-7-55.7-3.7-96-3.7-12.5 3.7-18.6 21.3-27.8 21.3-12.5 3.7-24.6-10.7-33.9-18.1m-226.4-2.7h58.9c6 0 15.3 21.3 21.8 21.3 9.3 0 18.6-21.3 24.6-21.3h58.9M7696 6947.4c-9.3 28.8-33.9 57.1-52.9 46.4-15.3-18.1-18.6-28.8-21.8-50.1-9.3-32-6-78.9 0-93.2 6-14.4 24.6-25.1 40.4-28.8m124.3 96.9c15.3 7 31.1 18.1 49.6 18.1 15.3 0 15.3-25.1 33.9-39.4 24.6-7 52.9-7 77.5 0M7835.7 6939.9c3.2 21.3-3.2 50.1-9.3 68.2-15.3 21.3-21.8 60.8-31.1 64.5-24.6 10.7-49.6 25.1-68.2 43.1M7876 7133.4c31.1-25.1 86.7-82.1 96-125.3 9.3-28.8 18.6-60.8 21.8-100.2 12.5-25.1 31.1-21.3 43.6-14.4 21.8 21.3 40.4 43.1 64.9 57.1M12349.9 8494.9c13.5-24.6 26.9-39.4 31.5-64 4.6-34.3 4.6-98.3-4.6-132.7-8.8-39.4-40.4-83.5-81.2-108.1-54.3-29.7-99.3-29.7-139.6-5.1-13.5 5.1-18.1 24.6-26.9 29.7-22.7 0-26.9-34.3-54.3-39.4-45-9.7-54.3-39.4-85.8-34.3-26.9 0-54.3 24.6-63.1 34.3-13.5 14.8-13.5 34.3-26.9 39.4-13.5 0-22.7-19.5-31.5-29.7-8.8-14.8-45-39.4-76.5-39.4-26.9-5.1-40.4 14.8-63.1 14.8-18.1 0-112.7 0-130.8 14.8-31.5 19.5-67.7 49.2-85.8 122.9-4.6 54.3-31.5 58.9-26.9 117.8 0 54.3 22.7 49.2 22.7 64 0 14.8-58.5 39.4-76.5 108.1-13.5 54.3-8.8 128 0 162.4 8.8 34.3 31.5 83.5 54.3 117.8 36.2 54.3 81.2 98.3 117.4 122.9 31.5 14.8 76.5 19.5 108.1 29.7 22.7 5.1 121.5 58.9 171.2 73.8 67.7 14.8 144.3 14.8 212 0 45-9.7 90 0 135.5-14.8 63.1-19.5 167-231 185.1-275.1 18.1-54.3 13.5-132.7-4.6-162.4-14.7-24.4-14.7-102.8-59.7-147.4h0z"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M11623.9 8347.4c8.8 44.1 18.1 78.9 40.4 103.5 26.9 44.1 67.7 54.3 103.9 64 36.2 5.1 58.5-9.7 90-29.7 31.5-5.1 58.5-9.7 90-14.8 63.1-9.7 108.1-9.7 144.3 0 45 9.7 85.8 29.7 130.8 58.9 40.4 34.3 72.4 73.8 103.9 108.1 8.8 24.6 4.6 49.2-22.7 68.7-18.1 14.8-49.6 14.8-67.7 9.7-26.9 9.7-67.7 5.1-94.6-5.1-13.5 24.6-26.9 39.4-67.7 49.2-26.9 5.1-49.6 0-63.1-9.7-36.2-34.3-40.4-39.4-63.1-24.6-18.1 9.7-31.5 19.5-49.6 29.7-36.2 5.1-67.7 0-94.6-9.7l-108.1-14.8c-8.8-5.1-18.1 0-26.9-5.1-45-9.7-90-29.7-103.9-54.3-22.7-24.6-36.2-54.3-31.5-88.6 13.5-54.3 45-83.5 72.4-103.4-13.8-48-9.1-92.6 17.8-132h0z"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M12323 8642.4c-36.2-54.3-94.6-108.1-130.8-128-22.7-9.7-45-24.6-72.4-29.7-94.6-29.7-130.8-19.5-193.9-5.1-13.5 5.1-49.6 0-67.7 9.7-31.5 9.7-36.2 29.7-63.1 29.7-22.7 0-40.4 0-58.5-14.8-45-14.8-72.4-44.1-94.6-88.6-8.8-19.5-8.8-64-18.1-68.7-18.1 5.1-36.2 58.9-22.7 142.4 0 14.8-40.4 24.6-67.7 78.9-4.6 19.5-8.8 34.3-8.8 49.2s18.1 44.1 31.5 64"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M12349.9 8494.9c-36.2-9.7-76.5-9.7-94.6-5.1-22.7 5.1-40.4 24.6-63.1 29.7m-81.2 59.4c13.5 14.8 26.9 34.3 31.5 58.9 4.6 24.6 0 54.3-4.6 78.9-8.8 14.8-22.7 34.3-36.2 39.4-8.8 5.1-49.6 19.5-58.5 14.8-8.8-5.1-45-19.5-58.5-39.4m247.8-10.2c-36.2 5.1-67.7 5.1-94.6-5.1m-135-122.9c-22.7 29.7-54.3 58.9-58.5 68.7-4.6 19.5 8.8 64 4.6 73.8-8.8 9.7-49.6 34.3-72.4 39.4-22.7 0-126.2-29.7-144.3-29.7-22.7-5.1-58.5 5.1-67.7-9.7-4.6-9.7 4.6-34.3 4.6-58.9 0-19.5-8.8-58.9 4.6-64 26.9-9.7 13.5-88.6 63.1-108.1"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M11844.7 8573.8c0 24.6-26.9 49.2-36.2 64-22.7 34.3 4.6 93.2-18.1 122.9M11280.1 8507.9c-9.7-25.1 14.8-139.6 0-174.9-63.6-95.1-196.2-184.6-314.1-180-24.6 0-73.8 39.9-93.2 39.9-19.5 0-58.9-30.2-78.4-39.9-44.1-14.8-156.8-14.8-186.5-5.1-49.2 19.9-156.8 95.1-206 184.6-19.5 25.1-34.3 115-34.3 160 0 25.1-39.4 90-39.4 115-9.7 30.2-14.8 99.7-5.1 135 14.8 34.8 83.5 79.8 122.5 109.9 19.5 14.8 53.8 70 73.8 99.7 103 109.9 191.1 79.8 215.7 90 44.1 19.9 103 45 196.2 39.9 88.1 5.1 112.7-25.1 132.7-25.1 58.9-25.1 127.6-25.1 152.2-34.8 83.5-30.2 112.7-119.7 122.5-135 34.3-50.1 34.3-209.7 24.6-249.6-4.8-29.9-73.4-99.9-83.2-129.6h0z"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M10529.5 8533c-19.5 30.2-24.6 64.9-34.3 95.1 9.7 10.2 19.5 19.9 34.3 30.2 0 14.8-5.1 30.2-5.1 45 0 5.1 0 14.8 5.1 19.9h53.8v25.1h73.8c24.6-5.1 49.2-5.1 73.8-10.2 5.1-5.1 19.5-5.1 34.3-5.1 19.5 0 39.4 0 53.8 5.1 34.3 14.8 68.7 34.8 103 50.1 9.7 0 19.5 5.1 29.2 5.1 9.7-5.1 19.5-10.2 24.6-14.8 19.5-5.1 39.4-5.1 63.6-10.2 44.1-50.1 29.2-90 5.1-149.8-9.7-14.8-24.6-30.2-49.2-34.8 0-30.2 0-59.8-14.8-84.9-14.8-14.8-39.4-14.8-73.8-14.8 0-10.2 0-25.1 5.1-34.8-9.7 5.1-24.6 5.1-34.3 10.2l-88.1-14.8c-29.2 14.8-53.8 25-83.5 39.9-19.5 0-39.4-5.1-58.9-5.1-19.6 3.5-68.7-1.6-117.5 53.6h0z"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M10495.2 8627.6c0 19.9 29.2 19.9 34.3 30.2 0 25.1-9.7 59.8 0 64.9 14.8 5.1 44.1-5.1 53.8 0 5.1 10.2-9.7 19.9 0 25 19.5 5.1 108.1 0 142.4-10.2m-358.1-279.7c14.8 14.8 24.6 45 39.4 50.1 24.6 0 14.8-64.9 19.5-70 9.7-5.1 29.2 5.1 39.4 0 9.7-5.1 0-19.9 5.1-25.1 9.7-5.1 88.1-5.1 103-5.1 9.7 0 19.5 19.9 14.8 34.8m58.6 165.1c-14.8-45-19.5-115-5.1-124.8 19.5-14.8 53.8 5.1 68.7 0 19.5-10.2 44.1-30.2 78.4-39.9 39.4-5.1 58.9 34.8 122.5 5.1 0 19.9-9.7 34.8-9.7 50.1-5.1 19.9-9.7 39.9-19.5 54.7-19.5 14.8-39.4 45-49.2 70-9.7 30.2-44.1 64.9-83.5 79.8"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M10735.5 8288c-5.1 25-5.1 59.8 0 64.9 9.7 5.1 14.8 5.1 19.5 10.2 14.8 10.2-5.1 45 9.7 54.7l24.6 25.1m211.1-134.9c-5.1 14.8-19.5 30.2-29.2 34.8-9.7 0-9.7 34.8-19.5 54.7-5.1 10.2-19.5 14.8-24.6 19.9-9.7 10.2-14.8 25.1-14.8 34.8m-5.1 30.7c19.5-5.1 39.4-5.1 58.9 5.1 19.5 5.1 29.2 34.8 24.6 45 0 14.8-5.1 39.9 0 50.1 5.1 10.2 24.6 10.2 34.3 14.8s14.8 25.1 19.5 39.9m117.8-230.1c-24.6 14.8-29.2 45-58.9 45-19.5 0-44.1 19.9-39.4 30.2 5.1 14.8 19.5 0 39.4 14.8 14.8 14.8 24.6 30.2 34.3 39.9 19.5 14.8 19.5 54.7 39.4 64.9 14.8 10.2 0 34.8 9.7 50.1 9.7 10.2 19.5 10.2 24.6 19.9 5.1 10.2 0 75.2-5.1 90-5.1 10.2-29.2 14.8-24.6 25.1m-299.1-234.7c14.8 19.9 9.7 75.2 39.4 90 24.6 19.9 14.8 39.9 68.7 95.1 14.8 5.1 49.2 19.9 49.2 34.8 0 10.2-29.2 0-49.2 5.1-19.5 5.1-24.6 19.9-39.4 19.9-9.7 0-39.4-10.2-53.8-19.9-24.6-14.8-49.2-34.8-73.8-39.9M9611.5 8573.8c16.2-25.5 153.6-178.6 225.9-238.4 40.4-25.5 97-17.2 129.4 0 64.5 38.5 109 68.2 153.5 127.6 28.3 33.9 60.8 97.9 72.8 148.9 24.1 59.4 16.2 123.4 4.2 178.6-20.4 59.4-88.6 199.9-133.1 217.1-36.2 13-169.8 8.4-201.8 0-16.2-4.2-104.8-80.7-137.3-110.4-44.5-51-80.7-115-116.9-178.6-16.7-33.9-20.8-98 3.3-144.8h0z"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M9724.7 8608.1c4.2-25.5 16.2-33.9 28.3-42.7 28.3-8.3 28.3-21.3 56.6-42.7 16.2-97.9 7.9-89.5 84.9-144.7 28.3 25.5 7.9 144.7 7.9 182.8 7.9 119.2-24.1 148.9-56.6 144.7-24.1 17.2-76.5-13-104.8-25.5-12.1-20.9-28.4-33.8-16.3-71.9h0zM9978.9 8522.8c-16.2 17.2 7.9 46.9 12.1 55.2 7.9 17.2 16.2 46.9 4.2 64-7.9 8.4-28.3 0-28.3 17.2 0 21.3 4.2 33.9 7.9 42.7 28.3 13 64.5 21.3 92.8-4.2 16.2-17.2 12.1-33.9 20.4-46.9 12.1-25.5 36.2-13 44.5-42.7-4.2-29.7-16.2-46.9-36.2-76.5-4.2-4.2-7.9-17.2-20.4-25.5-7.9-17.2-76.6-17.2-97 16.7h0z"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M9805.4 8522.8c12.1-21.3 4.2-68.2 20.4-84.9 12.1-17.2 52.4-59.4 64.5-59.4 20.4 4.2 4.2 174.4 7.9 264m109-140.6c24.1-4.2 60.8-4.2 68.7 0 7.9 4.2 36.2 46.9 40.4 55.2 4.2 13 20.4 42.7 16.2 51-4.2 8.4-16.2 13-24.1 17.2-7.9 4.2-16.2 13-20.4 21.3m-92.9-72.8c4.2 21.3 4.2 55.2 0 68.2-7.9 8.4-20.4 0-24.1 8.4-4.2 4.2 0 38.5 4.2 46.9 4.2 8.4 20.4 8.4 32.5 8.4m-283-93.4c0 13-4.2 38.5 4.2 51 12.1 21.3 44.5 33.9 52.4 38.5 12.1 4.2 40.4 4.2 60.8 4.2M9136.9 8336.3c-26.9 14.4-71.9 72.4-81.2 106.2-9.3 33.9-18.1 58-31.5 82.1-13.5 19.5-71.9 67.3-85.4 91.4-13.5 24.1-40.4 125.3-13.5 207.4 13.5 48.2 90 129.9 130.4 149.4 40.4 19.5 184.2 24.1 260.7 9.7 53.8-24.1 148.4-82.1 206.9-207.4 18.1-48.2 26.9-106.2-4.6-149.4-81.2-110.9-175.4-212-265.4-298.8-26.4-14.8-75.6-19.4-116.4 9.4z"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M9150.4 8413.3c13.5-24.1 36.2-33.9 49.6-33.9 31.5 0 45 28.8 45 72.4 0 9.7 0 24.1 4.6 33.9 26.9 4.6 36.2 19.5 22.3 52.9 26.9 9.7 53.8 14.4 81.2 9.7 18.1 0 36.2 28.8 53.8 52.9 26.9 33.9 22.3 72.4 18.1 110.9-8.8 14.4-8.8 28.8-49.6 28.8-22.3-14.4-26.9-28.8-31.5-33.9-26.9 0-53.8-4.6-81.2-4.6-18.1-4.6-31.5-9.7-45-14.4-22.3-4.6-45-9.7-63.1-9.7-45 9.7-116.9 86.7-139.6 9.7v-28.8c0-38.5 18.1-52.9 40.4-67.3 0-19.5 4.6-33.9 4.6-52.9 18.1-14.4 31.5-24.1 49.6-38.5 0-14.4 0-24.1 4.6-38.5 13.9-14.9 22.7-34.3 36.2-48.7h0z"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M9155 8418.4c-18.1 9.7-31.5 24.1-45 48.2-4.6 9.7 4.6 24.1 0 38.5-4.6 9.7-40.4 24.1-49.6 33.9-4.6 9.7 0 33.9-4.6 52.9-4.6 14.4-31.5 19.5-36.2 33.9-4.6 14.4-4.6 43.1-4.6 62.6m185-303.9c22.3-9.7 31.5 0 45 33.9 8.8 19.5-4.6 52.9 4.6 67.3 8.8 9.7 22.3 4.6 26.9 14.4 4.6 9.7-8.8 33.9 0 38.5 13.5 19.5 94.6 0 98.8 24.1 4.6 24.1 40.4 43.1 49.6 62.6s4.6 58 4.6 91.4m-292.6-38.1c26.9-4.6 76.5 0 94.6 14.4 22.3 19.5 81.2 4.6 112.3 14.4"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M8286.6 8567.8c38.5-104.8 120.6-244 159.6-274.2 53.3-39.9 106.2-34.8 145.2-19.9 62.6 29.7 207.8 189.3 261.2 298.8 14.4 34.8 14.4 129.4 9.7 209.2-14.4 54.7-43.6 99.7-77.5 124.8-38.5 19.9-87.2 25.1-149.8 45-53.3 19.9-174 19.9-222.2-5.1-77.5-39.9-111.3-139.6-125.7-194.4-5.6-54.4-14.9-124.4-.5-184.2z"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M8523.2 8343.7c33.9 0 58 19.9 62.6 45 9.7 19.9 19.5 49.6 29.2 69.6l72.4 59.8c33.9 25.1 62.6 49.6 77.5 89.5 9.7 25.1-4.6 34.8-29.2 34.8h-33.9c-24.1-9.7-53.3-5.1-96.5 0-43.6 5.1-87.2 0-130.4-5.1h-62.6c-24.1-5.1-48.2 0-53.3-29.7 0-34.8 9.7-64.9 29.2-99.7 19.5-29.7 38.5-64.9 58-94.6 19-29.7 43.1-59.9 77-69.6h0z"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M8518.5 8348.8c-19.5 0-43.6 14.8-58 39.9-24.1 39.9-62.6 104.8-72.4 124.8-14.4 19.9-29.2 64.9-24.1 99.7m212.5-219.9c19.5 14.8 29.2 54.7 38.5 64.9 19.5 25.1 101.6 69.6 135.5 124.8 9.7 9.7 19.5 34.8 9.7 49.6-14.4 9.7-38.5 9.7-58 5.1m-289.9-10.1c67.7 5.1 130.4 19.9 193.4 9.7"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M4104.1 8549.2c-45 44.1-45 122.9-58.5 147.5-18.1 29.7-22.7 108.1-4.6 162.4 18.1 44.1 121.5 255.6 185.1 275.1 45 14.8 90 5.1 135.5 14.8 67.7 14.8 144.3 14.8 212 0 49.6-14.8 148.9-68.7 171.2-73.8 31.5-9.7 76.5-14.8 108.1-29.7 36.2-24.6 81.2-68.7 117.4-122.9 22.7-34.3 45-83.5 54.3-117.8 9.3-34.3 13.5-108.1 0-162.4-18.1-68.7-76.5-93.2-76.5-108.1 0-14.8 22.7-9.7 22.7-64 4.6-58.9-22.7-64-26.9-117.8-18.1-73.8-54.3-103.5-85.8-122.9-18.1-14.8-112.7-14.8-130.8-14.8-22.7 0-36.2-19.5-63.1-14.8-31.5 0-67.7 24.6-76.5 39.4-8.8 9.7-18.1 29.7-31.5 29.7-13.5-5.1-13.5-24.6-26.9-39.4-8.8-9.7-36.2-34.3-63.1-34.3-31.5-5.1-40.4 24.6-85.8 34.3-26.9 5.1-31.5 39.4-54.3 39.4-8.8-5.1-13.5-24.6-26.9-29.7-40.4-24.6-85.8-24.6-139.6 5.1-40.4 24.6-72.4 68.7-81.2 108.1-8.8 34.3-8.8 98.3-4.6 132.7 3.4 24.9 16.8 39.3 30.3 63.9h0z"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M4830.1 8402.1c26.9 39.4 31.5 83.5 18.1 132.7 26.9 19.5 58.5 49.2 72.4 103.4 4.6 34.3-8.8 64-31.5 88.6-13.5 24.6-58.5 44.1-103.9 54.3-8.8 5.1-18.1 0-26.9 5.1l-108.1 14.8c-26.9 9.7-58.5 14.8-94.6 9.7-18.1-9.7-31.5-19.5-49.6-29.7-22.7-14.8-26.9-9.7-63.1 24.6-13.5 9.7-36.2 14.8-63.1 9.7-40.4-9.7-54.3-24.6-67.7-49.2-26.9 9.7-67.7 14.8-94.6 5.1-18.1 5.1-49.6 5.1-67.7-9.7-26.9-19.5-31.5-44.1-22.7-68.7 31.5-34.3 63.1-73.8 103.9-108.1 45-29.7 85.8-49.2 130.8-58.9 36.2-9.7 81.2-9.7 144.3 0 31.5 5.1 58.5 9.7 90 14.8 31.5 19.5 54.3 34.3 90 29.7 36.2-9.7 76.5-19.5 103.9-64 22-25.8 30.8-60.1 40.1-104.2h0z"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M4897.8 8736.1c13.5-19.5 31.5-49.2 31.5-64 0-14.8-4.6-29.7-8.8-49.2-26.9-54.3-67.7-64-67.7-78.9 13.5-83.5-4.6-137.8-22.7-142.4-8.8 5.1-8.8 49.2-18.1 68.7-22.7 44.1-49.6 73.8-94.6 88.6-18.1 14.8-36.2 14.8-58.5 14.8-26.9 0-31.5-19.5-63.1-29.7-18.1-9.7-54.3-5.1-67.7-9.7-63.1-14.8-99.3-24.6-193.9 5.1-26.9 5.1-49.6 19.5-72.4 29.7-36.2 19.5-94.6 73.8-130.8 128"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M4261.8 8573.8c-22.7-5.1-40.4-24.6-63.1-29.7-18.1-5.1-58.5-5.1-94.6 5.1m365.1 236.1c-13.5 19.5-49.6 34.3-58.5 39.4-8.8 5.1-49.6-9.7-58.5-14.8-13.5-5.1-26.9-24.6-36.2-39.4-4.6-24.6-8.8-54.3-4.6-78.9 4.6-24.6 18.1-44.1 31.5-58.9m-26.8 137.8c-26.9 9.7-58.5 9.7-94.6 5.1m495.8-216.2c49.6 19.5 36.2 98.3 63.1 108.1 13.5 5.1 4.6 44.1 4.6 64 0 24.6 8.8 49.2 4.6 58.9-8.8 14.8-45 5.1-67.7 9.7-18.1 0-121.5 29.7-144.3 29.7-22.7-5.1-63.1-29.7-72.4-39.4-4.6-9.7 8.8-54.3 4.6-73.8-4.6-9.7-36.2-39.4-58.5-68.7"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M4663.5 8815c-22.7-29.7 4.6-88.6-18.1-122.9-8.8-14.8-36.2-39.4-36.2-64M5173.8 8562.2c-9.7 30.2-78.4 99.7-83.5 129.9-9.7 39.9-9.7 199.9 24.6 249.6 9.7 14.8 39.4 104.8 122.5 135 24.6 10.2 93.2 10.2 152.2 34.8 19.5 0 44.1 30.2 132.7 25 93.2 5.1 152.2-19.9 196.2-39.9 24.6-10.2 112.7 19.9 215.7-90 19.5-30.2 53.8-84.9 73.8-99.7 39.4-30.2 108.1-75.2 122.5-109.9 9.7-34.8 5.1-104.8-5.1-135 0-25.1-39.4-90-39.4-115 0-45-14.8-135-34.3-160-49.2-90-156.8-164.7-206-184.6-29.2-10.2-142.4-10.2-186.5 5.1-19.5 10.2-58.9 39.9-78.4 39.9s-68.7-39.9-93.2-39.9c-117.8-5.1-250 84.9-314.1 180-14.1 34.6 10.5 149.6.3 174.7h0z"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M5924.4 8587.2c-49.2-54.7-97.9-50.1-117.8-54.7-19.5 0-39.4 5.1-58.9 5.1-29.2-14.8-53.8-25.1-83.5-39.9l-88.1 14.8c-9.7-5.1-24.6-5.1-34.3-10.2 5.1 10.2 5.1 25.1 5.1 34.8-34.3 0-58.9 0-73.8 14.8-14.8 25.1-14.8 54.7-14.8 84.9-24.6 5.1-39.4 19.9-49.2 34.8-24.6 59.8-39.4 99.7 5.1 149.8 24.6 5.1 44.1 5.1 63.6 10.2 5.1 5.1 14.8 10.2 24.6 14.8 9.7 0 19.5-5.1 29.2-5.1 34.3-14.8 68.7-34.8 103-50.1 14.8-5.1 34.3-5.1 53.8-5.1 14.8 0 29.2 0 34.3 5.1 24.6 5.1 49.2 5.1 73.8 10.2h73.8v-25.1h53.8c5.1-5.1 5.1-14.8 5.1-19.9 0-14.8-5.1-30.2-5.1-45 14.8-10.2 24.6-19.9 34.3-30.2-9.4-29-14-64.3-34-94h0z"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M5728.2 8791.8c34.3 10.2 122.5 14.8 142.4 10.2 9.7-5.1-5.1-14.8 0-25 9.7-5.1 39.4 5.1 53.8 0 9.7-5.1 0-39.9 0-64.9 5.1-10.2 34.3-10.2 34.3-30.2m-92.7-184.7c-5.1-14.8 5.1-34.8 14.8-34.8 14.8 0 93.2 0 103 5.1 5.1 5.1-5.1 19.9 5.1 25.1 9.7 5.1 29.2-5.1 39.4 0 5.1 5.1-5.1 70 19.5 70 14.8-5.1 24.6-34.8 39.4-50.1M5704.1 8757c-39.4-14.8-73.8-50.1-83.5-79.8-9.7-25.1-29.2-54.7-49.2-70-9.7-14.8-14.8-34.8-19.5-54.7 0-14.8-9.7-30.2-9.7-50.1 63.6 30.2 83.5-10.2 122.5-5.1 34.3 10.2 58.9 30.2 78.4 39.9 14.8 5.1 49.2-14.8 68.7 0 14.8 10.2 9.7 79.8-5.1 124.8"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M5664.6 8497.2l24.6-25.1c14.8-10.2-5.1-45 9.7-54.7 5.1-5.1 9.7-5.1 19.5-10.2 5.1-5.1 5.1-39.9 0-64.9M5542.2 8507c0-10.2-5.1-25.1-14.8-34.8-5.1-5.1-19.5-10.2-24.6-19.9-9.7-19.9-9.7-54.7-19.5-54.7-9.7-5.1-24.6-19.9-29.2-34.8m-44.6 329.3c5.1-14.8 9.7-34.8 19.5-39.9 9.7-5.1 29.2-5.1 34.3-14.8 5.1-10.2 0-34.8 0-50.1-5.1-10.2 5.1-39.9 24.6-45 19.5-10.2 39.4-10.2 58.9-5.1m-274.6 304.7c5.1-10.2-19.5-14.8-24.6-25.1-5.1-14.8-9.7-79.8-5.1-90 5.1-10.2 14.8-10.2 24.6-19.9 9.7-14.8-5.1-39.9 9.7-50.1 19.5-10.2 19.5-50.1 39.4-64.9 9.7-10.2 19.5-25 34.3-39.9 19.5-14.8 34.3 0 39.4-14.8 5.1-10.2-19.5-30.2-39.4-30.2-29.2 0-34.3-30.2-58.9-45m338.7 329.8c-24.6 5.1-49.2 25.1-73.8 39.9-14.8 10.2-44.1 19.9-53.8 19.9-14.8 0-19.5-14.8-39.4-19.9-19.5-5.1-49.2 5.1-49.2-5.1 0-14.8 34.3-30.2 49.2-34.8 53.8-54.7 44.1-75.2 68.7-95.1 29.2-14.8 24.6-70 39.4-90M6891.2 8559.4c24.1 46.9 20.4 110.4 4.2 144.7-36.2 64-72.8 127.6-116.9 178.6-32.5 29.7-121.1 106.2-137.3 110.4-32.5 8.4-165.6 13-201.8 0-44.5-17.2-113.2-157.3-133.1-217.1-12.1-55.2-20.4-119.2 4.2-178.6 12.1-51 44.5-115 72.8-148.9 44.5-59.4 88.6-89.5 153.6-127.6 32.5-17.2 88.6-25.5 129.4 0 71.3 59.9 208.6 213 224.9 238.5h0z"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M6778 8593.3c12.1 38.5-4.2 51-16.2 72.4-28.3 13-80.7 42.7-104.8 25.5-32.5 4.2-64.5-25.5-56.6-144.7 0-38.5-20.4-157.3 7.9-182.8 76.5 55.2 68.7 46.9 84.9 144.7 28.3 21.3 28.3 33.9 56.6 42.7 12 8.3 24 16.7 28.2 42.2h0zM6523.8 8508.4c-20.4-33.9-88.6-33.9-97-17.2-12.1 8.4-16.2 21.3-20.4 25.5-20.4 29.7-32.5 46.9-36.2 76.5 7.9 29.7 32.5 17.2 44.5 42.7 7.9 13 4.2 29.7 20.4 46.9 28.3 25.5 64.5 17.2 92.8 4.2 4.2-8.4 7.9-21.3 7.9-42.7 0-17.2-20.4-8.4-28.3-17.2-12.1-17.2-4.2-46.9 4.2-64 3.7-7.9 27.8-38 12.1-54.7h0z"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M6604.5 8627.6c4.2-89.5-12.1-259.3 7.9-264 12.1 0 52.4 42.7 64.5 59.4 16.2 17.2 7.9 64 20.4 84.9m-283 123.9c-4.2-8.4-12.1-17.2-20.4-21.3-7.9-4.2-20.4-8.4-24.1-17.2-4.2-8.4 12.1-38.5 16.2-51 4.2-8.4 32.5-51 40.4-55.2 7.9-4.2 44.5-4.2 68.7 0m.4 204c12.1 0 28.3 0 32.5-8.4s7.9-42.7 4.2-46.9c-4.2-8.4-16.2 0-24.1-8.4-4.2-13-4.2-46.9 0-68.2m152.5 131.9c20.4 0 48.2 0 60.8-4.2 7.9-4.2 40.4-17.2 52.4-38.5 7.9-13 4.2-38.5 4.2-51M7248.4 8312.1c-90 86.7-184.2 187.9-265.4 298.8-31.5 43.1-22.3 101.1-4.6 149.4 58.5 125.3 153.1 183.2 206.9 207.4 76.5 14.4 220.4 9.7 260.7-9.7 40.4-19.5 116.9-101.1 130.4-149.4 26.9-82.1 0-183.2-13.5-207.4-13.5-24.1-71.9-72.4-85.4-91.4-13.5-24.1-22.3-48.2-31.5-82.1-8.8-33.9-53.8-91.4-81.2-106.2-39.9-28.8-89-23.7-116.4-9.4z"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M7351.8 8398.9c13.5 14.4 22.3 33.9 36.2 48.2 4.6 14.4 4.6 24.1 4.6 38.5 18.1 14.4 31.5 24.1 49.6 38.5 0 19.5 4.6 33.9 4.6 52.9 22.3 14.4 40.4 28.8 40.4 67.3v28.8c-22.3 77-94.6 0-139.6-9.7-18.1 0-40.4 4.6-63.1 9.7-13.5 4.6-26.9 9.7-45 14.4-26.9 0-53.8 4.6-81.2 4.6-4.6 4.6-8.8 19.5-31.5 33.9-40.4 0-40.4-14.4-49.6-28.8-4.6-38.5-8.8-77 18.1-110.9 18.1-24.1 36.2-52.9 53.8-52.9 26.9 4.6 53.8 0 81.2-9.7-13.5-33.9-4.6-48.2 22.3-52.9 4.6-9.7 4.6-24.1 4.6-33.9 0-43.1 13.5-72.4 45-72.4 13.9.5 36.2 10.3 49.6 34.4h0z"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#010101"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M7486.8 8673.5c0-19.5 0-48.2-4.6-62.6s-31.5-19.5-36.2-33.9c-4.6-19.5 0-43.1-4.6-52.9-8.8-9.7-45-24.1-49.6-33.9-4.6-14.4 4.6-28.8 0-38.5-13.5-24.1-26.9-38.5-45-48.2M7073 8702.3c0-33.9-4.6-72.4 4.6-91.4 9.3-19 45-38.5 49.6-62.6 4.6-24.1 85.4-4.6 98.8-24.1 8.8-4.6-4.6-28.8 0-38.5s18.1-4.6 26.9-14.4c8.8-14.4-4.6-48.2 4.6-67.3 13.5-33.9 22.3-43.1 45-33.9m-144.1 322.4c31.5-9.7 90 4.6 112.3-14.4 18.1-14.4 67.3-19.5 94.6-14.4"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M8216.1 8737.5c-14.4 54.7-48.2 154.5-125.7 194.4-48.2 25.1-169.3 25.1-222.2 5.1-62.6-19.9-111.3-25-149.8-45-33.9-25-62.6-69.6-77.5-124.8-4.6-79.8-4.6-174.4 9.7-209.2 53.3-109.5 198.1-269.1 261.2-298.8 38.5-14.8 91.9-19.9 145.2 19.9 38.5 29.7 120.6 169.3 159.6 274.2 13.9 59.9 4.1 129.5-.5 184.2z"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M7979 8328.8c33.9 9.7 58 39.9 77.5 69.6 19.5 29.7 38.5 64.9 58 94.6 19.5 34.8 29.2 64.9 29.2 99.7-4.6 29.7-29.2 25.1-53.3 29.7h-62.6c-43.6 5.1-87.2 9.7-130.4 5.1-43.6-5.1-72.4-9.7-96.5 0H7767c-24.1 0-38.5-9.7-29.2-34.8 14.4-39.9 43.6-64.9 77.5-89.5l72.4-59.8c9.7-19.9 19.5-49.6 29.2-69.6 4.1-25 28.7-45 62.1-45h0z"
					></path>
					<path
						fill="#FAFAFA"
						stroke="#020202"
						strokeMiterlimit="10"
						strokeWidth="10"
						d="M8138.6 8597.9c4.6-34.8-9.7-79.8-24.1-99.7-9.7-19.9-48.2-84.9-72.4-124.8-14.4-25.1-38.5-39.9-58-39.9M7800.4 8623c-19.5 5.1-43.6 5.1-58-5.1-9.7-14.8 0-39.9 9.7-49.6 33.9-54.7 116-99.7 135.5-124.8 9.7-9.7 19.5-49.6 38.5-64.9m-29.2 244.4c62.6 9.7 125.7-5.1 193.4-9.7"
					></path>
					<path
						fill="none"
						stroke="#EFA8AD"
						strokeMiterlimit="10"
						strokeWidth="80"
						d="M4126.3 5259.7c91.9-88.1 161.9-101.1 208.8-97.4 108.6 8.8 129 112.3 278.3 139.2 76.5 13.9 109.9-6.5 167 27.8 59.4 35.7 62.6 81.2 111.3 97.4 58.5 19.5 116.9-25.1 167-55.7 142.9-88.1 304.8-122 403.6-125.3 104.8-3.2 265.4 24.6 403.6 111.3 62.2 39 96 74.7 153.1 69.6 87.2-7.9 92.8-100.2 194.8-139.2 103-39 231 3.7 306.2 55.7 64 44.5 67.7 80.7 125.3 97.4 61.7 17.6 101.1-11.1 194.8-41.8 99.7-32.5 257.9-83.5 389.7-27.8 84.4 35.7 76.1 80.7 153.1 97.4 61.7 13.5 104.8-7.9 264.4-69.6 163.8-63.6 172.6-91.9 222.7-83.5 50.1 8.4 51.5 33.9 208.8 139.2 86.7 58 111.3 67.3 139.2 69.6 37.1 3.2 68.7-5.6 167-55.7 180.9-91.4 179.5-114.1 222.7-111.3 82.6 5.1 85.8 86.3 222.7 139.2 33.9 13 86.7 32.9 153.1 27.8 88.6-7 105.8-50.6 222.7-97.4 92.3-37.1 171.6-68.7 250.5-41.8 83.5 28.8 82.6 95.1 180.9 125.3 17.2 5.1 82.6 23.2 153.1 0 97.9-32 89.5-105.8 180.9-153.1 95.1-49.6 222.7-31.5 306.2 13.9 88.1 47.8 85.4 103 153.1 111.3 0 0 38 4.6 208.8-83.5h0c162.4-93.2 282.1-97.4 361.8-83.5 93.2 16.2 241.7 76.1 361.8 139.2 77 40.4 115 67.7 167 55.7 91.4-21.8 167-153.1 167-153.1h0s114.1 11.6 194.8-13.9c113.2-36.2 115.5-132.2 194.8-153.1 52.9-13.9 135 7 264.4 153.1M4182 10158.9c64-26 160-52.9 264.4-27.8 109.9 26.4 124.8 85.8 222.7 97.4 84.4 10.2 103.4-30.2 306.2-97.4 141.5-46.9 212.5-70 278.3-55.7 103 22.7 112.7 87.2 222.7 97.4 68.2 6.5 84.4-16.7 180.9-13.9 77.9 2.3 105.3 18.1 167 27.8 216.2 34.3 416.6-75.2 431.4-83.5 99.7-56.1 119.7-104.8 180.9-97.4 71 8.8 73.8 77.5 167 125.3 85.4 43.6 206 49.2 292.3 0 80.3-45.5 89.1-114.1 139.2-111.3 51 2.8 51.5 74.7 125.3 125.3 84.4 58 220.4 57.5 306.2 0 76.5-51 77.9-123.9 125.3-125.3 56.6-1.9 61.7 100.7 153.1 167 113.2 81.6 314.5 77 417.5-13.9 48.2-42.7 61.2-91.9 111.3-97.4 46.4-5.1 71.4 33.4 125.3 69.6 108.1 72.8 277.9 99.7 389.7 41.8 82.1-42.7 85.4-106.7 153.1-111.3 57.5-4.2 71 40.8 167 83.5 43.6 19.5 168.4 74.7 264.4 27.8 77-37.6 69.6-109 139.2-125.3 47.8-11.1 64.5 19 167 55.7 86.7 30.6 191.1 68.2 278.3 27.8 48.7-22.3 39.9-45 111.3-83.5 37.6-20.4 92.3-49.6 153.1-41.8 66.8 8.8 68.7 53.8 139.2 83.5 45.9 19.5 69.6 10.7 278.3-13.9 164.2-19.5 184.6-18.1 208.8-13.9 96 17.2 108.1 56.1 180.9 55.7 84.9-.5 96-54.3 194.8-83.5 100.7-29.7 192.1-4.2 306.2 27.8 158.2 44.5 163.8 87.7 250.5 83.5 104.4-5.1 130.4-68.7 250.5-97.4 101.6-24.1 192.5-4.6 250.5 13.9"
					></path>




					<text fill='#333333' x='4300' y='3800' style={{ fontSize: 250 }}>55</text>
					{this.renderDiagnosisCode(55, 4300, 3800, true)}
					<text fill='#333333' x='5300' y='3900' style={{ fontSize: 250 }}>54</text>
					{this.renderDiagnosisCode(54, 5300, 3900, true)}
					<text fill='#333333' x='6200' y='3900' style={{ fontSize: 250 }}>53</text>
					{this.renderDiagnosisCode(53, 6200, 3900, true)}
					<text fill='#333333' x='6800' y='4200' style={{ fontSize: 250 }}>52</text>
					{this.renderDiagnosisCode(52, 6800, 4200, true)}
					<text fill='#333333' x='7700' y='4200' style={{ fontSize: 250 }}>51</text>
					{this.renderDiagnosisCode(51, 7700, 4200, true)}
					<text fill='#333333' x='8500' y='4200' style={{ fontSize: 250 }}>61</text>
					{this.renderDiagnosisCode(61, 8500, 4200, true)}
					<text fill='#333333' x='9400' y='4100' style={{ fontSize: 250 }}>62</text>
					{this.renderDiagnosisCode(62, 9400, 4100, true)}
					<text fill='#333333' x='10100' y='3900' style={{ fontSize: 250 }}>63</text>
					{this.renderDiagnosisCode(63, 10100, 3900, true)}
					<text fill='#333333' x='10900' y='3900' style={{ fontSize: 250 }}>64</text>
					{this.renderDiagnosisCode(64, 10900, 3900, true)}
					<text fill='#333333' x='11800' y='3900' style={{ fontSize: 250 }}>65</text>
					{this.renderDiagnosisCode(65, 11800, 3900, true)}

					<text fill='#333333' x='4300' y='11700' style={{ fontSize: 250 }}>85</text>
					{this.renderDiagnosisCode(85, 4300, 11700, false)}
					<text fill='#333333' x='5800' y='11700' style={{ fontSize: 250 }}>84</text>
					{this.renderDiagnosisCode(84, 5800, 11700, false)}
					<text fill='#333333' x='6600' y='11700' style={{ fontSize: 250 }}>83</text>
					{this.renderDiagnosisCode(83, 6600, 11700, false)}
					<text fill='#333333' x='7200' y='11700' style={{ fontSize: 250 }}>82</text>
					{this.renderDiagnosisCode(82, 7200, 11700, false)}
					<text fill='#333333' x='7800' y='11700' style={{ fontSize: 250 }}>81</text>
					{this.renderDiagnosisCode(81, 7800, 11700, false)}
					<text fill='#333333' x='8500' y='11700' style={{ fontSize: 250 }}>71</text>
					{this.renderDiagnosisCode(71, 8500, 11700, false)}
					<text fill='#333333' x='9100' y='11700' style={{ fontSize: 250 }}>72</text>
					{this.renderDiagnosisCode(72, 9100, 11700, false)}
					<text fill='#333333' x='9700' y='11700' style={{ fontSize: 250 }}>73</text>
					{this.renderDiagnosisCode(73, 9700, 11700, false)}
					<text fill='#333333' x='10500' y='11700' style={{ fontSize: 250 }}>74</text>
					{this.renderDiagnosisCode(74, 10500, 11700, false)}
					<text fill='#333333' x='11900' y='11700' style={{ fontSize: 250 }}>75</text>
					{this.renderDiagnosisCode(75, 11900, 11700, false)}

				</svg> */}
        {/* <svg x="0px" y="0px" viewBox="0 0 16383 15308.7" enable-background="new 0 0 16383 15308.7"> */}

        {/* <text fill='#333333' x='4250' y='3900' style={{fontSize: 250}}>A</text>
			<text fill='#333333' x='5300' y='3900' style={{fontSize: 250}}>B</text>
			<text fill='#333333' x='6200' y='3900' style={{fontSize: 250}}>C</text>
			<text fill='#333333' x='6800' y='4200' style={{fontSize: 250}}>D</text>
			<text fill='#333333' x='7700' y='4200' style={{fontSize: 250}}>E</text>
			<text fill='#333333' x='8400' y='4200' style={{fontSize: 250}}>F</text>
			<text fill='#333333' x='9400' y='3900' style={{fontSize: 250}}>G</text>
			<text fill='#333333' x='10100' y='3900' style={{fontSize: 250}}>H</text>
			<text fill='#333333' x='10900' y='3900' style={{fontSize: 250}}>I</text>
			<text fill='#333333' x='11800' y='3900' style={{fontSize: 250}}>J</text>

			<text fill='#333333' x='4300' y='11700' style={{fontSize: 250}}>T</text>
			<text fill='#333333' x='5800' y='11700' style={{fontSize: 250}}>S</text>
			<text fill='#333333' x='6600' y='11700' style={{fontSize: 250}}>R</text>
			<text fill='#333333' x='7200' y='11700' style={{fontSize: 250}}>Q</text>
			<text fill='#333333' x='7800' y='11700' style={{fontSize: 250}}>P</text>
			<text fill='#333333' x='8500' y='11700' style={{fontSize: 250}}>O</text>
			<text fill='#333333' x='9100' y='11700' style={{fontSize: 250}}>N</text>
			<text fill='#333333' x='9700' y='11700' style={{fontSize: 250}}>M</text>
			<text fill='#333333' x='10500' y='11700' style={{fontSize: 250}}>L</text>
			<text fill='#333333' x='11900' y='11700' style={{fontSize: 250}}>K</text> */}

        {/* <path fill="#F2ECBE" stroke="#010101" strokeWidth="2" strokeMiterlimit="22.926" d="M4460.4,5365.5l-328.4-19.9  c-66.8-347.5-138.7-908.8,117.8-1157.4c5.1,0,133.6-154,97.4,74.7c0,25.1-30.6,302.9-30.6,392.5c5.1,228.7,25.5,392.5,97.4,407.3  c46.4,9.7,92.3-148.9,82.1-288.1c-20.4-581.3-117.8-690.3-92.3-754.8c97.4-49.6,225.9,198.5,251.4,268.1  c92.3,243.5,122.9,486.6,143.8,814.6c10.2,109-10.2,198.5-35.7,273.2c-25.5-9.7-77,59.8-102.5,49.6L4460.4,5365.5z"></path>
	<g onClick={() => this.props.onClick(55)}>
		<path fill={conditionToColor(this.props.teeth[55].condition)} stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M4746.1,5314.9c-5.1-15.8-15.3-47.3-85.8-26.4  c-120.6,36.6-171.2-121.1-342.4-131.7c-302,84-357.2,389.2-377.6,520.5c-30.2,205,80.7,278.8,166.1,294.6  c171.2,10.7,276.9-58,312.2-131.7c25.1,47.3,90.5,179.1,226.4,179.1c130.8-26.4,312.2-162.8,286.7-252.4  C4922.4,5567.3,4791.6,5441.1,4746.1,5314.9z" style={{cursor: 'pointer'}}></path>
	</g>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M4494.7,5583c-70.5,73.8-100.7,173.5-75.6,257.9   M4278,5477.7c85.8,36.6,125.7,126.2,135.9,252.4"></path>
	<path fill="#F2ECBE" stroke="#010101" strokeWidth="2" strokeMiterlimit="22.926" d="M5495.8,5283.8l-399.9,118.8l-5.6-228.2  c-45.5-152.2-108.6-266.3-131.3-451.4c-79.8-261.2,74.2-774.7,199.9-574.8c5.6,4.6,0,19,0,28.3c0,80.7,11.6,142.4,0,218.5  c-11.6,80.7,5.6,123.4,57.1,228.2c17.2,33.4,28.8,66.3,45.5,123.4c91.4,166.1,177.2,256.5,257,199.5l28.8-204.1  c17.2-95.1,17.2-80.7,68.7-166.1c39.9-61.7,62.6-128.5,68.7-199.5l-34.3-218.5c11.6-52.4,22.7-99.7,79.8-109.5  c91.4,23.7,148.4,99.7,171.2,147.5c45.5,152.2,68.7,261.2,57.1,418c-11.6,99.7-34.3,190.2-68.7,275.6  c-51.5,128.5-51.5,114.1-45.5,256.5v223.1l-120.1,9.7L5495.8,5283.8z"></path>
	
	<g onClick={() => this.props.onClick(54)}>
	<path fill={conditionToColor(this.props.teeth[54].condition)} stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M5851.1,5378.4c-19.9-43.6-120.1-34.8-140.1-43.6  c-39.9-13-70-26.4-135-65.4c-34.8-21.8-75.2-21.8-115-21.8c-30.2,0-54.7,26.4-84.9,34.8l-210.1,65.4c-34.8,17.6-64.9,34.8-84.9,74.2  l-39.9,96l-14.8,34.8c-25.1,34.8-39.9,91.9-45,135.5c-10.2,43.6-10.2,65.4,5.1,109.5c14.8,48.2,34.8,87.2,54.7,126.6  c25.1,48.2,79.8,74.2,109.9,78.9c59.8,4.2,99.7-4.2,164.7-26.4l84.9-30.6c45,48.2,54.7,61.2,79.8,78.9c95.1,70,160,21.8,214.8-48.2  H5840c19.9-4.2,50.1-26.4,79.8-61.2c59.8-61.2,59.8-70,64.9-148.4c0-70-10.2-70-50.1-131.3c-45-70-50.1-65.4-59.8-148.4l-5.1-61.2  L5851.1,5378.4L5851.1,5378.4z" style={{cursor: 'pointer'}}></path>
	<path fill={conditionToColor(this.props.teeth[54].condition)} stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M5570.9,5649.4c-54.7,48.2-160,179.1-45,257.9  c14.8,13,34.8,17.6,45,21.8l124.8,48.2"></path>
	<path fill={conditionToColor(this.props.teeth[54].condition)} stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M5346.4,5544.5c64.9,39.4,90,100.7,120.2,153.1  c39.9,70-10.2,187.9-64.9,244.9"></path>
	</g>

	<path fill="#F2ECBE" stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M6503.4,5388.2l-142.9,47.3l-149.8-43.6  c-52.4-123.9-52.4-189.3-48.7-342.4c0-113.2,87.2-357.2,73.3-459.3c7-193-20.9-328-13.9-506.6c0-123.9,104.8-105.8,149.8-7.4  C6520.5,4408,6513.6,5034.7,6503.4,5388.2L6503.4,5388.2z"></path>
	
	<g onClick={() => this.props.onClick(53)}>
	<path id="fdXMLID_41_" fill={conditionToColor(this.props.teeth[53].condition)} stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M6505.2,5349.7  c18.6,89.1,14.8,129.9,48.2,200.9c174.9,241.7,129.9,341.9-103.9,482.9c-33.4,18.6-55.7,44.5-111.3,37.1  c-59.4-18.6-96.5-74.2-96.5-74.2c-7.4-3.7-7.4,26-29.7,26c-137.3-33.4-219.4-200.9-171.2-371.6c52-96.5,133.6-289.9,141-304.8  c14.8-40.8,89.1-74.2,152.6-74.2c55.7-3.7,96.5,11.1,137.3,33.4C6486.7,5312.6,6497.8,5331.1,6505.2,5349.7L6505.2,5349.7z" style={{cursor: 'pointer'}}></path>
	<path fill={conditionToColor(this.props.teeth[53].condition)} stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M6251.9,5898.5c38.5-108.1,9.7-197.6-96-284.8"></path>
	</g>
	<path fill="#F2ECBE" stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M6991.4,5574.7l217.6-84.9  c19.5-3.7,29.2-38.5,33.9-58c43.6-119.7-130.8-444-149.8-687c-9.7-92.8-24.1-196.7-67.7-274.2c-87.2-212.5-207.8-169.8-217.6-54.3  c0,26.9,9.7,61.7,9.7,84.9c33.9,374.4-72.4,779.8-14.4,899.5c14.4,31.1,24.1,65.4,38.5,84.9L6991.4,5574.7z"></path>
	
	<g onClick={() => this.props.onClick(52)}>
	<path id="euXMLID_30_" fill={conditionToColor(this.props.teeth[52].condition)} stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M7464.6,5952.3  c10.2,97.4-71,97.4-157.3,93.2c-45.5,24.1-81.2,32.5-162.4,36.6c-50.6-4.2-157.3-4.2-182.3-44.5c-30.6,28.3-106.7,12.1-126.6-4.2  c-172.6-89.1-136.9-360.9-35.7-551.6c10.2-12.1,45.5-89.1,65.9-93.2c121.5-36.6,207.8-40.4,344.7,0c15.3,4.2,35.7,28.3,40.4,48.7  C7322.6,5648,7378.3,5717.1,7464.6,5952.3z" style={{cursor: 'pointer'}}></path>
	</g>

	<path fill="#F2ECBE" stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M7820.8,5564.9L7639,5454.1  c-24.1-73.8-44.5-648.5,97-993.7c149.8-328.4,242.6-94.2,258.9,4.2c16.2,172.6,16.2,336.8,64.5,517.2  c40.4,143.8,60.8,377.6,20.4,574.8L7820.8,5564.9z"></path>
	<g onClick={() => this.props.onClick(51)}>
	<path fill={conditionToColor(this.props.teeth[51].condition)} stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M8087.1,5477.3c3.7,7,0,13.5,0,17.2  c39,187,114.1,323.3,114.1,401.3c0,64.5,3.7,231.5-167.5,190.7c-14.4-10.2-21.3-13.5-32-7c-14.4,20.4-114.1,47.8-245.4-17.2  c-17.6-20.4-35.7-10.2-46.4-10.2c-146.1-58-217.1-98.8-170.7-278.8c71-296,124.8-466.2,327.5-438.8  c92.8,13.5,149.4,68.2,202.7,122.5C8073.2,5460.1,8083.9,5470.3,8087.1,5477.3L8087.1,5477.3z" style={{cursor: 'pointer'}}></path>
	<path fill={conditionToColor(this.props.teeth[51].condition)} stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M8025.4,6097.5c-5.6-63.1-5.6-105.8,2.8-156.3   M7801.4,6059.4c-2.8-25.5-2.8-101.1,0-126.6"></path>
	</g>


	<path fill="#F2ECBE" stroke="#010101" strokeWidth="2" strokeMiterlimit="22.926" d="M11998.2,5422.5l328.4-19.9  c66.8-347.5,138.7-908.8-117.8-1157.4c-5.1,0-133.6-154-97.4,74.7c0,25.1,30.6,302.9,30.6,392.5c-5.1,228.7-25.5,392.5-97.4,407.3  c-46.4,9.7-92.3-148.9-82.1-288.1c20.4-581.3,117.8-690.3,92.3-754.8c-97.4-49.6-225.9,198.5-251.4,268.1  c-92.3,243.5-122.9,486.6-143.8,814.6c-10.2,109,10.2,198.5,35.7,273.2c25.5-9.7,77,59.8,102.5,49.6L11998.2,5422.5z"></path>
	
	<g onClick={() => this.props.onClick(65)}>
	<path fill={conditionToColor(this.props.teeth[65].condition)} stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M11712,5372c5.1-15.8,15.3-47.3,85.8-26.4  c120.6,36.6,171.2-121.1,342.4-131.7c302,84,357.2,389.2,377.6,520.5c30.2,205-80.7,278.8-166.1,294.6  c-171.2,10.7-276.9-58-312.2-131.7c-25.1,47.3-90.5,179.1-226.4,179.1c-130.8-26.4-312.2-162.8-286.7-252.4  C11536.2,5624.3,11666.6,5498.1,11712,5372z" style={{cursor: 'pointer'}}></path>
	<path fill={conditionToColor(this.props.teeth[65].condition)} stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M12039.1,5897.5c25.1-84-5.1-184.2-75.6-257.9   M12044.2,5787.1c10.2-126.2,50.1-215.7,135.9-252.4"></path>
	</g>

	<path fill="#F2ECBE" stroke="#010101" strokeWidth="2" strokeMiterlimit="22.926" d="M10962.4,5340.9l399.9,118.8l5.6-228.2  c45.5-152.2,108.6-266.3,131.3-451.4c79.8-261.2-74.2-774.7-199.9-574.8c-5.6,4.6,0,19,0,28.3c0,80.7-11.6,142.4,0,218.5  c11.6,80.7-5.6,123.4-57.1,228.2c-17.2,33.4-28.8,66.3-45.5,123.4c-91.4,166.1-177.2,256.5-257,199.5l-28.8-204.1  c-17.2-95.1-17.2-80.7-68.7-166.1c-39.9-61.7-62.6-128.5-68.7-199.5l34.3-218.5c-11.6-52.4-22.7-99.7-79.8-109.5  c-91.4,23.7-148.4,99.7-171.2,147.5c-45.5,152.2-68.7,261.2-57.1,418c11.6,99.7,34.3,190.2,68.7,275.6  c51.5,128.5,51.5,114.1,45.5,256.5v223.1l120.1,9.7L10962.4,5340.9z"></path>
	
	<g onClick={() => this.props.onClick(64)}>
	<path fill={conditionToColor(this.props.teeth[64].condition)} stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M10607.5,5435.5c19.9-43.6,120.2-34.8,140.1-43.6  c39.9-13,70-26.4,135-65.4c34.8-21.8,75.2-21.8,115-21.8c30.2,0,54.7,26.4,84.9,34.8l210.1,65.4c34.8,17.6,64.9,34.8,84.9,74.2  l39.9,96l14.8,34.8c25,34.8,39.9,91.9,45,135.5c10.2,43.6,10.2,65.4-5.1,109.5c-14.8,48.2-34.8,87.2-54.7,126.6  c-25,48.2-79.8,74.2-109.9,78.9c-59.8,4.2-99.7-4.2-164.7-26.4l-84.9-30.6c-45,48.2-54.7,61.2-79.8,78.9  c-95.1,70-160,21.8-214.8-48.2h-144.7c-19.9-4.2-50.1-26.4-79.8-61.2c-59.8-61.2-59.8-70-64.9-148.4c0-70,10.2-70,50.1-131.3  c45-70,50.1-65.4,59.8-148.4l5.1-61.2L10607.5,5435.5L10607.5,5435.5z" style={{cursor: 'pointer'}}></path>
	<path fill={conditionToColor(this.props.teeth[64].condition)} stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M10887.2,5706.4c54.7,48.2,160,179.1,45,257.9  c-14.8,13-34.8,17.6-45,21.8l-124.8,48.2"></path>
	<path fill={conditionToColor(this.props.teeth[64].condition)} stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M11112.2,5601.6c-64.9,39.4-90,100.7-120.1,153.1  c-39.9,70,10.2,187.9,64.9,244.9"></path>
	</g>

	<path fill="#F2ECBE" stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M9954.8,5446.2l142.9,45.9l149.8-42.2  c52.4-120.1,52.4-183.2,48.7-331.7c0-109.5-87.2-345.6-73.3-444.4c-7-187,20.9-317.3,13.9-490.3c0-120.2-104.8-102.5-149.8-7  C9937.6,4497.5,9944.6,5104.3,9954.8,5446.2L9954.8,5446.2z"></path>
	<g onClick={() => this.props.onClick(63)}>
	<path id="fdXMLID_1_" fill={conditionToColor(this.props.teeth[63].condition)} stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M9952.9,5409.1  c-18.6,86.3-14.8,125.7-48.2,194.4c-174.9,233.8-129.9,330.8,103.9,467.6c33.4,18.1,55.7,43.1,111.3,36.2  c59.4-18.1,96.5-71.9,96.5-71.9c7.4-3.7,7.4,25.1,29.7,25.1c137.3-32.5,219.4-194.4,171.2-360c-52-93.7-133.6-280.7-141-295  c-14.8-39.4-89.1-71.9-152.6-71.9c-55.7-3.7-96.5,10.7-137.3,32.5C9971.5,5372.9,9960.3,5391,9952.9,5409.1L9952.9,5409.1z" style={{cursor: 'pointer'}}></path>
	<path fill={conditionToColor(this.props.teeth[63].condition)} stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M10206.2,5974.6c-38.5-90-9.7-164.7,96-237.1"></path>
	</g>

	<path fill="#F2ECBE" stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M9466.7,5610.9l-217.6-84.9  c-19.5-3.7-29.2-38.5-33.9-58c-43.6-119.7,130.8-444,149.8-687c9.7-92.8,24.1-196.7,67.7-274.2c87.2-212.5,207.8-169.8,217.6-54.3  c0,26.9-9.7,61.7-9.7,84.9c-33.9,374.4,72.4,779.8,14.4,899.5c-14.4,31.1-24.1,65.4-38.5,84.9L9466.7,5610.9z"></path>
	
	<g onClick={() => this.props.onClick(62)}>
	<path id="euXMLID_1_" fill={conditionToColor(this.props.teeth[62].condition)} stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M8993.6,5988.5  c-10.2,97.4,71,97.4,157.3,93.2c45.5,24.1,81.2,32.5,162.4,36.6c50.6-4.2,157.3-4.2,182.3-44.5c30.6,28.3,106.7,12.1,126.6-4.2  c172.6-89.1,136.9-360.9,35.7-551.6c-10.2-12.1-45.5-89.1-65.9-93.2c-121.5-36.6-207.8-40.4-344.7,0c-15.3,4.2-35.7,28.3-40.4,48.7  C9135.5,5684.2,9079.9,5753.3,8993.6,5988.5z" style={{cursor: 'pointer'}}></path>
	</g>

	<path fill="#F2ECBE" stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M8637.3,5601.1l181.8-110.9  c24.1-73.8,44.5-648.5-97-993.7c-149.8-328.4-242.6-94.2-258.9,4.2c-16.2,172.6-16.2,336.8-64.5,517.2  c-40.4,143.8-60.8,377.6-20.4,574.8L8637.3,5601.1z"></path>
	
	<g onClick={() => this.props.onClick(61)}>
	<path fill={conditionToColor(this.props.teeth[61].condition)} stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M8370.6,5513.4c-3.7,7,0,13.5,0,17.2  c-39,187-114.1,323.3-114.1,401.3c0,64.5-3.7,231.5,167.5,190.7c14.4-10.2,21.3-13.5,32-7c14.4,20.4,114.1,47.8,245.4-17.2  c17.6-20.4,35.7-10.2,46.4-10.2c146.1-58,217.1-98.8,170.7-278.8c-71-296-124.8-466.2-327.5-438.8  c-92.8,13.5-149.4,68.2-202.7,122.5C8384.9,5496.7,8374.3,5506.9,8370.6,5513.4L8370.6,5513.4z" style={{cursor: 'pointer'}}></path>
	<path fill={conditionToColor(this.props.teeth[61].condition)} stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M8429.9,5968.1c8.4,50.6,8.4,92.8,2.8,156.3   M8656.3,5959.7c2.8,25.5,2.8,101.1,0,126.6"></path>
	</g>

	<path fill="#F2ECBE" stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M4975.3,10104.2c31.1,62.6,36.6,354.4,20.9,439.8  c-5.1,157.3-281.1,852.2-463.4,780.7c-46.9-18.1,67.7-318.7,83.5-372.5c72.8-273.7-5.1-439.8-26-462  c-57.1,8.8-57.1,188.3-72.8,233.3c-5.1,31.5-93.7,152.6-98.8,246.8c-10.2,49.2-46.9,282.5-135.5,278.3  c-57.1-8.8-88.6-129.9-114.6-497.8c-15.8-215.2,0-430.5,41.8-641.6l135.5-67.3L4975.3,10104.2z"></path>
	
	<g onClick={() => this.props.onClick(85)}>
	<path fill={conditionToColor(this.props.teeth[85].condition)} stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M4921.9,9458c32-9.3,68.7-13.9,100.7,0  c52.9,42.2,238,196.2,180,317.8c-15.8,28.3-127.1,294.6-201.3,331.7c-116.4,74.7-270,98.3-317.3,98.3c-90-4.6-169.3-74.7-275.1-84  c-79.3,0-174.9,18.6-201.3-9.3c-52.9-84-127.1-285.3-84.9-430c37.1-98.3,201.3-341,391.5-261.6c68.7,37.6,127.1,121.5,201.3,177.7  C4757.7,9546.6,4842.6,9495.6,4921.9,9458z" style={{cursor: 'pointer'}}></path>
	<path fill={conditionToColor(this.props.teeth[85].condition)} stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M4715.5,9582.8c-42.2,46.9-74.2,126.2-68.7,196.2   M4752.6,9821.2c-95.1-84-232.9-23.2-259.3-9.3"></path>
	</g>

	<path fill="#F2ECBE" stroke="#010101" strokeWidth="2" strokeMiterlimit="22.926" d="M6220.8,10054.5  c29.7,63.6,69.6,122.5,84.4,186.5c39.9,152.2,54.7,490.3,34.8,657.3c-29.7,299.2-174,568.7-253.3,353  c-19.9-58.9-25.1-270-25.1-299.2c0-73.8-14.8-166.5-49.6-259.8c-54.7-142.4-99.3-269.5-179.1-230.6c-25.1,9.7-25.1,206-44.5,441.6  c-5.1,68.7-25.1,225.5-44.5,279.7c-14.8,49.2-59.8,166.5-119.2,137.3c-54.7-14.8-79.3-137.3-104.4-534.9  c0-78.4-19.9-161.9-29.7-245.4c-5.1-63.6-29.7-245.4-5.1-377.6l148.9-127.6L6220.8,10054.5z"></path>
	<g onClick={() => this.props.onClick(84)}>
	<path fill={conditionToColor(this.props.teeth[84].condition)}  stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M6097.9,9455.7c-98.8,4.6-244.5,97-276,119.2  c-10.2,8.8-98.8-110.4-244.9-92.8c-83.5,17.6-114.6,101.6-124.8,128c-67.7-31.1-150.8-17.6-187.4,52.9  c-20.9,52.9-20.9,180.9,20.9,251.4c20.9,44.1,130.4,176.3,197.6,238c15.8,17.6,124.8-4.6,187.4,0c197.6,8.8,468.5,48.7,593.3-79.3  c15.8-17.6,31.1-57.5,36.6-84c26-141,41.8-251.4,10.2-405.9C6296,9526.2,6223.2,9438,6097.9,9455.7z" style={{cursor: 'pointer'}}></path>
	<path fill={conditionToColor(this.props.teeth[84].condition)}  stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M5796.4,9830.5c-15.8-84-31.1-220.8,36.6-260.2   M5468.4,9795.2c-26-61.7-31.1-154.5-15.8-185.1"></path>
	</g>
	<path fill="#F2ECBE" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M6727,10018.4l-119.7,71.4  c-77,151.7-34.8,686.6-23.2,888.8c15.3,320.1,150.3,341,173.5,345.1c165.6,25.1,215.7-1132.8,127.1-1255.3L6727,10018.4z"></path>
	
	<g onClick={() => this.props.onClick(83)}>
	<path fill={conditionToColor(this.props.teeth[83].condition)}  stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M7013.2,9532.2c85.8,72.4-85.8,362.8-89.5,449.5  c-3.7,45-3.7,86.3-22.3,128c-78.4,58.9-242.2,41.3-294.1,7c-48.2-52-29.7-183.2-48.2-217.6c-63.1-117.4-163.8-186.5-74.2-317.8  c71-90,201.3-204.1,271.8-204.1C6823.5,9376.3,6987.2,9494.2,7013.2,9532.2L7013.2,9532.2z" style={{cursor: 'pointer'}}></path>
	</g>

	<path fill="#F2ECBE" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M7305.9,10007.7l-103,141  c-87.7,432.8,15.3,766.8,38,964.4c84,442.1,114.1,254.2,175.4-32.9c76.1-329.4,72.4-729.2,45.9-988.1L7305.9,10007.7z"></path>
	
	<g onClick={() => this.props.onClick(82)}>
	<path fill={conditionToColor(this.props.teeth[82].condition)}  stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M7454.8,10112.5c-26.4,57.5-225,68.2-251.4,50.6  c-3.7-3.7-7.4-10.7-11.1-14.4c-63.6-136.8-221.3-594.3-22.7-698.6c67.7-3.7,157.7-14.4,217.6-32.5c37.6-7,75.2-32.5,97.4-18.1  c45,14.4,90,100.7,90,154.9C7552.7,9748.8,7470.1,10119.5,7454.8,10112.5z" style={{cursor: 'pointer'}}></path>
	</g>

	<path fill="#F2ECBE" stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M8180.4,10115.3  c-64.9-13.5-130.4-22.3-195.3-31.1c-77,31.1-160,58-237.1,84.9c0,116,0,214.3,12.1,326.1c6,66.8,17.6,80.3,23.7,129.4  c83,214.3,83,379.5,77,602.6c-12.1,147.5,171.6,196.7,219.4-31.1C8174.8,10775.9,8228.1,10298.1,8180.4,10115.3L8180.4,10115.3z"></path>
	
	<g onClick={() => this.props.onClick(81)}>
	<path fill={conditionToColor(this.props.teeth[81].condition)}  stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M8257.8,9519.7c-5.6,231-22.3,420.3-93.7,605.9  c-49.6,49.6-248.2,156.8-403.1,53.8c-93.7-197.6-138.2-441.2-143.3-668c0-24.6,22.3-45.5,66.3-70c132.7-45.5,364.2-57.5,508-4.2  C8224.9,9445.4,8252.3,9490.9,8257.8,9519.7L8257.8,9519.7z" style={{cursor: 'pointer'}}></path>
	</g>

	<path fill="#F2ECBE" stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M12161.5,9972.4l135.5,67.3  c41.8,210.6,57.1,426.3,41.8,641.6c-26,367.9-57.1,488.9-114.6,497.8c-88.6,4.6-124.8-228.7-135.5-278.3  c-5.1-94.2-93.7-215.2-98.8-246.8c-15.8-45-15.8-224.5-72.8-233.3c-20.9,22.3-98.8,188.3-26,462c15.8,53.8,130.4,354.4,83.5,372.5  c-182.3,71.9-458.3-623.5-463.4-780.7c-15.8-85.4-10.2-376.7,20.9-439.8L12161.5,9972.4z"></path>
	<g onClick={() => this.props.onClick(75)}>
	<path fill={conditionToColor(this.props.teeth[75].condition)} stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M11791.8,9529.4  c74.2-56.1,132.2-140.1,201.3-177.7c190.7-79.3,354.4,163.8,391.5,261.6c42.2,144.7-32,346.1-84.9,430  c-26.4,27.8-121.5,9.3-201.3,9.3c-105.8,9.3-185.1,79.3-275.1,84c-47.8,0-201.3-23.2-317.3-98.3c-74.2-37.6-185.1-303.9-201.3-331.7  c-58.5-121.5,127.1-275.6,180-317.8c32-13.9,68.7-9.3,100.7,0C11664.7,9426.4,11749.6,9477.9,11791.8,9529.4z" style={{cursor: 'pointer'}}></path>
	<path fill={conditionToColor(this.props.teeth[75].condition)} stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M11860.9,9710.3c5.1-70-26.4-149.4-68.7-196.2   M12014,9742.8c-26.4-13.9-164.2-74.7-259.3,9.3"></path>
	</g>
	<path fill="#F2ECBE" stroke="#010101" strokeWidth="2" strokeMiterlimit="22.926" d="M10877.9,9965.9l148.9,127.6  c25,132.7,0,314.1-5.1,377.6c-9.7,83.5-29.7,166.5-29.7,245.4c-25,397.1-49.6,520-104.4,534.9c-59.8,29.2-104.4-88.1-119.2-137.3  c-19.9-53.8-39.9-211.1-44.5-279.7c-19.9-235.7-19.9-431.4-44.5-441.6c-79.3-39.4-124.3,88.1-179.1,230.6  c-34.8,93.2-49.6,186.5-49.6,259.8c0,29.2-5.1,240.3-25.1,299.2c-79.3,215.7-223.6-53.8-253.3-353c-19.9-166.5-5.1-505.2,34.8-657.3  c14.8-63.6,54.7-122.5,84.4-186.5L10877.9,9965.9z"></path>
	
	<g onClick={() => this.props.onClick(74)}>
	<path fill={conditionToColor(this.props.teeth[74].condition)} stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M10200.2,9514.6  c-31.1,154.5-15.8,264.9,10.2,405.9c5.1,26.4,20.9,66.3,36.6,84c124.8,128,395.7,88.1,593.3,79.3c62.6-4.6,171.6,17.6,187.4,0  c67.7-61.7,177.2-193.9,197.6-238c41.8-70.5,41.8-198.5,20.9-251.4c-36.6-70.5-119.7-84-187.4-52.9c-10.7-26.4-41.8-110.4-124.8-128  c-145.7-17.6-234.3,101.6-244.9,92.8c-31.1-22.3-177.2-114.6-276-119.2C10288.8,9368.9,10215.9,9457.5,10200.2,9514.6z" style={{cursor: 'pointer'}}></path>
	<path fill={conditionToColor(this.props.teeth[74].condition)} stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M10679.4,9501.6c67.7,39.9,52,176.3,36.6,260.2   M11059.3,9541c15.8,31.1,10.2,123.4-15.8,185.1"></path>
	</g>

	<path fill="#F2ECBE" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M9675.5,10068.9  c-88.6,122-38.5,1280.4,127.1,1255.3c23.2-4.2,158.2-25,173.5-345.1c11.6-202.3,53.8-737.1-23.2-888.8l-119.7-71.4L9675.5,10068.9z"></path>
	
	<g onClick={() => this.props.onClick(73)}>
	<path fill={conditionToColor(this.props.teeth[73].condition)} stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M9547.5,9532.2c26-38,189.7-155.4,257-155.4  c71,0,201.3,114.1,271.8,204.1c89.5,131.3-11.1,200.4-74.2,317.8c-18.6,34.8,0,166.1-48.2,217.6c-52,34.8-216.2,52-294.1-7  c-18.6-41.3-18.6-83-22.3-128C9632.8,9895,9461.6,9604.6,9547.5,9532.2L9547.5,9532.2z" style={{cursor: 'pointer'}}></path>
	</g>

	<path fill="#F2ECBE" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M9098.4,10092.1  c-26.4,258.9-30.6,658.7,45.9,988.1c60.8,287.2,91.4,475,175.4,32.9c22.7-197.6,125.7-531.6,38-964.4l-103-141L9098.4,10092.1z"></path>
	
	<g onClick={() => this.props.onClick(72)}>
	<path fill={conditionToColor(this.props.teeth[72].condition)} stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M8985.7,9554c0-53.8,45-140.6,90-154.9  c22.7-14.4,59.8,10.7,97.4,18.1c59.8,18.1,150.3,28.8,217.6,32.5c199,104.4,41.3,561.8-22.7,698.6c-3.7,3.7-7.4,10.7-11.1,14.4  c-26.4,18.1-225,7.4-251.4-50.6C9090.5,10119.5,9008,9748.8,8985.7,9554z" style={{cursor: 'pointer'}}></path>
	</g>

	<path fill="#F2ECBE" stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M8379.8,10115.3  c-47.3,183.2,6,660.6,100.7,1080.4c47.3,227.8,231,178.6,219.4,31.1c-6-223.1-6-388.3,77-602.6c6-49.2,17.6-62.6,23.7-129.4  c12.1-111.8,12.1-209.7,12.1-326.1c-77-26.9-160-53.8-237.1-84.9C8510.2,10092.6,8445.2,10101.9,8379.8,10115.3L8379.8,10115.3z"></path>
	<g onClick={() => this.props.onClick(71)}>
	<path fill={conditionToColor(this.props.teeth[71].condition)} stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M8302.8,9519.7c5.6-28.8,32.9-74.2,66.3-82.6  c143.3-53.8,375.3-41.3,508,4.2c44.1,24.6,66.3,45.5,66.3,70c-5.6,226.8-49.6,469.9-143.3,668c-154.5,103-353-4.2-403.1-53.8  C8324.6,9940.4,8307.9,9750.7,8302.8,9519.7L8302.8,9519.7z" style={{cursor: 'pointer'}}></path>
	</g>
	
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M11692.1,6787.8c-4.2-12.5-48.2-21.3-61.2-67.7  c-4.2-33.9-8.8-67.7,0-109.9c21.8-105.8,57.1-194.4,262.6-329.4c34.8-21.3,118.3-12.5,166.1,12.5  c253.8,130.8,262.6,130.8,415.7,367.4c21.8,46.4,26.4,295.5,4.2,341.9c-39.4,118.3-109.5,219.4-236.1,236.6  c-13,0-21.8,21.3-34.8,25.5c-26.4,12.5-78.9,21.3-96,8.4c-13-12.5-48.2-25.5-61.2-25.5c-13,4.2-26.4,12.5-39.4,12.5  c-43.6,16.7-113.7,8.4-144.3-12.5c-39.4-25.5-131.3-80.3-205.5-215.2c-13-33.9-17.6-92.8-13-139.2  C11652.6,6859.7,11670.3,6825.8,11692.1,6787.8L11692.1,6787.8z" style={{cursor: 'pointer'}}></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M12164.3,6809.1c8.8-12.5,0-25.5-4.2-38  c-4.2-4.2,39.4-38,57.1-33.9c26.4,0,4.2,118.3,26.4,130.8c17.6,12.5,30.6,25.5,30.6,42.2c-4.2,25.5-87.7,236.6-231.9,295.5"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M11687.9,6783.6c17.6,12.5,83-8.4,91.9,12.5  c13,16.7,43.6,105.8,65.4,109.9c26.4-4.2,74.2-88.6,91.9-92.8c26.4-4.2,30.6-16.7,48.2-21.3c43.6-8.4,91.9-8.4,104.8-4.2  c17.6,12.5,21.8,33.9,17.6,54.7c4.2,16.7,39.4,0,57.1,12.5c21.8,21.3,43.6,54.7,61.2,63.6c17.6,8.4,65.4-8.4,91.9,16.7  c30.6,12.5,87.7-67.7,104.8-67.7c17.6-4.2,48.2,0,65.4-4.2 M11630.8,6720.5c0-58.9,43.6-118.3,57.1-114.1c8.8,4.2-13,67.7,0,92.8"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M11871.6,6990.5c4.2-16.7,4.2-42.2,0-58.9  c-4.2-12.5-13-16.7-26.4-25.5 M11810.4,6593.9c17.6,50.6-4.2,92.8,0,122.5c4.2,21.3,65.4,80.3,126.6,97 M11967.6,6602.2  c26.4,12.5,52.4,21.3,52.4,38c0,16.7,34.8,80.3,30.6,101.1c-4.2,21.3-30.6,29.7-30.6,50.6 M12164.3,6610.6  c-8.8,54.7-61.2,92.8-61.2,118.3c4.2,21.3-13,42.2-8.8,58.9c21.8,16.7,21.8,38,17.6,54.7c-13,12.5-21.8,25.5-13,42.2  c8.8,16.7,30.6,38,30.6,50.6c0,12.5-13,29.7-21.8,33.9c-13,4.2-30.6,16.7-39.4,29.7 M12379.1,6906.1c-4.2-16.7-8.8-42.2-21.8-54.7  c-8.8-8.4,0-29.7-4.2-46.4c-4.2-8.4-21.8-8.4-26.4-21.3c4.2-16.7,17.6-25.5,34.8-33.9"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M10616.8,6879.6c-4.2-12.1-41.3-52.4-49.6-68.7  c-12.5-16.2-24.6-257.9,0-282.1c95.1-96.5,193.9-141,222.7-153.1c41.3-16.2,136.4-16.2,193.9-4.2c272.3,52.4,450,161,487.1,314.1  c12.5,56.6,8.3,177.2-4.2,270c-8.4,76.5-37.1,129-78.4,185.1c-28.8,44.1-74.2,88.6-107.2,100.7c-28.8,12.1-99.3,12.1-140.1,12.1  c-20.4-4.2-82.6-64.5-99.3-64.5c-12.5-4.2-65.9,19.9-99.3,32c-24.6,7.9-70,7.9-95.1,0c-41.3-7.9-107.2-40.4-156.8-92.8  c-53.8-60.3-86.7-145.2-86.7-169.3C10600.1,6944.1,10616.8,6895.9,10616.8,6879.6L10616.8,6879.6z" style={{cursor: 'pointer'}}></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M11400.7,6912.1c-32.9,0-37.1-16.2-65.9-19.9  c-24.6-4.2-49.6,0-70,4.2c-12.5,4.2-24.6,24.1-37.1,24.1c-12.5-4.2-12.5-32-37.1-44.1c-16.7-7.9-24.6-32-41.3-32  c-16.7,0-53.8,24.1-70,24.1c-16.7-4.2-37.1-28.3-58-32c-16.7,0-45.5-12.1-58-12.1c-16.7,0-53.8,19.9-78.4,24.1  c-24.6,0-53.8-4.2-70,4.2c-16.7,4.2-28.8,19.9-41.3,19.9c-16.7,0-37.1,0-45.5-4.2 M11276.9,6630c24.6-16.2,53.8,24.1,58,36.2  c12.5,24.1-4.2,44.1-12.5,56.6c-32.9,40.4-65.9,120.6-82.6,120.6c-12.5,0-70-40.4-95.1-68.7"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M11190.1,6598c-28.8-16.2-78.4,4.2-82.6,12.1  c-4.2,7.9-28.8,32-32.9,52.4c-4.2,24.1,8.4,48.2,12.5,56.6c8.4,12.1,49.6,40.4,58,56.6c0,12.1-45.5,40.4-61.7,88.6  c0,19.9,28.8,19.9,24.6,36.2c-8.4,32-32.9,68.7-49.6,72.4c-20.4,7.9-45.5,60.3-82.6,60.3 M10868.2,6577.6  c41.3-28.3,86.7,36.2,103,72.4l24.6,60.3c20.4,48.2,0,80.7,24.6,120.6 M10554.6,6706.6c32.9,16.2,82.6,48.2,111.3,64.5  c16.7,7.9,16.7,68.7,78.4,100.7c-12.5,0-28.8,0-37.1,4.2c0,76.5-28.8,52.4-32.9,72.4c0,7.9-4.2,56.6,4.2,60.3  c8.3,4.2,16.7,7.9,28.8,4.2 M10699.3,6557.7c20.4,0,41.3,0,61.7,19.9c12.5,12.1,16.7,40.4,16.7,56.6c0,19.9,4.2,80.7-8.4,108.6   M11029.2,7193.7c49.6-28.3,123.9-100.7,173.5-177.2c8.4-16.2,16.7-36.2,20.4-52.4c0-16.2,0-32,4.2-44.1"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M9831.8,6651.4c-17.6,25.1-31.5,53.8-7,125.7  c66.3,172.6,195.3,312.7,289.5,334.5c31.5,14.4,69.6,14.4,97.9,0c108.1-50.6,181.4-147.5,244.5-255.1c20.9-50.6,20.9-97,3.7-129.4  c-45.5-97-157.3-190.7-226.8-219.4c-45.5-21.8-118.8-14.4-160.5,0C9978.4,6532.6,9866.6,6597.6,9831.8,6651.4L9831.8,6651.4z" style={{cursor: 'pointer'}}></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M10027.1,6727c-10.7,14.4-10.7,39.4-10.7,57.5  c3.7,18.1,13.9,36.2,24.6,46.9c20.9,21.8,20.9,50.6,20.9,79.3c10.7-3.7,20.9-3.7,31.5-7.4c13.9-7.4,24.6-14.4,38.5-18.1  c13.9,0,34.8,3.7,38.5,0c0-3.7,34.8,7.4,34.8,18.1c3.7,10.7,7,46.9,0,64.9c-3.7,18.1,10.7,18.1,38.5,3.7  c20.9-14.4,31.5-36.2,41.8-61.2c10.7-10.7,13.9-25.1,10.7-39.4c0-14.4,3.7-28.8,3.7-43.1c3.7-21.8,0-43.1-17.6-61.2  c-13.9-7.4-24.6-14.4-41.8-14.4c-10.7,3.7-20.9,10.7-27.8,21.8c-24.6,28.8-69.6,90-108.1,64.9c3.7-18.1,7-39.4,7-57.5  c0-21.8-10.7-32.5-24.6-43.1C10068.9,6727,10048,6727,10027.1,6727L10027.1,6727z"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M9873.6,6694.5c-10.7,25.1,17.6,50.6,20.9,61.2  c20.9,82.6,104.8,143.8,115,147.5c13.9,7.4,59.4,10.7,84,0c7-3.7,17.6-14.4,24.6-18.1c13.9-7.4,59.4-7.4,73.3,0  c10.7,7.4,20.9,21.8,20.9,32.5c-3.7,21.8-10.7,57.5,0,61.2c17.6,3.7,31.5-10.7,45.5-25.1c13.9-14.4,20.9-46.9,31.5-53.8  c10.7-14.4,7-28.8,20.9-32.5c17.6-3.7,38.5-10.7,55.7-21.8c17.6-10.7,27.8-7.4,41.8,0"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M10212.2,6770.1c3.7-14.4,17.6-21.8,34.8-21.8  c13.9,0,34.8,10.7,45.5,28.8c7,14.4,7,32.5,7,50.6c-3.7,25.1-7,50.6,0,61.2 M10041.1,6831.4c20.9,14.4,17.6,50.6,20.9,79.3h17.6  c7,32.5-7,100.7,3.7,111.3c0,3.7,7,10.7,13.9,10.7c3.7,3.7,3.7,10.7,0,18.1 M10027.1,6727c52.4-3.7,80.3,18.1,87.2,50.6  c0,25.1-13.9,57.5-3.7,71.9c7,10.7,20.9,21.8,24.6,36.2"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M9126.2,6753.4  c33.9-66.3,127.6-176.3,204.1-207.4c25.5-22.3,144.7-26.4,170.3,0c55.2,26.4,170.3,132.2,204.1,202.7  c17.2,31.1,21.3,105.8,4.2,149.8c-29.7,92.8-110.4,172.1-195.8,233.8c-33.9,17.6-84.9,13.5-110.4,0c-25.5-8.8-187-136.9-259.3-242.6  c-8.4-8.8-12.5-17.6-17.2-22.3C9104.9,6841.6,9109.1,6775.2,9126.2,6753.4z" style={{cursor: 'pointer'}}></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M9134.6,6881c38,8.8,102.1,8.8,114.6,0  c12.5-4.6,21.3-44.1,38-44.1s46.9,61.7,63.6,66.3c8.4,8.8,84.9,8.8,106.2,4.6c33.9-4.6,55.2-48.7,84.9-44.1  c25.5,0,17.2,44.1,38,48.7c12.5,4.6,80.7-8.8,123.4,0 M9326.2,6995.6c0-35.3,8.4-75.2,33.9-92.8"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M9500.1,7079.6c-17.2-31.1-55.2-52.9-55.2-70.5  c-4.2-13.5,12.5-79.3,12.5-101.6 M9611,7044.3c-33.9-8.8-33.9-101.6-59.4-110.4c-8.4-8.8,4.2-26.4,21.3-35.3"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M8526.9,6602.7c18.6-10.7,37.1-21.3,58.9-28.8  c43.6-10.7,102.1-14.4,151.7-3.7c21.8,3.7,37.1,21.3,52.9,35.7c6,10.7,40.4,10.7,55.7,14.4c46.4,10.7,71.4,50.1,74.2,53.8  c12.5,14.4,24.6,28.8,31.1,53.8c12.5,50.1,9.3,107.2-9.3,167.9c-43.6,71.4-114.6,221.7-192.1,257.5c-15.3,10.7-92.8,3.7-92.8,3.7  c-71.4-50.1-427.7-282.5-294.6-436.5c12.5-28.8,62.2-96.5,105.3-103.9C8480.5,6613.3,8517.6,6609.6,8526.9,6602.7L8526.9,6602.7z" style={{cursor: 'pointer'}}></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M8362.7,6878.2c9.3-21.3,18.6-32,37.1-35.7  c40.4-3.7,83.5-3.7,99.3,10.7c18.6,21.3,33.9,10.7,46.4-7c18.6-10.7,40.4-10.7,62.2-3.7h58.9c9.3,7,15.3,14.4,24.6,21.3l15.3-18.1  c21.8,0,43.6-3.7,62.2-3.7c31.1-14.4,58.9-18.1,83.5-14.4c21.8,3.7,37.1,18.1,43.6,35.7c6,25.1,6,53.8,0,85.8  c-3.2,21.3-9.3,35.7-21.8,50.1c-24.6-3.7-40.4-18.1-52.9-46.4c-24.6-21.3-52.9-28.8-90-25.1c-15.3,14.4-31.1,21.3-49.6,18.1  c-33.9-35.7-27.8-53.8-71.4-46.4c-12.5,0-24.6,3.7-40.4,3.7c-6,3.7-24.6,25.1-46.4,10.7c-6-10.7-12.5-14.4-21.8-18.1  c-15.3-7-40.4,14.4-64.9,43.1c-6,7-9.3,7-15.3,14.4C8396.5,6924.6,8381.2,6906.5,8362.7,6878.2L8362.7,6878.2z"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M8545.4,6845.8c-9.3,7-21.8,21.3-33.9,18.1  c-9.3,0-15.3-18.1-27.8-21.3c-40.4,0-83.5-3.7-96,3.7c-9.3,7-21.8,21.3-31.1,35.7 M8607.6,6842h58.9c6,0,15.3,21.3,24.6,21.3  c6,0,15.3-21.3,21.8-21.3h58.9 M8852.1,6828.1c15.3,3.7,33.9,14.4,40.4,28.8c6,14.4,9.3,60.8,0,93.2c-3.2,21.3-6,32-21.8,50.1  c-18.6,10.7-43.6-18.1-52.9-46.4 M8567.2,6903.3c24.6-7,52.9-7,77.5,0c18.6,14.4,18.6,39.4,33.9,39.4c18.6,0,33.9-10.7,49.6-18.1"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M8787.1,7121.3c-18.6-18.1-43.6-32-68.2-43.1  c-9.3-3.7-15.3-43.1-31.1-64.5c-6-18.1-12.5-46.4-9.3-68.2"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M8412.3,6956.6c24.6-14.4,43.6-35.7,64.9-57.1  c12.5-7,31.1-10.7,43.6,14.4c3.2,39.4,12.5,71.4,21.8,100.2c9.3,43.1,64.9,100.2,96,125.3"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M4822.7,6766.9c21.8,38,39.4,71.9,43.6,105.8  c4.2,46.4,0,105.8-13,139.2c-74.2,135-166.1,190.2-205.5,215.2c-30.6,21.3-100.7,29.7-144.3,12.5c-13,0-26.4-8.4-39.4-12.5  c-13,0-48.2,12.5-61.2,25.5c-17.6,12.5-70,4.2-96-8.4c-13-4.2-21.8-25.5-34.8-25.5c-126.6-16.7-196.7-118.3-236.1-236.6  c-21.8-46.4-17.6-295.5,4.2-341.9c153.1-236.6,161.9-236.6,415.7-367.4c48.2-25.5,131.3-33.9,166.1-12.5  c205.5,135,240.8,223.6,262.6,329.4c8.8,42.2,4.2,76.1,0,109.9C4870.4,6746,4826.8,6754.4,4822.7,6766.9L4822.7,6766.9z" style={{cursor: 'pointer'}}></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M4472.4,7184.9  c-144.3-58.9-227.3-270-231.9-295.5c0-16.7,13-29.7,30.6-42.2c21.8-12.5,0-130.8,26.4-130.8c17.6-4.2,61.2,29.7,57.1,33.9  c-4.2,12.5-13,25.5-4.2,38"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M4026.1,6843c17.6,4.2,48.2,0,65.4,4.2  c17.6,0,74.2,80.3,104.8,67.7c26.4-25.5,74.2-8.4,91.9-16.7c17.6-8.4,39.4-42.2,61.2-63.6c17.6-12.5,52.4,4.2,57.1-12.5  c-4.2-21.3,0-42.2,17.6-54.7c13-4.2,61.2-4.2,104.8,4.2c17.6,4.2,21.8,16.7,48.2,21.3c17.6,4.2,65.4,88.6,91.9,92.8  c21.8-4.2,52.4-92.8,65.4-109.9c8.8-21.3,74.2,0,91.9-12.5 M4826.8,6678.3c13-25.5-8.8-88.6,0-92.8c13-4.2,57.1,54.7,57.1,114.1"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M4669.6,6885.2c-13,8.4-21.8,12.5-26.4,25.5  c-4.2,16.7-4.2,42.2,0,58.9 M4577.7,6792.4c61.2-16.7,122.5-76.1,126.6-97c4.2-29.7-17.6-71.9,0-122.5 M4494.2,6771.1  c0-21.3-26.4-29.7-30.6-50.6c-4.2-21.3,30.6-84.4,30.6-101.1c0-16.7,26.4-25.5,52.4-38 M4446.4,6978c-8.8-12.5-26.4-25.5-39.4-29.7  c-8.8-4.2-21.8-21.3-21.8-33.9c0-12.5,21.8-33.9,30.6-50.6c8.8-16.7,0-29.7-13-42.2c-4.2-16.7-4.2-38,17.6-54.7  c4.2-16.7-13-38-8.8-58.9c0-25.5-52.4-63.6-61.2-118.3 M4153.2,6728.9c17.6,8.4,30.6,16.7,34.8,33.9c-4.2,12.5-21.8,12.5-26.4,21.3  c-4.2,16.7,4.2,38-4.2,46.4c-13,12.5-17.6,38-21.8,54.7"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M5898,6858.7c0,16.2,16.7,64.5,12.5,80.7  c0,24.1-32.9,108.6-86.7,169.3c-49.6,52.4-115.5,84.4-156.8,92.8c-24.6,7.9-70,7.9-95.1,0c-32.9-12.1-86.7-36.2-99.3-32  c-16.7,0-78.4,60.3-99.3,64.5c-41.3,0-111.3,0-140.1-12.1c-32.9-12.1-78.4-56.6-107.2-100.7c-41.3-56.6-70-108.6-78.4-185.1  c-12.5-92.8-16.7-213.4-4.2-270c37.1-153.1,214.8-261.6,487.1-314.1c58-12.1,152.6-12.1,193.9,4.2c28.8,12.1,128,56.6,222.7,153.1  c24.6,24.1,12.5,265.8,0,282.1C5939.3,6806.3,5902.1,6846.7,5898,6858.7L5898,6858.7z" style={{cursor: 'pointer'}}></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M5786.6,6846.7c-8.4,4.2-28.8,4.2-45.5,4.2  c-12.5,0-24.6-16.2-41.3-19.9c-16.7-7.9-45.5-4.2-70-4.2c-24.6-4.2-61.7-24.1-78.4-24.1c-12.5,0-41.3,12.1-58,12.1  c-20.4,4.2-41.3,28.3-58,32c-16.7,0-53.8-24.1-70-24.1s-24.6,24.1-41.3,32c-24.6,12.1-24.6,40.4-37.1,44.1  c-12.5,0-24.6-19.9-37.1-24.1c-20.4-4.2-45.5-7.9-70-4.2c-28.8,4.2-32.9,19.9-65.9,19.9 M5369.6,6754.4  c-24.6,28.3-82.6,68.7-95.1,68.7c-16.7,0-49.6-80.7-82.6-120.6c-8.4-12.1-24.6-32-12.5-56.6c4.2-12.1,32.9-52.4,58-36.2"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M5538.9,7011.8c-37.1,0-61.7-52.4-82.6-60.3  c-16.7-4.2-41.3-40.4-49.6-72.4c-4.2-16.2,24.6-16.2,24.6-36.2c-16.7-48.2-61.7-76.5-61.7-88.6c8.4-16.2,49.6-44.1,58-56.6  c4.2-7.9,16.7-32,12.5-56.6c-4.2-19.9-28.8-44.1-32.9-52.4c-4.2-8.4-53.8-28.3-82.6-12.1 M5493.5,6810.5  c24.6-40.4,4.2-72.4,24.6-120.6l24.6-60.3c16.7-36.2,61.7-100.7,103-72.4 M5807,6991.9c12.5,4.2,20.4,0,28.8-4.2  c8.4-4.2,4.2-52.4,4.2-60.3c-4.2-19.9-32.9,4.2-32.9-72.4c-8.4-4.2-24.6-4.2-37.1-4.2c61.7-32,61.7-92.8,78.4-100.7  c28.8-16.2,78.4-48.2,111.3-64.5 M5745.4,6721.9c-12.5-28.3-8.4-88.6-8.4-108.6c0-16.2,4.2-44.1,16.7-56.6  c20.4-19.9,41.3-19.9,61.7-19.9 M5287,6899.1c4.2,12.1,4.2,28.3,4.2,44.1c4.2,16.2,12.5,36.2,20.4,52.4  c49.6,76.5,123.9,148.9,173.5,177.2"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M6682.4,6645.4  c-34.8-53.8-146.6-118.8-240.8-143.8c-41.8-14.4-115-21.8-160.5,0c-69.6,28.8-181.4,122.5-226.8,219.4  c-17.6,32.5-17.6,79.3,3.7,129.4c62.6,108.1,135.9,205,244.5,255.1c27.8,14.4,66.3,14.4,97.9,0c94.2-21.8,223.1-161.9,289.5-334.5  C6714,6699.6,6700.1,6670.9,6682.4,6645.4L6682.4,6645.4z" style={{cursor: 'pointer'}}></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M6487.1,6721c-20.9,0-41.8,0-59.4,10.7  c-13.9,10.7-24.6,21.8-24.6,43.1c0,18.1,3.7,39.4,7,57.5c-38.5,25.1-84-36.2-108.1-64.9c-7-10.7-17.6-18.1-27.8-21.8  c-17.6,0-27.8,7.4-41.8,14.4c-17.6,18.1-20.9,39.4-17.6,61.2c0,14.4,3.7,28.8,3.7,43.1c-3.7,14.4,0,28.8,10.7,39.4  c10.7,25.1,20.9,46.9,41.8,61.2c27.8,14.4,41.8,14.4,38.5-3.7c-7-18.1-3.7-53.8,0-64.9c0-10.7,34.8-21.8,34.8-18.1  c3.7,3.7,24.6,0,38.5,0c13.9,3.7,24.6,10.7,38.5,18.1c10.7,3.7,20.9,3.7,31.5,7.4c0-28.8,0-57.5,20.9-79.3  c10.7-10.7,20.9-28.8,24.6-46.9C6497.8,6760.4,6497.8,6735.4,6487.1,6721L6487.1,6721z"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M6106.7,6839.7c13.9-7.4,24.6-10.7,41.8,0  c17.6,10.7,38.5,18.1,55.7,21.8c13.9,3.7,10.7,18.1,20.9,32.5c10.7,7.4,17.6,39.4,31.5,53.8s27.8,28.8,45.5,25.1  c10.7-3.7,3.7-39.4,0-61.2c0-10.7,10.7-25.1,20.9-32.5c13.9-7.4,59.4-7.4,73.3,0c7,3.7,17.6,14.4,24.6,18.1c24.6,10.7,69.6,7.4,84,0  c10.7-3.7,94.2-64.9,115-147.5c3.7-10.7,31.5-36.2,20.9-61.2"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M6214.8,6882.9c7-10.7,3.7-36.2,0-61.2  c0-18.1,0-36.2,7-50.6c10.7-18.1,31.5-28.8,45.5-28.8c17.6,0,31.5,7.4,34.8,21.8 M6417.5,7044.8c-3.7-7.4-3.7-14.4,0-18.1  c7,0,13.9-7.4,13.9-10.7c10.7-10.7-3.7-79.3,3.7-111.3h17.6c3.7-28.8,0-64.9,20.9-79.3 M6379,6879.2c3.7-14.4,17.6-25.1,24.6-36.2  c10.7-14.4-3.7-46.9-3.7-71.9c7-32.5,34.8-53.8,87.2-50.6"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M7388,6862c-4.2,4.6-8.4,13.5-17.2,22.3  c-72.4,105.8-233.8,233.8-259.3,242.6c-25.5,13.5-76.5,17.6-110.4,0c-84.9-61.7-165.6-141-195.8-233.8  c-17.2-44.1-12.5-119.2,4.2-149.8c33.9-70.5,148.9-176.3,204.1-202.7c25.5-26.4,144.7-22.3,170.3,0c76.5,31.1,170.3,141,204.1,207.4  C7405.2,6769.2,7409.4,6835.6,7388,6862z" style={{cursor: 'pointer'}}></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M6810,6906.1c42.7-8.8,110.4,4.6,123.4,0  c21.3-4.6,12.5-48.7,38-48.7c29.7-4.6,51,39.9,84.9,44.1c21.3,4.6,97.9,4.6,106.2-4.6c17.2-4.6,46.9-66.3,63.6-66.3  s25.5,39.9,38,44.1c12.5,8.8,76.5,8.8,114.6,0 M7154.2,6897.3c25.5,17.6,33.9,57.5,33.9,92.8"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M7056.3,6901.4c0,22.3,17.2,88.1,12.5,101.6  c0,17.6-38,39.9-55.2,70.5 M6941.7,6892.6c17.2,8.8,29.7,26.4,21.3,35.3c-25.5,8.8-25.5,101.6-59.4,110.4"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M7987.4,6596.6c9.3,7,46.4,10.7,58.9,14.4  c43.6,7,92.8,75.2,105.3,103.9c133.1,154-223.1,386.4-294.6,436.5c0,0-77.5,7-92.8-3.7c-77.5-35.7-148.9-186-192.1-257.5  c-18.6-60.8-21.8-118.3-9.3-167.9c6-25.1,18.6-39.4,31.1-53.8c3.2-3.7,27.8-43.1,74.2-53.8c15.3-3.7,49.6-3.7,55.7-14.4  c15.3-14.4,31.1-32,52.9-35.7c49.6-10.7,108.6-7,151.7,3.7C7950.3,6575.3,7968.8,6586,7987.4,6596.6L7987.4,6596.6z" style={{cursor: 'pointer'}}></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M8151.6,6872.2c-18.6,28.8-33.9,46.4-58.9,75.2  c-6-7-9.3-7-15.3-14.4c-24.6-28.8-49.6-50.1-64.9-43.1c-9.3,3.7-15.3,7-21.8,18.1c-21.8,14.4-40.4-7-46.4-10.7  c-15.3,0-27.8-3.7-40.4-3.7c-43.6-7-37.1,10.7-71.4,46.4c-18.6,3.7-33.9-3.7-49.6-18.1c-37.1-3.7-64.9,3.7-90,25.1  c-12.5,28.8-27.8,43.1-52.9,46.4c-12.5-14.4-18.6-28.8-21.8-50.1c-6-32-6-60.8,0-85.8c6-18.1,21.8-32,43.6-35.7  c24.6-3.7,52.9,0,83.5,14.4c18.6,0,40.4,3.7,62.2,3.7l15.3,18.1c9.3-7,15.3-14.4,24.6-21.3h58.9c21.8-7,43.6-7,62.2,3.7  c12.5,18.1,27.8,28.8,46.4,7c15.3-14.4,58.9-14.4,99.3-10.7C8133,6839.7,8142.3,6850.4,8151.6,6872.2L8151.6,6872.2z"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M8157.6,6875.4c-9.3-14.4-21.8-28.8-31.1-35.7  c-12.5-7-55.7-3.7-96-3.7c-12.5,3.7-18.6,21.3-27.8,21.3c-12.5,3.7-24.6-10.7-33.9-18.1 M7742.4,6836.5h58.9  c6,0,15.3,21.3,21.8,21.3c9.3,0,18.6-21.3,24.6-21.3h58.9 M7696,6947.4c-9.3,28.8-33.9,57.1-52.9,46.4  c-15.3-18.1-18.6-28.8-21.8-50.1c-9.3-32-6-78.9,0-93.2c6-14.4,24.6-25.1,40.4-28.8 M7786,6918.6c15.3,7,31.1,18.1,49.6,18.1  c15.3,0,15.3-25.1,33.9-39.4c24.6-7,52.9-7,77.5,0"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M7835.7,6939.9c3.2,21.3-3.2,50.1-9.3,68.2  c-15.3,21.3-21.8,60.8-31.1,64.5c-24.6,10.7-49.6,25.1-68.2,43.1"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M7876,7133.4c31.1-25.1,86.7-82.1,96-125.3  c9.3-28.8,18.6-60.8,21.8-100.2c12.5-25.1,31.1-21.3,43.6-14.4c21.8,21.3,40.4,43.1,64.9,57.1"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M12349.9,8494.9c13.5-24.6,26.9-39.4,31.5-64  c4.6-34.3,4.6-98.3-4.6-132.7c-8.8-39.4-40.4-83.5-81.2-108.1c-54.3-29.7-99.3-29.7-139.6-5.1c-13.5,5.1-18.1,24.6-26.9,29.7  c-22.7,0-26.9-34.3-54.3-39.4c-45-9.7-54.3-39.4-85.8-34.3c-26.9,0-54.3,24.6-63.1,34.3c-13.5,14.8-13.5,34.3-26.9,39.4  c-13.5,0-22.7-19.5-31.5-29.7c-8.8-14.8-45-39.4-76.5-39.4c-26.9-5.1-40.4,14.8-63.1,14.8c-18.1,0-112.7,0-130.8,14.8  c-31.5,19.5-67.7,49.2-85.8,122.9c-4.6,54.3-31.5,58.9-26.9,117.8c0,54.3,22.7,49.2,22.7,64c0,14.8-58.5,39.4-76.5,108.1  c-13.5,54.3-8.8,128,0,162.4c8.8,34.3,31.5,83.5,54.3,117.8c36.2,54.3,81.2,98.3,117.4,122.9c31.5,14.8,76.5,19.5,108.1,29.7  c22.7,5.1,121.5,58.9,171.2,73.8c67.7,14.8,144.3,14.8,212,0c45-9.7,90,0,135.5-14.8c63.1-19.5,167-231,185.1-275.1  c18.1-54.3,13.5-132.7-4.6-162.4C12394.9,8617.9,12394.9,8539.5,12349.9,8494.9L12349.9,8494.9z" style={{cursor: 'pointer'}}></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M11623.9,8347.4c8.8,44.1,18.1,78.9,40.4,103.5  c26.9,44.1,67.7,54.3,103.9,64c36.2,5.1,58.5-9.7,90-29.7c31.5-5.1,58.5-9.7,90-14.8c63.1-9.7,108.1-9.7,144.3,0  c45,9.7,85.8,29.7,130.8,58.9c40.4,34.3,72.4,73.8,103.9,108.1c8.8,24.6,4.6,49.2-22.7,68.7c-18.1,14.8-49.6,14.8-67.7,9.7  c-26.9,9.7-67.7,5.1-94.6-5.1c-13.5,24.6-26.9,39.4-67.7,49.2c-26.9,5.1-49.6,0-63.1-9.7c-36.2-34.3-40.4-39.4-63.1-24.6  c-18.1,9.7-31.5,19.5-49.6,29.7c-36.2,5.1-67.7,0-94.6-9.7l-108.1-14.8c-8.8-5.1-18.1,0-26.9-5.1c-45-9.7-90-29.7-103.9-54.3  c-22.7-24.6-36.2-54.3-31.5-88.6c13.5-54.3,45-83.5,72.4-103.4C11592.3,8431.4,11597,8386.8,11623.9,8347.4L11623.9,8347.4z"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M12323,8642.4c-36.2-54.3-94.6-108.1-130.8-128  c-22.7-9.7-45-24.6-72.4-29.7c-94.6-29.7-130.8-19.5-193.9-5.1c-13.5,5.1-49.6,0-67.7,9.7c-31.5,9.7-36.2,29.7-63.1,29.7  c-22.7,0-40.4,0-58.5-14.8c-45-14.8-72.4-44.1-94.6-88.6c-8.8-19.5-8.8-64-18.1-68.7c-18.1,5.1-36.2,58.9-22.7,142.4  c0,14.8-40.4,24.6-67.7,78.9c-4.6,19.5-8.8,34.3-8.8,49.2s18.1,44.1,31.5,64"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M12349.9,8494.9c-36.2-9.7-76.5-9.7-94.6-5.1  c-22.7,5.1-40.4,24.6-63.1,29.7 M12111,8578.9c13.5,14.8,26.9,34.3,31.5,58.9c4.6,24.6,0,54.3-4.6,78.9  c-8.8,14.8-22.7,34.3-36.2,39.4c-8.8,5.1-49.6,19.5-58.5,14.8c-8.8-5.1-45-19.5-58.5-39.4 M12232.5,8721.3  c-36.2,5.1-67.7,5.1-94.6-5.1 M12002.9,8593.3c-22.7,29.7-54.3,58.9-58.5,68.7c-4.6,19.5,8.8,64,4.6,73.8  c-8.8,9.7-49.6,34.3-72.4,39.4c-22.7,0-126.2-29.7-144.3-29.7c-22.7-5.1-58.5,5.1-67.7-9.7c-4.6-9.7,4.6-34.3,4.6-58.9  c0-19.5-8.8-58.9,4.6-64c26.9-9.7,13.5-88.6,63.1-108.1"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M11844.7,8573.8c0,24.6-26.9,49.2-36.2,64  c-22.7,34.3,4.6,93.2-18.1,122.9"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M11280.1,8507.9c-9.7-25.1,14.8-139.6,0-174.9  c-63.6-95.1-196.2-184.6-314.1-180c-24.6,0-73.8,39.9-93.2,39.9c-19.5,0-58.9-30.2-78.4-39.9c-44.1-14.8-156.8-14.8-186.5-5.1  c-49.2,19.9-156.8,95.1-206,184.6c-19.5,25.1-34.3,115-34.3,160c0,25.1-39.4,90-39.4,115c-9.7,30.2-14.8,99.7-5.1,135  c14.8,34.8,83.5,79.8,122.5,109.9c19.5,14.8,53.8,70,73.8,99.7c103,109.9,191.1,79.8,215.7,90c44.1,19.9,103,45,196.2,39.9  c88.1,5.1,112.7-25.1,132.7-25.1c58.9-25.1,127.6-25.1,152.2-34.8c83.5-30.2,112.7-119.7,122.5-135c34.3-50.1,34.3-209.7,24.6-249.6  C11358.5,8607.6,11289.9,8537.6,11280.1,8507.9L11280.1,8507.9z" style={{cursor: 'pointer'}}></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M10529.5,8533c-19.5,30.2-24.6,64.9-34.3,95.1  c9.7,10.2,19.5,19.9,34.3,30.2c0,14.8-5.1,30.2-5.1,45c0,5.1,0,14.8,5.1,19.9h53.8v25.1h73.8c24.6-5.1,49.2-5.1,73.8-10.2  c5.1-5.1,19.5-5.1,34.3-5.1c19.5,0,39.4,0,53.8,5.1c34.3,14.8,68.7,34.8,103,50.1c9.7,0,19.5,5.1,29.2,5.1  c9.7-5.1,19.5-10.2,24.6-14.8c19.5-5.1,39.4-5.1,63.6-10.2c44.1-50.1,29.2-90,5.1-149.8c-9.7-14.8-24.6-30.2-49.2-34.8  c0-30.2,0-59.8-14.8-84.9c-14.8-14.8-39.4-14.8-73.8-14.8c0-10.2,0-25.1,5.1-34.8c-9.7,5.1-24.6,5.1-34.3,10.2l-88.1-14.8  c-29.2,14.8-53.8,25-83.5,39.9c-19.5,0-39.4-5.1-58.9-5.1C10627.4,8482.9,10578.3,8477.8,10529.5,8533L10529.5,8533z"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M10495.2,8627.6c0,19.9,29.2,19.9,34.3,30.2  c0,25.1-9.7,59.8,0,64.9c14.8,5.1,44.1-5.1,53.8,0c5.1,10.2-9.7,19.9,0,25c19.5,5.1,108.1,0,142.4-10.2 M10367.6,8457.8  c14.8,14.8,24.6,45,39.4,50.1c24.6,0,14.8-64.9,19.5-70c9.7-5.1,29.2,5.1,39.4,0c9.7-5.1,0-19.9,5.1-25.1c9.7-5.1,88.1-5.1,103-5.1  c9.7,0,19.5,19.9,14.8,34.8 M10647.4,8607.6c-14.8-45-19.5-115-5.1-124.8c19.5-14.8,53.8,5.1,68.7,0c19.5-10.2,44.1-30.2,78.4-39.9  c39.4-5.1,58.9,34.8,122.5,5.1c0,19.9-9.7,34.8-9.7,50.1c-5.1,19.9-9.7,39.9-19.5,54.7c-19.5,14.8-39.4,45-49.2,70  c-9.7,30.2-44.1,64.9-83.5,79.8"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M10735.5,8288c-5.1,25-5.1,59.8,0,64.9  c9.7,5.1,14.8,5.1,19.5,10.2c14.8,10.2-5.1,45,9.7,54.7l24.6,25.1 M11000.4,8308c-5.1,14.8-19.5,30.2-29.2,34.8  c-9.7,0-9.7,34.8-19.5,54.7c-5.1,10.2-19.5,14.8-24.6,19.9c-9.7,10.2-14.8,25.1-14.8,34.8 M10907.2,8482.9  c19.5-5.1,39.4-5.1,58.9,5.1c19.5,5.1,29.2,34.8,24.6,45c0,14.8-5.1,39.9,0,50.1c5.1,10.2,24.6,10.2,34.3,14.8s14.8,25.1,19.5,39.9   M11162.3,8407.7c-24.6,14.8-29.2,45-58.9,45c-19.5,0-44.1,19.9-39.4,30.2c5.1,14.8,19.5,0,39.4,14.8c14.8,14.8,24.6,30.2,34.3,39.9  c19.5,14.8,19.5,54.7,39.4,64.9c14.8,10.2,0,34.8,9.7,50.1c9.7,10.2,19.5,10.2,24.6,19.9c5.1,10.2,0,75.2-5.1,90  c-5.1,10.2-29.2,14.8-24.6,25.1 M10882.6,8552.9c14.8,19.9,9.7,75.2,39.4,90c24.6,19.9,14.8,39.9,68.7,95.1  c14.8,5.1,49.2,19.9,49.2,34.8c0,10.2-29.2,0-49.2,5.1c-19.5,5.1-24.6,19.9-39.4,19.9c-9.7,0-39.4-10.2-53.8-19.9  c-24.6-14.8-49.2-34.8-73.8-39.9"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M9611.5,8573.8  c16.2-25.5,153.6-178.6,225.9-238.4c40.4-25.5,97-17.2,129.4,0c64.5,38.5,109,68.2,153.5,127.6c28.3,33.9,60.8,97.9,72.8,148.9  c24.1,59.4,16.2,123.4,4.2,178.6c-20.4,59.4-88.6,199.9-133.1,217.1c-36.2,13-169.8,8.4-201.8,0c-16.2-4.2-104.8-80.7-137.3-110.4  c-44.5-51-80.7-115-116.9-178.6C9591.5,8684.7,9587.4,8620.6,9611.5,8573.8L9611.5,8573.8z" style={{cursor: 'pointer'}}></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M9724.7,8608.1c4.2-25.5,16.2-33.9,28.3-42.7  c28.3-8.3,28.3-21.3,56.6-42.7c16.2-97.9,7.9-89.5,84.9-144.7c28.3,25.5,7.9,144.7,7.9,182.8c7.9,119.2-24.1,148.9-56.6,144.7  c-24.1,17.2-76.5-13-104.8-25.5C9728.9,8659.1,9712.6,8646.2,9724.7,8608.1L9724.7,8608.1z"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M9978.9,8522.8c-16.2,17.2,7.9,46.9,12.1,55.2  c7.9,17.2,16.2,46.9,4.2,64c-7.9,8.4-28.3,0-28.3,17.2c0,21.3,4.2,33.9,7.9,42.7c28.3,13,64.5,21.3,92.8-4.2  c16.2-17.2,12.1-33.9,20.4-46.9c12.1-25.5,36.2-13,44.5-42.7c-4.2-29.7-16.2-46.9-36.2-76.5c-4.2-4.2-7.9-17.2-20.4-25.5  C10068,8488.9,9999.3,8488.9,9978.9,8522.8L9978.9,8522.8z"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M9805.4,8522.8c12.1-21.3,4.2-68.2,20.4-84.9  c12.1-17.2,52.4-59.4,64.5-59.4c20.4,4.2,4.2,174.4,7.9,264 M10007.2,8501.9c24.1-4.2,60.8-4.2,68.7,0c7.9,4.2,36.2,46.9,40.4,55.2  c4.2,13,20.4,42.7,16.2,51c-4.2,8.4-16.2,13-24.1,17.2c-7.9,4.2-16.2,13-20.4,21.3 M9995.1,8573.8c4.2,21.3,4.2,55.2,0,68.2  c-7.9,8.4-20.4,0-24.1,8.4c-4.2,4.2,0,38.5,4.2,46.9c4.2,8.4,20.4,8.4,32.5,8.4 M9724.7,8612.3c0,13-4.2,38.5,4.2,51  c12.1,21.3,44.5,33.9,52.4,38.5c12.1,4.2,40.4,4.2,60.8,4.2"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M9136.9,8336.3c-26.9,14.4-71.9,72.4-81.2,106.2  c-9.3,33.9-18.1,58-31.5,82.1c-13.5,19.5-71.9,67.3-85.4,91.4c-13.5,24.1-40.4,125.3-13.5,207.4c13.5,48.2,90,129.9,130.4,149.4  c40.4,19.5,184.2,24.1,260.7,9.7c53.8-24.1,148.4-82.1,206.9-207.4c18.1-48.2,26.9-106.2-4.6-149.4  c-81.2-110.9-175.4-212-265.4-298.8C9226.9,8312.1,9177.7,8307.5,9136.9,8336.3z" style={{cursor: 'pointer'}}></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M9150.4,8413.3c13.5-24.1,36.2-33.9,49.6-33.9  c31.5,0,45,28.8,45,72.4c0,9.7,0,24.1,4.6,33.9c26.9,4.6,36.2,19.5,22.3,52.9c26.9,9.7,53.8,14.4,81.2,9.7  c18.1,0,36.2,28.8,53.8,52.9c26.9,33.9,22.3,72.4,18.1,110.9c-8.8,14.4-8.8,28.8-49.6,28.8c-22.3-14.4-26.9-28.8-31.5-33.9  c-26.9,0-53.8-4.6-81.2-4.6c-18.1-4.6-31.5-9.7-45-14.4c-22.3-4.6-45-9.7-63.1-9.7c-45,9.7-116.9,86.7-139.6,9.7v-28.8  c0-38.5,18.1-52.9,40.4-67.3c0-19.5,4.6-33.9,4.6-52.9c18.1-14.4,31.5-24.1,49.6-38.5c0-14.4,0-24.1,4.6-38.5  C9128.1,8447.1,9136.9,8427.7,9150.4,8413.3L9150.4,8413.3z"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M9155,8418.4c-18.1,9.7-31.5,24.1-45,48.2  c-4.6,9.7,4.6,24.1,0,38.5c-4.6,9.7-40.4,24.1-49.6,33.9c-4.6,9.7,0,33.9-4.6,52.9c-4.6,14.4-31.5,19.5-36.2,33.9  c-4.6,14.4-4.6,43.1-4.6,62.6 M9200,8384.5c22.3-9.7,31.5,0,45,33.9c8.8,19.5-4.6,52.9,4.6,67.3c8.8,9.7,22.3,4.6,26.9,14.4  c4.6,9.7-8.8,33.9,0,38.5c13.5,19.5,94.6,0,98.8,24.1c4.6,24.1,40.4,43.1,49.6,62.6s4.6,58,4.6,91.4 M9136.9,8678.6  c26.9-4.6,76.5,0,94.6,14.4c22.3,19.5,81.2,4.6,112.3,14.4"></path>
	<path fill="#FAFAFAFFF" stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M8286.6,8567.8c38.5-104.8,120.6-244,159.6-274.2  c53.3-39.9,106.2-34.8,145.2-19.9c62.6,29.7,207.8,189.3,261.2,298.8c14.4,34.8,14.4,129.4,9.7,209.2  c-14.4,54.7-43.6,99.7-77.5,124.8c-38.5,19.9-87.2,25.1-149.8,45c-53.3,19.9-174,19.9-222.2-5.1c-77.5-39.9-111.3-139.6-125.7-194.4  C8281.5,8697.6,8272.2,8627.6,8286.6,8567.8z" style={{cursor: 'pointer'}}></path>
	<path fill="#FAFAFAFFF" stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M8523.2,8343.7c33.9,0,58,19.9,62.6,45  c9.7,19.9,19.5,49.6,29.2,69.6l72.4,59.8c33.9,25.1,62.6,49.6,77.5,89.5c9.7,25.1-4.6,34.8-29.2,34.8h-33.9  c-24.1-9.7-53.3-5.1-96.5,0c-43.6,5.1-87.2,0-130.4-5.1h-62.6c-24.1-5.1-48.2,0-53.3-29.7c0-34.8,9.7-64.9,29.2-99.7  c19.5-29.7,38.5-64.9,58-94.6C8465.2,8383.6,8489.3,8353.4,8523.2,8343.7L8523.2,8343.7z"></path>
	<path fill="#FAFAFAFFF" stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M8518.5,8348.8c-19.5,0-43.6,14.8-58,39.9  c-24.1,39.9-62.6,104.8-72.4,124.8c-14.4,19.9-29.2,64.9-24.1,99.7 M8576.5,8393.3c19.5,14.8,29.2,54.7,38.5,64.9  c19.5,25.1,101.6,69.6,135.5,124.8c9.7,9.7,19.5,34.8,9.7,49.6c-14.4,9.7-38.5,9.7-58,5.1 M8412.3,8627.6  c67.7,5.1,130.4,19.9,193.4,9.7"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M4104.1,8549.2c-45,44.1-45,122.9-58.5,147.5  c-18.1,29.7-22.7,108.1-4.6,162.4c18.1,44.1,121.5,255.6,185.1,275.1c45,14.8,90,5.1,135.5,14.8c67.7,14.8,144.3,14.8,212,0  c49.6-14.8,148.9-68.7,171.2-73.8c31.5-9.7,76.5-14.8,108.1-29.7c36.2-24.6,81.2-68.7,117.4-122.9c22.7-34.3,45-83.5,54.3-117.8  c9.3-34.3,13.5-108.1,0-162.4c-18.1-68.7-76.5-93.2-76.5-108.1c0-14.8,22.7-9.7,22.7-64c4.6-58.9-22.7-64-26.9-117.8  c-18.1-73.8-54.3-103.5-85.8-122.9c-18.1-14.8-112.7-14.8-130.8-14.8c-22.7,0-36.2-19.5-63.1-14.8c-31.5,0-67.7,24.6-76.5,39.4  c-8.8,9.7-18.1,29.7-31.5,29.7c-13.5-5.1-13.5-24.6-26.9-39.4c-8.8-9.7-36.2-34.3-63.1-34.3c-31.5-5.1-40.4,24.6-85.8,34.3  c-26.9,5.1-31.5,39.4-54.3,39.4c-8.8-5.1-13.5-24.6-26.9-29.7c-40.4-24.6-85.8-24.6-139.6,5.1c-40.4,24.6-72.4,68.7-81.2,108.1  c-8.8,34.3-8.8,98.3-4.6,132.7C4077.2,8510.2,4090.6,8524.6,4104.1,8549.2L4104.1,8549.2z" style={{cursor: 'pointer'}}></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M4830.1,8402.1c26.9,39.4,31.5,83.5,18.1,132.7  c26.9,19.5,58.5,49.2,72.4,103.4c4.6,34.3-8.8,64-31.5,88.6c-13.5,24.6-58.5,44.1-103.9,54.3c-8.8,5.1-18.1,0-26.9,5.1l-108.1,14.8  c-26.9,9.7-58.5,14.8-94.6,9.7c-18.1-9.7-31.5-19.5-49.6-29.7c-22.7-14.8-26.9-9.7-63.1,24.6c-13.5,9.7-36.2,14.8-63.1,9.7  c-40.4-9.7-54.3-24.6-67.7-49.2c-26.9,9.7-67.7,14.8-94.6,5.1c-18.1,5.1-49.6,5.1-67.7-9.7c-26.9-19.5-31.5-44.1-22.7-68.7  c31.5-34.3,63.1-73.8,103.9-108.1c45-29.7,85.8-49.2,130.8-58.9c36.2-9.7,81.2-9.7,144.3,0c31.5,5.1,58.5,9.7,90,14.8  c31.5,19.5,54.3,34.3,90,29.7c36.2-9.7,76.5-19.5,103.9-64C4812,8480.5,4820.8,8446.2,4830.1,8402.1L4830.1,8402.1z"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M4897.8,8736.1c13.5-19.5,31.5-49.2,31.5-64  c0-14.8-4.6-29.7-8.8-49.2c-26.9-54.3-67.7-64-67.7-78.9c13.5-83.5-4.6-137.8-22.7-142.4c-8.8,5.1-8.8,49.2-18.1,68.7  c-22.7,44.1-49.6,73.8-94.6,88.6c-18.1,14.8-36.2,14.8-58.5,14.8c-26.9,0-31.5-19.5-63.1-29.7c-18.1-9.7-54.3-5.1-67.7-9.7  c-63.1-14.8-99.3-24.6-193.9,5.1c-26.9,5.1-49.6,19.5-72.4,29.7c-36.2,19.5-94.6,73.8-130.8,128"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M4261.8,8573.8c-22.7-5.1-40.4-24.6-63.1-29.7  c-18.1-5.1-58.5-5.1-94.6,5.1 M4469.2,8785.3c-13.5,19.5-49.6,34.3-58.5,39.4c-8.8,5.1-49.6-9.7-58.5-14.8  c-13.5-5.1-26.9-24.6-36.2-39.4c-4.6-24.6-8.8-54.3-4.6-78.9c4.6-24.6,18.1-44.1,31.5-58.9 M4316.1,8770.5  c-26.9,9.7-58.5,9.7-94.6,5.1 M4717.3,8559.4c49.6,19.5,36.2,98.3,63.1,108.1c13.5,5.1,4.6,44.1,4.6,64c0,24.6,8.8,49.2,4.6,58.9  c-8.8,14.8-45,5.1-67.7,9.7c-18.1,0-121.5,29.7-144.3,29.7c-22.7-5.1-63.1-29.7-72.4-39.4c-4.6-9.7,8.8-54.3,4.6-73.8  c-4.6-9.7-36.2-39.4-58.5-68.7"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M4663.5,8815c-22.7-29.7,4.6-88.6-18.1-122.9  c-8.8-14.8-36.2-39.4-36.2-64"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M5173.8,8562.2c-9.7,30.2-78.4,99.7-83.5,129.9  c-9.7,39.9-9.7,199.9,24.6,249.6c9.7,14.8,39.4,104.8,122.5,135c24.6,10.2,93.2,10.2,152.2,34.8c19.5,0,44.1,30.2,132.7,25  c93.2,5.1,152.2-19.9,196.2-39.9c24.6-10.2,112.7,19.9,215.7-90c19.5-30.2,53.8-84.9,73.8-99.7c39.4-30.2,108.1-75.2,122.5-109.9  c9.7-34.8,5.1-104.8-5.1-135c0-25.1-39.4-90-39.4-115c0-45-14.8-135-34.3-160c-49.2-90-156.8-164.7-206-184.6  c-29.2-10.2-142.4-10.2-186.5,5.1c-19.5,10.2-58.9,39.9-78.4,39.9s-68.7-39.9-93.2-39.9c-117.8-5.1-250,84.9-314.1,180  C5159.4,8422.1,5184,8537.1,5173.8,8562.2L5173.8,8562.2z" style={{cursor: 'pointer'}}></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M5924.4,8587.2c-49.2-54.7-97.9-50.1-117.8-54.7  c-19.5,0-39.4,5.1-58.9,5.1c-29.2-14.8-53.8-25.1-83.5-39.9l-88.1,14.8c-9.7-5.1-24.6-5.1-34.3-10.2c5.1,10.2,5.1,25.1,5.1,34.8  c-34.3,0-58.9,0-73.8,14.8c-14.8,25.1-14.8,54.7-14.8,84.9c-24.6,5.1-39.4,19.9-49.2,34.8c-24.6,59.8-39.4,99.7,5.1,149.8  c24.6,5.1,44.1,5.1,63.6,10.2c5.1,5.1,14.8,10.2,24.6,14.8c9.7,0,19.5-5.1,29.2-5.1c34.3-14.8,68.7-34.8,103-50.1  c14.8-5.1,34.3-5.1,53.8-5.1c14.8,0,29.2,0,34.3,5.1c24.6,5.1,49.2,5.1,73.8,10.2h73.8v-25.1h53.8c5.1-5.1,5.1-14.8,5.1-19.9  c0-14.8-5.1-30.2-5.1-45c14.8-10.2,24.6-19.9,34.3-30.2C5949,8652.2,5944.4,8616.9,5924.4,8587.2L5924.4,8587.2z"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M5728.2,8791.8c34.3,10.2,122.5,14.8,142.4,10.2  c9.7-5.1-5.1-14.8,0-25c9.7-5.1,39.4,5.1,53.8,0c9.7-5.1,0-39.9,0-64.9c5.1-10.2,34.3-10.2,34.3-30.2 M5866,8497.2  c-5.1-14.8,5.1-34.8,14.8-34.8c14.8,0,93.2,0,103,5.1c5.1,5.1-5.1,19.9,5.1,25.1c9.7,5.1,29.2-5.1,39.4,0c5.1,5.1-5.1,70,19.5,70  c14.8-5.1,24.6-34.8,39.4-50.1 M5704.1,8757c-39.4-14.8-73.8-50.1-83.5-79.8c-9.7-25.1-29.2-54.7-49.2-70  c-9.7-14.8-14.8-34.8-19.5-54.7c0-14.8-9.7-30.2-9.7-50.1c63.6,30.2,83.5-10.2,122.5-5.1c34.3,10.2,58.9,30.2,78.4,39.9  c14.8,5.1,49.2-14.8,68.7,0c14.8,10.2,9.7,79.8-5.1,124.8"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M5664.6,8497.2l24.6-25.1  c14.8-10.2-5.1-45,9.7-54.7c5.1-5.1,9.7-5.1,19.5-10.2c5.1-5.1,5.1-39.9,0-64.9 M5542.2,8507c0-10.2-5.1-25.1-14.8-34.8  c-5.1-5.1-19.5-10.2-24.6-19.9c-9.7-19.9-9.7-54.7-19.5-54.7c-9.7-5.1-24.6-19.9-29.2-34.8 M5409.5,8692.1  c5.1-14.8,9.7-34.8,19.5-39.9c9.7-5.1,29.2-5.1,34.3-14.8c5.1-10.2,0-34.8,0-50.1c-5.1-10.2,5.1-39.9,24.6-45  c19.5-10.2,39.4-10.2,58.9-5.1 M5272.2,8841.9c5.1-10.2-19.5-14.8-24.6-25.1c-5.1-14.8-9.7-79.8-5.1-90  c5.1-10.2,14.8-10.2,24.6-19.9c9.7-14.8-5.1-39.9,9.7-50.1c19.5-10.2,19.5-50.1,39.4-64.9c9.7-10.2,19.5-25,34.3-39.9  c19.5-14.8,34.3,0,39.4-14.8c5.1-10.2-19.5-30.2-39.4-30.2c-29.2,0-34.3-30.2-58.9-45 M5630.3,8791.8c-24.6,5.1-49.2,25.1-73.8,39.9  c-14.8,10.2-44.1,19.9-53.8,19.9c-14.8,0-19.5-14.8-39.4-19.9c-19.5-5.1-49.2,5.1-49.2-5.1c0-14.8,34.3-30.2,49.2-34.8  c53.8-54.7,44.1-75.2,68.7-95.1c29.2-14.8,24.6-70,39.4-90"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M6891.2,8559.4c24.1,46.9,20.4,110.4,4.2,144.7  c-36.2,64-72.8,127.6-116.9,178.6c-32.5,29.7-121.1,106.2-137.3,110.4c-32.5,8.4-165.6,13-201.8,0  c-44.5-17.2-113.2-157.3-133.1-217.1c-12.1-55.2-20.4-119.2,4.2-178.6c12.1-51,44.5-115,72.8-148.9c44.5-59.4,88.6-89.5,153.6-127.6  c32.5-17.2,88.6-25.5,129.4,0C6737.6,8380.8,6874.9,8533.9,6891.2,8559.4L6891.2,8559.4z" style={{cursor: 'pointer'}}></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M6778,8593.3c12.1,38.5-4.2,51-16.2,72.4  c-28.3,13-80.7,42.7-104.8,25.5c-32.5,4.2-64.5-25.5-56.6-144.7c0-38.5-20.4-157.3,7.9-182.8c76.5,55.2,68.7,46.9,84.9,144.7  c28.3,21.3,28.3,33.9,56.6,42.7C6761.8,8559.4,6773.8,8567.8,6778,8593.3L6778,8593.3z"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M6523.8,8508.4c-20.4-33.9-88.6-33.9-97-17.2  c-12.1,8.4-16.2,21.3-20.4,25.5c-20.4,29.7-32.5,46.9-36.2,76.5c7.9,29.7,32.5,17.2,44.5,42.7c7.9,13,4.2,29.7,20.4,46.9  c28.3,25.5,64.5,17.2,92.8,4.2c4.2-8.4,7.9-21.3,7.9-42.7c0-17.2-20.4-8.4-28.3-17.2c-12.1-17.2-4.2-46.9,4.2-64  C6515.4,8555.2,6539.5,8525.1,6523.8,8508.4L6523.8,8508.4z"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M6604.5,8627.6c4.2-89.5-12.1-259.3,7.9-264  c12.1,0,52.4,42.7,64.5,59.4c16.2,17.2,7.9,64,20.4,84.9 M6414.3,8631.8c-4.2-8.4-12.1-17.2-20.4-21.3c-7.9-4.2-20.4-8.4-24.1-17.2  c-4.2-8.4,12.1-38.5,16.2-51c4.2-8.4,32.5-51,40.4-55.2c7.9-4.2,44.5-4.2,68.7,0 M6495.5,8691.1c12.1,0,28.3,0,32.5-8.4  s7.9-42.7,4.2-46.9c-4.2-8.4-16.2,0-24.1-8.4c-4.2-13-4.2-46.9,0-68.2 M6660.6,8691.1c20.4,0,48.2,0,60.8-4.2  c7.9-4.2,40.4-17.2,52.4-38.5c7.9-13,4.2-38.5,4.2-51"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M7248.4,8312.1c-90,86.7-184.2,187.9-265.4,298.8  c-31.5,43.1-22.3,101.1-4.6,149.4c58.5,125.3,153.1,183.2,206.9,207.4c76.5,14.4,220.4,9.7,260.7-9.7  c40.4-19.5,116.9-101.1,130.4-149.4c26.9-82.1,0-183.2-13.5-207.4c-13.5-24.1-71.9-72.4-85.4-91.4c-13.5-24.1-22.3-48.2-31.5-82.1  c-8.8-33.9-53.8-91.4-81.2-106.2C7324.9,8292.7,7275.8,8297.8,7248.4,8312.1z" style={{cursor: 'pointer'}}></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M7351.8,8398.9c13.5,14.4,22.3,33.9,36.2,48.2  c4.6,14.4,4.6,24.1,4.6,38.5c18.1,14.4,31.5,24.1,49.6,38.5c0,19.5,4.6,33.9,4.6,52.9c22.3,14.4,40.4,28.8,40.4,67.3v28.8  c-22.3,77-94.6,0-139.6-9.7c-18.1,0-40.4,4.6-63.1,9.7c-13.5,4.6-26.9,9.7-45,14.4c-26.9,0-53.8,4.6-81.2,4.6  c-4.6,4.6-8.8,19.5-31.5,33.9c-40.4,0-40.4-14.4-49.6-28.8c-4.6-38.5-8.8-77,18.1-110.9c18.1-24.1,36.2-52.9,53.8-52.9  c26.9,4.6,53.8,0,81.2-9.7c-13.5-33.9-4.6-48.2,22.3-52.9c4.6-9.7,4.6-24.1,4.6-33.9c0-43.1,13.5-72.4,45-72.4  C7316.1,8365,7338.4,8374.8,7351.8,8398.9L7351.8,8398.9z"></path>
	<path fill="#FAFAFAFFF" stroke="#010101" strokeWidth="2" strokeMiterlimit="10" d="M7486.8,8673.5c0-19.5,0-48.2-4.6-62.6  s-31.5-19.5-36.2-33.9c-4.6-19.5,0-43.1-4.6-52.9c-8.8-9.7-45-24.1-49.6-33.9c-4.6-14.4,4.6-28.8,0-38.5  c-13.5-24.1-26.9-38.5-45-48.2 M7073,8702.3c0-33.9-4.6-72.4,4.6-91.4c9.3-19,45-38.5,49.6-62.6c4.6-24.1,85.4-4.6,98.8-24.1  c8.8-4.6-4.6-28.8,0-38.5c4.6-9.7,18.1-4.6,26.9-14.4c8.8-14.4-4.6-48.2,4.6-67.3c13.5-33.9,22.3-43.1,45-33.9 M7158.4,8692.5  c31.5-9.7,90,4.6,112.3-14.4c18.1-14.4,67.3-19.5,94.6-14.4"></path>
	<path fill="#FAFAFAFFF" stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M8216.1,8737.5  c-14.4,54.7-48.2,154.5-125.7,194.4c-48.2,25.1-169.3,25.1-222.2,5.1c-62.6-19.9-111.3-25-149.8-45c-33.9-25-62.6-69.6-77.5-124.8  c-4.6-79.8-4.6-174.4,9.7-209.2c53.3-109.5,198.1-269.1,261.2-298.8c38.5-14.8,91.9-19.9,145.2,19.9  c38.5,29.7,120.6,169.3,159.6,274.2C8230.5,8613.2,8220.7,8682.8,8216.1,8737.5z" style={{cursor: 'pointer'}}></path>
	<path fill="#FAFAFAFFF" stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M7979,8328.8c33.9,9.7,58,39.9,77.5,69.6  c19.5,29.7,38.5,64.9,58,94.6c19.5,34.8,29.2,64.9,29.2,99.7c-4.6,29.7-29.2,25.1-53.3,29.7h-62.6c-43.6,5.1-87.2,9.7-130.4,5.1  c-43.6-5.1-72.4-9.7-96.5,0H7767c-24.1,0-38.5-9.7-29.2-34.8c14.4-39.9,43.6-64.9,77.5-89.5l72.4-59.8c9.7-19.9,19.5-49.6,29.2-69.6  C7921,8348.8,7945.6,8328.8,7979,8328.8L7979,8328.8z"></path>
	<path fill="#FAFAFAFFF" stroke="#020202" strokeWidth="2" strokeMiterlimit="10" d="M8138.6,8597.9c4.6-34.8-9.7-79.8-24.1-99.7  c-9.7-19.9-48.2-84.9-72.4-124.8c-14.4-25.1-38.5-39.9-58-39.9 M7800.4,8623c-19.5,5.1-43.6,5.1-58-5.1c-9.7-14.8,0-39.9,9.7-49.6  c33.9-54.7,116-99.7,135.5-124.8c9.7-9.7,19.5-49.6,38.5-64.9 M7896.9,8623c62.6,9.7,125.7-5.1,193.4-9.7"></path>
	<path fill="none" stroke="#EFA8AD" strokeWidth="40" strokeMiterlimit="10" d="M4126.3,5259.7c91.9-88.1,161.9-101.1,208.8-97.4  c108.6,8.8,129,112.3,278.3,139.2c76.5,13.9,109.9-6.5,167,27.8c59.4,35.7,62.6,81.2,111.3,97.4c58.5,19.5,116.9-25.1,167-55.7  c142.9-88.1,304.8-122,403.6-125.3c104.8-3.2,265.4,24.6,403.6,111.3c62.2,39,96,74.7,153.1,69.6c87.2-7.9,92.8-100.2,194.8-139.2  c103-39,231,3.7,306.2,55.7c64,44.5,67.7,80.7,125.3,97.4c61.7,17.6,101.1-11.1,194.8-41.8c99.7-32.5,257.9-83.5,389.7-27.8  c84.4,35.7,76.1,80.7,153.1,97.4c61.7,13.5,104.8-7.9,264.4-69.6c163.8-63.6,172.6-91.9,222.7-83.5c50.1,8.4,51.5,33.9,208.8,139.2  c86.7,58,111.3,67.3,139.2,69.6c37.1,3.2,68.7-5.6,167-55.7c180.9-91.4,179.5-114.1,222.7-111.3c82.6,5.1,85.8,86.3,222.7,139.2  c33.9,13,86.7,32.9,153.1,27.8c88.6-7,105.8-50.6,222.7-97.4c92.3-37.1,171.6-68.7,250.5-41.8c83.5,28.8,82.6,95.1,180.9,125.3  c17.2,5.1,82.6,23.2,153.1,0c97.9-32,89.5-105.8,180.9-153.1c95.1-49.6,222.7-31.5,306.2,13.9c88.1,47.8,85.4,103,153.1,111.3  c0,0,38,4.6,208.8-83.5l0,0c162.4-93.2,282.1-97.4,361.8-83.5c93.2,16.2,241.7,76.1,361.8,139.2c77,40.4,115,67.7,167,55.7  c91.4-21.8,167-153.1,167-153.1l0,0c0,0,114.1,11.6,194.8-13.9c113.2-36.2,115.5-132.2,194.8-153.1c52.9-13.9,135,7,264.4,153.1"></path>
	<path fill="none" stroke="#EFA8AD" strokeWidth="40" strokeMiterlimit="10" d="M4182,10158.9c64-26,160-52.9,264.4-27.8  c109.9,26.4,124.8,85.8,222.7,97.4c84.4,10.2,103.4-30.2,306.2-97.4c141.5-46.9,212.5-70,278.3-55.7c103,22.7,112.7,87.2,222.7,97.4  c68.2,6.5,84.4-16.7,180.9-13.9c77.9,2.3,105.3,18.1,167,27.8c216.2,34.3,416.6-75.2,431.4-83.5c99.7-56.1,119.7-104.8,180.9-97.4  c71,8.8,73.8,77.5,167,125.3c85.4,43.6,206,49.2,292.3,0c80.3-45.5,89.1-114.1,139.2-111.3c51,2.8,51.5,74.7,125.3,125.3  c84.4,58,220.4,57.5,306.2,0c76.5-51,77.9-123.9,125.3-125.3c56.6-1.9,61.7,100.7,153.1,167c113.2,81.6,314.5,77,417.5-13.9  c48.2-42.7,61.2-91.9,111.3-97.4c46.4-5.1,71.4,33.4,125.3,69.6c108.1,72.8,277.9,99.7,389.7,41.8c82.1-42.7,85.4-106.7,153.1-111.3  c57.5-4.2,71,40.8,167,83.5c43.6,19.5,168.4,74.7,264.4,27.8c77-37.6,69.6-109,139.2-125.3c47.8-11.1,64.5,19,167,55.7  c86.7,30.6,191.1,68.2,278.3,27.8c48.7-22.3,39.9-45,111.3-83.5c37.6-20.4,92.3-49.6,153.1-41.8c66.8,8.8,68.7,53.8,139.2,83.5  c45.9,19.5,69.6,10.7,278.3-13.9c164.2-19.5,184.6-18.1,208.8-13.9c96,17.2,108.1,56.1,180.9,55.7c84.9-0.5,96-54.3,194.8-83.5  c100.7-29.7,192.1-4.2,306.2,27.8c158.2,44.5,163.8,87.7,250.5,83.5c104.4-5.1,130.4-68.7,250.5-97.4  c101.6-24.1,192.5-4.6,250.5,13.9"></path>
</svg> */}
        {/* <svg
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				xmlnsXlink="http://www.w3.org/1999/xlink"
				preserveAspectRatio="xMidYMid meet"
				viewBox="0 0 560 640"
				style={{ maxHeight: "350px" }}
			>
				<defs>
					<path
						style={{ cursor: "pointer" }}
						d="M283.67 25.03C277.49 12.12 210.6 22.81 215.36 37.87C223.67 64.15 243.24 89.77 265.55 83.89C285.4 78.66 280.04 36.81 283.67 25.03Z"
						id="iso-51"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M268.14 35.87C256.58 30.99 244.5 32.69 231.56 42.92"
						id="a3GVDWJbDP"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M162.99 78.92C155.44 56.79 208.53 29.4 217.53 48.83C223.45 61.63 222.12 95.6 209.45 102.66C195.11 110.66 168.26 94.34 162.99 78.92Z"
						id="iso-52"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M203.98 57.36C195.15 57.99 187.9 57.2 177.49 70.46"
						id="c1vrzH7GD"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M167.61 91.64C160 85.76 147.33 87.27 138.76 91.64C129.14 96.55 122.74 107.49 119.75 117.87C117.02 127.34 121.8 149.48 131.55 148.03C152.21 144.97 173.61 155.55 179.41 136.89C184.52 120.47 179.94 101.17 167.61 91.64Z"
						id="iso-53"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M154.74 98.87C134.65 102.43 131.01 118.38 129.96 129.93"
						id="b2KyfohhGJ"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M160.25 299.21C153.08 319.08 132.59 330.79 109.93 326.07C90.3 321.98 77.77 311.21 73.16 284.63C68.83 259.7 65.64 230.04 110.26 230.03C152.64 230.02 175.8 256.19 160.25 299.21Z"
						id="iso-55"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M140.24 246.95C133.89 249.1 122.94 247.7 121.5 254.77C121.31 255.71 119.77 263.24 119.58 264.19C123.56 267.1 130.76 263.92 136.55 263.41C136.52 263.84 117.33 270.52 117.17 270.59C115.25 271.46 110.5 284.98 114.91 291.31C123.18 296.49 132.35 292.13 140.91 292.27C132.74 293.97 121.04 295.45 120.29 297.59C118.96 304.68 117.73 310.3 116.49 315.83C116.5 309.53 117.82 302.85 113.51 297.78C102.66 295.08 102.28 296.93 96.62 297.37C102.1 295.51 105.39 290.93 107.52 284.91C109.52 276.83 107.69 276.44 106.81 274.14C100.84 271.96 97.65 275.37 93.18 275.71C98.97 273.14 105.77 269.9 110.67 266.04C116.38 261.54 109.25 255.86 104.15 250.75C110.81 249.27 117.83 249.45 122.46 238.74C123.72 246.83 132.52 245.46 140.24 246.95Z"
						id="a882cHHUnK"
					/>
					<text
						id="akcTcyEBf"
						x="214.21"
						y="10.52"
						fontSize="45"
						transform="matrix(1 0 0 1 57.26261763263433 1.5673836060602813)"
					>
						<tspan
							x="214.21"
							dy="0em"
							dominantBaseline="text-before-edge"
						/>
					</text>
					<path
						style={{ cursor: "pointer" }}
						d="M106.01 151.25C106.01 151.25 93.48 151.89 87.76 169.07C85.97 174.45 93.87 183.09 91.29 189.25C86.15 201.51 89.38 219.48 99.74 224.3C106.99 227.67 119.41 226.45 125.39 226.5C141.57 226.65 151.59 219.29 159.5 209.78C169.41 197.85 166.37 177.65 157.41 164.39C146.36 155.88 120.62 153.92 106.01 151.25Z"
						id="iso-54"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M130.51 183.51C133.62 186.21 140.69 182.49 145.71 181.43C144.22 182.4 132.32 190.23 130.83 191.2C125.18 199.54 127.13 206.71 126.18 214.71C122.69 213.71 119.33 217.46 115.99 221.85C116.97 217.17 122.12 210.23 117.72 208.45C116.98 208.75 113.3 210.22 106.68 212.88C113.62 207.23 117.47 204.1 118.24 203.47C118.24 203.47 121.47 196.48 118.96 197.5C116.45 198.53 105.08 195.27 105.08 195.27C105.08 195.27 116.83 196.57 121.65 190.91C126.47 185.25 126.7 181.74 127.47 177.82C128.25 173.9 127.84 169.96 130.05 167.14C131.99 164.64 138.23 163.16 138.23 163.16C134.35 170.11 131.23 176.96 130.51 183.51Z"
						id="cwHRvgNcf"
					/>
					<text
						id="b1QRjJGSJn"
						x="214.21"
						y="10.52"
						fontSize="45"
						transform="matrix(1 0 0 1 28.026439084936285 179.44872859690972)"
					>
						<tspan
							x="214.21"
							dy="0em"
							dominantBaseline="text-before-edge"
						/>
					</text>
					<text
						id="aQ4GDm7Nj"
						x="214.21"
						y="10.52"
						fontSize="45"
						transform="matrix(1 0 0 1 45.182689084936285 195.07372859690972)"
					>
						<tspan
							x="214.21"
							dy="0em"
							dominantBaseline="text-before-edge"
						/>
					</text>
					<text
						id="c1Am1SRnuf"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 9.499999999999972 -13.818655303030482)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[51].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							E
						</tspan>
					</text>
					<text
						id="a1wTSzo241"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 -27.54545454545476 -3.3489583333335986)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[52].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							D
						</tspan>
					</text>
					<text
						id="dngiuIzIj"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 -60.114216486779355 29.63351517487976)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[53].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							C
						</tspan>
					</text>
					<text
						id="aPscZuMW"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 -71.54390398677936 81.17930349069081)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[54].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							B
						</tspan>
					</text>
					<text
						id="evESRjLHU"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 -73.54390398677938 163.84957592658844)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[55].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							A
						</tspan>
					</text>
					<path
						style={{ cursor: "pointer" }}
						d="M310.94 25.03C317.11 12.12 384.01 22.81 379.24 37.87C370.93 64.15 351.36 89.77 329.06 83.89C309.21 78.66 314.56 36.81 310.94 25.03Z"
						id="iso-61"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M326.46 35.87C338.02 30.99 350.11 32.69 363.05 42.92"
						id="h1eFc4drSD"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M431.61 78.92C439.17 56.79 386.08 29.4 377.08 48.83C371.15 61.63 372.49 95.6 385.15 102.66C399.5 110.66 426.35 94.34 431.61 78.92Z"
						id="iso-62"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M390.63 57.36C399.45 57.99 406.71 57.2 417.12 70.46"
						id="f8TlGPwTJ"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M426.99 91.64C434.6 85.76 447.28 87.27 455.84 91.64C465.46 96.55 471.87 107.49 474.86 117.87C477.59 127.34 472.81 149.48 463.06 148.03C442.39 144.97 421 155.55 415.19 136.89C410.09 120.47 414.66 101.17 426.99 91.64Z"
						id="iso-63"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M439.87 98.87C459.96 102.43 463.6 118.38 464.65 129.93"
						id="a4D4emNiDi"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M430.01 299.21C437.19 319.08 457.68 330.79 480.34 326.07C499.97 321.98 512.5 311.21 517.11 284.63C521.44 259.7 524.62 230.04 480.01 230.03C437.63 230.02 414.47 256.19 430.01 299.21Z"
						id="iso-65"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M450.03 246.95C456.38 249.1 467.33 247.7 468.77 254.77C468.96 255.71 470.49 263.24 470.69 264.19C466.71 267.1 459.51 263.92 453.72 263.41C453.75 263.84 472.94 270.52 473.1 270.59C475.02 271.46 479.77 284.98 475.35 291.31C467.09 296.49 457.92 292.13 449.36 292.27C457.53 293.97 469.23 295.45 469.98 297.59C471.3 304.68 472.54 310.3 473.78 315.83C473.77 309.53 472.45 302.85 476.76 297.78C487.61 295.08 487.99 296.93 493.65 297.37C488.17 295.51 484.88 290.93 482.75 284.91C480.75 276.83 482.58 276.44 483.46 274.14C489.43 271.96 492.62 275.37 497.09 275.71C491.3 273.14 484.5 269.9 479.59 266.04C473.89 261.54 481.02 255.86 486.12 250.75C479.46 249.27 472.44 249.45 467.81 238.74C466.55 246.83 457.75 245.46 450.03 246.95Z"
						id="d9AQUN9l"
					/>
					<text
						id="c2wMTLwFKC"
						x="214.21"
						y="10.52"
						fontSize="45"
						transform="matrix(-1 0 0 1 537.3434429734264 1.5673836060602813)"
					>
						<tspan
							x="214.21"
							dy="0em"
							dominantBaseline="text-before-edge"
						/>
					</text>
					<path
						style={{ cursor: "pointer" }}
						d="M484.26 151.25C484.26 151.25 496.79 151.89 502.51 169.07C504.29 174.45 496.4 183.09 498.98 189.25C504.12 201.51 500.89 219.48 490.53 224.3C483.28 227.67 470.86 226.45 464.88 226.5C448.7 226.65 438.68 219.29 430.77 209.78C420.86 197.85 423.9 177.65 432.86 164.39C443.91 155.88 469.65 153.92 484.26 151.25Z"
						id="iso-64"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M459.76 183.51C456.65 186.21 449.57 182.49 444.56 181.43C446.05 182.4 457.95 190.23 459.44 191.2C465.09 199.54 463.14 206.71 464.08 214.71C467.58 213.71 470.93 217.46 474.28 221.85C473.3 217.17 468.14 210.23 472.55 208.45C473.29 208.75 476.97 210.22 483.59 212.88C476.65 207.23 472.8 204.1 472.03 203.47C472.03 203.47 468.8 196.48 471.31 197.5C473.82 198.53 485.19 195.27 485.19 195.27C485.19 195.27 473.44 196.57 468.62 190.91C463.8 185.25 463.57 181.74 462.8 177.82C462.02 173.9 462.43 169.96 460.22 167.14C458.27 164.64 452.04 163.16 452.04 163.16C455.92 170.11 459.04 176.96 459.76 183.51Z"
						id="g9i5HslOD"
					/>
					<text
						id="a3vLld1187"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 80.0303030303032 -16.8489583333336)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[61].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							F
						</tspan>
					</text>
					<text
						id="d8C077TiQe"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(0.9999643816274039 -0.00844011116774232 0.00844011116774232 0.9999643816274039 118.8765401877632 3.6746787627775532)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[62].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							G
						</tspan>
					</text>
					<text
						id="a3dsbSynl2"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 147.53030303030368 32.74195075757564)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[63].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							H
						</tspan>
					</text>
					<text
						id="c3i2cqy5i8"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 154.65196824741906 71.6076251690125)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[64].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							I
						</tspan>
					</text>
					<text
						id="c2Gq2EB8T"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 154.651968247419 163.84957592658844)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[65].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							J
						</tspan>
					</text>
					<path
						style={{ cursor: "pointer" }}
						d="M279.53 622.47C276.07 633.75 231.24 627.41 233.67 614.36C237.9 591.57 249.62 568.89 264.68 572.98C278.08 576.62 276.56 612.57 279.53 622.47Z"
						id="iso-81"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M268.73 613.87C261.31 618.51 253.22 617.56 244.15 609.37"
						id="baO5m8gAJ"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M176.01 582.48C170.09 605.02 222.03 629.2 229.47 609.27C234.38 596.14 231.19 562.31 218.76 556.01C204.69 548.89 180.13 566.77 176.01 582.48Z"
						id="iso-82"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M216.13 601.56C207.72 601.46 200.88 602.68 190.24 590.06"
						id="b1OuMQtEP6"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M181.67 570C174.78 576.32 162.66 575.57 154.29 571.72C144.88 567.39 138.18 556.85 134.75 546.67C131.63 537.38 134.91 515 144.25 515.86C164.03 517.69 183.74 505.85 190.31 524.14C196.08 540.22 192.84 559.75 181.67 570Z"
						id="iso-83"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M169.04 563.56C149.77 561.2 145.41 545.49 143.76 534.03"
						id="b2roP7vEXi"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M161.75 365.13C153.81 345.73 133.7 335.25 112.46 341.31C94.06 346.56 82.78 358.06 79.91 384.87C77.21 410.02 75.86 439.81 118.21 437.16C158.44 434.65 178.94 407.15 161.75 365.13Z"
						id="iso-85"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M145.71 418.49C139.56 416.72 129.24 418.77 127.48 411.8C127.24 410.87 125.36 403.44 125.13 402.51C128.74 399.37 135.75 402.12 141.27 402.27C141.22 401.85 122.63 396.32 122.47 396.26C120.6 395.51 115.33 382.29 119.16 375.71C126.71 370.05 135.66 373.86 143.78 373.21C135.93 372 124.74 371.22 123.91 369.13C122.25 362.13 120.75 356.59 119.27 351.14C119.63 357.43 121.27 364.02 117.46 369.34C107.31 372.69 106.85 370.86 101.45 370.76C106.76 372.29 110.14 376.66 112.5 382.54C114.86 390.49 113.14 390.99 112.44 393.33C106.89 395.87 103.67 392.66 99.41 392.58C105.06 394.8 111.69 397.63 116.57 401.2C122.24 405.34 115.79 411.44 111.24 416.84C117.64 417.92 124.3 417.32 129.3 427.74C130.03 419.59 138.46 420.44 145.71 418.49Z"
						id="avxQ9BjFX"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M118.64 516.06C118.64 516.06 106.71 516.17 100.31 499.36C98.31 494.09 105.31 485 102.51 479C96.94 467.07 98.99 448.94 108.55 443.51C115.24 439.71 127.1 440.19 132.77 439.78C148.12 438.68 158.04 445.42 166.09 454.45C176.18 465.76 174.44 486.11 166.69 499.88C156.67 509.03 132.35 512.52 118.64 516.06Z"
						id="iso-84"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M140.06 482.4C142.87 479.52 149.79 482.81 154.61 483.57C153.14 482.68 141.41 475.58 139.94 474.7C134.1 466.71 135.54 459.43 134.19 451.51C130.94 452.71 127.54 449.17 124.12 444.99C125.31 449.6 130.59 456.22 126.51 458.26C125.8 458.01 122.22 456.75 115.78 454.49C122.69 459.72 126.53 462.62 127.29 463.2C127.29 463.2 130.76 469.99 128.31 469.11C125.87 468.24 115.26 472.17 115.26 472.17C115.26 472.17 126.35 470.17 131.24 475.53C136.13 480.9 136.55 484.39 137.51 488.26C138.46 492.12 138.3 496.08 140.56 498.77C142.54 501.14 148.55 502.25 148.55 502.25C144.47 495.55 141.12 488.89 140.06 482.4Z"
						id="a5EcJWHaOD"
					/>
					<text
						id="a1jKNA7rAN"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 9.128496503496507 445.10453088578424)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[81].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							P
						</tspan>
					</text>
					<text
						id="aAHeijBe5"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 -25.137128496503493 430.50453088578445)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[82].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							Q
						</tspan>
					</text>
					<text
						id="ek5cw6Hgp"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 -53.026333041958225 396.11494755245076)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[83].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							R
						</tspan>
					</text>
					<text
						id="g2rNJx6rxS"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 -66.3451977036963 352.9505417835022)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[84].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							S
						</tspan>
					</text>
					<text
						id="d14UMdDj6N"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 -71.62851406792367 265.32019716321423)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[85].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							T
						</tspan>
					</text>
					<path
						style={{ cursor: "pointer" }}
						d="M309.33 622.47C312.79 633.75 357.62 627.41 355.2 614.36C350.96 591.57 339.24 568.89 324.18 572.98C310.78 576.62 312.3 612.57 309.33 622.47Z"
						id="iso-71"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M320.14 613.87C327.56 618.51 335.65 617.56 344.71 609.37"
						id="f1SexwZEcq"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M412.85 582.48C418.77 605.02 366.83 629.2 359.39 609.27C354.49 596.14 357.68 562.31 370.1 556.01C384.17 548.89 408.73 566.77 412.85 582.48Z"
						id="iso-72"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M372.73 601.56C381.14 601.46 387.98 602.68 398.62 590.06"
						id="b9tcVaTZ"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M407.19 570C414.08 576.32 426.2 575.57 434.58 571.72C443.98 567.39 450.69 556.85 454.11 546.67C457.23 537.38 453.95 515 444.62 515.86C424.83 517.69 405.12 505.85 398.55 524.14C392.78 540.22 396.03 559.75 407.19 570Z"
						id="iso-73"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M419.82 563.56C439.09 561.2 443.45 545.49 445.1 534.03"
						id="hdg0tmh2L"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M427.56 365.13C435.5 345.73 455.61 335.25 476.85 341.31C495.25 346.56 506.53 358.06 509.4 384.87C512.1 410.02 513.45 439.81 471.1 437.16C430.87 434.65 410.37 407.15 427.56 365.13Z"
						id="iso-75"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M443.6 418.49C449.75 416.72 460.06 418.77 461.83 411.8C462.06 410.87 463.95 403.44 464.18 402.51C460.57 399.37 453.56 402.12 448.04 402.27C448.09 401.85 466.68 396.32 466.84 396.26C468.7 395.51 473.98 382.29 470.15 375.71C462.6 370.05 453.65 373.86 445.53 373.21C453.38 372 464.57 371.22 465.4 369.13C467.06 362.13 468.56 356.59 470.04 351.14C469.68 357.43 468.04 364.02 471.85 369.34C481.99 372.69 482.46 370.86 487.86 370.76C482.55 372.29 479.17 376.66 476.81 382.54C474.45 390.49 476.17 390.99 476.87 393.33C482.41 395.87 485.64 392.66 489.9 392.58C484.25 394.8 477.62 397.63 472.74 401.2C467.07 405.34 473.52 411.44 478.07 416.84C471.67 417.92 465.01 417.32 460.01 427.74C459.28 419.59 450.84 420.44 443.6 418.49Z"
						id="h46WoT2rhW"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M470.67 516.06C470.67 516.06 482.6 516.17 489 499.36C491 494.09 483.99 485 486.8 479C492.37 467.07 490.32 448.94 480.76 443.51C474.06 439.71 462.21 440.19 456.53 439.78C441.19 438.68 431.26 445.42 423.22 454.45C413.13 465.76 414.87 486.11 422.62 499.88C432.64 509.03 456.96 512.52 470.67 516.06Z"
						id="iso-74"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M449.24 482.4C446.44 479.52 439.52 482.81 434.7 483.57C436.17 482.68 447.9 475.58 449.37 474.7C455.21 466.71 453.76 459.43 455.11 451.51C458.37 452.71 461.77 449.17 465.19 444.99C464 449.6 458.71 456.22 462.8 458.26C463.51 458.01 467.09 456.75 473.53 454.49C466.62 459.72 462.78 462.62 462.02 463.2C462.02 463.2 458.55 469.99 461 469.11C463.44 468.24 474.05 472.17 474.05 472.17C474.05 472.17 462.96 470.17 458.07 475.53C453.18 480.9 452.76 484.39 451.8 488.26C450.84 492.12 451.01 496.08 448.75 498.77C446.76 501.14 440.76 502.25 440.76 502.25C444.84 495.55 448.19 488.89 449.24 482.4Z"
						id="a4VwzCcbws"
					/>
					<text
						id="a253G7JNHZ"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 72.42849650349658 445.10453088578436)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[71].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							O
						</tspan>
					</text>
					<text
						id="dgSWNXQt1"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 135.69999271561827 396.11494755245076)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[73].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							N
						</tspan>
					</text>
					<text
						id="b1fKZ8Bv2u"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 110.36287150349685 430.50453088578445)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[72].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							M
						</tspan>
					</text>
					<text
						id="b83Atca9Z"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 147.12968021561827 350.3920846156701)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[74].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							L
						</tspan>
					</text>
					<text
						id="hfHo0NDB3"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 154.3272936186599 258.43678158536613)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[75].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							K
						</tspan>
					</text>
				</defs>
				<g className="main">
					<g className="q5">
						<g className="1" onClick={() => this.props.onClick(51)}>
							<g>
								<use
									xlinkHref="#iso-51"
									fill={conditionToColor(
										this.props.teeth[51].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-51"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="10"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#a3GVDWJbDP"
									opacity="1"
									fillOpacity="0"
								/>
								<g>
									<use
										xlinkHref="#a3GVDWJbDP"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="10"
									/>
								</g>
							</g>
						</g>
						<g className="2" onClick={() => this.props.onClick(52)}>
							<g>
								<use
									xlinkHref="#iso-52"
									fill={conditionToColor(
										this.props.teeth[52].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-52"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="10"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#c1vrzH7GD"
									opacity="1"
									fillOpacity="0"
								/>
								<g>
									<use
										xlinkHref="#c1vrzH7GD"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="10"
									/>
								</g>
							</g>
						</g>
						<g className="3" onClick={() => this.props.onClick(53)}>
							<g>
								<use
									xlinkHref="#iso-53"
									fill={conditionToColor(
										this.props.teeth[53].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-53"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="10"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#b2KyfohhGJ"
									opacity="1"
									fillOpacity="0"
								/>
								<g>
									<use
										xlinkHref="#b2KyfohhGJ"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="10"
									/>
								</g>
							</g>
						</g>
						<g className="4" onClick={() => this.props.onClick(54)}>
							<g>
								<use
									xlinkHref="#iso-54"
									fill={conditionToColor(
										this.props.teeth[54].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-54"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="10"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#cwHRvgNcf"
									opacity="1"
									fill="#000"
								/>
								<g>
									<use
										xlinkHref="#cwHRvgNcf"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="0"
									/>
								</g>
							</g>
						</g>
						<g className="5" onClick={() => this.props.onClick(55)}>
							<g>
								<use
									xlinkHref="#iso-55"
									fill={conditionToColor(
										this.props.teeth[55].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-55"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="10"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#a882cHHUnK"
									opacity="1"
									fill="#000"
								/>
								<g>
									<use
										xlinkHref="#a882cHHUnK"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="0"
									/>
								</g>
							</g>
						</g>
						<g className="text">
							<g id="ch2ZdTfb">
								<use
									xlinkHref="#c1Am1SRnuf"
									opacity="1"
									fill="#000"
								/>
							</g>
							<g id="aVfNqKx3C">
								<use
									xlinkHref="#a1wTSzo241"
									opacity="1"
									fill="#000"
								/>
							</g>
							<g id="c14SVdlY4">
								<use
									xlinkHref="#dngiuIzIj"
									opacity="1"
									fill="#000"
								/>
							</g>
							<g id="b17vJJzkit">
								<use
									xlinkHref="#aPscZuMW"
									opacity="1"
									fill="#000"
								/>
							</g>
							<g id="bUzQYBN8P">
								<use
									xlinkHref="#evESRjLHU"
									opacity="1"
									fill="#000"
								/>
							</g>
						</g>
					</g>
					<g className="g6">
						<g className="1" onClick={() => this.props.onClick(61)}>
							<g>
								<use
									xlinkHref="#iso-61"
									fill={conditionToColor(
										this.props.teeth[61].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-61"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="10"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#h1eFc4drSD"
									opacity="1"
									fillOpacity="0"
								/>
								<g>
									<use
										xlinkHref="#h1eFc4drSD"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="10"
									/>
								</g>
							</g>
						</g>
						<g className="2" onClick={() => this.props.onClick(62)}>
							<g>
								<use
									xlinkHref="#iso-62"
									fill={conditionToColor(
										this.props.teeth[62].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-62"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="10"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#f8TlGPwTJ"
									opacity="1"
									fillOpacity="0"
								/>
								<g>
									<use
										xlinkHref="#f8TlGPwTJ"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="10"
									/>
								</g>
							</g>
						</g>
						<g className="3" onClick={() => this.props.onClick(63)}>
							<g>
								<use
									xlinkHref="#iso-63"
									fill={conditionToColor(
										this.props.teeth[63].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-63"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="10"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#a4D4emNiDi"
									opacity="1"
									fillOpacity="0"
								/>
								<g>
									<use
										xlinkHref="#a4D4emNiDi"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="10"
									/>
								</g>
							</g>
						</g>
						<g className="4" onClick={() => this.props.onClick(64)}>
							<g>
								<use
									xlinkHref="#iso-64"
									fill={conditionToColor(
										this.props.teeth[64].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-64"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="10"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#g9i5HslOD"
									opacity="1"
									fill="#000"
								/>
								<g>
									<use
										xlinkHref="#g9i5HslOD"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="0"
									/>
								</g>
							</g>
						</g>
						<g className="5" onClick={() => this.props.onClick(65)}>
							<g>
								<use
									xlinkHref="#iso-65"
									fill={conditionToColor(
										this.props.teeth[65].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-65"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="10"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#d9AQUN9l"
									opacity="1"
									fill="#000"
								/>
								<g>
									<use
										xlinkHref="#d9AQUN9l"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="0"
									/>
								</g>
							</g>
						</g>
						<g className="text">
							<g id="d2U4NC4l2h">
								<use
									xlinkHref="#a3vLld1187"
									opacity="1"
									fill="#000"
								/>
							</g>
							<g id="chkNbUqVc">
								<use
									xlinkHref="#d8C077TiQe"
									opacity="1"
									fill="#000"
								/>
							</g>
							<g id="e29QMOL8fU">
								<use
									xlinkHref="#a3dsbSynl2"
									opacity="1"
									fill="#000"
								/>
							</g>
							<g id="a2UkPZ9kt7">
								<use
									xlinkHref="#c3i2cqy5i8"
									opacity="1"
									fill="#000"
								/>
							</g>
							<g id="b1ItOC0t1y">
								<use
									xlinkHref="#c2Gq2EB8T"
									opacity="1"
									fill="#000"
								/>
							</g>
						</g>
					</g>
					<g className="q7">
						<g className="1" onClick={() => this.props.onClick(71)}>
							<g>
								<use
									xlinkHref="#iso-71"
									fill={conditionToColor(
										this.props.teeth[71].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-71"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="10"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#f1SexwZEcq"
									opacity="1"
									fillOpacity="0"
								/>
								<g>
									<use
										xlinkHref="#f1SexwZEcq"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="10"
									/>
								</g>
							</g>
						</g>
						<g className="2" onClick={() => this.props.onClick(72)}>
							<g>
								<use
									xlinkHref="#iso-72"
									fill={conditionToColor(
										this.props.teeth[72].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-72"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="10"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#b9tcVaTZ"
									opacity="1"
									fillOpacity="0"
								/>
								<g>
									<use
										xlinkHref="#b9tcVaTZ"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="10"
									/>
								</g>
							</g>
						</g>
						<g className="3" onClick={() => this.props.onClick(73)}>
							<g>
								<use
									xlinkHref="#iso-73"
									fill={conditionToColor(
										this.props.teeth[73].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-73"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="10"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#hdg0tmh2L"
									opacity="1"
									fillOpacity="0"
								/>
								<g>
									<use
										xlinkHref="#hdg0tmh2L"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="10"
									/>
								</g>
							</g>
						</g>
						<g className="4" onClick={() => this.props.onClick(74)}>
							<g>
								<use
									xlinkHref="#iso-74"
									fill={conditionToColor(
										this.props.teeth[74].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-74"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="10"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#a4VwzCcbws"
									opacity="1"
									fill="#000"
								/>
								<g>
									<use
										xlinkHref="#a4VwzCcbws"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="0"
									/>
								</g>
							</g>
						</g>
						<g className="5" onClick={() => this.props.onClick(75)}>
							<g>
								<use
									xlinkHref="#iso-75"
									fill={conditionToColor(
										this.props.teeth[75].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-75"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="10"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#h46WoT2rhW"
									opacity="1"
									fill="#000"
								/>
								<g>
									<use
										xlinkHref="#h46WoT2rhW"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="0"
									/>
								</g>
							</g>
						</g>
						<g className="text">
							<g id="bbGVcBKeK">
								<use
									xlinkHref="#a253G7JNHZ"
									opacity="1"
									fill="#000"
								/>
							</g>
							<g id="a2LizwfKkt">
								<use
									xlinkHref="#dgSWNXQt1"
									opacity="1"
									fill="#000"
								/>
							</g>
							<g id="a1dli2uYZu">
								<use
									xlinkHref="#b1fKZ8Bv2u"
									opacity="1"
									fill="#000"
								/>
							</g>
							<g id="aCcMzwUXK">
								<use
									xlinkHref="#b83Atca9Z"
									opacity="1"
									fill="#000"
								/>
							</g>
							<g id="b1Rz4H5VcT">
								<use
									xlinkHref="#hfHo0NDB3"
									opacity="1"
									fill="#000"
								/>
							</g>
						</g>
					</g>
					<g className="q8">
						<g className="1" onClick={() => this.props.onClick(81)}>
							<g>
								<use
									xlinkHref="#iso-81"
									fill={conditionToColor(
										this.props.teeth[81].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-81"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="10"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#baO5m8gAJ"
									opacity="1"
									fillOpacity="0"
								/>
								<g>
									<use
										xlinkHref="#baO5m8gAJ"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="10"
									/>
								</g>
							</g>
						</g>
						<g className="2" onClick={() => this.props.onClick(82)}>
							<g>
								<use
									xlinkHref="#iso-82"
									fill={conditionToColor(
										this.props.teeth[82].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-82"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="10"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#b1OuMQtEP6"
									opacity="1"
									fillOpacity="0"
								/>
								<g>
									<use
										xlinkHref="#b1OuMQtEP6"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="10"
									/>
								</g>
							</g>
						</g>
						<g className="3" onClick={() => this.props.onClick(83)}>
							<g>
								<use
									xlinkHref="#iso-83"
									fill={conditionToColor(
										this.props.teeth[83].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-83"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="10"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#b2roP7vEXi"
									opacity="1"
									fillOpacity="0"
								/>
								<g>
									<use
										xlinkHref="#b2roP7vEXi"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="10"
									/>
								</g>
							</g>
						</g>
						<g className="4" onClick={() => this.props.onClick(84)}>
							<g>
								<use
									xlinkHref="#iso-84"
									fill={conditionToColor(
										this.props.teeth[84].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-84"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="10"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#a5EcJWHaOD"
									opacity="1"
									fill="#000"
								/>
								<g>
									<use
										xlinkHref="#a5EcJWHaOD"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="0"
									/>
								</g>
							</g>
						</g>
						<g className="5" onClick={() => this.props.onClick(85)}>
							<g>
								<use
									xlinkHref="#iso-85"
									fill={conditionToColor(
										this.props.teeth[85].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-85"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="10"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#avxQ9BjFX"
									opacity="1"
									fill="#000"
								/>
								<g>
									<use
										xlinkHref="#avxQ9BjFX"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="0"
									/>
								</g>
							</g>
						</g>
						<g className="text">
							<g id="e17J4GcJHT">
								<use
									xlinkHref="#a1jKNA7rAN"
									opacity="1"
									fill="#000"
								/>
							</g>
							<g id="a1vZchl36W">
								<use
									xlinkHref="#aAHeijBe5"
									opacity="1"
									fill="#000"
								/>
							</g>
							<g id="a1LXneLur">
								<use
									xlinkHref="#ek5cw6Hgp"
									opacity="1"
									fill="#000"
								/>
							</g>
							<g id="btsq7lcvc">
								<use
									xlinkHref="#g2rNJx6rxS"
									opacity="1"
									fill="#000"
								/>
							</g>
							<g id="dber0XavM">
								<use
									xlinkHref="#d14UMdDj6N"
									opacity="1"
									fill="#000"
								/>
							</g>
						</g>
					</g>
				</g>
			</svg> */}
      </>
    );
  }
}

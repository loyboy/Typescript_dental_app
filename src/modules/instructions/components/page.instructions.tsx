import { Col, DataTableComponent, ProfileSquaredComponent, Row, SectionComponent } from "@common-components";
import { router, text, user } from "@core";
import { itemFormToString, InstructionItem,  instructions, stringToItemForm } from "@modules";
import { num } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { Dropdown, IconButton, Panel, PanelType, TextField } from "office-ui-fabric-react";
import {  Dialog, DialogType, DialogFooter, PrimaryButton, DefaultButton } from "office-ui-fabric-react";
import * as React from "react";
import ReactToPrint from "react-to-print";
@observer
export class InstructionsPage extends React.Component<{}, {}> {
	@observable showMenu: boolean = true;

	@observable selectedID: string = router.currentLocation.split("/")[1];

	@computed
	get selectedIndex() {
		return instructions.list.findIndex(x => x._id === this.selectedID);
	}

	@computed
	get selectedInstruction() {
		return instructions.list[this.selectedIndex];
	}

	@computed get canEdit() {
		return user.currentUser.canEditInstructions;
	}

	render() {
		return (
			<div className="pc-pg p-15 p-l-10 p-r-10">
				<DataTableComponent
				
					onDelete={
						this.canEdit
							? id => {
									instructions.deleteModal(id);
							  }
							: undefined
					}
					commands={
						this.canEdit
							? [
									{
										key: "addNew",
										title: "Add new",
										name: text("Add new"),
										onClick: () => {
											const instruction = new InstructionItem();
											instructions.list.push(
												instruction
											);
											this.selectedID = instruction._id;
										},
										iconProps: {
											iconName: "Add"
										}
									}
							  ]
							: []
					}
					heads={[
						text("Instruction Title"),
						//text("Instruction Notes")
					]}
					rows={instructions.list.map(instr => {
						return {
							id: instr._id,
							searchableString: instr.searchableString,
							cells: [
								{
									dataValue: instr.name,
									component: (
										<span>
											{instr.name}
										</span>
									),
									onClick: () => {
										this.selectedID = instr._id;
									},
									className: "no-label"
								},
							/*	{
									dataValue: instr.notes,
									component: (
										<span>
											{instr.notes} 
										</span>
									),
									className: "hidden-xs"
								},*/
								{
								dataValue: instr.notes,
									component: 
									<ReactToPrint
									  onBeforeGetContent={()=>{
										return new Promise( (resolve, reject) => {
											this.selectedID = instr._id;
										this.setState({
										//   currentEditReportId: String(index),
										//   newReportValue: report,
										//   title: report.title,
										//   printReport: JSON.parse(report.report).blocks[0].text,d
										}, () => resolve());
									  })
									}}
										trigger={() => 
										<IconButton
										  className="action-button edit"
										  style={{ float: 'right', right: '-85%' }}
										  iconProps={{
											iconName: "print"
										  }}
										  onClick={(event) =>
											console.log('hiiiiiiiii ++++') 
											}
										  
										/>
										  }
										content={() => this.componentRef}
									  />,
									className: "hidden-xs"
										}
								
							
							]
						};
					})}
					maxItemsOnLoad={20}
				/>

				{this.selectedInstruction ? (
					<Panel
						isOpen={!!this.selectedInstruction}
						type={PanelType.medium}
						closeButtonAriaLabel="Close"
						isLightDismiss={true}
						onDismiss={() => {
							this.selectedID = "";
						}}
					>
						<PrintComp  ref={el => (this.componentRef = el)}>
						<div className="prescription-editor">
							<SectionComponent
								title={text("Instruction Details")}
							>
								<TextField
									label={text("Instruction name")}
									value={this.selectedInstruction.name}
									onChange={(ev, val) =>
										(instructions.list[
											this.selectedIndex
										].name = val!)
									}
									disabled={!this.canEdit}
								/>
								
								 <TextField label="Notes" multiline rows={4} value={this.selectedInstruction.notes.toString()}  
									onChange={(ev, val) =>
										(instructions.list[
											this.selectedIndex
										].notes = val!)
									} />
									
							</SectionComponent>
						</div>
						</PrintComp>
					</Panel>
				) : (
					""
				)}
			</div>
		);
	}
}
class PrintComp extends React.Component{
	render(){
		return(
			this.props.children
		)
	}
}

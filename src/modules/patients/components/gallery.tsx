import { fileTypes, PickAndUploadComponent, SectionComponent } from "@common-components";
import { files, GALLERIES_DIR, status, text, user } from "@core";
import { Patient, setting } from "@modules";
import { diff } from "fast-array-diff";
import { computed, observable, observe } from "mobx";
import { observer } from "mobx-react";
import { Icon, IconButton, MessageBar, MessageBarType, TooltipHost } from "office-ui-fabric-react";
import { Slider } from 'office-ui-fabric-react/lib/Slider';
import * as React from "react";
// import {
// 	Magnifier,
// 	MOUSE_ACTIVATION,
// 	TOUCH_ACTIVATION,
//   } from "react-image-magnifiers";
// @ts-ignore
import PinchZoomPan from "react-responsive-pinch-zoom-pan";

export interface ISliderBasicExampleState {
	value: number;
	zoom: number;
	startPosX: number;
	startPosY: number;
	endPosX: number;
	endPosY: number;
	thermal: number;
}


@observer
export class PatientGalleryPanel extends React.Component<
	{ patient: Patient },
	{}
> {



	@computed get canEdit() {
		// return user.currentUser.canEditPatients;
		return true
	}

	@observable uploading: boolean = false;

	@observable selectedImagePath: string = "";

	@observable imagesTable: { [key: string]: string } = {};

	@computed get selectedImageURI() {
		return this.imagesTable[this.selectedImagePath];
	}

	stopObservation: () => void = function() {};

	public state: ISliderBasicExampleState = { 
		value: 0, 
		zoom: 1, 
		startPosX: 0, 
		startPosY: 0, 
		endPosX: 0, 
		endPosY: 0,
		thermal: 1,
	};

	render() {
		//console.log('status: ', status);
		// const { endPosX: x2, endPosY: y2, startPosX: x1, startPosY: y1, zoom } = this.state;
		// let bgWidth = 430;

		// let movePercentage = {
		// 	x: 100 * (x2 - x1) / bgWidth,
		// 	y: 100 * (y2 - y1) / bgWidth,
		// };

		// let actualMovePercentage = {
		// 	// x: 0.7 / (1 - zoom / 100) * movePercentage.x,
		// 	// y: 0.7 / (1 - zoom / 100) * movePercentage.y,
		// 	x: movePercentage.x,
		// 	y: movePercentage.y,
		// };

		//console.log(actualMovePercentage);
		var { zoom, value } = this.state;
		var elm = document.getElementById("elementID");

		  const onChangeZoomSlider = () => {
			 var el = document.getElementById("elementID");
			  if(el.style.transform) {
				  const str = el.style.transform;
				  const str2 = str.split('scale')[0];
				  const finalStr = el.style['transform'] = str2 + ` ` + `scale(${this.state.zoom}) !important`];
				  console.log('str2', finalStr)
				  const valueScal = this.state.zoom/10 < 1 ? 0.9 :  this.state.zoom/10;
				  return document.getElementById("elementID").style.transform = str2 + ` ` + `scale(${valueScal})`;
	  
			  }
		  }

		  // stop scrolling while pointer is on image start here

		  var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function () { supportsPassive = true; } 
  }));
} catch(e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';	

		  function disableScrolling(){
			window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
			window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
			window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
			window.addEventListener('keydown', preventDefaultForScrollKeys, false);
		}
		
		function enableScrolling(){
			window.removeEventListener('DOMMouseScroll', preventDefault, false);
			window.removeEventListener(wheelEvent, preventDefault, wheelOpt); 
			window.removeEventListener('touchmove', preventDefault, wheelOpt);
			window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
		}
		// stop scrolling while pointer is on image end here
		// el.style.transform = `scale(1.1)`
		return (
			<SectionComponent title={text(`Patient Gallery`)}>
				{status.online || true ? (
					status.dropboxActive ? (
						<div className="spg-p">
							{this.props.patient.gallery.length === 0 ? (
								<MessageBar
									messageBarType={MessageBarType.info}
								>
									{text(
										"This patient does not seem to have any photo record uploaded, press the plus sign button below to start uploading"
									)}
								</MessageBar>
							) : (
								""
							)}
							<br />
							<div className="thumbs">
								{this.canEdit ? (
									this.uploading ? (
										<Icon
											iconName="sync"
											className="rotate"
											style={{ padding: 10 }}
										/>
									) : (
										<PickAndUploadComponent
											allowMultiple={true}
											patientId={this.props.patient._id}
											accept={fileTypes.image}
											onFinish={paths => {
												//console.log(paths);
												this.props.patient.gallery.push(
													...paths
												);
												paths.forEach(async path => {
													await this.addImage(path);
												})
											}}
											onStartLoading={() => {
												this.uploading = true;
											}}
											onFinishLoading={() => {
												this.uploading = false;
											}}
											targetDir={`${GALLERIES_DIR}/${
												this.props.patient._id
											}`}
										>
											<TooltipHost
												content={text("Add photo")}
											>
												<IconButton
													className={`add-photo`}
													iconProps={{
														iconName: "Photo2Add"
													}}
												/>
											</TooltipHost>
										</PickAndUploadComponent>
									)
								) : (
									""
								)}
								{Object.keys(this.imagesTable).map(
									imagePath => {
										const URI = this.imagesTable[imagePath];
										return URI ? (
											<span
												className={`thumb ${
													this.selectedImagePath ===
													imagePath
														? "selected"
														: ""
												}`}
												key={imagePath}
												style={{
													backgroundImage: `url('${
														URI ? URI : ""
													}')`,
													
												}}
												onClick={() => {
													this.selectedImagePath = imagePath;
												}}
											/>
										) : (
											<div
												key={imagePath + "-placeholder"}
												className="placeholder"
											>
												<Icon
													iconName="sync"
													className="rotate"
												/>
											</div>
										);
									}
								)}
							</div>
							
								<div className="viewport" 
								 //onMouseDown={e => this.setState({startPosX: e.clientX, startPosY: e.clientY})}
								 // ${ this.state.value } 
								 //onMouseUp={e => this.setState({endPosX: 0, endPosY: 0, startPosX: 0, startPosY: 0})}
								 //onMouseMove={e => {
									 //if(this.state.startPosX > 0 || this.state.startPosY > 0){
										//this.setState({endPosX:  e.pageX, endPosY: e.pageY})
									 //}
								 //}}
								 style={{
									 height: 300,
									 width: 430,
									//  filter: `grayscale( ${value > 1 ? value : 0} % )`
									//  backgroundImage: `url(${this.selectedImageURI})`,
									//  //backgroundPosition: `${50 - actualMovePercentage.x}% ${50 - actualMovePercentage.y}%`,
									//  backgroundPosition: `${215 - actualMovePercentage.x}% ${150 - actualMovePercentage.y}%`,
									//  backgroundSize: this.state.zoom > 0 ? `calc(430px + (430px * ${this.state.zoom}/100)) calc(300px + (300px * ${this.state.zoom}/100))` : 'cover',
									//  filter: `grayscale(${this.state.value}%)`,
									//  cursor: this.state.zoom > 0 ? 'move' : 'default',
									//  backgroundRepeat: 'no-repeat',
									filter: `grayscale( ${value > 1 ? value + '%' : 0 + '%'} ) brightness(1) saturate(${this.state.thermal}) blur(0.5px) contrast(1)`
								 }}
								 >
									 {this.selectedImagePath ? (
										 <>
										<IconButton
											className="delete-photo"
											iconProps={{ iconName: "trash" }}
											onClick={async () => {
												await this.removeImage(
													this.selectedImagePath
												);
												this.selectedImagePath = "";
											}}
										/>

										{/* <Magnifier
											imageSrc={`${this.selectedImageURI}`}
											imageAlt="Example"
											mouseActivation={MOUSE_ACTIVATION.DOUBLE_CLICK}
											largeImageSrc={this.state.image}
										/> */}

<PinchZoomPan maxScale={zoom} minScale={0.9} initialScale='auto' zoomButtons={false} doubleTapBehavior={"zoom"}
										// style={{
										// 					filter: `grayscale(${this.state.value}%)`,
										// 					cursor: this.state.zoom > 0 ? 'move' : 'default',
										// 				}}
														>
												
												<img alt='imagezz' onMouseEnter={disableScrolling} onMouseLeave={enableScrolling} id="elementID" src={`${this.selectedImageURI}`} style={{transform: `scale(${this.state.zoom/10})`,  filter:`brightness(1.5) saturate(${this.state.thermal}) blur(0.5px) contrast(1)`}} />
										 </PinchZoomPan>

										{/* <MagnifierContainer>
										<div className="example-class">
											<MagnifierPreview imageSrc="./image.jpg" />
										</div>
											<MagnifierZoom style={{ height: "400px" }} imageSrc="./image.jpg">
										</MagnifierContainer> */}
										</>
				
									) : (
								""
							)}
								</div>
							
						</div>
					) : (
						<MessageBar messageBarType={MessageBarType.warning}>
							{text(
								"A valid DropBox access token is required for this section"
							)}
						</MessageBar>
					)
				) : (
					<MessageBar messageBarType={MessageBarType.warning}>
						{text(
							"You can not access patient gallery while offline"
						)}
					</MessageBar>
				)}
				<div style={{ clear: "both" }} />
				<div style={{padding: '32px 16px 8px 16px'}}>
					<div>
					<Slider
							label="Grayscale"
							max={100}
							ariaValueText={(valuex: number) => `${valuex} percent`}
							valueFormat={(valuex: number) => `${valuex}%`}
							showValue={true}
							onChange={(value: number) => { 
							 this.setState({value}); 
							 this.forceUpdate(); } }
						/>
					</div>
					<div>
						<Slider
							label="Zoom"
							max={100}
							min={9}
							ariaValueText={(valuez: number) => `${valuez} percent`}
							valueFormat={(valuez: number) => `${valuez}%`}
							showValue={true}
							onChange={(zoom: number) => {
								this.setState({zoom});
								this.setState({isHidden: true})
								onChangeZoomSlider()
								this.forceUpdate();
								//this.viewport.current.style.transform = `scale(430 + (430 * ${this.state.zoom}/100), 300 + (300 * ${this.state.zoom}/100))`;
							} }
						/>
					</div>
					<div>
					<Slider
							label="Thermal"
							max={100}
							min={1}
							ariaValueText={(valuez: number) => `${valuez} percent`}
							valueFormat={(valuez: number) => `${valuez}%`}
							showValue={true}
							onChange={(thermal: number) => {
								this.setState({thermal});
								this.forceUpdate();
								//this.viewport.current.style.transform = `scale(430 + (430 * ${this.state.zoom}/100), 300 + (300 * ${this.state.zoom}/100))`;
							} }
						/>
					</div>
				</div>
				
			</SectionComponent>
		);
	}

	componentDidMount() {
		this.props.patient.gallery.forEach(async path => {
			await this.addImage(path);
		});
		this.stopObservation = this.observe();
		
		// 		const el = this.viewport.current;
		// if(el){
		// 	el.addEventListener('mousemove', (e) => {
		// 		el.style.backgroundPositionX = -e.offsetX + "px";
		// 		el.style.backgroundPositionY = -e.offsetY + "px";
		// 	});
		// }
	}

	componentWillUnmount() {
		this.stopObservation();
	}

	async addImage(path: string) {
		this.imagesTable[path] = "";
		var base64 = localStorage[path];
		//var base64Parts = base64.split(",");
		//var fileFormat = base64Parts[0].split(";")[1];
		//var fileContent = base64Parts[1];
		//var file = new File([fileContent], "file name here", {type: fileFormat});
		//return file;
		//const uri = await files.get(path);
		this.imagesTable[path] = base64;
		return;
	}

	async removeImage(path: string) {
		//await files.remove(this.selectedImagePath);
		localStorage.removeItem(path)
		const selectedImageIndex = this.props.patient.gallery.indexOf(
			this.selectedImagePath
		);
		this.props.patient.gallery.splice(selectedImageIndex, 1);
		delete this.imagesTable[path];
		return;
	}

	observe() {
		return observe(this.props.patient, change => {
			if (change.name === "gallery") {
				const diffResult = diff(
					Object.keys(this.imagesTable),
					this.props.patient.gallery
				);
				diffResult.added.forEach(path => {
					this.addImage(path);
				});
				diffResult.removed.forEach(path => {
					this.removeImage(path);
				});
			}
		});
	}
}

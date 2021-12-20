import { Col, Row, DataTableComponent, ProfileSquaredComponent, SectionComponent } from "@common-components";
import { text, user, router } from "@core";
import { patients, statistics, setting, Expense, expenses} from "@modules";
import { formatDate, num } from "@utils";
import { observer } from "mobx-react";
import * as React from "react";
import { staff } from "@modules";
import { DatePicker, Dropdown,PanelType, IconButton, Panel, TextField, Button, Toggle } from "office-ui-fabric-react";
import { computed, observable } from 'mobx';

@observer
export class Expenses extends React.Component<{}, {}> {

  state = {
    type : "all",
    doctors: [],
    doctorselect: ""
  }

  @observable selectedID: string = router.currentLocation.split("/")[1];

  @computed
  get canEdit() {
    return user.currentUser.canEditInsurance;
  }

  @computed
  get selectedIndex() {
    return expenses.list.findIndex(x => x._id === this.selectedID);
  }
  
  @computed
  get selectedInsurance() {
    return expenses.list[this.selectedIndex];   
  }

  componentDidMount = () => {
    // expenses.setAutoRepeatDetails();
    this.setState({
    
      doctors: staff.list.map(function (item) {
          return item['name'];
      })
      
    });  

  }

  // getTotalPaymentAndExpenses = () => {
  //   let totalPayments = 0;
  //   let totalExpenses = 0;
  //   expenses.getExpenseList(this.state.type).forEach(expense => {
  //      if (expense.type === "expense") {
  //        totalExpenses = totalExpenses + expense.price; 
  //      } else {
  //       totalPayments = totalPayments + expense.price; 
  //      }
  //   })
  //   return {totalPayments: totalPayments, totalExpenses: totalExpenses}
  // }

  render() {
    // const totalAmount = this.getTotalPaymentAndExpenses();
    return (
      <div className="payment">
        <Row gutter={6} style={{backgroundColor: "white", padding: "10px"}}>
        <Col sm={4}>Payments : {setting.getSetting('currencySymbol')} {expenses.totalPayments}</Col>
        <Col sm={4}>Expenses : {setting.getSetting('currencySymbol')} {expenses.totalExpenses}</Col>
        </Row>
        <Row className="break-line"></Row>
        <Button
          onClick={() => {
            const expense = new Expense();
            expense.type="payment"
            expenses.list.push(expense);
            this.selectedID = expense._id;
          }}
          style={{border:"1px solid #ccc", marginBottom:"10px", borderRadius: "4px", marginRight: "10px"}}
        >Add Payment
        </Button>
        <Button
          onClick={() => {
            const expense = new Expense();
            expense.type="expense"
            expenses.list.push(expense);
            this.selectedID = expense._id;
          }}
          style={{border:"1px solid #ccc", marginBottom:"10px", borderRadius: "4px", marginRight: "4px"}}
        >Add Expense
        </Button>
        <Row>
          {" "}
            <DataTableComponent
              maxItemsOnLoad={3}
              onDelete={
                this.canEdit
                  ? id => {
                      expenses.deleteModal(id);
                    }
                  : undefined
              }
              heads={[
                text("Item Name"),
                text("Item Price"),
                text("Type"),
                text("Description"),
                text("Date"),
                text("Repeat"),
                text("Days"),
                text("Dentist"),
                text("Edit"),
              ]}
              hideSearch={false}
              commands={[
                      {
                        key: "addNew1",
                        title: "All",
                        name: text("All"),
                        onClick: () => {
                          this.setState({type: "all"});
                        }
                      },
                      {
                        key: "addNew2",
                        title: "Expense",
                        name: text("Expense"),
                        onClick: () => {
                          this.setState({type: "expense"});
                        }
                      },
                      {
                        key: "addNew3",
                        title: "Payment",
                        name: text("Payment"),
                        onClick: () => {
                          this.setState({type: "payment"});
                        }
                      }
                    ]
              }
              
              rows={expenses.getExpenseList(this.state.type).map((expense, i) => ({
                id: expense._id,
                searchableString: expense.description,
                cells: [
                  {
                    dataValue: expense.name,
                    component: <p>{expense.name}</p>
                  },
                  {
                    dataValue: expense.price,
                    component: <p>{setting.getSetting('currencySymbol')} {expense.price}</p>
                  },
                  {
                    dataValue: expense.type,
                    component: <p>{expense.type}</p>,
                  },
                  {
                    dataValue: expense.description,
                    component: <p>{expense.description}</p>,
                  },
                  {
                    dataValue: expense.date,
                    component: <p>{formatDate(expense.date, "date-format") }</p>,
                  },
                  {
                    dataValue: expense.repeat,
                    component:  <Toggle
                    defaultChecked={expense.repeat}
                    // defaultValue={"true"}
                    checked={expense.repeat}
                    disabled={true}
                  />
                  },
                  {
                    dataValue: expense.days,
                    component: <p>{expense.days}</p>,
                  },
                  {
                    dataValue: expense.doctor,
                    component: <p>{expense.doctor}</p>,
                  },
                  {
                    dataValue: "",
                    component: <IconButton iconProps={{ iconName: "Edit" }} />,
                    onClick: () => {
                      this.selectedID = expense._id;
                    },
                    className: "no-label"
                  },
                ]
              }))}
            />
          
        </Row>

        {this.selectedInsurance ? (
          <Panel
            isOpen={!!this.selectedInsurance}
            type={PanelType.medium}
            closeButtonAriaLabel="Close"
            isLightDismiss={true}
            onDismiss={() => {
              this.selectedID = "";
            }}
            onRenderNavigation={() => (
              <Row className="panel-heading">
                <Col span={20}>
                  {this.selectedInsurance ? (
                    <ProfileSquaredComponent
                      text={this.selectedInsurance.name}
                      subText={`${text("Price")}: ${
                        this.selectedInsurance.price
                      }`}
                    />
                  ) : (
                    <p />
                  )}
                </Col>
                <Col span={4} className="close">
                  <IconButton
                    iconProps={{ iconName: "cancel" }}
                    onClick={() => {
                      this.selectedID = "";
                    }}
                  />
                </Col>
              </Row>
            )}
          >
            <div className="treatment-editor">
              <SectionComponent title={text("Expense Details")}>
                <div className="treatment-input">
                  <TextField
                    label={text("Item Name")}
                    value={this.selectedInsurance.name}
                    onChange={(ev, val) =>
                      (expenses.list[this.selectedIndex].name = val!)
                    }
                    disabled={!this.canEdit}
                  />
                  <TextField
                    label={text("Item Description")}
                    value={this.selectedInsurance.description}
                    onChange={(ev, val) =>
                      (expenses.list[this.selectedIndex].description = val!)
                    }
                    disabled={!this.canEdit}
                  />
                    <TextField
                    label={text("Item Price")}
                    value={this.selectedInsurance.price.toString()}
                    type="number"
                    prefix={setting.getSetting('currencySymbol')}
                    onChange={(ev, val) =>
                      (expenses.list[this.selectedIndex].price = num(val!))
                    }
                    disabled={!this.canEdit}
                  />
                    <DatePicker
                        label={text("Date")}
                        onSelectDate={date => {
                          expenses.list[this.selectedIndex].date = date.getTime();
                        }}
                        value={
                          new Date(expenses.list[this.selectedIndex].date)
                        }  
                      />
                  <Row>
                    <Col md={12} style={{paddingTop:"30px"}}>
                    <Toggle
                    onText={text("Repeat")}
                    offText={text("Repeat")}
                    defaultChecked={expenses.list[this.selectedIndex].repeat}
                    onChange={(ev, val) => {
                      console.log("val", val)
                      expenses.list[this.selectedIndex].repeat = val;
                    }}
                    disabled={!this.canEdit}
                  />
                  </Col>
                  <Col md={12}>
                  <TextField
                    label={text("Days")}
                    type="number"
                    min={0}
                    value={this.selectedInsurance.days.toString()}
                    onChange={(ev, val) =>
                      expenses.list[this.selectedIndex].days = num(val!) < 0 ? 0: num(val!)
                    }
                    disabled={!this.canEdit}
                  />
                  </Col>
                  </Row>

                  <Row gutter={24} style={{ marginTop: '10px'}}>
                  <Col sm={8}>Dentist</Col>
                  <Col sm={16}>
                    <Dropdown                     
                      placeholder="Dentist"
                     
                     
                      options={this.state.doctors.map(v => ({
                        key: v,
                        text: v
                      }))}
                      onChange={(e, newValue) => 
                        //  this.setState({ doctorselect : newValue })
                        expenses.list[this.selectedIndex].doctor = newValue.text
                      }
                    />
                  </Col>
                </Row>
                </div>
              </SectionComponent>
            </div>
          </Panel>
        ) : (
          ""
        )}
        
      </div>
    );
  }
}

/**
 *        farItems={[
                {
                  key: "2",
                  onRender: () => {
                    return (
                      <DatePicker
                        onSelectDate={date => {
                          if (date) {
                            expenses.startingDate = expenses.getDayStartingPoint(
                              date.getTime()
                            );
                          }
                        }}
                        value={
                          new Date(expenses.startingDate)
                        }
                      />
                    );
                  }
                }
              ]}
 * 
 */
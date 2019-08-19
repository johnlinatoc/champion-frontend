import React, { Component } from "react";
import "./my_budget_container_styles.css";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryGroup
} from "victory";

class MyBudgetGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderMonthData() {
    const months = this.props.allMonths.map(month => month.name);
    const monthBudgets = this.props.allMonths.map(
      month => month.monthly_budget
    );
    const newData = [];

    for (let i = 0; i < months.length; i++) {
      newData.push({ month: months[i], budget: monthBudgets[i] });
    }
    console.log('newData', newData)
    return newData.slice(0, 5);
  }

  renderTransactionData() {
    const monthNames = this.props.allMonths.map(month => month.name);
    const months = this.props.allMonths
    const transactions = this.props.allTransactions;
    const trans = {};
    const newData = []

    transactions.forEach(transaction => {
      if (transaction.monthly_budget_id in trans) {
        trans[transaction.monthly_budget_id] += transaction.amount;
      } else {
        trans[transaction.monthly_budget_id] = transaction.amount;
      }
    });

    let obj = [];
     for (let i = 0; i < months.length; i++) {
       let curr = months[i];
       if (trans[curr.id]) {
         obj.push({month: curr.name, total: trans[curr.id]});
       } else {
         obj.push({month: curr.name, total: null});
       }
     }

   return obj.slice(0, 5);
  }

  render() {
    return (
      <div className="my-budget-graph-container">
        Graph
        <VictoryChart
          domainPadding={30}
        >
          <VictoryGroup
            colorScale={["orange", "tomato"]}
            offset={20}>
            <VictoryBar
              animate={{ duration: 2000, onLoad: { duration: 4000 } }}
              data={this.renderMonthData()}
              x="month"
              y="budget"
            />
            <VictoryBar
              animate={{ duration: 2000, onLoad: { duration: 4000 } }}
              data={this.renderTransactionData()}
              x="month"
              y="total"
            />
          </VictoryGroup>
        </VictoryChart>

      </div>
    );
  }
}

export default MyBudgetGraph;

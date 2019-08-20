import React, { Component, Fragment } from "react";
import { Form, Button } from "react-bootstrap";
import uuid from "uuid";
import { Link, withRouter } from "react-router-dom";
import './styles/card.css'

//monthly income is set first. display confirmation on screen.
//add category budgets until CB == monthly income. (0 == 0 validation needed)
//enable submit button


class NewBudgetContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      monthly_income: 0,
      month_id: this.props.months[0].id,
      user_id: this.props.userInfo.id,
      categories: [{name: '', amount: 0}],
      categoryTotal: 0,
      monthSubmitted: false,
      isEqual: false,
    };
  }

  totalUpdate(){
    if (this.state.monthly_income === this.state.categoryTotal){
      this.setState({ isEqual: true })
    } else{
      this.setState({ isEqual: false })
    }
  }

  clearForm(){
    if (this.props.isCancelled){
      this.setState({
        monthly_income: 0,
        month_id: this.props.months[0].id,
        user_id: this.props.userInfo.id,
        categories: [{name: '', amount: 0}],
        isEqual: false,
        monthSubmitted: false,
        categoryTotal: 0,
      })
      this.handleMonthCancel()
    }
  }


  handleMonthIncomeChange(e) {
    this.setState({
      monthly_income: parseInt(e.target.value),
      monthSubmitted: false,
      categories: [{name: '', amount: 0}],
    });
  }

  handleMonthCancel(){
    const data = this.state;
    const reqObj_mon = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
        mode: 'no-cors'
      },
      body: JSON.stringify(data)
    };

    fetch("http://localhost:3000/new_budget", reqObj_mon)
      .then(res => res.json())
      .then(data => console.log(data))
      .then( this.setState({ monthSubmitted: false }) )

      console.log('month cancel')
  }

  handleMonthSubmit(e) {
    e.preventDefault();
    const data = this.state;

    const reqObj_mon = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
        mode: 'no-cors'
      },
      body: JSON.stringify(data)
    };

    fetch("http://localhost:3000/new_budget", reqObj_mon)
      .then(res => res.json())
      .then( this.setState({ monthSubmitted: true }) )

  }

  handleCategorySubmit(e) {
    e.preventDefault();
    const data = this.state;

    const reqObj_mon = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    };



    fetch("http://localhost:3000/categories", reqObj_mon)
      .then(res => res.json())
      .then(data => console.log(data))
      .then(this.props.fetchAll())

  //   this.props.history.push('/home')
  }

  renderNewCategory() {
    let categories = this.state.categories
    categories.push({name: '', amount: 0})
    this.setState({ categories })
  }

  handleCategoryChange(e, index) {
    let newCats = [...this.state.categories]
    let categories = this.state.categories
    let isEqual = this.state.isEqual
    let monthly_income = this.state.monthly_income

    newCats[index][e.target.name] = e.target.value

    let newCatsTotal = 0
    categories.map(cat=> newCatsTotal += parseInt(cat.amount))

    if (newCatsTotal === monthly_income){
      return this.setState({
        categories: newCats,
        categoryTotal: newCatsTotal,
        isEqual: true,
      })
    } else {
      return this.setState({
        categories: newCats,
        categoryTotal: newCatsTotal,
        isEqual: false,
      })
    }


    return this.totalUpdate()
  }

  renderCategoryInputs(){
    return this.state.categories.map((category, index)=> {
      return(
        <div>
          <Form.Group
            style = {{ marginTop: "2px", }}
            >
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              required
              onChange={e => {
                this.handleCategoryChange(e, index);
              }}
              name='name'
              type='text'
              placeholder="ex: Shopping"
            />
          </Form.Group>
          <Form.Group
            style = {{ marginTop: "2px", }}
            controlId="formBasicPassword">
            <Form.Label>Category Budget</Form.Label>
            <Form.Control
              required
              onChange={e => {
                this.handleCategoryChange(e, index);
              }}
              name='amount'
              type="number"
              placeholder="ex: $100"
            />
          </Form.Group>
        </div>
      )
    })
  }

  renderSubmitButton(){
    return <Button variant="primary" type="submit">
            Submit Budget!
            </Button>
  }

  renderNewCatButton(){
    return <button
      onClick={() => {
        this.renderNewCategory();
      }}>
      Add Category
    </button>
  }

  calcRemainder(){
    let total = this.state.monthly_income - this.state.categoryTotal
    return total
  }

  renderSecondForm(){
    return <div>
    <h3>Planned Expenses: <span>${this.state.categoryTotal}</span> </h3>
    <hr />
    <h3 style={ this.state.isEqual ? {color: 'green'} : null}>
      { this.state.isEqual ? 'Budget Ready!' : 'Remaining:'}
      <span style={ this.state.isEqual ? {color: 'green'} : {color: 'red'}}>${this.calcRemainder()}</span>
      </h3>
    </div>
  }

  render() {
    return (
      <div className="" style={{ color: "black" }}>
        <h2>Start Your New Budget</h2>
        <Form
          className='main-budget-form'
          onSubmit={e => this.handleMonthSubmit(e)}
          >
          <Form.Group>
            <Form.Label>Monthly Income</Form.Label>
            <Form.Control
              required
              onChange={e => {
                this.handleMonthIncomeChange(e);
              }}
              type="number"
              placeholder="ex: $2500"/>
          </Form.Group>
          { this.state.monthly_income > 0 && !this.state.monthSubmitted ? <Button variant="primary" type="submit">
            Submit Month Income
          </Button> : null}

        </Form>
        <div className="side-budget-form">
          <h3>This Month's Income: <span>${this.state.monthly_income ? this.state.monthly_income : 0}</span> </h3>
          { this.state.monthSubmitted  ?  this.renderSecondForm() : null }

        </div>
        <Form
          className='cat-budget-form'
          onSubmit={e => {
            this.handleCategorySubmit(e);
          }}>

          { this.state.monthSubmitted ? this.renderCategoryInputs() : null }
          { this.state.monthSubmitted ? this.renderNewCatButton() : null }

          { this.state.isEqual ? this.renderSubmitButton() : null }

        </Form>
      </div>
    );
  }
}

export default withRouter(NewBudgetContainer);

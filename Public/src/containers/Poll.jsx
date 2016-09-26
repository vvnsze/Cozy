import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { Button, Panel } from 'react-bootstrap'
import { connect } from 'react-redux'
import { deletePoll, vote } from '../actions/actions_polls'

import { addPoll } from '../actions/actions_polls'

class Poll extends Component {
	constructor(props) {
		super(props)

		this.state = {
			open: false,
			choice: 0
		}
		this.handleCollapsible = this.handleCollapsible.bind(this)
		this.setChoice = this.setChoice.bind(this)
		this.voteOnPoll = this.voteOnPoll.bind(this)
	}

	setChoice(e) {
		e.stopPropagation()
		this.setState({ choice: e.target.value})
	}

	voteOnPoll(e) {
		e.preventDefault()
		e.stopPropagation()
		const { vote } = this.props
		vote(this.state.choice)
	}

	handleCollapsible() {
		this.setState({ open: !this.state.open })
	}

	render() {

		const poll = this.props.data

		return (
			<Panel
      	bsStyle='primary'
        header={poll.question}
        collapsible
        expanded={this.state.open}
        onClick={this.handleCollapsible}>
        {poll.poll_options.map((option) => {
	return (
		<div key={option.optionId}>
        	<input
        	type='radio'
        	name='options' 
        	value={option.optionId}
        	onClick={this.setChoice} />
        	{option.text}
        </div>
        	)
})}
        <Button bsStyle='success' type='submit' onClick={this.voteOnPoll}>
          Submit <i className='fa fa-check-circle' aria-hidden='true'></i>
        </Button>
      </Panel>
		)
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({deletePoll, vote}, dispatch)
}

export default connect(null, mapDispatchToProps)(Poll)
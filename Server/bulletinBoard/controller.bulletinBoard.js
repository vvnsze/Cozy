const db_post = require('../bulletinBoard/model.posts')
const db_poll = require('../bulletinBoard/model.polls')
const sequelize = require('../config/database')

module.exports = {
	addPost: (req, res) => {
		db_post.Posts.create({
			title: req.body.title,
			message: req.body.message,
			house_id: req.body.house_id,
			user_id: req.body.user_id
		})
      .then(createdPost => res.status(201).send(createdPost))
      .catch(err => res.status(404).send(err))
	},

	getPosts: (req, res) => {
    // For testing purposes, now grabbing the data where title = test
    // Eventually, it will grab all from House_id

		db_post.Posts.findAll({
			where: { title: req.query.title }
		})
      .then(queriedPosts => res.status(200).json(queriedPosts))
      .catch(err => res.status(404).send(err))
	},

	editPost: (req, res) => {
		db_post.Posts.findOne({
			where: {
				id: req.body.id
			}
		})
      .then((postToUpdate) => {
	postToUpdate.update({
		message: req.body.message
	})
	res.status(200).send(postToUpdate)
})
      .catch(error => res.status(404).send(error))
	},

	deletePost: (req, res) => {
    // delete works similarly to a get req - Data should come through as a query
		db_post.Posts.findOne({
			where: { id: req.query.id}
		})
      .then(post => post.destroy())
      .then(() => res.status(200).send('row deleted'))
      .catch(error => res.status(404).send(error))
	},

	addPoll: (req, res) => {

		return sequelize.transaction().then((t) => {
			return db_poll.Polls.create({
				question: req.body.question
			}, {transaction: t})
        .then((createdPoll) => {
	const pollOptions = req.body.options.map((option) => {
		return {
			text: option,
			pollId: createdPoll.dataValues.id
		}
	})
	return db_poll.Poll_Options.bulkCreate(pollOptions, {
		transaction: t
	})
}).then(t.commit.bind(t), t.rollback.bind(t))
  .then(() => res.sendStatus(201))
  .catch(err => res.status(404).send(err))
		})
	},

	getPoll: (req, res) => {
		db_poll.Polls.findOne({
			where: {
				id: req.params.pollId
			},
			group: ['poll_options.id', 'polls.id'],
			attributes: ['question'],
			include: {
				model: db_poll.Poll_Options,
				attributes: [
				['id', 'optionId'], 'text', 
				[sequelize.fn('COUNT', sequelize.col('poll_options.votes.id')), 'voteCount']],
			include: {
				model: db_poll.Votes,
				attributes: []
			}
			}
		})
      .then(poll => res.status(200).json(poll))
      .catch(error => res.status(404).send(error))
	},

	vote: (req, res) => {
		db_poll.Votes.create({
			pollOptionId: req.body.pollOptionId
		})
	  .then(()=> res.sendStatus(201))
      .catch(error => res.status(404).send(error))
	}
}

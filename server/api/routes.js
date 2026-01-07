const express = require('express');
const router = express.Router();

// Import controllers
const matchController = require('../controllers/matchController');
const teamController = require('../controllers/teamController');
const tableController = require('../controllers/tableController');
const competitionController = require('../controllers/competitionController');

// Match routes
router.get('/matches', matchController.getAllMatches);
router.get('/matches/live', matchController.getLiveMatches);
router.get('/matches/:id', matchController.getMatchById);
router.get('/matches/rounds', matchController.getRoundsSorted);

// Team routes
router.get('/teams', teamController.getAllTeams);
router.get('/teams/:id', teamController.getTeamById);
router.get('/teams/:id/matches', teamController.getTeamMatches);


// Table routes
router.get('/table', tableController.getTable);
router.get('/table/home', tableController.getHomeTable);
router.get('/table/away', tableController.getAwayTable);

// Competitions routes
router.get('/competitions', competitionController.getCompetitions);

module.exports = router;

const express = require('express');
const router = express.Router();

// Import controllers
const matchController = require('../controllers/matchController');
const teamController = require('../controllers/teamController');
const playerController = require('../controllers/playerController');
const tableController = require('../controllers/tableController');

// Match routes
router.get('/matches', matchController.getAllMatches);
router.get('/matches/live', matchController.getLiveMatches);
router.get('/matches/:id', matchController.getMatchById);

// Team routes
router.get('/teams', teamController.getAllTeams);
router.get('/teams/:id', teamController.getTeamById);
router.get('/teams/:id/matches', teamController.getTeamMatches);

// Player routes
router.get('/players', playerController.getAllPlayers);
router.get('/players/:id', playerController.getPlayerById);
router.get('/players/team/:teamId', playerController.getPlayersByTeam);
router.get('/players/stats/goals', playerController.getTopScorers);

// Table routes
router.get('/table', tableController.getTable);
router.get('/table/home', tableController.getHomeTable);
router.get('/table/away', tableController.getAwayTable);

module.exports = router;
const axios = require('axios');
const redis = require('redis');
const { promisify } = require('util');

/**
 * Adaptér pro externí API s daty o fotbalové lize
 * Slouží jako vrstva mezi externím API a naší aplikací
 */
class ExternalApiAdapter {
  constructor(config) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
    this.requestLimit = config.requestLimit || 100;
    this.cacheTime = config.cacheTime || 60; // v sekundách
    
    // Inicializace Redis klienta pro cache
    this.redisClient = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    
    this.redisClient.on('error', (err) => {
      console.error('Redis error:', err);
    });
    
    // Promisify Redis metody
    this.getAsync = promisify(this.redisClient.get).bind(this.redisClient);
    this.setAsync = promisify(this.redisClient.set).bind(this.redisClient);
  }
  
  /**
   * Vytvoří HTTP hlavičky pro požadavky na API
   */
  getHeaders() {
    return {
      'X-API-KEY': this.apiKey,
      'Content-Type': 'application/json'
    };
  }
  
  /**
   * Získá data z cache nebo z API
   */
  async fetchData(endpoint, params = {}, useCache = true) {
    const cacheKey = `api:${endpoint}:${JSON.stringify(params)}`;
    
    // Pokus o získání dat z cache
    if (useCache) {
      try {
        const cachedData = await this.getAsync(cacheKey);
        if (cachedData) {
          return JSON.parse(cachedData);
        }
      } catch (error) {
        console.error('Cache error:', error);
      }
    }
    
    // Pokud data nejsou v cache nebo cache není povolena, získej data z API
    try {
      const response = await axios.get(`${this.baseUrl}/${endpoint}`, {
        headers: this.getHeaders(),
        params
      });
      
      const data = response.data;
      
      // Ulož data do cache
      if (useCache) {
        await this.setAsync(cacheKey, JSON.stringify(data), 'EX', this.cacheTime);
      }
      
      return data;
    } catch (error) {
      console.error(`API error (${endpoint}):`, error.message);
      throw new Error(`Chyba při získávání dat z API: ${error.message}`);
    }
  }
  
  /**
   * Získá seznam všech zápasů
   */
  async getMatches(params = {}) {
    return this.fetchData('matches', params);
  }
  
  /**
   * Získá živé zápasy
   */
  async getLiveMatches() {
    return this.fetchData('matches/live', {}, false); // Nepoužívej cache pro živá data
  }
  
  /**
   * Získá detail zápasu podle ID
   */
  async getMatchById(matchId) {
    return this.fetchData(`matches/${matchId}`);
  }
  
  /**
   * Získá seznam všech týmů
   */
  async getTeams() {
    return this.fetchData('teams');
  }
  
  /**
   * Získá detail týmu podle ID
   */
  async getTeamById(teamId) {
    return this.fetchData(`teams/${teamId}`);
  }
  
  /**
   * Získá zápasy týmu podle ID týmu
   */
  async getTeamMatches(teamId, params = {}) {
    return this.fetchData(`teams/${teamId}/matches`, params);
  }
  
  /**
   * Získá seznam všech hráčů
   */
  async getPlayers(params = {}) {
    return this.fetchData('players', params);
  }
  
  /**
   * Získá detail hráče podle ID
   */
  async getPlayerById(playerId) {
    return this.fetchData(`players/${playerId}`);
  }
  
  /**
   * Získá hráče týmu podle ID týmu
   */
  async getPlayersByTeam(teamId) {
    return this.fetchData(`players/team/${teamId}`);
  }
  
  /**
   * Získá nejlepší střelce
   */
  async getTopScorers() {
    return this.fetchData('players/stats/goals');
  }
  
  /**
   * Získá ligovou tabulku
   */
  async getTable() {
    return this.fetchData('table');
  }
  
  /**
   * Získá domácí tabulku
   */
  async getHomeTable() {
    return this.fetchData('table/home');
  }
  
  /**
   * Získá venkovní tabulku
   */
  async getAwayTable() {
    return this.fetchData('table/away');
  }
}

module.exports = ExternalApiAdapter;
import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/buses', (req, res) => {
  res.json(db.getBuses());
});

router.get('/routes', (req, res) => {
  res.json(db.getRoutes());
});

router.get('/stops', (req, res) => {
  res.json(db.getStops());
});

router.get('/active-locations', (req, res) => {
  res.json(db.getAllLiveLocations());
});

router.get('/notifications', (req, res) => {
  res.json(db.getNotifications());
});

export default router;

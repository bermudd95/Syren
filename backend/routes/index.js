
const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const Dispatch = require('../models/Dispatch');
const VideoEvent = require('../models/VideoEvent');

router.post('/alerts', async (req, res) => {
  const newAlert = new Alert(req.body);
  await newAlert.save();
  res.status(201).send(newAlert);
});

router.get('/alerts', async (req, res) => {
  const alerts = await Alert.find();
  res.status(200).send(alerts);
});

router.post('/dispatch', async (req, res) => {
  const dispatch = new Dispatch(req.body);
  await dispatch.save();
  res.status(201).send(dispatch);
});

router.get('/dispatch', async (req, res) => {
  const dispatches = await Dispatch.find();
  res.status(200).send(dispatches);
});

router.post('/video-events', async (req, res) => {
  const event = new VideoEvent(req.body);
  await event.save();
  res.status(201).send(event);
});

router.get('/video-events', async (req, res) => {
  const events = await VideoEvent.find();
  res.status(200).send(events);
});

module.exports = router;

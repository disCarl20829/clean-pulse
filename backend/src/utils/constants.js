// Philippine solid-waste classification (RA 9003 categories, simplified for reporting)
const GARBAGE_TYPES = [
  'biodegradable',      // e.g. food scraps, garden waste
  'non_biodegradable',  // e.g. plastics, styrofoam
  'recyclable',         // e.g. bottles, cardboard, metal
  'residual',           // non-recyclable, non-biodegradable mixed waste
  'hazardous',          // e.g. batteries, chemicals, medical waste
  'mix',                // mixed waste
];

const INTENSITY_LEVELS = [
  'low',
  'moderate',
  'high',
  'severe',
  'dangerous',
];

const REPORT_STATUS = ['unresolved', 'resolved', 'archived'];

const ROLES = ['resident', 'barangay_official', 'garbage_collector', 'lgu_admin'];

module.exports = { GARBAGE_TYPES, INTENSITY_LEVELS, REPORT_STATUS, ROLES };

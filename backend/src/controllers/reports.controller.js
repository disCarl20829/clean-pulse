const { supabaseAdmin } = require('../config/supabase');
const { reverseGeocode } = require('../services/geocode.service');
const { GARBAGE_TYPES, INTENSITY_LEVELS, REPORT_STATUS } = require('../utils/constants');

const BUCKET = 'report-photos';

async function createReport(req, res, next) {
  try {
    const { lat, lng, garbageType, intensity, description, agreedNoFalseReport, agreedPhLaw } =
      req.body;

    if (!lat || !lng) return res.status(400).json({ error: 'lat/lng are required' });
    if (!GARBAGE_TYPES.includes(garbageType)) {
      return res.status(400).json({ error: 'Invalid garbageType' });
    }
    if (!INTENSITY_LEVELS.includes(intensity)) {
      return res.status(400).json({ error: 'Invalid intensity' });
    }
    if (agreedNoFalseReport !== 'true' && agreedNoFalseReport !== true) {
      return res.status(400).json({ error: 'Must agree to the false-reporting policy' });
    }
    if (agreedPhLaw !== 'true' && agreedPhLaw !== true) {
      return res.status(400).json({ error: 'Must agree to the RA 9003 / relevant law notice' });
    }

    const location = await reverseGeocode(parseFloat(lat), parseFloat(lng));

    let photoUrl = null;
    if (req.file) {
      const filePath = `${req.user.id}/${Date.now()}_${req.file.originalname}`;
      const { error: uploadError } = await supabaseAdmin.storage
        .from(BUCKET)
        .upload(filePath, req.file.buffer, { contentType: req.file.mimetype });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(filePath);
      photoUrl = publicUrlData.publicUrl;
    }

    const { data, error } = await supabaseAdmin
      .from('reports')
      .insert({
        reporter_id: req.user.id,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        formatted_address: location.formattedAddress,
        barangay: location.barangay,
        city: location.city,
        province: location.province,
        garbage_type: garbageType,
        intensity,
        description: description || null,
        photo_url: photoUrl,
        status: 'unresolved',
        agreed_no_false_report: true,
        agreed_ph_law: true,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ report: data });
  } catch (err) {
    next(err);
  }
}

async function listReports(req, res, next) {
  try {
    const { status, garbageType, barangay, sort = 'recent' } = req.query;

    let query = supabaseAdmin.from('reports').select('*');

    if (status && REPORT_STATUS.includes(status)) query = query.eq('status', status);
    if (garbageType && GARBAGE_TYPES.includes(garbageType)) query = query.eq('garbage_type', garbageType);
    if (barangay) query = query.ilike('barangay', `%${barangay}%`);

    query = sort === 'recent'
      ? query.order('created_at', { ascending: false })
      : query.order('intensity', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;

    res.json({ reports: data });
  } catch (err) {
    next(err);
  }
}

async function updateReportStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!REPORT_STATUS.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const { data, error } = await supabaseAdmin
      .from('reports')
      .update({ status, status_updated_by: req.user.id, status_updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ report: data });
  } catch (err) {
    next(err);
  }
}

module.exports = { createReport, listReports, updateReportStatus };

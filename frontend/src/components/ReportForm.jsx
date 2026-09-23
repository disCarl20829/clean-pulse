import { useState } from 'react';
import MapView from './MapView';
import { useGeolocation } from '../hooks/useGeolocation';
import { GARBAGE_TYPES, INTENSITY_LEVELS } from '../constants/garbageTypes';
import { apiPost } from '../lib/api';

export default function ReportForm() {
  const { coords, setCoords, pinpoint, loading: locLoading, error: locError } = useGeolocation();
  const [garbageType, setGarbageType] = useState('');
  const [intensity, setIntensity] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [agreedNoFalseReport, setAgreedNoFalseReport] = useState(false);
  const [agreedPhLaw, setAgreedPhLaw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!coords) return setError('Pinpoint or select a location on the map first.');
    if (!garbageType || !intensity) return setError('Select garbage type and intensity.');
    if (!agreedNoFalseReport || !agreedPhLaw) return setError('Please accept both agreements.');

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('lat', coords.lat);
      formData.append('lng', coords.lng);
      formData.append('garbageType', garbageType);
      formData.append('intensity', intensity);
      formData.append('description', description);
      formData.append('agreedNoFalseReport', 'true');
      formData.append('agreedPhLaw', 'true');
      if (photo) formData.append('photo', photo);

      const res = await apiPost('/reports', formData, { isFormData: true });
      setResult(res.report);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Report Garbage</h2>

      <button type="button" onClick={pinpoint} disabled={locLoading}>
        {locLoading ? 'Locating...' : 'Pinpoint my location'}
      </button>
      {locError && <p style={{ color: 'red' }}>{locError}</p>}

      <MapView coords={coords} onPick={setCoords} />
      {coords && (
        <p>
          Selected: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
          <br />
          <small>Address will be reverse-geocoded automatically on submit.</small>
        </p>
      )}

      <label>
        Garbage type
        <select value={garbageType} onChange={(e) => setGarbageType(e.target.value)}>
          <option value="">Select type</option>
          {GARBAGE_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </label>

      <label>
        Intensity
        <select value={intensity} onChange={(e) => setIntensity(e.target.value)}>
          <option value="">Select intensity</option>
          {INTENSITY_LEVELS.map((i) => (
            <option key={i.value} value={i.value}>{i.label}</option>
          ))}
        </select>
      </label>

      <label>
        Description
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>

      <label>
        Photo
        <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />
      </label>

      <label>
        <input
          type="checkbox"
          checked={agreedNoFalseReport}
          onChange={(e) => setAgreedNoFalseReport(e.target.checked)}
        />
        I understand that submitting a false or malicious report may result in a
        red-flag on my account or a formal charge.
      </label>

      <label>
        <input
          type="checkbox"
          checked={agreedPhLaw}
          onChange={(e) => setAgreedPhLaw(e.target.checked)}
        />
        I acknowledge this report is submitted under RA 9003 (Ecological Solid Waste
        Management Act) and related local ordinances.
      </label>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && <p style={{ color: 'green' }}>Report submitted. Status: {result.status}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit report'}
      </button>
    </form>
  );
}

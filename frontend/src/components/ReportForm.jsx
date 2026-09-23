import './Report.css';
import { useState } from 'react';
import MapView from './MapView';
import { useGeolocation } from '../hooks/useGeolocation';
import { GARBAGE_TYPES, INTENSITY_LEVELS } from '../constants/garbageTypes';
import { apiPost } from '../lib/api';

const DEFAULT_CENTER = { lat: 14.5995, lng: 120.9842 };

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
  <div className="report-page">

    <form onSubmit={handleSubmit} className="report-form">

      <div className="report-header">
        <h1>Report Garbage</h1>
        <p>
          Help your community identify and respond to waste accumulation.
        </p>
      </div>

      <div className="report-content">

        {/* LOCATION */}

        <div className="report-section">

          <h2 className="section-title">
            Waste Location
          </h2>

          <p className="section-description">
            Pinpoint the location where the waste was observed.
          </p>

          <button
            type="button"
            className="location-button"
            onClick={pinpoint}
            disabled={locLoading}
          >
            {locLoading
              ? 'Locating...'
              : 'Pinpoint my location'}
          </button>

          {locError && (
            <div className="report-error">
              {locError}
            </div>
          )}

          <div className="map-container">
            <MapView
              coords={coords}
              onPick={setCoords}
            />
          </div>

          {coords && (
            <div className="selected-location">
              <strong>Selected location:</strong>{' '}
              {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}

              <br />

              <small>
                Address will be reverse-geocoded automatically on submit.
              </small>
            </div>
          )}

        </div>


        {/* WASTE INFORMATION */}

        <div className="report-section">

          <h2 className="section-title">
            Waste Information
          </h2>

          <p className="section-description">
            Provide information about the reported waste.
          </p>

          <div className="report-fields">

            <div className="report-form-group">

              <label>
                Garbage type
              </label>

              <select
                value={garbageType}
                onChange={(e) =>
                  setGarbageType(e.target.value)
                }
              >
                <option value="">
                  Select type
                </option>

                {GARBAGE_TYPES.map((t) => (
                  <option
                    key={t.value}
                    value={t.value}
                  >
                    {t.label}
                  </option>
                ))}
              </select>

            </div>


            <div className="report-form-group">

              <label>
                Intensity
              </label>

              <select
                value={intensity}
                onChange={(e) =>
                  setIntensity(e.target.value)
                }
              >
                <option value="">
                  Select intensity
                </option>

                {INTENSITY_LEVELS.map((i) => (
                  <option
                    key={i.value}
                    value={i.value}
                  >
                    {i.label}
                  </option>
                ))}
              </select>

            </div>


            <div className="report-form-group full-width">

              <label>
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Describe the waste situation..."
              />

            </div>


            <div className="report-form-group full-width">

              <label>
                Photo
              </label>

              <div className="photo-upload">

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setPhoto(e.target.files[0])
                  }
                />

              </div>

            </div>

          </div>

        </div>


        {/* AGREEMENTS */}

        <div className="report-section">

          <h2 className="section-title">
            Agreements
          </h2>

          <div className="agreements">

            <label className="agreement">

              <input
                type="checkbox"
                checked={agreedNoFalseReport}
                onChange={(e) =>
                  setAgreedNoFalseReport(e.target.checked)
                }
              />

              <span>
                I understand that submitting a false or malicious
                report may result in a red-flag on my account or
                a formal charge.
              </span>

            </label>


            <label className="agreement">

              <input
                type="checkbox"
                checked={agreedPhLaw}
                onChange={(e) =>
                  setAgreedPhLaw(e.target.checked)
                }
              />

              <span>
                I acknowledge this report is submitted under
                RA 9003 (Ecological Solid Waste Management Act)
                and related local ordinances.
              </span>

            </label>

          </div>

        </div>


        {/* MESSAGES */}

        {error && (
          <div className="report-error">
            {error}
          </div>
        )}

        {result && (
          <div className="report-success">
            Report submitted successfully.
            Status: <strong>{result.status}</strong>
          </div>
        )}


        {/* SUBMIT */}

        <div className="submit-area">

          <button
            type="submit"
            className="submit-button"
            disabled={submitting}
          >
            {submitting
              ? 'Submitting...'
              : 'Submit report'}
          </button>

        </div>

      </div>

    </form>

  </div>
);

}

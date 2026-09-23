import './Landing.css';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { session } = useAuth();

  return (
    <div className="landing-page">

      {/* NAVBAR
          Only show when the user is NOT logged in.
      */}
      {!session && (
        <nav className="landing-navbar">

          <div className="landing-logo">
            <div className="landing-logo-icon">♻</div>
            <span>CleanPulse</span>
          </div>

          <div className="landing-nav-links">
            <a href="#about">About</a>
            <a href="#features">Features</a>
            <a href="#impact">Impact</a>
          </div>

          <a href="/login" className="nav-login">
            Sign In
          </a>

        </nav>
      )}


      {/* HERO */}
      <section className="hero-section">

        <div className="hero-content">

          <div className="hero-badge">
            Climate Technology for Cleaner Communities
          </div>

          <h1>
            Smarter Waste Management.
            <span> Cleaner Communities.</span>
          </h1>

          <p>
            CleanPulse helps local government units monitor waste reports,
            identify waste hotspots, coordinate collection activities,
            and respond faster to environmental problems.
          </p>

          <div className="hero-buttons">

            <a href="/login" className="primary-button">
              Get Started
            </a>

            <a href="#features" className="secondary-button">
              Explore CleanPulse
            </a>

          </div>

        </div>


        {/* DASHBOARD PREVIEW */}
        <div className="hero-preview">

          <div className="preview-header">

            <div>
              <span className="preview-label">
                CLEANPULSE
              </span>

              <h3>
                Environmental Overview
              </h3>
            </div>

            <div className="status-dot">
              ● Sample Preview
            </div>

          </div>


          <div className="preview-stats">

            <div className="preview-card">
              <span>Total Reports</span>
              <strong>128</strong>
              <small>Sample data</small>
            </div>

            <div className="preview-card">
              <span>Resolved</span>
              <strong>86</strong>
              <small>Sample data</small>
            </div>

            <div className="preview-card">
              <span>Hotspots</span>
              <strong>12</strong>
              <small>Sample data</small>
            </div>

          </div>


          <div className="preview-chart">

            <div className="chart-heading">
              <span>
                Waste Reports Overview
              </span>

              <span>
                Sample view
              </span>
            </div>

            <div className="chart-bars">

              <div style={{ height: '40%' }}></div>
              <div style={{ height: '65%' }}></div>
              <div style={{ height: '50%' }}></div>
              <div style={{ height: '80%' }}></div>
              <div style={{ height: '60%' }}></div>
              <div style={{ height: '90%' }}></div>
              <div style={{ height: '72%' }}></div>

            </div>

          </div>

        </div>

      </section>


      {/* ABOUT */}
      <section
        className="about-section"
        id="about"
      >

        <div className="section-label">
          ABOUT CLEANPULSE
        </div>

        <h2>
          Turning waste data into
          <span> environmental action.</span>
        </h2>

        <p>
          Waste problems are not only about garbage. Accumulated waste can
          contribute to pollution, blocked drainage, and increased flood
          risks. CleanPulse provides local officials with the information
          they need to monitor these problems and coordinate faster responses.
        </p>

      </section>


      {/* FEATURES */}
      <section
        className="features-section"
        id="features"
      >

        <div className="section-heading">

          <div>

            <div className="section-label">
              PLATFORM FEATURES
            </div>

            <h2>
              Everything your community needs
              <span> in one place.</span>
            </h2>

          </div>

        </div>


        <div className="feature-grid">

          <div className="feature-card">

            <div className="feature-number">
              01
            </div>

            <h3>
              Waste Reports
            </h3>

            <p>
              Centralize waste reports and monitor their status
              from submission to resolution.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-number">
              02
            </div>

            <h3>
              Hotspot Monitoring
            </h3>

            <p>
              Identify recurring waste accumulation areas and
              prioritize locations that need attention.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-number">
              03
            </div>

            <h3>
              Collection Tracking
            </h3>

            <p>
              Coordinate waste collection activities and monitor
              scheduled, active, delayed, and completed collections.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-number">
              04
            </div>

            <h3>
              Environmental Analytics
            </h3>

            <p>
              Turn waste data into useful insights for planning,
              decision-making, and climate resilience.
            </p>

          </div>

        </div>

      </section>


      {/* IMPACT */}
      <section
        className="impact-section"
        id="impact"
      >

        <div className="impact-content">

          <div className="section-label">
            CLIMATE IMPACT
          </div>

          <h2>
            Cleaner surroundings.
            <span> Stronger communities.</span>
          </h2>

          <p>
            By helping local officials respond to waste problems faster,
            CleanPulse supports cleaner public spaces, reduces accumulated
            waste, helps prevent drainage obstruction, and contributes to
            more climate-resilient communities.
          </p>


          <div className="impact-points">

            <div>
              <strong>01</strong>
              <span>
                Reduce accumulated waste
              </span>
            </div>

            <div>
              <strong>02</strong>
              <span>
                Identify recurring hotspots
              </span>
            </div>

            <div>
              <strong>03</strong>
              <span>
                Improve collection response
              </span>
            </div>

          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="cta-section">

        <h2>
          Ready to make waste management smarter?
        </h2>

        <p>
          Give your community the tools to monitor, respond,
          and build a cleaner future.
        </p>

        <a
          href="/login"
          className="primary-button"
        >
          Access CleanPulse
        </a>

      </section>


      {/* FOOTER */}
      <footer className="landing-footer">

        <div className="landing-logo">

          <div className="landing-logo-icon">
            ♻
          </div>

          <span>
            CleanPulse
          </span>

        </div>

        <p>
          Climate Technology for Cleaner Communities
        </p>

        <span>
          © 2026 CleanPulse
        </span>

      </footer>

    </div>
  );
}
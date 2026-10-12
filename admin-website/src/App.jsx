import Grades from "./Grades";
import Placements from "./Placements";
import Applications from "./Applications";
import Organisations from "./Organisations";
import Students from "./Students";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  BriefcaseBusiness,
  GraduationCap,
  BarChart3,
  Settings,
  Menu,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  X,
} from "lucide-react";
import "./App.css";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Students", icon: Users },
  { label: "Organisations", icon: Building2 },
  { label: "Applications", icon: FileText },
  { label: "Placements", icon: BriefcaseBusiness },
  { label: "Grades", icon: GraduationCap },
  { label: "Reports", icon: BarChart3 },
  { label: "Settings", icon: Settings },
];

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <GraduationCap size={25} />
          </div>
          <div>
            <h2>UIMS Admin</h2>
            <span>Management Portal</span>
          </div>
          <button
            className="mobile-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={21} />
          </button>
        </div>

        <div className="nav-heading">MAIN MENU</div>

        <nav className="navigation">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                className={`nav-item ${
                  activePage === item.label ? "active" : ""
                }`}
                onClick={() => {
                  setActivePage(item.label);
                  setSidebarOpen(false);
                }}
              >
                <Icon size={19} strokeWidth={1.8} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="admin-profile">
            <div className="avatar">A</div>
            <div className="profile-info">
              <strong>Administrator</strong>
              <span>System Admin</span>
            </div>
            <LogOut size={17} />
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="menu-toggle"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <div>
              <h1>{activePage}</h1>
              <p>University Information Management System</p>
            </div>
          </div>

          <div className="topbar-right">
            <label className="search-box">
              <Search size={18} />
              <input type="search" placeholder="Search..." />
            </label>

            <button className="notification-button" aria-label="Notifications">
              <Bell size={20} />
              <span className="notification-dot" />
            </button>

            <button className="account-button">
              <div className="avatar">A</div>
              <span>Admin</span>
              <ChevronDown size={16} />
            </button>
          </div>
        </header>

        <section className="page-content">
          <div className="welcome-section">
            <div>
              <h2>Welcome to UIMS Admin</h2>
              <p>
                Manage students, organisations, applications and placements
                from one place.
              </p>
            </div>
            <span className="status-label">
              <span className="status-dot" />
              System ready
            </span>
          </div>

          {activePage === "Dashboard" ? (
            <>
              <div className="stats-grid">
                <StatCard
                  title="Total Students"
                  value="—"
                  icon={Users}
                  color="purple"
                  description="Awaiting database connection"
                />
                <StatCard
                  title="Organisations"
                  value="—"
                  icon={Building2}
                  color="blue"
                  description="Awaiting database connection"
                />
                <StatCard
                  title="Applications"
                  value="—"
                  icon={FileText}
                  color="orange"
                  description="Awaiting database connection"
                />
                <StatCard
                  title="Placements"
                  value="—"
                  icon={BriefcaseBusiness}
                  color="green"
                  description="Awaiting database connection"
                />
              </div>

              <div className="content-grid">
                <section className="panel overview-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>System Overview</h3>
                      <p>Your administration workspace</p>
                    </div>
                    <span className="panel-icon">
                      <BarChart3 size={20} />
                    </span>
                  </div>

                  <div className="empty-state">
                    <div className="empty-icon">
                      <LayoutDashboard size={27} />
                    </div>
                    <h4>No data available yet</h4>
                    <p>
                      Connect the backend and database to display your
                      university records here.
                    </p>
                  </div>
                </section>

                <section className="panel quick-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Quick Access</h3>
                      <p>Navigate to a section</p>
                    </div>
                  </div>

                  <div className="quick-links">
                    {navigation.slice(1, 5).map((item) => {
                      const Icon = item.icon;

                      return (
                        <button
                          key={item.label}
                          className="quick-link"
                          onClick={() => setActivePage(item.label)}
                        >
                          <span className="quick-link-icon">
                            <Icon size={19} />
                          </span>
                          <span>{item.label}</span>
                          <span className="quick-arrow">→</span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              </div>
            </>
          ) : (
            <section className="panel section-placeholder">
              <div className="empty-icon">
                {(() => {
                  const item = navigation.find(
                    (entry) => entry.label === activePage
                  );
                  const Icon = item ? item.icon : FileText;
                  return <Icon size={30} />;
                })()}
              </div>
              <h3>{activePage}</h3>
              <p>
                This section is ready for development. Its records and
                functions will be connected to the backend later.
              </p>
              <button
                className="primary-button"
                onClick={() => setActivePage("Dashboard")}
              >
                Return to Dashboard
              </button>
            </section>
          )}
          {activePage === "Dashboard" ? (
  <>
    {/* Keep your existing Dashboard content here */}
    <div className="stats-grid">
      <StatCard title="Total Students" value="—" icon={Users} color="purple" description="Awaiting database connection" />
      <StatCard title="Organisations" value="—" icon={Building2} color="blue" description="Awaiting database connection" />
      <StatCard title="Applications" value="—" icon={FileText} color="orange" description="Awaiting database connection" />
      <StatCard title="Placements" value="—" icon={BriefcaseBusiness} color="green" description="Awaiting database connection" />
    </div>
    <div className="content-grid">
      <section className="panel overview-panel">
        <div className="panel-heading">
          <div>
            <h3>System Overview</h3>
            <p>Your administration workspace</p>
          </div>
          <span className="panel-icon"><BarChart3 size={20} /></span>
        </div>
        <div className="empty-state">
          <div className="empty-icon"><LayoutDashboard size={27} /></div>
          <h4>No data available yet</h4>
          <p>Connect the backend and database to display your university records here.</p>
        </div>
      </section>
      <section className="panel quick-panel">
        <div className="panel-heading">
          <div>
            <h3>Quick Access</h3>
            <p>Navigate to a section</p>
          </div>
        </div>
        <div className="quick-links">
          {navigation.slice(1, 5).map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.label} className="quick-link" onClick={() => setActivePage(item.label)}>
                <span className="quick-link-icon"><Icon size={19} /></span>
                <span>{item.label}</span>
                <span className="quick-arrow">→</span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  </>
) : activePage === "Students" ? (
  <Students />
) : activePage === "Organisations" ? (
  <Organisations />
) : activePage === "Applications" ? (
  <Applications />
) : activePage === "Placements" ? (
  <Placements />
  ) : activePage === "Grades" ? (
  <Grades />
) : (

  <section className="panel section-placeholder">
    <h3>{activePage}</h3>
    <p>This section is ready for development. Its records and functions will be connected to the backend later.</p>
    <button className="primary-button" onClick={() => setActivePage("Dashboard")}>Return to Dashboard</button>
  </section>
)}

          <footer className="page-footer">
            <span>UIMS Admin Portal</span>
            <span>Database connection pending</span>
          </footer>
        </section>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, description }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${color}`}>
        <Icon size={22} strokeWidth={1.8} />
      </div>
      <p className="stat-title">{title}</p>
      <h3 className="stat-value">{value}</h3>
      <p className="stat-description">{description}</p>
    </article>
  );
}

export default App;
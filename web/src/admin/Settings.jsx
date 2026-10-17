
import { useState } from "react";
import { Save, RotateCcw, Settings as SettingsIcon } from "lucide-react";
import toast from "react-hot-toast";

const defaultSettings = {
  courseworkWeight: 60,
  finalWeight: 40,
};

export default function Settings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [savedSettings, setSavedSettings] = useState(defaultSettings);

  const total =
    Number(settings.courseworkWeight) + Number(settings.finalWeight);

  function updateSetting(name, value) {
    setSettings((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function saveSettings() {
    if (
      settings.courseworkWeight === "" ||
      settings.finalWeight === "" ||
      Number(settings.courseworkWeight) < 0 ||
      Number(settings.finalWeight) < 0 ||
      total !== 100
    ) {
      toast.error("The two grading weights must add up to 100%.");
      return;
    }

    setSavedSettings({ ...settings });
    toast.success(
      "Settings saved for this session. Backend persistence is not connected."
    );
  }

  function discardChanges() {
    setSettings({ ...savedSettings });
    toast("Unsaved changes discarded.");
  }

  return (
    <div className="settings-page">
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h3>System Settings</h3>
            <p>Configure grading preferences for UIMS.</p>
          </div>
          <span className="panel-icon">
            <SettingsIcon size={21} />
          </span>
        </div>

        <div className="settings-notice">
          Changes are held in the current browser session. Permanent saving
          requires a backend connection.
        </div>

        <section className="settings-section">
          <h3>Grading Configuration</h3>
          <p>Set the percentage contribution of each assessment component.</p>

          <label className="setting-field">
            <span>Coursework weight (%)</span>
            <input
              type="number"
              min="0"
              max="100"
              value={settings.courseworkWeight}
              onChange={(event) =>
                updateSetting("courseworkWeight", event.target.value)
              }
            />
          </label>

          <label className="setting-field">
            <span>Final assessment weight (%)</span>
            <input
              type="number"
              min="0"
              max="100"
              value={settings.finalWeight}
              onChange={(event) =>
                updateSetting("finalWeight", event.target.value)
              }
            />
          </label>

          <div className={`weight-total ${total === 100 ? "valid" : "invalid"}`}>
            <span>Total weighting</span>
            <strong>{total}%</strong>
            <small>
              {total === 100
                ? "Valid: weights add up to 100%."
                : "The weights must add up to 100%."}
            </small>
          </div>
        </section>

        <div className="settings-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={discardChanges}
          >
            <RotateCcw size={17} />
            Discard Changes
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={saveSettings}
          >
            <Save size={17} />
            Save Settings
          </button>
        </div>
      </section>
    </div>
  );
}

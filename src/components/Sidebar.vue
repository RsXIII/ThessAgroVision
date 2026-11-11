
<template>
  <aside class="sidebar">
    <div class="logo">
      <h2>AgroVision</h2>
      <span>Smart Agriculture</span>
    </div>

    <nav class="navigation">
      <p class="menu-title">{{ t.mainMenu }}</p>

      <router-link to="/" class="nav-link">
        {{ t.dashboard }}
      </router-link>

      <router-link to="/fields" class="nav-link">
        {{ t.fields }}
      </router-link>

      <router-link to="/weather" class="nav-link">
        {{ t.weather }}
      </router-link>

      <router-link to="/crops" class="nav-link">
        {{ t.crops }}
      </router-link>

      <router-link to="/irrigation" class="nav-link">
        {{ t.irrigation }}
      </router-link>

      <router-link to="/analytics" class="nav-link">
        {{ t.analytics }}
      </router-link>

      <p class="menu-title">{{ t.system }}</p>

      <router-link to="/settings" class="nav-link">
        {{ t.settings }}
      </router-link>
    </nav>
  </aside>
</template>

<script>
import { getSettings } from '../services/settingsService'

export default {
  name: 'Sidebar',

  data() {
    return {
      language: getSettings().language || 'en',
    }
  },

  computed: {
    t() {
      const translations = {
        en: {
          mainMenu: 'MAIN MENU',
          dashboard: 'Dashboard',
          fields: 'Fields',
          weather: 'Weather',
          crops: 'Crops',
          irrigation: 'Irrigation',
          analytics: 'Analytics',
          system: 'SYSTEM',
          settings: 'Settings',
        },

        el: {
          mainMenu: 'ΚΥΡΙΟ ΜΕΝΟΥ',
          dashboard: 'Αρχική',
          fields: 'Αγροτεμάχια',
          weather: 'Καιρός',
          crops: 'Καλλιέργειες',
          irrigation: 'Άρδευση',
          analytics: 'Αναλύσεις',
          system: 'ΣΥΣΤΗΜΑ',
          settings: 'Ρυθμίσεις',
        },
      }

      return translations[this.language] || translations.en
    },
  },

  mounted() {
    window.addEventListener('focus', this.refreshLanguage)
    window.addEventListener('storage', this.refreshLanguage)
    window.addEventListener(
      'agrovision-settings-updated',
      this.refreshLanguage
    )
  },

  beforeUnmount() {
    window.removeEventListener('focus', this.refreshLanguage)
    window.removeEventListener('storage', this.refreshLanguage)
    window.removeEventListener(
      'agrovision-settings-updated',
      this.refreshLanguage
    )
  },

  methods: {
    refreshLanguage() {
      this.language = getSettings().language || 'en'
    },
  },
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  min-height: 100vh;
  background-color: #183b2b;
  color: white;
  padding: 25px 18px;
  box-sizing: border-box;
}

.logo {
  margin-bottom: 45px;
}

.logo h2 {
  font-size: 23px;
  margin: 0;
}

.logo span {
  display: block;
  font-size: 12px;
  color: #b5c9bc;
  margin-top: 6px;
}

.menu-title {
  font-size: 11px;
  color: #a5b9aa;
  margin: 25px 0 12px;
  letter-spacing: 1px;
}

.nav-link {
  display: block;
  color: #dce8df;
  text-decoration: none;
  padding: 12px;
  margin-bottom: 5px;
  border-radius: 6px;
  font-size: 14px;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: #28543e;
  color: white;
}

.nav-link.router-link-exact-active {
  background-color: #36734f;
  color: white;
}
</style>

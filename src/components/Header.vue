<template>
  <header class="header">
    <div class="page-title">
      <h1>Dashboard</h1>
      <p>Welcome back to AgroVision</p>
    </div>

    <div class="header-actions">
      <div class="search-box">
        <input
          type="text"
          placeholder="Search..."
          aria-label="Search"
        />
      </div>

      <button class="notification-button" type="button">
        Notifications
        <span class="notification-dot"></span>
      </button>

      <div class="user-profile">
        <div class="user-avatar">A</div>
        <div class="user-info">
          <span class="user-name">Administrator</span>
          <span class="user-role">Farm Manager</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
}
</script>

<style scoped>
.header {
  height: 85px;
  padding: 0 30px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e9e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

.page-title h1 {
  font-size: 22px;
  color: #183b2b;
  margin: 0;
}

.page-title p {
  font-size: 12px;
  color: #84918a;
  margin: 5px 0 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 25px;
}

.search-box input {
  width: 190px;
  padding: 10px 12px;
  border: 1px solid #e1e7e2;
  border-radius: 6px;
  outline: none;
}

.search-box input:focus {
  border-color: #36734f;
}

.notification-button {
  position: relative;
  border: none;
  background: none;
  color: #526158;
  cursor: pointer;
  font-size: 13px;
}

.notification-dot {
  position: absolute;
  top: -4px;
  right: -7px;
  width: 7px;
  height: 7px;
  background-color: #e69b36;
  border-radius: 50%;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 38px;
  height: 38px;
  background-color: #36734f;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-name {
  font-size: 13px;
  font-weight: 600;
  color: #263b2e;
}

.user-role {
  font-size: 11px;
  color: #84918a;
}
</style>
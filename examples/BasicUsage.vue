<template>
  <div class="example-container">
    <h1>Permissions Examples</h1>
    
    <!-- Пример использования компонента Check -->
    <div class="example-block">
      <h2>Using Check Component</h2>
      
      <Check action="view_dashboard">
        <div class="dashboard-panel">
          <h3>Dashboard Content</h3>
          <p>This content is only visible for users with 'view_dashboard' permission</p>
        </div>
        
        <template #fallback>
          <div class="no-permission">
            <p>You don't have permission to view the dashboard</p>
          </div>
        </template>
        
        <template #loading>
          <div class="loading">
            <p>Loading permissions...</p>
          </div>
        </template>
      </Check>
    </div>
    
    <!-- Пример использования директивы v-can -->
    <div class="example-block">
      <h2>Using v-can Directive</h2>
      
      <button v-can="'edit_user'" class="action-button">
        Edit User
      </button>
      
      <button v-can="'delete_user'" class="action-button danger">
        Delete User
      </button>
    </div>
    
    <!-- Пример использования composable usePermissions -->
    <div class="example-block">
      <h2>Using usePermissions Composable</h2>
      
      <div class="permission-status">
        <p>Can create project: <span :class="canCreateProject ? 'allowed' : 'denied'">{{ canCreateProject ? 'Yes' : 'No' }}</span></p>
        <p>Is loading: {{ isLoadingPermission ? 'Yes' : 'No' }}</p>
        <button @click="checkPermissionManually" class="action-button">
          Check Again
        </button>
      </div>
      
      <div v-if="canCreateProject" class="action-panel">
        <button class="action-button primary">Create New Project</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check, usePermissions } from 'locator-ars-lib'

// Использование composable
const { can: canCreateProject, isLoading: isLoadingPermission, check: checkPermissionManually } = usePermissions('create_project')
</script>

<style scoped>
.example-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.example-block {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 5px;
}

.dashboard-panel {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
}

.action-button {
  padding: 8px 16px;
  margin-right: 10px;
  border: none;
  border-radius: 4px;
  background-color: #4a90e2;
  color: white;
  cursor: pointer;
}

.action-button.danger {
  background-color: #e25c4a;
}

.action-button.primary {
  background-color: #42b983;
}

.permission-status {
  margin-bottom: 15px;
}

.allowed {
  color: #42b983;
  font-weight: bold;
}

.denied {
  color: #e25c4a;
  font-weight: bold;
}

.no-permission {
  padding: 15px;
  background-color: #ffeeee;
  border-left: 4px solid #e25c4a;
}

.loading {
  padding: 15px;
  background-color: #eeeeff;
  border-left: 4px solid #4a90e2;
}
</style> 
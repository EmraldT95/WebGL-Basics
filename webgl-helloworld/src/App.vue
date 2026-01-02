<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="wrapper">
    <div class="menu-container">
      <div class="header">
        <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="50" height="50" />
        <img alt="WebGL logo" class="logo" src="@/assets/logo.svg" width="50" height="50" />
      </div>
      <nav class="menu">
        <RouterLink to="/">Triangle</RouterLink>
        <RouterLink to="/rectangles">Rectangles</RouterLink>
      </nav>
    </div>
    <div class="contents">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  height: 90vh;
  display: grid;
  grid-template-areas: 'menu columns';
  grid-template-columns: 20rem auto;
  gap: 1rem;

  & .header {
    display: flex;
    width: 100%;
    justify-content: center;

    & .logo {
      display: block;
      margin: 1rem;
    }
  }

  & > .menu-container {
    background-color: var(--color-background-mute);
    box-shadow: 0 0 30px -5px var(--color-green);

    & > .menu {
      display: flex;
      flex-direction: column;
      justify-content: center;

      & > a {
        padding: 0.5rem;
        padding-left: 1rem;
        position: relative;

        &:hover {
          background-color: var(--color-green-hover);
          transition: background-color ease-in 100ms;
        }

        &.router-link-exact-active::before {
          content: '';
          display: block;
          width: 5px;
          height: 100%;
          background-color: var(--color-green);
          position: absolute;
          left: 0;
          top: 0;
        }
      }
    }
  }

  & > .contents {
    width: 100%;
    height: 100%;
  }
}
</style>

<template>
  <!-- Login Form -->
  <div
    class="text-white text-center font-bold p-4 mb-4"
    v-if="login_show_alert"
    :class="login_alert_variant"
  >
    {{ login_alert_msg }}
  </div>
  <vee-form :validation-schema="loginSchema" @submit="login">
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field
        as="input"
        name="email"
        type="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <error-message class="text-red-600" name="email" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field
        as="input"
        name="password"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password"
      />
      <error-message class="text-red-600" name="password" />
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :disabled="login_in_submission"
    >
      Submit
    </button>
  </vee-form>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import useUserStore from '@/stores/user';

const props = defineProps(['closeModal']);

const loginSchema = {
  email: 'required|email',
  password: 'required|min:9|max:100',
};
const login_in_submission = ref(false);
const login_show_alert = ref(false);
const login_alert_variant = ref('bg-blue-500');
const login_alert_msg = ref('Please wait! We are logging you in.');

const userStore = useUserStore();

const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  login_show_alert.value = true;
  login_in_submission.value = true;
  login_alert_variant.value = 'bg-blue-500';
  login_alert_msg.value = 'Please wait! We are logging you in.';
  try {
    userStore.login({ email, password });
    login_alert_variant.value = 'bg-green-500';
    login_alert_msg.value = 'Success! Your account have been logged in.';
    setTimeout(() => {
      props.closeModal();
    }, 1000);
  } catch (e: any) {
    login_in_submission.value = false;
    login_alert_variant.value = 'bg-red-500';
    login_alert_msg.value =
      e.message || 'An unexpected error occured. Please try again later.';
  }
};
</script>

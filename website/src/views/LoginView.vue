<template>
	<main class="login">
		<section class="artSection">
			<img src="../assets/bgArt.jpg" alt="background art" />
		</section>
		<section class="formSection">
			<div class="headings">
				<h1>Welcome to GEweb!</h1>
				<h4>LOGIN TO YOUR ACCOUNT</h4>
			</div>
			<img src="../assets/GElogo.jpg" alt="GEweb logo" class="geLogo" />
			<form @submit.prevent="loginUser()">
				<div class="inputContainer">
					<label for="email">EMAIl ADRESS</label>
					<input type="email" name="email" v-model="data.email" placeholder="Enter your email..." />
				</div>
				<div class="inputContainer password">
					<label for="password">PASSWORD</label>
                    <div class="inputWrapper">
                        <input v-if="data.showPassword" type="text" name="password" v-model="data.password" placeholder="Enter your password..." />
                        <input v-else type="password" name="password" v-model="data.password" placeholder="Enter your password..." />
                        <div @click="data.showPassword = !data.showPassword" class="showHide">
                            <svg width="30" height="25" viewBox="0 0 30 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 3C5 3 1 12 1 12C1 12 5 21 15 21C25 21 29 12 29 12C29 12 25 3 15 3Z" stroke="#a8a8a8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path
                                    d="M15 17C17.7614 17 20 14.7614 20 12C20 9.23858 17.7614 7 15 7C12.2386 7 10 9.23858 10 12C10 14.7614 12.2386 17 15 17Z"
                                    stroke="#a8a8a8"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path :class="{showPassword: data.showPassword}" d="M3 1L26.5572 23.6149" stroke="#a8a8a8" stroke-width="2" stroke-linecap="round" />
                            </svg>
                        </div>
                    </div>
				</div>
				<button class="submit" type="submit">LOGIN</button>
			</form>
			<div class="bottomLink">
				<p>Don't have an account?</p>
				<router-link to="/register" class="register-login-link">Create one here</router-link>
			</div>
		</section>
	</main>
</template>

<script>
import { onBeforeMount, reactive } from 'vue';
import app from '../firebase/init';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';

export default {
	setup() {
		const auth = getAuth(app);
		const router = useRouter();
		const data = reactive({
			email: '',
			password: '',
            showPassword: false
		});

		function loginUser() {
			signInWithEmailAndPassword(auth, data.email, data.password)
				.then(() => {
					router.push('/');
				})
				.catch((error) => {
					alert(error);
				});
		}

		onBeforeMount(() => {
			onAuthStateChanged(auth, (user) => {
				if (user) {
					router.push('/')
					// console.log(user);
				}
			});
		});
		return {
			data,
			loginUser,
		};
	},
};
</script>

<style lang="scss" scoped>
@import '../css/login-register/style.scss';
</style>

<template>
	<main class="register">
		<section class="artSection">
			<img src="../assets/bgArt.jpg" alt="background art" />
		</section>
		<section class="formSection">
			<div class="headings">
				<h1>Welcome to GEweb!</h1>
				<h4>CREATE AN ACCOUNT</h4>
			</div>
			<img src="../assets/GElogo.jpg" alt="GEweb logo" class="geLogo" />
			<form @submit.prevent="createUser()">
				<div class="inputContainer">
					<label for="email">EMAIl ADRESS</label>
					<input type="email" name="email" v-model="data.username" placeholder="Enter your email..." />
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
								<path :class="{ showPassword: data.showPassword }" d="M3 1L26.5572 23.6149" stroke="#a8a8a8" stroke-width="2" stroke-linecap="round" />
							</svg>
						</div>
					</div>
				</div>
				<div class="inputContainer password">
					<label for="password">PASSWORD</label>
					<div class="inputWrapper">
						<input v-if="data.showPasswordCheck" type="text" name="password" v-model="data.passwordCheck" placeholder="Enter your password..." />
						<input v-else type="password" name="password" v-model="data.passwordCheck" placeholder="Enter your password..." />
						<div @click="data.showPasswordCheck = !data.showPasswordCheck" class="showHide">
							<svg width="30" height="25" viewBox="0 0 30 25" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M15 3C5 3 1 12 1 12C1 12 5 21 15 21C25 21 29 12 29 12C29 12 25 3 15 3Z" stroke="#a8a8a8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
								<path
									d="M15 17C17.7614 17 20 14.7614 20 12C20 9.23858 17.7614 7 15 7C12.2386 7 10 9.23858 10 12C10 14.7614 12.2386 17 15 17Z"
									stroke="#a8a8a8"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<path :class="{ showPassword: data.showPasswordCheck }" d="M3 1L26.5572 23.6149" stroke="#a8a8a8" stroke-width="2" stroke-linecap="round" />
							</svg>
						</div>
					</div>
				</div>
				<button class="submit" type="submit">REGISTER</button>
			</form>
			<div class="bottomLink">
				<p>Don't have an account?</p>
				<router-link to="/login" class="register-login-link">Create one here</router-link>
			</div>
		</section>
	</main>
</template>

<script>
import { reactive } from 'vue';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import app from '../firebase/init';
import { useRouter } from 'vue-router';

export default {
	setup() {
		const auth = getAuth();
		const router = useRouter();
		const db = getFirestore(app);

		const userAvatars = [
			'https://firebasestorage.googleapis.com/v0/b/database-test-bd81a.appspot.com/o/GroupBlue.jpg?alt=media&token=6fae7580-2cdd-46ce-a8e2-2cf1ef6de402',
			'https://firebasestorage.googleapis.com/v0/b/database-test-bd81a.appspot.com/o/GroupGreeb.jpg?alt=media&token=ea275913-825a-456f-b598-0e6ac882d2f3',
			'https://firebasestorage.googleapis.com/v0/b/database-test-bd81a.appspot.com/o/GroupPink.jpg?alt=media&token=8d6bb72d-036c-421d-8d94-bb60fb150669',
			'https://firebasestorage.googleapis.com/v0/b/database-test-bd81a.appspot.com/o/GroupPurple.jpg?alt=media&token=9cc558cd-5d06-4b42-985a-560c2d07f88c',
			'https://firebasestorage.googleapis.com/v0/b/database-test-bd81a.appspot.com/o/GroupRed.jpg?alt=media&token=12fecc62-abc4-4112-a388-f3963f190d38',
			'https://firebasestorage.googleapis.com/v0/b/database-test-bd81a.appspot.com/o/GroupYellow.jpg?alt=media&token=7e5c61d1-7830-4459-9998-d809c62fa54f',
		];

		const data = reactive({
			username: '',
			password: '',
			passwordCheck: '',
			showPassword: false,
			showPasswordCheck: false,
		});

		function createUser() {
			if (data.password != data.passwordCheck) return;
			createUserWithEmailAndPassword(auth, data.username, data.password)
				.then((userCredential) => {
					async function addUser() {
						const avatar = userAvatars[Math.floor(Math.random() * 5)]
						await setDoc(doc(db, 'users', userCredential.user.uid), {
							userInfo: {
								uid: userCredential.user.uid,
								email: userCredential.user.email,
								userAvatar: avatar
							},
							posts: [],
							follows: []
						}).then(() => {
							router.push('/')
						});
					}
					addUser()
				})
				.catch((error) => {
					alert(error);
				});
		}

		return {
			data,
			createUser,
		};
	},
};
</script>

<style lang="scss" scoped>
@import '../css/login-register/style.scss';
</style>

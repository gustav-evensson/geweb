<template>
	<div class="sideBar">
		<section class="topSection">
			<img src="../assets/GElogo.jpg" alt="user avatar" />
			<p v-if="data.user">{{ data.user.email }}</p>
			<div class="navButtons">
				<router-link to="/" class="navButton"><img src="../assets/House.png" alt="" /></router-link>
				<router-link to="/follow" class="navButton"><img src="../assets/UsersThree.png" alt="" /></router-link>
				<router-link to="/yourposts" class="navButton"><img src="../assets/User.png" alt="" /></router-link>
			</div>
			<button class="signOut" @click="signOutUser">Sign Out</button>
		</section>
		<section class="bottomSection">
			<textarea name="post" class="postText" v-model="data.postContent" placeholder="What's poppin..." maxlength="140"> </textarea>
			<button @click="$emit('postEvent', data.postContent); data.postContent = '';">POST!</button>
			<p class="letterCounter">{{ data.postContent.length }}/140</p>
		</section>
	</div>
</template>

<script>
import { reactive } from '@vue/reactivity';
import { onBeforeMount } from '@vue/runtime-core';
import { onAuthStateChanged, getAuth, signOut } from '@firebase/auth';
import app from '../firebase/init';
import { useRouter } from 'vue-router';

export default {
	emits: ['postEvent'],
	setup(props, { emit }) {
		// emit('postEvent')

		const auth = getAuth(app);
		const router = useRouter()
		const data = reactive({
			postContent: '',
			user: null,
		});

		onBeforeMount(() => {
			onAuthStateChanged(auth, (user) => {
				if (user) {
					data.user = user;
				}
			});
		});

		function signOutUser(){
			signOut(auth).then(() => {
				router.push('/login')
			}).catch((error) => {
				alert(error)
			})
		}
		return {
			data,
			emit,
			signOutUser
		};
	},
};
</script>

<style lang="scss" scoped>
@import '../css/sideBar/style.scss';
</style>

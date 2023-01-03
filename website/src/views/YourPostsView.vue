<template>
	<div class="yourPosts fullPageContainer">
		<SideBar />
		<main class="mainContainer">
			<h1>Your Posts</h1>
			<div class="list">
				<PostComp v-for="post in data.posts" :key="post.uid" :postData="post"/>
			</div>
		</main>
	</div>
</template>

<script>
import SideBar from '@/components/SideBar.vue';
import PostComp from '@/components/PostComp.vue';
import { reactive } from '@vue/reactivity';
import { onMounted } from '@vue/runtime-core';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { getFirestore, getDoc, doc } from "firebase/firestore";
import app from '../firebase/init'

export default {
	components: {
		SideBar,
		PostComp,
	},
	setup() {
		const db = getFirestore(app);
		const auth = getAuth(app)
		const data = reactive({
			posts: [],
			currentUser: null
		});


		async function getPosts() {
			data.posts = [];
			await data.currentUser
			const docRef = doc(db, 'users', data.currentUser.uid)
			const querySnapshot = await getDoc(docRef);
			console.log(querySnapshot.data())
			querySnapshot.data().posts.forEach((post) => {
				data.posts.push(post)
			})
		}

		onMounted(() => {
			onAuthStateChanged(auth, (user) => {
				if(user){
					data.currentUser = user
				}
			})
			getPosts()
		})

		return {
			data,
		};
	},
};
</script>

<style lang="scss" scoped>
@import '../css/yourPosts/style.scss';
</style>

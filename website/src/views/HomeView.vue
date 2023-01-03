<template>
	<div class="home fullPageContainer">
		<SideBar @post-event="addPost" />
		<main v-if="data.currentUserInfo" class="mainContainer">
			<h1>Home</h1>
			<div class="list">
				<PostComp v-for="(post, index) in sortedPosts" :key="index" :postData="post" />
			</div>
		</main>
	</div>
</template>

<script>
import { getFirestore, collection, doc, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';
import app from '../firebase/init';
import moment from 'moment';
import SideBar from '@/components/SideBar.vue';
import PostComp from '@/components/PostComp.vue';
import { reactive } from '@vue/reactivity';
import { computed, onMounted } from '@vue/runtime-core';
import { getAuth, onAuthStateChanged } from '@firebase/auth';

export default {
	components: {
		SideBar,
		PostComp,
	},
	setup() {
		const auth = getAuth(app);
		const db = getFirestore(app);
		const data = reactive({
			posts: [],
			currentUser: null,
			currentUserInfo: null,
		});

		onMounted(() => {
			onAuthStateChanged(auth, (user) => {
				if (user) {
					data.currentUser = user;
				}
			});
			getPosts();
		});

		async function getPosts() {
			data.posts = [];
			const querySnapshot = await getDocs(collection(db, 'users'));
			querySnapshot.forEach((doc) => {
				if (data.currentUser.uid == doc.data().userInfo.uid) {
					data.currentUserInfo = doc.data();
				}
				doc.data().posts.forEach((post) => {
					if (doc.data().follows.includes(post.uid)) data.posts.push(post);
				});
			});
			querySnapshot.forEach((doc) => {
				if (data.currentUserInfo.follows.includes(doc.data().userInfo.uid) || data.currentUserInfo.userInfo.uid == doc.data().userInfo.uid) {
					doc.data().posts.forEach((post) => {
						data.posts.push(post);
					});
				}
			});
		}

		async function addPost(content) {
			let date = moment().format('MMMM Do YYYY, h:mm:ss');
			console.log(date); // 2022-06-17T11:06:50.369Z
			const userPostInfo = data.currentUserInfo.userInfo;
			try {
				await updateDoc(doc(db, 'users', userPostInfo.uid), {
					posts: arrayUnion({
						email: userPostInfo.email,
						postContent: content,
						userAvatar: userPostInfo.userAvatar,
						date: moment().format('MMMM Do YYYY, h:mm:ss'),
						queryDate: moment().format(),
					}),
				});
				console.log('Document written with ID: ', userPostInfo.uid);
				getPosts();
			} catch (e) {
				console.error('Error adding document: ', e);
			}
		}

		return {
			SideBar,
			PostComp,
			data,
			addPost,
			getPosts,
			sortedPosts: computed(() => {
				let sortArray = [];
				data.posts.forEach((post) => {
					if (sortArray.length > 0) {
						let index = 0;
						for (let i = 0; i in sortArray; i++) {
							if (moment(post.queryDate).isAfter(sortArray[i].queryDate)) {
								index++;
							}
						}
						sortArray.splice(index, 0, post);
					} else {
						sortArray.push(post);
					}
				});
				return sortArray.reverse();
			}),
		};
	},
};
</script>

<style lang="scss" scoped>
@import '../css/home/style.css';
</style>

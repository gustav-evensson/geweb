<template>
	<div class="home fullPageContainer">
		<SideBar />
		<main class="mainContainer">
			<h1>People to follow</h1>
			<div v-if="data.users != []" class="list">
				<div v-for="user in data.users" :key="user.userInfo.uid" class="listItem follow">
					<div class="user">
						<img :src="user.userInfo.userAvatar" alt="" />
						<p>{{ user.userInfo.email }}</p>
					</div>
					<button class="unfollow" v-if="data.currentUserInfo.follows.includes(user.userInfo.uid)" @click="unfollowUser(user)">Unfollow</button>
					<button class="follow" v-else @click="followUser(user)">Follow</button>
				</div>
			</div>
		</main>
	</div>
</template>

<script>
import SideBar from '../components/SideBar.vue';
import { getFirestore, collection, getDocs, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import app from '../firebase/init';
import { onMounted, reactive } from '@vue/runtime-core';

export default {
	components: {
		SideBar,
	},
	setup() {
		const db = getFirestore(app);
		const auth = getAuth(app)
		const data = reactive({
			users: [],
			currentUser: null,
			currentUserInfo: null
		});

		async function getUsers() {
			const querySnapshot = await getDocs(collection(db, 'users'));
			querySnapshot.forEach((doc) => {
				if(data.currentUser.uid != doc.data().userInfo.uid){
					data.users.push(doc.data())
				}
				else{
					data.currentUserInfo = doc.data()
				}
			});
		}

		async function followUser(user){
			try {
				await updateDoc(doc(db, 'users', data.currentUser.uid), {
					follows: arrayUnion(user.userInfo.uid)
				});
				console.log('Document updated with ID: ', data.currentUser.uid);
				data.users = []
				getUsers()
			} catch (e) {
				console.error('Error adding document: ', e);
			}
		}
		async function unfollowUser(user){
			try {
				await updateDoc(doc(db, 'users', data.currentUser.uid), {
					follows: arrayRemove(user.userInfo.uid)
				});
				console.log('Document updated with ID: ', data.currentUser.uid);
				data.users = []
				getUsers()
			} catch (e) {
				console.error('Error adding document: ', e);
			} 
		}

		onMounted(() => {
			onAuthStateChanged(auth, (user) => {
				if(user){
					data.currentUser = user
				}
			})
			getUsers();
		});

		return {
			data,
			followUser,
			unfollowUser
		};
	},
};
</script>

<style lang="scss" scoped>
@import '../css/home/style.scss';
</style>

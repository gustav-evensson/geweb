<template>
	<div class="postComp">
		<div class="user">
			<img :src="postData.userAvatar" alt="user avatar" />
			<p>{{postData.email}}</p>
		</div>
		<p class="postContent">{{ postData.postContent }}</p>
		<p>{{ postData.date }}</p>
	</div>
</template>

<script>
export default {
	props: ['postData'],
	setup() {
		return {
		};
	},
};
</script>

<style lang="scss" scoped>
@import '../css/post/style.scss';
</style>

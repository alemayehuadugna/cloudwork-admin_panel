<template>
	<detail />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Detail from "./components/detail.vue";

@Component({
	name: "ViewDetail",
	components: {
		Detail,
	},
})
export default class extends Vue {

}
</script>

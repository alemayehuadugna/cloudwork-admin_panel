<template>
	<a v-if="isExternal(to)" :href="to" target="_blank" rel="noopener">
		<slot />
	</a>
	<router-link v-else :to="to">
		<slot />
	</router-link>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { isExternal } from "@/_core/utils/validate";

@Component({
	name: "SidebarItemLink",
})
export default class extends Vue {
	@Prop({ required: true }) public to!: string;

	public isExternal = isExternal;
}
</script>

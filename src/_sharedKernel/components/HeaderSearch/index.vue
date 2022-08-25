<template>
	<div id="header-search" :class="{ show: show }" class="header-search">
		<svg-icon class="search-icon" name="search" @click.stop="click" />
		<el-select
			ref="headerSearchSelect"
			v-model="search"
			:remote-method="querySearch"
			filterable
			default-first-option
			remote
			placeholder="Search"
			class="header-search-select"
			@change="change"
		>
			<!-- <el-option
				v-for="item in options"
				:key="item.path"
				:value="item"
				:label="item.meta.title.join(' > ')"
			/> -->
		</el-select>
	</div>
</template>

<script lang="ts">
import path from "path";
import Fuse from "fuse.js"; // A lightweight fuzzy-search module
import { Component, Vue, Watch } from "vue-property-decorator";
import { RouteConfig } from "vue-router";
import { PermissionModule } from "@/_sharedKernel/store/modules/permission";

@Component({
	name: "HeaderSearch",
})
export default class extends Vue {
	public search = "";
	public show = false;
	public options: RouteConfig[] = [];
	public searchPool: RouteConfig[] = [];
	public fuse?: Fuse<RouteConfig>;

	get routes() {
		return PermissionModule.routes;
	}

	@Watch("lang")
	public onLangChange() {
		this.searchPool = this.generateRoutes(this.routes);
	}

	@Watch("routes")
	public onRoutesChange() {
		this.searchPool = this.generateRoutes(this.routes);
	}

	@Watch("searchPool")
	public onSearchPoolChange(value: RouteConfig[]) {
		this.initFuse(value);
	}

	@Watch("show")
	public onShowChange(value: boolean) {
		if (value) {
			document.body.addEventListener("click", this.close);
		} else {
			document.body.removeEventListener("click", this.close);
		}
	}

	mounted() {
		this.searchPool = this.generateRoutes(this.routes);
	}

	public click() {
		this.show = !this.show;
		if (this.show) {
			this.$refs.headerSearchSelect &&
				(this.$refs.headerSearchSelect as HTMLElement).focus();
		}
	}

	public close() {
		this.$refs.headerSearchSelect &&
			(this.$refs.headerSearchSelect as HTMLElement).blur();
		this.options = [];
		this.show = false;
	}

	public change(route: RouteConfig) {
		this.$router.push(route.path).catch((err) => {
			console.warn(err);
		});
		this.search = "";
		this.options = [];
		this.$nextTick(() => {
			this.show = false;
		});
	}

	public initFuse(list: RouteConfig[]) {
		this.fuse = new Fuse(list, {
			shouldSort: true,
			threshold: 0.4,
			location: 0,
			distance: 100,
			minMatchCharLength: 1,
			keys: [
				{
					name: "title",
					weight: 0.7,
				},
				{
					name: "path",
					weight: 0.3,
				},
			],
		});
	}

	// Filter out the routes that can be displayed in the sidebar
	// And generate the internationalized title
	public generateRoutes(
		routes: RouteConfig[],
		basePath = "/",
		prefixTitle: string[] = []
	) {
		let res: RouteConfig[] = [];

		for (const router of routes) {
			// skip hidden router
			if (router.meta && router.meta.hidden) {
				continue;
			}

			const data: RouteConfig = {
				path: path.resolve(basePath, router.path),
				meta: {
					title: [...prefixTitle],
				},
			};

			// recursive child routes
			if (router.children) {
				const tempRoutes = this.generateRoutes(
					router.children,
					data.path,
					data.meta!.title
				);
				if (tempRoutes.length >= 1) {
					res = [...res, ...tempRoutes];
				}
			}
		}
		return res;
	}

	public querySearch(query: string) {
		if (query !== "") {
			if (this.fuse) {
				this.options = this.fuse
					.search(query)
					.map((result) => result.item);
			}
		} else {
			this.options = [];
		}
	}
}
</script>

<style lang="scss" scoped>
.header-search {
	font-size: 0 !important;

	.search-icon {
		cursor: pointer;
		font-size: 18px;
		vertical-align: middle;
	}

	.header-search-select {
		font-size: 18px;
		transition: width 0.2s;
		width: 0;
		overflow: hidden;
		background: transparent;
		border-radius: 0;
		display: inline-block;
		vertical-align: middle;

		.el-input__inner {
			border-radius: 0;
			border: 0;
			padding-left: 0;
			padding-right: 0;
			box-shadow: none !important;
			border-bottom: 1px solid #d9d9d9;
			vertical-align: middle;
		}
	}

	&.show {
		.header-search-select {
			width: 210px;
			margin-left: 10px;
		}
	}
}
</style>
